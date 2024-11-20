from werkzeug.security import generate_password_hash, check_password_hash
from app.constants import USERS_COLLECTION
from .base import BaseModel

class User(BaseModel):
    collection = USERS_COLLECTION

    @classmethod
    def create(cls, username, email, password):
        return super().create(
            username=username,
            email=email,
            password=generate_password_hash(password, method='pbkdf2:sha256')
        )

    @classmethod
    def find_by_username(cls, username):
        return cls.find_one({"username": username})

    @classmethod
    def find_by_email(cls, email):
        return cls.find_one({"email": email})

    @classmethod
    def check_password(cls, user, password):
        if not user or not password:
            return False
        return check_password_hash(user['password'], password)