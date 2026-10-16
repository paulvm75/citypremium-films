try{if(window.MZ3D){MZ3D.initJet(document.getElementById('jet3d'),1800,900);MZ3D.initRibbon(document.getElementById('rib3d'),2574,1760)}}catch(e){console.warn('3d',e)}
const JP3={x:-150,door:0,cx:10};let JK='';
function eo(u){return 1-Math.pow(1-u,3)}function c01(u){return Math.max(0,Math.min(1,u))}function sio(u){return .5-.5*Math.cos(Math.PI*c01(u))}function qo(u){return 1-(1-c01(u))*(1-c01(u))}
function A5(){return C('four')-.25}
function TQ(){return [C('executives')-.3,C('advisors')-.3,C('show#2')-.3,C('cars#2')-.3,C('hotels')-.35,C('hotels')-.1]}
let _tq=null;
function fxF(t){const w=$('#world');if(MB.v>.02){$('#mbB').setAttribute('stdDeviation',`${(MB.v*16).toFixed(2)} ${(MB.v*3).toFixed(2)}`);w.style.filter='url(#mb)'}else if((w.style.filter||'').includes('url'))w.style.filter='';
  $$('#glow i').forEach((e,i)=>{const a=t*(.1+i*.035)+i*2.1,x=[72,8,45][i]+Math.sin(a)*16,y=[0,72,40][i]+Math.cos(a*1.3)*14;e.style.transform=`translate(${x.toFixed(2)}cqw,${y.toFixed(2)}cqh) translate(-50%,-50%)`})}
function setTxt(e,v){if(e.textContent!==v)e.textContent=v}
// ribbon progress through the m2 scene
// ribbon: a simulated satin band pulled taut between two posts (m2 is then cut, m9 turns red)
const RLAY=()=>portrait?{xL:-150,xR:1150,y0:290,xc:500,xt:850,sag0:760}:{xL:-1020,xR:1150,y0:120,xc:70,xt:560,sag0:900};
const TC2=()=>C('home')-.1;
let RSIM=0;function ribSims(){if(RSIM)return;RSIM=1;const L=RLAY();
  MZ3D.simRibbon(Object.assign({id:'a',t0:SA('m2')-.3,t1:SA('m3')+1.2,tT:SA('m2')+.15,dT:1.5,tc:TC2()},L));
}
function drawRib(id,t,red=0,pur=0){ribSims();const k=id+t.toFixed(4)+red.toFixed(3)+pur.toFixed(3);if(k===JK)return;JK=k;MZ3D.renderRibbon({id,t,red,pur})}
function placeTag(id,sim,t){const q=MZ3D.ribbonInfo(sim,t).tag,T0=C('name')-.5,d=t-T0,g=$('#tg'+id);
  // the label lowers on its cord, then settles with a soft swing
  const u=c01(d/.55),cord=66*eo(u),k=c01((d-.12)/.6),sc=k<=0?.001:1+(Math.pow(1-k,2)*-.35)+Math.sin(k*Math.PI)*.04,sw=d>0?7*Math.exp(-d*2.2)*Math.sin(d*5.2):0;
  g.style.opacity=c01(d/.2).toFixed(3);$('#tgs'+id).setAttribute('y2',(cord+20*c01((d-.12)/.3)).toFixed(1));
  $('#tgc'+id).setAttribute('transform',`translate(0 ${(cord-66).toFixed(1)}) translate(0 66) scale(${sc.toFixed(4)}) translate(0 -66)`);$('#tgc'+id).style.opacity=c01((d-.12)/.3).toFixed(3);
  const a=-q[2]*180/Math.PI+sw;g.setAttribute('transform',`translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${a.toFixed(2)})`)}
function cutFx(t){const tc=TC2(),e=$('#cut2');if(t<tc-.16||t>tc+.2){e.setAttribute('opacity',0);return}
  const p=MZ3D.ribbonInfo('a',Math.min(t,tc-.02)).cut,d=sio((t-(tc-.12))/.2),op=1-c01((t-(tc+.04))/.14);
  e.setAttribute('opacity',op.toFixed(3));e.setAttribute('transform',`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(16)`);
  const S=110;['#cutL','#cutG'].forEach(id=>{const l=$(id);l.setAttribute('stroke-dasharray',`${S} 900`);l.setAttribute('stroke-dashoffset',(S-d*(300+S)).toFixed(1))});$('#cutF').setAttribute('opacity',(.38*c01((t-(tc-.04))/.04)).toFixed(3))}
// gallery
function m6frame(t){const S=SA('m6')-.4,E=C('sale')+1.6,CZ=6.6*sio((t-S)/(E-S)),F=G6.F,VX=G6.VX,VY=G6.VY,YC=G6.YC;
  const P=(X,Y,Z)=>{const z=Math.max(.05,Z-CZ);return [VX+F*X/z,VY+F*Y/z]},pt=a=>a[0].toFixed(1)+' '+a[1].toFixed(1);
  const quad=(s,y0,y1,z0,z1)=>'M'+pt(P(s,y0,z0))+' L'+pt(P(s,y0,z1))+' L'+pt(P(s,y1,z1))+' L'+pt(P(s,y1,z0))+'Z';
  const L0=C('museum')-.35,ord=PZ6.map((p,i)=>i).sort((a,b)=>PZ6[a][1]-PZ6[b][1]||a-b);
  const lit=d=>d<0?0:d<.05?.7:d<.1?.22:c01((d-.1)/.15);
  ord.forEach((k,r)=>{const [s,z]=PZ6[k],g=$('#pn6'+k);if(z-.5-CZ<.32){g.setAttribute('visibility','hidden');return}g.setAttribute('visibility','visible');
    g.querySelector('.pd').setAttribute('d',quad(s,-.68,.28,z-.5,z+.5));
    const l=g.querySelector('.pl');l.setAttribute('opacity',lit(t-(L0+r*.15)).toFixed(3));
    l.querySelector('.pf').setAttribute('d',quad(s,-.68,.28,z-.5,z+.5));l.querySelector('.pc').setAttribute('d',quad(s,-.62,.22,z-.45,z+.45));
    const c=P(s,-.25,z),x0=P(s,0,z-.55)[0],x1=P(s,0,z+.55)[0],e=l.querySelector('.pp');
    e.setAttribute('cx',c[0].toFixed(1));e.setAttribute('cy',c[1].toFixed(1));e.setAttribute('rx',(Math.abs(x1-x0)*.8+18).toFixed(1));e.setAttribute('ry',(F*.75/(z-CZ)).toFixed(1))});
  const ZB=12.4,a=P(-1,YC,ZB),b=P(1,1,ZB),bw=$('#bw6');
  const R=(sel,x0,y0,x1,y1)=>{const e=bw.querySelector(sel);e.setAttribute('x',x0.toFixed(1));e.setAttribute('y',y0.toFixed(1));e.setAttribute('width',(x1-x0).toFixed(1));e.setAttribute('height',(y1-y0).toFixed(1))};
  R('.bwr',a[0],a[1],b[0],b[1]);R('.bwr2',a[0],a[1],b[0],b[1]);
  const f0=P(-.62,-.82,ZB),f1=P(.62,.32,ZB),c0=P(-.56,-.76,ZB),c1=P(.56,.26,ZB);R('.bwf',f0[0],f0[1],f1[0],f1[1]);R('.bwc',c0[0],c0[1],c1[0],c1[1]);
  const bp=bw.querySelector('.bwp');bp.setAttribute('cx',VX);bp.setAttribute('cy',((f0[1]+f1[1])/2).toFixed(1));bp.setAttribute('rx',((f1[0]-f0[0])*1.05).toFixed(1));bp.setAttribute('ry',((f1[1]-f0[1])*1.1).toFixed(1));
  const bo=bw.querySelector('.bwo');bo.setAttribute('cx',(c0[0]+(c1[0]-c0[0])*.42).toFixed(1));bo.setAttribute('cy',(c0[1]+(c1[1]-c0[1])*.45).toFixed(1));bo.setAttribute('r',((c1[1]-c0[1])*.28).toFixed(1));
  $('#bwl').setAttribute('opacity',lit(t-(L0+PZ6.length*.15+.1)).toFixed(3));
  [['#tk6a',-.55],['#tk6b',.55]].forEach(([id,x])=>$(id).setAttribute('d','M'+pt(P(x,YC,CZ+.35))+' L'+pt(P(x,YC,ZB))));
  const zc=Math.min(CZ+2.5,11.4),zr=zc-CZ,s=F/zr,g=$('#cpl6');g.setAttribute('transform',`translate(${VX} ${(VY+F/zr).toFixed(2)}) scale(${s.toFixed(3)})`);
  const ph=zc*1.25,an=Math.sin(ph*Math.PI*2)*12,bn=Math.sin(ph*Math.PI*2+.6)*8;
  [['.lg6a',an,-.19,-.5],['.lg6b',-an,-.12,-.5],['.lg6c',bn,.14,-.84],['.lg6d',-bn,.255,-.84]].forEach(([q,ang,x,y])=>{const e=g.querySelector(q);if(e)e.setAttribute('transform',`rotate(${ang.toFixed(2)} ${x} ${y})`)})}
function frameM(t){fxF(t);
  if(t>SA('m6')-1.6&&t<SA('m7')+1.4)m6frame(t);
  if(!window.MZ3D)return;
  if(t>SA('m2')-1.6&&t<SA('m3')+1.4){drawRib('a',t,0,sio((t-(C('brand#2')-.1))/1.4));placeTag('2','a',t);cutFx(t);
    $('#rib3d').style.opacity=(c01((t-(SA('m2')-.2))/.35)*(1-c01((t-(SA('m3')-.2))/.45))).toFixed(3)}
  if(t>SA('m3')-1.6&&t<SA('m4')+1.4){const x=JP3.x,air=c01((-x-30)/110),y=10*air,pitch=x<-30?2+2*(1-c01((-x-30)/60)):4*c01((-x-8)/22),roll=-3*c01((-x-50)/90);
    const k='a'+[x,JP3.door,JP3.cx].map(v=>v.toFixed(3)).join();if(k!==JK){JK=k;MZ3D.renderJet({x,y,pitch,roll,door:JP3.door,camX:JP3.cx})}}
  if(t>SA('m9')-1.6&&t<SA('m10')+1.4){const R9=C('remember#2')-.8;
    if(t<C('remember#2')-.55){const c=$('#rib9').getContext('2d');c.clearRect(0,0,2574,1760)}
    else if(t>R9-.1){const k='w'+t.toFixed(4);if(k!==JK){JK=k;MZ3D.renderBow({t,t0:C('remember#2')-.55,tT:C('brand#3')-.48,cx:500,cy:400,red:sio((t-(C('brand#3')-1.25))/1.0)})}const c=$('#rib9').getContext('2d');c.clearRect(0,0,2574,1760);c.drawImage($('#rib3d'),0,0);
      $('#rib9').style.opacity=(1-sio((t-(SA('m10')-.4))/.6)).toFixed(3)}}}
