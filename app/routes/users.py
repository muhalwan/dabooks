from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import mongo
from app.utils.helpers import convert_object_id
from app.utils.responses import success_response, error_response
from bson import ObjectId
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return success_response(data=[])

        # Search users by username using regex
        users = list(mongo.db.users.find(
            {"username": {"$regex": query, "$options": "i"}},
            {"password": 0}  # Exclude password field
        ).limit(10))  # Limit to 10 results

        # Get review counts and convert ObjectId
        serialized_users = []
        for user in users:
            user_data = {
                '_id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'reviews_count': mongo.db.reviews.count_documents({"user_id": user['_id']})
            }
            serialized_users.append(user_data)

        return success_response(data=serialized_users)
    except Exception as e:
        return error_response(str(e))

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    try:
        # Get user data
        user = mongo.db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}  # Exclude password
        )

        if not user:
            return error_response("User not found", code=404)

        # Get user's reviews with book details
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$lookup": {
                "from": "books",
                "localField": "book_id",
                "foreignField": "_id",
                "as": "book"
            }},
            {"$unwind": "$book"},
            {"$project": {
                "_id": {'$toString': '$_id'},
                "text": 1,
                "rating": 1,
                "date_posted": "$created_at",
                "book_id": {'$toString': '$book._id'},
                "book_title": "$book.title",
                "book_author": "$book.author"
            }},
            {"$sort": {"date_posted": -1}}  # Most recent reviews first
        ]

        reviews = list(mongo.db.reviews.aggregate(pipeline))

        # Prepare user data
        user_data = {
            '_id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'reviews': [{
                '_id': review['_id'],
                'text': review['text'],
                'rating': review['rating'],
                'date_posted': review['date_posted'].isoformat() if isinstance(review['date_posted'], datetime) else review['date_posted'],
                'book_id': review['book_id'],
                'book_title': review['book_title'],
                'book_author': review['book_author']
            } for review in reviews]
        }

        return success_response(data=user_data)
    except Exception as e:
        return error_response(str(e))

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        pipeline = [
            {"$match": {"user_id": ObjectId(current_user_id)}},
            {"$lookup": {
                "from": "books",
                "localField": "book_id",
                "foreignField": "_id",
                "as": "book"
            }},
            {"$unwind": "$book"},
            {"$project": {
                "_id": {'$toString': '$_id'},
                "text": 1,
                "rating": 1,
                "date_posted": "$created_at",
                "book_title": "$book.title"
            }},
            {"$sort": {"date_posted": -1}}
        ]

        user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
        reviews = list(mongo.db.reviews.aggregate(pipeline))

        if not user:
            return error_response("User not found", code=404)

        return success_response(data={
            "username": user['username'],
            "email": user['email'],
            "reviews": [{
                '_id': review['_id'],
                'text': review['text'],
                'rating': review['rating'],
                'date_posted': review['date_posted'].isoformat() if isinstance(review['date_posted'], datetime) else review['date_posted'],
                'book_title': review['book_title']
            } for review in reviews]
        })
    except Exception as e:
        return error_response(str(e))