#!/usr/bin/env bash
# Boots a built image and checks that the main routes return 200.
#
# Shared by both paths in .github/workflows/deploy.yml: pull requests run it
# against the locally loaded amd64 image, main runs it against the pushed
# digest. Keeping one copy means the two cannot drift apart.
#
# / alone never exercises the Supabase or Clerk client code. /collection and
# /quiz both mount CollectionProvider consumers, so a build with missing
# NEXT_PUBLIC_* values fails here instead of in production.
#
# Usage: scripts/smoke-test.sh <image-ref>

set -euo pipefail

IMAGE="${1:?usage: smoke-test.sh <image-ref>}"
NAME="smoke"
WAIT_SECONDS=60

trap 'docker rm -f "$NAME" > /dev/null 2>&1 || true' EXIT

docker run -d --name "$NAME" -p 3000:3000 "$IMAGE" > /dev/null

echo "Waiting up to ${WAIT_SECONDS}s for the app to start..."
ready=0
for i in $(seq 1 "$WAIT_SECONDS"); do
  if curl -sf http://localhost:3000 > /dev/null; then
    echo "App is up after ${i}s"
    ready=1
    break
  fi
  sleep 1
done
if [ "$ready" != "1" ]; then
  echo "App did not respond within ${WAIT_SECONDS}s"
  docker logs "$NAME"
  exit 1
fi

failed=0
for path in / /collection /quiz /guide; do
  status=$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:3000${path}")
  if [ "$status" = "200" ]; then
    echo "OK   ${path} -> ${status}"
  else
    echo "FAIL ${path} -> ${status}"
    failed=1
  fi
done

if [ "$failed" != "0" ]; then
  echo "--- container logs ---"
  docker logs "$NAME"
  exit 1
fi
