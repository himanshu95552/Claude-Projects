import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,C as n,F as r,L as i,S as a,c as ee,g as o,k as s,l as c,o as l,p as u,s as d,v as f,y as p}from"./react.BKyTRiZ3.mjs";import{a as te,r as m,t as h,w as g}from"./motion.D-Nk57UM.mjs";import{$ as _,A as v,C as y,I as b,X as x,a as S,b as C,c as w,et as ne,i as T,nt as E,o as D,rt as O,st as k,tt as A,y as j}from"./framer.CAQJ1n1h.mjs";import M,{t as N}from"./H1eX16iif0lU2ECraQEyHn7bWaqDXwVYekr9OhvXuCQ.n_LRlIYc.mjs";function re(e,t={}){try{(i.dataLayer=i.dataLayer||[]).push({event:e,...t})}catch{}}function ie(){try{let e=document.cookie.match(/(?:^|; )_gcl_aw=([^;]+)/);return e?decodeURIComponent(e[1]).split(`.`).slice(2).join(`.`)||void 0:new URLSearchParams(location.search).get(`gclid`)||void 0}catch{return}}function ae(){return i===void 0?Promise.reject():i.turnstile?Promise.resolve():(Q||=new Promise((e,t)=>{let n=document.createElement(`script`);n.src=R,n.async=!0,n.onload=()=>e(),n.onerror=()=>{Q=null,t()},document.head.appendChild(n)}),Q)}function P({apiBase:e=I,turnstileSiteKey:t=L}){let[n,r]=o(ce),[a,s]=o({company:``,name:``,title:``,email:``,phone:``}),[u,d]=o({}),[te,m]=o(null),[h,g]=o(`idle`),[_,v]=o(``),[y,b]=o(0),[x,S]=o({ris:``,pacs:``,rcm:``,phone:``,fax:``,text:``,other:``}),[C,w]=o(``),[ne,T]=o(!1),E=p(null),D=p(null),O=p(null),k=p(null),A=p(null),j=p(null);f(()=>b(1),[]),f(()=>{y>=2&&re(`quote_step`,{step:y===2?`systems`:`contact`,volume:n})},[y]),f(()=>{if(y!==3)return;let e=!1;return ae().then(()=>{e||!k.current||A.current!==null||(A.current=i.turnstile.render(k.current,{sitekey:t,callback:e=>m(e),"expired-callback":()=>m(null),"error-callback":e=>{if(m(null),T(!0),String(e).startsWith(`1102`)){let e=A.current;return setTimeout(()=>{try{i.turnstile.remove(e)}catch{}},0),!0}}}))}).catch(()=>T(!0)),()=>{e=!0}},[y,t]);let M=G[de(n)],N=X(n),P=()=>{b(1),document.getElementById(`quote`)?.scrollIntoView({behavior:`smooth`,block:`start`}),setTimeout(()=>E.current?.focus({preventScroll:!0}),500)},R=e=>{b(e),v(``),document.getElementById(`quote`)?.scrollIntoView({behavior:`smooth`,block:`start`}),setTimeout(()=>(e===3?O.current:e===2?D.current:E.current)?.focus({preventScroll:!0}),50)},q=e=>({value:a[e],onChange:t=>{s({...a,[e]:t.target.value}),u[e]&&d({...u,[e]:!1})}});async function J(t){if(t.preventDefault(),C)return g(`done`);let r={company:!a.company.trim(),name:!a.name.trim(),email:!/^\S+@\S+\.\S+$/.test(a.email.trim())};if(d(r),r.company||r.name||r.email)return v(`missing`);if(!te)return v(ne?`error`:`captcha`);v(``),g(`sending`);try{let t=await fetch(e.replace(/\/$/,``)+`/api/sales/quote/request`,{method:`POST`,headers:{"content-type":`application/json`},body:JSON.stringify({company:a.company.trim(),name:a.name.trim(),email:a.email.trim(),title:a.title.trim()||void 0,phone:a.phone.trim()||void 0,volume:n,ris:x.ris.trim()||void 0,pacs:x.pacs.trim()||void 0,rcm:x.rcm.trim()||void 0,phoneSystem:x.phone.trim()||void 0,faxSystem:x.fax.trim()||void 0,textSystem:x.text.trim()||void 0,otherSystems:x.other.trim()||void 0,turnstileToken:te,gclid:ie()})});if(!t.ok)throw Error(String(t.status));g(`done`),re(`generate_lead`,{lead_source:`pricing_quote`,volume:n})}catch{g(`idle`),v(`error`),m(null);try{A.current!==null&&i.turnstile.reset(A.current)}catch{}}}return c(`section`,{className:`app`,"aria-labelledby":`app-h1`,children:[l(`style`,{dangerouslySetInnerHTML:{__html:he+ge}}),l(`header`,{className:`hero`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),z.eyebrow]}),l(`h1`,{id:`app-h1`,children:z.h1}),l(`p`,{className:`lead`,children:z.lead}),c(`div`,{className:`ctas`,children:[c(`div`,{className:`from`,"aria-hidden":`true`,children:[l(`span`,{children:`from`}),l(`b`,{children:`$1,000`}),l(`span`,{children:`a month`})]}),c(`a`,{className:`btn`,href:`#quote`,children:[z.cta,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]})]}),l(`div`,{className:`closer`,role:`presentation`,children:l(`i`,{})})]})}),B.hidden?null:l(`div`,{className:`sec`,role:`region`,"aria-labelledby":`app-plans`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),B.eyebrow]}),l(`h2`,{id:`app-plans`,children:B.h2}),l(`p`,{className:`sub`,children:B.lead}),l(`ul`,{className:`plans`,children:B.items.map((e,t)=>c(`li`,{className:`plan`,children:[c(`div`,{className:`tier`,"aria-hidden":`true`,children:[`0`,t+1,` / 0`,B.items.length]}),l(`h3`,{children:e.name}),l(`p`,{className:`tag`,children:e.tagline}),c(`div`,{className:`price`,"aria-hidden":`true`,children:[l(`span`,{className:`blur`,children:`$0,000`}),l(`small`,{children:`/ month`})]}),l(`p`,{className:`builds`,children:e.builds_on||``}),l(`div`,{className:`bars`,"aria-hidden":`true`,children:Array.from({length:e.features},(e,n)=>l(`div`,{children:l(`i`,{style:{width:me[(t+n)%me.length]+`%`}})},n))}),l(`div`,{className:`lock`,children:l(`button`,{type:`button`,onClick:P,"aria-label":`${B.locked}: ${e.name}`,children:B.locked})})]},e.name))})]})}),l(`div`,{className:`sec`,id:`quote`,role:`region`,"aria-labelledby":`app-quote`,style:{scrollMarginTop:80},children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),V.eyebrow]}),l(`h2`,{id:`app-quote`,children:V.h2}),l(`p`,{className:`sub`,children:V.lead}),l(`ol`,{className:`stepper`,children:[H.step,U.step,W.step].slice(0,y===0?3:y).map((e,t)=>c(`li`,{className:y===t+1?`cur`:y>t+1?`past`:``,"aria-current":y===t+1?`step`:void 0,children:[l(`span`,{children:t+1}),e]},e))}),c(`div`,{className:`quote`,children:[c(`div`,{className:`card`,hidden:y===2||y===3,children:[l(`h3`,{className:`step`,children:H.step}),c(`div`,{className:`vol`,children:[c(`div`,{children:[l(`div`,{className:`lbl`,id:`app-vol-lbl`,children:H.label}),c(`div`,{className:`num`,"aria-live":`polite`,children:[Z(n),l(`small`,{children:H.per_month})]}),c(`div`,{className:`yr`,children:[`about `,Z(n*12),` `,H.per_year]}),c(`div`,{className:`band`,children:[M.label,` · `,M.range]}),c(`div`,{className:`track`,children:[l(`div`,{className:`rail`}),G.slice(0,-1).map(e=>l(`div`,{className:`edge`,style:{left:X(e.to)+`%`}},e.key)),l(`div`,{className:`fill`,style:{width:N+`%`}}),l(`input`,{ref:E,type:`range`,min:0,max:1e3,step:1,value:Y(n),onChange:e=>r(ue(+e.target.value)),"aria-labelledby":`app-vol-lbl`,"aria-valuetext":`${Z(n)} ${H.per_month}, ${M.label}`}),l(`div`,{className:`knob`,style:{left:N+`%`}}),l(`div`,{className:`bubble`,style:{left:N+`%`},"aria-hidden":`true`,children:fe(n)})]}),l(`div`,{className:`ticks`,"aria-hidden":`true`,children:pe.map(e=>l(`span`,{style:{left:X(e)+`%`},children:fe(e)},e))}),l(`p`,{className:`hint`,children:H.hint})]}),l(`ul`,{className:`bands`,children:G.map((e,t)=>{let i=t?G[t-1].to:K;return l(`li`,{className:t===de(n)?`on`:``,children:c(`button`,{type:`button`,onClick:()=>r(ue(Math.round((Y(i)+Y(e.to))/2))),children:[l(`b`,{children:e.label}),l(`em`,{children:e.range})]})},e.key)})})]}),y===0?null:l(`div`,{className:`next`,children:c(`button`,{className:`btn`,type:`button`,onClick:()=>R(2),children:[V.next_systems,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]})})]}),c(`div`,{className:`card`,hidden:y===1||y===3,children:[c(`h3`,{className:`step`,ref:D,tabIndex:-1,children:[U.step,` `,l(`span`,{className:`opt`,children:U.optional})]}),l(`p`,{className:`cardlead`,children:U.lead}),c(`div`,{className:`grid3`,children:[se.map(e=>c(`div`,{children:[l(`label`,{className:`f`,htmlFor:`app-sys-`+e,children:U[e]}),l(`input`,{id:`app-sys-`+e,className:`t`,type:`text`,maxLength:200,value:x[e],onChange:t=>S({...x,[e]:t.target.value})})]},e)),c(`div`,{className:`full`,children:[l(`label`,{className:`f`,htmlFor:`app-sys-other`,children:U.other}),l(`textarea`,{id:`app-sys-other`,className:`t`,rows:3,maxLength:1e3,value:x.other,onChange:e=>S({...x,other:e.target.value})})]})]}),y===0?null:c(`div`,{className:`next`,children:[l(`button`,{type:`button`,className:`quiet`,onClick:()=>R(3),children:U.skip}),c(`button`,{className:`btn`,type:`button`,onClick:()=>R(3),children:[V.next,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]})]})]}),l(`div`,{className:`card`,hidden:y===1||y===2,children:h===`done`?c(`div`,{className:`done`,role:`status`,children:[l(`div`,{className:`tick`,children:l(`svg`,{width:`26`,height:`26`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`3`,"aria-hidden":`true`,children:l(`path`,{d:`M5 12l5 5 9-10`})})}),l(`h3`,{children:V.done_title}),l(`p`,{children:V.done_body})]}):c(`form`,{onSubmit:J,noValidate:!0,children:[l(`h3`,{className:`step`,ref:O,tabIndex:-1,children:W.step}),l(`p`,{className:`cardlead`,children:W.lead}),y===0?null:c(`div`,{className:`chosen`,children:[c(`span`,{children:[c(`b`,{children:[Z(n),` `,H.per_month]}),` · `,M.label]}),l(`button`,{type:`button`,className:`quiet`,onClick:()=>R(1),children:V.back})]}),c(`p`,{className:`reqnote`,children:[l(`span`,{className:`req`,"aria-hidden":`true`,children:`* `}),W.required]}),c(`div`,{className:`grid`,children:[c(`div`,{className:`full`,children:[c(`label`,{className:`f`,htmlFor:`app-company`,children:[W.company,` `,l(`span`,{className:`req`,"aria-hidden":`true`,children:`*`})]}),l(`input`,{ref:j,id:`app-company`,className:`t`+(u.company?` bad`:``),type:`text`,autoComplete:`organization`,required:!0,"aria-invalid":!!u.company,...q(`company`)})]}),c(`div`,{children:[c(`label`,{className:`f`,htmlFor:`app-name`,children:[W.name,` `,l(`span`,{className:`req`,"aria-hidden":`true`,children:`*`})]}),l(`input`,{id:`app-name`,className:`t`+(u.name?` bad`:``),type:`text`,autoComplete:`name`,required:!0,"aria-invalid":!!u.name,...q(`name`)})]}),c(`div`,{children:[l(`label`,{className:`f`,htmlFor:`app-title`,children:W.title}),l(`input`,{id:`app-title`,className:`t`,type:`text`,autoComplete:`organization-title`,...q(`title`)})]}),c(`div`,{children:[c(`label`,{className:`f`,htmlFor:`app-email`,children:[W.email,` `,l(`span`,{className:`req`,"aria-hidden":`true`,children:`*`})]}),l(`input`,{id:`app-email`,className:`t`+(u.email?` bad`:``),type:`email`,autoComplete:`email`,required:!0,"aria-invalid":!!u.email,...q(`email`)})]}),c(`div`,{children:[l(`label`,{className:`f`,htmlFor:`app-phone`,children:W.phone}),l(`input`,{id:`app-phone`,className:`t`,type:`tel`,autoComplete:`tel`,...q(`phone`)})]})]}),l(`div`,{className:`hp`,"aria-hidden":`true`,children:l(`input`,{type:`text`,name:`website`,tabIndex:-1,autoComplete:`off`,value:C,onChange:e=>w(e.target.value)})}),l(`div`,{className:`captcha`,ref:k}),_?c(`p`,{className:`msg`,role:`alert`,children:[_===`missing`?V.missing:_===`captcha`?V.captcha:V.error,_===`error`?c(ee,{children:[` `,l(`a`,{href:oe,target:`_blank`,rel:`noopener`,children:V.error_link})]}):null]}):null,c(`div`,{className:`send`,children:[l(`p`,{children:V.privacy}),l(`button`,{className:`btn`,type:`submit`,disabled:h===`sending`,children:h===`sending`?V.sending:V.submit})]})]})})]})]})}),l(`div`,{className:`sec faq-s`,role:`region`,"aria-labelledby":`app-faq`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),F.faq.eyebrow]}),l(`h2`,{id:`app-faq`,children:F.faq.h2}),l(`div`,{className:`faq`,children:F.faq.items.map(e=>c(`div`,{children:[l(`h3`,{children:e.q}),l(`p`,{children:e.a}),e.link?l(`p`,{children:l(`a`,{href:e.link.href,children:e.link.label})}):null]},e.q))})]})}),l(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:F.jsonLd.replace(/</g,`\\u003c`)}})]})}var F,I,L,oe,R,z,B,V,H,U,W,se,G,K,q,J,ce,le,ue,Y,X,de,Z,fe,pe,me,he,ge,Q,_e=e((()=>{r(),d(),n(),b(),F={faq:{eyebrow:`Questions`,h2:`Questions about pricing`,items:[{q:`How much does Gravity cost?`,a:`Plans start as low as $1,000 a month. Your price depends on the plan you choose and your monthly exam volume.`},{q:`How does Gravity work with our RIS, PACS and RCM?`,a:`It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.`},{q:`How is our data protected?`,a:`Hosted on AWS in US regions only. A HIPAA Business Associate Agreement with every customer. Every sub-processor used in Gravity has a BAA with Alpha Nodus. Independently penetration-tested every year. Data encrypted at rest with per-tenant keys. MFA on every production login, SSO on Enterprise. Controls monitored continuously, with a public Trust Center.`,link:{label:`Trust Center`,href:`https://security.alphanodus.com`}},{q:`Can we see Gravity first?`,a:`Yes. Book a 30-minute demo and we’ll spend the time on your operation.`,link:{label:`Book a demo`,href:`/demo`}}]},jsonLd:`{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://alphanodus.com/#organization","name":"Alpha Nodus","legalName":"Alpha Nodus, Inc.","url":"https://alphanodus.com","logo":{"@type":"ImageObject","url":"https://framerusercontent.com/images/KV366RXtaJtF1GTYRPMyVeBkMQ.png","width":180,"height":180},"description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","foundingDate":"2015","founder":{"@type":"Person","@id":"https://alphanodus.com/company#shamit-patel","name":"Shamit Patel"},"address":{"@type":"PostalAddress","streetAddress":"1351 Sawgrass Corporate Parkway, Suite 104","addressLocality":"Sunrise","addressRegion":"FL","postalCode":"33323","addressCountry":"US"},"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+18886257420","email":"info@alphanodus.com","areaServed":"US"},"sameAs":["https://www.linkedin.com/company/alphanodus","https://www.youtube.com/@AlphaNodus","https://x.com/alphanodus","https://www.instagram.com/alphanodus/","https://www.facebook.com/AlphaNodus/"],"brand":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"WebSite","@id":"https://alphanodus.com/#website","url":"https://alphanodus.com","name":"Alpha Nodus","publisher":{"@id":"https://alphanodus.com/#organization"},"inLanguage":"en-US"},{"@type":"SoftwareApplication","@id":"https://alphanodus.com/#gravity","name":"Gravity","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","publisher":{"@id":"https://alphanodus.com/#organization"}},{"@type":"WebPage","@id":"https://alphanodus.com/pricing","url":"https://alphanodus.com/pricing","name":"Gravity Pricing: Plans for Imaging Centers","description":"Gravity plans for imaging centers start as low as $1,000 a month. Set your monthly exam volume and get your price.","inLanguage":"en-US","isPartOf":{"@id":"https://alphanodus.com/#website"},"publisher":{"@id":"https://alphanodus.com/#organization"},"dateModified":"2026-10-13","about":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"FAQPage","@id":"https://alphanodus.com/pricing#faq","mainEntity":[{"@type":"Question","name":"How much does Gravity cost?","acceptedAnswer":{"@type":"Answer","text":"Plans start as low as $1,000 a month. Your price depends on the plan you choose and your monthly exam volume."}},{"@type":"Question","name":"How does Gravity work with our RIS, PACS and RCM?","acceptedAnswer":{"@type":"Answer","text":"It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away."}},{"@type":"Question","name":"How is our data protected?","acceptedAnswer":{"@type":"Answer","text":"Hosted on AWS in US regions only. A HIPAA Business Associate Agreement with every customer. Every sub-processor used in Gravity has a BAA with Alpha Nodus. Independently penetration-tested every year. Data encrypted at rest with per-tenant keys. MFA on every production login, SSO on Enterprise. Controls monitored continuously, with a public Trust Center."}},{"@type":"Question","name":"Can we see Gravity first?","acceptedAnswer":{"@type":"Answer","text":"Yes. Book a 30-minute demo and we’ll spend the time on your operation."}}]}]}`,hero:{eyebrow:`Pricing`,h1:`Pricing that follows the order.`,lead:`Plans start as low as $1,000 a month. Your price follows your plan and your exam volume.`,cta:`Get your price`},plans:{hidden:!0,eyebrow:`2027 plans`,h2:`Five plans. Each one builds on the last.`,lead:`Your price and each plan’s full feature list follow your volume. Start with yours below.`,locked:`Get the feature list`,items:[{name:`Essential`,tagline:`Get started.`,features:4},{name:`Professional`,tagline:`Amplify your cash flow.`,builds_on:`Everything in Essential, plus`,features:4},{name:`Ultimate`,tagline:`Conquer your denials.`,builds_on:`Everything in Professional, plus`,features:4},{name:`Quantum`,tagline:`Accelerate your patient flow.`,builds_on:`Everything in Ultimate, plus`,features:4},{name:`Singularity`,tagline:`Reimagine everything.`,builds_on:`Everything in Quantum, plus`,features:3}]},quote:{eyebrow:`Your price`,h2:`Get your price`,lead:`Start with your monthly exam volume.`,volume:{step:`Your volume`,label:`Monthly exam volume`,per_month:`exams a month`,per_year:`a year`,hint:`Drag to set your volume. The scale widens as it goes: fine steps for one center, larger ones for a group.`,bands:[{key:`one_center`,label:`One center`,range:`Up to 1,000`,from:1,to:1e3},{key:`small_medium`,label:`Small and medium`,range:`1,001 to 5,000`,from:1001,to:5e3},{key:`mid_market`,label:`Mid-market`,range:`5,001 to 20,000`,from:5001,to:2e4},{key:`large_enterprise`,label:`Large enterprise`,range:`20,001 to 50,000`,from:20001,to:5e4},{key:`strategic`,label:`Strategic`,range:`More than 50,000`,from:50001,to:1e5}]},systems:{step:`Your systems`,optional:`Optional`,lead:`Tell us what you run today, so your price fits around it. Fill in what you know and skip the rest.`,ris:`RIS`,pacs:`PACS`,rcm:`Billing or RCM`,phone:`Phone system`,fax:`Fax`,text:`Text messaging`,other:`Anything else we should know about`,skip:`Skip this step`},contact:{step:`Where should we send your price?`,lead:`We put every price together for the operation it’s for, so we email yours.`,company:`Company`,name:`Your name`,title:`Title`,email:`Work email`,phone:`Phone`,required:`Required`},next_systems:`Next: your systems`,next:`Next: how to reach you`,back:`Change volume`,submit:`Send me my price`,privacy:`We use these details only to send your price and follow up on it.`,sending:`Sending…`,missing:`Add your company, your name and a work email.`,captcha:`Please complete the check above, then send again.`,done_title:`Thanks. Your price is on its way.`,done_body:`We’re putting it together for your operation and will email it to you.`,error:`That didn’t go through. Try again, or use our quote form.`,error_link:`Open the quote form`}},I=`https://tools.alphanodus.com`,L=`0x4AAAAAADXZWR9OwwfaW_MO`,oe=`https://tools.alphanodus.com/sales/quote/request`,R=`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`,z=F.hero,B=F.plans,V=F.quote,H=V.volume,U=V.systems,W=V.contact,se=[`ris`,`pacs`,`rcm`,`phone`,`fax`,`text`],G=H.bands,K=1e3,q=1e5,J=Math.log(q/K),ce=2e4,le=e=>e<5e3?100:e<2e4?500:e<5e4?1e3:5e3,ue=e=>{let t=K*Math.exp(J*e/1e3),n=le(t);return Math.min(q,Math.max(K,Math.round(t/n)*n))},Y=e=>Math.round(1e3*Math.log(e/K)/J),X=e=>100*Math.log(e/K)/J,de=e=>Math.max(0,G.findIndex(t=>e<=t.to)),Z=e=>e.toLocaleString(`en-US`),fe=e=>e>=1e3?String(+(e/1e3).toFixed(1))+`k`:String(e),pe=[1e3,5e3,2e4,5e4,1e5],me=[78,62,86,54,70,66],he=`/* ============================================================
   Alpha Nodus brand tokens · v2.0 · September 2026
   One system, two surfaces. Corporate surfaces use these directly;
   the Gravity product maps them onto --gravity-color-* (see §11).
   Raw hex appears in this file and nowhere else.
   ============================================================ */
:root {
  /* ---------- Primary: Plum ---------- */
  --an-plum-50:  #F3EEFE;   /* tint: callouts, highlighted rows, tag backgrounds */
  --an-plum-100: #E7DDFC;   /* strong tint: selected rows, chip backgrounds */
  --an-plum-200: #CDB9F8;   /* data series 3 */
  --an-plum-300: #C9B3FF;   /* THE ACCENT ON INK: 9.6:1 on --an-ink */
  --an-plum-400: #8E67EA;   /* data series 2; never text */
  --an-plum-500: #7B4FE6;   /* reserved */
  --an-plum-600: #6B3FE4;   /* PRIMARY: fills, buttons, node. White text 6.1:1 */
  --an-plum-700: #5B2FD1;   /* hover; accent as TEXT on paper 6.9:1 (7.6:1 on white) */
  --an-plum-800: #4A25AD;   /* pressed; emphasis text 9.7:1 on white */
  --an-plum-900: #3A1C86;   /* deepest; rare */

  --an-primary:       var(--an-plum-600);
  --an-primary-hover: var(--an-plum-700);
  --an-primary-press: var(--an-plum-800);
  --an-primary-text:  var(--an-plum-700);
  --an-on-ink:        var(--an-plum-300);  /* the accent switches to this on any ink surface */
  --an-link:          var(--an-plum-700);
  --an-link-hover:    var(--an-plum-800);
  --an-focus:         var(--an-plum-600);

  /* ---------- Ink and paper ---------- */
  --an-ink:        #1B1430;   /* plum-black. The ONLY dark field. Booth, hero band, dark cards */
  --an-ink-raised: #2A2050;   /* cards sitting inside an ink field */
  --an-paper:      #F6F4FA;   /* page canvas, tinted a hair toward plum */
  --an-surface:    #FFFFFF;   /* cards, nav, content */
  --an-surface-muted: #F8FAFC;/* alternating sections, table headers (shared with product) */
  --an-border:        #E5E7EB;/* dividers, inputs (shared with product) */
  --an-border-strong: #CBD5E1;/* secondary buttons, input hover (shared with product) */
  --an-border-on-ink: rgba(255,255,255,.18);

  /* ---------- Text (shared with product) ---------- */
  --an-text:               #0F172A;   /* headings, values          16.4:1 on paper */
  --an-text-secondary:     #334155;   /* body                        9.5:1 on paper */
  --an-text-tertiary:      #64748B;   /* labels ON WHITE only        4.8:1 */
  --an-text-tertiary-alt:  #5B6878;   /* labels on paper             5.2:1 */
  --an-text-muted:         #94A3B8;   /* decorative only, never for meaning */
  --an-text-on-ink:        #FFFFFF;   /* on --an-ink                17.7:1 */
  --an-text-on-ink-muted:  #B4A8D6;   /* on --an-ink ONLY            8.0:1 */

  /* ---------- Outcome: Lagoon (data, deck and one line on ink) ---------- */
  --an-outcome:        #22C1CE;   /* the one "it landed / it got paid" mark. Ink text on it 8.1:1, never white */
  --an-outcome-text:   #0B6E78;   /* Lagoon as type on paper 5.5:1 (6.0:1 on white) */
  --an-outcome-tint:   #DDF6F8;   /* outcome pill background */
  --an-outcome-on-ink: #67E3EE;   /* the outcome on the ink field 11.6:1 */

  /* ---------- Status (identical to the Gravity product) ---------- */
  --an-success: #10B981; --an-success-bg: #ECFDF5; --an-success-text: #047857;
  --an-warning: #F59E0B; --an-warning-bg: #FFFBEB; --an-warning-text: #B45309;
  --an-danger:  #EF4444; --an-danger-bg:  #FEF2F2; --an-danger-text:  #B91C1C;
  --an-info-bg: #F1F5F9; --an-info-text:  #334155;

  /* ---------- Data series (in order) ---------- */
  --an-series-1: var(--an-plum-600);
  --an-series-2: var(--an-plum-400);
  --an-series-3: var(--an-plum-200);
  --an-series-4: #64748B;
  --an-series-highlight: var(--an-outcome);
  --an-series-highlight-on-ink: var(--an-outcome-on-ink);
  --an-series-1-on-ink: var(--an-plum-300);
  --an-series-2-on-ink: #8E86B8;
  --an-series-3-on-ink: #4A4270;
  --an-grid: var(--an-border);

  /* ---------- Type ---------- */
  --an-font-display: 'Urbanist', 'Avenir Next', 'Century Gothic', system-ui, sans-serif;
  --an-font:         'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --an-font-mono:    'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* size / line-height / weight / tracking */
  --an-display: 600 56px/1.04 var(--an-font-display);  --an-display-tracking: -.025em;
  --an-h1:      600 40px/1.1  var(--an-font-display);  --an-h1-tracking: -.02em;
  --an-h2:      600 30px/1.16 var(--an-font-display);  --an-h2-tracking: -.015em;
  --an-h3:      600 20px/1.3  var(--an-font-display);  --an-h3-tracking: -.01em;
  --an-lead:    400 19px/1.6  var(--an-font);
  --an-body:    400 16px/1.65 var(--an-font);
  --an-small:   400 14px/1.6  var(--an-font);
  --an-caption: 400 13px/1.5  var(--an-font);
  --an-eyebrow: 600 11px/1.4  var(--an-font-mono);     --an-eyebrow-tracking: .14em;   /* the only all-caps */

  /* ---------- The device: line and node ---------- */
  --an-node-eyebrow: 7px;   /* eyebrow marker */
  --an-node-list:    9px;   /* list marker, chart endpoint */
  --an-node-hero:   14px;   /* hero, section closer */
  --an-node-booth:  26px;   /* booth panel, one per panel */
  --an-hairline:    1px solid var(--an-border);
  --an-hairline-on-ink: 1px solid rgba(255,255,255,.35);

  /* ---------- Layout ---------- */
  --an-container: 1200px;  --an-gutter: 32px;
  --an-space-1: 4px;  --an-space-2: 8px;  --an-space-3: 12px; --an-space-4: 16px;
  --an-space-5: 20px; --an-space-6: 24px; --an-space-8: 32px; --an-space-10: 40px;
  --an-space-12: 48px; --an-space-16: 64px; --an-space-20: 80px; --an-space-24: 96px;
  --an-radius-sm: 6px;  --an-radius-md: 8px;  --an-radius-lg: 14px;  --an-radius-xl: 20px;  --an-radius-full: 999px;

  --an-shadow-sm: 0 1px 3px  rgba(27,20,48,.06);
  --an-shadow-md: 0 4px 12px rgba(27,20,48,.08);
  --an-shadow-lg: 0 14px 34px rgba(27,20,48,.16);

  --an-ease: cubic-bezier(.4,0,.2,1);
  --an-duration-fast: 120ms;  --an-duration-base: 200ms;  --an-duration-slow: 360ms;
}

/* ============================================================
   The ten rules (also in the guidelines, §9)
   1  The logo is black or white. Never recoloured, never on a gradient.
   2  One accent per surface, at full strength. Quiet = tint, never a faded accent.
   3  No gradients as colour. Anywhere. Including product buttons.
   4  On ink, the accent is --an-on-ink. --an-plum-600 on ink is 2.9:1 and forbidden.
   5  Accent as text is --an-plum-700; --an-plum-600 is for fills.
   6  Lagoon is an outcome, never a status. Once per surface, never a field on the web,
      never a pill or dot beside a success pill: shape and size keep it apart from green.
   7  On ink, hierarchy comes from weight and size, never opacity.
   8  One node per surface as a graphic. It never pulses and never becomes a network.
   9  Status colours mean the same thing on the website and in the product.
   10 Retired and never used: the arc, orange, magenta, hospital blue, agent colours.
   ============================================================ */
`,ge=`
.app{width:100%;background:var(--an-paper);color:var(--an-text);font:var(--an-body);-webkit-font-smoothing:antialiased;container-type:inline-size;container-name:app}
.app *{box-sizing:border-box}
.app :focus-visible{outline:2px solid var(--an-focus);outline-offset:2px}
.app .wrap{max-width:var(--an-container);margin:0 auto;padding:0 var(--an-gutter)}
@container app (max-width:809.98px){.app .wrap{padding:0 var(--an-space-4)}}
/* Eyebrow: a 22px hairline ending in a 7px node, then the label (src/components/Eyebrow.tsx). */
.app .eyebrow{display:flex;align-items:center;gap:var(--an-space-2);font:var(--an-eyebrow);letter-spacing:var(--an-eyebrow-tracking);text-transform:uppercase;color:var(--an-primary-text);margin:0 0 18px}
.app .eyebrow::before{content:"";flex:none;width:22px;border-top:var(--an-hairline)}
.app .eyebrow i{flex:none;width:var(--an-node-eyebrow);height:var(--an-node-eyebrow);border-radius:50%;background:var(--an-primary);margin-left:-8px}
.app .hero .eyebrow{color:var(--an-on-ink)}
.app .hero .eyebrow::before{border-top:var(--an-hairline-on-ink)}
.app .hero .eyebrow i{background:var(--an-on-ink)}
/* The one ink band on the page. On ink every text element is solid white or the one muted tone, and the accent is Plum 300. */
.app .hero{background:var(--an-ink);color:var(--an-text-on-ink);padding:clamp(56px,8vw,112px) 0 clamp(48px,6vw,80px)}
.app h1{font:600 clamp(36px,5vw,56px)/1.04 var(--an-font-display);letter-spacing:var(--an-display-tracking);margin:0;max-width:16ch;text-wrap:balance}
.app .hero .lead{font:var(--an-lead);color:var(--an-text-on-ink);margin:22px 0 0;max-width:46ch}
.app .ctas{display:flex;flex-wrap:wrap;align-items:center;gap:var(--an-space-4);margin-top:28px}
.app .from{display:inline-flex;align-items:baseline;gap:10px;padding:12px 18px;border-radius:var(--an-radius-lg);background:var(--an-ink-raised)}
.app .from b{font:600 28px/1 var(--an-font-mono);font-variant-numeric:tabular-nums;color:var(--an-text-on-ink)}
.app .from span{font:var(--an-small);color:var(--an-text-on-ink-muted)}
.app .btn{display:inline-flex;align-items:center;gap:6px;min-height:44px;border:1.5px solid transparent;border-radius:var(--an-radius-md);background:var(--an-primary);color:var(--an-surface);font:600 15px/1.2 var(--an-font);padding:12px 22px;cursor:pointer;text-decoration:none;transition:background-color var(--an-duration-fast) var(--an-ease),transform var(--an-duration-fast) var(--an-ease),box-shadow var(--an-duration-fast) var(--an-ease)}
.app .btn:hover:not([disabled]){background:var(--an-primary-hover);transform:translateY(-1px);box-shadow:var(--an-shadow-sm)}
.app .btn:active:not([disabled]){background:var(--an-primary-press);transform:none;box-shadow:none}
.app .btn[disabled]{opacity:.5;cursor:not-allowed}
.app .hero .btn{background:var(--an-on-ink);color:var(--an-ink)}
.app .hero .btn:hover{background:var(--an-plum-200)}
.app .hero .btn:focus-visible{outline-color:var(--an-on-ink)}
/* Hero rule: a full-width hairline ending in one 14px node (src/components/Closer.tsx), on ink. */
.app .closer{display:flex;align-items:center;margin-top:clamp(40px,5vw,64px)}
.app .closer::before{content:"";flex:1;border-top:var(--an-hairline-on-ink)}
.app .closer i{flex:none;width:var(--an-node-hero);height:var(--an-node-hero);border-radius:50%;background:var(--an-on-ink)}
.app .sec{padding:clamp(56px,7vw,96px) 0 0}
.app h2{font:600 clamp(26px,3vw,30px)/1.16 var(--an-font-display);letter-spacing:var(--an-h2-tracking);margin:0;text-wrap:balance}
.app .sub{font:var(--an-body);font-size:17px;color:var(--an-text-secondary);margin:12px 0 0;max-width:62ch}
.app .plans{list-style:none;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--an-space-4);margin:36px 0 0}
@container app (max-width:1100px){.app .plans{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container app (max-width:700px){.app .plans{grid-template-columns:1fr}}
.app .plan{background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-lg);padding:22px 20px 20px;display:flex;flex-direction:column;min-height:330px;transition:transform var(--an-duration-base) var(--an-ease),box-shadow var(--an-duration-base) var(--an-ease),border-color var(--an-duration-base) var(--an-ease)}
.app .plan:hover{transform:translateY(-1px);box-shadow:var(--an-shadow-sm)}
.app .plan .tier{font:500 12px/1 var(--an-font-mono);color:var(--an-text-tertiary)}
.app .plan h3{font:var(--an-h3);font-size:24px;letter-spacing:var(--an-h3-tracking);margin:10px 0 6px}
.app .plan .tag{font:var(--an-small);font-size:15px;color:var(--an-text-secondary);margin:0;min-height:48px}
/* The held-back price and features: neutral marks under a blur, never the real text (owner, 12 Oct 2026; a listed brand deviation). */
.app .plan .price{margin:16px 0 14px;padding:12px 0;border-top:var(--an-hairline);border-bottom:var(--an-hairline);display:flex;align-items:center;gap:var(--an-space-2)}
.app .plan .price .blur{filter:blur(7px);font:600 24px/1 var(--an-font-mono);color:var(--an-text);user-select:none}
.app .plan .price small{font:var(--an-caption);color:var(--an-text-tertiary)}
.app .plan .builds{font:var(--an-caption);font-weight:600;color:var(--an-text);margin:0 0 10px;min-height:20px}
.app .plan .bars{display:grid;gap:11px;filter:blur(4px);user-select:none;pointer-events:none}
.app .plan .bars div{display:flex;gap:10px;align-items:center}
.app .plan .bars div::before{content:"";flex:none;width:var(--an-node-list);height:var(--an-node-list);border-radius:50%;background:var(--an-text-muted)}
.app .plan .bars i{display:block;height:10px;border-radius:var(--an-radius-sm);background:var(--an-border)}
.app .plan .lock{margin-top:auto;padding-top:18px}
.app .plan .lock button{width:100%;min-height:44px;border:1.5px solid var(--an-border-strong);background:var(--an-surface);color:var(--an-text);border-radius:var(--an-radius-md);padding:10px 12px;font:600 14px/1.25 var(--an-font);cursor:pointer;transition:transform var(--an-duration-fast) var(--an-ease),box-shadow var(--an-duration-fast) var(--an-ease)}
.app .plan .lock button:hover{transform:translateY(-1px);box-shadow:var(--an-shadow-sm)}
/* One step at a time. The stepper: nodes on a hairline track, the current step ringed in Plum 100 (src/components/Stepper.tsx). */
.app .stepper{list-style:none;display:flex;align-items:center;gap:var(--an-space-3);margin:var(--an-space-8) 0 var(--an-space-4);padding:0}
.app .stepper li{display:flex;align-items:center;gap:var(--an-space-2);font:600 14px/1.3 var(--an-font);color:var(--an-text-tertiary-alt)}
.app .stepper li+li::before{content:"";width:clamp(24px,8vw,64px);border-top:var(--an-hairline);border-color:var(--an-border-strong);margin-right:var(--an-space-1)}
.app .stepper span{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid var(--an-border-strong);background:var(--an-surface);font:600 12px/1 var(--an-font-mono)}
.app .stepper .cur{color:var(--an-text)}
.app .stepper .cur span{border-color:var(--an-primary);background:var(--an-plum-50);color:var(--an-primary-text);box-shadow:0 0 0 3px var(--an-plum-100)}
.app .stepper .past span{border-color:var(--an-plum-100);background:var(--an-plum-50);color:var(--an-primary-text)}
.app .quote{display:grid;gap:var(--an-space-6)}
/* Full width (owner, 12 Oct 2026): step 1 sets the scale beside the band list; they stack when the card is narrow. */
.app .vol{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--an-space-12);align-items:start}
@container app (max-width:900px){.app .vol{grid-template-columns:1fr;gap:0}}
.app .vol .bands{margin-top:0}
@container app (max-width:900px){.app .vol .bands{margin-top:22px}}
.app .card[hidden]{display:none}
.app .next{display:flex;justify-content:flex-end;align-items:center;gap:var(--an-space-4);margin-top:var(--an-space-6);padding-top:20px;border-top:var(--an-hairline)}
.app .chosen{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--an-space-2);margin:0 0 var(--an-space-5);padding:10px 14px;border-radius:var(--an-radius-md);background:var(--an-plum-50);font:var(--an-small);color:var(--an-text-secondary)}
.app .chosen b{font-weight:600;color:var(--an-text)}
.app .quiet{min-height:44px;border:0;background:none;padding:0 6px;font:600 14px/1 var(--an-font);color:var(--an-link);cursor:pointer}
.app .quiet:hover{color:var(--an-link-hover);text-decoration:underline;text-underline-offset:3px}
.app .step:focus{outline:none}
.app .step .opt{margin-left:var(--an-space-2);font:var(--an-caption);letter-spacing:0;color:var(--an-text-tertiary)}
.app .cardlead{margin:-8px 0 var(--an-space-5);font:var(--an-small);color:var(--an-text-secondary);max-width:62ch}
.app .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--an-space-4)}
.app .grid3 .full{grid-column:1/-1}
@container app (max-width:900px){.app .grid3{grid-template-columns:1fr 1fr}}
@container app (max-width:560px){.app .grid3{grid-template-columns:1fr}}
.app textarea.t{display:block;resize:vertical;min-height:88px}
.app .hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.app .card{position:relative;background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-lg);padding:clamp(18px,2.6vw,28px)}
.app .step{margin:0 0 18px;font:var(--an-h3);letter-spacing:var(--an-h3-tracking)}
.app .lbl,.app label.f,.app legend{display:block;font:600 14px/1.4 var(--an-font);color:var(--an-text);margin:0 0 6px;padding:0}
.app .num{font:600 clamp(40px,5vw,52px)/1 var(--an-font-mono);font-variant-numeric:tabular-nums;letter-spacing:-.02em;margin:8px 0 2px}
.app .num small{font:var(--an-body);color:var(--an-text-tertiary);letter-spacing:0;margin-left:var(--an-space-2)}
.app .yr{font:500 14px/1.4 var(--an-font-mono);color:var(--an-text-tertiary)}
.app .band{display:inline-flex;margin-top:14px;background:var(--an-plum-50);color:var(--an-primary-text);border-radius:var(--an-radius-sm);padding:6px 10px;font:600 13px/1.3 var(--an-font)}
.app .track{position:relative;margin:34px 6px 8px;height:44px}
.app .track input{position:absolute;inset:0;width:100%;height:44px;margin:0;opacity:0;cursor:grab;z-index:3}
.app .track .rail,.app .track .fill{position:absolute;top:19px;height:6px;border-radius:var(--an-radius-sm)}
.app .track .rail{left:0;right:0;background:var(--an-border)}
.app .track .fill{left:0;background:var(--an-primary)}
.app .track .edge{position:absolute;top:14px;height:16px;border-left:var(--an-hairline);border-color:var(--an-border-strong)}
.app .track .knob{position:absolute;top:10px;width:24px;height:24px;margin-left:-12px;border-radius:50%;background:var(--an-surface);border:3px solid var(--an-primary);box-shadow:var(--an-shadow-md)}
.app .track input:focus-visible~.knob{outline:2px solid var(--an-focus);outline-offset:3px}
.app .track .bubble{position:absolute;top:-16px;transform:translateX(-50%);background:var(--an-ink);color:var(--an-text-on-ink);font:600 11px/1 var(--an-font-mono);padding:5px 7px;border-radius:var(--an-radius-sm);white-space:nowrap}
.app .ticks{position:relative;height:18px;margin:0 6px;font:500 11px/1 var(--an-font-mono);color:var(--an-text-tertiary)}
.app .ticks span{position:absolute;transform:translateX(-50%)}
.app .ticks span:first-child{transform:none}.app .ticks span:last-child{transform:translateX(-100%)}
.app .hint{font:var(--an-caption);color:var(--an-text-tertiary);margin:14px 0 0}
.app .bands{list-style:none;margin:22px 0 0;padding:0;display:grid;gap:var(--an-space-1)}
.app .bands button{width:100%;min-height:44px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:var(--an-space-2);padding:8px 12px;border:0;border-radius:var(--an-radius-md);background:transparent;font:var(--an-small);color:var(--an-text-secondary);cursor:pointer;text-align:left}
.app .bands b{font-weight:600;color:var(--an-text)}
.app .bands em{font:500 12px/1.6 var(--an-font-mono);font-style:normal;color:var(--an-text-tertiary)}
.app .bands .on button{background:var(--an-plum-50)}
.app .bands button:hover{background:var(--an-surface-muted)}
.app .grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--an-space-4)}
.app .grid .full{grid-column:1/-1}
@container app (max-width:560px){.app .grid{grid-template-columns:1fr}}
.app .req{color:var(--an-primary-text)}
.app .reqnote{margin:0 0 var(--an-space-4);font:var(--an-caption);color:var(--an-text-tertiary)}
.app .t{width:100%;min-height:44px;font:var(--an-body);padding:10px 14px;border:1px solid var(--an-border);border-radius:var(--an-radius-md);background:var(--an-surface);color:var(--an-text)}
.app .t:hover{border-color:var(--an-border-strong)}
.app .t:focus{outline:2px solid var(--an-focus);outline-offset:2px;border-color:var(--an-border-strong)}
.app .t.bad{border-color:var(--an-danger);background:var(--an-danger-bg)}
.app fieldset{border:0;margin:0;padding:0;min-width:0}
.app .chips{display:flex;flex-wrap:wrap;gap:var(--an-space-2)}
.app .chips label{min-height:44px;font:500 14px/1 var(--an-font);color:var(--an-text-secondary);border:1px solid var(--an-border-strong);border-radius:var(--an-radius-md);padding:0 14px;cursor:pointer;display:flex;gap:var(--an-space-2);align-items:center}
.app .chips input{accent-color:var(--an-primary);margin:0}
.app .chips label:has(input:checked){border-color:var(--an-primary);background:var(--an-plum-50);color:var(--an-primary-text)}
.app .captcha{margin-top:20px;min-height:65px}
.app .send{display:flex;flex-wrap:wrap;align-items:center;gap:var(--an-space-4);margin-top:22px;padding-top:20px;border-top:var(--an-hairline)}
.app .send p{margin:0;font:var(--an-caption);color:var(--an-text-tertiary);flex:1;min-width:220px}
.app .msg{margin:14px 0 0;padding:10px 12px;border-radius:var(--an-radius-md);background:var(--an-danger-bg);color:var(--an-danger-text);font:var(--an-small)}
.app .msg a{color:var(--an-link)}
/* Sent: the one Lagoon mark on the page, the outcome ("it landed"). Ink-coloured tick on Lagoon, never white. */
.app .done{text-align:center;padding:40px 10px}
.app .done .tick{width:56px;height:56px;border-radius:50%;background:var(--an-outcome);color:var(--an-ink);display:grid;place-items:center;margin:0 auto var(--an-space-4)}
.app .done h3{font:var(--an-h2);letter-spacing:var(--an-h2-tracking);margin:0}
.app .done p{color:var(--an-text-secondary)}
.app .faq-s{padding-bottom:clamp(56px,8vw,104px)}
.app .faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 var(--an-space-12);margin-top:var(--an-space-6)}
@container app (max-width:759.98px){.app .faq{grid-template-columns:1fr}}
.app .faq>div{padding:22px 0;border-top:var(--an-hairline)}
.app .faq h3{font:var(--an-h3);font-size:18px;letter-spacing:var(--an-h3-tracking);margin:0}
.app .faq p{color:var(--an-text-secondary);margin:8px 0 0;max-width:62ch}
.app .faq a,.app .msg a{color:var(--an-link)}
.app .faq a:hover{color:var(--an-link-hover)}
@media (prefers-reduced-motion:reduce){.app *{transition:none !important;scroll-behavior:auto !important}.app .plan:hover,.app .btn:hover,.app .plan .lock button:hover{transform:none !important}}
`,Q=null,C(P,{apiBase:{type:D.String,title:`Tools API`,defaultValue:I},turnstileSiteKey:{type:D.String,title:`Turnstile key`,defaultValue:L}})})),ve,ye,be,xe,Se,Ce,we,Te,Ee,$,De;e((()=>{d(),b(),h(),n(),_e(),N(),ve=v(P),ye={Dj6pYMCgD:`(min-width: 810px) and (max-width: 1199.98px)`,mbtqVN5eH:`(max-width: 809.98px)`,VlzHAXg1t:`(min-width: 1200px)`},be=[],xe=`framer-0yolf`,Se={Dj6pYMCgD:`framer-v-p4rpu4`,mbtqVN5eH:`framer-v-12q11d1`,VlzHAXg1t:`framer-v-14u5p52`},Ce=(e,t,n)=>e&&t?`position`:n,we={Desktop:`VlzHAXg1t`,Phone:`mbtqVN5eH`,Tablet:`Dj6pYMCgD`},Te=({value:e})=>A()?null:l(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),Ee=({height:e,id:t,width:n,...r})=>({...r,variant:we[r.variant]??r.variant??`VlzHAXg1t`}),$=k(u(function(e,n){let r=p(null),i=n??r,ee=a(),{activeLocale:o,setLocale:u}=E();x();let{style:d,className:f,layoutId:h,variant:v,...b}=Ee(e);O(t(()=>M({},o),[o]));let[C,D]=ne(v,ye,!1),k=y(xe),A=s(w)?.isLayoutTemplate,j=!!s(te)?.transition?.layout,N=Ce(A,j);return _({}),l(w.Provider,{value:{activeVariantId:C,humanReadableVariantMap:we,primaryVariantId:`VlzHAXg1t`,variantClassNames:Se},children:c(m,{id:h??ee,children:[l(Te,{value:`html body { background: none; }`}),l(g.main,{...b,className:y(k,`framer-14u5p52`,f),ref:i,style:{...d},children:l(T,{children:l(S,{className:`framer-96008d-container`,"data-code-component-plugin-id":`api`,"data-framer-name":`Pricing Page`,isAuthoredByUser:!0,layout:N,name:`Pricing Page`,nodeId:`XU5Lh8YlU`,scopeId:`acA3f_FR4`,children:l(P,{apiBase:`https://tools.alphanodus.com`,height:`100%`,id:`XU5Lh8YlU`,layoutId:`XU5Lh8YlU`,name:`Pricing Page`,style:{width:`100%`},turnstileSiteKey:`0x4AAAAAADXZWR9OwwfaW_MO`,width:`100%`})})})}),l(`div`,{id:`overlay`})]})})}),[`.framer-0yolf.framer-bepjh5, .framer-0yolf .framer-bepjh5 { display: block; }`,`.framer-0yolf.framer-14u5p52 { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-0yolf .framer-96008d-container { flex: none; height: auto; position: relative; width: 100%; }`,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-0yolf.framer-14u5p52 { width: 810px; }}`,`@media (max-width: 809.98px) { .framer-0yolf.framer-14u5p52 { width: 390px; }}`],`framer-0yolf`),$.displayName=`Pricing`,$.defaultProps={height:3645,width:1200},j($,[{explicitInter:!0,fonts:[]},...ve],{supportsExplicitInterCodegen:!0}),De={exports:{default:{type:`reactComponent`,name:`FrameracA3f_FR4`,slots:[],annotations:{framerIntrinsicHeight:`3645`,framerLayoutTemplateFlowEffect:`true`,framerAutoSizeImages:`true`,framerContractVersion:`1`,framerComponentViewportWidth:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"Dj6pYMCgD":{"layout":["fixed","auto"]},"mbtqVN5eH":{"layout":["fixed","auto"]}}}`,framerResponsiveScreen:`true`,framerDisplayContentsDiv:`false`,framerImmutableVariables:`true`,framerAcceptsLayoutTemplate:`true`,framerIntrinsicWidth:`1200`,framerScrollSections:`false`,framerColorSyntax:`true`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{De as __FramerMetadata__,$ as default,be as queryParamNames};
//# sourceMappingURL=yUTDYllVqG3_8tZhe2H7yu6bU_lv1w-eQrJILZ85iV4.DwcO8C2X.mjs.map