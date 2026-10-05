# Three static banner concepts for Gravity Flow (4:3). Brand: ink glass panel, Plum, Lagoon once, Urbanist/Inter/JetBrains Mono.
import html,os
CSS="""
@font-face{font-family:Urbanist;font-weight:700;src:url(../fonts/urbanist-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:500;src:url(../fonts/inter-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:600;src:url(../fonts/inter-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"JetBrains Mono";font-weight:400;src:url(../fonts/jetbrains-mono-latin-400-normal.woff2) format("woff2")}
html,body{margin:0;background:#1B1430}
#frame{width:1600px;height:1200px;position:relative;background:#1B1430;overflow:hidden;isolation:isolate}
#frame::before,#frame::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none}
#frame::before{background:radial-gradient(55% 70% at 82% 38%,rgba(107,63,228,.60),transparent 62%),radial-gradient(35% 45% at 92% 88%,rgba(34,193,206,.30),transparent 60%),radial-gradient(45% 60% at 8% -10%,rgba(91,47,209,.45),transparent 60%)}
#frame::after{background:radial-gradient(rgba(255,255,255,.12) 1px,transparent 1.3px) 0 0/22px 22px,linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px;-webkit-mask-image:radial-gradient(90% 100% at 60% 30%,#000 30%,transparent 85%);mask-image:radial-gradient(90% 100% at 60% 30%,#000 30%,transparent 85%)}
svg{position:absolute;left:48px;top:36px;width:1504px;display:block}
.d{font-family:Urbanist,sans-serif;font-weight:700;fill:#fff}
.l{font-family:Inter,sans-serif;font-weight:500;fill:#fff}
.lb{font-family:Inter,sans-serif;font-weight:600;fill:#fff}
.m{font-family:"JetBrains Mono",monospace;letter-spacing:.12em;fill:#C9B3FF}
.s{font-family:Inter,sans-serif;font-weight:500;fill:#DCD5F2}
.ca{fill:none;stroke:#fff;stroke-opacity:.1;stroke-width:7;stroke-linecap:round}
.cb{fill:none;stroke:#fff;stroke-opacity:.42;stroke-width:1.4;stroke-linecap:round}
"""
IC={
 'trigger':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
 'config':"M4 20h4l10-10-4-4L4 16zM13 7l4 4",
 'http':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18",
 'filter':"M4 5h16l-6 7.5V19l-4 2v-8.5z",
 'hours':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
 'send':"M21 3L3 11l7 3 3 7zM10 14l11-11",
 'loop':"M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
 'down':"M12 3v12M7 11l5 5 5-5M5 21h14",
 'check':"M5 12.5l4.5 4.5L19 7",
 'person':"M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0",
 'auto':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.2l2.8 2.8 5.2-5.6",
 'agent':"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
}
def icon(name,x,y,s=1.0,color="#C9B3FF",sw=1.6):
    return f'<path d="{IC[name]}" transform="translate({x} {y}) scale({s})" fill="none" stroke="{color}" stroke-width="{sw/ s:.2f}" stroke-linecap="round" stroke-linejoin="round"/>'
def glass(x,y,w,h,r=20,op=.07,so=.22): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="#FFF" fill-opacity="{op}" stroke="#FFF" stroke-opacity="{so}" stroke-width="1.5"/>'
def tile(x,y,sz=56,ic=None,s=1.25,lag=False):
    c="#67E3EE" if lag else "#C9B3FF"
    return f'<rect x="{x}" y="{y}" width="{sz}" height="{sz}" rx="14" fill="{"#67E3EE" if lag else "#FFF"}" fill-opacity="{.14 if lag else .08}" stroke="{c}" stroke-opacity="{.6 if lag else .2}" stroke-width="1.2"/>'+(icon(ic,x+(sz-24*s)/2,y+(sz-24*s)/2,s,c) if ic else '')
def T(x,y,t,cls,size,anchor='start',extra=''):
    return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" text-anchor="{anchor}" {extra}>{html.escape(t)}</text>'
def pill(x,y,t,w=None,fill=False,size=14):
    w=w or int(len(t)*size*.58+26)
    f='#6B3FE4' if fill else '#FFF'
    return f'<g><rect x="{x}" y="{y}" width="{w}" height="28" rx="14" fill="{f}" fill-opacity="{1 if fill else .08}" stroke="#FFF" stroke-opacity="{0 if fill else .25}" stroke-width="1.2"/>{T(x+w/2,y+19,t,"lb",size,"middle")}</g>'
def conn(d): return f'<g><path class="ca" d="{d}"/><path class="cb" d="{d}"/></g>'
def node(x,y,kind,r=11):
    if kind=='auto': return f'<g><circle cx="{x}" cy="{y}" r="{r+13}" fill="url(#nw)"/><circle cx="{x}" cy="{y}" r="{r}" fill="#C9B3FF"/></g>'
    return f'<g><circle cx="{x}" cy="{y}" r="{r+13}" fill="url(#nw)"/><circle cx="{x}" cy="{y}" r="{r+3}" fill="#1B1430" stroke="#C9B3FF" stroke-width="2.6"/><circle cx="{x}" cy="{y}" r="4" fill="#C9B3FF"/></g>'
DEFS='<defs><radialGradient id="nw"><stop offset="0" stop-color="#C9B3FF" stop-opacity="0.5"/><stop offset="1" stop-color="#C9B3FF" stop-opacity="0"/></radialGradient><radialGradient id="ow"><stop offset="0" stop-color="#67E3EE" stop-opacity="0.6"/><stop offset="1" stop-color="#67E3EE" stop-opacity="0"/></radialGradient><radialGradient id="cw"><stop offset="0" stop-color="#6B3FE4" stop-opacity="0.7"/><stop offset=".55" stop-color="#6B3FE4" stop-opacity="0.22"/><stop offset="1" stop-color="#6B3FE4" stop-opacity="0"/></radialGradient><linearGradient id="gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity="0.1"/><stop offset=".45" stop-color="#FFF" stop-opacity="0.045"/><stop offset="1" stop-color="#FFF" stop-opacity="0.06"/></linearGradient></defs>'
def page(title,body,aria,name):
    svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="{html.escape(aria)}">{DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{body}</svg>'
    open(f'banners/{name}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>{CSS}</style></head><body><div id="frame">{svg}</div></body></html>')
def head(eb,title):
    return T(60,78,eb,'m',13)+T(60,128,title,'d',42)

# ============ Banner 1: one engine, three ways in ============
b=head("ONE ENGINE · THREE WAYS IN","Install it. Set it once. Or we build it.")
# left cards
# A marketplace
b+=glass(60,170,360,236)+T(84,206,"FLOW MARKETPLACE",'m',12)
rows=[("Booking outreach","Install",True),("Eligibility checks","Installed",False),("Auto estimate","Update",None)]
for i,(n,st,k) in enumerate(rows):
    y=224+i*44
    b+=f'<rect x="76" y="{y}" width="328" height="38" rx="10" fill="#FFF" fill-opacity="0.06"/>'+T(92,y+25,n,'l',16)
    if k is True: b+=pill(318,y+5,"Install",72,True,13)
    elif k is False: b+=f'<g>{icon("check",316,y+8,.8,"#C9B3FF",1.8)}{T(338,y+25,"Installed","s",13.5)}</g>'
    else: b+=f'<g><rect x="326" y="{y+5}" width="70" height="28" rx="14" fill="none" stroke="#C9B3FF" stroke-width="1.5"/>{T(361,y+24,"Update","lb",13,"middle")}</g>'
b+=T(84,378,"Thousands of ready-made workflows.",'s',15)+T(84,396,"Installed in one step, running the same day.",'s',15)
# B rules
b+=glass(60,426,360,212)+T(84,462,"AUTOMATION RULES",'m',12)
for i,(tg,tx) in enumerate([("WHEN","Any event, or a schedule"),("IF","Orders or documents match"),("THEN","Assign, tag, text, fax or estimate")]):
    y=478+i*42
    b+=f'<rect x="84" y="{y}" width="58" height="28" rx="8" fill="#6B3FE4" fill-opacity="{1 if i==2 else .22}" stroke="#C9B3FF" stroke-opacity=".5" stroke-width="1.2"/>'+T(113,y+19,tg,'m',11,'middle','style="fill:#fff;letter-spacing:.1em"')+T(156,y+20,tx,'l',15.5)
b+=T(84,618,"Set it once. The system does the rest.",'s',15)
# C custom
b+=glass(60,658,360,200)+T(84,694,"BUILT FOR YOU",'m',12)
for i,ic in enumerate(['trigger','config','http','send']):
    x=88+i*72; b+=tile(x,714,48,ic,1.0)
    if i<3: b+=f'<path d="M{x+48} 738 H{x+72}" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/>'
b+=T(84,810,"Alpha Nodus builds and maintains your own",'s',15)+T(84,830,"workflows, on the same engine.",'s',15)
# engine panel
b+=glass(500,170,330,688,24,.09,.3)+T(665,206,"GRAVITY FLOW · THE ENGINE",'m',12,'middle')
b+=f'<circle cx="665" cy="470" r="200" fill="url(#cw)"/>'
# canvas nodes
row1=[('trigger','Trigger'),('config','Config'),('http','Fetch'),('filter','Filter')]
row2=[('hours','Hours'),('agent','Agent'),('send','Send'),('loop','Next page')]
xs=[538,614,690,766]
for i,(ic,lb) in enumerate(row1):
    b+=tile(xs[i]-24,256,48,ic,1.0)+T(xs[i],330,lb,'s',13,'middle')
    if i<3: b+=f'<path d="M{xs[i]+24} 280 H{xs[i+1]-24}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'
b+=f'<path d="M790 280 C 826 280 826 416 794 416" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'
for i,(ic,lb) in enumerate(row2):
    x=xs[3-i]
    if ic=='agent':
        b+=f'<circle cx="{x}" cy="416" r="26" fill="#1B1430" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/><circle cx="{x}" cy="416" r="14" fill="none" stroke="#C9B3FF" stroke-opacity=".4" stroke-width="1.5"/><circle cx="{x}" cy="416" r="5" fill="#C9B3FF"/>'
    else: b+=tile(x-24,392,48,ic,1.0)
    b+=T(x,466,lb,'s',13,'middle')
    if i<3: b+=f'<path d="M{x-24} 416 H{xs[3-i-1]+24}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'
b+=f'<path d="M{xs[0]-24+0} 416 C 506 416 506 304 530 304" fill="none" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.5" stroke-dasharray="4 5"/>'
b+=T(665,512,"A node canvas your team can read and change.",'s',13.5,'middle')
# guardrails
b+=f'<line x1="524" y1="540" x2="806" y2="540" stroke="#fff" stroke-opacity=".18"/>'+T(524,568,"CHECKED BEFORE ANYTHING GOES OUT",'m',11)
for i,t in enumerate(["Contact caps per day and visit","Do-not-contact","Business hours"]):
    b+=f'<circle cx="530" cy="{594+i*28}" r="4.5" fill="#C9B3FF"/>'+T(546,599+i*28,t,'l',15)
# record
b+=f'<line x1="524" y1="690" x2="806" y2="690" stroke="#fff" stroke-opacity=".18"/>'+T(524,718,"EVERY RUN ON RECORD",'m',11)
for i,(tm,tx,col) in enumerate([("09:02","Reminder · Text · Delivered","#10B981"),("09:02","Report back · Fax · Delivered","#10B981"),("09:03","Earlier slot · Declined at limit","#F59E0B")]):
    y=742+i*28
    b+=T(524,y+5,tm,'m',11.5,'start','style="letter-spacing:0"')+f'<circle cx="582" cy="{y}" r="4.5" fill="{col}"/>'+T(594,y+5,tx,'l',14)
# right outputs
outs=[("auto","Done on its own","AUTOMATED",True),("agent","An agent does the work","AGENTIC",False),("person","Exceptions go to your team","WITH THE HISTORY ATTACHED",False)]
for i,(ic,lb,sb,lag) in enumerate(outs):
    y=170+i*170
    b+=glass(900,y,240,150)+tile(924,y+24,56,ic,1.25,lag)+T(924,y+110,lb,'lb',15.5)+T(924,y+132,sb,'m',10.5)
    b+=conn(f"M830 {y+75} L 900 {y+75}") if True else ''
b+=glass(900,680,240,178)+T(924,730,"About 200,000",'d',27)+T(924,758,"workflow runs a month",'s',15.5)+T(924,800,"More than 460 imaging centers",'s',14.5)+T(924,820,"across the US.",'s',14.5)
# left connectors into engine
for y in (288,532,758): b+=conn(f"M420 {y} L 500 {y}")
page("Gravity Flow banner 1: one engine, three ways in",b,"One Gravity Flow engine, three ways to get a workflow: install one from the Flow Marketplace, set an automation rule once, or have Alpha Nodus build one. The engine checks limits first, runs the work as automated or agentic, sends what it cannot finish to your team, and keeps every run on record.","banner-1-one-engine")

# ============ Banner 2: supervised first, agentic when ready ============
b=head("HOW TRUST IS EARNED","Supervised first. Agentic when you’re ready.")
b+=T(60,160,"AS EACH WORKFLOW PROVES ITSELF, IT MOVES TO AGENTIC","m",12)
cols=[(60,"01","Automated","Follows a rule. Same result every time.","NOTHING TO DECIDE","rule"),(430,"02","Agentic, supervised","An agent does the work. A person approves it.","A PERSON APPROVES","sup"),(800,"03","Agentic","An agent does the work. Your people handle the exceptions.","EXCEPTIONS GO TO YOUR TEAM","ag")]
tops=[290,230,170]
for (x,num,ttl,ds,ft,k),y in zip(cols,tops):
    h=410
    b+=glass(x,y,340,h)+T(x+28,y+44,num,'m',13)+T(x+28,y+90,ttl,'d',29)
    words=ds.split(' ');lines=[];cur=''
    for w_ in words:
        if len(cur+' '+w_)>31: lines.append(cur);cur=w_
        else: cur=(cur+' '+w_).strip()
    lines.append(cur)
    for j,ln in enumerate(lines): b+=T(x+28,y+126+j*24,ln,'s',16.5)
    ty=y+200
    b+=T(x+28,ty,"TEN RUNS",'m',11)
    for t_ in range(10):
        cx=x+50+(t_%5)*60; cy=ty+38+(t_//5)*58
        ex=(k=='ag' and t_==7)
        col="#F59E0B" if ex else "#C9B3FF"
        if not ex: b+=f'<circle cx="{cx}" cy="{cy}" r="22" fill="url(#nw)"/>'
        b+=f'<circle cx="{cx}" cy="{cy}" r="11" fill="{col}"/>'
        if k=='sup': b+=f'<circle cx="{cx}" cy="{cy}" r="19" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="3 4"/>'
        if ex: b+=f'<circle cx="{cx}" cy="{cy}" r="19" fill="none" stroke="#F59E0B" stroke-opacity=".8" stroke-width="1.6"/>'
    ic,tx=('person',"approves each run") if k=='sup' else (('person',"handles the one that needs a person") if k=='ag' else ('auto',"finishes on its own"))
    b+=icon(ic,x+28,ty+132,1.0,"#C9B3FF")+T(x+62,ty+150,tx,'s',15)
    b+=T(x+28,y+h-22,ft,'m',11.5)
# connectors: the ramp from supervised to agentic
b+=f'<path d="M770 400 H800" stroke="#C9B3FF" stroke-opacity=".8" stroke-width="2"/><circle cx="800" cy="400" r="5" fill="#C9B3FF"/>'
# examples strip
b+=glass(60,722,1080,134)
b+=T(84,758,"Each workflow carries its own mode.",'lb',20)+T(1116,758,"EXAMPLES FROM THE FLOW MARKETPLACE",'m',10.5,'end')
def chiprow(y,label,items,kind):
    out=T(84,y+19,label,'m',11)
    x=196
    for t in items:
        w=int(len(t)*7.9+46); out+=f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".22" stroke-width="1.2"/>'+node(x+17,y+15,kind,5).replace('r="18"','r="12"')+T(x+32,y+20,t,'l',14.5); x+=w+10
    return out
b+=chiprow(776,"AUTOMATED",["Confirmations and reminders","Eligibility checks","Earlier-slot nudges"],'auto')
b+=chiprow(816,"AGENTIC",["Clinical clearance","Booking outreach","Financial clearance"],'ag')
page("Gravity Flow banner 2: supervised first",b,"Three steps of trust in Gravity Flow. Automated workflows follow a rule and finish on their own. Agentic workflows start supervised, where an agent does the work and a person approves it. As each workflow proves itself it moves to agentic, where your people handle only the exceptions.","banner-2-supervised-first")

# ============ Banner 3: every pillar, referral to payment ============
b=head("FROM THE REFERRAL TO THE PAYMENT","Flow runs the routine work in every pillar.")
# legend
b+=node(70,168,'auto',6)+T(88,173,"AUTOMATED",'m',11)+node(220,168,'ag',6)+T(238,173,"AGENTIC",'m',11)+T(1140,173,"WORKFLOWS FROM THE FLOW MARKETPLACE",'m',10.5,'end')
tracks=[
 (300,"Get the order","NO REFERRAL LEAKS",[("Referrer outreach|campaigns",'a'),("Report back to the|referring office",'a'),("Breast tracking|and recall",'g')]),
 (520,"Complete the exam","NO ORDER LEAKS",[("Order completeness|check",'a'),("Clinical|clearance",'g'),("Booking|outreach",'g'),("Confirmations|and reminders",'a'),("Earlier-slot|nudges",'a'),("No-show|outreach",'a'),("Pre-check-in and|document requests",'a'),("Results to|the patient",'a')]),
 (740,"Get paid","NO REVENUE LEAKS",[("Financial|clearance",'g'),("Eligibility|checks",'a'),("Prior auth|status checks",'a'),("Secondary|insurance finder",'a'),("Referring provider|PECOS check",'a'),("Patient|estimates",'a')])]
# spine
for ty,name,sub,items in tracks:
    n=len(items); ag=sum(1 for i in items if i[1]=='g')
    # pillar node (brand node, plum)
    b+=f'<circle cx="110" cy="{ty}" r="52" fill="url(#nw)"/><circle cx="110" cy="{ty}" r="34" fill="#C9B3FF" fill-opacity=".14" stroke="#C9B3FF" stroke-opacity=".5" stroke-width="2"/><circle cx="110" cy="{ty}" r="22" fill="#C9B3FF"/>'
    b+=T(110,ty+70,name,'d',23,'middle')+T(110,ty+90,sub,'m',9.5,'middle')+T(110,ty-62,f"{n} WORKFLOWS · {ag} AGENTIC",'m',10,'middle')
    x0=300; x1=1080 if ty!=740 else 960
    b+=f'<path d="M168 {ty} H{x0}" class="cb"/>'+conn(f"M{x0} {ty} H{x1+20}")
    step=(x1-x0)/(n-1) if n>1 else 0
    if n==3: step=(x1-x0)/(n-1)
    for k,(lab,kind) in enumerate(items):
        x=x0+k*step if n>1 else x0
        b+=node(x,ty,'auto' if kind=='a' else 'ag',10)
        up=(k%2==0)
        l1,l2=lab.split('|')
        if up: b+=f'<line x1="{x}" y1="{ty-24}" x2="{x}" y2="{ty-40}" stroke="#fff" stroke-opacity=".3"/>'+T(x,ty-76,l1,'l',14.5,'middle')+T(x,ty-58,l2,'l',14.5,'middle')
        else: b+=f'<line x1="{x}" y1="{ty+24}" x2="{x}" y2="{ty+40}" stroke="#fff" stroke-opacity=".3"/>'+T(x,ty+62,l1,'l',14.5,'middle')+T(x,ty+80,l2,'l',14.5,'middle')
# outcome (Lagoon, once)
b+=f'<circle cx="1110" cy="740" r="46" fill="url(#ow)"/><circle cx="1110" cy="740" r="30" fill="#67E3EE" fill-opacity=".14" stroke="#67E3EE" stroke-opacity=".5" stroke-width="2"/><circle cx="1110" cy="740" r="18" fill="#67E3EE"/>'
b+=T(1110,740+64,"Paid",'d',24,'middle')+T(1110,740+84,"EVERY EXAM YOU COMPLETE",'m',9.5,'middle')
page("Gravity Flow banner 3: every pillar",b,"Gravity Flow runs the routine work in every pillar. Get the order: three workflows. Complete the exam: eight workflows. Get paid: six workflows. Filled nodes are automated and ringed nodes are agentic. The line ends in Paid.","banner-3-every-pillar")
print('ok')
