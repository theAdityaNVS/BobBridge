#!/usr/bin/env bash
set -euo pipefail
RES=$(curl -s -X POST http://localhost:3000/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Create an endpoint to fetch user order history with item name, price, and status."}')
URL=$(node -pe "JSON.parse(process.argv[1]).mockUrl" "$RES")
echo "OK Mock URL: $URL"
curl -sf "$URL" | head -c 200
echo
echo "OK Mock URL serves JSON"

# Made with Bob
