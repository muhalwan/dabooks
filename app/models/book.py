from bson import ObjectId
from app.constants import BOOKS_COLLECTION
from .base import BaseModel
from app.extensions import mongo
from app.utils.helpers import convert_object_id


class Book(BaseModel):
    collection = BOOKS_COLLECTION

    @classmethod
    def create(cls, title, author, description=""):
        return super().create(
            title=title,
            author=author,
            description=description
        )

    @classmethod
    def get_rating_stats(cls, book_id):
        pipeline = [
            {"$match": {"book_id": ObjectId(book_id)}},
            {"$group": {
                "_id": None,
                "average_rating": {"$avg": "$rating"},
                "total_ratings": {"$sum": 1}
            }},
            {"$project": {
                "_id": 0,
                "average_rating": {"$round": ["$average_rating", 1]},
                "total_ratings": 1
            }}
        ]
        result = list(mongo.db.reviews.aggregate(pipeline))
        return result[0] if result else {"average_rating": 0, "total_ratings": 0}

    @classmethod
    def get_all_with_ratings(cls, search_query=None, sort_by="title", sort_order="asc", page=1, per_page=10):
        pipeline = []

        if search_query:
            pipeline.append({
                '$match': {
                    '$or': [
                        {'title': {'$regex': search_query, '$options': 'i'}},
                        {'author': {'$regex': search_query, '$options': 'i'}},
                        {'description': {'$regex': search_query, '$options': 'i'}}
                    ]
                }
            })

        pipeline.extend([
            {
                '$lookup': {
                    'from': 'reviews',
                    'localField': '_id',
                    'foreignField': 'book_id',
                    'as': 'reviews'
                }
            },
            {
                '$addFields': {
                    'average_rating': {
                        '$cond': [
                            {'$eq': [{'$size': '$reviews'}, 0]},
                            0,
                            {'$round': [{'$avg': '$reviews.rating'}, 1]}
                        ]
                    },
                    'total_ratings': {'$size': '$reviews'}
                }
            }
        ])

        sort_direction = 1 if sort_order == 'asc' else -1
        sort_field = {
            'rating': 'average_rating',
            'popularity': 'total_ratings',
            'title': 'title'
        }.get(sort_by, 'title')

        pipeline.append({'$sort': {sort_field: sort_direction}})
        pipeline.extend([
            {'$skip': (page - 1) * per_page},
            {'$limit': per_page}
        ])

        results = list(cls._get_collection().aggregate(pipeline))
        return convert_object_id(results)