#!/bin/sh
set -eu

# Generate a runtime env.js file for the SPA to consume without rebuilds.
# These are mapped from RUNTIME_* env vars to window.__ENV__ so frontend code
# can optionally read them if implemented.
cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV__ = {
  REACT_APP_API_BASE_URL: "${RUNTIME_API_BASE_URL}",
  REACT_APP_AUTH_LOGIN_ENDPOINT: "${RUNTIME_AUTH_LOGIN_ENDPOINT:-/api/auth/login}",
  REACT_APP_AUTH_SIGNUP_ENDPOINT: "${RUNTIME_AUTH_SIGNUP_ENDPOINT:-/api/auth/signup}",
  REACT_APP_PROMPT_ENDPOINT: "${RUNTIME_PROMPT_ENDPOINT:-/api/prompt}",
  REACT_APP_HEALTH_ENDPOINT: "${RUNTIME_HEALTH_ENDPOINT:-/api/health}",
  REACT_APP_USE_MOCK_API: "${RUNTIME_USE_MOCK_API:-false}",
  REACT_APP_WITH_CREDENTIALS: "${RUNTIME_WITH_CREDENTIALS:-false}"
};
EOF

exec "$@"
