from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import mongo, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    jwt.init_app(app)

    # Initialize MongoDB
    try:
        mongo.init_app(app)
    except Exception as e:
        app.logger.error(f"Failed to initialize MongoDB: {str(e)}")
        # Continue app initialization even if MongoDB fails

    # Register blueprints
    from app.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    @app.route('/test')
    def test():
        return jsonify({"message": "Backend is working!"}), 200

    @app.route('/db-test')
    def db_test():
        try:
            if mongo.db:
                # Test the connection
                mongo.client.admin.command('ping')
                return jsonify({
                    "message": "Database connection successful",
                    "database": mongo.db.name
                }), 200
        except Exception as e:
            return jsonify({
                "message": "Database connection failed",
                "error": str(e)
            }), 500

    return app