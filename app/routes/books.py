from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from app.models.review import Review

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


@books_bp.route('', methods=['POST'])
@jwt_required()
def add_book():
    data = request.get_json()
    try:
        result = Book.create(
            data['title'],
            data['author'],
            data.get('description', '')
        )
        return jsonify({"message": "Book added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"message": f"Error adding book: {str(e)}"}), 500


@books_bp.route('/<book_id>/reviews', methods=['POST', 'GET'])
@jwt_required(optional=True)
def book_reviews(book_id):
    if request.method == 'POST':
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"message": "Authentication required"}), 401

        data = request.get_json()
        try:
            Review.create(
                data['text'],
                data['rating'],
                current_user_id,
                book_id
            )
            return jsonify({"message": "Review added successfully"}), 201
        except Exception as e:
            return jsonify({"message": f"Error adding review: {str(e)}"}), 500

    else:  # GET
        try:
            reviews = Review.get_book_reviews(book_id)
            return jsonify([{
                'id': str(review['_id']),
                'text': review['text'],
                'rating': review['rating'],
                'date_posted': review['created_at'].isoformat(),
                'user': review['user']['username']
            } for review in reviews]), 200
        except Exception as e:
            return jsonify({"message": f"Error fetching reviews: {str(e)}"}), 500


@books_bp.route('/<book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
    try:
        book = Book.get_by_id(book_id)
        if not book:
            return jsonify({"message": "Book not found"}), 404

        rating_stats = Book.get_rating_stats(book_id)

        return jsonify({
            'id': str(book['_id']),
            'title': book['title'],
            'author': book['author'],
            'description': book.get('description', ''),
            'average_rating': rating_stats['average_rating'],
            'total_ratings': rating_stats['total_ratings']
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching book: {str(e)}"}), 500
