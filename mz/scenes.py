# Maisons v3 stations. Executed inside gen.py (icon, IV, ON, INK, SIL available). Sans serif throughout.
import math
SER = ''
def hx(c):
    c = c.lstrip('#'); return [int(c[i:i+2], 16) for i in (0, 2, 4)]
def mix(a, b, t):
    A, B = hx(a), hx(b); return '#%02X%02X%02X' % tuple(round(A[i] + (B[i] - A[i]) * t) for i in range(3))
def ic(n, x, y, s, c): return icon(n, x, y, s, c, 'regular')

# ------------------------------------------------------------------ m1 one envelope splits into forty; one comes forward and opens
ENV_BODY = ('<rect x="-150" y="-100" width="300" height="200" rx="10" fill="url(#ivG)"/>'
            '<path d="M-150 -100 L-8 2 L-150 100Z" fill="#EEEBE4"/><path d="M150 -100 L8 2 L150 100Z" fill="#EEEBE4"/>'
            '<path d="M-150 100 L-8 4 Q0 -2 8 4 L150 100Z" fill="#E5E1D7"/>')
ENV_FLAP = '<path d="M-150 -100 L-10 6 Q0 13 10 6 L150 -100Z" fill="#F4F2ED" stroke="rgba(22,23,29,.07)" stroke-width="1.5"/>'
ENV_SEAL = '<circle cx="0" cy="6" r="24" fill="#16171D"/><circle cx="0" cy="6" r="18" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/><image href="__EMBLEM__" x="-14" y="-8" width="28" height="28"/>'
COLS, ROWS, CW, CH, SC = 8, 5, 112, 88, .34
LEAF = []
for r in range(ROWS):
    for c in range(COLS):
        LEAF.append((500 + (c - 3.5) * CW, 500 + (r - 2) * CH))
CAV = 1 * COLS + 5
paths = {i: [] for i in range(len(LEAF))}
def split(ids, depth):
    cx = sum(LEAF[i][0] for i in ids) / len(ids); cy = sum(LEAF[i][1] for i in ids) / len(ids)
    for i in ids: paths[i].append((cx, cy))
    if len(ids) == 1: return depth
    xs = [LEAF[i][0] for i in ids]; ys = [LEAF[i][1] for i in ids]
    ax = 0 if (max(xs) - min(xs)) >= (max(ys) - min(ys)) * 1.1 else 1
    o = sorted(ids, key=lambda i: (LEAF[i][ax], LEAF[i][1 - ax])); h = (len(o) + 1) // 2
    return max(split(o[:h], depth + 1), split(o[h:], depth + 1))
DEPTH = split(list(range(len(LEAF))), 0)
for i in paths:
    while len(paths[i]) < DEPTH + 1: paths[i].append(paths[i][-1])
    paths[i][0] = (500, 500)
leaves = ''
for i in range(len(LEAF)):
    dp = '|'.join(f'{x:.1f},{y:.1f}' for x, y in paths[i])
    if i == CAV:
        leaves += (f'<g class="ev1 cav" id="ev1{i}" data-p="{dp}">'
                   f'<g id="evfo"><path d="M-150 -100 L-10 -214 Q0 -220 10 -214 L150 -100Z" fill="#E9E6DF"/></g>'
                   f'<rect x="-150" y="-100" width="300" height="200" rx="10" fill="#E9E6DF"/>'
                   f'<g id="evcd"><rect x="-128" y="-84" width="256" height="168" rx="6" fill="#FFFFFF"/>'
                   f'<text x="0" y="-26" text-anchor="middle" font-size="18" font-weight="700" letter-spacing="4" fill="#8A877F">MR &amp; MRS</text>'
                   f'<text x="0" y="18" text-anchor="middle" font-size="40" font-weight="600" letter-spacing="-.5" fill="{INK}">Cavendish</text>'
                   f'<line x1="-40" y1="42" x2="40" y2="42" stroke="#D3CEC3" stroke-width="1.5"/></g>'
                   f'<path d="M-150 -100 L-8 2 L-150 100Z" fill="#EEEBE4"/><path d="M150 -100 L8 2 L150 100Z" fill="#EEEBE4"/>'
                   f'<path d="M-150 100 L-8 4 Q0 -2 8 4 L150 100Z" fill="#E5E1D7"/>'
                   f'<rect x="-150" y="-100" width="300" height="200" rx="10" fill="none" stroke="rgba(22,23,29,.06)" stroke-width="1.5"/>'
                   f'<g id="evfc">{ENV_FLAP}</g><g id="evsl">{ENV_SEAL}</g></g>')
    else:
        leaves += f'<g class="ev1" id="ev1{i}" data-p="{dp}"><use href="#envS" x="-150" y="-100" width="300" height="200"/></g>'
m1 = f'''<!-- m1 envelopes -->
  <g filter="url(#ds)" class="st" data-st="m1">
    <defs><symbol id="envS" viewBox="-150 -100 300 200">{ENV_BODY}{ENV_FLAP}{ENV_SEAL}</symbol></defs>
    <g id="evs1">{leaves}</g>
  </g>
'''

# ------------------------------------------------------------------ m2 the satin ribbon (three.js) with a tag and the handovers
WP = [('door-open', 'Aircraft door', .50, -1), ('car-profile', 'The car', .60, 1), ('key', 'The suite', .70, -1), ('sparkle', 'The show', .80, 1), ('wine', 'The dinner', .885, -1), ('house-line', 'Home', .965, 1)]
wps = ''
_items = [w[1] for w in WP]
for row in range(2):
    it = _items[row*3:row*3+3]; ws = [len(x) * 18.5 + 24 for x in it]; gap = 40; tot = sum(ws) + gap * 2; x = 500 - tot / 2; y = 722 + row * 66
    for j, (lb, w) in enumerate(zip(it, ws)):
        i = row * 3 + j; cx = x + w / 2
        wps += (f'<g class="wp2" id="wp2{i}"><text x="{cx:.1f}" y="{y}" text-anchor="middle" font-size="32" font-weight="600" letter-spacing="-.3" fill="#F4F2ED">{lb}</text>'
                f'<rect class="wpu" x="{cx - w/2 + 12:.1f}" y="{y+16}" width="{w-24:.1f}" height="3" rx="1.5" fill="#C9CDD8"/></g>')
        if j < 2: wps += f'<circle class="wpd" cx="{x + w + gap/2:.1f}" cy="{y-10}" r="4" fill="#8F929E"/>'
        x += w + gap
wps = f'<g id="tk2">{wps}</g>'
def tag(p):
    return (f'<g id="tg{p}"><g id="tgw{p}"><line id="tgs{p}" x1="0" y1="0" x2="0" y2="66" stroke="#E9E7E2" stroke-width="2.4" stroke-linecap="round"/>'
            f'<g id="tgc{p}"><path d="M-114 82 L-96 66 H96 L114 82 V160 a14 14 0 0 1 -14 14 H-100 a14 14 0 0 1 -14 -14 Z" fill="url(#ivG)"/>'
            f'<path d="M-105 85 L-91 73 H91 L105 85 V158 a8 8 0 0 1 -8 8 H-97 a8 8 0 0 1 -8 -8 Z" fill="none" stroke="{INK}" stroke-opacity=".16" stroke-width="1.5"/>'
            f'<circle cx="0" cy="86" r="7.5" fill="#1B2140" fill-opacity=".9"/><circle cx="0" cy="86" r="7.5" fill="none" stroke="#C9CDD8" stroke-width="2.2"/>'
            f'<text x="0" y="146" text-anchor="middle" font-size="36" font-weight="600" letter-spacing="-.4" fill="{INK}">Your brand</text></g></g></g>')
m2 = f'''<!-- m2 the ribbon -->
  <g class="st" data-st="m2">
    <linearGradient id="fmgR" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".04" stop-color="#fff"/><stop offset=".94" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="fmR" maskUnits="userSpaceOnUse" x="-1100" y="-200" width="2340" height="1600"><rect x="-1100" y="-200" width="2340" height="1600" fill="url(#fmgR)"/></mask>
    <g mask="url(#fmR)"><foreignObject x="-1100" y="-200" width="2340" height="1600"><canvas xmlns="http://www.w3.org/1999/xhtml" id="rib3d" width="2574" height="1760" style="width:2340px;height:1600px;display:block"></canvas></foreignObject></g>
    <g filter="url(#ds)">{wps}
    {tag('2')}</g>
    <filter id="cgl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter><g id="cut2" opacity="0"><ellipse id="cutF" cx="0" cy="0" rx="12" ry="52" fill="#FFFFFF" filter="url(#cgl)" opacity="0"/><line id="cutG" x1="0" y1="-150" x2="0" y2="150" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" filter="url(#cgl)" opacity=".8"/><line id="cutL" x1="0" y1="-150" x2="0" y2="150" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/></g>
  </g>
'''

# ------------------------------------------------------------------ chauffeur badge (motion design, icons only)
def icf(n, x, y, s, c): return icon(n, x, y, s, c, 'fill')
def badge(p, cx, cy, R):
    return (f'<g id="bd{p}"><circle id="bdw{p}" cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#F4F2ED" stroke-width="2" opacity="0"/>'
            f'<circle id="bdx{p}" cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#F4F2ED" stroke-width="2" opacity="0"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{R+40}" fill="none" stroke="rgba(201,205,216,.18)" stroke-width="2"/>'
            f'<circle id="bdr{p}" cx="{cx}" cy="{cy}" r="{R+40}" fill="none" stroke="url(#silvL)" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" transform="rotate(-90 {cx} {cy})"/>'
            f'<g id="bdo{p}"><circle cx="{cx}" cy="{cy - R - 40}" r="8" fill="#F4F2ED"/></g>'
            f'<g id="bdd{p}"><circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#silv)"/>' + icf('steering-wheel', cx, cy, R * 1.05, INK) + '</g></g>')
DAYX = [180 + i * 160 for i in range(5)]
def days(p, y):
    s = f'<g id="dy{p}"><path class="dyb{p}" d="M{DAYX[0]} {y} H{DAYX[-1]}" stroke="rgba(201,205,216,.25)" stroke-width="3"/>'
    s += f'<path id="dyp{p}" d="M{DAYX[0]} {y} H{DAYX[-1]}" stroke="url(#silvL)" stroke-width="3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>'
    for i, (x, d) in enumerate(zip(DAYX, ['MON', 'TUE', 'WED', 'THU', 'FRI'])):
        s += (f'<g class="dc{p}" id="dc{p}{i}"><rect x="{x-68}" y="{y-68}" width="136" height="136" rx="30" fill="#161A2E" stroke="rgba(201,205,216,.3)" stroke-width="2"/>'
              f'<text x="{x}" y="{y-26}" text-anchor="middle" font-size="25" font-weight="700" letter-spacing="3" fill="#C9CDD8">{d}</text>'
              f'<g class="ds{p}"><circle cx="{x}" cy="{y+20}" r="30" fill="url(#silv)"/>' + icf('steering-wheel', x, y + 20, 38, INK) + '</g></g>')
    return s + '</g>'
m3 = f'''<!-- m3 arrival -->
  <g filter="url(#ds)" class="st" data-st="m3">
    <linearGradient id="fmg3" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset=".22" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="fm3" maskUnits="userSpaceOnUse" x="-60" y="-40" width="1300" height="650"><rect x="-60" y="-40" width="1300" height="650" fill="url(#fmg3)"/></mask>
    <g id="jg3"><g mask="url(#fm3)"><foreignObject x="-60" y="-40" width="1300" height="650"><canvas xmlns="http://www.w3.org/1999/xhtml" id="jet3d" width="1800" height="900" style="width:1300px;height:650px;display:block"></canvas></foreignObject></g>
      <g id="gt3"><rect x="40" y="500" width="440" height="104" rx="52" fill="url(#ivG)"/>{ic('users', 98, 552, 44, INK)}
        <text x="138" y="546" font-size="32" font-weight="600" letter-spacing="-.3" fill="{INK}">Mr &amp; Mrs Cavendish</text>
        <text x="139" y="578" font-size="19" font-weight="700" letter-spacing="3" fill="#7A776F">LE BOURGET, 09:00</text></g></g>
    <g id="cb3">{badge('3', 500, 270, 120)}
      <g id="ck3"><rect x="640" y="88" width="326" height="64" rx="32" fill="url(#ivG)"/>{icf('clock', 676, 120, 32, INK)}
        <text x="702" y="130" font-size="25" font-weight="600" fill="{INK}">Waiting since 08:40</text></g>
      <g id="nm3"><text x="500" y="514" text-anchor="middle" font-size="56" font-weight="600" letter-spacing="-1" fill="#F4F2ED">Thomas</text>
        <text x="500" y="554" text-anchor="middle" font-size="22" font-weight="700" letter-spacing="5" fill="#C9CDD8">YOUR CHAUFFEUR</text></g></g>
    {days('3', 740)}
  </g>
'''
WDX = DAYX

# ------------------------------------------------------------------ m4 the personal host
notes = [('coffee', 'Oat flat white, no sugar', 'Coffee'), ('armchair', 'Aisle, second row', 'Seat'), ('clock', 'Never kept waiting', 'Note')]
nt = ''
for i, (icn, txt, lab) in enumerate(notes):
    y = 520 + i * 118
    nt += (f'<g class="nt4" id="nt4{i}"><circle cx="250" cy="{y}" r="36" fill="#EDEBE5"/>' + ic(icn, 250, y, 38, INK) +
           f'<text x="306" y="{y-12}" font-size="21" font-weight="700" letter-spacing="3" fill="#8A877F">{lab.upper()}</text>'
           f'<g class="nw" clip-path="url(#nc4{i})"><text x="306" y="{y+28}" font-size="36" font-weight="600" letter-spacing="-.3" fill="{INK}">{txt}</text></g>'
           f'<clipPath id="nc4{i}"><rect class="ncr" x="300" y="{y-10}" width="0" height="60"/></clipPath></g>')
m4 = f'''<!-- m4 the host -->
  <g filter="url(#ds)" class="st" data-st="m4">
    <g id="hc4"><rect x="150" y="190" width="700" height="700" rx="36" fill="#FFFFFF"/>
      <circle cx="270" cy="320" r="62" fill="{INK}"/>{ic('user', 270, 320, 60, '#E9E7E2')}
      <text x="360" y="318" font-size="52" font-weight="600" letter-spacing="-.8" fill="{INK}">Camille</text>
      <text x="362" y="356" font-size="21" font-weight="700" letter-spacing="3" fill="#8A877F">YOUR PERSONAL HOST</text>
      <line x1="210" y1="420" x2="790" y2="420" stroke="#E6E3DC" stroke-width="2"/>
      {nt}
      <path id="ul4" d="M306 800 C400 810 520 804 640 798" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></g>
  </g>
'''

# ------------------------------------------------------------------ m5 the show: forty cars, one time, arriving like four
import random
random.seed(7)
SCAT = []
for r in range(5):
    for c in range(8):
        SCAT.append((150 + c * 100 + random.uniform(-26, 26), 420 + r * 96 + random.uniform(-22, 22), random.uniform(-28, 28)))
random.shuffle(SCAT)
ROWY = [440, 556, 672, 788]
cars5 = ''
for k in range(4):
    for j in range(10):
        sx, sy, sr = SCAT[k * 10 + j]
        cars5 += (f'<g class="cr5 cr5r{k}" id="cr5{k}_{j}" data-s="{sx:.1f},{sy:.1f},{sr:.1f}" data-r="{150 + j * 78},{ROWY[k]}">'
                  + icf('car-profile', 0, 0, 62, '#E9E7E2') + '</g>')
m5 = f'''<!-- m5 the show -->
  <g filter="url(#ds)" class="st" data-st="m5">
    <g id="tm5">{icf('clock', 300, 250, 92, '#F4F2ED')}<text id="tt5" x="370" y="294" font-size="128" font-weight="600" letter-spacing="-4" fill="#F4F2ED">19:30</text></g>
    <g id="sb5"><text x="500" y="360" text-anchor="middle" font-size="22" font-weight="700" letter-spacing="5" fill="#9EA2AE">THE SHOW, ONE ARRIVAL TIME</text></g>
    {cars5}
    <path id="fl5" d="M820 380 V850" stroke="#F4F2ED" stroke-width="3" stroke-dasharray="10 12" opacity="0"/>
    <g id="ok5" opacity="0"><circle cx="820" cy="350" r="26" fill="url(#silv)"/><path d="M808 350 l9 9 17 -19" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>
  </g>
'''
ROWY5 = ROWY

# ------------------------------------------------------------------ m6 a walk through the gallery after hours
ART = [('#2C3570', '#9AA3D6'), ('#C9C4B8', '#3B3F52'), ('#1B1D2A', '#8C93B5'), ('#7B809A', '#E9E5DA'), ('#384266', '#C9CDD8'), ('#D9D3C6', '#5B6080')]
PZ = []
for j, z in enumerate([2.2, 3.9, 5.6, 7.3, 9.0, 10.6]):
    for side in (-1, 1):
        PZ.append((side, z, len(PZ) % 6))
paint = ''
grads = ''
for k, a in enumerate(ART):
    grads += f'<linearGradient id="ag6{k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a[0]}"/><stop offset="1" stop-color="{a[1]}"/></linearGradient>'
for k, (side, z, g) in enumerate(PZ):
    paint += (f'<g class="pn6" id="pn6{k}"><path class="pd" fill="#2A2B33"/>'
              f'<g class="pl" opacity="0"><ellipse class="pp" fill="url(#pool6)" clip-path="url(#wc6{"L" if side < 0 else "R"})"/><path class="pf" fill="#E9E5DA"/><path class="pc" fill="url(#ag6{g})"/></g></g>')
couple = '''<g id="cpl6" opacity="0" fill="#07080B">
  <g id="cw6"><g class="lg6a"><rect x="-.225" y="-.5" width=".065" height=".5" rx=".03"/></g><g class="lg6b"><rect x="-.15" y="-.5" width=".065" height=".5" rx=".03"/></g>
    <path d="M-.32 -.36 C-.3 -.75 -.27 -1.2 -.26 -1.36 C-.24 -1.42 -.1 -1.42 -.08 -1.36 C-.07 -1.2 -.04 -.75 -.02 -.36 Z"/>
    <rect x="-.19" y="-1.47" width=".04" height=".08"/><ellipse cx="-.17" cy="-1.54" rx=".085" ry=".1"/><path d="M-.26 -1.55 C-.26 -1.68 -.08 -1.68 -.08 -1.55 C-.1 -1.5 -.24 -1.5 -.26 -1.55Z"/></g>
  <g id="cm6"><g class="lg6c"><rect x=".085" y="-.84" width=".11" height=".84" rx=".04"/></g><g class="lg6d"><rect x=".2" y="-.84" width=".11" height=".84" rx=".04"/></g>
    <path d="M.04 -.8 C.04 -1.1 .03 -1.38 .07 -1.46 C.12 -1.52 .27 -1.52 .32 -1.46 C.36 -1.38 .35 -1.1 .35 -.8 Z"/>
    <rect x=".17" y="-1.58" width=".05" height=".1"/><ellipse cx=".195" cy="-1.66" rx=".09" ry=".105"/></g></g>'''
F6, VX, VY, YC = 380, 500, 480, -1.15
def pj(X, Y, Z): return (VX + F6 * X / Z, VY + F6 * Y / Z)
def poly(P): return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in P) + 'Z'
ZN = .3
lw = poly([pj(-1, YC, ZN), pj(-1, YC, 60), pj(-1, 1, 60), pj(-1, 1, ZN)])
rw = poly([pj(1, YC, ZN), pj(1, YC, 60), pj(1, 1, 60), pj(1, 1, ZN)])
cl = poly([pj(-1, YC, ZN), pj(1, YC, ZN), pj(1, YC, 60), pj(-1, YC, 60)])
fl = poly([pj(-1, 1, ZN), pj(1, 1, ZN), pj(1, 1, 60), pj(-1, 1, 60)])
m6 = f'''<!-- m6 the gallery -->
  <g filter="url(#ds)" class="st" data-st="m6">
    <defs>{grads}
      <radialGradient id="pool6"><stop offset="0" stop-color="#FFF6E6" stop-opacity=".6"/><stop offset=".55" stop-color="#FFF6E6" stop-opacity=".16"/><stop offset="1" stop-color="#FFF6E6" stop-opacity="0"/></radialGradient>
      <linearGradient id="cpA6" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E2550"/><stop offset=".6" stop-color="#3D4A8C"/><stop offset="1" stop-color="#0E1128"/></linearGradient>
      <linearGradient id="flg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16171D"/><stop offset="1" stop-color="#2A2C35"/></linearGradient>
      <clipPath id="win6"><rect x="110" y="150" width="780" height="720" rx="24"/></clipPath>
      <clipPath id="wc6L"><path d="{lw}"/></clipPath><clipPath id="wc6R"><path d="{rw}"/></clipPath></defs>
    <rect x="98" y="138" width="804" height="744" rx="30" fill="#07080B" stroke="rgba(201,205,216,.22)" stroke-width="2"/>
    <g clip-path="url(#win6)" id="gal6">
      <rect x="110" y="150" width="780" height="720" fill="#0D0E12"/>
      <path d="{cl}" fill="#121318"/><path d="{lw}" fill="#1A1B21"/><path d="{rw}" fill="#1A1B21"/><path d="{fl}" fill="url(#flg6)"/>
      <g id="amb6" opacity="0"><path d="{lw}" fill="#3E404A"/><path d="{rw}" fill="#3E404A"/><path d="{cl}" fill="#24252C"/><path d="{fl}" fill="#30323B"/></g>
      <path id="tk6a" stroke="#2E3038" stroke-width="5"/><path id="tk6b" stroke="#2E3038" stroke-width="5"/>
      <g id="bw6"><rect class="bwr" fill="#2C2D35"/><g id="bwl" opacity="0"><rect class="bwr2" fill="#4A4C55"/><ellipse class="bwp" fill="url(#pool6)"/><rect class="bwf" fill="#E9E5DA"/><rect class="bwc" fill="url(#cpA6)"/><circle class="bwo" fill="#EDE8DC"/></g></g>
      {paint}
      {couple}
    </g>
    <g id="lab6"><rect x="330" y="720" width="340" height="112" rx="12" fill="url(#ivG)"/>
      <text x="500" y="774" text-anchor="middle" font-size="40" font-weight="600" letter-spacing="-.5" fill="{INK}">Not for sale</text>
      <text x="500" y="808" text-anchor="middle" font-size="19" font-weight="700" letter-spacing="4" fill="#7A776F">A PRIVATE VIEW</text></g>
  </g>
'''

# ------------------------------------------------------------------ m7 behind the scenes: the card turns to the team side
front = [('Monday', 'Arrivals, Le Bourget'), ('Tuesday', 'The show, 19:30'), ('Wednesday', 'A private view'), ('Friday', 'Departures')]
fr = ''.join(f'<text x="220" y="{372+i*112}" font-size="21" font-weight="700" letter-spacing="3" fill="#8A877F">{d.upper()}</text><text x="220" y="{416+i*112}" font-size="38" font-weight="600" letter-spacing="-.4" fill="{INK}">{t}</text>' for i, (d, t) in enumerate(front))
TILES = [(6, 'Executives'), (18, 'Advisors'), (34, 'Show team'), (12, 'Cars'), (26, 'Rooms'), (3, 'Hotels')]
tl7 = ''
for i, (n, lb) in enumerate(TILES):
    x = 190 + (i % 3) * 210; y = 316 + (i // 3) * 160
    tl7 += (f'<g class="tq7" id="tq7{i}"><rect x="{x}" y="{y}" width="196" height="146" rx="20" fill="url(#tileG)" stroke="rgba(185,194,240,.3)" stroke-width="1.5"/>'
            f'<text x="{x+22}" y="{y+82}" font-size="66" font-weight="600" letter-spacing="-2" fill="#DDE2FF">{n}</text>'
            f'<text x="{x+24}" y="{y+120}" font-size="27" font-weight="600" fill="#B9BFD6">{lb}</text></g>')
TIMES = [('05:30', 'Venue call'), ('07:15', 'Executives land'), ('23:40', 'Last car home')]
tm7 = ''
for i, (a, b) in enumerate(TIMES):
    y = 718 + i * 74
    tm7 += (f'<g class="tt7" id="tt7{i}"><text x="194" y="{y}" font-size="42" font-weight="600" letter-spacing="0" fill="#F4F2ED">{a}</text>'
            f'<text x="336" y="{y}" font-size="31" font-weight="500" fill="#AEB4C6">{b}</text>'
            + (f'<line x1="194" y1="{y+28}" x2="806" y2="{y+28}" stroke="rgba(201,205,216,.14)" stroke-width="1.5"/>' if i < 2 else '') + '</g>')
m7 = f'''<!-- m7 behind the scenes -->
  <g filter="url(#ds)" class="st" data-st="m7">
    <defs><linearGradient id="cbG" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#1D2135"/><stop offset="1" stop-color="#0E0F15"/></linearGradient>
      <radialGradient id="cbR" cx=".85" cy="0" r=".7"><stop offset="0" stop-color="rgba(185,194,240,.2)"/><stop offset="1" stop-color="rgba(185,194,240,0)"/></radialGradient>
      <linearGradient id="tileG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(185,194,240,.14)"/><stop offset="1" stop-color="rgba(185,194,240,.04)"/></linearGradient></defs>
    <g id="cd7">
      <g id="cf7"><rect x="150" y="160" width="700" height="780" rx="18" fill="url(#ivG)"/><rect x="172" y="182" width="656" height="736" rx="8" fill="none" stroke="#C9C4B8" stroke-width="1.5"/>
        <text x="220" y="274" font-size="50" font-weight="600" letter-spacing="-.8" fill="{INK}">Guest programme</text>{fr}</g>
      <g id="cb7" opacity="0"><rect x="150" y="160" width="700" height="780" rx="22" fill="url(#cbG)"/><rect x="150" y="160" width="700" height="780" rx="22" fill="url(#cbR)"/>
        <rect x="150.75" y="160.75" width="698.5" height="778.5" rx="21.5" fill="none" stroke="rgba(201,205,216,.22)" stroke-width="1.5"/>
        <text x="192" y="262" font-size="58" font-weight="600" letter-spacing="-1.2" fill="#F4F2ED">Your team</text>
        {tl7}
        {tm7}</g>
    </g>
  </g>
'''

# ------------------------------------------------------------------ m8 flights, jets, the right suite
m8 = f'''<!-- m8 travel -->
  <g filter="url(#ds)" class="st" data-st="m8">
    <g id="tk8a"><rect x="150" y="220" width="700" height="210" rx="22" fill="#FFFFFF"/><line x1="640" y1="236" x2="640" y2="414" stroke="#DCD8D0" stroke-width="3" stroke-dasharray="8 10"/>
      <text x="190" y="282" font-size="21" font-weight="700" letter-spacing="3" fill="#8A877F">BOARDING PASS, FIRST</text>
      <text x="190" y="378" font-size="68" font-weight="600" letter-spacing="-1" fill="{INK}">JFK</text>{ic('airplane-tilt', 400, 354, 50, INK)}<text x="446" y="378" font-size="68" font-weight="600" letter-spacing="-1" fill="{INK}">CDG</text>
      <text x="676" y="300" font-size="21" font-weight="700" letter-spacing="2" fill="#8A877F">SEAT</text><text x="676" y="368" font-size="58" font-weight="600" fill="{INK}">1A</text></g>
    <g id="tk8b"><rect x="150" y="470" width="700" height="190" rx="22" fill="{INK}"/>{ic('airplane-in-flight', 236, 565, 62, '#E9E7E2')}
      <text x="300" y="545" font-size="21" font-weight="700" letter-spacing="3" fill="#8F929E">PRIVATE JET</text><text x="300" y="600" font-size="36" font-weight="600" letter-spacing="-.4" fill="#F4F2ED">Farnborough to Le Bourget</text></g>
    <g id="tk8c"><rect x="150" y="700" width="700" height="190" rx="22" fill="url(#silv)"/>{ic('key', 236, 795, 62, INK)}
      <text x="300" y="775" font-size="21" font-weight="700" letter-spacing="3" fill="#4A4C55">THE RIGHT SUITE</text><text x="300" y="830" font-size="36" font-weight="600" letter-spacing="-.4" fill="{INK}">Suite 701, garden view</text></g>
  </g>
'''

# ------------------------------------------------------------------ m9 Friday: same chauffeur, car to plane, plane away, the ribbon and your brand
m9 = f'''<!-- m9 departure -->
  <g class="st" data-st="m9">
    <g id="fr9" filter="url(#ds)">{badge('9', 500, 200, 80)}
      <text id="nm9" x="500" y="368" text-anchor="middle" font-size="42" font-weight="600" letter-spacing="-.8" fill="#F4F2ED">The same chauffeur</text>
      <g id="ap9"><rect x="70" y="420" width="860" height="300" rx="28" fill="#141726" stroke="rgba(201,205,216,.18)" stroke-width="2"/>
        <rect x="70" y="600" width="860" height="96" fill="#1B1F33"/>
        <path d="M70 648 H930" stroke="rgba(244,242,237,.35)" stroke-width="3" stroke-dasharray="30 26"/>
        {''.join(f'<circle cx="{x}" cy="604" r="3.5" fill="#F4F2ED" opacity=".75"/><circle cx="{x}" cy="692" r="3.5" fill="#F4F2ED" opacity=".75"/>' for x in range(100, 930, 60))}
        <path id="cp9" d="M110 445 C280 445 450 445 640 445" fill="none"/>
        <path id="jp9" d="M500 540 C620 540 690 590 750 625 C810 648 900 648 1300 648" fill="none"/><path id="jq9" d="M510 550 C630 550 700 600 760 635 C820 658 910 658 1310 658" fill="none"/></g>
      <g id="js9"><g transform="scale(2.2)"><use href="#jetT" x="-60" y="-60" width="120" height="120" opacity=".35" style="filter:blur(2px)"/></g></g>
      <g id="jt9"><g transform="scale(2.2)"><use href="#jetT" x="-60" y="-60" width="120" height="120"/></g>
        <circle id="dr9" cx="66" cy="-13" r="9" fill="none" stroke="#F4F2ED" stroke-width="2" opacity="0"/></g>
      <g id="cr9"><g transform="scale(.9)"><use href="#carT" x="-60" y="-26" width="120" height="52"/></g></g>
      {days('9', 800)}</g>
    <mask id="fmR9" maskUnits="userSpaceOnUse" x="-1100" y="-200" width="2340" height="1600"><rect x="-1100" y="-200" width="2340" height="1600" fill="url(#fmgR)"/></mask>
    <g id="rg9" opacity="0"><g mask="url(#fmR9)"><foreignObject x="-1100" y="-200" width="2340" height="1600"><canvas xmlns="http://www.w3.org/1999/xhtml" id="rib9" width="2574" height="1760" style="width:2340px;height:1600px;display:block"></canvas></foreignObject></g>
      </g>
  </g>
'''

# ------------------------------------------------------------------ m10 since 2010: a quiet timeline
YRS = [(2010, '2010'), (2014, '2014'), (2018, '2018'), (2022, '2022'), (2026, 'Today')]
X0, X1 = 170, 830
tk = ''
for i, (yv, lb) in enumerate(YRS):
    x = X0 + (yv - 2010) / 16 * (X1 - X0)
    tk += (f'<g class="yt10" id="yt10{i}"><line x1="{x:.1f}" y1="652" x2="{x:.1f}" y2="676" stroke="#C9CDD8" stroke-width="2"/>'
           f'<text x="{x:.1f}" y="724" text-anchor="middle" font-size="27" font-weight="600" letter-spacing="1" fill="{"#F4F2ED" if lb == "Today" else "#8F929E"}">{lb}</text></g>')
m10 = f'''<!-- m10 since 2010 -->
  <g filter="url(#ds)" class="st" data-st="m10">
    <image href="__EMBLEM__" x="466" y="190" width="68" height="68" opacity=".9" id="em10"/>
    <text id="sn10" x="500" y="330" text-anchor="middle" font-size="26" font-weight="700" letter-spacing="10" fill="#9EA2AE">SINCE</text>
    <text id="y10" x="500" y="530" text-anchor="middle" font-size="190" font-weight="600" letter-spacing="-6" fill="#F4F2ED">2010</text>
    <line x1="{X0}" y1="664" x2="{X1}" y2="664" stroke="rgba(201,205,216,.25)" stroke-width="2"/>
    <path id="tl10" d="M{X0} 664 H{X1}" stroke="url(#silvL)" stroke-width="3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>
    {tk}
    <circle id="dt10" cx="{X0}" cy="664" r="9" fill="#F4F2ED"/>
    <text id="pl10" x="500" y="828" text-anchor="middle" font-size="36" font-weight="600" letter-spacing="6" fill="#C9CDD8">PARIS, LONDON</text>
  </g>
'''
EXTRA_DEFS = '''<linearGradient id="csBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A4166"/><stop offset=".6" stop-color="#232947"/><stop offset="1" stop-color="#151931"/></linearGradient>
  <linearGradient id="csTar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22253A"/><stop offset="1" stop-color="#0F1120"/></linearGradient>
  <linearGradient id="carB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3E4C"/><stop offset=".35" stop-color="#15171E"/><stop offset="1" stop-color="#050608"/></linearGradient>
  <linearGradient id="carG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5E6680"/><stop offset=".5" stop-color="#1E2232"/><stop offset="1" stop-color="#3A4058"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
  <radialGradient id="glowW"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity=".6"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
  '''
PZJS = '[' + ','.join(f'[{s},{z},{g}]' for s, z, g in PZ) + ']'
JSDATA = ('const ROWY5=%s,DAYX=%s,' % (str(ROWY5), str(DAYX)) + 'CAVI=%d,EDEPTH=%d,ESC=%s,WP2=%s,WDX=%s,G6={F:%d,VX:%d,VY:%d,YC:%s},PZ6=%s;' %
          (CAV, DEPTH, SC, str([w[2] for w in WP]), str(WDX), F6, VX, VY, YC, PZJS))
