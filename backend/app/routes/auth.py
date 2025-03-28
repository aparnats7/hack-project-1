from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app import db
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

auth_bp = Blueprint('auth', __name__)

def send_reset_email(user_email, reset_token):
    """Send password reset email"""
    msg = MIMEMultipart()
    msg['From'] = os.getenv('SMTP_FROM_EMAIL')
    msg['To'] = user_email
    msg['Subject'] = 'Password Reset Request'
    
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}"
    body = f"""
    To reset your password, click the following link:
    {reset_url}
    
    This link will expire in 24 hours.
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT')))
        server.starttls()
        server.login(os.getenv('SMTP_USERNAME'), os.getenv('SMTP_PASSWORD'))
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def admin_required():
    """Decorator to require admin role"""
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.find_by_id(db, current_user_id)
            if not user or user.role != 'admin':
                return jsonify({'error': 'Admin privileges required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if User.find_by_email(db, data['email']):
        return jsonify({'error': 'Email already registered'}), 409
        
    user = User(
        email=data['email'],
        password=generate_password_hash(data['password']),
        name=data.get('name', ''),
        role=data.get('role', 'user')
    )
    
    user.save(db)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
        
    user = User.find_by_email(db, data['email'])
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
        
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role}
    )
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.find_by_id(db, current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        }
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
        
    user = User.find_by_email(db, email)
    
    if user:
        reset_token = user.generate_reset_token()
        user.save(db)
        
        if send_reset_email(user.email, reset_token):
            return jsonify({'message': 'Password reset email sent'}), 200
        else:
            return jsonify({'error': 'Failed to send reset email'}), 500
            
    # Return success even if user not found to prevent email enumeration
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400
        
    user = User.find_by_reset_token(db, token)
    
    if not user or not user.is_reset_token_valid():
        return jsonify({'error': 'Invalid or expired reset token'}), 400
        
    user.password = generate_password_hash(new_password)
    user.clear_reset_token()
    user.save(db)
    
    return jsonify({'message': 'Password reset successfully'}), 200

@auth_bp.route('/users', methods=['GET'])
@admin_required()
def get_users():
    users = db.users.find({}, {'password': 0})
    return jsonify({
        'users': [{
            'id': str(user['_id']),
            'email': user['email'],
            'name': user.get('name', ''),
            'role': user.get('role', 'user'),
            'created_at': user['created_at'].isoformat(),
            'is_active': user.get('is_active', True)
        } for user in users]
    }), 200

@auth_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required()
def update_user(user_id):
    data = request.get_json()
    user = User.find_by_id(db, user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    if 'role' in data:
        user.role = data['role']
    if 'is_active' in data:
        user.is_active = data['is_active']
    if 'name' in data:
        user.name = data['name']
        
    user.save(db)
    
    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'is_active': user.is_active
        }
    }), 200 