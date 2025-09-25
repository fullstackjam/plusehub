# Multi-stage build for PulseHub
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production

# Build frontend
FROM base AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Build backend
FROM base AS backend-builder
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend/ ./

# Build backend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 pulsehub

# Copy built applications
COPY --from=frontend-builder --chown=pulsehub:nodejs /app/frontend/dist ./frontend/dist
COPY --from=backend-builder --chown=pulsehub:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=pulsehub:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=pulsehub:nodejs /app/backend/package*.json ./backend/

# Copy root package.json for scripts
COPY --chown=pulsehub:nodejs package*.json ./

# Switch to non-root user
USER pulsehub

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["sh", "-c", "cd backend && npm run start:prod"]
