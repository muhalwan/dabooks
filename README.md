# dabooks

A book review platform built with React and Flask where users can browse books, write reviews, and rate their reading experiences.

## Features

- User authentication (login/register)
- Book browsing with detailed views
- Review and rating system
- Responsive design using Tailwind CSS

## Tech Stack

**Frontend:**
- React
- React Router
- Tailwind CSS
- Context API for state management

**Backend:**
- Flask
- MongoDB
- JWT Authentication

## Setup

### Prerequisites
- Node.js
- Python 3.x
- MongoDB

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

### Environment Variables
Create `.env` in backend directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user

### Books
- GET `/books` - Get all books
- GET `/books/:id` - Get single book
- GET `/books/:id/reviews` - Get book reviews
- POST `/books/:id/reviews` - Add book review

## Project Structure
```
frontend/
  ├── src/
  │   ├── components/
  │   ├── context/
  │   ├── layouts/
  │   ├── pages/
  │   └── services/
backend/
  ├── app/
  │   ├── models/
  │   └── routes/
  └── run.py
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.