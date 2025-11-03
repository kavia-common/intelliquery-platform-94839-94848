# Express Auth Backend

Minimal Node.js Express backend with SQLite for username/password signup and login, using bcrypt for hashing and JWT for tokens. Designed to work with the DSP Web Frontend.

## Features

- SQLite (file-based) database stored at ./data/app.db
- POST /api/auth/signup — creates a user, returns JWT
- POST /api/auth/login — authenticates a user, returns JWT
- GET /api/health — health check returning `{ status: 'ok' }`
- CORS configured for typical local dev and preview environments
- Input validation with clear `{ message: string }` error responses
- Environment variable support via `.env`

## Quick Start

1) Install dependencies
   npm install

2) Create your .env
   cp .env.example .env
   # Update values as needed (set a strong JWT_SECRET for non-dev use)

3) Start the server
   npm run dev
   # or: npm start

Server runs at http://localhost:8000 by default.

## Environment Variables (.env)

- PORT: Port to listen on (default 8000)
- JWT_SECRET: Secret used to sign JWTs (required for production)
- DATABASE_URL: Optional path to SQLite file (default: ./data/app.db)
- FRONTEND_ORIGIN: Override/extend allowed CORS origin (e.g., your preview URL)
- PREVIEW_ORIGIN: Optionally add another explicit CORS origin (e.g., CI preview)

Example:
PORT=8000
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_ORIGIN=http://localhost:3000

## Endpoints

- GET /api/health
  - 200 OK: { "status": "ok" }

- POST /api/auth/signup
  - Body: { "username": "string (3-50 chars)", "password": "string (min 8 chars)" }
  - 201 Created: { "token": "JWT", "user": { "username": "..." } }
  - 409 Conflict if username exists
  - 400 Bad Request on validation error
  - 500 Internal Server Error on unexpected errors

- POST /api/auth/login
  - Body: { "username": "string", "password": "string" }
  - 200 OK: { "token": "JWT", "user": { "username": "..." } }
  - 401 Unauthorized on mismatch
  - 400 Bad Request on validation error
  - 500 Internal Server Error on unexpected errors

Notes:
- JWT payload contains { sub: username } and expires in 24 hours.
- All error responses follow the shape: { "message": "..." } to work with the frontend error surfacing.

## CORS

By default, these origins are allowed:
- http://localhost:3000
- Any origin set by FRONTEND_ORIGIN or PREVIEW_ORIGIN

If you are using a preview URL, set FRONTEND_ORIGIN or PREVIEW_ORIGIN accordingly in your .env.

## Project Layout

- src/index.js — Express app, middleware, routes
- src/routes/auth.js — Signup and login routes
- src/middleware/validate.js — Input validation for auth
- src/db.js — SQLite initialization and user helper functions
- data/app.db — SQLite database file (auto-created)

## Matching the Frontend

Frontend defaults:
- Base URL: REACT_APP_API_BASE_URL (e.g., http://localhost:8000)
- Auth endpoints: /auth/signup and /auth/login (the frontend will call `${BASE_URL}${ENDPOINT}`)
- Health endpoint: /api/health

This backend exposes routes under `/api`, so configure:
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_AUTH_LOGIN_ENDPOINT=/api/auth/login
REACT_APP_AUTH_SIGNUP_ENDPOINT=/api/auth/signup
REACT_APP_HEALTH_ENDPOINT=/api/health

## Security Notes

- Use a strong JWT_SECRET in production.
- SQLite is file-based and suitable for lightweight/dev scenarios.
- Consider rate limiting and HTTPS termination for production deployments.
