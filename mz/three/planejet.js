import './mz3d.js';
// the agencies film drives a PLANE3D object; give it the Maisons jet (Challenger-style nose, windscreen, plug door and airstair)
window.PLANE3D = { init: (c, w, h) => MZ3D.initJet(c, w, h), render: s => MZ3D.renderJet(s), project: (x, y, z) => MZ3D.projectJet(x, y, z) };
