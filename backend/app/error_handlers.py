from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"message": "Bad request", "error": str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"message": "Unauthorized", "error": str(e)}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "Not found", "error": str(e)}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"message": "Internal server error", "error": str(e)}), 500