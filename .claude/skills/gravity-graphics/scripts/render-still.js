// usage: node render-still.js page.html outPrefix t1,t2,... [W H]
const {chromium}=require('playwright');const path=require('path');
(async()=>{
  const [,,page,out,times='0',W='1080',H='1920']=process.argv;
  const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:+W,height:+H}});
  await p.goto('file://'+path.resolve(page));await p.evaluate(()=>document.fonts.ready);
  for(const t of times.split(',')){await p.evaluate(t=>window.render(t),+t);await p.screenshot({path:`${out}_${t}.png`});}
  await b.close();
})();
