# Migrating uploads (and DB) between droplets

Use this when moving a live GTAES deployment from one droplet to another (e.g. staging/agency droplet → client’s personal droplet). Admin CMS uploads are **not** in git; they live in a Docker volume on the API host.

---

## Where images live

Production compose mounts a named volume into the API container:

| Host (Docker volume) | Inside API container | Purpose |
|----------------------|----------------------|---------|
| `*_uploads_data` | `/app/uploads` | All uploaded files |
| | `/app/uploads/cms/` | CMS images (homepage, about, team, projects, services, galleries, contact, etc.) |
| | `/app/uploads/avatars/` | Admin / user profile photos |

Public URLs look like:

- `https://<domain>/uploads/cms/<filename>`
- `https://<domain>/uploads/avatars/<filename>`

The database stores those `/uploads/...` paths. **Copy both the files and the database**, or pages will show broken images / empty content.

> Local development uses a bind mount (`./api/uploads`). Production on the droplet uses the named volume `uploads_data` — do not confuse the two.

Confirm the volume name on a droplet:

```bash
docker volume ls | grep uploads
docker volume inspect droplet_uploads_data   # name may differ; use what `ls` shows
```

Confirm files inside the running API:

```bash
docker exec gtaes-api ls -la /app/uploads
docker exec gtaes-api ls -la /app/uploads/cms | head
docker exec gtaes-api ls -la /app/uploads/avatars | head
```

---

## Recommended: export / import via the API container

### 1. On the source droplet (current server)

```bash
# Archive everything under /app/uploads
docker exec gtaes-api tar -C /app/uploads -czf - . > gtaes-uploads.tar.gz

ls -lh gtaes-uploads.tar.gz
```

Optional — dump the database at the same time:

```bash
# Adjust user/db if your .env uses different names
docker exec gtaes-db pg_dump -U gtaes gtaes > gtaes-db.sql

ls -lh gtaes-db.sql
```

### 2. Copy archives to the destination droplet

```bash
scp gtaes-uploads.tar.gz root@CLIENT_DROPLET_IP:/tmp/
scp gtaes-db.sql root@CLIENT_DROPLET_IP:/tmp/
```

Use the client’s IP or hostname. Prefer SSH keys over passwords when possible.

### 3. On the destination droplet (client’s server)

Stack should already be deployed and running (`gtaes-api` / `gtaes-db` up) so the `uploads_data` volume exists.

**Restore uploads:**

```bash
docker exec -i gtaes-api tar -C /app/uploads -xzf - < /tmp/gtaes-uploads.tar.gz

docker exec gtaes-api ls -la /app/uploads/cms | head
docker exec gtaes-api ls -la /app/uploads/avatars | head
```

**Restore database** (only if you are intentionally replacing the destination DB with the source dump):

```bash
# WARNING: overwrites data in the destination database
docker exec -i gtaes-db psql -U gtaes gtaes < /tmp/gtaes-db.sql
```

If the destination already has a different schema or you only need CMS content, prefer a planned dump/restore strategy instead of blindly overwriting. For a full cutover to a fresh droplet, dump + restore is usually correct.

### 4. Verify

1. Open Admin CMS sections that use images (homepage hero, services gallery, about, team, etc.).
2. Hit a known URL: `https://<new-domain>/uploads/cms/<some-file>`.
3. Confirm nginx still proxies `/uploads/` to the API (see droplet nginx config).

---

## Alternative: copy the Docker volume directory on the host

If you prefer working on the host filesystem:

```bash
# Find mountpoint
docker volume inspect droplet_uploads_data
# Look for "Mountpoint" — typically:
# /var/lib/docker/volumes/droplet_uploads_data/_data
```

**Source:**

```bash
tar -C /var/lib/docker/volumes/droplet_uploads_data/_data -czf gtaes-uploads.tar.gz .
```

**Destination** (after the stack has created the volume at least once):

```bash
tar -C /var/lib/docker/volumes/droplet_uploads_data/_data -xzf gtaes-uploads.tar.gz
```

Volume project prefix depends on the compose project name (often `droplet_` when compose is run from `deploy/droplet`). Always confirm with `docker volume ls`.

---

## Checklist for a full droplet move

- [ ] Source: create `gtaes-uploads.tar.gz`
- [ ] Source: create `gtaes-db.sql` (or equivalent dump)
- [ ] Destination: deploy stack from `deploy/droplet` and configure `.env` (domain, SMTP host/port, JWT, DB passwords, CORS, etc.)
- [ ] Destination: restore uploads into `gtaes-api` `/app/uploads`
- [ ] Destination: restore DB (if cutover)
- [ ] Destination: DNS / SSL for the new domain
- [ ] Destination: set CMS SMTP account fields in Admin → Contact settings (credentials are stored in DB/CMS, not only in `.env`)
- [ ] Spot-check CMS images and `/uploads/cms/...` URLs
- [ ] Point Vercel (or other) web/admin `API` / CORS origins at the new domain
- [ ] Decommission or lock down the old droplet when cutover is confirmed

---

## Notes

- **Do not** rely on copying `api/uploads` from the git repo — production files are only on the droplet volume.
- Rebuilding or recreating the `api` container does **not** delete `uploads_data` as long as you do not run `docker compose down -v` (the `-v` flag removes volumes).
- Avatars and CMS images are both under the same volume; copying `/app/uploads` covers every section.
- Image paths in the DB are relative (`/uploads/...`). After restore on a new domain, they keep working as long as nginx proxies `/uploads` to the same API.
