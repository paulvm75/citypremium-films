  // A1 one flight path into Paris, then the itinerary card settles in
  {const L=C('paris#1')+.25,t0=.1,FP=document.querySelector('#fa1s'),FL=FP.getTotalLength(),PR={p:0},TR=[...document.querySelectorAll('.ft1')];
   // one progress value drives the jet, its line, its comet trail and the camera, so nothing can drift out of sync
   const at=p=>FP.getPointAtLength(FL*Math.max(0,Math.min(1,p)));
   const drive=()=>{const p=PR.p,a=at(p),b=at(p+.004),c=at(p-.004),ang=Math.atan2(b.y-c.y,b.x-c.x)*180/Math.PI;
     document.querySelector('#jw1').setAttribute('transform',`translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
     FP.setAttribute('stroke-dashoffset',(1-p).toFixed(4));document.querySelector('#fa1g').setAttribute('stroke-dashoffset',(1-p).toFixed(4));
     TR.forEach(e=>e.setAttribute('stroke-dashoffset',(+e.dataset.l-p).toFixed(4)));
     if(p<1){cam.x=a.x-500;cam.y=a.y-500}};
   tl.set(PR,{p:0},0);window.FLY=drive;
   tl.to(PR,{p:1,duration:L-t0,ease:'sine.inOut'},t0);
   tl.set('#jet1',{opacity:0},0);tl.to('#jet1',{opacity:1,duration:.2},.05);
   tl.to('.ft1',{opacity:0,duration:.5,ease:'power2.out'},L-.05);
   tl.to('#jet1',{scale:.2,opacity:0,transformOrigin:'50% 50%',duration:.35,ease:'power2.in'},L-.15);
   tl.from('#pin1',{scale:0,svgOrigin:'500 150',duration:.5,ease:'back.out(2.4)'},L-.25);
   tl.fromTo('#pin1r',{attr:{r:14},opacity:.9},{attr:{r:64},opacity:0,duration:1.1,repeat:1,ease:'power1.out'},L);
   tl.to('#fa1g',{opacity:0,duration:.8},L+.3)}
  tl.fromTo('#card1',{y:80,opacity:0,filter:'blur(12px)',scale:.95,svgOrigin:'500 570'},{y:0,opacity:1,filter:'blur(0px)',scale:1,svgOrigin:'500 570',duration:1.1,ease:'expo.out'},C('itinerary')-.6);
  tl.from('.row1',{y:18,opacity:0,duration:.7,stagger:.13,ease:'expo.out'},C('itinerary')-.3);
  tl.from('.ck1',{scale:0,transformOrigin:'50% 50%',duration:.45,stagger:.12,ease:'back.out(3)'},C('perfect')-.2);
  tl.from('#conf1',{scale:.6,opacity:0,svgOrigin:'700 364',duration:.5,ease:'back.out(2.2)'},C('perfect')+.15);
  // A2 your agency, then its partners orbiting it
  tl.from('#core',{scale:.6,opacity:0,svgOrigin:'500 500',duration:1,ease:'expo.out'},SA('a2')+.1);
  tl.to(RG,{r1:1,duration:1.2,ease:'power2.inOut'},C('dmc#1')-.6);
  tl.from('#dmcC .nb',{scale:0,opacity:0,transformOrigin:'50% 50%',duration:.6,ease:'back.out(2)'},C('dmc#1')-.1);
  tl.to(RG,{r2:1,duration:1.3,ease:'power2.inOut'},C('virtuoso')-.6);
  tl.from('#virC .nb',{scale:0,opacity:0,transformOrigin:'50% 50%',duration:.6,ease:'back.out(2)'},C('virtuoso')-.1);
  tl.fromTo(ORB,{n1:-55,n2:150},{n1:15,n2:178,duration:SA('a6')-SA('a2'),ease:'none'},SA('a2'));
  // A3 the moments nobody covers
  tl.set('.gk',{opacity:0,scale:0,transformOrigin:'50% 50%'},0);
  [['#gap0','aircraft','0 0'],['#gap1','restaurant','0 0'],['#gap2','two','0 0']].forEach(([id,w,o])=>{
    tl.fromTo(id,{opacity:0,scale:.5,filter:'blur(6px)',svgOrigin:o},{opacity:1,scale:1,filter:'blur(0px)',svgOrigin:o,duration:.7,ease:'expo.out'},C(w)-.3);
    tl.fromTo(id+' .gr',{attr:{r:40},opacity:1},{attr:{r:68},opacity:0,duration:1.4,repeat:2,ease:'sine.out'},C(w))});
