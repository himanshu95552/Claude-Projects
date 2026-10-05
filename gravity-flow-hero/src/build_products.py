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
        x=802+[0,88,156][i]; w_=[66,52,66][i]; sel=i==2
        b+=f'<rect x="{x}" y="100" width="{w_+14}" height="26" rx="13" fill="{"#6B3FE4" if sel else "#FFF"}" stroke="{"#6B3FE4" if sel else "#CBD5E1"}"/>'+tx(x+(w_+14)/2,118,o,'p-wh' if sel else 'p-t2',12,'middle')
    for i,(n,f) in enumerate([("Scheduler",.62),("Front-desk staff",.35),("Authorization specialist",.8)]):
        y=148+i*44; b+=tx(802,y,n,'p-t2',13.5)+f'<rect x="802" y="{y+10}" width="238" height="10" rx="5" fill="#EEF0F3"/><rect x="802" y="{y+10}" width="{int(238*f)}" height="10" rx="5" fill="#6B3FE4"/>'
    return win(W,H,b)
def w_pa(W=1080,H=300):
    b=bar(W,H)+header(W,"Prior authorization","On the order","Gravity PriorAuth")
    b+=card(20,58,1040,230)
    for i,(t,sel) in enumerate([("All",True),("Pending",False),("Denied",False)]):
        x=38+i*78; b+=(f'<rect x="{x}" y="70" width="{[40,76,68][i]}" height="28" rx="8" fill="#F3EEFE"/>' if sel else '')+tx(x+[20,38,34][i],89,t,'p-pl' if sel else 'p-t2',14,'middle')
    for x,t in [(40,"Exam"),(220,"Authorization"),(370,"Number"),(520,"Dates"),(660,"Status")]: b+=tx(x,122,t,'p-t3',12.5)
    rows=[("MRI knee","Required","Approved",'ok'),("CT abdomen","Required","Submitted",'in'),("MRI brain","Required","Pending",'wn'),("Mammogram","Not required","",'in')]
    rows[3]=("Ultrasound","Required","Denied",'bd')
    for i,(e,r,s,k) in enumerate(rows):
        y=130+i*38; b+=f'<rect x="30" y="{y}" width="1020" height="32" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(40,y+21,e,'p-tx',14.5)+chip(218,y+4,r,'pl',24,12)
        b+=f'<rect x="370" y="{y+12}" width="{[96,80,0,70][i]}" height="8" rx="4" fill="#E2E8F0"/>'+(f'<rect x="520" y="{y+12}" width="{[110,96,0,90][i]}" height="8" rx="4" fill="#E2E8F0"/>' if i!=2 else '')
        b+=chip(658,y+4,s,k,24,12)+(tx(750,y+21,"To a person",'p-t2',13) if k in('bd','wn') else '')
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


def filler(x,y,w,c="#E2E8F0"): return f'<rect x="{x}" y="{y}" width="{w}" height="8" rx="4" fill="{c}"/>'
def w_grow(W=1080,H=300):
    b=bar(W,H)+header(W,"Referring provider","NPI checked","Gravity Grow")
    b+=card(20,58,380,230)+f'<circle cx="62" cy="108" r="26" fill="#F3EEFE" stroke="#E7DDFF"/>'+ic('person',48,94,1.15,"#6B3FE4",1.8)+tx(104,102,"Referring provider",'p-dh',18)+chip(104,112,"NPI verified",'ok')
    for i,f in enumerate(["Specialty","Credentials","Identifiers"]):
        y=156+i*42; b+=f'<rect x="36" y="{y}" width="348" height="34" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(52,y+22,f,'p-tx',14)+filler(230,y+13,[110,80,100][i])
    b+=card(420,58,340,230)+tx(440,88,"Orders sent",'p-dh',18)
    for i,(e,st,k) in enumerate([("MRI knee","Completed",'ok'),("CT chest","Booked",'in'),("Mammogram","Authorized",'in'),("Ultrasound","Received",'in')]):
        y=104+i*44; b+=f'<rect x="434" y="{y}" width="312" height="38" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(450,y+24,e,'p-tx',14.5)+chip(738,y+7,st,k,24,12,'r')
    b+=card(780,58,280,230)+tx(800,88,"Practice and location",'p-dh',18)
    for i,(t,sub) in enumerate([("Organization","at this address"),("Location","where they work")]):
        y=104+i*62; b+=f'<rect x="796" y="{y}" width="248" height="52" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/><circle cx="816" cy="{y+26}" r="6" fill="#6B3FE4"/>'+tx(832,y+23,t,'p-tx',14.5)+tx(832,y+41,sub,'p-t3',12.5)
    b+=chip(796,236,"May be contacted",'ok')
    return win(W,H,b)
def w_referral(W=1080,H=300):
    b=bar(W,H)+header(W,"Referral portal","Live order status","Gravity Referral")
    b+=card(20,58,380,230)+tx(40,86,"Order",'p-t3',12.5)+tx(190,86,"Status",'p-t3',12.5)
    for i,(e,st,k) in enumerate([("MRI knee","Completed",'ok'),("CT chest","Booked",'in'),("Mammogram","Authorized",'in'),("Ultrasound","Needs information",'wn')]):
        y=98+i*44; b+=f'<rect x="32" y="{y}" width="356" height="38" rx="9" fill="{"#FFFBEB" if k=="wn" else "#F8F8FA"}" stroke="{"#FDE68A" if k=="wn" else "#EEF0F3"}"/>'+tx(48,y+24,e,'p-tx',15)+chip(188,y+7,st,k)
    b+=card(420,58,400,106)+tx(440,86,"Needs clinical notes",'p-dh',17)+chip(800,66,"What and why",'wn',24,12,'r')+tx(440,114,"Upload in the portal, answer there",'p-t2',14)+f'<rect x="440" y="126" width="120" height="28" rx="8" fill="#6B3FE4"/>'+tx(500,145,"Upload",'p-wh',13.5,'middle')
    b+=card(420,176,400,112)+tx(440,204,"Report and images",'p-dh',17)+chip(800,184,"Signed",'ok',24,12,'r')
    for i,t in enumerate(["Report","Images"]): b+=f'<rect x="{440+i*120}" y="226" width="108" height="30" rx="8" fill="{"#6B3FE4" if i==0 else "#FFF"}" stroke="#6B3FE4"/>'+tx(494+i*120,246,t,'p-wh' if i==0 else 'p-pl',13.5,'middle')
    return win(W,H,b)
def w_estimate(W=1080,H=300):
    b=bar(W,H)+header(W,"Estimate","Coverage checked","Gravity Estimate")
    b+=card(20,58,400,230)+tx(40,88,"Benefit lines",'p-dh',18)
    for i,(t,sel) in enumerate([("Service type, in network",True),("Service type, out of network",False),("General benefit",False),("Other line",False)]):
        y=104+i*44; b+=f'<rect x="34" y="{y}" width="372" height="38" rx="9" fill="{"#F3EEFE" if sel else "#F8F8FA"}" stroke="{"#6B3FE4" if sel else "#EEF0F3"}" stroke-width="{1.6 if sel else 1}"/>'+tx(50,y+24,t,'p-pl' if sel else 'p-tx',14)+(chip(396,y+7,"AI pick",'pl',24,12,'r') if sel else '')
    b+=f'<path d="M434 173 H468" stroke="#6B3FE4" stroke-width="2.2"/><path d="M460 166 L470 173 L460 180" fill="none" stroke="#6B3FE4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    b+=card(480,58,290,230)+tx(500,88,"Estimate",'p-dh',18)
    for i,t in enumerate(["Copay","Coinsurance","Deductible"]): y=104+i*38; b+=tx(500,y+16,t,'p-tx',14)+filler(640,y+9,[90,70,100][i])
    b+=f'<rect x="494" y="222" width="262" height="50" rx="10" fill="#F3EEFE" stroke="#E7DDFF"/>'+tx(510,252,"Patient’s share",'p-pl',15)+filler(656,243,80,"#C9B9F8")
    b+=f'<path d="M784 173 H816" stroke="#6B3FE4" stroke-width="2.2"/>'
    b+=card(826,58,234,230)+tx(844,88,"Text to the patient",'p-dh',17)+f'<rect x="844" y="108" width="198" height="84" rx="14" fill="#F3EEFE" stroke="#E7DDFF"/>'+tx(860,134,"Your benefits and",'p-tx',14)+tx(860,154,"estimated cost",'p-tx',14)+tx(860,176,"Open link, no login",'p-pl',13)+chip(844,208,"Sent",'ok')
    return win(W,H,b)
def w_pay(W=1080,H=300):
    b=bar(W,H)+header(W,"Patient account","Collect the patient’s share","Gravity Pay")
    b+=card(20,58,300,230)+tx(40,88,"From the estimate",'p-dh',18)+f'<rect x="36" y="108" width="268" height="60" rx="10" fill="#F3EEFE" stroke="#E7DDFF"/>'+tx(52,134,"Patient’s share",'p-pl',15)+filler(52,146,120,"#C9B9F8")+tx(40,204,"The amount is set once,",'p-t2',14)+tx(40,224,"then collected at any of",'p-t2',14)+tx(40,244,"three moments.",'p-t2',14)
    for i,(t,sub) in enumerate([("When the exam is booked","Same screen as the estimate"),("Before the visit","From the patient’s phone"),("On the day","Front desk or card terminal")]):
        x=338+i*154; b+=card(x,58,146,230)+tx(x+14,110,t.split(' ')[0]+' '+t.split(' ')[1] if len(t.split(' '))>2 else t,'p-tx',14)+tx(x+14,130,' '.join(t.split(' ')[2:]),'p-tx',14)
        for k,l in enumerate(wrap(sub,16)): b+=tx(x+14,166+k*18,l,'p-t2',12.5)
        b+=chk(x+14,238,.8)+tx(x+36,254,"On the order",'c-ok',12.5)
    b+=card(808,58,252,230)+tx(826,88,"One account per patient",'p-dh',16)
    for i,t in enumerate(["Charges","Insurance payments","Adjustments","Payments"]): y=106+i*42; b+=f'<rect x="822" y="{y}" width="224" height="34" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(836,y+22,t,'p-tx',13)+filler(970,y+13,60)
    return win(W,H,b)
def w_greeter(W=1080,H=300):
    b=bar(W,H)+header(W,"Lobby tablet","One tablet per location","Gravity Greeter")
    b+=card(20,58,200,230)+tx(40,88,"Or type",'p-dh',17)
    for i,t in enumerate(["Name","Date of birth"]): y=104+i*52; b+=tx(40,y+12,t,'p-t3',12.5)+f'<rect x="36" y="{y+18}" width="168" height="26" rx="6" fill="#F8F8FA" stroke="#CBD5E1"/>'
    b+=f'<rect x="250" y="62" width="580" height="226" rx="22" fill="#1B1430"/><rect x="262" y="74" width="556" height="202" rx="12" fill="#FFF"/>'
    b+=tx(282,106,"Scan your driver’s license",'p-dh',19)+f'<rect x="282" y="122" width="190" height="120" rx="12" fill="#F3EEFE" stroke="#6B3FE4" stroke-dasharray="5 5"/>'+ic('fit',353,160,1.4,"#6B3FE4",1.8)+tx(377,262,"Barcode on the back",'p-t3',12.5,'middle')
    b+=f'<path d="M488 182 H520" stroke="#6B3FE4" stroke-width="2.2"/><path d="M512 175 L522 182 L512 189" fill="none" stroke="#6B3FE4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    b+=f'<rect x="532" y="122" width="270" height="86" rx="12" fill="#F8F8FA" stroke="#E5E7EB"/>'+tx(548,148,"Today’s appointment",'p-t3',12.5)+tx(548,172,"MRI knee",'p-tx',16)+chip(548,180,"Found",'ok',22,12)+f'<rect x="532" y="218" width="270" height="40" rx="10" fill="#6B3FE4"/>'+tx(667,243,"Check in",'p-wh',15,'middle')
    b+=card(850,58,210,230)+tx(868,88,"Checked in",'p-dh',18)+chip(868,100,"On the order",'ok')
    for i,t in enumerate(["Consents signed","Forms submitted"]): y=142+i*44; b+=f'<rect x="864" y="{y}" width="182" height="36" rx="8" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(878,y+23,t,'p-tx',13)+chk(1018,y+9,.75)
    return win(W,H,b)
def w_trust(W=1080,H=300):
    b=bar(W,H)+header(W,"Order timeline","Every change on record","Gravity Trust")
    b+=card(20,58,230,230)+tx(40,88,"Show",'p-dh',17)
    for i,t in enumerate(["Appointments","Coverage","Prior auth","Patient","Documents","Outreach"]):
        y=102+i*30; b+=f'<rect x="38" y="{y}" width="16" height="16" rx="4" fill="#6B3FE4"/>'+ic('check',40,y+2,.5,"#FFF",3)+tx(64,y+13,t,'p-tx',14)
    b+=card(270,58,790,230)+f'<path d="M306 84 V262" stroke="#CBD5E1" stroke-width="2"/>'
    for i,(t,sub,k) in enumerate([("Appointment","Status changed",'in'),("Prior auth","Status changed",'in'),("Outreach","Text sent",'in'),("Comment","Added to the order",'in')]):
        y=100+i*46; b+=f'<circle cx="306" cy="{y+14}" r="7" fill="#6B3FE4"/><rect x="330" y="{y}" width="708" height="36" rx="9" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(346,y+23,t,'p-tx',14.5)+tx(470,y+23,sub,'p-t2',14)+filler(700,y+14,90)+filler(810,y+14,70)+(chip(944,y+6,"From → to",'pl',24,12) if i<2 else '')
    return win(W,H,b)

# ---------- banner frame, three layouts ----------
def steps_block(steps,ly,xs,subs=True,tsize=22):
    b=f'<path d="M{xs[0]} {ly} H{xs[3]}" stroke="#C9B3FF" stroke-width="1.6" stroke-opacity=".75"/>'
    for i,(t,sub) in enumerate(steps):
        x=xs[i]
        if i<3: b+=f'<circle cx="{x}" cy="{ly}" r="24" fill="url(#nw)"/><circle cx="{x}" cy="{ly}" r="9" fill="#C9B3FF"/>'
        else: b+=f'<circle cx="{x}" cy="{ly}" r="26" fill="url(#ow)"/><circle cx="{x}" cy="{ly}" r="14" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-opacity=".6" stroke-width="2"/><circle cx="{x}" cy="{ly}" r="7" fill="#67E3EE"/>'
        b+=T(x-9,ly+44,f"0{i+1}",'m',12)+T(x-9,ly+74,t,'d',tsize)
        if subs:
            for k,l in enumerate(wrap(sub,29)): b+=T(x-9,ly+100+k*20,l,'s',15)
    return b
def banner(slug,eyebrow,l1,l2,fs,win_svg,steps_title,steps,foot,aria,layout='A',crop=0,outdir='product-banners'):
    xs=[90+i*270 for i in range(4)]
    b=T(60,76,eyebrow,'m',13)+T(60,124,l1,'d',fs)+T(60,124+fs+6,l2,'d',fs)
    if layout=='A':
        b+=G(60,196,win_svg)+T(60,556,steps_title,'m',11.5)+steps_block(steps,608,xs)
    elif layout=='B':
        b+=T(60,226,steps_title,'m',11.5)+steps_block(steps,272,xs)+G(60,468,win_svg)
    else:
        b+=f'<clipPath id="cc"><rect x="60" y="188" width="1080" height="338" rx="18"/></clipPath><g clip-path="url(#cc)"><svg x="60" y="188" width="1080" height="338" viewBox="{crop} 46 800 250" preserveAspectRatio="xMidYMid slice" overflow="hidden">{win_svg}</svg></g><rect x="60" y="188" width="1080" height="338" rx="18" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.5"/>'
        b+=T(60,578,steps_title,'m',11.5)+steps_block(steps,630,xs,subs=False,tsize=21)
    b+=f'<line x1="60" y1="796" x2="1140" y2="796" stroke="#fff" stroke-opacity=".14"/><circle cx="68" cy="834" r="5" fill="#C9B3FF"/>'+T(84,840,foot,'l',17)
    svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="{esc(aria)}">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
    os.makedirs(outdir,exist_ok=True)
    open(f'{outdir}/{slug}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(slug)}</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')

P=[ # slug, eyebrow, l1, l2, fs, window fn, crop x, steps title, steps, foot, aria
("gravity-doc","GRAVITY DOC","Gravity reads the fax, finds or creates","the patient, and creates the order.",35,w_doc,260,"THE STEPS FROM DOCUMENT TO ORDER",
 [("The document arrives","Fax, email, upload or portal, in the document worklist"),("Read and sorted","Into your categories, with its patient, provider and exam details"),("Filed on the right record","The patient, order or visit it belongs to"),("The order is created","When patient, referring provider and exam all match")],
 "A person sees it only when something doesn’t match.","Gravity Doc: documents are read, sorted and filed, then the order is created when patient, provider and exam match; anything uncertain goes to a person."),
("gravity-booking","GRAVITY BOOKING","Booked right the first time,","with every rule checked.",40,w_booking,280,"HOW AN EXAM IS BOOKED",
 [("Every exam on the order","Booked in one pass"),("Only valid slots offered","Device, exam length, patient limits and gaps checked"),("Lead time applied","Slots too early for the authorization are greyed out"),("Several exams, one visit","In the right order, with the right gaps")],
 "In the right slot, on the right device.","Gravity Booking: every booking is checked against the device, exam length, patient limits, gaps and authorization lead time, so only valid slots are offered."),
("gravity-work","GRAVITY WORK","Every task in front of","the right person.",40,w_work,226,"FOUR STEPS TO THE RIGHT PERSON",
 [("Work arrives","A call, text, email, document or order"),("It lands on its worklist","Contact center, documents, orders, referring providers or patients"),("It’s assigned on its own","Round-robin, by weight or by capacity"),("The right person works it","With search, tags, presence and bulk actions")],
 "What an agent can’t finish lands here with the history attached.","Gravity Work: every part of Gravity has a worklist, work is assigned on its own by round-robin, weight or capacity, and what an agent cannot finish lands here with the history attached."),
("gravity-priorauth","GRAVITY PRIORAUTH","Every exam that needs a prior","authorization has one.",38,w_pa,240,"AN AUTHORIZATION IN FOUR STEPS",
 [("The rule says it’s needed","Checked on its own once coverage is verified"),("Filled in and submitted","On the payer’s portal, with nothing retyped"),("Status checked","One at a time or in bulk"),("Recorded on the order","Number, dates and status, for every exam")],
 "Pending and denied cases go to a person.","Gravity PriorAuth: rules say which exams need an authorization, requests are submitted on the payer portal, status is checked and recorded on the order; pending and denied cases go to a person."),
("gravity-visit","GRAVITY VISIT","Checked in and paid","before they arrive.",40,w_visit,276,"ONE VISIT, ON THE PATIENT’S PHONE",
 [("Book","From the app or by voice, under your booking rules"),("Fill in the forms","Consents, screening questions, ID and insurance card"),("Check in and pay","From one text link, with no login"),("It’s on the order","Every answer and signed form")],
 "Nothing to download and no password.","Gravity Visit: the patient books, fills in forms, checks in and pays from one text link on their own phone, and every answer and signed form is filed to the order."),
("gravity-grow","GRAVITY GROW","Every referring provider, and","everything they’ve sent you.",38,w_grow,280,"HOW A REFERRER’S RECORD COMES TOGETHER",
 [("Add the provider","Checked against the national NPI registry"),("Link the practice","Each location, and the organization at that address"),("Orders arrive","Every order names its ordering provider"),("On the record","Every order and its status")],
 "Each order they’ve sent, and where it stands, on one record.","Gravity Grow: an NPI-checked record of every referring provider, with each order they have sent, where it stands, and the practice and location they work from."),
("gravity-referral","GRAVITY REFERRAL","Upload the order and","it’s a digital order.",40,w_referral,260,"FROM YOUR ORDER TO THE SIGNED REPORT",
 [("You upload the order","In the portal, or by fax if that’s how your office works"),("It becomes a digital order","At the imaging center, with nothing to retype"),("You’re told what it needs","Clinical notes, an authorization or more information, with what and why"),("You watch it move","Received, authorized, booked, completed")],
 "The report and the images, in the portal the minute the read is signed.","Gravity Referral: upload the order and it becomes a digital order, you are told what it needs and why, you watch it move, and the report and images arrive when the read is signed."),
("gravity-estimate","GRAVITY ESTIMATE","Coverage verified before the patient arrives,","without calling the payer.",34,w_estimate,20,"AN ESTIMATE IN FOUR STEPS",
 [("Coverage checked","Electronically, or on the payer’s portal"),("Benefit line picked","AI chooses the line that fits the exam and network"),("Estimate built","From the benefits and your fee schedule"),("Sent by text","A link to the patient’s benefits and estimated cost")],
 "Known before the patient arrives.","Gravity Estimate: coverage is checked, AI picks the benefit line, the estimate is built from the benefits and the fee schedule, and sent to the patient by text."),
("gravity-pay","GRAVITY PAY","The patient’s share, collected","at booking or at the visit.",38,w_pay,280,"WHEN THE PATIENT PAYS",
 [("The estimate sets the amount","From Gravity Estimate"),("When the exam is booked","From the same screen as the estimate"),("Before the visit","From the patient’s own phone"),("On the day","At the front desk or the card terminal")],
 "Every payment lands on the order.","Gravity Pay: the estimate sets the amount, and the patient pays at booking, before the visit from their phone, or on the day at the front desk or card terminal; every payment lands on the order."),
("gravity-greeter","GRAVITY GREETER","Check-in at a lobby tablet,","not a line at the desk.",40,w_greeter,230,"HOW A PATIENT CHECKS IN",
 [("Scan the license","Or type a name and date of birth"),("The appointment comes up","Found in Gravity by name and date of birth"),("Check in","The same steps as Gravity Visit"),("Checked in, on the order","With what the patient signed and submitted")],
 "One tablet per location, in the lobby.","Gravity Greeter: the patient scans a license or types a name and date of birth, the appointment comes up, and they check themselves in at a lobby tablet."),
("gravity-trust","GRAVITY TRUST","Controls who can get in, what they can do,","and records what was done.",36,w_trust,230,"THREE QUESTIONS, ONE RECORD",
 [("Who can get in","Single sign-on with the work account they already have"),("What they can do","Groups decide the screens and actions each person has"),("What was done","Who changed which field, when, and from what to what"),("Ready when an auditor asks","The whole story of an order on one screen")],
 "Each person sees and does only what their job needs.","Gravity Trust: single sign-on, groups that decide what each person can do, and an audit timeline of who changed which field, when, ready when an auditor asks."),
]
LAY={'A':'a-steps-below','B':'b-steps-first','C':'c-close-up'}
for slug,eb,l1,l2,fs,wf,cx,st,steps,foot,aria in P:
    for L in 'ABC':
        banner(f'{slug}-{LAY[L]}',eb,l1,l2,fs,wf(),st,steps,foot,aria,L,cx)
print('ok',len(P)*3)
