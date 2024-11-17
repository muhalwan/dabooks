# Dabooks Frontend

A React-based web application for browsing and reviewing books, featuring user authentication and a modern UI built with Tailwind CSS.

## Features

- **User Authentication**
 - User registration
 - Login/logout functionality
 - Protected routes for authenticated users

- **Book Management**
 - Browse book collection
 - View book details
 - Mobile-responsive layout

- **Review System**
 - Write book reviews
 - Star rating system
 - View all reviews for each book

## Tech Stack

- **React**: UI framework
- **React Router**: Navigation and routing
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling
- **Context API**: State management
- **JWT**: Authentication tokens

## Setup

1. Clone the repository
git clone <repository-url>
git checkout frontend

2. Install dependencies
npm install

3. Create `.env` file
VITE_API_URL=your_backend_api_url

4. Run development server
npm run dev

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Making Changes

1. Create new components in `src/components`
2. Add new pages in `src/pages`
3. Update routes in `App.jsx`

## Deployment

The frontend is deployed on Heroku. For deployment:

1. Login to Heroku
heroku login

2. Deploy changes
git add .
git commit -m "Your changes"
git push heroku-frontend frontend:main

## Environment Variables

Required environment variables:
- `VITE_API_URL`: Backend API URL

## Features

### Authentication Flow
- Registration with username/email/password
- Login with username/password
- Token-based authentication
- Protected routes

### Book Features
- Grid layout of book cards
- Detailed book view
- Review submission form
- Star rating system

### UI/UX
- Responsive design
- Loading states
- Error handling
- Clean and modern interface

## Contributing

1. Create a feature branch
2. Make changes
3. Submit pull request

## Style Guide

- Tailwind CSS for styling
- Mobile-first approach
- Consistent component structure
- Proper error handling
- Loading states for async operations