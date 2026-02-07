#!/usr/bin/env bash
set -euo pipefail

SERVER_HOST="${SERVER_HOST:-81.163.27.15}"
SERVER_USER="${SERVER_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/portfolio}"
APP_NAME="${APP_NAME:-portfolio}"
PORT="${PORT:-3001}"
HOST="${HOST:-127.0.0.1}"
NODE_BIN="${NODE_BIN:-/root/.nvm/versions/node/v20.19.5/bin/node}"

ssh "${SERVER_USER}@${SERVER_HOST}" "mkdir -p ${REMOTE_DIR}"

rsync -az --delete \
	--exclude node_modules \
	--exclude .git \
	--exclude .nuxt \
	--exclude .output \
	./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/"

ssh "${SERVER_USER}@${SERVER_HOST}" "cd ${REMOTE_DIR} && rm -rf .output && export PATH=$(dirname "${NODE_BIN}"):\\$PATH && npm install && npm run build && PORT=${PORT} HOST=${HOST} pm2 restart ${APP_NAME} --update-env || PORT=${PORT} HOST=${HOST} pm2 start ${NODE_BIN} --name ${APP_NAME} -- ${REMOTE_DIR}/.output/server/index.mjs && pm2 save"
