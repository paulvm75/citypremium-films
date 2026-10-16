import json, math, re
PH='/tmp/claude-0/geo/node_modules/@phosphor-icons/core/assets/'
def icon(name, cx, cy, size, color, weight='duotone', cls='', iid=''):
    f=PH+weight+'/'+name+('' if weight=='regular' else '-'+weight)+'.svg'
    svg=open(f).read(); inner=svg[svg.index('>')+1:svg.rindex('</svg>')]
    a=(f' class="{cls}"' if cls else '')+(f' id="{iid}"' if iid else '')
    return f'<g{a} fill="{color}"><g transform="translate({cx-size/2:.1f} {cy-size/2:.1f}) scale({size/256:.4f})">{inner}</g></g>'
src = open('/home/claude/cp/v18.html').read()
s = src
def rep(a, b, n=1):
    global s
    assert a in s, a[:100]
    s = s.replace(a, b, n)
def cut(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i)
    s = s[:i] + new + s[j:]

SER = "font-family=\"'Cormorant','Cormorant Garamond',Georgia,serif\""
IV, ON, INK, SIL = '#F4F2ED', '#0E0F14', '#16171D', '#C9CDD8'

exec(open('/home/claude/mz/scenes.py').read())

stations = m1 + m2 + m3 + m4 + m5 + m6 + m7 + m8 + m9 + m10
cut('<!-- s1 countdown -->', '<use id="car0"', stations)
rep('riser:"__RISER__"}', 'riser:"__RISER__",pop:"__POP__",popl:"__POPL__",shim:"__SHIM__",paper:"__PAPER__",seal:"__SEAL__",door:"__DOOR__",chime:"__CHIME__",whoosh:"__WHOOSH__",click:"__CLICK__",flick:"__FLICK__",light:"__LIGHT__",satin:"__SATIN__"}')
rep("['logo','swish','tick','car','jet','phone','keycard','riser'].forEach(k=>{if(ASSET[k]", "['logo','swish','tick','car','jet','phone','keycard','riser','pop','popl','shim','paper','seal','door','chime','whoosh','click','flick','light','satin'].forEach(k=>{if(ASSET[k]")
rep('<filter id="ds"', '''<linearGradient id="ivG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FAF9F5"/><stop offset="1" stop-color="#ECE9E2"/></linearGradient>
  <linearGradient id="silv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9DA1AC"/><stop offset=".42" stop-color="#F6F7FA"/><stop offset=".58" stop-color="#B3B7C2"/><stop offset="1" stop-color="#E8EAF0"/></linearGradient>
  <linearGradient id="silvL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E929E"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A9ADB8"/></linearGradient>
  <linearGradient id="sheen" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,0)"/><stop offset=".5" stop-color="rgba(255,255,255,.85)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>
  '''+EXTRA_DEFS+'''<filter id="ds"''')
# the road becomes a fine silver line
rep('<path id="road" fill="none" stroke="rgba(238,240,246,.07)" stroke-width="70" stroke-linecap="round"/>', '<path id="road" fill="none" stroke="rgba(201,205,216,.10)" stroke-width="46" stroke-linecap="round"/>')
rep('<path id="roadC" fill="none" stroke="rgba(238,240,246,.28)" stroke-width="4" stroke-dasharray="30 34"/>', '<path id="roadC" fill="none" stroke="rgba(201,205,216,.30)" stroke-width="2.5" stroke-dasharray="18 26"/>')

# ------------------------------------------------------------------ text
TXT = {
 'm1': "You've invited ^forty|of your most|important clients|to *Paris.|Each one expects|to feel like|the !only !one.",
 'm2': "For a *luxury|*fashion *brand,|the guest programme|is part of the ^brand.|Every handover|carries *your *name,|from the aircraft door|to the last car home.",
 'm3': "*Monday,|nine in the morning.|Mr and Mrs Cavendish|land at *Le *Bourget.|Their chauffeur|is already waiting|on the tarmac.|He will be theirs,|and ^only ^theirs,|all week.",
 'm4': "Their personal ^host|knows how they|take their coffee,|which seat they prefer,|and that Mrs Cavendish|never likes to !wait.",
 'm5': "*Tuesday evening,|the !show.|Forty guests,|forty cars,|one arrival time.|We direct it ^on ^site,|with every car|coordinated live,|so forty guests|arrive like !four.",
 'm6': "*Wednesday,|Mrs Cavendish mentions|an exhibition she missed.|By evening,|the ^museum is *open,|just for ^them.|Because the moments|that matter !most|are !never for sale.",
 'm7': "And *behind *the *scenes,|we look after|your own ^team too.|The|*executives|flying in,|the client ^advisors,|the people behind|the show.|Their ^cars, their ^hotels,|their early|^mornings|and their late !nights.",
 'm8': "^Flights,|private ^jets,|the right *suite,|and anything *in *between.",
 'm9': "!Friday.|The *same chauffeur|drives them back|to the ^plane.|They will remember|the !week.|They will remember|^your ^brand.",
 'm10': "Since !2010,|luxury *Maisons|have ^trusted us|with their most|important ^guests.",
}
LT = {'m4', 'm7', 'm8'}
blocks = ''
for k, v in TXT.items():
    blocks += f'  <div class="tb{" lt" if k in LT else ""}" data-sc="{k}"><p class="kt" data-say="{v}"></p></div>\n'
blocks += '  <div class="tb center mid" data-sc="m11"><p class="kt s" data-say="City Premium." data-hidden="1"></p><p class="kt s" data-say="Behind every|great ^guest ^list."></p><p class="kt s" data-say="Book a meeting with us today." data-hidden="1"></p></div>\n'
cut('  <div class="tb" data-sc="s1">', '</div>\n\n<div class="ov" id="logoOv"', blocks)

# ------------------------------------------------------------------ CSS
rep('.st[data-st="s8"] .tile8>rect{fill:#FFFFFF}', '.tl{stroke:color-mix(in srgb,var(--ink) calc(var(--tone)*100%),var(--paper))}')
rep(':root{--ink:#0F1426;--paper:#EEF0F6;--acc:#9FB0FF;', ':root{--ink:#121318;--paper:#F4F2ED;--acc:#B9BFDA;')

# ------------------------------------------------------------------ JS: scenes, layout
SC = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11']
rep("const SCN=['s1','s2','s3','s4','s5','s6','s7a','s7b','s8','s9','s10','s11','s12']", "const SCN=" + json.dumps(SC).replace('"', "'"))
POS = {'m1':[0,0],'m2':[2200,-420],'m3':[4400,160],'m4':[6600,-380],'m5':[8800,180],'m6':[11000,-400],'m7':[13200,160],'m8':[15400,-360],'m9':[17600,180],'m10':[19800,-340]}
rep("const POS={s1:[0,0],s2:[2200,-420],s3:[4400,160],s5:[6600,-380],s6:[8800,180],s7a:[11000,-400],s7b:[13200,160],s8:[15400,-360],s9:[17600,180],s10:[19800,-340],s11:[22000,140]};",
    "const POS=" + json.dumps(POS).replace('"', '') + ";")
rep("const ROAD=crPath([[-1800,450],...RP,[23800,570]]);", "const ROAD=crPath([[-1800,450],...RP,[21600,570]]);")
i = s.index('// static builders'); j = s.index("const STS=")
s = s[:i] + s[j:]
rep("const STS=$$('.st').map(el=>({el,sc:{s1:['s1'],s2:['s2'],s3:['s3','s4'],s5:['s4','s5'],s6:['s6'],s7a:['s7a'],s7b:['s7b'],s8:['s8'],s9:['s9'],s10:['s10'],s11:['s11']}[el.dataset.st]}));",
    "const STS=$$('.st').map(el=>({el,sc:[el.dataset.st]}));")
rep("const chN=$$('#chainNodes>g'),chL=$$('#chainLines path');let chT=[];", "")
TONE = {'m1':'#0E0F14','m2':'#141A33','m3':'#2B3150','m4':'#F4F2ED','m5':'#0E0F14','m6':'#0E0F14','m7':'#F4F2ED','m8':'#F4F2ED','m9':'#1B2140','m10':'#0E0F14','m11':'#0E0F14'}
rep("const TONE={s1:'#0F1426',s2:'#0F1426',s3:'#EEF0F6',s4:'#0F1426',s5:'#5A6690',s6:'#0F1426',s7a:'#0F1426',s7b:'#2B3561',s8:'#EEF0F6',s9:'#C7CEF0',s10:'#0F1426',s11:'#0F1426',s12:'#0F1426'};",
    "const TONE=" + json.dumps(TONE).replace('"', "'") + ";")
rep("const LIGHT={s3:1,s8:1,s9:1};", """const LIGHT={m4:1,m7:1,m8:1};
const GBM={'#0E0F14':'radial-gradient(70% 60% at 82% 10%,rgba(201,205,216,.16),rgba(201,205,216,0) 62%),radial-gradient(60% 60% at 6% 96%,rgba(120,110,200,.14),rgba(120,110,200,0) 60%),linear-gradient(160deg,#15161C,#08090C)',
 '#141A33':'radial-gradient(70% 60% at 80% 8%,rgba(185,191,218,.28),rgba(185,191,218,0) 62%),radial-gradient(60% 60% at 0% 100%,rgba(70,80,160,.3),rgba(70,80,160,0) 60%),linear-gradient(170deg,#1A2140,#0C1024)',
 '#2B3150':'radial-gradient(80% 55% at 70% 0%,rgba(240,238,250,.38),rgba(240,238,250,0) 62%),linear-gradient(180deg,#3A4166 0%,#2B3150 55%,#1A1E33 100%)',
 '#F4F2ED':'radial-gradient(60% 58% at 88% 8%,rgba(255,255,255,.9),rgba(255,255,255,0) 62%),radial-gradient(55% 55% at 4% 100%,rgba(205,208,224,.55),rgba(205,208,224,0) 62%),#F1EFEA',
 '#1B2140':'linear-gradient(180deg,#141A33 0%,#2E3560 48%,#8C8DB3 82%,#D9D6E4 100%)'};
const GB=id=>GBM[TONE[id]]||TONE[id];
const MB={v:0};""")
rep("let prev=TONE.s1", "let prev=TONE.m1")
rep(":TONE[id];document.querySelector('#panels').appendChild(d);", ":GB(id);document.querySelector('#panels').appendChild(d);")
rep("d.style.background=id==='s7b'?", "d.style.background=id==='none'?")
rep("const t=p.id==='s4'?SA('s4')-.45:SA(p.id)-.3;p.t=t;if(p.id==='s4')", "const t=SA(p.id)-(p.id==='m10'?.45:.3);p.t=t;if(p.id==='m10')")
rep("  J1.a0=C('lands')-.6;J1.o0=C('bourget')-.1;J1.o1=C('forty')+.35;\n", "")

# camera
i = s.index("  // zoom-through: punch into the dial's centre"); j = s.index("  // the car drives the road between scenes")
s = s[:i] + open('/home/claude/mz/cam.js').read() + s[j:]
rep("const go=(id,t,o={})=>{const [x,y]=POS[id];tl.to(cam,{x,y,z:o.z||1,sx:o.sx||.72,sy:o.sy||.5,dim:o.dim||0,duration:o.d||1.3,ease:o.ease||'expo.inOut'},t)};",
    "const go=(id,t,o={})=>{if(o.dip!==1)tl.to(MB,{keyframes:[{v:1,duration:(o.d||1.3)*.5,ease:'power2.in'},{v:0,duration:(o.d||1.3)*.5,ease:'power2.out'}]},t);const d=o.d||1.3,z=o.z||1,x=POS[id][0]+(o.px||500)-500,y=POS[id][1]+(o.py||500)-500;tl.to(cam,{x,y,sx:o.sx||.72,sy:o.sy||.5,dim:o.dim||0,duration:d,ease:o.ease||'expo.inOut'},t);tl.to(cam,{keyframes:[{z:z*(o.dip||.78),duration:d*.5,ease:'power2.inOut'},{z,duration:d*.5,ease:'power3.out'}]},t)};")
rep("const t=(k==='s5'?SA('s5')-.35:SA(k)-.15);", "const t=SA(k)-.15;")
rep("duration:k==='s5'?1.2:1.3,ease:'expo.inOut',immediateRender:false", "duration:1.3,ease:'expo.inOut',immediateRender:false")
rep("tl.fromTo(cam,{z:1.25},{z:1,duration:2.2,ease:'power2.out'},0);", "")

# scene timelines: replace S1 through S11 with ours; keep only the S12 call to action
i = s.index("  // S1 hurry"); j = s.index("  // S12 the whole journey")
s = s[:i] + open('/home/claude/mz/tl.js').read() + s[j:]
rep("C('book#2')", "C('book')", 99)
rep("const ct=C('city#2')-.3;", "const ct=C('city#1')-.3;")
rep("tl.fromTo('#rip',{x:()=>cw()*.62-W*.03,y:()=>chh()*.45-W*.03,scale:.3,opacity:.9},{scale:3,opacity:0,duration:.6},C('book')+1.15);","tl.set('#rip',{opacity:0},0);tl.fromTo('#rip',{x:()=>cw()*.62-W*.03,y:()=>chh()*.45-W*.03,scale:.3,opacity:.9},{scale:3,opacity:0,duration:.6,immediateRender:false},C('book')+1.15);")

# sound
i = s.index("['s3','s6','s7a','s7b','s8','s9','s10','s11'].forEach"); j = s.index("SFX.sort(")
s = s[:i] + open('/home/claude/mz/sfx.js').read() + s[j:]

# per-frame
i = s.index("function jet1(t){"); j = s.index("function toneAt(t)")
s = s[:i] + open('/home/claude/mz/frame.js').read() + s[j:]
rep("VIS.forEach((c,i)=>{const first=i===0||VIS[i-1].sc!==c.sc;if(!first)add('swish',c.t-.08,.22);c.words.forEach(w=>{if(w.hl)add('tick',w.t+.1,.3)})});", "VIS.forEach(c=>c.words.forEach(w=>{if(w.hl)add('tick',w.t+.1,.12)}));")
rep('function find(k){', JSDATA + 'const EMPH=%s;function emf(t){let d=0;for(const [a,b] of EMPH){const u=Math.min(1,Math.max(0,(t-(a+VO_OFF-.25))/.2))*Math.min(1,Math.max(0,((b+VO_OFF+.35)-t)/.3));d=Math.max(d,u)}const VE=WORDS.length?Math.max(...WORDS.map(w=>w.b)):94;return (1-.2*d)*(1+1.5*Math.min(1,Math.max(0,(t-VE)/.8)))}' % open('/home/claude/mz/emph.json').read() + '\nfunction find(k){')
rep('mu.volume=Math.max(0,DUCK*', 'mu.volume=Math.max(0,DUCK*emf(t)*')
rep('DUCK+=((sp?.36:.6)-DUCK)', 'DUCK+=((sp?.24:.284)-DUCK)')
rep('.volume=Math.min(1,s.v)', '.volume=Math.min(1,s.v*1.1)')
rep("jet1(t);relay(t);dialFx(t);", "frameM(t);")
rep("SA('s12')", "SA('m11')", 99)
i = s.index("  {const sec=Math.max(0,2400"); j = s.index("  $('#text').querySelectorAll('.tb')")
s = s[:i] + s[j:]
rep("v=o.sc.includes('s11')?", "v=o.sc.includes('m10')?")
rep("let DUCK=.55,T=C('city#1')+1.2", "let DUCK=.16,T=0")

# colour and transitions
rep('<div id="panels"></div>', '<div id="panels"></div><div id="glow"><i></i><i></i><i></i></div>')
rep('#panels{position:absolute;inset:0}', '#glow{position:absolute;inset:0;pointer-events:none;opacity:.22}#glow i{position:absolute;width:80cqmax;height:80cqmax;left:0;top:0;will-change:transform}#glow i:nth-child(1){background:radial-gradient(closest-side,rgba(201,205,216,.9),rgba(201,205,216,0))}#glow i:nth-child(2){background:radial-gradient(closest-side,rgba(140,130,210,.7),rgba(140,130,210,0))}#glow i:nth-child(3){background:radial-gradient(closest-side,rgba(255,255,255,.7),rgba(255,255,255,0))}#panels{position:absolute;inset:0}')
rep('<svg id="world" xmlns="http://www.w3.org/2000/svg">', '<svg id="world" xmlns="http://www.w3.org/2000/svg"><defs><filter id="mb" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB"><feGaussianBlur id="mbB" stdDeviation="0 0"/></filter></defs>')
# playback 5% faster: page clock, voice and music
rep('let t=base+(performance.now()-t0)/1000;', 'let t=base+(performance.now()-t0)/1000*1.05;')
rep('vo.currentTime=v;vo.play()', 'vo.currentTime=v;vo.playbackRate=1.05;vo.play()')
rep('mu.currentTime=Math.min(T,(mu.duration||75)-.1);mu.play()', 'mu.currentTime=Math.min(T,(mu.duration||75)-.1);mu.playbackRate=1.05;mu.play()')
s = re.sub(r'<title>[^<]*</title>', '<title>City Premium for Maisons</title>', s, 1)
open('/home/claude/mz/mz1.html', 'w').write(s)
print('ok', len(s))
