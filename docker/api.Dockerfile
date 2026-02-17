FROM node:22
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN npm install

COPY . .

WORKDIR /app/apps/api

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]
