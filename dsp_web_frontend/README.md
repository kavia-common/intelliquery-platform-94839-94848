# DSP Web Frontend (Ocean Professional)

A modern React frontend for a DSP system with authentication, a prompt interface, and backend integration.

## Features

- React Router v6 routing: `/login`, `/signup`, `/`
- AuthContext with localStorage persistence
- Protected routes for the home page
- API client using fetch with env-driven base URL and endpoints
- Mock API mode toggled by `REACT_APP_USE_MOCK_API`
- Prompt interface with results display
- Ocean Professional theme (blue + amber accents)
- NavBar health indicator for backend status (Online/Offline/Checking)

## Quick start (Docker)

From the repository root:

1) Optionally create `.env` with overrides:
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_AUTH_LOGIN_ENDPOINT=/api/auth/login
   REACT_APP_AUTH_SIGNUP_ENDPOINT=/api/auth/signup
   REACT_APP_PROMPT_ENDPOINT=/api/prompt
   REACT_APP_HEALTH_ENDPOINT=/api/health
   REACT_APP_USE_MOCK_API=false
   REACT_APP_WITH_CREDENTIALS=false

2) Start both services:
   docker compose up -d --build

3) Visit http://localhost:3000

The backend runs on http://localhost:8000 and CORS allows `http://localhost:3000` by default.

## Local quick start (without Docker)

1. Install dependencies
   npm install

2. Configure environment
   cp .env.example .env
   # Update values as needed

3. Run the app
   npm start

4. Run tests
   npm test

## Configuration (.env)

- REACT_APP_API_BASE_URL: e.g., http://localhost:8000
- REACT_APP_AUTH_LOGIN_ENDPOINT: default /auth/login
- REACT_APP_AUTH_SIGNUP_ENDPOINT: default /auth/signup
- REACT_APP_PROMPT_ENDPOINT: default /prompt
- REACT_APP_HEALTH_ENDPOINT: default /api/health (used for health indicator)
- REACT_APP_USE_MOCK_API: "true" to use mocked endpoints without a backend
- REACT_APP_WITH_CREDENTIALS: "true" if your backend uses cookies/sessions and requires credentials on CORS requests

## Health Check Indicator

- A small pill on the right side of the NavBar shows backend health:
  - Checking (neutral gray)
  - Online (green)
  - Offline (red)
- Click the pill to manually refresh the health check.
- The pill tooltip shows the last checked time and any error message.

How it works:
- The app performs a GET request to `${REACT_APP_API_BASE_URL}${REACT_APP_HEALTH_ENDPOINT}` (default `/api/health`) with a 5s timeout.
- It sends `Accept: application/json` and includes credentials when `REACT_APP_WITH_CREDENTIALS=true`.
- Any 2xx status is treated as Online; it tries to parse JSON if available but doesn't require it.
- In mock mode (`REACT_APP_USE_MOCK_API=true`), health returns Online immediately for demos.
- The check runs on mount and every 60 seconds.

Customize:
- Set `REACT_APP_HEALTH_ENDPOINT` to match your backend route (e.g., `/healthz`).
- Ensure `REACT_APP_API_BASE_URL` points to your backend (no trailing slash).
- Toggle `REACT_APP_WITH_CREDENTIALS` if your backend uses cookies.

## Structure

- src/state/authContext.js: Auth provider and hook
- src/api/client.js: Fetch wrapper, auth header, mock mode
- src/api/auth.js, src/api/prompt.js: API modules
- src/api/health.js: Health check module (env-driven, timeout, mock-aware)
- src/hooks/useHealthCheck.js: React hook for health state, auto-refresh
- src/components/: NavBar, AuthForm, PromptPanel, ResultList
- src/pages/: LoginPage, SignupPage, HomePage
- src/utils/: validators and storage helpers
- src/styles/theme.css: Ocean Professional theme + health pill styles

## Notes

- Protected routes redirect to /login when unauthenticated.
- On successful login/signup, a token is persisted and used for subsequent API calls.

## Docker Details

- The frontend image builds the React app and serves it with Nginx on port 80 (host 3000).
- The backend image runs Express on port 8000 with an SQLite DB persisted at `backend/express-auth/data`.
- CORS: Backend allows `http://localhost:3000` by default; override with FRONTEND_ORIGIN.
- Env at runtime: The container also generates `/usr/share/nginx/html/env.js` from `RUNTIME_*` env vars so you can switch API endpoints without a rebuild in the future.
