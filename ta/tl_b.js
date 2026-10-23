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
  {const S8=SA('a8b'),DP=window.PLANE3D?(PLANE3D.render({x:0,door:0}),PLANE3D.project(...(PLANE3D.doorAnchor?PLANE3D.doorAnchor():[5.55,-.15,1.25]))).map((v,i)=>i?-20+v*650/900:-60+v*1300/1800):[588,330];
   tl.set(PL,{x:-175,door:0,cx:14},0);
   tl.to(PL,{x:0,duration:2.55,ease:'power3.out'},S8-.3);tl.to(PL,{cx:0,duration:3.2,ease:'power2.out'},S8-.3);
   tl.to(PL,{door:1,duration:1.6,ease:'none'},C('airside')-.85);
   tl.set(TK,{x:DP[0]+70,y:DP[1]+20,s:0,o:0},0);tl.set('#tkU',{opacity:0,scale:0,transformOrigin:'50% 50%'},0);
   tl.to(TK,{s:1,o:1,duration:.55,ease:'back.out(2)'},C('airside')+.15);
   tl.to('#tkU',{opacity:1,scale:1,duration:.5,ease:'back.out(2.4)'},C('airside')+.6);
   tl.fromTo('.fb8',{opacity:0,y:-24},{opacity:1,y:0,duration:.6,ease:'expo.out',stagger:C('charles')-C('heathrow')},C('heathrow')-.3);
   tl.to('#pl8g,.fb8',{opacity:portrait?0:.4,duration:.8,ease:'power2.inOut'},C('fast')-.55);
   tl.set('.s8 .sl',{scale:0,transformOrigin:'50% 50%'},0);tl.set('#pl8',{scaleX:0,svgOrigin:'150 960'},0);tl.set(FC,{m:75},0);tl.set('#ft8n',{fill:'#EEF0F6'},0);
   tl.fromTo('#jp8w',{opacity:0,y:60},{opacity:1,y:0,duration:.9,ease:'expo.out'},C('charles')+.1);
   const ON=C('fast')-.15;tl.to('#swT',{fill:'#9FB0FF',duration:.25},ON);tl.to('#swK',{attr:{cx:886},fill:'#0F1426',duration:.4,ease:'back.out(2)'},ON);tl.to(FC,{m:15,duration:1.8,ease:'power2.inOut'},ON+.25);tl.to('#ft8n',{fill:'#9FB0FF',duration:.5},ON+.25);
   tl.fromTo('#swR',{opacity:.9,scale:1,transformOrigin:'50% 50%'},{opacity:0,scale:1.9,duration:.8,ease:'power2.out'},ON+.05);
   tl.fromTo('#swR',{opacity:.9,scale:1},{opacity:0,scale:1.9,duration:.8,ease:'power2.out',immediateRender:false},C('want')-.1);
   const lit=(k,t)=>{tl.to(`#s8${k} .sl`,{scale:1,duration:.4,ease:'expo.out'},t);tl.fromTo(`#s8${k} .sr`,{opacity:.9,scale:1,transformOrigin:'50% 50%'},{opacity:0,scale:1.6,duration:.8,ease:'power2.out'},t)};
   tl.to(TK,{x:150,y:812,duration:1.05,ease:'power3.inOut'},C('fast')-.6);lit(0,C('fast')+.4);
   [[383,'passport',1],[617,'customs',2],[850,'want',3]].forEach(([x,w,k],i)=>{const st=i?C(['','passport','customs'][i])+.08:C('fast')+.48,en=C(w)-(k===3?.32:.08),d=en-st;
     tl.to(TK,{x,duration:d,ease:'power3.inOut'},st);tl.to('#pl8',{scaleX:(x-150)/700,svgOrigin:'150 960',duration:d,ease:'power3.inOut'},st);
     tl.to(TK,{keyframes:[{r:-7,duration:d*.35,ease:'power2.out'},{r:3,duration:d*.45,ease:'power2.inOut'},{r:0,duration:d*.2,ease:'power2.out'}]},st);lit(k,en)});
   }
  // A9 the concierge layer
  [['#t1','jet'],['#t2','hotel'],['#t3','ad']].forEach(([id,w])=>{tl.fromTo(id,{y:90,scale:.9,opacity:0,filter:'blur(10px)',transformOrigin:'50% 50%'},{y:0,scale:1,opacity:1,filter:'blur(0px)',duration:.95,ease:'expo.out'},C(w)-.4);tl.fromTo(id+' text',{x:40,opacity:0},{x:0,opacity:1,duration:.7,stagger:.09,ease:'expo.out'},C(w)-.25)});
  tl.from('#jet9',{scale:.6,opacity:0,svgOrigin:'210 215',duration:.6,ease:'back.out(2)'},C('jet')-.2);
  tl.fromTo('#bell9',{opacity:0},{opacity:1,duration:.6,ease:'power2.out'},C('ad')-.25);
  tl.from('#ok8',{scale:0,rotation:-60,svgOrigin:'880 110',duration:.5,ease:'back.out(2.4)'},C('clock')-.15);
  // A9x bespoke experiences, kinetic type: contour lines and a pin for local knowledge, then each place rises letter by letter with its photo inside the letters,
  // the Champagne word splits open like a cellar door, the Cotswolds get a horizon and a sun, the unusual is a question mark that fills with a tiny planet, and the weekend is measured on a tape
  {const FLX=+document.querySelector('#flq9x').getAttribute('x')+40,D0=document.querySelector('#mC9x text tspan'),SPX=+document.querySelector('#dRc9x rect').getAttribute('x'),S=SA('a9x'),E=C('experience')-.3,Y=(sel,y)=>({attr:{y}});
   const G2=s=>{const a=[...document.querySelectorAll(s)];return [a.filter(e=>e.closest('mask')),a.filter(e=>!e.closest('mask'))]};
   const LT=(m,y0,y1,t,st=.045,d=.6,ease='expo.out')=>G2(m).forEach(L=>tl.fromTo(L,{attr:{y:y0}},{attr:{y:y1},duration:d,ease,stagger:st,immediateRender:false},t));
   const EX=(m,y,t,st=.035)=>G2(m).forEach(L=>tl.to(L,{attr:{y},duration:.36,ease:'power3.in',stagger:st},t));
   tl.set('.lG',{attr:{y:572+250}},0);tl.set('.lC',{attr:{y:546+170}},0);tl.set('.lT',{attr:{y:546+170}},0);
   tl.set('.bb9x,.fb9x,.cc9x,.lb9x,#seal9x',{opacity:0},0);tl.set('#tp9x,#wC9x,#q9x,#ms9x,#fl9x,#qG9x',{opacity:1,x:0,y:0,scale:1,rotation:0},0);tl.set('.fls9x',{attr:{'stroke-dashoffset':1}},0);tl.set('#flq9x',{attr:{y:524,height:0}},0);
   tl.set('#tcr9x',{attr:{width:0}},0);
   // 1 local knowledge: a horizon line draws, eight slats open out of it like blinds to show the local guide; on "locals" the slats ripple;
   // on "design the moments" they flip one by one like a split-flap board to Champagne, on "remember" again to the Cotswolds; on "private visits" they fall away
   const SL=[...document.querySelectorAll('.sl9x')],NS=SL.length,mid=(NS-1)/2,ord=SL.map((e,i)=>Math.abs(i-mid));
   tl.set('.scr9x',{attr:{y:470,height:0}},0);tl.set('#hz9x',{attr:{x1:500,x2:500},opacity:1},0);tl.set('.sl9x',{y:0,opacity:1,scaleX:1,rotation:0},0);
   tl.set('.si0',{opacity:1},0);tl.set('.si1,.si2',{opacity:0},0);
   tl.to('#hz9x',{attr:{x1:60,x2:940},duration:.55,ease:'expo.out'},S+.05);
   SL.forEach((e,i)=>{const t=S+.42+ord[i]*.06,r=document.querySelector('#sc9x'+i+' rect');
     tl.to(r,{attr:{y:+r.dataset.y,height:+r.dataset.h},duration:.8,ease:'expo.out'},t);
     tl.fromTo(e.querySelector('.sp9x'),{y:i%2?60:-60},{y:0,duration:1,ease:'expo.out',immediateRender:false},t)});
   tl.to('#hz9x',{opacity:0,duration:.4},S+.9);
   
   // "locals": a ripple runs across the slats
   SL.forEach((e,i)=>tl.fromTo(e.querySelector('.sh9x'),{opacity:0},{keyframes:{opacity:[0,.16,0]},duration:.9,ease:'sine.inOut',immediateRender:false},C('locals')-.3+i*.06));
   // split-flap flips
   const FLIP=(k0,k1,t0)=>SL.forEach((e,i)=>{const t=t0+i*.045,cx=e.dataset.cx+' 470';
     tl.to(e,{keyframes:[{scaleX:0,duration:.16,ease:'power2.in'},{scaleX:1,duration:.34,ease:'expo.out'}],svgOrigin:cx},t);
     tl.set(e.querySelectorAll('.si'+k0),{opacity:0},t+.16);tl.set(e.querySelectorAll('.si'+k1),{opacity:1},t+.16)});
   FLIP(0,1,C('design')-.15);FLIP(1,2,C('remember')-.35);
      // "private visits": the slats fall away in sequence, opening the stage for GUIDES
   SL.forEach((e,i)=>tl.to(e,{y:420,rotation:(i%2?6:-6),opacity:0,svgOrigin:e.dataset.cx+' 470',duration:.45,ease:'power3.in'},C('visits')-.4+i*.03));
   // 2 GUIDES rises through a slot, photo pans inside the letters
   LT('.lG',572+250,572,C('guides')-.4,.05,.65);
   tl.fromTo('#wG9x use',{x:-40,scale:1.08,svgOrigin:'500 500'},{x:40,scale:1,svgOrigin:'500 500',duration:C('champagne')-C('guides')+.8,ease:'none',immediateRender:false},C('guides')-.4);
   EX('.lG',572-250,C('champagne')-.6);
   // 3 CHAMPAGNE rises, bubbles lift, then the word splits open like a cellar door on "opened"
   LT('.lC',546+170,546,C('champagne')-.3,.04,.6);
   tl.fromTo('#wC9x use',{x:40},{x:-40,duration:C('weekend')-C('champagne')+.6,ease:'none',immediateRender:false},C('champagne')-.3);
   // "opened": the two halves swing open like cellar doors (they fold back towards their hinges), and in the doorway a flute draws itself and fills, bubbles rising
   const X0=+D0.getAttribute('x'),X1=2*500-X0,DS=C('opened')-.25;
   tl.fromTo('#dL9x',{scaleX:1,skewY:0,svgOrigin:X0+' 496'},{scaleX:.62,skewY:12,svgOrigin:X0+' 496',duration:.85,ease:'expo.inOut',immediateRender:false},DS);
   tl.fromTo('#dR9x',{scaleX:1,skewY:0,svgOrigin:X1+' 496'},{scaleX:.62,skewY:-12,svgOrigin:X1+' 496',duration:.85,ease:'expo.inOut',immediateRender:false},DS);
   tl.to('.fls9x',{attr:{'stroke-dashoffset':0},duration:.6,ease:'power2.inOut',stagger:.18},DS+.4);
   tl.to('#flq9x',{attr:{y:410,height:114},duration:.9,ease:'power2.out'},DS+.85);
   document.querySelectorAll('.fb9x').forEach((b,k)=>{const t=DS+1.0+k*.11;tl.fromTo(b,{y:0,opacity:0},{y:-104-(k%3)*6,keyframes:{opacity:[0,1,1,0]},duration:.9+(k%3)*.15,ease:'sine.in',repeat:1,immediateRender:false},t)});
   document.querySelectorAll('.bb9x').forEach((b,k)=>{const t=DS+1.25+k*.08,d=1.1+(k%4)*.2;
     tl.fromTo(b,{y:0,x:0,opacity:0},{y:-150-(k%5)*24,x:((k%3)-1)*20,keyframes:{opacity:[0,.8,.8,0]},duration:d,ease:'sine.out',immediateRender:false},t)});
   tl.to(cam,{z:portrait?.88:.9,duration:.7,ease:'expo.inOut'},DS);
   tl.to(cam,{z:portrait?.92:.94,duration:C('weekend')-C('opened')-.95,ease:'sine.inOut'},C('opened')+.5);
   // exit: doors swing shut onto the glass, everything folds away
   tl.to('#dL9x',{scaleX:0,svgOrigin:X0+' 496',opacity:0,duration:.42,ease:'power3.in'},C('weekend')-.5);tl.to('#dR9x',{scaleX:0,svgOrigin:X1+' 496',opacity:0,duration:.42,ease:'power3.in'},C('weekend')-.5);
   tl.to('#fl9x',{scale:.5,y:-40,opacity:0,svgOrigin:FLX+' 520',duration:.4,ease:'power3.in'},C('weekend')-.45);
   // 4 a horizon draws on "weekend", the sun rises, COTSWOLDS rises from behind the hills
   G2('.lT').forEach(L=>L.forEach((el,k)=>{const t0=C('weekend')-.05+k*.06,a=Math.sin(k*.85);
     tl.fromTo(el,{attr:{y:546+170}},{keyframes:[{attr:{y:546-46*a-14},duration:.32,ease:'power2.out'},{attr:{y:546+20*a},duration:.34,ease:'sine.inOut'},{attr:{y:546-6*a},duration:.26,ease:'sine.inOut'},{attr:{y:546},duration:.4,ease:'expo.out'}],immediateRender:false},t0)}));
   tl.fromTo('#wT9x use',{x:-40,scale:1.08,svgOrigin:'500 500'},{x:40,scale:1,svgOrigin:'500 500',duration:C('sometimes')-C('weekend')+.4,ease:'none',immediateRender:false},C('weekend')-.1);
   EX('.lT',546+170,C('sometimes')-.45,.03);
   // 5 "And sometimes..." a single dot waits; "something truly unusual" draws a question mark that fills with a tiny planet
   // the question mark is drawn: the dot's outline traces itself and fills, then the hook is traced in one stroke and fills,
   // the coloured layers slide out from behind it; on "unusual" it leans gently; it leaves with a push as the tape slides in
   const QD='506 707';
   tl.set('#qD9x,#qH9x',{opacity:1},0);tl.set('#qD9x circle',{attr:{'stroke-dashoffset':1,'fill-opacity':0}},0);tl.set('#qH9x text',{attr:{'stroke-dashoffset':2100,'fill-opacity':0}},0);
   tl.set('#ql9x1,#ql9x2',{opacity:0,x:0,y:0},0);tl.set('#qG9x',{rotation:0,scale:1},0);tl.set('#q9x',{x:0},0);
   tl.to('#qD9x circle',{attr:{'stroke-dashoffset':0},duration:.7,ease:'power2.inOut'},C('sometimes')+.05);
   tl.to('#qD9x circle',{attr:{'fill-opacity':1},duration:.45,ease:'power1.inOut'},C('sometimes')+.6);
   tl.to('#qH9x text',{attr:{'stroke-dashoffset':0},duration:1.1,ease:'power2.inOut'},C('something')-.25);
   tl.to('#qH9x text',{attr:{'fill-opacity':1},duration:.5,ease:'power1.inOut'},C('something')+.7);
   tl.set('#ql9x1,#ql9x2',{opacity:1},C('something')+1.15);
   [1,2].forEach(k=>tl.fromTo('#ql9x'+k,{x:0,y:0},{x:12*k,y:12*k,duration:.9,ease:'expo.out',immediateRender:false},C('something')+1.15+k*.06));
   tl.to('#qG9x',{rotation:-6,scale:1.05,svgOrigin:'506 760',duration:.6,ease:'power2.out'},C('unusual')-.1);
   tl.to('#qG9x',{rotation:-3,scale:1.02,svgOrigin:'506 760',duration:1.2,ease:'sine.inOut'},C('unusual')+.5);
   [1,2].forEach(k=>tl.to('#ql9x'+k,{keyframes:[{x:18*k,y:18*k,duration:.6,ease:'power2.out'},{x:12*k,y:12*k,duration:1.1,ease:'sine.inOut'}]},C('unusual')-.1));
   tl.to('#q9x',portrait?{x:-1250,duration:.85,ease:'expo.inOut'}:{y:-1150,duration:.85,ease:'expo.inOut'},E-.3);
   tl.fromTo('#ms9x',portrait?{x:1250,y:0}:{x:0,y:1150},{x:0,y:0,duration:.85,ease:'expo.inOut',immediateRender:false},E-.3);
   // 6 made to measure: a tape measure snaps out, the three moments land on it, the seal stamps
   tl.to('#tcr9x',{attr:{width:880},duration:.75,ease:'expo.out'},E+.25);
   tl.fromTo('.cc9x',{opacity:0,y:-150,scale:.7,svgOrigin:'500 520'},{opacity:1,y:0,scale:1,duration:.6,ease:'expo.out',stagger:.13,immediateRender:false},C('made')-.4);
   tl.fromTo('.lb9x',{opacity:0,y:20},{opacity:1,y:0,duration:.5,ease:'expo.out',stagger:.13,immediateRender:false},C('made')-.2);
   tl.fromTo('#seal9x',{opacity:0,scale:2.4,rotation:-30,transformOrigin:'50% 50%'},{opacity:1,scale:1,rotation:0,duration:.3,ease:'power4.in',immediateRender:false},C('measure')-.3);
   tl.fromTo('#seal9x',{rotation:0},{rotation:6,duration:2.5,ease:'sine.out',immediateRender:false},C('measure'))}
  tl.to('#car0,#road,#roadC',{opacity:0,duration:.5,ease:'power2.inOut'},SA('a8')+1.05);tl.to('#car0,#road,#roadC',{opacity:1,duration:.35,ease:'power2.inOut'},SA('a8b')-.5);
  // A10 white label: the confirmation flips from our brand to the agency's name
  tl.fromTo('#flip10',{y:80,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',duration:1,ease:'expo.out'},SA('a10')+.15);
  {const F=C('white')-.1;tl.to('#flip10',{scaleX:0,svgOrigin:'500 440',duration:.35,ease:'power2.in'},F);tl.set('#back10',{opacity:0},F+.35);tl.set('#front10',{opacity:1},F+.35);
   tl.to('#flip10',{scaleX:1,svgOrigin:'500 440',duration:.6,ease:'back.out(1.7)'},F+.35);
   tl.fromTo('#sheen10',{x:0,opacity:0},{keyframes:{opacity:[0,.75,0]},x:450,duration:.8,ease:'power2.inOut'},F+.9)}
  tl.to('#ul10',{attr:{'stroke-dashoffset':0},duration:.5,ease:'power2.out'},C('name')-.35);
  tl.to('#flip10',{scale:1.04,svgOrigin:'500 440',duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'},C('name')-.1);
  // A11 trust
  [['#tr1','maisons'],['#tr2','agencies'],['#tr3','vic']].forEach(([id,w])=>{tl.fromTo(id,{x:140,autoAlpha:0},{x:0,autoAlpha:1,duration:.75,ease:'expo.out'},C(w)-.4);tl.from(id+' .ic2',{scale:.4,opacity:0,transformOrigin:'50% 50%',duration:.6,ease:'back.out(2.2)'},C(w)-.2)});
