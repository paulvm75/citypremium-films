import math
def wheel(cx,cy,uid):
    sp=''.join(f'<path d="M{cx+3.2*math.cos(a):.2f} {cy+3.2*math.sin(a):.2f} L{cx+12.2*math.cos(a-.09):.2f} {cy+12.2*math.sin(a-.09):.2f} L{cx+12.2*math.cos(a+.09):.2f} {cy+12.2*math.sin(a+.09):.2f}Z" fill="#E9ECF5"/>' for a in [i*2*math.pi/10 for i in range(10)])
    return (f'<circle cx="{cx}" cy="{cy}" r="19.5" fill="#07090F"/><circle cx="{cx}" cy="{cy}" r="17.6" fill="none" stroke="#1D2130" stroke-width="1.4"/>'
            f'<circle cx="{cx}" cy="{cy}" r="13.4" fill="url(#rim{uid})"/><circle cx="{cx}" cy="{cy}" r="12.6" fill="#2A3044"/>{sp}'
            f'<circle cx="{cx}" cy="{cy}" r="13.2" fill="none" stroke="#F4F6FB" stroke-width="1"/><circle cx="{cx}" cy="{cy}" r="3.6" fill="#B9C0D4"/><circle cx="{cx}" cy="{cy}" r="1.6" fill="#3A4058"/>')
def side(sid,grad,mirror=False,dark=True):
    u=sid
    body=('M8 67 C8 59 11 53 21 51 L58 47.5 C76 38 99 26.5 128 23.6 C150 21.6 171 21.8 186 25 C199 28.4 210 37 222 45.6 '
          'L268 49.6 C283 51.4 291 56 293 63.5 L293.6 73 C293.6 78.5 291 81 286 81 L251 81 A23 23 0 0 0 205 81 L93 81 A23 23 0 0 0 47 81 L14 81 C10 81 8 78.5 8 74Z')
    glass='M66 47.4 C84 38 105 28.6 130 26.4 C151 24.6 170 24.8 184 27.6 C195 30.2 205 37 214 45.4 Z'
    sh=('rgba(255,255,255,.55)' if dark else 'rgba(255,255,255,.9)')
    inner=(f'<ellipse cx="150" cy="99" rx="146" ry="4.5" fill="rgba(0,0,0,.45)"/>'
      f'<path d="{body}" fill="url(#{grad})"/>'
      # lower body shade and sill
      f'<path d="M12 72 L292 72 L292.6 75 C292.6 79 290 81 286 81 L251 81 A23 23 0 0 0 205 81 L93 81 A23 23 0 0 0 47 81 L14 81 C10 81 8.5 79 8.5 75Z" fill="rgba(5,8,20,.28)"/>'
      # wheel arches (inner dark)
      f'<path d="M47 81 A23 23 0 0 1 93 81 Z M205 81 A23 23 0 0 1 251 81 Z" fill="#05070D"/>'
      # glass with chrome surround
      f'<path d="{glass}" fill="url(#gl{u})"/><path d="{glass}" fill="none" stroke="#E8ECF6" stroke-width="1.6" stroke-linejoin="round"/>'
      # pillars: B pillar and rear quarter divider
      f'<path d="M151 25.4 L149 47" stroke="#0E1222" stroke-width="5.2"/><path d="M96 33.5 L93 47" stroke="#0E1222" stroke-width="3.2"/>'
      # shoulder highlight and lower character line
      f'<path d="M22 52.6 L60 49.6 M216 47.6 L268 51.6 C280 53 287 56 290 60" fill="none" stroke="{sh}" stroke-width="1.2"/>'
      f'<path d="M14 64 C90 61.4 210 61.4 291 64" fill="none" stroke="{sh}" stroke-width="1"/>'
      # door seams and handles
      f'<path d="M149 48 L148.4 80.6 M93.2 48 L94 64 C94.5 70 93 75 92.6 79" fill="none" stroke="rgba(5,8,20,.45)" stroke-width="1"/>'
      f'<path d="M205 47 C204 58 204 70 204.5 79" fill="none" stroke="rgba(5,8,20,.45)" stroke-width="1"/>'
      f'<rect x="166" y="53.6" width="13" height="2.6" rx="1.3" fill="#E8ECF6"/><rect x="111" y="53.6" width="13" height="2.6" rx="1.3" fill="#E8ECF6"/>'
      # mirror
      f'<path d="M206 44.5 C206 41 210 39.6 214.6 40.2 L216.4 45.6 Z" fill="url(#{grad})" stroke="rgba(5,8,20,.5)" stroke-width=".8"/>'
      # chrome window sill line
      f'<path d="M66 47.6 L214 45.6" stroke="#E8ECF6" stroke-width="1.3"/>'
      # front: slim headlight, grille edge, DRL glow
      f'<path d="M276.6 53.2 C283 53.6 288.6 55.6 291.2 58.4 L289.6 60.6 C284 59.2 279 58.4 275.4 57.6 Z" fill="#F7F8FC"/>'
      f'<ellipse cx="292" cy="59" rx="9" ry="4.4" fill="url(#hl{u})"/>'
      f'<path d="M292.4 63 L293 72" stroke="#C9CFDE" stroke-width="1.6" stroke-linecap="round"/>'
      # rear: slim red tail lamp wrapping the corner
      f'<path d="M8.6 57.2 C9.6 54.2 13 52.6 20.4 52 L22.6 55.2 C16 55.8 12 56.8 9.2 59.4 Z" fill="#D8393F"/>'
      f'<ellipse cx="11" cy="56" rx="6" ry="3.6" fill="url(#tl{u})"/>'
      f'<path d="M9 69 L20 69" stroke="#C9CFDE" stroke-width="1.2" stroke-linecap="round"/>'
      + wheel(70,80.5,u)+wheel(228,80.5,u))
    defs=(f'<defs><radialGradient id="rim{u}"><stop offset=".7" stop-color="#C9CFDE"/><stop offset="1" stop-color="#6E7790"/></radialGradient>'
          f'<linearGradient id="gl{u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3654"/><stop offset=".5" stop-color="#121729"/><stop offset="1" stop-color="#0A0D19"/></linearGradient>'
          f'<radialGradient id="hl{u}"><stop offset="0" stop-color="rgba(255,255,255,.75)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>'
          f'<radialGradient id="tl{u}"><stop offset="0" stop-color="rgba(255,70,70,.6)"/><stop offset="1" stop-color="rgba(255,70,70,0)"/></radialGradient></defs>')
    g=f'<g transform="translate(300 0) scale(-1 1)">{inner}</g>' if mirror else inner
    return f'<symbol id="{sid}" viewBox="0 0 300 100" overflow="visible">{defs}{g}</symbol>'
if __name__=='__main__':
    grads='<linearGradient id="pS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5F7FC"/><stop offset=".45" stop-color="#C3CADF"/><stop offset="1" stop-color="#7C86A8"/></linearGradient><linearGradient id="pK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B6488"/><stop offset=".4" stop-color="#262D4A"/><stop offset="1" stop-color="#0C1022"/></linearGradient>'
    html=f'<html><body style="margin:0;background:#1B2140"><svg width="1600" height="640" viewBox="0 0 640 256"><defs>{grads}</defs>{side("carK","pK")}{side("carS","pS",True,False)}<use href="#carK" x="10" y="20" width="300" height="104"/><use href="#carS" x="330" y="20" width="300" height="104"/><use href="#carK" x="120" y="140" width="400" height="139"/></svg></body></html>'
    open('t.html','w').write(html)
