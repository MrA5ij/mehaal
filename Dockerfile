# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies with exact versions and network retry
RUN npm config set fetch-retries 10 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set maxsockets 1

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage - Production
FROM node:20

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Production serve (no hot reload, optimized)
CMD ["serve", "-s", "dist", "-l", "5173"]
