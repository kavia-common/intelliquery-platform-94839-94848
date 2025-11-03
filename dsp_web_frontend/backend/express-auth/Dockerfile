# -----------------------------
# Stage 1: Build/Install deps
# -----------------------------
FROM node:18-alpine AS deps

# Ensure production environment
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install dependencies based on lockfile availability
# Copy package.json and lock files only to leverage cached layers
COPY package.json ./
# Copy lock file if present; the build will continue even if it's missing
# docker build will ignore COPY if file doesn't exist, but Alpine's shell needs checks
# We'll attempt to copy both common lockfile names
# The below two lines won't fail if the files don't exist
COPY package-lock.json* ./
COPY npm-shrinkwrap.json* ./

# Prefer npm ci when lockfile exists; fallback to npm install
# Using a small shell script to detect and run appropriately
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
      echo "Using npm ci (lockfile detected)"; \
      npm ci --only=production; \
    else \
      echo "No lockfile found, using npm install"; \
      npm install --only=production; \
    fi

# Copy source (only what's needed at runtime)
COPY src ./src

# -----------------------------
# Stage 2: Runtime
# -----------------------------
FROM node:18-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Create a writable data directory for SQLite DB (mounted via volume)
RUN mkdir -p /app/data && chown -R node:node /app

# Copy node_modules and source from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src ./src
COPY package.json ./

# Expose the application port (default 8000)
ENV PORT=8000
EXPOSE 8000

# Use non-root user for security
USER node

# Start the server
CMD ["node", "src/index.js"]
