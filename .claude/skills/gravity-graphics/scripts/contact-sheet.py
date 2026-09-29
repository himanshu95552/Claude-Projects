# python3 contact-sheet.py <page.html> <out.png> <t1,t2,...> [#hash]  -> one look at key moments before the full render
import subprocess,sys,os,tempfile
from PIL import Image
page,out,ts=sys.argv[1],sys.argv[2],[float(x) for x in sys.argv[3].split(',')]; h=sys.argv[4] if len(sys.argv)>4 else ''
js=f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch({{executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'}});
const p=await b.newPage({{viewport:{{width:2000,height:2000}}}});await p.goto('file://{os.path.abspath(page)}{h}');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const el=await p.$('#stage,#b,#c');const ts={ts};for(let i=0;i<ts.length;i++){{await p.evaluate(t=>window.render&&window.render(t),ts[i]);await el.screenshot({{path:'/tmp/cs_'+i+'.png'}})}}await b.close()}})()"""
f=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False);f.write(js);f.close()
subprocess.run(['node',f.name],check=True,env={**os.environ,'NODE_PATH':subprocess.check_output(['npm','root','-g']).decode().strip()})
ims=[Image.open(f'/tmp/cs_{i}.png') for i in range(len(ts))];w=270;h2=int(ims[0].height*w/ims[0].width);cols=6
sheet=Image.new('RGB',(cols*(w+10),((len(ims)+cols-1)//cols)*(h2+10)),(60,60,60))
for i,im in enumerate(ims): sheet.paste(im.resize((w,h2)),((i%cols)*(w+10),(i//cols)*(h2+10)))
sheet.save(out);print('wrote',out)
