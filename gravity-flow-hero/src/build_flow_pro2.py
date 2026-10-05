# Gravity Flow banner v2: simpler real workflow (4 steps) + "Workflows for every step, from the referral to the payment".
import sys; sys.path.insert(0,'src')
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
import screens2 as S2
from screens import SCREEN_CSS,SCREEN_DEFS,tx,win,ic,esc
CSSX=CSS+SCREEN_CSS
def G(x,y,body,s=1): return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
def wf_simple(w,h):
    b=f'<rect width="{w}" height="{h}" fill="#F6F4FA"/><rect width="{w}" height="{h}" fill="url(#dots)"/>'
    b+=f'<rect width="{w}" height="52" fill="#FFF"/><rect y="51" width="{w}" height="1" fill="#E5E7EB"/>'+tx(26,35,"Appointment feedback",'p-dh',22)
    b+=f'<rect x="262" y="15" width="88" height="24" rx="8" fill="#ECFDF5" stroke="#A7F3D0"/>'+tx(306,32,"Installed",'p-ok',13,'middle')
    b+=tx(w-26,34,"A ready-made workflow, in the product",'p-t3',13.5,'end')
    steps=[('trigger',"Starts","Schedule trigger","On a schedule, or when\\an event happens"),('graph',"Finds","Appointment list","Pulls the booked\\appointments"),('filter',"Filters","Filter","Skips appointments\\that don’t qualify"),('send',"Sends","Send text","Texts the patient\\for feedback")]
    ny=140; xs=[150+i*260 for i in range(4)]
    for i in range(3):
        x0=xs[i]+50; x1=xs[i+1]-50
        b+=f'<path d="M{x0} {ny} H{x1-8}" stroke="#94A3B8" stroke-width="2.4" stroke-linecap="round"/><path d="M{x1-12} {ny-7} L{x1} {ny} L{x1-12} {ny+7}" fill="none" stroke="#94A3B8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
    for i,(icn,verb,lab,cap) in enumerate(steps):
        b+=f'<circle cx="{xs[i]}" cy="{ny-66}" r="13" fill="#6B3FE4"/>'+tx(xs[i],ny-61,str(i+1),'p-wh',14,'middle')
        b+=S2.node_tile(xs[i],ny,icn,1.5)
        b+=tx(xs[i],ny+72,verb,'p-dh',24,'middle')
        for k,l in enumerate(cap.split(chr(92))): b+=tx(xs[i],ny+98+k*19,l,'p-t2',15,'middle')
    return win(w,h,b)
b=T(60,76,"A REAL WORKFLOW, STEP BY STEP",'m',13)+T(60,124,"Where there’s nothing to decide,",'d',40)+T(60,170,"Gravity just does it.",'d',40)
b+=G(60,192,wf_simple(1080,292))
by=500
b+=f'<path d="M110 {by} H1000" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/><path d="M110 {by-8} V{by}" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/><path d="M1000 {by-8} V{by}" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".8"/>'
b+=T(110,by+24,"EVERY STEP IS A RULE: NOTHING TO DECIDE",'m',11.5)
b+=f'<circle cx="1112" cy="{by+10}" r="26" fill="url(#ow)"/><circle cx="1112" cy="{by+10}" r="14" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-opacity=".6" stroke-width="2"/><circle cx="1112" cy="{by+10}" r="7" fill="#67E3EE"/>'+T(1088,by+16,"Done on its own",'d',19,'end')
# ---- workflows for every step
b+=f'<line x1="60" y1="548" x2="1140" y2="548" stroke="#fff" stroke-opacity=".14"/>'
b+=T(60,580,"IN THE FLOW MARKETPLACE",'m',11.5)+T(60,616,"Workflows for every step, from the referral to the payment",'d',26)
b+=T(1140,616,"Every workflow is highly customizable to the center.",'s',14.5,'end')
cols=[("Get the order","NO REFERRAL LEAKS",[("Referrer outreach campaigns",'a'),("Report back to the referring office",'a'),("Breast tracking and recall",'g')]),
      ("Complete the exam","NO ORDER LEAKS",[("Booking outreach",'g'),("Confirmations and reminders",'a'),("Earlier-slot nudges",'a')]),
      ("Get paid","NO REVENUE LEAKS",[("Financial clearance",'g'),("Eligibility checks",'a'),("Prior auth status checks",'a')])]
b+=f'<path d="M90 668 H870" class="cb"/>'
for i,(nm,sub,items) in enumerate(cols):
    x=90+i*360
    b+=f'<circle cx="{x}" cy="668" r="26" fill="url(#nw)"/><circle cx="{x}" cy="668" r="14" fill="#C9B3FF"/>'
    b+=T(x+30,664,nm,'d',21)+T(x+30,682,sub,'m',10)
    for k,(t,kind) in enumerate(items):
        y=712+k*38; w_=int(len(t)*8.2+54)
        b+=f'<rect x="{x-26}" y="{y}" width="{w_}" height="30" rx="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".22" stroke-width="1.2"/>'
        b+=(f'<circle cx="{x-8}" cy="{y+15}" r="5" fill="#C9B3FF"/>' if kind=='a' else f'<circle cx="{x-8}" cy="{y+15}" r="6" fill="#1B1430" stroke="#C9B3FF" stroke-width="2"/><circle cx="{x-8}" cy="{y+15}" r="2" fill="#C9B3FF"/>')+T(x+8,y+20,t,'l',14)
b+=f'<circle cx="60" cy="844" r="5" fill="#C9B3FF"/>'+T(74,849,"Automated: follows a rule",'s',13)+f'<circle cx="270" cy="844" r="6" fill="#1B1430" stroke="#C9B3FF" stroke-width="2"/><circle cx="270" cy="844" r="2" fill="#C9B3FF"/>'+T(284,849,"Agentic: an agent reads, decides and acts",'s',13)+T(1140,849,"What a workflow can’t finish goes to your team, with the history attached.",'s',13,'end')
svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="One real Gravity Flow workflow, Appointment feedback, in four steps: it starts on a schedule or event, finds the booked appointments, filters those that do not qualify, and sends the feedback text. Every step is a rule, so it is done on its own. Below, the Flow Marketplace has workflows for every step from the referral to the payment: get the order, complete the exam and get paid, each automated or agentic. What a workflow cannot finish goes to your team with the history attached.">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
open('flow-banners/banner-flow-PRO2.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Gravity Flow banner</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')
print('ok')
