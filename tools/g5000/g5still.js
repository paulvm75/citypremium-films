import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
// still renders of the Global 5000 in flight on a transparent background
window.G5 = async function (canvas, w, h, view, url) {
  const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  R.setSize(w, h, false); R.setPixelRatio(1); R.setClearColor(0, 0);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0; R.outputColorSpace = THREE.SRGBColorSpace;
  const S = new THREE.Scene(); const pm = new THREE.PMREMGenerator(R);
  S.environment = pm.fromScene(new RoomEnvironment(), .04).texture; S.environmentIntensity = .85;
  const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(view === 'top' ? -12 : 20, 40, view === 'top' ? -18 : 30); S.add(key);
  const rim = new THREE.DirectionalLight('#C9CDE0', 1.1); rim.position.set(-30, 10, 25); S.add(rim);
  S.add(new THREE.HemisphereLight('#EDEBE6', '#1B2140', .45));
  const g = await new GLTFLoader().parseAsync(url, ''); const P = g.scene;
  P.traverse(m => { if (m.isMesh) { const o = m.material; m.material = new THREE.MeshPhysicalMaterial({ map: o.map, color: o.color, roughness: o.userData.glass ? .08 : .32, metalness: o.userData.glass ? .4 : .05, clearcoat: .8, clearcoatRoughness: .2, side: THREE.DoubleSide }); if (o.map) o.map.colorSpace = THREE.SRGBColorSpace } });
  const G = new THREE.Group(); G.add(P); S.add(G);
  const bb = new THREE.Box3().setFromObject(P), c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
  P.position.sub(c);
  let cam;
  if (view === 'top') {
    const hw = Math.max(sz.x, sz.z * w / h) * .51, hh = hw * h / w;
    cam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, .1, 400); cam.position.set(0, 80, 0); cam.up.set(0, 0, 1); cam.lookAt(0, 0, 0);
  } else {
    G.rotation.set(-.2, -.42, .08);
    cam = new THREE.PerspectiveCamera(15, w / h, .5, 900); cam.position.set(66, 26, 70); cam.lookAt(0, -.6, 0);
  }
  R.render(S, cam); return [sz.x, sz.y, sz.z];
};
