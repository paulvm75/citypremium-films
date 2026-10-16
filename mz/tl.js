  // M1 one envelope splits into forty, then one comes forward and opens
  tl.set('#bug',{opacity:0},0);tl.set('#logoOv',{opacity:0},0);tl.to('#bug',{opacity:.92,duration:.6},SA('m2')+.6);
  {const F=C('forty#1'),O=C('only'),L=$$('.ev1'),cav=$('#ev1'+CAVI);
   tl.set('#evfo',{scaleY:0,transformOrigin:'50% 100%'},0);
   const P=L.map(e=>e.dataset.p.split('|').map(s=>s.split(',').map(Number)));
   tl.set(L,{x:500,y:500,scale:1,opacity:0,transformOrigin:'50% 50%'},0);
   tl.fromTo(L[0],{opacity:0,y:540,scale:.92},{opacity:1,y:500,scale:1,duration:1.0,ease:'expo.out',immediateRender:false},.05);
   const T=d=>F-.32+(d-1)*.3,S=d=>Math.pow(ESC,d/EDEPTH);
   tl.set(L,{opacity:1},T(1));
   for(let d=1;d<=EDEPTH;d++)L.forEach((e,i)=>tl.to(e,{x:P[i][d][0],y:P[i][d][1],scale:S(d),duration:.5,ease:'expo.out'},T(d)));
   const oth=L.filter(e=>e!==cav);
   oth.forEach((e,i)=>{const p=P[L.indexOf(e)][EDEPTH];tl.to(e,{opacity:.28,duration:.5,ease:'power2.out'},C('expects')-.2+((i*7)%13)*.025);
     tl.to(e,{x:p[0]+(p[0]-500)*1.5,y:p[1]+(p[1]-500)*1.5,opacity:0,duration:.7,ease:'power3.in'},O-.45+((i*5)%11)*.012)});
   tl.to(cav,{scale:ESC*1.22,duration:.5,ease:'back.out(2)'},C('expects')-.1);
   tl.to(cav,{x:500,y:540,scale:1.3,duration:.85,ease:'expo.inOut'},O-.45);
   tl.to('#evsl',{opacity:0,scale:.6,transformOrigin:'50% 50%',duration:.2},O+.3);
   tl.to('#evfc',{scaleY:0,transformOrigin:'50% 0%',duration:.16,ease:'power2.in'},O+.38);
   tl.to('#evfo',{scaleY:1,transformOrigin:'50% 100%',duration:.24,ease:'power2.out'},O+.54);
   tl.to('#evcd',{y:-120,duration:.65,ease:'expo.out'},O+.62)}
  // M2 the satin ribbon (frame.js renders it); tag and handover labels positioned per frame
  tl.set('#tg2',{opacity:0},0);
  tl.set('#tk2',{opacity:0},0);tl.fromTo('#tk2',{opacity:0,y:20},{opacity:1,y:0,duration:.7,ease:'expo.out',immediateRender:false},C('handover')-.3);
  tl.set('.wp2',{opacity:.3},0);tl.set('.wp2 .wpu',{scaleX:0,transformOrigin:'0% 50%'},0);
  {const a=C('aircraft')-.1,b=C('home')+.25;for(let i=0;i<6;i++){const t=a+i*(b-a)/5;tl.to(`#wp2${i}`,{opacity:1,duration:.25},t);tl.to(`#wp2${i} .wpu`,{scaleX:1,duration:.45,ease:'power3.out'},t)}}
  // M3 Le Bourget: the jet lands; it gives way to Thomas, the chauffeur badge; then one badge stamped on every day of the week
  {const S3=SA('m3'),W3=C('chauffeur#1')-.45;
   tl.set(JP3,{x:-150,door:0,cx:10},0);
   tl.to(JP3,{x:0,duration:3.2,ease:'power3.out'},S3-.45);tl.to(JP3,{cx:0,duration:3.8,ease:'power2.out'},S3-.45);
   tl.to(JP3,{door:1,duration:1.1,ease:'power2.inOut'},C('land')-.1);
   tl.fromTo('#gt3',{opacity:0,y:24},{opacity:1,y:0,duration:.7,ease:'expo.out'},C('mr')-.2);
   tl.to('#jg3',{opacity:0,scale:.9,svgOrigin:'500 300',duration:.5,ease:'power3.in'},W3);
   tl.set('#cb3',{opacity:0},0);tl.set('#cb3',{opacity:1},W3+.25);
   tl.fromTo('#bdd3',{scale:0,rotation:-120,svgOrigin:'500 270'},{scale:1,rotation:0,svgOrigin:'500 270',duration:.9,ease:'back.out(1.7)',immediateRender:false},W3+.28);
   tl.to('#bdr3',{attr:{'stroke-dashoffset':0},duration:1.1,ease:'power3.inOut'},W3+.35);
   tl.fromTo('#bdw3',{attr:{r:120},opacity:.8},{attr:{r:330},opacity:0,duration:1.2,ease:'power2.out',immediateRender:false},W3+.5);
   tl.fromTo('#bdx3',{attr:{r:120},opacity:.6},{attr:{r:330},opacity:0,duration:1.2,ease:'power2.out',immediateRender:false},W3+.8);
   tl.set('#bdo3',{opacity:0},0);tl.to('#bdo3',{opacity:1,duration:.3},W3+1.3);tl.fromTo('#bdo3',{rotation:0,svgOrigin:'500 270'},{rotation:330,svgOrigin:'500 270',duration:6.5,ease:'none',immediateRender:false},W3+1.3);
   tl.fromTo('#nm3',{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:'expo.out',immediateRender:false},W3+.65);tl.set('#nm3',{opacity:0},0);
   tl.set('#ck3',{opacity:0},0);tl.fromTo('#ck3',{opacity:0,x:-80,scale:.7,svgOrigin:'640 120'},{opacity:1,x:0,scale:1,svgOrigin:'640 120',duration:.7,ease:'back.out(2)',immediateRender:false},C('waiting')-.35);
   tl.set('#dy3',{opacity:1},0);tl.set('.dyb3',{opacity:0},0);tl.to('.dyb3',{opacity:1,duration:.5},C('he')-.3);tl.set('.dc3',{opacity:0},0);tl.set('.ds3',{scale:0,transformOrigin:'50% 50%'},0);
   tl.fromTo('.dc3',{opacity:0,y:50,scale:.8,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,stagger:.08,duration:.6,ease:'back.out(1.8)',immediateRender:false},C('he')-.3);
   const W0=C('only#2')-.2,W1=C('week#1')+.15;tl.to('#dyp3',{attr:{'stroke-dashoffset':0},duration:W1-W0,ease:'none'},W0);
   $$('.ds3').forEach((e,i)=>tl.to(e,{scale:1,duration:.45,ease:'back.out(3)'},W0+(W1-W0)*i/4))}
  // M4 the personal host and the little things they know
  tl.fromTo('#hc4',{opacity:0,y:60,scale:.96,svgOrigin:'500 540'},{opacity:1,y:0,scale:1,svgOrigin:'500 540',duration:1.0,ease:'expo.out'},SA('m4')+.1);
  tl.set('.nt4',{opacity:0},0);
  [['coffee',0],['prefer',1],['wait',2]].forEach(([w,i])=>{tl.to(`#nt4${i}`,{opacity:1,duration:.3},C(w)-.6);tl.to(`#nt4${i} .ncr`,{attr:{width:530},duration:.95,ease:'power2.out'},C(w)-.55)});
  tl.to('#ul4',{attr:{'stroke-dashoffset':0},duration:.6,ease:'power2.out'},C('wait')+.2);
  // M5 the show: forty cars appear, one time, they line up, and arrive like four
  {const L=$$('.cr5');tl.set(L,{opacity:0},0);
   tl.fromTo('#tm5',{opacity:0,scale:.7,svgOrigin:'500 250'},{opacity:1,scale:1,svgOrigin:'500 250',duration:.8,ease:'back.out(1.8)'},C('show#1')-.4);
   tl.fromTo('#sb5',{opacity:0,y:14},{opacity:1,y:0,duration:.6,ease:'expo.out'},C('time')-.35);
   tl.fromTo('#tt5',{scale:1},{scale:1.08,svgOrigin:'560 250',duration:.18,yoyo:true,repeat:1,ease:'power2.out',immediateRender:false},C('time')-.1);
   L.forEach((e,i)=>{const [sx,sy,sr]=e.dataset.s.split(',').map(Number),[rx,ry]=e.dataset.r.split(',').map(Number),j=+e.id.split('_')[1];
     tl.set(e,{x:sx,y:sy,rotation:sr,scale:0,transformOrigin:'50% 50%'},0);
     tl.to(e,{opacity:1,scale:1,duration:.45,ease:'back.out(2.2)'},C('guests#1')-.45+((i*17)%40)*.024);
     tl.to(e,{x:sx+((i*13)%9-4)*4,y:sy+((i*7)%9-4)*4,rotation:sr*.6,duration:2.4,ease:'sine.inOut'},C('cars#1')+.5);
     tl.to(e,{x:rx,y:ry,rotation:0,duration:1.0,ease:'expo.inOut'},C('coordinated')-.5+j*.035);
     tl.to(e,{x:640,duration:.5,ease:'power3.in'},C('arrive')-.5+(9-j)*.025);
     if(j<9)tl.to(e,{opacity:0,duration:.08},C('arrive')+.02+(9-j)*.025);
     else{tl.to(e,{scale:1.75,duration:.45,ease:'back.out(2.2)'},C('arrive')+.02);tl.to(e,{x:735,duration:.55,ease:'expo.out'},C('four')-.2)}});
   tl.fromTo('#fl5',{opacity:0,scaleY:0,svgOrigin:'820 615'},{opacity:.7,scaleY:1,svgOrigin:'820 615',duration:.6,ease:'expo.out'},C('arrive')-.3);
   tl.fromTo('#ok5',{opacity:0,scale:.3,svgOrigin:'820 350'},{opacity:1,scale:1,svgOrigin:'820 350',duration:.5,ease:'back.out(2.6)'},C('four')+.05)}
  // M6 the gallery: lights in sequence (frame.js moves the camera and the couple)
  tl.fromTo('#amb6',{opacity:0},{opacity:.9,duration:2.4,ease:'power1.inOut',immediateRender:false},C('museum')-.35);
  tl.to('#cpl6',{opacity:1,duration:.5},C('just')-.55);
  tl.set('#lab6',{opacity:0},0);
  tl.fromTo('#lab6',{opacity:0,y:24,scale:.96,svgOrigin:'500 776'},{opacity:1,y:0,scale:1,svgOrigin:'500 776',duration:.8,ease:'expo.out',immediateRender:false},C('never#2')-.4);
  // M7 behind the scenes: the card turns to the team side; quantities in blue, times in silver
  tl.fromTo('#cd7',{opacity:0,y:60},{opacity:1,y:0,duration:.9,ease:'expo.out'},SA('m7')+.05);
  {const FL=C('look')-.25;tl.to('#cd7',{scaleX:0,svgOrigin:'500 550',duration:.3,ease:'power2.in'},FL);tl.set('#cf7',{opacity:0},FL+.3);tl.set('#cb7',{opacity:1},FL+.3);
   tl.to('#cd7',{scaleX:1,svgOrigin:'500 550',duration:.62,ease:'back.out(1.6)'},FL+.3)}
  tl.set('.tq7,.tt7',{opacity:0},0);
  TQ().forEach((t,i)=>tl.fromTo(`#tq7${i}`,{opacity:0,y:24,scale:.9,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,duration:.55,ease:'back.out(1.8)',immediateRender:false},t));
  [C('early')-.35,C('mornings')-.2,C('nights')-.35].forEach((t,i)=>tl.fromTo(`#tt7${i}`,{opacity:0,x:-40},{opacity:1,x:0,duration:.6,ease:'expo.out',immediateRender:false},t));
  // M8 flights, jets, the right suite
  [['#tk8a','flights',-.15],['#tk8b','jets',-.4],['#tk8c','suite',-.4]].forEach(([id,w,o])=>tl.fromTo(id,{opacity:0,x:200,rotation:4,svgOrigin:'500 500'},{opacity:1,x:0,rotation:0,svgOrigin:'500 500',duration:.85,ease:'expo.out'},C(w)+o));tl.set('#tk8a,#tk8b,#tk8c',{opacity:0},0);
  // M9 Friday: the same chauffeur badge; top-down, the car pulls up at the jet door, the jet taxis and lifts off (its shadow separates); the week remembered; the ribbon
  {const B=C('same')-.45;
   tl.fromTo('#bdd9',{scale:0,rotation:-120,svgOrigin:'500 200'},{scale:1,rotation:0,svgOrigin:'500 200',duration:.85,ease:'back.out(1.7)'},B);
   tl.to('#bdr9',{attr:{'stroke-dashoffset':0},duration:1.0,ease:'power3.inOut'},B+.05);
   tl.fromTo('#bdw9',{attr:{r:80},opacity:.8},{attr:{r:240},opacity:0,duration:1.1,ease:'power2.out',immediateRender:false},B+.2);
   tl.set('#bdo9,#bdx9',{opacity:0},0);
   tl.fromTo('#nm9',{opacity:0,y:24},{opacity:1,y:0,duration:.6,ease:'expo.out'},B+.25);
   tl.fromTo('#ap9',{opacity:0,y:30},{opacity:1,y:0,duration:.7,ease:'expo.out'},SA('m9')+.05);
   tl.set('#jt9',{x:500,y:540},0);tl.set('#js9',{x:510,y:550},0);
   tl.fromTo('#jt9,#js9',{opacity:0},{opacity:1,duration:.6},SA('m9')+.15);
   tl.set('#cr9',{motionPath:{path:'#cp9',align:'#cp9',alignOrigin:[.5,.5],autoRotate:true,start:0,end:0},opacity:0},0);
   tl.to('#cr9',{opacity:1,duration:.2},C('drives')-.6);
   tl.to('#cr9',{motionPath:{path:'#cp9',align:'#cp9',alignOrigin:[.5,.5],autoRotate:true,start:0,end:1},duration:1.6,ease:'power2.inOut',immediateRender:false},C('drives')-.6);
   tl.fromTo('#dr9',{attr:{r:10},opacity:.9},{attr:{r:46},opacity:0,duration:.9,repeat:1,ease:'power2.out',immediateRender:false},C('back')-.1);
   const T0=C('plane')-.05,D=2.3;
   tl.to('#jt9',{motionPath:{path:'#jp9',align:'#jp9',alignOrigin:[.5,.5],autoRotate:true,start:0,end:1},duration:D,ease:'power2.in'},T0);
   tl.to('#js9',{motionPath:{path:'#jq9',align:'#jq9',alignOrigin:[.5,.5],autoRotate:true,start:0,end:.8},duration:D,ease:'power2.in'},T0);
   tl.to('#jt9',{scale:1.5,duration:D*.5,ease:'power2.in'},T0+D*.5);
   tl.to('#js9',{opacity:0,duration:D*.5},T0+D*.5);
   tl.to('#cr9',{opacity:.0,duration:.5},C('remember#1')-.4);
   tl.set('.dc9',{opacity:0},0);tl.fromTo('.dc9',{opacity:0,y:40,scale:.85,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,stagger:.07,duration:.55,ease:'back.out(1.8)',immediateRender:false},C('remember#1')-.35);
   tl.set('#dyp9',{attr:{'stroke-dashoffset':0}},0);tl.set('.dyb9,#dyp9',{opacity:0},0);tl.to('.dyb9,#dyp9',{opacity:1,duration:.4},C('remember#1')-.35);
   tl.to('#ap9',{opacity:.25,duration:.5},C('remember#1')-.4);
   tl.to('#fr9',{opacity:0,y:-40,scale:.96,svgOrigin:'500 400',duration:.75,ease:'power2.inOut'},C('remember#2')-1.45);
   tl.set('#rg9',{opacity:1},C('remember#2')-.8)}
  // M10 since 2010: a quiet line to today
  tl.set('#em10,#sn10,#y10,.yt10,#dt10,#pl10',{opacity:0},0);
  tl.to('#em10,#sn10',{opacity:1,duration:.8},SA('m10')+.05);
  tl.fromTo('#y10',{opacity:0,y:24},{opacity:1,y:0,duration:1.1,ease:'expo.out',immediateRender:false},C('2010')-.35);
  {const a=C('luxury#2')-.3,d=2.6;tl.to('#tl10',{attr:{'stroke-dashoffset':0},duration:d,ease:'power2.inOut'},a);tl.to('#dt10',{opacity:1,duration:.3},a);
   tl.fromTo('#dt10',{attr:{cx:170}},{attr:{cx:830},duration:d,ease:'power2.inOut',immediateRender:false},a);
   [0,.25,.5,.75,1].forEach((u,i)=>{const e=u<.5?Math.sqrt(u/2):1-Math.sqrt((1-u)/2);tl.fromTo(`#yt10${i}`,{opacity:0,y:10},{opacity:1,y:0,duration:.45,ease:'expo.out',immediateRender:false},a+d*e-.1)})}
  tl.fromTo('#pl10',{opacity:0,y:16},{opacity:1,y:0,duration:.8,ease:'expo.out',immediateRender:false},C('trusted')-.2);
