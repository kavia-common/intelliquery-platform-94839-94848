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

## Quick start

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
- REACT_APP_USE_MOCK_API: "true" to use mocked endpoints without a backend

## Structure

- src/state/authContext.js: Auth provider and hook
- src/api/client.js: Fetch wrapper, auth header, mock mode
- src/api/auth.js, src/api/prompt.js: API modules
- src/components/: NavBar, AuthForm, PromptPanel, ResultList
- src/pages/: LoginPage, SignupPage, HomePage
- src/utils/: validators and storage helpers
- src/styles/theme.css: Ocean Professional theme

## Notes

- Protected routes redirect to /login when unauthenticated.
- On successful login/signup, a token is persisted and used for subsequent API calls.

