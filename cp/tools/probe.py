import asyncio,sys,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1920,'height':1080})
    pg.on('console',lambda m:print('C',m.type,m.text[:200]) if m.type in('error','warning') else None);pg.on('pageerror',lambda e:print('ERR',str(e)[:300]))
    await pg.goto('file:///home/claude/cp/'+sys.argv[1]+'#render',wait_until='domcontentloaded',timeout=60000);print('loaded');await pg.wait_for_timeout(2500)
    print(json.dumps(await pg.evaluate(sys.argv[2])))
    await b.close()
asyncio.run(main())
