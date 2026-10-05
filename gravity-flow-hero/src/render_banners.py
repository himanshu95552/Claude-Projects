import sys,glob,os
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox'])
    for f in sorted(glob.glob('banners/*.html')):
        pg=b.new_page(viewport={'width':1600,'height':1200},device_scale_factor=2); pg.goto('file://'+os.path.abspath(f)); pg.wait_for_timeout(800)
        pg.evaluate('document.fonts.ready'); pg.screenshot(path=f.replace('.html','.png'),clip={'x':0,'y':0,'width':1600,'height':1200}); pg.close()
    b.close()
