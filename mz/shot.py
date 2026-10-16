import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();W,H=int(sys.argv[3]),int(sys.argv[4])
    pg=await b.new_page(viewport={'width':W,'height':H})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' or (m.type=='warning' and '3d' in m.text) else None)
    await pg.goto('file:///home/claude/mz/mz-render.html#'+sys.argv[1]);await pg.wait_for_timeout(1500)
    if sys.argv[2]=='sa':
      print(await pg.evaluate("SCN.map(s=>s.id+'='+s.a.toFixed(2)).join(' ')"))
    else:
      for t in sys.argv[2].split(','):
        await pg.evaluate(f'renderAt({t})');await pg.screenshot(path=f'shots/{sys.argv[1]}_{t}.png')
    print(errs[:8]);await b.close()
asyncio.run(main())
