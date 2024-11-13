from datetime import datetime
from app.extensions import mongo
from bson import ObjectId

class Review:
    @staticmethod
    def create(text, rating, user_id, book_id):
        review = {
            "text": text,
            "rating": rating,
            "user_id": ObjectId(user_id),
            "book_id": ObjectId(book_id),
            "created_at": datetime.utcnow()
        }
        return mongo.db.reviews.insert_one(review)

    @staticmethod
    def get_book_reviews(book_id):
        pipeline = [
            {"$match": {"book_id": ObjectId(book_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"}
        ]
        return list(mongo.db.reviews.aggregate(pipeline))
