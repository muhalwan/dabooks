import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = f"mongodb+srv://muhalwan12:{os.getenv('MONGODB_PASSWORD')}@dabooks.kxxkp.mongodb.net/dabooks?retryWrites=true&w=majority"
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-fallback-secret-key')
    
