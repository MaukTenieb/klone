# shot.py page.html sortie_prefixe [attente_ms] — captures 1440x900, 390x844, 844x390
import sys,asyncio
from playwright.async_api import async_playwright
async def main():
  page_,pre=sys.argv[1],sys.argv[2];w=int(sys.argv[3]) if len(sys.argv)>3 else 2500
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files'])
    for (W,H,dpr,nom) in [(1440,900,1,'bureau'),(390,844,3,'portrait'),(844,390,3,'paysage')]:
      c=await b.new_context(viewport={'width':W,'height':H},device_scale_factor=dpr,has_touch=dpr>1)
      pg=await c.new_page();errs=[]
      pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto('http://localhost:8765/'+page_);await pg.wait_for_timeout(w)
      await pg.screenshot(path=f'{pre}-{nom}.png');print(nom,errs)
      await c.close()
    await b.close()
asyncio.run(main())
