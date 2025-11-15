#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
echo "[start.sh] Running prisma migrate deploy..."
npx prisma migrate deploy

echo "[start.sh] Generating prisma client..."
npx prisma generate

echo "[start.sh] Running seed (idempotent)..."
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@local.test} ADMIN_PASSWORD=${ADMIN_PASSWORD:-adminpass} npm run db:seed || true

echo "[start.sh] Starting server..."
exec node dist/index.js
