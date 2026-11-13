# renders the jet stills used by the film: python3 still.py
import asyncio,base64
from playwright.async_api import async_playwright
D='/home/claude/citypremium-films/tools/g5000/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--allow-file-access-from-files','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);pg=await b.new_page()
    pg.on('pageerror',lambda e:print('ERR',e))
    await pg.goto('file://'+D+'still.html');await pg.wait_for_timeout(500)
    import base64 as B
    glb=B.b64encode(open(D+'g5000.glb','rb').read()).decode()
    for view,w,h in [('top',1600,1600),('hero',2200,1200)]:
      r=await pg.evaluate(f"(async(b64)=>{{const u=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;const c=document.createElement('canvas');document.body.appendChild(c);const sz=await G5(c,{w},{h},'{view}',u);return [c.toDataURL('image/png'),sz]}})",glb)
      open(D+f'jet_{view}.png','wb').write(base64.b64decode(r[0].split(',')[1]));print(view,r[1])
    await b.close()
asyncio.run(main())
