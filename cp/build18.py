import base64,json,os,glob
d=os.path.dirname(os.path.abspath(__file__)); A=os.path.join(d,'assets6')
s=open(os.path.join(d,'v18.html')).read()
enc=lambda b,m:f"data:{m};base64,"+base64.b64encode(b).decode()
p=os.path.join(d,'fonts','ins','files','instrument-sans-latin-standard-normal.woff2');pi=p.replace('normal.woff2','italic.woff2')
css="@font-face{font-family:'Instrument Sans';font-weight:400 700;font-stretch:75%% 100%%;font-style:normal;font-display:block;src:url(%s) format('woff2')}@font-face{font-family:'Instrument Sans';font-weight:400 700;font-stretch:75%% 100%%;font-style:italic;font-display:block;src:url(%s) format('woff2')}"%(enc(open(p,'rb').read(),'font/woff2'),enc(open(pi,'rb').read(),'font/woff2'))
s=s.replace('__FONTS__',css)
s=s.replace('__LWIN__',''.join(f'<circle cx="{120+i*18}" cy="92" r="4"/>' for i in range(19)))
AP=[('LBG','Le Bourget · Paris',60,420),('BQH','Biggin Hill · London',520,420),('CDG','Charles de Gaulle · Paris',60,670),('LHR','Heathrow · London',520,670)]
s=s.replace('__AIRPORTS__',''.join(f'<g id="ap{i}"><rect x="{x}" y="{y}" width="420" height="220" rx="36" fill="rgba(238,240,246,.1)" stroke="rgba(238,240,246,.18)" stroke-width="2"/><text x="{x+40}" y="{y+118}" font-weight="600" font-size="100" fill="#EEF0F6">{c}</text><text x="{x+40}" y="{y+182}" font-size="32" fill="#C7CEF0">{n}</text><g class="apl"><use href="#jetT" x="{x+310}" y="{y+24}" width="84" height="84"/></g></g>' for i,(c,n,x,y) in enumerate(AP)))
s=s.replace('__EMBLEM__',enc(open(os.path.join(d,'emblem_pad.png'),'rb').read(),'image/png')).replace('__WORDMARK__',enc(open(os.path.join(d,'wordmark.png'),'rb').read(),'image/png'))
s=s.replace('__WORDS__',open(os.path.join(A,'words15.json')).read())
F={'VO':'vo15','MUSIC':'music13t','LOGO':'logo_c','SWISH':'swish_c','TICK':'tick_c','CAR':'car_c','JET':'jet_c','PHONE':'phone_c','KEYCARD':'keycard_c','RISER':'riser_c'}
for k,f in F.items(): s=s.replace(f'__{k}__',enc(open(os.path.join(A,f+'.mp3'),'rb').read(),'audio/mpeg'))
g=os.path.join(d,'fonts','gsap','dist')
inline='<script>'+open(os.path.join(g,'gsap.min.js')).read()+'</script><script>'+open(os.path.join(g,'MotionPathPlugin.min.js')).read()+'</script>'
cdn='<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MotionPathPlugin.min.js"></script>'
open(os.path.join(d,'cp-v18-render.html'),'w').write(s.replace('__GSAP__',inline))
open(os.path.join(d,'cp-v18-pub.html'),'w').write(s.replace('__GSAP__',cdn))
print('built',len(s)//1024,'KB')
