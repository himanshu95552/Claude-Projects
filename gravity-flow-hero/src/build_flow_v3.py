import sys; sys.path.insert(0,'src')
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
import screens2 as S2
from screens import SCREEN_CSS,SCREEN_DEFS
CSSX=CSS+SCREEN_CSS
def out(name,svg,title): open(f'flow-banners/{name}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')
def wrap(b,aria): return f'<svg viewBox="0 0 1200 900" role="img" aria-label="{html.escape(aria)}">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
def G(x,y,body,s=1): return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
# ================= V1: annotated real workflow =================
b=T(60,78,"A REAL WORKFLOW, IN THE PRODUCT",'m',13)+T(60,128,"The routine work, done on its own.",'d',42)
win_,xs,ny=S2.wf_window(1080,410)
b+=G(60,146,win_)
caps=[(0,"1","Starts","On a schedule, or on any event in Gravity."),(1,"2","Gathers","Pulls the booked appointments for the service."),(3,"3","Decides","Filters out who should not get a text."),(4,"4","Checks limits","Business hour check before anything goes out."),(5,"5","Acts","Sends the feedback text. The routine ones close."),]
for i,n,t,d in caps:
    x=60+xs[i]
    b+=f'<circle cx="{x-62}" cy="586" r="12" fill="#6B3FE4"/>'+T(x-62,591,n,'lb',13,'middle')+T(x-44,592,t,'d',19)
    ws=d.split(' ');L=[];cur=''
    for w_ in ws:
        if len(cur+' '+w_)>24: L.append(cur);cur=w_
        else: cur=(cur+' '+w_).strip()
    L.append(cur)
    for k,l in enumerate(L): b+=T(x-62,618+k*18,l,'s',13.5)
# bottom row
b+=glass(60,676,520,176)+T(84,704,"EXCEPTIONS AND LIMITS",'m',11.5)
for i,(k,v) in enumerate([("Contact caps","per patient, per day and visit"),("Do-not-contact","checked before anything goes out"),("Exceptions","go to your team, history attached")]):
    y=730+i*36; b+=f'<circle cx="92" cy="{y-5}" r="4.5" fill="#C9B3FF"/>'+T(108,y,k,'lb',15)+T(250,y,v,'s',14)
b+=T(84,836,"The settings are documented on the step itself.",'s',13.5)
b+=glass(600,676,540,176)+T(624,704,"FLOW MARKETPLACE · INSTALLED IN ONE STEP, RUNNING THE SAME DAY",'m',10.5)
rows=S2.flow_rows(0,0,492,[("Booking text outreach","install"),("Eligibility check","installed"),("Breast tracking and recall","update")],40)
b+=G(624,720,rows,1)
page_=wrap(b,"One real Gravity Flow workflow, Appointment feedback, shown in the product: it starts on a schedule or event, gathers booked appointments, filters who should not get a text, checks business hours, and sends the text. Limits are checked and exceptions go to your team. Ready-made workflows install in one step.")
out('banner-flow-v3-1-annotated-workflow',page_,'Flow banner V1')
# ================= V2: how a workflow runs, with the real workflow in the middle =================
b=T(60,78,"HOW A WORKFLOW RUNS",'m',13)+T(60,128,"Where there’s nothing to decide, Gravity just does it.",'d',38)
b+=T(60,166,"ANY EVENT STARTS ONE",'m',11.5)
evs=["Order created","Report signed","Appointment booked","Patient missed the visit"]
x=60
for t in evs:
    w_=int(len(t)*8.6+46); b+=f'<rect x="{x}" y="178" width="{w_}" height="34" rx="17" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".22"/><circle cx="{x+18}" cy="195" r="4.5" fill="#C9B3FF"/>'+T(x+32,200,t,'l',14.5); x+=w_+12
b+=conn("M600 212 V 236")
b+=f'<circle cx="600" cy="236" r="4.5" fill="#C9B3FF"/>'
win_,xs,ny=S2.wf_window(1080,300,"Appointment feedback",False,False,False,0.55)
# compact: custom reposition handled by height; draw
b+=G(60,246,win_)
# outcomes
outs=[("auto","NOTHING TO DECIDE","Done on its own","A rule, the same result every time."),("agent","SOMETHING TO DECIDE","An agent does the work","It reads, decides and acts."),("person","WHEN IT CAN’T FINISH","Exceptions go to your team","On a worklist, with the history attached.")]
for i,(icn,eb,tt,dd) in enumerate(outs):
    x=60+i*370
    b+=conn(f"M{x+170} 546 V 596")+glass(x,596,340,128)+tile(x+22,616,52,icn,1.15,(i==0))+T(x+90,634,eb,'m',10.5)+T(x+90,662,tt,'lb',17)+T(x+22,704,dd,'s',14)
b+=glass(60,744,1080,116)+T(84,772,"ONE OF THE THOUSANDS IN THE FLOW MARKETPLACE · INSTALLED AND RUNNING THE SAME DAY",'m',11)
rowsx=S2.flow_rows(0,0,340,[("Booking text outreach","install")],40)+S2.flow_rows(0,40,340,[("Eligibility check","installed")],40)
b+=G(84,784,S2.flow_rows(0,0,330,[("Booking text outreach","install")],42),1)+G(436,784,S2.flow_rows(0,0,330,[("Eligibility check","installed")],42),1)+G(788,784,S2.flow_rows(0,0,330,[("Breast tracking and recall","update_s")],42),1)
b+=T(84,846,"Alpha Nodus also builds and maintains your own, on the same engine.",'s',13.5)
page_=wrap(b,"How a workflow runs. Any event, such as an order created, a report signed, an appointment booked or a missed visit, starts a workflow. Shown is one real workflow in the product. Where there is nothing to decide it is done on its own, where there is something to decide an agent does the work, and exceptions go to your team with the history attached.")
out('banner-flow-v3-2-how-a-workflow-runs',page_,'Flow banner V2')
print('ok')
