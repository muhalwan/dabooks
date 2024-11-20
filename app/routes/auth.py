from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from app.models.user import User
from app.utils.responses import success_response, error_response
from app.constants import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return error_response("Missing required fields", HTTP_400_BAD_REQUEST)

        # Check if username exists
        if User.find_by_username(data['username']):
            return error_response("Username already exists", HTTP_400_BAD_REQUEST)

        # Check if email exists
        if User.find_by_email(data['email']):
            return error_response("Email already exists", HTTP_400_BAD_REQUEST)

        # Create user
        user_id = User.create(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )

        return success_response(
            message="User registered successfully",
            data={"user_id": str(user_id)},
            code=HTTP_201_CREATED
        )
    except Exception as e:
        current_app.logger.error(f"Registration error: {str(e)}")
        return error_response(str(e), HTTP_400_BAD_REQUEST)


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # Validate required fields
        if not all(field in data for field in ['username', 'password']):
            return error_response("Missing username or password", HTTP_400_BAD_REQUEST)

        user = User.find_by_username(data['username'])

        if not user or not User.check_password(user, data['password']):
            return error_response("Invalid username or password", HTTP_401_UNAUTHORIZED)

        access_token = create_access_token(identity=str(user['_id']))

        return success_response(data={
            "access_token": access_token,
            "username": user['username']
        })
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return error_response("Login failed", HTTP_400_BAD_REQUEST)