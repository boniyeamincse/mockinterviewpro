#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_HOST="127.0.0.1"
BACKEND_PORT="8000"
FRONTEND_PORT="5173"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is required but not installed."
    exit 1
  fi
}

cleanup() {
  echo
  echo "Stopping development servers..."
  jobs -pr | xargs -r kill
}

trap cleanup INT TERM EXIT

echo "Starting development environment..."

if [ ! -d "$BACKEND_DIR" ]; then
  echo "Error: backend directory not found at $BACKEND_DIR"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Error: frontend directory not found at $FRONTEND_DIR"
  exit 1
fi

require_cmd php
require_cmd npm

if [ ! -f "$BACKEND_DIR/artisan" ]; then
  echo "Error: Laravel artisan file not found at $BACKEND_DIR/artisan"
  exit 1
fi

if [ ! -d "$BACKEND_DIR/vendor" ]; then
  echo "Backend dependencies missing. Running composer install..."
  require_cmd composer
  (cd "$BACKEND_DIR" && composer install --no-interaction --prefer-dist)
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Frontend dependencies missing. Running npm install..."
  (cd "$FRONTEND_DIR" && npm install)
fi

echo "Launching Laravel API on http://$BACKEND_HOST:$BACKEND_PORT"
(
  cd "$BACKEND_DIR"
  php artisan serve --host="$BACKEND_HOST" --port="$BACKEND_PORT"
) &

echo "Launching frontend dev server on http://localhost:$FRONTEND_PORT"
(
  cd "$FRONTEND_DIR"
  npm run dev -- --host --port "$FRONTEND_PORT"
) &

echo
echo "Servers are running. Press Ctrl+C to stop both."

wait
