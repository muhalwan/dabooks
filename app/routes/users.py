from flask import Blueprint, current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import mongo
from app.utils.responses import success_response, error_response
from app.utils.helpers import convert_object_id, parse_pagination_params
from bson import ObjectId
from app.constants import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

users_bp = Blueprint('users', __name__)

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
            {"$sort": {"created_at": -1}},
            {"$project": {
                "book_title": "$book.title",
                "rating": 1,
                "text": 1,
                "date_posted": "$created_at"
            }}
        ]

        user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
        reviews = list(mongo.db.reviews.aggregate(pipeline))

        if not user:
            return error_response("User not found", HTTP_404_NOT_FOUND)

        return success_response(data={
            "username": user['username'],
            "email": user['email'],
            "reviews": convert_object_id(reviews)
        })
    except Exception as e:
        current_app.logger.error(f"Error fetching profile: {str(e)}")
        return error_response("Error fetching profile", HTTP_400_BAD_REQUEST)

@users_bp.route('/profile/reviews', methods=['GET'])
@jwt_required()
def get_user_reviews():
    try:
        current_user_id = get_jwt_identity()
        page, per_page = parse_pagination_params(request.args)

        pipeline = [
            {"$match": {"user_id": ObjectId(current_user_id)}},
            {"$lookup": {
                "from": "books",
                "localField": "book_id",
                "foreignField": "_id",
                "as": "book"
            }},
            {"$unwind": "$book"},
            {"$sort": {"created_at": -1}},
            {"$skip": (page - 1) * per_page},
            {"$limit": per_page},
            {"$project": {
                "book_title": "$book.title",
                "book_author": "$book.author",
                "rating": 1,
                "text": 1,
                "date_posted": "$created_at"
            }}
        ]

        reviews = list(mongo.db.reviews.aggregate(pipeline))
        return success_response(data=convert_object_id(reviews))
    except Exception as e:
        current_app.logger.error(f"Error fetching user reviews: {str(e)}")
        return error_response("Error fetching user reviews", HTTP_400_BAD_REQUEST)