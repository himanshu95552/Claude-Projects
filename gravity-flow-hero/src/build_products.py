# Five product-page hero banners (4:3): Doc, Booking, Work, PriorAuth, Visit.
# Same grammar as the Flow banner: headline from the page, a restyled product view, the page's own steps on a hairline ending in a Lagoon node.
import sys,os; sys.path.insert(0,'src')
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
from screens import SCREEN_CSS,SCREEN_DEFS,tx,win,ic,esc
CSSX=CSS+SCREEN_CSS+".c-ok{font-family:Inter,sans-serif;font-weight:600;fill:#047857}.c-wn{font-family:Inter,sans-serif;font-weight:600;fill:#B45309}.c-bd{font-family:Inter,sans-serif;font-weight:600;fill:#B91C1C}.c-in{font-family:Inter,sans-serif;font-weight:600;fill:#334155}\n"
def G(x,y,body,s=1): return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
KIND={'ok':('#ECFDF5','#A7F3D0','c-ok'),'wn':('#FFFBEB','#FDE68A','c-wn'),'bd':('#FEF2F2','#FECACA','c-bd'),'in':('#F1F5F9','#E2E8F0','c-in'),'pl':('#F3EEFE','#E7DDFF','p-pl')}
def chip(x,y,t,k='ok',h=24,fs=12.5,anchor='l'):
    bg,bd,cl=KIND[k]; w=int(len(t)*fs*.56+22)
    if anchor=='r': x=x-w
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="{bg}" stroke="{bd}"/>'+tx(x+w/2,y+h/2+4.5,t,cl,fs,'middle')
def chk(x,y,s=.7): return ic('check',x,y,s,"#10B981",2.4)
def bar(w,h):
    return f'<rect width="{w}" height="{h}" fill="#F6F4FA"/><rect width="{w}" height="{h}" fill="url(#dots)"/>'
def header(w,title,tag,right):
    s=f'<rect width="{w}" height="44" fill="#FFF"/><rect y="43" width="{w}" height="1" fill="#E5E7EB"/>'+tx(22,29,title,'p-dh',19)
    cw=len(title)*10.4+36; s+=chip(cw,10,tag,'pl',24,12.5)+tx(w-22,28,right,'p-t3',13,'end'); return s
def card(x,y,w,h,r=12): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="#FFF" stroke="#E5E7EB"/>'
def wrap(t,n):
    out=[];cur=''
    for wd in t.split():
        if len(cur)+len(wd)+1>n and cur: out.append(cur);cur=wd
        else: cur=(cur+' '+wd).strip()
    return out+[cur]

# ---------- windows (1080x300) ----------
def w_doc(W=1080,H=300):
    b=bar(W,H)+header(W,"Documents","Document worklist","Gravity Doc")
    rows=[("Fax","Order","Filed",'ok'),("Email","Order","Order created",'ok'),("Upload","Report","Filed",'ok'),("Portal","Order","Needs a person",'wn')]
    b+=card(20,60,560,226)+tx(40,86,"Source",'p-t3',12.5)+tx(180,86,"Category",'p-t3',12.5)+tx(340,86,"Status",'p-t3',12.5)
    for i,(s,c,st,k) in enumerate(rows):
        y=98+i*44; b+=f'<rect x="32" y="{y}" width="536" height="38" rx="9" fill="{"#FFFBEB" if k=="wn" else "#F8F8FA"}" stroke="{"#FDE68A" if k=="wn" else "#EEF0F3"}"/>'
        b+=f'<circle cx="52" cy="{y+19}" r="5" fill="#6B3FE4"/>'+tx(66,y+24,s,'p-tx',15)+chip(178,y+7,c,'pl')+chip(338,y+7,st,k)
    b+=f'<path d="M596 173 H650" stroke="#6B3FE4" stroke-width="2.2"/><path d="M642 166 L652 173 L642 180" fill="none" stroke="#6B3FE4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    b+=card(668,60,392,226)+tx(690,90,"Order",'p-dh',19)+chip(1038,66,"Created",'ok',24,12.5,'r')
    for i,f in enumerate(["Patient","Referring provider","Exam"]):
        y=108+i*46; b+=f'<rect x="684" y="{y}" width="360" height="38" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(700,y+24,f,'p-tx',15)+chk(1004,y+9,.8)+tx(992,y+24,"Matched",'c-ok',13,'end')
    b+=tx(690,266,"Created when all three match",'p-t2',13.5)
    return win(W,H,b)
def w_booking(W=1080,H=300):
    b=bar(W,H)+header(W,"Book an exam","Booking rules","Gravity Booking")
    b+=card(20,58,640,230)
    cols=["Device 1","Device 2","Device 3"]; st=[["o","c","o","x","o","o"],["o","o","x","x","o","c"],["c","o","S","o","o","o"]]
    for j,c in enumerate(cols):
        x=36+j*204; b+=tx(x+98,80,c,'p-t3',12.5,'middle')
        for i,s in enumerate(st[j]):
            y=90+i*28
            if s=='o': b+=f'<rect x="{x}" y="{y}" width="196" height="24" rx="7" fill="#FFF" stroke="#CBD5E1"/>'
            elif s=='c': b+=f'<rect x="{x}" y="{y}" width="196" height="24" rx="7" fill="#EEF0F3"/>'
            elif s=='x': b+=f'<rect x="{x}" y="{y}" width="196" height="24" rx="7" fill="#F8F8FA" stroke="#CBD5E1" stroke-dasharray="4 4"/>'
            else: b+=f'<rect x="{x}" y="{y}" width="196" height="24" rx="7" fill="#6B3FE4"/>'+tx(x+98,y+16.5,"Booked",'p-wh',12.5,'middle')
    ly=270
    for x,t,f,s_ in [(40,"Open",'#FFF','#CBD5E1'),(150,"Too early for the authorization",'#F8F8FA','#CBD5E1'),(402,"Closed",'#EEF0F3','#EEF0F3'),(490,"Booked",'#6B3FE4','#6B3FE4')]:
        b+=f'<rect x="{x}" y="{ly-9}" width="14" height="12" rx="3" fill="{f}" stroke="{s_}"'+(' stroke-dasharray="3 3"' if 'early' in t else '')+'/>'+tx(x+20,ly+1,t,'p-t2',12.5)
    b+=card(680,58,380,230)+tx(702,88,"Checked on every booking",'p-dh',18)
    for i,r in enumerate(["Device","Exam length","Patient limits","Gaps between exams","Authorization lead time"]):
        y=104+i*36; b+=f'<rect x="696" y="{y}" width="348" height="30" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(712,y+20,r,'p-tx',14.5)+chk(1008,y+6,.8)
    return win(W,H,b)
def w_work(W=1080,H=300):
    b=bar(W,H)+header(W,"Worklists","Contact center","Gravity Work")
    b+=card(20,58,190,230)
    for i,n in enumerate(["Contact center","Documents","Orders","Referring providers","Patients"]):
        y=72+i*40
        if i==0: b+=f'<rect x="30" y="{y-6}" width="170" height="34" rx="8" fill="#F3EEFE"/>'
        b+=tx(44,y+16,n,'p-pl' if i==0 else 'p-t2',14)
    b+=card(226,58,540,230)+tx(254,84,"Work",'p-t3',12.5)+tx(520,84,"Assigned to",'p-t3',12.5)
    rows=[("Call","Scheduling","Scheduler",'pl'),("Fax","Order document","Front-desk staff",'pl'),("Text","Reschedule","Scheduler",'pl'),("From Flow","History attached","Authorization specialist",'wn')]
    for i,(a,t,who,k) in enumerate(rows):
        y=96+i*46; b+=f'<rect x="238" y="{y}" width="516" height="40" rx="9" fill="{"#FFFBEB" if k=="wn" else "#F8F8FA"}" stroke="{"#FDE68A" if k=="wn" else "#EEF0F3"}"/>'
        b+=tx(254,y+25,a,'p-tx',15)+chip(346,y+8,t,k)+tx(520,y+25,who,'p-t2',14)
    b+=card(782,58,278,230)+tx(802,88,"Assigned on its own",'p-dh',18)
    for i,o in enumerate(["Round-robin","By weight","By capacity"]):
        x=802+[0,98,176][i]; w_=[66,52,66][i]; sel=i==2
        b+=f'<rect x="{x}" y="100" width="{w_+14}" height="26" rx="13" fill="{"#6B3FE4" if sel else "#FFF"}" stroke="{"#6B3FE4" if sel else "#CBD5E1"}"/>'+tx(x+(w_+14)/2,118,o,'p-wh' if sel else 'p-t2',12,'middle')
    for i,(n,f) in enumerate([("Scheduler",.62),("Front-desk staff",.35),("Authorization specialist",.8)]):
        y=148+i*44; b+=tx(802,y,n,'p-t2',13.5)+f'<rect x="802" y="{y+10}" width="238" height="10" rx="5" fill="#EEF0F3"/><rect x="802" y="{y+10}" width="{int(238*f)}" height="10" rx="5" fill="#6B3FE4"/>'
    return win(W,H,b)
def w_pa(W=1080,H=300):
    b=bar(W,H)+header(W,"Prior authorization","On the order","Gravity PriorAuth")
    b+=card(20,58,1040,230)
    for i,(t,sel) in enumerate([("All",True),("Pending",False),("Denied",False)]):
        x=38+i*78; b+=(f'<rect x="{x}" y="70" width="{[40,76,68][i]}" height="28" rx="8" fill="#F3EEFE"/>' if sel else '')+tx(x+[20,38,34][i],89,t,'p-pl' if sel else 'p-t2',14,'middle')
    for x,t in [(40,"Exam"),(250,"Authorization"),(420,"Number"),(580,"Dates"),(760,"Status")]: b+=tx(x,122,t,'p-t3',12.5)
    rows=[("MRI knee","Required","Approved",'ok'),("CT abdomen","Required","Submitted",'in'),("MRI brain","Required","Pending",'wn'),("Mammogram","Not required","",'in')]
    rows[3]=("Ultrasound","Required","Denied",'bd')
    for i,(e,r,s,k) in enumerate(rows):
        y=130+i*38; b+=f'<rect x="30" y="{y}" width="1020" height="32" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(40,y+21,e,'p-tx',14.5)+chip(248,y+4,r,'pl',24,12)
        b+=f'<rect x="420" y="{y+12}" width="{[96,80,0,70][i]}" height="8" rx="4" fill="#E2E8F0"/>'+(f'<rect x="580" y="{y+12}" width="{[110,96,0,90][i]}" height="8" rx="4" fill="#E2E8F0"/>' if i!=2 else '')
        b+=chip(758,y+4,s,k,24,12)+(tx(860,y+21,"Goes to a person",'p-t2',13) if k in('bd','wn') else '')
    return win(W,H,b)
def phone(x,title,body,W=232):
    s=f'<rect x="{x}" y="54" width="{W}" height="260" rx="30" fill="#FFF" stroke="#CBD5E1" stroke-width="2"/><rect x="{x+W/2-30}" y="62" width="60" height="6" rx="3" fill="#E2E8F0"/>'
    return s+tx(x+20,98,title,'p-dh',19)+body
def w_visit(W=1080,H=300):
    b=bar(W,H)+header(W,"On the patient’s phone","No login","Gravity Visit")
    p1=''.join(f'<rect x="{36}" y="{112+i*44}" width="200" height="36" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(52,136+i*44,t,'p-tx',14) for i,t in enumerate(["Choose the exam","Choose a time"]))+f'<rect x="36" y="206" width="200" height="38" rx="9" fill="#6B3FE4"/>'+tx(136,230,"Book",'p-wh',15,'middle')
    b+=phone(20,"Book",p1)
    p2=''.join(f'<rect x="{292}" y="{112+i*44}" width="200" height="36" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(308,136+i*44,t,'p-tx',13.5)+chk(466,119+i*44,.75) for i,t in enumerate(["Consents","Screening questions"]))+f'<rect x="292" y="200" width="200" height="36" rx="9" fill="#FFF" stroke="#6B3FE4" stroke-dasharray="4 4"/>'+tx(392,223,"ID and insurance card",'p-pl',13.5,'middle')
    b+=phone(276,"Fill in the forms",p2)
    p3=chip(556,112,"Checked in",'ok',28,13.5)+f'<rect x="548" y="156" width="200" height="40" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(564,181,"Copay",'p-tx',14.5)+f'<rect x="548" y="206" width="200" height="38" rx="9" fill="#6B3FE4"/>'+tx(648,230,"Pay",'p-wh',15,'middle')
    b+=phone(532,"Check in and pay",p3)
    b+=f'<path d="M776 180 H812" stroke="#6B3FE4" stroke-width="2.2"/><path d="M804 173 L814 180 L804 187" fill="none" stroke="#6B3FE4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    b+=card(826,58,234,230)+tx(844,88,"On the order",'p-dh',18)
    for i,t in enumerate(["Signed consents","Screening answers","ID and insurance card","Payment"]):
        y=104+i*42; b+=f'<rect x="840" y="{y}" width="206" height="34" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(854,y+22,t,'p-tx',13.5)+chk(1014,y+7,.75)
    return win(W,H,b)

# ---------- banner frame ----------
def banner(slug,eyebrow,l1,l2,fs,win_svg,steps_title,steps,foot,aria):
    b=T(60,76,eyebrow,'m',13)+T(60,124,l1,'d',fs)+T(60,124+fs+6,l2,'d',fs)
    b+=G(60,196,win_svg)
    b+=T(60,556,steps_title,'m',11.5)
    ly=608; xs=[90+i*270 for i in range(4)]
    b+=f'<path d="M{xs[0]} {ly} H{xs[3]}" stroke="#C9B3FF" stroke-width="1.6" stroke-opacity=".75"/>'
    for i,(t,sub) in enumerate(steps):
        x=xs[i]
        if i<3: b+=f'<circle cx="{x}" cy="{ly}" r="24" fill="url(#nw)"/><circle cx="{x}" cy="{ly}" r="9" fill="#C9B3FF"/>'
        else: b+=f'<circle cx="{x}" cy="{ly}" r="26" fill="url(#ow)"/><circle cx="{x}" cy="{ly}" r="14" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-opacity=".6" stroke-width="2"/><circle cx="{x}" cy="{ly}" r="7" fill="#67E3EE"/>'
        b+=T(x-9,ly+44,f"0{i+1}",'m',12)+T(x-9,ly+74,t,'d',22)
        for k,l in enumerate(wrap(sub,29)): b+=T(x-9,ly+100+k*20,l,'s',15)
    b+=f'<line x1="60" y1="796" x2="1140" y2="796" stroke="#fff" stroke-opacity=".14"/><circle cx="68" cy="834" r="5" fill="#C9B3FF"/>'+T(84,840,foot,'l',17)
    svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="{esc(aria)}">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
    os.makedirs('product-banners',exist_ok=True)
    open(f'product-banners/{slug}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(slug)}</title><style>{CSSX.replace("../fonts","../fonts")}</style></head><body><div id="frame">{svg}</div></body></html>')

banner("gravity-doc","GRAVITY DOC","Gravity reads the fax, finds or creates","the patient, and creates the order.",35,w_doc(),"THE STEPS FROM DOCUMENT TO ORDER",
 [("The document arrives","Fax, email, upload or portal, in the document worklist"),("Read and sorted","Into your categories, with its patient, provider and exam details"),("Filed on the right record","The patient, order or visit it belongs to"),("The order is created","When patient, referring provider and exam all match")],
 "A person sees it only when something doesn’t match.","Gravity Doc: documents are read, sorted and filed, then the order is created when patient, provider and exam match; anything uncertain goes to a person.")
banner("gravity-booking","GRAVITY BOOKING","Booked right the first time,","with every rule checked.",40,w_booking(),"HOW AN EXAM IS BOOKED",
 [("Every exam on the order","Booked in one pass"),("Only valid slots offered","Device, exam length, patient limits and gaps checked"),("Lead time applied","Slots too early for the authorization are greyed out"),("Several exams, one visit","In the right order, with the right gaps")],
 "In the right slot, on the right device.","Gravity Booking: every booking is checked against the device, exam length, patient limits, gaps and authorization lead time, so only valid slots are offered.")
banner("gravity-work","GRAVITY WORK","Every task in front of","the right person.",40,w_work(),"FOUR STEPS TO THE RIGHT PERSON",
 [("Work arrives","A call, text, email, document or order"),("It lands on its worklist","Contact center, documents, orders, referring providers or patients"),("It’s assigned on its own","Round-robin, by weight or by capacity"),("The right person works it","With search, tags, presence and bulk actions")],
 "What an agent can’t finish lands here with the history attached.","Gravity Work: every part of Gravity has a worklist, work is assigned on its own by round-robin, weight or capacity, and what an agent cannot finish lands here with the history attached.")
banner("gravity-priorauth","GRAVITY PRIORAUTH","Every exam that needs a prior","authorization has one.",38,w_pa(),"AN AUTHORIZATION IN FOUR STEPS",
 [("The rule says it’s needed","Checked on its own once coverage is verified"),("Filled in and submitted","On the payer’s portal, with nothing retyped"),("Status checked","One at a time or in bulk"),("Recorded on the order","Number, dates and status, for every exam")],
 "Pending and denied cases go to a person.","Gravity PriorAuth: rules say which exams need an authorization, requests are submitted on the payer portal, status is checked and recorded on the order; pending and denied cases go to a person.")
banner("gravity-visit","GRAVITY VISIT","Checked in and paid","before they arrive.",40,w_visit(),"ONE VISIT, ON THE PATIENT’S PHONE",
 [("Book","From the app or by voice, under your booking rules"),("Fill in the forms","Consents, screening questions, ID and insurance card"),("Check in and pay","From one text link, with no login"),("It’s on the order","Every answer and signed form")],
 "Nothing to download and no password.","Gravity Visit: the patient books, fills in forms, checks in and pays from one text link on their own phone, and every answer and signed form is filed to the order.")
print('ok')
