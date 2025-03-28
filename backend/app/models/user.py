from bson import ObjectId
from datetime import datetime, timedelta
import secrets
import bcrypt

class User:
    def __init__(self, email, password, name='', role='user'):
        self.email = email
        self.password = password
        self.name = name
        self.role = role
        self.created_at = datetime.utcnow()
        self.reset_token = None
        self.reset_token_expires = None
        self.is_active = True
        
    def save(self, db):
        if not hasattr(self, 'id'):
            result = db.users.insert_one(self.__dict__)
            self.id = result.inserted_id
        else:
            db.users.update_one(
                {'_id': self.id},
                {'$set': self.__dict__}
            )
        return self
        
    def generate_reset_token(self):
        """Generate a password reset token"""
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
        return self.reset_token
        
    def is_reset_token_valid(self):
        """Check if the reset token is valid and not expired"""
        if not self.reset_token or not self.reset_token_expires:
            return False
        return datetime.utcnow() <= self.reset_token_expires
        
    def clear_reset_token(self):
        """Clear the reset token after password reset"""
        self.reset_token = None
        self.reset_token_expires = None
        
    @staticmethod
    def find_by_email(db, email):
        user_data = db.users.find_one({'email': email})
        if user_data:
            user = User(
                email=user_data['email'],
                password=user_data['password'],
                name=user_data.get('name', ''),
                role=user_data.get('role', 'user')
            )
            user.id = user_data['_id']
            user.created_at = user_data['created_at']
            user.is_active = user_data.get('is_active', True)
            user.reset_token = user_data.get('reset_token')
            user.reset_token_expires = user_data.get('reset_token_expires')
            return user
        return None
        
    @staticmethod
    def find_by_id(db, user_id):
        try:
            user_data = db.users.find_one({'_id': ObjectId(user_id)})
            if user_data:
                user = User(
                    email=user_data['email'],
                    password=user_data['password'],
                    name=user_data.get('name', ''),
                    role=user_data.get('role', 'user')
                )
                user.id = user_data['_id']
                user.created_at = user_data['created_at']
                user.is_active = user_data.get('is_active', True)
                user.reset_token = user_data.get('reset_token')
                user.reset_token_expires = user_data.get('reset_token_expires')
                return user
        except:
            pass
        return None
        
    @staticmethod
    def find_by_reset_token(db, token):
        user_data = db.users.find_one({
            'reset_token': token,
            'reset_token_expires': {'$gt': datetime.utcnow()}
        })
        if user_data:
            user = User(
                email=user_data['email'],
                password=user_data['password'],
                name=user_data.get('name', ''),
                role=user_data.get('role', 'user')
            )
            user.id = user_data['_id']
            user.created_at = user_data['created_at']
            user.is_active = user_data.get('is_active', True)
            user.reset_token = user_data.get('reset_token')
            user.reset_token_expires = user_data.get('reset_token_expires')
            return user
        return None 