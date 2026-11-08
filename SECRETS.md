# Secrets (yuhang.ch / Vercel)

## Environment variables

| Name | Where | Notes |
|------|--------|--------|
| `API_URL` | Vercel + `.env` | e.g. `https://api.yuhang.ch/v1` |
| `API_JWT_PRIVATE_KEY` | Vercel + `.env` | Ed25519 PKCS8 PEM (`\n`-escaped one line). **Never commit.** |
| `API_SECRET` | optional / remove after cutover | Legacy shared Bearer; Astro no longer sends it |
| `STUDIO_SECRET` | Vercel + `.env` | Studio HTTP Basic blob |
| `AMAP_KEY` | Vercel + `.env` | Server-only |
| `MAPBOX_TOKEN` | Vercel + `.env` | Public client token |

## Generate JWT keypair

From `api.yuhang.ch`:

```bash
pnpm keys:generate
```

- Put **private** one-liner into this project's `.env` as `API_JWT_PRIVATE_KEY=...`
- Put **public** one-liner into `api.yuhang.ch/.dev.vars` as `API_JWT_PUBLIC_KEY=...`

## Push to Vercel from CLI (local)

1. Create a token: https://vercel.com/account/tokens  
2. Put it in **local** `.env` (gitignored), not the dashboard app env unless you want:

```env
VERCEL_TOKEN=vercel_xxxx
```

3. Then:

```powershell
pnpm secrets:put
# or only JWT:
# pwsh ./scripts/put-vercel-env.ps1 -Keys API_JWT_PRIVATE_KEY
```

Script reads `VERCEL_TOKEN` from `.env` (or `$env:VERCEL_TOKEN`), detects link via `.vercel/repo.json` (CLI v64+) or `project.json`, then upserts env vars. No `vercel login` required.

Shell-only (not written to disk):

```powershell
$env:VERCEL_TOKEN = "vercel_xxxx"
pnpm secrets:put
```

Cloudflare Worker secrets (public key): from `api.yuhang.ch` run `pnpm secrets:put`.

## Deploy order

1. Worker with JWT verify (+ legacy `API_TOKEN` still accepted)
2. This site with `API_JWT_PRIVATE_KEY` (CLI or dashboard), then redeploy
3. Worker cutover: remove `API_TOKEN`; delete `API_SECRET` from Vercel when ready
