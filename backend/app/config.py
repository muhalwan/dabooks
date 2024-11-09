import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB configuration with optimized settings
    MONGODB_URI = os.getenv('MONGODB_URI')
    MONGO_URI = MONGODB_URI
    MONGO_CONNECT_TIMEOUT_MS = 10000
    MONGO_SOCKET_TIMEOUT_MS = 10000
    MONGO_SERVER_SELECTION_TIMEOUT_MS = 10000
    
    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # Flask configuration
    PROPAGATE_EXCEPTIONS = True