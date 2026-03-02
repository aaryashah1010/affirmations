# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack affirmation and wellness application. Users track personal problems/challenges and receive AI-generated personalized affirmations using Gemini AI. The app uses Supabase for database and authentication.

## Commands

### Backend (Node.js/Express)
```bash
cd Backend
npm install          # Install dependencies
npm run dev          # Start development server (with nodemon)
npm start            # Start production server
```

### Frontend (React/Vite)
```bash
cd Frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Backend Structure
- **Express server** (`Backend/index.js`) - Entry point with CORS, helmet, rate limiting
- **Routes** in `Backend/routes/` - auth.js, problems.js, affirmations.js, sessions.js
- **Controllers** in `Backend/controllers/` - Handle request logic
- **Middleware** - JWT authentication via Supabase
- **AI integration** - Uses Google Gemini AI for generating affirmations

### Frontend Structure
- **React 19** with Vite for bundling
- **React Router** for navigation with protected routes
- **Module-based organization**:
  - `src/modules/auth/` - Login/Register pages and forms
  - `src/modules/dashboard/` - Main app pages (Dashboard, Problems, Sessions, Progress)
  - `src/shared/` - Reusable hooks (useAuth), components (Button, Modal, Loader), utilities
- **API layer** - Axios-based client in `src/api/`

### Data Flow
1. Frontend sends requests to Express backend (`/api/*` routes)
2. Backend uses Supabase client for database operations
3. Affirmations are generated via Gemini AI based on user problems

## Environment Variables

### Backend (.env)
```
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
PORT=5000, NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```
