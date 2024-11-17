# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGODB_URI')  # This will use Heroku's config var
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-fallback-secret-key')