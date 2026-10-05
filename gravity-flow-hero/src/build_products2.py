# Eleven product-page heroes, each with its own idea. V1 = process diagram built for that page; V2 = zoomed product view with three callouts.
import sys,os; sys.path.insert(0,'src')
_s=open('src/build_products.py').read().split('# ---------- banner frame, three layouts ----------')[0]
exec(_s)
import screens
screens.IC.update({'scan':"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10",'person':"M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0"})
IC.update({
 'doc':"M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h6M9.5 16h6",'mail':"M3 6h18v12H3zM3 7l9 6 9-6",
 'fax':"M7 8V3h8l2 2v3M5 8h14a2 2 0 0 1 2 2v7h-4v4H7v-4H3v-7a2 2 0 0 1 2-2zM7 14h10v7H7z",
 'upload':"M12 16V4M7 9l5-5 5 5M5 20h14",'phone':"M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
 'calendar':"M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",'shield':"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
 'list':"M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",'dollar':"M12 3v18M16 7.5C15 6.5 13.7 6 12 6c-2.4 0-4 1.2-4 3s1.6 2.6 4 3 4 1.2 4 3-1.6 3-4 3c-1.7 0-3.2-.5-4.2-1.5",
 'card':"M3 6h18v12H3zM3 10h18M6 15h4",'tablet':"M5 4h14v16H5zM11 17h2",'scan':"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10",
 'search':"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.5-4.5",'pin':"M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
 'users':"M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M17 4.5a3.5 3.5 0 0 1 0 6.5M18.5 14a6.5 6.5 0 0 1 3 6",
 'lock':"M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",'chat':"M4 5h16v11H9l-5 4z",'building':"M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18",
})
def gl(x,y,w,h,r=20): return glass(x,y,w,h,r,.07,.22)
def tl(x,y,name,sz=56,s=1.25,lag=False): return tile(x,y,sz,name,s*sz/56,lag)
def dsh(d,op=.6): return f'<path d="{d}" fill="none" stroke="#C9B3FF" stroke-width="1.8" stroke-dasharray="6 7" stroke-opacity="{op}" stroke-linecap="round"/>'
def cv(x0,y0,x1,y1): dx=(x1-x0)*.5; return conn(f'M{x0} {y0} C{x0+dx} {y0} {x1-dx} {y1} {x1} {y1}')
def ar(x0,x1,y,col="#C9B3FF"):
    d=1 if x1>x0 else -1
    return f'<path d="M{x0} {y} H{x1-d*8}" stroke="{col}" stroke-width="2" stroke-linecap="round"/><path d="M{x1-d*14} {y-7} L{x1} {y} L{x1-d*14} {y+7}" fill="none" stroke="{col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
def lag(x,y,r=14): return f'<circle cx="{x}" cy="{y}" r="{r+12}" fill="url(#ow)"/><circle cx="{x}" cy="{y}" r="{r}" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-opacity=".6" stroke-width="2"/><circle cx="{x}" cy="{y}" r="{r/2}" fill="#67E3EE"/>'
def dot(x,y,r=7): return f'<circle cx="{x}" cy="{y}" r="{r+9}" fill="url(#nw)"/><circle cx="{x}" cy="{y}" r="{r}" fill="#C9B3FF"/>'
def ring(x,y,r=7): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#1B1430" stroke="#C9B3FF" stroke-width="2.2"/>'
def eb(x,y,t,anchor='start'): return T(x,y,t,'m',11.5,anchor)
def wr(x,y,t,n,cls='s',size=15,lh=20,anchor='start'):
    return ''.join(T(x,y+k*lh,l,cls,size,anchor) for k,l in enumerate(wrap(t,n)))
def head2(eyebrow,l1,l2,fs): return T(60,76,eyebrow,'m',13)+T(60,124,l1,'d',fs)+T(60,124+fs+6,l2,'d',fs)
def foot(t): return f'<line x1="60" y1="796" x2="1140" y2="796" stroke="#fff" stroke-opacity=".14"/><circle cx="68" cy="834" r="5" fill="#C9B3FF"/>'+T(84,840,t,'l',17)
def emit(name,body,aria,outdir='product-banners'):
    svg=f'<svg viewBox="0 0 1200 900" role="img" aria-label="{esc(aria)}">{DEFS}{SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{body}</svg>'
    os.makedirs(outdir,exist_ok=True)
    open(f'{outdir}/{name}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(name)}</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')

# ================= V1 diagrams =================
def v1_doc():
    b=head2("GRAVITY DOC","Gravity reads the fax, finds or creates","the patient, and creates the order.",35)
    b+=eb(70,238,"THE DOCUMENT ARRIVES")
    src=[("fax","Fax"),("mail","Email"),("upload","Upload"),("http","Portal")]
    for i,(ic_,n) in enumerate(src):
        y=262+i*84; b+=cv(236,y+28,330,424)+tl(70,y,ic_,56)+T(142,y+36,n,'lb',19)
    b+=eb(330,238,"READ, SORTED, FILED")+gl(330,262,250,326,22)+T(354,304,"Gravity Doc",'d',23)
    for i,(t,s_) in enumerate([("Read","Patient, provider, exam"),("Sorted","Into your categories"),("Filed","On the right record")]):
        y=346+i*78; b+=tile(354,y,44,'check',1.0)+T(412,y+19,t,'lb',18)+T(412,y+40,s_,'s',13.5)
    b+=eb(660,238,"MATCHED")
    for i,t in enumerate(["Patient","Referring provider","Exam"]):
        y=272+i*84; b+=cv(580,424,660,y+26)+gl(660,y,210,52,26)+f'<circle cx="686" cy="{y+26}" r="8" fill="#C9B3FF"/>'+ic_check(686,y+26)+T(704,y+32,t,'lb',16.5)
        b+=cv(870,y+26,920,424)
    b+=eb(920,238,"THE ORDER")+gl(920,330,220,190,24)+tl(942,352,'doc',52)+lag(1110,360,10)+T(942,444,"Order created",'d',24)+wr(942,470,"When all three match",24,'s',15)
    b+=dsh('M455 588 C455 640 455 650 455 664')+tl(330,664,'person',56)+T(402,690,"A person",'d',22)+T(402,714,"Only when something doesn’t match",'s',15)
    return b+foot("A person sees it only when something doesn’t match.")
def ic_check(x,y): return icon('check',x-6,y-6,.5,"#1B1430",3)
def v1_booking():
    b=head2("GRAVITY BOOKING","Booked right the first time,","with every rule checked.",40)
    b+=gl(60,224,660,330,22)
    st=[["o","c","o","x","o","o"],["o","o","x","x","o","c"],["c","o","B","o","o","o"]]
    for j in range(3):
        x=84+j*212; b+=T(x+98,252,f"Device {j+1}",'s',14,'middle')
        for i,s_ in enumerate(st[j]):
            y=266+i*44
            if s_=='o': b+=f'<rect x="{x}" y="{y}" width="196" height="38" rx="10" fill="#FFF" fill-opacity=".05" stroke="#C9B3FF" stroke-opacity=".5"/>'
            elif s_=='c': b+=f'<rect x="{x}" y="{y}" width="196" height="38" rx="10" fill="#FFF" fill-opacity=".14"/>'
            elif s_=='x': b+=f'<rect x="{x}" y="{y}" width="196" height="38" rx="10" fill="none" stroke="#FFF" stroke-opacity=".4" stroke-dasharray="5 5"/>'+icon('trigger',x+88,y+7,.9,"#B4A8D6",1.6)
            else: b+=f'<rect x="{x}" y="{y}" width="196" height="38" rx="10" fill="#C9B3FF"/>'+T(x+98,y+25,"Booked",'d',16,'middle','style="fill:#1B1430"')
    for x,t,k in [(60,"Open",'o'),(150,"Too early for the authorization",'x'),(430,"Closed",'c'),(520,"Booked",'B')]:
        if k=='o': b+=f'<rect x="{x}" y="574" width="16" height="12" rx="3" fill="none" stroke="#C9B3FF"/>'
        elif k=='x': b+=f'<rect x="{x}" y="574" width="16" height="12" rx="3" fill="none" stroke="#FFF" stroke-opacity=".5" stroke-dasharray="3 3"/>'
        elif k=='c': b+=f'<rect x="{x}" y="574" width="16" height="12" rx="3" fill="#FFF" fill-opacity=".18"/>'
        else: b+=f'<rect x="{x}" y="574" width="16" height="12" rx="3" fill="#C9B3FF"/>'
        b+=T(x+24,585,t,'s',13.5)
    b+=ar(720,770,389)+gl(770,224,370,330,22)+T(794,264,"Checked on every booking",'d',22)
    for i,t in enumerate(["Device","Exam length","Patient limits","Gaps between exams","Authorization lead time"]):
        y=300+i*50; b+=dot(806,y+10,6)+T(830,y+17,t,'l',18)
    b+=eb(60,628,"SEVERAL EXAMS, ONE VISIT")
    b+=f'<path d="M870 706 H1100" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/>'
    for i,x in enumerate([60,350,640]):
        b+=gl(x,676,230,60,16)+T(x+115,713,f"Exam {i+1}",'lb',17,'middle')
    for x in (290,580): b+=dsh(f'M{x} 706 H{x+60}',.8)
    b+=lag(1110,706,13)+T(1100,660,"In the right slot, on the right device",'s',14.5,'end')+T(60,764,"In the right order, with the right gaps.",'s',15)
    return b+foot("Every device, exam length, patient limit and gap checked on every booking.")
def v1_work():
    b=head2("GRAVITY WORK","Every task in front of","the right person.",40)
    b+=eb(70,238,"WORK ARRIVES")
    for i,(ic_,n) in enumerate([("phone","Call"),("chat","Text"),("mail","Email"),("doc","Document"),("list","Order")]):
        y=258+i*68; b+=cv(246,y+24,400,414)+tl(70,y,ic_,48)+T(130,y+31,n,'lb',18)
    b+=eb(400,238,"IT LANDS ON ITS WORKLIST")+gl(400,258,280,330,22)+T(424,298,"Worklist",'d',22)
    for i,n in enumerate(["Contact center","Documents","Orders","Referring providers","Patients"]):
        y=318+i*52; b+=f'<rect x="418" y="{y}" width="244" height="40" rx="10" fill="#FFF" fill-opacity="{.13 if i==0 else .06}" stroke="#FFF" stroke-opacity=".2"/><circle cx="438" cy="{y+20}" r="5" fill="#C9B3FF"/>'+T(454,y+26,n,'lb',15.5)
    b+=eb(770,238,"ASSIGNED ON ITS OWN")
    import math
    for i,(n,f) in enumerate([("Scheduler",.62),("Front-desk staff",.36),("Authorization specialist",.8)]):
        y=312+i*114; c=2*math.pi*38
        b+=cv(680,414,768,y)+f'<circle cx="806" cy="{y}" r="38" fill="none" stroke="#FFF" stroke-opacity=".18" stroke-width="9"/><circle cx="806" cy="{y}" r="38" fill="none" stroke="#C9B3FF" stroke-width="9" stroke-linecap="round" stroke-dasharray="{c*f:.1f} {c:.1f}" transform="rotate(-90 806 {y})"/>'+icon('person',794,y-12,1.0,"#C9B3FF",1.6)+T(866,y+6,n,'lb',19)
    b+=T(770,672,"Round-robin, by weight or by capacity",'l',16.5)+T(770,700,"With search, tags, presence and bulk actions",'s',14.5)
    b+=dsh('M540 588 V640')+tl(400,640,'agent',56,1.25)+T(472,666,"From an agent",'d',21)+T(472,690,"With the history attached",'s',15)
    return b+foot("Nobody hunts for the next task.")
def v1_pa():
    b=head2("GRAVITY PRIORAUTH","Every exam that needs a prior","authorization has one.",38)
    xs=[420,590,760,930]
    for x,(a,c) in zip(xs,[("THE RULE SAYS","IT’S NEEDED"),("FILLED IN AND","SUBMITTED"),("STATUS","CHECKED"),("RECORDED","ON THE ORDER")]): b+=eb(x,232,a,'middle')+eb(x,248,c,'middle')
    lanes=[("MRI knee",4,"Approved",'ok',''),("CT abdomen",2,"Submitted",'in',''),("MRI brain",3,"Pending",'wn',"Goes to a person"),("Ultrasound",3,"Denied",'bd',"Goes to a person")]
    for i,(e,r,st_,k,note_) in enumerate(lanes):
        y=330+i*116; b+=gl(50,y-46,1090,92,18)+T(78,y+8,e,'d',22)
        b+=f'<path d="M{xs[0]} {y} H{xs[3]}" stroke="#fff" stroke-opacity=".22" stroke-width="1.6" stroke-dasharray="3 6"/><path d="M{xs[0]} {y} H{xs[r-1]}" stroke="#C9B3FF" stroke-width="2"/>'
        for j,x in enumerate(xs):
            if j<r: b+=(lag(x,y,12) if (i==0 and j==3) else dot(x,y,8))
            else: b+=ring(x,y,8)
        col={'ok':("#ECFDF5","#047857"),'in':("#F1F5F9","#334155"),'wn':("#FFFBEB","#B45309"),'bd':("#FEF2F2","#B91C1C")}[k]
        b+=f'<rect x="1012" y="{y-14}" width="104" height="28" rx="14" fill="{col[0]}"/>'+T(1064,y+5,st_,'lb',14,'middle',f'style="fill:{col[1]}"')
        if note_: b+=T(1064,y+30,note_,'s',12.5,'middle')
    return b+foot("Pending and denied cases go to a person.")
def v1_visit():
    b=head2("GRAVITY VISIT","Checked in and paid","before they arrive.",40)
    px=[60,330,600]
    for x,t in zip(px,["01 BOOK","02 FILL IN THE FORMS","03 CHECK IN AND PAY"]): b+=eb(x,232,t)
    def ph(x,body): return f'<g filter="url(#sh)"><rect x="{x}" y="248" width="236" height="520" rx="34" fill="#FFF"/></g><rect x="{x+88}" y="258" width="60" height="6" rx="3" fill="#E2E8F0"/>'+body
    def rowu(x,y,t,ok=False): return f'<rect x="{x+16}" y="{y}" width="204" height="40" rx="10" fill="#F8F8FA" stroke="#EEF0F3"/>'+tx(x+30,y+26,t,'p-tx',14.5)+(chk(x+190,y+9,.8) if ok else '')
    b+=ph(60,tx(78,306,"Book",'p-dh',24)+rowu(60,330,"Choose the exam")+rowu(60,382,"Choose a time")+chip(76,442,"Under your booking rules",'pl')+f'<rect x="76" y="700" width="204" height="44" rx="10" fill="#6B3FE4"/>'+tx(178,729,"Book",'p-wh',16,'middle'))
    b+=ph(330,tx(348,306,"Your forms",'p-dh',24)+rowu(330,330,"Consents",True)+rowu(330,382,"Screening questions",True)+rowu(330,434,"Health questionnaire",True)+f'<rect x="346" y="486" width="204" height="40" rx="10" fill="#FFF" stroke="#6B3FE4" stroke-dasharray="5 5"/>'+tx(448,512,"ID and insurance card",'p-pl',14,'middle')+f'<rect x="346" y="700" width="204" height="44" rx="10" fill="#6B3FE4"/>'+tx(448,729,"Continue",'p-wh',16,'middle'))
    b+=ph(600,tx(618,306,"Check in",'p-dh',24)+chip(616,326,"Checked in",'ok',30,14)+rowu(600,380,"Copay")+f'<rect x="616" y="700" width="204" height="44" rx="10" fill="#6B3FE4"/>'+tx(718,729,"Pay",'p-wh',16,'middle')+tx(716,666,"From one text link, no login",'p-t2',12.5,'middle'))
    b+=ar(298,328,508)+ar(568,598,508)+eb(900,232,"ON THE ORDER")+gl(870,248,270,360,24)+lag(1110,284,10)
    for i,t in enumerate(["Signed consents","Screening answers","ID and insurance card","Payment"]):
        y=312+i*66; b+=dot(900,y+16,6)+T(924,y+22,t,'lb',17.5)
    b+=wr(870,650,"Every answer and signed form is filed to the order.",30,'s',15.5)+T(870,722,"Nothing to download",'l',16)+T(870,746,"and no password.",'l',16)
    return b+foot("Most of check-in is done before the patient walks in the door.")
def v1_grow():
    b=head2("GRAVITY GROW","Every referring provider, and","everything they’ve sent you.",38)
    W,H=560,556; c=bar(W,H)+f'<rect width="{W}" height="64" fill="#FFF"/><rect y="63" width="{W}" height="1" fill="#E5E7EB"/><circle cx="40" cy="32" r="20" fill="#F3EEFE" stroke="#E7DDFF"/>'+ic('person',29,21,.9,"#6B3FE4",1.8)+tx(72,40,"Referring provider",'p-dh',20)+chip(W-22,20,"NPI verified",'ok',26,13,'r')
    for i,f in enumerate(["Specialty","Credentials","Identifiers"]): y=84+i*40; c+=f'<rect x="20" y="{y}" width="520" height="32" rx="8" fill="#FFF" stroke="#EEF0F3"/>'+tx(34,y+21,f,'p-tx',14)+filler(400,y+12,[100,70,90][i])
    c+=tx(20,226,"Orders sent",'p-dh',16)
    for i,(e,st_,k) in enumerate([("MRI knee","Completed",'ok'),("CT chest","Booked",'in'),("Mammogram","Authorized",'in'),("Ultrasound","Received",'in')]):
        y=240+i*40; c+=f'<rect x="20" y="{y}" width="520" height="34" rx="8" fill="#FFF" stroke="#EEF0F3"/>'+tx(34,y+22,e,'p-tx',14.5)+chip(526,y+5,st_,k,24,12,'r')
    c+=tx(20,426,"Practice and location",'p-dh',16)
    for i,(t,sub) in enumerate([("Organization","at this address"),("Location","where they work")]):
        y=440+i*50; c+=f'<rect x="20" y="{y}" width="250" height="42" rx="8" fill="#FFF" stroke="#EEF0F3"/><circle cx="40" cy="{y+21}" r="6" fill="#6B3FE4"/>'+tx(54,y+19,t,'p-tx',13.5)+tx(54,y+35,sub,'p-t3',11.5)
    c+=chip(290,444,"May be contacted",'ok')
    b+=G(60,222,win(W,H,c))
    steps=[("Add the provider","Checked against the national NPI registry"),("Link the practice","Each location, and the organization at that address"),("Orders arrive","Every order names its ordering provider"),("On the record","Every order and its status")]
    b+=f'<path d="M700 262 V682" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/>'
    for i,(t,s_) in enumerate(steps):
        y=262+i*140; b+=(lag(700,y,12) if i==3 else dot(700,y,8))+T(736,y-8,f"0{i+1}",'m',12)+T(736,y+22,t,'d',24)+wr(736,y+48,s_,36,'s',15.5)
    return b+foot("Each order they’ve sent, and where it stands, on one record.")
def v1_referral():
    b=head2("GRAVITY REFERRAL","Upload the order and","it’s a digital order.",40)
    b+=gl(60,236,250,430,24)+tl(84,262,'building',52)+T(84,350,"Referring office",'d',23)+T(84,376,"Referral coordinator",'s',15)
    b+=gl(890,236,250,430,24)+tl(914,262,'calendar',52)+T(914,350,"Imaging center",'d',23)+wr(914,376,"A digital order, with nothing to retype",24,'s',15)
    for i,t in enumerate(["Uploads the order","Answers in the portal","Gets the report, images"]): b+=dot(90,450+i*44,5)+T(106,456+i*44,t,'l',15.5)
    for i,t in enumerate(["Reads it into a digital order","Asks for what’s missing","Signs the read"]): b+=dot(920,450+i*44,5)+T(936,456+i*44,t,'l',15.5)
    b+=T(600,278,"You upload the order",'lb',18,'middle')+T(600,300,"In the portal, or by fax",'s',14.5,'middle')+ar(330,880,318)
    b+=T(600,382,"You’re told what it needs",'lb',18,'middle')+T(600,404,"Clinical notes, an authorization or more information, with what and why",'s',14.5,'middle')+f'<path d="M870 424 H340" stroke="#F59E0B" stroke-width="2" stroke-dasharray="6 6"/><path d="M354 417 L340 424 L354 431" fill="none" stroke="#F59E0B" stroke-width="2"/>'
    b+=T(600,478,"You watch it move",'lb',18,'middle')+f'<path d="M360 530 H840" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/>'
    for i,t in enumerate(["Received","Authorized","Booked","Completed"]):
        x=380+i*147; b+=dot(x,530,7)+T(x,562,t,'l',15,'middle')
    b+=T(600,612,"The report and the images, the minute the read is signed",'lb',17,'middle')+ar(880,342,640,"#67E3EE")+lag(318,640,10)
    return b+foot("Order in one step, then see it through.")
def v1_estimate():
    b=head2("GRAVITY ESTIMATE","Coverage verified before the patient arrives,","without calling the payer.",34)
    b+=tl(60,380,'shield',64)+T(60,486,"Coverage checked",'d',21)+wr(60,512,"Electronically, or on the payer’s portal",17,'s',15)
    b+=ar(132,236,412)+f'<path d="M250 272 H530 L640 396 V472 L530 650 H250 Z" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".22" stroke-width="1.5"/>'
    for r in range(5):
        for cidx in range(3):
            x=268+cidx*88; y=300+r*66
            sel=(r==2 and cidx==1)
            b+=f'<rect x="{x}" y="{y}" width="78" height="28" rx="8" fill="{"#C9B3FF" if sel else "#FFF"}" fill-opacity="{1 if sel else .09}" stroke="#FFF" stroke-opacity="{0 if sel else .25}"/>'
            if sel: sx,sy=x+78,y+14
    b+=cv(sx,sy,640,434)+T(250,226,"Benefit line picked",'d',22)+T(250,250,"AI chooses the line that fits the exam and network",'s',14.5)
    b+=ar(640,700,434)+gl(700,330,190,210,22)+T(720,366,"Estimate",'d',22)
    for i,t in enumerate(["Copay","Coinsurance","Deductible"]): b+=T(720,400+i*30,t,'l',15)+f'<rect x="826" y="{391+i*30}" width="{[50,38,60][i]}" height="8" rx="4" fill="#FFF" fill-opacity=".3"/>'
    b+=f'<rect x="716" y="488" width="158" height="40" rx="10" fill="#C9B3FF"/>'+T(732,514,"Patient’s share",'d',16,'start','style="fill:#1B1430"')
    b+=ar(890,940,434)
    ph=tx(24,48,"Your benefits and",'p-tx',15)+tx(24,68,"estimated cost",'p-tx',15)+f'<rect x="16" y="90" width="168" height="40" rx="10" fill="#6B3FE4"/>'+tx(100,115,"Open link, no login",'p-wh',13,'middle')+chip(16,148,"Sent by text",'ok')
    b+=f'<g transform="translate(940 310)"><g filter="url(#sh)"><rect width="200" height="250" rx="28" fill="#FFF"/></g><rect x="70" y="10" width="60" height="6" rx="3" fill="#E2E8F0"/><g transform="translate(0 20)">{ph}</g></g>'+lag(1040,600,11)+T(1040,640,"Known before they arrive",'l',16,'middle')
    return b+foot("Accurate patient responsibility in one click.")
def v1_pay():
    b=head2("GRAVITY PAY","The patient’s share, collected","at booking or at the visit.",38)
    b+=gl(60,224,1080,64,32)+tl(76,230,'dollar',52,1.0)+T(148,263,"The estimate sets the amount",'d',22)+T(1124,263,"From Gravity Estimate",'s',15.5,'end')
    for i,(ic_,t,s_) in enumerate([("calendar","When the exam is booked","From the same screen as the estimate"),("phone","Before the visit","From the patient’s own phone"),("card","On the day","At the front desk or the card terminal")]):
        x=60+i*380; b+=cv(x+160,288,x+160,336) if False else f'<path d="M{x+160} 288 V336" stroke="#C9B3FF" stroke-opacity=".5" stroke-width="1.6"/>'
        b+=gl(x,336,320,170,22)+tl(x+22,356,ic_,52)+T(x+22,436,t,'d',23)+wr(x+22,462,s_,32,'s',15.5)+f'<path d="M{x+160} 506 V576" stroke="#C9B3FF" stroke-opacity=".7" stroke-width="1.6"/>'+dot(x+160,576,7)
    b+=gl(60,590,1010,70,35)
    for i,f in enumerate([.3,.55,.85]): b+=f'<rect x="{60+i*336+6}" y="596" width="{324}" height="58" rx="29" fill="#C9B3FF" fill-opacity="{f*.5}"/>'
    b+=lag(1110,625,14)+T(1130,676,"Every payment lands on the order",'l',15.5,'end')+T(60,700,"Charges, insurance payments, adjustments and payments, on one running account.",'s',15.5)
    return b+foot("Patients pay before they arrive, from their phone, with no login.")
def v1_greeter():
    b=head2("GRAVITY GREETER","Check-in at a lobby tablet,","not a line at the desk.",40)
    b+=f'<g filter="url(#sh)"><rect x="150" y="210" width="900" height="440" rx="46" fill="#0F0A1E" stroke="#FFF" stroke-opacity=".4" stroke-width="2"/></g><rect x="176" y="236" width="848" height="388" rx="26" fill="#FFF"/>'
    b+=tx(212,288,"Scan your driver’s license",'p-dh',28)+f'<rect x="212" y="312" width="360" height="226" rx="16" fill="#F3EEFE" stroke="#6B3FE4" stroke-width="2" stroke-dasharray="7 7"/>'+ic('scan',348,370,3.0,"#6B3FE4",1.6)+tx(392,516,"Barcode on the back",'p-t3',14,'middle')+tx(212,578,"Or type a name and date of birth",'p-pl',15)
    b+=f'<path d="M594 425 H640" stroke="#6B3FE4" stroke-width="2.6"/><path d="M628 416 L642 425 L628 434" fill="none" stroke="#6B3FE4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
    b+=f'<rect x="660" y="312" width="330" height="140" rx="14" fill="#F8F8FA" stroke="#E5E7EB"/>'+tx(682,346,"Today’s appointment",'p-t3',14)+tx(682,382,"MRI knee",'p-dh',26)+chip(682,396,"Found",'ok',28,14)+f'<rect x="660" y="472" width="330" height="62" rx="14" fill="#6B3FE4"/>'+tx(825,512,"Check in",'p-wh',22,'middle')
    for i,t in enumerate(["Set up per location","Runs on an iPad","Staff settings behind a passcode"]): b+=pill(60+[0,214,404][i],690,t,[196,168,268][i],False,15)
    b+=lag(1110,704,12)+T(1090,709,"Checked in, on the order",'d',20,'end')
    return b+foot("The same check-in steps as the patient portal, in the lobby or on the phone.")
def v1_trust():
    b=head2("GRAVITY TRUST","Controls who can get in, what they can do,","and records what was done.",36)
    rows=[("Who can get in","Single sign-on, with the work account they already have"),("What they can do","Groups decide the screens and actions each person has"),("What was done","Who changed which field, when, and from what to what")]
    ys=[214,408,602]; b+=f'<path d="M92 {ys[0]+95} V{ys[2]+95}" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/>'
    for i,((q,s_),y) in enumerate(zip(rows,ys)):
        b+=gl(60,y,1080,178,24)+(lag(92,y+89,12) if i==2 else dot(92,y+89,8))+T(130,y+84,q,'d',30)+wr(130,y+114,s_,30,'s',15.5)
    y=ys[0]; b+=tl(560,y+54,'users',64)+T(592,y+144,"Work account",'lb',15,'middle')+ar(640,740,y+86)+tl(760,y+54,'lock',64)+T(792,y+144,"Gravity",'lb',15,'middle')+T(870,y+78,"Login security and",'s',15)+T(870,y+98,"password policy stay",'s',15)+T(870,y+118,"with the center’s IT team.",'s',15)
    y=ys[1]; b+=eb(560,y+40,"SCREENS AND ACTIONS")
    for r_,(g,pat) in enumerate([("User",[1,1,0,0,0]),("Admin",[1,1,1,1,1]),("Job-specific",[1,0,1,0,1])]):
        yy=y+66+r_*38; b+=T(560,yy+6,g,'lb',16)
        for c in range(5): b+=(f'<circle cx="{720+c*52}" cy="{yy}" r="9" fill="#C9B3FF"/>' if pat[c] else f'<circle cx="{720+c*52}" cy="{yy}" r="9" fill="none" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="2"/>')
    y=ys[2]
    for k,t in enumerate(["Appointment status","Prior auth status","Outreach sent"]):
        yy=y+26+k*44; b+=f'<rect x="560" y="{yy}" width="540" height="36" rx="10" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".2"/>'+T(576,yy+24,t,'lb',15)+f'<rect x="780" y="{yy+14}" width="70" height="8" rx="4" fill="#FFF" fill-opacity=".3"/>'+T(868,yy+24,"→",'l',15)+f'<rect x="896" y="{yy+14}" width="70" height="8" rx="4" fill="#C9B3FF" fill-opacity=".7"/>'+f'<rect x="990" y="{yy+14}" width="90" height="8" rx="4" fill="#FFF" fill-opacity=".2"/>'
    return b+foot("Ready when an auditor asks.")

# ================= V2 close-ups with callouts =================
def v2(slug,eyebrow,l1,l2,fs,wf,cx,marks,caps,foot_t,aria):
    b=head2(eyebrow,l1,l2,fs); k=1080/800
    b+=f'<clipPath id="cc"><rect x="60" y="188" width="1080" height="338" rx="18"/></clipPath><g clip-path="url(#cc)"><g transform="translate(60 188) scale({k}) translate({-cx} -46)">{wf()}</g></g><rect x="60" y="188" width="1080" height="338" rx="18" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.5"/>'
    for n,(wx,wy) in enumerate(marks,1):
        x=60+(wx-cx)*k; y=188+(wy-46)*k
        b+=f'<circle cx="{x}" cy="{y}" r="17" fill="#6B3FE4" stroke="#fff" stroke-width="3"/>'+T(x,y+6,str(n),'lb',17,'middle')
    b+=f'<path d="M90 596 H1110" stroke="#C9B3FF" stroke-opacity=".5" stroke-width="1.6"/>'
    for i,(t,s_) in enumerate(caps):
        x=90+i*370; b+=dot(x,596,8)+f'<circle cx="{x+34}" cy="656" r="15" fill="#6B3FE4"/>'+T(x+34,662,str(i+1),'lb',15,'middle')+T(x+60,664,t,'d',22)+wr(x,704,s_,40,'s',15.5)
    b+=foot(foot_t); emit(f'{slug}-v2-product-closeup',b,aria)
def one(slug,name,body,aria): emit(f'{slug}-v1-{name}',body,aria)
if __name__=='__main__':
    one("gravity-doc","sources-to-order",v1_doc(),"Gravity Doc: fax, email, upload and portal documents are read, sorted and filed, matched on patient, referring provider and exam, and become an order; anything that doesn't match goes to a person.")
    one("gravity-booking","schedule-and-rules",v1_booking(),"Gravity Booking: a schedule grid across devices shows open, closed, too-early and booked slots; every rule is checked on every booking, and several exams are booked into one visit.")
    one("gravity-work","arrivals-to-right-person",v1_work(),"Gravity Work: calls, texts, emails, documents and orders land on worklists and are assigned on their own to the right person by round-robin, weight or capacity; agents' unfinished work arrives with history attached.")
    one("gravity-priorauth","authorization-lanes",v1_pa(),"Gravity PriorAuth: each exam moves along four steps, rule, submitted, status checked, recorded on the order; pending and denied cases go to a person.")
    one("gravity-visit","three-screens-one-visit",v1_visit(),"Gravity Visit: on the patient's phone they book, fill in forms, then check in and pay, and every answer and signed form lands on the order.")
    one("gravity-grow","record-and-rail",v1_grow(),"Gravity Grow: a referring provider's record with NPI check, orders sent and practice location, built in four steps.")
    one("gravity-referral","round-trip",v1_referral(),"Gravity Referral: the referring office uploads the order, is told what it needs, watches it move, and gets the report and images back the minute the read is signed.")
    one("gravity-estimate","benefit-funnel",v1_estimate(),"Gravity Estimate: coverage is checked, AI picks one benefit line from many, the estimate is built and sent by text so it is known before the patient arrives.")
    one("gravity-pay","three-moments-one-account",v1_pay(),"Gravity Pay: the estimate sets the amount, collected at booking, before the visit or on the day, all on one running account per patient.")
    one("gravity-greeter","lobby-tablet",v1_greeter(),"Gravity Greeter: a lobby tablet where the patient scans a license, the appointment comes up and they check in.")
    one("gravity-trust","three-questions",v1_trust(),"Gravity Trust: who can get in, what they can do and what was done, answered by single sign-on, groups and an audit timeline.")
    v2("gravity-doc","GRAVITY DOC","Gravity reads the fax, finds or creates","the patient, and creates the order.",35,w_doc,260,[(470,249),(1040,127),(1048,66)],
       [("Only when it doesn’t match","Anything uncertain goes to a person"),("Matched","Patient, referring provider and exam"),("Created","When all three match, with nothing typed")],"Documents are read, sorted and filed on the right record.","Gravity Doc worklist and order, zoomed.")
    v2("gravity-booking","GRAVITY BOOKING","Booked right the first time,","with every rule checked.",40,w_booking,280,[(340,158),(632,158),(1050,263)],
       [("Too early, greyed out","Slots earlier than the authorization allows"),("Booked in the right slot","On the right device, the first time"),("Every rule checked","Device, exam length, limits, gaps, lead time")],"Only valid slots are offered.","Gravity Booking schedule and rules, zoomed.")
    v2("gravity-work","GRAVITY WORK","Every task in front of","the right person.",40,w_work,240,[(494,254),(640,116),(1020,163)],
       [("From an agent","What it can’t finish lands here, history attached"),("Assigned on its own","The moment the work arrives"),("By capacity","Or round-robin, or by weight")],"Nobody hunts for the next task.","Gravity Work worklist and assignment, zoomed.")
    v2("gravity-priorauth","GRAVITY PRIORAUTH","Every exam that needs a prior","authorization has one.",38,w_pa,20,[(300,146),(748,146),(736,260)],
       [("The rule says it’s needed","Checked on its own once coverage is verified"),("Status on the order","Number, dates and status, for every exam"),("Denied goes to a person","Pending cases too, with what is needed")],"Every authorization, and its status, in one place.","Gravity PriorAuth workspace, zoomed.")
    v2("gravity-visit","GRAVITY VISIT","Checked in and paid","before they arrive.",40,w_visit,260,[(484,90),(668,126),(960,76)],
       [("Forms filled in once","Consents, screening questions, ID and insurance card"),("Check in and pay","From one text link, with no login"),("On the order","Every answer and signed form")],"Nothing to download and no password.","Gravity Visit on the patient's phone, zoomed.")
    v2("gravity-grow","GRAVITY GROW","Every referring provider, and","everything they’ve sent you.",38,w_grow,260,[(751,123),(1030,130),(944,248)],
       [("Where each order stands","Status, date and service on the provider’s record"),("Practice and location","The organization at each address"),("Contact preferences","Per provider, whether they may be contacted")],"An NPI-checked record of every referring provider.","Gravity Grow referrer record, zoomed.")
    v2("gravity-referral","GRAVITY REFERRAL","Upload the order and","it’s a digital order.",40,w_referral,20,[(290,117),(808,76),(808,196)],
       [("Live order status","Received, authorized, booked, completed"),("Told what it needs","Clinical notes or an authorization, with what and why"),("Report and images","The minute the read is signed")],"Watch every order move without calling the center.","Gravity Referral portal, zoomed.")
    v2("gravity-estimate","GRAVITY ESTIMATE","Coverage verified before the patient arrives,","without calling the payer.",34,w_estimate,260,[(404,123),(748,247),(908,220)],
       [("AI picks the benefit line","The one that fits the exam and network"),("The patient’s share","Built from the benefits and your fee schedule"),("Sent by text","A link to benefits and estimated cost, no login")],"Known before the patient arrives.","Gravity Estimate benefits and estimate, zoomed.")
    v2("gravity-pay","GRAVITY PAY","The patient’s share, collected","at booking or at the visit.",38,w_pay,280,[(472,84),(626,84),(1038,84)],
       [("At booking","From the same screen as the estimate"),("Before the visit or on the day","From the patient’s phone, or at the front desk"),("One account per patient","Every payment lands on the order")],"Card payments go straight onto the order.","Gravity Pay moments and account, zoomed.")
    v2("gravity-greeter","GRAVITY GREETER","Check-in at a lobby tablet,","not a line at the desk.",40,w_greeter,230,[(472,122),(618,191),(990,112)],
       [("Scan the license","Or type a name and date of birth"),("The appointment comes up","Found in Gravity"),("Checked in, on the order","With what the patient signed")],"One tablet per location, in the lobby.","Gravity Greeter tablet, zoomed.")
    v2("gravity-trust","GRAVITY TRUST","Controls who can get in, what they can do,","and records what was done.",36,w_trust,20,[(200,84),(630,118),(800,164)],
       [("Choose what to show","Appointments, coverage, prior auth, documents, outreach"),("Every change, in order","On one timeline for the order"),("From and to","Who changed which field, and when")],"Ready when an auditor asks.","Gravity Trust order timeline, zoomed.")
    print('ok')
