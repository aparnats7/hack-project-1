from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient, ASCENDING, DESCENDING
from app.config import Config
from app.utils.logger import logger
from app.routes.auth import auth_bp
from app.routes.documents import documents_bp
from app.routes.verification import verification_bp

def setup_mongodb_indexes(db):
    """
    Set up MongoDB indexes for better query performance
    """
    try:
        # Users collection indexes
        db.users.create_index([('email', ASCENDING)], unique=True)
        db.users.create_index([('reset_token', ASCENDING)])
        
        # Documents collection indexes
        db.documents.create_index([('user_id', ASCENDING)])
        db.documents.create_index([('created_at', DESCENDING)])
        db.documents.create_index([('verification_status', ASCENDING)])
        
        logger.info("Successfully created MongoDB indexes")
    except Exception as e:
        logger.error(f"Failed to create MongoDB indexes: {str(e)}")
        raise

def create_app():
    """
    Create and configure the Flask application
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app, origins=Config.CORS_ORIGINS)
    
    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="redis://redis:6379"
    )
    
    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        logger.warning(f"Expired token used by user {jwt_payload.get('sub')}")
        return jsonify({
            'error': 'Token expired',
            'message': 'The token has expired'
        }), 401
        
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        logger.warning(f"Invalid token used: {str(error)}")
        return jsonify({
            'error': 'Invalid token',
            'message': 'The token is invalid'
        }), 401
        
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        logger.warning(f"Unauthorized access attempt: {str(error)}")
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Missing or invalid token'
        }), 401
    
    # Initialize MongoDB
    try:
        client = MongoClient(Config.MONGODB_URI)
        app.db = client.get_database()
        logger.info("Successfully connected to MongoDB")
        
        # Set up indexes
        setup_mongodb_indexes(app.db)
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise
        
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(verification_bp, url_prefix='/api/verification')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Not found'}, 404
        
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return {'error': 'Internal server error'}, 500
        
    @app.errorhandler(Exception)
    def handle_exception(error):
        logger.error(f"Unhandled exception: {str(error)}")
        return {'error': 'Internal server error'}, 500
        
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200
        
    logger.info("Application initialized successfully")
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 