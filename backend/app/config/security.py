import os
from datetime import timedelta
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash

# Security configuration
security_config = {
    'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY'),
    'JWT_ACCESS_TOKEN_EXPIRES': timedelta(hours=1),
    'JWT_REFRESH_TOKEN_EXPIRES': timedelta(days=30),
    'PASSWORD_SALT': os.getenv('PASSWORD_SALT'),
    'BCRYPT_ROUNDS': 12,
    'MAX_LOGIN_ATTEMPTS': 5,
    'LOGIN_TIMEOUT': 300,  # 5 minutes
    'SESSION_COOKIE_SECURE': True,
    'SESSION_COOKIE_HTTPONLY': True,
    'SESSION_COOKIE_SAMESITE': 'Lax',
    'PERMANENT_SESSION_LIFETIME': timedelta(days=1),
}

# Rate limiting configuration
rate_limit_config = {
    'default': '200 per day',
    'login': '5 per minute',
    'register': '3 per hour',
    'api': '1000 per hour',
    'document_upload': '10 per hour',
}

# CORS configuration
cors_config = {
    'origins': os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
    'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'allow_headers': ['Content-Type', 'Authorization'],
    'expose_headers': ['Content-Type', 'X-CSRFToken'],
    'supports_credentials': True,
    'max_age': 600,
}

def setup_security(app):
    """Initialize security features for the application."""
    # Initialize Talisman for HTTPS and security headers
    Talisman(
        app,
        force_https=True,
        strict_transport_security=True,
        frame_options='DENY',
        content_security_policy={
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
            'style-src': "'self' 'unsafe-inline'",
            'img-src': "'self' data: https:",
            'font-src': "'self'",
            'connect-src': "'self'",
        }
    )

    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[rate_limit_config['default']],
        storage_uri='redis://redis:6379'
    )

    # Configure rate limits for specific endpoints
    limiter.limit(rate_limit_config['login'])(app.route('/api/auth/login'))
    limiter.limit(rate_limit_config['register'])(app.route('/api/auth/register'))
    limiter.limit(rate_limit_config['document_upload'])(app.route('/api/documents/upload'))

    return limiter

def hash_password(password):
    """Hash a password using bcrypt."""
    return generate_password_hash(
        password,
        method='pbkdf2:sha256',
        salt_length=16
    )

def verify_password(password, password_hash):
    """Verify a password against its hash."""
    return check_password_hash(password_hash, password)

def sanitize_input(data):
    """Sanitize user input to prevent XSS attacks."""
    if isinstance(data, str):
        # Remove potentially dangerous HTML tags
        data = data.replace('<', '&lt;').replace('>', '&gt;')
        # Remove potentially dangerous attributes
        data = data.replace('javascript:', '')
        data = data.replace('onerror', '')
        data = data.replace('onload', '')
    elif isinstance(data, dict):
        return {k: sanitize_input(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    return data

def validate_password_strength(password):
    """
    Validate password strength.
    Returns (bool, str) - (is_valid, message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    
    if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
        return False, "Password must contain at least one special character"
    
    return True, "Password meets strength requirements" 