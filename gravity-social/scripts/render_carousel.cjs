// Gravity carousel renderer: slide JSON -> PNG per frame + one PDF (LinkedIn document).
// Called by scripts/render_carousel.py; not usually run directly.
//   node scripts/render_carousel.cjs <spec.json> <outDir>
// Needs Playwright (npm i -g playwright, or the preinstalled one) and Chromium.

const fs = require("fs");
const path = require("path");

function loadPlaywright() {
  try { return require("playwright"); } catch (_) {}
  const { execSync } = require("child_process");
  const root = execSync("npm root -g").toString().trim();
  return require(path.join(root, "playwright"));
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// **word** -> accent, ==word== -> highlight
const md = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<span class="acc">$1</span>')
  .replace(/==(.+?)==/g, '<span class="hi">$1</span>')
  .replace(/\n/g, "<br>");

function frame(slide, i, n, theme) {
  const t = slide.template || "text";
  const beta = slide.beta ? '<div class="beta">Beta</div>' : "";
  const foot = slide.footnote ? `<div class="footnote">${md(slide.footnote)}</div>` : "";
  let inner = "";
  switch (t) {
    case "cover":
      inner = `${slide.kicker ? `<div class="kicker">${md(slide.kicker)}</div>` : ""}
        <h1 class="cover">${md(slide.headline)}</h1>
        ${slide.sub ? `<p class="sub">${md(slide.sub)}</p>` : ""}
        <div class="swipe">Swipe →</div>`;
      break;
    case "statement":
      inner = `<div class="center"><h1 class="statement">${md(slide.text || slide.headline)}</h1>
        ${slide.attribution ? `<p class="sub">${md(slide.attribution)}</p>` : ""}</div>`;
      break;
    case "question":
      inner = `<div class="center"><div class="qmark">?</div><h1 class="statement">${md(slide.question)}</h1>
        ${slide.sub ? `<p class="sub">${md(slide.sub)}</p>` : ""}</div>`;
      break;
    case "stat":
      inner = `<div class="center"><div class="stat">${md(slide.number)}</div>
        <p class="statlabel">${md(slide.label)}</p>
        ${slide.source ? `<p class="source">${md(slide.source)}</p>` : ""}</div>`;
      break;
    case "three-leaks":
      inner = `${slide.headline ? `<h2>${md(slide.headline)}</h2>` : ""}
        <div class="leaks">${(slide.rows || []).map((r, k) => `
          <div class="leak"><div class="num">${k + 1}</div>
            <div><div class="leakname">${md(r.leak)}</div><div class="what">${md(r.what)}</div>
            ${r.verb ? `<div class="verb">${md(r.verb)}</div>` : ""}</div></div>`).join("")}</div>`;
      break;
    case "timeline":
      inner = `${slide.headline ? `<h2>${md(slide.headline)}</h2>` : ""}
        <div class="timeline">${(slide.steps || []).map((s) => `
          <div class="step ${s.exit ? "exit" : ""}"><div class="dot"></div>
            <div><div class="steplabel">${md(s.label)}</div>${s.note ? `<div class="stepnote">${md(s.note)}</div>` : ""}</div></div>`).join("")}</div>`;
      break;
    case "itemized": {
      const col = (c, cls) => `<div class="col ${cls}"><div class="coltitle">${md(c.title)}</div>
        ${(c.lines || []).map(([k, v]) => `<div class="line"><span>${md(k)}</span><span>${md(v)}</span></div>`).join("")}
        <div class="line net"><span>Net</span><span>${md(c.net)}</span></div></div>`;
      inner = `${slide.headline ? `<h2>${md(slide.headline)}</h2>` : ""}
        <div class="itemized">${col(slide.left || {}, "left")}${slide.right ? col(slide.right, "right") : ""}</div>
        ${slide.bridge ? `<div class="bridge">${md(slide.bridge)}</div>` : ""}`;
      break;
    }
    case "cta":
      inner = `<div class="center"><h1 class="statement">${md(slide.headline)}</h1>
        ${slide.sub ? `<p class="sub">${md(slide.sub)}</p>` : ""}
        ${slide.link_text ? `<div class="linkbox">${md(slide.link_text)}</div>` : ""}
        <div class="signoff">Gravity, from Alpha Nodus</div></div>`;
      break;
    default: {
      const body = Array.isArray(slide.body)
        ? `<ul>${slide.body.map((b) => `<li>${md(b)}</li>`).join("")}</ul>`
        : slide.body ? `<p class="body">${md(slide.body)}</p>` : "";
      inner = `${slide.kicker ? `<div class="kicker">${md(slide.kicker)}</div>` : ""}
        ${slide.headline ? `<h2>${md(slide.headline)}</h2>` : ""}${body}`;
    }
  }
  return `<section class="frame t-${t}">${beta}<div class="content">${inner}</div>${foot}
    <div class="footer"><span>${esc(theme.footer)}</span><span>${i + 1} / ${n}</span></div></section>`;
}

function fontFaces() {
  // Embedded so renders are on-brand offline; Google Fonts is only a fallback.
  const dir = path.join(__dirname, "fonts");
  const face = (family, file, weights) => {
    const f = path.join(dir, file);
    if (!fs.existsSync(f)) return "";
    const b64 = fs.readFileSync(f).toString("base64");
    return `@font-face { font-family: '${family}'; font-weight: ${weights}; font-style: normal;
      src: url(data:font/woff2;base64,${b64}) format('woff2'); }`;
  };
  return face("Inter", "Inter-var.woff2", "100 900") + face("Space Grotesk", "SpaceGrotesk-var.woff2", "300 700");
}

function css(theme, mode) {
  const c = theme[mode];
  const W = theme.width, H = theme.height;
  return `
  @page { size: ${W}px ${H}px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${c.bg}; }
  .frame { width: ${W}px; height: ${H}px; background: ${c.bg}; color: ${c.text}; position: relative;
    padding: 110px 96px 150px; display: flex; flex-direction: column; overflow: hidden; page-break-after: always;
    font-family: ${theme.fonts.body}; }
  .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 36px; }
  .center { display: flex; flex-direction: column; gap: 40px; }
  .acc { color: ${c.accent}; } .hi { color: ${c.highlight}; }
  .kicker { font: 600 28px/1.2 ${theme.fonts.body}; letter-spacing: .14em; text-transform: uppercase; color: ${c.muted}; }
  h1, h2, .stat { font-family: ${theme.fonts.display}; letter-spacing: -0.02em; }
  h1.cover { font-weight: 700; font-size: 96px; line-height: 1.02; }
  h1.statement { font-weight: 700; font-size: 84px; line-height: 1.06; }
  h2 { font-weight: 700; font-size: 76px; line-height: 1.06; }
  .sub, .body { font-size: 42px; line-height: 1.34; color: ${c.muted}; max-width: 860px; }
  ul { list-style: none; display: flex; flex-direction: column; gap: 26px; }
  li { font-size: 44px; line-height: 1.3; padding-left: 40px; position: relative; }
  li::before { content: ""; position: absolute; left: 0; top: 21px; width: 16px; height: 16px; background: ${c.accent}; }
  .swipe { font: 600 28px ${theme.fonts.body}; color: ${c.accent}; margin-top: 20px; }
  .qmark { font: 700 180px/0.8 ${theme.fonts.display}; color: ${c.highlight}; }
  .stat { font-weight: 700; font-size: 230px; line-height: .9; color: ${c.accent}; }
  .statlabel { font-size: 44px; line-height: 1.25; max-width: 860px; }
  .source { font-size: 24px; color: ${c.muted}; }
  .leaks { display: flex; flex-direction: column; gap: 22px; }
  .leak { display: grid; grid-template-columns: 76px 1fr; gap: 26px; padding: 30px 0; border-top: 2px solid ${c.rule}; }
  .num { font: 700 64px/1 ${theme.fonts.display}; color: ${c.highlight}; }
  .leakname { font: 700 44px/1.1 ${theme.fonts.display}; }
  .what { font-size: 31px; line-height: 1.35; color: ${c.muted}; margin-top: 10px; }
  .verb { font: 600 31px ${theme.fonts.body}; color: ${c.accent}; margin-top: 12px; }
  .timeline { display: flex; flex-direction: column; gap: 0; border-left: 4px solid ${c.rule}; margin-left: 14px; }
  .step { display: grid; grid-template-columns: 40px 1fr; align-items: start; padding: 14px 0 14px 0; margin-left: -16px; }
  .dot { width: 28px; height: 28px; border-radius: 50%; background: ${c.accent}; margin-top: 8px; }
  .step.exit .dot { background: ${c.highlight}; }
  .steplabel { font: 600 36px/1.2 ${theme.fonts.body}; }
  .stepnote { font-size: 26px; color: ${c.muted}; margin-top: 4px; }
  .step.exit .stepnote { color: ${c.highlight}; }
  .itemized { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .col { background: ${c.surface}; border: 2px solid ${c.rule}; padding: 30px 28px; font-size: 27px; }
  .col.right { border-color: ${c.accent}; }
  .coltitle { font: 700 30px ${theme.fonts.display}; margin-bottom: 18px; }
  .col.right .coltitle { color: ${c.accent}; }
  .line { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed ${c.rule}; font-variant-numeric: tabular-nums; }
  .line.net { border-bottom: none; border-top: 3px solid ${c.text}; margin-top: 10px; padding-top: 16px; font: 700 40px ${theme.fonts.display}; }
  .col.right .line.net span:last-child { color: ${c.highlight}; }
  .bridge { font: 700 40px/1.2 ${theme.fonts.display}; }
  .linkbox { font: 600 34px ${theme.fonts.body}; color: ${c.accent}; border: 3px solid ${c.accent}; padding: 22px 30px; align-self: flex-start; }
  .signoff { font-size: 28px; color: ${c.muted}; }
  .beta { position: absolute; top: 48px; right: 96px; font: 700 22px ${theme.fonts.body}; letter-spacing: .12em; text-transform: uppercase;
    color: ${c.bg}; background: ${c.highlight}; padding: 8px 16px; }
  .footnote { font-size: 21px; line-height: 1.35; color: ${c.muted}; margin-top: 18px; max-width: 900px; }
  .footer { position: absolute; left: 96px; right: 96px; bottom: 56px; display: flex; justify-content: space-between;
    font: 500 22px ${theme.fonts.body}; color: ${c.muted}; border-top: 1px solid ${c.rule}; padding-top: 22px; }
  `;
}

async function main() {
  const [specPath, outDir] = process.argv.slice(2);
  if (!specPath || !outDir) { console.error("usage: render_carousel.cjs <spec.json> <outDir>"); process.exit(2); }
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const theme = JSON.parse(fs.readFileSync(path.join(__dirname, "carousel-theme.json"), "utf8"));
  const mode = spec.theme === "light" ? "light" : "dark";
  const slides = spec.slides || [];
  const html = `<!doctype html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="${theme.fonts.google}"><style>${fontFaces()}${css(theme, mode)}</style></head>
    <body>${slides.map((s, i) => frame(s, i, slides.length, theme)).join("")}</body></html>`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "carousel.html"), html);

  const { chromium } = loadPlaywright();
  const opts = {};
  if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(opts);
  const page = await browser.newPage({ viewport: { width: theme.width, height: theme.height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle", timeout: 20000 }).catch(() => page.setContent(html));
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const frames = await page.$$("section.frame");
  const files = [];
  for (let i = 0; i < frames.length; i++) {
    const f = path.join(outDir, `frame-${String(i + 1).padStart(2, "0")}.png`);
    await frames[i].screenshot({ path: f });
    files.push(f);
  }
  await page.pdf({ path: path.join(outDir, "carousel.pdf"), width: `${theme.width}px`, height: `${theme.height}px`, printBackground: true });
  // Overflow check: text that spills out of a frame is a layout bug the reviewer should see.
  const overflow = await page.$$eval("section.frame .content", (els) => els.map((e, i) => (e.scrollHeight > e.clientHeight + 2 ? i + 1 : 0)).filter(Boolean));
  await browser.close();
  console.log(JSON.stringify({ frames: files, pdf: path.join(outDir, "carousel.pdf"), overflow }));
}

main().catch((e) => { console.error(e); process.exit(1); });
