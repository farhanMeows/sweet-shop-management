# backend/Dockerfile
# Stage 1: build
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# copy package files and install deps
COPY backend/package*.json ./ 
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# copy source
COPY backend/ ./

# build typescript
RUN npm run build

# generate prisma client (schema-based; doesn't need DB at build)
RUN npx prisma generate

# Stage 2: runtime image
FROM node:18-bullseye-slim AS runtime
WORKDIR /app

# copy only runtime artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./ 

# copy start script from backend folder
COPY backend/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# expose port
EXPOSE 4000

# Use start.sh so migrations and seed can run before the server starts.
CMD ["/app/start.sh"]
