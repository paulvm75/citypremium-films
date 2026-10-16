  const foc=(id,px,py,z,t,d=1,ease='power3.inOut')=>{if(portrait){py=Math.min(py,480);z=Math.min(z,1.05)}return tl.to(cam,{x:POS[id][0]+px-500,y:POS[id][1]+py-500,z,duration:d,ease},t);};
  // m1: close on the first envelope, pull back as it splits into forty, then push into the one that opens
  tl.set(cam,{x:0,y:0,z:1.22},0);
  tl.to(cam,{z:1.3,duration:Math.max(.4,C('forty#1')-.5),ease:'sine.inOut'},0);
  tl.to(cam,{z:1.0,duration:1.5,ease:'expo.inOut'},C('forty#1')-.45);
  tl.to(cam,{z:1.05,duration:Math.max(.5,C('only')-C('forty#1')-1.4),ease:'sine.inOut'},C('forty#1')+1.1);
  foc('m1',500,500,1.18,C('only')-.45,1.0);
  go('m2',SA('m2')+.2,{z:1.0,py:400});
  tl.to(cam,{z:1.06,duration:5,ease:'sine.inOut'},SA('m2')+1.6);
  go('m3',SA('m3')-.15,{z:1.06,py:300});
  foc('m3',500,330,1.22,C('chauffeur#1')-.5,1.0);
  foc('m3',500,480,1.0,C('he')-.45,1.1);
  go('m4',SA('m4')-.15,{z:.98,py:520});
  foc('m4',500,560,1.1,C('coffee')-.7,1);foc('m4',500,700,1.1,C('wait')-.9,1);
  go('m5',SA('m5')-.15,{z:1.08,py:520});
  foc('m5',500,600,1.14,C('coordinated')-.6,1.2);foc('m5',620,600,1.22,C('arrive')-.5,1.2);
  go('m6',SA('m6')-.15,{z:1.0,py:510});
  tl.to(cam,{z:1.06,duration:7,ease:'sine.inOut'},SA('m6')+1);
  go('m7',SA('m7')-.15,{z:1.14,py:550});
  tl.to(cam,{z:1.2,duration:10,ease:'sine.inOut'},SA('m7')+1);
  go('m8',SA('m8')-.15,{z:1.12,py:360});
  foc('m8',500,560,1.14,C('jets')-.45,.8);foc('m8',500,790,1.14,C('suite')-.45,.8);foc('m8',500,560,.98,C('between')-.5,1);
  go('m9',SA('m9')-.15,{z:1.0,py:430});
  foc('m9',540,540,1.12,C('chauffeur#2')-.5,1.4);foc('m9',500,560,1.0,C('remember#1')-.5,1);foc('m9',500,385,1.02,C('remember#2')-.7,1.1);
  {const TT=C('brand#3')-.48,zA=portrait?1.07:1.12,zB=portrait?1.04:1.08;tl.to(MB,{keyframes:[{v:.35,duration:.12,ease:'power2.in'},{v:0,duration:.4,ease:'power2.out'}]},TT+.28);tl.to(cam,{keyframes:[{z:zA,duration:.22,ease:'power2.out'},{z:zB,duration:1.2,ease:'power3.out'}]},TT+.36)}
  go('m10',SA('m10')-.15,{z:.98});
  tl.to(cam,{z:1.08,duration:4,ease:'sine.inOut'},SA('m10')+.9);
  {const kf=portrait?Math.min(W*.92,H*.5)/1000:Math.min(W*.5,H*.86)/1000;const zf=(W*.98)/(22400*kf);tl.to(cam,{x:9900,y:-90,z:zf,sx:.5,sy:.42,dim:.7,duration:2.2,ease:'power3.inOut'},SA('m11')-.3)}
