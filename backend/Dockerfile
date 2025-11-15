# backend/Dockerfile
# Stage 1: build
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copy backend package files from repo root's backend/ folder
COPY backend/package*.json ./ 
# Install deps based on lockfile if present (use npm ci if lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy backend sources
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Generate Prisma client (requires DATABASE_URL at runtime for some setups; generate here anyway)
RUN npx prisma generate

# Stage 2: runtime image
FROM node:18-bullseye-slim AS runtime
WORKDIR /app

# Copy prod node_modules and built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./ 

# Expose port and set a non-root user (optional)
EXPOSE 4000
CMD ["node", "dist/index.js"]
