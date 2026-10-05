# Gravity Flow banner, product-design pass. One message: what "done on its own" looks like, shown with a real workflow.
import sys; sys.path.insert(0,'src')
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
import screens2 as S2
from screens import SCREEN_CSS,SCREEN_DEFS,tx,win,pill_btn,icon_btn,ic,esc
CSSX=CSS+SCREEN_CSS
def G(x,y,body,s=1): return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
def wf_pro(w,h):
    b=f'<rect width="{w}" height="{h}" fill="#F6F4FA"/><rect width="{w}" height="{h}" fill="url(#dots)"/>'
    b+=f'<rect width="{w}" height="50" fill="#FFF"/><rect y="49" width="{w}" height="1" fill="#E5E7EB"/>'+tx(24,33,"Appointment feedback",'p-dh',21)
    b+=f'<rect x="248" y="14" width="86" height="23" rx="7" fill="#ECFDF5" stroke="#A7F3D0"/>'+tx(291,30,"Installed",'p-ok',12.5,'middle')
    b+=tx(w-24,32,"A ready-made workflow from the Flow Marketplace",'p-t3',13,'end')
    cfg,hh=S2.note(24,66,330,"Settings, documented on the step",["tenant · service category · buffer days","service tags to include or exclude","appointment status · outreach intent"],12,17)
    b+=cfg
    nodes=[('trigger',"Schedule trigger","Runs on a schedule,\\or on any event"),('graph',"Appointment list","Pulls the booked\\appointments"),('code',"Format list","One form per patient\\per day"),('filter',"Filter","Skips appointments\\outside the buffer"),('branch',"Business hours","Checks business\\hours first"),('send',"Send text","Sends the\\feedback text")]
    ny=int(h*0.56); xs=[112+i*((w-224)/5) for i in range(6)]
    for i in range(5):
        b+=f'<path d="M{xs[i]+40} {ny} H{xs[i+1]-40}" stroke="#94A3B8" stroke-width="2"/><circle cx="{xs[i+1]-40}" cy="{ny}" r="3.2" fill="#94A3B8"/>'
    b+=tx((xs[3]+xs[4])/2,ny-10,"kept",'p-t3',12,'middle')+tx((xs[4]+xs[5])/2,ny-10,"true",'p-t3',12,'middle')
    for i,(icn,lab,cap) in enumerate(nodes):
        b+=S2.node_tile(xs[i],ny,icn,1.3)
        b+=tx(xs[i],ny+62,lab,'p-tx',14,'middle','font-weight="600"')
        for k,l in enumerate(cap.split(chr(92))): b+=tx(xs[i],ny+82+k*16,l,'p-t3',12.5,'middle')
    return win(w,h,b),xs,ny
b=T(60,78,"A REAL WORKFLOW, STEP BY STEP",'m',13)+T(60,128,"Where there’s nothing to decide,",'d',42)+T(60,176,"Gravity just does it.",'d',42)
win_,xs,ny=wf_pro(1080,350)
b+=G(60,200,win_)
# bracket: every step is a rule -> done
by=574
b+=f'<path d="M{60+xs[0]-40} {by} H{60+xs[5]+40}" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/>'
for i in (0,5): b+=f'<path d="M{60+xs[i]+(-40 if i==0 else 40)} {by-8} V{by}" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/>'
b+=T(60+xs[0]-40,by+26,"RULES ALL THE WAY THROUGH: NOTHING TO DECIDE",'m',11.5)
b+=f'<circle cx="1100" cy="{by+14}" r="26" fill="url(#ow)"/><circle cx="1100" cy="{by+14}" r="14" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-opacity=".6" stroke-width="2"/><circle cx="1100" cy="{by+14}" r="7" fill="#67E3EE"/>'+T(1074,by+20,"Done on its own",'d',18,'end')
# mode key
b+=T(60,646,"HOW EVERY WORKFLOW RUNS",'m',11.5)
keys=[("auto","Automated","Follows a rule. This one.",True),("agent","Agentic","An agent reads, decides and acts.",False),("person","Exceptions","Go to your team, history attached.",False)]
for i,(icn,t,d,hot) in enumerate(keys):
    x=60+i*364
    b+=f'<rect x="{x}" y="656" width="352" height="64" rx="16" fill="#FFF" fill-opacity="{.12 if hot else .06}" stroke="{"#C9B3FF" if hot else "#FFF"}" stroke-opacity="{.8 if hot else .2}" stroke-width="{1.8 if hot else 1.2}"/>'+tile(x+14,668,40,icn,.9)+T(x+66,686,t,'lb',16)+T(x+66,706,d,'s',13)
# bottom
b+=glass(60,736,520,120)+T(84,764,"WITHIN YOUR LIMITS",'m',11.5)
for i,(k,v) in enumerate([("Contact caps","per patient, per day and visit"),("Do-not-contact","checked before anything goes out"),("Every run","on record: who, when, delivered or not")]):
    y=788+i*26; b+=f'<circle cx="92" cy="{y-5}" r="4" fill="#C9B3FF"/>'+T(106,y,k,'lb',14)+T(228,y,v,'s',13.5)
b+=glass(600,736,540,120)+T(624,764,"FLOW MARKETPLACE · INSTALLED IN ONE STEP, RUNNING THE SAME DAY",'m',10.5)
rows=S2.flow_rows(0,0,492,[("Booking text outreach","install"),("Breast tracking and recall","update")],38)
b+=G(624,774,rows,1)
svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="One real Gravity Flow workflow, Appointment feedback, step by step: it runs on a schedule or event, pulls booked appointments, formats the list, skips appointments outside the buffer, checks business hours, and sends the text. Every step is a rule, so nothing needs deciding and it is done on its own. Workflows run automated or agentic, and exceptions go to your team. Limits are checked and every run is on record.">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
open('flow-banners/banner-flow-PRO.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Gravity Flow banner</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')
print('ok')
