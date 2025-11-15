#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] NODE_ENV=${NODE_ENV:-undefined}"

#############################################
# 1) FORCE DROP DB BEFORE EVERYTHING
#############################################
echo "[start.sh] Dropping database..."
# Prisma requires a schema path; defaults to ./prisma/schema.prisma
# This command deletes all tables in the DB.
npx prisma db push --force-reset --skip-generate

#############################################
# 2) Apply migrations (fresh clean schema)
#############################################
echo "[start.sh] Running prisma migrate deploy..."
npx prisma migrate deploy

#############################################
# 3) Generate Prisma client
#############################################
echo "[start.sh] Generating prisma client..."
npx prisma generate

#############################################
# 4) SEED CHECK: Only run if DB is empty
#############################################
echo "[start.sh] Checking if users exist..."

HAS_USERS=$(node -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  p.$connect()
    .then(() => p.user.count())
    .then(c => { console.log(c > 0 ? 1 : 0); return p.$disconnect(); })
    .catch(e => { console.error('CHK_ERR', e); process.exit(0); });
")

if [ \"$HAS_USERS\" = \"1\" ]; then
  echo \"[start.sh] Users already present, skipping seed.\"
else
  echo \"[start.sh] No users found — running seed.\"
  if ! ADMIN_EMAIL=${ADMIN_EMAIL:-admin@local.test} ADMIN_PASSWORD=${ADMIN_PASSWORD:-adminpass} npm run db:seed; then
    echo \"[start.sh] WARNING: seed failed, continuing anyway.\"
  fi
fi

#############################################
# 5) Start Server
#############################################
echo \"[start.sh] Starting server...\"
exec node dist/index.js
