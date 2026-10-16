// the road car carries every transition
['m3','m4','m5','m6','m7','m8','m9','m10'].forEach(k=>add('car',SA(k)-.3,.17));add('car',SA('m2')+.05,.17);
// m1 envelopes
{const F=C('forty#1'),O=C('only');add('flick',.08,.22);add('flick',F-.34,.14);add('flick',F-.34+(EDEPTH-1)*.3,.12);
 add('click',C('expects')-.1,.18);add('flick',O+.36,.24);add('flick',O+.6,.18)}
// m2 ribbon
add('satin',SA('m2')+.25,.26);add('click',C('name')-.45,.12);add('click',C('home')-.1,.2);add('satin',C('home')-.05,.2);
{const a=C('aircraft')-.1,b=C('home')+.25;for(let i=0;i<6;i++)add('click',a+i*(b-a)/5,.08)}
// m3 arrival, chauffeur badge, week stamps
add('jet',SA('m3')-.45,.3);add('whoosh',C('chauffeur#1')-.45,.2);add('click',C('chauffeur#1')-.05,.16);add('click',C('waiting')-.35,.12);add('flick',C('he')-.3,.14);
{const W0=C('only#2')-.2,W1=C('week#1')+.15;for(let i=0;i<5;i++)add('click',W0+(W1-W0)*i/4,.1)}
// m4 host
add('flick',SA('m4')+.1,.22);['coffee','prefer','wait'].forEach(w=>add('click',C(w)-.6,.1));
// m5 forty cars to four
for(let i=0;i<8;i++)add('click',C('guests#1')-.45+i*.12,.06);add('click',C('time')-.1,.14);
add('whoosh',C('coordinated')-.5,.2);add('car',C('four')-.35,.22);add('click',C('four')+.05,.2);
// m6 gallery lights
{const L0=C('museum')-.35;for(let r=0;r<12;r+=2)add('light',L0+r*.15,.178);add('light',L0+12*.15+.1,.243);add('click',C('never#2')-.4,.12)}
// m7 team
add('flick',C('look')-.25,.24);TQ().forEach(t=>add('click',t,.07));
// m8 travel
['flights','jets','suite'].forEach(w=>add('flick',C(w)-.4,.2));
// m9 departure
add('click',C('chauffeur#2')+.1,.1);add('car',C('drives')-.65,.26);add('click',C('back')-.1,.12);add('jet',C('plane')-.15,.32);add('flick',C('remember#1')-.35,.14);add('satin',C('remember#2')-.55,.24);add('satin',C('brand#3')-.45,.2);add('click',C('brand#3')-.06,.16);
// m10, the one shimmer
add('shim',C('2010')-.35,.16);
add('logo',C('city#1')-.3,.3);add('pop',C('book')-.25,.2);add('click',C('book')+1.15,.24);
