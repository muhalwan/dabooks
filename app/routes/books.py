from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from app.models.review import Review
from app.extensions import mongo
from bson import ObjectId
from datetime import datetime
from functools import wraps

def convert_object_id(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {key: convert_object_id(value) for key, value in obj.items()}
    if isinstance(obj, list):
        return [convert_object_id(item) for item in obj]
    return obj

books_bp = Blueprint('books', __name__)

@books_bp.route('', methods=['GET'])
def get_books():
    try:
        search_query = request.args.get('search', '').strip()
        sort_by = request.args.get('sort', 'title')
        sort_order = request.args.get('order', 'asc')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 30))

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
        if sort_by == 'rating':
            pipeline.append({'$sort': {'average_rating': sort_direction}})
        elif sort_by == 'popularity':
            pipeline.append({'$sort': {'total_ratings': sort_direction}})
        else:
            pipeline.append({'$sort': {'title': sort_direction}})

        count_pipeline = pipeline.copy()
        count_pipeline.append({'$count': 'total'})
        total_result = list(mongo.db.books.aggregate(count_pipeline))
        total = total_result[0]['total'] if total_result else 0

        pipeline.extend([
            {'$skip': (page - 1) * per_page},
            {'$limit': per_page}
        ])

        books = list(mongo.db.books.aggregate(pipeline))
        books = convert_object_id(books)

        return jsonify({
            "data": books,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching books: {str(e)}")
        return jsonify({"message": f"Error fetching books: {str(e)}"}), 500

@books_bp.route('/<book_id>', methods=['GET'])
def get_book(book_id):
    try:
        pipeline = [
            {'$match': {'_id': ObjectId(book_id)}},
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
        ]

        books = list(mongo.db.books.aggregate(pipeline))
        if not books:
            return jsonify({"message": "Book not found"}), 404

        book = convert_object_id(books[0])

        return jsonify({
            "data": {
                'id': book['_id'],
                'title': book['title'],
                'author': book['author'],
                'description': book.get('description', ''),
                'average_rating': book['average_rating'],
                'total_ratings': book['total_ratings']
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching book: {str(e)}")
        return jsonify({"message": f"Error fetching book: {str(e)}"}), 500

@books_bp.route('/<book_id>/reviews', methods=['GET'])
def get_book_reviews(book_id):
    try:
        reviews = Review.get_book_reviews(book_id)
        reviews = convert_object_id(reviews)
        return jsonify({"data": reviews}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching reviews: {str(e)}")
        return jsonify({"message": f"Error fetching reviews: {str(e)}"}), 500

@books_bp.route('/<book_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(book_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        Review.create(
            data['text'],
            data['rating'],
            current_user_id,
            book_id
        )
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        current_app.logger.error(f"Error adding review: {str(e)}")
        return jsonify({"message": f"Error adding review: {str(e)}"}), 500

@books_bp.route('', methods=['POST'])
@jwt_required()
def add_book():
    try:
        data = request.get_json()
        result = Book.create(
            data['title'],
            data['author'],
            data.get('description', '')
        )
        return jsonify({"message": "Book added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error adding book: {str(e)}")
        return jsonify({"message": f"Error adding book: {str(e)}"}), 500