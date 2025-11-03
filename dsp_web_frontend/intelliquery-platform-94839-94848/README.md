# intelliquery-platform-94839-94848

This repo contains a React frontend and a minimal Express + SQLite backend. You can run both with Docker Compose.

## Quick Start (Docker)

1) Create an .env at the repo root (optional – defaults are provided)
   Example:
   JWT_SECRET=replace_with_a_long_random_string
   BACKEND_PORT=8000
   FRONTEND_ORIGIN=http://localhost:3000

   # Frontend API configuration (build-time and runtime)
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_AUTH_LOGIN_ENDPOINT=/api/auth/login
   REACT_APP_AUTH_SIGNUP_ENDPOINT=/api/auth/signup
   REACT_APP_PROMPT_ENDPOINT=/api/prompt
   REACT_APP_HEALTH_ENDPOINT=/api/health
   REACT_APP_USE_MOCK_API=false
   REACT_APP_WITH_CREDENTIALS=false

2) Build and run both services:
   docker compose up -d --build

3) Open the app:
   Frontend: http://localhost:3000
   Backend Health: http://localhost:8000/api/health

The Compose file:
- Builds and starts:
  - backend (Express + SQLite) on 8000 (container) -> ${BACKEND_PORT:-8000} (host)
  - frontend (React built with Nginx) on 80 (container) -> 3000 (host)
- Persists SQLite data on a host volume: dsp_web_frontend/backend/express-auth/data

CORS:
- The backend allows http://localhost:3000 by default.
- Adjust FRONTEND_ORIGIN in your .env if needed.

## Environment Variables

Backend:
- PORT (default 8000)
- JWT_SECRET (required for non-dev)
- FRONTEND_ORIGIN (default http://localhost:3000)
- DATABASE_URL (optional, default ./data/app.db)

Frontend Build-time args (baked into bundle):
- REACT_APP_API_BASE_URL (default http://localhost:8000)
- REACT_APP_AUTH_LOGIN_ENDPOINT (default /api/auth/login)
- REACT_APP_AUTH_SIGNUP_ENDPOINT (default /api/auth/signup)
- REACT_APP_PROMPT_ENDPOINT (default /api/prompt)
- REACT_APP_HEALTH_ENDPOINT (default /api/health)
- REACT_APP_USE_MOCK_API (default false)
- REACT_APP_WITH_CREDENTIALS (default false)

Frontend Runtime env (no rebuild needed, via env.js):
- RUNTIME_API_BASE_URL (maps to REACT_APP_API_BASE_URL)
- RUNTIME_AUTH_LOGIN_ENDPOINT
- RUNTIME_AUTH_SIGNUP_ENDPOINT
- RUNTIME_PROMPT_ENDPOINT
- RUNTIME_HEALTH_ENDPOINT
- RUNTIME_USE_MOCK_API
- RUNTIME_WITH_CREDENTIALS

Note: Current frontend reads env variables at build time via process.env. The runtime env.js is generated to allow future runtime-based configuration if frontend code is updated to consume window.__ENV__. For now, prefer setting build args via compose.

## Local Development (without Docker)

Frontend:
1) cd dsp_web_frontend
2) npm install
3) cp .env.example .env
4) npm start (http://localhost:3000)

Backend:
1) cd dsp_web_frontend/backend/express-auth
2) npm install
3) cp .env.example .env
4) npm run dev (http://localhost:8000)

Ensure CORS FRONTEND_ORIGIN matches your frontend URL.

## Troubleshooting

- Port already in use:
  Adjust BACKEND_PORT or frontend port mapping in docker-compose.yml.

- CORS errors:
  Set FRONTEND_ORIGIN in .env to your frontend URL (e.g., http://localhost:3000).

- Changing API base URL:
  Update REACT_APP_API_BASE_URL in your root .env and rebuild:
  docker compose up -d --build
