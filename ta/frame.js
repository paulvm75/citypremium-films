try{if(window.PLANE3D)PLANE3D.init(document.getElementById('pl3d'),1800,900)}catch(e){console.warn('3d',e)}
const MZ={s:3.2,cx:345,cy:445,a:0};const PL={x:-175,door:0,cx:14};const TK={x:0,y:0,s:0,o:0,r:0};const FC={m:75};let PLk='';const FT={v:0};const ORB={d:0,p:0,n1:-55,n2:150};const SAT0=[-74,36,206],SAT1=[-42,66,238];const PO=(r,a)=>[500+r*Math.cos(a*Math.PI/180),500+r*Math.sin(a*Math.PI/180)];const ARC=['NCE','GVA','MUC','FCO','MAD','LIS','ATH','CPH'];const AP={"GVA": [477, 603], "FCO": [638, 765], "MAD": [223, 811], "BCN": [371, 782], "MUC": [625, 521], "ZRH": [541, 556], "AMS": [441, 359], "BRU": [434, 418], "IBZ": [353, 865], "OLB": [566, 796], "LIS": [77, 869], "VIE": [751, 531], "ATH": [944, 896], "CPH": [648, 211], "JMK": [981, 913], "LBG": [381, 497], "CDG": [383, 495], "FAB": [296, 402], "BQH": [318, 400], "LTN": [307, 377], "LHR": [305, 394], "NCE": [506, 698], "MXP": [545, 626], "PAR": [378, 501], "LON": [313, 393]};
const CH8={LBG:['Le Bourget',-50,80],FAB:['Farnborough',-12,-85],BQH:['Biggin Hill',50,-85]};
const DL={NCE:['Nice',16,40,'start'],GVA:['Geneva',-18,-14,'end'],MUC:['Munich',18,-12,'start'],FCO:['Rome',18,10,'start'],MAD:['Madrid',-18,10,'end'],LIS:['Lisbon',18,-16,'start'],ATH:['Athens',-18,-16,'end'],CPH:['Copenhagen',18,8,'start']};
(()=>{let d='',c='',a='',p='',gr='';
  // private terminals: one precise marker each, a leader line and a typographic tag (code, then name); no halos
  for(const k of ['LBG','FAB','BQH'])d+=`<g class="pin8" data-k="${k}"><g class="pi"><circle r="15" fill="none" stroke="#9FB0FF" stroke-width="2.5"/><circle r="6.5" fill="#F4F2ED"/></g></g>`;
  for(const k in CH8){const [l,dx,dy]=CH8[k];const w=l.length*17.5+150;c+=`<g class="c8" data-k="${k}"><g><line x1="${dx>0?15:-15}" y1="0" x2="${dx}" y2="${dy}" stroke="rgba(199,206,240,.55)" stroke-width="1.6"/><g transform="translate(${dx} ${dy})"><rect x="${dx>0?0:-w}" y="-31" width="${w}" height="62" rx="14" fill="rgba(20,26,51,.94)" stroke="rgba(199,206,240,.45)" stroke-width="1.5"/><text x="${(dx>0?0:-w)+24}" y="11" font-weight="700" font-size="31" fill="#9FB0FF" letter-spacing="1.5">${k}</text><text x="${(dx>0?0:-w)+104}" y="11" font-weight="600" font-size="31" fill="#F4F2ED">${l}</text></g></g></g>`}
  // destinations: a small dot and a plain label, no pills, no plane icons
  for(const k in DL){const [l,dx,dy,an]=DL[k];c+=`<g class="dl8" data-k="${k}"><g><g transform="translate(${dx} ${dy})"><text text-anchor="${an}" font-weight="600" font-size="27" fill="#EEF0F6" letter-spacing=".3">${l}</text></g></g></g>`}
  for(const k of ARC)d+=`<g class="de8" data-k="${k}"><circle r="11" fill="none" stroke="rgba(199,206,240,.45)" stroke-width="1.5"/><circle class="dr" r="5.5" fill="#F4F2ED"/></g>`;
  for(const k of ['PAR','LON'])d+=`<g class="hub8" data-k="${k}"><circle r="20" fill="none" stroke="#9FB0FF" stroke-width="2.5"/><circle r="9" fill="#FFFFFF"/></g>`;
  ARC.forEach((k,i)=>{gr+=`<linearGradient id="ag${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9FB0FF" stop-opacity=".1"/><stop offset=".7" stop-color="#C7CEF0" stop-opacity=".75"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>`;a+=`<path pathLength="1" stroke-dasharray="1 1" stroke="url(#ag${i})"/>`});
  $('#dots8').innerHTML=d;$('#arcs8').innerHTML=`<defs>${gr}</defs>`+a;$('#aps8').innerHTML=p;$('#chips8').innerHTML=c})();
const T3={t:0,sp:0},RG={r1:0,r2:0},HLT={d:0,v:0},BS={a:-90,h:0,s:0,tw:0,dr:0,o:0},GAPA=[-100,15,120],P3=1700;
const pj=(r,a,h=0)=>{const th=T3.t*Math.PI/180,ar=(a+T3.sp)*Math.PI/180,x=r*Math.cos(ar),y0=r*Math.sin(ar),z=y0*Math.sin(th)+h*Math.cos(th),s=P3/(P3-z);return [500+x*s,500+(y0*Math.cos(th)-h*Math.sin(th))*s,z,s]};
function ring(r,a0,p){if(p<=0.0005)return ['',''];let b='',f='',cur=null,run='';const n=Math.max(2,Math.ceil(180*p));
  for(let i=0;i<=n;i++){const q=pj(r,a0+360*p*i/n),sd=q[2]<-0.05?'b':'f',pt=q[0].toFixed(1)+' '+q[1].toFixed(1);
    if(sd!==cur){if(cur){run+=' L'+pt;if(cur==='b')b+=run;else f+=run}run='M'+pt;cur=sd}else run+=' L'+pt}
  if(cur==='b')b+=run;else f+=run;return [b,f]}
function orbitF(t){
  [['r1',200,-90,RG.r1],['r2',300,90,RG.r2],['cp',420,-90,ORB.d]].forEach(([k,r,a0,p])=>{const [b,f]=ring(r,a0,p);$('#'+k+'b').setAttribute('d',b);$('#'+k+'f').setAttribute('d',f)});
  const ti=Math.sin(T3.t*Math.PI/180);['#r1b','#r2b','#cpb'].forEach(id=>$(id).style.opacity=(1-ti*.45).toFixed(3));
  $('#cpOrbG').setAttribute('d',ring(420,0,1).join(' '));
  [['gd1',540],['gd2',660]].forEach(([k,r])=>{const e=$('#'+k);if(ti>.01){e.setAttribute('d',ring(r,0,1).join(' '));e.style.opacity=(ti*.55).toFixed(3)}else e.style.opacity=0});
  const L=[],put=(id,r,a,h=0,sx=1,sy=1)=>{const q=pj(r,a,h),el=$(id);el.setAttribute('transform',`translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) scale(${(q[3]*sx).toFixed(4)} ${(q[3]*sy).toFixed(4)})`);el.style.opacity=Math.min(1,1-(1-q[3])*1.3).toFixed(3);el.style.filter=q[3]<.985?`blur(${((1-q[3])*11).toFixed(2)}px)`:'none';L.push([q[2],el])};
  const stem=(id,r,a,h)=>{const e=$(id);if(h<2||T3.t<1){e.style.opacity=0;return}const p0=pj(r,a,0),p1=pj(r,a,h);e.setAttribute('d',`M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`);e.style.opacity=Math.min(.8,h/40).toFixed(2)};
  put('#dmcC',200,ORB.n1,HLT.d);put('#virC',300,ORB.n2,HLT.v);stem('#stD',200,ORB.n1,HLT.d);stem('#stV',300,ORB.n2,HLT.v);
  GAPA.forEach((a,i)=>put('#gw'+i,410,a));
  [1,2].forEach(i=>put('#sat'+i,420,SAT0[i]+(SAT1[i]-SAT0[i])*ORB.p));
  {const c=Math.cos(BS.tw*Math.PI/180),ac=Math.max(.05,Math.abs(c)),b=$('#boss');b.style.display=BS.o>0?'':'none';
   if(BS.o>0){const ba=BS.a+BS.dr,bh=BS.h;put('#boss',420,ba,bh,BS.s*ac,BS.s);b.style.opacity=(BS.o*+b.style.opacity).toFixed(3);$('#bossSh').setAttribute('opacity',((1-ac)*.5).toFixed(3));stem('#stB',420,ba,bh)}else $('#stB').style.opacity=0}
  {const hz=pj(950,-90),dy=hz[1],w=$('#dawnW');w.setAttribute('opacity',(ti*1.05).toFixed(3));
   ['#dawnE','#dawnS'].forEach(id=>$(id).setAttribute('cy',(dy+40).toFixed(1)));$('#dawnR').setAttribute('transform',`translate(500 ${(dy+60).toFixed(1)}) rotate(${(T3.sp*.35).toFixed(2)})`);
   const f=$('#flare');if(BS.o>0&&BS.h>1){const q=pj(420,BS.a+BS.dr,BS.h);f.setAttribute('cx',q[0].toFixed(1));f.setAttribute('cy',q[1].toFixed(1));f.setAttribute('opacity',(BS.o*Math.min(1,BS.h/120)*.8).toFixed(3))}else f.setAttribute('opacity',0)}
  const o=$('#o3d');L.sort((a,b)=>a[0]-b[0]);
  L.forEach(x=>{if(x[0]<-0.05)o.appendChild(x[1])});o.appendChild($('#coreW'));['#r1f','#r2f','#cpf','#stD','#stV','#stB'].forEach(id=>o.appendChild($(id)));L.forEach(x=>{if(x[0]>=-0.05)o.appendChild(x[1])})}
function fxF(t){const w=$('#world');if(MB.v>9){$('#mbB').setAttribute('stdDeviation',`${(MB.v*0).toFixed(2)} ${(MB.v*0).toFixed(2)}`);w.style.filter='url(#mb)'}else if((w.style.filter||'').includes('url'))w.style.filter='';
  $$('#glow i').forEach((e,i)=>{const a=t*(.11+i*.04)+i*2.1,x=[70,8,45][i]+Math.sin(a)*18,y=[0,70,40][i]+Math.cos(a*1.3)*16;e.style.transform=`translate(${x.toFixed(2)}cqw,${y.toFixed(2)}cqh) translate(-50%,-50%)`})}
function frameA(t){if(window.FLY)FLY();orbitF(t);ftF(t);fxF(t);const s=MZ.s,P=k=>[500+(AP[k][0]-MZ.cx)*s,470+(AP[k][1]-MZ.cy)*s];
  $('#mapG').setAttribute('transform',`translate(500 470) scale(${s.toFixed(4)}) translate(${(-MZ.cx).toFixed(2)} ${(-MZ.cy).toFixed(2)})`);
  {const q=P('PAR');$('#spot8').setAttribute('cx',q[0].toFixed(1));$('#spot8').setAttribute('cy',q[1].toFixed(1));$$('#rad8 circle').forEach(c=>{c.setAttribute('cx',q[0].toFixed(1));c.setAttribute('cy',q[1].toFixed(1))})}
  $$('#dots8 [data-k]').forEach(g=>{const [x,y]=P(g.dataset.k);g.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`)});
  {const ap=$$('#arcs8 path'),pl=$$('#aps8 .ap8'),te=C('europe#1')+2.2;ARC.forEach((k,i)=>{const o=P(i%3===0?'LON':'PAR'),q=P(k);const mx=(o[0]+q[0])/2,my=(o[1]+q[1])/2-Math.hypot(q[0]-o[0],q[1]-o[1])*.28;
    ap[i].setAttribute('d',`M${o[0].toFixed(1)} ${o[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`);const a=cl(MZ.a*1.4-i*.05),fo=1-cl((t-te)/1.2);
    ap[i].setAttribute('stroke-dashoffset',(1-a).toFixed(3));ap[i].style.opacity=(a>0?fo:0).toFixed(2);const gg=$('#ag'+i);gg.setAttribute('x1',o[0].toFixed(1));gg.setAttribute('y1',o[1].toFixed(1));gg.setAttribute('x2',q[0].toFixed(1));gg.setAttribute('y2',q[1].toFixed(1));
    const de=$(`.de8[data-k=${k}]`);de.style.opacity=a>=.999?1:0;
    const p=pl.find(e=>+e.dataset.i===i);if(p){const u=a,bx=(1-u)*(1-u)*o[0]+2*(1-u)*u*mx+u*u*q[0],by=(1-u)*(1-u)*o[1]+2*(1-u)*u*my+u*u*q[1],dx=2*(1-u)*(mx-o[0])+2*u*(q[0]-mx),dy=2*(1-u)*(my-o[1])+2*u*(q[1]-my);
      p.setAttribute('transform',`translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(Math.atan2(dy,dx)*180/Math.PI+90).toFixed(1)})`);p.style.opacity=(a>.02&&a<.985?1:0)}})}
  $$('#chips8 [data-k]').forEach(g=>{const [x,y]=P(g.dataset.k);g.firstChild.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`)});
  {const te=C('europe#1')+2.2,fo=1-cl((t-te)/1.2);$$('.dl8').forEach(g=>{const i=ARC.indexOf(g.dataset.k),r=MZ.a*1.4-i*.05,o=cl((r-1)/.2);g.style.opacity=(o*fo).toFixed(3);g.firstChild.firstChild.setAttribute('transform',g.firstChild.firstChild.getAttribute('transform').replace(/ scale\([^)]*\)/,'')+` scale(${(.7+.3*o).toFixed(3)})`)})}}

function ftF(t){const on=t>SA('a8b')-1.6&&t<SA('a9')+1.4;
  if(on&&window.PLANE3D){const x=PL.x,air=Math.min(1,Math.max(0,(-x-40)/130)),y=18*air,pitch=x<-40?3+2*(1-Math.min(1,(-x-40)/80)):5*Math.min(1,Math.max(0,(-x-12)/28)),roll=-5*Math.min(1,Math.max(0,(-x-70)/100));
    const k=[x,PL.door,PL.cx].map(v=>v.toFixed(3)).join();if(k!==PLk){PLk=k;PLANE3D.render({x,y,pitch,roll,door:PL.door,camX:PL.cx})}}
  {const e=$('#ft8n'),v=String(Math.round(FC.m));if(e&&e.textContent!==v)e.textContent=v}$('#tok8').setAttribute('transform',`translate(${TK.x.toFixed(1)} ${TK.y.toFixed(1)}) rotate(${TK.r.toFixed(2)}) scale(${TK.s.toFixed(3)})`);$('#tok8').style.opacity=TK.o;
  $$('.ft').forEach(e=>{const k=+e.dataset.k,n=+e.dataset.n,st=C(k?'charles':'heathrow')-.15,se=st+.5+n*.13,tx=e.querySelector('text');
    let ch=e.dataset.c;if(t<se){const f=Math.floor((t-st)/.05)+n*7;ch='BCDFGHJKLMNPRSTVWXZ23457'[((f*7919)%24+24)%24]}if(tx.textContent!==ch)tx.textContent=ch})}
