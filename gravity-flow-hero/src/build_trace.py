# Gravity Flow hero: "one run, traced". Original composition built from the product's mechanism.
import math
T=16.0           # loop seconds
TRAVEL=5.2       # seconds for a pulse to cross a whole run path
def bez(p0,p1,p2,p3,t):
    return tuple((1-t)**3*p0[i]+3*(1-t)**2*t*p1[i]+3*(1-t)*t**2*p2[i]+t**3*p3[i] for i in (0,1))
class Path:
    def __init__(s,x,y): s.cmds=[('M',x,y)]; s.pts=[(x,y)]; s.cum=[0.0]
    def _add(s,pts):
        for p in pts:
            s.cum.append(s.cum[-1]+math.dist(s.pts[-1],p)); s.pts.append(p)
    def L(s,x,y): s.cmds.append(('L',x,y)); s._add([(x,y)]); return s
    def H(s,x): return s.L(x,s.pts[-1][1])
    def V(s,y): return s.L(s.pts[-1][0],y)
    def C(s,x1,y1,x2,y2,x,y):
        p0=s.pts[-1]; s.cmds.append(('C',x1,y1,x2,y2,x,y)); s._add([bez(p0,(x1,y1),(x2,y2),(x,y),i/40) for i in range(1,41)]); return s
    def d(s): return ' '.join(f"{c[0]}{' '.join(str(round(v,1)) for v in c[1:])}" for c in s.cmds)
    def total(s): return s.cum[-1]
    def frac_at_x(s,x):
        for i in range(1,len(s.pts)):
            (x0,y0),(x1,y1)=s.pts[i-1],s.pts[i]
            if (x0<=x<=x1) or (x1<=x<=x0):
                f=0 if x1==x0 else (x-x0)/(x1-x0); return (s.cum[i-1]+f*(s.cum[i]-s.cum[i-1]))/s.total()
        return 1.0
    def frac_at_y(s,y):
        for i in range(1,len(s.pts)):
            (x0,y0),(x1,y1)=s.pts[i-1],s.pts[i]
            if (y0<=y<=y1) or (y1<=y<=y0):
                f=0 if y1==y0 else (y-y0)/(y1-y0); return (s.cum[i-1]+f*(s.cum[i]-s.cum[i-1]))/s.total()
        return 1.0

CSS="""
.ga{margin:0;width:100%;max-width:1180px;justify-self:center}
.ga svg{display:block;width:100%;height:auto}
.ga .ga-d{font-family:var(--display,"Urbanist",sans-serif);font-weight:700;fill:#FFF}
.ga .ga-l{font-family:var(--sans,"Inter",sans-serif);font-weight:500;fill:#FFF}
.ga .ga-m{font-family:var(--mono,"JetBrains Mono",monospace);letter-spacing:.12em;fill:#C9B3FF}
.ga .ga-ca,.ga .ga-cb,.ga .ga-h{fill:none;stroke:#FFF;stroke-linecap:round}
.ga .ga-ca{stroke-opacity:.1;stroke-width:7}
.ga .ga-cb{stroke-opacity:.42;stroke-width:1.4}
.ga .ga-o{fill:none;stroke:#C9B3FF;stroke-width:2.5;stroke-linecap:round;transform-box:fill-box;transform-origin:center;animation:ga-spin 6s linear infinite}
.ga .ga-o2{stroke-opacity:.7;animation-duration:4s;animation-direction:reverse}
@keyframes ga-spin{to{transform:rotate(1turn)}}
.ga .gf-p{fill:none;stroke:#FFF;stroke-width:2.8;stroke-linecap:round;stroke-dasharray:10 200;opacity:0}
.ga .gf-pa{stroke:#C9B3FF}
@keyframes gf-run{0%{stroke-dashoffset:10;opacity:1}30%{stroke-dashoffset:-100;opacity:1}30.1%,100%{opacity:0}}
@keyframes gf-spur{0%{stroke-dashoffset:10;opacity:1}6%{stroke-dashoffset:-100;opacity:1}6.1%,100%{opacity:0}}
@keyframes gf-lit{0%,80%{opacity:1}92%,100%{opacity:.28}}
@keyframes gf-row{0%{fill-opacity:.2;stroke-opacity:.9}8%,100%{fill-opacity:.06;stroke-opacity:.2}}
@keyframes gf-in{0%{opacity:0}4%,80%{opacity:1}92%,100%{opacity:0}}
.ga .gf-dim{opacity:.28}
@media (prefers-reduced-motion:reduce){.ga [style*=animation],.ga .ga-o{animation:none!important}.ga .gf-p{display:none}.ga .gf-dim{opacity:1}}
"""
IC={
 'order':"M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M12 11v6M9 14h6",
 'report':"M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M8.5 14.5l2.2 2.2 4.3-4.6",
 'appt':"M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4",
 'missed':"M10 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20.5a7 7 0 0 1 14 0M16.5 8.5l5 5M21.5 8.5l-5 5",
}
# ---------- geometry ----------
PORTS=[('order','Order created'),('report','Report signed'),('appt','Appointment booked'),('missed','Visit missed')]
py=[202,282,362,442]
TRUNK=(340,322); FORK=(440,322); GATE_X=388
UY=232; LY=468; MX,MY=1086,350
def entry(i):
    p=Path(274,py[i]); p.C(310,py[i],304,322,340,322); p.H(FORK[0]); return p
def rule_path(i):
    p=entry(i); p.C(480,322,490,UY,540,UY); p.H(990); p.C(1030,UY,1030,MY,MX,MY); return p
def agent_path(i):
    p=entry(i); p.C(480,322,490,LY,540,LY); p.H(990); p.C(1030,LY,1030,MY,MX,MY); return p
svg=[]; A=svg.append
A('<svg viewBox="0 0 1200 900" role="img" aria-label="One run of Gravity Flow, traced. Any event, such as an order created, a report signed, an appointment booked or a visit missed, starts a workflow from the Flow Marketplace. Limits are checked first. Routine work follows a rule and finishes on its own. Where there is something to decide, an agent reads, decides and acts. What it cannot finish lands on a worklist for your team with the history attached. Every run is on record, about 200,000 a month.">')
A('<defs><radialGradient id="gt-cw"><stop offset="0" stop-color="#6B3FE4" stop-opacity="0.75"/><stop offset=".55" stop-color="#6B3FE4" stop-opacity="0.25"/><stop offset="1" stop-color="#6B3FE4" stop-opacity="0"/></radialGradient><radialGradient id="gt-nw"><stop offset="0" stop-color="#C9B3FF" stop-opacity="0.55"/><stop offset="1" stop-color="#C9B3FF" stop-opacity="0"/></radialGradient><radialGradient id="gt-ow"><stop offset="0" stop-color="#67E3EE" stop-opacity="0.6"/><stop offset="1" stop-color="#67E3EE" stop-opacity="0"/></radialGradient><linearGradient id="gt-gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.1"/><stop offset=".45" stop-color="#FFF" stop-opacity="0.045"/><stop offset="1" stop-color="#FFF" stop-opacity="0.06"/></linearGradient></defs>')
A('<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gt-gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>')
# marketplace shelf
A('<text x="60" y="68" class="ga-m" font-size="12">FLOW MARKETPLACE · INSTALLED AND RUNNING THE SAME DAY</text>')
x=60
for t in ['Clinical clearance','Booking outreach','Prior auth status checks','PECOS check','Breast recall']:
    w=int(len(t)*8.9+40)
    A(f'<g><rect x="{x}" y="82" width="{w}" height="34" rx="17" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.2" stroke-width="1.2"/><circle cx="{x+18}" cy="99" r="4" fill="#C9B3FF"/><text x="{x+32}" y="105" class="ga-l" font-size="15.5">{t}</text></g>')
    x+=w+12
# entry
A('<text x="159" y="160" text-anchor="middle" class="ga-m" font-size="12">ANY EVENT</text>')
rule_runs=[(0.8,1),(5.4,2)]   # (start delay, port index) for rule runs
agent_runs=[(2.6,3),(8.6,0)]
for i in range(4): 
    A(f'<g><path class="ga-ca" d="{entry(i).d()}"/><path class="ga-cb" d="{entry(i).d()}"/></g>')
ru=rule_path(1); ag=agent_path(2)
for pth in (ru,ag):
    A(f'<g><path class="ga-ca" d="{pth.d()}"/><path class="ga-cb" d="{pth.d()}"/></g>')
for i,(ic,lb) in enumerate(PORTS):
    y=py[i]-26
    A(f'<g><rect x="52" y="{y}" width="222" height="52" rx="14" fill="#FFF" fill-opacity="0.08" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.2" style="animation:gf-row {T}s linear {[0.8,2.6,5.4,8.6][i]}s infinite"/><path d="{IC[ic]}" transform="translate({52+14} {y+14})" fill="none" stroke="#C9B3FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><text x="{52+50}" y="{y+32}" class="ga-l" font-size="16">{lb}</text></g>')
# gate (limits checked before anything goes out)
A(f'<g><rect x="{GATE_X-16}" y="288" width="3" height="68" rx="1.5" fill="#C9B3FF"/><rect x="{GATE_X+13}" y="288" width="3" height="68" rx="1.5" fill="#C9B3FF"/><circle cx="{GATE_X}" cy="322" r="5" fill="#C9B3FF" style="animation:gf-lit {T}s linear 1.0s infinite"/></g>')
A(f'<text x="{GATE_X}" y="392" text-anchor="middle" class="ga-m" font-size="11">LIMITS CHECKED</text><text x="{GATE_X}" y="414" text-anchor="middle" class="ga-l" font-size="14.5">Contact caps</text><text x="{GATE_X}" y="434" text-anchor="middle" class="ga-l" font-size="14.5">Do-not-contact</text>')
# track labels
A(f'<text x="540" y="{UY-26}" class="ga-m" font-size="12">RULE · NOTHING TO DECIDE</text>')
A(f'<text x="770" y="{LY-70}" class="ga-m" font-size="12">AGENTIC · SOMETHING TO DECIDE</text>')
# rule stations
def station(cx,cy,delay,label=None,lab_dy=34,two=None):
    s=f'<g><g style="animation:gf-lit {T}s linear {delay:.2f}s infinite" class="gf-dim"><circle cx="{cx}" cy="{cy}" r="26" fill="url(#gt-nw)"/><circle cx="{cx}" cy="{cy}" r="14" fill="#C9B3FF" fill-opacity="0.16" stroke="#C9B3FF" stroke-opacity="0.5" stroke-width="1.6"/><circle cx="{cx}" cy="{cy}" r="7" fill="#C9B3FF"/></g>'
    if two:
        for k,tt in enumerate(two): s+=f'<text x="{cx}" y="{cy+lab_dy+k*20}" text-anchor="middle" class="ga-l" font-size="16">{tt}</text>'
    return s+'</g>'
for cx,two in [(590,['Eligibility','checks']),(730,['Confirmations','and reminders']),(870,['Report back to','the referrer'])]:
    f=ru.frac_at_x(cx); st=0.8+f*TRAVEL
    A(station(cx,UY,st,two=two))
# lower: agent ring with its three beats, then follow-through
RX=640
for cx,two in [(790,['Follow-up','order']),(920,['Lay letter','sent'])]:
    f=ag.frac_at_x(cx); st=2.6+f*TRAVEL
    A(station(cx,LY,st,two=two))
A(f'<circle cx="{RX}" cy="{LY}" r="92" fill="url(#gt-cw)"/><circle cx="{RX}" cy="{LY}" r="50" fill="none" stroke="#C9B3FF" stroke-opacity="0.35" stroke-width="1.5"/><circle cx="{RX}" cy="{LY}" r="36" fill="#1B1430" stroke="#C9B3FF" stroke-opacity="0.7" stroke-width="2"/><circle cx="{RX}" cy="{LY}" r="22" fill="none" stroke="#C9B3FF" stroke-opacity="0.3" stroke-width="1.5"/><circle class="ga-o" cx="{RX}" cy="{LY}" r="50" pathLength="100" stroke-dasharray="16 34"/><circle class="ga-o ga-o2" cx="{RX}" cy="{LY}" r="22" pathLength="100" stroke-dasharray="22 28"/><circle cx="{RX}" cy="{LY}" r="9" fill="#C9B3FF"/>')
A(f'<text x="{RX}" y="{LY-62}" text-anchor="middle" class="ga-m" font-size="12">READS · DECIDES · ACTS</text>')
# spur to worklist
sp=Path(RX,LY+38); sp.V(588)
A(f'<g><path class="ga-ca" d="{sp.d()}"/><path class="ga-cb" d="{sp.d()}"/></g>')
A(f'<g><rect x="520" y="588" width="240" height="124" rx="20" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/><text x="640" y="614" text-anchor="middle" class="ga-m" font-size="11.5">YOUR TEAM · WORKLIST</text>')
A(f'<g style="animation:gf-in {T}s linear {2.6+ag.frac_at_x(RX)*TRAVEL+.3:.2f}s infinite" class="gf-dim"><rect x="538" y="626" width="204" height="40" rx="10" fill="#F59E0B" fill-opacity="0.16" stroke="#F59E0B" stroke-opacity="0.8" stroke-width="1.2"/><circle cx="558" cy="646" r="5" fill="#F59E0B"/><text x="572" y="651" class="ga-l" font-size="16">Needs review</text></g>')
A('<text x="640" y="692" text-anchor="middle" class="ga-m" font-size="11">WITH THE HISTORY ATTACHED</text></g>')
# merge / outcome (Lagoon, once)
A(f'<g class="gf-dim" style="animation:gf-lit {T}s linear {2.6+TRAVEL-.2:.2f}s infinite"><circle cx="{MX}" cy="{MY}" r="52" fill="url(#gt-ow)"/><circle cx="{MX}" cy="{MY}" r="30" fill="#67E3EE" fill-opacity="0.14" stroke="#67E3EE" stroke-opacity="0.5" stroke-width="2"/><circle cx="{MX}" cy="{MY}" r="18" fill="#67E3EE"/></g>')
A(f'<text x="{MX}" y="{MY+68}" text-anchor="middle" class="ga-d" font-size="26">Done</text><text x="{MX}" y="{MY+90}" text-anchor="middle" class="ga-m" font-size="11">WORK COMPLETED</text>')
# pulses
for d,i in rule_runs:
    p=rule_path(i); A(f'<path class="gf-p" d="{p.d()}" pathLength="100" style="animation:gf-run {T}s linear {d}s infinite"/>')
for d,i in agent_runs:
    p=agent_path(i); A(f'<path class="gf-p gf-pa" d="{p.d()}" pathLength="100" style="animation:gf-run {T}s linear {d}s infinite"/>')
# exception pulse down the spur after the first agent run reaches the ring
for d,_ in agent_runs[:1]:
    A(f'<path class="gf-p" d="{sp.d()}" pathLength="100" style="animation:gf-spur {T}s linear {d+ag.frac_at_x(RX)*TRAVEL+.1:.2f}s infinite"/>')
# ledger
A('<g><rect x="60" y="740" width="1080" height="124" rx="20" fill="#FFF" fill-opacity="0.07" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/><text x="84" y="772" class="ga-m" font-size="12">EVERY RUN ON RECORD · WHO, WHEN, DELIVERED OR NOT</text><text x="1116" y="774" text-anchor="end" class="ga-d" font-size="22">About 200,000 runs a month</text>')
rows=[('09:02:11','Reminder','Text','Delivered','#10B981',0.8),('09:02:12','Report back to the referrer','Fax','Delivered','#10B981',2.6),('09:02:12','Earlier-slot offer','Text','Declined at limit','#F59E0B',5.4)]
for k,(tm,wf,ch,st,col,dl) in enumerate(rows):
    y=802+k*26
    A(f'<rect x="76" y="{y-17}" width="1048" height="24" rx="8" fill="#FFF" fill-opacity="0.06" stroke="#C9B3FF" stroke-opacity="0.2" stroke-width="1" style="animation:gf-row {T}s linear {dl}s infinite"/>')
    A(f'<text x="92" y="{y}" class="ga-m" font-size="12.5" letter-spacing="0">{tm}</text><text x="196" y="{y}" class="ga-l" font-size="15.5">{wf}</text><text x="600" y="{y}" class="ga-l" font-size="15.5">{ch}</text><circle cx="760" cy="{y-5}" r="4.5" fill="{col}"/><text x="774" y="{y}" class="ga-l" font-size="15.5">{st}</text>')
A('</g></svg>')
fig='<figure class="ga ga-trace">'+''.join(svg)+'</figure>'
open('flow-trace-embed.html','w').write('<!-- Gravity Flow hero artwork "one run, traced". Same brand tokens and glass language as the site; original composition. 16s loop. -->\n<style>'+CSS+'</style>\n'+fig+'\n')
page=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gravity Flow hero, one run traced</title>
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
</style></head><body><div id="frame">{fig}</div>
<script>const fit=()=>{{document.getElementById('frame').style.transform=`translate(-50%,-50%) scale(${{Math.min(innerWidth/1600,innerHeight/1200)}})`}};addEventListener('resize',fit);fit();
window.__seek=ms=>document.getAnimations().forEach(a=>{{a.pause();a.currentTime=ms+{int(T*1000)}}});</script></body></html>"""
open('gravity-flow-hero-trace.html','w').write(page)
print('ok')
