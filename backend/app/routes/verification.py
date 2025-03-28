from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.document import Document
from app.services.ocr_service import OCRService
from app.services.ai_service import AIService
from app.services.blockchain_service import BlockchainService
from app import db

verification_bp = Blueprint('verification', __name__)

ocr_service = OCRService()
ai_service = AIService()
blockchain_service = BlockchainService()

@verification_bp.route('/verify/<document_id>', methods=['POST'])
@jwt_required()
def verify_document(document_id):
    user_id = get_jwt_identity()
    document = Document.find_by_id(db, document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
        
    if str(document.user_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    try:
        # Perform OCR
        ocr_results = ocr_service.analyze_document(document.file_path)
        
        # Perform AI verification
        ai_results = ai_service.verify_document(
            document.file_path,
            document.document_type
        )
        
        # Analyze document content
        content_analysis = ai_service.analyze_document_content(
            document.file_path,
            ocr_results['extracted_text']
        )
        
        # Record verification on blockchain
        blockchain_record = blockchain_service.record_verification(
            document_id=str(document.id),
            verification_results={
                'ocr': ocr_results,
                'ai_verification': ai_results,
                'content_analysis': content_analysis
            }
        )
        
        # Update document with verification results
        document.verification_status = ai_results['status']
        document.verification_results = {
            'ocr': ocr_results,
            'ai_verification': ai_results,
            'content_analysis': content_analysis,
            'blockchain_record': blockchain_record
        }
        document.save(db)
        
        return jsonify({
            'message': 'Document verification completed',
            'verification_results': document.verification_results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Verification failed',
            'message': str(e)
        }), 500

@verification_bp.route('/status/<document_id>', methods=['GET'])
@jwt_required()
def get_verification_status(document_id):
    user_id = get_jwt_identity()
    document = Document.find_by_id(db, document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
        
    if str(document.user_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    return jsonify({
        'document_id': str(document.id),
        'verification_status': document.verification_status,
        'verification_results': document.verification_results
    }), 200

@verification_bp.route('/history/<document_id>', methods=['GET'])
@jwt_required()
def get_verification_history(document_id):
    user_id = get_jwt_identity()
    document = Document.find_by_id(db, document_id)
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
        
    if str(document.user_id) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Get verification history from blockchain
    history = blockchain_service.get_verification_history(str(document.id))
    
    return jsonify({
        'document_id': str(document.id),
        'verification_history': history
    }), 200 