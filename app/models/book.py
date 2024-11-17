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

    @staticmethod
    def get_by_id(book_id):
        from bson import ObjectId
        try:
            return mongo.db.books.find_one({"_id": ObjectId(book_id)})
        except Exception:
            return None

    @staticmethod
    def get_rating_stats(book_id):
        pipeline = [
            {"$match": {"book_id": ObjectId(book_id)}},
            {"$group": {
                "_id": None,
                "average_rating": {"$avg": "$rating"},
                "total_ratings": {"$sum": 1}
            }}
        ]
        stats = list(mongo.db.reviews.aggregate(pipeline))
        if stats:
            return {
                "average_rating": round(stats[0]["average_rating"], 1),
                "total_ratings": stats[0]["total_ratings"]
            }
        return {"average_rating": 0, "total_ratings": 0}

    @staticmethod
    def get_all_with_ratings():
        pipeline = [
            {
                "$lookup": {
                    "from": "reviews",
                    "localField": "_id",
                    "foreignField": "book_id",
                    "as": "reviews"
                }
            },
            {
                "$addFields": {
                    "average_rating": {
                        "$cond": [
                            { "$eq": [{ "$size": "$reviews" }, 0] },
                            0,
                            { "$round": [{ "$avg": "$reviews.rating" }, 1] }
                        ]
                    },
                    "total_ratings": { "$size": "$reviews" }
                }
            }
        ]
        return list(mongo.db.books.aggregate(pipeline))