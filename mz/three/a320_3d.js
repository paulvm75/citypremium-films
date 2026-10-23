import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import GLB from './a320.glb';
import STG from './stairs.glb';
// Airbus A320neo (FlightGear A320-family model, GPLv2, repainted white) on a wet apron, for the Agencies film "airside" scene.
// Same API as before: init(canvas,w,h), render({x,y,pitch,roll,door,camX,stairs}), project(lx,ly,lz) in model metres, doorAnchor().
const c01 = u => Math.max(0, Math.min(1, u));
const A = { R: null, S: null, CAM: null, ROOT: null, PLANE: null, W: 1800, H: 900, DOOR: null };
const SC = .57, GROUND = 4.39;           // metres to scene units; wheel bottom in model space
const HX = 14.29, HZ = 2.02;             // R1 door forward hinge line (model space, after the nose-forward flip)
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

function setupModel(gltf) {
  const m = gltf.scene, P = A.PLANE;
  const doorParts = [];
  m.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    const om = o.material, g = om.userData && om.userData.glass;
    let nm;
    if (g || /glass/.test(om.name)) nm = new THREE.MeshPhysicalMaterial({ color: om.color, emissive: om.emissive, roughness: .06, metalness: .2, clearcoat: 1, side: THREE.DoubleSide });
    else if (!/LG|Wheel|Gear|Actuator|Stay|Link|Tube|Fitting|Cable|Spoiler|Flap/.test(o.parent ? o.parent.name : '')) nm = new THREE.MeshPhysicalMaterial({ map: om.map, roughness: .28, metalness: .02, clearcoat: .9, clearcoatRoughness: .14, side: THREE.DoubleSide });
    else nm = new THREE.MeshPhysicalMaterial({ map: om.map, color: om.color, roughness: .38, metalness: .12, clearcoat: .35, side: THREE.DoubleSide });
    if (nm.map) { nm.map.colorSpace = THREE.SRGBColorSpace; nm.map.anisotropy = 8 }
    o.material = nm;
  });
  m.traverse(o => { if (!o.isMesh && /^Door(R1|R1Inner|HingeR1)$/.test(o.name)) doorParts.push(o) });
  P.add(m);
  // R1 plug door: moves out, then swings forward on its front hinge
  const pivot = new THREE.Group(); pivot.position.set(HX, 0, HZ); P.add(pivot);
  for (const o of doorParts) { m.updateMatrixWorld(true); pivot.attach(o) }
  A.DOOR = pivot;
  // warm cabin light behind the opening
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(.95, 2.05), new THREE.MeshBasicMaterial({ color: '#F1E2C4', transparent: true, opacity: 0 }));
  glow.position.set(13.78, .49, 1.55); P.add(glow); A.GLOW = glow;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.2), new THREE.MeshBasicMaterial({ color: '#2B2620' }));
  back.position.set(13.78, .49, 1.5); A.BACK = back;
  A.N_READY = (A.N_READY || 0) + 1; if (A.N_READY >= 2) { window.PLANE3D_READY = true; render({}) }
}
function setupStairs(gltf) {
  const m = gltf.scene; m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true;
    const om = o.material; o.material = new THREE.MeshPhysicalMaterial({ map: om.map, color: om.color, roughness: .45, metalness: .2, clearcoat: .3, side: THREE.DoubleSide }); if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace } });
  const g = new THREE.Group(); g.add(m); A.PLANE.add(g); A.STAIRS = g; m.position.set(13.78, -1.0, .75);
  A.N_READY = (A.N_READY || 0) + 1; if (A.N_READY >= 2) { window.PLANE3D_READY = true; render({}) }
}
function init(canvas, w, h) {
  A.W = w; A.H = h;
  const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  R.setSize(w, h, false); R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0; R.outputColorSpace = THREE.SRGBColorSpace;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const S = new THREE.Scene(); const pm = new THREE.PMREMGenerator(R); S.environment = pm.fromScene(new RoomEnvironment(), .04).texture; S.environmentIntensity = .95;
  A.R = R; A.S = S;
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(25, 50, 35); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -45, right: 45, top: 30, bottom: -30, near: 1, far: 160 }); key.shadow.bias = -.0005;
  S.add(key); S.add(new THREE.HemisphereLight('#E6E4DE', '#111218', .35));
  const rim = new THREE.DirectionalLight('#C9CDD8', 1.3); rim.position.set(-35, 18, -30); S.add(rim);
  A.CAM = new THREE.PerspectiveCamera(24, w / h, .3, 900);
  A.ROOT = new THREE.Group(); A.PLANE = new THREE.Group(); A.PLANE.scale.setScalar(SC); A.PLANE.position.set(-.6, GROUND * SC, 0); A.ROOT.add(A.PLANE); S.add(A.ROOT);
  const lamp = new THREE.PointLight('#FFF4E2', 0, 8); lamp.position.set(13.8, .6, 3.2); A.PLANE.add(lamp); A.LAMP = lamp;
  const rf = new Reflector(new THREE.PlaneGeometry(500, 34), { textureWidth: 1024, textureHeight: 512, color: '#44485A' });
  rf.rotation.x = -Math.PI / 2; rf.position.set(-100, -.005, -4); S.add(rf);
  apron(S);
  const ld = new GLTFLoader(); ld.setMeshoptDecoder(MeshoptDecoder);
  window.PLANE3D_READY = false;
  MeshoptDecoder.ready.then(() => { ld.parse(GLB.buffer.slice(GLB.byteOffset, GLB.byteOffset + GLB.byteLength), '', setupModel, e => console.warn('glb', e)); ld.parse(STG.buffer.slice(STG.byteOffset, STG.byteOffset + STG.byteLength), '', setupStairs, e => console.warn('glb', e)) });
}
const P = { x: 0, y: 0, pitch: 0, roll: 0, door: 0, camX: 0, camY: 0, camZ: 0, lookY: 1.95 };
function render(st) {
  Object.assign(P, st);
  A.ROOT.position.set(P.x, P.y, 0); A.ROOT.rotation.set(P.roll * Math.PI / 180, 0, P.pitch * Math.PI / 180);
  if (A.DOOR && A.STAIRS) { const st = c01(P.door / .45), es = 1 - Math.pow(1 - st, 3), dd = c01((P.door - .42) / .58), out = c01(dd / .3), sw = c01((dd - .2) / .8), e = sw * sw * (3 - 2 * sw);
    A.STAIRS.position.set(0, 0, 11 * (1 - es)); A.STAIRS.visible = P.door > .001;
    A.DOOR.position.set(HX + .05 * out, 0, HZ + .3 * out); A.DOOR.rotation.y = e * (Math.PI - .1);
    A.GLOW.material.opacity = .6 * c01(dd / .4); A.LAMP.intensity = dd * 6 }
  A.CAM.position.set(27 + P.camX, 6.4 + P.camY, 21 + P.camZ); A.CAM.lookAt(.8 + P.camX * .35, P.lookY, 0);
  A.R.render(A.S, A.CAM);
}
function project(lx, ly, lz) {
  A.ROOT.updateMatrixWorld(true); const v = new THREE.Vector3(lx, ly, lz); A.PLANE.localToWorld(v); v.project(A.CAM);
  return [(v.x + 1) / 2 * A.W, (1 - v.y) / 2 * A.H];
}
function doorAnchor() { return [13.78, -.45, 2.0] }
window.__CAMSET = (p, l) => { A.CAM.position.set(...p); A.CAM.lookAt(...l); A.R.render(A.S, A.CAM) };
window.PLANE3D = { init, render, project, doorAnchor };
