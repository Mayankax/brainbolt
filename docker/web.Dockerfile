# docker/web.Dockerfile (Approach A — self-contained builder)
FROM node:22-slim AS builder

# Install minimal tools needed for downloading binaries
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git python3 build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only lockfiles and package manifests to leverage layer cache
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json

# Install all workspace deps (dev deps needed for build)
RUN npm ci --legacy-peer-deps

# Copy repo files
COPY . .

WORKDIR /app/apps/web

# Ensure environment for next build
ENV NODE_ENV=production
# Optional: disable turbopack evaluation warnings (keeps behavior consistent)
ENV NEXT_PRIVATE_DISABLE_TURBOPACK=1

# Try to ensure lightningcss native binary is present:
# 1) run a general npm rebuild (runs install scripts)
# 2) specifically try to update lightningcss binary
RUN npm rebuild --update-binary || true
RUN ( \
     npm rebuild lightningcss --update-binary 2>/dev/null || \
     (node -e "try{require('fs').existsSync('node_modules/lightningcss/node/install.js') && require('./node_modules/lightningcss/node/install.js')()}catch(e){}") \
    ) || true

# Build Next app
RUN npm run build --workspace=web

# --- production image
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's required for runtime from builder
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["node", "server.js"]
