import asyncio,sys,subprocess
from playwright.async_api import async_playwright
mode=sys.argv[1];f0,f1=int(sys.argv[2]),int(sys.argv[3]); W,H=(1920,1080) if mode=='render' else (1080,1920); FPS=30
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':H})
    await pg.goto('file:///home/claude/mz/mz-render.html#'+mode); await pg.wait_for_timeout(1500)
    ff=subprocess.Popen(['ffmpeg','-y','-v','error','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium',f'seg_{mode}.mp4'],stdin=subprocess.PIPE)
    el=await pg.query_selector('#film')
    for i in range(f0,f1):
      await pg.evaluate(f'renderAt({i/FPS})'); ff.stdin.write(await el.screenshot(type='jpeg',quality=92))
    ff.stdin.close(); ff.wait(); await b.close()
asyncio.run(main())
