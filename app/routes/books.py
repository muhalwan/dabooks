from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from app.models.review import Review
from app.extensions import mongo
from bson import ObjectId

books_bp = Blueprint('books', __name__)


@books_bp.route('', methods=['GET'])
def get_books():
    try:
        search_query = request.args.get('search', '').strip()
        sort_by = request.args.get('sort', 'title')  # default sort by title
        sort_order = request.args.get('order', 'asc')  # default ascending

        pipeline = []

        # Add search if query provided
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

        # Add ratings aggregation
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

        # Add sorting
        sort_direction = 1 if sort_order == 'asc' else -1
        if sort_by == 'rating':
            pipeline.append({'$sort': {'average_rating': sort_direction}})
        elif sort_by == 'popularity':
            pipeline.append({'$sort': {'total_ratings': sort_direction}})
        else:  # default sort by title
            pipeline.append({'$sort': {'title': sort_direction}})

        books = list(mongo.db.books.aggregate(pipeline))

        return jsonify([{
            'id': str(book['_id']),
            'title': book['title'],
            'author': book['author'],
            'description': book.get('description', ''),
            'average_rating': book['average_rating'],
            'total_ratings': book['total_ratings']
        } for book in books]), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching books: {str(e)}"}), 500


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

        book = books[0]
        return jsonify({
            'id': str(book['_id']),
            'title': book['title'],
            'author': book['author'],
            'description': book.get('description', ''),
            'average_rating': book['average_rating'],
            'total_ratings': book['total_ratings']
        }), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching book: {str(e)}"}), 500