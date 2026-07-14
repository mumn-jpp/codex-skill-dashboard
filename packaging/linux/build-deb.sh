#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
PKG="$ROOT/dist/deb-root"
rm -rf "$PKG"
mkdir -p "$PKG/DEBIAN" "$PKG/opt/codex-skill-dashboard" "$PKG/usr/bin" "$PKG/usr/share/applications" "$PKG/usr/share/icons/hicolor/scalable/apps"
cp "$ROOT/dist/codex-skill-dashboard" "$PKG/opt/codex-skill-dashboard/"
ln -s /opt/codex-skill-dashboard/codex-skill-dashboard "$PKG/usr/bin/codex-skill-dashboard"
cp "$ROOT/packaging/linux/codex-skill-dashboard.desktop" "$PKG/usr/share/applications/"
cp "$ROOT/assets/app-icon.svg" "$PKG/usr/share/icons/hicolor/scalable/apps/codex-skill-dashboard.svg"
cat > "$PKG/DEBIAN/control" <<'EOF'
Package: codex-skill-dashboard
Version: 0.1.0
Section: utils
Priority: optional
Architecture: amd64
Maintainer: Codex Skill Dashboard contributors
Description: Local dashboard for Codex skills
EOF
dpkg-deb --build "$PKG" "$ROOT/dist/codex-skill-dashboard_0.1.0_amd64.deb"
