#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
APP="$ROOT/dist/Codex Skill Dashboard.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$ROOT/dist/codex-skill-dashboard" "$APP/Contents/MacOS/"
cp "$ROOT/packaging/macos/Info.plist" "$APP/Contents/"
cp "$ROOT/build/generated-icons/AppIcon.icns" "$APP/Contents/Resources/"
chmod +x "$APP/Contents/MacOS/codex-skill-dashboard"
if [ -n "${APPLE_SIGN_IDENTITY:-}" ]; then codesign --force --options runtime --sign "$APPLE_SIGN_IDENTITY" "$APP"; else codesign --force --sign - "$APP"; fi
hdiutil create -volname "Codex Skill Dashboard" -srcfolder "$APP" -ov -format UDZO "$ROOT/dist/Codex-Skill-Dashboard-0.1.0-unsigned.dmg"
