import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

// Two small studio scenes for the Maisons film: a private jet on the apron, and a fleet of black saloons arriving at a venue.
function studio(canvas, w, h, exposure = .95) {
  const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  R.setSize(w, h, false); R.setPixelRatio(1);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = exposure; R.outputColorSpace = THREE.SRGBColorSpace;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const S = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(R); S.environment = pm.fromScene(new RoomEnvironment(), .04).texture; S.environmentIntensity = .9;
  return { R, S };
}
const M = (o) => new THREE.MeshPhysicalMaterial(o);
function planform(root, tip, span, sweep, th) {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(-sweep, span); s.lineTo(-sweep - tip, span); s.lineTo(-root, 0); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: th, bevelEnabled: true, bevelThickness: th * .35, bevelSize: th * .6, bevelSegments: 3 });
}

// ------------------------------------------------------------------ private jet
const J = { R: null, S: null, CAM: null, ROOT: null, PLANE: null, DOOR: null, W: 1800, H: 900 };
const c01w = u => Math.max(0, Math.min(1, u));
function bizFuselage() {
  const L = 21, N = 320, pts = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N * L; let r;
    if (x < 5.5) { const u = x / 5.5; r = .3 + .85 * Math.sin(u * Math.PI / 2) ** 1.3; }
    else if (x < 15.5) r = 1.15;
    else { const u = (x - 15.5) / 5.5; r = 1.15 * Math.pow(Math.max(0, 1 - u ** 1.7), .58); }
    pts.push(new THREE.Vector2(Math.max(r, .001), x - L / 2));
  }
  const g = new THREE.LatheGeometry(pts, 160); g.rotateZ(-Math.PI / 2);
  const p = g.attributes.position, col = [];
  const wind = new THREE.Color('#0A0B10'), white = new THREE.Color('#F5F5F3'), belly = new THREE.Color('#CFD2DA'), onyx = new THREE.Color('#14151B'), silver = new THREE.Color('#B9BDC8');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), rr = Math.max(.05, Math.hypot(y, z)), yn = y / rr;
    const t = Math.max(0, (-x - 4.5) / 6); p.setY(i, y + t * t * .85);
    const n = Math.max(0, (x - 5) / 5.5), rr0 = 1.15 * Math.pow(Math.max(0, 1 - n ** 1.7), .58); p.setY(i, p.getY(i) - .62 * (1.15 - rr0) - n * n * .05);
    let c = white;
    if (y < -.72) c = belly;
    if (y > -.42 && y < -.28 && x > -7.5 && x < 5.9) c = onyx;
    if (y > -.28 && y < -.23 && x > -7.5 && x < 5.9) c = silver;
    { // windscreen: wraps over the top front of the nose (facing forward), four panes; plus one side window behind it
      const ph = Math.atan2(Math.abs(z), y), q = ph / 1.3, e = .05;
      const xr = 7.45 - .1 * q * q, xf = 8.9 - .75 * q * q;
      let m = c01w((1.3 - ph) / .05) * c01w((x - xr) / e) * c01w((xf - x) / e) * c01w((Math.abs(ph) - .02) / .03) * c01w((Math.abs(ph - .66) - .025) / .03);
      const sw = c01w((ph - 1.36) / .04) * c01w((1.62 - ph) / .04) * c01w((x - 6.95 - (ph - 1.36) * .35) / e) * c01w((7.38 - x) / e);
      m = Math.max(m, 0 * sw);
      if (m > 0) c = c.clone().lerp(wind, m); }
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
  return g;
}
function buildJet() {
  const { S } = J;
  J.ROOT = new THREE.Group(); J.PLANE = new THREE.Group(); J.ROOT.add(J.PLANE);
  const skin = M({ vertexColors: true, roughness: .22, metalness: .05, clearcoat: 1, clearcoatRoughness: .18 });
  const white = M({ color: '#F1F1EF', roughness: .3, metalness: .05, clearcoat: .7 });
  const onyx = M({ color: '#15161C', roughness: .25, metalness: .3, clearcoat: 1 });
  const glass = M({ color: '#07080C', roughness: .08, metalness: .4, clearcoat: 1 });
  const metal = M({ color: '#B4B8C2', roughness: .3, metalness: .8 });
  const f = new THREE.Mesh(bizFuselage(), skin); f.castShadow = true; J.PLANE.add(f);
  // oval cabin windows
  const wg = new THREE.SphereGeometry(1, 16, 10); wg.scale(.22, .3, .04);
  for (const side of [1, -1]) for (let i = 0; i < 7; i++) {
    const w = new THREE.Mesh(wg, glass); w.position.set(-3.6 + i * 1.15, .22, side * 1.13); J.PLANE.add(w);
  }
  // cockpit

  // cabin door just behind the cockpit: a plug door that swings out on its forward hinge, then the airstair unfolds to the ground
  const DX = 5.55, DW = .86, Y0 = -.84, Y1 = .74, SZ = Math.sqrt(1.15 * 1.15 - Y0 * Y0);
  const patch = (r, mat) => { const t0 = Math.asin(Y0 / r), t1 = Math.asin(Y1 / r), g = new THREE.CylinderGeometry(r, r, DW, 24, 1, true, t0, t1 - t0); g.rotateZ(Math.PI / 2); return new THREE.Mesh(g, mat) };
  const seam = patch(1.156, new THREE.MeshBasicMaterial({ color: '#A9AEBB', side: THREE.DoubleSide })); seam.scale.x = 1.06; seam.position.x = DX; J.PLANE.add(seam);
  const hole = patch(1.159, new THREE.MeshBasicMaterial({ color: '#2A2620', side: THREE.DoubleSide })); hole.position.x = DX; J.PLANE.add(hole); J.HOLE = hole;
  const glow = patch(1.162, new THREE.MeshBasicMaterial({ color: '#F3E6CC', transparent: true, opacity: 0, side: THREE.DoubleSide })); glow.scale.set(.8, .9, .9); glow.position.x = DX; J.PLANE.add(glow); J.GLOW = glow;
  const hinge = new THREE.Group(); hinge.position.set(DX + DW / 2, 0, 1.15); J.PLANE.add(hinge);
  const pm = M({ color: '#F1F1EF', roughness: .3, metalness: .05, clearcoat: .7, side: THREE.DoubleSide });
  const panel = patch(1.166, pm); panel.position.set(-DW / 2, 0, -1.15); hinge.add(panel);
  const win = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), glass); win.scale.set(.15, .21, .03); win.position.set(-DW / 2, .22, .02); hinge.add(win);
  J.DOOR = hinge;
  const stair = new THREE.Group(); stair.position.set(DX, Y0, SZ + .02); J.PLANE.add(stair); J.STAIR = stair;
  const run = 1.15, drop = 1.25, ns = 5, side = M({ color: '#ECEDEF', roughness: .3, metalness: .2, clearcoat: .6 }), tread = M({ color: '#3A3C44', roughness: .6, metalness: .4 });
  const len = Math.hypot(run, drop), ang = Math.atan2(drop, run);
  for (const sx of [-.4, .4]) {
    const st = new THREE.Mesh(new THREE.BoxGeometry(.05, .24, len), side); st.position.set(sx, -drop / 2, run / 2); st.rotation.x = ang; stair.add(st);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, len * 1.02, 8), metal); rail.position.set(sx, -drop / 2 + .62, run / 2 - .05); rail.rotation.x = ang - Math.PI / 2; stair.add(rail);
    for (let i = 0; i < 3; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, .6, 6), metal); const u = (i + .5) / 3; p.position.set(sx, -drop * u + .3, run * u); stair.add(p) }
  }
  for (let i = 0; i < ns; i++) { const u = (i + 1) / (ns + .4); const tr = new THREE.Mesh(new THREE.BoxGeometry(.78, .045, .26), tread); tr.position.set(0, -drop * u, run * u); stair.add(tr);
    const rs = new THREE.Mesh(new THREE.BoxGeometry(.78, .2, .03), side); rs.position.set(0, -drop * u + .1, run * u - .12); stair.add(rs) }
  stair.traverse(m => { if (m.isMesh) m.castShadow = true });
  const lamp = new THREE.PointLight('#FFF4E2', 0, 6); lamp.position.set(DX, 0, 2.1); J.PLANE.add(lamp); J.LAMP = lamp;
  // wings
  for (const side of [1, -1]) {
    const w = new THREE.Mesh(planform(4, 1.3, 8.6, 3.2, .22), white); w.castShadow = true;
    w.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(1.8, -.78, 0);
    const g2 = new THREE.Group(); g2.add(w); g2.rotation.x = side * -.07; J.PLANE.add(g2);
    const wl = new THREE.Mesh(planform(1.2, .5, 1.3, .8, .12), onyx); wl.position.set(1.8 - 3.2, -.78 + 8.6 * .07, side * 8.6); if (side < 0) wl.rotation.y = Math.PI; J.PLANE.add(wl);
    // rear-mounted engine
    const eg = new THREE.Group();
    const nac = new THREE.Mesh(new THREE.CylinderGeometry(.58, .5, 2.7, 32, 1, true), white); nac.rotation.z = Math.PI / 2; nac.castShadow = true; eg.add(nac);
    const cap = new THREE.Mesh(new THREE.CircleGeometry(.58, 32), glass); cap.rotation.y = Math.PI / 2; cap.position.x = 1.35; eg.add(cap);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(.57, .06, 8, 32), metal); lip.rotation.y = Math.PI / 2; lip.position.x = 1.37; eg.add(lip);
    const py = new THREE.Mesh(new THREE.BoxGeometry(1.4, .22, .9), white); py.position.set(-.1, 0, -side * .55); eg.add(py);
    eg.position.set(-5.6, .55, side * 1.95); J.PLANE.add(eg);
  }
  // T-tail
  const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(-2.4, 3.3); fs.lineTo(-3.7, 3.3); fs.lineTo(-3.6, 0); fs.closePath();
  const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: .18, bevelEnabled: true, bevelThickness: .06, bevelSize: .1, bevelSegments: 2 }), onyx);
  fin.position.set(-6.4, .9, -.09); fin.castShadow = true; J.PLANE.add(fin);
  for (const side of [1, -1]) {
    const h = new THREE.Mesh(planform(1.6, .7, 3.1, 1.5, .12), white); h.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2; h.position.set(-8.7, 4.15, 0); h.castShadow = true; J.PLANE.add(h);
  }
  // gear
  const tyre = new THREE.CylinderGeometry(.36, .36, .26, 20);
  for (const [x, z] of [[.6, 1.55], [.6, -1.55], [6.6, 0]]) {
    const t = new THREE.Mesh(tyre, glass); t.rotation.x = Math.PI / 2; t.position.set(x, -1.75, z); J.PLANE.add(t);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .9, 8), metal); leg.position.set(x, -1.25, z * .85); J.PLANE.add(leg);
  }
  J.PLANE.position.y = 2.11;
  S.add(J.ROOT);
}
function apron(S, len = 500, wid = 30, z0 = -4, op = .95) {
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
function lights(S, tint = '#C9CDD8') {
  const key = new THREE.DirectionalLight('#ffffff', 2.3); key.position.set(25, 50, 35); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -45, right: 45, top: 30, bottom: -30, near: 1, far: 160 }); key.shadow.bias = -.0005;
  S.add(key); S.add(new THREE.HemisphereLight('#E6E4DE', '#111218', .32));
  const rim = new THREE.DirectionalLight(tint, 1.3); rim.position.set(-35, 18, -30); S.add(rim);
}
function sedan() {
  const paint = M({ color: '#07080B', roughness: .4, metalness: .15, clearcoat: .8, clearcoatRoughness: .08, envMapIntensity: .5 });
  const glass = M({ color: '#1A1D27', roughness: .04, metalness: .9, clearcoat: 1 });
  const tyreM = M({ color: '#0B0B0D', roughness: .85 }), rimM = M({ color: '#C9CCD4', roughness: .2, metalness: 1 });
  const g = new THREE.Group(), s = new THREE.Shape();
  s.moveTo(-2.55, .3); s.lineTo(2.5, .3); s.quadraticCurveTo(2.68, .32, 2.67, .56); s.quadraticCurveTo(2.66, .76, 2.42, .82);
  s.quadraticCurveTo(1.8, .9, 1.3, .93); s.quadraticCurveTo(.9, 1.2, .45, 1.43); s.quadraticCurveTo(-.1, 1.5, -.62, 1.46);
  s.quadraticCurveTo(-1.05, 1.42, -1.3, 1.24); s.quadraticCurveTo(-1.6, 1.02, -1.95, 1.0); s.lineTo(-2.45, .97); s.quadraticCurveTo(-2.66, .9, -2.64, .62); s.quadraticCurveTo(-2.64, .34, -2.55, .3);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 1.66, bevelEnabled: true, bevelThickness: .09, bevelSize: .08, bevelSegments: 5, curveSegments: 16 }), paint);
  body.position.z = -.83; body.castShadow = true; g.add(body);
  const w = new THREE.Shape(); w.moveTo(1.16, .97); w.quadraticCurveTo(.85, 1.2, .44, 1.37); w.quadraticCurveTo(-.1, 1.43, -.6, 1.4); w.quadraticCurveTo(-1.0, 1.36, -1.2, 1.2); w.quadraticCurveTo(-1.42, 1.04, -1.6, 1.0); w.closePath();
  const gl = new THREE.Mesh(new THREE.ExtrudeGeometry(w, { depth: 1.9, bevelEnabled: false, curveSegments: 14 }), glass); gl.position.z = -.95; g.add(gl);
  const pil = new THREE.Mesh(new THREE.BoxGeometry(.06, .45, 1.92), paint); pil.position.set(-.1, 1.18, 0); pil.rotation.z = -.08; g.add(pil);
  const tg = new THREE.CylinderGeometry(.37, .37, .26, 32), rg = new THREE.CylinderGeometry(.24, .24, .27, 24);
  for (const x of [-1.62, 1.62]) for (const z of [-.74, .74]) { const t = new THREE.Mesh(tg, tyreM); t.rotation.x = Math.PI / 2; t.position.set(x, .37, z); g.add(t); const r = new THREE.Mesh(rg, rimM); r.rotation.x = Math.PI / 2; r.position.set(x, .37, z * 1.03); g.add(r) }
  const lamp = new THREE.MeshBasicMaterial({ color: '#EEF1FF' });
  for (const z of [-.62, .62]) { const h = new THREE.Mesh(new THREE.BoxGeometry(.05, .07, .36), lamp); h.position.set(2.66, .7, z); g.add(h) }
  return g;
}
function chauffeur() {
  const suit = M({ color: '#0E1018', roughness: .55, clearcoat: .2 }), skin = M({ color: '#B9A592', roughness: .7 }), shirt = M({ color: '#E9E7E2', roughness: .6 }), shoe = M({ color: '#050506', roughness: .3, clearcoat: 1 });
  const g = new THREE.Group(), add = (geo, m, x, y, z, rz = 0, sx = 1, sz = 1) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.z = rz; o.scale.x = sx; o.scale.z = sz; g.add(o); return o };
  for (const z of [-.11, .11]) { add(new THREE.CylinderGeometry(.075, .065, .88, 14), suit, 0, .46, z); add(new THREE.BoxGeometry(.26, .07, .11), shoe, .05, .035, z) }
  add(new THREE.CylinderGeometry(.24, .17, .72, 20), suit, 0, 1.24, 0, 0, .62, 1);
  add(new THREE.SphereGeometry(.24, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), suit, 0, 1.58, 0, 0, .62, 1.05);
  for (const z of [-.27, .27]) { add(new THREE.CylinderGeometry(.06, .05, .7, 12), suit, .02, 1.22, z, .04); add(new THREE.SphereGeometry(.05, 10, 8), skin, .03, .85, z) }
  add(new THREE.CylinderGeometry(.065, .075, .1, 12), shirt, 0, 1.64, 0);
  add(new THREE.SphereGeometry(.115, 20, 14), skin, 0, 1.79, 0, 0, .95, .9);
  add(new THREE.CylinderGeometry(.125, .125, .06, 20), suit, -.01, 1.9, 0);
  add(new THREE.BoxGeometry(.09, .014, .2), suit, .1, 1.875, 0);
  g.traverse(m => { if (m.isMesh) m.castShadow = true });
  g.scale.setScalar(1.08);
  return g;
}
function fbo(S) {
  const stone = M({ color: '#3A3C45', roughness: .7 }), roof = M({ color: '#2A2C33', roughness: .5, metalness: .3 });
  const glow = new THREE.MeshBasicMaterial({ color: '#BFC5D3' }), mull = M({ color: '#1C1E25', roughness: .4, metalness: .6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(46, .5, 12), stone); base.position.set(6, .25, -26); base.receiveShadow = true; S.add(base);
  const glassWall = new THREE.Mesh(new THREE.PlaneGeometry(42, 5.2), glow); glassWall.position.set(6, 3.1, -20.4); S.add(glassWall);
  for (let i = 0; i <= 14; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.16, 5.4, .3), mull); m.position.set(-15 + i * 3, 3.1, -20.2); S.add(m) }
  const r = new THREE.Mesh(new THREE.BoxGeometry(50, .55, 15), roof); r.position.set(6, 5.95, -25); r.castShadow = true; S.add(r);
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(50, .9, .2), M({ color: '#C9CDD8', roughness: .3, metalness: .7 })); fascia.position.set(6, 5.75, -17.5); S.add(fascia);
  const conc = new THREE.Mesh(new THREE.PlaneGeometry(120, 16), new THREE.MeshStandardMaterial({ color: '#4A4C55', roughness: .9 })); conc.rotation.x = -Math.PI / 2; conc.position.set(6, .015, -12); conc.receiveShadow = true; S.add(conc);
}
function initJet(canvas, w, h) {
  J.W = w; J.H = h; Object.assign(J, studio(canvas, w, h, 1.0));
  lights(J.S); J.CAM = new THREE.PerspectiveCamera(24, w / h, .3, 900);
  buildJet();
  // wet tarmac: a soft mirror under a translucent apron
  const rf = new Reflector(new THREE.PlaneGeometry(500, 30), { textureWidth: 1024, textureHeight: 512, color: '#44485A' });
  rf.rotation.x = -Math.PI / 2; rf.position.set(-100, -.005, -4); J.S.add(rf);
  apron(J.S, 500, 30, -4, .84);
}
const JP = { x: 0, y: 0, pitch: 0, roll: 0, door: 0, camX: 0, camY: 0, camZ: 0, lookY: 2.0 };
function renderJet(st) {
  Object.assign(JP, st);
  J.ROOT.position.set(JP.x, JP.y, 0); J.ROOT.rotation.set(JP.roll * Math.PI / 180, 0, JP.pitch * Math.PI / 180);
  { const dp = Math.min(1, JP.door / .5), sp = Math.max(0, Math.min(1, (JP.door - .38) / .62)), e = 1 - Math.pow(1 - sp, 3);
    J.DOOR.rotation.y = -dp * 1.7; J.DOOR.position.z = 1.15 + .1 * Math.min(1, dp * 4);
    J.STAIR.rotation.x = -(1 - e) * 1.95; J.STAIR.visible = sp > .001; J.HOLE.visible = JP.door > .02; J.GLOW.material.opacity = .55 * dp; J.LAMP.intensity = JP.door * 5 }
  J.CAM.position.set(24 + JP.camX, 3.2 + JP.camY, 17 + JP.camZ); J.CAM.lookAt(1.2 + JP.camX * .35, JP.lookY, 0);
  J.R.render(J.S, J.CAM);
}
function projectJet(lx, ly, lz) {
  J.ROOT.updateMatrixWorld(true); const v = new THREE.Vector3(lx, ly, lz); J.PLANE.localToWorld(v); v.project(J.CAM);
  return [(v.x + 1) / 2 * J.W, (1 - v.y) / 2 * J.H];
}

function projectWorld(x, y, z) { const v = new THREE.Vector3(x, y, z); v.project(J.CAM); return [(v.x + 1) / 2 * J.W, (1 - v.y) / 2 * J.H] }

// ------------------------------------------------------------------ satin ribbon (a real rope simulation)
// World space is the station's own coordinate space with y flipped, seen through an orthographic camera.
const RB = { sims: {} };
const RX0 = -1100, RX1 = 1240, RY0 = -200, RY1 = 1400, RW = 96, SUB = 9;
function initRibbon(canvas, w, h) {
  RB.W = w; RB.H = h; Object.assign(RB, studio(canvas, w, h, 1.05));
  const S = RB.S; S.environmentIntensity = 1.1;
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(6, 10, 12); S.add(key);
  const rim = new THREE.DirectionalLight('#B9BFDA', 1.6); rim.position.set(-10, 4, -8); S.add(rim);
  S.add(new THREE.HemisphereLight('#E9EAF2', '#141626', .5));
  RB.CAM = new THREE.OrthographicCamera(RX0, RX1, -RY0, -RY1, 1, 4000); RB.CAM.position.set(0, 0, 2000); RB.CAM.lookAt(0, 0, 0);
  const mat = new THREE.ShaderMaterial({ side: THREE.DoubleSide,
    uniforms: { base: { value: new THREE.Color('#3A4056') }, mid: { value: new THREE.Color('#B4BACB') }, hi: { value: new THREE.Color('#FFFFFF') }, rbase: { value: new THREE.Color('#33030B') }, rmid: { value: new THREE.Color('#A10E28') }, red: { value: 0 }, pbase: { value: new THREE.Color('#10051F') }, pmid: { value: new THREE.Color('#45197A') }, pur: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vP; varying vec2 vU;
      void main(){ vec4 wp = modelMatrix * vec4(position,1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vU = uv; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: `uniform vec3 base; uniform vec3 mid; uniform vec3 hi; uniform vec3 rbase; uniform vec3 rmid; uniform float red; uniform vec3 pbase; uniform vec3 pmid; uniform float pur; varying vec3 vN; varying vec3 vP; varying vec2 vU;
      void main(){ vec3 N = normalize(vN); vec3 V = vec3(0., 0., 1.); if (dot(N, V) < 0.) N = -N;
        vec3 L1 = normalize(vec3(.35, .75, .6)), L2 = normalize(vec3(-.7, .25, .5));
        float d = .5 + .5 * dot(N, L1);
        float u = vU.x; float rr = smoothstep(u - .03, u + .07, red * 1.14 - .05); float pp = smoothstep(u - .03, u + .07, pur * 1.14 - .05);
        vec3 B = mix(mix(base, pbase, pp), rbase, rr), Mi = mix(mix(mid, pmid, pp), rmid, rr);
        vec3 c = mix(B, Mi, smoothstep(.05, .95, d));
        vec3 H1 = normalize(L1 + V), H2 = normalize(L2 + V);
        float sp = pow(max(0., dot(N, H1)), 50.) * 1.0 + pow(max(0., dot(N, H2)), 16.) * .4;
        float f = abs(dot(N, V)); float sh = pow(1. - f, 2.5) * .4;
        float edge = smoothstep(.0, .05, vU.y) * smoothstep(1., .95, vU.y);
        c = c * (.8 + .2 * edge) + mix(mix(hi, vec3(.7, .58, .95), pp), vec3(1., .78, .82), rr) * sp * (1. - .62 * rr - .35 * pp) + Mi * sh;
        gl_FragColor = vec4(c, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` });
  RB.mat = mat; RB.strips = [];
  RB.bstrips = [];
  for (let k = 0; k < 2; k++) {
    const MAXV = 1400, g = new THREE.BufferGeometry();
    const pos = new Float32Array(MAXV * 3 * 3), uv = new Float32Array(MAXV * 3 * 2), idx = [];
    for (let i = 0; i < MAXV - 1; i++) { const a = i * 3; idx.push(a, a + 1, a + 3, a + 1, a + 4, a + 3, a + 1, a + 2, a + 4, a + 2, a + 5, a + 4) }
    g.setIndex(idx); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const m = new THREE.Mesh(g, mat); m.frustumCulled = false; m.visible = false; S.add(m); RB.bstrips.push({ g, pos, uv, m });
  }
  for (let k = 0; k < 2; k++) {
    const MAXV = 2000, g = new THREE.BufferGeometry();
    const pos = new Float32Array(MAXV * 2 * 3), uv = new Float32Array(MAXV * 2 * 2), idx = [];
    for (let i = 0; i < MAXV - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
    g.setIndex(idx); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const m = new THREE.Mesh(g, mat); m.frustumCulled = false; S.add(m); RB.strips.push({ g, pos, uv, m });
  }
}
const easeIO = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
// o: {id, t0, t1, tT, dT, tc (cut time or -1), xL, xR, y0, xc, xt, sag0}
function simRibbon(o) {
  const N = 64, HZ = 240, IT = 40, G = 2600, DR = 1.5, LT = 115;
  const x = new Float64Array(N), y = new Float64Array(N), px = new Float64Array(N), py = new Float64Array(N);
  const S = o.xR - o.xL, xm = (o.xL + o.xR) / 2;
  for (let i = 0; i < N; i++) { const u = i / (N - 1); x[i] = o.xL + u * S; y[i] = o.y0 + o.sag0 * (1 - (2 * u - 1) ** 2); px[i] = x[i]; py[i] = y[i] }
  let L0 = 0; for (let i = 1; i < N; i++) L0 += Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]); L0 /= N - 1;
  const L1 = S * .992 / (N - 1);
  const ci = Math.max(1, Math.min(N - 3, Math.round((o.xc - o.xL) / S * (N - 1)))), ti = Math.round((o.xt - o.xL) / S * (N - 1));
  // the tag: one pendulum particle hanging from node ti
  let tx = x[ti], ty = y[ti] + LT, tpx = tx, tpy = ty;
  const dt = 1 / HZ, steps = Math.ceil((o.t1 - o.t0) * HZ), every = 2, out = [], tag = [];
  let cut = false;
  const pre = Math.round(3 * HZ); // settle the slack ribbon before the scene starts
  for (let s = -pre; s <= steps; s++) {
    const t = o.t0 + Math.max(0, s) * dt;
    const L = L0 + (L1 - L0) * easeIO((t - o.tT) / o.dT);
    if (!cut && o.tc > 0 && t >= o.tc) { cut = true;
      for (let i = 1; i < N - 1; i++) { const left = i <= ci, f = left ? i / ci : (N - 1 - i) / (N - 2 - ci), ax = left ? o.xL : o.xR, ay = o.y0;
        const dx = ax - x[i], dy = ay - y[i], d = Math.hypot(dx, dy) || 1, v = 520 * f * f; px[i] = x[i] - dx / d * v * dt; py[i] = y[i] - dy / d * v * dt - 60 * f * dt } }
    const damp = 1 - (s < 0 ? 9 : DR) * dt;
    for (let i = 1; i < N - 1; i++) { const vx = (x[i] - px[i]) * damp, vy = (y[i] - py[i]) * damp; px[i] = x[i]; py[i] = y[i]; x[i] += vx; y[i] += vy + G * dt * dt }
    { const vx = (tx - tpx) * (1 - 7 * dt), vy = (ty - tpy) * (1 - 7 * dt); tpx = tx; tpy = ty; tx += vx; ty += vy + G * dt * dt }
    x[0] = o.xL; y[0] = o.y0; x[N - 1] = o.xR; y[N - 1] = o.y0;
    for (let it = 0; it < IT; it++) {
      for (let i = 0; i < N - 1; i++) { if (cut && i === ci) continue;
        const dx = x[i + 1] - x[i], dy = y[i + 1] - y[i], d = Math.hypot(dx, dy) || 1e-6, e = (d - L) / d;
        const wa = i === 0 ? 0 : 1, wb = i + 1 === N - 1 ? 0 : 1, ws = wa + wb; if (!ws) continue;
        x[i] += dx * e * wa / ws; y[i] += dy * e * wa / ws; x[i + 1] -= dx * e * wb / ws; y[i + 1] -= dy * e * wb / ws }
    }
    { const dx = tx - x[ti], dy = ty - y[ti], d = Math.hypot(dx, dy) || 1e-6; tx = x[ti] + dx / d * LT; ty = y[ti] + dy / d * LT }
    if (s >= 0 && s % every === 0) { const f = new Float32Array(N * 2); for (let i = 0; i < N; i++) { f[i * 2] = x[i]; f[i * 2 + 1] = y[i] } out.push(f); tag.push([x[ti], y[ti], Math.atan2(tx - x[ti], ty - y[ti])]) }
  }
  RB.sims[o.id] = { o, N, ci, ti, fr: out, tag, hz: HZ / every };
}
function simAt(id, t) {
  const sm = RB.sims[id], k = Math.max(0, Math.min(sm.fr.length - 1.001, (t - sm.o.t0) * sm.hz)), i0 = Math.floor(k), a = k - i0, A = sm.fr[i0], B = sm.fr[i0 + 1] || A;
  const P = new Float32Array(A.length); for (let i = 0; i < A.length; i++) P[i] = A[i] + (B[i] - A[i]) * a;
  const ta = sm.tag[i0], tb = sm.tag[i0 + 1] || ta;
  return { P, tag: [ta[0] + (tb[0] - ta[0]) * a, ta[1] + (tb[1] - ta[1]) * a, ta[2] + (tb[2] - ta[2]) * a] };
}
function cr(p0, p1, p2, p3, u) { const u2 = u * u, u3 = u2 * u; return .5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3) }
function fillStrip(st, P, i0, i1, N, t, sm) {
  const n = i1 - i0, M = n * SUB + 1, pts = [];
  const gx = i => P[Math.max(i0, Math.min(i1, i)) * 2], gy = i => P[Math.max(i0, Math.min(i1, i)) * 2 + 1];
  for (let j = 0; j < M; j++) { const s = j / SUB, i = i0 + Math.floor(s), u = s - Math.floor(s);
    pts.push([cr(gx(i - 1), gx(i), gx(i + 1), gx(i + 2), u), cr(gy(i - 1), gy(i), gy(i + 1), gy(i + 2), u), (i0 + s) / (N - 1)]) }
  const o = sm.o, tcut = o.tc > 0 ? t - o.tc : -1;
  let arc = i0 > 0 ? i0 * 34 : 0;
  for (let j = 0; j < M; j++) {
    const a = pts[Math.max(0, j - 1)], b = pts[Math.min(M - 1, j + 1)], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
    const Tx = tx / tl, Ty = ty / tl; if (j) arc += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    // in-plane normal, tilted about the tangent so the satin catches the light
    let ph = .5 + .2 * Math.sin(arc / 300 - 1.25 * t) + .07 * Math.sin(arc / 95 + .8 * t);
    if (tcut > 0) { const f = i0 === 0 ? (j / (M - 1)) : (1 - j / (M - 1)); ph += .7 * f * f * Math.exp(-tcut * .9) * Math.sin(tcut * 4.2 + f * 2.4) }
    const nx = -Ty, ny = Tx, c = Math.cos(ph), sn = Math.sin(ph), hw = RW / 2;
    const wx = nx * c * hw, wy = ny * c * hw, wz = sn * hw, X = pts[j][0], Y = -pts[j][1], k = j * 6;
    // station y is down, world y is up
    st.pos[k] = X + wx; st.pos[k + 1] = Y - wy; st.pos[k + 2] = wz; st.pos[k + 3] = X - wx; st.pos[k + 4] = Y + wy; st.pos[k + 5] = -wz;
    st.uv[j * 4] = pts[j][2]; st.uv[j * 4 + 1] = 0; st.uv[j * 4 + 2] = pts[j][2]; st.uv[j * 4 + 3] = 1;
  }
  st.g.setDrawRange(0, (M - 1) * 6); st.g.attributes.position.needsUpdate = true; st.g.attributes.uv.needsUpdate = true; st.g.computeVertexNormals(); st.m.visible = true;
}
function renderRibbon(st) {
  const sm = RB.sims[st.id]; if (!sm) return;
  RB.mat.uniforms.red.value = st.red || 0; RB.mat.uniforms.pur.value = st.pur || 0;
  RB.bstrips.forEach(b => b.m.visible = false);
  const { P } = simAt(st.id, st.t), N = sm.N, cutNow = sm.o.tc > 0 && st.t >= sm.o.tc;
  if (cutNow) { fillStrip(RB.strips[0], P, 0, sm.ci, N, st.t, sm); fillStrip(RB.strips[1], P, sm.ci + 1, N - 1, N, st.t, sm) }
  else { fillStrip(RB.strips[0], P, 0, N - 1, N, st.t, sm); RB.strips[1].m.visible = false }
  RB.R.render(RB.S, RB.CAM);
}
// ------------------------------------------------------------------ the closing bow: a band slides in spinning, then ties itself
function crPath(cp, M) {
  const v = cp.map(p => new THREE.Vector3(p[0], p[1], p[2] || 0)), c = new THREE.CatmullRomCurve3(v, false, 'centripetal');
  return c.getSpacedPoints(M - 1);
}
const BOWM = 720;
function bowShape() {
  if (RB.bow) return RB.bow;
  const cp = [[-232, 345, 0], [-165, 222, 0], [-80, 100, 12], [-16, 16, 34], [0, 0, 44],
    [82, -70, 64], [205, -134, 54], [306, -92, 14], [318, 12, -28], [238, 74, -50], [114, 50, -30], [22, 8, 10],
    [0, 0, 30], [-22, -8, 10], [-114, -50, -30], [-238, -74, -50], [-318, -12, -28], [-306, 92, 14], [-205, 134, 54], [-82, 70, 64],
    [0, 0, 44], [16, 16, 34], [80, 100, 12], [165, 222, 0], [232, 345, 0]];
  const P = crPath(cp, BOWM);
  let L = 0; for (let i = 1; i < P.length; i++) L += P[i].distanceTo(P[i - 1]);
  // flight path of the head, relative to the bow centre: a long swoop in from the left with one curl in the air
  const fp = [[-3600, 700], [-2700, 760], [-1900, 700], [-1200, 560], [-650, 300], [-260, -80], [90, -310], [300, -280], [420, -60], [300, 170], [40, 190], [-90, 20], [10, -150], [150, 90], [240, 300]];
  const F = crPath(fp.map(p => [p[0], p[1], 0]), 3000); const FA = [0]; for (let i = 1; i < F.length; i++) FA.push(FA[i - 1] + F[i].distanceTo(F[i - 1]));
  RB.bow = { P, L, F, FA, FL: FA[FA.length - 1] }; return RB.bow;
}
function flightAt(B, a) {
  if (a <= 0) { const d = new THREE.Vector3().subVectors(B.F[1], B.F[0]).normalize(); return B.F[0].clone().addScaledVector(d, a) }
  if (a >= B.FL) { const n = B.F.length, d = new THREE.Vector3().subVectors(B.F[n - 1], B.F[n - 2]).normalize(); return B.F[n - 1].clone().addScaledVector(d, a - B.FL) }
  let lo = 0, hi = B.FA.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (B.FA[m] < a) lo = m; else hi = m }
  const u = (a - B.FA[lo]) / (B.FA[hi] - B.FA[lo]); return B.F[lo].clone().lerp(B.F[hi], u);
}
const eob = (u, k = 1.4) => { u = Math.max(0, Math.min(1, u)); const v = u - 1; return 1 + (k + 1) * v * v * v + k * v * v };
const sm5 = u => { u = Math.max(0, Math.min(1, u)); return u * u * u * (u * (u * 6 - 15) + 10) };
// 3-column satin band; notch: swallowtail depth at both ends
function fillBand(st, pts, notch) {
  const M = pts.length, nb = notch ? Math.max(1, Math.round(notch)) : 0;
  for (let j = 0; j < M; j++) {
    const a = pts[Math.max(0, j - 1)], b = pts[Math.min(M - 1, j + 1)], tx = b.x - a.x, ty = b.y - a.y, tz = b.z - a.z, tl = Math.hypot(tx, ty, tz) || 1;
    const T = new THREE.Vector3(tx / tl, ty / tl, tz / tl), n = new THREE.Vector3(-T.y, T.x, 0); if (n.lengthSq() < 1e-6) n.set(0, 1, 0); n.normalize();
    const z = new THREE.Vector3().crossVectors(T, n), c = Math.cos(pts[j].ph), sn = Math.sin(pts[j].ph), hw = (pts[j].w || RW) / 2;
    const W = n.multiplyScalar(c * hw).addScaledVector(z, sn * hw), k = j * 9;
    const cj = nb ? Math.min(Math.max(j, nb), M - 1 - nb) : j, C = pts[cj];
    st.pos[k] = pts[j].x + W.x; st.pos[k + 1] = pts[j].y + W.y; st.pos[k + 2] = pts[j].z + W.z;
    st.pos[k + 3] = C.x; st.pos[k + 4] = C.y; st.pos[k + 5] = C.z + (pts[j].bulge || 0);
    st.pos[k + 6] = pts[j].x - W.x; st.pos[k + 7] = pts[j].y - W.y; st.pos[k + 8] = pts[j].z - W.z;
    const q = j * 6; st.uv[q] = pts[j].u; st.uv[q + 1] = 0; st.uv[q + 2] = pts[j].u; st.uv[q + 3] = .5; st.uv[q + 4] = pts[j].u; st.uv[q + 5] = 1;
  }
  st.g.setDrawRange(0, (M - 1) * 12); st.g.attributes.position.needsUpdate = true; st.g.attributes.uv.needsUpdate = true; st.g.computeVertexNormals(); st.m.visible = true;
}
// o: {t, t0 (flight start), tT (tie start), cx, cy, red}; station coordinates (y down)
function renderBow(o) {
  const B = bowShape(), M = BOWM, t = o.t;
  RB.mat.uniforms.red.value = o.red || 0; RB.mat.uniforms.pur.value = 0;
  const fl = sm5((t - o.t0) / (o.tT + .15 - o.t0)), ah = -400 + (B.FL + 400) * (1 - Math.pow(1 - fl, 2.2));
  const gm = sm5((t - o.tT) / .5);
  const pts = [];
  for (let j = 0; j < M; j++) {
    const s = j / (M - 1), bp = B.P[j];
    const f = flightAt(B, ah - (1 - s) * B.L);
    const e = eob((t - o.tT - .06 * (1 - s)) / .5, 1.15);
    const flut = (1 - Math.min(1, e)) * (1.1 * Math.sin((1 - s) * 13 - t * 6.5) + .5 * Math.sin((1 - s) * 5.3 - t * 3.1));
    const loop = Math.abs(s - .5) < .34 ? 1 : 0;
    const phB = .45 + .3 * loop + .04 * Math.sin(t * 1.4 + s * 6);
    const x = f.x + (bp.x - f.x) * e, y = f.y + (bp.y - f.y) * e, z = f.z + (bp.z - f.z) * e;
    pts.push({ x, y: -y, z, ph: .45 + flut + (phB - .45) * Math.min(1, Math.max(0, e)), u: 1 - s, bulge: 6 });
  }
  RB.strips.forEach(st => st.m.visible = false);
  RB.bstrips.forEach(st => { st.m.position.set(o.cx, -o.cy, 0); st.m.rotation.set(-.42 * gm, 0, 0) });
  fillBand(RB.bstrips[0], pts, 4);
  // the knot: a short band wrapped round the centre, it cinches as the bow lands
  const kn = Math.max(0, Math.min(1, (t - o.tT - .26) / .22)), ks = eob(kn, 1.6);
  if (kn > 0) { const kp = []; for (let j = 0; j < 48; j++) { const a = (j / 47 - .5) * 2.4; kp.push({ x: 40 * Math.sin(a), y: -(-50 + 100 * j / 47) * (.55 + .45 * ks), z: 66 + 34 * Math.cos(a), ph: .18, u: .5, w: 86 * (.75 + .25 * ks), bulge: 8 }) } fillBand(RB.bstrips[1], kp, 0) }
  else RB.bstrips[1].m.visible = false;
  RB.R.render(RB.S, RB.CAM);
  RB.bstrips.forEach(st => { st.m.position.set(0, 0, 0); st.m.rotation.set(0, 0, 0); st.m.visible = false });
}
// station-space info for the overlay: tag anchor (bottom edge of the ribbon) and the cut point
function ribbonInfo(id, t) {
  const sm = RB.sims[id]; if (!sm) return null; const { P, tag } = simAt(id, t), c = sm.ci;
  return { tag: [tag[0], tag[1] + RW * .42, tag[2]], cut: [(P[c * 2] + P[c * 2 + 2]) / 2, (P[c * 2 + 1] + P[c * 2 + 3]) / 2] };
}
window.MZ3D = { initJet, renderJet, projectJet, projectWorld, initRibbon, renderRibbon, simRibbon, ribbonInfo, renderBow };
