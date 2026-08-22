#!/usr/bin/env bash
set -euo pipefail

backend_port="${BACKEND_PORT:-8000}"

uvicorn backend.main:app --host 127.0.0.1 --port "$backend_port" &
backend_pid=$!

node /app/server.js &
frontend_pid=$!

shutdown() {
  kill -TERM "$frontend_pid" "$backend_pid" 2>/dev/null || true
}

trap shutdown SIGINT SIGTERM

set +e
wait -n "$frontend_pid" "$backend_pid"
exit_code=$?
set -e

shutdown
wait "$frontend_pid" "$backend_pid" 2>/dev/null || true
exit "$exit_code"
