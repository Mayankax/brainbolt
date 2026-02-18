# -------- Builder --------
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/web
RUN npm run build


# -------- Runner --------
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build
COPY --from=builder /app/apps/web/.next/standalone ./

# Copy static + public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
