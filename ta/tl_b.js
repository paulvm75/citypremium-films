  // A5 the system tips into 3D and revolves while we say what we are not; the partners lift out of the plane in a spotlight
  tl.set(T3,{t:0,sp:0},0);tl.set(HLT,{d:0,v:0},0);tl.set(BS,{a:-90,h:240,s:0,tw:0,dr:0,o:0},0);tl.set('.hlr',{opacity:0,scale:.8,transformOrigin:'50% 50%'},0);
  tl.fromTo(T3,{t:0,sp:0},{t:66,sp:-60,duration:SA('a5')-SA('a4')-.4,ease:'power2.in',immediateRender:false},SA('a4')+.3);
  tl.to(T3,{t:56,sp:4,duration:C('operator')-.4-(SA('a5')-.1),ease:'sine.inOut'},SA('a5')-.1);
  tl.to('#gap0,#gap1,#gap2',{opacity:.28,duration:.5,ease:'power2.out'},C('partners')-.45);
  tl.to(HLT,{d:85,duration:.9,ease:'back.out(1.5)'},C('partners')-.45);tl.to(HLT,{v:85,duration:.9,ease:'back.out(1.5)'},C('partners')-.3);
  tl.to('#dmcC .hlr',{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},C('partners')-.4);tl.to('#virC .hlr',{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},C('partners')-.25);
  tl.to('#dmcC .nb,#virC .nb',{scale:1.14,transformOrigin:'50% 50%',duration:.35,yoyo:true,repeat:1,stagger:.15,ease:'sine.inOut'},C('partners')-.25);
  tl.to(HLT,{d:0,v:0,duration:.8,ease:'power2.inOut'},C('operator')-.75);tl.to('.hlr',{opacity:0,duration:.4},C('operator')-.7);tl.to('#gap0,#gap1,#gap2',{opacity:1,duration:.5},C('operator')-.6);
  // our logo, black and white, rises above the plane and twists around the whole system, drawing our orbit as it goes
  tl.to(BS,{o:1,s:1.05,duration:.7,ease:'back.out(1.8)'},C('operator')-.55);
  tl.to(BS,{a:270,tw:720,duration:2.1,ease:'power2.inOut'},C('operator')-.4);tl.to(ORB,{d:1,duration:2.1,ease:'power2.inOut'},C('operator')-.4);
  tl.fromTo('#cpOrbG',{opacity:0},{keyframes:{opacity:[0,.45,0]},duration:1.4,ease:'none'},C('operator')+1.55);
  tl.to(BS,{h:0,duration:.75,ease:'power2.inOut'},C('operator')+1.55);tl.to(BS,{a:315,s:.62,tw:1080,duration:1,ease:'power3.inOut'},C('operator')+1.7);
  tl.to(BS,{dr:10,duration:SA('a6')-(C('operator')+2.7),ease:'none'},C('operator')+2.7);
  tl.to(T3,{t:40,duration:1.1,ease:'power2.inOut'},C('operator')-.4);
  tl.to(T3,{t:0,sp:0,duration:1.4,ease:'expo.inOut'},C('operator')+1.5);
  // our services join the orbit
  tl.set('.sat .nb',{scale:0,opacity:0,transformOrigin:'50% 50%'},0);
  tl.to('#sat1 .nb,#sat2 .nb',{scale:1,opacity:1,duration:.6,stagger:.18,ease:'back.out(2)'},C('orbit')-.35);
  tl.fromTo(ORB,{p:0},{p:1,duration:C('gaps')-C('orbit')+.15,ease:'power2.inOut'},C('orbit')-.35);tl.to(ORB,{p:1.15,duration:SA('a6')-C('gaps')+.3,ease:'none'},C('gaps')-.2);
  // your DMC, your network: each one lights up as it is named
  [['#dmcC','dmc#2'],['#virC','network']].forEach(([id,w])=>{tl.fromTo(id+' .hlr',{opacity:0,scale:.8},{keyframes:[{opacity:1,scale:1.06,duration:.35,ease:'back.out(2)'},{opacity:1,scale:1,duration:.5},{opacity:0,duration:.5}]},C(w)-.2);
    tl.to(id+' .nb',{scale:1.18,transformOrigin:'50% 50%',duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'},C(w)-.2)});
  // the gaps are filled one by one: the red dot goes, the pin turns ours, a check snaps in with a small burst
  tl.set('.gs',{transformOrigin:'50% 50%'},0);tl.set('.gk',{rotation:-120},0);
  [0,1,2].forEach(i=>{const g=`#gap${i}`,t=C('gaps')+i*.28;
    tl.to(g+' .gd',{scale:0,transformOrigin:'50% 50%',duration:.18,ease:'power2.in'},t-.12);
    tl.to(g+' .gb',{fill:'#9FB0FF',duration:.2},t);tl.fromTo(g+' .gb',{scale:1},{keyframes:[{scale:1.2,duration:.14,ease:'power2.out'},{scale:1,duration:.45,ease:'back.out(3)'}],transformOrigin:'50% 50%'},t);
    tl.to(g+' .gk',{opacity:1,scale:1,rotation:0,duration:.5,ease:'back.out(2.6)'},t+.05);
    tl.fromTo(g+' .gs',{opacity:1,scale:.7},{opacity:0,scale:1.35,duration:.6,ease:'power2.out',immediateRender:false},t+.02);
    tl.to(g+' .gr',{fill:'rgba(159,176,255,.3)',duration:.2},t);tl.fromTo(g+' .gr',{attr:{r:40},opacity:1},{attr:{r:84},opacity:0,duration:.9,ease:'sine.out',immediateRender:false},t)});
  // A6 a la carte
  tl.from('.m6',{y:60,opacity:0,filter:'blur(8px)',duration:.8,stagger:.07,ease:'expo.out'},SA('a6')+.15);
  tl.set('#cur6',{opacity:0},0);
  {const pts=[[440,175,'exactly'],[440,385,'need'],[910,805,'nothing']];
   tl.fromTo('#cur6',{x:760,y:1050,opacity:0},{x:pts[0][0],y:pts[0][1],opacity:1,duration:.8,ease:'power3.inOut'},C('exactly')-.7);
   pts.forEach(([x,y,w],i)=>{if(i)tl.to('#cur6',{x,y,duration:.6,ease:'power3.inOut'},C(w)-.6);
     const id=['#m0','#m2','#m7'][i];tl.to(id+' .on',{opacity:1,duration:.15},C(w)-.02);tl.from(id+' .on',{scale:0,transformOrigin:'50% 50%',duration:.4,ease:'back.out(3)'},C(w)-.02);tl.to(id+'>rect',{stroke:'#9FB0FF',strokeWidth:5,duration:.2},C(w));tl.fromTo(id,{y:0},{y:-8,duration:.18,yoyo:true,repeat:1,ease:'power2.out'},C(w)-.02);tl.fromTo('#rip6',{attr:{cx:x,cy:y,r:24},opacity:.9},{attr:{cx:x,cy:y,r:80},opacity:0,duration:.6,ease:'power2.out',immediateRender:false},C(w)-.02)});
   tl.to('#m1,#m3,#m4,#m5,#m6',{opacity:.35,duration:.5},C('dont#2')-.2);tl.to('#cur6',{opacity:0,duration:.4},C('dont#2')+.3)}
  // A7 the fleet and the chauffeurs
  tl.from('#pn0,#pn1',{y:120,opacity:0,duration:.8,stagger:.12,ease:'expo.out'},SA('a7')+.1);
  tl.fromTo('#pn0 .c6',{x:-420},{x:0,duration:1.1,ease:'expo.out'},C('fleet')-.45);tl.fromTo('#pn1 .c6',{x:460},{x:0,duration:1.1,ease:'expo.out'},C('fleet')-.3);
  tl.from('.p6',{scale:0,y:40,transformOrigin:'50% 100%',duration:.5,stagger:.15,ease:'back.out(2)'},C('chauffeurs')-.2);
  tl.from('#stamp6',{scale:2.6,rotation:-25,opacity:0,svgOrigin:'500 30',duration:.34,ease:'power4.in'},C('directly')-.15);
  tl.to('#pn0>rect',{stroke:'#9FB0FF',duration:.3},C('paris#2'));tl.to('#pn1>rect',{stroke:'#9FB0FF',duration:.3},C('london#1'));
  tl.fromTo('#vip7',{opacity:0},{opacity:1,duration:.3},C('vip'));tl.from('#vip7 g',{scale:0,transformOrigin:'50% 50%',duration:.45,stagger:.12,ease:'back.out(3)'},C('vip'));
  tl.to('#sky0',{attr:{'stroke-dashoffset':0},duration:1,ease:'power2.inOut'},C('city#2')-.45);tl.to('#sky1',{attr:{'stroke-dashoffset':0},duration:1,ease:'power2.inOut'},C('city#2')-.2);
  tl.from('#day7',{opacity:0,y:30,duration:.6,ease:'expo.out'},C('single')-.4);
  tl.fromTo('#dayFill',{scaleX:.02,transformOrigin:'0% 50%'},{scaleX:1,duration:1.3,ease:'power2.inOut'},C('driver')-.1);
  tl.fromTo('#dayKnob',{x:0},{x:760,duration:1.3,ease:'power2.inOut'},C('driver')-.1);
  // A8 private terminals drop in as pins, then the map pulls out across Europe and flights fan out from Paris and London
  tl.fromTo(MZ,{s:3.7},{s:3.2,duration:C('airports')-.3-SA('a8'),ease:'sine.inOut'},SA('a8'));
  tl.fromTo(MZ,{s:3.2,cx:345,cy:445},{s:.95,cx:520,cy:600,duration:1.9,ease:'expo.inOut',immediateRender:false},C('airports')-.3);
  tl.fromTo('#mapG',{opacity:0},{opacity:1,duration:1.1,ease:'power2.out'},SA('a8')+.05);
  tl.fromTo('.hub8',{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:.6,stagger:.15,ease:'back.out(2.2)'},SA('a8')+.35);
  tl.set('.c8,.pin8 .pi',{opacity:0},0);
  [['LBG','bourget'],['FAB','farnborough'],['BQH','biggin']].forEach(([k,w])=>{const e=`.pin8[data-k=${k}] .pi`;
    tl.fromTo(e,{opacity:0,y:-70,scale:.6,transformOrigin:'50% 100%'},{opacity:1,y:0,scale:1,duration:.55,ease:'back.out(2.2)'},C(w)-.25);
    tl.fromTo(`.c8[data-k=${k}]`,{opacity:0,x:-14},{opacity:1,x:0,duration:.5,ease:'expo.out'},C(w)-.05);tl.to(`.c8[data-k=${k}]`,{opacity:0,duration:.3},C('airports')-.3)});
  tl.to('.pin8 .pi',{opacity:0,scale:.6,duration:.4,ease:'power2.in'},C('airports')-.1);
  tl.fromTo(MZ,{a:0},{a:1,duration:1.8,ease:'power2.inOut'},C('airports')+.1);
  $$('#rad8 circle').forEach((c,i)=>tl.fromTo(c,{attr:{r:20},opacity:.7},{attr:{r:560},opacity:0,duration:1.6,ease:'power2.out'},C('airports')+.1+i*.4));
  // A8b a 3D airliner lands and stops; our chauffeur is waiting at the door; then the arrival story, with fast track
  {const S8=SA('a8b'),DP=window.PLANE3D?(PLANE3D.render({x:0,door:0}),PLANE3D.project(11.6,-.9,2)).map((v,i)=>i?-20+v*650/900:-60+v*1300/1800):[588,330];
   tl.set(PL,{x:-175,door:0,cx:14},0);
   tl.to(PL,{x:0,duration:2.55,ease:'power3.out'},S8-.3);tl.to(PL,{cx:0,duration:3.2,ease:'power2.out'},S8-.3);
   tl.to(PL,{door:1,duration:.8,ease:'power2.inOut'},C('airside')-.5);
   tl.set(TK,{x:DP[0]+70,y:DP[1]+20,s:0,o:0},0);tl.set('#tkU',{opacity:0,scale:0,transformOrigin:'50% 50%'},0);
   tl.to(TK,{s:1,o:1,duration:.55,ease:'back.out(2)'},C('airside')-.2);
   tl.to('#tkU',{opacity:1,scale:1,duration:.5,ease:'back.out(2.4)'},C('airside')+.3);
   tl.fromTo('.fb8',{opacity:0,y:-24},{opacity:1,y:0,duration:.6,ease:'expo.out',stagger:C('charles')-C('heathrow')},C('heathrow')-.3);
   tl.to('#pl8g,.fb8',{opacity:portrait?0:.4,duration:.8,ease:'power2.inOut'},C('fast')-.55);
   tl.set('.s8 .sl',{scale:0,transformOrigin:'50% 50%'},0);tl.set('#pl8',{scaleX:0,svgOrigin:'150 800'},0);
   tl.fromTo('#jp8w',{opacity:0,y:60},{opacity:1,y:0,duration:.9,ease:'expo.out'},C('charles')+.1);
   const ON=C('fast')-.15;tl.to('#swT',{fill:'#9FB0FF',duration:.25},ON);tl.to('#swK',{attr:{cx:374},fill:'#0F1426',duration:.4,ease:'back.out(2)'},ON);
   tl.fromTo('#swR',{opacity:.9,scale:1,transformOrigin:'50% 50%'},{opacity:0,scale:1.9,duration:.8,ease:'power2.out'},ON+.05);
   tl.fromTo('#swR',{opacity:.9,scale:1},{opacity:0,scale:1.9,duration:.8,ease:'power2.out',immediateRender:false},C('want')-.1);
   [1,2].forEach((k,n)=>{tl.to(`#w8${k} .wx`,{attr:{'stroke-dashoffset':0},duration:.3,ease:'power2.out'},ON+.25+n*.15);tl.to(`#w8${k} .wo`,{opacity:0,duration:.25},ON+.6+n*.15);
     tl.fromTo(`#w8${k} .wn`,{opacity:0,scale:.5,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.45,ease:'back.out(2.6)'},ON+.62+n*.15)});
   const lit=(k,t)=>{tl.to(`#s8${k} .sl`,{scale:1,duration:.4,ease:'expo.out'},t);tl.fromTo(`#s8${k} .sr`,{opacity:.9,scale:1,transformOrigin:'50% 50%'},{opacity:0,scale:1.6,duration:.8,ease:'power2.out'},t)};
   tl.to(TK,{x:150,y:662,duration:1.05,ease:'power3.inOut'},C('fast')-.6);lit(0,C('fast')+.4);
   [[383,'passport',1],[617,'customs',2],[850,'want',3]].forEach(([x,w,k],i)=>{const st=i?C(['','passport','customs'][i])+.08:C('fast')+.48,en=C(w)-(k===3?.32:.08),d=en-st;
     tl.to(TK,{x,duration:d,ease:'power3.inOut'},st);tl.to('#pl8',{scaleX:(x-150)/700,svgOrigin:'150 800',duration:d,ease:'power3.inOut'},st);
     tl.to(TK,{keyframes:[{r:-7,duration:d*.35,ease:'power2.out'},{r:3,duration:d*.45,ease:'power2.inOut'},{r:0,duration:d*.2,ease:'power2.out'}]},st);lit(k,en)});
   tl.fromTo('#stamp8',{opacity:0,scale:2.6,rotation:-30,svgOrigin:'423 756'},{opacity:1,scale:1,rotation:-8,svgOrigin:'423 756',duration:.26,ease:'power4.in'},C('passport')-.1);}
  // A9 the concierge layer
  [['#t1','jet'],['#t2','hotel'],['#t3','ad']].forEach(([id,w])=>{tl.fromTo(id,{y:90,scale:.9,opacity:0,filter:'blur(10px)',transformOrigin:'50% 50%'},{y:0,scale:1,opacity:1,filter:'blur(0px)',duration:.95,ease:'expo.out'},C(w)-.4);tl.fromTo(id+' text',{x:40,opacity:0},{x:0,opacity:1,duration:.7,stagger:.09,ease:'expo.out'},C(w)-.25)});
  tl.from('#jet9',{scale:.6,opacity:0,svgOrigin:'210 215',duration:.6,ease:'back.out(2)'},C('jet')-.2);
  tl.fromTo('#bell9',{opacity:0},{opacity:1,duration:.6,ease:'power2.out'},C('ad')-.25);
  tl.from('#ok8',{scale:0,rotation:-60,svgOrigin:'880 110',duration:.5,ease:'back.out(2.4)'},C('clock')-.15);
  // A10 white label: the confirmation flips from our brand to the agency's name
  tl.fromTo('#flip10',{y:80,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:1,ease:'expo.out'},SA('a10')+.15);
  {const F=C('white')-.1;tl.to('#flip10',{scaleX:0,svgOrigin:'500 440',duration:.35,ease:'power2.in'},F);tl.set('#back10',{opacity:0},F+.35);tl.set('#front10',{opacity:1},F+.35);
   tl.to('#flip10',{scaleX:1,svgOrigin:'500 440',duration:.6,ease:'back.out(1.7)'},F+.35);
   tl.fromTo('#sheen10',{x:0,opacity:0},{keyframes:{opacity:[0,.75,0]},x:450,duration:.8,ease:'power2.inOut'},F+.9)}
  tl.to('#ul10',{attr:{'stroke-dashoffset':0},duration:.5,ease:'power2.out'},C('name')-.35);
  tl.to('#flip10',{scale:1.04,svgOrigin:'500 440',duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'},C('name')-.1);
  // A11 trust
  [['#tr1','maisons'],['#tr2','embassies'],['#tr3','vic']].forEach(([id,w])=>{tl.fromTo(id,{x:140,opacity:0,filter:'blur(8px)'},{x:0,opacity:1,filter:'blur(0px)',duration:.85,ease:'expo.out'},C(w)-.4);tl.from(id+' .ic2',{scale:.4,opacity:0,transformOrigin:'50% 50%',duration:.6,ease:'back.out(2.2)'},C(w)-.2)});
