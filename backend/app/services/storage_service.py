import boto3
import os
from botocore.exceptions import ClientError
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.bucket_name = os.getenv('AWS_S3_BUCKET')
        
    def upload_file(self, file, user_id):
        """
        Upload a file to S3 and return the file URL and metadata
        """
        try:
            # Generate a unique filename
            original_filename = secure_filename(file.filename)
            file_extension = os.path.splitext(original_filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Create the S3 key with user-specific path
            s3_key = f"users/{user_id}/documents/{unique_filename}"
            
            # Upload file to S3
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                s3_key,
                ExtraArgs={
                    'ContentType': file.content_type,
                    'ACL': 'private',
                    'Metadata': {
                        'original_filename': original_filename,
                        'uploaded_by': user_id,
                        'upload_date': datetime.utcnow().isoformat()
                    }
                }
            )
            
            # Generate a presigned URL for temporary access
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=3600  # URL expires in 1 hour
            )
            
            return {
                'url': url,
                's3_key': s3_key,
                'original_filename': original_filename,
                'file_size': file.content_length,
                'content_type': file.content_type,
                'upload_date': datetime.utcnow().isoformat()
            }
            
        except ClientError as e:
            print(f"Error uploading file to S3: {str(e)}")
            raise
            
    def delete_file(self, s3_key):
        """
        Delete a file from S3
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
            return True
        except ClientError as e:
            print(f"Error deleting file from S3: {str(e)}")
            return False
            
    def get_file_url(self, s3_key, expires_in=3600):
        """
        Generate a presigned URL for temporary file access
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': s3_key
                },
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            print(f"Error generating presigned URL: {str(e)}")
            return None
            
    def get_file_metadata(self, s3_key):
        """
        Get file metadata from S3
        """
        try:
            response = self.s3_client.head_object(
                Bucket=self.bucket_name,
                Key=s3_key
            )
            return {
                'content_type': response.get('ContentType'),
                'content_length': response.get('ContentLength'),
                'last_modified': response.get('LastModified').isoformat(),
                'metadata': response.get('Metadata', {})
            }
        except ClientError as e:
            print(f"Error getting file metadata: {str(e)}")
            return None 