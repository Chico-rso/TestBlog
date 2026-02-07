#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-81.163.27.15}"
SERVER_USER="${SERVER_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/portfolio}"
APP_NAME="${APP_NAME:-portfolio}"
PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"

npm install
npm run build

ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_DIR}"
scp -r .output/* "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/"
ssh "${SERVER_USER}@${SERVER_HOST}" "PORT=${PORT} HOST=${HOST} pm2 restart ${APP_NAME} || PORT=${PORT} HOST=${HOST} pm2 start ${REMOTE_DIR}/server/index.mjs --name ${APP_NAME} --interpreter node --time --env production && pm2 save"
