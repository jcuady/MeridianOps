# MeridianOps deploy

## Live smoke (this machine session)

| Surface | URL | Notes |
|---------|-----|-------|
| SPA | https://jcuady.github.io/MeridianOps/ | GitHub Pages |
| API (tunnel) | https://plasma-listed-dirt-breeding.trycloudflare.com | Cloudflare quick tunnel to local JAR; ephemeral |
| Demo login | username `ops` / password `ops123` | Seeded by DataSeeder |

Health: `GET {API}/api/health` -> `{"status":"UP"}`

## API (Render permanent)

Blueprint: repo-root `render.yaml`.

1. https://render.com/deploy?repo=https://github.com/jcuady/MeridianOps
2. Set `CORS_ORIGINS=https://jcuady.github.io`
3. After deploy, update `frontend/src/environments/environment.prod.ts` API host and redeploy Pages / Vercel

## SPA

- GitHub Pages: `gh-pages` branch (auto)
- Vercel: import `jcuady/MeridianOps`, root `frontend/` (grant GitHub App)

## Local

```bash
cd backend && mvn -DskipTests package && java -jar target/meridianops-backend-0.1.0.jar
cd frontend && npm ci && npm start
```
