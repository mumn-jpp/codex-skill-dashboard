#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
APPDIR="$ROOT/dist/AppDir"
rm -rf "$APPDIR"
mkdir -p "$APPDIR/usr/bin" "$APPDIR/usr/share/applications" "$APPDIR/usr/share/icons/hicolor/scalable/apps"
cp "$ROOT/dist/codex-skill-dashboard" "$APPDIR/usr/bin/"
cp "$ROOT/packaging/linux/codex-skill-dashboard.desktop" "$APPDIR/usr/share/applications/"
cp "$ROOT/assets/app-icon.svg" "$APPDIR/usr/share/icons/hicolor/scalable/apps/codex-skill-dashboard.svg"
cp "$ROOT/packaging/linux/codex-skill-dashboard.desktop" "$APPDIR/"
cp "$ROOT/assets/app-icon.svg" "$APPDIR/codex-skill-dashboard.svg"
cat > "$APPDIR/AppRun" <<'EOF'
#!/usr/bin/env sh
HERE=$(dirname "$(readlink -f "$0")")
exec "$HERE/usr/bin/codex-skill-dashboard" "$@"
EOF
chmod +x "$APPDIR/AppRun" "$APPDIR/usr/bin/codex-skill-dashboard"
: "${APPIMAGETOOL:?Set APPIMAGETOOL to appimagetool path}"
ARCH=x86_64 APPIMAGE_EXTRACT_AND_RUN=1 "$APPIMAGETOOL" "$APPDIR" "$ROOT/dist/Codex-Skill-Dashboard-x86_64.AppImage"
