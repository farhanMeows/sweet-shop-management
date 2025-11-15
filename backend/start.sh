#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
echo "[start.sh] RESET_DB=${RESET_DB:-false}"

# If RESET_DB is explicitly true, do a destructive reset (dev/demo only).
if [ "${RESET_DB:-false}" = "true" ] ; then
  echo "[start.sh] RESET_DB=true -> performing destructive reset via prisma db push --force-reset"
  npx prisma db push --force-reset --skip-generate
  echo "[start.sh] prisma db push --force-reset completed; skipping migrate deploy."
  # generate client based on schema
  echo "[start.sh] Generating prisma client..."
  npx prisma generate
else
  echo "[start.sh] Running prisma migrate deploy..."
  npx prisma migrate deploy
  echo "[start.sh] Generating prisma client..."
  npx prisma generate
fi

echo "[start.sh] Running seed (idempotent if DB empty)..."

# Check if users exist. If none, run seed. Non-fatal on error.
HAS_USERS=$(node -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  p.$connect()
    .then(() => p.user.count())
    .then(c => { console.log(c > 0 ? 1 : 0); return p.$disconnect(); })
    .catch(e => { console.error('CHK_ERR', e); process.exit(0); });
")

if [ "$HAS_USERS" = "1" ]; then
  echo "[start.sh] Users already present, skipping seed."
else
  echo "[start.sh] No users found — running seed."
  if ! ADMIN_EMAIL=${ADMIN_EMAIL:-admin@local.test} ADMIN_PASSWORD=${ADMIN_PASSWORD:-adminpass} npm run db:seed; then
    echo "[start.sh] WARNING: seed failed, continuing to start server (check logs)."
  fi
fi

echo "[start.sh] Starting server..."
exec node dist/index.js
