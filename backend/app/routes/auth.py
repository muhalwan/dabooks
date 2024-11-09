from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import mongo
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from bson import ObjectId
import logging

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ["username", "email", "password"]):
            return jsonify({"message": "Missing required fields"}), 400
            
        # Ensure MongoDB connection
        if not mongo.db:
            return jsonify({"message": "Database connection not available"}), 503

        # Check for existing user
        existing_user = mongo.db.users.find_one({
            "$or": [
                {"username": data['username']},
                {"email": data['email']}
            ]
        })
        
        if existing_user:
            if existing_user['username'] == data['username']:
                return jsonify({"message": "Username already exists"}), 400
            return jsonify({"message": "Email already exists"}), 400

        # Create user
        hashed_password = generate_password_hash(data['password'])
        new_user = {
            "username": data['username'],
            "email": data['email'],
            "password": hashed_password
        }
        
        result = mongo.db.users.insert_one(new_user)
        
        return jsonify({
            "message": "User created successfully",
            "id": str(result.inserted_id)
        }), 201
        
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        current_app.logger.error(f"Database connection error: {str(e)}")
        return jsonify({"message": "Database connection error"}), 503
    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({"message": "Registration failed"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ["username", "password"]):
            return jsonify({"message": "Missing username or password"}), 400
            
        # Ensure MongoDB connection
        if not mongo.db:
            return jsonify({"message": "Database connection not available"}), 503

        # Find user
        user = mongo.db.users.find_one({"username": data['username']})
        
        if user and check_password_hash(user['password'], data['password']):
            access_token = create_access_token(identity=str(user['_id']))
            return jsonify({
                "access_token": access_token,
                "username": user['username']
            }), 200
        
        return jsonify({"message": "Invalid credentials"}), 401
        
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        current_app.logger.error(f"Database connection error: {str(e)}")
        return jsonify({"message": "Database connection error"}), 503
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({"message": "Login failed"}), 500