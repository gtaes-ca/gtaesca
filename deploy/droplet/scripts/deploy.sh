#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DROPLET_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$DROPLET_DIR"

if [ ! -f .env ]; then
  echo "Missing .env — copy .env.example to .env and fill in values."
  exit 1
fi

echo "==> Pulling latest code..."
git -C "$DROPLET_DIR/../.." pull --ff-only

echo "==> Building and starting services..."
docker compose up -d --build

echo "==> Health check..."
sleep 5
docker compose exec api wget -qO- http://127.0.0.1:3001/health || true

echo "==> Done. Run ./scripts/init-ssl.sh if HTTPS is not configured yet."
