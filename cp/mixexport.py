# Re-export the SFX/mix list from the current build without re-rendering frames (use when only sound changed).
import asyncio,json,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for mode,(W,H) in [('render',(1920,1080)),('render-portrait',(1080,1920))]:
      pg=await b.new_page(viewport={'width':W,'height':H});await pg.goto(f'file:///home/claude/cp/cp-ta9-render.html#{mode}',wait_until='domcontentloaded');await pg.wait_for_timeout(3000)
      json.dump(await pg.evaluate('window.__mix'),open(f'ta9mix_{mode}.json','w'));print(mode,'ok')
    await b.close()
asyncio.run(main())
