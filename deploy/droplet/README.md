# GTA Electric Services — Production deployment

Split deployment for the client production domains:

| Component | Host | URL |
|-----------|------|-----|
| **API + PostgreSQL** | DigitalOcean Droplet | `https://api.gtaelectricservices.ca` |
| **Admin** (Vite/React) | Vercel | `https://admin.gtaelectricservices.ca` and `https://admin-gtaes-git-main-gtaes.vercel.app` |
| **Web** (Next.js) | Vercel | `https://gtaelectricservices.ca`, `https://www.gtaelectricservices.ca`, and `https://web-gtaes-git-main-gtaes.vercel.app` |

Local development continues to use the root `docker-compose.yml` (all services).

For copying uploads/DB from an older droplet, see [MIGRATING-UPLOADS.md](./MIGRATING-UPLOADS.md).

---

## 1. DNS

At the registrar (or DigitalOcean DNS) for `gtaelectricservices.ca`:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | `api` | `<droplet-public-ip>` | API on this droplet |
| A / CNAME | `@` | Vercel target (see Vercel DNS instructions) | Apex web |
| A / CNAME | `www` | Vercel target | `www` web |
| A / CNAME | `admin` | Vercel target | Admin |

Result:

- `api.gtaelectricservices.ca` → droplet
- `gtaelectricservices.ca` / `www.gtaelectricservices.ca` → Vercel web
- `admin.gtaelectricservices.ca` → Vercel admin

> Spelling note: use **gtaelectricservices** (with the “e” in electric) for all hosts so they match the apex domain.

Wait until `api` resolves before requesting SSL:

```bash
dig +short api.gtaelectricservices.ca
```

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
nano .env
```

Set at least:

- `POSTGRES_PASSWORD`, `JWT_SECRET`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`
- `ADMIN_URL=https://admin.gtaelectricservices.ca`
- `WEB_URL=https://gtaelectricservices.ca`
- `CORS_ORIGINS` including custom domains **and** Vercel project URLs (see `.env.example`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`

Then in **Admin → CMS → Contact** set SMTP User, Password, From Email, From Name, and Recipient Email (after admin is online).

Start database + API + nginx (HTTP bootstrap):

```bash
docker compose up -d --build
curl http://api.gtaelectricservices.ca/health
```

### Enable HTTPS (Let's Encrypt)

```bash
chmod +x scripts/init-ssl.sh scripts/deploy.sh
./scripts/init-ssl.sh api.gtaelectricservices.ca hashimsadiq@gmail.com
```

Verify:

```bash
curl https://api.gtaelectricservices.ca/health
```

### Updates

```bash
cd /opt/gtaes/deploy/droplet
./scripts/deploy.sh
```

---

## 3. Vercel — Admin

1. Import the repo in Vercel (or use the existing admin project).
2. Set **Root Directory** to `admin`.
3. Framework: **Vite** (or use `admin/vercel.json`).
4. Environment variables (Production):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://api.gtaelectricservices.ca` |
| `VITE_WEB_URL` | `https://gtaelectricservices.ca` |

5. Deploy.
6. In Vercel → Project → **Domains**, add `admin.gtaelectricservices.ca` and follow the DNS instructions.

Invitation / password-reset emails use `ADMIN_URL` from the droplet `.env`, so keep that in sync with the custom admin domain.

---

## 4. Vercel — Web (Next.js)

1. Create / use a **second** Vercel project with **Root Directory** `web`.
2. Environment variables (Production):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.gtaelectricservices.ca` |

3. Deploy.
4. Add both domains in Vercel:
   - `gtaelectricservices.ca`
   - `www.gtaelectricservices.ca`
5. Prefer redirecting `www` → apex (or the reverse) in Vercel domain settings so one canonical site is used.

Customer activation links use `WEB_URL` from the droplet `.env` (apex is recommended).

---

## 5. Wire frontends to the droplet API

After custom domains work, confirm droplet `.env` matches (Vercel project URLs keep working too):

```env
ADMIN_URL=https://admin.gtaelectricservices.ca
WEB_URL=https://gtaelectricservices.ca
CORS_ORIGINS=https://admin.gtaelectricservices.ca,https://gtaelectricservices.ca,https://www.gtaelectricservices.ca,https://admin-gtaes-git-main-gtaes.vercel.app,https://web-gtaes-git-main-gtaes.vercel.app
```

`ADMIN_URL` / `WEB_URL` are used in invitation and customer activation emails — keep those on the custom domains. `CORS_ORIGINS` must list every origin that loads the admin or web app in the browser, including the Vercel hosts.
Then recreate the API container so env is applied:

```bash
cd /opt/gtaes/deploy/droplet
docker compose up -d --force-recreate --no-deps api
```

Quick checks:

```bash
curl -s https://api.gtaelectricservices.ca/health
# From a browser on admin/web: Network tab should show API calls to api.gtaelectricservices.ca without CORS errors
```

---

## 6. Architecture

```
[Vercel Admin]  https://admin.gtaelectricservices.ca
                https://admin-gtaes-git-main-gtaes.vercel.app
[Vercel Web]    https://gtaelectricservices.ca
                https://www.gtaelectricservices.ca
                https://web-gtaes-git-main-gtaes.vercel.app
         │
         └──HTTPS──► https://api.gtaelectricservices.ca/api/*
                              │
                      [Nginx :443]
                              │
                      [API :3001]
                              │
                      [PostgreSQL]
                    (internal only)
```

Uploads are served at `https://api.gtaelectricservices.ca/uploads/...` (proxied through nginx).

---

## 7. Files in this directory

| Path | Purpose |
|------|---------|
| `docker-compose.yml` | Production db + api + nginx + certbot |
| `.env.example` | Droplet environment template (production domains) |
| `nginx/conf.d/gtaes.conf` | Initial HTTP config (before SSL) |
| `nginx/templates/gtaes.ssl.conf` | HTTPS template (`__DOMAIN__` placeholders) |
| `scripts/init-ssl.sh` | Issue cert + switch nginx to HTTPS |
| `scripts/deploy.sh` | Pull + rebuild stack |
| `MIGRATING-UPLOADS.md` | Copy CMS/avatar uploads (and DB) between droplets |

---

## 8. Cutover checklist (old droplet → this one)

- [ ] DNS `api` A record points at the new droplet IP
- [ ] Clone repo, copy `.env.example` → `.env`, set secrets + CORS
- [ ] `docker compose up -d --build`
- [ ] `./scripts/init-ssl.sh api.gtaelectricservices.ca <email>`
- [ ] Restore DB + uploads from the old droplet ([MIGRATING-UPLOADS.md](./MIGRATING-UPLOADS.md))
- [ ] Vercel Admin: `VITE_API_URL` + `VITE_WEB_URL` + domain `admin.gtaelectricservices.ca`
- [ ] Vercel Web: `NEXT_PUBLIC_API_URL` + domains apex + `www`
- [ ] Recreate API with final `ADMIN_URL` / `WEB_URL` / `CORS_ORIGINS`
- [ ] Configure SMTP in Admin CMS Contact settings
- [ ] Spot-check login, CMS images, booking/contact forms, invitation emails
- [ ] Decommission or lock down the old droplet when verified

---

## 9. Troubleshooting

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

**CORS errors from Vercel** — add exact frontend origins to `CORS_ORIGINS` (no trailing slash), including both apex and `www` if both are used. Per-deploy preview hosts like `web-gtaes-<hash>-gtaes.vercel.app` are covered when `CORS_ALLOW_VERCEL_PREVIEWS=true` (default). After changing `.env`, recreate the API: `docker compose up -d --force-recreate --no-deps api`.

**Vercel SSO / `vercel.com/sso-api` on assets** — Deployment Protection is on. In the Vercel project → Settings → Deployment Protection, set Production to **None** (or disable SSO) so the public site and `site.webmanifest` load without a Vercel login. Prefer the custom domain (`https://gtaelectricservices.ca`) or the stable `*-git-main-gtaes.vercel.app` URL over hashed preview URLs for day-to-day use.

**Certificate renewal** — the `certbot` service renews every 12h. After renewal, reload nginx:

```bash
docker compose exec nginx nginx -s reload
```

**Reset database** (destructive):

```bash
docker compose down -v
docker compose up -d --build
```
