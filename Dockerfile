# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies with exact versions
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage - Production
FROM node:18-alpine

WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Production serve (no hot reload, optimized)
CMD ["serve", "-s", "dist", "-l", "3000"]
