from app.extensions import mongo
from datetime import datetime

class User:
    @staticmethod
    def create(username, email, password):
        user = {
            "username": username,
            "email": email,
            "password": password,
            "created_at": datetime.utcnow()
        }
        return mongo.db.users.insert_one(user)

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({"username": username})

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})