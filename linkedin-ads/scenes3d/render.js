const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
(async()=>{const names=process.argv.slice(2);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
const pg=await b.newPage({viewport:{width:1600,height:1200}});pg.on('pageerror',e=>console.log('ERR',e.message));pg.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
await pg.goto('http://localhost:8765/index.html');await pg.waitForFunction('window.__ready',{timeout:60000});
for(const n of names){const t=Date.now();const d=await pg.evaluate(n=>window.renderScene(n),n);fs.writeFileSync('out_'+n+'.png',Buffer.from(d.png.split(',')[1],'base64'));fs.writeFileSync('out_'+n+'.json',JSON.stringify(d.labels));console.log(n,Date.now()-t,'ms')}
await b.close()})();
