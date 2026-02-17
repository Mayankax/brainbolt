FROM node:22
WORKDIR /app

# Copy root files
COPY package.json package-lock.json ./

# Copy workspace package.json only
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies fresh inside container
RUN npm install

# Copy rest of source (without node_modules because of .dockerignore)
COPY . .

# Build only web workspace
RUN npm run build --workspace=web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=web"]
