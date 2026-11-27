const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
(async () => {
  const [svgPath, out] = process.argv.slice(2);
  const svg = fs.readFileSync(svgPath,'utf8').replace(/<svg ([^>]*?)width="306" height="450"/,'<svg $1width="4.25in" height="6.25in"');
  const html = path.resolve(path.dirname(out),'_pdf.html');
  fs.writeFileSync(html,`<!doctype html><html><head><style>@page{size:4.25in 6.25in;margin:0}html,body{margin:0}svg{display:block}</style></head><body>${svg}</body></html>`);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://'+html); await p.evaluate(()=>document.fonts.ready);
  await p.pdf({ path: out, width:'4.25in', height:'6.25in', printBackground:true, preferCSSPageSize:true });
  await b.close();
})();
