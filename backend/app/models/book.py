from datetime import datetime
from app.extensions import mongo
from bson import ObjectId

class Book:
    @staticmethod
    def create(title, author, description=""):
        book = {
            "title": title,
            "author": author,
            "description": description,
            "created_at": datetime.utcnow()
        }
        return mongo.db.books.insert_one(book)

    @staticmethod
    def get_all():
        return list(mongo.db.books.find())

    @staticmethod
    def find_by_id(book_id):
        return mongo.db.books.find_one({"_id": ObjectId(book_id)})