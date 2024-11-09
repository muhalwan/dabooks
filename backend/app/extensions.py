from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import certifi

class MongoConnection:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app):
        try:
            # Connect with MongoClient directly
            self.client = MongoClient(
                app.config['MONGODB_URI'],
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000
            )
            self.db = self.client.get_default_database()
            # Test connection
            self.client.admin.command('ping')
            app.logger.info("MongoDB connected successfully!")
        except Exception as e:
            app.logger.error(f"MongoDB connection failed: {str(e)}")
            raise

mongo = MongoConnection()
jwt = JWTManager()