from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId
from flask_cors import CORS
import os

app = Flask(__name__)

# MongoDB Atlas Configuration
DB_PASSWORD = "Ayamgoreng12"  # Replace with your actual password
app.config["MONGO_URI"] = f"mongodb+srv://muhalwan12:{DB_PASSWORD}@dabooks.kxxkp.mongodb.net/dabooks?retryWrites=true&w=majority"
app.config['JWT_SECRET_KEY'] = '9405c08987ff2b80fa557fd9c85cb934dbcf4b4a7b6a8044996641b0673a22ff'  # Change this to a secure secret key

# Initialize extensions
mongo = PyMongo(app)
jwt = JWTManager(app)
CORS(app)

# Helper function to convert ObjectId to string
def convert_object_id(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Authentication routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user exists
    if mongo.db.users.find_one({"username": data['username']}):
        return jsonify({"message": "Username already exists"}), 400
    
    if mongo.db.users.find_one({"email": data['email']}):
        return jsonify({"message": "Email already exists"}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = {
        "username": data['username'],
        "email": data['email'],
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    try:
        mongo.db.users.insert_one(new_user)
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Error creating user", "error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({"username": data['username']})
    
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify({
            "access_token": access_token,
            "username": user['username']
        }), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

# Book routes
@app.route('/books', methods=['GET'])
def get_books():
    books = list(mongo.db.books.find())
    return jsonify([{
        'id': str(book['_id']),
        'title': book['title'],
        'author': book['author'],
        'description': book.get('description', '')
    } for book in books]), 200

@app.route('/books', methods=['POST'])
@jwt_required()
def add_book():
    data = request.get_json()
    new_book = {
        "title": data['title'],
        "author": data['author'],
        "description": data.get('description', ''),
        "created_at": datetime.utcnow()
    }
    
    try:
        result = mongo.db.books.insert_one(new_book)
        new_book['_id'] = str(result.inserted_id)
        return jsonify({
            'id': str(new_book['_id']),
            'title': new_book['title'],
            'author': new_book['author'],
            'description': new_book['description']
        }), 201
    except Exception as e:
        return jsonify({"message": "Error adding book", "error": str(e)}), 500

# Review routes
@app.route('/books/<book_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(book_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify book exists
    book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"message": "Book not found"}), 404
    
    new_review = {
        "text": data['text'],
        "rating": data['rating'],
        "user_id": ObjectId(current_user_id),
        "book_id": ObjectId(book_id),
        "created_at": datetime.utcnow()
    }
    
    try:
        mongo.db.reviews.insert_one(new_review)
        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Error adding review", "error": str(e)}), 500

@app.route('/books/<book_id>/reviews', methods=['GET'])
def get_book_reviews(book_id):
    try:
        pipeline = [
            {"$match": {"book_id": ObjectId(book_id)}},
            {"$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }},
            {"$unwind": "$user"}
        ]
        
        reviews = list(mongo.db.reviews.aggregate(pipeline))
        
        return jsonify([{
            'id': str(review['_id']),
            'text': review['text'],
            'rating': review['rating'],
            'date_posted': review['created_at'].isoformat(),
            'user': review['user']['username']
        } for review in reviews]), 200
    except Exception as e:
        return jsonify({"message": "Error fetching reviews", "error": str(e)}), 500

# User profile route
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({"message": "User not found"}), 404
        
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
        
        reviews = list(mongo.db.reviews.aggregate(pipeline))
        
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
        return jsonify({"message": "Error fetching profile", "error": str(e)}), 500

# Test route
@app.route('/test', methods=['GET'])
def test_connection():
    try:
        # Test the connection by counting users
        user_count = mongo.db.users.count_documents({})
        return jsonify({
            "message": "Successfully connected to MongoDB Atlas",
            "user_count": user_count
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Error connecting to database",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)