# Dabooks Frontend

A modern book review platform built with React and Tailwind CSS.

## ✨ Features

- 📚 Browse and search books
- ⭐ Rate and review books
- 🌓 Dark/light mode
- 🔍 Search functionality
- 🔄 Real-time sorting (title, rating, popularity)
- 👤 User profiles with review history
- 🎨 Modern, minimalist UI

## 🛠 Tech Stack

- **React** - UI Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Context API** - State Management

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone 
cd dabooks/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🔧 Configuration

Edit `src/config.js` to set up:
- API URL
- Environment settings
- Default configurations

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── auth/          # Authentication components
│   ├── book/          # Book-related components
│   ├── profile/       # User profile components
│   └── shared/        # Common components
├── context/           # React Context providers
├── pages/             # Main page components
├── utils/             # Utility functions
└── assets/           # Static assets
```

## 📝 Notes

- Requires Node.js 14+
- Uses Vite as build tool
- Backend API required for full functionality