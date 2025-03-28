from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from app.models.document import Document
from app.services.ocr_service import OCRService
from app.services.ai_service import AIService
from app.services.storage_service import StorageService
from app import db

documents_bp = Blueprint('documents', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
        
    if file.content_length > MAX_FILE_SIZE:
        return jsonify({'error': 'File size exceeds limit'}), 400
        
    try:
        # Upload file to S3
        storage_service = StorageService()
        upload_result = storage_service.upload_file(file, get_jwt_identity())
        
        # Create document record
        document = Document(
            user_id=get_jwt_identity(),
            filename=upload_result['original_filename'],
            s3_key=upload_result['s3_key'],
            document_type=request.form.get('document_type', ''),
            description=request.form.get('description', '')
        )
        
        document.save(db)
        
        return jsonify({
            'message': 'Document uploaded successfully',
            'document': {
                'id': str(document.id),
                'filename': document.filename,
                'document_type': document.document_type,
                'description': document.description,
                'created_at': document.created_at.isoformat(),
                'url': upload_result['url']
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'error': 'Upload failed',
            'message': str(e)
        }), 500

@documents_bp.route('/', methods=['GET'])
@jwt_required()
def get_documents():
    user_id = get_jwt_identity()
    documents = Document.find_by_user_id(db, user_id)
    
    return jsonify({
        'documents': [{
            'id': str(doc.id),
            'filename': doc.filename,
            'document_type': doc.document_type,
            'description': doc.description,
            'created_at': doc.created_at.isoformat(),
            'verification_status': doc.verification_status,
            'url': doc.get_url()  # Get temporary URL for each document
        } for doc in documents]
    }), 200

@documents_bp.route('/<document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
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
            'metadata': document.get_metadata()
        }
    }), 200

@documents_bp.route('/<document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    user_id = get_jwt_identity()
    document = Document.find_by_id(db, document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
        
    if str(document.user_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    try:
        # Delete document (this will also delete from S3)
        document.delete(db)
        return jsonify({'message': 'Document deleted successfully'}), 200
    except Exception as e:
        return jsonify({
            'error': 'Delete failed',
            'message': str(e)
        }), 500

@documents_bp.route('/<document_id>/url', methods=['GET'])
@jwt_required()
def get_document_url(document_id):
    user_id = get_jwt_identity()
    document = Document.find_by_id(db, document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
        
    if str(document.user_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    expires_in = request.args.get('expires_in', default=3600, type=int)
    url = document.get_url(expires_in)
    
    if not url:
        return jsonify({'error': 'Failed to generate URL'}), 500
        
    return jsonify({
        'url': url,
        'expires_in': expires_in
    }), 200 