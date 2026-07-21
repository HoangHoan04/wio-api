#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# deploy.sh - Deploy script for WIO server
# Run on server after SSH login
# ──────────────────────────────────────────────────────────────

set -e

ENV=${1:-prod}
if [[ "$ENV" != "prod" && "$ENV" != "dev" ]]; then
  echo "Usage: ./deploy.sh [prod|dev]"
  exit 1
fi

echo "🚀 Deploying WIO environment: $ENV"

# Pull latest images
echo "⬇️  Pulling latest images..."
docker compose -f docker-compose.server.yml pull

# Deploy frontends + nginx
echo "🔄 Starting frontends and nginx..."
docker compose -f docker-compose.server.yml up -d --remove-orphans

# Deploy API (includes database + migration)
echo "🔄 Starting API..."
cd ../wio-api
if [ "$ENV" = "prod" ]; then
  docker compose -f docker-compose.prod.yml pull
  docker compose -f docker-compose.prod.yml up -d --remove-orphans
else
  docker compose -f docker-compose.dev.yml pull
  docker compose -f docker-compose.dev.yml up -d --remove-orphans
fi

echo "✅ Deploy completed for environment: $ENV"
