from bson import ObjectId
from app.constants import REVIEWS_COLLECTION
from .base import BaseModel
from app.utils.helpers import convert_object_id

class Review(BaseModel):
    collection = REVIEWS_COLLECTION

    @classmethod
    def create(cls, text, rating, user_id, book_id):
        return super().create(
            text=text,
            rating=rating,
            user_id=ObjectId(user_id),
            book_id=ObjectId(book_id)
        )

    @classmethod
    def get_book_reviews(cls, book_id, page=1, per_page=10):
        pipeline = [
            {"$match": {"book_id": ObjectId(book_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$sort": {"created_at": -1}},
            {"$skip": (page - 1) * per_page},
            {"$limit": per_page},
            {"$project": {
                "_id": 1,
                "text": 1,
                "rating": 1,
                "created_at": 1,
                "user.username": 1
            }}
        ]
        results = list(cls._get_collection().aggregate(pipeline))
        return convert_object_id(results)