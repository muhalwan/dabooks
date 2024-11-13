from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import mongo, jwt
from app.routes import auth_bp, books_bp, users_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    mongo.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(books_bp, url_prefix='/books')
    app.register_blueprint(users_bp, url_prefix='/users')

    # Test route
    @app.route('/test')
    def test():
        try:
            user_count = mongo.db.users.count_documents({})
            return {"message": "Connected to MongoDB", "user_count": user_count}, 200
        except Exception as e:
            return {"message": f"Error: {str(e)}"}, 500

    return app