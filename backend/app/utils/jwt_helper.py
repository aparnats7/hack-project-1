from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt
from app.models.user import User
from app import db
from app.utils.logger import logger

def admin_required():
    """
    Decorator to require admin role for routes
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.find_by_id(db, current_user_id)
            
            if not user or user.role != 'admin':
                logger.warning(f"Unauthorized admin access attempt by user {current_user_id}")
                return jsonify({'error': 'Admin privileges required'}), 403
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def get_current_user():
    """
    Get the current authenticated user
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.find_by_id(db, current_user_id)
        if not user:
            logger.error(f"User not found for ID: {current_user_id}")
            return None
        return user
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        return None

def get_token_claims():
    """
    Get additional claims from the JWT token
    """
    try:
        return get_jwt()
    except Exception as e:
        logger.error(f"Error getting token claims: {str(e)}")
        return None

def verify_token():
    """
    Verify the JWT token and return the user
    """
    try:
        verify_jwt_in_request()
        return get_current_user()
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None 