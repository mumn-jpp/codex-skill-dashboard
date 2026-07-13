#!/usr/bin/env sh
set -eu
command -v node >/dev/null 2>&1 || { echo "Node.js 22 or newer is required."; exit 1; }
[ -d node_modules ] || npm install
npm start
