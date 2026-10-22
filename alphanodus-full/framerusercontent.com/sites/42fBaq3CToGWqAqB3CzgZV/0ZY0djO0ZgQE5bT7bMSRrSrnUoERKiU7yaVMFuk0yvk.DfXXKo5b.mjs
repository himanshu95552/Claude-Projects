import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,C as n,F as r,I as i,S as a,g as o,k as s,l as c,o as l,p as u,s as d,v as f,y as p}from"./react.BKyTRiZ3.mjs";import{a as m,r as h,t as g,w as _}from"./motion.D-Nk57UM.mjs";import{$ as v,A as y,C as b,I as x,X as ee,a as S,c as C,et as te,i as ne,nt as re,rt as w,st as T,tt as E,y as ie}from"./framer.CAQJ1n1h.mjs";import ae,{t as D}from"./10m_elodj2BJwNj6waJPJBdjQfzLn_XkGTq1Rh8jUsE.C1_vysN2.mjs";function O({active:e}){let t=F.map(e=>e.city);return c(`svg`,{className:`map`,viewBox:`0 0 ${P.w} ${P.h}`,role:`img`,"aria-label":`World map with pins on ${t.slice(0,-1).join(`; `)}; and ${t[t.length-1]}`,children:[l(`path`,{d:P.d,fill:`none`,stroke:`#DDD3F7`,strokeWidth:`4.6`,strokeLinecap:`round`,strokeDasharray:`0 ${P.step}`}),F.map((t,n)=>{let[r,i]=t.pin,a=r>P.w/2;return c(`g`,{className:n===e?`on`:void 0,children:[l(`circle`,{className:`ring`,cx:r,cy:i,r:`22`}),l(`circle`,{cx:r,cy:i,r:`11`,fill:`#FFFFFF`}),l(`circle`,{cx:r,cy:i,r:`7.5`,fill:`#6B3FE4`}),l(`text`,{className:`lbl`,x:a?r-20:r,y:a?i+9:t.label===`Austin`?i-22:i+44,textAnchor:a?`end`:`middle`,children:t.label})]},t.label)})]})}function k(){let[e,t]=o(null),[n,r]=o(Math.max(0,F.findIndex(e=>e.role===`Headquarters`))),[a,s]=o(!1);f(()=>{t(new Date);let e=setInterval(()=>t(new Date),3e4);return()=>clearInterval(e)},[]);let u=e=>{i===void 0||!i.clipboard||i.clipboard.writeText(e).then(()=>{s(!0),setTimeout(()=>s(!1),1800)},()=>{})};return c(`section`,{className:`acx`,"aria-labelledby":`acx-h1`,children:[l(`style`,{dangerouslySetInnerHTML:{__html:I+L}}),l(`header`,{className:`hero`,children:c(`div`,{className:`wrap grid`,children:[c(`div`,{children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),j.eyebrow]}),l(`h1`,{id:`acx-h1`,children:j.h1}),l(`p`,{className:`lead`,children:j.lead})]}),l(`ul`,{className:`direct`,children:j.direct.map(e=>c(`li`,{children:[l(`span`,{className:`ic`,children:l(z,{kind:e.kind})}),c(`div`,{children:[l(`span`,{children:e.label}),l(`a`,{className:`v`,href:e.href,children:e.value})]}),e.kind===`email`?l(`button`,{type:`button`,className:`copy`,onClick:()=>u(e.value),"aria-label":`Copy ${e.value}`,children:l(`span`,{"aria-live":`polite`,children:a?`Copied`:`Copy`})}):l(`b`,{className:`go`,"aria-hidden":`true`,children:`→`})]},e.kind))})]})}),l(`div`,{className:`sec`,role:`region`,"aria-labelledby":`acx-routes`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),M.eyebrow]}),l(`h2`,{id:`acx-routes`,children:M.h2}),l(`ul`,{className:`routes`,children:M.items.map(e=>c(`li`,{children:[l(`h3`,{children:e.title}),l(`p`,{children:e.body}),l(`div`,{className:`ls`,children:e.links.map(e=>c(`a`,{href:e.href,...B(e.href)?{target:`_blank`,rel:`noopener`}:{},children:[e.label,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]},e.href))})]},e.title))})]})}),l(`div`,{className:`sec`,role:`region`,"aria-labelledby":`acx-offices`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),N.eyebrow]}),l(`h2`,{id:`acx-offices`,children:N.h2}),l(`p`,{className:`sub`,children:N.lead}),c(`div`,{className:`off`,children:[l(`figure`,{className:`map-card`,children:l(O,{active:n})}),l(`ul`,{className:`cards`,children:F.map((t,i)=>c(`li`,{className:i===n?`on`:void 0,onMouseEnter:()=>r(i),onFocus:()=>r(i),children:[c(`div`,{className:`top`,children:[l(`h3`,{children:t.city}),l(`span`,{className:`role`,children:t.role})]}),l(`address`,{children:t.lines.map(e=>l(`span`,{children:e},e))}),c(`div`,{className:`meta`,children:[c(`span`,{children:[N.time_label,` `,l(`b`,{children:e?V(t.zone,e):``}),` `,t.zone_label]}),t.directions?c(`a`,{href:t.directions,target:`_blank`,rel:`noopener`,children:[N.directions_label,` `,l(`span`,{"aria-hidden":`true`,children:`→`})]}):null]})]},t.label))})]})]})}),l(`div`,{className:`faq-s`,role:`region`,"aria-labelledby":`acx-faq`,children:c(`div`,{className:`wrap`,children:[c(`p`,{className:`eyebrow`,children:[l(`i`,{"aria-hidden":`true`}),A.faq.eyebrow]}),l(`h2`,{id:`acx-faq`,children:A.faq.h2}),l(`div`,{className:`faq`,children:A.faq.items.map(e=>c(`div`,{children:[l(`h3`,{children:e.q}),l(`p`,{children:e.a})]},e.q))})]})}),l(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:A.jsonLd.replace(/</g,`\\u003c`)}})]})}var A,j,M,N,P,F,I,L,R,z,B,V,H=e((()=>{r(),d(),n(),A={faq:{eyebrow:`Questions`,h2:`Contacting Alpha Nodus`,items:[{q:`What’s the fastest way to reach Alpha Nodus?`,a:`Email info@alphanodus.com or call 1-888-625-7420. To see Gravity, book a 30-minute demo and pick a time that suits you.`},{q:`I run Gravity at my center. Where do I get help?`,a:`Email support@alphanodus.com, or call 1-888-625-7420.`},{q:`Where is Alpha Nodus headquartered?`,a:`In Sunrise, Florida, at 1351 Sawgrass Corporate Parkway, Suite 104, Sunrise, FL 33323. We also have offices in Austin, Texas, and Bengaluru, India.`},{q:`How do I report a security issue?`,a:`Email security@alphanodus.com. Our Trust Center describes the Bug Bounty Program, including its scope and safe harbor terms.`},{q:`How do I ask about my personal data?`,a:`Email privacy@alphanodus.com to ask a question or exercise your rights.`}]},jsonLd:`{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://alphanodus.com/#organization","name":"Alpha Nodus","legalName":"Alpha Nodus, Inc.","url":"https://alphanodus.com","logo":{"@type":"ImageObject","url":"https://framerusercontent.com/images/KV366RXtaJtF1GTYRPMyVeBkMQ.png","width":180,"height":180},"description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","foundingDate":"2015","founder":{"@type":"Person","@id":"https://alphanodus.com/company#shamit-patel","name":"Shamit Patel"},"address":{"@type":"PostalAddress","streetAddress":"1351 Sawgrass Corporate Parkway, Suite 104","addressLocality":"Sunrise","addressRegion":"FL","postalCode":"33323","addressCountry":"US"},"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+18886257420","email":"info@alphanodus.com","areaServed":"US"},"sameAs":["https://www.linkedin.com/company/alphanodus","https://www.youtube.com/@AlphaNodus","https://x.com/alphanodus","https://www.instagram.com/alphanodus/","https://www.facebook.com/AlphaNodus/"],"brand":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"WebSite","@id":"https://alphanodus.com/#website","url":"https://alphanodus.com","name":"Alpha Nodus","publisher":{"@id":"https://alphanodus.com/#organization"},"inLanguage":"en-US"},{"@type":"SoftwareApplication","@id":"https://alphanodus.com/#gravity","name":"Gravity","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","publisher":{"@id":"https://alphanodus.com/#organization"}},{"@type":"ContactPage","@id":"https://alphanodus.com/contact","url":"https://alphanodus.com/contact","name":"Contact Alpha Nodus","description":"Contact Alpha Nodus, the company behind Gravity for imaging centers: book a demo, reach support, or visit our offices in Sunrise, Austin and Bengaluru.","inLanguage":"en-US","isPartOf":{"@id":"https://alphanodus.com/#website"},"publisher":{"@id":"https://alphanodus.com/#organization"},"dateModified":"2026-10-13","about":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"FAQPage","@id":"https://alphanodus.com/contact#faq","mainEntity":[{"@type":"Question","name":"What’s the fastest way to reach Alpha Nodus?","acceptedAnswer":{"@type":"Answer","text":"Email info@alphanodus.com or call 1-888-625-7420. To see Gravity, book a 30-minute demo and pick a time that suits you."}},{"@type":"Question","name":"I run Gravity at my center. Where do I get help?","acceptedAnswer":{"@type":"Answer","text":"Email support@alphanodus.com, or call 1-888-625-7420."}},{"@type":"Question","name":"Where is Alpha Nodus headquartered?","acceptedAnswer":{"@type":"Answer","text":"In Sunrise, Florida, at 1351 Sawgrass Corporate Parkway, Suite 104, Sunrise, FL 33323. We also have offices in Austin, Texas, and Bengaluru, India."}},{"@type":"Question","name":"How do I report a security issue?","acceptedAnswer":{"@type":"Answer","text":"Email security@alphanodus.com. Our Trust Center describes the Bug Bounty Program, including its scope and safe harbor terms."}},{"@type":"Question","name":"How do I ask about my personal data?","acceptedAnswer":{"@type":"Answer","text":"Email privacy@alphanodus.com to ask a question or exercise your rights."}}]}]}`,hero:{eyebrow:`Contact`,h1:`Talk to us.`,lead:`Ask about Gravity, get help with your account, or find the right person on our team. Start wherever is easiest.`,direct:[{kind:`email`,label:`Email us`,value:`info@alphanodus.com`,href:`mailto:info@alphanodus.com`},{kind:`phone`,label:`Call us`,value:`1-888-625-7420`,href:`tel:+18886257420`},{kind:`demo`,label:`See it work`,value:`Book a 30-minute demo`,href:`/demo`}]},routes:{eyebrow:`Find the right team`,h2:`Who to reach, for what`,items:[{title:`See Gravity`,body:`30 minutes on Google Meet, spent on your operation, or a price for your volume.`,links:[{label:`Book a demo`,href:`/demo`},{label:`Get your price`,href:`/pricing`}]},{title:`Customer support`,body:`Already running Gravity? Email support with your center’s name and what you’re seeing.`,links:[{label:`support@alphanodus.com`,href:`mailto:support@alphanodus.com`}]},{title:`Security`,body:`Report a vulnerability, or read how we protect your data.`,links:[{label:`security@alphanodus.com`,href:`mailto:security@alphanodus.com`},{label:`Trust Center`,href:`https://security.alphanodus.com`}]},{title:`Privacy`,body:`Questions about your data, or a request to exercise your privacy rights.`,links:[{label:`privacy@alphanodus.com`,href:`mailto:privacy@alphanodus.com`},{label:`Privacy policy`,href:`/legal/privacy`}]},{title:`Legal`,body:`Contracts, notices and anything for our legal team.`,links:[{label:`legal@alphanodus.com`,href:`mailto:legal@alphanodus.com`},{label:`Legal documents`,href:`/legal`}]},{title:`Partners`,body:`Bring Gravity to your customers, or connect your system to it.`,links:[{label:`partner@alphanodus.com`,href:`mailto:partner@alphanodus.com`},{label:`Partner with us`,href:`/partners`}]},{title:`Press and media`,body:`Interviews, news and media requests.`,links:[{label:`info@alphanodus.com`,href:`mailto:info@alphanodus.com`},{label:`News`,href:`/press`}]},{title:`Careers`,body:`Open roles in Austin, Sunrise and Bengaluru.`,links:[{label:`jobs@alphanodus.com`,href:`mailto:jobs@alphanodus.com`},{label:`See open roles`,href:`/careers`}]}]},offices:{eyebrow:`Our offices`,h2:`Where we work`,lead:`Headquarters in Sunrise, Florida, with teams in Austin, Texas, and Bengaluru, India.`,items:[{label:`Sunrise`,city:`Sunrise, Florida`,role:`Headquarters`,lines:[`1351 Sawgrass Corporate Parkway, Suite 104`,`Sunrise, FL 33323`],zone:`America/New_York`,zone_label:`Eastern Time`,directions:`https://www.google.com/maps/search/?api=1&query=1351+Sawgrass+Corporate+Parkway+Suite+104+Sunrise+FL+33323`,pin:[179.4,127.6]},{label:`Austin`,city:`Austin, Texas`,role:`Office`,lines:[`9600 Great Hills Trail, Suite 150W`,`Austin, TX 78759`],zone:`America/Chicago`,zone_label:`Central Time`,directions:`https://www.google.com/maps/search/?api=1&query=9600+Great+Hills+Trail+Suite+150W+Austin+TX+78759`,pin:[109.3,111.2]},{label:`Bengaluru`,city:`Bengaluru, India`,role:`Office`,lines:[`No. 175, EPIP KIADB 2nd Phase`,`KIADB Industrial Area, Whitefield, EPIP Zone`,`Brookefield, Bengaluru, Karnataka 560066, India`],zone:`Asia/Kolkata`,zone_label:`India Standard Time`,directions:`https://www.google.com/maps/search/?api=1&query=No.+175+EPIP+KIADB+2nd+Phase+Whitefield+Bengaluru+Karnataka+560066`,pin:[812.2,180.5]}],directions_label:`Get directions`,time_label:`Local time`},map:{w:870,h:300,step:7.016,d:`M3.5 3.5h133.3M200 3.5h49.1M480.6 3.5h7M536.7 3.5h0M550.8 3.5h14M592.9 3.5h273.6M3.5 10.5h154.4M192.9 10.5h63.1M487.6 10.5h0M536.7 10.5h0M550.8 10.5h0M592.9 10.5h273.6M3.5 17.5h161.4M185.9 17.5h84.2M466.6 17.5h7M494.6 17.5h0M529.7 17.5h336.8M3.5 24.6h168.4M185.9 24.6h84.2M466.6 24.6h0M480.6 24.6h21M522.7 24.6h343.8M3.5 31.6h224.5M270.1 31.6h0M480.6 31.6h0M508.7 31.6h357.8M10.5 38.6h224.5M270.1 38.6h14M487.6 38.6h378.9M10.5 45.6h224.5M494.6 45.6h126.3M635 45.6h7M656 45.6h42.1M719.2 45.6h147.3M10.5 52.6h217.5M242.1 52.6h7M501.7 52.6h49.1M564.8 52.6h49.1M656 52.6h28.1M712.1 52.6h154.4M3.5 59.6h210.5M466.6 59.6h42.1M543.8 59.6h7M571.8 59.6h35.1M663 59.6h28.1M712.1 59.6h154.4M3.5 66.7h203.5M466.6 66.7h42.1M557.8 66.7h7M585.8 66.7h28.1M635 66.7h7M670 66.7h21M719.2 66.7h147.3M10.5 73.7h189.4M466.6 73.7h28.1M536.7 73.7h0M564.8 73.7h0M585.8 73.7h7M606.9 73.7h91.2M719.2 73.7h147.3M10.5 80.7h182.4M466.6 80.7h28.1M557.8 80.7h0M592.9 80.7h0M613.9 80.7h77.2M719.2 80.7h147.3M17.5 87.7h175.4M508.7 87.7h28.1M649 87.7h217.5M24.5 94.7h161.4M480.6 94.7h56.1M649 94.7h217.5M31.6 101.7h147.3M466.6 101.7h91.2M585.8 101.7h7M642 101.7h224.5M38.6 108.8h0M52.6 108.8h119.3M466.6 108.8h105.2M585.8 108.8h280.7M52.6 115.8h63.1M171.9 115.8h0M466.6 115.8h224.5M705.1 115.8h161.4M45.6 122.8h0M59.6 122.8h49.1M171.9 122.8h7M452.5 122.8h182.4M649 122.8h49.1M719.2 122.8h147.3M52.6 129.8h0M66.6 129.8h42.1M178.9 129.8h0M445.5 129.8h189.4M656 129.8h49.1M726.2 129.8h0M740.2 129.8h126.3M59.6 136.8h0M73.7 136.8h35.1M438.5 136.8h203.5M656 136.8h70.2M775.3 136.8h91.2M80.7 143.8h28.1M178.9 143.8h7M438.5 143.8h203.5M663 143.8h77.2M782.3 143.8h77.2M80.7 150.8h28.1M143.8 150.8h7M192.9 150.8h7M438.5 150.8h210.5M663 150.8h70.2M796.3 150.8h49.1M87.7 157.9h28.1M136.8 157.9h7M214 157.9h7M438.5 157.9h210.5M670 157.9h56.1M796.3 157.9h42.1M101.7 164.9h42.1M438.5 164.9h217.5M677.1 164.9h35.1M796.3 164.9h28.1M129.8 171.9h35.1M438.5 171.9h217.5M677.1 171.9h28.1M803.4 171.9h14M150.8 178.9h14M438.5 178.9h245.6M803.4 178.9h14M157.9 185.9h7M214 185.9h7M438.5 185.9h231.5M705.1 185.9h0M810.4 185.9h7M164.9 192.9h0M200 192.9h7M221 192.9h28.1M445.5 192.9h252.6M810.4 192.9h7M192.9 200h70.2M452.5 200h245.6M824.4 200h0M192.9 207h77.2M459.6 207h238.6M824.4 207h0M192.9 214h98.2M473.6 214h0M529.7 214h161.4M192.9 221h98.2M543.8 221h140.3M185.9 228h112.3M543.8 228h133.3M178.9 235h126.3M543.8 235h126.3M178.9 242.1h140.3M543.8 242.1h119.3M178.9 249.1h168.4M550.8 249.1h105.2M178.9 256.1h175.4M550.8 256.1h105.2M185.9 263.1h175.4M557.8 263.1h98.2M192.9 270.1h161.4M557.8 270.1h98.2M192.9 277.1h154.4M557.8 277.1h105.2M200 284.2h147.3M557.8 284.2h105.2M698.1 284.2h0M200 291.2h140.3M550.8 291.2h112.3M698.1 291.2h0M207 298.2h133.3M550.8 298.2h105.2M684.1 298.2h14`}},j=A.hero,M=A.routes,N=A.offices,P=A.map,F=N.items,I=`/* ============================================================
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
`,L=`
.acx{width:100%;background:var(--an-paper);color:var(--an-text);font:var(--an-body);-webkit-font-smoothing:antialiased;container-type:inline-size;container-name:acx}
.acx *{box-sizing:border-box}
.acx :focus-visible{outline:2px solid var(--an-focus);outline-offset:2px}
.acx a{color:var(--an-link)}
.acx .wrap{max-width:var(--an-container);margin:0 auto;padding:0 var(--an-gutter)}
@container acx (max-width:809.98px){.acx .wrap{padding:0 var(--an-space-4)}}
.acx .eyebrow{display:flex;align-items:center;gap:var(--an-space-2);font:var(--an-eyebrow);letter-spacing:var(--an-eyebrow-tracking);text-transform:uppercase;color:var(--an-primary-text);margin:0 0 18px}
.acx .eyebrow::before{content:"";flex:none;width:22px;border-top:var(--an-hairline)}
.acx .eyebrow i{flex:none;width:var(--an-node-eyebrow);height:var(--an-node-eyebrow);border-radius:50%;background:var(--an-primary);margin-left:-8px}
.acx h2{font:600 clamp(26px,3vw,30px)/1.16 var(--an-font-display);letter-spacing:var(--an-h2-tracking);margin:0;text-wrap:balance}
.acx .sub{color:var(--an-text-secondary);margin:12px 0 0;max-width:62ch;font-size:17px}
.acx .sec{padding:clamp(56px,7vw,96px) 0 0}
/* The one ink band on the page. On ink every text element is solid white or the one muted tone. */
.acx .hero{background:var(--an-ink);color:var(--an-text-on-ink);padding:clamp(48px,6vw,96px) 0 clamp(48px,6vw,96px)}
.acx .hero .eyebrow{color:var(--an-on-ink)}
.acx .hero .eyebrow::before{border-top:var(--an-hairline-on-ink)}
.acx .hero .eyebrow i{background:var(--an-on-ink)}
.acx .hero .grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,500px);gap:var(--an-space-12);align-items:center}
@container acx (max-width:979.98px){.acx .hero .grid{grid-template-columns:1fr;gap:var(--an-space-8)}}
.acx h1{font:600 clamp(44px,6.4vw,76px)/1.02 var(--an-font-display);letter-spacing:var(--an-display-tracking);margin:0}
.acx .lead{font:var(--an-lead);color:var(--an-text-on-ink);margin:22px 0 0;max-width:40ch}
.acx .direct{list-style:none;margin:0;padding:0;display:grid;gap:var(--an-space-3)}
.acx .direct li{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:var(--an-space-4);align-items:center;background:var(--an-ink-raised);border:1px solid var(--an-border-on-ink);border-radius:var(--an-radius-lg);padding:18px 20px;transition:border-color var(--an-duration-base) var(--an-ease),transform var(--an-duration-base) var(--an-ease)}
.acx .direct li:hover,.acx .direct li:focus-within{border-color:var(--an-on-ink);transform:translateY(-2px)}
.acx .direct .ic{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid var(--an-border-on-ink);color:var(--an-on-ink)}
.acx .direct .ic svg{width:22px;height:22px}
.acx .direct span{display:block;font:var(--an-small);color:var(--an-text-on-ink-muted)}
.acx .direct a.v{display:block;margin-top:2px;font:600 clamp(18px,2vw,22px)/1.25 var(--an-font-display);color:var(--an-text-on-ink);text-decoration:none;overflow-wrap:anywhere}
.acx .direct a.v::after{content:"";position:absolute;inset:0;border-radius:inherit}
.acx .direct .go{color:var(--an-on-ink);font:600 20px/1 var(--an-font)}
.acx .direct .copy{position:relative;z-index:1;min-height:36px;padding:0 14px;border-radius:var(--an-radius-md);border:1px solid var(--an-border-on-ink);background:transparent;color:var(--an-text-on-ink);font:600 13px/1 var(--an-font);cursor:pointer}
.acx .direct .copy:hover{border-color:var(--an-on-ink);color:var(--an-on-ink)}
@container acx (max-width:479.98px){.acx .direct li{grid-template-columns:36px minmax(0,1fr) auto;gap:var(--an-space-3);padding:14px}.acx .direct .ic{width:36px;height:36px}.acx .direct .ic svg{width:18px;height:18px}.acx .direct a.v{font-size:17px}.acx .direct .copy{padding:0 10px}}
/* Who to reach: one card per reader. */
.acx .routes{list-style:none;margin:var(--an-space-8) 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--an-space-4)}
@container acx (max-width:1079.98px){.acx .routes{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container acx (max-width:559.98px){.acx .routes{grid-template-columns:1fr}}
.acx .routes li{display:flex;flex-direction:column;background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-lg);padding:22px;transition:box-shadow var(--an-duration-base) var(--an-ease),border-color var(--an-duration-base) var(--an-ease)}
.acx .routes li:hover{box-shadow:var(--an-shadow-md);border-color:var(--an-plum-100)}
.acx .routes h3{font:var(--an-h3);letter-spacing:var(--an-h3-tracking);margin:0}
.acx .routes p{margin:8px 0 16px;font:var(--an-small);color:var(--an-text-secondary)}
.acx .routes .ls{margin-top:auto;display:grid;gap:6px;padding-top:14px;border-top:var(--an-hairline)}
.acx .routes .ls a{font:600 14px/1.4 var(--an-font);text-decoration:none;overflow-wrap:anywhere}
.acx .routes .ls a:hover{color:var(--an-link-hover);text-decoration:underline}
/* Offices: the dotted map beside the office cards. */
.acx .off{display:grid;gap:var(--an-space-4);margin-top:var(--an-space-8)}
.acx .map-card{margin:0;background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-xl);padding:clamp(16px,2vw,28px)}
.acx .map{display:block;width:100%;height:auto}
.acx .map .lbl{font:600 28px/1 var(--an-font-display);fill:var(--an-text);paint-order:stroke;stroke:var(--an-surface);stroke-width:6px;stroke-linejoin:round}
.acx .map .ring{fill:var(--an-plum-100);opacity:0;transition:opacity var(--an-duration-base) var(--an-ease)}
.acx .map .on .ring{opacity:1}
@container acx (max-width:559.98px){.acx .map .lbl{font-size:40px}}
.acx .cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--an-space-4)}
@container acx (max-width:899.98px){.acx .cards{grid-template-columns:1fr}}
.acx .cards li{display:flex;flex-direction:column;background:var(--an-surface);border:1px solid var(--an-border);border-radius:var(--an-radius-lg);padding:20px 22px;transition:border-color var(--an-duration-base) var(--an-ease),box-shadow var(--an-duration-base) var(--an-ease)}
.acx .cards li.on{border-color:var(--an-primary);box-shadow:var(--an-shadow-md)}
.acx .cards .top{display:flex;align-items:baseline;justify-content:space-between;gap:var(--an-space-3);flex-wrap:wrap}
.acx .cards h3{font:var(--an-h3);letter-spacing:var(--an-h3-tracking);margin:0}
.acx .cards .role{font:500 12px/1 var(--an-font-mono);letter-spacing:.06em;color:var(--an-primary-text);background:var(--an-plum-50);border-radius:var(--an-radius-sm);padding:6px 8px}
.acx .cards address{font-style:normal;margin:10px 0 0;color:var(--an-text-secondary)}
.acx .cards address span{display:block}
.acx .cards .meta{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:auto;padding-top:12px;font:var(--an-small);color:var(--an-text-tertiary)}
.acx .cards .meta b{font:500 14px/1.6 var(--an-font-mono);font-variant-numeric:tabular-nums;color:var(--an-text);display:inline-block;min-width:8ch}
.acx .cards .meta a{font-weight:600;text-decoration:none}
.acx .cards .meta a:hover{text-decoration:underline}
.acx .faq-s{padding:clamp(56px,7vw,96px) 0 clamp(56px,8vw,104px)}
.acx .faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 var(--an-space-12);margin-top:var(--an-space-6)}
@container acx (max-width:759.98px){.acx .faq{grid-template-columns:1fr}}
.acx .faq>div{padding:22px 0;border-top:var(--an-hairline)}
.acx .faq h3{font:var(--an-h3);font-size:18px;letter-spacing:var(--an-h3-tracking);margin:0}
.acx .faq p{color:var(--an-text-secondary);margin:8px 0 0;max-width:62ch}
@media (prefers-reduced-motion:reduce){.acx *{transition:none !important;scroll-behavior:auto !important}.acx .direct li:hover,.acx .direct li:focus-within{transform:none}}
`,R={email:l(`path`,{d:`M3 6.5h18v11H3zM3.5 7l8.5 6.5L20.5 7`}),phone:l(`path`,{d:`M6.6 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z`}),demo:l(`path`,{d:`M3 5.5h13v13H3zM16 10l5-3v10l-5-3`})},z=({kind:e})=>l(`svg`,{viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinejoin:`round`,strokeLinecap:`round`,"aria-hidden":`true`,children:R[e]}),B=e=>/^https?:/.test(e),V=(e,t)=>{try{return new Intl.DateTimeFormat(`en-US`,{hour:`numeric`,minute:`2-digit`,timeZone:e}).format(t)}catch{return``}}})),U,W,G,K,q,J,Y,X,Z,Q,$;e((()=>{d(),x(),g(),n(),H(),D(),U=y(k),W={Ix8G9j4yA:`(max-width: 809.98px)`,SnAkIwGwz:`(min-width: 810px) and (max-width: 1199.98px)`,T4goTUvXy:`(min-width: 1200px)`},G=[],K=`framer-HJuUq`,q={Ix8G9j4yA:`framer-v-1b1i6zp`,SnAkIwGwz:`framer-v-1h0uncw`,T4goTUvXy:`framer-v-10k7gma`},J=(e,t,n)=>e&&t?`position`:n,Y={Desktop:`T4goTUvXy`,Phone:`Ix8G9j4yA`,Tablet:`SnAkIwGwz`},X=({value:e})=>E()?null:l(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),Z=({height:e,id:t,width:n,...r})=>({...r,variant:Y[r.variant]??r.variant??`T4goTUvXy`}),Q=T(u(function(e,n){let r=p(null),i=n??r,o=a(),{activeLocale:u,setLocale:d}=re();ee();let{style:f,className:g,layoutId:y,variant:x,...T}=Z(e);w(t(()=>ae({},u),[u]));let[E,ie]=te(x,W,!1),D=b(K),O=s(C)?.isLayoutTemplate,A=!!s(m)?.transition?.layout,j=J(O,A);return v({}),l(C.Provider,{value:{activeVariantId:E,humanReadableVariantMap:Y,primaryVariantId:`T4goTUvXy`,variantClassNames:q},children:c(h,{id:y??o,children:[l(X,{value:`html body { background: none; }`}),l(_.main,{...T,className:b(D,`framer-10k7gma`,g),ref:i,style:{...f},children:l(ne,{children:l(S,{className:`framer-1k3jjgh-container`,"data-code-component-plugin-id":`api`,"data-framer-name":`Contact Page`,isAuthoredByUser:!0,layout:j,name:`Contact Page`,nodeId:`MsxkDnxdY`,scopeId:`XdZH_4LZm`,children:l(k,{height:`100%`,id:`MsxkDnxdY`,layoutId:`MsxkDnxdY`,name:`Contact Page`,style:{width:`100%`},width:`100%`})})})}),l(`div`,{id:`overlay`})]})})}),[`.framer-HJuUq.framer-1bvucq3, .framer-HJuUq .framer-1bvucq3 { display: block; }`,`.framer-HJuUq.framer-10k7gma { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-HJuUq .framer-1k3jjgh-container { flex: none; height: auto; position: relative; width: 100%; }`,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-HJuUq.framer-10k7gma { width: 810px; }}`,`@media (max-width: 809.98px) { .framer-HJuUq.framer-10k7gma { width: 390px; }}`],`framer-HJuUq`),Q.displayName=`Contact`,Q.defaultProps={height:3013,width:1200},ie(Q,[{explicitInter:!0,fonts:[]},...U],{supportsExplicitInterCodegen:!0}),$={exports:{Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},default:{type:`reactComponent`,name:`FramerXdZH_4LZm`,slots:[],annotations:{framerLayoutTemplateFlowEffect:`true`,framerAcceptsLayoutTemplate:`true`,framerResponsiveScreen:`true`,framerIntrinsicHeight:`3013`,framerScrollSections:`false`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"SnAkIwGwz":{"layout":["fixed","auto"]},"Ix8G9j4yA":{"layout":["fixed","auto"]}}}`,framerAutoSizeImages:`true`,framerImmutableVariables:`true`,framerColorSyntax:`true`,framerDisplayContentsDiv:`false`,framerIntrinsicWidth:`1200`,framerComponentViewportWidth:`true`,framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{$ as __FramerMetadata__,Q as default,G as queryParamNames};
//# sourceMappingURL=0ZY0djO0ZgQE5bT7bMSRrSrnUoERKiU7yaVMFuk0yvk.DfXXKo5b.mjs.map