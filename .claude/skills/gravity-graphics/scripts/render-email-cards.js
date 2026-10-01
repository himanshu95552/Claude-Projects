// usage: node render-email-cards.js jobs.json   (jobs: [{file, query}] ; renders templates/email/email-card.html at 1200x630)
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{
  const jobs=JSON.parse(fs.readFileSync(process.argv[2]));
  const page0=path.resolve(__dirname,'../templates/email/email-card.html');
  const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1200,height:630}});
  for(const j of jobs){await p.goto('file://'+page0+'?'+j.query);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:j.file});}
  await b.close();
})();
