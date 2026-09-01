#!/usr/bin/env bash
# Records MP4 walkthrough videos for each demo role on iOS Simulator.
# Prereqs: Xcode, iPhone 17 simulator, Metro (npx expo start), detox build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/demoStore/ios"
DEVICE_NAME="${IOS_SIM_DEVICE:-iPhone 17}"
METRO_PORT="${METRO_PORT:-8081}"

mkdir -p "$OUT_DIR"

cd "$ROOT"

if [[ ! -d ios ]]; then
  echo "Running expo prebuild for iOS..."
  npx expo prebuild --platform ios --no-install
fi

if [[ ! -f ios/build/Build/Products/Debug-iphonesimulator/ummahHomes.app/Contents/Info.plist ]] \
  && [[ ! -d ios/build/Build/Products/Debug-iphonesimulator/ummahHomes.app ]]; then
  echo "Building iOS app for simulator (first run may take several minutes)..."
  npm run test:e2e:mobile:build
fi

echo "Booting simulator: $DEVICE_NAME"
xcrun simctl boot "$DEVICE_NAME" 2>/dev/null || true
open -a Simulator

record_flow() {
  local name="$1"
  local test_file="$2"
  local out="$OUT_DIR/${name}.mp4"

  echo "Recording iOS: $name -> $out"
  rm -f "$out"
  xcrun simctl io booted recordVideo -f "$out" &
  local rec_pid=$!
  sleep 2

  DETOX_CONFIGURATION=ios.sim.debug \
    npx detox test -c ios.sim.debug "$test_file" --headless --record-logs none || true

  sleep 1
  kill -INT "$rec_pid" 2>/dev/null || true
  wait "$rec_pid" 2>/dev/null || true
  sleep 1

  if [[ -f "$out" ]]; then
    echo "Wrote $out"
  else
    echo "Warning: expected video missing: $out" >&2
  fi
}

if ! curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1; then
  echo "Starting Metro on port ${METRO_PORT}..."
  npx expo start --port "$METRO_PORT" >/tmp/ummahhomes-metro.log 2>&1 &
  METRO_PID=$!
  for _ in $(seq 1 60); do
    if curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done
  if ! curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1; then
    echo "Metro failed to start. See /tmp/ummahhomes-metro.log"
    exit 1
  fi
fi

record_flow "seller-flow" "e2e/demo-seller.e2e.js"
record_flow "buyer-flow" "e2e/demo-buyer.e2e.js"
record_flow "renter-flow" "e2e/demo-renter.e2e.js"
record_flow "admin-flow" "e2e/demo-admin.e2e.js"

echo "Done. Videos in $OUT_DIR"
