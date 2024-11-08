from datetime import datetime
from app.extensions import mongo
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    @staticmethod
    def create(username, email, password):
        user = {
            "username": username,
            "email": email,
            "password": generate_password_hash(password, method='pbkdf2:sha256'),  # Specify the hash method
            "created_at": datetime.utcnow()
        }
        return mongo.db.users.insert_one(user)

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({"username": username})

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})