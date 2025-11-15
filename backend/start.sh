#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
echo "[start.sh] Running prisma migrate deploy..."
# non-interactive migrations for production
npx prisma migrate deploy

echo "[start.sh] Generating prisma client..."
npx prisma generate

echo "[start.sh] Running seed (idempotent)..."
# run seed but don't let a failing seed break startup (so non-fatal)
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@local.test} ADMIN_PASSWORD=${ADMIN_PASSWORD:-adminpass} npm run db:seed || true

echo "[start.sh] Starting server..."
# start the compiled app
exec node dist/index.js
