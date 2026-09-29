// node render-video.js <page.html> <out.mp4> <seconds> [#dark|#light] [selector]
// Steps window.render(t) at 30 fps, screenshots each frame, encodes H.264 + silent AAC (Instagram/LinkedIn/X safe).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
(async()=>{const [page,out,secs,hash='',sel='#stage,#b,#c']=process.argv.slice(2);
const dir=fs.mkdtempSync('/tmp/frames-');const N=Math.round(+secs*30);
const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:2000,height:2000}});
await p.goto('file://'+path.resolve(page)+hash);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const el=await p.$(sel);
for(let i=0;i<N;i++){await p.evaluate(t=>window.render(t),i/30);await el.screenshot({path:`${dir}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:94});}
await b.close();
const ff=execFileSync('python3',['-c','import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())']).toString().trim();
execFileSync(ff,['-y','-loglevel','error','-framerate','30','-i',`${dir}/%04d.jpg`,'-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-shortest',
 '-c:v','libx264','-preset','slow','-crf','20','-tune','animation','-pix_fmt','yuv420p','-profile:v','high','-c:a','aac','-b:a','64k','-movflags','+faststart',out]);
fs.copyFileSync(`${dir}/0000.jpg`,out.replace(/\.mp4$/,'-cover.jpg'));
console.log('wrote',out,(fs.statSync(out).size/1e6).toFixed(2)+'MB')})();
