from flask import Flask
from flask_cors import CORS
import logging
from logging.handlers import RotatingFileHandler
import os
from app.config import Config
from app.extensions import mongo, jwt
from app.routes import auth_bp, books_bp, users_bp
from app.error_handlers import register_error_handlers

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure logging
    if not app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/dabooks.log', maxBytes=10240,
                                         backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Dabooks startup')

    # Initialize extensions
    CORS(app, resources={r"/*": {
        "origins": [
            "https://dabooks-frontend-e89a5b7d9e0f.herokuapp.com",  # Update with actual frontend URL
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})
    mongo.init_app(app)
    jwt.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(books_bp, url_prefix='/books')
    app.register_blueprint(users_bp, url_prefix='/users')

    # Test route
    @app.route('/test')
    def test():
        try:
            user_count = mongo.db.users.count_documents({})
            app.logger.info(f'Test route accessed. User count: {user_count}')
            return {"message": "Connected to MongoDB", "user_count": user_count}, 200
        except Exception as e:
            app.logger.error(f'Test route error: {str(e)}')
            return {"message": f"Error: {str(e)}"}, 500

    return app