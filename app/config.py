import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGODB_URI')
    if not MONGO_URI:
        raise ValueError("No MONGODB_URI set in environment")

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    if not JWT_SECRET_KEY:
        raise ValueError("No JWT_SECRET_KEY set in environment")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CORS Configuration
    FRONTEND_URLS = os.getenv('FRONTEND_URLS', '').split(',')

    # Application Configuration
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    MAX_PER_PAGE = int(os.getenv('MAX_PER_PAGE', 50))


class TestConfig(Config):
    """Test configuration - inherits from base config but can override if needed"""
    TESTING = True