# Mock API Mode

You can run the app without a backend by enabling mock mode.

Steps:
1. Copy `.env.example` to `.env`
2. Ensure `REACT_APP_USE_MOCK_API=true`
3. Start the app: `npm start`

What is mocked:
- Auth login/signup return a mock token and echo the username.
- Prompt endpoint echoes your input and a sample analysis.
