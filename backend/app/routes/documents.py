from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import logging
from datetime import datetime, timedelta
from marshmallow import Schema, fields, ValidationError
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.models.document import Document
from app.services.ocr_service import OCRService
from app.services.ai_service import AIService
from app.services.storage_service import StorageService
from app import db
from flask_caching import Cache

# Configure logging
logger = logging.getLogger(__name__)

documents_bp = Blueprint('documents', __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# File validation constants
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg'
}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Request validation schema
class DocumentUploadSchema(Schema):
    file = fields.Raw(required=True)
    document_type = fields.Str(required=False, allow_none=True)
    description = fields.Str(required=False, allow_none=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_type(file):
    try:
        import magic
        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file.read(2048))
        file.seek(0)
        return file_type in ALLOWED_MIME_TYPES
    except Exception as e:
        logger.error(f"Error validating file type: {str(e)}")
        return False

# Error handlers
@documents_bp.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify({'error': 'Validation error', 'details': error.messages}), 400

@documents_bp.errorhandler(Exception)
def handle_error(error):
    logger.error(f"Unexpected error: {str(error)}", exc_info=True)
    return jsonify({'error': 'Internal server error', 'message': str(error)}), 500

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
@limiter.limit("5 per minute")
def upload_document():
    try:
        # Validate request data
        schema = DocumentUploadSchema()
        data = schema.load(request.form)
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
            
        if not validate_file_type(file):
            return jsonify({'error': 'Invalid file type'}), 400
            
        if file.content_length > MAX_FILE_SIZE:
            return jsonify({'error': 'File size exceeds limit'}), 400
            
        # Secure filename
        filename = secure_filename(file.filename)
        
        # Upload file to S3
        storage_service = StorageService()
        upload_result = storage_service.upload_file(file, get_jwt_identity())
        
        # Create document record
        document = Document(
            user_id=get_jwt_identity(),
            filename=upload_result['original_filename'],
            s3_key=upload_result['s3_key'],
            document_type=data.get('document_type', ''),
            description=data.get('description', ''),
            file_size=file.content_length,
            mime_type=file.content_type
        )
        
        document.save(db)
        
        # Log successful upload
        logger.info(f"Document uploaded successfully: {document.id}")
        
        return jsonify({
            'message': 'Document uploaded successfully',
            'document': {
                'id': str(document.id),
                'filename': document.filename,
                'document_type': document.document_type,
                'description': document.description,
                'created_at': document.created_at.isoformat(),
                'url': upload_result['url'],
                'file_size': document.file_size,
                'mime_type': document.mime_type
            }
        }), 201
        
    except ValidationError as e:
        logger.warning(f"Validation error during upload: {str(e)}")
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Upload failed',
            'message': str(e)
        }), 500

cache = Cache()

@documents_bp.route('/', methods=['GET'])
@jwt_required()
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_documents():
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        document_type = request.args.get('type')
        sort_by = request.args.get('sort_by', 'created_at')
        order = request.args.get('order', 'desc')
        
        # Get paginated documents
        documents = Document.find_by_user_id_paginated(
            db, 
            user_id,
            page=page,
            per_page=per_page,
            document_type=document_type,
            sort_by=sort_by,
            order=order
        )
        
        return jsonify({
            'documents': [{
                'id': str(doc.id),
                'filename': doc.filename,
                'document_type': doc.document_type,
                'description': doc.description,
                'created_at': doc.created_at.isoformat(),
                'verification_status': doc.verification_status,
                'url': doc.get_url(),
                'file_size': doc.file_size,
                'mime_type': doc.mime_type
            } for doc in documents.items],
            'pagination': {
                'total': documents.total,
                'pages': documents.pages,
                'current_page': documents.page,
                'has_next': documents.has_next,
                'has_prev': documents.has_prev,
                'next_page': documents.next_num if documents.has_next else None,
                'prev_page': documents.prev_num if documents.has_prev else None
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving documents: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to retrieve documents',
            'message': str(e)
        }), 500

@documents_bp.route('/<document_id>', methods=['GET'])
@jwt_required()
@cache.cached(timeout=300)
def get_document(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(db, document_id)
        
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        if str(document.user_id) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        return jsonify({
            'document': {
                'id': str(document.id),
                'filename': document.filename,
                'document_type': document.document_type,
                'description': document.description,
                'created_at': document.created_at.isoformat(),
                'verification_status': document.verification_status,
                'verification_results': document.verification_results,
                'url': document.get_url(),
                'metadata': document.get_metadata(),
                'file_size': document.file_size,
                'mime_type': document.mime_type
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving document {document_id}: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to retrieve document',
            'message': str(e)
        }), 500

@documents_bp.route('/<document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(db, document_id)
        
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        if str(document.user_id) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        # Delete document (this will also delete from S3)
        document.delete(db)
        
        # Clear cache
        cache.delete_memoized(get_document, document_id)
        cache.delete_memoized(get_documents)
        
        logger.info(f"Document deleted successfully: {document_id}")
        return jsonify({'message': 'Document deleted successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error deleting document {document_id}: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Delete failed',
            'message': str(e)
        }), 500

@documents_bp.route('/<document_id>/url', methods=['GET'])
@jwt_required()
def get_document_url(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(db, document_id)
        
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        if str(document.user_id) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        expires_in = request.args.get('expires_in', default=3600, type=int)
        download = request.args.get('download', default=False, type=bool)
        watermark = request.args.get('watermark', default=False, type=bool)
        
        url = document.get_url(
            expires_in=expires_in,
            download=download,
            watermark=watermark
        )
        
        if not url:
            return jsonify({'error': 'Failed to generate URL'}), 500
            
        return jsonify({
            'url': url,
            'expires_in': expires_in,
            'download': download,
            'watermark': watermark,
            'expires_at': (datetime.utcnow() + timedelta(seconds=expires_in)).isoformat()
        }), 200
        
    except Exception as e:
        logger.error(f"Error generating URL for document {document_id}: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to generate URL',
            'message': str(e)
        }), 500

# Add document sharing endpoint
@documents_bp.route('/<document_id>/share', methods=['POST'])
@jwt_required()
def share_document(document_id):
    try:
        user_id = get_jwt_identity()
        document = Document.find_by_id(db, document_id)
        
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        if str(document.user_id) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        share_data = request.json
        if not share_data or 'email' not in share_data:
            return jsonify({'error': 'Email is required'}), 400
            
        share_token = document.create_share_token(
            email=share_data['email'],
            expires_in=share_data.get('expires_in', 3600)
        )
        
        logger.info(f"Document {document_id} shared with {share_data['email']}")
        return jsonify({
            'share_token': share_token,
            'expires_in': share_data.get('expires_in', 3600),
            'email': share_data['email']
        }), 200
        
    except Exception as e:
        logger.error(f"Error sharing document {document_id}: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to share document',
            'message': str(e)
        }), 500 