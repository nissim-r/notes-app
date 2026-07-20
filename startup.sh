#!/bin/sh
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  echo "Dev server already running on :8080"
  exit 0
fi
echo "Starting npm run dev on 0.0.0.0:8080..."
npm run dev >>/tmp/app-startup.log 2>&1 &
