FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/api

RUN npx prisma generate
RUN npm run build


FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/server.js"]
