// usage: node render-video.js page.html out.mp4 seconds [fps]
const {chromium}=require('playwright');const path=require('path');const {spawn}=require('child_process');
(async()=>{
  const [,,page,out,dur='32',fps='30']=process.argv;
  const ff=process.env.FFMPEG||require('child_process').execSync('python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
  const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+path.resolve(page));await p.evaluate(()=>document.fonts.ready);
  const n=Math.round(+dur*+fps);
  const f=spawn(ff,['-y','-loglevel','error','-f','image2pipe','-framerate',fps,'-i','-','-f','lavfi','-i','anullsrc=r=44100:cl=stereo','-shortest',
    '-c:v','libx264','-profile:v','high','-preset','slow','-crf','20','-tune','animation','-pix_fmt','yuv420p','-movflags','+faststart','-c:a','aac','-b:a','64k',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<n;i++){await p.evaluate(t=>window.render(t),i/+fps);const buf=await p.screenshot({type:'png'});if(!f.stdin.write(buf))await new Promise(r=>f.stdin.once('drain',r));}
  f.stdin.end();await new Promise(r=>f.on('close',r));await b.close();
})();
