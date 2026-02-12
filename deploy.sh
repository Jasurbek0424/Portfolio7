#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/portfolio"
cd "$APP_DIR"

echo "========================================="
echo "  Portfolio Deploy Script"
echo "========================================="

# Pull latest changes
echo ""
echo "[1/6] Pulling latest code..."
git pull origin main

# Backend
echo ""
echo "[2/6] Building backend..."
cd "$APP_DIR/backend"
npm install --omit=dev
npx prisma generate
npm run build

# Frontend
echo ""
echo "[3/6] Building frontend..."
cd "$APP_DIR/frontend"
npm install --omit=dev
npm run build

# Admin Panel
echo ""
echo "[4/6] Building admin panel..."
cd "$APP_DIR/adminPanel"
npm install --omit=dev
npm run build

# Restart PM2 processes
echo ""
echo "[5/6] Restarting services..."
cd "$APP_DIR"
pm2 restart ecosystem.config.js

# Status
echo ""
echo "[6/6] Current status:"
pm2 status

echo ""
echo "========================================="
echo "  Deploy complete!"
echo "========================================="
