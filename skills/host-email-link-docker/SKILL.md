---
name: host-email-link-docker
description: >-
  Deploy firebase-email-link-host using the published Docker image
  ($DOCKERHUB_USERNAME/firebase-email-link-host) locally, over SSH to cloud VMs, or
  on serverless Docker platforms (Fly, Railway, Render, Cloud Run, App Runner,
  Azure Container Apps). Use when the user wants to host the email-link /
  App Links site with Docker and provides env/config details.
---

# Host Email Link Host with Docker

## Image

- Repository: `$DOCKERHUB_USERNAME/firebase-email-link-host` (ask the user for their Docker Hub username / image namespace)
- Tags: `latest`, semver (`1.2.3`), and git tags (`v1.2.3`)
- Architectures: `linux/amd64`, `linux/arm64`
- Container listens on `ADDR` (default `:8080`) or `PORT`

## Always use Bun for this project's JS

For Next/static builds or docs in this repo, use `bun` — never npm/yarn.

## Collect from the user

1. Docker Hub username / full image name (default image: `$DOCKERHUB_USERNAME/firebase-email-link-host`)
2. Image tag (default `latest`)
3. Env values (accept `SITE_BRAND` **or** `NEXT_PUBLIC_SITE_BRAND`, same for other keys)
4. Target: `local` | `ssh` | `fly` | `railway` | `render` | `cloudrun` | `apprunner` | `azure-container-apps`
5. For SSH: host, user, SSH key/path, desired publish port
6. Optional `SITE_CONFIG_PATH` JSON file

Write a temporary `.env` with double-quoted values; do not commit it.

## Local

```bash
docker pull $DOCKERHUB_USERNAME/firebase-email-link-host:TAG
docker run --rm -p 8080:8080 --env-file .env $DOCKERHUB_USERNAME/firebase-email-link-host:TAG
```

Or `docker compose up` using repo `compose.yml`.

## SSH (DigitalOcean, Hetzner, Linode, EC2, GCE, Azure VM)

1. Install Docker on remote if missing (`curl -fsSL https://get.docker.com | sh`)
2. Open firewall for 80/443/8080 as needed
3. Copy `.env` with `scp`
4. Pull and run with `--restart unless-stopped`
5. Verify:
   - `curl -sI http://HOST:8080/.well-known/apple-app-site-association` → `Content-Type: application/json`
   - `Content-Disposition: inline` (not attachment)

## Serverless Docker

Set env vars in the platform UI/CLI. Ensure the service targets port **8080** (or set `PORT`).

### Cloud Run

```bash
gcloud run deploy email-link-host \
  --image=$DOCKERHUB_USERNAME/firebase-email-link-host:TAG \
  --allow-unauthenticated --port=8080 \
  --set-env-vars="KEY=value,..."
```

### Fly.io

Use `flyctl` with the public image or deploy from the repo Dockerfile.

### Railway / Render

Create a service from Docker Hub image `$DOCKERHUB_USERNAME/firebase-email-link-host`.

### AWS App Runner / Azure Container Apps

Point at the Docker Hub image; map ingress to 8080; inject env/secrets.

## After deploy

Remind the user to:
- Add the continue URL / domain to Firebase Auth authorized domains
- Host association files at `/.well-known/...` on that domain
- Verify AASA is served as `application/json` (inline), not a download
