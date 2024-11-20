from functools import wraps
from flask import request
from marshmallow import ValidationError
from app.utils.responses import error_response

def validate_schema(schema_class):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            schema = schema_class()
            try:
                data = schema.load(request.get_json())
                return f(*args, **kwargs, validated_data=data)
            except ValidationError as err:
                return error_response(
                    message="Validation error",
                    code=400,
                    errors=err.messages
                )
        return decorated_function
    return decorator