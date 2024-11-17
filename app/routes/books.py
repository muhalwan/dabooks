from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from app.models.review import Review
from app.extensions import mongo
from datetime import datetime
import math
from bson import ObjectId

books_bp = Blueprint('books', __name__)


@books_bp.route('', methods=['GET'])
def get_books():
    try:
        # Add caching
        cache_key = 'all_books'
        cached_books = mongo.db.cache.find_one({'key': cache_key})

        if cached_books and (datetime.utcnow() - cached_books['timestamp']).seconds < 300:
            return jsonify(cached_books['data']), 200

        # Add pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 12))
        skip = (page - 1) * per_page

        # Optimize query
        pipeline = [
            {'$skip': skip},
            {'$limit': per_page},
            {
                '$lookup': {
                    'from': 'reviews',
                    'let': {'book_id': '$_id'},
                    'pipeline': [
                        {'$match': {'$expr': {'$eq': ['$book_id', '$$book_id']}}},
                        {'$group': {
                            '_id': None,
                            'avg_rating': {'$avg': '$rating'},
                            'count': {'$sum': 1}
                        }}
                    ],
                    'as': 'review_stats'
                }
            },
            {'$project': {
                'title': 1,
                'author': 1,
                'description': 1,
                'avg_rating': {'$arrayElemAt': ['$review_stats.avg_rating', 0]},
                'review_count': {'$arrayElemAt': ['$review_stats.count', 0]}
            }}
        ]

        books = list(mongo.db.books.aggregate(pipeline))
        total = mongo.db.books.count_documents({})

        result = {
            'books': [{
                'id': str(book['_id']),
                'title': book['title'],
                'author': book['author'],
                'description': book.get('description', ''),
                'average_rating': round(book.get('avg_rating', 0), 1),
                'review_count': book.get('review_count', 0)
            } for book in books],
            'total': total,
            'page': page,
            'total_pages': math.ceil(total / per_page)
        }

        # Update cache
        mongo.db.cache.update_one(
            {'key': cache_key},
            {
                '$set': {
                    'data': result,
                    'timestamp': datetime.utcnow()
                }
            },
            upsert=True
        )

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@books_bp.route('/<book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
    try:
        pipeline = [
            {'$match': {'_id': ObjectId(book_id)}},
            {
                '$lookup': {
                    'from': 'reviews',
                    'let': {'book_id': '$_id'},
                    'pipeline': [
                        {'$match': {'$expr': {'$eq': ['$book_id', '$$book_id']}}},
                        {'$group': {
                            '_id': None,
                            'avg_rating': {'$avg': '$rating'},
                            'count': {'$sum': 1}
                        }}
                    ],
                    'as': 'review_stats'
                }
            }
        ]

        book = list(mongo.db.books.aggregate(pipeline))

        if not book:
            return jsonify({"message": "Book not found"}), 404

        book = book[0]
        review_stats = book.get('review_stats', [{}])[0]

        return jsonify({
            'id': str(book['_id']),
            'title': book['title'],
            'author': book['author'],
            'description': book.get('description', ''),
            'average_rating': round(review_stats.get('avg_rating', 0), 1),
            'total_ratings': review_stats.get('count', 0)
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching book: {str(e)}"}), 500


@books_bp.route('/<book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
    try:
        if not ObjectId.is_valid(book_id):
            return jsonify({"message": "Invalid book ID format"}), 400

        # First, get the book
        book = mongo.db.books.find_one({'_id': ObjectId(book_id)})

        if not book:
            return jsonify({"message": "Book not found"}), 404

        # Then get reviews stats if they exist
        reviews_stats = mongo.db.reviews.aggregate([
            {'$match': {'book_id': ObjectId(book_id)}},
            {'$group': {
                '_id': None,
                'avg_rating': {'$avg': '$rating'},
                'count': {'$sum': 1}
            }}
        ]).next() if mongo.db.reviews.count_documents({'book_id': ObjectId(book_id)}) > 0 else None

        return jsonify({
            'id': str(book['_id']),
            'title': book['title'],
            'author': book['author'],
            'description': book.get('description', ''),
            'average_rating': round(reviews_stats['avg_rating'],
                                    1) if reviews_stats and 'avg_rating' in reviews_stats else 0,
            'total_ratings': reviews_stats['count'] if reviews_stats and 'count' in reviews_stats else 0
        }), 200

    except Exception as e:
        print(f"Error fetching book: {str(e)}")  # Debug log
        return jsonify({"message": f"Error fetching book: {str(e)}"}), 500