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
const CA=(w,after)=>{for(const x of WORDS)if(x.n===w&&x.a>=after-.01)return x.a;return 0};   // first cue of a word at or after a time
const IV='#F4F2ED',NV='#141A33',N2='#1B2140',N3='#2B3150',PERI='#9FB0FF';
const FONT='"Instrument Sans","Helvetica Neue",Arial,sans-serif';
let K=null;
function mk(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
function hx(tag,cls,par){const e=document.createElement(tag);if(cls)e.className=cls;if(par)par.appendChild(e);return e}
const cv=document.createElement('canvas').getContext('2d');
function gm(ch,font){cv.font=font;const m=cv.measureText(ch);return{w:m.width,asc:m.actualBoundingBoxAscent,des:m.actualBoundingBoxDescent,l:m.actualBoundingBoxLeft,r:m.actualBoundingBoxRight}}
const tw=(s,font)=>{cv.font=font;return cv.measureText(s).width};
function txt(par,s,x,y,size,o={}){const e=mk('text',{x,y,'font-size':size,'font-weight':o.w||600,fill:o.fill||IV,'text-anchor':o.anchor||'middle',style:`font-family:${FONT};letter-spacing:${o.ls||'-.02em'};font-variant-numeric:tabular-nums${o.st?';font-style:'+o.st:''}`},par);e.textContent=s;return e}

function build(W,H,P){
  const host=document.getElementById('kx');host.innerHTML='';
  const svg=mk('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`,style:'position:absolute;inset:0;overflow:visible'},host);
  const defs=mk('defs',{},svg);
  const M=Math.min(W,H),k={svg,W,H,P};
  // K0 the opening flight: a real Global 5000 glides across the dawn sky and away towards the Eiffel Tower
  {const g=mk('g',{},svg),jw=891,jh=313,im=mk('image',{href:window.JETH||'',x:-jw/2,y:-jh/2,width:jw,height:jh},g);k.k0={g,im,jw}}
  // K1 two in the morning: a hard cut on "two" to the night, the clock lands and ticks from 1:59 to 2:00
  {const g=mk('g',{},svg),F=P?W*.36:H*.46,fnt=`600 ${F}px ${FONT}`;
   const d=tw('0',fnt),cw=tw(':',fnt)*1.05,tot=3*d+cw,x0=W/2-tot/2,cy=P?H*.44:H*.44,yb=cy+.36*F;
   const gr=mk('radialGradient',{id:'k1g',cx:'50%',cy:'38%',r:'62%'},defs);mk('stop',{offset:0,'stop-color':'#3A4686','stop-opacity':.85},gr);mk('stop',{offset:.55,'stop-color':'#1B2140','stop-opacity':.4},gr);mk('stop',{offset:1,'stop-color':'#0B0F1E','stop-opacity':0},gr);
   const bg=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:NV},g);mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:'url(#k1g)'},g);
   const body=mk('g',{},g);const seq=[['1','2'],['5','0'],['9','0']],xs=[x0,x0+d+cw,x0+2*d+cw];
   const cols=seq.map((q,i)=>q.map(c=>txt(body,c,xs[i]+d/2,yb,F,{fill:IV})));
   const colon=txt(body,':',x0+d+cw/2,yb-.04*F,F,{fill:PERI});
   const f2=P?W*.075:H*.085,y2=P?cy+.66*F:H*.84;const words=['in','the','morning.'],ws=words.map(w=>tw(w,`500 ${f2}px ${FONT}`)),sp=f2*.26,tl=ws.reduce((a,b)=>a+b,0)+sp*2;
   let xx=W/2-tl/2;const wl=words.map((w,i)=>{const e=txt(body,w,xx,y2,f2,{w:500,fill:'#C7CEF0',anchor:'start',ls:'-.01em'});e.dataset.x=xx;xx+=ws[i]+sp;return e});
   k.k1={g,bg,body,cols,colon,F,wl,f2,cx:W/2,cy}}
  const k1g=k.k1.g;
  // K2 That's where City Premium comes in, word by word, then the camera dives through the o of "comes"
  {const g=mk('g',{},svg);const mask=mk('mask',{id:'k2h',maskUnits:'userSpaceOnUse',x:-W,y:-H,width:3*W,height:3*H},defs);
   mk('rect',{x:-W,y:-H,width:3*W,height:3*H,fill:'#fff'},mask);const hole=mk('ellipse',{cx:0,cy:0,rx:0,ry:0,fill:'#000'},mask);
   const bg=mk('rect',{x:-2,y:-2,width:W+4,height:H+4,fill:NV,mask:'url(#k2h)'},g);
   const zg=mk('g',{},g);const F1=P?W*.15:H*.15,F3=P?W*.13:H*.165,F4=F3*.56;
   const cy=H*(P?.46:.47);
   const cpA=mk('clipPath',{id:'k2a'},defs);mk('rect',{x:0,y:cy-F1*.95,width:W,height:F1*1.25},cpA);
   const sg=mk('g',{'clip-path':'url(#k2a)'},zg);const single=['That’s','where'].map(s=>txt(sg,s,W/2,cy+.35*F1,F1));
   const yA=cy+.1*F3,f3=`600 ${F3}px ${FONT}`,wc=tw('City',f3),wp=tw('Premium',f3),sp=F3*.24,L=wc+sp+wp;
   const cpB=mk('clipPath',{id:'k2b'},defs);mk('rect',{x:0,y:yA-F3*.95,width:W,height:F3*1.2},cpB);const bgp=mk('g',{'clip-path':'url(#k2b)'},zg);
   const city=txt(bgp,'City',W/2-L/2,yA,F3,{anchor:'start',ls:'-.03em'}),prem=txt(bgp,'Premium',W/2-L/2+wc+sp,yA,F3,{anchor:'start',ls:'-.03em'});
   const yC=yA+F4*1.25,f4=`500 ${F4}px ${FONT}`,wco=tw('comes',f4),wi=tw('in.',f4),sp4=F4*.26,L4=wco+sp4+wi,xc=W/2-L4/2;
   const cpC=mk('clipPath',{id:'k2c'},defs);mk('rect',{x:-W*40,y:yC-F4*1.1,width:W*80,height:F4*1.45},cpC);const cg=mk('g',{'clip-path':'url(#k2c)'},zg);
   const comes=txt(cg,'comes',xc,yC,F4,{w:500,fill:PERI,anchor:'start',ls:'0em'}),inn=txt(cg,'in.',xc+wco+sp4,yC,F4,{w:500,fill:PERI,anchor:'start',ls:'0em'});
   // the o: second glyph of "comes"; its counter is the window into the next scene
   const om=gm('o',f4),oc=[xc+tw('c',f4)+(om.r-om.l)/2,yC-om.asc/2],r0=Math.min(om.r+om.l,om.asc)/2*.52;
   k.k2={g,bg,hole,zg,single,city,prem,comes,inn,oc,r0,F1,F3,F4,yA}}
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
  // K5 white label: an arrivals name board, City Premium flips to blank white, then to your name
  {const n=12,tw_=P?W*.066:W*.037,th=tw_*1.42,gap=tw_*.12,bw=n*tw_+(n-1)*gap,cx=P?W/2:W*.705,cy=P?H*.6:H*.5;
   const b=hx('div','kxb',host);Object.assign(b.style,{left:(cx-bw/2-tw_*.35)+'px',top:(cy-th/2-tw_*.35)+'px',width:(bw+tw_*.7)+'px',height:(th+tw_*.7)+'px',padding:(tw_*.35)+'px',gap:gap+'px',fontSize:(th*.62)+'px'});
   const tiles=[];for(let i=0;i<n;i++){const t=hx('div','kxt',b);Object.assign(t.style,{width:tw_+'px',height:th+'px'});
     const mkh=(c)=>{const h=hx('div','kh '+c,t);const s=hx('span','',h);Object.assign(s.style,{height:th+'px',lineHeight:th+'px'});return h};
     const tile={el:t,top:mkh('top'),bot:mkh('bot'),ft:mkh('kft'),fb:mkh('kfb'),st:null};tiles.push(tile)}
   k.k5={b,tiles,bw,tw_}}
  svg.appendChild(k1g);   // the clock sits above the navy of K2 while it slides away
  return k}

// split-flap state machine: each tile has a list of states {t,ch,iv}; a flip from one to the next takes FD seconds
const FD=.13,SCR='BCDFGHJKLMNPQRSTVWXZ';
const hh=n=>{const x=Math.sin(n*91.7+7.3)*43758.5453;return x-Math.floor(x)};
function plan(){const n=12,A='CITY PREMIUM'.padEnd(n),B='YOUR AGENCY'.padEnd(n),T=Array.from({length:n},()=>[{t:-1,ch:' ',iv:0}]);
  const flipTo=(i,t0,ch,iv,scr)=>{let t=t0;for(let s=0;s<scr;s++){T[i].push({t,ch:SCR[Math.floor(hh(i*7+s*13+t0)*SCR.length)],iv:T[i][T[i].length-1].iv});t+=FD*.95}T[i].push({t,ch,iv})};
  const t1=C('everything#2')-.1,t2=C('white')-.04,t3=C('only')-.04;
  for(let i=0;i<n;i++){T[i][0].ch=A[i];flipTo(i,t2+i*.03,' ',1,0);flipTo(i,t3+i*.032,B[i],1,B[i]===' '?0:1+Math.floor(hh(i+5)*2))}
  return T}
let FLIP=null;
function tileAt(T,t){let k=0;while(k+1<T.length&&T[k+1].t<=t)k++;const cur=T[k],prv=T[k-1]||cur;const u=k>0?cl((t-cur.t)/FD):1;return{prv,cur,u}}
function face(h,s,top){h.firstChild.textContent=s.ch;h.style.background=s.iv?'#F4F2ED':'#2A3157';h.style.color=s.iv?'#141A33':'#F4F2ED'}

function apply(t){
  const f=document.getElementById('film');if(!f)return;const W=f.clientWidth,H=f.clientHeight,P=(typeof portrait!=='undefined'&&!!portrait);
  if(!document.fonts||!document.fonts.check(`600 100px "Instrument Sans"`))return;
  if(!K||K.W!==W||K.H!==H||K.P!==P){K=build(W,H,P);FLIP=null}
  const vis=(e,v)=>{e.style.visibility=v?'visible':'hidden'};
  // ---------- K0 ----------
  {const a=K.k0,t0=.18,t1=C('paris#1')+.55;const on=win(t,t0,t1);vis(a.g,on);
   ['#fa1g','#fa1','#fa1s','#jw1'].forEach(q=>{const e=document.querySelector(q);if(e)e.style.visibility=t<SA('a2')+.5?'hidden':''});
   document.querySelectorAll('.ft1').forEach(e=>e.style.visibility=t<SA('a2')+.5?'hidden':'');
   if(on){const u=cl((t-t0)/(t1-t0)),e=u*u*(3-2*u)*.4+u*.6;
     // a gentle descending curve, from big and close at top left to a speck over the city
     const A=P?[-.3*W,H*.33]:[-.18*W,H*.16],B=P?[.6*W,H*.36+W*.38]:[.6*W,H*.4],Cc=P?[.25*W,H*.32]:[.3*W,H*.16];
     const x=(1-e)*(1-e)*A[0]+2*(1-e)*e*Cc[0]+e*e*B[0],y=(1-e)*(1-e)*A[1]+2*(1-e)*e*Cc[1]+e*e*B[1];
     const w0=P?.5*W:.3*W,w1=P?.07*W:.05*W,sc=Math.exp(Math.log(w0)+(Math.log(w1)-Math.log(w0))*e)/a.jw;
     const rot=lerp(-6,4,ez(u)),op=cl(u/.04)*(1-ez((u-.84)/.16));
     a.g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${sc.toFixed(4)})`);a.g.setAttribute('opacity',op.toFixed(3))}}
  // ---------- K1 ----------
  {const a=K.k1,t0=C('two')-.06,tx=C('thats')-.22,t1=tx+.26;
   const on=win(t,t0,t1);vis(a.g,on);
   if(on){const land=eo5((t-t0)/.7),out=ez((t-tx)/(t1-tx)),sc=(1.07-.07*land)*(1-.08*out);
     a.body.setAttribute('transform',`translate(${a.cx} ${a.cy}) scale(${sc.toFixed(4)}) translate(${-a.cx} ${-a.cy})`);a.body.setAttribute('opacity',(1-out).toFixed(3));
     a.cols.forEach(([o,n],i)=>{const ti=t0+.2+i*.05,u=cl((t-ti)/.1),v=eo((t-ti-.1)/.3);o.setAttribute('transform',`translate(0 ${(-u*a.F*.08).toFixed(2)})`);o.setAttribute('opacity',(1-u).toFixed(3));
       const nx=+n.getAttribute('x'),ny=a.cy,k=1.18-.18*v;n.setAttribute('transform',`translate(${nx} ${ny}) scale(${k.toFixed(4)}) translate(${-nx} ${-ny})`);n.setAttribute('opacity',v.toFixed(3))});
     a.colon.setAttribute('opacity',(t-t0)<.7?1:(.6+.4*Math.cos((t-t0-.7)*Math.PI*2)**2).toFixed(3));
     [CA('in',C('two')),CA('the',C('two')),C('morning')].forEach((cw,i)=>{const u=eo((t-(cw-.05))/.6);a.wl[i].setAttribute('transform',`translate(${((1-u)*a.f2*.42).toFixed(2)} 0)`);a.wl[i].setAttribute('opacity',u.toFixed(3))})}}
  // ---------- K2 ----------
  {const a=K.k2,tA=C('thats')-.24,z0=CA('in',C('comes'))+.06,z1=z0+.58;const on=win(t,tA,z1);vis(a.g,on);
   const lo=document.getElementById('logoOv');if(lo)lo.style.visibility=win(t,tA-.1,z1+.1)?'hidden':'';
   if(on){const rise=(e,ti,dur,F)=>{const u=eo5((t-ti)/dur);e.setAttribute('transform',`translate(0 ${((1-u)*F*1.05).toFixed(2)})`);e.setAttribute('opacity',t>=ti?1:0)};
     const leave=(e,ti)=>{if(t>=ti)e.setAttribute('opacity',0)};   // hard cut between single words, as in the reference
     const tw1=C('thats')-.04,tw2=C('where')-.04,tc=CA('city',C('where'))-.04,tp=CA('premium',C('where'))-.04,tco=C('comes')-.04,ti=CA('in',C('comes'))-.04;
     rise(a.single[0],tw1,.3,a.F1);leave(a.single[0],tw2);
     rise(a.single[1],tw2,.24,a.F1);leave(a.single[1],tc);
     rise(a.city,tc,.4,a.F3);rise(a.prem,tp,.4,a.F3);rise(a.comes,tco,.36,a.F4);rise(a.inn,ti,.3,a.F4);
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
  {const a=K.k5,tA=C('everything#2')+.12,tE=SA('a11')-.12;const on=win(t,tA,tE+.42);a.b.style.visibility=on?'visible':'hidden';a.b.style.display=on?'flex':'none';
   const st=document.querySelector('.st[data-st="a10"]');if(st)st.style.visibility=win(t,SA('a10')-.2,SA('a11')+1.4)?'hidden':'';
   if(on){if(!FLIP)FLIP=plan();const ui=eo((t-tA)/.5),uo=ez((t-tE)/.42);
     a.b.style.opacity=(ui*(1-uo)).toFixed(3);a.b.style.transform=`translate(${(-uo*W*.35).toFixed(1)}px,${((1-ui)*H*.04).toFixed(1)}px)`;
     a.tiles.forEach((tl,i)=>{const {prv,cur,u}=tileAt(FLIP[i],t);
       // static halves: top shows the new face, bottom the old one until the flap lands
       face(tl.top,cur);face(tl.bot,u>=.5?cur:prv);
       const fl=u>0&&u<1;tl.ft.style.visibility=fl&&u<.5?'visible':'hidden';tl.fb.style.visibility=fl&&u>=.5?'visible':'hidden';
       if(fl){face(tl.ft,prv);face(tl.fb,cur);const e=ez(u);tl.ft.style.transform=`rotateX(${(-e*180).toFixed(1)}deg)`;tl.fb.style.transform=`rotateX(${(180-e*180).toFixed(1)}deg)`}})}}
  // ---------- K6 ----------
  {const a=K.k6,tA=C('since')-.1,tE=C('luxury')-.36;const on=win(t,tA,tE+.4);vis(a.g,on);
   if(on){const out=ez((t-tE)/.3);a.g.setAttribute('opacity',(1-out).toFixed(3));a.g.setAttribute('transform',`translate(0 ${(-out*H*.06).toFixed(2)})`);
     const u=eo5((t-tA)/.4);a.lab.setAttribute('transform',`translate(0 ${((1-u)*a.F*.25).toFixed(2)})`);a.lab.setAttribute('opacity',t>=tA?1:0);
     a.strips.forEach((s,i)=>{const t0=tA+.06,d=.5+i*.08,v=ez((t-t0)/d)*.15+eo((t-t0)/d)*.85;s.setAttribute('transform',`translate(0 ${((1-v)*a.roll[i]*a.F*1.02).toFixed(2)})`)});
     const w=eo((t-(tA+.55))/.3);a.ul.setAttribute('stroke-dashoffset',(1-w).toFixed(4));a.ul.setAttribute('opacity',w>0?1:0)}}
  // hide the plain text chunks these set pieces replace
  if(typeof CHUNKS!=='undefined'){if(!K.hid){K.hid={op:CHUNKS.filter(c=>c.sc==='a5'),yr:CHUNKS.filter(c=>c.words.some(w=>w.el.textContent.startsWith('2010')))}}
    const h3=win(t,CA('were',C('partners'))-.25,C('orbit')-.16);K.hid.op.forEach(c=>c.el.style.visibility=h3?'hidden':'');
    const h6=win(t,C('since')-.5,C('luxury')-.08);K.hid.yr.forEach(c=>c.el.style.visibility=h6?'hidden':'')}
}
window.KX=apply;
})();
