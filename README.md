# TaskPlanet Social — Full Stack Mini Social App

A TaskPlanet-inspired social feed built with **React.js**, **Node.js + Express**, and **MongoDB**.

> Built as a web app (React.js). React Native is optional and not included.

## Features

- **Authentication** — Email/password signup & login with JWT
- **Create Post** — Text, image, or both (either field is optional)
- **Public Feed** — All posts visible to everyone with username, content, likes & comments count
- **Like & Comment** — Toggle likes and add comments; usernames stored in DB
- **Pagination** — Efficient "Load More" pagination on the feed
- **Search & Sort** — Search by username/text, sort by latest / most liked / most commented
- **Responsive UI** — Material UI, inspired by TaskPlanet Social page

## Project Structure

```
3W_social_media_app/
├── backend/          # Node.js + Express API
│   ├── models/       # User & Post (MongoDB)
│   ├── routes/       # Auth & Posts endpoints
│   └── middleware/   # JWT auth
└── frontend/         # React + Vite + MUI
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── services/
```

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React.js, Vite, MUI     |
| Backend  | Node.js, Express        |
| Database | MongoDB (2 collections) |
| Auth     | JWT + bcrypt            |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint                    | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| POST   | `/api/auth/signup`          | No   | Create account       |
| POST   | `/api/auth/login`           | No   | Login                |
| GET    | `/api/auth/me`              | Yes  | Current user         |
| GET    | `/api/posts`                | No   | Paginated feed       |
| POST   | `/api/posts`                | Yes  | Create post          |
| POST   | `/api/posts/:id/like`       | Yes  | Toggle like          |
| POST   | `/api/posts/:id/comments`   | Yes  | Add comment          |

### Query params for feed

- `page` — Page number (default: 1)
- `limit` — Posts per page (default: 10, max: 20)
- `sort` — `latest` | `mostLiked` | `mostCommented`
- `search` — Filter by username or post text

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist IP `0.0.0.0/0` (for Render)
3. Copy connection string to backend env as `MONGODB_URI`

### Backend — Render

1. Connect GitHub repo on [render.com](https://render.com)
2. Create **Web Service** → root directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel frontend URL)

### Frontend — Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

## MongoDB Collections

**users** — `username`, `email`, `password` (hashed), `profilePic`

**posts** — `username`, `profilePic`, `text`, `imageUrl`, `likes[]`, `comments[]`, `createdAt`

## Author

Built for 3W Full Stack Internship Assignment — Round 1
