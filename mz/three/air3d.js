import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

// A commercial airliner (Boeing 737-800 proportions) on a wet apron, for the Agencies film "airside" scene.
// Same API as the Maisons jet: init(canvas,w,h), render({x,y,pitch,roll,door,camX}), project(lx,ly,lz) in plane-local units.
const M = (o) => new THREE.MeshPhysicalMaterial(o);
const c01 = u => Math.max(0, Math.min(1, u));
const A = { R: null, S: null, CAM: null, ROOT: null, PLANE: null, DOOR: null, W: 1800, H: 900 };

// fuselage: length 26 (nose at +13), radius 1.24, tail cone sweeps up
const FL = 26, FR = 1.24, NOSE = FL / 2;
function radiusAt(d) { // d = distance from nose tip
  if (d < 4.2) { const u = d / 4.2; return FR * Math.pow(Math.sin(u * Math.PI / 2), .7) * (.98 + .02 * u); }
  if (d < 19.2) return FR;
  const u = (d - 19.2) / (FL - 19.2); return FR * Math.max(.06, Math.pow(1 - u, .9) * (1 - .25 * u) + .0);
}
function upsweep(d) { if (d < 19.2) return 0; const u = (d - 19.2) / (FL - 19.2); return u * u * FR * .78; }
function fuselage() {
  const N = 900, pts = [];
  for (let i = 0; i <= N; i++) { const d = i / N * FL; pts.push(new THREE.Vector2(Math.max(radiusAt(d), .002), NOSE - d)); }
  const g = new THREE.LatheGeometry(pts, 288); g.rotateZ(-Math.PI / 2); // axis along x, nose at +x
  const p = g.attributes.position, col = [];
  const white = new THREE.Color('#F4F4F2'), belly = new THREE.Color('#D9DCE3'), glass = new THREE.Color('#0B0D14'), seam = new THREE.Color('#BFC3CC');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), d = NOSE - x, r = Math.max(.02, Math.hypot(y, z)), yn = y / r;
    // nose droop and tail upsweep
    const droop = d < 4.2 ? (1 - d / 4.2) ** 2 * .3 : 0;
    p.setY(i, y - droop + upsweep(d));
    let c = yn < -.55 ? belly : white;
    // cockpit windscreen (737 style): two front panes meeting at a centre post, then two side panes per side;
    // defined by absolute height on the nose (pre-droop) so the posts read vertical and the sill is level
    { const s = Math.abs(z), yl = FR * (.30 + .06 * (d - 1.5)), yu = FR * (.66 - .03 * (d - 1.5));
      const t = c01((y - yl) / (yu - yl)), d1 = 2.95 - .45 * t, d0 = 1.5 + .05 * t;
      const inBand = c01((y - yl) / .02) * c01((yu - y) / .02) * c01((d - d0) / .02) * c01((d1 - d) / .02) * (x > 0 ? 1 : 0);
      const frame = c01((s - .03) / .015) * c01((Math.abs(d - 2.12) - .022) / .015) * c01((Math.abs(d - 2.55) - .022) / .015);
      const m = inBand * frame; if (m > 0) c = c.clone().lerp(glass, m); }
    // cabin windows: small rounded ports along the side, a gap over the wing exits
    { const zs = Math.abs(z), side = c01((zs / r - .7) / .05);
      if (d > 4.9 && d < 20.6 && side > 0) {
        const k = (d - 5.2) / .52, kr = Math.round(k), dx = (k - kr) * .52;
        const skip = (kr === 14 || kr === 15);
        if (kr >= 0 && kr <= 29 && !skip) { const dy = (y - .28) / .2, q = (dx / .13) ** 2 + dy * dy; if (q < 1) c = c.clone().lerp(glass, c01((1 - q) / .25) * side); }
      }
      // door outlines: forward L1 (painted seam, the real door is a separate panel), overwing exits and rear door
      const rect = (d0, d1, y0, y1) => { const inX = d > d0 - .025 && d < d1 + .025, inY = y > y0 - .025 && y < y1 + .025; const edge = inX && inY && (d < d0 + .02 || d > d1 - .02 || y < y0 + .02 || y > y1 - .02); return edge; };
      if (side > .5 && (rect(12.45, 12.78, -.05, .55) || rect(12.98, 13.31, -.05, .55) || rect(19.9, 20.38, -.62, .62))) c = seam;
    }
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return g;
}
function wingGeo(root, tip, span, sweep, th, dihedral) {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(-sweep, span); s.lineTo(-sweep - tip, span); s.lineTo(-root, 0); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: th, bevelEnabled: true, bevelThickness: th * .4, bevelSize: th * .7, bevelSegments: 4, curveSegments: 4 });
  g.translate(0, 0, -th / 2); return g;
}
function engine(white, metal, dark) {
  const g = new THREE.Group();
  const prof = []; // nacelle lathe: inlet lip, round body, tapered exhaust
  for (let i = 0; i <= 40; i++) { const u = i / 40, x = u * 3.4; let r = .66 - .04 * Math.pow(u, 1.6) - .14 * Math.max(0, u - .7) / .3 * Math.max(0, u - .7) / .3; if (u < .06) r = .6 + .06 * Math.sin(u / .06 * Math.PI / 2); prof.push(new THREE.Vector2(r, -x)); }
  const ng = new THREE.LatheGeometry(prof, 48); ng.rotateZ(-Math.PI / 2);
  const nac = new THREE.Mesh(ng, white); nac.castShadow = true; g.add(nac);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.6, .05, 10, 48), metal); lip.rotation.y = Math.PI / 2; g.add(lip);
  const fan = new THREE.Mesh(new THREE.CircleGeometry(.58, 40), dark); fan.rotation.y = Math.PI / 2; fan.position.x = -.35; g.add(fan);
  const sp = new THREE.Mesh(new THREE.ConeGeometry(.16, .4, 24), metal); sp.rotation.z = -Math.PI / 2; sp.position.x = -.18; g.add(sp);
  const core = new THREE.Mesh(new THREE.ConeGeometry(.3, .9, 28), M({ color: '#7D828E', roughness: .4, metalness: .8 })); core.rotation.z = Math.PI / 2; core.position.x = -3.6; g.add(core);
  return g;
}
function buildAirliner() {
  const { S } = A;
  A.ROOT = new THREE.Group(); A.PLANE = new THREE.Group(); A.ROOT.add(A.PLANE);
  const skin = M({ vertexColors: true, roughness: .2, metalness: .05, clearcoat: 1, clearcoatRoughness: .15 });
  const white = M({ color: '#F2F2F0', roughness: .25, metalness: .05, clearcoat: .8, clearcoatRoughness: .2 });
  const wingM = M({ color: '#E4E6EA', roughness: .3, metalness: .15, clearcoat: .6 });
  const metal = M({ color: '#C3C7CF', roughness: .25, metalness: .9 });
  const dark = M({ color: '#0C0E14', roughness: .3, metalness: .5 });
  const glass = M({ color: '#07080C', roughness: .08, metalness: .4, clearcoat: 1 });
  const f = new THREE.Mesh(fuselage(), skin); f.castShadow = true; A.PLANE.add(f);
  // low swept wings with dihedral and blended winglets; wing root a little behind mid-fuselage
  const WX = 1.6, WY = -.82, SPAN = 11.4, ROOT = 5.6, TIP = 1.35, SWEEP = 5.0, DIH = .1;
  for (const side of [1, -1]) {
    const wg = new THREE.Group(); wg.position.set(WX, WY, 0); wg.rotation.x = side * -DIH; A.PLANE.add(wg);
    const w = new THREE.Mesh(wingGeo(ROOT, TIP, SPAN, SWEEP, .26, 0), wingM); w.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2; w.castShadow = true; wg.add(w);
    // blended winglet: a swept fin rising from the tip
    const ws = new THREE.Shape(); ws.moveTo(0, 0); ws.quadraticCurveTo(-.2, .5, -.9, 1.7); ws.lineTo(-1.25, 1.7); ws.quadraticCurveTo(-1.2, .5, -TIP, 0); ws.closePath();
    const wl = new THREE.Mesh(new THREE.ExtrudeGeometry(ws, { depth: .08, bevelEnabled: true, bevelThickness: .03, bevelSize: .04, bevelSegments: 2 }), white);
    wl.position.set(-SWEEP, 0, side * SPAN - .04); wl.castShadow = true; wg.add(wl);
    // wing-body fairing
    const fair = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), white); fair.scale.set(3.6, .55, 1.25); fair.position.set(WX - 2.4, WY - .05, 0); A.PLANE.add(fair);
    // engine under the wing, forward of the leading edge, on a pylon
    const e = engine(white, metal, dark); const ez = side * 3.55, ex = WX - SWEEP * (3.55 / SPAN) + 2.3; e.position.set(ex, WY - .78 - 3.55 * DIH, ez); A.PLANE.add(e);
    const py = new THREE.Mesh(new THREE.BoxGeometry(2.6, .5, .22), white); py.position.set(ex - 1.6, WY - .3 - 3.55 * DIH, ez); A.PLANE.add(py);
  }
  // horizontal stabiliser and the tall swept fin
  for (const side of [1, -1]) {
    const hs = new THREE.Mesh(wingGeo(2.5, .9, 4.4, 2.1, .14, 0), wingM); hs.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    const hg = new THREE.Group(); hg.position.set(-NOSE + 3.9, .35, 0); hg.rotation.x = side * -.12; hg.add(hs); A.PLANE.add(hg); hs.castShadow = true;
  }
  const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.quadraticCurveTo(-1.2, .5, -3.6, 4.6); fs.lineTo(-4.9, 4.6); fs.lineTo(-5.2, 0); fs.closePath();
  const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: .2, bevelEnabled: true, bevelThickness: .06, bevelSize: .1, bevelSegments: 3 }), white);
  fin.position.set(-NOSE + 6.6, .9, -.1); fin.castShadow = true; A.PLANE.add(fin);
  // landing gear
  const tyre = new THREE.CylinderGeometry(.34, .34, .28, 24), hub = new THREE.CylinderGeometry(.18, .18, .3, 16);
  const legM = M({ color: '#9EA3AE', roughness: .35, metalness: .85 });
  for (const [x, z] of [[-.2, 2.0], [-.2, 2.42], [-.2, -2.0], [-.2, -2.42], [NOSE - 2.6, .17], [NOSE - 2.6, -.17]]) {
    const t = new THREE.Mesh(tyre, dark); t.rotation.x = Math.PI / 2; t.position.set(x, -1.92, z); t.castShadow = true; A.PLANE.add(t);
    const h = new THREE.Mesh(hub, legM); h.rotation.x = Math.PI / 2; h.position.copy(t.position); A.PLANE.add(h);
  }
  for (const [x, z, l] of [[-.2, 2.21, 1.0], [-.2, -2.21, 1.0], [NOSE - 2.6, 0, 1.1]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, l, 10), legM); leg.position.set(x, -1.92 + l / 2, z); A.PLANE.add(leg); }
  // forward L1 door: a plug door that swings out on its forward hinge, then an airstair unfolds to the tarmac
  const DX = NOSE - 4.55, DW = .68, Y0 = -.62, Y1 = .8, SZ = Math.sqrt(FR * FR - Y0 * Y0);
  const patch = (r, mat) => { const t0 = Math.asin(Y0 / r), t1 = Math.asin(Y1 / r), gg = new THREE.CylinderGeometry(r, r, DW, 24, 1, true, t0, t1 - t0); gg.rotateZ(Math.PI / 2); return new THREE.Mesh(gg, mat) };
  const seamM = new THREE.MeshBasicMaterial({ color: '#AEB3BD', side: THREE.DoubleSide });
  const sm = patch(FR + .006, seamM); sm.scale.x = 1.07; sm.position.x = DX; A.PLANE.add(sm);
  const hole = patch(FR + .009, new THREE.MeshBasicMaterial({ color: '#2A2620', side: THREE.DoubleSide })); hole.position.x = DX; A.PLANE.add(hole); A.HOLE = hole;
  const glow = patch(FR + .012, new THREE.MeshBasicMaterial({ color: '#F3E6CC', transparent: true, opacity: 0, side: THREE.DoubleSide })); glow.scale.set(.8, .9, .9); glow.position.x = DX; A.PLANE.add(glow); A.GLOW = glow;
  const hinge = new THREE.Group(); hinge.position.set(DX + DW / 2, 0, FR); A.PLANE.add(hinge);
  const pm = M({ color: '#F2F2F0', roughness: .25, metalness: .05, clearcoat: .8, side: THREE.DoubleSide });
  const panel = patch(FR + .016, pm); panel.position.set(-DW / 2, 0, -FR); hinge.add(panel);
  const dwin = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), glass); dwin.scale.set(.085, .11, .03); dwin.position.set(-DW / 2, .42, .02); hinge.add(dwin);
  A.DOOR = hinge; A.DX = DX;
  const stair = new THREE.Group(); stair.position.set(DX, Y0, SZ + .02); A.PLANE.add(stair); A.STAIR = stair;
  const run = 1.7, drop = 1.6, ns = 7, sideM = M({ color: '#ECEDEF', roughness: .3, metalness: .2, clearcoat: .6 }), tread = M({ color: '#3A3C44', roughness: .6, metalness: .4 });
  const len = Math.hypot(run, drop), ang = Math.atan2(drop, run);
  for (const sx of [-.4, .4]) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(.05, .26, len), sideM); st.position.set(sx, -drop / 2, run / 2); st.rotation.x = ang; stair.add(st);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, len * 1.02, 8), metal); rail.position.set(sx, -drop / 2 + .62, run / 2 - .05); rail.rotation.x = ang - Math.PI / 2; stair.add(rail);
    for (let i = 0; i < 4; i++) { const pp = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, .6, 6), metal); const u = (i + .5) / 4; pp.position.set(sx, -drop * u + .3, run * u); stair.add(pp) }
  }
  for (let i = 0; i < ns; i++) { const u = (i + 1) / (ns + .4); const tr = new THREE.Mesh(new THREE.BoxGeometry(.78, .045, .24), tread); tr.position.set(0, -drop * u, run * u); stair.add(tr) }
  stair.traverse(m => { if (m.isMesh) m.castShadow = true });
  const lamp = new THREE.PointLight('#FFF4E2', 0, 7); lamp.position.set(DX, .2, 2.3); A.PLANE.add(lamp); A.LAMP = lamp;
  // navigation lights
  for (const [z, c] of [[SPAN + .1, '#FF3B3B'], [-SPAN - .1, '#39E07A']]) { const l = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), new THREE.MeshBasicMaterial({ color: c })); l.position.set(WX - SWEEP - .3, WY + SPAN * DIH, z); A.PLANE.add(l) }
  A.PLANE.position.y = 2.26;
  // scale down so it frames like the jet did, but reads clearly as a bigger airliner
  A.ROOT.scale.setScalar(.82);
  S.add(A.ROOT);
}
function apron(S, len = 500, wid = 34, z0 = -4, op = .84) {
  const c = document.createElement('canvas'); c.width = 4096; c.height = 256; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#16171D'); g.addColorStop(.5, '#1C1D25'); g.addColorStop(1, '#16171D');
  x.fillStyle = g; x.fillRect(0, 0, 4096, 256);
  x.fillStyle = 'rgba(240,238,232,.5)'; x.fillRect(0, 12, 4096, 5); x.fillRect(0, 239, 4096, 5);
  for (let i = 0; i < 4096; i += 120) x.fillRect(i, 125, 60, 6);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, wid), new THREE.MeshStandardMaterial({ map: tex, color: '#8C8E98', roughness: .85, transparent: true, opacity: op }));
  m.rotation.x = -Math.PI / 2; m.position.set(-len * .2, .01, z0); m.receiveShadow = true; S.add(m);
  const lg = new THREE.SphereGeometry(.12, 8, 6), lm = new THREE.MeshBasicMaterial({ color: '#E8EAF2' }), li = new THREE.InstancedMesh(lg, lm, 140), mm = new THREE.Matrix4(); let n = 0;
  for (let i = 0; i < 70; i++) for (const z of [z0 - wid / 2 - .6, z0 + wid / 2 + .6]) { mm.makeTranslation(-len * .7 + i * 9, .15, z); li.setMatrixAt(n++, mm) }
  S.add(li);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(len, 300), new THREE.ShadowMaterial({ opacity: .5 })); sh.rotation.x = -Math.PI / 2; sh.position.y = .02; sh.receiveShadow = true; S.add(sh);
}
function init(canvas, w, h) {
  A.W = w; A.H = h;
  const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  R.setSize(w, h, false); R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0; R.outputColorSpace = THREE.SRGBColorSpace;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const S = new THREE.Scene(); const pm = new THREE.PMREMGenerator(R); S.environment = pm.fromScene(new RoomEnvironment(), .04).texture; S.environmentIntensity = .9;
  A.R = R; A.S = S;
  const key = new THREE.DirectionalLight('#ffffff', 2.3); key.position.set(25, 50, 35); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -45, right: 45, top: 30, bottom: -30, near: 1, far: 160 }); key.shadow.bias = -.0005;
  S.add(key); S.add(new THREE.HemisphereLight('#E6E4DE', '#111218', .32));
  const rim = new THREE.DirectionalLight('#C9CDD8', 1.3); rim.position.set(-35, 18, -30); S.add(rim);
  A.CAM = new THREE.PerspectiveCamera(24, w / h, .3, 900);
  buildAirliner();
  const rf = new Reflector(new THREE.PlaneGeometry(500, 34), { textureWidth: 1024, textureHeight: 512, color: '#44485A' });
  rf.rotation.x = -Math.PI / 2; rf.position.set(-100, -.005, -4); S.add(rf);
  apron(S);
}
const P = { x: 0, y: 0, pitch: 0, roll: 0, door: 0, camX: 0, camY: 0, camZ: 0, lookY: 1.95 };
function render(st) {
  Object.assign(P, st);
  A.ROOT.position.set(P.x, P.y, 0); A.ROOT.rotation.set(P.roll * Math.PI / 180, 0, P.pitch * Math.PI / 180);
  { const dp = Math.min(1, P.door / .5), sp = c01((P.door - .38) / .62), e = 1 - Math.pow(1 - sp, 3);
    A.DOOR.rotation.y = -dp * 1.7; A.DOOR.position.z = FR + .1 * Math.min(1, dp * 4);
    A.STAIR.rotation.x = -(1 - e) * 1.95; A.STAIR.visible = sp > .001; A.HOLE.visible = P.door > .02; A.GLOW.material.opacity = .55 * dp; A.LAMP.intensity = P.door * 5 }
  A.CAM.position.set(27 + P.camX, 6.4 + P.camY, 21 + P.camZ); A.CAM.lookAt(.8 + P.camX * .35, P.lookY, 0);
  A.R.render(A.S, A.CAM);
}
function project(lx, ly, lz) {
  A.ROOT.updateMatrixWorld(true); const v = new THREE.Vector3(lx, ly, lz); A.PLANE.localToWorld(v); v.project(A.CAM);
  return [(v.x + 1) / 2 * A.W, (1 - v.y) / 2 * A.H];
}
function doorAnchor() { return [A.DX, -.15, FR + .1] }
window.PLANE3D = { init, render, project, doorAnchor };
