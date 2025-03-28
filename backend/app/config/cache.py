import os
import json
import hashlib
from functools import wraps
from redis import Redis
from datetime import timedelta
from prometheus_client import Counter

# Redis configuration
redis_config = {
    'host': os.getenv('REDIS_HOST', 'localhost'),
    'port': int(os.getenv('REDIS_PORT', 6379)),
    'db': int(os.getenv('REDIS_DB', 0)),
    'password': os.getenv('REDIS_PASSWORD'),
    'ssl': os.getenv('REDIS_SSL', 'false').lower() == 'true'
}

# Initialize Redis client
redis_client = Redis(**redis_config)

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

def generate_cache_key(prefix, *args, **kwargs):
    """Generate a unique cache key from prefix and arguments."""
    # Create a string representation of arguments
    args_str = ':'.join(str(arg) for arg in args)
    kwargs_str = ':'.join(f"{k}:{v}" for k, v in sorted(kwargs.items()))
    
    # Combine all parts
    key_parts = [prefix, args_str, kwargs_str]
    key_string = ':'.join(key_parts)
    
    # Generate hash
    return f"{prefix}:{hashlib.md5(key_string.encode()).hexdigest()}"

def cached(prefix, ttl=300, cache_type='general'):
    """
    Decorator to cache function results in Redis.
    
    Args:
        prefix (str): Prefix for the cache key
        ttl (int): Time to live in seconds (default: 5 minutes)
        cache_type (str): Type of cache for metrics
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Generate cache key
            key = generate_cache_key(prefix, *args, **kwargs)
            
            # Try to get from cache
            cached_value = redis_client.get(key)
            if cached_value:
                cache_hits_total.labels(cache_type=cache_type).inc()
                return json.loads(cached_value)
            
            # If not in cache, execute function
            cache_misses_total.labels(cache_type=cache_type).inc()
            result = f(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(
                key,
                ttl,
                json.dumps(result)
            )
            
            return result
        return decorated_function
    return decorator

def invalidate_cache(prefix):
    """
    Decorator to invalidate cache entries after a function call.
    
    Args:
        prefix (str): Prefix of the cache keys to invalidate
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Execute function
            result = f(*args, **kwargs)
            
            # Generate pattern for cache keys to invalidate
            pattern = f"{prefix}:*"
            
            # Delete matching keys
            keys = redis_client.keys(pattern)
            if keys:
                redis_client.delete(*keys)
            
            return result
        return decorated_function
    return decorator

def get_cached_value(key):
    """Get a value from cache."""
    value = redis_client.get(key)
    return json.loads(value) if value else None

def set_cached_value(key, value, ttl=300):
    """Set a value in cache with TTL."""
    redis_client.setex(
        key,
        ttl,
        json.dumps(value)
    )

def delete_cached_value(key):
    """Delete a value from cache."""
    redis_client.delete(key)

def clear_cache(pattern='*'):
    """Clear all cache entries matching the pattern."""
    keys = redis_client.keys(pattern)
    if keys:
        redis_client.delete(*keys)

# Cache configuration for different types of data
CACHE_CONFIG = {
    'user_profile': {
        'ttl': 3600,  # 1 hour
        'type': 'user'
    },
    'document_list': {
        'ttl': 300,  # 5 minutes
        'type': 'document'
    },
    'verification_result': {
        'ttl': 1800,  # 30 minutes
        'type': 'verification'
    },
    'api_response': {
        'ttl': 60,  # 1 minute
        'type': 'api'
    },
    'session': {
        'ttl': 86400,  # 24 hours
        'type': 'session'
    }
}

# Cache decorators for common operations
def cache_user_profile(f):
    """Cache decorator for user profile data."""
    return cached(
        'user_profile',
        ttl=CACHE_CONFIG['user_profile']['ttl'],
        cache_type=CACHE_CONFIG['user_profile']['type']
    )(f)

def cache_document_list(f):
    """Cache decorator for document list data."""
    return cached(
        'document_list',
        ttl=CACHE_CONFIG['document_list']['ttl'],
        cache_type=CACHE_CONFIG['document_list']['type']
    )(f)

def cache_verification_result(f):
    """Cache decorator for verification results."""
    return cached(
        'verification_result',
        ttl=CACHE_CONFIG['verification_result']['ttl'],
        cache_type=CACHE_CONFIG['verification_result']['type']
    )(f)

def cache_api_response(f):
    """Cache decorator for API responses."""
    return cached(
        'api_response',
        ttl=CACHE_CONFIG['api_response']['ttl'],
        cache_type=CACHE_CONFIG['api_response']['type']
    )(f)

def cache_session(f):
    """Cache decorator for session data."""
    return cached(
        'session',
        ttl=CACHE_CONFIG['session']['ttl'],
        cache_type=CACHE_CONFIG['session']['type']
    )(f) 