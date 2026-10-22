/* Review widget: per-item "Add to final draft", comment box, regenerate from comment, and a final-draft panel.
   Usage: RV.init({selector:'article.ad, .box', min:40}). Needs capabilities db, sample, downloads. */
(function(){
const CSS=`
.rv-t{--rv-bg:#fff;--rv-fg:#0F172A;--rv-mut:#5B6878;--rv-ln:#E5E7EB;--rv-ac:#5B2FD1;--rv-acf:#fff;--rv-ok:#047857;--rv-soft:#F3EEFE;--rv-warn:#B45309}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .rv-t{--rv-bg:#2A2050;--rv-fg:#fff;--rv-mut:#B4A8D6;--rv-ln:#4A4270;--rv-ac:#C9B3FF;--rv-acf:#1B1430;--rv-ok:#34D399;--rv-soft:#3A2E66;--rv-warn:#F5B84B}}
:root[data-theme="dark"] .rv-t{--rv-bg:#2A2050;--rv-fg:#fff;--rv-mut:#B4A8D6;--rv-ln:#4A4270;--rv-ac:#C9B3FF;--rv-acf:#1B1430;--rv-ok:#34D399;--rv-soft:#3A2E66;--rv-warn:#F5B84B}
.rv-bar{position:relative;z-index:5;font:14px/1.45 Inter,system-ui,sans-serif;color:var(--rv-fg);background:var(--rv-bg);border:1px solid var(--rv-ln);border-radius:8px;padding:8px 10px;margin:8px 0;max-width:100%;box-sizing:border-box}
.rv-bar.in{border-color:var(--rv-ok)}
.rv-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.rv-bar button,.rv-pan button{font:600 13px Inter,system-ui,sans-serif;border:1px solid var(--rv-ln);background:var(--rv-bg);color:var(--rv-fg);padding:6px 11px;border-radius:8px;cursor:pointer}
.rv-bar button[aria-pressed=true]{background:var(--rv-ok);border-color:var(--rv-ok);color:#fff}
.rv-bar button.go,.rv-pan button.go{background:var(--rv-ac);border-color:var(--rv-ac);color:var(--rv-acf)}
.rv-bar button:disabled,.rv-pan button:disabled{opacity:.55;cursor:default}
.rv-bar button:focus-visible,.rv-bar textarea:focus-visible,.rv-pan button:focus-visible,.rv-fab:focus-visible{outline:2px solid var(--rv-ac);outline-offset:2px}
.rv-bar textarea{width:100%;box-sizing:border-box;min-height:54px;margin-top:8px;padding:8px;border:1px solid var(--rv-ln);border-radius:8px;font:14px Inter,system-ui,sans-serif;background:var(--rv-bg);color:var(--rv-fg);resize:vertical}
.rv-st{font-size:12.5px;color:var(--rv-mut)}.rv-st.w{color:var(--rv-warn)}
.rv-st.run::before{content:"";display:inline-block;width:11px;height:11px;margin-right:6px;vertical-align:-1px;border:2px solid var(--rv-ln);border-top-color:var(--rv-ac);border-radius:50%;animation:rvspin .8s linear infinite}
@keyframes rvspin{to{transform:rotate(360deg)}}
.rv-st.ok{color:var(--rv-ok);font-weight:600}.rv-st.err{color:#B91C1C;font-weight:600}
:root[data-theme="dark"] .rv-st.err{color:#FCA5A5}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .rv-st.err{color:#FCA5A5}}
.rv-prog{height:4px;border-radius:2px;background:var(--rv-ln);overflow:hidden;margin-top:8px}
.rv-prog i{display:block;height:100%;width:35%;background:var(--rv-ac);border-radius:2px;animation:rvslide 1.1s ease-in-out infinite}
@keyframes rvslide{0%{margin-left:-35%}100%{margin-left:100%}}
@media (prefers-reduced-motion:reduce){.rv-prog i,.rv-st.run::before{animation:none}}
.rv-lab{font:600 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--rv-mut);margin:10px 0 2px}
.rv-out.new{border:1px solid var(--rv-ok)}.rv-out.wip{border:1px dashed var(--rv-ac)}
.rv-bar details{margin-top:6px;font-size:13px}.rv-bar details pre{white-space:pre-wrap;font:inherit;margin:6px 0 0;color:var(--rv-mut);max-height:200px;overflow:auto}
.rv-dlw{position:relative}
.rv-dlb{position:absolute;top:10px;right:10px;z-index:6;font:600 12px Inter,system-ui,sans-serif;color:#fff;background:#1B1430;border:1px solid rgba(255,255,255,.4);border-radius:8px;padding:6px 10px;cursor:pointer;box-shadow:0 4px 12px rgba(27,20,48,.35)}
.rv-dlb:hover{background:#2A2050}.rv-dlb:focus-visible,.rv-dlp select:focus-visible,.rv-dlp input:focus-visible{outline:2px solid #C9B3FF;outline-offset:2px}
.rv-dlp{position:absolute;top:48px;right:10px;z-index:7;width:min(280px,calc(100% - 20px));box-sizing:border-box;background:var(--rv-bg);color:var(--rv-fg);border:1px solid var(--rv-ln);border-radius:12px;padding:12px;box-shadow:0 14px 34px rgba(27,20,48,.35);font:13px/1.4 Inter,system-ui,sans-serif}
.rv-dlp label{display:block;font-weight:600;margin:8px 0 3px}.rv-dlp select,.rv-dlp input{width:100%;box-sizing:border-box;padding:7px;border:1px solid var(--rv-ln);border-radius:8px;font:inherit;background:var(--rv-bg);color:var(--rv-fg)}
.rv-dlp .sz{margin-top:8px;color:var(--rv-mut)}.rv-dlp .row2{display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap}
.rv-dlp button{font:600 13px Inter,system-ui,sans-serif;border:1px solid var(--rv-ln);background:var(--rv-bg);color:var(--rv-fg);padding:6px 11px;border-radius:8px;cursor:pointer}
.rv-dlp button.go{background:var(--rv-ac);border-color:var(--rv-ac);color:var(--rv-acf)}.rv-dlp button:disabled{opacity:.55}
.rv-out{margin-top:8px;padding:8px 10px;background:var(--rv-soft);border-radius:8px;white-space:pre-wrap;font-size:14px;max-height:320px;overflow:auto}
.rv-fab{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;font:600 14px Inter,system-ui,sans-serif;background:var(--rv-ac);color:var(--rv-acf);border:0;border-radius:999px;padding:11px 18px;cursor:pointer;box-shadow:0 14px 34px rgba(27,20,48,.28)}
.rv-pan{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(64px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:min(460px,calc(100vw - 32px));max-height:min(70vh,640px);overflow:auto;background:var(--rv-bg);color:var(--rv-fg);border:1px solid var(--rv-ln);border-radius:14px;padding:14px;box-shadow:0 14px 34px rgba(27,20,48,.28);font:14px/1.5 Inter,system-ui,sans-serif}
.rv-pan h4{font:600 16px Urbanist,Inter,sans-serif;margin:0 0 8px}.rv-pan .fi{border-top:1px solid var(--rv-ln);padding:10px 0}.rv-pan .fi b{display:block;margin-bottom:4px}
.rv-pan pre{white-space:pre-wrap;font:inherit;margin:0 0 6px;max-height:140px;overflow:auto}
`;
const RULES=`You are revising one marketing draft for Alpha Nodus, which sells Gravity, the Agentic Operations System (AOS), to independent imaging centers in the USA. Not hospitals.
Rules: plain, specific, operator voice. Sentence case, no exclamation marks, no emoji. Say "system", not "platform"; "agentic", not "AI-powered". Keep every fact, number and quote exactly as given. Do not invent statistics, quotes, customers, certifications or claims. Keep placeholders such as {first_name} and links as they are. Keep the same format and roughly the same length unless the comment asks otherwise. Return only the revised text.`;
const ERR={not_granted:'Claude is not allowed for this page yet. Allow it from the page Permissions menu, then try again.',sampling_disabled:'Claude is not available for this account.',rate_limited:'Too many requests, or your usage limit was reached. Wait a minute and try again.',session_expired:'Sign in again, then try again.',upstream_error:'The service had a temporary problem. Try again.',refused:'Claude declined this input. Change the comment and try again.',empty_completion:'Nothing came back. Make the comment more specific and try again.',prompt_too_large:'This item is too long to send.',invalid_request:'The request was malformed.',invalid_json:'The reply could not be read as ad copy. Try again, or make the comment more specific.',capability_disabled:'Regenerate is not usable in this view.',not_declared:'Regenerate is not enabled for this page.'};
const ELS={},APPLIED={};
const FL={headline:'Banner headline',sub:'Banner sub-line',button:'Button',intro:'Post text',cardHeadline:'Card headline'};
const fmtF=f=>Object.keys(FL).filter(k=>f&&f[k]!=null).map(k=>FL[k]+': '+f[k]).join('\n');
function parseF(t){const a=t.indexOf('{'),b=t.lastIndexOf('}');if(a<0||b<a)throw{code:'invalid_json'};let o;try{o=JSON.parse(t.slice(a,b+1))}catch(e){throw{code:'invalid_json'}}const f={};for(const k of Object.keys(FL)){if(typeof o[k]!=='string'||!o[k].trim())throw{code:'invalid_json'};f[k]=o[k].trim()}return f}
function rerender(id,adId){const el=ELS[id];if(!el||!el.isConnected)return null;const n=cfg.structured.render(el,adId);if(n){n.dataset.rv=id;ELS[id]=n;if(cfg.dl)addDl(n,adId)}return n}
let DLQ=Promise.resolve(),DLN=0;
function loadH2C(){return window.html2canvas?Promise.resolve():new Promise((res,rej)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';sc.onload=res;sc.onerror=()=>rej({code:'lib'});document.head.appendChild(sc)})}
const WIDTHS=[[540,'540 px'],[1080,'1080 px (LinkedIn standard)'],[1200,'1200 px'],[1600,'1600 px'],[2160,'2160 px (2x)'],[2400,'2400 px'],[0,'Custom width']];
const FMTS=[['png','PNG','image/png'],['jpg','JPG','image/jpeg'],['webp','WebP','image/webp']];
function addDl(el,adId){if(!cfg.dl||!el.isConnected)return;const bn=el.querySelector('.bn, .art');if(!bn||bn.parentElement.classList.contains('rv-dlw'))return;
 const w=document.createElement('div');w.className='rv-dlw';bn.replaceWith(w);w.appendChild(bn);
 const btn=document.createElement('button');btn.className='rv-dlb';btn.type='button';btn.textContent='\u2193 Download';btn.setAttribute('aria-haspopup','dialog');w.appendChild(btn);
 let pop=null;
 btn.onclick=e=>{e.stopPropagation();if(pop){pop.remove();pop=null;return}
  const L=cfg.dl.layouts();const legacy=!w.querySelector('.bn');
  pop=document.createElement('div');pop.className='rv-t rv-dlp';pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Download banner');
  pop.innerHTML=`<label>Layout</label><select class="ly">${legacy?'<option value="">As shown</option>':L.map(l=>`<option value="${l[0]}">${l[1]}</option>`).join('')}</select><label>Width</label><select class="wd">${WIDTHS.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select><input class="cw" type="number" min="200" max="4000" value="1080" aria-label="Custom width in pixels" hidden><label>Format</label><select class="fm">${FMTS.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('')}</select><div class="sz"></div><div class="row2"><button class="go dd" type="button">Download</button><button class="cl" type="button">Close</button><span class="rv-st"></span></div>`;
  w.appendChild(pop);
  const q=x=>pop.querySelector(x),ly=q('.ly'),wd=q('.wd'),cw=q('.cw'),fm=q('.fm'),sz=q('.sz'),dd=q('.dd'),stt=q('.rv-st');
  if(!legacy)ly.value=cfg.dl.current();wd.value=(ly.value==='land')?'1200':'1080';
  const ratio=()=>{const l=L.find(x=>x[0]===ly.value);return l?l[2]:(w.querySelector('.bn,.art').offsetHeight/w.querySelector('.bn,.art').offsetWidth)};
  const W=()=>wd.value==='0'?Math.max(200,Math.min(4000,+cw.value||1080)):+wd.value;
  const upd=()=>{cw.hidden=wd.value!=='0';const x=W();sz.textContent=x+' \u00d7 '+Math.round(x*ratio())+' px, '+fm.options[fm.selectedIndex].text};
  [ly,wd,cw,fm].forEach(x=>x.oninput=upd);upd();
  ly.onchange=()=>{if(wd.value==='1080'||wd.value==='1200')wd.value=ly.value==='land'?'1200':'1080';upd()};
  q('.cl').onclick=()=>{pop.remove();pop=null};
  const job=async()=>{stt.className='rv-st run';stt.textContent='Rendering...';
   try{await loadH2C();const x=W();const f=FMTS.find(z=>z[0]===fm.value);const html=legacy?'':cfg.dl.html(adId,ly.value);
    let target,host=null,scale=1,outW=x;
    if(html&&/class="bn/.test(html)){host=document.createElement('div');host.style.cssText='position:fixed;left:-20000px;top:0;width:'+x+'px';host.innerHTML=html;document.body.appendChild(host);target=host.firstElementChild}
    else{target=w.querySelector('.bn,.art');scale=x/target.offsetWidth}
    try{await document.fonts.ready;if(host)await Promise.all([...host.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));
     const rect=target.getBoundingClientRect();
     const cv=await html2canvas(target,{scale:scale,width:Math.round(rect.width),height:Math.round(rect.height),backgroundColor:'#1B1430',logging:false,useCORS:true});
     const blob=await new Promise(r=>cv.toBlob(r,f[2],0.92));if(!blob)throw {code:'render'};
     const dl=await claude.use('downloads');if(!dl)throw {code:'unavailable'};
     stt.className='rv-st run';stt.textContent='Waiting for you to confirm the save...';
     await dl.save({filename:adId+'-'+(ly.value||'as-shown')+'-'+cv.width+'x'+cv.height+'.'+f[0],data:blob});
     stt.className='rv-st ok';stt.textContent='Saved '+cv.width+' \u00d7 '+cv.height+' '+f[1]}
    finally{if(host)host.remove()}
   }catch(e){stt.className='rv-st err';stt.textContent=e&&e.code==='declined'?'Save cancelled.':e&&e.code==='lib'?'Could not load the image tool. Check your connection and try again.':e&&e.code==='unavailable'?'Downloads are not available in this view.':e&&e.code==='rate_limited'?'A save confirmation is already open. Confirm or cancel it, then download again.':e&&e.code==='too_large'?'The file is too large. Choose a smaller width.':'Could not create the image ('+((e&&(e.code||e.message))||'unknown')+'). Try a smaller width or another layout.'}
   dd.disabled=false};
  dd.onclick=()=>{dd.disabled=true;stt.className='rv-st run';stt.textContent=DLN>0?'Queued, waiting for '+DLN+' other download'+(DLN>1?'s':'')+'...':'Starting...';DLN++;DLQ=DLQ.then(job).catch(()=>{}).then(()=>{DLN--})};
};
 document.addEventListener('click',function off(e){if(pop&&!pop.contains(e.target)&&e.target!==btn){pop.remove();pop=null}if(!w.isConnected)document.removeEventListener('click',off)});
}
const S={};let db=null,sample=null,dl=null,cfg={},uid=0,scanTimer=0,panel=null;
const h=s=>{let x=5381;for(const c of s)x=((x<<5)+x+c.charCodeAt(0))|0;return (x>>>0).toString(36)};
function pid(el,txt){const pane=el.closest('[id]');return (cfg.prefix||'i')+'-'+h((pane?pane.id:'')+'|'+txt.slice(0,80))}
function title(el,txt){const t=el.querySelector('.hl,.big,.q,h3,h2');return (cfg.title?cfg.title(el):'')||(t&&t.innerText.trim().slice(0,90))||txt.split('\n').map(x=>x.trim()).find(x=>x.length>3)||'Creative'}
const cur=r=>(S[r]&&S[r].regen)||(S[r]&&S[r].text)||'';
function save(id,p){S[id]=Object.assign({id},S[id],p);if(db)db.doc('review/'+id).set(S[id]).catch(e=>st(id,'Not saved: '+(e.message||e.code),1));updFab()}
function st(id,t,k){document.querySelectorAll('[data-rvst="'+id+'"],[data-rvst2="'+id+'"]').forEach(e=>{e.textContent=t;e.className='rv-st'+(k===1?' w':k?' '+k:'')})}
function bar(el){const txt=(el.innerText||'').replace(/\n{3,}/g,'\n\n').trim();const vis=!!el.querySelector('img,svg,canvas,.bn')||/\b(bn|art|brand|slide|vf)\b/.test(el.className);if(txt.length<(cfg.min||30)&&!vis)return;if(!el.offsetParent&&!el.getClientRects().length)return;
 const adId=cfg.structured?cfg.structured.id(el):null;if(el.dataset.rv)return;const pane0=el.closest('[id]');const id=adId?(cfg.prefix||'i')+'-'+(pane0?pane0.id:'')+'-'+adId:pid(el,txt);el.dataset.rv=id;ELS[id]=el;if(adId&&cfg.dl)addDl(el,adId);const curTxt=()=>adId?fmtF(cfg.structured.fields(adId,ELS[id])):txt;
 const b=document.createElement('div');b.className='rv-t rv-bar';b.dataset.rvbar=id;
 b.innerHTML=`<div class="rv-row"><button class="add" aria-pressed="false">Add to final draft</button><button class="cm">Comment</button><span class="rv-st" data-rvst="${id}"></span></div><div class="rv-box" hidden><textarea placeholder="Leave a comment, e.g. shorter, warmer, mention X, remove Y" aria-label="Comment"></textarea><div class="rv-row" style="margin-top:8px"><button class="go rg">Regenerate with comment</button><button class="sp" hidden>Stop</button><button class="rs" hidden>Reset to original</button><span class="rv-st" data-rvst2="${id}"></span></div><div class="rv-prog" hidden><i></i></div><div class="rv-lab" hidden></div><div class="rv-out" hidden></div><details class="rv-orig" hidden><summary>Show original</summary><pre></pre></details></div>`;
 const par=el.parentElement,pd=par?getComputedStyle(par).display:'block';
 if(/flex|grid/.test(pd)){const cs=getComputedStyle(el),w=document.createElement('div');w.style.cssText='min-width:0;flex:'+cs.flex+';scroll-snap-align:'+(cs.scrollSnapAlign||'none')+(parseFloat(cs.flexGrow)===0?';width:'+el.offsetWidth+'px':'')+';grid-column:'+cs.gridColumnStart+'/'+cs.gridColumnEnd;el.replaceWith(w);w.appendChild(el);w.appendChild(b)}else el.insertAdjacentElement('afterend',b);
 const ta=b.querySelector('textarea'),out=b.querySelector('.rv-out'),add=b.querySelector('.add'),box=b.querySelector('.rv-box'),rg=b.querySelector('.rg'),rs=b.querySelector('.rs');
 b.querySelector('.cm').onclick=()=>{box.hidden=!box.hidden;if(!box.hidden)ta.focus()};
 add.onclick=()=>{const on=!(S[id]&&S[id].inc);save(id,{inc:on,title:title(ELS[id],txt),text:curTxt()});sync(id)};
 ta.onchange=()=>save(id,{comment:ta.value,title:title(ELS[id],txt),text:curTxt()});
 rs.onclick=()=>{if(adId){cfg.structured.set(adId,null);rerender(id,adId);APPLIED[id]='';save(id,{regen:'',fields:null,text:curTxt()})}else save(id,{regen:''});out.textContent='';out.hidden=true;b.querySelector('.rv-lab').hidden=true;orig.hidden=true;st(id,'Reset to the original.');sync(id)};
 const prog=b.querySelector('.rv-prog'),lab=b.querySelector('.rv-lab'),sp=b.querySelector('.sp'),orig=b.querySelector('.rv-orig');let ctl=null;
 sp.onclick=()=>{if(ctl)ctl.abort()};
 rg.onclick=async()=>{const c=ta.value.trim();box.hidden=false;
  if(!c){st(id,'Write a comment first, then regenerate.',1);ta.focus();return}
  if(!sample){st(id,'Regenerate is not available in this view.','err');return}
  const base=adId?curTxt():(cur(id)||txt);const baseF=adId?cfg.structured.fields(adId,ELS[id]):null;save(id,{comment:c,title:title(ELS[id],txt),text:curTxt(),adId:adId||undefined});
  rg.disabled=true;sp.hidden=false;prog.hidden=false;lab.hidden=false;lab.textContent='New version, in progress';out.hidden=false;out.className='rv-out wip';out.textContent='';orig.hidden=true;
  const t0=Date.now();let got=false,tick=setInterval(()=>{if(!got)st(id,'Claude is thinking... '+Math.round((Date.now()-t0)/1000)+'s','run')},1000);
  st(id,'Sending to Claude...','run');ctl=new AbortController();
  const cap=setTimeout(()=>{if(ctl)ctl.abort()},180000);
  try{
   try{const p=await claude.use('permissions');if(p){let ps=await p.state('sample');if(ps==='prompt'){st(id,'Waiting for your permission to use Claude...','run');ps=((await p.request(['sample']))||{}).sample||ps}
     if(ps==='denied')throw {code:'not_granted'}}}catch(e){if(e&&e.code==='not_granted')throw e}
   st(id,'Claude is thinking... 0s','run');
   const prompt=adId?`${RULES}\n\nThis is a LinkedIn ad. Return only a JSON object with exactly these string keys: headline, sub, button, intro, cardHeadline. Limits: headline up to 12 words; sub up to 20 words; button up to 22 characters; intro up to 40 words; cardHeadline up to 8 words. Change only what the comment asks and keep the other fields as they are.\n\nCURRENT:\n${JSON.stringify(baseF,null,1)}\n\nREVIEWER COMMENT:\n${c}`:`${RULES}\n\nDRAFT:\n${base}\n\nREVIEWER COMMENT:\n${c}`;
   const r=await sample(prompt,{modelTier:(adId||base.length<=1500)?'quick':'default',cache:false,signal:ctl.signal,onText:u=>{if(!got){got=true;lab.textContent='New version, writing...'}if(!adId)out.textContent=u.text;else out.textContent='Claude is writing the new ad copy...';st(id,'Writing... '+u.text.split(/\s+/).length+' words','run')}});
   let nt=(r.text||'').trim();if(!nt)throw {code:'empty_completion'};
   if(adId){const f=parseF(nt);cfg.structured.set(adId,f);const n=rerender(id,adId);APPLIED[id]=JSON.stringify(f);nt=fmtF(f);save(id,{regen:nt,fields:f,text:nt,adId});
    if(n){n.scrollIntoView({behavior:'smooth',block:'center'});n.style.outline='3px solid var(--rv-ok)';n.style.outlineOffset='3px';setTimeout(()=>{n.style.outline='';n.style.outlineOffset=''},2500)}}
   else save(id,{regen:nt});
   out.textContent=nt;out.className='rv-out new';lab.textContent=adId?'New copy, applied to the banner above':'New version, saved';
   orig.hidden=false;orig.querySelector('pre').textContent=adId?fmtF(baseF):base;
   st(id,'Updated at '+new Date().toLocaleTimeString()+(adId?'. The banner above now shows the new copy.':'')+(r.truncated?' (cut short)':''),'ok');rs.hidden=false;
  }catch(e){const code=(e&&e.code)||'upstream_error';
   if(code==='cancelled'){st(id,'Stopped.',1);out.className='rv-out';if(e.text&&e.text.length>20)out.textContent=e.text;else out.hidden=true;lab.hidden=true}
   else{st(id,(ERR[code]||ERR.upstream_error)+(e&&e.message&&!ERR[code]?' ('+e.message+')':''),'err');lab.textContent='Not updated';out.className='rv-out';if(e&&e.text)out.textContent=e.text;else{out.hidden=true;lab.hidden=true}}}
  finally{clearInterval(tick);clearTimeout(cap);ctl=null;rg.disabled=false;sp.hidden=true;prog.hidden=true}}
 sync(id)}
function sync(id){document.querySelectorAll('[data-rvbar="'+id+'"]').forEach(b=>{const s=S[id]||{},add=b.querySelector('.add'),ta=b.querySelector('textarea'),out=b.querySelector('.rv-out'),rs=b.querySelector('.rs');
 add.setAttribute('aria-pressed',!!s.inc);add.textContent=s.inc?'In final draft':'Add to final draft';b.classList.toggle('in',!!s.inc);
 if(document.activeElement!==ta&&ta.value!==(s.comment||''))ta.value=s.comment||'';
 if(b.querySelector('.sp').hidden){if(s.regen){out.hidden=false;out.textContent=s.regen;out.className='rv-out new';const l=b.querySelector('.rv-lab');l.hidden=false;l.textContent='Regenerated version';rs.hidden=false;b.querySelector('.rv-box').hidden=false}else{rs.hidden=true;if(!out.textContent){out.hidden=true;b.querySelector('.rv-lab').hidden=true}}}});}
function scan(){(cfg.tiers||[cfg.selector]).forEach(sel=>{[...document.querySelectorAll(sel)].filter(e=>!e.dataset.rv&&!e.closest('.rv-bar,.rv-pan')&&!(e.parentElement&&e.parentElement.closest(sel))).forEach(bar)})}
function sched(){clearTimeout(scanTimer);scanTimer=setTimeout(scan,250)}
function items(){return Object.values(S).filter(s=>s.inc)}
function txt(){return items().map(s=>'# '+(s.title||'Item')+'\n\n'+cur(s.id)).join('\n\n---\n\n')}
function updFab(){const f=document.getElementById('rv-fab');if(f)f.textContent='Final draft · '+items().length;if(panel)drawPanel()}
function drawPanel(){const L=items();panel.innerHTML=`<h4>Final draft</h4><div class="rv-row"><button class="go" id="rv-copy" ${L.length?'':'disabled'}>Copy all</button>${dl?`<button id="rv-save" ${L.length?'':'disabled'}>Save as .md</button>`:''}<button id="rv-close">Close</button><span class="rv-st" id="rv-fst"></span></div>`+(L.length?L.map(s=>`<div class="fi"><b></b><pre></pre>${s.comment?'<div class="rv-st">Comment: <span class="c"></span></div>':''}<button data-rm="${s.id}">Remove</button></div>`).join(''):'<p class="rv-st">Nothing added yet. Use "Add to final draft" under any item.</p>');
 [...panel.querySelectorAll('.fi')].forEach((f,i)=>{f.querySelector('b').textContent=L[i].title||'Item';f.querySelector('pre').textContent=cur(L[i].id);const c=f.querySelector('.c');if(c)c.textContent=L[i].comment});
 panel.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{save(b.dataset.rm,{inc:false});sync(b.dataset.rm)});
 const q=s=>panel.querySelector(s);q('#rv-close').onclick=()=>{panel.remove();panel=null};
 const c=q('#rv-copy');if(c)c.onclick=async()=>{try{await navigator.clipboard.writeText(txt());q('#rv-fst').textContent='Copied'}catch(e){q('#rv-fst').textContent='Copy was blocked. Select the text and copy it.'}};
 const sv=q('#rv-save');if(sv)sv.onclick=async()=>{try{await dl.save({filename:'final-draft.md',data:txt()});q('#rv-fst').textContent='Saved'}catch(e){q('#rv-fst').textContent='Save was cancelled'}}}
function togglePanel(){if(panel){panel.remove();panel=null;return}panel=document.createElement('div');panel.className='rv-t rv-pan';document.body.appendChild(panel);drawPanel()}
window.RV={async init(c){cfg=c;const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
 const f=document.createElement('button');f.id='rv-fab';f.className='rv-t rv-fab';f.textContent='Final draft · 0';f.onclick=togglePanel;document.body.appendChild(f);
 scan();new MutationObserver(sched).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});addEventListener('hashchange',sched);
 try{db=await claude.use('db');sample=await claude.use('sample');dl=await claude.use('downloads')}catch(e){}
 if(db){try{db.collection('review').onSnapshot(s=>{let changed=false;s.docs.forEach(d=>{const x=d.data();S[d.id]=x;if(cfg.structured&&x.adId){const k=x.fields?JSON.stringify(x.fields):'';cfg.structured.set(x.adId,x.fields||null);if((APPLIED[d.id]||'')!==k){APPLIED[d.id]=k;changed=true;if(!cfg.structured.refresh)rerender(d.id,x.adId)}}});if(changed&&cfg.structured.refresh)cfg.structured.refresh();document.querySelectorAll('[data-rvbar]').forEach(b=>sync(b.dataset.rvbar));updFab()})}catch(e){}}}};
})();
