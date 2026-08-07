# Email Link Host

Free **static** (or tiny Go/Docker) host for mobile [Firebase Auth email-link](https://firebase.google.com/docs/auth/android/email-link-auth) sign-in (App Links / Universal Links), with a branded landing page and optional store buttons.

## Documentation

Full docs: **[https://rutvik24.github.io/email-link-host/](https://rutvik24.github.io/email-link-host/)**

| Topic | Link |
| --- | --- |
| Introduction | [Docs intro](https://rutvik24.github.io/email-link-host/docs/intro) |
| Configuration | [Site / theme / env](https://rutvik24.github.io/email-link-host/docs/email-link-host/configuration) |
| Hosting overview | [Firebase, Cloudflare, Vercel, …](https://rutvik24.github.io/email-link-host/docs/hosting/overview) |
| Docker | [Pure Go image](https://rutvik24.github.io/email-link-host/docs/hosting/docker) |
| Universal Links Helper | [Companion tool](https://rutvik24.github.io/email-link-host/docs/universal-links-helper/overview) |
| Agent skills | [AI deploy skills](https://rutvik24.github.io/email-link-host/docs/agents/overview) |
| Releases | [VERSION + Docker Hub](https://rutvik24.github.io/email-link-host/docs/reference/releases) |

Related: [app-universal-links-helper](https://github.com/rutvik24/app-universal-links-helper) · [Docker Hub](https://hub.docker.com/r/rutviknabhoya/email-link-host) · [GitHub Releases](https://github.com/rutvik24/email-link-host/releases)

## Highlights

- No Firebase JS SDK, no Storage, no App Hosting / Blaze required for Firebase Hosting
- Association files generated from env
- Same `out/` artifact for Firebase / Cloudflare / Vercel / Netlify / Amplify
- **Docker uses a pure Go replica** (single static binary — no Next.js `out/` copied into the image)

## Local development

```bash
cp .env.example .env.local
# Edit config/site.json and/or env (store URLs, theme, association vars)

bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Well-known JSON (must render in the browser, not download):

- [http://localhost:3000/.well-known/apple-app-site-association](http://localhost:3000/.well-known/apple-app-site-association)
- [http://localhost:3000/.well-known/assetlinks.json](http://localhost:3000/.well-known/assetlinks.json)

`next.config.ts` sets `Content-Type: application/json` + `Content-Disposition: inline` for these paths in `next dev`.

### Pure Go server (same app, no Node)

```bash
bun run serve          # http://localhost:8080
```

Serves the landing page, theme/config from env/`SITE_CONFIG_PATH`, and `.well-known` JSON with `Content-Disposition: inline` (no file download).

Go/Docker accepts **both** env naming styles (unprefixed preferred when both are set):

| Unprefixed | Also accepted |
| --- | --- |
| `SITE_BRAND` | `NEXT_PUBLIC_SITE_BRAND` |
| `ANDROID_STORE_URL` | `NEXT_PUBLIC_ANDROID_STORE_URL` |
| `THEME_ACCENT` | `NEXT_PUBLIC_THEME_ACCENT` |
| `ANDROID_PACKAGE_NAME` | `NEXT_PUBLIC_ANDROID_PACKAGE_NAME` |
| `IOS_TEAM_ID` | `NEXT_PUBLIC_IOS_TEAM_ID` |
| … | same pattern for all site / theme / association vars |
## Landing page config

1. JSON file — `config/site.json` by default, or `SITE_CONFIG_PATH`
2. Optional env overrides (`NEXT_PUBLIC_SITE_*`, `NEXT_PUBLIC_THEME_*`, store URLs)

```bash
SITE_CONFIG_PATH="config/site.json"
```

| Variable | Purpose |
| --- | --- |
| `SITE_CONFIG_PATH` | Path to site JSON (relative or absolute) |
| `NEXT_PUBLIC_ANDROID_STORE_URL` | Google Play URL — button when set |
| `NEXT_PUBLIC_IOS_STORE_URL` | App Store URL — button when set |
| `NEXT_PUBLIC_SITE_*` / `NEXT_PUBLIC_THEME_*` | Copy / theme overrides |

## Association files (from env)

| Variable | Notes |
| --- | --- |
| `ANDROID_PACKAGE_NAME` | applicationId |
| `ANDROID_SHA256_CERT_FINGERPRINTS` | Comma-separated SHA-256 fingerprints |
| `IOS_TEAM_ID` / `IOS_BUNDLE_ID` | Apple Team ID + bundle ID |
| `IOS_APP_PATHS` | Optional paths (default `NOT /_/*,/*`) |

## Hosting options

All platforms publish the static `out/` directory from `bun run build`.

### Firebase Hosting (Spark / free)

```bash
bun run build
npx -y firebase-tools@latest deploy --only hosting
```

Headers: [`firebase.json`](firebase.json)

### Cloudflare Pages

- Build command: `bun run build` (or `npm run build`)
- Output directory: `out`
- Headers: [`public/_headers`](public/_headers) (copied into `out/`) + optional [`wrangler.toml`](wrangler.toml)

```bash
npx wrangler pages deploy out
```

### Vercel

Connect the repo; framework preset can be Other with output `out`, or use [`vercel.json`](vercel.json) headers.

```bash
bun run build && npx vercel deploy --prebuilt
```

### Netlify

[`netlify.toml`](netlify.toml) — build `bun run build`, publish `out`, JSON headers for `.well-known`.

### AWS Amplify

[`amplify.yml`](amplify.yml) — build to `out` + `customHeaders` for association files.

### Docker (pure Go — minimal image)

Docker does **not** copy the Next.js `out/` folder. The image is only a statically linked Go binary (`scratch`) that reimplements:

- Landing page (brand / theme / store buttons)
- Config from embedded defaults, `SITE_CONFIG_PATH`, and env
- `/.well-known/assetlinks.json` + `apple-app-site-association` as inline JSON

```bash
docker compose up --build
# → http://localhost:8080
```

Or:

```bash
bun run docker:build
bun run docker:run   # passes --env-file .env
```

Typical image size is a few MB (binary only). Pass the same env vars as the Next app; optionally mount a JSON config:

```yaml
volumes:
  - ./config/site.json:/config/site.json:ro
environment:
  SITE_CONFIG_PATH: /config/site.json
```

### Go binary (no Docker)

```bash
go build -ldflags="-s -w" -o bin/server ./cmd/server
ADDR=:8080 ./bin/server
```

## Docs site (Docusaurus + Bun)

```bash
bun run docs:dev      # http://localhost:3000/email-link-host/
bun run docs:build
```

GitHub Pages deploys from `docs-website/` via `.github/workflows/docs.yml` →  
https://rutvik24.github.io/email-link-host/

## Releases (tag → Docker Hub + GitHub Release)

Single source of truth: root **`VERSION`** (Next, docs, Go, Docker).

```bash
bun run version:set 1.0.0
git add VERSION package.json docs-website/package.json internal/version/version.go compose.yml
git commit -m "chore: release 1.0.0"
git tag v1.0.0
git push origin main v1.0.0
```

Tag must match `v$(cat VERSION)` or the release workflow fails.

Requires:

| Name | Type | Purpose |
| --- | --- | --- |
| `DOCKERHUB_USERNAME` | Variable (preferred) | Docker Hub username |
| `DOCKERHUB_TOKEN` | Secret | Docker Hub access token |

Image: `<DOCKERHUB_USERNAME>/email-link-host`  
Docs: https://rutvik24.github.io/email-link-host/

## Agent skills

See `skills/` and docs: [Agent overview](https://rutvik24.github.io/email-link-host/docs/agents/overview).

```bash
mkdir -p .cursor/skills
cp -R skills/* .cursor/skills/
```

## Scripts

```bash
bun run generate:well-known
bun run dev
bun run build                 # Next static export → out/ (CDN hosts)
bun run serve                 # Pure Go app on :8080
bun run docker:build
bun run docker:run
bun run docs:dev
bun run docs:build
```
