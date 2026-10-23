import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();W,H=int(sys.argv[3]),int(sys.argv[4])
    pg=await b.new_page(viewport={'width':W,'height':H})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file:///home/claude/cp/cp-ta9-render.html#'+sys.argv[1],wait_until='domcontentloaded',timeout=60000);await pg.wait_for_timeout(4000)
    for _ in range(120):
      if await pg.evaluate('!!window.PLANE3D_READY'): break
      await pg.wait_for_timeout(500)
    for t in sys.argv[2].split(','):
      await pg.evaluate(f'renderAt({t})');await pg.screenshot(path=f'shots/ta9_{sys.argv[1]}_{t}.png')
    print(errs[:8]);await b.close()
asyncio.run(main())
