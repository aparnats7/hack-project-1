from bson import ObjectId
from datetime import datetime
from app.services.storage_service import StorageService

class Document:
    def __init__(self, user_id, filename, s3_key, document_type='', description=''):
        self.user_id = user_id
        self.filename = filename
        self.s3_key = s3_key
        self.document_type = document_type
        self.description = description
        self.created_at = datetime.utcnow()
        self.verification_status = 'pending'
        self.verification_results = {}
        self.storage_service = StorageService()
        
    def save(self, db):
        if not hasattr(self, 'id'):
            result = db.documents.insert_one(self.__dict__)
            self.id = result.inserted_id
        else:
            db.documents.update_one(
                {'_id': self.id},
                {'$set': self.__dict__}
            )
        return self
        
    def delete(self, db):
        if hasattr(self, 'id'):
            # Delete file from S3
            self.storage_service.delete_file(self.s3_key)
            # Delete document from database
            db.documents.delete_one({'_id': self.id})
            
    def get_url(self, expires_in=3600):
        """Get a temporary URL to access the document"""
        return self.storage_service.get_file_url(self.s3_key, expires_in)
        
    def get_metadata(self):
        """Get document metadata from S3"""
        return self.storage_service.get_file_metadata(self.s3_key)
            
    @staticmethod
    def find_by_id(db, document_id):
        try:
            doc_data = db.documents.find_one({'_id': ObjectId(document_id)})
            if doc_data:
                doc = Document(
                    user_id=doc_data['user_id'],
                    filename=doc_data['filename'],
                    s3_key=doc_data['s3_key'],
                    document_type=doc_data.get('document_type', ''),
                    description=doc_data.get('description', '')
                )
                doc.id = doc_data['_id']
                doc.created_at = doc_data['created_at']
                doc.verification_status = doc_data.get('verification_status', 'pending')
                doc.verification_results = doc_data.get('verification_results', {})
                return doc
        except:
            pass
        return None
        
    @staticmethod
    def find_by_user_id(db, user_id):
        docs_data = db.documents.find({'user_id': user_id})
        documents = []
        for doc_data in docs_data:
            doc = Document(
                user_id=doc_data['user_id'],
                filename=doc_data['filename'],
                s3_key=doc_data['s3_key'],
                document_type=doc_data.get('document_type', ''),
                description=doc_data.get('description', '')
            )
            doc.id = doc_data['_id']
            doc.created_at = doc_data['created_at']
            doc.verification_status = doc_data.get('verification_status', 'pending')
            doc.verification_results = doc_data.get('verification_results', {})
            documents.append(doc)
        return documents 