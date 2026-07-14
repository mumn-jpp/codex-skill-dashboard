#!/usr/bin/env sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
SET="$ROOT/build/generated-icons/AppIcon.iconset"
rm -rf "$SET" && mkdir -p "$SET"
for size in 16 32 128 256 512; do
  magick -background none "$ROOT/assets/app-icon.svg" -resize "${size}x${size}" "$SET/icon_${size}x${size}.png"
  double=$((size * 2))
  magick -background none "$ROOT/assets/app-icon.svg" -resize "${double}x${double}" "$SET/icon_${size}x${size}@2x.png"
done
mkdir -p "$ROOT/build/generated-icons"
iconutil -c icns "$SET" -o "$ROOT/build/generated-icons/AppIcon.icns"
