# GTA Electric Services — Production deployment

Split deployment:

| Component | Host | URL |
|-----------|------|-----|
| **API + PostgreSQL** | DigitalOcean Droplet | `https://gtaes.nicheye.com` |
| **Admin** (Vite/React) | Vercel | your admin Vercel URL |
| **Web** (Next.js) | Vercel | your web Vercel URL |

Local development continues to use the root `docker-compose.yml` (all services).

---

## 1. DNS (DigitalOcean / domain registrar)

Create an **A record**:

| Type | Name | Value |
|------|------|-------|
| A | `gtaes` | `<droplet-public-ip>` |

Result: `gtaes.nicheye.com` → droplet.

---

## 2. Droplet setup

### Requirements

- Ubuntu 22.04+ (or similar)
- Docker Engine + Docker Compose v2
- Ports **22**, **80**, **443** open (UFW / cloud firewall)
- **Do not** expose PostgreSQL (5432) publicly

### Install Docker (on droplet)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
# log out and back in
```

### Deploy API stack

> **Important:** run all commands from `deploy/droplet`, **not** the repo root.
> The root `docker-compose.yml` builds admin + web for local dev and will take much longer on a droplet.

```bash
git clone https://github.com/Hashmarkai/gta-electric-services-1.git /opt/gtaes
cd /opt/gtaes/deploy/droplet

cp .env.example .env
nano .env   # set POSTGRES_PASSWORD, JWT_SECRET, ADMIN_URL, WEB_URL, CORS_ORIGINS, SMTP_HOST, SMTP_PORT
# Then in Admin → CMS → Contact set SMTP User, Password, From Email, From Name, and Recipient Email.
```

Start database + API + nginx (HTTP bootstrap):

```bash
docker compose up -d --build
curl http://gtaes.nicheye.com/health
```

### Enable HTTPS (Let's Encrypt)

```bash
chmod +x scripts/init-ssl.sh scripts/deploy.sh
./scripts/init-ssl.sh gtaes.nicheye.com admin@nicheye.com
```

Verify:

```bash
curl https://gtaes.nicheye.com/health
```

### Updates

```bash
cd /opt/gtaes/deploy/droplet
./scripts/deploy.sh
```

---

## 3. Vercel — Admin

1. Import the repo in Vercel.
2. Set **Root Directory** to `admin`.
3. Framework: **Vite** (or use `admin/vercel.json`).
4. Environment variables (Production):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://gtaes.nicheye.com` |
| `VITE_WEB_URL` | `https://<your-web-vercel-domain>` |

5. Deploy.

Copy the production admin URL into droplet `.env`:

```env
ADMIN_URL=https://<your-admin-vercel-domain>
CORS_ORIGINS=https://<admin>,https://<web>
```

Then restart API:

```bash
cd /opt/gtaes/deploy/droplet && docker compose up -d api
```

---

## 4. Vercel — Web (Next.js)

1. Create a **second** Vercel project (or monorepo sub-project).
2. Set **Root Directory** to `web`.
3. Environment variables (Production):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://gtaes.nicheye.com` |

4. Deploy.

Update droplet `.env`:

```env
WEB_URL=https://<your-web-vercel-domain>
CORS_ORIGINS=https://<admin>,https://<web>
```

Restart API after changes.

---

## 5. Architecture

```
[Vercel Admin] ──HTTPS──► https://gtaes.nicheye.com/api/*
[Vercel Web]   ──HTTPS──► https://gtaes.nicheye.com/api/*
                                    │
                            [Nginx :443]
                                    │
                            [API :3001]
                                    │
                            [PostgreSQL]
                          (internal only)
```

Uploads are served at `https://gtaes.nicheye.com/uploads/...` (proxied through nginx).

---

## 6. Files in this directory

| Path | Purpose |
|------|---------|
| `docker-compose.yml` | Production db + api + nginx + certbot |
| `.env.example` | Droplet environment template |
| `nginx/conf.d/gtaes.conf` | Initial HTTP config (before SSL) |
| `nginx/templates/gtaes.ssl.conf` | HTTPS config (enabled by `init-ssl.sh`) |
| `scripts/init-ssl.sh` | Issue cert + switch nginx to HTTPS |
| `scripts/deploy.sh` | Pull + rebuild stack |

---

## 7. Troubleshooting

**Building admin/web on the droplet** — you ran compose from the repo root. Stop it and use the droplet stack:

```bash
cd /opt/gtaes
docker compose down

cd /opt/gtaes/deploy/droplet
cp .env.example .env   # if not done yet
docker compose up -d --build
```

You should only see **db**, **api**, and **nginx** building (API uses `Dockerfile.prod`).

**502 Bad Gateway / API restarting** — API crashed on boot (nginx is up, API is not):

```bash
docker compose logs api --tail 100
docker compose ps
```

Common causes:
- migration SQL error
- bad DB password / connection (prefer discrete `DB_*` vars; avoid special chars like `@ # $` in `POSTGRES_PASSWORD` if possible)
- missing `.env` values (`JWT_SECRET`, `SUPER_ADMIN_*`)

After fixing `.env`:

```bash
docker compose up -d --build api
docker compose logs -f api
```

**CORS errors from Vercel** — add exact frontend origins to `CORS_ORIGINS` (no trailing slash).

**Certificate renewal** — the `certbot` service renews every 12h. After renewal, reload nginx:

```bash
docker compose exec nginx nginx -s reload
```

**Reset database** (destructive):

```bash
docker compose down -v
docker compose up -d --build
```
