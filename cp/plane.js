import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// A procedural airliner, lit like a studio render, drawn on demand into a transparent canvas.
const P = { x: 0, y: 0, pitch: 0, roll: 0, door: 0, yaw: 0, camX: 0, camY: 0, camZ: 0 };
let R, S, CAM, PLANE, DOOR, HOLE, W = 1800, H = 900, ROOT;

function fuselage() {
  const L = 38, pts = [];
  // profile from tail (0) to nose (L): radius along the length
  const N = 90;
  for (let i = 0; i <= N; i++) {
    const s = i / N, x = s * L;
    let r;
    if (x < 9) { const u = x / 9; r = 0.45 + 1.55 * Math.sin(u * Math.PI / 2) ** 1.4; }
    else if (x < 32) r = 2.0;
    else { const u = (x - 32) / 6; r = 2.0 * Math.sqrt(Math.max(0, 1 - u ** 2.2)); }
    pts.push(new THREE.Vector2(Math.max(r, 0.001), x - L / 2));
  }
  const g = new THREE.LatheGeometry(pts, 64);
  g.rotateZ(-Math.PI / 2); // axis along +x, nose at +x
  const p = g.attributes.position, col = [];
  const white = new THREE.Color('#F4F6FB'), belly = new THREE.Color('#C3CADF'), acc = new THREE.Color('#3E4A88'), acc2 = new THREE.Color('#9FB0FF');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    // tail upsweep
    const t = Math.max(0, (-x - 7) / 12);
    p.setY(i, y + t * t * 1.6);
    // nose droop
    const n = Math.max(0, (x - 14) / 5);
    p.setY(i, p.getY(i) - n * n * 0.35);
    let c = white;
    if (y < -1.15) c = belly;
    if (y > -0.62 && y < -0.38 && x > -12 && x < 16.5) c = acc;
    if (y > -0.38 && y < -0.3 && x > -12 && x < 16.5) c = acc2;
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function planform(root, tip, span, sweep, th) {
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(-sweep, span); s.lineTo(-sweep - tip, span); s.lineTo(-root, 0); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: th, bevelEnabled: true, bevelThickness: th * .35, bevelSize: th * .6, bevelSegments: 3 });
  return g;
}

function build() {
  ROOT = new THREE.Group(); PLANE = new THREE.Group(); ROOT.add(PLANE);
  const skin = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .26, metalness: .05, clearcoat: .8, clearcoatRoughness: .25 });
  const white = new THREE.MeshPhysicalMaterial({ color: '#EEF1F8', roughness: .35, metalness: .05, clearcoat: .6 });
  const grey = new THREE.MeshPhysicalMaterial({ color: '#B8C0D8', roughness: .4, metalness: .3 });
  const dark = new THREE.MeshPhysicalMaterial({ color: '#0E1224', roughness: .15, metalness: .2, clearcoat: 1 });
  const accent = new THREE.MeshPhysicalMaterial({ color: '#3E4A88', roughness: .3, metalness: .1, clearcoat: .8 });
  const f = new THREE.Mesh(fuselage(), skin); f.castShadow = true; PLANE.add(f);
  // windows
  const wg = new THREE.BoxGeometry(.32, .42, .06), wm = new THREE.InstancedMesh(wg, dark, 2 * 34), m = new THREE.Matrix4();
  let k = 0;
  for (const side of [1, -1]) for (let i = 0; i < 34; i++) {
    const x = -12 + i * .8; if (Math.abs(x - 11.6) < .9 || Math.abs(x + 4) < .5) continue;
    m.makeTranslation(x, .25, side * 1.985); wm.setMatrixAt(k++, m);
  }
  wm.count = k; PLANE.add(wm);
  // cockpit glazing
  const cg = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, -0.9, 1.8, 1.05, .45), dark);
  cg.scale.set(2.05, 1.9, 1.98); cg.position.set(16.4, -.15, 0); cg.rotation.y = Math.PI / 2; PLANE.add(cg);
  // the front door, on the camera side
  HOLE = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, .05), new THREE.MeshBasicMaterial({ color: '#05070F' }));
  HOLE.position.set(11.6, .05, 1.97); PLANE.add(HOLE);
  DOOR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.9, .07), white);
  DOOR.position.set(11.6, .05, 2.0); PLANE.add(DOOR);
  // wings with a little dihedral
  for (const side of [1, -1]) {
    const w = new THREE.Mesh(planform(7, 2, 17, 6.5, .35), white); w.castShadow = true;
    w.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(5, -1.25, 0);
    const wg2 = new THREE.Group(); wg2.add(w); wg2.rotation.x = side * -0.08; PLANE.add(wg2);
    // winglet
    const wl = new THREE.Mesh(planform(2, .8, 2.2, 1.2, .2), accent); wl.position.set(5 - 6.5, -1.25 + 17 * .08, side * 17); wl.rotation.y = side > 0 ? 0 : Math.PI; wl.rotation.x = 0; PLANE.add(wl);
    // engine
    const eg = new THREE.Group();
    const nac = new THREE.Mesh(new THREE.CylinderGeometry(.95, .8, 3.8, 32, 1, true), white); nac.rotation.z = Math.PI / 2; nac.castShadow = true; eg.add(nac);
    const cap = new THREE.Mesh(new THREE.CircleGeometry(.95, 32), dark); cap.rotation.y = Math.PI / 2; cap.position.x = 1.9; eg.add(cap);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(.93, .09, 8, 32), grey); lip.rotation.y = Math.PI / 2; lip.position.x = 1.92; eg.add(lip);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.1, 24), grey); cone.rotation.z = -Math.PI / 2; cone.position.x = -2.3; eg.add(cone);
    const py = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, .25), white); py.position.set(-.3, .8, 0); eg.add(py);
    eg.position.set(4.3, -2.65, side * 6.2); PLANE.add(eg);
  }
  // tail
  for (const side of [1, -1]) {
    const h = new THREE.Mesh(planform(3.6, 1.3, 6.5, 3.2, .22), white); h.castShadow = true;
    h.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2; h.position.set(-14.2, 1.0, 0); PLANE.add(h);
  }
  const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(-4.6, 6.2); fs.lineTo(-6.6, 6.2); fs.lineTo(-6.8, 0); fs.closePath();
  const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: .3, bevelEnabled: true, bevelThickness: .1, bevelSize: .15, bevelSegments: 2 }), accent);
  fin.position.set(-11.6, 1.2, -.15); fin.castShadow = true; PLANE.add(fin);
  // landing gear
  const tyre = new THREE.CylinderGeometry(.55, .55, .45, 20);
  for (const [x, z] of [[2.2, 2.4], [2.2, -2.4], [2.2, 3.1], [2.2, -3.1], [14.5, 0]]) {
    const t = new THREE.Mesh(tyre, dark); t.rotation.x = Math.PI / 2; t.position.set(x, -3.15, z); PLANE.add(t);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 1.4, 8), grey); leg.position.set(x, -2.45, z > 0 ? z - .3 : z + .3); if (x > 10) leg.position.z = 0; PLANE.add(leg);
  }
  PLANE.position.y = 3.7; // wheels on the ground at y=0
  S.add(ROOT);
}

function runway() {
  const c = document.createElement('canvas'); c.width = 4096; c.height = 256; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#20274A'); g.addColorStop(.5, '#262E55'); g.addColorStop(1, '#20274A');
  x.fillStyle = g; x.fillRect(0, 0, 4096, 256);
  x.fillStyle = 'rgba(238,240,246,.55)'; x.fillRect(0, 10, 4096, 6); x.fillRect(0, 240, 4096, 6);
  for (let i = 0; i < 4096; i += 120) x.fillRect(i, 124, 60, 8);
  for (let i = 1700; i < 2100; i += 40) { x.fillRect(i, 40, 24, 50); x.fillRect(i, 166, 24, 50); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(600, 38), new THREE.MeshStandardMaterial({ map: tex, color: '#7C84A8', roughness: .95, transparent: true, opacity: .92 }));
  m.rotation.x = -Math.PI / 2; m.position.set(-120, .01, -6); m.receiveShadow = true; S.add(m);
  const lg = new THREE.SphereGeometry(.16, 8, 6), lm = new THREE.MeshBasicMaterial({ color: '#B9C4FF' }), li = new THREE.InstancedMesh(lg, lm, 120), mm = new THREE.Matrix4(); let n = 0;
  for (let i = 0; i < 60; i++) for (const z of [-6 - 19.6, -6 + 19.6]) { mm.makeTranslation(-400 + i * 10, .2, z); li.setMatrixAt(n++, mm) }
  S.add(li);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(600, 300), new THREE.ShadowMaterial({ opacity: .38 }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = .02; sh.receiveShadow = true; S.add(sh);
}

function init(canvas, w, h) {
  W = w; H = h;
  R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  R.setSize(W, H, false); R.setPixelRatio(1);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = .92; R.outputColorSpace = THREE.SRGBColorSpace;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  S = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(R); S.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(30, 60, 40); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -60, right: 60, top: 40, bottom: -40, near: 1, far: 200 }); key.shadow.bias = -.0005;
  S.add(key); S.add(new THREE.HemisphereLight('#C7CEF0', '#1A2146', .35)); S.environmentIntensity = .9;
  const rim = new THREE.DirectionalLight('#9FB0FF', 1.2); rim.position.set(-40, 20, -40); S.add(rim);
  CAM = new THREE.PerspectiveCamera(26, W / H, .5, 1200);
  build(); runway();
}

function render(st) {
  Object.assign(P, st);
  ROOT.position.set(P.x, P.y, 0);
  ROOT.rotation.set(P.roll * Math.PI / 180, P.yaw * Math.PI / 180, P.pitch * Math.PI / 180);
  DOOR.position.z = 2.0 + Math.min(1, P.door * 2) * .35; DOOR.position.x = 11.6 - Math.max(0, P.door * 2 - 1) * 1.35;
  CAM.position.set(52 + P.camX, 10 + P.camY, 34 + P.camZ); CAM.lookAt(3 + P.camX * .4, 3.0, 0);
  R.render(S, CAM);
}

// where a point on the plane lands on the canvas, in pixels
function project(lx, ly, lz) {
  ROOT.updateMatrixWorld(true); const v = new THREE.Vector3(lx, ly, lz); PLANE.localToWorld(v); v.project(CAM);
  return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H];
}

window.PLANE3D = { init, render, project };
