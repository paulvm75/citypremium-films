// ---- Katana cinematic inserts: people-free photoreal footage revealed by the film's own devices ----
// Everything is a pure function of film time t (called from frameA), so renders are deterministic.
// Render page (#render*): frames are JPEG sequences, VSEEK(t) waits until every changed frame has decoded.
// Published page: full-bleed clips are <video> elements kept in sync with t; letter clips are 15 fps JPEG sequences.
(function(){
const RENDER=location.hash.startsWith('#render');
const FPS=RENDER?30:15;
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ez=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};       // cubic in-out
const exio=x=>{x=cl(x);return x<=0?0:x>=1?1:x<.5?Math.pow(2,20*x-10)/2:(2-Math.pow(2,-20*x+10))/2};
const eo=x=>{x=cl(x);return 1-Math.pow(1-x,4)};                         // quart out
// clip table: n = frames in the render sequence (30 fps), dur = seconds of footage after retime
const CL=window.FOOTCL||{};
const SRC=(k,i)=>RENDER?`file:///home/claude/cp/foot/r/${k}/f${String(i+1).padStart(4,'0')}.jpg`:`foot/p/${k}/f${String(i+1).padStart(3,'0')}.jpg`;
const MP4=(()=>{try{return !!document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"')}catch(e){return false}})();
const VID=k=>`foot/v/${k}.${MP4?'mp4':'webm'}`;
function fidx(k,ct){const c=CL[k];if(!c)return 0;const n=RENDER?c.n:c.np;return Math.round(cl(ct*FPS,0,n-1))}
// screen-space layers
const L={};
function mk(id){const d=document.getElementById(id);if(!d)return null;
  const o={d,win:d.querySelector('.fw'),img:d.querySelector('img'),vid:d.querySelector('video'),veil:d.querySelector('.fv'),edge:d.querySelector('.fe'),k:null,src:''};return o}
function init(){if(L.B)return;L.B=mk('footB');L.T=mk('footT');}
const film=()=>document.getElementById('film');
// state per moment -> {layer,k,ct,op,clip,veil,edge,scale}
function moments(t){
  const out=[];
  // o1 hook: a letterbox aperture opens on Paris at dawn from the first frame; the light panel of the next scene pushes it out to the left
  {const t0=0,tw=SA('a2')-.3,t2=tw+.95;
   if(t<t2){const ap=1,wp=exio((t-tw)/.95);
     out.push({L:'B',k:'dawn',ct:t*.9+.2,op:1,aper:ap,wipe:wp,scale:1.1-.08*eo(t/4.2),veil:'hook'})}}
  // o2 the fleet: a full-bleed wipe from the right with the car pass, out to the left on "chauffeurs"
  {const a0=SA('a7')-.3,a1=a0+.95,b0=C('chauffeurs')-.5,b1=b0+.8;
   if(t>a0&&t<b1){const wi=exio((t-a0)/(a1-a0)),wo=exio((t-b0)/(b1-b0));
     out.push({L:'T',k:'saloon',ct:1.15+(t-a0),op:1,inset:[100*(1-wi),100*wo],scale:1.04-.04*eo((t-a0)/3),veil:'fleet',edge:0})}}
  // o5 sign-off: Paris at night behind the end card, slowed and dimmed, fading to the clean call to action
  {const t0=SA('a12')-.25,t1=t0+.9,t2=C('book')+.9,t3=t2+1.3;
   if(t>t0&&t<t3){const o=ez((t-t0)/(t1-t0))*(1-ez((t-t2)/(t3-t2)));
     out.push({L:'T',k:'night',ct:(t-t0),op:o,scale:1.07-.07*cl((t-t0)/9),veil:'end'})}}
  return out}
const VEIL={
  hook:'radial-gradient(120% 90% at 78% 30%,rgba(15,20,38,0) 0%,rgba(15,20,38,.18) 60%,rgba(15,20,38,.55) 100%),linear-gradient(90deg,rgba(15,20,38,.72) 0%,rgba(15,20,38,.35) 34%,rgba(15,20,38,0) 58%)',
  fleet:'linear-gradient(90deg,rgba(15,20,38,.94) 0%,rgba(15,20,38,.82) 34%,rgba(15,20,38,0) 64%),linear-gradient(0deg,rgba(15,20,38,.35) 0%,rgba(15,20,38,0) 30%)',
  end:'radial-gradient(75% 70% at 50% 50%,rgba(15,20,38,.34) 0%,rgba(15,20,38,.4) 55%,rgba(15,20,38,.66) 100%)'};
const VEILP={
  hook:'linear-gradient(180deg,rgba(15,20,38,.55) 0%,rgba(15,20,38,.1) 40%,rgba(15,20,38,.25) 100%)',
  fleet:'linear-gradient(180deg,rgba(15,20,38,.5) 0%,rgba(15,20,38,.05) 45%,rgba(15,20,38,.35) 100%)',
  end:'linear-gradient(180deg,rgba(15,20,38,.35) 0%,rgba(15,20,38,.15) 50%,rgba(15,20,38,.35) 100%)'};
let lastT=-1;
function apply(t){
  init();const ms=moments(t),P=(typeof portrait!=='undefined'&&!!portrait);
  const f=film(),W=f?f.clientWidth:1920,H=f?f.clientHeight:1080;
  for(const key of ['B','T']){const l=L[key];if(!l)continue;const m=ms.find(x=>x.L===key);
    if(!m||m.op<=.001){l.d.style.visibility='hidden';l.k=null;if(l.vid&&!l.vid.paused)l.vid.pause();continue}
    l.d.style.visibility='visible';l.d.style.opacity=m.op.toFixed(3);l.k=m.k;l.ct=m.ct;
    // window geometry: landscape full frame, portrait a feathered square band below the copy
    const wy=P?Math.round(H*.36):0,wh=P?W:H;
    l.win.style.top=wy+'px';l.win.style.height=wh+'px';
    l.win.classList.toggle('band',P);
    const media=RENDER||!l.vid?l.img:l.vid;
    if(l.img)l.img.style.display=media===l.img?'block':'none';if(l.vid)l.vid.style.display=media===l.vid?'block':'none';
    media.style.transform=`scale(${m.scale.toFixed(4)})`;
    // reveal
    let cp='none';
    if(m.aper!==undefined){const v=(1-m.aper)*50;cp=`inset(${v.toFixed(3)}% ${(100*m.wipe).toFixed(3)}% ${v.toFixed(3)}% 0)`}
    else if(m.inset){cp=`inset(0 ${m.inset[1].toFixed(3)}% 0 ${m.inset[0].toFixed(3)}%)`}
    l.win.style.clipPath=cp;l.veil.style.clipPath=cp;
    if(l.edge){const e=m.edge||0;l.edge.style.opacity=(e>0&&e<1?Math.sin(Math.PI*e):0).toFixed(3);
      const ex=m.inset?(m.inset[0]>0?m.inset[0]:100-m.inset[1]):0;l.edge.style.left=ex.toFixed(3)+'%';l.edge.style.top=wy+'px';l.edge.style.height=wh+'px'}
    l.veil.style.background=(P?VEILP:VEIL)[m.veil];l.veil.style.top=wy+'px';l.veil.style.height=wh+'px';
    if(media===l.img){const s=SRC(m.k,fidx(m.k,m.ct));if(l.src!==s){l.src=s;l.img.src=s}}
    else{const v=l.vid,want=VID(m.k);if(l.vsrc!==want){l.vsrc=want;v.src=want;v.load()}
      const c=CL[m.k],dt=(c&&c.rate)||1,ct=cl(m.ct*dt,0,(c&&c.vdur||5)-.05);v.playbackRate=dt;
      const playing=t>lastT&&t-lastT<.25;
      if(Math.abs(v.currentTime-ct)>(playing?.2:.04))try{v.currentTime=ct}catch(e){}
      if(playing&&v.paused)v.play().catch(()=>{});if(!playing&&!v.paused)v.pause()}}
  // footage inside the kinetic letters (world-space SVG images)
  for(const [id,k,t0] of [['pc9x','champ',C('champagne')-.55],['pt9x','cots',C('weekend')-.45]]){
    const el=document.getElementById(id);if(!el||!CL[k])continue;const s=SRC(k,fidx(k,t-t0));
    if(el.__s!==s){el.__s=s;if(RENDER)el.__p=new Promise(r=>{el.addEventListener('load',r,{once:true});el.addEventListener('error',r,{once:true});setTimeout(r,4000)});el.setAttribute('href',s)}}
  {const wm=document.getElementById('wmk'),fv=['B','T'].some(k=>L[k]&&L[k].d.style.visibility==='visible'&&+L[k].d.style.opacity>.05);if(wm)wm.style.visibility=fv?'hidden':''}   // no watermark over footage
  lastT=t}
window.FOOT=apply;
// renders: wait until every image whose source changed has decoded, then two frames for compositing
window.VSEEK=function(t){const ps=[];
  for(const key of ['B','T']){const l=L[key];if(l&&l.img&&l.img.style.display!=='none'&&l.d.style.visibility!=='hidden'&&l.img.src)ps.push(l.img.decode().catch(()=>{}))}
  for(const id of ['pc9x','pt9x']){const el=document.getElementById(id);if(el&&el.__p){ps.push(el.__p);el.__p=null}}
  return Promise.all(ps).then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))};
})();
