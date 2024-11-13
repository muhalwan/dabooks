import os
from dotenv import load_dotenv
import urllib.parse


load_dotenv()
username = os.getenv('MONGODB_USERNAME')
password = os.getenv('MONGODB_PASSWORD')

encoded_username = urllib.parse.quote_plus(username)
encoded_password = urllib.parse.quote_plus(password)

class Config:
    MONGO_URI = f"mongodb+srv://{encoded_username}:{encoded_password}@dabooks.kxxkp.mongodb.net/dabooks?retryWrites=true&w=majority"
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-fallback-secret-key')