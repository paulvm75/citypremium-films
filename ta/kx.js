// ---- Katana kinetic type: full-frame typographic set pieces, every value a pure function of film time t ----
// Grammar learned from the reference (Apple "Don't Blink"): one word at a time on the voice, centred,
// hero words that take the whole frame, hard inversions on counts, and type that becomes the next object.
// Remixed for City Premium: slower, cleaner eases, navy and ivory only, no shakes, no swooshes.
(function(){
const NS='http://www.w3.org/2000/svg';
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const eo=x=>{x=cl(x);return 1-Math.pow(1-x,4)};                         // quart out
const eo5=x=>{x=cl(x);return 1-Math.pow(1-x,5)};
const ez=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};       // cubic in-out
const ex=x=>{x=cl(x);return x===1?1:1-Math.pow(2,-10*x)};               // expo out
const exio=x=>{x=cl(x);return x<=0?0:x>=1?1:x<.5?Math.pow(2,20*x-10)/2:(2-Math.pow(2,-20*x+10))/2};
const bk=(x,k=1.4)=>{x=cl(x);const v=x-1;return 1+(k+1)*v*v*v+k*v*v};   // back out
const win=(t,a,b)=>t>=a&&t<b;
const nth=(w,after)=>{let n=0;for(const x of WORDS){if(x.n===w){n++;if(x.a>=after-.01)return n}}return 1};
const CA=(w,after)=>{for(const x of WORDS)if(x.n===w&&x.a>=after-.01)return x.a;return 0};   // first cue of a word at or after a time
const IV='#F4F2ED',NV='#141A33',N2='#1B2140',N3='#2B3150',PERI='#9FB0FF';
const FONT='"Instrument Sans","Helvetica Neue",Arial,sans-serif';
let K=null;
function mk(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
function hx(tag,cls,par){const e=document.createElement(tag);if(cls)e.className=cls;if(par)par.appendChild(e);return e}
const cv=document.createElement('canvas').getContext('2d');
function gm(ch,font){cv.font=font;const m=cv.measureText(ch);return{w:m.width,asc:m.actualBoundingBoxAscent,des:m.actualBoundingBoxDescent,l:m.actualBoundingBoxLeft,r:m.actualBoundingBoxRight}}
const mixc=(c1,c2,u)=>{const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),A=h(c1),B=h(c2);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*cl(u))).join(',')+')'};
const tw=(s,font)=>{cv.font=font;return cv.measureText(s).width};
function txt(par,s,x,y,size,o={}){const e=mk('text',{x,y,'font-size':size,'font-weight':o.w||600,fill:o.fill||IV,'text-anchor':o.anchor||'middle',style:`font-family:${FONT};letter-spacing:${o.ls||'-.02em'};font-variant-numeric:tabular-nums${o.st?';font-style:'+o.st:''}`},par);e.textContent=s;return e}

// an opaque frame with words cut out of it (the footage shows through the letters); it leaves by splitting open along its centre line
function mkCover(svg,defs,id,words,cx,cy,W,H,P,color){
  const m=mk('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:-H,width:W,height:3*H},defs);mk('rect',{x:0,y:-H,width:W,height:3*H,fill:'#fff'},m);
  const slit=mk('rect',{x:0,y:cy,width:W,height:0,fill:'#000'},m);
  const ws=words.map(w=>{const w100=tw(w,`700 100px ${FONT}`),F=Math.min(W*.88/w100*100,P?W*.6:H*.62);return{e:txt(m,w,cx,cy+.355*F,F,{w:700,fill:'#000',ls:'0em'}),F}});
  const g=mk('g',{},svg),top=mk('g',{},g),bot=mk('g',{},g);
  mk('rect',{x:0,y:-H,width:W,height:H+cy+.6,fill:color,mask:`url(#${id})`},top);mk('rect',{x:0,y:cy,width:W,height:2*H-cy,fill:color,mask:`url(#${id})`},bot);
  return{g,top,bot,ws,slit,cx,cy}}
function runCover(a,t,T,z0,z1,H){
  a.ws.forEach((w,i)=>{const live=t>=T[i]&&(i===T.length-1||t<T[i+1]);w.e.setAttribute('opacity',live?1:0);
    const k=1.1-.1*eo5((t-T[i])/.6);w.e.setAttribute('transform',`translate(${a.cx} ${a.cy}) scale(${k.toFixed(4)}) translate(${-a.cx} ${-a.cy})`)});
  const e=exio((t-z0)/(z1-z0));a.top.setAttribute('transform',`translate(0 ${(-e*(a.cy+4)).toFixed(2)})`);a.bot.setAttribute('transform',`translate(0 ${(e*(H-a.cy+4)).toFixed(2)})`);return e}
function build(W,H,P){
  const host=document.getElementById('kx');host.innerHTML='';
  const svg=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,style:'position:absolute;inset:0;overflow:visible'},host);
  const defs=mk('defs',{},svg);
  const M=Math.min(W,H),k={svg,W,H,P};
  // KD the day on the ground: a 24-hour dial on the right, a real jet travels round it from 07:40 at the aircraft door
  // to 21:30 at the restaurant and 02:00 in the night, while the background goes from morning ivory to dusk to night
  {const bgd=document.getElementById('kxbg');bgd.innerHTML='';const bs=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,style:'position:absolute;inset:0;overflow:visible'},bgd);
   const bd=mk('defs',{},bs),cx=P?W*.5:W*.68,cy=P?H*.6:H*.43,R=P?W*.34:H*.315;
   const gr=mk('radialGradient',{id:'kdg',gradientUnits:'userSpaceOnUse',cx,cy,r:R*1.9},bd);mk('stop',{offset:0,'stop-color':'#4A58B2','stop-opacity':.55},gr);mk('stop',{offset:.5,'stop-color':'#2B3150','stop-opacity':.25},gr);mk('stop',{offset:1,'stop-color':'#141A33','stop-opacity':0},gr);
   const c1=mk('circle',{cx,cy,r:0},mk('clipPath',{id:'kdc1'},bd)),c2=mk('circle',{cx,cy,r:0},mk('clipPath',{id:'kdc2'},bd)),RM=Math.hypot(Math.max(cx,W-cx),Math.max(cy,H-cy))*1.02;
   const b0=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:'#F4F2ED'},bs),b1=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:'#262D52','clip-path':'url(#kdc1)'},bs),b2=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:'#10152B','clip-path':'url(#kdc2)'},bs),bg3=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:'url(#kdg)'},bs);
   const g=mk('g',{},svg),ring=mk('circle',{cx,cy,r:R,fill:'none','stroke-width':Math.max(1.5,R*.006),pathLength:1,'stroke-dasharray':'1 1',transform:`rotate(-90 ${cx} ${cy})`},g);
   const tk=mk('g',{},g);for(let h=0;h<24;h++){const a=h/24*Math.PI*2,M=h%6===0,r0=R*(M?.9:.94),r1=R*.97;mk('line',{x1:cx+r0*Math.sin(a),y1:cy-r0*Math.cos(a),x2:cx+r1*Math.sin(a),y2:cy-r1*Math.cos(a),'stroke-width':M?R*.012:R*.006,'stroke-linecap':'round'},tk)}
   // the photo window inside the dial: the aircraft door at dawn, the maitre d' at the restaurant, the concierge at two in the morning
   const Rp=R*.86,pc=mk('circle',{cx,cy,r:0},mk('clipPath',{id:'kdp'},defs)),pg=mk('g',{'clip-path':'url(#kdp)'},g),IS=Rp*2*1.14;
   const ims=(window.DIAL||[]).map((u,i)=>{let par=pg;if(i){const m=mk('mask',{id:'kdm'+i,maskUnits:'userSpaceOnUse',x:cx-IS,y:cy-IS,width:2*IS,height:2*IS},defs);const w=mk('path',{fill:'#fff',d:''},m);par=mk('g',{mask:`url(#kdm${i})`},pg);par.__w=w}
     const im=mk('image',{href:u,x:cx-IS/2,y:cy-IS/2,width:IS,height:IS,preserveAspectRatio:'xMidYMid slice'},par);im.__w=par.__w;return im});
   const pr=mk('circle',{cx,cy,r:Rp,fill:'none',stroke:'rgba(10,14,30,.35)','stroke-width':R*.012},g);
   const hand=mk('line',{x1:cx,y1:cy,x2:cx,y2:cy-Rp,stroke:IV,'stroke-width':Math.max(2,R*.01),'stroke-linecap':'round',opacity:0},g);
   const arc=mk('path',{fill:'none',stroke:PERI,'stroke-width':R*.016,'stroke-linecap':'round'},g);
   const dot=mk('circle',{cx,cy,r:R*.035,fill:PERI},g);
   const F=P?W*.1:H*.095,fn=`600 ${F}px ${FONT}`,d=tw('0',fn),cw=tw(':',fn)*1.05,tot=4*d+cw,x0=cx-tot/2,yb=cy+R+(P?W*.16:H*.155);
   const V=['07:40','21:30','02:00'],xs=[x0,x0+d,null,x0+2*d+cw,x0+3*d+cw];
   const dig=[0,1,3,4].map(p=>V.map(v=>txt(g,v[p],xs[p]+d/2,yb,F,{fill:NV})));const colon=txt(g,':',x0+2*d+cw/2,yb-.04*F,F,{fill:PERI});
   k.kd={c1,c2,RM,g,bs,b1,b2,bg3,ring,tk,arc,dig,colon,dot,pc,Rp,ims,hand,IS,yb,cx,cy,R,F}}
  // K0 the opening hook: an ivory frame, a slit of dawn light, then YOUR CLIENT / LANDS / IN PARIS cut out of it with Paris at dawn inside the letters; it splits open on "tomorrow"
  {const Z=P?{cx:W*.5,cy:H*.36+W/2}:{cx:W/2,cy:H/2};k.k0=mkCover(svg,defs,'k0m',['YOUR CLIENT','LANDS','IN PARIS'],Z.cx,Z.cy,W,H,P,IV)}
  // K8 something truly unusual: a point of light, a hairline question mark draws itself, fills like frosted glass, and a reflection crosses it
  {const Z=P?{cx:W*.5,cy:H*.66,s:W*.8}:{cx:W*.72,cy:H*.5,s:H*.62},g=mk('g',{},svg),F=Z.s*1.05,yb=Z.cy+.36*F;
   const hg=mk('radialGradient',{id:'k8h'},defs);mk('stop',{offset:0,'stop-color':'#9FB0FF','stop-opacity':.5},hg);mk('stop',{offset:1,'stop-color':'#9FB0FF','stop-opacity':0},hg);
   const fg=mk('linearGradient',{id:'k8f',x1:0,y1:0,x2:.4,y2:1},defs);mk('stop',{offset:0,'stop-color':'#F4F2ED','stop-opacity':.96},fg);mk('stop',{offset:1,'stop-color':'#9FB0FF','stop-opacity':.7},fg);
   const sg=mk('linearGradient',{id:'k8s',x1:0,y1:0,x2:1,y2:0},defs);[[0,0],[.5,.95],[1,0]].forEach(([o,v])=>mk('stop',{offset:o,'stop-color':'#fff','stop-opacity':v},sg));
   const halo=mk('circle',{cx:Z.cx,cy:Z.cy,r:Z.s*.75,fill:'url(#k8h)'},g),zg=mk('g',{},g);
   const fill=txt(zg,'?',Z.cx,yb,F,{w:500,fill:'url(#k8f)',ls:'0em'}),line=txt(zg,'?',Z.cx,yb,F,{w:500,fill:'none',ls:'0em'});line.setAttribute('stroke',IV);line.setAttribute('stroke-width',Math.max(1.5,F*.004));
   const cp=mk('clipPath',{id:'k8c'},defs);txt(cp,'?',Z.cx,yb,F,{w:500,ls:'0em'});
   const sh=mk('rect',{x:-F*.14,y:Z.cy-F*.7,width:F*.28,height:F*1.4,fill:'url(#k8s)',transform:''},mk('g',{'clip-path':'url(#k8c)'},zg));
   const dot=mk('circle',{cx:Z.cx-F*.012,cy:yb-F*.045,r:F*.05,fill:IV},g);
   k.k8={g,zg,halo,fill,line,sh,dot,Z,F,L:F*3.6}}
  // K9 made to measure: a frame of corner marks fits itself to three different moments, with dimension lines that stretch with it
  {const Z=P?{cx:W*.5,cy:H*.65,s:W*.78}:{cx:W*.72,cy:H*.48,s:H*.6},g=mk('g',{},svg),cp=mk('clipPath',{id:'k9c'},defs),cr=mk('rect',{x:0,y:0,width:0,height:0,rx:Z.s*.02},cp);
   const ig=mk('g',{'clip-path':'url(#k9c)'},g),src=['pg9x','pc9x','pt9x'].map(id=>{const e=document.getElementById(id);return e?e.getAttribute('href'):''});
   const ims=src.map(u=>mk('image',{href:u,x:Z.cx-Z.s*.55,y:Z.cy-Z.s*.55,width:Z.s*1.1,height:Z.s*1.1,preserveAspectRatio:'xMidYMid slice'},ig));
   const lw=Math.max(2,Z.s*.006),br=mk('path',{fill:'none',stroke:IV,'stroke-width':lw*1.6,'stroke-linecap':'round','stroke-linejoin':'round'},g),dm=mk('path',{fill:'none',stroke:PERI,'stroke-width':lw,'stroke-linecap':'round'},g);
   const fs=P?W*.05:H*.046,lab=['Guided visit','Champagne','Cotswolds'].map(l=>txt(g,l,Z.cx,0,fs,{w:600,fill:IV,ls:'-.01em'}));
   k.k9={g,cr,ims,br,dm,lab,Z,fs,S:[[.62,.9],[1,.62],[.8,.8]]}}
  // K2 That's where City Premium comes in: two words punch in with outline echoes, the real logo reveals with a glint,
  // "comes in." is underlined, then the camera dives through the o of "comes"
  {const bgd=document.getElementById('kxbg'),bs=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,style:'position:absolute;inset:0;overflow:visible'},bgd),d2=mk('defs',{},bs);
   const mask=mk('mask',{id:'k2h',maskUnits:'userSpaceOnUse',x:-W,y:-H,width:3*W,height:3*H},d2);
   mk('rect',{x:-W,y:-H,width:3*W,height:3*H,fill:'#fff'},mask);const hole=mk('ellipse',{cx:0,cy:0,rx:0,ry:0,fill:'#000'},mask);
   mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:NV,mask:'url(#k2h)'},bs);
   const g=mk('g',{},svg),zg=mk('g',{},g),F1=P?W*.2:H*.24,F4=P?W*.085:H*.085,cy=H*(P?.44:.46);
   const single=['That’s','where'].map(s=>{const ec=[0,1].map(()=>{const e=txt(g,s,W/2,cy+.35*F1,F1,{fill:'none'});e.setAttribute('stroke',PERI);e.setAttribute('stroke-width',Math.max(1.5,F1*.012));return e});return{e:txt(g,s,W/2,cy+.35*F1,F1),ec}});
   const wm=document.getElementById('wm1'),yC=(wm?wm.offsetTop+wm.offsetHeight:H*.68)+F4*1.25,f4=`500 ${F4}px ${FONT}`,wco=tw('comes',f4),wi=tw('in.',f4),sp4=F4*.26,L4=wco+sp4+wi,xc=W/2-L4/2;
   const comes=txt(zg,'comes',xc,yC,F4,{w:500,fill:PERI,anchor:'start',ls:'0em'}),inn=txt(zg,'in.',xc+wco+sp4,yC,F4,{w:500,fill:PERI,anchor:'start',ls:'0em'});
   const ul=mk('line',{x1:xc,x2:xc+L4,y1:yC+F4*.22,y2:yC+F4*.22,stroke:IV,'stroke-width':Math.max(2,F4*.045),'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},zg);
   const om=gm('o',f4),oc=[xc+tw('c',f4)+(om.r-om.l)/2,yC-om.asc/2],r0=Math.min(om.r+om.l,om.asc)/2*.52;
   k.k2={g,bs,hole,zg,single,comes,inn,ul,oc,r0,F1,F4,cy}}
  // K3 operator: the word takes the frame, letters track in, then its o becomes the orbit
  {const g=mk('g',{},svg);const veil=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:NV},g);
   const f0=P?W*.07:H*.07,y0=P?H*.37:H*.33;const a=['We’re','an'],aw=a.map(s=>tw(s,`500 ${f0}px ${FONT}`)),sp0=f0*.26,La=aw[0]+sp0+aw[1];
   const cpa=mk('clipPath',{id:'k3a'},defs);mk('rect',{x:0,y:y0-f0*1.05,width:W,height:f0*1.35},cpa);const ga=mk('g',{'clip-path':'url(#k3a)'},g);
   const small=[txt(ga,a[0],W/2-La/2,y0,f0,{w:500,anchor:'start',fill:'#C7CEF0',ls:'-.01em'}),txt(ga,a[1],W/2-La/2+aw[0]+sp0,y0,f0,{w:500,anchor:'start',fill:'#C7CEF0',ls:'-.01em'})];
   const word='operator',base=100,fb=`600 ${base}px ${FONT}`,wb=tw(word,fb)*(1-.035*0);const F=Math.min(W*.8/wb*base,H*.42),fn=`600 ${F}px ${FONT}`;
   const lw=[...word].map(c=>tw(c,fn)),track=-.03*F,Lw=lw.reduce((s,v)=>s+v,0)+track*(word.length-1),yb=P?H*.53:H*.66,xs=[];let xx=W/2-Lw/2;lw.forEach(v=>{xs.push(xx);xx+=v+track});
   const cpo=mk('clipPath',{id:'k3o'},defs);mk('rect',{x:-W,y:yb-F*1.0,width:3*W,height:F*1.32},cpo);const go=mk('g',{'clip-path':'url(#k3o)'},g);
   const letters=[...word].map((c,i)=>txt(go,c,xs[i],yb,F,{anchor:'start',ls:'0em'}));
   const om=gm('o',fn),oc=[xs[0]+(om.r-om.l)/2,yb-om.asc/2],orad=(Math.min(om.r+om.l,om.asc))/2,ost=orad*.36;
   const ring=mk('ellipse',{cx:oc[0],cy:oc[1],rx:orad-ost/2,ry:orad-ost/2,fill:'none',stroke:IV,'stroke-width':ost,opacity:0},g);
   k.k3={g,veil,small,letters,xs,F,yb,oc,orad,ost,ring}}
  // K6 since 2010: an odometer rolls to the year
  {const g=mk('g',{},svg);const F=P?W*.3:H*.36,fn=`600 ${F}px ${FONT}`,d=tw('0',fn)*1.02,cy=P?H*.5:H*.52,yb=cy+.36*F,x0=W/2-2*d;
   const f0=P?W*.07:H*.075,y0=cy-.86*F;const cpl=mk('clipPath',{id:'k6l'},defs);mk('rect',{x:0,y:y0-f0*1.05,width:W,height:f0*1.35},cpl);
   const lab=txt(mk('g',{'clip-path':'url(#k6l)'},g),'Since',W/2,y0,f0,{w:500,fill:'#C7CEF0',ls:'-.01em'});
   const tgt=[2,0,1,0],roll=[2,10,21,30],strips=[];
   const lg=mk('linearGradient',{id:'k6f',x1:0,y1:0,x2:0,y2:1},defs);[[0,0],[.14,1],[.86,1],[1,0]].forEach(([o,v])=>mk('stop',{offset:o,'stop-color':'#fff','stop-opacity':v},lg));
   tgt.forEach((v,i)=>{const id='k6c'+i,cp=mk('mask',{id,maskUnits:'userSpaceOnUse',x:x0+i*d,y:yb-1.0*F,width:d,height:1.25*F},defs);mk('rect',{x:x0+i*d,y:yb-1.0*F,width:d,height:1.25*F,fill:'url(#k6f)'},cp);
     const s=mk('g',{},mk('g',{mask:`url(#${id})`},g));for(let j=0;j<=roll[i];j++)txt(s,String((v-roll[i]+j+100)%10),x0+i*d+d/2,yb+(j-roll[i])*F*1.02,F);strips.push(s)});
   const ul=mk('line',{x1:x0,x2:x0+4*d,y1:yb+.16*F,y2:yb+.16*F,stroke:PERI,'stroke-width':Math.max(2,F*.018),'stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1'},g);
   k.k6={g,lab,strips,roll,F,ul}}
  // K5 white label: the whole frame is a wall of flaps. It flips to blank ivory on "white label", then to navy for "your name."
  {const cols=P?8:14,rows=1,box=hx('div','kw',host),tw_=W/cols,th=H/rows,tiles=[];
   for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const d=hx('div','kwt',box);Object.assign(d.style,{left:(c*tw_-.5)+'px',top:(r*th-.5)+'px',width:(tw_+1)+'px',height:(th+1)+'px'});tiles.push({d,dl:c/(cols-1)*.26})}
   const ts=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,style:'position:absolute;inset:0;overflow:visible'},box);
   const fit=(str,mw,mh,wt)=>Math.min(mw/tw(str,`${wt} 100px ${FONT}`)*100,mh);
   const F1=fit('white label,',W*.82,H*.3,600),f1=`600 ${F1}px ${FONT}`,x1=W/2-tw('white label,',f1)/2,y1=H*.5+.34*F1;
   const w1=[txt(ts,'white',x1,y1,F1,{anchor:'start',fill:NV,st:'italic',ls:'0em'}),txt(ts,'label,',x1+tw('white ',f1),y1,F1,{anchor:'start',fill:NV,st:'italic',ls:'0em'})];
   const L2=['so','your','client','only','ever','sees'],F2=fit(L2.join(' '),W*.86,H*.085,600),f2=`600 ${F2}px ${FONT}`;let xx=W/2-tw(L2.join(' '),f2)/2;const y2=H*(P?.4:.34);
   const w2=L2.map(w=>{const e=txt(ts,w,xx,y2,F2,{anchor:'start',fill:NV,ls:'0em'});xx+=tw(w+' ',f2);return e});
   const F3=fit('your name.',W*.8,H*.3,600),f3=`600 ${F3}px ${FONT}`,x3=W/2-tw('your name.',f3)/2,y3=H*(P?.52:.58)+.34*F3;
   const w3=[txt(ts,'your',x3,y3,F3,{anchor:'start',fill:IV,ls:'0em'}),txt(ts,'name.',x3+tw('your ',f3),y3,F3,{anchor:'start',fill:PERI,st:'italic',ls:'0em'})];
   k.k5={box,tiles,w1,w2,w3,L2,F1,F2,F3}}
  // K7 the ending: an ivory frame with PARIS, LONDON, EUROPE cut out of it, the night city inside the letters; it splits open onto the logo
  {const Z=P?{cx:W*.5,cy:H*.36+W/2}:{cx:W/2,cy:H/2};k.k7=mkCover(svg,defs,'k7m',['PARIS','LONDON','EUROPE'],Z.cx,Z.cy,W,H,P,IV)}
  svg.appendChild(k.kd.g);   // the dial fades out over the navy of the next beat
  return k}

function apply(t){
  const f=document.getElementById('film');if(!f)return;const W=f.clientWidth,H=f.clientHeight,P=(typeof portrait!=='undefined'&&!!portrait);
  if(!document.fonts||!document.fonts.check(`600 100px "Instrument Sans"`))return;
  if(!K||K.W!==W||K.H!==H||K.P!==P){K=build(W,H,P)}
  const vis=(e,v)=>{e.style.visibility=v?'visible':'hidden'};
  // ---------- K0 ----------
  ['#fa1g','#fa1','#fa1s','#jw1'].forEach(q=>{const e=document.querySelector(q);if(e)e.style.visibility=t<SA('a2')+.5?'hidden':''});
  document.querySelectorAll('.ft1').forEach(e=>e.style.visibility=t<SA('a2')+.5?'hidden':'');
  {const a=K.k0,T=[C('your#1')-.06,C('lands')-.05,C('in#1')-.05],z0=C('tomorrow')-.12,z1=z0+.75,on=t<z1;vis(a.g,on);
   const pin=document.getElementById('pin1');if(pin)pin.style.visibility=t<SA('a2')+.5?'hidden':'';
   const fv=document.querySelector('#footB .fv'),tb1=document.querySelector('.tb[data-sc="a1"]');if(tb1)tb1.style.opacity=t<z0?0:'';
   if(on){const h=t<T[0]?H*(.012+.03*eo(t/.55)):0;a.slit.setAttribute('y',a.cy-h/2);a.slit.setAttribute('height',h);
     const e=runCover(a,t,T,z0,z1,H);if(fv)fv.style.opacity=(.1+.9*e).toFixed(3)}
   else if(fv&&fv.style.opacity!=='')fv.style.opacity=''}
  // ---------- KD ----------
  {const a=K.kd,t0=C('aircraft')-.34,tR=C('restaurant')-.12,tN=C('two')-.06,tx=C('thats')-.22,t1=C('thats')+.06;
   const on=win(t,t0,t1);vis(a.g,on);a.bs.style.visibility=on?'visible':'hidden';
   const tb=document.querySelector('.tb[data-sc="a3"]');
   if(on){const fin=eo((t-t0)/.45),dusk=ez((t-tR)/.55),night=ez((t-tN)/.4),out=ez((t-tx)/(t1-tx-.02));
     a.bs.style.opacity=fin.toFixed(3);a.c1.setAttribute('r',(a.RM*eo((t-tR+.04)/.8)).toFixed(1));a.c2.setAttribute('r',(a.RM*eo((t-tN+.03)/.7)).toFixed(1));a.bg3.setAttribute('opacity',(dusk*.8).toFixed(3));
     const ink=mixc('#141A33','#F4F2ED',dusk),dim=mixc('#141A33','#C7CEF0',dusk);
     a.ring.setAttribute('stroke',dim);a.ring.setAttribute('stroke-opacity',.28);a.ring.setAttribute('stroke-dashoffset',(1-eo((t-t0)/.9)).toFixed(4));
     a.tk.setAttribute('stroke',dim);a.tk.setAttribute('opacity',(.45*eo((t-t0-.2)/.6)).toFixed(3));
     const A0=115,A1=322.5,A2=390,ang=A0-55*(1-eo((t-t0)/.95))+(A1-A0)*exio((t-tR)/.85)+(A2-A1)*exio((t-tN)/.7);
     const pt=a2=>[a.cx+a.R*Math.sin(a2*Math.PI/180),a.cy-a.R*Math.cos(a2*Math.PI/180)],[jx,jy]=pt(ang);
     const st0=Math.min(A0,ang),p0=pt(st0);   // progress arc from 07:40 to nowa.arc.setAttribute('d',ang-st0>.5?`M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${a.R} ${a.R} 0 ${ang-st0>180?1:0} 1 ${jx.toFixed(1)} ${jy.toFixed(1)}`:'');
     a.arc.setAttribute('opacity',(fin*.9).toFixed(3));
     a.dot.setAttribute('cx',jx.toFixed(2));a.dot.setAttribute('cy',jy.toFixed(2));a.dot.setAttribute('opacity',fin.toFixed(3));
     // photo window: opens from the centre, then a clock hand sweeps each next moment in
     a.pc.setAttribute('r',(a.Rp*eo((t-t0-.05)/.6)).toFixed(1));
     const sw=[0,exio((t-tR+.06)/.8),exio((t-tN+.04)/.7)];let hv=0,ha=0;
     a.ims.forEach((im,i)=>{const ti=[t0,tR,tN][i],k=1.1-.1*eo((t-ti)/3.2),x=a.cx-a.IS*k/2,y=a.cy-a.IS*k/2;im.setAttribute('x',x.toFixed(1));im.setAttribute('y',y.toFixed(1));im.setAttribute('width',(a.IS*k).toFixed(1));im.setAttribute('height',(a.IS*k).toFixed(1));
       if(i&&im.__w){const th=sw[i]*360;if(th>0&&th<1){}
         if(th<=.01)im.__w.setAttribute('d','');else if(th>=359.9)im.__w.setAttribute('d',`M${a.cx-a.IS} ${a.cy-a.IS}h${2*a.IS}v${2*a.IS}h${-2*a.IS}z`);
         else{const r2=a.IS,e2=(th-90)*Math.PI/180,ex=a.cx+r2*Math.cos(e2),ey=a.cy+r2*Math.sin(e2);im.__w.setAttribute('d',`M${a.cx} ${a.cy}L${a.cx} ${a.cy-r2}A${r2} ${r2} 0 ${th>180?1:0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}Z`)}
         if(sw[i]>0&&sw[i]<1){hv=Math.sin(Math.PI*sw[i]);ha=th}}});
     a.hand.setAttribute('opacity',hv.toFixed(3));a.hand.setAttribute('transform',`rotate(${ha.toFixed(2)} ${a.cx} ${a.cy})`);
     // digits: the old one lifts away in 0.1 s, the new one settles from slightly larger, column by column
     a.dig.forEach((vs,i)=>{const TT=[t0+.08+i*.05,tR+i*.05,tN+i*.05],ui=eo5((t-TT[0])/.45),seg=[];
       vs.forEach((e,k)=>{if(k&&vs[k-1].textContent===e.textContent){seg[seg.length-1].k1=k;e.setAttribute('opacity',0);return}seg.push({e,k0:k,k1:k})});
       seg.forEach((sg,j)=>{const e=sg.e,tin=TT[sg.k0],tout=sg.k1<2?TT[sg.k1+1]:1e9;let o=0,sc=1,dy=0;
         if(t>=tin){if(j===0){o=ui;dy=(1-ui)*a.F*.25}else{const v=eo((t-tin-.1)/.3);o=v;sc=1.18-.18*v}
           if(t>=tout){const u=cl((t-tout)/.1);o*=1-u;dy-=u*a.F*.08}}
         const x=+e.getAttribute('x');e.setAttribute('fill',ink);e.setAttribute('opacity',o.toFixed(3));
         e.setAttribute('transform',`translate(${x} ${a.yb}) scale(${sc.toFixed(4)}) translate(${-x} ${-a.yb}) translate(0 ${dy.toFixed(2)})`)})});
     a.colon.setAttribute('opacity',(fin*(t-t0<1?1:.65+.35*Math.cos((t-t0-1)*Math.PI)**2)).toFixed(3));
     a.g.setAttribute('opacity',(1-out).toFixed(3));a.g.setAttribute('transform',`translate(${a.cx} ${a.cy}) scale(${(1-.06*out).toFixed(4)}) translate(${-a.cx} ${-a.cy})`);
     if(tb){tb.style.setProperty('--ink',ink);tb.classList.toggle('kxd',dusk>.5)}}
   else if(tb&&tb.classList.contains('kxd')){tb.style.removeProperty('--ink');tb.classList.remove('kxd')}}
  // ---------- K2 ----------
  {const a=K.k2,tA=C('thats')-.24,z0=CA('in',C('comes'))+.06,z1=z0+.58;const on=win(t,tA,z1);vis(a.g,on);a.bs.style.visibility=on?'visible':'hidden';
   if(on){const tw1=C('thats')-.04,tw2=C('where')-.04,tc=CA('city',C('where'))-.04,tco=C('comes')-.04,ti=CA('in',C('comes'))-.04,T=[tw1,tw2,tc];
     a.single.forEach((w,i)=>{const ti0=T[i],live=t>=ti0&&t<T[i+1],u=eo5((t-ti0)/.4),sc=1.3-.3*u,xf=k=>`translate(${W/2} ${a.cy}) scale(${k.toFixed(4)}) translate(${-W/2} ${-a.cy})`;
       w.e.setAttribute('opacity',live?cl((t-ti0)/.06):0);w.e.setAttribute('transform',xf(sc));
       w.ec.forEach((e,j)=>{const v=eo((t-ti0)/(.55+j*.2));e.setAttribute('opacity',live?(.5*(1-v)).toFixed(3):0);e.setAttribute('transform',xf(1.0+(.22+j*.2)*v))})});
     const glide=(e,t0,F)=>{const u=eo5((t-t0)/.5);e.setAttribute('transform',`translate(${((1-u)*F*.5).toFixed(2)} 0)`);e.setAttribute('opacity',u.toFixed(3))};
     glide(a.comes,tco,a.F4);glide(a.inn,ti,a.F4);a.ul.setAttribute('stroke-dashoffset',(1-eo((t-tco-.1)/.55)).toFixed(4));a.ul.setAttribute('opacity',t>tco+.1?.9:0);
     // zoom through the counter of the o
     const u=cl((t-z0)/(z1-z0)),s=Math.pow(110,u*u*(3-2*u)*.25+u*u*.75),m=ez(u);
     const [ox,oy]=a.oc,cx=ox+(W/2-ox)*m,cy=oy+(H/2-oy)*m;
     a.zg.setAttribute('transform',u>0?`translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-ox} ${-oy})`:'');
     const r=u>0?a.r0*s:0;a.hole.setAttribute('cx',cx);a.hole.setAttribute('cy',cy);a.hole.setAttribute('rx',r);a.hole.setAttribute('ry',r*1.04)}}
  // ---------- K3 ----------
  {const a=K.k3,tA=CA('were',C('partners'))-.2,tO=C('operator')-.06,tB=C('orbit')-.62,tE=C('orbit')-.06;const on=win(t,tA,tE+.3);vis(a.g,on);
   if(on){a.veil.setAttribute('opacity',(.8*eo((t-tA)/.3)*(1-ez((t-tE+.25)/.45))).toFixed(3));
     [CA('were',C('partners')),CA('an',C('partners'))].forEach((cw,i)=>{const u=eo5((t-(cw-.04))/.36),o=1-ez((t-tB)/.3);a.small[i].setAttribute('transform',`translate(0 ${((1-u)*a.F*.2).toFixed(2)})`);a.small[i].setAttribute('opacity',(t>=cw-.04?o:0).toFixed(3))});
     const xm=W/2;a.letters.forEach((e,i)=>{const ti=tO+i*.028,u=eo5((t-ti)/.55),tr=ex((t-tO)/.9);
       const x=lerp(xm+(a.xs[i]-xm)*1.22,a.xs[i],tr);let y=(1-u)*a.F*.95,o=t>=ti?1:0;
       if(i>0){const v=ez((t-(tB+(7-i)*.022))/.34);y-=v*a.F*.0;o*=1-v;y+=v*a.F*.5}
       if(i===0&&t>=tB)o=0;
       e.setAttribute('x',x.toFixed(2));e.setAttribute('transform',`translate(0 ${y.toFixed(2)})`);e.setAttribute('opacity',o)});
     // the o lifts out of the word and opens into the orbit ring
     if(t>=tB){let tgt=null;const pb=document.getElementById('cpb'),pf=document.getElementById('cpf'),fr=document.getElementById('film').getBoundingClientRect();
       if(pb&&pf){const r1=pb.getBoundingClientRect(),r2=pf.getBoundingClientRect();if(r1.width+r2.width>0){const L=Math.min(r1.left,r2.left),T=Math.min(r1.top,r2.top),R=Math.max(r1.right,r2.right),B=Math.max(r1.bottom,r2.bottom);tgt=[(L+R)/2-fr.left,(T+B)/2-fr.top,(R-L)/2,(B-T)/2]}}
       if(!tgt)tgt=[W*.66,H*.5,H*.3,H*.24];
       const u=exio((t-tB)/(tE-tB+.1)),r0=a.orad-a.ost/2;
       a.ring.setAttribute('cx',lerp(a.oc[0],tgt[0],u));a.ring.setAttribute('cy',lerp(a.oc[1],tgt[1],u));a.ring.setAttribute('rx',lerp(r0,tgt[2],u));a.ring.setAttribute('ry',lerp(r0,tgt[3],u));
       a.ring.setAttribute('stroke-width',lerp(a.ost,Math.max(2,H*.004),eo(u)));a.ring.setAttribute('opacity',(1-ez((t-tE-.02)/.28)).toFixed(3))}
     else a.ring.setAttribute('opacity',0)}}
  // ---------- K5 ----------
  {const a=K.k5,tW=C('white')-.52,tS=C('so')-.05,tY=CA('your',90.5)-.15,tO=SA('a11')-.15,tE=tO+.52;const on=win(t,tW,tE);a.box.style.display=on?'block':'none';
   const st=document.querySelector('.st[data-st="a10"]');if(st)st.style.visibility=win(t,SA('a10')-.2,SA('a11')+1.4)?'hidden':'';
   if(on){a.tiles.forEach(tl=>{const p1=cl((t-tW-tl.dl)/.24),p2=cl((t-tY-tl.dl)/.24),p3=cl((t-tO-tl.dl)/.24);let from=null,to='#F4F2ED',p=p1;
       if(p3>0){from='#141A33';to=null;p=p3}else if(p2>0){from='#F4F2ED';to='#141A33';p=p2}
       const c=p<.5?from:to;tl.d.style.opacity=c?1:0;if(c)tl.d.style.background=c;tl.d.style.transform=`scaleX(${Math.max(.02,Math.abs(Math.cos(p*Math.PI))).toFixed(3)})`});
     const pop=(e,t0,t1,cx,cy)=>{const live=t>=t0&&t<t1,u=eo5((t-t0)/.5),k=1.14-.14*u;e.setAttribute('opacity',live?cl((t-t0)/.08).toFixed(3):0);const x=+e.getAttribute('x'),y=+e.getAttribute('y');e.setAttribute('transform',`translate(${x} ${y}) scale(${k.toFixed(4)}) translate(${-x} ${-y})`)};
     pop(a.w1[0],C('white')+.04,tS);pop(a.w1[1],C('label')-.03,tS);
     ['so','your#'+nth('your',C('so')),'client#'+nth('client',C('so')),'only','ever','sees'].forEach((w,i)=>pop(a.w2[i],C(w)-.03,tY+.12));
     const fo=1-ez((t-tO)/.3);[[a.w3[0],CA('your',90.5)-.03],[a.w3[1],C('name')-.03]].forEach(([e,t0])=>{pop(e,t0,tE);if(t>=t0)e.setAttribute('opacity',(cl((t-t0)/.08)*fo).toFixed(3))})}}
  // ---------- K6 ----------
  {const a=K.k6,tA=C('since')-.1,tE=C('luxury')-.36;const on=win(t,tA,tE+.4);vis(a.g,on);
   if(on){const out=ez((t-tE)/.3);a.g.setAttribute('opacity',(1-out).toFixed(3));a.g.setAttribute('transform',`translate(0 ${(-out*H*.06).toFixed(2)})`);
     const u=eo5((t-tA)/.4);a.lab.setAttribute('transform',`translate(0 ${((1-u)*a.F*.25).toFixed(2)})`);a.lab.setAttribute('opacity',t>=tA?1:0);
     a.strips.forEach((s,i)=>{const t0=tA+.06,d=.5+i*.08,v=ez((t-t0)/d)*.15+eo((t-t0)/d)*.85;s.setAttribute('transform',`translate(0 ${((1-v)*a.roll[i]*a.F*1.02).toFixed(2)})`)});
     const w=eo((t-(tA+.55))/.3);a.ul.setAttribute('stroke-dashoffset',(1-w).toFixed(4));a.ul.setAttribute('opacity',w>0?1:0)}}
  // ---------- K7 ----------
  {const a=K.k7,T=[CA('paris',95)-.05,CA('london',95)-.05,CA('europe',95)-.05],z0=T[2]+.55,z1=z0+.8;const on=win(t,T[0],z1);vis(a.g,on);
   {const hide=win(t,T[0]-.02,z0),co=document.getElementById('ctaOv'),tb=document.querySelector('.tb[data-sc="a12"]'),fv=document.querySelector('#footT .fv');
    if(co)co.style.visibility=hide?'hidden':'';if(tb)tb.style.visibility=hide?'hidden':'';if(fv)fv.style.opacity=on?(t<z0?.2:.2+.8*cl((t-z0)/(z1-z0))).toFixed(3):'';}
   if(on)runCover(a,t,T,z0,z1,H)}
  // ---------- K8 ----------
  {const a=K.k8,tD=C('sometimes')+.05,tQ=C('something')-.25,tF=C('truly')-.05,tG=C('unusual')-.05,tO=CA('every',80)-.42,tE=tO+.4;const on=win(t,tD,tE);vis(a.g,on);
   ['q9x','ms9x'].forEach(id=>{const e=document.getElementById(id);if(e)e.style.visibility='hidden'});
   if(on){const out=ez((t-tO)/(tE-tO)),dr=ez((t-tQ)/1.15),fl=ez((t-tF)/.7),k=(1+.05*cl((t-tQ)/2.4))*(1+.08*out),Z=a.Z;
     a.g.setAttribute('opacity',(1-out).toFixed(3));a.zg.setAttribute('transform',`translate(${Z.cx} ${Z.cy}) scale(${k.toFixed(4)}) translate(${-Z.cx} ${-Z.cy})`);
     a.halo.setAttribute('opacity',(.25*eo((t-tD)/.8)+.45*fl).toFixed(3));
     a.dot.setAttribute('opacity',(eo((t-tD)/.5)*(1-cl(dr*2.5))*(.75+.25*Math.sin((t-tD)*5))).toFixed(3));a.dot.setAttribute('r',(a.F*.05*(.6+.4*eo((t-tD)/.6))).toFixed(2));
     a.line.setAttribute('stroke-dasharray',`${a.L} ${a.L}`);a.line.setAttribute('stroke-dashoffset',(a.L*(1-dr)).toFixed(1));a.line.setAttribute('opacity',t>=tQ?(1-.5*fl).toFixed(3):0);
     a.fill.setAttribute('opacity',fl.toFixed(3));
     const g=cl((t-tG)/.9);a.sh.setAttribute('transform',`translate(${(Z.cx-a.F*.5+a.F*g).toFixed(1)} 0) skewX(-18)`);a.sh.setAttribute('opacity',(g>0&&g<1?1:0))}}
  // ---------- K9 ----------
  {const a=K.k9,t0=CA('every',80)-.12,tB=t0+.62,tC=tB+.58,tO=SA('a10')-.36,tE=tO+.3;const on=win(t,t0,tE);vis(a.g,on);
   if(on){const Z=a.Z,m1=exio((t-tB)/.5),m2=exio((t-tC)/.5),S=a.S,fin=eo((t-t0)/.55),out=ez((t-tO)/(tE-t0>0?tE-tO:1));
     const w=Z.s*(S[0][0]+(S[1][0]-S[0][0])*m1+(S[2][0]-S[1][0])*m2)*(.7+.3*fin),h=Z.s*(S[0][1]+(S[1][1]-S[0][1])*m1+(S[2][1]-S[1][1])*m2)*(.7+.3*fin);
     const x0=Z.cx-w/2,y0=Z.cy-h/2,x1=x0+w,y1=y0+h,c=Z.s*.07,o=Z.s*.03,d=Z.s*.075,e=Z.s*.018;
     a.cr.setAttribute('x',x0);a.cr.setAttribute('y',y0);a.cr.setAttribute('width',w);a.cr.setAttribute('height',h);
     a.ims.forEach((im,i)=>im.setAttribute('opacity',[1,m1,m2][i].toFixed(3)));
     a.br.setAttribute('d',`M${x0-o} ${y0-o+c}V${y0-o}H${x0-o+c}M${x1+o-c} ${y0-o}H${x1+o}V${y0-o+c}M${x1+o} ${y1+o-c}V${y1+o}H${x1+o-c}M${x0-o+c} ${y1+o}H${x0-o}V${y1+o-c}`);
     a.dm.setAttribute('d',`M${x0} ${y0-d}H${x1}M${x0} ${y0-d-e}V${y0-d+e}M${x1} ${y0-d-e}V${y0-d+e}M${x0-d} ${y0}V${y1}M${x0-d-e} ${y0}H${x0-d+e}M${x0-d-e} ${y1}H${x0-d+e}`);
     a.lab.forEach((l,i)=>{const v=[1-m1,m1*(1-m2),m2][i];l.setAttribute('y',(y1+d+a.fs).toFixed(1));l.setAttribute('opacity',v.toFixed(3))});
     a.g.setAttribute('opacity',(fin*(1-out)).toFixed(3));a.g.setAttribute('transform',`translate(${(-out*W*.05).toFixed(1)} 0)`)}}
  // hide the plain text chunks these set pieces replace
  if(typeof CHUNKS!=='undefined'){if(!K.hid){K.hid={op:CHUNKS.filter(c=>c.sc==='a5'),yr:CHUNKS.filter(c=>c.words.some(w=>w.el.textContent.startsWith('2010')))}}
    const h3=win(t,CA('were',C('partners'))-.25,C('orbit')-.16);K.hid.op.forEach(c=>c.el.style.visibility=h3?'hidden':'');
    const h6=win(t,C('since')-.5,C('luxury')-.08);K.hid.yr.forEach(c=>c.el.style.visibility=h6?'hidden':'')}
}
window.KX=apply;
})();
