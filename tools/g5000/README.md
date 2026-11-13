# Bombardier Global 5000 for the Agencies film

Source model: FlightGear AI aircraft "Bombardier Global 5000" (github.com/gooneybird47/bombardier-global-5000, from FGData, GPL v2), file `CCX/Models/bomb-5000.ac` with the default white texture (`tex.png`).

- `toglb.py` converts it with the A320 tools (`../a320/ac.py`, `../a320/toglb.py`), nose to +x, gear removed for flight shots. Then `npx gltfpack -i g5000.gltf -o g5000.glb -kn -km -noq`.
- `g5still.js` (bundle with esbuild as an IIFE to `g5still.bundle.js`) and `still.py` render two stills on a transparent background: `top` (straight down) and `hero` (three-quarter front, banking).
- The film uses `jet_top_sprite.webp` (mirrored so the nose points +x) for the `#jetT` symbol, and `jet_hero_sprite.webp` in the a9 "Jet charter" card. gen.py inlines both as data URIs.
