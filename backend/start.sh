#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
npx prisma migrate deploy
npx prisma generate
echo "[start.sh] Starting server..."
exec node dist/index.js
