from flask import Flask
from flask_cors import CORS
import logging
from logging.handlers import RotatingFileHandler
import os
from app.config import Config
from app.extensions import mongo, jwt
from app.routes import auth_bp, books_bp, users_bp
from app.middleware.error_handlers import register_error_handlers

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enhanced CORS configuration
    CORS(app,
        resources={r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "https://dabooks-frontend-e89a5b7d9e0f.herokuapp.com",  # Add your frontend URL
                "https://your-production-frontend-url.com"  # Add your production frontend URL
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Total-Count"]
        }})

    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    # Initialize extensions and continue with the rest of the setup...
    try:
        mongo.init_app(app)
        with app.app_context():
            mongo.db.command('ping')
            app.logger.info('Connected to MongoDB successfully')
    except Exception as e:
        app.logger.error(f'MongoDB connection error: {str(e)}')
        raise

    jwt.init_app(app)
    register_error_handlers(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(books_bp, url_prefix='/books')
    app.register_blueprint(users_bp, url_prefix='/users')

    return app