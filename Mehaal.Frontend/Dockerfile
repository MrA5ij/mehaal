# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static build
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start the server
CMD ["serve", "-s", "dist", "-l", "5173"]
