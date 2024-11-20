from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middleware.request_validators import validate_schema
from app.schemas.book import BookSchema, ReviewSchema
from app.models.book import Book
from app.models.review import Review
from app.utils.responses import success_response, error_response
from app.utils.helpers import parse_pagination_params, parse_sort_params, convert_object_id
from bson import ObjectId
from app.constants import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

books_bp = Blueprint('books', __name__)


@books_bp.route('', methods=['GET'])
def get_books():
    try:
        search = request.args.get('search', '').strip()
        sort_by, sort_order = parse_sort_params(request.args)
        page, per_page = parse_pagination_params(request.args)

        books = Book.get_all_with_ratings(
            search_query=search,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            per_page=per_page
        )

        return success_response(data=books)
    except Exception as e:
        current_app.logger.error(f"Error fetching books: {str(e)}")
        return error_response("Error fetching books", HTTP_400_BAD_REQUEST)


@books_bp.route('/<book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
    try:
        book = Book.find_by_id(book_id)
        if not book:
            return error_response("Book not found", HTTP_404_NOT_FOUND)

        return success_response(data=convert_object_id(book))
    except Exception as e:
        current_app.logger.error(f"Error fetching book: {str(e)}")
        return error_response("Error fetching book", HTTP_400_BAD_REQUEST)


@books_bp.route('/<book_id>/reviews', methods=['GET'])
def get_book_reviews(book_id):
    try:
        page, per_page = parse_pagination_params(request.args)
        reviews = Review.get_book_reviews(book_id, page=page, per_page=per_page)
        return success_response(data=convert_object_id(reviews))
    except Exception as e:
        current_app.logger.error(f"Error fetching reviews: {str(e)}")
        return error_response("Error fetching reviews", HTTP_400_BAD_REQUEST)


@books_bp.route('/<book_id>/reviews', methods=['POST'])
@jwt_required()
@validate_schema(ReviewSchema)
def add_review(book_id, validated_data):
    try:
        user_id = get_jwt_identity()

        # Check if book exists
        book = Book.find_by_id(book_id)
        if not book:
            return error_response("Book not found", HTTP_404_NOT_FOUND)

        # Check if user already reviewed this book
        existing_review = Review.find_one({
            "user_id": ObjectId(user_id),
            "book_id": ObjectId(book_id)
        })
        if existing_review:
            return error_response("You have already reviewed this book", HTTP_400_BAD_REQUEST)

        review_id = Review.create(
            user_id=user_id,
            book_id=book_id,
            **validated_data
        )

        return success_response(
            message="Review added successfully",
            data={"review_id": str(review_id)},
            code=HTTP_201_CREATED
        )
    except Exception as e:
        current_app.logger.error(f"Error adding review: {str(e)}")
        return error_response("Error adding review", HTTP_400_BAD_REQUEST)