['a2','a6','a7','a8','a8b','a9','a9x','a10','a11'].forEach(k=>add('car',SA(k)-.12,k==='a7'?.26:.2));add('car',SA('a5')-.35,.18);
add('jet',C('lands')-.3,.22);add('logo',C('city#1')-.3,.32);add('logo',C('city#3')-.3,.32);add('riser',C('operator')-1.2,.24);
['dmc#1','virtuoso','aircraft','restaurant','two','gaps','exactly','need','directly','vip','bourget','farnborough','biggin','heathrow','charles','passport','customs','jet','zero','ad','maisons','agencies','vic'].forEach(w=>add('tick',C(w),.24));
add('jet',SA('a8b')-.45,.3);[['heathrow',0],['charles',1]].forEach(([w])=>{for(let n=0;n<3;n++)add('tick',C(w)-.15+.5+n*.13,.2)});add('popl',C('passport')-.05,.3);add('pop',C('fast')+.5,.2);add('pop',C('fast')+.65,.2);add('keycard',C('hotel'),.3);add('tick',C('book')+1.15,.4);
[0,1,2].forEach(i=>add('pop',C('itinerary')-.25+i*.12,.14));
add('pop',C('dmc#1')-.1,.28);add('pop',C('virtuoso')-.1,.28);add('popl',SA('a2')+.15,.25);
['aircraft','restaurant','two'].forEach(w=>add('popl',C(w)-.25,.3));
[0,1].forEach(i=>add('pop',C('orbit')-.35+i*.18,.24));[0,1,2].forEach(i=>{add('pop',C('gaps')+i*.28,.3);add('tick',C('gaps')+i*.28+.05,.18)});add('popl',C('operator')-.5,.3);add('logo',C('operator')+1.75,.2);add('pop',C('partners')-.4,.24);add('pop',C('partners')-.25,.24);add('pop',C('dmc#2')-.2,.24);add('pop',C('network')-.2,.24);
for(let i=0;i<8;i++)add('popl',SA('a6')+.15+i*.07,.12);['exactly','need','nothing'].forEach(w=>add('pop',C(w)-.02,.3));
add('popl',SA('a7')+.1,.22);add('pop',C('directly')+.2,.3);add('pop',C('vip'),.26);
['bourget','farnborough','biggin'].forEach(w=>add('pop',C(w)-.1,.28));for(let i=0;i<8;i++)add('popl',C('airports')+.2+i*.12,.1);
add('pop',C('heathrow')-.15,.26);add('pop',C('charles')-.15,.26);add('popl',C('airside')-.2,.28);add('tick',C('fast')-.15,.36);add('pop',C('passport')-.05,.26);add('pop',C('customs')-.05,.26);add('pop',C('want')-.28,.28);
['jet','hotel','ad'].forEach(w=>add('popl',C(w)-.4,.26));add('pop',C('clock')-.15,.3);
add('popl',SA('a10')+.15,.24);add('pop',C('white')+.3,.3);add('tick',C('name')-.3,.26);
['maisons','agencies','vic'].forEach(w=>add('popl',C(w)-.4,.24));add('pop',C('book')-.25,.32);
add('popl',C('itinerary')-.5,.3);add('tick',C('perfect')-.1,.2);
add('pop',C('paris#1')+.05,.3);add('pop',C('perfect')+.15,.28);for(let i=0;i<4;i++)add('popl',SA('a8b')+.15+i*.12,.12);for(let i=0;i<6;i++)add('pop',C('heathrow')-.2+i*.06,.06);add('popl',C('charles')+.2,.18);




add('shim',C('city#3')-.2,.18);

add('popl',SA('a9x')+.45,.16);add('tick',C('locals')-.15,.14);for(let i=0;i<10;i++){add('tick',C('design')-.1+i*.045,.06);add('tick',C('remember')-.3+i*.045,.06)};['visits','champagne','cotswolds'].forEach(w=>add('popl',C(w)-.2,.16));add('keycard',C('opened')-.1,.2);add('pop',C('sometimes')+.15,.12);add('popl',C('unusual')-.2,.2);for(let i=0;i<6;i++)add('tick',C('experience')-.25+i*.09,.1);[0,1,2].forEach(i=>add('pop',C('made')-.35+i*.13,.16));add('popl',C('measure')-.05,.3);

// v11 kinetic type: the clock rolls to two, the name board flips, the odometer runs to 2010 (soft mechanical ticks only)
[0,1,2].forEach(i=>add('tick',C('two')+.02+i*.05,.12));
for(let i=0;i<8;i++)add("tick",C("since")+.02+i*.06*(1+i*.1),.05);
// v13 day dial: soft ticks as the clock turns at the restaurant and at two
[0,1,2,3].forEach(i=>add('tick',C('restaurant')-.02+i*.05,.09));add('tick',C('two')+.17,.1);
// v14 ending: a soft click on each city word
['paris#3','london#2','europe#2'].forEach(w=>add('popl',C(w)-.05,.3));
// ---- v16: sound for the kinetic set pieces. One swish sample, pitched per animation type (r = playback rate):
// slow and low for big frame moves, mid for sweeps, fast and light for text.
{const CAf=(w,after)=>{for(const x of WORDS)if(x.n===w&&x.a>=after-.01)return x.a;return 0};
 // opening: a breath of air on the slit, a click per cut-out word, a low swish as the frame splits open
 add('swish',.05,.16,.55);[['your#1',.82],['lands',.92],['in#1',1.02]].forEach(([w,r])=>add('popl',C(w)-.06,.3,r));add('swish',C('tomorrow')-.14,.32,.62);
 // text: scene-opening lines get a soft swish, big words a quicker one, every other line a faint flick
 let last='';VIS.forEach((c,i)=>{if(c.t<2.2||c.sc==='a12')return;const first=c.sc!==last;last=c.sc;
   if(first)add('swish',c.t-.1,.1,1.1+.15*hash(i));else if(i%2===0)add('swish',c.t-.08,.045,1.65+.3*hash(i+3));
   c.words.forEach((w,j)=>{if(w.big&&!(c.sc==='a5'&&w.el.textContent.startsWith('operator')))add('swish',w.t-.08,.13,1.35+.1*hash(i+j))})});
 // day dial: it arrives, then the clock hand sweeps twice
 add('swish',C('aircraft')-.36,.14,.85);add('swish',C('restaurant')-.16,.17,1.0);add('swish',C('two')-.1,.17,.9);
 // that's / where, and the dive through the o
 add('popl',C('thats')-.05,.24,1.1);add('popl',C('where')-.05,.24,.95);add('swish',CAf('in',C('comes'))+.04,.3,.6);
 // operator: the o opens into the orbit
 add('swish',C('orbit')-.62,.18,.75);
 // towers draw on with light pencil ticks
 for(let i=0;i<6;i++)add('tick',C('city#2')-.55+i*.12,.05,1.3+.08*i);
 // map pull-out
 add('swish',C('airports')-.6,.16,.58);
 // fast track: a tick as each segment lands, rising in pitch
 [C('fast')+.5,C('passport')+.4,C('customs')+.35,C('want')-.05].forEach((t,k)=>add('tick',t-.05,.2,1+.12*k));
 // question mark draws; made-to-measure frame resizes twice
 add('swish',C('something')-.25,.12,.5);{const t0=CAf('every',80)-.12;add('swish',t0,.12,1.2);add('popl',t0+.62,.14,1.3);add('popl',t0+1.2,.14,1.45)}
 // white label blinds: three turns, each a run of soft ticks under a low swish
 [[C('white')-.52,.8],[CAf('your',90.5)-.15,.7],[SA('a11')-.15,.9]].forEach(([t,r])=>{add('swish',t,.16,r);for(let i=0;i<10;i++)add('tick',t+.04+i*.028,.05,.8+.03*i)});
 // ending: the frame splits open
 add('swish',CAf('europe',95)+.5,.32,.62);}
