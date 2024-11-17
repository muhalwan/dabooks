# Dabooks Backend

A Flask-based REST API that powers the Dabooks web application, handling user authentication, book management, and review functionality.

## Features

- **User Authentication**
  - JWT-based authentication
  - User registration and login
  - Password hashing for security

- **Book Management**
  - Browse books collection
  - Detailed book information
  - Protected routes for authenticated users

- **Review System**
  - Add reviews to books
  - Rate books with star rating
  - View all reviews for a book

## Tech Stack

- **Flask**: Web framework
- **MongoDB**: Database
- **PyMongo**: MongoDB integration
- **Flask-JWT-Extended**: Authentication
- **Werkzeug**: Password hashing
- **Python-dotenv**: Environment management
- **Flask-CORS**: Cross-origin resource sharing

## API Endpoints

### Authentication
POST /auth/register
POST /auth/login

### Books
GET /books - Get all books
GET /books/{id} - Get single book
GET /books/{id}/reviews - Get book reviews
POST /books/{id}/reviews - Add review (Auth required)

### Users
GET /users/profile - Get user profile (Auth required)
a
## Setup

1. Clone the repository
git clone <repository-url>
git checkout backend

2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

3. Install dependencies
pip install -r requirements.txt

4. Create `.env` file with required variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret

5. Run the application
python run.py

## Development

### Adding New Features

1. Create new models in `app/models`
2. Add routes in `app/routes`
3. Update `app/__init__.py` if adding new blueprints

### Testing API Endpoints

Using curl:
# Get books
curl http://localhost:5000/books

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

## Deployment

The API is deployed on Heroku. For deployment:

1. Ensure you have Heroku CLI installed
heroku login

2. Deploy to Heroku
git add .
git commit -m "Your changes"
git push heroku-backend backend:main

3. Check logs
heroku logs --tail --app your-app-name

## Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT token generation

## Security

- Passwords are hashed using Werkzeug's security features
- JWT tokens required for protected routes
- CORS configured for frontend domain
- Environment variables for sensitive data