// usage: node render.js in.svg out.png [scale]   -> PNG of full bleed canvas at 300 dpi (scale 3.125 css px)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [svgPath, outPng, sc] = process.argv.slice(2);
  const svg = fs.readFileSync(svgPath, 'utf8');
  const html = path.join(path.dirname(path.resolve(outPng)), '_render.html');
  fs.writeFileSync(html, `<!doctype html><html><head><style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`);
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: Number(sc || 3.125) });
  await p.goto('file://' + html);
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('svg');
  await el.screenshot({ path: outPng });
  await b.close();
})();
