import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,C as n,F as r,L as i,S as a,g as o,k as s,l as c,o as l,p as u,s as d,v as f,y as p}from"./react.BKyTRiZ3.mjs";import{a as m,r as h,t as g,w as ee}from"./motion.D-Nk57UM.mjs";import{$ as te,A as _,C as v,I as y,X as b,a as ne,b as x,c as S,et as re,i as ie,nt as C,o as w,rt as ae,st as T,tt as E,y as D}from"./framer.CAQJ1n1h.mjs";import oe,{t as O}from"./yxtUGEAJP9UpWzVyozrPCNiiCyK4sj3x1sQhjEm3428.D9ScsLBV.mjs";function k(){let e=i;if(!e.Cal){let t=(e,t)=>e.q.push(t),n=function(){let e=arguments;if(n.loaded||=(n.ns={},n.q=n.q||[],document.head.appendChild(document.createElement(`script`)).src=H,!0),e[0]===`init`){let r=function(){t(r,arguments)},i=e[1];r.q=r.q||[],typeof i==`string`?(n.ns[i]=n.ns[i]||r,t(n.ns[i],e),t(n,[`initNamespace`,i])):t(n,e);return}t(n,e)};n.q=[],e.Cal=n}return e.Cal}async function A(e,t){try{let[n,r]=t.split(`/`),i=/^https:\/\/([^.]+)\.cal\.com/.exec(e||``)?.[1],a=Intl.DateTimeFormat().resolvedOptions().timeZone,o=new Date,s=new Date(o.getTime()+120*864e5),c=new URLSearchParams({username:n,eventTypeSlug:r,start:o.toISOString().slice(0,10),end:s.toISOString().slice(0,10),timeZone:a});i&&i!==`app`&&c.set(`organizationSlug`,i);let l=new AbortController,u=setTimeout(()=>l.abort(),2500),d=await fetch(`https://api.cal.com/v2/slots?`+c,{headers:{"cal-api-version":`2024-09-04`},signal:l.signal});return clearTimeout(u),Object.keys((await d.json())?.data||{}).sort()[0]||null}catch{return null}}function j({calOrigin:e=M.cal_origin,calLink:t=M.cal_link,bookingUrl:n=M.booking_url}){let r=p(null),a=p(null),[s,u]=o(R),d=p(null);f(()=>{if(!(i===void 0||i.matchMedia(`(prefers-reduced-motion: reduce)`).matches)&&!((r.current?.clientWidth??0)<980))return d.current=setInterval(()=>u(e=>(e+1)%L.length),4e3),()=>{d.current&&clearInterval(d.current)}},[]),f(()=>{let n=a.current;if(i===void 0||!n||!t)return;let r=!0,o=k();o(`init`,V,{origin:e||`https://app.cal.com`});let s=o.ns[V];A(e,t).then(e=>{if(!r)return;let i=e?{month:e.slice(0,7),date:e}:{};s(`inline`,{elementOrSelector:n,calLink:t,config:{layout:`month_view`,theme:`light`,...i}})});let c=getComputedStyle(n),l=e=>c.getPropertyValue(e).trim(),u={"cal-brand":l(`--an-primary`),"cal-bg-emphasis":l(`--an-plum-50`),"cal-text-emphasis":l(`--an-plum-800`),"cal-border-booker":`transparent`,"cal-border-subtle":l(`--an-border`)};s(`ui`,{theme:`light`,layout:`month_view`,hideEventTypeDetails:n.clientWidth<700,cssVarsPerTheme:{light:u}});let d=!1,f=()=>{if(!d){d=!0;try{(i.dataLayer=i.dataLayer||[]).push({event:`demo_booked`})}catch{}}};return s(`on`,{action:`bookingSuccessful`,callback:f}),s(`on`,{action:`bookingSuccessfulV2`,callback:f}),()=>{r=!1,n.innerHTML=``}},[e,t]),f(()=>{if(i===void 0)return;let e=!1,t=()=>setTimeout(()=>{if(!(e||!(document.activeElement instanceof HTMLIFrameElement))){e=!0;try{(i.dataLayer=i.dataLayer||[]).push({event:`demo_calendar_engaged`})}catch{}}},0);return i.addEventListener(`blur`,t),()=>i.removeEventListener(`blur`,t)},[]);let m=e=>{d.current&&=(clearInterval(d.current),null),u(e)};return c(`section`,{className:`adp`,"aria-labelledby":`adp-h1`,ref:r,children:[l(`style`,{dangerouslySetInnerHTML:{__html:z+B}}),l(`header`,{className:`hero`,children:c(`div`,{className:`wrap`,children:[c(`div`,{className:`intro`,children:[c(`div`,{children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),N.eyebrow]}),l(`h1`,{id:`adp-h1`,children:N.h1})]}),c(`div`,{children:[l(`p`,{className:`lead`,children:N.lead}),l(`ul`,{className:`nums`,children:N.numbers.map(e=>c(`li`,{children:[l(`b`,{"aria-hidden":`true`,children:e.figure}),l(`span`,{children:e.label})]},e.figure))})]})]}),c(`div`,{className:`cal`,children:[c(`div`,{className:`cal-head`,children:[c(`div`,{children:[l(`h2`,{children:P.h2}),l(`p`,{children:P.note})]}),l(`a`,{className:`fallback`,href:n,target:`_blank`,rel:`noopener`,children:P.fallback})]}),l(`div`,{className:`frame`,ref:a,"aria-label":`Booking calendar for a Gravity demo`})]})]})}),l(`div`,{className:`agenda`,role:`region`,"aria-labelledby":`adp-agenda`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),F.eyebrow]}),l(`h2`,{id:`adp-agenda`,children:F.h2}),l(`p`,{className:`sub`,children:F.lead}),c(`div`,{className:`ag`,children:[l(`ol`,{className:`steps`,children:L.map((e,t)=>c(`li`,{className:t===s?`on`:t<s?`done`:``,children:[l(`span`,{className:`node`,"aria-hidden":`true`}),c(`button`,{type:`button`,onClick:()=>m(t),"aria-current":t===s?`step`:void 0,children:[l(`span`,{className:`t`,children:e.time}),l(`span`,{className:`k`,children:e.title}),l(`span`,{className:`b`,children:e.body})]}),e.image?c(`figure`,{className:`inl`,"aria-hidden":`true`,children:[c(`div`,{className:`shot`,children:[l(`img`,{src:e.image.src,width:e.image.width,height:e.image.height,alt:``,loading:`lazy`}),e.scan?l(`span`,{className:`scan`}):null]}),l(`figcaption`,{children:e.caption})]}):null]},e.time))}),l(`div`,{className:`screen`,"aria-live":`polite`,children:L.map((e,t)=>e.image?c(`figure`,{className:`panel`+(t===s?` on`:``),children:[c(`div`,{className:`shot`,children:[l(`img`,{src:e.image.src,width:e.image.width,height:e.image.height,alt:e.image.alt,loading:t===R?`eager`:`lazy`}),e.scan?l(`span`,{className:`scan`,"aria-hidden":`true`}):null]}),l(`figcaption`,{children:e.caption})]},e.time):l(`div`,{className:`panel`+(t===s?` on`:``),"aria-hidden":`true`,children:c(`div`,{className:`you`,children:[l(`b`,{children:e.title}),l(`span`,{children:e.body})]})},e.time))})]})]})}),l(`div`,{className:`proof`,role:`region`,"aria-labelledby":`adp-quote`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,id:`adp-quote`,children:[l(`i`,{"aria-hidden":`true`}),I.eyebrow]}),c(`figure`,{className:`quote`,children:[l(`div`,{className:`mark`,"aria-hidden":`true`,children:`“`}),c(`div`,{children:[l(`blockquote`,{children:I.text}),c(`figcaption`,{children:[l(`b`,{children:I.by}),`, `,I.role]}),c(`a`,{href:I.link.href,children:[I.link.label,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]})]})]})]})}),l(`div`,{className:`faq-s`,role:`region`,"aria-labelledby":`adp-faq`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),M.faq.eyebrow]}),l(`h2`,{id:`adp-faq`,children:M.faq.h2}),l(`div`,{className:`faq`,children:M.faq.items.map(e=>c(`div`,{children:[l(`h3`,{children:e.q}),l(`p`,{children:e.a}),e.link?l(`p`,{children:l(`a`,{href:e.link.href,children:e.link.label})}):null]},e.q))})]})}),l(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:M.jsonLd.replace(/</g,`\\u003c`)}})]})}var M,N,P,F,I,L,R,z,B,V,H,se=e((()=>{r(),d(),n(),y(),M={faq:{eyebrow:`Questions`,h2:`Questions before you book`,items:[{q:`How long is the demo?`,a:`30 minutes on Google Meet.`},{q:`What will you show us?`,a:`Watch one order go from referral to report to payment without anyone having to carry it.`},{q:`What do you need from us to book?`,a:`Your name, work email and company. The booking form asks for them when you pick a time, and nothing else is needed.`},{q:`How does Gravity work with our RIS, PACS and RCM?`,a:`It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.`},{q:`How is our data protected?`,a:`Hosted on AWS in US regions only. A HIPAA Business Associate Agreement with every customer. Every sub-processor used in Gravity has a BAA with Alpha Nodus. Independently penetration-tested every year. Data encrypted at rest with per-tenant keys. MFA on every production login, SSO on Enterprise. Controls monitored continuously, with a public Trust Center.`,link:{label:`Trust Center`,href:`https://security.alphanodus.com`}},{q:`Can we meet you in person?`,a:`Yes. We exhibit at imaging trade shows through the year, and you can book a working session at our booth.`,link:{label:`All events`,href:`/events`}}]},jsonLd:`{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://alphanodus.com/#organization","name":"Alpha Nodus","legalName":"Alpha Nodus, Inc.","url":"https://alphanodus.com","logo":{"@type":"ImageObject","url":"https://framerusercontent.com/images/KV366RXtaJtF1GTYRPMyVeBkMQ.png","width":180,"height":180},"description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","foundingDate":"2015","founder":{"@type":"Person","@id":"https://alphanodus.com/company#shamit-patel","name":"Shamit Patel"},"address":{"@type":"PostalAddress","streetAddress":"1351 Sawgrass Corporate Parkway, Suite 104","addressLocality":"Sunrise","addressRegion":"FL","postalCode":"33323","addressCountry":"US"},"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+18886257420","email":"info@alphanodus.com","areaServed":"US"},"sameAs":["https://www.linkedin.com/company/alphanodus","https://www.youtube.com/@AlphaNodus","https://x.com/alphanodus","https://www.instagram.com/alphanodus/","https://www.facebook.com/AlphaNodus/"],"brand":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"WebSite","@id":"https://alphanodus.com/#website","url":"https://alphanodus.com","name":"Alpha Nodus","publisher":{"@id":"https://alphanodus.com/#organization"},"inLanguage":"en-US"},{"@type":"SoftwareApplication","@id":"https://alphanodus.com/#gravity","name":"Gravity","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","publisher":{"@id":"https://alphanodus.com/#organization"}},{"@type":"WebPage","@id":"https://alphanodus.com/demo","url":"https://alphanodus.com/demo","name":"Book a demo of Gravity for imaging centers","description":"Watch one order go from referral to report to payment without anyone having to carry it. Pick a time for a 30-minute demo of Gravity on Google Meet.","inLanguage":"en-US","isPartOf":{"@id":"https://alphanodus.com/#website"},"publisher":{"@id":"https://alphanodus.com/#organization"},"dateModified":"2026-10-14","about":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"FAQPage","@id":"https://alphanodus.com/demo#faq","mainEntity":[{"@type":"Question","name":"How long is the demo?","acceptedAnswer":{"@type":"Answer","text":"30 minutes on Google Meet."}},{"@type":"Question","name":"What will you show us?","acceptedAnswer":{"@type":"Answer","text":"Watch one order go from referral to report to payment without anyone having to carry it."}},{"@type":"Question","name":"What do you need from us to book?","acceptedAnswer":{"@type":"Answer","text":"Your name, work email and company. The booking form asks for them when you pick a time, and nothing else is needed."}},{"@type":"Question","name":"How does Gravity work with our RIS, PACS and RCM?","acceptedAnswer":{"@type":"Answer","text":"It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away."}},{"@type":"Question","name":"How is our data protected?","acceptedAnswer":{"@type":"Answer","text":"Hosted on AWS in US regions only. A HIPAA Business Associate Agreement with every customer. Every sub-processor used in Gravity has a BAA with Alpha Nodus. Independently penetration-tested every year. Data encrypted at rest with per-tenant keys. MFA on every production login, SSO on Enterprise. Controls monitored continuously, with a public Trust Center."}},{"@type":"Question","name":"Can we meet you in person?","acceptedAnswer":{"@type":"Answer","text":"Yes. We exhibit at imaging trade shows through the year, and you can book a working session at our booth."}}]}]}`,cal_origin:`https://alphanodus.cal.com`,cal_link:`iris/gravity-demo`,booking_url:`https://alphanodus.cal.com/iris/gravity-demo`,intro:{eyebrow:`Book a demo`,h1:`Watch one order go from referral to report to payment without anyone having to carry it.`,lead:`30 minutes on Google Meet. It can run on top of the systems you already run, so tell us which leak costs you most when you book, and we’ll spend the time on your operation.`,numbers:[{figure:`460+`,label:`More than 460 imaging centers across the US`},{figure:`5.7M`,label:`5.7 million imaging orders a year, from the referral to the payment`}]},booking:{h2:`Pick a time`,note:`30 minutes with our team. We ask for your name, work email and company.`,fallback:`Calendar not loading? Open the booking page`},agenda:{eyebrow:`Your 30 minutes`,h2:`What we’ll show you`,lead:`One order, start to finish, on your kind of operation.`,steps:[{time:`Minutes 0 to 5`,title:`Your leak`,body:`You tell us where orders, exams or payments slip away today, and we aim the rest at it.`},{time:`Minutes 5 to 12`,title:`Get the order.`,body:`A handwritten fax comes in, and Gravity reads it into an order, ready to book.`,image:{src:`https://framerusercontent.com/images/wwujSral4sK7TzwXvDREFfjo1FI.webp`,width:748,height:968,alt:`A handwritten, faxed imaging order for an MRI of the knee, a fictional sample marked not a valid order`},caption:`Gravity Doc reads a handwritten fax`,scan:!0},{time:`Minutes 12 to 19`,title:`Complete the exam.`,body:`The patient books from their phone, and coverage is settled before they arrive.`,image:{src:`https://framerusercontent.com/images/ToFl9YPuJ1PPsspQkKwHG746Z0c.webp`,width:600,height:1258,alt:`Gravity Visit on a phone: picking a time, with the earliest slot at the nearest location and a time grid`},caption:`Gravity Visit: the patient picks a time`},{time:`Minutes 19 to 25`,title:`Get paid.`,body:`The patient’s share is collected, and the claim is worked until it’s paid.`,image:{src:`https://framerusercontent.com/images/VwCUND4NWJHoJjeDgcl1VFv0jvE.webp`,width:800,height:588,alt:`Three ways to pay in Gravity Pay: the Make a payment form online, the amount due on the front-desk card terminal, and tap, insert or swipe on a handheld reader, each for $125.00`},caption:`Gravity Pay: online, at the front desk, or on a handheld reader`},{time:`Minutes 25 to 30`,title:`Your questions`,body:`And what it looks like on top of the systems you already run.`}]},quote:{eyebrow:`From a customer`,text:`I’ve worked with plenty of vendors, but none identified the root problem like Alpha Nodus did. This quick fix saved us from losing revenue and patient trust due to a simple error.`,by:`Amanda Maple`,role:`CAO, MRI Associates`,link:{label:`Read the MRI Associates story`,href:`/customers/mri-associates`}}},N=M.intro,P=M.booking,F=M.agenda,I=M.quote,L=F.steps,R=Math.max(0,L.findIndex(e=>e.image)),z=`/* ============================================================
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
`,B=`
.adp{width:100%;background:var(--an-paper);color:var(--an-text);font:var(--an-body);-webkit-font-smoothing:antialiased;container-type:inline-size;container-name:adp}
.adp *{box-sizing:border-box}
.adp :focus-visible{outline:2px solid var(--an-focus);outline-offset:2px}
.adp .wrap{max-width:var(--an-container);margin:0 auto;padding:0 var(--an-gutter)}
@container adp (max-width:809.98px){.adp .wrap{padding:0 var(--an-space-4)}}
.adp .eyebrow{display:flex;align-items:center;gap:var(--an-space-2);font:var(--an-eyebrow);letter-spacing:var(--an-eyebrow-tracking);text-transform:uppercase;color:var(--an-primary-text);margin:0 0 18px}
.adp .eyebrow::before{content:"";flex:none;width:22px;border-top:var(--an-hairline)}
.adp .eyebrow i{flex:none;width:var(--an-node-eyebrow);height:var(--an-node-eyebrow);border-radius:50%;background:var(--an-primary);margin-left:-8px}
.adp h2{font:600 clamp(26px,3vw,30px)/1.16 var(--an-font-display);letter-spacing:var(--an-h2-tracking);margin:0;text-wrap:balance}
.adp .sub{color:var(--an-text-secondary);margin:12px 0 0;max-width:62ch;font-size:17px}
/* The one ink band on the page. On ink every text element is solid white or the one muted tone. */
.adp .hero{background:var(--an-ink);color:var(--an-text-on-ink);padding:clamp(48px,6vw,88px) 0 0}
.adp .hero .eyebrow{color:var(--an-on-ink)}
.adp .hero .eyebrow::before{border-top:var(--an-hairline-on-ink)}
.adp .hero .eyebrow i{background:var(--an-on-ink)}
/* The hero: the promise on the left, the lead and the two numbers on the right, then the booking card across the
   full width. Cal.com needs about 1,000px for its desktop booker (details, month and times side by side, a fixed
   height); narrower, it stacks and lists every slot, so the card always gets the whole container. */
.adp .hero .intro{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--an-space-16);align-items:end}
@container adp (max-width:979.98px){.adp .hero .intro{grid-template-columns:1fr;gap:var(--an-space-6)}}
.adp h1{font:600 clamp(34px,4.4vw,56px)/1.04 var(--an-font-display);letter-spacing:var(--an-display-tracking);margin:0;text-wrap:balance}
.adp .lead{font:var(--an-lead);color:var(--an-text-on-ink);margin:0;max-width:46ch}
.adp .nums{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--an-space-6);margin:28px 0 0;padding:24px 0 0;border-top:var(--an-hairline-on-ink)}
.adp .nums b{display:block;font:600 clamp(30px,3.2vw,40px)/1 var(--an-font-mono);font-variant-numeric:tabular-nums;color:var(--an-text-on-ink)}
.adp .nums span{display:block;margin-top:8px;font:var(--an-small);color:var(--an-text-on-ink-muted);max-width:26ch}
/* The card sits inside the ink band with ink below it, so its bottom edge never lines up with the band's. */
.adp .hero{padding-bottom:clamp(40px,6vw,72px)}
.adp .cal{position:relative;margin-top:clamp(40px,5vw,64px);background:var(--an-surface);color:var(--an-text);border-radius:var(--an-radius-xl);box-shadow:var(--an-shadow-lg);overflow:hidden}
.adp .cal-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:var(--an-space-2) var(--an-space-6);padding:20px 28px;border-bottom:var(--an-hairline)}
.adp .cal-head div{display:flex;flex-wrap:wrap;align-items:baseline;gap:var(--an-space-2) var(--an-space-4)}
.adp .cal h2{font:var(--an-h3);letter-spacing:var(--an-h3-tracking);margin:0}
.adp .cal p{margin:0;font:var(--an-small);color:var(--an-text-secondary)}
@container adp (max-width:699.98px){.adp .cal-head{padding:16px 18px}}
/* Phones: a tighter hero, so the calendar starts on the first screen or just under it. */
@container adp (max-width:599.98px){
  .adp .hero{padding-top:32px}
  .adp .hero .eyebrow{margin-bottom:12px}
  .adp h1{font-size:32px}
  .adp .lead{font-size:17px;line-height:1.55}
  .adp .nums{margin-top:20px;padding-top:16px;gap:var(--an-space-4)}
  .adp .nums b{font-size:28px}
  .adp .nums span{margin-top:6px;font:var(--an-caption)}
  .adp .cal{margin-top:28px}
  .adp .cal-head p{font:var(--an-caption)}
}
.adp .frame{min-height:520px;padding-bottom:var(--an-space-10);background:var(--an-surface)}
/* Phones: Cal.com stacks the month above the day's times. The event has hourly slots (8 a day at most), so the card
   grows to show them all: no scrolling inside the card (owner, 13 Oct 2026). */
@container adp (max-width:699.98px){.adp .frame{min-height:420px;padding-bottom:var(--an-space-6)}}
.adp .frame iframe{display:block;width:100%;border:0}
.adp .fallback{font:var(--an-small);color:var(--an-link)}
/* The 30 minutes: an agenda on a hairline, each step a node, beside the screen for the step on show. */
.adp .agenda{padding-top:clamp(56px,7vw,96px)}
.adp .ag{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--an-space-12);margin-top:var(--an-space-8);align-items:start}
@container adp (max-width:979.98px){.adp .ag{grid-template-columns:1fr;gap:var(--an-space-6)}}
.adp .steps{list-style:none;margin:0;padding:0;position:relative}
.adp .steps::before{content:"";position:absolute;left:13px;top:14px;bottom:14px;border-left:1px solid var(--an-border-strong)}
.adp .steps li{position:relative;padding:0 0 6px 44px}
.adp .steps button{display:block;width:100%;text-align:left;border:0;background:transparent;font:inherit;color:inherit;cursor:pointer;padding:14px 16px;border-radius:var(--an-radius-lg);transition:background-color var(--an-duration-base) var(--an-ease),box-shadow var(--an-duration-base) var(--an-ease)}
.adp .steps button:hover{background:var(--an-surface)}
.adp .steps .node{position:absolute;left:5px;top:22px;width:18px;height:18px;border-radius:50%;background:var(--an-surface);border:1.5px solid var(--an-border-strong)}
.adp .steps .t{display:block;font:500 12px/1 var(--an-font-mono);color:var(--an-text-tertiary-alt)}
.adp .steps .k{display:block;margin-top:6px;font:var(--an-h3);letter-spacing:var(--an-h3-tracking);color:var(--an-text)}
.adp .steps .b{display:block;margin-top:4px;font:var(--an-small);color:var(--an-text-secondary)}
.adp .steps .on button{background:var(--an-surface);box-shadow:var(--an-shadow-sm)}
.adp .steps .on .node{background:var(--an-primary);border-color:var(--an-primary);box-shadow:0 0 0 4px var(--an-plum-100)}
.adp .steps .done .node{background:var(--an-plum-50);border-color:var(--an-plum-100)}
.adp .screen{position:sticky;top:96px;display:grid;background:var(--an-ink);border-radius:var(--an-radius-xl);padding:clamp(18px,3vw,36px);min-height:460px}
.adp .panel{grid-area:1/1;display:grid;place-items:center;margin:0;opacity:0;visibility:hidden;transition:opacity var(--an-duration-slow) var(--an-ease)}
.adp .panel.on{opacity:1;visibility:visible}
.adp .shot{position:relative;width:fit-content;margin:0 auto}
.adp .shot img{display:block;max-width:100%;width:auto;height:auto;max-height:440px;margin:0 auto;border-radius:var(--an-radius-md);box-shadow:var(--an-shadow-lg)}
/* The fax scan: one Plum 300 line travelling down the page, as on the Greeter scan screen. Still for reduced motion. */
.adp .scan{position:absolute;left:-10px;right:-10px;top:2%;height:3px;border-radius:2px;background:var(--an-on-ink);box-shadow:0 0 0 6px var(--an-border-on-ink);animation:adp-scan 2.6s var(--an-ease) infinite}
@keyframes adp-scan{0%{top:2%}50%{top:96%}100%{top:2%}}
.adp .panel figcaption{margin-top:16px;text-align:center;font:var(--an-caption);color:var(--an-text-on-ink-muted)}
.adp .you{text-align:center;max-width:34ch}
.adp .you b{display:block;font:600 26px/1.2 var(--an-font-display);color:var(--an-text-on-ink);margin-bottom:10px}
.adp .you span{font:var(--an-small);color:var(--an-text-on-ink-muted)}
/* Phones and tablets: no shared screen cycling above the list. Each step with a screen shows it under the step, the
   text-only steps stay text, and nothing moves on its own. The screen panel stays in the HTML for desktop. Duplicate
   images are hidden from assistive tech (the desktop panel carries the alt text) and load lazily, so desktop never
   fetches them. */
.adp .inl{display:none;margin:0 0 12px;background:var(--an-ink);border-radius:var(--an-radius-lg);padding:12px}
.adp .inl .shot img{max-height:168px;box-shadow:none}
.adp .inl figcaption{margin-top:8px;text-align:center;font:var(--an-caption);color:var(--an-text-on-ink-muted)}
@container adp (max-width:979.98px){
  .adp .screen{display:none}
  .adp .inl{display:block}
  .adp .steps li{padding-left:36px}
  .adp .steps button{padding:10px 0 12px;cursor:default}
  .adp .steps button:hover,.adp .steps .on button{background:transparent;box-shadow:none}
  .adp .steps .node{left:5px;top:16px}
  .adp .steps .on .node,.adp .steps .done .node{background:var(--an-surface);border-color:var(--an-border-strong);box-shadow:none}
}
/* Proof */
.adp .proof{padding-top:clamp(56px,7vw,96px)}
.adp .quote{margin:0;background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-lg);padding:clamp(24px,4vw,48px);display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--an-space-8);align-items:start}
@container adp (max-width:699.98px){.adp .quote{grid-template-columns:1fr;gap:0}.adp .quote .mark{font-size:48px;height:28px}}
.adp .quote .mark{font:600 72px/0.8 var(--an-font-display);color:var(--an-plum-200)}
.adp .quote blockquote{margin:0;font:500 clamp(20px,2.2vw,26px)/1.4 var(--an-font-display);color:var(--an-text);max-width:40ch}
.adp .quote figcaption{margin-top:18px;font:var(--an-small);color:var(--an-text-secondary)}
.adp .quote figcaption b{color:var(--an-text);font-weight:600}
.adp .quote a{display:inline-block;margin-top:14px;font:600 14px/1.4 var(--an-font);color:var(--an-link)}
.adp .faq-s{padding:clamp(56px,7vw,96px) 0 clamp(56px,8vw,104px)}
.adp .faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 var(--an-space-12);margin-top:var(--an-space-6)}
@container adp (max-width:759.98px){.adp .faq{grid-template-columns:1fr}}
.adp .faq>div{padding:22px 0;border-top:var(--an-hairline)}
.adp .faq h3{font:var(--an-h3);font-size:18px;letter-spacing:var(--an-h3-tracking);margin:0}
.adp .faq p{color:var(--an-text-secondary);margin:8px 0 0;max-width:62ch}
.adp .faq a,.adp .fallback{color:var(--an-link)}
@media (prefers-reduced-motion:reduce){.adp *{transition:none !important;scroll-behavior:auto !important}.adp .scan{animation:none;top:48%}}
`,V=`gravity-demo`,H=`https://app.cal.com/embed/embed.js`,x(j,{calOrigin:{type:w.String,title:`Cal.com origin`,defaultValue:M.cal_origin},calLink:{type:w.String,title:`Cal.com link`,defaultValue:M.cal_link},bookingUrl:{type:w.String,title:`Booking URL`,defaultValue:M.booking_url}})})),U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{d(),y(),g(),n(),se(),O(),U=_(j),W={EcJ9c0YSI:`(max-width: 809.98px)`,JtI84WCXc:`(min-width: 1200px)`,QKlS6Ca0V:`(min-width: 810px) and (max-width: 1199.98px)`},G=[],K=`framer-0grhN`,q={EcJ9c0YSI:`framer-v-1tyh6gq`,JtI84WCXc:`framer-v-1i2nlyz`,QKlS6Ca0V:`framer-v-1cgo05y`},J=(e,t,n)=>e&&t?`position`:n,Y={Desktop:`JtI84WCXc`,Phone:`EcJ9c0YSI`,Tablet:`QKlS6Ca0V`},X=({value:e})=>E()?null:l(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),Z=({height:e,id:t,width:n,...r})=>({...r,variant:Y[r.variant]??r.variant??`JtI84WCXc`}),Q=T(u(function(e,n){let r=p(null),i=n??r,o=a(),{activeLocale:u,setLocale:d}=C();b();let{style:f,className:g,layoutId:_,variant:y,...x}=Z(e);ae(t(()=>oe({},u),[u]));let[w,T]=re(y,W,!1),E=v(K),D=s(S)?.isLayoutTemplate,O=!!s(m)?.transition?.layout,k=J(D,O);return te({}),l(S.Provider,{value:{activeVariantId:w,humanReadableVariantMap:Y,primaryVariantId:`JtI84WCXc`,variantClassNames:q},children:c(h,{id:_??o,children:[l(X,{value:`html body { background: none; }`}),l(ee.main,{...x,className:v(E,`framer-1i2nlyz`,g),ref:i,style:{...f},children:l(ie,{children:l(ne,{className:`framer-r5s3pt-container`,"data-code-component-plugin-id":`api`,"data-framer-name":`Demo Page`,isAuthoredByUser:!0,layout:k,name:`Demo Page`,nodeId:`XraSruLkJ`,scopeId:`UzYVVXUBB`,children:l(j,{bookingUrl:`https://alphanodus.cal.com/iris/gravity-demo`,calLink:`iris/gravity-demo`,calOrigin:`https://alphanodus.cal.com`,height:`100%`,id:`XraSruLkJ`,layoutId:`XraSruLkJ`,name:`Demo Page`,style:{width:`100%`},width:`100%`})})})}),l(`div`,{id:`overlay`})]})})}),[`.framer-0grhN.framer-2zkst, .framer-0grhN .framer-2zkst { display: block; }`,`.framer-0grhN.framer-1i2nlyz { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-0grhN .framer-r5s3pt-container { flex: none; height: auto; position: relative; width: 100%; }`,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-0grhN.framer-1i2nlyz { width: 810px; }}`,`@media (max-width: 809.98px) { .framer-0grhN.framer-1i2nlyz { width: 390px; }}`],`framer-0grhN`),Q.displayName=`Demo`,Q.defaultProps={height:2314,width:1200},D(Q,[{explicitInter:!0,fonts:[]},...U],{supportsExplicitInterCodegen:!0}),$={exports:{queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`FramerUzYVVXUBB`,slots:[],annotations:{framerLayoutTemplateFlowEffect:`true`,framerAutoSizeImages:`true`,framerContractVersion:`1`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"QKlS6Ca0V":{"layout":["fixed","auto"]},"EcJ9c0YSI":{"layout":["fixed","auto"]}}}`,framerAcceptsLayoutTemplate:`true`,framerColorSyntax:`true`,framerIntrinsicWidth:`1200`,framerDisplayContentsDiv:`false`,framerIntrinsicHeight:`2314`,framerComponentViewportWidth:`true`,framerScrollSections:`false`,framerImmutableVariables:`true`,framerResponsiveScreen:`true`}},__FramerMetadata__:{type:`variable`}}}}))();export{$ as __FramerMetadata__,Q as default,G as queryParamNames};
//# sourceMappingURL=t-dvSa9paPeit9lhYa4gs54mr9DI1bcLyYK6f1Tlbpc.CTNLXgRt.mjs.map