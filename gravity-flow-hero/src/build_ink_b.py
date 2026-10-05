# Generates the Gravity Flow hero artwork in the home page's "ga" glass-panel vocabulary.
CSS = """
.ga{margin:0;width:100%;max-width:1180px;justify-self:center}
.ga svg{display:block;width:100%;height:auto}
.ga .ga-d{font-family:var(--display,"Urbanist",sans-serif);font-weight:700;fill:#FFF}
.ga .ga-l{font-family:var(--sans,"Inter",sans-serif);font-weight:500;fill:#FFF}
.ga .ga-m{font-family:var(--mono,"JetBrains Mono",monospace);letter-spacing:.12em;fill:#C9B3FF}
.ga .ga-ca,.ga .ga-cb,.ga .ga-h,.ga .ga-a,.ga .ga-ag{fill:none;stroke:#FFF;stroke-linecap:round}
.ga .ga-ca{stroke-opacity:.1;stroke-width:7}
.ga .ga-cb{stroke-opacity:.42;stroke-width:1.4}
.ga .ga-h{stroke-opacity:.32;stroke-width:1.6}
.ga .ga-a,.ga .ga-ag{stroke:#C9B3FF;stroke-dasharray:100 100}
.ga .ga-a{stroke-width:3.5}
.ga .ga-ag{stroke-width:12;stroke-opacity:.25}
.ga .ga-o{fill:none;stroke:#C9B3FF;stroke-width:2.5;stroke-linecap:round;transform-box:fill-box;transform-origin:center;animation:ga-spin 6s linear infinite}
.ga .ga-o2{stroke-opacity:.7;animation-duration:4s;animation-direction:reverse}
@keyframes ga-spin{to{transform:rotate(1turn)}}
.ga .ga-p{fill:none;stroke:#FFF;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:10 200;opacity:0}
@keyframes ga-a1{0%,11.7%{stroke-dashoffset:100;opacity:1}21.7%,91%{stroke-dashoffset:0;opacity:1}96%{stroke-dashoffset:0;opacity:0}96.1%,100%{stroke-dashoffset:100;opacity:0}}
@keyframes ga-a2{0%,35%{stroke-dashoffset:100;opacity:1}45%,91%{stroke-dashoffset:0;opacity:1}96%{stroke-dashoffset:0;opacity:0}96.1%,100%{stroke-dashoffset:100;opacity:0}}
@keyframes ga-r12{0%{stroke-dashoffset:10;opacity:1}10%{stroke-dashoffset:-100;opacity:1}10.1%,100%{opacity:0}}
@keyframes ga-n1{0%,9%{opacity:.3}10%,91%{opacity:1}96%,100%{opacity:.3}}
@keyframes ga-n2{0%,32%{opacity:.3}33.4%,91%{opacity:1}96%,100%{opacity:.3}}
@keyframes ga-n3{0%,44%{opacity:.3}45%,91%{opacity:1}96%,100%{opacity:.3}}
@keyframes ga-n3t{0%,56%{opacity:0}57%,91%{opacity:1}96%,100%{opacity:0}}
@keyframes ga-t{0%,16%,100%{fill-opacity:.08;stroke-opacity:.2}4%,11%{fill-opacity:.22;stroke-opacity:.9}}
@media (prefers-reduced-motion:reduce){.ga [style],.ga .ga-o{animation:none!important}.ga .ga-p{display:none}
 .ga .ga-a,.ga .ga-ag{stroke-dashoffset:0}.ga .gf-n3t{opacity:1}}
"""
IC = {
 'order':  "M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M12 11v6M9 14h6",
 'report': "M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M8.5 14.5l2.2 2.2 4.3-4.6",
 'appt':   "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4",
 'missed': "M10 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20.5a7 7 0 0 1 14 0M16.5 8.5l5 5M21.5 8.5l-5 5",
 'auto':   "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.2l2.8 2.8 5.2-5.6",
 'agent':  "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
 'person': "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0",
}
def row(x,y,icon,label,delay,sub=None,anim='ga-t 12s linear %ss infinite',fs=21):
    s=f'<g><rect x="{x}" y="{y}" width="56" height="56" rx="14" fill="#FFF" fill-opacity="0.08" stroke="#FFF" stroke-opacity="0.2" stroke-width="1.2" style="animation:{anim % delay}"></rect>'
    s+=f'<path d="{IC[icon]}" transform="translate({x+13} {y+13}) scale(1.25)" fill="none" stroke="#C9B3FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>'
    if sub:
        s+=f'<text x="{x+72}" y="{y+27}" class="ga-l" font-size="{fs}">{label}</text><text x="{x+72}" y="{y+47}" class="ga-m" font-size="11">{sub}</text>'
    else:
        s+=f'<text x="{x+72}" y="{y+35}" class="ga-l" font-size="21">{label}</text>'
    return s+'</g>'
def chips(cx,y,items):
    out=''
    for i,t in enumerate(items):
        w=int(len(t)*9.1+30); yy=y+i*36
        out+=f'<g><rect x="{cx-w/2:.0f}" y="{yy}" width="{w}" height="30" rx="15" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.2" stroke-width="1.2"></rect><text x="{cx}" y="{yy+20}" text-anchor="middle" class="ga-l" font-size="15.5">{t}</text></g>'
    return out
def pulse(d,delay,dur='ga-r12 12s'):
    return f'<path class="ga-p" d="{d}" pathLength="100" style="animation:{dur} linear {delay}s infinite"></path>'
def conn(d): return f'<g><path class="ga-ca" d="{d}"></path><path class="ga-cb" d="{d}"></path></g>'
def pillar(cx,cy,name,n,extra=''):
    s=f'<g><g><circle cx="{cx}" cy="{cy}" r="62" fill="url(#gf-nw)" style="animation:ga-{n} 12s linear 0s infinite"></circle><circle cx="{cx}" cy="{cy}" r="43" fill="#C9B3FF" fill-opacity="0.14" stroke="#C9B3FF" stroke-opacity="0.45" stroke-width="2"></circle><circle cx="{cx}" cy="{cy}" r="30" fill="#C9B3FF" style="animation:ga-{n} 12s linear 0s infinite"></circle></g>'
    if extra=='paid':
        s+=f'<g class="gf-n3t"><circle cx="{cx}" cy="{cy}" r="62" fill="url(#gf-ow)" style="animation:ga-n3t 12s linear 0s infinite"></circle><circle cx="{cx}" cy="{cy}" r="43" fill="#67E3EE" fill-opacity="0.14" stroke="#67E3EE" stroke-opacity="0.45" stroke-width="2"></circle><circle cx="{cx}" cy="{cy}" r="30" fill="#67E3EE" style="animation:ga-n3t 12s linear 0s infinite"></circle></g>'
    return s+f'<text x="{cx}" y="{cy+98}" text-anchor="middle" class="ga-d" font-size="34">{name}</text></g>'

L=[("order","Order created",0),("report","Report signed",3),("appt","Appointment booked",6),("missed","Patient missed the visit",9)]
svg='<svg viewBox="0 0 1200 900" role="img" aria-label="Gravity Flow runs the routine work on its own. Any event, such as an order created, a report signed, an appointment booked or a missed visit, starts a workflow. Automated workflows finish on their own, agentic workflows have an agent do the work, and exceptions go to your team with the history attached. The workflows cover getting the order, completing the exam and getting paid.">'
svg+='<defs><radialGradient id="gf-cw"><stop offset="0" stop-color="#6B3FE4" stop-opacity="0.75"></stop><stop offset=".55" stop-color="#6B3FE4" stop-opacity="0.25"></stop><stop offset="1" stop-color="#6B3FE4" stop-opacity="0"></stop></radialGradient><radialGradient id="gf-nw"><stop offset="0" stop-color="#C9B3FF" stop-opacity="0.55"></stop><stop offset="1" stop-color="#C9B3FF" stop-opacity="0"></stop></radialGradient><radialGradient id="gf-ow"><stop offset="0" stop-color="#67E3EE" stop-opacity="0.6"></stop><stop offset="1" stop-color="#67E3EE" stop-opacity="0"></stop></radialGradient><linearGradient id="gf-gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.1"></stop><stop offset=".45" stop-color="#FFF" stop-opacity="0.045"></stop><stop offset="1" stop-color="#FFF" stop-opacity="0.06"></stop></linearGradient></defs>'
svg+='<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"></rect><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gf-gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"></rect>'
# connectors
cl="M408 300 L 524 300"; cr="M676 300 L 792 300"
c1="M572 372 C 566 520 534 556 480 556 L 330 556 C 284 556 260 570 260 596"; c2="M600 376 L 600 596"; c3="M628 372 C 634 520 666 556 720 556 L 870 556 C 916 556 940 570 940 596"
for d in (cl,cr,c1,c2,c3): svg+=conn(d)
svg+='<path class="ga-h" d="M260 640H940"></path>'
svg+='<g style="animation:ga-a1 12s linear 0s infinite"><path class="ga-ag" d="M260 640H600" pathLength="100"></path><path class="ga-a" d="M260 640H600" pathLength="100"></path></g><g style="animation:ga-a2 12s linear 0s infinite"><path class="ga-ag" d="M600 640H940" pathLength="100"></path><path class="ga-a" d="M600 640H940" pathLength="100"></path></g>'
# pulses: events into the engine, results out, then down to the pillars
for d_ in (0,3,6,9): svg+=pulse(cl,d_)
for d_ in (3.2,5.4,8.0): svg+=pulse(cr,d_)
svg+=pulse(c1,0)+pulse(c2,2.8)+pulse(c3,5.6)+pulse("M260 640H600",1.4)+pulse("M600 640H940",4.2)
# pillars
svg+=pillar(260,640,"Get the order","n1")+pillar(600,640,"Complete the exam","n2")+pillar(940,640,"Get paid","n3",'paid')
svg+=chips(260,758,["Referrer campaigns","Report back to referrer","Breast tracking and recall"])
svg+=chips(600,758,["Clinical clearance","Booking outreach","Reminders and earlier slots"])
svg+=chips(940,758,["Financial clearance","Eligibility and prior auth","Patient estimates"])
# engine
svg+='<circle cx="600" cy="300" r="150" fill="url(#gf-cw)"></circle><circle cx="600" cy="300" r="76" fill="none" stroke="#C9B3FF" stroke-opacity="0.35" stroke-width="1.5"></circle><circle cx="600" cy="300" r="56" fill="#1B1430" stroke="#C9B3FF" stroke-opacity="0.7" stroke-width="2"></circle><circle cx="600" cy="300" r="34" fill="none" stroke="#C9B3FF" stroke-opacity="0.3" stroke-width="1.5"></circle><circle class="ga-o" cx="600" cy="300" r="76" pathLength="100" stroke-dasharray="16 34"></circle><circle class="ga-o ga-o2" cx="600" cy="300" r="34" pathLength="100" stroke-dasharray="22 28"></circle><circle cx="600" cy="300" r="15" fill="#C9B3FF"></circle>'
svg+='<text x="600" y="160" text-anchor="middle" class="ga-d" font-size="46">Gravity Flow</text><text x="600" y="192" text-anchor="middle" class="ga-m" font-size="13">AUTOMATION AND AGENTIC WORKFLOWS</text>'
# left card
svg+='<g><rect x="56" y="96" width="352" height="392" rx="20" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"></rect><text x="232" y="134" text-anchor="middle" class="ga-m" font-size="13">ANY EVENT STARTS A WORKFLOW</text>'
for i,(ic,lb,dl) in enumerate(L): svg+=row(84,168+i*80,ic,lb,dl)
svg+='</g>'
# right card
svg+='<g><rect x="792" y="96" width="352" height="392" rx="20" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"></rect><text x="968" y="134" text-anchor="middle" class="ga-m" font-size="13">WHAT HAPPENS NEXT</text>'
R=[("auto","Done on its own","AUTOMATED",3.2),("agent","An agent does the work","AGENTIC",5.4),("person","Exceptions go to your team","WITH THE HISTORY ATTACHED",8.0)]
for i,(ic,lb,sb,dl) in enumerate(R): svg+=row(820,172+i*96,ic,lb,dl,sb,fs=19)
svg+='</g></svg>'

fig='<figure class="ga ga-flow">'+svg+'</figure>'
open('flow-hero-embed.html','w').write('<!-- Gravity Flow hero artwork: drop-in, uses the same .ga classes and 12s animation language as the home hero. Fonts: Urbanist, Inter, JetBrains Mono. -->\n<style>'+CSS+'</style>\n'+fig+'\n')
page=f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gravity Flow hero artwork, ink-b</title>
<style>
@font-face{{font-family:Urbanist;font-weight:700;src:url(fonts/urbanist-latin-700-normal.woff2) format("woff2")}}
@font-face{{font-family:Inter;font-weight:500;src:url(fonts/inter-latin-500-normal.woff2) format("woff2")}}
@font-face{{font-family:"JetBrains Mono";font-weight:400;src:url(fonts/jetbrains-mono-latin-400-normal.woff2) format("woff2")}}
:root{{--display:"Urbanist",sans-serif;--sans:"Inter",sans-serif;--mono:"JetBrains Mono",monospace}}
html,body{{margin:0;height:100%;background:#1B1430;overflow:hidden}}
#frame{{width:1600px;height:1200px;position:absolute;left:50%;top:50%;transform-origin:center;background:#1B1430;overflow:hidden;isolation:isolate}}
#frame::before,#frame::after{{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none}}
#frame::before{{background:radial-gradient(55% 70% at 82% 38%,rgba(107,63,228,.60),transparent 62%),radial-gradient(35% 45% at 92% 88%,rgba(34,193,206,.30),transparent 60%),radial-gradient(45% 60% at 8% -10%,rgba(91,47,209,.45),transparent 60%)}}
#frame::after{{background:radial-gradient(rgba(255,255,255,.12) 1px,transparent 1.3px) 0 0/22px 22px,linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px;-webkit-mask-image:radial-gradient(90% 100% at 60% 30%,#000 30%,transparent 85%);mask-image:radial-gradient(90% 100% at 60% 30%,#000 30%,transparent 85%)}}
#frame .ga{{position:absolute;left:48px;top:36px;width:1504px;max-width:none}}
{CSS}
</style></head><body>
<div id="frame">{fig}</div>
<script>
const fit=()=>{{document.getElementById('frame').style.transform=`translate(-50%,-50%) scale(${{Math.min(innerWidth/1600,innerHeight/1200)}})`}};addEventListener('resize',fit);fit();
window.__seek=ms=>document.getAnimations().forEach(a=>{{a.pause();a.currentTime=ms}});
</script></body></html>"""
open('gravity-flow-hero-ink-b.html','w').write(page)
print('ok',len(svg))
