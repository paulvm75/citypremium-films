# A320neo for the Agencies "airside" scene

Source model: FlightGear A320-family (github.com/legoboyvdlp/A320-family), GPL v2. Copyright Josh Davidson, Jonathan Redpath, merspieler, Matthew Maring, Thorsten Herrmann and Semir Gebran. The files used are `Models/Fuselage/res/A320-216.ac`, `CFMLEAP1A.ac` (raised 0.831 m, as in `A320neo-CFM.xml`) and `Models/Services/Stairs/stairs.ac`.

- `ac.py` parses AC3D.
- `toglb.py` writes glTF. It flips the nose to +x (x and z negated), uses crease-angle normals, and skips placards, the wingtip fence and the RAT. Run `python3 toglb.py`, or `python3 toglb.py stairs` for the stair truck.
- `recolor.py` turns the primer livery white by matching each pixel to its paint colour. It also removes the registration and the large black primer areas (the radome, the fin and the fairings).
- Compress with `npx gltfpack -i a320.gltf -o a320.glb -cc -kn -km` (meshopt).
- `mz/three/a320_3d.js` loads both GLBs (bundled with `--loader:.glb=binary`).
  - Its API: `PLANE3D.init`, `render`, `project`, `doorAnchor`, plus `window.PLANE3D_READY`.
  - It uses the R1 door (camera side), which swings forward on a pivot at x 14.29, z 2.02.
  - The stair truck rolls in during the first 45% of `door`.
- Render scripts must wait for `PLANE3D_READY` before seeking.
