from functools import wraps
from flask import request, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from app.utils.responses import error_response

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("is_admin"):
                return fn(*args, **kwargs)
            return error_response("Admin access required", 403)
        return decorator
    return wrapper

def rate_limit(limits):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # Implement rate limiting logic here
            return f(*args, **kwargs)
        return wrapped
    return decorator