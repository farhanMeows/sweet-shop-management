# backend/Dockerfile
# Use Node 18 LTS
FROM node:18-bullseye-slim

WORKDIR /app

# Install dependencies (copy package.json + lock first)
COPY package*.json ./
RUN npm ci --production=false

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Generate Prisma client (ensure DATABASE_URL is provided at build or runtime; we will generate at runtime to be safe)
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start via node (built JS in dist/)
CMD ["node", "dist/index.js"]
