import base64, os, subprocess, sys
d = '/home/claude/mz'; CP = '/home/claude/cp'; A = os.path.join(d, 'a')
subprocess.run(['python3', os.path.join(d, 'gen.py')], check=True)
s = open(os.path.join(d, 'mz1.html')).read()
enc = lambda b, m: f"data:{m};base64," + base64.b64encode(b).decode()
p = os.path.join(CP, 'fonts', 'ins', 'files', 'instrument-sans-latin-standard-normal.woff2'); pi = p.replace('normal.woff2', 'italic.woff2')
css = ("@font-face{font-family:'Instrument Sans';font-weight:400 700;font-stretch:75%% 100%%;font-style:normal;font-display:block;src:url(%s) format('woff2')}"
       "@font-face{font-family:'Instrument Sans';font-weight:400 700;font-stretch:75%% 100%%;font-style:italic;font-display:block;src:url(%s) format('woff2')}") % (enc(open(p, 'rb').read(), 'font/woff2'), enc(open(pi, 'rb').read(), 'font/woff2'))
for w in ('500', '600'):
    for st in ('normal', 'italic'):
        f = os.path.join(d, 'fonts', f'cormorant-garamond-latin-{w}-{st}.woff2')
        css += "@font-face{font-family:'Cormorant';font-weight:%s;font-style:%s;font-display:block;src:url(%s) format('woff2')}" % (w, st, enc(open(f, 'rb').read(), 'font/woff2'))
s = s.replace('__FONTS__', css).replace('__LWIN__', '').replace('__AIRPORTS__', '')
s = s.replace('__EMBLEM__', enc(open(os.path.join(CP, 'emblem_pad.png'), 'rb').read(), 'image/png')).replace('__WORDMARK__', enc(open(os.path.join(CP, 'wordmark.png'), 'rb').read(), 'image/png'))
s = s.replace('__WORDS__', open(os.path.join(d, 'words_mz.json')).read())
F = {'VO': 'vo_mz', 'MUSIC': 'music_mz', 'LOGO': 'logo_c', 'SWISH': 'swish_c', 'TICK': 'tick_c', 'CAR': 'car_c', 'JET': 'jet_c', 'PHONE': 'phone_c', 'KEYCARD': 'keycard_c', 'RISER': 'riser_c',
     'POP': 'pop_c', 'POPL': 'popl_c', 'SHIM': 'shim_c', 'PAPER': 'paper_c', 'SEAL': 'seal_c', 'DOOR': 'door_c', 'CHIME': 'chime_c', 'WHOOSH': 'whoosh_c', 'CLICK': 'click_c', 'FLICK': 'flick_c', 'LIGHT': 'light_c', 'SATIN': 'satin_c'}
for k, f in F.items():
    s = s.replace(f'__{k}__', enc(open(os.path.join(A, f + '.mp3'), 'rb').read(), 'audio/mpeg'))
g = os.path.join(CP, 'fonts', 'gsap', 'dist')
B = '<script>' + open(os.path.join(d, 'mz3d.bundle.js')).read() + '</script>'
inline = B + '<script>' + open(os.path.join(g, 'gsap.min.js')).read() + '</script><script>' + open(os.path.join(g, 'MotionPathPlugin.min.js')).read() + '</script>'
cdn = B + '<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MotionPathPlugin.min.js"></script>'
open(os.path.join(d, 'mz-render.html'), 'w').write(s.replace('__GSAP__', inline))
open(os.path.join(d, 'mz-pub.html'), 'w').write(s.replace('__GSAP__', cdn))
print('built', len(s) // 1024, 'KB')
