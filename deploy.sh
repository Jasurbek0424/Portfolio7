#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/portfolio"
BACKUP_DIR="/var/www/portfolio-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/portfolio-deploy-${TIMESTAMP}.log"

# Log everything
exec > >(tee -a "$LOG_FILE") 2>&1

cd "$APP_DIR"

echo "========================================="
echo "  Portfolio Deploy Script"
echo "  Started: $(date)"
echo "========================================="

# ── Step 1: Backup current deployment ──
echo ""
echo "[1/8] Creating backup..."
mkdir -p "$BACKUP_DIR"
if [ -d "$APP_DIR/backend/dist" ]; then
  tar czf "$BACKUP_DIR/backup-${TIMESTAMP}.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=uploads \
    backend/dist adminPanel/.next frontend/dist ecosystem.config.js 2>/dev/null || true
  echo "  Backup created: $BACKUP_DIR/backup-${TIMESTAMP}.tar.gz"
else
  echo "  No existing build to backup (first deploy)"
fi

# Keep only last 5 backups
ls -t "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

# ── Step 2: Pull latest changes ──
echo ""
echo "[2/8] Pulling latest code..."
git pull origin main

# ── Step 3: Backend ──
echo ""
echo "[3/8] Building backend..."
cd "$APP_DIR/backend"
npm install
npx prisma generate
npx prisma db push --skip-generate 2>/dev/null || echo "  (No schema changes)"
npm run build
npm prune --omit=dev

# ── Step 4: Frontend ──
echo ""
echo "[4/8] Building frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build
npm prune --omit=dev

# ── Step 5: Admin Panel ──
echo ""
echo "[5/8] Building admin panel..."
cd "$APP_DIR/adminPanel"
npm install
npm run build
npm prune --omit=dev

# ── Step 6: Restart services ──
echo ""
echo "[6/8] Restarting services..."
cd "$APP_DIR"
pm2 restart ecosystem.config.js

# ── Step 7: Health check ──
echo ""
echo "[7/8] Running health checks..."
sleep 3

HEALTH_OK=true

# Check backend
if curl -sf http://127.0.0.1:4000/health > /dev/null 2>&1; then
  echo "  ✓ Backend is healthy"
else
  echo "  ✗ Backend health check failed!"
  HEALTH_OK=false
fi

# Check admin panel
if curl -sf http://127.0.0.1:3001 > /dev/null 2>&1; then
  echo "  ✓ Admin panel is healthy"
else
  echo "  ✗ Admin panel health check failed!"
  HEALTH_OK=false
fi

if [ "$HEALTH_OK" = false ]; then
  echo ""
  echo "  ⚠ Health checks failed. Check logs: pm2 logs"
  echo "  To rollback: tar xzf $BACKUP_DIR/backup-${TIMESTAMP}.tar.gz -C $APP_DIR && pm2 restart all"
fi

# ── Step 8: Status ──
echo ""
echo "[8/8] Current status:"
pm2 status

echo ""
echo "========================================="
echo "  Deploy complete! $(date)"
echo "  Log: $LOG_FILE"
echo "========================================="
