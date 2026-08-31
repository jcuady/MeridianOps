# MeridianOps deploy

## API (Render)

Blueprint: [`../render.yaml`](../render.yaml) at repo root.

1. Render Dashboard -> New -> Blueprint -> `jcuady/MeridianOps`
2. Free web service builds `backend/Dockerfile` (H2 in-memory for demo)
3. After the SPA is live, set `CORS_ORIGINS` to the Vercel origin (no trailing slash)
4. Health: `GET /api/health`

API hostname used by the SPA prod env: `https://meridianops-api.onrender.com`  
(Update `frontend/src/environments/environment.prod.ts` if Render assigns a different URL.)

## SPA (Vercel)

Root directory: `frontend/`  
Config: [`vercel.json`](vercel.json) (`npm ci && npm run build`, output `dist/meridianops-frontend/browser`)

1. Vercel -> Add New Project -> Import `jcuady/MeridianOps`
2. Grant the Vercel GitHub App access to this repo if the import list is empty
3. Set Root Directory to `frontend`
4. Deploy

Local verify:

```bash
cd frontend
npm ci
npm run build
```

## CI

`_deploy_local/ci.yml` -- Angular build + Maven test/package. Copy to `.github/workflows/ci.yml` after `gh auth refresh -s workflow`.
