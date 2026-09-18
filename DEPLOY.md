# Deploy — wio-api

CD trên `develop` / `main` dùng GitHub Environment (`development` / `production`) và secrets sẵn có. Image: `ghcr.io/hoanghoan04/wio-api`.

| Nhánh | Environment | Container | Host bind |
|---|---|---|---|
| `main` | `production` | `wio_api_prod` | `127.0.0.1:5001` → `3000` |
| `develop` | `development` | `wio_api_dev` | `127.0.0.1:4001` → `3000` |

Env trên VPS lấy từ **Doppler** (`DOPPLER_TOKEN`). CD ghi `PORT=3000` vào `.env` khi chạy container.

## GitHub Environment secrets

| Secret | Mục đích |
|---|---|
| `SERVER_HOST` / `SERVER_USER` / `SSH_PRIVATE_KEY` | SSH VPS |
| `DOPPLER_TOKEN` | Env production/dev |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Notify |
| `DEPLOY_URL` | URL hiện trong Telegram (optional) |

Repo secrets không thay cho Environment secrets. Job CD có `environment: production` khi push `main`.

## VPS

- Thư mục: `/opt/wio/prod/api` (prod) hoặc `/opt/wio/dev/api` (dev)
- Network: `wio_net`
- Nginx host proxy tới `127.0.0.1:5001` (prod)

## File trong repo

- `Dockerfile` — `builder` / `migration` / `production` (bcrypt cần `python3 make g++`)
- `docker-compose.yml` — local
- `docker-compose.prod.yml` — compose tùy chọn, CD hiện tại dùng `docker run`
- `nginx/site.conf` — TLS reverse proxy trên host
- `k8s/` — Kubernetes (tùy chọn)
- `.github/workflows/ci.yml` / `cd.yml`
