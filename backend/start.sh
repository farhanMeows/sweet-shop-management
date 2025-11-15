#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"
echo "[start.sh] RESET_DB=${RESET_DB:-false}"

# Try normal migrations first (production-friendly)
echo "[start.sh] Attempting prisma migrate deploy..."
if npx prisma migrate deploy; then
  echo "[start.sh] migrate deploy succeeded."
else
  # capture exit code
  rc=$?
  echo "[start.sh] migrate deploy failed with exit code ${rc}."
  # If user explicitly asked to force-reset, do that (destructive)
  if [ "${RESET_DB:-false}" = "true" ]; then
    echo "[start.sh] RESET_DB=true -> performing destructive reset via prisma db push --force-reset"
    npx prisma db push --force-reset --skip-generate
    echo "[start.sh] destructive reset finished."
  else
    echo "[start.sh] ERROR: migrate deploy failed. To proceed you can either:"
    echo "  - Set RESET_DB=true (env) to force a destructive reset (db push --force-reset),"
    echo "    which will wipe the DB and create schema from prisma/schema.prisma, OR"
    echo "  - Baseline migrations by running 'prisma migrate resolve --applied <migration>' in your DB environment."
    echo ""
    echo "Exiting to avoid unexpected schema changes. Fix the migration state or set RESET_DB to continue."
    exit ${rc}
  fi
fi

echo "[start.sh] Generating prisma client..."
npx prisma generate

echo "[start.sh] Starting server..."
exec node dist/index.js
