from flask import jsonify, current_app
from werkzeug.exceptions import HTTPException
from app.utils.responses import error_response
import traceback
from marshmallow import ValidationError
from jwt.exceptions import InvalidTokenError
from app.constants import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR
)

class APIError(Exception):
    def __init__(self, message, code=HTTP_400_BAD_REQUEST, errors=None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.errors = errors or {}

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        return error_response(
            message=error.message,
            code=error.code,
            errors=error.errors
        )

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return error_response(
            message="Validation error",
            code=HTTP_400_BAD_REQUEST,
            errors=error.messages
        )

    @app.errorhandler(InvalidTokenError)
    def handle_invalid_token_error(error):
        return error_response(
            message="Invalid token",
            code=HTTP_401_UNAUTHORIZED
        )

    @app.errorhandler(404)
    def handle_404_error(error):
        return error_response(
            message="Resource not found",
            code=HTTP_404_NOT_FOUND
        )

    @app.errorhandler(Exception)
    def handle_generic_error(error):
        current_app.logger.error(f"Unhandled error: {traceback.format_exc()}")
        return error_response(
            message="Internal server error",
            code=HTTP_500_INTERNAL_SERVER_ERROR
        )