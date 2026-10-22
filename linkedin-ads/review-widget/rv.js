/* Review widget: per-item "Add to final draft", comment box, regenerate from comment, and a final-draft panel.
   Usage: RV.init({selector:'article.ad, .box', min:40}). Needs capabilities db, sample, downloads. */
(function(){
const CSS=`
.rv-t{--rv-bg:#fff;--rv-fg:#0F172A;--rv-mut:#5B6878;--rv-ln:#E5E7EB;--rv-ac:#5B2FD1;--rv-acf:#fff;--rv-ok:#047857;--rv-soft:#F3EEFE;--rv-warn:#B45309}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .rv-t{--rv-bg:#2A2050;--rv-fg:#fff;--rv-mut:#B4A8D6;--rv-ln:#4A4270;--rv-ac:#C9B3FF;--rv-acf:#1B1430;--rv-ok:#34D399;--rv-soft:#3A2E66;--rv-warn:#F5B84B}}
:root[data-theme="dark"] .rv-t{--rv-bg:#2A2050;--rv-fg:#fff;--rv-mut:#B4A8D6;--rv-ln:#4A4270;--rv-ac:#C9B3FF;--rv-acf:#1B1430;--rv-ok:#34D399;--rv-soft:#3A2E66;--rv-warn:#F5B84B}
.rv-bar{font:14px/1.45 Inter,system-ui,sans-serif;color:var(--rv-fg);background:var(--rv-bg);border:1px solid var(--rv-ln);border-radius:8px;padding:8px 10px;margin:8px 0;max-width:100%;box-sizing:border-box}
.rv-bar.in{border-color:var(--rv-ok)}
.rv-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.rv-bar button,.rv-pan button{font:600 13px Inter,system-ui,sans-serif;border:1px solid var(--rv-ln);background:var(--rv-bg);color:var(--rv-fg);padding:6px 11px;border-radius:8px;cursor:pointer}
.rv-bar button[aria-pressed=true]{background:var(--rv-ok);border-color:var(--rv-ok);color:#fff}
.rv-bar button.go,.rv-pan button.go{background:var(--rv-ac);border-color:var(--rv-ac);color:var(--rv-acf)}
.rv-bar button:disabled,.rv-pan button:disabled{opacity:.55;cursor:default}
.rv-bar button:focus-visible,.rv-bar textarea:focus-visible,.rv-pan button:focus-visible,.rv-fab:focus-visible{outline:2px solid var(--rv-ac);outline-offset:2px}
.rv-bar textarea{width:100%;box-sizing:border-box;min-height:54px;margin-top:8px;padding:8px;border:1px solid var(--rv-ln);border-radius:8px;font:14px Inter,system-ui,sans-serif;background:var(--rv-bg);color:var(--rv-fg);resize:vertical}
.rv-st{font-size:12.5px;color:var(--rv-mut)}.rv-st.w{color:var(--rv-warn)}
.rv-out{margin-top:8px;padding:8px 10px;background:var(--rv-soft);border-radius:8px;white-space:pre-wrap;font-size:14px;max-height:320px;overflow:auto}
.rv-fab{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;font:600 14px Inter,system-ui,sans-serif;background:var(--rv-ac);color:var(--rv-acf);border:0;border-radius:999px;padding:11px 18px;cursor:pointer;box-shadow:0 14px 34px rgba(27,20,48,.28)}
.rv-pan{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(64px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:min(460px,calc(100vw - 32px));max-height:min(70vh,640px);overflow:auto;background:var(--rv-bg);color:var(--rv-fg);border:1px solid var(--rv-ln);border-radius:14px;padding:14px;box-shadow:0 14px 34px rgba(27,20,48,.28);font:14px/1.5 Inter,system-ui,sans-serif}
.rv-pan h4{font:600 16px Urbanist,Inter,sans-serif;margin:0 0 8px}.rv-pan .fi{border-top:1px solid var(--rv-ln);padding:10px 0}.rv-pan .fi b{display:block;margin-bottom:4px}
.rv-pan pre{white-space:pre-wrap;font:inherit;margin:0 0 6px;max-height:140px;overflow:auto}
`;
const RULES=`You are revising one marketing draft for Alpha Nodus, which sells Gravity, the Agentic Operations System (AOS), to independent imaging centers in the USA. Not hospitals.
Rules: plain, specific, operator voice. Sentence case, no exclamation marks, no emoji. Say "system", not "platform"; "agentic", not "AI-powered". Keep every fact, number and quote exactly as given. Do not invent statistics, quotes, customers, certifications or claims. Keep placeholders such as {first_name} and links as they are. Keep the same format and roughly the same length unless the comment asks otherwise. Return only the revised text.`;
const S={};let db=null,sample=null,dl=null,cfg={},uid=0,scanTimer=0,panel=null;
const h=s=>{let x=5381;for(const c of s)x=((x<<5)+x+c.charCodeAt(0))|0;return (x>>>0).toString(36)};
function pid(el,txt){const pane=el.closest('[id]');return (cfg.prefix||'i')+'-'+h((pane?pane.id:'')+'|'+txt.slice(0,80))}
function title(el,txt){const t=el.querySelector('.hl,.big,.q,h3,h2');return (cfg.title?cfg.title(el):'')||(t&&t.innerText.trim().slice(0,90))||txt.split('\n').map(x=>x.trim()).find(x=>x.length>3)||'Creative'}
const cur=r=>(S[r]&&S[r].regen)||(S[r]&&S[r].text)||'';
function save(id,p){S[id]=Object.assign({id},S[id],p);if(db)db.doc('review/'+id).set(S[id]).catch(e=>st(id,'Not saved: '+(e.message||e.code),1));updFab()}
function st(id,t,w){document.querySelectorAll('[data-rvst="'+id+'"]').forEach(e=>{e.textContent=t;e.className='rv-st'+(w?' w':'')})}
function bar(el){const txt=(el.innerText||'').replace(/\n{3,}/g,'\n\n').trim();const vis=!!el.querySelector('img,svg,canvas,.bn')||/\b(bn|art|brand|slide|vf)\b/.test(el.className);if(txt.length<(cfg.min||30)&&!vis)return;if(!el.offsetParent&&!el.getClientRects().length)return;
 const id=pid(el,txt);if(el.dataset.rv)return;el.dataset.rv=id;
 const b=document.createElement('div');b.className='rv-t rv-bar';b.dataset.rvbar=id;
 b.innerHTML=`<div class="rv-row"><button class="add" aria-pressed="false">Add to final draft</button><button class="cm">Comment</button><span class="rv-st" data-rvst="${id}"></span></div><div class="rv-box" hidden><textarea placeholder="Leave a comment, e.g. shorter, warmer, mention X, remove Y" aria-label="Comment"></textarea><div class="rv-row" style="margin-top:8px"><button class="go rg">Regenerate with comment</button><button class="rs" hidden>Reset</button></div><div class="rv-out" hidden></div></div>`;
 const par=el.parentElement,pd=par?getComputedStyle(par).display:'block';
 if(/flex|grid/.test(pd)){const cs=getComputedStyle(el),w=document.createElement('div');w.style.cssText='min-width:0;flex:'+cs.flex+';scroll-snap-align:'+(cs.scrollSnapAlign||'none')+(parseFloat(cs.flexGrow)===0?';width:'+el.offsetWidth+'px':'')+';grid-column:'+cs.gridColumnStart+'/'+cs.gridColumnEnd;el.replaceWith(w);w.appendChild(el);w.appendChild(b)}else el.insertAdjacentElement('afterend',b);
 const ta=b.querySelector('textarea'),out=b.querySelector('.rv-out'),add=b.querySelector('.add'),box=b.querySelector('.rv-box'),rg=b.querySelector('.rg'),rs=b.querySelector('.rs');
 b.querySelector('.cm').onclick=()=>{box.hidden=!box.hidden;if(!box.hidden)ta.focus()};
 add.onclick=()=>{const on=!(S[id]&&S[id].inc);save(id,{inc:on,title:title(el,txt),text:txt});sync(id)};
 ta.onchange=()=>save(id,{comment:ta.value,title:title(el,txt),text:txt});
 rs.onclick=()=>{save(id,{regen:''});sync(id)};
 rg.onclick=async()=>{const c=ta.value.trim();if(!c){st(id,'Write a comment first.',1);return}
  if(!sample){st(id,'Regenerate is not available here.',1);return}
  rg.disabled=true;st(id,'Regenerating...');out.hidden=false;out.textContent='';save(id,{comment:c,title:title(el,txt),text:txt});
  try{const r=await sample(`${RULES}\n\nDRAFT:\n${cur(id)||txt}\n\nREVIEWER COMMENT:\n${c}`,{modelTier:'default',cache:false,onText:u=>{out.textContent=u.text}});
   save(id,{regen:r.text.trim()});st(id,'Regenerated. It is used in the final draft if added.');sync(id)}catch(e){st(id,'Could not regenerate: '+(e.message||e.code||'try again'),1)}rg.disabled=false}
 sync(id)}
function sync(id){document.querySelectorAll('[data-rvbar="'+id+'"]').forEach(b=>{const s=S[id]||{},add=b.querySelector('.add'),ta=b.querySelector('textarea'),out=b.querySelector('.rv-out'),rs=b.querySelector('.rs');
 add.setAttribute('aria-pressed',!!s.inc);add.textContent=s.inc?'In final draft':'Add to final draft';b.classList.toggle('in',!!s.inc);
 if(document.activeElement!==ta&&ta.value!==(s.comment||''))ta.value=s.comment||'';
 if(s.regen){out.hidden=false;out.textContent=s.regen;rs.hidden=false;b.querySelector('.rv-box').hidden=false}else{rs.hidden=true;if(!out.textContent)out.hidden=true}});}
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
 if(db){try{db.collection('review').onSnapshot(s=>{s.docs.forEach(d=>{S[d.id]=d.data()});document.querySelectorAll('[data-rvbar]').forEach(b=>sync(b.dataset.rvbar));updFab()})}catch(e){}}}};
})();
