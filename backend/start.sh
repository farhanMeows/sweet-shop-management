#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
echo "[start.sh] Running prisma migrate deploy..."
npx prisma migrate deploy

echo "[start.sh] Generating prisma client..."
npx prisma generate

echo "[start.sh] Running seed (idempotent)..."
npm run db:seed 

echo "[start.sh] Starting server..."
exec node dist/index.js
