import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,C as n,F as r,L as i,N as a,S as o,g as s,k as c,l,o as u,p as d,s as f,v as p,y as m}from"./react.BKyTRiZ3.mjs";import{a as h,r as g,t as _,w as v}from"./motion.D-Nk57UM.mjs";import{$ as y,A as b,C as x,I as S,X as ee,a as te,b as ne,c as C,et as re,i as ie,nt as ae,rt as oe,st as se,tt as ce,y as w}from"./framer.CAQJ1n1h.mjs";import le,{t as T}from"./LDh3Sw91NxW6LyTLV1rLekcsZoWSzA0nE3HYeJnHh8o.CxeeuO2H.mjs";function E({cur:e,id:t}){return l(`div`,{className:`stage-top`,children:[l(`div`,{children:[u(`p`,{className:`rail-l`,id:t,children:P.rail.label}),u(`ol`,{className:`rail`,"aria-labelledby":t,children:P.rail.steps.map((t,n)=>l(`li`,{className:n===e?`on`:void 0,"aria-current":n===e?`step`:void 0,children:[u(`i`,{}),u(`a`,{href:P.hero.journey.steps[n].href,onClick:B,children:t})]},t))})]}),u(`p`,{className:`progress`,"aria-hidden":`true`,children:u(`b`,{children:u(`i`,{})})})]})}function D({id:e,eyebrow:t,h2:n,intro:r}){return l(`div`,{className:`story-head`,children:[l(`div`,{children:[u(`p`,{className:`eyebrow`,children:t}),u(`h2`,{id:e,children:n})]}),u(`p`,{className:`intro`,children:r})]})}function O({beats:e}){let t=e=>P.hero.legend.find(t=>t.mode===e)?.label;return u(`ol`,{className:`beats`,children:e.map((e,n)=>l(`li`,{className:`beat`,children:[l(`div`,{className:`bhead`,children:[u(`p`,{className:`bnum`,children:String(n+1).padStart(2,`0`)}),u(`h3`,{children:e.title})]}),l(`div`,{className:`bbody`,children:[u(`p`,{className:`bline`,children:e.line}),e.detail?u(`p`,{className:`bdetail`,children:e.detail}):null]}),l(`div`,{className:`bside`,children:[e.flows?u(`ul`,{className:`bflows`,children:e.flows.map(e=>l(`li`,{children:[u(`span`,{children:e.flow}),` `,u(`span`,{className:`pill ${e.mode}`,children:t(e.mode)})]},e.flow))}):null,u(`p`,{className:`prods`,children:e.products.map(e=>l(a,{children:[u(F,{l:e}),` `]},e.label))})]})]},e.title))})}function k({l:e,body:t,link:n,at:r,win:i}){return u(`div`,{className:`fone lock`,"data-win":i.join(`,`),children:l(`div`,{className:`scr`,children:[u(`p`,{className:`clock`,children:e.time}),u(`p`,{className:`date`,children:e.date}),l(`p`,{className:`note k`,"data-at":r,children:[l(`small`,{children:[e.app,` · `,e.from]}),t,` `,u(`b`,{children:n})]})]})})}function A({sc:e,win:t}){return u(`div`,{className:`fone`,"data-win":t.join(`,`),children:l(`div`,{className:`scr form`,children:[u(`p`,{className:`who`,children:e.step}),e.plan?l(`p`,{className:`plan`,children:[u(`b`,{children:e.plan.name}),e.plan.member]}):null,e.cost?l(`p`,{className:`cost`,children:[e.cost.label,` `,u(`b`,{children:e.cost.value})]}):null,e.cards.map(e=>l(`p`,{className:`fc`,children:[u(`b`,{children:e.title}),e.body,e.thumbs?u(`span`,{className:`thumbs`,children:e.thumbs.map(e=>l(`span`,{children:[u(H,{k:e}),e]},e))}):null,e.report?u(`span`,{className:`rp`,children:e.report.map(e=>u(`span`,{children:e},e))}):null,e.choice?u(`span`,{className:`pill automated`,children:e.choice}):null,e.sign?u(`small`,{children:e.sign}):null]},e.title)),e.button?u(`p`,{className:`fbtn`,children:e.button}):null]})})}function j({call:e,at:t,win:n}){let r=P.booked.phone;return u(`div`,{className:`fone dark`,"data-win":n.join(`,`),children:l(`div`,{className:`scr`,children:[u(`p`,{className:`who`,children:r.center}),u(`p`,{className:`sub`,children:e.label}),l(`div`,{className:`tiles`,"aria-hidden":`true`,children:[l(`p`,{className:`tile`,children:[l(`span`,{className:`av ai`,children:[u(`i`,{}),u(`i`,{}),u(`i`,{})]}),r.agent]}),l(`p`,{className:`tile`,children:[u(`span`,{className:`av pt`,children:`AR`}),r.patient]})]}),e.lines.map((e,n)=>l(`p`,{className:`ln ${e.who===`Agent`?`agent`:`pt`} k`,"data-at":t[n],children:[u(`small`,{children:e.who}),e.text]},n))]})})}function ue(){let e=P.booked,t=e.phone,n=e.panel,r=e=>e.join(`,`),i=(e,t)=>n.taken.some(([n,r])=>n===e&&r===t);return u(`section`,{id:`booked`,className:`story booked`,"aria-labelledby":`ajp-booked`,style:{"--beats":e.beats.length},children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:1,id:`ajp-rail-2`}),u(D,{id:`ajp-booked`,eyebrow:e.eyebrow,h2:e.h2,intro:e.intro}),u(`div`,{className:`bk-view`,children:l(`div`,{className:`bk`,"data-fit":`1120,520`,children:[l(`div`,{className:`phones`,children:[u(k,{l:{...t.lock,from:t.center},body:t.text.body,link:t.text.link,at:V.note,win:V.win.lock}),u(`div`,{className:`fone`,"data-win":r(V.win.visit),children:u(`img`,{src:t.visit.src,width:t.visit.width,height:t.visit.height,alt:t.visit.alt,loading:`lazy`,decoding:`async`})}),u(`div`,{className:`fone dark`,"data-win":r(V.win.incoming),children:l(`div`,{className:`scr`,children:[u(`p`,{className:`sub`,children:t.incoming.label}),u(`p`,{className:`big`,"aria-hidden":`true`,children:`G`}),u(`p`,{className:`name`,children:t.center}),l(`div`,{className:`keys`,children:[l(`p`,{className:`key no`,children:[u(`i`,{"aria-hidden":`true`}),t.incoming.decline]}),l(`p`,{className:`key yes`,children:[u(`i`,{"aria-hidden":`true`}),t.incoming.accept]})]})]})}),u(j,{call:t.call_out,at:V.call_out,win:V.win.call_out}),u(`div`,{className:`fone dark`,"data-win":r(V.win.outgoing),children:l(`div`,{className:`scr`,children:[u(`p`,{className:`sub`,children:t.outgoing.label}),u(`p`,{className:`big`,"aria-hidden":`true`,children:`G`}),u(`p`,{className:`name`,children:t.center}),u(`div`,{className:`keys`,children:u(`p`,{className:`key no`,children:u(`i`,{"aria-hidden":`true`})})})]})}),u(j,{call:t.call_in,at:V.call_in,win:V.win.call_in}),u(`div`,{className:`fone`,"data-win":r(V.win.confirm),children:l(`div`,{className:`scr`,children:[u(`p`,{className:`who`,children:t.center}),u(`p`,{className:`who`,children:t.confirm.at}),l(`p`,{className:`bub`,children:[t.confirm.body,` `,u(`b`,{children:t.confirm.link})]})]})})]}),l(`div`,{className:`bkp`,style:{"--days":n.days.length,"--early":n.early},children:[l(`p`,{className:`bkp-h`,children:[u(`b`,{children:n.title}),` `,u(`span`,{children:n.device})]}),l(`div`,{className:`slots`,children:[u(`p`,{className:`lead-t k`,"data-at":V.early,children:u(`span`,{children:n.early_label})}),l(`div`,{className:`row`,children:[u(`span`,{}),` `,n.days.map(e=>u(`span`,{className:`dh`,children:e},e))]}),n.times.map((e,t)=>l(`div`,{className:`row`,children:[u(`span`,{className:`tl`,children:e}),n.days.map((r,a)=>{let o=n.booked[0]===a&&n.booked[1]===t;return u(`span`,{className:i(a,t)?`cell taken`:o?`cell mine`:a<n.early?`cell early`:`cell`,"data-at":o?V.mine:a<n.early?V.early:void 0,"aria-hidden":`true`,children:e},r)})]},e))]}),u(`dl`,{children:n.checks.map((e,t)=>l(`div`,{className:`k`,"data-at":V.checks[t],children:[u(`dt`,{children:e.term}),u(`dd`,{children:e.value})]},e.term))}),u(`p`,{className:`st k`,"data-at":V.status,children:u(`span`,{className:`pill ok`,children:n.status})})]})]})}),u(O,{beats:e.beats})]})})})}function de(){let e=P.authorized,t=e=>e.join(`,`),n=0;return u(`section`,{id:`authorized`,className:`story authorized`,"aria-labelledby":`ajp-auth`,style:{"--beats":e.beats.length},children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:2,id:`ajp-rail-3`}),u(D,{id:`ajp-auth`,eyebrow:e.eyebrow,h2:e.h2,intro:e.intro}),u(`div`,{className:`az-view`,children:l(`div`,{className:`az`,"data-fit":`1120,600`,children:[u(`div`,{className:`az-sc rules`,"data-win":t(U.win.rules),children:l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:e.rules.title}),u(`dl`,{className:`kv`,children:e.rules.rows.map(e=>l(`div`,{children:[u(`dt`,{children:e.term}),u(`dd`,{children:e.value})]},e.term))}),u(`p`,{className:`k`,"data-at":U.result,children:u(`span`,{className:`pill warn`,children:e.rules.result})}),u(`p`,{className:`okline k`,"data-at":U.booking,children:l(`span`,{children:[l(`b`,{children:[e.rules.booking.term,`:`]}),` `,e.rules.booking.value,u(`small`,{children:e.rules.booking.note})]})})]})}),l(`div`,{className:`az-sc note`,"data-win":t(U.win.note),children:[l(`p`,{className:`pnote`,children:[u(`span`,{className:`cap`,children:e.note.caption}),e.note.segments.map((e,t)=>e.mark?u(`span`,{className:`hl`,"data-at":U.found[n++],children:e.text},t):u(a,{children:e.text},t))]}),l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:e.note.criteria.title}),u(`ul`,{className:`crit`,children:e.note.criteria.items.map((e,t)=>u(`li`,{className:`k`,"data-at":U.crit[t],children:e},e))}),u(`p`,{className:`k`,"data-at":U.ready,children:u(`span`,{className:`pill ok`,children:e.note.criteria.result})})]})]}),l(`figure`,{className:`az-sc wide`,"data-win":t(U.win.portal),style:{margin:0},children:[l(`div`,{className:`portal`,children:[u(`img`,{src:e.portal.src_large,srcSet:`${e.portal.src} 960w, ${e.portal.src_large} ${e.portal.width}w`,sizes:`(max-width: 960px) 100vw, 1136px`,width:e.portal.width,height:e.portal.height,alt:e.portal.alt,loading:`lazy`,decoding:`async`}),u(`iframe`,{srcDoc:e.portal.html,title:e.portal.label,loading:`lazy`,sandbox:`allow-scripts`,"aria-hidden":`true`,tabIndex:-1})]}),u(`figcaption`,{className:`fcap`,children:e.portal.label})]}),u(`div`,{className:`az-sc order`,"data-win":t(U.win.order),children:l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:e.order.title}),u(`dl`,{className:`kv`,children:e.order.rows.map((e,t)=>l(`div`,{className:`k`,"data-at":U.rows[t],children:[u(`dt`,{children:e.term}),u(`dd`,{children:t===0?u(`span`,{className:`pill ok`,children:e.value}):e.value})]},e.term))})]})})]})}),u(O,{beats:e.beats})]})})})}function fe(){let e=P.arrives,t=e.phone,n=e.panel;return u(`section`,{id:`arrives-ready`,className:`story arrives`,"aria-labelledby":`ajp-arrives`,style:{"--beats":e.beats.length},children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:3,id:`ajp-rail-4`}),u(D,{id:`ajp-arrives`,eyebrow:e.eyebrow,h2:e.h2,intro:e.intro}),u(`div`,{className:`bk-view`,children:l(`div`,{className:`bk`,"data-fit":`1120,520`,children:[l(`div`,{className:`phones`,children:[u(k,{l:t.lock,body:t.text.body,link:t.text.link,at:W.note,win:W.lock}),t.screens.map((e,t)=>u(A,{sc:e,win:W.win[t]},e.step))]}),l(`div`,{className:`bkp`,children:[u(`p`,{className:`bkp-h`,children:u(`b`,{children:n.title})}),u(`dl`,{children:n.items.map((e,t)=>l(`div`,{className:`k`,"data-at":W.items[t],children:[u(`dt`,{children:e.term}),u(`dd`,{children:e.value})]},e.term))}),l(`p`,{className:`kiosk k`,"data-at":W.kiosk,children:[u(`img`,{src:n.kiosk.src,width:n.kiosk.width,height:n.kiosk.height,alt:n.kiosk.alt,loading:`lazy`,decoding:`async`}),n.kiosk.label]}),u(`p`,{className:`st k`,"data-at":W.status,children:u(`span`,{className:`pill ok`,children:n.status})})]})]})}),u(O,{beats:e.beats})]})})})}function pe(){let e=P.report,t=e.phone,n=e.panel;return u(`section`,{id:`report-back`,className:`story report`,"aria-labelledby":`ajp-report`,style:{"--beats":e.beats.length},children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:4,id:`ajp-rail-5`}),u(D,{id:`ajp-report`,eyebrow:e.eyebrow,h2:e.h2,intro:e.intro}),u(`div`,{className:`bk-view`,children:l(`div`,{className:`bk`,"data-fit":`1120,520`,children:[l(`div`,{className:`phones`,children:[u(k,{l:t.lock,body:t.text.body,link:t.text.link,at:G.note,win:G.lock}),t.screens.map(e=>u(A,{sc:e,win:G.win},e.step))]}),l(`div`,{className:`bkp`,children:[l(`div`,{className:`outside`,children:[u(`p`,{className:`ch`,children:n.outside.label}),u(`ol`,{children:n.outside.steps.map((e,t)=>u(`li`,{className:`k`,"data-at":G.outside[t],children:e},e))})]}),l(`div`,{className:`rep k`,"data-at":G.report,children:[u(`p`,{className:`ch`,children:n.report.caption}),n.report.lines.map((e,t)=>u(`p`,{children:u(`span`,{className:`hl`,"data-at":G.lines[t],children:e.text})},t)),u(`p`,{className:`k`,"data-at":G.result,children:u(`span`,{className:`pill ok`,children:n.report.result})})]}),u(`p`,{className:`bkp-h`,children:u(`b`,{children:n.title})}),u(`dl`,{children:n.items.map((e,t)=>l(`div`,{className:`k`,"data-at":G.items[t],children:[u(`dt`,{children:e.term}),u(`dd`,{children:e.value})]},e.term))}),u(`p`,{className:`st k`,"data-at":G.status,children:u(`span`,{className:`pill ok`,children:n.status})})]})]})}),u(O,{beats:e.beats})]})})})}function me(){let e=P.paid,t=e.claim,n=(e,t)=>l(`div`,{className:`k`,"data-at":t,children:[u(`dt`,{children:e.term}),u(`dd`,{children:e.value})]},e.term);return u(`section`,{id:`paid`,className:`story paid`,"aria-labelledby":`ajp-paid`,style:{"--beats":e.beats.length},children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:5,id:`ajp-rail-6`}),u(D,{id:`ajp-paid`,eyebrow:e.eyebrow,h2:e.h2,intro:e.intro}),u(`div`,{className:`az-view`,children:l(`div`,{className:`az`,"data-fit":`1120,600`,children:[l(`div`,{className:`az-sc ready wide`,"data-win":K.win.ready.join(`,`),children:[l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:e.ready.title}),u(`dl`,{className:`kv ticks`,children:e.ready.items.map((e,t)=>n(e,K.items[t]))})]}),l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:t.title}),u(`dl`,{className:`kv`,children:n(t.charge,K.charge)}),u(`p`,{className:`outside k`,"data-at":K.sent,children:t.sent}),u(`p`,{className:`ch k`,"data-at":K.remit,children:t.remit}),u(`dl`,{className:`kv`,children:t.rows.map((e,t)=>n(e,K.rows[t]))}),u(`p`,{className:`k`,"data-at":K.status,children:u(`span`,{className:`pill paid`,children:t.status})})]})]}),u(`div`,{className:`az-sc loop`,"data-win":K.win.loop.join(`,`),children:l(`div`,{className:`card`,children:[u(`p`,{className:`ch`,children:e.loop.title}),u(`ol`,{className:`tl`,children:e.loop.steps.map((e,t)=>l(`li`,{className:`k`,"data-at":K.steps[t],children:[u(`b`,{children:e.term}),u(`span`,{children:e.value})]},e.term))})]})})]})}),u(O,{beats:e.beats})]})})})}function M(){let{hero:e,story:t,under:n,faq:r}=P,{screen:a}=t,o=m(null),[c,d]=s(!1);return p(()=>{if(i===void 0||!i.matchMedia)return;let e=i.matchMedia(`(prefers-reduced-motion: reduce)`),t=i.matchMedia(`(min-width: 960px) and (min-height: 640px)`),n=()=>d(!e.matches&&t.matches);return n(),e.addEventListener?.(`change`,n),t.addEventListener?.(`change`,n),()=>{e.removeEventListener?.(`change`,n),t.removeEventListener?.(`change`,n)}},[]),p(()=>{let e=o.current;if(!c||!e)return;let t=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--an-header-h`))||0,n=[...e.querySelectorAll(`.story`)].map(e=>({sec:e,stage:e.querySelector(`.stage`),beats:[...e.querySelectorAll(`.beat`)],parts:[...e.querySelectorAll(`[data-at]`)],wins:[...e.querySelectorAll(`[data-win]`)].map(e=>({n:e,w:(e.dataset.win||`0,1`).split(`,`).map(Number)})),bar:e.querySelector(`.progress b i`),fit:e.querySelector(`[data-fit]`),walk:e.querySelector(`.portal iframe`),last:-1})),r=e.querySelector(`.story .rtf`)?.closest(`.story`),a=r?.querySelector(`.rtf-anim svg`),s=r?.querySelector(`.rtf`),l=r?.querySelector(`.rtf-stage`),u=r?.querySelector(`.rtf-machine`);a?.pauseAnimations?.();let d=!1,f=()=>{d=!1;let e=t();for(let t of n){let n=t.sec.getBoundingClientRect(),i=n.height-t.stage.offsetHeight,o=i>0?Math.min(1,Math.max(0,(e-n.top)/i)):1,c=Math.min(t.beats.length-1,Math.floor(o*t.beats.length));if(t.beats.forEach((e,t)=>e.classList.toggle(`on`,t===c)),t.parts.forEach(e=>e.classList.toggle(`on`,o>=parseFloat(e.dataset.at||`0`))),t.wins.forEach(({n:e,w:t})=>e.classList.toggle(`on`,o>=t[0]&&o<t[1])),t.bar&&(t.bar.style.width=`${(o*100).toFixed(1)}%`),t.fit?.parentElement){let[e,n]=(t.fit.dataset.fit||`1,1`).split(`,`).map(Number),r=t.fit.parentElement,i=Math.min(1.25,r.clientWidth/e,r.clientHeight/n);t.fit.style.transform=`translate(${((r.clientWidth-e*i)/2).toFixed(1)}px,${((r.clientHeight-n*i)/2).toFixed(1)}px) scale(${i.toFixed(4)})`}if(t.walk?.contentWindow){let e=Math.round(Math.min(1,Math.max(0,(o-U.play[0])/(U.play[1]-U.play[0])))*U.walk*20)/20;e!==t.last&&(t.last=e,t.walk.contentWindow.postMessage({anSeek:e},`*`))}if(t.sec!==r||!s||!l)continue;a?.setCurrentTime?.(z(o));let[d,f,p,m]=R(o),h=s.clientWidth,g=s.clientHeight,_=(p-d)*1232,v=(m-f)*620,y=Math.min(1.8,.94*h/_,.94*g/v),b=h/2-(d+p)/2*1232*y,x=g/2-(f+m)/2*620*y;l.style.transform=`translate(${b.toFixed(1)}px,${x.toFixed(1)}px) scale(${y.toFixed(4)})`;let S=Math.min(1,Math.max(0,(o-.04)/.13));l.style.setProperty(`--feed`,S.toFixed(3)),u?.classList.toggle(`busy`,S>0&&S<1),l.style.setProperty(`--order`,Math.min(1,Math.max(0,(o-.18)/.08)).toFixed(3))}},p=()=>{d||(d=!0,requestAnimationFrame(f))};return i.addEventListener(`scroll`,p,{passive:!0}),i.addEventListener(`resize`,p),f(),()=>{i.removeEventListener(`scroll`,p),i.removeEventListener(`resize`,p);for(let e of n)[...e.beats,...e.parts,...e.wins.map(e=>e.n)].forEach(e=>e.classList.remove(`on`)),e.fit&&(e.fit.style.transform=``);a?.unpauseAnimations?.(),l&&(l.style.transform=``,l.style.removeProperty(`--order`),l.style.removeProperty(`--feed`)),u?.classList.remove(`busy`)}},[c]),l(`div`,{ref:o,className:c?`ajp live`:`ajp`,children:[u(`style`,{dangerouslySetInnerHTML:{__html:P.css}}),u(`section`,{className:`hero ink`,"aria-labelledby":`ajp-h1`,children:l(`div`,{className:`wrap`,children:[u(`nav`,{"aria-label":`Breadcrumb`,children:l(`ol`,{className:`crumbs`,children:[u(`li`,{children:u(`a`,{href:`/`,children:`Home`})}),u(`li`,{"aria-current":`page`,children:e.eyebrow})]})}),u(`div`,{className:`hero-copy`,children:l(`div`,{children:[u(`p`,{className:`eyebrow`,children:e.eyebrow}),u(`h1`,{id:`ajp-h1`,children:e.h1}),u(`p`,{className:`lead`,children:e.lead}),u(`p`,{className:`kicker`,children:e.kicker}),l(`div`,{className:`ctas`,children:[u(`a`,{className:`btn btn-primary`,href:e.primary_cta.href||`/demo`,children:e.primary_cta.label}),u(F,{l:e.secondary_cta,className:`btn btn-secondary`})]}),u(`ul`,{className:`legend`,children:e.legend.map(e=>l(`li`,{children:[u(`span`,{className:`pill ${e.mode}`,children:e.label}),` `,u(`span`,{children:e.text})]},e.mode))})]})}),l(`figure`,{className:`jr`,children:[u(`ol`,{children:e.journey.steps.map((e,t)=>u(`li`,{className:t===4?`st gap`:`st`,style:{"--i":t+1},children:l(`a`,{href:e.href,onClick:B,children:[u(`b`,{children:e.name}),u(`span`,{children:e.note})]})},e.name))}),u(`p`,{className:`out`,children:e.journey.outside}),l(`p`,{className:`span`,children:[u(`b`,{children:e.journey.span.name}),` `,u(`span`,{children:e.journey.span.note})]})]})]})}),u(`section`,{id:`order-in`,className:`story`,"aria-labelledby":`ajp-story`,children:u(`div`,{className:`stage`,children:l(`div`,{className:`wrap stage-in`,children:[u(E,{cur:0,id:`ajp-rail`}),u(D,{id:`ajp-story`,eyebrow:t.eyebrow,h2:t.h2,intro:t.intro}),l(`figure`,{className:`rtf`,children:[l(`div`,{className:`rtf-stage`,children:[l(`div`,{className:`rtf-machine`,children:[u(`i`,{className:`lamp`,"aria-hidden":`true`}),u(`b`,{children:a.machine.status}),u(`span`,{children:a.machine.from}),u(`i`,{className:`feed`,"aria-hidden":`true`,children:u(`i`,{})})]}),u(`div`,{className:`rtf-faxwrap`,children:u(`img`,{className:`rtf-fax`,src:a.fax.src,width:a.fax.width,height:a.fax.height,alt:a.fax.alt,loading:`lazy`,decoding:`async`})}),u(`img`,{className:`rtf-order`,src:a.order.src_large,srcSet:`${a.order.src} 800w, ${a.order.src_large} ${a.order.width}w`,sizes:`(max-width: 700px) 100vw, 1600px`,width:a.order.width,height:a.order.height,alt:a.order.alt,loading:`lazy`,decoding:`async`}),u(`div`,{className:`rtf-anim`,dangerouslySetInnerHTML:{__html:a.svg}})]}),u(`figcaption`,{children:a.label})]}),u(O,{beats:t.beats})]})})}),u(ue,{}),u(de,{}),u(`p`,{className:`mcta`,children:u(`a`,{className:`btn btn-primary`,href:P.hero.primary_cta.href||`/demo`,children:P.hero.primary_cta.label})}),u(fe,{}),u(pe,{}),u(me,{}),u(`section`,{className:`ink`,"aria-labelledby":`ajp-under`,children:l(`div`,{className:`wrap`,children:[u(`p`,{className:`eyebrow`,children:n.eyebrow}),u(`h2`,{id:`ajp-under`,children:n.h2}),u(`ul`,{className:`under`,children:n.items.map(e=>l(`li`,{children:[u(F,{l:e.product}),` `,u(`p`,{children:e.text})]},e.product.label))}),u(`a`,{className:`btn btn-primary`,href:n.cta.href||`/demo`,children:n.cta.label})]})}),u(`section`,{"aria-labelledby":`ajp-faq`,children:l(`div`,{className:`wrap`,children:[u(`p`,{className:`eyebrow`,children:r.eyebrow}),u(`h2`,{id:`ajp-faq`,children:r.h2}),u(`div`,{className:`faq`,children:r.items.map(e=>l(`div`,{children:[u(`h3`,{children:e.q}),u(`p`,{children:e.a})]},e.q))})]})}),u(`script`,{type:`application/ld+json`,dangerouslySetInnerHTML:{__html:P.jsonLd.replace(/</g,`\\u003c`)}})]})}var N,P,F,I,L,R,z,B,V,H,U,W,G,K,he=e((()=>{r(),f(),n(),S(),N={hero:{eyebrow:`How Gravity runs the order`,h1:`Every step of the order, run for you.`,lead:`Where the work is routine, Gravity just does it. Where it takes intelligence, reading the fax, making the call, working the portal, Gravity’s agents do it, and your people either review the work or handle the exceptions.`,kicker:`Agents work the order. Your people work the exceptions.`,primary_cta:{label:`Book a demo →`,href:`/demo`},secondary_cta:{label:`What is an AOS?`,href:`/aos`},legend:[{mode:`agentic`,label:`Agentic`,text:`an agent acts end to end and hands what it can’t finish to a person`},{mode:`automated`,label:`Automated`,text:`an event or a schedule starts it, and fixed rules do it`}],journey:{steps:[{name:`Order in`,note:`Doc · Communication`,href:`#order-in`},{name:`Booked`,note:`Booking · Visit`,href:`#booked`},{name:`Authorized`,note:`PriorAuth`,href:`#authorized`},{name:`Arrives ready`,note:`Visit · Estimate · Pay`,href:`#arrives-ready`},{name:`Report back`,note:`Referral · Visit`,href:`#report-back`},{name:`Paid`,note:`Charge · Claim`,href:`#paid`}],outside:`The exam and the read · your RIS and PACS`,span:{name:`Gravity`,note:`does the work of the whole order, from the fax to the payment`}}},rail:{label:`The order’s journey`,steps:[`Order in`,`Booked`,`Authorized`,`Arrives ready`,`Report back`,`Paid`]},story:{eyebrow:`01 · Order in`,h2:`Every document is read, filed and turned into a complete order.`,intro:`Information systems record the work. An AOS does the work.`,beats:[{title:`It arrives, any way`,line:`Every conversation, whatever the channel, on one timeline for the order and the patient.`,detail:`The referral coordinator uploads the order in the portal and it is read and turned into a digital order at the imaging center.`,products:[{label:`Gravity Communication`,href:`/products/gravity-communication`},{label:`Gravity Referral`,href:`/products/gravity-referral`},{label:`Gravity Visit`,href:`/products/gravity-visit`}]},{title:`An agent reads it`,line:`Every page that arrives is classified, indexed and filed on the right record, with no one touching it.`,products:[{label:`Gravity Doc`,href:`/products/gravity-doc`}],flows:[{flow:`Automatic classification, indexing and linking`,mode:`agentic`}]},{title:`It becomes an order`,line:`Gravity reads the fax, finds the patient (or creates one for your team to review), and creates the order.`,detail:`An order is created automatically only when patient, provider and exam are all resolved, so incomplete or mislinked orders are not created.`,products:[{label:`Gravity Doc`,href:`/products/gravity-doc`}],flows:[{flow:`Automatic order creation`,mode:`agentic`}]},{title:`It’s checked before it moves on`,line:`When an order is created, anything missing is flagged before it moves on.`,products:[{label:`Gravity Doc`,href:`/products/gravity-doc`},{label:`Gravity Estimate`,href:`/products/gravity-estimate`}],flows:[{flow:`Order completeness check`,mode:`automated`},{flow:`Order appropriateness check`,mode:`agentic`},{flow:`Financial clearance`,mode:`agentic`}]},{title:`A person fixes the exception`,line:`When an order is created, coverage, eligibility and authorization gaps are flagged before the exam, for a person to resolve.`,detail:`Coverage and authorization are fixed before the exam, not discovered after the claim.`,products:[{label:`Gravity Work`,href:`/products/gravity-work`}]}],screen:{label:`A faxed order, read and turned into a digital order`,animation:`read-the-fax`,svg_file:`assets/animations/read-the-fax.svg`,machine:{status:`Incoming fax`,from:`(555) 010-0198 · Sample Family Medicine`},fax:{src:`https://framerusercontent.com/images/wwujSral4sK7TzwXvDREFfjo1FI.webp`,width:748,height:968,alt:`A handwritten, faxed imaging order for an MRI of the knee, a fictional sample marked not a valid order`},order:{src:`https://framerusercontent.com/images/PhExJfq1XdEOQRSQrFFCb4TBr6w.webp`,src_large:`https://framerusercontent.com/images/0Z8jh1PC9chM7yspMk6RThgaGqk.webp`,width:1600,height:1135,alt:`The digital order Gravity builds from the fax: patient, insurance, exam, diagnosis, referring provider and report delivery each verified, with clinical and insurance clearance`},svg:`<svg viewBox="0 0 1232 620" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><rect x="0.0" y="88.0" width="340.0" height="440.0" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;0.05;0.05;0;0" keyTimes="0.0000;0.2778;0.3000;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></rect><g opacity="0"><rect x="172.8" y="183.2" width="142.4" height="20.8" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="172.8" cy="183.2" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.0920;0.1059;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="132.8" y="245.6" width="182.4" height="12.0" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="132.8" cy="245.6" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1242;0.1381;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="172.8" y="225.6" width="142.4" height="8.8" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1122;0.1261;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="132.8" y="273.6" width="182.4" height="18.4" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="132.8" cy="273.6" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1416;0.1554;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="132.8" y="293.6" width="182.4" height="19.2" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="132.8" cy="293.6" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1529;0.1668;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="132.8" y="331.2" width="182.4" height="63.2" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="132.8" cy="331.2" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1860;0.1999;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="132.8" y="396.0" width="182.4" height="24.0" rx="1.5" fill="#6B3FE4" fill-opacity="0.08" stroke="#6B3FE4" stroke-width="1.3"/><circle cx="132.8" cy="396.0" r="5.7" fill="#6B3FE4"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.2111;0.2250;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g opacity="0"><rect x="4" y="-4" width="332" height="2" fill="#6B3FE4" opacity="0.22"/><rect x="4" y="-8" width="332" height="2" fill="#6B3FE4" opacity="0.15"/><rect x="4" y="-12" width="332" height="2" fill="#6B3FE4" opacity="0.1"/><rect x="4" y="-16" width="332" height="2" fill="#6B3FE4" opacity="0.06"/><rect x="4" y="-20" width="332" height="2" fill="#6B3FE4" opacity="0.03"/><rect x="0" y="-1" width="340" height="3" rx="1.5" fill="#6B3FE4"/><circle cx="340" cy="0.5" r="5" fill="#6B3FE4"/><animateTransform attributeName="transform" type="translate" values="0 88;0 88;0 528.0;0 528.0" keyTimes="0.0000;0.0333;0.2778;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.0306;0.0389;0.2722;0.2889;1.0000" dur="18.0s" repeatCount="indefinite"/></g><path d="M 315.2 362.8 C 353.6 362.8, 353.6 122.5, 392.0 122.5" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.1888;0.2166;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="362.8" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1888;0.1999;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><path d="M 315.2 408.0 C 353.6 408.0, 353.6 169.8, 392.0 169.8" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.2139;0.2417;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="408.0" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.2139;0.2250;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><path d="M 315.2 303.2 C 353.6 303.2, 353.6 217.2, 392.0 217.2" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.1557;0.1834;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="303.2" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1557;0.1668;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><path d="M 315.2 282.8 C 353.6 282.8, 353.6 253.6, 392.0 253.6" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.1443;0.1721;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="282.8" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1443;0.1554;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><path d="M 315.2 193.6 C 353.6 193.6, 353.6 289.9, 392.0 289.9" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.0948;0.1226;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="193.6" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.0948;0.1059;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><path d="M 315.2 251.6 C 353.6 251.6, 353.6 326.3, 392.0 326.3" fill="none" stroke="#8E67EA" stroke-width="1.3" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;1;0;0;1;1" keyTimes="0.0000;0.1270;0.1548;0.9111;0.9117;1.0000" dur="18.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0.0000;0.9111;0.9444;0.9994;1.0000" dur="18.0s" repeatCount="indefinite"/></path><circle cx="315.2" cy="251.6" r="2.4" fill="#6B3FE4" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1270;0.1381;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></circle><g><rect x="584.8" y="109.0" width="616.2" height="39.5" fill="#FFFFFF"/><rect x="592.7" y="117.7" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="112.2" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="122.5" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="119.3" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="122.5" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="122.5" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="122.5" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.2166;0.2360;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="156.4" width="616.2" height="39.5" fill="#FFFFFF"/><rect x="592.7" y="165.1" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="159.6" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="169.9" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="166.7" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="169.8" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="169.8" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="169.8" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.2417;0.2611;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="203.8" width="616.2" height="28.4" fill="#FFFFFF"/><rect x="592.7" y="212.5" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="207.0" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="217.3" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="214.1" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="217.2" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="217.2" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="217.2" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.1834;0.2029;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="240.2" width="616.2" height="28.4" fill="#FFFFFF"/><rect x="592.7" y="248.9" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="243.3" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="253.6" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="250.4" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="253.6" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="253.6" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="253.6" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.1721;0.1916;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="276.5" width="616.2" height="28.4" fill="#FFFFFF"/><rect x="592.7" y="285.2" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="279.7" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="289.9" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="286.8" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="289.9" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="289.9" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="289.9" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.1226;0.1420;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="312.8" width="616.2" height="28.4" fill="#FFFFFF"/><rect x="592.7" y="321.5" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="316.0" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="326.3" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="323.1" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="326.3" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="326.3" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="326.3" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.1548;0.1742;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="349.2" width="616.2" height="26.9" fill="#FFFFFF"/><rect x="592.7" y="357.9" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="352.3" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="362.6" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="359.5" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="362.6" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="362.6" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="362.6" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.3111;0.3306;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="584.8" y="456.6" width="616.2" height="26.9" fill="#FFFFFF"/><rect x="592.7" y="465.3" width="181.7" height="8.7" rx="4.0" fill="#E2E8F0"/><rect x="1123.6" y="459.8" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="470.1" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="466.9" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><circle cx="404.7" cy="470.1" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="470.1" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="470.1" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.4222;0.4417;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="591.9" y="381.6" width="15.8" height="15.8" fill="#FFFFFF"/><rect x="593.1" y="382.8" width="13.4" height="13.4" rx="3.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.3333;0.3444;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="591.9" y="403.7" width="15.8" height="15.8" fill="#FFFFFF"/><rect x="593.1" y="404.9" width="13.4" height="13.4" rx="3.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.3611;0.3722;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="591.9" y="425.8" width="15.8" height="15.8" fill="#FFFFFF"/><rect x="593.1" y="427.0" width="13.4" height="13.4" rx="3.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.3889;0.4000;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="591.9" y="489.0" width="15.8" height="15.8" fill="#FFFFFF"/><rect x="593.1" y="490.2" width="13.4" height="13.4" rx="3.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.4444;0.4556;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="591.9" y="511.1" width="15.8" height="15.8" fill="#FFFFFF"/><rect x="593.1" y="512.3" width="13.4" height="13.4" rx="3.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.2"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.4944;0.5056;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="1109.3" y="351.6" width="90.1" height="22.1" fill="#FFFFFF"/><rect x="1123.6" y="352.3" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="362.6" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="359.4" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.4000;0.4194;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><circle cx="404.7" cy="362.6" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="362.6" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="362.6" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.4000;0.4194;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="1109.3" y="459.0" width="90.1" height="22.1" fill="#FFFFFF"/><rect x="1123.6" y="459.8" width="74.3" height="20.5" rx="4.7" fill="#F1F5F9"/><circle cx="1134.6" cy="470.1" r="2.8" fill="#94A3B8"/><rect x="1142.5" y="466.9" width="45.8" height="6.3" rx="3.2" fill="#CBD5E1"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.5111;0.5306;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><circle cx="404.7" cy="470.1" r="10.3" fill="#FFFFFF"/><circle cx="404.7" cy="470.1" r="9.1" fill="#FFFFFF" stroke="#CDB9F8" stroke-width="1.4"/><circle cx="404.7" cy="470.1" r="2.4" fill="#CDB9F8"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.5111;0.5306;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><g><rect x="392.0" y="45.8" width="540.4" height="30.0" fill="#FFFFFF"/><rect x="395.2" y="52.1" width="237.0" height="17.4" rx="6.3" fill="#E2E8F0"/><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.2167;0.2389;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g><rect x="1022.4" y="20.5" width="178.5" height="28.4" fill="#FFFFFF"><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.5222;0.5417;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></rect><g><rect x="392.6" y="548.8" width="807.8" height="49.4" fill="#FFFFFF"/><rect x="393.6" y="549.8" width="805.8" height="47.4" rx="7.9" fill="#F3EEFE"/><rect x="433.9" y="570.5" width="725.2" height="6" rx="3" fill="#E7DDFC"/><rect x="433.9" y="570.5" width="0" height="6" rx="3" fill="#6B3FE4"><animate attributeName="width" values="0;0;90.7;90.7;181.3;181.3;272.0;272.0;362.6;362.6;453.3;453.3;543.9;543.9;634.6;634.6;725.2;725.2;0;0" keyTimes="0.0000;0.1226;0.1309;0.1548;0.1631;0.1721;0.1804;0.1834;0.1918;0.2166;0.2249;0.2417;0.2500;0.4000;0.4083;0.5111;0.5194;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></rect><animate attributeName="opacity" values="1;1;0;0;1;1" keyTimes="0.0000;0.5444;0.5667;0.9111;0.9444;1.0000" dur="18.0s" repeatCount="indefinite"/></g></svg>`}},booked:{eyebrow:`02 · Booked`,h2:`Booked right the first time, with every rule checked.`,intro:`Every order becomes an exam. Every open slot gets a patient.`,beats:[{title:`A text comes in`,line:`Once the order exists, the patient is texted or called to book, with a secure link straight to open slots, so the patient gets on the calendar.`,detail:`Patients book, move and cancel their own exam under the center’s booking rules: in the patient app, by voice with the AI voice agent, and by web chat.`,products:[{label:`Gravity Booking`,href:`/products/gravity-booking`},{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Booking outreach`,mode:`agentic`}]},{title:`The AI voice agent calls`,line:`An AI voice agent calls patients to book new appointments, confirm and move them, reads prep instructions, asks screening questions and logs every call.`,detail:`Safety, contrast and women’s screening questions, answered once and kept on the patient, so nobody is booked in the wrong spot and nothing is on paper.`,products:[{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Self-booking by voice: AI voice agent`,mode:`agentic`}]},{title:`The patient calls back, and the agent books the right slot`,line:`Every device, exam length, patient limit and gap checked on every booking, on a schedule built around each device, so the exam is booked right the first time.`,detail:`Slots too early for the authorization are greyed out, so no patient is booked before the payer is ready.`,products:[{label:`Gravity Booking`,href:`/products/gravity-booking`},{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Confirmations and reminders`,mode:`automated`}]}],phone:{center:`Gravity Imaging Center`,agent:`AI voice agent`,patient:`Alex Rivera`,lock:{time:`9:41`,date:`Monday, October 13`,app:`Messages`},text:{body:`Hi Alex, your MRI knee is ready to book. Pick a time that works for you:`,link:`Book your exam →`},visit:{src:`https://framerusercontent.com/images/ToFl9YPuJ1PPsspQkKwHG746Z0c.webp`,width:600,height:1258,alt:`Gravity Visit on a phone: picking a time, with the earliest slot at the nearest location and a time grid`},incoming:{label:`Incoming call`,accept:`Accept`,decline:`Decline`},call_out:{label:`On the call · 1:12`,lines:[{who:`Agent`,text:`Hi Alex, this is Gravity Imaging Center calling about the MRI Dr. Lee ordered. Can I help you book it?`},{who:`Alex`,text:`Yes, but I need to check my work schedule first.`},{who:`Agent`,text:`No problem. Before you go: do you have a pacemaker or any metal implants?`},{who:`Alex`,text:`No.`},{who:`Agent`,text:`Thanks, that’s noted. Call us back anytime and I’ll book it.`}]},outgoing:{label:`Calling…`},call_in:{label:`On the call · 0:48`,lines:[{who:`Agent`,text:`Thanks for calling Gravity Imaging Center. I can help you book the MRI Dr. Lee ordered.`},{who:`Alex`,text:`Is there anything next Tuesday morning?`},{who:`Agent`,text:`Tuesday the 21st at 9:40 at Main Street is open. Shall I book it?`},{who:`Alex`,text:`Yes, please.`},{who:`Agent`,text:`You’re booked. I’ll text you the prep instructions.`}]},confirm:{at:`Text message · now`,body:`You’re booked: MRI knee, Tue 10/21 at 9:40 AM, Main Street, MR 2.`,link:`Read your prep →`}},panel:{title:`GV1001166 · MRI knee without contrast · Alex Rivera`,device:`MR 2 · Main Street`,days:[`Tue 10/14`,`Thu 10/16`,`Mon 10/20`,`Tue 10/21`,`Wed 10/22`],times:[`8:00`,`9:40`,`11:20`,`1:00`],taken:[[2,0],[3,2],[4,1],[2,3]],early:2,booked:[3,1],early_label:`Before the authorization lead time`,checks:[{term:`Device`,value:`MR 2, built for the exam`},{term:`Exam length`,value:`45-minute slot`},{term:`Screening`,value:`Answered on the first call, kept on the patient`},{term:`Other visits`,value:`No clash that day`}],status:`Booked · Tue 10/21 · 9:40 AM`}},authorized:{eyebrow:`03 · Authorized`,h2:`Every exam that needs a prior authorization has one.`,intro:`Authorized before arrival. The denial is fixed before it exists.`,beats:[{title:`Does it need one?`,line:`Auth rules decide which exams need a prior authorization for each payer and code, with global and local rules, admin approval, verification and renewal.`,detail:`Per-insurance lead times grey out slots too early for authorization, waive once authorized, and flag moves outside the authorized window.`,products:[{label:`Gravity PriorAuth`,href:`/products/gravity-priorauth`},{label:`Gravity Booking`,href:`/products/gravity-booking`}],flows:[{flow:`Prior auth status checks`,mode:`automated`}]},{title:`Medical necessity, checked first`,line:`Before an authorization is requested, an agent checks the order and progress notes against the payer’s medical-necessity criteria, and flags what doesn’t meet them so it’s fixed before submission.`,products:[{label:`Gravity PriorAuth`,href:`/products/gravity-priorauth`}],flows:[{flow:`Medical necessity check`,mode:`agentic`}]},{title:`The agent works the payer portal`,line:`Authorizations submitted and tracked on payer portals without retyping the order.`,detail:`Stores each user’s portal logins in the extension so it can sign in to payer portals.`,products:[{label:`Gravity PriorAuth`,href:`/products/gravity-priorauth`}],flows:[{flow:`Submission and status on portals`,mode:`agentic`}]},{title:`Approved, on the order`,line:`One tab on the order holds every exam’s authorization details, status, number and dates, with pending and denied lists and manual updates.`,detail:`Coverage and authorization are fixed before the exam, not discovered after the claim.`,products:[{label:`Gravity PriorAuth`,href:`/products/gravity-priorauth`}]}],rules:{title:`Prior authorization rules`,rows:[{term:`Payer`,value:`Sample Health Plan · Commercial`},{term:`Exam`,value:`MRI knee without contrast · CPT 73721`},{term:`Rule`,value:`Prior authorization required`}],result:`Authorization required`,booking:{term:`Booked`,value:`Tue 10/21 · 9:40 AM`,note:`The slot leaves the lead time for the authorization`}},note:{caption:`Progress note · 10/09 · Jordan Lee, MD`,segments:[{text:`41-year-old woman with `},{text:`right knee pain and swelling after a fall six weeks ago`,mark:`found`},{text:`. `},{text:`Six weeks of physical therapy and anti-inflammatories without relief`,mark:`found`},{text:`. Positive McMurray test. `},{text:`X-ray 09/02: no fracture`,mark:`found`},{text:`. Plan: MRI right knee without contrast.`}],criteria:{title:`The payer’s medical-necessity criteria`,items:[`Symptoms and how long`,`Conservative treatment tried`,`Prior imaging`],result:`3 of 3 met · ready to submit`}},portal:{label:`Gravity’s agent checking an authorization on a payer portal and recording it on the order`,html_file:`assets/animations/prior-auth-agent.html`,src:`https://framerusercontent.com/images/r0X6tCsJnWi9piCgbl57fYKcwUQ.webp`,src_large:`https://framerusercontent.com/images/VphwxOOMkFhZ1PRwDl45WnKyvBs.webp`,width:1920,height:1080,alt:`Gravity on a sample payer portal: the authorization lookup result beside the Gravity panel, where patient, CPT and facility each match the order before the authorization is recorded`,html:`<!doctype html><html><head><meta charset="utf-8"><title>Prior Auth Agent Walkthrough</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600&family=Urbanist:wght@600&display=swap" rel="stylesheet">
<style>
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
:root{--slate:#2F4858;--slate-d:#22394A;--slate-l:#E8EEF2;--warn:#B45309;--warn-bg:#FFFBEB}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#0E0B19;font-family:Inter,system-ui,sans-serif;color:#1B1430}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;overflow:hidden}
/* browser chrome */
.chrome{position:absolute;left:0;top:0;width:1920px;height:96px;background:#1F1F23;color:#E6E6EA}
.tabs{height:44px;display:flex;align-items:flex-end;padding-left:96px;gap:4px}
.dots{position:absolute;left:20px;top:16px;display:flex;gap:9px}.dots i{width:13px;height:13px;border-radius:50%;display:block}
.tab{height:34px;width:290px;border-radius:10px 10px 0 0;padding:0 14px;display:flex;align-items:center;gap:9px;font-size:14px;color:#B9B9C2}
.tab.on{background:#35353B;color:#fff}.tab b{width:16px;height:16px;border-radius:4px;display:inline-block}
.urlrow{height:52px;background:#35353B;display:flex;align-items:center;padding:0 16px;gap:14px}
.nav3{display:flex;gap:16px;color:#9a9aa3;font-size:18px}
.url{flex:1;height:36px;border-radius:18px;background:#1F1F23;display:flex;align-items:center;padding:0 18px;font-size:15.5px;color:#DADAE0;gap:10px}
.url .lock{width:14px;height:14px;border:2px solid #9a9aa3;border-radius:3px}
/* extension bar */
.ext{position:absolute;top:96px;left:0;width:1920px;height:80px;background:#fff;border-bottom:1px solid var(--an-border);display:flex;align-items:center;padding:0 22px;gap:12px;z-index:5}
.ext .logo svg{height:26px;width:auto;display:block}
.ext .sep{width:1px;height:44px;background:var(--an-border);margin:0 8px}
.chip{border:1px solid var(--an-border);border-radius:10px;padding:7px 12px;min-width:150px;line-height:1.25}
.chip .k{font:600 10.5px 'JetBrains Mono';letter-spacing:.08em;color:var(--an-text-tertiary);text-transform:uppercase}
.chip .v{font-size:14px;font-weight:600;color:var(--an-text)}.chip .s{font-size:12.5px;color:var(--an-text-secondary)}
.seg{display:flex;border:1px solid var(--an-border-strong);border-radius:10px;overflow:hidden;margin-left:8px}
.seg div{padding:10px 18px;font-size:14.5px;font-weight:500}.seg div+div{border-left:1px solid var(--an-border-strong)}
.authchip{display:flex;align-items:center;gap:8px;border-radius:999px;padding:8px 14px;font-size:13.5px;font-weight:600;background:var(--warn-bg);color:var(--warn);border:1px solid #FDE68A}
.authchip i{width:8px;height:8px;border-radius:50%;background:currentColor}
.authchip.ok{background:var(--an-success-bg);color:var(--an-success-text);border-color:#A7F3D0}
.assist{margin-left:auto;display:flex;align-items:center;gap:12px;background:var(--an-paper);border:1px solid var(--an-border);border-radius:14px;padding:8px 16px 8px 8px;width:470px}
.assist .av{width:34px;height:34px;border-radius:50%;background:var(--an-plum-600);display:grid;place-items:center}
.assist .t{font-size:14.5px;color:var(--an-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.assist .t small{display:block;font:600 10px 'JetBrains Mono';letter-spacing:.1em;color:var(--an-plum-700)}
/* portal */
.portal{position:absolute;top:176px;left:0;width:1920px;height:904px;background:#fff;overflow:hidden}
.pbar{position:absolute;top:0;left:0;height:3px;background:var(--slate);z-index:3}
.phead{height:84px;display:flex;align-items:center;padding:0 40px;gap:14px;border-bottom:1px solid #DDE3E8}
.pmark{width:38px;height:38px;border-radius:9px;background:var(--slate);display:grid;place-items:center;color:#fff;font:700 18px Inter}
.pname{font:700 24px Inter;color:var(--slate-d);letter-spacing:-.01em}.pname span{display:block;font:500 12.5px Inter;color:#6B7C88;letter-spacing:0}
.samp{margin-left:auto;font:600 11px 'JetBrains Mono';letter-spacing:.12em;color:#8A5A00;background:#FFF4D6;border:1px dashed #E0B44C;padding:6px 10px;border-radius:6px}
.pnav{display:flex;background:var(--slate)}
.pnav div{padding:15px 26px;color:#fff;font-weight:600;font-size:15.5px;border-right:1px solid rgba(255,255,255,.15)}
.pnav div.on{background:#4F7183}
.pdate{display:flex;justify-content:space-between;padding:12px 40px;font-size:14.5px;color:#46555F}
.pdate u{color:#2B5F7A}
.page{position:absolute;top:166px;left:0;right:0;bottom:0;padding:18px 40px;visibility:hidden}
.page.show{visibility:visible}
h2{font:700 26px Inter;color:var(--slate-d);margin-bottom:22px;letter-spacing:-.01em}
.tiles{display:grid;grid-template-columns:repeat(3,330px);gap:22px}
.tile{border:1px solid #CFD8DE;border-radius:10px;padding:26px 24px;background:#F8FAFB}
.tile b{display:block;font-size:19px;color:var(--slate-d);margin-bottom:6px}.tile span{font-size:14px;color:#5D6B75}
.tile .ic{width:40px;height:40px;border-radius:8px;background:var(--slate-l);margin-bottom:16px;display:grid;place-items:center;color:var(--slate);font-weight:700}
fieldset{border:1px solid #CFD8DE;border-radius:10px;padding:24px 28px 26px;width:760px;margin-bottom:22px;background:#FBFCFD}
legend{font-weight:700;color:var(--slate-d);padding:0 8px;font-size:15px}
.row{display:flex;align-items:center;margin-bottom:16px}.row label{width:260px;font-size:16px;color:#33434E}
.inp{width:380px;height:44px;border:1px solid #AEBBC4;border-radius:6px;background:#fff;display:flex;align-items:center;padding:0 14px;font-size:16.5px;position:relative;transition:none}
.inp .ph{color:#9AA7B0}.inp .v{font-family:Inter;color:#1B1430}
.inp.focus{border-color:var(--an-plum-600)}
.inp.filled{background:var(--an-plum-50);border-color:var(--an-plum-600)}
.inp.filled::after{content:'';position:absolute;right:12px;top:13px;width:18px;height:18px;border-radius:50%;background:var(--an-plum-600) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'><path d='M5 9.3l2.6 2.6L13 6.5' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>")}
.sel::before{content:'';position:absolute;right:16px;top:17px;border:6px solid transparent;border-top-color:#5D6B75}
.sel.filled::before{display:none}
.caret{display:inline-block;width:2px;height:20px;background:var(--an-plum-600);margin-left:1px;vertical-align:-4px}
.opts{position:absolute;left:-1px;top:46px;width:380px;background:#fff;border:1px solid #AEBBC4;border-radius:6px;box-shadow:0 10px 24px rgba(0,0,0,.12);z-index:4;visibility:hidden}
.opts div{padding:11px 14px;font-size:15.5px}.opts div.hov{background:var(--slate-l)}
.btn{display:inline-block;background:var(--slate);color:#fff;font-weight:700;font-size:15px;letter-spacing:.04em;padding:13px 26px;border-radius:6px}
.btnrow{padding-left:260px}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:520px;gap:22px;color:#46555F;font-size:17px}
.spin{width:54px;height:54px;border-radius:50%;border:5px solid var(--slate-l);border-top-color:var(--slate)}
.res{border:1px solid #CFD8DE;border-radius:10px;width:1060px;padding:10px 0;background:#FBFCFD}
.res .r{display:flex;padding:9px 28px;font-size:16.5px}.res .r b{width:300px;font-weight:500;color:#46555F}.res .r span{color:#1B1430;font-weight:500}
.res .r.hd{background:#F1F5F7}
.badge{display:inline-flex;align-items:center;gap:8px;padding:4px 12px;border-radius:999px;background:var(--an-success-bg);color:var(--an-success-text);font-weight:700;font-size:15px;border:1px solid #A7F3D0}
.badge i{width:8px;height:8px;border-radius:50%;background:var(--an-success)}
/* gravity panel */
.panel{position:absolute;top:0;right:0;width:470px;height:904px;background:#fff;border-left:1px solid var(--an-border);box-shadow:-18px 0 40px rgba(27,20,48,.12);z-index:6;padding:28px 30px}
.panel .eb{font:600 11px 'JetBrains Mono';letter-spacing:.12em;color:var(--an-plum-700)}
.panel h3{font:600 27px Urbanist;margin:6px 0 4px;letter-spacing:-.01em}.panel p{font-size:14px;color:var(--an-text-secondary);margin-bottom:22px}
.chk{display:flex;align-items:center;gap:14px;padding:13px 16px;border:1px solid var(--an-border);border-radius:10px;margin-bottom:10px;font-size:15.5px}
.chk .c{width:24px;height:24px;border-radius:50%;border:2px solid var(--an-border-strong);display:grid;place-items:center}
.chk.ok .c{background:var(--an-success);border-color:var(--an-success)}
.chk .c svg{opacity:0}.chk.ok .c svg{opacity:1}
.chk .m{margin-left:auto;font-size:13px;color:var(--an-text-tertiary)}
.panel .lab{font-size:13px;font-weight:600;color:var(--an-text-secondary);margin:18px 0 7px}
.panel .inp{width:100%}
.pbtn{margin-top:26px;background:var(--an-plum-600);color:#fff;font-weight:600;font-size:16px;text-align:center;padding:14px;border-radius:10px}
.pbtn.done{background:var(--an-success-bg);color:var(--an-success-text);border:1px solid #A7F3D0}
/* overlay */
.ring{position:absolute;border:2.5px solid var(--an-plum-600);border-radius:10px;box-shadow:0 0 0 6px rgba(107,63,228,.16);pointer-events:none;z-index:20;opacity:0}
.tag{position:absolute;pointer-events:none;z-index:21;opacity:0;background:var(--an-plum-600);color:#fff;font:600 12px 'JetBrains Mono';letter-spacing:.1em;padding:5px 9px;border-radius:6px;white-space:nowrap;display:flex;gap:7px;align-items:center}
.tag em{font-style:normal;font-family:Inter;font-weight:500;letter-spacing:0;font-size:12.5px;opacity:.9}
#cursor{position:absolute;z-index:30;left:0;top:0;pointer-events:none;will-change:transform}
#cursor .lbl{position:absolute;left:24px;top:26px;background:#1B1430;color:#fff;font:600 11px 'JetBrains Mono';letter-spacing:.08em;padding:4px 8px;border-radius:6px;white-space:nowrap}
#ripple{position:absolute;z-index:29;width:20px;height:20px;border-radius:50%;border:3px solid var(--an-plum-600);pointer-events:none;opacity:0}
.toast{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);background:#1B1430;color:#fff;border-radius:14px;padding:12px 12px 12px 22px;display:flex;align-items:center;gap:18px;z-index:25;box-shadow:0 14px 34px rgba(0,0,0,.25);font-size:16px;min-width:560px}
.toast .tx{flex:1}.toast .tx small{display:block;font:600 10.5px 'JetBrains Mono';letter-spacing:.12em;color:var(--an-plum-300);margin-bottom:2px}
.toast .to{background:var(--an-plum-600);padding:10px 18px;border-radius:10px;font-weight:600;font-size:15px}
.toast .dn{background:var(--an-success-bg);color:var(--an-success-text);padding:10px 18px;border-radius:10px;font-weight:600;font-size:15px;display:none}
#dim{position:absolute;inset:0;background:rgba(27,20,48,.55);z-index:40;opacity:0}
.card{position:absolute;left:50%;top:50%;width:820px;transform:translate(-50%,-50%);background:#fff;border-radius:22px;z-index:41;opacity:0;padding:48px 56px;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.card .eb{font:600 13px 'JetBrains Mono';letter-spacing:.14em;color:var(--an-plum-700)}
.card .hd{display:flex;align-items:center;gap:22px;margin:16px 0 8px}
.card .ok{width:72px;height:72px;border-radius:50%;background:var(--an-outcome);display:grid;place-items:center;flex:none}
.card h1{font:600 56px Urbanist;letter-spacing:-.02em;line-height:1.05}
.card .sub{font-size:20px;color:var(--an-text-secondary);margin-bottom:28px}
.card .node{display:flex;align-items:center;margin:0 0 26px}.card .node i{height:2px;background:var(--an-plum-600);flex:1}.card .node b{width:12px;height:12px;border-radius:50%;background:var(--an-plum-600)}
.card .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 36px}
.card .grid div small{display:block;font:600 11px 'JetBrains Mono';letter-spacing:.1em;color:var(--an-text-tertiary);margin-bottom:3px}
.card .grid div{font-size:18px;font-weight:600}
.card .foot{margin-top:30px;font-size:13px;color:var(--an-text-tertiary)}
</style></head><body><div id="stage">
<div class="chrome">
  <div class="dots"><i style="background:#FF5F57"></i><i style="background:#FEBC2E"></i><i style="background:#28C840"></i></div>
  <div class="tabs"><div class="tab"><b style="background:var(--an-plum-600)"></b>Gravity · Orders</div><div class="tab on"><b style="background:var(--slate)"></b>Sample Payer Portal – Authorization</div></div>
  <div class="urlrow"><div class="nav3">&#8592; &#8594; &#8635;</div><div class="url"><span class="lock"></span><span id="url">portal.samplepayer.example/home</span></div></div>
</div>
<div class="ext">
  <div class="logo"><svg width="2636" height="480" viewBox="0 0 2636 480" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_143_53)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1147.91 164.205C1173.76 163.846 1198.68 173.907 1217.03 192.124C1235.48 210.464 1244.72 235.548 1244.46 261.241C1244.28 286.202 1234.15 310.032 1216.35 327.43L1216.36 327.436L1215.21 328.548C1196.39 346.725 1171.97 355.509 1146.07 354.82C1130.67 354.418 1118.04 351.348 1106.64 345.608C1096.16 340.331 1086.85 332.862 1077.46 323.399C1077.41 324.592 1077.36 325.932 1077.32 327.401C1077.15 333.361 1077.06 341.33 1077.01 350.004C1076.92 367.348 1077 387.446 1077.06 399.809L1077.08 410.255L1077.07 413.38L1055.32 413.39L1055.28 178.966L1077.07 178.893L1077.04 197.181C1084.35 188.954 1091.89 182.312 1100.38 177.164C1111.08 170.679 1123.14 166.65 1137.88 164.684L1137.93 164.679L1137.96 164.676H1137.97L1138.02 164.672L1138.06 164.666C1141.33 164.419 1144.62 164.264 1147.9 164.205H1147.91ZM1220.49 248.668C1214.36 209.05 1177.4 181.818 1137.77 187.746C1097.86 193.712 1070.4 231.01 1076.56 270.915C1082.72 310.786 1120.14 338.014 1160 331.66C1198.95 325.432 1225.75 289.433 1220.75 250.522L1220.49 248.668Z" fill="#0E0E0E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1980.92 165.01C2033.6 158.118 2081.86 195.31 2088.65 248.024C2095.43 300.73 2058.13 348.856 2005.42 355.519C1952.89 362.163 1904.9 324.995 1898.14 272.53C1891.38 219.987 1928.43 171.896 1980.92 165.01ZM2065.08 248.815C2059.03 209.085 2021.95 181.764 1982.22 187.755C1942.44 193.767 1915.04 230.944 1921.11 270.757C1927.17 310.55 1964.37 337.843 2004.15 331.722C2043.86 325.61 2071.13 288.544 2065.08 248.815Z" fill="#0E0E0E"/>
<path d="M2582.98 174.892C2595.27 174.426 2605.44 176.821 2613.14 183.137C2620.84 189.445 2625.58 199.258 2627.96 212.562L2628.42 215.097L2611.9 221.592L2608.48 222.93L2607.68 219.344C2606.28 213.02 2605.77 209.055 2602.28 204.702C2595.79 196.571 2586.85 194.585 2579.42 196.935C2571.97 199.291 2565.76 206.095 2564.98 216.332L2564.96 216.442C2564.47 223.249 2567.69 228.886 2572.93 233.874C2577.56 238.293 2583.51 241.939 2589.14 245.143L2591.52 246.488C2603.14 253.028 2614.89 260.428 2623.27 270.25C2631.75 280.188 2636.74 292.565 2634.99 308.749V308.767V308.856C2633.5 321.946 2627.05 334.017 2617.02 342.599L2617.04 342.619L2615.68 343.718C2608.61 349.446 2601.7 352.68 2594.38 354.207C2587.11 355.723 2579.57 355.524 2571.33 354.622H2571.31L2571.23 354.612L2571.15 354.6L2571.06 354.582L2570.98 354.562C2562.9 352.809 2555.3 349.172 2548.88 343.958C2542.46 338.768 2538.13 333.192 2535.25 326.906C2532.74 321.436 2531.4 315.546 2530.64 309.117L2530.36 306.329L2530.11 303.646L2551.08 298.417L2551.55 301.92C2552.42 308.774 2554.02 314.708 2556.92 319.613C2559.79 324.453 2564.01 328.449 2570.4 331.322L2571.84 331.927C2579.09 334.756 2587.14 334.789 2594.45 331.994C2601.14 329.39 2607.24 323.776 2609.8 317.076C2612.53 309.934 2613.2 303.979 2612.54 298.893C2611.87 293.817 2609.82 289.395 2606.74 285.348C2600.48 277.124 2590.22 270.706 2579.21 263.887L2578.8 263.666L2578.7 263.566C2567.48 256.599 2555.48 249.164 2548.37 238.999C2544.72 233.773 2542.32 227.792 2541.91 220.784C2541.5 213.803 2543.08 206.008 2547.07 197.148L2547.48 196.246C2551.99 187.032 2560.39 181.599 2568.95 177.991C2573.39 176.114 2578.17 175.076 2582.98 174.892Z" fill="#0E0E0E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1538.38 164.53C1557.12 163.291 1573.3 165.448 1587.84 171.703C1600.12 176.988 1611.08 185.138 1621.36 196.36L1621.29 178.791L1643.22 178.716L1643.09 350.434L1621.41 350.624V323.23C1615.39 329.905 1610.33 334.372 1601.63 340.748L1601.59 340.771L1601.48 340.851L1601.44 340.872C1591 347.461 1579.35 351.905 1567.19 353.931C1541.7 358.183 1513.99 352.73 1492.87 337.215C1472.52 322.254 1458.99 299.859 1455.24 274.877L1455.22 274.862L1454.87 272.322V272.304C1447.97 218.194 1484.55 172.593 1538.12 164.56L1538.13 164.559L1538.2 164.549L1538.23 164.542L1538.26 164.539L1538.33 164.534H1538.35L1538.38 164.53ZM1621.62 248.817C1615.52 208.779 1577.98 181.418 1538.03 187.878C1498.59 194.249 1471.65 231.236 1477.65 270.75L1477.96 272.593C1484.8 311.09 1520.98 337.395 1559.93 331.844C1599.36 326.218 1626.84 290.031 1621.89 250.714L1621.62 248.817Z" fill="#0E0E0E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2308.22 350.466L2287.46 350.586L2287.06 350.328L2286.67 350.071C2286.25 349.803 2286 349.505 2285.92 349.415L2285.03 348.339L2285.23 346.96C2285.89 342.267 2285.82 331.884 2285.72 323.606C2281.69 328.043 2278.32 331.305 2272.55 336.134L2271.87 336.699L2271.43 336.764L2271.25 336.789C2259.46 344.987 2247.05 350.692 2232.72 353.498C2207.64 358.426 2181.56 353.293 2160.24 339.183V339.18L2160.22 339.173V339.172C2139.27 325.075 2124.78 303.325 2119.93 278.59C2107.27 213.588 2160.26 158.115 2225.73 164.46C2240.36 165.882 2252.44 170.815 2264.06 177.865L2266.39 179.303V179.312L2268.83 180.888L2268.87 180.913L2268.92 180.939L2269 181.007L2269.03 181.029L2273.48 184.44L2273.49 184.459L2273.54 184.501L2275.81 186.4C2279.67 189.721 2282.48 192.57 2285.49 195.869L2285.69 120.267V75.1641H2308.22V350.466ZM2285.89 249.594C2280.29 209.872 2243.63 182.199 2203.95 187.616L2203.64 187.66C2163.81 193.281 2136.06 230.149 2141.7 270.008C2147.33 309.838 2184.2 337.501 2224.03 331.852L2225.92 331.561C2264.7 325.035 2291.44 288.784 2285.89 249.594Z" fill="#0E0E0E"/>
<path d="M2492.32 202.893C2492.32 204.196 2492.33 205.611 2492.35 207.123L2492.45 217.292V217.3L2492.46 218.344L2492.58 229.742C2492.7 241.701 2492.78 255.069 2492.58 267.333C2492.45 275.508 2492.2 283.229 2491.77 289.732C2491.32 296.166 2490.71 301.634 2489.77 305.182C2487.23 314.738 2482.38 323.515 2475.71 330.813L2475.72 330.833L2474.67 331.94C2461.33 345.924 2442.06 353.04 2422.87 353.368C2403.67 353.695 2384.2 347.238 2370.44 333.647C2362.14 325.476 2356.31 315.176 2353.6 303.852C2350.59 291.657 2350.85 272.129 2351.03 257.501C2351.07 254.502 2351.1 251.694 2351.1 249.149L2351.27 178.819L2373.36 178.683L2373.21 249.41C2373.21 251.588 2373.16 254.059 2373.13 256.687C2373.03 263.18 2372.91 270.78 2373.15 277.954C2373.36 284.718 2373.87 290.902 2374.88 295.366L2375.1 296.268C2376.95 303.578 2380.53 310.327 2385.51 315.914L2386.55 317.042L2386.61 317.113C2404.56 336.156 2437.8 336.655 2456.22 318.055L2456.24 318.043L2457.4 316.855C2463.01 310.831 2466.98 303.427 2468.9 295.351L2469.25 293.612C2470.01 289.415 2470.39 283.639 2470.55 277.331C2470.75 270.154 2470.65 262.512 2470.57 256.123C2470.53 253.629 2470.5 251.297 2470.5 249.291L2470.24 178.885L2492.33 178.672L2492.32 202.893Z" fill="#0E0E0E"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M861.414 71.7735L861.893 72.6213C862.408 73.6145 863.026 75.0192 863.693 76.6057C864.625 78.8301 865.768 81.7073 867.046 85.0142C869.601 91.6312 872.724 100.045 875.842 108.566C882.065 125.566 888.336 143.204 889.981 147.719L963.955 350.499L942.844 350.405L940.683 350.392L939.916 348.376C927.305 315.066 915.193 280.891 903.006 247.368L814.787 247.528L777.603 348.409L777.606 348.412L776.848 350.479L753.523 350.42L755.243 346.121L757.373 340.726C768.021 313.525 778.396 283.129 788.41 255.727L857.999 66.4141L861.414 71.7735ZM858.444 127.098C846.722 159.416 834.681 194.151 822.404 226.054L859.789 226.121L894.666 226.104C891.08 216.022 883.114 193.506 875.229 171.755C870.569 158.897 865.945 146.343 862.293 136.832C860.832 133.027 859.526 129.727 858.444 127.098Z" fill="#0E0E0E"/>
<path d="M1709.57 75.2091L1710.02 75.9892L1710.48 76.7725V76.7758L1832.74 289.032L1832.81 289.072L1833.02 289.425L1842.72 305.839V75.2224L1864.36 75.3099L1864.44 350.38L1842.82 350.372L1841.91 348.812C1798.15 273.76 1751.67 195.322 1709.18 119.246L1709.23 350.398L1686.82 350.501L1687.23 314.365C1687.99 236.77 1688.12 154.543 1687.13 78.3507L1687.08 75.1562L1709.57 75.2091Z" fill="#0E0E0E"/>
<path d="M1011.84 75.1876L1011.78 350.494L990.063 350.441L990.089 75.1562L1011.84 75.1876Z" fill="#0E0E0E"/>
<path d="M1301.87 183.61C1313.91 174.392 1328.65 169.165 1343.96 168.813H1343.97C1362.81 168.471 1381.92 174.713 1395.73 188.145L1395.75 188.157L1396.7 189.11L1396.72 189.122C1417.03 209.794 1416.3 238.733 1415.77 264.398V264.43C1415.74 266.333 1415.71 268.226 1415.67 270.101L1415.61 275.689L1415.48 350.494L1393.85 350.463L1394 275.925C1394 273.154 1394.04 270.158 1394.08 267.061V266.976C1394.25 252.561 1394.41 235.877 1391.79 224.471C1384.08 204.288 1368.45 191.432 1346.44 190.579C1337.28 190.226 1327.37 192.615 1319.22 197.443C1311.09 202.26 1304.88 209.381 1302.66 218.446C1301.46 223.369 1301.56 229.303 1301.7 235.544L1301.7 235.554L1301.71 235.671L1301.71 235.762V235.783C1301.78 239.062 1301.84 242.407 1301.66 245.517C1301.61 247.469 1301.59 249.492 1301.6 251.543L1301.65 257.76L1301.71 263.666L1301.75 350.279L1280.02 350.329L1279.98 75.2091L1301.8 75.1562L1301.87 183.61Z" fill="#0E0E0E"/>
<path d="M384.662 311.445C422.991 339.571 437.737 364.203 448.411 419.462C455.402 442.392 457.18 459.045 457.098 461.514C456.99 461.524 434.696 463.49 431.049 457.562C428.359 453.191 393.137 388.587 361.359 335.843C369.286 327.877 377.052 319.733 384.662 311.445Z" fill="#DADADA" fill-opacity="0.25"/>
<path d="M96.8999 282.781C86.386 361.402 136.668 403.456 232.202 366.431C107.87 443.223 42.5043 398.884 53.0182 292.381L96.8999 282.781Z" fill="#DADADA" fill-opacity="0.25"/>
<path d="M54.8459 282.329C73.1304 199.593 157.86 143.825 220.317 178.565C178.721 169.88 109.698 216.962 98.2699 274.557L54.8459 282.329Z" fill="#DADADA" fill-opacity="0.25"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M501.435 2.1239C549.432 -6.10279 600.171 9.43834 591.942 51.0345C606.654 59.3752 613.076 65.6733 617.082 83.4885C640.22 89.4114 650.502 93.4884 659.382 102.029C660.109 102.73 660.488 103.718 660.436 104.728C660.155 110.409 659.635 113.736 658.043 117.207C657.591 118.195 657.282 119.249 657.229 120.335L656.731 130.791C656.51 135.443 655.107 139.961 652.656 143.921L651.097 146.438C650.706 147.069 650.744 147.874 651.152 148.496C655.022 154.374 654.948 159.713 653.651 165.767C652.279 172.167 647.252 174.909 642.223 175.367C642.223 175.367 637.204 175.499 633.538 174.909C629.873 174.319 627.133 174.289 624.854 174.453C622.583 174.613 618.032 176.268 617.997 176.281L612.407 178.727C611.263 179.226 610.057 179.588 608.814 179.703C606.14 179.953 604.172 179.773 601.084 179.024C604.391 194.015 602.778 202.757 594.684 218.791C594.841 195.96 592.684 186.61 584.628 176.281C589.367 200.665 585.295 207.993 557.203 201.422C577.593 233.517 580.557 249.888 559.944 274.1C558.888 264.938 557.684 261.294 555.116 258.663C554.636 258.171 553.83 258.462 553.684 259.133C545.4 297.601 535.58 317.128 503.921 344.323C503.792 344.434 503.693 344.581 503.642 344.743C491.731 382.48 494.863 425.402 499.889 437.325C504.924 449.275 527.282 441.356 527.282 462.939C528.895 478.768 520.388 476.763 494.851 479.584C480.717 480.222 467.281 479.584 463.944 476.056C460.609 472.528 457.013 463.982 457.098 461.513C457.18 459.044 455.402 442.391 448.411 419.461C437.737 364.204 422.991 339.57 384.664 311.444C416.313 276.974 445.295 239.989 472.191 202.777C498.487 166.392 518.48 122.826 556.324 91.226C567.221 82.1251 581.959 69.7636 581.959 69.7636C542.012 70.4841 501.778 99.3254 481.912 114.994C449.58 140.49 415.082 172.676 385.019 213.114C365.27 239.677 345.158 262.481 326.208 281.689C293.853 238.302 269.563 207.588 220.317 178.566C157.86 143.827 73.1304 199.594 54.8459 282.33H8.22083C8.23239 282.287 33.8346 183.129 107.87 142.455C181.92 101.773 217.117 135.599 256.428 141.999C295.74 148.398 350.172 136.514 403.616 118.686C390.36 136.056 381.218 139.256 354.705 151.141C383.504 147.484 426.913 131.943 413.216 105.43C408.727 96.7457 392.646 92.1746 362.934 105.43C369.344 95.9839 379.752 85.4914 392.646 79.8329C410.473 72.0095 426.014 74.3479 431.499 68.4051C414.586 59.7206 411.461 52.6029 410.473 37.3228C456.64 63.3762 493.209 17.2089 436.07 26.8089C473.427 6.31161 506.007 4.4111 559.031 24.0656C543.638 8.9409 529.776 5.29526 501.435 2.1239ZM655.938 100.403C653.061 105.84 649.399 105.921 640.853 103.145C647.688 109.484 650.359 113.516 652.281 121.887C659.679 110.773 660.965 104.516 655.938 100.403ZM603.664 81.7879C598.179 77.2168 578.981 84.0735 572.58 91.8441C572.594 91.8391 578.982 89.5602 581.723 90.4741C584.466 91.3879 587.665 97.7868 594.522 98.2446C598.81 98.5305 600.007 96.4168 606.406 95.9591C612.807 95.5013 617.834 95.9591 617.834 95.9591C617.834 95.9591 607.778 94.1296 603.206 89.5585C601.683 87.2729 601.836 84.5313 603.664 81.7879Z" fill="#0E0E0E"/>
<path d="M53.0182 292.391H5.47921C-8.48534 366.349 2.73589 414.438 56.6738 446.892C175.063 504.029 330.936 387.012 468.068 198.227C506.922 140.632 521.549 105.433 575.945 71.6094C523.377 83.0355 450.747 136.059 391.274 216.054C314.471 319.36 232.202 366.441 232.202 366.441C107.87 443.233 42.5043 398.894 53.0182 292.391Z" fill="url(#paint0_linear_143_53)"/>
</g>
<defs>
<linearGradient id="paint0_linear_143_53" x1="20.4651" y1="461.524" x2="597.55" y2="83.8436" gradientUnits="userSpaceOnUse">
<stop stop-color="#0E0E0E"/>
<stop offset="0.313534" stop-color="#0E0E0E"/>
<stop offset="0.751015" stop-color="#0E0E0E" stop-opacity="0"/>
<stop offset="1" stop-color="#0E0E0E" stop-opacity="0"/>
</linearGradient>
<clipPath id="clip0_143_53">
<rect width="2635.33" height="479.803" fill="white"/>
</clipPath>
</defs>
</svg>
</div><div class="sep"></div>
  <div class="chip"><div class="k">Patient</div><div class="v">Alex Rivera</div><div class="s">DOB 03/14/1985</div></div>
  <div class="chip"><div class="k">Payer</div><div class="v">Sample Health Plan</div><div class="s">ID SHP4471920</div></div>
  <div class="chip"><div class="k">Exam</div><div class="v">70551 · MRI brain w/o</div><div class="s">ICD R51.9 · 10/12 9:30 am</div></div>
  <div class="chip"><div class="k">Referring</div><div class="v">Maya Chen, MD</div><div class="s">NPI 1234567893</div></div>
  <div class="seg"><div>Submit</div><div>Status</div></div>
  <div class="authchip" id="authchip"><i></i><span>Prior auth · Pending</span></div>
  <div class="assist"><div class="av"><svg width="18" height="18" viewBox="0 0 18 18"><circle cx="4" cy="9" r="2.3" fill="#fff"/><circle cx="14" cy="9" r="2.3" fill="#fff"/><path d="M6.3 9h5.4" stroke="#fff" stroke-width="1.8"/></svg></div><div class="t"><small>GRAVITY</small><span id="say">Checking prior auth for this order.</span></div></div>
</div>
<div class="portal" id="portal">
  <div class="pbar" id="pbar"></div>
  <div class="phead"><div class="pmark">SP</div><div class="pname">Sample Payer Portal<span>Provider services · Utilization management</span></div><div class="samp">SAMPLE · FICTIONAL DATA</div></div>
  <div class="pnav"><div id="n-home" class="on">Home</div><div>Request an Auth</div><div id="n-look">Authorization Lookup</div><div>Eligibility Lookup</div><div>Clinical Certification</div><div>Resources</div><div>Help</div></div>
  <div class="pdate"><span>Wednesday, October 7, 2026 · 4:44 PM</span><u>Log off (GIC-OPS01)</u></div>

  <div class="page" id="pg-home"><h2>Welcome, Gravity Imaging Center</h2>
    <div class="tiles">
      <div class="tile"><div class="ic">+</div><b>Request an Authorization</b><span>Start a new request for a service</span></div>
      <div class="tile" id="tile-look"><div class="ic">&#8981;</div><b>Authorization Lookup</b><span>Check the status of an existing case</span></div>
      <div class="tile"><div class="ic">&#10003;</div><b>Eligibility Lookup</b><span>Confirm member benefits</span></div>
      <div class="tile"><div class="ic">&#9776;</div><b>Clinical Certification</b><span>Submit clinical information</span></div>
      <div class="tile"><div class="ic">&#8593;</div><b>Upload Documents</b><span>Add notes and records to a case</span></div>
      <div class="tile"><div class="ic">?</div><b>Resources</b><span>Guidelines and forms</span></div>
    </div></div>

  <div class="page" id="pg-look"><h2>Authorization Lookup</h2>
    <fieldset><legend>Provider</legend>
      <div class="row"><label>Healthplan</label><div class="inp sel" id="f-plan"><span class="ph">Select a healthplan</span><span class="v"></span>
        <div class="opts" id="opts"><div>Sample Health Plan – Medicare</div><div id="opt">Sample Health Plan – Commercial</div><div>Sample Health Plan – Medicaid</div><div>Other Health Plan</div></div></div></div>
      <div class="row"><label>Provider NPI</label><div class="inp" id="f-npi"><span class="ph">10-digit NPI</span><span class="v"></span></div></div>
      <div class="btnrow"><span class="btn" id="b-cont">CONTINUE</span></div>
    </fieldset>
    <fieldset id="fs-mem"><legend>Member</legend>
      <div class="row"><label>Member ID</label><div class="inp" id="f-mid"><span class="ph">Member ID</span><span class="v"></span></div></div>
      <div class="row"><label>Date of birth</label><div class="inp" id="f-dob"><span class="ph">MM/DD/YYYY</span><span class="v"></span></div></div>
      <div class="row"><label>Case or auth number <small style="color:#8a98a2">(optional)</small></label><div class="inp"><span class="ph">Optional</span></div></div>
      <div class="btnrow"><span class="btn" id="b-search">SEARCH</span></div>
    </fieldset></div>

  <div class="page" id="pg-load"><div class="loading"><div class="spin" id="spin"></div>Retrieving authorization…</div></div>

  <div class="page" id="pg-res"><h2>Authorization Lookup</h2>
    <div class="res">
      <div id="r-top"><div class="r"><b>Authorization number</b><span>A26-0481-7739</span></div>
      <div class="r"><b>Case number</b><span>2026-118-40372</span></div>
      <div class="r hd" id="r-status"><b>Status</b><span class="badge"><i></i>Approved</span></div>
      <div class="r"><b>Approval date</b><span>10/07/2026</span></div></div>
      <div id="r-pt"><div class="r"><b>Patient name</b><span>RIVERA, ALEX</span></div>
      <div class="r"><b>Date of birth</b><span>03/14/1985</span></div></div>
      <div class="r"><b>Referring provider</b><span>CHEN, MAYA · NPI 1234567893</span></div>
      <div id="r-cpt"><div class="r"><b>Service code</b><span>70551 · MRI brain without contrast</span></div></div>
      <div id="r-site"><div class="r"><b>Site name</b><span>Gravity Imaging Center · Sunrise, FL 33326</span></div></div>
      <div class="r"><b>Valid</b><span>10/07/2026 – 01/05/2027</span></div>
    </div></div>

  <div class="panel" id="panel">
    <div class="eb">GRAVITY · PRIOR AUTH</div><h3>Update auth status</h3><p>Order ORD-20481 · Alex Rivera · MRI brain w/o</p>
    <div id="checks"><div class="chk" id="c1"><div class="c"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.2l2.6 2.6L11 4.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Patient match<span class="m">name · DOB</span></div>
    <div class="chk" id="c2"><div class="c"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.2l2.6 2.6L11 4.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>CPT match<span class="m">70551</span></div>
    <div class="chk" id="c3"><div class="c"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.2l2.6 2.6L11 4.4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Facility match<span class="m">Gravity Imaging Center</span></div></div>
    <div class="lab">Authorization number</div><div class="inp" id="f-auth"><span class="ph">Enter auth number</span><span class="v"></span></div>
    <div class="lab">Status</div><div class="inp sel" id="f-st"><span class="ph">Select status</span><span class="v"></span>
      <div class="opts" id="opts2" style="width:100%"><div>Pending</div><div id="opt2">Approved</div><div>Denied</div><div>Not required</div></div></div>
    <div class="pbtn" id="b-conf">Confirm</div>
  </div>
</div>

<div class="toast" id="toast"><div class="tx"><small id="tsk">GRAVITY IS WORKING…</small><span id="tmsg">Opening the payer portal</span></div><div class="to" id="tover">Take over</div><div class="dn" id="tdone">Done</div></div>
<div id="overlay"></div>
<div id="ripple"></div>
<div id="cursor"><svg width="30" height="34" viewBox="0 0 30 34"><path d="M3 2l22 13.5-9.6 2.2 5.6 11.3-4.6 2.3-5.6-11.4L3 27z" fill="#6B3FE4" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg><div class="lbl">GRAVITY</div></div>
<div id="dim"></div>
<div class="card" id="card">
  <div class="eb">PRIOR AUTHORIZATION</div>
  <div class="hd"><div class="ok"><svg width="38" height="38" viewBox="0 0 38 38"><path d="M9 19.5l7 7L29.5 12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h1>Approved</h1></div>
  <div class="sub">Authorized before arrival. Status updated on the order in Gravity.</div>
  <div class="node"><b></b><i></i><b></b><i></i><b></b></div>
  <div class="grid">
    <div><small>AUTHORIZATION</small>A26-0481-7739</div><div><small>EXAM</small>70551 · MRI brain w/o contrast</div>
    <div><small>PATIENT</small>Alex Rivera</div><div><small>VALID</small>10/07/2026 – 01/05/2027</div>
  </div>
  <div class="foot">Sample walkthrough · fictional patient, payer and provider data</div>
</div>
</div>
<script>
const $=s=>document.querySelector(s);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const P=(t,a,b)=>clamp((t-a)/(b-a));
const DUR=33;

// ---- script ----
const MOVES=[ // [t0,t1,selector,dx,dy]  (dx,dy = fraction offset in element)
 [0.9,2.1,'#tile-look',.35,.55],
 [3.3,4.0,'#f-plan',.5,.5],
 [4.5,5.0,'#opt',.4,.5],
 [5.6,6.2,'#f-npi',.45,.5],
 [8.3,8.9,'#b-cont',.5,.55],
 [9.9,10.4,'#f-mid',.45,.5],
 [11.9,12.4,'#f-dob',.45,.5],
 [13.8,14.3,'#b-search',.5,.55],
 [16.7,17.4,'#r-top',.42,.5],
 [19.0,19.6,'#r-cpt',.42,.5],
 [21.0,21.6,'#c2',.3,.5],
 [22.9,23.4,'#f-auth',.45,.5],
 [25.0,25.4,'#f-st',.45,.5],
 [25.8,26.2,'#opt2',.35,.5],
 [26.7,27.1,'#b-conf',.5,.5],
];
const CLICKS=[2.25,4.1,5.1,6.3,9.0,10.5,12.5,14.4,23.5,25.5,26.3,27.2];
const TYPES=[ // [t0,t1,sel,text]
 [6.5,7.9,'#f-npi','1234567893'],
 [10.6,11.7,'#f-mid','SHP4471920'],
 [12.6,13.6,'#f-dob','03/14/1985'],
 [23.6,24.7,'#f-auth','A26-0481-7739'],
];
const HL=[ // [t0,t1,sel,label,detail]
 [2.25,3.3,'#tile-look','CLICK','Authorization Lookup'],
 [4.1,5.0,'#f-plan','CLICK','Healthplan'],
 [5.1,6.3,'#f-plan','SELECT','Sample Health Plan – Commercial'],
 [6.3,8.4,'#f-npi','TYPE','Provider NPI'],
 [9.0,9.9,'#b-cont','CLICK','Continue'],
 [10.5,12.0,'#f-mid','TYPE','Member ID'],
 [12.5,13.9,'#f-dob','TYPE','Date of birth'],
 [14.4,15.1,'#b-search','CLICK','Search'],
 [17.4,19.0,'#r-top','READ','Auth number · status'],
 [18.4,20.4,'#r-pt','READ','Patient'],
 [19.6,21.0,'#r-cpt','READ','Service code'],
 [19.9,21.2,'#r-site','READ','Site'],
 [21.6,23.0,'#checks','VERIFY','Patient · CPT · facility'],
 [23.5,24.9,'#f-auth','TYPE','Authorization number'],
 [25.5,26.3,'#f-st','CLICK','Status'],
 [26.3,27.1,'#f-st','SELECT','Approved'],
 [27.2,28.4,'#b-conf','CLICK','Confirm'],
 [28.0,29.4,'#authchip','UPDATED','Prior auth approved'],
 [28.2,29.4,'#r-status','APPROVED','Auth A26-0481-7739'],
];
const SAY=[[0,'Checking prior auth for this order.'],[0.8,'Opening Authorization Lookup.'],[3.2,'Choosing the member’s healthplan.'],[5.5,'Entering the provider NPI.'],[9.6,'Entering member ID and date of birth.'],[14.4,'Searching for the authorization.'],[16.6,'Reading the case result.'],[20.6,'Matching it to the order.'],[22.8,'Recording the authorization.'],[28.0,'Prior auth approved. Order updated.']];
const TOAST=[[0,'Opening the payer portal'],[0.8,'Clicking Authorization Lookup'],[3.2,'Selecting healthplan'],[5.5,'Typing provider NPI'],[8.3,'Clicking Continue'],[9.6,'Typing member ID'],[11.8,'Typing date of birth'],[13.7,'Clicking Search'],[14.9,'Waiting for the payer'],[16.6,'Reading the authorization'],[20.6,'Verifying patient, CPT and facility'],[22.8,'Typing authorization number'],[24.9,'Setting status to Approved'],[26.6,'Confirming update']];

const els={};const E=s=>els[s]||(els[s]=$(s));
const SC=()=>parseFloat(getComputedStyle($('#stage')).getPropertyValue('--s')||1);
function rectOf(s){const r=E(s).getBoundingClientRect(),o=$('#stage').getBoundingClientRect();const k=stageScale;return {x:(r.left-o.left)/k,y:(r.top-o.top)/k,w:r.width/k,h:r.height/k};}
let stageScale=1;
const pick=(arr,t)=>{let v=arr[0][1];for(const [a,b] of arr) if(t>=a) v=b;return v;};

// overlay pool
const ov=$('#overlay');const rings=[],tags=[];
for(let i=0;i<6;i++){const r=document.createElement('div');r.className='ring';ov.appendChild(r);rings.push(r);const g=document.createElement('div');g.className='tag';ov.appendChild(g);tags.push(g);}

function cursorAt(t){
  let x=1500,y=760;
  for(const [a,b,s,dx,dy] of MOVES){
    const r=rectOf(s);const tx=r.x+r.w*dx,ty=r.y+r.h*dy;
    if(t>=b){x=tx;y=ty;continue;}
    if(t>=a){const p=ease(P(t,a,b));const arc=Math.sin(p*Math.PI)*-28;x=x+(tx-x)*p;y=y+(ty-y)*p+arc;}
    break;
  }
  if(t<0.9){x+= (1-ease(P(t,0,0.9)))*180;y+=(1-ease(P(t,0,0.9)))*120;}
  return [x,y];
}
function setText(s,txt,caret){const el=E(s);el.querySelector('.ph').style.display=txt||caret?'none':'';el.querySelector('.v').innerHTML=txt+(caret?'<span class="caret"></span>':'');}

function seek(t){
  // pages
  const pg=t<2.9?'home':t<15.0?'look':t<16.5?'load':'res';
  for(const p of ['home','look','load','res']) E('#pg-'+p).classList.toggle('show',p===pg);
  E('#n-home').classList.toggle('on',pg==='home');E('#n-look').classList.toggle('on',pg!=='home');
  E('#url').textContent=pg==='home'?'portal.samplepayer.example/home':pg==='res'?'portal.samplepayer.example/auth/lookup/result?case=2026-118-40372':'portal.samplepayer.example/auth/lookup';
  // progress bar
  let pb=0; if(t>=2.4&&t<2.95) pb=P(t,2.4,2.9); if(t>=14.5&&t<16.55) pb=P(t,14.5,16.5);
  E('#pbar').style.width=(pb*100)+'%';E('#pbar').style.opacity=pb>0?1:0;
  E('#spin').style.transform=\`rotate(\${t*400}deg)\`;
  // member fieldset reveal
  E('#fs-mem').style.opacity=t<9.3?0.25:0.25+0.75*P(t,9.3,9.7);
  // dropdowns
  E('#opts').style.visibility=(t>=4.15&&t<5.15)?'visible':'hidden';
  E('#opt').classList.toggle('hov',t>=4.8&&t<5.15);
  const planSel=t>=5.1; setText('#f-plan',planSel?'Sample Health Plan – Commercial':'',false);
  E('#f-plan').classList.toggle('filled',planSel);E('#f-plan').classList.toggle('focus',t>=4.1&&t<5.1);
  E('#opts2').style.visibility=(t>=25.55&&t<26.35)?'visible':'hidden';
  E('#opt2').classList.toggle('hov',t>=26.0&&t<26.35);
  const stSel=t>=26.3; setText('#f-st',stSel?'Approved':'',false);
  E('#f-st').classList.toggle('filled',stSel);E('#f-st').classList.toggle('focus',t>=25.5&&t<26.3);
  // typing
  for(const [a,b,s,txt] of TYPES){
    const n=t<a?0:Math.round(P(t,a,b)*txt.length);
    const active=t>=a-0.25&&t<b+0.35;
    setText(s,txt.slice(0,n),active&&Math.floor(t*3)%2===0||active&&n<txt.length);
    E(s).classList.toggle('filled',t>=b+0.35);E(s).classList.toggle('focus',active);
  }
  // panel
  const pp=ease(P(t,20.4,21.0));E('#panel').style.transform=\`translateX(\${(1-pp)*110}%)\`;
  E('#c1').classList.toggle('ok',t>=21.8);E('#c2').classList.toggle('ok',t>=22.2);E('#c3').classList.toggle('ok',t>=22.6);
  const confirmed=t>=27.3;E('#b-conf').classList.toggle('done',confirmed);E('#b-conf').textContent=confirmed?'✓ Saved to order ORD-20481':'Confirm';
  const ok=t>=27.9;E('#authchip').classList.toggle('ok',ok);E('#authchip').querySelector('span').textContent=ok?'Prior auth · Approved':'Prior auth · Pending';
  // narration
  E('#say').textContent=pick(SAY,t);
  E('#tmsg').textContent=ok?'Prior authorization approved':pick(TOAST,t);
  E('#tsk').textContent=ok?'GRAVITY · COMPLETE':'GRAVITY IS WORKING…';
  E('#tover').style.display=ok?'none':'';E('#tdone').style.display=ok?'block':'none';
  // highlights
  let k=0;for(const r of rings){r.style.opacity=0;} for(const g of tags) g.style.opacity=0;
  for(const [a,b,s,lab,det] of HL){ if(t<a||t>=b||k>=rings.length) continue;
    const fi=clamp((t-a)/0.15),fo=clamp((b-t)/0.25),o=Math.min(fi,fo);
    const r=rectOf(s);const pad=7,ring=rings[k],tag=tags[k];k++;
    const pop=1+0.06*(1-ease(clamp((t-a)/0.3)));
    Object.assign(ring.style,{left:(r.x-pad)+'px',top:(r.y-pad)+'px',width:(r.w+pad*2)+'px',height:(r.h+pad*2)+'px',opacity:o,transform:\`scale(\${pop})\`});
    tag.innerHTML=lab+'<em>'+det+'</em>';
    tag.style.left='0px';const tw=tag.offsetWidth;let tx=r.x+r.w+pad+12,ty=r.y+r.h/2-13;
    if(tx+tw>1900) tx=r.x-pad-12-tw;
    if(s==='#authchip'){tx=r.x-pad;ty=r.y+r.h+pad+6;}
    Object.assign(tag.style,{left:tx+'px',top:ty+'px',opacity:o});
  }
  // cursor
  const [cx,cy]=cursorAt(t);
  let press=0;for(const c of CLICKS){if(t>=c-0.08&&t<c+0.12) press=1;}
  const out=ease(P(t,28.6,29.2));
  E('#cursor').style.transform=\`translate(\${cx-3}px,\${cy-2}px) scale(\${press?0.86:1})\`;
  E('#cursor').style.opacity=1-out;
  // ripple
  let rp=-1,rc=0;for(const c of CLICKS){if(t>=c&&t<c+0.6){rp=P(t,c,c+0.6);rc=c;}}
  if(rp>=0){const [rx,ry]=cursorAt(rc);const sz=12+rp*60;Object.assign(E('#ripple').style,{left:(rx-sz/2)+'px',top:(ry-sz/2)+'px',width:sz+'px',height:sz+'px',opacity:1-rp});}
  else E('#ripple').style.opacity=0;
  // outcome card
  const cp=ease(P(t,29.0,29.8));
  E('#dim').style.opacity=cp;
  E('#card').style.opacity=cp;E('#card').style.transform=\`translate(-50%,-50%) translateY(\${(1-cp)*26}px) scale(\${0.97+0.03*cp})\`;
}
window.seek=seek;window.DUR=DUR;
function fit(){stageScale=Math.min(innerWidth/1920,innerHeight/1080);$('#stage').style.transform=\`scale(\${stageScale})\`;
  if(!window.RENDER){document.documentElement.style.cssText=\`width:100vw;height:100vh;background:#0E0B19\`;document.body.style.cssText=\`width:100vw;height:100vh;overflow:hidden;background:#0E0B19\`;$('#stage').style.left=((innerWidth-1920*stageScale)/2)+'px';$('#stage').style.top=((innerHeight-1080*stageScale)/2)+'px';}}
if(!window.RENDER){fit();addEventListener('resize',fit);let t0=null;const HOLD=4;
  // A parent page may drive the clock instead ({anSeek: seconds}); the loop then stops playing on its own.
  let ext=false;addEventListener('message',e=>{const d=e.data;if(d&&typeof d.anSeek==='number'){ext=true;seek(Math.max(0,Math.min(DUR,d.anSeek)));}});
  const loop=ts=>{if(t0===null)t0=ts;let t=((ts-t0)/1000)%(DUR+HOLD);if(!ext)seek(Math.min(t,DUR));requestAnimationFrame(loop);};
  document.fonts.ready.then(()=>requestAnimationFrame(loop));}
<\/script></body></html>
`},order:{title:`GV1001166 · Prior authorization`,rows:[{term:`Status`,value:`Approved`},{term:`Auth number`,value:`A26-0481-7739`},{term:`Valid`,value:`10/14 to 01/11`},{term:`Booked`,value:`Tue 10/21, inside the authorized window`}]}},arrives:{eyebrow:`04 · Arrives ready`,h2:`The patient arrives booked, prepared, checked in and paid.`,intro:`Patients pay before they arrive, from their phone, with no login.`,beats:[{title:`The reminder, with a check-in link`,line:`Patients get booking confirmations and appointment reminders by text or call, sent on a schedule, so the booked slot is kept and the patient arrives prepared.`,detail:`Before the visit, patients are sent a link to check in and upload the documents the center needs, on its own, ahead of the appointment.`,products:[{label:`Gravity Booking`,href:`/products/gravity-booking`},{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Confirmations and reminders`,mode:`automated`},{flow:`Pre check-in and document request links`,mode:`automated`}]},{title:`Forms and consents, on the phone`,line:`Every form is digital, from consents and e-signature to screening and health questionnaires, demographics, ID and insurance, and every signed copy and answer is filed to the order.`,detail:`Prep instructions linked to each exam are shared with patients automatically when they book, and read out by the voice agent.`,products:[{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Exam prep instructions`,mode:`automated`}]},{title:`The estimate and the financial consent`,line:`Once coverage is known, the estimate is created and sent to the patient’s phone on its own, with no one building it.`,detail:`Accurate patient responsibility in one click, even when the payer sends dozens of competing benefit lines.`,products:[{label:`Gravity Estimate`,href:`/products/gravity-estimate`}],flows:[{flow:`Patient estimates on their own`,mode:`automated`}]},{title:`Paid and checked in, on the phone or the kiosk`,line:`The patient’s share is collected at booking or at the visit, from the same screen as the estimate, with card payments straight onto the order.`,detail:`A tablet in the lobby, set up per location, lets patients find their appointment and check themselves in.`,products:[{label:`Gravity Pay`,href:`/products/gravity-pay`},{label:`Gravity Greeter`,href:`/products/gravity-greeter`}]}],phone:{lock:{time:`7:30`,date:`Monday, October 20`,app:`Messages`,from:`Gravity Imaging Center`},text:{body:`Reminder: MRI knee, Tue 10/21 at 9:40 AM, Main Street. Check in now, before you arrive:`,link:`Check in →`},screens:[{step:`Health history · 2 of 5`,cards:[{title:`Have you had surgery on this knee?`,choice:`No`},{title:`Do you have diabetes or kidney disease?`,choice:`No`},{title:`MRI safety questions`,body:`Already answered on 10/13, kept on your record.`}],button:`Continue`},{step:`Consents · 3 of 5`,cards:[{title:`Consent to the MRI`,body:`I agree to the exam my doctor ordered.`,sign:`Signed by Alex Rivera · 10/20`},{title:`Privacy notice`,body:`I have read how my information is used.`,sign:`Signed by Alex Rivera · 10/20`}],button:`Continue`},{step:`Estimate · 4 of 5`,plan:{name:`Sample Health Plan`,member:`Member ID SHP4471920`},cost:{label:`Your estimated cost`,value:`$376.20`},cards:[{title:`Financial consent`,body:`I understand this is an estimate and agree to pay my share of the final cost.`,sign:`Signed by Alex Rivera · 10/20`}],button:`Pay $376.20 now`},{step:`Checked in · 5 of 5`,cards:[{title:`Paid $376.20`,body:`Card ending 4242, on your visit.`},{title:`You’re checked in`,body:`See you Tuesday at 9:40 AM at Main Street. Please arrive 15 minutes early.`}]}]},panel:{title:`GV1001166 · Check-in · Tue 10/21 · 9:40 AM`,items:[{term:`Reminder`,value:`Sent by text, with the check-in link`},{term:`Health history`,value:`Filed to the order`},{term:`MRI screening`,value:`On file from the first call`},{term:`Consents`,value:`Signed: MRI, privacy`},{term:`Estimate`,value:`$376.20, sent to the phone`},{term:`Financial consent`,value:`Signed`},{term:`Payment`,value:`$376.20, card, on the order`}],status:`Checked in · ready for the exam`,kiosk:{label:`Or at the lobby kiosk: Gravity Greeter`,src:`https://framerusercontent.com/images/BoSWcRLYp6pOWknnCODF9f9OkJ0.webp`,width:1300,height:836,alt:`The Gravity Greeter check-in tablet on a lobby counter, asking the patient to scan their driver’s license and insurance card`}}},report:{eyebrow:`05 · Report back`,h2:`The report and the images come back the minute the read is signed.`,intro:`Lay letters, reports and images, on the patient’s phone.`,beats:[{title:`The exam and the read, in your RIS and PACS`,line:`It can run on top of the systems you already run.`,products:[{label:`Gravity Developer`,href:`/products/gravity-developer`}]},{title:`The signed report arrives, and is read for follow-up`,line:`Reads the BI-RADS score and recommendation from the signed report, creates the follow-up order, sends the lay letter and recalls patients due for screening, on the schedule MQSA requires.`,products:[{label:`Gravity Grow`,href:`/products/gravity-grow`}],flows:[{flow:`Breast tracking and recall`,mode:`agentic`}]},{title:`Back to the referring office, by fax and in the portal`,line:`The signed report goes to the referring provider by fax on its own the moment it is signed, and again on amendment, branded and with every send on record.`,detail:`The finished report and the images for the referring provider’s patient, in the portal the minute the read is signed.`,products:[{label:`Gravity Referral`,href:`/products/gravity-referral`},{label:`Gravity Communication`,href:`/products/gravity-communication`}],flows:[{flow:`Report back to the referring office`,mode:`automated`}]},{title:`And to the patient’s phone`,line:`When the report is signed, the patient is sent a text link to read and download it, open shared images and read their lay letter in the portal.`,products:[{label:`Gravity Visit`,href:`/products/gravity-visit`}],flows:[{flow:`Results and lay letters to the patient`,mode:`automated`}]}],phone:{lock:{time:`2:16`,date:`Tuesday, October 21`,app:`Messages`,from:`Gravity Imaging Center`},text:{body:`Hi Alex, your MRI results are ready. Read your report and see your images:`,link:`Open your results →`},screens:[{step:`Your results · MRI knee`,cards:[{title:`What this means`,body:`Your MRI shows a small tear in the cartilage of your right knee. Dr. Lee will talk with you about next steps.`},{title:`Your images · 24`,thumbs:[`Sagittal`,`Coronal`,`Axial`]},{title:`Radiology report · MRI right knee without contrast`,report:[`FINDINGS: Tear of the posterior horn of the medial meniscus. No fracture. Ligaments intact.`,`IMPRESSION: Medial meniscus tear.`,`RECOMMENDATION: Orthopedic consultation.`],sign:`Signed 10/21 · 2:14 PM · Download the PDF`}]}]},panel:{outside:{label:`Outside Gravity · your RIS and PACS`,steps:[`Scanned on MR 2 · 9:52 AM`,`Read by the radiologist`,`Report signed · 2:14 PM`]},report:{caption:`Report received by interface · 2:14 PM`,lines:[{text:`IMPRESSION: Tear of the posterior horn of the medial meniscus.`,mark:`found`},{text:`RECOMMENDATION: Orthopedic consultation.`,mark:`found`}],result:`Read for follow-up: no recall needed`},title:`GV1001166 · Report delivery`,items:[{term:`Fax`,value:`To Dr. Jordan Lee, (555) 010-0198, delivered`},{term:`Referral portal`,value:`Report and images for Dr. Lee’s office`},{term:`Patient`,value:`Text link: report, images, lay letter`}],status:`Delivered · 2:15 PM`}},paid:{eyebrow:`06 · Paid`,h2:`Every exam you complete, you get paid for.`,intro:`Coverage and authorization are fixed before the exam, not discovered after the claim.`,beats:[{title:`Everything a denial looks for, settled before the claim`,line:`Every completed exam gets paid, because coverage, authorization and estimates are settled before the exam.`,detail:`Eligibility runs on its own on a schedule for orders waiting to start, so coverage is known before anyone has to ask.`,products:[{label:`Gravity Estimate`,href:`/products/gravity-estimate`},{label:`Gravity PriorAuth`,href:`/products/gravity-priorauth`}],flows:[{flow:`Eligibility checks on a schedule`,mode:`automated`}]},{title:`Charges from the order, the claim through your RCM`,line:`Creates charge items automatically from the procedure codes on incoming orders and ignores duplicates.`,detail:`A CRM is a system of relationships. A RIS is a system of orders. An RCM is a system of claims. An AOS is a system of work.`,products:[{label:`Gravity Flow`,href:`/products/gravity-flow`}],flows:[{flow:`Charge items from the order`,mode:`automated`}]},{title:`The payer pays`,line:`Turns every 835 remittance into a payment record with its trace number, payer and claims, and flags duplicate files.`,detail:`Checks each remittance’s math, claims paid less provider adjustments against the bank amount, and shows Balanced or the variance.`,products:[{label:`Gravity Flow`,href:`/products/gravity-flow`}],flows:[{flow:`Remittance inbox`,mode:`automated`},{flow:`Automatic remittance matching`,mode:`automated`},{flow:`Deposit reconciliation`,mode:`automated`}]},{title:`The whole loop, closed`,line:`Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.`,detail:`Classifies every line as paid, reduced, patient responsibility, denied or reversed, and turns adjustment codes into denial categories to assign and work.`,products:[{label:`Book a demo →`,href:`/demo`}]}],ready:{title:`Before the claim · GV1001166`,items:[{term:`Order`,value:`Complete, the right exam`},{term:`Eligibility`,value:`Active for 10/21`},{term:`Medical necessity`,value:`3 of 3 criteria met`},{term:`Authorization`,value:`A26-0481-7739, valid to 01/11`},{term:`Patient share`,value:`$376.20, collected 10/20`},{term:`Coding`,value:`CPT 73721 · ICD-10 S83.241A`}]},claim:{title:`Claim · MRI knee without contrast · Sample Health Plan`,charge:{term:`Charge`,value:`CPT 73721, created from the order`},sent:`Sent through your RCM · 837 to Sample Health Plan · 10/22`,remit:`835 remittance · Sample Health Plan · 11/04`,rows:[{term:`Allowed`,value:`$612.00`},{term:`Patient share`,value:`$376.20, collected`},{term:`Plan paid`,value:`$235.80`},{term:`Balance`,value:`$0.00`}],status:`Paid in full · Balanced`},loop:{title:`GV1001166 · Alex Rivera · MRI knee without contrast`,steps:[{term:`Order in`,value:`10/11 · faxed order read, the order created`},{term:`Booked`,value:`10/13 · Tue 10/21, 9:40 AM, MR 2`},{term:`Authorized`,value:`10/14 · A26-0481-7739`},{term:`Arrives ready`,value:`10/20 · checked in, $376.20 paid`},{term:`Report back`,value:`10/21 · report and images delivered`},{term:`Paid`,value:`11/04 · paid in full`}]}},under:{eyebrow:`Under every step`,h2:`Every system you add is another place for work to leak.`,items:[{product:{label:`Gravity Flow`,href:`/products/gravity-flow`},text:`The engine that runs every flow in Gravity, automated or agentic, started by any event or a schedule, and the Flow Store of thousands of ready-made flows.`},{product:{label:`Gravity Work`,href:`/products/gravity-work`},text:`Puts each piece of work that needs a person in front of the right one.`},{product:{label:`Gravity Communication`,href:`/products/gravity-communication`},text:`Voice, chat and document, built in: every call, text, fax and email lands on the order.`},{product:{label:`Gravity Trust`,href:`/products/gravity-trust`},text:`Controls who can get in, what they can do, and records what was done.`}],cta:{label:`Book a demo →`,href:`/demo`}},faq:{eyebrow:`Questions`,h2:`Questions about radiology workflow automation`,items:[{q:`How does Gravity run an imaging order?`,a:`Gravity gets the order, completes the exam and gets it paid. Where the work is routine, Gravity just does it. Where it takes intelligence, reading the fax, making the call, working the portal, Gravity’s agents do it, and your people either review the work or handle the exceptions.`},{q:`Which steps are agentic?`,a:`Reading every document and creating the order, the order appropriateness check, financial clearance, booking outreach, the AI voice agent, portal eligibility checks, the medical necessity check, prior auth submission and status on payer portals, and breast tracking and recall. The rest, from reminders and check-in links to report delivery and remittance matching, is automated.`},{q:`Can we review an agent’s work before it finishes?`,a:`Review first. Let it finish when you’re ready. Where a flow has a review setting, the center chooses: a person approves each run, or it finishes on its own. What an agent can’t finish lands on a worklist in Gravity Work, in front of the right person, with the history attached.`},{q:`How do patients book, check in and pay?`,a:`Patients book themselves from the app or by chat, or the AI voice agent books them by phone, under the same rules your booking staff follow. Before the visit, patients confirm their details, answer screening questions, sign consents, upload documents and pay the copay or patient responsibility, all from one text link with no login.`},{q:`Does Gravity read the scan or submit the claim?`,a:`We don’t read the scan. We make sure it gets back. The exam and the read happen in your RIS and PACS, and the claim goes out through your RCM. Gravity creates the charge items from the order, delivers the signed report and the images, and works the payer’s remittance when it comes back.`},{q:`How does Gravity work with our RIS, PACS and RCM?`,a:`It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.`}]},css:`.ajp{--ink:#1B1430;--ink2:#2A2050;--paper:#F6F4FA;--text:#0F172A;--text2:#334155;--text3:#5B6878;--border:#E5E7EB;--border2:#CBD5E1;
  --plum:#6B3FE4;--plum7:#5B2FD1;--plum8:#4A25AD;--plum3:#C9B3FF;--plum1:#E7DDFC;--tint:#F3EEFE;--lagoon:#22C1CE;--lagoonT:#DDF6F8;--lagoonX:#0B6E78;
  --display:"Urbanist",ui-sans-serif,system-ui,sans-serif;--sans:"Inter",ui-sans-serif,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
  --ease:cubic-bezier(.4,0,.2,1);
  width:100%;background:#fff;color:var(--text);font:400 16px/1.65 var(--sans);-webkit-font-smoothing:antialiased;container-type:inline-size;container-name:ajp}
.ajp *{box-sizing:border-box}
.ajp h1,.ajp h2,.ajp h3,.ajp p,.ajp ul,.ajp ol,.ajp dl,.ajp dd,.ajp figure{margin:0}
.ajp ul,.ajp ol{padding:0;list-style:none}
.ajp a{color:var(--plum7);text-decoration:none}
.ajp a:hover{text-decoration:underline}
.ajp :focus-visible{outline:2px solid var(--plum);outline-offset:2px;border-radius:4px}
.ajp .wrap{max-width:1200px;margin:0 auto;padding:0 32px}
@container ajp (max-width:809.98px){.ajp .wrap{padding:0 20px}}
.ajp section{padding:clamp(56px,8vw,96px) 0}
.ajp .eyebrow{display:flex;align-items:center;gap:10px;font:600 11px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--plum7);margin-bottom:18px}
.ajp .eyebrow::before{content:"";width:22px;height:1px;background:var(--border2)}
.ajp h2{font:600 clamp(26px,3vw,36px)/1.15 var(--display);letter-spacing:-.02em;text-wrap:balance;max-width:30ch}
.ajp h3{font:600 19px/1.3 var(--display);letter-spacing:-.01em}
.ajp .intro{color:var(--text2);margin-top:14px;max-width:62ch}
.ajp .btn{display:inline-flex;align-items:center;min-height:44px;padding:10px 18px;border-radius:8px;font:600 14px/1.2 var(--sans);transition:background .2s var(--ease)}
.ajp .btn-primary{background:var(--plum);color:#fff}
.ajp .btn-primary:hover{background:var(--plum7);text-decoration:none}
.ajp .btn-secondary{background:#fff;color:var(--text);border:1px solid var(--border2)}
.ajp .btn-secondary:hover{text-decoration:none;border-color:var(--plum)}
.ajp .pill{display:inline-block;font:600 10px/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:2px 8px;border-radius:999px;white-space:nowrap}
.ajp .pill.agentic{background:var(--plum1);color:var(--plum8)}
.ajp .pill.automated{background:#F1F5F9;color:var(--text2)}
.ajp .pill.ok{background:#ECFDF5;color:#047857}
.ajp .pill.warn{background:#FFFBEB;color:#B45309}
.ajp .prods{display:flex;flex-wrap:wrap;gap:4px 14px;font:600 13px/1.4 var(--sans)}

/* Hero: the copy, then the whole journey */
.ajp .hero{background:var(--paper);padding:clamp(28px,4vw,40px) 0 clamp(56px,7vw,88px)}
.ajp .crumbs{display:flex;flex-wrap:wrap;gap:6px;font:500 13px/1.4 var(--sans);color:var(--text3);margin-bottom:clamp(28px,4vw,48px)}
.ajp .crumbs li+li::before{content:"/";margin-right:6px;color:var(--border2)}
.ajp .crumbs a{color:var(--text3)}
.ajp h1{font:600 clamp(36px,5vw,56px)/1.04 var(--display);letter-spacing:-.025em;text-wrap:balance;max-width:16ch}
.ajp .lead{font:400 clamp(17px,1.6vw,19px)/1.6 var(--sans);color:var(--text2);margin-top:20px;max-width:58ch}
.ajp .kicker{font:600 clamp(18px,1.8vw,21px)/1.4 var(--display);margin-top:18px}
.ajp .ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.ajp .legend{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:28px;font-size:14px;color:var(--text3)}
.ajp .legend li{display:flex;gap:8px;align-items:center}


/* The hero is ink, as on the product pages (owner, 12 Oct 2026) */
.ajp .hero.ink{background:var(--ink);color:#fff}
.ajp .hero.ink h1,.ajp .hero.ink .kicker{color:#fff}
.ajp .hero.ink .lead{color:#DCD5F2}
.ajp .hero.ink .eyebrow{color:var(--plum3)}
.ajp .hero.ink .eyebrow::before{background:rgba(255,255,255,.35)}
.ajp .hero.ink .crumbs,.ajp .hero.ink .crumbs a{color:#B4A8D6}
.ajp .hero.ink .crumbs li+li::before{color:rgba(255,255,255,.35)}
.ajp .hero.ink .btn-primary{background:var(--plum3);color:var(--ink)}
.ajp .hero.ink .btn-primary:hover{background:#fff}
.ajp .hero.ink .btn-secondary{background:transparent;color:#fff;border-color:rgba(255,255,255,.35)}
.ajp .hero.ink .legend{color:#B4A8D6}
.ajp .hero-copy{max-width:760px}
/* The whole journey: the /aos explainer's line and nodes, on ink; the exam and the read dashed; the last node Lagoon */
.ajp .jr{margin:clamp(40px,5vw,64px) 0 0;padding:26px 20px 22px;border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(255,255,255,.03);display:grid;gap:14px}
.ajp .jr ol{display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}
.ajp .jr li{position:relative;padding-top:30px;text-align:center}
.ajp .jr li::before{content:"";position:absolute;top:10px;left:-50%;right:50%;height:2px;background:linear-gradient(var(--plum3),var(--plum3)) no-repeat 0 0/100% 100%,rgba(255,255,255,.16)}
.ajp .jr li:first-child::before{display:none}
.ajp .jr li.gap::before{background:none;border-top:2px dashed rgba(255,255,255,.3);height:0}
.ajp .jr li::after{content:"";position:absolute;top:5px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--plum3);box-shadow:0 0 0 4px var(--ink)}
.ajp .jr li:last-child::after{top:3px;width:16px;height:16px;margin-left:-8px;background:var(--lagoon)}
.ajp .jr a{display:grid;gap:3px;color:#fff;padding:0 4px}
.ajp .jr a:hover{text-decoration:none}
.ajp .jr a:hover b{text-decoration:underline}
.ajp .jr b{font:600 14px/1.3 var(--display)}
.ajp .jr span{font:500 11.5px/1.4 var(--sans);color:#B4A8D6}
.ajp .jr .out{justify-self:center;margin-left:50%;transform:translateX(-25%);font:600 10px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:#8F86B3}
.ajp .jr .span{border-top:2px solid var(--plum3);padding-top:10px;display:flex;gap:10px;align-items:baseline}
.ajp .jr .span b{font:600 11px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--plum3)}
.ajp .jr .span span{font-size:14px;color:#DCD5F2}
@keyframes ajp-fill{from{background-size:0 100%,auto}to{background-size:100% 100%,auto}}
@keyframes ajp-node{from{background:rgba(255,255,255,.16)}to{background:var(--plum3)}}
@keyframes ajp-last{from{background:rgba(255,255,255,.16)}to{background:var(--lagoon)}}
@media (prefers-reduced-motion:no-preference){
  .ajp .jr li::before{animation:ajp-fill .4s linear both;animation-delay:calc(var(--i) * .4s - .5s)}
  .ajp .jr li::after{animation:ajp-node .25s var(--ease) both;animation-delay:calc(var(--i) * .4s - .2s)}
  .ajp .jr li:last-child::after{animation-name:ajp-last}
}
@container ajp (max-width:759.98px){
  .ajp .jr ol{grid-template-columns:1fr;gap:14px}
  .ajp .jr li{padding:0 0 0 30px;text-align:left}
  .ajp .jr li::before{top:-14px;bottom:auto;left:5px;right:auto;width:2px;height:calc(100% + 0px);background:rgba(255,255,255,.16)}
  .ajp .jr li.gap::before{border-top:0;border-left:2px dashed rgba(255,255,255,.3);width:0}
  .ajp .jr li::after{top:4px;left:0;margin-left:0}
  .ajp .jr li:last-child::after{left:-2px;margin-left:0}
  .ajp .jr .out{justify-self:start;margin-left:30px;transform:none}
}
.ajp .rail a{color:inherit}

/* Story 1. Static: the heading, the Read the fax composition, then the five beats in a row. */
.ajp .story{position:relative;padding-bottom:0}
.ajp .rail-l{font:600 9.5px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-bottom:8px}
.ajp .rail{display:flex;flex-wrap:wrap;gap:6px 0;font:600 10px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--text3)}
.ajp .rail li{display:flex;align-items:center;gap:6px}
.ajp .rail li+li::before{content:"";width:18px;height:1px;background:var(--border2);margin:0 6px}
.ajp .rail i{width:7px;height:7px;border-radius:50%;background:var(--border2)}
.ajp .rail li.on{color:var(--plum7)}
.ajp .rail li.on i{background:var(--plum)}
.ajp .story-head{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px 40px;align-items:end}
@container ajp (max-width:959.98px){.ajp .story-head{grid-template-columns:1fr}}
.ajp .story-head .intro{margin-top:0}
.ajp .stage{padding-bottom:clamp(56px,8vw,96px)}
.ajp .stage-in{display:grid;gap:24px}
.ajp .rtf{background:var(--paper);border-radius:16px;padding:clamp(12px,2vw,24px);margin:0}
.ajp .rtf-stage{position:relative;width:100%;aspect-ratio:1232/620;margin:0 auto}
.ajp .rtf-stage img{position:absolute;display:block;height:auto}
.ajp .rtf-faxwrap{position:absolute;left:0;top:14.19%;width:28.4%;height:73%;overflow:hidden}
.ajp .rtf-stage .rtf-fax{position:relative;left:0;top:0;width:97.2%;box-shadow:4px 4px 0 rgba(27,20,48,.1);border-radius:3px}
/* The fax machine the page feeds out of: its slot sits on the page's top edge */
.ajp .rtf-machine{position:absolute;left:-.6%;top:2.6%;width:28.8%;height:11.6%;background:var(--ink);color:#fff;border-radius:12px 12px 4px 4px;padding:1.2% 1.6% 0;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:8px;align-content:start;box-shadow:0 10px 24px -12px rgba(27,20,48,.6)}
.ajp .rtf-machine::after{content:"";position:absolute;left:4%;right:4%;bottom:0;height:4px;border-radius:2px;background:#0B0716}
.ajp .rtf-machine .lamp{grid-row:1/3;align-self:center;width:9px;height:9px;border-radius:50%;background:var(--plum3);box-shadow:0 0 0 3px rgba(201,179,255,.25)}
.ajp .rtf-machine b{font:600 12px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:#fff}
.ajp .rtf-machine span{font:500 11px/1.4 var(--mono);color:#B4A8D6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ajp .rtf-machine .feed{grid-column:1/3;align-self:center;height:3px;border-radius:2px;background:rgba(255,255,255,.15);overflow:hidden}
.ajp .rtf-machine .feed i{display:block;height:100%;width:calc(var(--feed,1) * 100%);background:var(--plum3)}
/* The fax prints top to bottom under the slot, a print line on its leading edge */
.ajp.live .rtf-stage .rtf-fax{clip-path:inset(0 0 calc((1 - var(--feed,1)) * 100%) 0)}
.ajp .rtf-faxwrap::after{content:"";position:absolute;left:0;width:97.2%;top:calc(var(--feed,1) * 97%);height:2px;background:var(--plum);box-shadow:0 0 12px 2px rgba(107,63,228,.45);opacity:0}
.ajp.live .rtf-machine.busy~.rtf-faxwrap::after{opacity:1}
@keyframes ajp-lamp{50%{opacity:.35}}
.ajp.live .rtf-machine.busy .lamp{animation:ajp-lamp 1s steps(2) infinite}
.ajp .rtf-order{left:29.38%;top:0;width:70.54%}
.ajp .rtf-anim{position:absolute;inset:0}
.ajp .rtf-anim svg{display:block;width:100%;height:100%}
.ajp .rtf figcaption{margin-top:10px;text-align:center;font:500 12px/1.5 var(--mono);color:var(--text3)}
@media (prefers-reduced-motion:reduce){.ajp .rtf-anim{display:none}}
/* Phones: the fax above the order, each at a readable size, without the connecting lines */
@container ajp (max-width:699.98px){
  .ajp .rtf-stage{aspect-ratio:auto;display:grid;gap:16px;justify-items:center}
  .ajp .rtf-stage img,.ajp .rtf-faxwrap,.ajp .rtf-machine{position:static}
  .ajp .rtf-machine{width:76%;height:auto;padding:10px 12px 14px;margin-bottom:-16px;row-gap:4px}
  .ajp .rtf-faxwrap{width:72%;height:auto;overflow:visible}
  .ajp .rtf-stage .rtf-fax{width:100%}
  .ajp .rtf-order{width:100%}
  .ajp .rtf-anim{display:none}
}
.ajp .beats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}
@container ajp (max-width:1099.98px){.ajp .beats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container ajp (max-width:599.98px){.ajp .beats{grid-template-columns:1fr}}
.ajp .beat{display:grid;gap:8px;align-content:start;padding-left:16px;border-left:1px solid var(--border)}
.ajp .bnum{font:600 11px/1.4 var(--mono);letter-spacing:.12em;color:var(--plum7)}
.ajp .beat h3{font-size:17px}
.ajp .beat .bline{color:var(--text2);font-size:14px;line-height:1.55}
.ajp .beat .bdetail{color:var(--text3);font-size:13px;line-height:1.5}
.ajp .bflows{display:grid;gap:6px;margin:2px 0}
.ajp .bflows li{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px 10px;font-size:13px;line-height:1.45;border-top:1px solid var(--border);padding-top:6px}

/* Live: the stage pins under the header; the composition takes the room and one beat shows under it as a one-line
   caption (the beat's detail and flows stay in the server HTML and on phones). */
.ajp.live .story{height:calc(var(--beats,5) * 85svh + 100svh);padding:0}
.ajp.live .stage{position:sticky;top:var(--an-header-h,0px);height:calc(100svh - var(--an-header-h,0px));padding:14px 0 16px}
.ajp.live .stage-in{height:100%;grid-template-rows:auto auto minmax(0,1fr) auto;gap:10px;max-width:1440px}
.ajp.live .story-head .eyebrow{margin-bottom:6px}
.ajp.live .story-head{grid-template-columns:minmax(0,2.4fr) minmax(0,1fr)}
.ajp.live .story-head h2{font-size:clamp(20px,min(2.2vw,3.4vh),30px);max-width:none}
.ajp.live .story-head .intro{font-size:14px;text-align:right}
.ajp.live .rtf{position:relative;min-height:0;overflow:hidden;padding:0;align-self:center;height:100%;max-height:min(100%,56vw)}
.ajp.live .rtf-stage{position:absolute;left:0;top:0;width:1232px;height:620px;aspect-ratio:auto;margin:0;transform-origin:0 0;will-change:transform}
.ajp.live .rtf figcaption{display:none}
.ajp.live .rtf-order,.ajp.live .rtf-anim{opacity:var(--order,1)}
.ajp.live .beats{grid-template-columns:1fr;gap:0}
.ajp.live .beat{grid-area:1/1;opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease),transform .4s var(--ease);pointer-events:none;border-left:3px solid var(--plum);
  grid-template-columns:minmax(0,.75fr) minmax(0,2fr) minmax(0,1fr);column-gap:24px;align-items:center;background:#fff;padding:4px 0 4px 16px}
.ajp.live .beat.on{opacity:1;transform:none;pointer-events:auto}
.ajp.live .beat .bhead{grid-column:1;gap:2px}
.ajp.live .beat .bbody{grid-column:2}
.ajp.live .beat .bside{grid-column:3;justify-self:end}
.ajp.live .beat .prods{justify-content:flex-end}
.ajp.live .beat .bdetail,.ajp.live .beat .bflows{display:none}
.ajp .bhead,.ajp .bbody,.ajp .bside{display:grid;gap:8px;align-content:start}
.ajp.live .beat h3{font-size:19px}
.ajp.live .beat .bline{font-size:15px}
.ajp .progress{display:none}
.ajp.live .progress{display:flex;justify-content:flex-end;gap:8px;align-items:center;font:600 10px/1 var(--mono);letter-spacing:.14em;color:var(--text3);text-transform:uppercase}
.ajp.live .progress b{display:block;width:120px;height:1px;background:var(--border)}
.ajp.live .progress b i{display:block;height:1px;width:0;background:var(--plum)}
.ajp.live .stage-top{display:flex;justify-content:space-between;align-items:center;gap:16px}
.ajp.live .rail-l{display:none}

/* Story 2, Booked: the patient's phone and Gravity Booking on the order. Static: the phone's screens in a row you can
   swipe, the panel under them. Live: one stage designed at 1120 x 520 and scaled as a whole to fit the screen, so it
   keeps its proportions at every width; the phone's screens swap with the scroll and the panel fills in. */
.ajp .bk{display:grid;gap:20px}
.ajp .phones{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(170px,1fr);gap:14px;overflow-x:auto;padding-bottom:4px}
.ajp .fone{position:relative;aspect-ratio:9/19;border:7px solid var(--ink);border-radius:30px;background:#fff;overflow:hidden;box-shadow:0 18px 40px -22px rgba(27,20,48,.55);font-size:11px;line-height:1.45}
.ajp .fone .scr{position:absolute;inset:0;display:flex;flex-direction:column;gap:7px;padding:22px 10px 12px}
.ajp .fone .who{font:600 9.5px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--text3);text-align:center}
.ajp .fone .bub{align-self:flex-start;max-width:90%;background:#F1F5F9;border-radius:14px 14px 14px 4px;padding:8px 10px;color:var(--text)}
.ajp .fone .bub b{display:inline-block;margin-top:6px;color:var(--plum7);font-weight:600}
.ajp .fone img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top}
.ajp .fone.lock .scr{background:linear-gradient(170deg,#2A2050,#6B3FE4 120%);color:#fff;padding-top:34px}
.ajp .fone .clock{font:300 44px/1 var(--display);text-align:center;letter-spacing:-.02em}
.ajp .fone .date{text-align:center;font-size:11px;color:#DCD5F2;margin-bottom:14px}
.ajp .fone .note{background:rgba(255,255,255,.92);color:var(--text);border-radius:14px;padding:9px 10px;display:grid;gap:3px;box-shadow:0 10px 24px -12px rgba(0,0,0,.5)}
.ajp .fone .note small{font:600 9px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--text3)}
.ajp .fone .note b{color:var(--plum7);font-weight:600}
.ajp .fone.dark .scr{background:var(--ink);color:#fff}
.ajp .fone.dark .who{color:var(--plum3)}
.ajp .fone .big{align-self:center;width:58px;height:58px;border-radius:50%;background:var(--plum);display:grid;place-items:center;font:600 16px/1 var(--display);margin-top:18px;box-shadow:0 0 0 8px rgba(107,63,228,.22)}
.ajp .fone .name{font:600 15px/1.3 var(--display);text-align:center}
.ajp .fone .sub{font-size:11px;color:#B4A8D6;text-align:center}
.ajp .fone .keys{margin-top:auto;display:flex;justify-content:space-around;padding:0 6px}
.ajp .fone .key{display:grid;justify-items:center;gap:5px;font-size:10px;color:#DCD5F2}
.ajp .fone .key i{width:40px;height:40px;border-radius:50%;display:block}
.ajp .fone .key.no i{background:#E5484D}
.ajp .fone .key.yes i{background:#30A46C}
.ajp .fone .tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ajp .fone .tile{background:rgba(255,255,255,.07);border-radius:12px;padding:8px 6px;display:grid;justify-items:center;gap:4px;font-size:9.5px;color:#DCD5F2;text-align:center}
.ajp .fone .av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font:600 11px/1 var(--display)}
.ajp .fone .av.ai{background:var(--plum);color:#fff;gap:2px;grid-auto-flow:column;align-items:center}
.ajp .fone .av.ai i{width:3px;height:12px;border-radius:2px;background:#fff;display:block}
.ajp .fone .av.pt{background:#fff;color:var(--ink)}
@keyframes ajp-wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
.ajp.live .fone .av.ai i{animation:ajp-wave .9s ease-in-out infinite}
.ajp.live .fone .av.ai i:nth-child(2){animation-delay:.15s}.ajp.live .fone .av.ai i:nth-child(3){animation-delay:.3s}
@keyframes ajp-ring{0%,100%{box-shadow:0 0 0 0 rgba(48,164,108,.6)}70%{box-shadow:0 0 0 12px rgba(48,164,108,0)}}
.ajp.live .fone .key.yes i{animation:ajp-ring 1.2s ease-out infinite}
.ajp .fone .ln{max-width:92%;border-radius:12px;padding:6px 9px;font-size:10.5px;line-height:1.4}
.ajp .fone .ln.agent{align-self:flex-start;background:rgba(201,179,255,.18);color:#fff}
.ajp .fone .ln.pt{align-self:flex-end;background:#fff;color:var(--text)}
.ajp .fone .ln small{display:block;font:600 8.5px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.ajp .bkp{background:#fff;border:1px solid var(--border2);border-radius:14px;padding:16px;display:grid;gap:12px;align-content:start;box-shadow:0 24px 60px -32px rgba(27,20,48,.35)}
.ajp .bkp-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}
.ajp .bkp-h b{font:600 15px/1.3 var(--display)}
.ajp .bkp-h span{font:500 11px/1.4 var(--mono);color:var(--text3)}
.ajp .slots{display:grid;gap:4px;font-size:11.5px}
.ajp .slots .row{display:grid;grid-template-columns:44px repeat(var(--days),minmax(0,1fr));gap:4px;align-items:center}
.ajp .slots .dh{font:600 10px/1.3 var(--mono);color:var(--text3);text-align:center}
.ajp .slots .tl{font:500 10.5px/1 var(--mono);color:var(--text3)}
.ajp .cell{border:1px solid #DCD0FA;background:var(--tint);color:var(--plum8);border-radius:6px;padding:7px 4px;text-align:center;font-weight:600;transition:background .35s var(--ease),color .35s var(--ease),border-color .35s var(--ease)}
.ajp .cell.taken{background:#F1F5F9;border-color:var(--border);color:#94A3B8;font-weight:500}
.ajp:not(.live) .cell.early,.ajp.live .cell.early.on{background:repeating-linear-gradient(135deg,#F8FAFC 0 6px,#EEF2F6 6px 12px);border-color:var(--border);color:#94A3B8;font-weight:500}
.ajp:not(.live) .cell.mine,.ajp.live .cell.mine.on{background:var(--plum);border-color:var(--plum);color:#fff;box-shadow:0 0 0 3px rgba(107,63,228,.2)}
.ajp .lead-t{display:grid;grid-template-columns:44px repeat(var(--days),minmax(0,1fr));gap:4px}
.ajp .lead-t span{grid-column:2/span var(--early);font:600 9.5px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:#64748B;text-align:center;border-bottom:1px dashed var(--border2);padding-bottom:3px}
.ajp .bkp dl{display:grid;gap:6px;font-size:12.5px;border-top:1px solid var(--border);padding-top:10px}
.ajp .bkp dl div{display:grid;grid-template-columns:118px minmax(0,1fr) auto;gap:8px;align-items:center}
.ajp .bkp dt{color:#64748B}
.ajp .bkp dl div::after{content:"✓";color:#047857;font-weight:700}
.ajp .bkp .st{justify-self:start}
.ajp.live .k{opacity:0;transform:translateY(6px);transition:opacity .4s var(--ease),transform .4s var(--ease)}
.ajp.live .k.on{opacity:1;transform:none}
.ajp.live .bk-view{position:relative;height:100%;min-height:0;overflow:hidden}
.ajp.live .bk{position:absolute;left:0;top:0;width:1120px;height:520px;grid-template-columns:246px minmax(0,1fr);grid-template-rows:520px;gap:48px;align-items:center;transform-origin:0 0;will-change:transform}
.ajp.live .phones{display:grid;grid-auto-flow:row;grid-template-rows:520px;grid-auto-columns:246px;overflow:visible;height:520px;padding:0}
.ajp.live .fone{grid-area:1/1;height:520px;width:246px;opacity:0;transition:opacity .45s var(--ease)}
.ajp.live .fone.on{opacity:1}
.ajp.live .fone .note{transform:translateY(-120%);opacity:0;transition:transform .5s var(--ease),opacity .5s var(--ease)}
.ajp.live .fone .note.on{transform:none;opacity:1}
@media (prefers-reduced-motion:reduce){.ajp .k,.ajp .cell,.ajp .fone,.ajp .fone .note{transition:none}.ajp .fone .av.ai i,.ajp .fone .key.yes i{animation:none}}

/* Story 3, Authorized: four scenes on one stage. Static: the scenes as cards, the portal walkthrough playing on its own
   (its still under it for reduced motion). Live: a stage designed at 1120 x 600 and scaled to fit; one scene at a time,
   and scroll drives the walkthrough's clock. */
.ajp .az{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
@container ajp (max-width:899.98px){.ajp .az{grid-template-columns:1fr}}
.ajp .az-sc{display:grid;gap:14px;align-content:start}
.ajp .az-sc.wide{grid-column:1/-1}
.ajp .card{background:#fff;border:1px solid var(--border2);border-radius:14px;padding:18px;display:grid;gap:12px;align-content:start;box-shadow:0 24px 60px -32px rgba(27,20,48,.35);font-size:13px}
.ajp .card .ch{font:600 10px/1.4 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text3)}
.ajp .kv{display:grid;gap:7px}
.ajp .kv div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:10px;align-items:baseline}
.ajp .kv dt{color:#64748B}
.ajp .kv dd{font-weight:500}
.ajp .card .okline{display:flex;gap:10px;align-items:center;border-top:1px solid var(--border);padding-top:10px}
.ajp .card .okline::before{content:"✓";color:#047857;font-weight:700}
.ajp .card small{display:block;color:var(--text3);font-size:12px}
.ajp .pnote{background:#FCFCF9;border:1px solid var(--border);border-radius:8px;padding:16px;font:400 12.5px/1.8 var(--mono);color:var(--text2);box-shadow:0 14px 34px -18px rgba(27,20,48,.3)}
.ajp .pnote .cap{display:block;font-size:11px;color:var(--text3);margin-bottom:8px}
.ajp .pnote .hl{background:var(--tint);outline:1.5px solid var(--plum);outline-offset:1px;border-radius:2px;padding:0 3px;color:var(--text);transition:background .35s var(--ease),outline-color .35s var(--ease)}
.ajp.live .pnote .hl:not(.on){background:transparent;outline-color:transparent}
.ajp .crit{display:grid;gap:8px}
.ajp .crit li{display:flex;gap:10px;align-items:center}
.ajp .crit li::before{content:"✓";display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#ECFDF5;color:#047857;font-weight:700;font-size:11px}
.ajp .portal{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid var(--border);box-shadow:0 24px 48px -12px rgba(27,20,48,.25);background:#0E0B19}
.ajp .portal img,.ajp .portal iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.ajp .az .fcap{text-align:center;font:500 12px/1.5 var(--mono);color:var(--text3)}
@media (prefers-reduced-motion:reduce){.ajp .portal iframe{display:none}.ajp .pnote .hl{transition:none}}
.ajp.live .az-view{position:relative;height:100%;min-height:0;overflow:hidden}
.ajp.live .az{position:absolute;left:0;top:0;width:1120px;height:600px;display:block;transform-origin:0 0;will-change:transform}
.ajp.live .az-sc{position:absolute;inset:0;opacity:0;transition:opacity .45s var(--ease);display:grid;place-content:center;pointer-events:none}
.ajp.live .az-sc.on{opacity:1;pointer-events:auto}
.ajp.live .az .card{font-size:16px;padding:26px;gap:16px}
.ajp.live .az .card .ch{font-size:12px}
.ajp.live .az .kv{gap:12px}
.ajp.live .az .kv div{grid-template-columns:130px minmax(0,1fr)}
.ajp.live .az .card small{font-size:14px}
.ajp.live .az .pill{font-size:12px;padding:4px 12px}
.ajp.live .az-sc.rules .card,.ajp.live .az-sc.order .card{width:700px}
.ajp.live .az-sc.note{grid-template-columns:620px 420px;gap:32px;align-items:center}
.ajp.live .az .pnote{font-size:15px;padding:24px}
.ajp.live .az .pnote .cap{font-size:12.5px}
.ajp.live .az .crit{gap:12px}
.ajp.live .az-sc.wide .portal{width:1066px}
.ajp.live .az .fcap{display:none}

/* Story 4, Arrives ready: Story 2's phone and panel, with the check-in screens drawn from the YAML */
.ajp .fone .form{background:var(--paper);gap:6px}
.ajp .fc{background:#fff;border:1px solid var(--border);border-radius:10px;padding:7px 9px;display:grid;gap:2px;font-size:10px;color:var(--text2)}
.ajp .fc b{font-size:10.5px;color:var(--text);font-weight:600}
.ajp .fc .pill{justify-self:start;margin-top:2px}
.ajp .fc small{font-family:var(--mono);font-size:8.5px;color:var(--plum7);border-top:1px dashed var(--border2);padding-top:3px;margin-top:2px}
.ajp .plan{background:var(--plum);color:#fff;border-radius:10px;padding:8px 10px;display:grid;font-size:9.5px}
.ajp .plan b{font-size:11.5px}
.ajp .cost{background:#fff;border:1px solid var(--border);border-radius:10px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;font-size:9.5px;color:var(--text3)}
.ajp .cost b{font:700 19px/1 var(--display);color:var(--text)}
.ajp .fbtn{margin-top:auto;background:var(--plum);color:#fff;border-radius:9px;padding:8px;text-align:center;font-weight:600}
.ajp .kiosk{display:grid;grid-template-columns:132px minmax(0,1fr);gap:12px;align-items:center;border-top:1px solid var(--border);padding-top:10px;font-size:12.5px;font-weight:600}
.ajp .kiosk img{width:100%;height:auto;border-radius:8px;display:block}

/* Story 5, Report back: the exam and the read outside Gravity, muted; the report as it arrives */
.ajp .outside{border:1px dashed var(--border2);border-radius:10px;padding:10px 12px;display:grid;gap:6px;background:#FAFAFB}
.ajp .outside ol{display:flex;flex-wrap:wrap;gap:6px 0;font-size:12px;color:var(--text3)}
.ajp .outside li+li::before{content:"→";margin:0 8px;color:var(--border2)}
.ajp .ch{font:600 10px/1.4 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text3)}
.ajp .rep{background:#FCFCF9;border:1px solid var(--border);border-radius:8px;padding:12px;display:grid;gap:6px;font:400 12px/1.6 var(--mono);color:var(--text2)}
.ajp .rep .hl{background:var(--tint);outline:1.5px solid var(--plum);outline-offset:1px;border-radius:2px;padding:0 3px;color:var(--text);transition:background .35s var(--ease),outline-color .35s var(--ease)}
.ajp.live .rep .hl:not(.on){background:transparent;outline-color:transparent}

.ajp .fc .rp{display:grid;gap:3px;font:400 8.5px/1.45 var(--mono);color:var(--text2);margin-top:3px}
.ajp .fc .thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:3px}
.ajp .fc .thumbs span{display:grid;gap:2px;font:500 7.5px/1 var(--mono);color:var(--text3);text-align:center}
.ajp .fc .thumbs svg{display:block;width:100%;height:auto;border-radius:4px}

/* Story 6, Paid: the checks before the claim, the claim and the remittance, then the whole loop. Lagoon is the outcome. */
.ajp .pill.paid{background:var(--lagoonT);color:var(--lagoonX)}
.ajp .az-sc.ready{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
@container ajp (max-width:899.98px){.ajp .az-sc.ready{grid-template-columns:1fr}}
.ajp .kv.ticks div{grid-template-columns:130px minmax(0,1fr) auto}
.ajp .kv.ticks div::after{content:"✓";color:#047857;font-weight:700}
.ajp .card .outside{font-size:12px;color:var(--text3)}
.ajp .tl{display:grid;gap:0}
.ajp .tl li{display:grid;grid-template-columns:20px 140px minmax(0,1fr);gap:12px;align-items:baseline;padding-bottom:12px;position:relative}
.ajp .tl li::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--plum);margin-top:5px}
.ajp .tl li:not(:last-child)::after{content:"";position:absolute;left:4.5px;top:17px;bottom:0;width:1px;background:var(--border2)}
.ajp .tl li:last-child::before{background:var(--lagoon);box-shadow:0 0 0 4px var(--lagoonT)}
.ajp .tl li:last-child b{color:var(--lagoonX)}
.ajp .tl span{color:var(--text2)}
.ajp.live .az-sc.ready{grid-template-columns:500px 540px;gap:32px;align-items:start}
.ajp.live .az-sc.loop .card{width:760px}
.ajp.live .az .kv.ticks div{grid-template-columns:160px minmax(0,1fr) auto}

/* Phones (PUSH-RULES 11: about 40% shorter, a way to book before the story ends): each story's beats become a row of
   cards to swipe, the per-story rail gives way to the hero's journey links, and a Book a demo button sits halfway down. */
.ajp .rail a:hover{color:var(--plum7);text-decoration:underline}
.ajp .mcta{display:none}
@container ajp (max-width:759.98px){
  .ajp .beats{grid-auto-flow:column;grid-auto-columns:86%;grid-template-columns:none;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding:2px 2px 8px;margin-top:20px}
  .ajp .beat{scroll-snap-align:start;background:#fff;border:1px solid var(--border);border-left:3px solid var(--plum);border-radius:12px;padding:14px}
  .ajp .story .stage-top{display:none}
  .ajp .mcta{display:block;text-align:center;padding:8px 20px 40px}
}

/* Under every step: ink, like the hero (owner, 12 Oct 2026; two ink bands, a deviation to list in the PR) */
.ajp .ink{background:var(--ink);color:#fff}
.ajp .ink .eyebrow{color:var(--plum3)}
.ajp .ink .eyebrow::before{background:rgba(255,255,255,.35)}
.ajp .ink .btn-primary{background:var(--plum3);color:var(--ink)}
.ajp .ink .btn-primary:hover{background:#fff}
.ajp .under{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:36px 0 32px}
@container ajp (max-width:959.98px){.ajp .under{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container ajp (max-width:599.98px){.ajp .under{grid-template-columns:1fr}}
.ajp .under li{background:var(--ink2);border-radius:14px;padding:22px;display:grid;gap:8px;align-content:start}
.ajp .under a{color:#fff;font:600 17px/1.3 var(--display)}
.ajp .under p{font-size:14px;line-height:1.55;color:#B4A8D6}

/* FAQ */
.ajp .faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 48px;margin-top:36px}
@container ajp (max-width:809.98px){.ajp .faq{grid-template-columns:1fr}}
.ajp .faq p{color:var(--text2);margin-top:8px}
@media (prefers-reduced-motion:reduce){.ajp .btn,.ajp .beat{transition:none}.ajp .rtf-machine .lamp{animation:none}}`,jsonLd:`{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://alphanodus.com/#organization","name":"Alpha Nodus","legalName":"Alpha Nodus, Inc.","url":"https://alphanodus.com","logo":{"@type":"ImageObject","url":"https://framerusercontent.com/images/KV366RXtaJtF1GTYRPMyVeBkMQ.png","width":180,"height":180},"description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","foundingDate":"2015","founder":{"@type":"Person","@id":"https://alphanodus.com/company#shamit-patel","name":"Shamit Patel"},"address":{"@type":"PostalAddress","streetAddress":"1351 Sawgrass Corporate Parkway, Suite 104","addressLocality":"Sunrise","addressRegion":"FL","postalCode":"33323","addressCountry":"US"},"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+18886257420","email":"info@alphanodus.com","areaServed":"US"},"sameAs":["https://www.linkedin.com/company/alphanodus","https://www.youtube.com/@AlphaNodus","https://x.com/alphanodus","https://www.instagram.com/alphanodus/","https://www.facebook.com/AlphaNodus/"],"brand":{"@id":"https://alphanodus.com/#gravity"}},{"@type":"WebSite","@id":"https://alphanodus.com/#website","url":"https://alphanodus.com","name":"Alpha Nodus","publisher":{"@id":"https://alphanodus.com/#organization"},"inLanguage":"en-US"},{"@type":"SoftwareApplication","@id":"https://alphanodus.com/#gravity","name":"Gravity","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system.","publisher":{"@id":"https://alphanodus.com/#organization"}},{"@type":"WebPage","@id":"https://alphanodus.com/journey","url":"https://alphanodus.com/journey","name":"Radiology order automation, referral to payment | Gravity","description":"How Gravity runs one order for imaging centers and radiology groups: agents read the fax, call the patient, work the payer portal and settle coverage.","inLanguage":"en-US","isPartOf":{"@id":"https://alphanodus.com/#website"},"publisher":{"@id":"https://alphanodus.com/#organization"},"dateModified":"2026-10-12","about":{"@id":"https://alphanodus.com/#gravity"},"breadcrumb":{"@id":"https://alphanodus.com/journey#breadcrumb"}},{"@type":"BreadcrumbList","@id":"https://alphanodus.com/journey#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alphanodus.com/"},{"@type":"ListItem","position":2,"name":"How Gravity runs the order","item":"https://alphanodus.com/journey"}]},{"@type":"FAQPage","@id":"https://alphanodus.com/journey#faq","mainEntity":[{"@type":"Question","name":"How does Gravity run an imaging order?","acceptedAnswer":{"@type":"Answer","text":"Gravity gets the order, completes the exam and gets it paid. Where the work is routine, Gravity just does it. Where it takes intelligence, reading the fax, making the call, working the portal, Gravity’s agents do it, and your people either review the work or handle the exceptions."}},{"@type":"Question","name":"Which steps are agentic?","acceptedAnswer":{"@type":"Answer","text":"Reading every document and creating the order, the order appropriateness check, financial clearance, booking outreach, the AI voice agent, portal eligibility checks, the medical necessity check, prior auth submission and status on payer portals, and breast tracking and recall. The rest, from reminders and check-in links to report delivery and remittance matching, is automated."}},{"@type":"Question","name":"Can we review an agent’s work before it finishes?","acceptedAnswer":{"@type":"Answer","text":"Review first. Let it finish when you’re ready. Where a flow has a review setting, the center chooses: a person approves each run, or it finishes on its own. What an agent can’t finish lands on a worklist in Gravity Work, in front of the right person, with the history attached."}},{"@type":"Question","name":"How do patients book, check in and pay?","acceptedAnswer":{"@type":"Answer","text":"Patients book themselves from the app or by chat, or the AI voice agent books them by phone, under the same rules your booking staff follow. Before the visit, patients confirm their details, answer screening questions, sign consents, upload documents and pay the copay or patient responsibility, all from one text link with no login."}},{"@type":"Question","name":"Does Gravity read the scan or submit the claim?","acceptedAnswer":{"@type":"Answer","text":"We don’t read the scan. We make sure it gets back. The exam and the read happen in your RIS and PACS, and the claim goes out through your RCM. Gravity creates the charge items from the order, delivers the signed report and the images, and works the payer’s remittance when it comes back."}},{"@type":"Question","name":"How does Gravity work with our RIS, PACS and RCM?","acceptedAnswer":{"@type":"Answer","text":"It can run on top of the systems you already run. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away."}}]}]}`},P=N,F=({l:e,className:t})=>e.href?u(`a`,{className:t,href:e.href,children:e.label}):u(`span`,{className:t,children:e.label}),I=[[0,0],[.2,.5],[.4,4.9],[.6,5.5],[.8,9.1],[1,10.4]],L=[[0,-.03,0,.31,.46],[.04,-.03,0,.31,.46],[.16,-.03,.01,.31,.88],[.2,-.03,.01,.31,.88],[.3,0,0,1,1],[.4,0,0,1,1],[.48,.29,0,1,.6],[.6,.29,0,1,.6],[.68,.29,.5,1,1],[.8,.29,.5,1,1],[.9,0,0,1,1],[1,0,0,1,1]],R=e=>{for(let t=1;t<L.length;t++){let n=L[t-1],r=L[t];if(e<=r[0]){let t=r[0]>n[0]?(e-n[0])/(r[0]-n[0]):1,i=t*t*(3-2*t);return[1,2,3,4].map(e=>n[e]+(r[e]-n[e])*i)}}return L[L.length-1].slice(1)},z=e=>{for(let t=1;t<I.length;t++){let[n,r]=I[t-1],[i,a]=I[t];if(e<=i)return r+(e-n)/(i-n)*(a-r)}return I[I.length-1][1]},B=e=>{let t=e.currentTarget.getAttribute(`href`)||``,n=t.startsWith(`#`)?document.querySelector(t):null;if(!n)return;e.preventDefault();let r=parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--an-header-h`))||0,a=i.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches;i.scrollTo({top:n.getBoundingClientRect().top+i.scrollY-r,behavior:a?`auto`:`smooth`}),history.replaceState(null,``,t)},V={win:{lock:[0,.2],visit:[.2,.33],incoming:[.33,.45],call_out:[.45,.66],outgoing:[.66,.71],call_in:[.71,.93],confirm:[.93,1.01]},note:.05,call_out:[.47,.51,.55,.59,.63],call_in:[.73,.77,.81,.85,.89],checks:[.75,.79,.59,.83],early:.81,mine:.88,status:.91},H=({k:e})=>l(`svg`,{viewBox:`0 0 200 240`,"aria-hidden":`true`,children:[l(`defs`,{children:[l(`radialGradient`,{id:`kb${e}`,cx:`.5`,cy:`.45`,r:`.6`,children:[u(`stop`,{offset:`0`,stopColor:`#d9d9d9`}),u(`stop`,{offset:`1`,stopColor:`#7d7d7d`})]}),l(`filter`,{id:`kn${e}`,children:[u(`feTurbulence`,{baseFrequency:`.9`,numOctaves:`2`}),u(`feColorMatrix`,{values:`0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .18 0`}),u(`feComposite`,{in2:`SourceGraphic`,operator:`in`})]})]}),u(`rect`,{width:`200`,height:`240`,fill:`#050505`}),u(`ellipse`,{cx:`100`,cy:`122`,rx:`78`,ry:`118`,fill:`#2c2c2c`}),u(`path`,{d:`M70 0h64v70c0 30 14 38 10 58-5 20-36 18-50 12-16-6-30-2-36-20-5-16 12-24 12-50z`,fill:`url(#kb${e})`,stroke:`#111`,strokeWidth:`3`}),u(`path`,{d:`M58 140c14-6 30-2 44-1 14 1 34-4 48 1l-2 100H62z`,fill:`url(#kb${e})`,stroke:`#111`,strokeWidth:`3`}),u(`path`,{d:`M60 130c14 6 30 4 44 3 14-1 30 2 44-2M60 137c14-4 30-1 44 0s32-3 46 1`,fill:`none`,stroke:`#bdbdbd`,strokeWidth:`1.2`,opacity:`.8`}),u(`path`,{d:`M72 134c12 1 24 1 34 0`,stroke:`#f5f5f5`,strokeWidth:`1`,opacity:`.7`}),u(`ellipse`,{cx:`44`,cy:`96`,rx:`11`,ry:`22`,fill:`#a9a9a9`,stroke:`#111`,strokeWidth:`2.5`}),u(`path`,{d:`M150 60c16 30 18 70 6 110M158 150c6 30 4 60-4 90`,fill:`none`,stroke:`#4a4a4a`,strokeWidth:`8`,opacity:`.6`}),u(`path`,{d:`M40 40l6 34M44 120l8 26`,stroke:`#141414`,strokeWidth:`5`,strokeLinecap:`round`}),u(`path`,{d:`M98 128l22 14`,stroke:`#1a1a1a`,strokeWidth:`4`,strokeLinecap:`round`}),u(`path`,{d:`M66 136l18 2-16 6zM124 138l26-2-8 9z`,fill:`#0d0d0d`}),u(`path`,{d:`M128 141l14-3`,stroke:`#f2f2f2`,strokeWidth:`1.6`}),u(`circle`,{cx:`136`,cy:`140`,r:`11`,fill:`none`,stroke:`#C9B3FF`,strokeWidth:`1.5`}),u(`rect`,{width:`200`,height:`240`,filter:`url(#kn${e})`})]}),U={win:{rules:[0,.25],note:[.25,.5],portal:[.5,.78],order:[.78,1.01]},result:.07,booking:.15,found:[.3,.35,.4],crit:[.32,.37,.42],ready:.46,rows:[.81,.85,.89,.93],play:[.5,.75],walk:29.8},W={win:[[.22,.36],[.36,.5],[.5,.78],[.78,1.01]],lock:[0,.22],note:.05,items:[.06,.28,.31,.42,.56,.66,.82],kiosk:.86,status:.92},G={outside:[.04,.1,.16],report:.28,lines:[.34,.4],result:.45,items:[.54,.62,.7],status:.76,lock:[0,.74],note:.66,win:[.74,1.01]},K={win:{ready:[0,.76],loop:[.76,1.01]},items:[.03,.06,.09,.12,.15,.18],charge:.3,sent:.4,remit:.53,rows:[.57,.6,.63,.66],status:.7,steps:[.79,.82,.85,.88,.91,.94]},ne(M,{})})),q,J,Y,X,Z,ge,Q,_e,ve,$,ye;e((()=>{f(),S(),_(),n(),he(),T(),q=b(M),J={FOXlDGCV_:`(min-width: 1200px)`,nhHLHPWjL:`(min-width: 810px) and (max-width: 1199.98px)`,u5AJgNTJu:`(max-width: 809.98px)`},Y=[],X=`framer-IvqVL`,Z={FOXlDGCV_:`framer-v-y0m626`,nhHLHPWjL:`framer-v-1ecdg70`,u5AJgNTJu:`framer-v-19erdri`},ge=(e,t,n)=>e&&t?`position`:n,Q={Desktop:`FOXlDGCV_`,Phone:`u5AJgNTJu`,Tablet:`nhHLHPWjL`},_e=({value:e})=>ce()?null:u(`style`,{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),ve=({height:e,id:t,width:n,...r})=>({...r,variant:Q[r.variant]??r.variant??`FOXlDGCV_`}),$=se(d(function(e,n){let r=m(null),i=n??r,a=o(),{activeLocale:s,setLocale:d}=ae();ee();let{style:f,className:p,layoutId:_,variant:b,...S}=ve(e);oe(t(()=>le({},s),[s]));let[ne,se]=re(b,J,!1),ce=x(X),w=c(C)?.isLayoutTemplate,T=!!c(h)?.transition?.layout,E=ge(w,T);return y({}),u(C.Provider,{value:{activeVariantId:ne,humanReadableVariantMap:Q,primaryVariantId:`FOXlDGCV_`,variantClassNames:Z},children:l(g,{id:_??a,children:[u(_e,{value:`html body { background: none; }`}),u(v.main,{...S,className:x(ce,`framer-y0m626`,p),ref:i,style:{...f},children:u(ie,{children:u(te,{className:`framer-lapczm-container`,"data-code-component-plugin-id":`api`,"data-framer-name":`Journey Page`,isAuthoredByUser:!0,layout:E,name:`Journey Page`,nodeId:`Ewc4XJpcS`,scopeId:`CTdErQntk`,children:u(M,{height:`100%`,id:`Ewc4XJpcS`,layoutId:`Ewc4XJpcS`,name:`Journey Page`,style:{width:`100%`},width:`100%`})})})}),u(`div`,{id:`overlay`})]})})}),[`.framer-IvqVL.framer-yvwu, .framer-IvqVL .framer-yvwu { display: block; }`,`.framer-IvqVL.framer-y0m626 { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-IvqVL .framer-lapczm-container { flex: none; height: auto; position: relative; width: 100%; }`,`@media (min-width: 810px) and (max-width: 1199.98px) { .framer-IvqVL.framer-y0m626 { width: 810px; }}`,`@media (max-width: 809.98px) { .framer-IvqVL.framer-y0m626 { width: 390px; }}`],`framer-IvqVL`),$.displayName=`Journey`,$.defaultProps={height:7360,width:1200},w($,[{explicitInter:!0,fonts:[]},...q],{supportsExplicitInterCodegen:!0}),ye={exports:{default:{type:`reactComponent`,name:`FramerCTdErQntk`,slots:[],annotations:{framerComponentViewportWidth:`true`,framerContractVersion:`1`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"nhHLHPWjL":{"layout":["fixed","auto"]},"u5AJgNTJu":{"layout":["fixed","auto"]}}}`,framerAcceptsLayoutTemplate:`true`,framerResponsiveScreen:`true`,framerScrollSections:`false`,framerImmutableVariables:`true`,framerDisplayContentsDiv:`false`,framerLayoutTemplateFlowEffect:`true`,framerIntrinsicWidth:`1200`,framerAutoSizeImages:`true`,framerIntrinsicHeight:`7360`,framerColorSyntax:`true`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{ye as __FramerMetadata__,$ as default,Y as queryParamNames};
//# sourceMappingURL=vAN1t5QV8Wx1FfLiE-maxwGyPxcZh6YSKzlI_clBWac.DDM6J0ng.mjs.map