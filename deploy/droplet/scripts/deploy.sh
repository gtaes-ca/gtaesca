#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DROPLET_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$DROPLET_DIR"

if [ ! -f .env ]; then
  echo "Missing .env — copy .env.example to .env and fill in values."
  exit 1
fi

PLUNK_API_KEY_VALUE="$(grep -E '^[[:space:]]*PLUNK_API_KEY=' .env | tail -n1 | cut -d= -f2- | tr -d "\"'[:space:]")"
if [ -z "${PLUNK_API_KEY_VALUE}" ]; then
  echo "WARNING: PLUNK_API_KEY is empty in .env — contact form / booking emails will fail."
  echo "         Set PLUNK_API_KEY=sk_... then re-run deploy (or recreate api)."
fi

echo "==> Pulling latest code..."
git -C "$DROPLET_DIR/../.." pull --ff-only

echo "==> Building and starting services..."
docker compose up -d --build

echo "==> Health check..."
sleep 5
docker compose exec api wget -qO- http://127.0.0.1:3001/health || true

echo "==> Plunk env check (inside api container)..."
docker compose exec api sh -c 'if [ -n "$PLUNK_API_KEY" ]; then echo "PLUNK_API_KEY: set ($(printf %s "$PLUNK_API_KEY" | cut -c1-3)...)"; else echo "PLUNK_API_KEY: MISSING"; fi'
docker compose exec api sh -c 'echo "PLUNK_API_URL: ${PLUNK_API_URL:-unset}"'

echo "==> Done. Run ./scripts/init-ssl.sh if HTTPS is not configured yet."
