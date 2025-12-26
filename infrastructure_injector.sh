#!/bin/bash

# ==========================================
# 7. INFRASTRUCTURE INJECTOR (DOCKER)
# ==========================================
# Purpose: Creates optimized Dockerfiles for Next.js and FastAPI.
# Focus: Multi-stage builds for small image sizes.
# Run this LAST.

echo "🐳 Injecting Docker Configurations..."

# ==========================================
# 1. NEXT.JS DOCKERFILE (Frontend)
# ==========================================
# Esoteric Secret: Hum Multi-stage build use karenge taake
# 'node_modules' ka kachra production image main na jaye.
# Image size: ~1GB -> ~100MB.

cat <<EOF > apps/web/Dockerfile
# STAGE 1: Prune
FROM node:18-alpine AS base
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# TurboRepo setup
COPY . .
RUN npm global add turbo
RUN turbo prune --scope=web --docker

# STAGE 2: Build
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
# Build Next.js
RUN npx turbo run build --filter=web...

# STAGE 3: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .
# Copy standalone build (Next.js secret feature)
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD node apps/web/server.js
EOF

# ==========================================
# 2. PYTHON DOCKERFILE (AI Backend)
# ==========================================
# Esoteric Secret: 'slim' variant use karen aur bytecode compilation disable karen.

cat <<EOF > apps/ai-engine/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Prevent Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevent Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# Install System Dependencies (Postgres driver needs gcc)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Code
COPY . .

# Run as non-root user (Best Practice)
RUN adduser --disabled-password --gecos '' myuser
USER myuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# ==========================================
# 3. ROOT DOCKER COMPOSE (The Orchestrator)
# ==========================================
echo "👉 Updating docker-compose.yml..."

cat <<EOF > docker-compose.yml
version: '3.8'

services:
  # --- FRONTEND ---
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/saas
      - NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000
    depends_on:
      - ai-engine
      - db
    networks:
      - saas-network

  # --- BACKEND ---
  ai-engine:
    build:
      context: apps/ai-engine
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/saas
    depends_on:
      - db
    networks:
      - saas-network

  # --- DATABASE ---
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: saas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - saas-network

networks:
  saas-network:
    driver: bridge

volumes:
  postgres_data:
EOF

echo "✅ DOCKER SETUP COMPLETE."
echo "👉 Ab aap root folder say 'docker-compose up --build' chala saktay hain."