import asyncio,sys,json
from playwright.async_api import async_playwright
JS="""(t)=>{renderAt(t);const out=[];const W=innerWidth;
 document.querySelectorAll('.tb').forEach(tb=>{const tr=tb.getBoundingClientRect();tb.querySelectorAll('.ch').forEach(ch=>{
  const op=+getComputedStyle(ch).opacity;if(op<.3)return;let L=1e9,R=-1e9;ch.querySelectorAll('.w').forEach(w=>{const b=w.firstChild;if(+getComputedStyle(b).opacity<.3)return;const r=b.getBoundingClientRect();L=Math.min(L,r.left);R=Math.max(R,r.right)});
  if(R>-1e9&&(R>tr.right+12||R>W-8||L<0))out.push(ch.textContent.trim()+' | R='+Math.round(R)+' tbR='+Math.round(tr.right))})});return out}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for mode,(W,H) in [('render',(1920,1080)),('render-portrait',(1080,1920))]:
      pg=await b.new_page(viewport={'width':W,'height':H});await pg.goto('file:///home/claude/cp/cp-ta9-render.html#'+mode);await pg.wait_for_timeout(1500)
      seen={}
      t=0.0
      while t<93:
        r=await pg.evaluate(JS,t)
        for x in r:
          k=x.split(' | ')[0]
          if k not in seen: seen[k]=(round(t,2),x)
        t+=0.2
      print(mode);[print('  ',v) for v in seen.values()]
      await pg.close()
    await b.close()
asyncio.run(main())
