// node render-still.js <page.html> <out.png> [#dark|#light] [selector]
// Renders one frame. Pages expose their canvas as #stage, #b or #c; window.render(t) if animated.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [page,out,hash='',sel='#stage,#b,#c']=process.argv.slice(2);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:2000,height:2000}});
await p.goto('file://'+path.resolve(page)+hash);await p.evaluate(()=>window.built||1);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await (await p.$(sel)).screenshot({path:out});await b.close();console.log('wrote',out)})();
