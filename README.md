# Netflix-Inspired Recommendation System

MERN stack application with one role: User. Movies are fetched from the Internet Archive, not TMDB and not an admin panel.

## Features

- User registration and login
- JWT login session stored in an HTTP-only cookie and valid for 30 days
- Movie catalog synced from Internet Archive
- Movie details, poster, description, in-app 1 to 5 rating
- Watch history tracking
- Recommendations based on watched genres, user history, high ratings, and popularity
- Netflix-inspired React and Tailwind UI

## Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
nodemon index.js
```

Make sure MongoDB is running locally, or update `MONGO_URI` in `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Movie Source

This project uses the Internet Archive advanced search API and embed player. No TMDB account or API key is required.
