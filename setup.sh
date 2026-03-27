#!/bin/bash
# Setup automatique — copie .env, migrations, seed
set -e

echo "=== Setup lemonde ==="

[ ! -f .env ] && cp .env.example .env && echo "✓ .env créé depuis .env.example"

echo "→ Génération du client Prisma..."
npx prisma generate

echo "→ Migration de la base de données..."
npx prisma db push

echo "→ Seed des données..."
npx tsx prisma/seed.ts

echo "✓ Base de données prête"
echo "=== Lancer avec : npm run dev ==="
