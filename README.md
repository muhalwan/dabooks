# Dabooks Backend

A Flask-based REST API for the Dabooks book review platform.

## ✨ Features

- 🔐 JWT Authentication
- 📚 Book management
- ⭐ Review system
- 👥 User profiles
- 🔍 Search functionality

## 🛠 Tech Stack

- **Flask** - Web Framework
- **MongoDB** - Database
- **PyMongo** - MongoDB Integration
- **JWT** - Authentication
- **Python 3.9+** - Language

## 🚀 Getting Started

1. **Set up virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Run development server**
```bash
python run.py
```

## 🔑 Environment Variables

Required variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
FLASK_ENV=development
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Books
- `GET /books` - Get all books
- `GET /books/{id}` - Get single book
- `GET /books/{id}/reviews` - Get book reviews
- `POST /books/{id}/reviews` - Add review (Auth required)

### Users
- `GET /users/profile` - Get user profile
- `GET /users/search` - Search users
- `GET /users/{id}` - Get public profile

## 📁 Project Structure

```
app/
├── models/           # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/          # Utility functions
└── __init__.py     # App initialization
```

## 🔧 Development

- Uses Flask development server
- Auto-reload enabled in debug mode
- Logs available in `logs/dabooks.log`

## 📝 Notes

- MongoDB 4.0+ required
- Supports CORS for frontend integration
- JWT tokens expire after 1 hour

```
Key improvements:
1. Clean, organized layout
2. Clear setup instructions
3. Emojis for better readability
4. Comprehensive structure overview
5. Important notes and requirements
6. Environment setup details
7. API endpoint documentation
8. Tech stack details