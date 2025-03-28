import time
import logging
from functools import wraps
from flask import request, g
from prometheus_client import Counter, Histogram
from sentry_sdk import capture_exception

logger = logging.getLogger('app')

# Prometheus metrics
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

def track_request():
    """Decorator to track API requests and performance."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Start timing
            start_time = time.time()
            
            # Get request details
            method = request.method
            endpoint = request.endpoint or 'unknown'
            
            try:
                # Execute the route function
                response = f(*args, **kwargs)
                
                # Record metrics
                duration = time.time() - start_time
                status = response.status_code if hasattr(response, 'status_code') else 200
                
                api_requests_total.labels(
                    method=method,
                    endpoint=endpoint,
                    status=status
                ).inc()
                
                api_request_duration_seconds.labels(
                    method=method,
                    endpoint=endpoint
                ).observe(duration)
                
                # Log request details
                logger.info(
                    f'Request completed: {method} {endpoint} - {status} - {duration:.3f}s',
                    extra={
                        'method': method,
                        'endpoint': endpoint,
                        'status': status,
                        'duration': duration,
                        'ip': request.remote_addr,
                        'user_agent': request.user_agent.string
                    }
                )
                
                return response
                
            except Exception as e:
                # Record error metrics
                api_requests_total.labels(
                    method=method,
                    endpoint=endpoint,
                    status=500
                ).inc()
                
                # Log error details
                logger.error(
                    f'Request failed: {method} {endpoint} - {str(e)}',
                    extra={
                        'method': method,
                        'endpoint': endpoint,
                        'error': str(e),
                        'ip': request.remote_addr,
                        'user_agent': request.user_agent.string
                    },
                    exc_info=True
                )
                
                # Send error to Sentry
                capture_exception(e)
                
                raise
                
        return decorated_function
    return decorator

def track_db_operation(operation, collection):
    """Decorator to track database operation performance."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = f(*args, **kwargs)
                
                duration = time.time() - start_time
                
                # Log database operation
                logger.info(
                    f'Database operation completed: {operation} on {collection} - {duration:.3f}s',
                    extra={
                        'operation': operation,
                        'collection': collection,
                        'duration': duration
                    }
                )
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                
                # Log database error
                logger.error(
                    f'Database operation failed: {operation} on {collection} - {str(e)}',
                    extra={
                        'operation': operation,
                        'collection': collection,
                        'duration': duration,
                        'error': str(e)
                    },
                    exc_info=True
                )
                
                # Send error to Sentry
                capture_exception(e)
                
                raise
                
        return decorated_function
    return decorator 