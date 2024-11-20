from flask import Blueprint, request, current_app
from flask_jwt_extended import create_access_token
from app.middleware.request_validators import validate_schema
from app.schemas.auth import LoginSchema, RegisterSchema
from app.models.user import User
from app.utils.responses import success_response, error_response
from app.constants import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@validate_schema(RegisterSchema)
def register(validated_data):
    try:
        if User.find_by_username(validated_data['username']):
            return error_response("Username already exists", HTTP_400_BAD_REQUEST)

        if User.find_by_email(validated_data['email']):
            return error_response("Email already exists", HTTP_400_BAD_REQUEST)

        user_id = User.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
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
@validate_schema(LoginSchema)
def login(validated_data):
    try:
        user = User.find_by_username(validated_data['username'])

        if not user or not User.check_password(user, validated_data['password']):
            return error_response("Invalid username or password", HTTP_401_UNAUTHORIZED)

        access_token = create_access_token(identity=str(user['_id']))

        return success_response(data={
            "access_token": access_token,
            "username": user['username'],
            "user_id": str(user['_id'])
        })
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return error_response("Login failed", HTTP_400_BAD_REQUEST)