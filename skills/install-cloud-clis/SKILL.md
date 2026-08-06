---
name: install-cloud-clis
description: >-
  Install cloud and container CLIs needed to host firebase-email-link-host
  (Docker, Bun, gcloud, aws, az, flyctl, railway, firebase-tools, wrangler,
  vercel, netlify). Use when preparing an environment for Docker SSH or
  serverless Docker deploys. Prefer Bun for JavaScript CLIs.
---

# Install cloud provider CLIs

## Rules

- For this project’s JavaScript tooling, **always use Bun** (`bun`, `bunx`) — not npm or yarn.
- Prefer official install scripts from each vendor.
- After install, verify with `--version` / `version`.

## Bun

```bash
curl -fsSL https://bun.sh/install | bash
bun --version
```

## Docker Engine

```bash
curl -fsSL https://get.docker.com | sh
docker --version
```

## Fly.io

```bash
curl -L https://fly.io/install.sh | sh
fly version
```

## Railway

```bash
bunx @railway/cli --version
```

## Google Cloud SDK

Follow https://cloud.google.com/sdk/docs/install then:

```bash
gcloud auth login
gcloud config set project PROJECT_ID
```

## AWS CLI v2

Follow https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html then `aws configure`.

## Azure CLI

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login
```

## Static-host CLIs (Bun)

```bash
bunx firebase-tools@latest --version
bunx wrangler --version
bunx vercel --version
bunx netlify --version
```

## Next step

Hand off to skill `host-email-link-docker` once CLIs for the chosen target are available.
