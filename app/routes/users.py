from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import mongo
from bson import ObjectId

users_bp = Blueprint('users', __name__)


@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()

    try:
        pipeline = [
            {"$match": {"user_id": ObjectId(current_user_id)}},
            {"$lookup": {
                "from": "books",
                "localField": "book_id",
                "foreignField": "_id",
                "as": "book"
            }},
            {"$unwind": "$book"}
        ]

        user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
        reviews = list(mongo.db.reviews.aggregate(pipeline))

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "username": user['username'],
            "email": user['email'],
            "reviews": [{
                'book_title': review['book']['title'],
                'rating': review['rating'],
                'text': review['text'],
                'date_posted': review['created_at'].isoformat()
            } for review in reviews]
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching profile: {str(e)}"}), 500