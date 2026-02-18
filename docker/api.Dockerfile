# -------- Builder Stage --------
FROM node:22-slim AS builder

WORKDIR /app

# Copy root files
COPY package.json package-lock.json ./

# Copy workspace package.json
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies
RUN npm install

# Copy full project
COPY . .

# Build API
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build


# -------- Production Stage --------
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

# Install openssl (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copy built files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma

# ✅ ADD THIS LINE (CRITICAL)
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && npx prisma db seed --schema=prisma/schema.prisma && node dist/src/server.js"]
