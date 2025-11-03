# -----------------------------
# Stage 1: Build React app
# -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile availability
COPY package.json ./
COPY package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Build args to inject REACT_APP_* at build time if desired
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_AUTH_LOGIN_ENDPOINT
ARG REACT_APP_AUTH_SIGNUP_ENDPOINT
ARG REACT_APP_PROMPT_ENDPOINT
ARG REACT_APP_HEALTH_ENDPOINT
ARG REACT_APP_USE_MOCK_API
ARG REACT_APP_WITH_CREDENTIALS

# Set environment variables for build-time injection
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_AUTH_LOGIN_ENDPOINT=${REACT_APP_AUTH_LOGIN_ENDPOINT}
ENV REACT_APP_AUTH_SIGNUP_ENDPOINT=${REACT_APP_AUTH_SIGNUP_ENDPOINT}
ENV REACT_APP_PROMPT_ENDPOINT=${REACT_APP_PROMPT_ENDPOINT}
ENV REACT_APP_HEALTH_ENDPOINT=${REACT_APP_HEALTH_ENDPOINT}
ENV REACT_APP_USE_MOCK_API=${REACT_APP_USE_MOCK_API}
ENV REACT_APP_WITH_CREDENTIALS=${REACT_APP_WITH_CREDENTIALS}

# Build the production bundle
RUN npm run build

# -----------------------------
# Stage 2: Nginx runtime
# -----------------------------
FROM nginx:alpine AS runtime

# Copy a custom nginx.conf suited for SPA fallback and optional CORS headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: runtime environment injection for Nginx-served SPA
# This allows setting env values at container start via env.js
# Serve env.js and a small entrypoint to generate it
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Default environment variables (can be overridden at runtime)
ENV RUNTIME_API_BASE_URL=""
ENV RUNTIME_AUTH_LOGIN_ENDPOINT="/api/auth/login"
ENV RUNTIME_AUTH_SIGNUP_ENDPOINT="/api/auth/signup"
ENV RUNTIME_PROMPT_ENDPOINT="/api/prompt"
ENV RUNTIME_HEALTH_ENDPOINT="/api/health"
ENV RUNTIME_USE_MOCK_API="false"
ENV RUNTIME_WITH_CREDENTIALS="false"

# Start script writes /usr/share/nginx/html/env.js and then runs nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
