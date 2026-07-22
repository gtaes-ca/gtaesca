#!/usr/bin/env sh
set -eu

DOMAIN="${1:-gtaes.nicheye.com}"
EMAIL="${2:-}"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <domain> <letsencrypt-email>"
  echo "Example: $0 gtaes.nicheye.com admin@nicheye.com"
  exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
DROPLET_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$DROPLET_DIR"

echo "==> Ensuring stack is running (HTTP bootstrap config)..."
docker compose up -d db api nginx

echo "==> Requesting Let's Encrypt certificate for $DOMAIN..."
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

echo "==> Enabling HTTPS nginx config..."
cp "$DROPLET_DIR/nginx/templates/gtaes.ssl.conf" "$DROPLET_DIR/nginx/conf.d/gtaes.conf"

echo "==> Reloading nginx..."
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload

echo "==> Starting certbot renewal loop..."
docker compose --profile ssl up -d certbot

echo ""
echo "Done. API should be available at https://$DOMAIN/health"
echo "Set Vercel env vars:"
echo "  NEXT_PUBLIC_API_URL=https://$DOMAIN"
echo "  VITE_API_URL=https://$DOMAIN"
