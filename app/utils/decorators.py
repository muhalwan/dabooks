from functools import wraps
from flask import request, current_app
import time


def log_execution_time(f):
    """Decorator to log function execution time"""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        result = f(*args, **kwargs)
        end_time = time.time()

        current_app.logger.info(
            f"Route {request.path} executed in {(end_time - start_time):.2f}s"
        )
        return result

    return decorated_function


def cache_response(timeout=300):
    """Decorator to cache response"""

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Add caching logic here if needed
            return f(*args, **kwargs)

        return decorated_function

    return decorator