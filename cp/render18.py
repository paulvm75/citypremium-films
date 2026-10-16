import asyncio,sys,json,subprocess
from playwright.async_api import async_playwright
mode=sys.argv[1]; W,H=(1920,1080) if mode=='render' else (1080,1920); FPS=30
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':H})
    await pg.goto('file:///home/claude/cp/cp-v18-render.html#'+mode); await pg.wait_for_timeout(1500)
    mix=await pg.evaluate('window.__mix'); json.dump(mix,open(f'v18mix_{mode}.json','w'))
    n=int(mix['end']*FPS)
    ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium',f'v18video_{mode}.mp4'],stdin=subprocess.PIPE)
    el=await pg.query_selector('#film')
    for i in range(n):
      await pg.evaluate(f'renderAt({i/FPS})')
      ff.stdin.write(await el.screenshot(type='jpeg',quality=92))
      if i%300==0: print(mode,i,'/',n,flush=True)
    ff.stdin.close(); ff.wait(); await b.close()
asyncio.run(main())
