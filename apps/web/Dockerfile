FROM node:20-alpine AS base
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# TurboRepo setup
COPY . .
RUN npm install -g turbo
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