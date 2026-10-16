#!/usr/bin/env bash
# Recreates the exact working layout the scripts expect (hard-coded /home/claude/{cp,ta,mz}).
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
for d in cp ta mz; do
  if [ -e /home/claude/$d ] && [ ! -L /home/claude/$d ]; then echo "/home/claude/$d exists, leaving it"; else ln -sfn "$HERE/$d" /home/claude/$d; fi
done
# Phosphor icons (used by ta/gen.py and mz/gen.py through PH=/tmp/claude-0/geo/...)
mkdir -p /tmp/claude-0/geo && (cd /tmp/claude-0/geo && [ -d node_modules/@phosphor-icons/core ] || npm i --silent @phosphor-icons/core@2.1.1)
# three.js + esbuild for the Maisons 3D module (jet, ribbon, bow)
mkdir -p /tmp/claude-0/three && cp "$HERE/mz/three/mz3d.js" "$HERE/mz/three/package.json" /tmp/claude-0/three/
(cd /tmp/claude-0/three && npm i --silent)
pip install --break-system-packages -q playwright pillow >/dev/null 2>&1 || true
echo "ready: see README.md and CLAUDE.md"
