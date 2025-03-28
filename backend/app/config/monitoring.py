import os
import logging
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, Histogram, Gauge, Summary
from pythonjsonlogger import jsonlogger

# AWS CloudWatch configuration
cloudwatch_config = {
    'aws_region': os.getenv('AWS_REGION', 'us-east-1'),
    'log_group': os.getenv('CLOUDWATCH_LOG_GROUP', 'veritrustai'),
    'log_stream': os.getenv('CLOUDWATCH_LOG_STREAM', 'app'),
}

# Sentry configuration
sentry_config = {
    'dsn': os.getenv('SENTRY_DSN'),
    'environment': os.getenv('FLASK_ENV', 'development'),
    'integrations': [FlaskIntegration()],
    'traces_sample_rate': float(os.getenv('SENTRY_TRACES_SAMPLE_RATE', '1.0')),
    'profiles_sample_rate': float(os.getenv('SENTRY_PROFILES_SAMPLE_RATE', '0.1')),
}

# Prometheus metrics
# API metrics
api_requests_total = Counter(
    'api_requests_total',
    'Total number of API requests',
    ['method', 'endpoint', 'status']
)

api_request_duration_seconds = Histogram(
    'api_request_duration_seconds',
    'API request duration in seconds',
    ['method', 'endpoint']
)

# Database metrics
db_operations_total = Counter(
    'db_operations_total',
    'Total number of database operations',
    ['operation', 'collection', 'status']
)

db_operation_duration_seconds = Histogram(
    'db_operation_duration_seconds',
    'Database operation duration in seconds',
    ['operation', 'collection']
)

# Cache metrics
cache_hits_total = Counter(
    'cache_hits_total',
    'Total number of cache hits',
    ['cache_type']
)

cache_misses_total = Counter(
    'cache_misses_total',
    'Total number of cache misses',
    ['cache_type']
)

# System metrics
system_memory_usage = Gauge(
    'system_memory_usage_bytes',
    'Current system memory usage in bytes'
)

system_cpu_usage = Gauge(
    'system_cpu_usage_percent',
    'Current system CPU usage percentage'
)

# Business metrics
active_users = Gauge(
    'active_users',
    'Number of active users'
)

documents_processed_total = Counter(
    'documents_processed_total',
    'Total number of documents processed',
    ['status']
)

verification_requests_total = Counter(
    'verification_requests_total',
    'Total number of verification requests',
    ['status']
)

# Error metrics
error_total = Counter(
    'error_total',
    'Total number of errors',
    ['type', 'endpoint']
)

# Logging configuration
logging_config = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
        'json': {
            'class': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(name)s %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
            'level': 'INFO'
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/app.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5,
            'formatter': 'json'
        },
        'error_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/error.log',
            'maxBytes': 10485760,
            'backupCount': 5,
            'formatter': 'json',
            'level': 'ERROR'
        }
    },
    'loggers': {
        '': {  # Root logger
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': True
        },
        'app': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False
        },
        'app.security': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'WARNING',
            'propagate': False
        }
    }
}

def setup_monitoring(app):
    """Initialize monitoring and logging for the application."""
    # Configure logging
    logging.config.dictConfig(logging_config)
    logger = logging.getLogger('app')

    # Initialize Sentry
    if sentry_config['dsn']:
        sentry_sdk.init(**sentry_config)
        logger.info('Sentry initialized successfully')

    # Initialize Prometheus metrics
    metrics = PrometheusMetrics(app)
    metrics.info('app_info', 'Application information', version='1.0.0')

    # Add custom metrics
    metrics.register_default(
        api_requests_total,
        api_request_duration_seconds,
        db_operations_total,
        db_operation_duration_seconds,
        cache_hits_total,
        cache_misses_total,
        system_memory_usage,
        system_cpu_usage,
        active_users,
        documents_processed_total,
        verification_requests_total,
        error_total
    )

    # Health check endpoint with detailed system information
    @app.route('/health')
    def health_check():
        import psutil
        import platform

        system_info = {
            'status': 'healthy',
            'version': '1.0.0',
            'environment': os.getenv('FLASK_ENV', 'development'),
            'system': {
                'platform': platform.platform(),
                'python_version': platform.python_version(),
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent
            },
            'services': {
                'database': check_database_connection(),
                'redis': check_redis_connection(),
                'aws': check_aws_connection()
            }
        }
        return system_info

    # Metrics endpoint with additional information
    @app.route('/metrics')
    def metrics():
        return metrics.generate_latest()

    logger.info('Monitoring setup completed successfully')
    return metrics

def check_database_connection():
    """Check database connection status."""
    try:
        from app import db
        db.command('ping')
        return {'status': 'healthy', 'latency': 'ok'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}

def check_redis_connection():
    """Check Redis connection status."""
    try:
        from app.config.cache import redis_client
        redis_client.ping()
        return {'status': 'healthy', 'latency': 'ok'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}

def check_aws_connection():
    """Check AWS services connection status."""
    try:
        import boto3
        s3 = boto3.client('s3')
        s3.list_buckets()
        return {'status': 'healthy', 'latency': 'ok'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)} 