import asyncio,sys,json
from playwright.async_api import async_playwright
mode=sys.argv[1];W,H=(1920,1080) if mode=='render' else (1080,1920)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':W,'height':H})
    await pg.goto('file:///home/claude/mz/mz-render.html#'+mode);await pg.wait_for_timeout(1500)
    json.dump(await pg.evaluate('window.__mix'),open(f'mzmix_{mode}.json','w'));await b.close()
asyncio.run(main())
