import json, math, re
PH='/tmp/claude-0/geo/node_modules/@phosphor-icons/core/assets/'
def icon(name, cx, cy, size, color, weight='duotone', cls='', iid=''):
    f=PH+weight+'/'+name+('' if weight=='regular' else '-'+weight)+'.svg'
    svg=open(f).read(); inner=svg[svg.index('>')+1:svg.rindex('</svg>')]
    a=(f' class="{cls}"' if cls else '')+(f' id="{iid}"' if iid else '')
    return f'<g{a} fill="{color}"><g transform="translate({cx-size/2:.1f} {cy-size/2:.1f}) scale({size/256:.4f})">{inner}</g></g>'
src = open('/home/claude/cp/v18.html').read()
M = json.load(open('/home/claude/ta/mapw.json'))
s = src

def rep(a, b, n=1):
    global s
    assert a in s, a[:100]
    s = s.replace(a, b, n)

def cut(a, b, new):
    """replace text from marker a (inclusive) up to marker b (exclusive)"""
    global s
    i = s.index(a); j = s.index(b, i)
    s = s[:i] + new + s[j:]

# ------------------------------------------------------------------ stations
P = lambda r, deg: (500 + r * math.cos(math.radians(deg)), 500 + r * math.sin(math.radians(deg)))

def chip(x, y, w, label, fill='#9FB0FF', col='#0F1426', fs=32, cls=''):
    return (f'<g class="{cls}" transform="translate({x:.0f} {y:.0f})"><rect x="{-w/2}" y="-30" width="{w}" height="60" rx="30" fill="{fill}"/>'
            f'<text y="11" text-anchor="middle" font-weight="700" font-size="{fs}" fill="{col}">{label}</text></g>')

# a1 a single flight path into Paris, then the itinerary
rows = [('airplane-landing','10:40', 'Arrival, Le Bourget'), ('bed','13:00', 'Check-in, palace suite'), ('fork-knife','20:30', "Dinner, chef's table")]
rws = ''
for i, (ic, tm, lb) in enumerate(rows):
    y = 500 + i * 104
    rws += (f'<g class="row1" id="row{i}"><circle cx="242" cy="{y}" r="32" fill="#EEF1FB"/>{icon(ic,242,y,40,"#3E4A88")}'
            f'<text x="298" y="{y+13}" font-weight="700" font-size="36" fill="#0F1426" style="font-variant-numeric:tabular-nums">{tm}</text>'
            f'<text x="412" y="{y+13}" font-size="33" fill="#2A3352">{lb}</text>'
            f'<g class="ck1"><circle cx="772" cy="{y}" r="20" fill="#9FB0FF"/><path d="M762 {y} l7 7 13 -14" fill="none" stroke="#0F1426" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g></g>')
    if i < 2: rws += f'<line x1="210" y1="{y+52}" x2="790" y2="{y+52}" stroke="rgba(15,20,38,.07)" stroke-width="2"/>'
a1 = f'''<!-- a1 flight path, then the itinerary -->
  <g filter="url(#ds)" class="st" data-st="a1">
    <path id="fa1g" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#9FB0FF" stroke-width="16" stroke-linecap="round" opacity=".35" filter="url(#glow1)" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    <path id="fa1" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#C7CEF0" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="0.006 0.012" pathLength="1" stroke-dashoffset="0" opacity="0"/><path id="fa1s" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#C7CEF0" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path class="ft1" data-l="0.34" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#F4F2ED" stroke-width="10" stroke-linecap="round" opacity="0.1" pathLength="1" stroke-dasharray="0.34 3" stroke-dashoffset="0.34"/><path class="ft1" data-l="0.2" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#F4F2ED" stroke-width="6" stroke-linecap="round" opacity="0.22" pathLength="1" stroke-dasharray="0.2 3" stroke-dashoffset="0.2"/><path class="ft1" data-l="0.09" d="M-60 360 C120 120 330 70 500 150" fill="none" stroke="#F4F2ED" stroke-width="4" stroke-linecap="round" opacity="0.6" pathLength="1" stroke-dasharray="0.09 3" stroke-dashoffset="0.09"/>
    <g id="pin1"><circle id="pin1r" cx="500" cy="150" r="14" fill="none" stroke="#EEF0F6" stroke-width="3"/><circle cx="500" cy="150" r="14" fill="#EEF0F6"/><circle cx="500" cy="150" r="5" fill="#3E4A88"/>
      <text x="536" y="164" font-weight="600" font-size="42" fill="#EEF0F6">Paris</text></g>
    <g id="jw1"><use id="jet1" href="#jetT" x="-48" y="-48" width="96" height="96"/></g>
    <g id="card1">
      <rect x="170" y="290" width="660" height="560" rx="36" fill="#FFFFFF"/>
      <text x="210" y="370" font-weight="700" font-size="40" fill="#0F1426">Your client's trip</text>
      <text x="210" y="412" font-size="28" fill="#5A6690">Paris, 3 days</text>
      <g id="conf1"><rect x="610" y="338" width="180" height="52" rx="26" fill="#9FB0FF"/><text x="700" y="373" text-anchor="middle" font-weight="700" font-size="26" fill="#0F1426">Confirmed</text></g>
      <line x1="210" y1="440" x2="790" y2="440" stroke="rgba(15,20,38,.08)" stroke-width="2"/>
      {rws}
    </g>
  </g>
'''

icon_=icon
# a2 orbit system: your agency at the centre, partners on inner orbits, our orbit outside
gaps = [(-100, 'door'), (15, 'rest'), (120, 'moon')]
gx = ''
for i, (ang, kind) in enumerate(gaps):
    x, y = 0, 0
    icsv = icon_({'door':'airplane-landing','rest':'fork-knife','moon':'moon-stars'}[kind], x, y, 44, '#0F1426')
    gx += (f'<g id="gw{i}"><g class="gap" id="gap{i}"><circle class="gr" cx="0" cy="0" r="40" fill="rgba(226,85,74,.18)"/>'
           f'<g class="gs" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0"><line x1="52.0" y1="0.0" x2="76.0" y2="0.0"/><line x1="36.8" y1="36.8" x2="53.7" y2="53.7"/><line x1="-0.0" y1="52.0" x2="-0.0" y2="76.0"/><line x1="-36.8" y1="36.8" x2="-53.7" y2="53.7"/><line x1="-52.0" y1="-0.0" x2="-76.0" y2="-0.0"/><line x1="-36.8" y1="-36.8" x2="-53.7" y2="-53.7"/><line x1="0.0" y1="-52.0" x2="0.0" y2="-76.0"/><line x1="36.8" y1="-36.8" x2="53.7" y2="-53.7"/></g>'
           f'<circle class="gb" cx="0" cy="0" r="40" fill="#FFFFFF"/>{icsv}'
           f'<circle class="gd" cx="29" cy="-29" r="9" fill="#E2554A"/>'
           f'<g class="gk"><circle cx="29" cy="-29" r="15" fill="#9FB0FF"/><path d="M22 -29 l5 5 9 -10" fill="none" stroke="#0F1426" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>')
a2 = f'''<!-- a2 orbit, drawn in 3D per frame -->
  <g filter="url(#ds)" class="st" data-st="a2">
   <defs><linearGradient id="orbU" gradientUnits="userSpaceOnUse" x1="80" y1="80" x2="920" y2="920"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#9FB0FF"/><stop offset="1" stop-color="#C7CEF0"/></linearGradient></defs>
   <g id="o3d" fill="none" stroke-linecap="round">
    <path id="gd1" class="tl" stroke-width="2" stroke-dasharray="3 16" opacity="0"/>
    <path id="gd2" class="tl" stroke-width="1.5" stroke-dasharray="3 22" opacity="0"/>
    <path id="cpOrbG" stroke="#9FB0FF" stroke-width="34" opacity="0" filter="url(#glow1)"/>
    <path id="r1b" class="tl" stroke-width="2"/><path id="r2b" class="tl" stroke-width="1.5" opacity=".7"/><path id="cpb" stroke="url(#orbU)" stroke-width="5"/>
    <g id="coreW"><circle cx="500" cy="500" r="230" fill="url(#coreHalo)" stroke="none"/>
    <g id="core"><circle cx="500" cy="500" r="110" fill="url(#coreG)" stroke="none"/><circle cx="500" cy="500" r="110" fill="none" stroke="rgba(199,206,240,.35)" stroke-width="2"/><text x="500" y="492" text-anchor="middle" font-weight="600" font-size="38" fill="#EEF0F6" stroke="none">Your</text><text x="500" y="536" text-anchor="middle" font-weight="600" font-size="38" fill="#EEF0F6" stroke="none">agency</text></g></g>
    <path id="r1f" class="tl" stroke-width="2"/><path id="r2f" class="tl" stroke-width="1.5" opacity=".7"/><path id="cpf" stroke="url(#orbU)" stroke-width="5"/>
    <g id="dmcC" stroke="none"><g class="nb"><rect class="hlr" x="-76" y="-42" width="152" height="84" rx="42" fill="rgba(159,176,255,.25)" stroke="#FFFFFF" stroke-width="3" opacity="0"/><rect x="-62" y="-28" width="124" height="56" rx="28" fill="#0F1426"/><text y="10" text-anchor="middle" font-weight="700" font-size="28" fill="#EEF0F6">DMC</text></g></g>
    <g id="virC" stroke="none"><g class="nb"><rect class="hlr" x="-102" y="-48" width="204" height="96" rx="30" fill="rgba(159,176,255,.25)" stroke="#FFFFFF" stroke-width="3" opacity="0"/><rect x="-88" y="-34" width="176" height="68" rx="20" fill="#FFFFFF" stroke="rgba(15,20,38,.12)" stroke-width="2"/><image href="__VIRTUOSO__" x="-74" y="-28" width="148" height="56"/></g></g>
    <g stroke="none">{gx}</g>
    <path id="stD" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 6" opacity="0"/><path id="stV" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 6" opacity="0"/><path id="stB" stroke="#FFFFFF" stroke-width="2.5" opacity="0"/>
    <g id="boss" stroke="none" opacity="0"><g id="bossI"><circle r="64" fill="#0B0F1E" stroke="#FFFFFF" stroke-width="4"/><circle r="52" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/><image href="__EMBLEM__" x="-42" y="-42" width="84" height="84"/><circle id="bossSh" r="64" fill="#FFFFFF" opacity="0"/></g></g>
    <g id="sat0" class="sat" stroke="none" style="display:none"><g class="nb"><circle r="40" fill="#0F1426" stroke="#9FB0FF" stroke-width="3"/><image href="__EMBLEM__" x="-27" y="-27" width="54" height="54"/></g></g>
    <g id="sat1" class="sat" stroke="none"><g class="nb"><circle r="36" fill="#FFFFFF"/>{icon('car-profile',0,0,44,'#0F1426')}</g></g>
    <g id="sat2" class="sat" stroke="none"><g class="nb"><circle r="36" fill="#FFFFFF"/>{icon('airplane-tilt',0,0,44,'#0F1426')}</g></g>
   </g>
  </g>
'''

# a6 a la carte menu
items = ['Transfers', 'Driver for the day', 'Meet and greet', 'Airside, fast track', 'Jet charter', 'Hotels, zero fees', '24/7 concierge', 'Ad hoc requests']
pick = [0, 2, 7]
cards = ''
for i, lb in enumerate(items):
    col, row = i % 2, i // 2
    x = 40 + col * 470; y = 90 + row * 210
    cards += (f'<g class="m6" id="m{i}"><rect x="{x}" y="{y}" width="450" height="170" rx="34" fill="#FFFFFF"/>'
              f'<text x="{x+40}" y="{y+100}" font-weight="600" font-size="35" fill="#0F1426">{lb}</text>'
              f'<circle class="tg" cx="{x+400}" cy="{y+85}" r="22" fill="none" stroke="#C7CEF0" stroke-width="4"/>'
              f'<g class="on" opacity="0"><circle cx="{x+400}" cy="{y+85}" r="24" fill="#9FB0FF"/><path d="M{x+389} {y+85} l7 7 14 -15" fill="none" stroke="#0F1426" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></g>')
a6 = f'''<!-- a6 a la carte -->
  <g filter="url(#ds)" class="st" data-st="a6">
    {cards}
    <circle id="rip6" cx="0" cy="0" r="24" fill="none" stroke="#9FB0FF" stroke-width="4" opacity="0"/>
    <g id="cur6"><path d="M0 0 l34 18 -14 4 -6 14z" fill="#0F1426" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round" transform="scale(1.6)"/></g>
  </g>
'''

# a7 fleet: reuse s6 panels from v18
i0 = src.index('<!-- s6 fleet -->'); i1 = src.index('<!-- s7a airports -->')
a7 = src[i0:i1].replace('<!-- s6 fleet -->', '<!-- a7 fleet -->').replace('data-st="s6"', 'data-st="a7"')
a7 = a7.replace('<circle cx="500" cy="800" r="112"', '<circle cx="500" cy="30" r="92"').replace('<circle cx="500" cy="800" r="96"', '<circle cx="500" cy="30" r="78"')
a7 = a7.replace('x="500" y="790" text-anchor="middle" font-weight="700" font-size="34"', 'x="500" y="22" text-anchor="middle" font-weight="700" font-size="28"').replace('x="500" y="830" text-anchor="middle" font-weight="700" font-size="34"', 'x="500" y="56" text-anchor="middle" font-weight="700" font-size="28"')
day = '''<g id="day7"><rect x="120" y="830" width="760" height="16" rx="8" fill="rgba(238,240,246,.16)"/><rect id="dayFill" x="120" y="830" width="760" height="16" rx="8" fill="#9FB0FF"/>
      <circle id="dayKnob" cx="120" cy="838" r="26" fill="#EEF0F6"/>
      <text x="120" y="910" font-weight="600" font-size="36" fill="#EEF0F6">Single transfer</text><text x="880" y="910" text-anchor="end" font-weight="600" font-size="36" fill="#EEF0F6">Whole day</text></g>
      <g id="vip7" opacity="0"><g transform="translate(445 560)"><circle r="20" fill="#9FB0FF"/><path d="M0 -10 l3 7 7 0 -6 5 2 8 -6 -5 -6 5 2 -8 -6 -5 7 0z" fill="#0F1426"/></g><g transform="translate(925 560)"><circle r="20" fill="#9FB0FF"/><path d="M0 -10 l3 7 7 0 -6 5 2 8 -6 -5 -6 5 2 -8 -6 -5 7 0z" fill="#0F1426"/></g></g>
  </g>'''
a7 = a7.rstrip()
assert a7.endswith('</g>')
a7 = a7[:-4] + day + '\n\n  '

CAR='''<symbol id="carT" viewBox="-60 -26 120 52" overflow="visible">
  <defs>
    <radialGradient id="cSh"><stop offset="0" stop-color="rgba(0,0,0,.5)"/><stop offset=".7" stop-color="rgba(0,0,0,.18)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
    <linearGradient id="cBd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F7898"/><stop offset=".22" stop-color="#C9CEDD"/><stop offset=".5" stop-color="#F6F7FB"/><stop offset=".78" stop-color="#C9CEDD"/><stop offset="1" stop-color="#6F7898"/></linearGradient>
    <linearGradient id="cRf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA2BE"/><stop offset=".5" stop-color="#E4E7F0"/><stop offset="1" stop-color="#9AA2BE"/></linearGradient>
    <linearGradient id="cGl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0D1126"/><stop offset=".6" stop-color="#1F2748"/><stop offset="1" stop-color="#3A4570"/></linearGradient>
    <linearGradient id="cBm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(244,242,237,.32)"/><stop offset="1" stop-color="rgba(244,242,237,0)"/></linearGradient>
  </defs>
  <ellipse cx="2" cy="5" rx="68" ry="32" fill="url(#cSh)"/>
  <path class="beam" d="M56 -16 L112 -34 L112 -2 Z M56 16 L112 2 L112 34 Z" fill="url(#cBm)"/>
  <path d="M-54 -17 C-54 -23 -48 -25 -38 -25 L32 -25 C47 -25 57 -18 58.5 -8 L58.5 8 C57 18 47 25 32 25 L-38 25 C-48 25 -54 23 -54 17 Z" fill="url(#cBd)"/>
  <path d="M-52 -21 C-46 -24 -40 -24 -36 -24 L32 -24 C42 -24 50 -20 55 -14" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.2"/>
  <path d="M26 -11 C40 -10 50 -6 56 -3 M26 11 C40 10 50 6 56 3" fill="none" stroke="rgba(80,90,120,.35)" stroke-width="1"/>
  <ellipse cx="12" cy="-27.5" rx="4.5" ry="2.6" fill="#8C95B2"/><ellipse cx="12" cy="27.5" rx="4.5" ry="2.6" fill="#8C95B2"/>
  <path d="M-36 -21 L14 -21 L19 -17 L-33 -17 Z M-36 21 L14 21 L19 17 L-33 17 Z" fill="#141A33" opacity=".85"/>
  <path d="M10 -18 C19 -17 25 -10 25.5 0 C25 10 19 17 10 18 L5 14 L5 -14 Z" fill="url(#cGl)"/>
  <path d="M12 -15 C18 -13 21 -8 22 -2" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4" stroke-linecap="round"/>
  <rect x="-27" y="-16" width="32" height="32" rx="5" fill="url(#cRf)"/>
  <path d="M-27 -14 L-36 -16 C-40 -8 -40 8 -36 16 L-27 14 Z" fill="url(#cGl)"/>
  <path d="M53 -19 C56 -16 58 -12 58.5 -9 L55 -10 Z M53 19 C56 16 58 12 58.5 9 L55 10 Z" fill="#FFFFFF"/>
  <circle cx="57" cy="-11" r="3.5" fill="rgba(255,255,255,.55)"/><circle cx="57" cy="11" r="3.5" fill="rgba(255,255,255,.55)"/>
  <path d="M-53 -19 L-50 -23 L-46 -24 M-53 19 L-50 23 L-46 24" fill="none" stroke="#C8323A" stroke-width="2.4" stroke-linecap="round"/>
</symbol>'''
# a8 map: zoom from London/Paris out to Europe
P8 = M['pts']
mapg = f'''<g id="mapG"><path d="{M['land']}" fill="url(#land8)"/><path d="{M['land']}" fill="none" stroke="#9FB0FF" stroke-width="6" opacity=".35" filter="url(#cg8)" vector-effect="non-scaling-stroke"/><path d="{M['land']}" fill="none" stroke="#B9C4FF" stroke-width="1.6" opacity=".75" vector-effect="non-scaling-stroke"/><path d="{M['borders']}" fill="none" stroke="rgba(199,206,240,.16)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></g>'''
a8 = f'''<!-- a8 airports map -->
  <g filter="url(#ds)" class="st" data-st="a8">
    <defs><linearGradient id="land8" gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="900" y2="1050"><stop offset="0" stop-color="#3A4585"/><stop offset=".5" stop-color="#2A336B"/><stop offset="1" stop-color="#1D2452"/></linearGradient>
      <filter id="cg8" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
      <radialGradient id="spot8"><stop offset="0" stop-color="rgba(185,196,255,.32)"/><stop offset=".5" stop-color="rgba(142,124,240,.12)"/><stop offset="1" stop-color="rgba(142,124,240,0)"/></radialGradient>
      <radialGradient id="hubH"><stop offset="0" stop-color="rgba(255,255,255,.55)"/><stop offset="1" stop-color="rgba(159,176,255,0)"/></radialGradient>
      <linearGradient id="pinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#9FB0FF"/></linearGradient>
      <radialGradient id="mf8g" gradientUnits="userSpaceOnUse" cx="520" cy="470" r="640" gradientTransform="translate(520 470) scale(1 .78) translate(-520 -470)"><stop offset=".7" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></radialGradient>
      <mask id="mf8x" maskUnits="userSpaceOnUse" x="-1200" y="-1200" width="3400" height="3400"><rect x="-1200" y="-1200" width="3400" height="3400" fill="url(#mf8g)"/></mask></defs>
    <g mask="url(#mf8x)">{mapg}
      <g id="rad8" fill="none" stroke="#C7CEF0" stroke-width="2"><circle r="10" opacity="0"/><circle r="10" opacity="0"/></g></g>
    <g id="arcs8" fill="none" stroke-width="3.5" stroke-linecap="round"></g>
    <g id="dots8"></g>
    <g id="aps8"></g>
    <g id="chips8"></g>
  </g>
'''

# a8b airside: a 3D airliner lands, we meet them at the door, then the arrival story with and without fast track
def flap(x,y,code,name,k):
    t=''
    for n,ch in enumerate(code):
        tx=x+18+n*58
        t+=(f'<g class="ft" data-c="{ch}" data-k="{k}" data-n="{n}"><rect x="{tx}" y="{y+16}" width="50" height="78" rx="8" fill="#1B2249"/>'
            f'<text x="{tx+25}" y="{y+76}" text-anchor="middle" font-weight="700" font-size="56" fill="#EEF0F6">{ch}</text>'
            f'<rect x="{tx}" y="{y+54}" width="50" height="2" fill="#0B0F1E"/></g>')
    return (f'<g class="fb8" id="fb{k}"><rect x="{x}" y="{y}" width="210" height="110" rx="18" fill="#0F1426" stroke="rgba(199,206,240,.3)" stroke-width="2"/>{t}'
            f'<text x="{x+105}" y="{y+150}" text-anchor="middle" font-weight="600" font-size="30" fill="#EEF0F6">{name}</text></g>')
st=''
for k,(ic,lb) in enumerate([('door-open','Aircraft door'),('identification-card','Passport'),('suitcase-rolling','Customs'),('car-profile','Your car')]):
    x=150+round(k*233.3)
    st+=(f'<g class="s8" id="s8{k}"><circle class="sr" cx="{x}" cy="960" r="36" fill="none" stroke="#9FB0FF" stroke-width="4" opacity="0"/>'
         f'<circle cx="{x}" cy="960" r="32" fill="#232B55" stroke="rgba(199,206,240,.35)" stroke-width="2"/>'+icon(ic,x,960,38,'#EEF0F6')+
         f'<g class="sl"><circle cx="{x}" cy="960" r="32" fill="#9FB0FF"/>'+icon(ic,x,960,38,'#0F1426')+'</g></g>')
wait=''
for k,b in [(1,'45 min'),(2,'30 min')]:
    x=150+round(k*233.3)
    wait+=(f'<g class="w8" id="w8{k}"><g class="wo"><rect x="{x-62}" y="912" width="124" height="46" rx="23" fill="rgba(238,240,246,.12)"/><text x="{x}" y="944" text-anchor="middle" font-weight="600" font-size="28" fill="#C7CEF0">{b}</text>'
           f'<path class="wx" d="M{x-50} 935 H{x+50}" stroke="#EEF0F6" stroke-width="3" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100"/></g>'
           f'<g class="wn" opacity="0"><rect x="{x-62}" y="912" width="124" height="46" rx="23" fill="#9FB0FF"/><text x="{x}" y="944" text-anchor="middle" font-weight="700" font-size="28" fill="#0F1426">5 min</text></g></g>')
stamp=f'<g id="stamp8" opacity="0"><circle cx="423" cy="756" r="30" fill="#EEF0F6"/>'+icon('seal-check',423,756,46,'#3E4A88','fill')+'</g>'
a8b = f"""<!-- a8b airside and fast track -->
  <g filter="url(#ds)" class="st" data-st="a8b">
    <defs><linearGradient id="jp8" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#252E5C"/><stop offset="1" stop-color="#171D40"/></linearGradient>
      <linearGradient id="fl8" x1="0" x2="1"><stop offset="0" stop-color="#9FB0FF"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
      <radialGradient id="sky8" cx=".5" cy=".6" r=".5"><stop offset="0" stop-color="rgba(199,206,240,.35)"/><stop offset=".55" stop-color="rgba(142,124,240,.12)"/><stop offset="1" stop-color="rgba(142,124,240,0)"/></radialGradient></defs>
    <linearGradient id="fmg8" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".12" stop-color="#000"/><stop offset=".24" stop-color="#555"/><stop offset=".38" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="fmv8" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".62" stop-color="#fff"/><stop offset=".8" stop-color="#666"/><stop offset=".96" stop-color="#000"/></linearGradient><mask id="fm8v" maskUnits="userSpaceOnUse" x="-60" y="-20" width="1300" height="650"><rect x="-60" y="-20" width="1300" height="650" fill="url(#fmv8)"/></mask><mask id="fm8" maskUnits="userSpaceOnUse" x="-60" y="-20" width="1300" height="650"><g mask="url(#fm8v)"><rect x="-60" y="-20" width="1300" height="650" fill="url(#fmg8)"/></g></mask>
    <g id="pl8g" mask="url(#fm8)"><foreignObject id="fo8" x="-60" y="-20" width="1300" height="650"><canvas xmlns="http://www.w3.org/1999/xhtml" id="pl3d" width="1800" height="900" style="width:1300px;height:650px;display:block"></canvas></foreignObject></g>
    {flap(30,40,'LHR','London Heathrow',0)}{flap(270,40,'CDG','Paris CDG',1)}
    <g id="jp8o" transform="translate(0 -88)"><g id="jp8w"><rect x="70" y="586" width="860" height="432" rx="40" fill="url(#jp8)" stroke="rgba(199,206,240,.28)" stroke-width="2"/>
    <text x="116" y="650" font-weight="700" font-size="34" fill="#EEF0F6">Arrival, London Heathrow</text>
    <text x="116" y="690" font-size="26" fill="#C7CEF0">Aircraft door to your car</text>
    <g id="sw8"><text x="776" y="650" text-anchor="end" font-weight="700" font-size="30" fill="#EEF0F6">Fast track</text><circle id="swR" cx="858" cy="640" r="34" fill="none" stroke="#9FB0FF" stroke-width="3" opacity="0"/><rect id="swT" x="800" y="610" width="116" height="60" rx="30" fill="rgba(238,240,246,.18)"/><circle id="swK" cx="830" cy="640" r="24" fill="#EEF0F6"/></g>
    <text id="ft8c" x="116" y="776" font-weight="700" font-size="88" fill="#EEF0F6" style="font-variant-numeric:tabular-nums" letter-spacing="-3"><tspan id="ft8n">75</tspan><tspan font-size="36" font-weight="600" dx="12" letter-spacing="0">min</tspan></text>
    <rect x="150" y="955" width="700" height="10" rx="5" fill="rgba(238,240,246,.12)"/>
    <rect id="pl8" x="150" y="955" width="700" height="10" rx="5" fill="url(#fl8)"/>
    {st}</g></g>
    <g id="tok8"><g id="tokI"><rect x="-84" y="-42" width="168" height="84" rx="42" fill="#EEF0F6"/>
      <g id="tkC"><circle cx="-40" cy="0" r="32" fill="#9FB0FF"/><use href="#chf" x="-61" y="-29" width="42" height="58" style="color:#0F1426"/></g>
      <g id="tkU"><circle cx="40" cy="0" r="32" fill="#0F1426"/>{icon('user',40,0,38,'#EEF0F6')}</g>
      <path id="tkP" d="M-12 41 L0 54 L12 41 Z" fill="#EEF0F6"/></g></g>
  </g>
"""

# a9 concierge tiles (reuse s8 look)
i0 = src.index('<!-- s8 concierge -->'); i1 = src.index('<!-- s9 hotel -->')
a9 = src[i0:i1].replace('<!-- s8 concierge -->', '<!-- a9 concierge extras -->').replace('data-st="s8"', 'data-st="a9"')
_i=a9.index('<g transform="translate(110 385) scale(3.3)"');_j=a9.index('</g>',a9.index('<path d="M12 26 V50 M48 26 V50 M6 52 H54"/>',_i))+4
a9=a9[:_i]+'<circle cx="210" cy="485" r="80" fill="#EEF1FB"/>'+icon('buildings',210,485,96,'#3E4A88')+a9[_j:]
_i=a9.index('<g transform="translate(110 655) scale(3.3)"');_j=a9.index('</g></g>',_i)+8
a9=a9[:_i]+'<circle cx="210" cy="755" r="80" fill="#EEF1FB"/>'+icon('clock',210,755,88,'#3E4A88',iid='bell9')+a9[_j:]
a9 = a9.replace('>The table<', '>Jet charter<').replace('>Restaurants that are hard to book<', '>Private aviation, safety-audited<')
a9 = a9.replace('>The venue<', '>Hotels, zero fees<').replace('>Private rooms, tonight<', '>Booked at the hotel&#39;s own rate<')
a9 = a9.replace('>The team on site<', '>Ad hoc requests<').replace('>Hosts, coordination, staffing<', '>Handled around the clock<')
# swap the cloche icon for a jet
_i=a9.index('<g transform="translate(110 115) scale(3.3)"');_j=a9.index('<path d="M6 46 H54"/></g>',_i)+len('<path d="M6 46 H54"/></g>')
a9 = a9[:_i]+'<circle cx="210" cy="215" r="80" fill="#EEF1FB"/>'+icon('airplane-tilt',210,215,96,'#3E4A88',iid='jet9')+a9[_j:]


# a9x bespoke experiences: a cinematic photo reel inside a 16:9 frame, then the trip folds into a sealed itinerary
import base64 as _b64
def _img(n): return 'data:image/jpeg;base64,'+_b64.b64encode(open(f'/home/claude/ta/img/{n}.jpg','rb').read()).decode()
import math as _m
from PIL import ImageFont as _IF
_FB='/mnt/skills/examples/canvas-design/canvas-fonts/InstrumentSans-Bold.ttf'
def _ts(w,y,fs,ls,cls,cx=500):
    f=_IF.truetype(_FB,200);adv=[f.getlength(c)*fs/200+ls for c in w];tot=sum(adv)-ls;x=cx-tot/2;o=''
    for k_,(c,a) in enumerate(zip(w,adv)):
        side=(' '+cls+('L' if k_<4 else 'R')) if cls=='lC' else ''
        o+=f'<tspan class="k9 {cls}{side}" x="{x:.1f}" y="{y}">{c}</tspan>';x+=a
    return o
def _split(w,fs,ls,n=4,cx=500):
    f=_IF.truetype(_FB,200);adv=[f.getlength(c)*fs/200+ls for c in w];tot=sum(adv)-ls
    return cx-tot/2+sum(adv[:n])-ls/2
def _wd(w,y,fs,ls,cls,mask):
    if mask: return f'<text font-weight="700" font-size="{fs}" fill="#FFFFFF">{_ts(w,y,fs,ls,cls)}</text>'
    return f'<text font-weight="700" font-size="{fs}" fill="none" stroke="rgba(244,242,237,.7)" stroke-width="1.6">{_ts(w,y,fs,ls,cls)}</text>' 
def _contour(R,k):
    pts=[]
    for n in range(73):
        th=2*_m.pi*n/72;r=R*(1+.09*_m.sin(3*th+k)+.05*_m.sin(5*th+2*k)+.03*_m.cos(7*th+k))
        pts.append((500+r*_m.cos(th),470+.62*r*_m.sin(th)))
    return 'M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in pts)+'Z'
SPX=round(_split('CHAMPAGNE',136,-3))
_cw=_split('CHAMPAGNE',136,-3,9)+1.5;CX0=round(1000-_cw);CX1=round(_cw);DK=.62
FLX=round(((CX0+DK*(SPX-CX0))+(CX1-DK*(CX1-SPX)))/2)
cont=''.join(f'<path class="ct9x" d="{_contour(70+62*i,i*.9)}" fill="none" stroke="rgba(199,206,240,{.5-.06*i:.2f})" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>' for i in range(6))
QP="M 382 400 C 382 300 450 246 502 246 C 572 246 622 296 622 368 C 622 450 502 468 502 560 L 502 600"
FBUB=''.join(f'<circle class="fb9x" cx="{FLX-14+(i*9)%28}" cy="516" r="{2+(i%3)*.8}" fill="#FFFFFF" opacity="0"/>' for i in range(8))
bub=''.join(f'<circle class="bb9x" cx="{FLX-16+(i*11)%32}" cy="{392+(i*7)%10}" r="{4+(i*7)%9}" fill="none" stroke="rgba(244,242,237,.75)" stroke-width="2" opacity="0"/>' for i in range(14))
ticks=''.join(f'<line x1="{80+20*i}" y1="612" x2="{80+20*i}" y2="{612+(28 if i%5==0 else 14)}" stroke="#141A33" stroke-width="{3 if i%5==0 else 2}"/>' for i in range(43))
nums=''.join(f'<text x="{86+100*i}" y="660" font-weight="700" font-size="20" fill="#141A33">{i}</text>' for i in range(9))
_DI={'guide':('pg9x',960,500,553.5),'champagne':('pc9x',1320,500,536),'cotswolds':('pt9x',960,500,497)}
def _uimg(n,cx,cy,w,clip):
    i,W,X,Y=_DI[n];s=w/W
    return f'<g clip-path="url(#{clip})"><use href="#{i}" transform="translate({cx} {cy}) scale({s:.4f}) translate({-X} {-Y})"/></g>'
def _pc(n,cx,cy,r,cls,idp):
    # sharp small photo in a circle, reusing the one embedded copy of each photo
    return (f'<g class="{cls}" id="{idp}"><clipPath id="{idp}c"><circle cx="{cx}" cy="{cy}" r="{r-6}"/></clipPath>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#141A33" stroke="#9FB0FF" stroke-width="3"/>'
            +_uimg(n,cx,cy,r*3.8,idp+'c')+'</g>')
POI=''.join(_pc(n,x,y,46,'poi9x',f'poi9x{k}') for k,(n,x,y) in enumerate([('guide',318,430),('champagne',650,352),('cotswolds',712,566)]))
circ=''.join(_pc(n,x,520,66,'cc9x',f'cc9x{k}') for k,(n,x) in enumerate([('guide',240),('champagne',500),('cotswolds',760)]))
labs=''.join(f'<text class="lb9x" x="{x}" y="744" text-anchor="middle" font-weight="600" font-size="38" fill="#F4F2ED">{t}</text>' for x,t in [(240,'Guided visit'),(500,'Champagne'),(760,'Cotswolds')])
seal=('<g id="seal9x"><circle cx="0" cy="0" r="96" fill="#2F3A7A"/><circle cx="0" cy="0" r="96" fill="none" stroke="#9FB0FF" stroke-width="3"/>'
      '<circle cx="0" cy="0" r="60" fill="none" stroke="rgba(238,240,246,.35)" stroke-width="2"/>'
      '<path id="sp9x" d="M -76 0 A 76 76 0 1 1 76 0 A 76 76 0 1 1 -76 0" fill="none"/>'
      '<text font-weight="700" font-size="18" fill="#EEF0F6"><textPath href="#sp9x" textLength="462" lengthAdjust="spacing">MADE TO MEASURE • MADE TO MEASURE •</textPath></text>'
      '<image href="__EMBLEM__" x="-38" y="-38" width="76" height="76"/></g>')
a9x = f"""<!-- a9x bespoke experiences: kinetic type, photos live inside the letters, the unusual is a question mark -->
  <g class="st" data-st="a9x">
    <defs>
      <image id="pg9x" href="{_img('guide')}" x="20" y="330" width="960" height="447" preserveAspectRatio="xMidYMid slice"/>
      <image id="pc9x" href="{_img('champagne')}" x="-160" y="200" width="1320" height="672" preserveAspectRatio="xMidYMid slice"/>
      <image id="pt9x" href="{_img('cotswolds')}" x="20" y="250" width="960" height="494" preserveAspectRatio="xMidYMid slice"/>
      <image id="pp9x" href="{_img('planet')}" x="-60" y="220" width="1120" height="569" preserveAspectRatio="xMidYMid slice"/>
      <clipPath id="sG9x"><rect x="-100" y="370" width="1200" height="236"/></clipPath>
      <clipPath id="sC9x"><rect x="-100" y="420" width="1200" height="150"/></clipPath>
      <clipPath id="sT9x"><rect x="-100" y="420" width="1200" height="150"/></clipPath>
      <clipPath id="hA9x"><rect x="-100" y="300" width="1200" height="196"/></clipPath>
      <clipPath id="hB9x"><rect x="-100" y="496" width="1200" height="200"/></clipPath>
      <mask id="mG9x" maskUnits="userSpaceOnUse" x="-200" y="0" width="1400" height="1000"><g clip-path="url(#sG9x)">{_wd('GUIDES',572,250,-6,'lG',True)}</g></mask>
      <mask id="mC9x" maskUnits="userSpaceOnUse" x="-200" y="0" width="1400" height="1000"><g clip-path="url(#sC9x)">{_wd('CHAMPAGNE',546,136,-3,'lC',True)}</g></mask>
      <mask id="mT9x" maskUnits="userSpaceOnUse" x="-200" y="0" width="1400" height="1000"><g clip-path="url(#sT9x)">{_wd('COTSWOLDS',546,146,-3,'lT',True)}</g></mask>
      <mask id="qm9x" maskUnits="userSpaceOnUse" x="-200" y="0" width="1400" height="1000"><text fill="#FFFFFF" x="312" y="760" font-weight="700" font-size="640">?</text></mask>
      <clipPath id="qhc9x"><rect x="0" y="0" width="1000" height="620"/></clipPath>
      <clipPath id="qdc9x"><rect x="0" y="620" width="1000" height="400"/></clipPath>
      <linearGradient id="qgr9x" gradientUnits="userSpaceOnUse" x1="0" y1="280" x2="0" y2="620"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#B7C1F4"/></linearGradient><linearGradient id="qgr9d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D1F8"/><stop offset="1" stop-color="#9FB0FF"/></linearGradient>
      <linearGradient id="qsg9x" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(255,255,255,0)"/><stop offset=".5" stop-color="rgba(255,255,255,.55)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>
      <radialGradient id="cg9x"><stop offset="0" stop-color="rgba(244,242,237,.55)"/><stop offset="1" stop-color="rgba(244,242,237,0)"/></radialGradient>
    </defs>
    <g id="tp9x">
      <line id="hz9x" x1="500" y1="470" x2="500" y2="470" stroke="#F4F2ED" stroke-width="3" stroke-linecap="round"/>
      <clipPath id="sc9x0"><rect class="scr9x" x="73.0" y="470" width="80.0" height="0" rx="6" data-y="245.0" data-h="450.1"/></clipPath><g class="sl9x" id="sl9x0" data-cx="113.0"><g clip-path="url(#sc9x0)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="73.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x1"><rect class="scr9x" x="159.0" y="470" width="80.0" height="0" rx="6" data-y="267.6" data-h="404.7"/></clipPath><g class="sl9x" id="sl9x1" data-cx="199.0"><g clip-path="url(#sc9x1)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="159.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x2"><rect class="scr9x" x="245.0" y="470" width="80.0" height="0" rx="6" data-y="230.1" data-h="479.9"/></clipPath><g class="sl9x" id="sl9x2" data-cx="285.0"><g clip-path="url(#sc9x2)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="245.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x3"><rect class="scr9x" x="331.0" y="470" width="80.0" height="0" rx="6" data-y="267.6" data-h="404.8"/></clipPath><g class="sl9x" id="sl9x3" data-cx="371.0"><g clip-path="url(#sc9x3)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="331.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x4"><rect class="scr9x" x="417.0" y="470" width="80.0" height="0" rx="6" data-y="245.1" data-h="449.9"/></clipPath><g class="sl9x" id="sl9x4" data-cx="457.0"><g clip-path="url(#sc9x4)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="417.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x5"><rect class="scr9x" x="503.0" y="470" width="80.0" height="0" rx="6" data-y="261.6" data-h="416.8"/></clipPath><g class="sl9x" id="sl9x5" data-cx="543.0"><g clip-path="url(#sc9x5)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="503.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x6"><rect class="scr9x" x="589.0" y="470" width="80.0" height="0" rx="6" data-y="257.7" data-h="424.7"/></clipPath><g class="sl9x" id="sl9x6" data-cx="629.0"><g clip-path="url(#sc9x6)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="589.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x7"><rect class="scr9x" x="675.0" y="470" width="80.0" height="0" rx="6" data-y="250.6" data-h="438.9"/></clipPath><g class="sl9x" id="sl9x7" data-cx="715.0"><g clip-path="url(#sc9x7)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="675.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x8"><rect class="scr9x" x="761.0" y="470" width="80.0" height="0" rx="6" data-y="265.9" data-h="408.2"/></clipPath><g class="sl9x" id="sl9x8" data-cx="801.0"><g clip-path="url(#sc9x8)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="761.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g><clipPath id="sc9x9"><rect class="scr9x" x="847.0" y="470" width="80.0" height="0" rx="6" data-y="236.3" data-h="467.5"/></clipPath><g class="sl9x" id="sl9x9" data-cx="887.0"><g clip-path="url(#sc9x9)"><g class="sp9x"><use class="si0" href="#pg9x" opacity="1" transform="translate(500 470) scale(1.0833) translate(-500 -553.5)"/><use class="si1" href="#pc9x" opacity="0" transform="translate(500 470) scale(0.7197) translate(-500 -536)"/><use class="si2" href="#pt9x" opacity="0" transform="translate(500 470) scale(0.9792) translate(-500 -497)"/></g><rect class="sh9x" x="847.0" y="200" width="80.0" height="560" fill="#FFFFFF" opacity="0"/></g></g></g>
    <g id="wG9x" mask="url(#mG9x)"><use class="u9" href="#pg9x"/></g><g clip-path="url(#sG9x)">{_wd('GUIDES',572,250,-6,'lG',False)}</g>
    <clipPath id="dLc9x"><rect x="-200" y="300" width="{SPX+200}" height="400"/></clipPath><clipPath id="dRc9x"><rect x="{SPX}" y="300" width="1400" height="400"/></clipPath>
    <g id="wC9x">
      <g id="dL9x" clip-path="url(#dLc9x)"><g mask="url(#mC9x)"><use class="u9" href="#pc9x"/></g><g clip-path="url(#sC9x)">{_wd('CHAMPAGNE',546,136,-3,'lC',False)}</g></g>
      <g id="dR9x" clip-path="url(#dRc9x)"><g mask="url(#mC9x)"><use class="u9" href="#pc9x"/></g><g clip-path="url(#sC9x)">{_wd('CHAMPAGNE',546,136,-3,'lC',False)}</g></g></g>
    <g id="fl9x"><g transform="translate({FLX} 500) scale(1.7) translate({-FLX} -500)">
      <clipPath id="flc9x"><path d="M{FLX-29} 392 C {FLX-31} 460 {FLX-14} 512 {FLX} 520 C {FLX+14} 512 {FLX+31} 460 {FLX+29} 392 Z"/></clipPath>
      <rect id="flq9x" x="{FLX-40}" y="524" width="80" height="0" fill="#EAE0B8" opacity=".92" clip-path="url(#flc9x)"/>
      <g clip-path="url(#flc9x)">{FBUB}</g>
      <path class="fls9x" d="M{FLX-29} 392 C {FLX-31} 460 {FLX-14} 512 {FLX} 520 C {FLX+14} 512 {FLX+31} 460 {FLX+29} 392" fill="none" stroke="#F4F2ED" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path class="fls9x" d="M{FLX} 520 L {FLX} 598" fill="none" stroke="#F4F2ED" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path class="fls9x" d="M{FLX-34} 603 Q {FLX} 594 {FLX+34} 603" fill="none" stroke="#F4F2ED" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></g></g>
    <g id="bbs9x">{bub}</g>
    <g id="wT9x" mask="url(#mT9x)"><use class="u9" href="#pt9x"/></g><g clip-path="url(#sT9x)">{_wd('COTSWOLDS',546,146,-3,'lT',False)}</g>
    <g id="q9x"><g id="qG9x"><g class="ql9x" id="ql9x2"><g clip-path="url(#qhc9x)"><text fill="#4A3FB0" x="312" y="760" font-weight="700" font-size="640">?</text></g><g><circle cx="506" cy="706" r="54" fill="#4A3FB0"/></g></g><g class="ql9x" id="ql9x1"><g clip-path="url(#qhc9x)"><text fill="#9FB0FF" x="312" y="760" font-weight="700" font-size="640">?</text></g><g><circle cx="506" cy="706" r="54" fill="#9FB0FF"/></g></g><g class="ql9x" id="ql9x0"><g id="qH9x" clip-path="url(#qhc9x)"><text fill="url(#qgr9x)" stroke="#F4F2ED" stroke-width="4" stroke-linejoin="round" stroke-dasharray="2100" stroke-dashoffset="2100" fill-opacity="0" x="312" y="760" font-weight="700" font-size="640">?</text></g><g id="qD9x"><circle cx="506" cy="706" r="54" fill="url(#qgr9x)" stroke="#F4F2ED" stroke-width="4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" fill-opacity="0" transform="rotate(-90 506 706)"/></g></g></g></g>
    <g id="ms9x"><g transform="translate(500 560) scale(1.2) translate(-500 -560)">
      <clipPath id="tc9xx"><rect id="tcr9x" x="70" y="600" width="0" height="80"/></clipPath>
      <g clip-path="url(#tc9xx)"><rect x="80" y="610" width="840" height="56" rx="8" fill="#F4F2ED"/>{ticks}{nums}<rect x="904" y="604" width="22" height="68" rx="5" fill="#C7CEF0"/></g>
      {circ}{labs}
      <g transform="translate(500 330) rotate(-8)">{seal}</g></g></g>
  </g>
"""

# a10 white label: the confirmation flips from our brand to the agency's
a10 = '''<!-- a10 white label -->
  <g filter="url(#ds)" class="st" data-st="a10">
    <g id="flip10">
      <g id="back10"><rect x="230" y="230" width="540" height="420" rx="36" fill="#0F1426"/>
        <image href="__EMBLEM__" x="440" y="300" width="120" height="120"/><text x="500" y="490" text-anchor="middle" font-weight="600" font-size="44" fill="#EEF0F6">City Premium</text>
        <text x="500" y="545" text-anchor="middle" font-size="28" fill="#9FB0FF">Operator</text></g>
      <g id="front10" opacity="0"><rect x="230" y="230" width="540" height="420" rx="36" fill="#FFFFFF"/>
        <circle cx="500" cy="330" r="58" fill="#3E4A88"/><text x="500" y="346" text-anchor="middle" font-weight="700" font-size="44" fill="#FFFFFF">YA</text>
        <text x="500" y="445" text-anchor="middle" font-weight="700" font-size="50" fill="#0F1426">Your Agency</text>
        <path id="ul10" d="M370 470 H630" stroke="#9FB0FF" stroke-width="7" stroke-linecap="round" stroke-dasharray="260" stroke-dashoffset="260"/>
        <text x="500" y="540" text-anchor="middle" font-weight="600" font-size="30" fill="#2A3352">Chauffeur confirmed</text>
        <text x="500" y="585" text-anchor="middle" font-size="26" fill="#5A6690">Le Bourget, 10:40</text></g>
      <rect id="sheen10" x="230" y="230" width="90" height="420" fill="rgba(255,255,255,.55)" opacity="0"/>
    </g>
  </g>
'''

# a11 trust rows
i0 = src.index('<g id="trust">'); i1 = src.index('</g>\n  </g>\n\n  <use id="car0"', i0)
trust = src[i0:i1 + 4]
trust = trust.replace('>Palace hotels<', '>VIC clients<').replace('>Embassies<', '>Travel agencies<')
for _k,(_n,_cy) in enumerate([('diamond',230),('suitcase-rolling',490),('crown-simple',750)]):
    _i=trust.index(f'<circle cx="150" cy="{_cy}" r="100" fill="rgba(238,240,246,.1)"/>')+len(f'<circle cx="150" cy="{_cy}" r="100" fill="rgba(238,240,246,.1)"/>')
    _j=trust.index('<text x="300"',_i)
    trust=trust[:_i]+icon(_n,150,_cy,110,'#9FB0FF',cls='ic2')+trust[_j:]
trust = trust if True else re.sub(r'<g id="bell11">.*?</g>', '<g id="bell11"><path class="ic" d="M104 790 L112 730 L132 756 L150 716 L168 756 L188 730 L196 790 Z M104 806 H196" fill="none" stroke="#9FB0FF" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="700" stroke-dashoffset="700"/></g>', trust, flags=re.S)
a11 = f'''<!-- a11 trust -->
  <g filter="url(#ds)" class="st" data-st="a11">
    {trust}
  </g>
'''

dawn = '''<g id="dawnW" transform="translate(1700 -920)" opacity="0" style="pointer-events:none">
    <defs><radialGradient id="dawnG"><stop offset="0" stop-color="rgba(255,255,255,.75)"/><stop offset=".22" stop-color="rgba(222,214,255,.5)"/><stop offset=".5" stop-color="rgba(160,140,240,.22)"/><stop offset="1" stop-color="rgba(120,110,220,0)"/></radialGradient>
      <linearGradient id="rayG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="rgba(255,255,255,.34)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></linearGradient>
      <radialGradient id="flG"><stop offset="0" stop-color="rgba(255,255,255,.9)"/><stop offset=".35" stop-color="rgba(199,206,240,.35)"/><stop offset="1" stop-color="rgba(199,206,240,0)"/></radialGradient>
      <filter id="rayB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
    <ellipse id="dawnE" cx="500" cy="150" rx="1100" ry="430" fill="url(#dawnG)"/>
    <g id="dawnR" filter="url(#rayB)"><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(-58)" fill="url(#rayG)"/><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(-34)" fill="url(#rayG)"/><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(-12)" fill="url(#rayG)"/><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(10)" fill="url(#rayG)"/><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(31)" fill="url(#rayG)"/><path d="M0 0 L-46 -1000 L46 -1000 Z" transform="rotate(55)" fill="url(#rayG)"/></g>
    <ellipse id="dawnS" cx="500" cy="150" rx="320" ry="70" fill="url(#flG)"/>
    <ellipse id="flare" cx="500" cy="150" rx="340" ry="9" fill="url(#flG)" opacity="0"/>
  </g>'''
stations = a1 + '\n  ' + dawn + a2 + '\n  ' + a6 + '\n  ' + a7 + a8 + '\n  ' + a8b + '\n  ' + a9 + '\n  ' + a9x + a10 + '\n  ' + a11 + '\n  '
cut('<!-- s1 countdown -->', '<use id="car0"', stations)
rep('riser:"__RISER__"}', 'riser:"__RISER__",pop:"__POP__",popl:"__POPL__",shim:"__SHIM__"}')
rep("['logo','swish','tick','car','jet','phone','keycard','riser'].forEach(k=>{if(ASSET[k]", "['logo','swish','tick','car','jet','phone','keycard','riser','pop','popl','shim'].forEach(k=>{if(ASSET[k]")
rep('<filter id="ds"', '<radialGradient id="coreHalo"><stop offset=".45" stop-color="rgba(159,176,255,.28)"/><stop offset="1" stop-color="rgba(159,176,255,0)"/></radialGradient><radialGradient id="coreG" cx=".4" cy=".35"><stop offset="0" stop-color="#36407A"/><stop offset="1" stop-color="#0F1426"/></radialGradient><linearGradient id="orbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#9FB0FF"/><stop offset="1" stop-color="#C7CEF0"/></linearGradient><linearGradient id="trG" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="rgba(159,176,255,0)"/><stop offset="1" stop-color="rgba(159,176,255,.8)"/></linearGradient><clipPath id="clip8"><rect x="-60" y="-20" width="1120" height="1040"/></clipPath>\n  <filter id="ds"')

# ------------------------------------------------------------------ text
TXT = {
 'a1': "Your client lands|in *Paris tomorrow,|and the itinerary|is ^perfect.",
 'a2': "You already work|with a ^DMC,|and maybe you're part|of *Virtuoso too.",
 'a3': "But on the ground,|someone still has to|make it all happen,|at the aircraft ^door,|at the ^restaurant,|and at !two in the morning.",
 'a5': "We're not a broker,|and we don't replace|your partners.|We're an !operator.|We *orbit around your DMC|and your network,|and we fill the ^gaps|in real time.",
 'a6': "Everything is|*à *la !carte.|You take exactly|what you ^need,|and nothing you don't.",
 'a7': "At the heart of it|are our own !fleet|and our own ^chauffeurs,|*directly *employed|in *Paris and *London.|They're trained|for ^VIP clients|and know the city by heart,|whether it's a single transfer|or a ^driver for the whole day.",
 'a8': "We greet your clients|at private terminals|like *Le *Bourget,|*Farnborough and *Biggin *Hill,|and at airports|across ^Europe.",
 'a8b': "On commercial flights,|we can even meet them|!airside|at *Heathrow and *Charles de *Gaulle,|with ^fast ^track|through passport control|and customs,|if you want it.",
 'a9': "And when the brief|goes further,|our *concierge|charters the ^jet,|books the hotel|with !zero fees,|and handles every|^ad ^hoc request|around the clock.",
 'a9x': "And because we know|the ground like *locals,|we design the moments|your clients will ^remember.|We arrange private visits|with expert ^guides,|a tour of *Champagne|with a cellar|opened just for them,|or a weekend|in the *Cotswolds.|And sometimes,|something truly *unusual.|Every experience|is ^made to ^measure.",
 'a10': "And everything is|!white !label,|so your client only|ever sees ^your ^name.",
 'a11': "Since !2010,|luxury ^maisons,|^travel agencies|and *VIC clients|have trusted us.",
}
LT = {'a2', 'a3', 'a6', 'a9', 'a10'}
blocks = ''
for k, v in TXT.items():
    blocks += f'  <div class="tb{" lt" if k in LT else ""}" data-sc="{k}"><p class="kt" data-say="{v}"></p></div>\n'
    if k == 'a3':
        blocks += '  <div class="tb center low" data-sc="a4"><p class="kt s" data-say="That\'s where City Premium comes in." data-hidden="1"></p></div>\n'
blocks += '  <div class="tb center mid" data-sc="a12"><p class="kt s" data-say="City Premium," data-hidden="1"></p><p class="kt s" data-say="your local partner|in *Paris, *London|and across ^Europe."></p><p class="kt s" data-say="Book a meeting with us today." data-hidden="1"></p></div>\n'
cut('  <div class="tb" data-sc="s1">', '</div>\n\n<div class="ov" id="logoOv"', blocks)

# ------------------------------------------------------------------ CSS
rep('.tb[data-sc="s5"] .kt .w.em>b,.tb[data-sc="s5"] .kt .w.big>b{color:#E3E8FF}', '.tb[data-sc="a5"] .kt .w.em>b,.tb[data-sc="a5"] .kt .w.big>b{color:#E3E8FF}')
rep('.tb[data-sc="s7b"]{--acc:#FFFFFF}', '.tb[data-sc="a8b"]{--acc:#FFFFFF}')
rep('.tb[data-sc="s7b"] .kt .w.em:not(.hl)>b{color:#FFFFFF}', '.tb[data-sc="a8b"] .kt .w.em:not(.hl)>b{color:#FFFFFF}')
rep('.st[data-st="s8"] .tile8>rect{fill:#FFFFFF}', '.st[data-st="a9"] .tile8>rect{fill:#FFFFFF}\n.tl{stroke:color-mix(in srgb,var(--ink) calc(var(--tone)*100%),var(--paper))}')
rep('.st[data-st="s8"] [stroke="#EEF0F6"]{stroke:#0F1426}', '.st[data-st="a9"] [stroke="#EEF0F6"]{stroke:#0F1426}')
rep('.st[data-st="s8"] [fill="#EEF0F6"]{fill:#0F1426}', '.st[data-st="a9"] [fill="#EEF0F6"]{fill:#0F1426}')
rep('.st[data-st="s8"] text[fill="#C7CEF0"]{fill:#5A6690}', '.st[data-st="a9"] text[fill="#C7CEF0"]{fill:#5A6690}')

# ------------------------------------------------------------------ JS: scenes, layout
rep("const SCN=['s1','s2','s3','s4','s5','s6','s7a','s7b','s8','s9','s10','s11','s12']", "const SCN=['a1','a2','a3','a4','a5','a6','a7','a8','a8b','a9','a9x','a10','a11','a12']")
rep("const POS={s1:[0,0],s2:[2200,-420],s3:[4400,160],s5:[6600,-380],s6:[8800,180],s7a:[11000,-400],s7b:[13200,160],s8:[15400,-360],s9:[17600,180],s10:[19800,-340],s11:[22000,140]};",
    "const POS={a1:[0,0],a2:[2200,-420],a6:[4400,160],a7:[6600,-380],a8:[8800,180],a8b:[11000,-400],a9:[13200,160],a9x:[15400,-360],a10:[17600,180],a11:[19800,-340]};")
rep("const ROAD=crPath([[-1800,450],...RP,[23800,570]]);", "const ROAD=crPath([[-1800,450],...RP,[21600,570]]);")
# drop old static builders (dial ticks, chain)
i = s.index('// static builders'); j = s.index("const STS=")
s = s[:i] + s[j:]
rep("const STS=$$('.st').map(el=>({el,sc:{s1:['s1'],s2:['s2'],s3:['s3','s4'],s5:['s4','s5'],s6:['s6'],s7a:['s7a'],s7b:['s7b'],s8:['s8'],s9:['s9'],s10:['s10'],s11:['s11']}[el.dataset.st]}));",
    "const STS=$$('.st').map(el=>({el,sc:{a1:['a1'],a2:['a2','a3','a4','a5'],a6:['a6'],a7:['a7'],a8:['a8'],a8b:['a8b'],a9:['a9'],a9x:['a9x'],a10:['a10'],a11:['a11']}[el.dataset.st]}));")
rep("const chN=$$('#chainNodes>g'),chL=$$('#chainLines path');let chT=[];", "")
rep("const TONE={s1:'#0F1426',s2:'#0F1426',s3:'#EEF0F6',s4:'#0F1426',s5:'#5A6690',s6:'#0F1426',s7a:'#0F1426',s7b:'#2B3561',s8:'#EEF0F6',s9:'#C7CEF0',s10:'#0F1426',s11:'#0F1426',s12:'#0F1426'};",
    "const TONE={a1:'#0F1426',a2:'#EEF0F6',a3:'#EEF0F6',a4:'#0F1426',a5:'#5A6690',a6:'#EEF0F6',a7:'#0F1426',a8:'#0F1426',a8b:'#2B3561',a9:'#EEF0F6',a9x:'#2B3561',a10:'#C7CEF0',a11:'#0F1426',a12:'#0F1426'};")
rep("const LIGHT={s3:1,s8:1,s9:1};", "const LIGHT={a2:1,a3:1,a6:1,a9:1,a10:1};")
rep("let prev=TONE.s1", "let prev=TONE.a1")
rep("d.style.background=id==='s7b'?", "d.style.background=id==='none'?")
rep("const t=p.id==='s4'?SA('s4')-.45:SA(p.id)-.3;p.t=t;if(p.id==='s4')", "const t=p.id==='a4'?SA('a4')-.45:SA(p.id)-.3;p.t=t;if(p.id==='a4')")
rep("  J1.a0=C('lands')-.6;J1.o0=C('bourget')-.1;J1.o1=C('forty')+.35;\n", "")

# camera
i = s.index("  // zoom-through: punch into the dial's centre"); j = s.index("  // the car drives the road between scenes")
s = s[:i] + """  const foc=(id,px,py,z,t,d=1,ease='power3.inOut')=>{if(portrait){py=Math.min(py,480);z=Math.min(z,1.05)}return tl.to(cam,{x:POS[id][0]+px-500,y:POS[id][1]+py-500,z,duration:d,ease},t);}
  const fz=(id,px,py,z,t,d=.9,ease='expo.inOut')=>{if(portrait){py=Math.min(py,480);z=Math.min(z*.92,1.22)}return tl.to(cam,{x:POS[id][0]+px-500,y:POS[id][1]+py-500,z,duration:d,ease},t)};
  fz('a1',500,520,1.24,C('itinerary')-.8,1.3,'power3.inOut');
  tl.to(cam,{z:portrait?1.12:1.36,duration:.5,ease:'power4.out'},C('perfect')-.2);
  go('a2',SA('a2')-.15);
  fz('a2',590,420,1.42,C('dmc#1')-.45,.85);
  fz('a2',400,580,1.42,C('virtuoso')-.5,.9);
  fz('a2',500,500,.96,C('ground')-.45,1.1,'power3.inOut');
  fz('a2',470,330,1.28,C('aircraft')-.55,.8);
  fz('a2',560,540,1.28,C('restaurant')-.5,.8);
  fz('a2',420,640,1.28,C('two')-.5,.8);
  tl.to(cam,{x:2200,y:-420,z:.62,sx:.5,sy:.5,dim:.9,duration:1.1,ease:'power3.inOut'},SA('a4')-.25);
  tl.to('#world',{filter:'blur(6px)',duration:.7,ease:'power2.out'},SA('a4')-.2);tl.to('#world',{filter:'blur(0px)',duration:.5,ease:'power2.inOut'},SA('a5')-.5);
  go('a2',SA('a5')-.45,{d:1.3,z:1.5,py:500,dip:1});
  tl.to(cam,{z:1.05,duration:C('partners')-.5-(SA('a5')+.85),ease:'power2.inOut'},SA('a5')+.85);
  tl.to(cam,{z:1.14,x:2150,duration:.9,ease:'power3.out'},C('partners')-.5);
  tl.to(cam,{z:.98,x:2200,duration:1.1,ease:'power3.inOut'},C('operator')-.65);
  tl.to(cam,{z:.9,duration:1.4,ease:'expo.inOut'},C('operator')+1.5);
  tl.to(cam,{z:.97,duration:C('gaps')-.3-(C('operator')+2.9),ease:'sine.inOut'},C('operator')+2.9);
  tl.to(cam,{z:1.04,duration:.9,ease:'power3.out'},C('gaps')-.3);
  go('a6',SA('a6')-.15);
  foc('a6',500,380,1.12,C('exactly')-.8,1.1);foc('a6',500,470,1.12,C('need')-.6,.8);foc('a6',480,600,1.12,C('nothing')-.6,.7);foc('a6',500,500,.98,C('dont#2')-.1,1.1);
  go('a7',SA('a7')-.15);
  foc('a7',500,270,1.16,C('directly')-.5,.8,'power3.out');foc('a7',500,520,1,C('vip')-.7,1);foc('a7',500,680,1.08,C('driver')-.6,1);
  go('a8',SA('a8')-.15);
  tl.to(cam,{z:1.08,duration:C('airports')-SA('a8')-1.4,ease:'sine.inOut'},SA('a8')+1.1);tl.to(cam,{z:.98,duration:1.6,ease:'expo.inOut'},C('airports')-.3);
  go('a8b',SA('a8b')-.15,{z:1.12,py:330});
  foc('a8b',500,320,1,C('heathrow')-.5,1.2);foc('a8b',520,730,1.08,C('fast')-.6,1.05);foc('a8b',540,730,1.13,C('passport')+.1,C('want')-C('passport'),'sine.inOut');
  go('a9',SA('a9')-.15);
  foc('a9',500,280,1.2,C('jet')-.7,1);foc('a9',500,520,1.2,C('hotel')-.6,.9);foc('a9',500,740,1.2,C('ad')-.7,.9);foc('a9',500,500,.98,C('clock')-.5,1.1);
  go('a9x',SA('a9x')-.15,{z:1.02});
  fz('a9x',500,470,1.12,SA('a9x')+1.2,C('visits')-SA('a9x')-1.65,'sine.inOut');fz('a9x',500,480,1.0,C('visits')-.4,.7,'expo.inOut');fz('a9x',500,480,1.06,C('champagne')-.4,.7);
  fz('a9x',500,500,1.0,C('weekend')-.4,.8);
  fz('a9x',500,500,1.14,C('sometimes')-.2,C('unusual')-C('sometimes')-.1,'sine.inOut');tl.to(cam,{z:portrait?1.12:1.22,duration:1.1,ease:'sine.inOut'},C('unusual')-.15);fz('a9x',500,500,.98,C('experience')-.45,.8);
  go('a10',SA('a10')-.15,{z:.92});
  foc('a10',500,450,1.28,C('name')-.7,1.3);
  go('a11',SA('a11')-.15,{z:1.22,py:260});
  fz('a11',500,470,1.2,C('agencies')-.5,.8);fz('a11',500,640,1.1,C('vic')-.5,.8);fz('a11',500,500,.98,C('trusted')-.35,.9,'power3.inOut');
  {const kf=portrait?Math.min(W*.92,H*.5)/1000:Math.min(W*.5,H*.86)/1000;const zf=(W*.98)/(22200*kf);tl.to(cam,{x:9900,y:-90,z:zf,sx:.5,sy:.42,dim:.7,duration:2.2,ease:'power3.inOut'},SA('a12')-.3)}
""" + s[j:]
rep("const go=(id,t,o={})=>{const [x,y]=POS[id];tl.to(cam,{x,y,z:o.z||1,sx:o.sx||.72,sy:o.sy||.5,dim:o.dim||0,duration:o.d||1.3,ease:o.ease||'expo.inOut'},t)};",
    "const go=(id,t,o={})=>{const d=o.d||1.3,z=o.z||1,x=POS[id][0]+(o.px||500)-500,y=POS[id][1]+(o.py||500)-500;tl.to(cam,{x,y,sx:o.sx||.72,sy:o.sy||.5,dim:o.dim||0,duration:d,ease:o.ease||'expo.inOut'},t);tl.to(cam,{keyframes:[{z:z*(o.dip||.78),duration:d*.5,ease:'power2.inOut'},{z,duration:d*.5,ease:'power3.out'}]},t)};")
rep("const t=(k==='s5'?SA('s5')-.35:SA(k)-.15);", "const t=SA(k)-.15;")
rep("duration:k==='s5'?1.2:1.3,ease:'expo.inOut',immediateRender:false", "duration:1.3,ease:'expo.inOut',immediateRender:false")

# scene timelines
i = s.index("  // S1 hurry"); j = s.index("  // S4 logo")
s = s[:i] + open('/home/claude/ta/tl_a.js').read() + s[j:]
i = s.index("  // S5 operator"); j = s.index("  // S12 the whole journey")
s = s[:i] + open('/home/claude/ta/tl_b.js').read() + s[j:]
rep("{const fly=SA('s5')-.45;", "{const fly=SA('a5')-.45;")
rep("C('book#2')", "C('book')", 99)
rep("const ct=C('city#2')-.3;", "const ct=C('city#3')-.3;")

# sound
i = s.index("['s3','s6','s7a','s7b','s8','s9','s10','s11'].forEach"); j = s.index("SFX.sort(")
s = s[:i] + open('/home/claude/ta/sfx.js').read() + s[j:]

# per-frame
i = s.index("function jet1(t){"); j = s.index("function toneAt(t)")
s = s[:i] + 'const PLN='+json.dumps(icon('airplane',0,0,40,'#FFFFFF','fill'))+';\n' + open('/home/claude/ta/frame.js').read() + s[j:]
rep("jet1(t);relay(t);dialFx(t);", "frameA(t);")
rep("SA('s12')", "SA('a12')", 99)
i = s.index("  {const sec=Math.max(0,2400"); j = s.index("  $('#text').querySelectorAll('.tb')")
s = s[:i] + s[j:]
rep("v=o.sc.includes('s11')?", "v=o.sc.includes('a11')?")
rep("let DUCK=.55,T=C('city#1')+1.2", "let DUCK=.55,T=0")
rep("DUCK+=((sp?.36:.6)-DUCK)*.12;", "const wz=t>C('sometimes')-.3&&t<C('unusual')+.9,iz=t<C('city')-.4;DUCK+=((wz?.13:sp?(iz?.19:.23):.4)-DUCK)*.12;")
rep("tl.fromTo(cam,{z:1.25},{z:1,duration:2.2,ease:'power2.out'},0);", "{const L=C('paris#1')+.25;tl.fromTo(cam,{x:-560,y:-140,z:portrait?1.5:1.95},{x:-560,y:-140,z:portrait?1.5:1.95,duration:.001,immediateRender:true},0);tl.to(cam,{z:portrait?1.25:1.5,duration:L-.1,ease:'sine.inOut'},.1)}")
rep("tl.fromTo('#rip',{x:()=>cw()*.62-W*.03,y:()=>chh()*.45-W*.03,scale:.3,opacity:.9},{scale:3,opacity:0,duration:.6},C('book')+1.15);","tl.set('#rip',{opacity:0},0);tl.fromTo('#rip',{x:()=>cw()*.62-W*.03,y:()=>chh()*.45-W*.03,scale:.3,opacity:.9},{scale:3,opacity:0,duration:.6,immediateRender:false},C('book')+1.15);")

# richer colour: layered gradients on every background panel, plus slow drifting light blobs
rep(":TONE[id];document.querySelector('#panels').appendChild(d);", ":GB(id);document.querySelector('#panels').appendChild(d);")
rep("const LIGHT={a2:1,a3:1,a6:1,a9:1,a10:1};", """const LIGHT={a2:1,a3:1,a6:1,a9:1,a10:1};
const GBM={'#0F1426':'radial-gradient(75% 65% at 85% 12%,rgba(112,96,232,.34),rgba(112,96,232,0) 62%),radial-gradient(60% 60% at 6% 96%,rgba(56,132,214,.24),rgba(56,132,214,0) 60%),linear-gradient(160deg,#151B36,#0B0F1E)',
 '#EEF0F6':'radial-gradient(60% 58% at 88% 8%,rgba(196,186,255,.6),rgba(196,186,255,0) 62%),radial-gradient(55% 55% at 4% 100%,rgba(176,212,255,.55),rgba(176,212,255,0) 62%),#EEF0F6',
 '#5A6690':'radial-gradient(70% 60% at 72% 0%,rgba(206,190,255,.5),rgba(206,190,255,0) 62%),radial-gradient(60% 60% at 0% 100%,rgba(36,54,132,.6),rgba(36,54,132,0) 62%),linear-gradient(180deg,#6672A6,#47517E)',
 '#2B3561':'radial-gradient(70% 55% at 72% 6%,rgba(166,146,255,.38),rgba(166,146,255,0) 62%),radial-gradient(60% 60% at 0% 100%,rgba(48,120,200,.25),rgba(48,120,200,0) 60%),linear-gradient(180deg,#303A6C,#1D2448)',
 '#C7CEF0':'radial-gradient(60% 60% at 90% 0%,rgba(255,255,255,.65),rgba(255,255,255,0) 62%),radial-gradient(60% 60% at 0% 100%,rgba(150,128,240,.38),rgba(150,128,240,0) 62%),#C7CEF0'};
const GB=id=>GBM[TONE[id]]||TONE[id];
const MB={v:0};""")
rep('<div id="panels"></div>', '<div id="panels"></div><div id="glow"><i></i><i></i><i></i></div>')
rep('#panels{position:absolute;inset:0}', '#glow{position:absolute;inset:0;pointer-events:none;opacity:.3}#glow i{position:absolute;width:80cqmax;height:80cqmax;left:0;top:0;will-change:transform}#glow i:nth-child(1){background:radial-gradient(closest-side,rgba(142,124,240,.9),rgba(142,124,240,0))}#glow i:nth-child(2){background:radial-gradient(closest-side,rgba(79,163,224,.8),rgba(79,163,224,0))}#glow i:nth-child(3){background:radial-gradient(closest-side,rgba(199,206,240,.8),rgba(199,206,240,0))}#panels{position:absolute;inset:0}')
rep('<svg id="world" xmlns="http://www.w3.org/2000/svg">', '<svg id="world" xmlns="http://www.w3.org/2000/svg"><defs><filter id="mb" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB"><feGaussianBlur id="mbB" stdDeviation="0 0"/></filter></defs>')
rep("const go=(id,t,o={})=>{const d=o.d||1.3,z=o.z||1,", "const go=(id,t,o={})=>{if(o.dip!==1)tl.to(MB,{keyframes:[{v:1,duration:(o.d||1.3)*.5,ease:'power2.in'},{v:0,duration:(o.d||1.3)*.5,ease:'power2.out'}]},t);const d=o.d||1.3,z=o.z||1,")
rep("const shapes=[['inset(0 100% 0 0)','inset(0 0% 0 0)'],['circle(0% at 72% 55%)','circle(150% at 72% 55%)'],['inset(0 0 0 100%)','inset(0 0 0 0%)'],['inset(100% 0 0 0)','inset(0% 0 0 0)']];",
    "const shapes=[['circle(0% at 72% 55%)','circle(150% at 72% 55%)'],['circle(0% at 100% 100%)','circle(160% at 100% 100%)'],['circle(0% at 85% 30%)','circle(150% at 85% 30%)']];")
# v9b: no swoosh on every text chunk; kinetic ending
rep("if(!first)add('swish',c.t-.08,.22);", "")
rep("tl.fromTo('#cta',{scale:0},{scale:1,duration:.5,ease:'back.out(2)'},C('book')-.25);", "tl.fromTo('#cta',{scale:.9,opacity:0,y:28},{scale:1,opacity:1,y:0,duration:.6,ease:'expo.out'},C('book')-.25);tl.fromTo('#ctaOv',{scale:1.06},{scale:1,duration:2.2,ease:'expo.out'},C('city#3')-.55);tl.to('#ctaOv',{scale:1.045,duration:Math.max(1,T_END-C('city#3')-1.7),ease:'sine.inOut'},C('city#3')+1.65);")
rep(".url{font-size:2cqmin;", ".url{font-size:2.5cqmin;")
rep("tl.from('#url12',{opacity:0,y:20,duration:.5},C('today'));", "tl.from('#url12',{opacity:0,y:20,duration:.5},C('today'));")
# a better car: a top-down luxury saloon with glass, mirrors, headlight beams and a soft shadow
_a=s.index('<symbol id="carT"');_b=s.index('</symbol>',_a)+9
s=s[:_a]+CAR+s[_b:]
s=s.replace('<use id="car0" href="#carT" x="-60" y="-26" width="120" height="52"/>','<use id="car0" href="#carT" x="-84" y="-36.4" width="168" height="72.8"/>')
open('/home/claude/ta/ta1.html', 'w').write(s)
print('ok', len(s))
