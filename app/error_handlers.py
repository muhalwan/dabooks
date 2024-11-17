from flask import jsonify
from bson.errors import InvalidId
from pymongo.errors import PyMongoError

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(InvalidId)
    def invalid_id_error(error):
        return jsonify({"message": "Invalid ID format"}), 400

    @app.errorhandler(PyMongoError)
    def database_error(error):
        return jsonify({"message": "Database error occurred"}), 500

    @app.errorhandler(Exception)
    def internal_error(error):
        return jsonify({"message": "Internal server error"}), 500