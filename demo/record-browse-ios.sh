#!/usr/bin/env bash
# Records browse-flow.mp4 on iOS Simulator.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/demoStore/ios"
DEVICE_NAME="${IOS_SIM_DEVICE:-iPhone 17}"
METRO_PORT="${METRO_PORT:-8081}"

mkdir -p "$OUT_DIR"
cd "$ROOT"

if [[ ! -d ios ]]; then
  npx expo prebuild --platform ios --no-install
fi

if [[ ! -d ios/build/Build/Products/Debug-iphonesimulator/ummahHomes.app ]]; then
  echo "Building iOS app for simulator..."
  npm run test:e2e:mobile:build
fi

xcrun simctl boot "$DEVICE_NAME" 2>/dev/null || true
open -a Simulator

if ! curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1; then
  echo "Starting Metro on port ${METRO_PORT}..."
  npx expo start --port "$METRO_PORT" >/tmp/ummahhomes-metro.log 2>&1 &
  for _ in $(seq 1 60); do
    curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1 && break
    sleep 2
  done
fi

OUT="$OUT_DIR/browse-flow.mp4"
echo "Recording iOS: browse-flow -> $OUT"
rm -f "$OUT"
xcrun simctl io booted recordVideo -f "$OUT" &
REC_PID=$!
sleep 2

DETOX_CONFIGURATION=ios.sim.debug \
  npx detox test -c ios.sim.debug e2e/demo-browse.e2e.js --headless --record-logs none || true

sleep 1
kill -INT "$REC_PID" 2>/dev/null || true
wait "$REC_PID" 2>/dev/null || true

echo "Wrote $OUT"
