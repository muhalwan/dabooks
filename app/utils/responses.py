from flask import jsonify
from datetime import datetime

def success_response(data=None, message=None, code=200):
    """Standard success response"""
    response = {
        "status": "success",
        "timestamp": datetime.utcnow().isoformat()
    }
    if message:
        response["message"] = message
    if data is not None:
        response["data"] = data
    return jsonify(response), code

def error_response(message, code=400, errors=None):
    """Standard error response"""
    response = {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), code