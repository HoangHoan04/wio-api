# Deploy — wio-api

Repo này push độc lập. Image: `ghcr.io/<owner>/wio-api`.

| Môi trường | Domain | Port trong container | Bind trên VPS |
|---|---|---|---|
| Production | `https://api.tiemcuoitanthoi.id.vn` | `4300` | `127.0.0.1:4300` |

## 1. GitHub Secrets

Settings → Secrets and variables → Actions:

| Secret | Mục đích |
|---|---|
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Thông báo CI/CD |
| `SSH_HOST` / `SSH_USER` / `SSH_KEY` | SSH vào VPS |
| `SSH_PORT` | Tùy chọn, mặc định `22` |
| `DEPLOY_PATH` | Thư mục trên VPS, mặc định `/opt/wio-api` |
| `GHCR_TOKEN` | PAT `read:packages` để VPS `docker pull` |

Bật Packages write cho GITHUB_TOKEN (workflow `cd.yml` đã khai báo `packages: write`).

## 2. Lần đầu trên VPS (Docker Compose)

```bash
sudo mkdir -p /opt/wio-api /var/www/certbot
sudo git clone git@github.com:<owner>/wio-api.git /opt/wio-api
cd /opt/wio-api
cp .env.production.example .env
# sửa mật khẩu, JWT_SECRET, OAuth, Cloudinary
nano .env

sudo cp nginx/site.conf /etc/nginx/sites-available/wio-api.conf
sudo ln -sf /etc/nginx/sites-available/wio-api.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot certonly --webroot -w /var/www/certbot \
  -d api.tiemcuoitanthoi.id.vn

export GHCR_OWNER=<owner>
export TAG=latest
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml --profile tools run --rm migration
docker compose -f docker-compose.prod.yml up -d
```

Container chỉ listen `127.0.0.1`. Nginx host terminate TLS rồi proxy vào `4300`.

Push `main` sau đó: GitHub Actions build → GHCR → SSH pull/migrate/up.

## 3. Kubernetes (tùy chọn)

```bash
# 1) Secret thật (không commit)
cp k8s/secret.example.yml k8s/secret.yml
# sửa CHANGE_ME rồi:
kubectl apply -f k8s/secret.yml

# 2) Nếu image GHCR private
kubectl create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<GHCR_TOKEN> \
  -n wio
# thêm imagePullSecrets: [{name: ghcr-pull}] vào k8s/deployment.yml

# 3) Apply stack
sed -i 's/YOUR_GH_OWNER/<owner>/g' k8s/*.yml
kubectl apply -k k8s
kubectl apply -f k8s/migration-job.yml
```

Ingress dùng cert-manager issuer `letsencrypt-prod` và nginx ingress class.

## 4. File trong repo này

- `Dockerfile` — stages `builder` / `migration` / `production`
- `docker-compose.yml` — local
- `docker-compose.prod.yml` — VPS (postgres + redis + api)
- `nginx/site.conf` — copy sang `/etc/nginx/sites-available` trên VPS
- `k8s/` — namespace, configmap, postgres, redis, deployment, service, ingress, hpa, migration-job
- `.github/workflows/ci.yml` — typecheck + build trên `develop`/`main`
- `.github/workflows/cd.yml` — push `main` → GHCR + deploy VPS
