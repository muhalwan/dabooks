from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.find_by_username(data['username']):
        return jsonify({"message": "Username already exists"}), 400

    if User.find_by_email(data['email']):
        return jsonify({"message": "Email already exists"}), 400

    try:
        User.create(data['username'], data['email'], data['password'])
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"Error creating user: {str(e)}"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.find_by_username(data['username'])

        if not user:
            return jsonify({"message": "User not found"}), 401

        if check_password_hash(user['password'], data['password']):
            access_token = create_access_token(identity=str(user['_id']))
            return jsonify({
                "access_token": access_token,
                "username": user['username']
            }), 200

        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": f"Error during login: {str(e)}"}), 500