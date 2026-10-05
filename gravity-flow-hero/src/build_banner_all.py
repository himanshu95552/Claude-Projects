# One banner carrying all seven points of the Flow summary. Reuses the helper vocabulary from build_banners.py.
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
def ring(x,y,r=26): return f'<circle cx="{x}" cy="{y}" r="{r+22}" fill="url(#cw)"/><circle cx="{x}" cy="{y}" r="{r}" fill="#1B1430" stroke="#C9B3FF" stroke-width="2" stroke-opacity=".85"/><circle cx="{x}" cy="{y}" r="{r-13}" fill="none" stroke="#C9B3FF" stroke-opacity=".4" stroke-width="1.5"/><circle cx="{x}" cy="{y}" r="5" fill="#C9B3FF"/>'
def minipill(x,y,w,t,size=14):
    return f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".22" stroke-width="1.2"/><circle cx="{x+16}" cy="{y+15}" r="4" fill="#C9B3FF"/>'+T(x+30,y+20,t,'l',size)
b=head("GRAVITY FLOW · ONE RUN, END TO END","The routine work, done on its own.")
# ---- 01 how it arrives
b+=T(60,160,"01 · HOW IT ARRIVES",'m',12)
Y=172;H=128
xs=[60,430,800]
for x in xs: b+=glass(x,Y,340,H)
# marketplace
b+=T(82,Y+34,"Flow Marketplace",'lb',18)
b+=pill(82,Y+48,"Install",66,True,13)
b+=f'<g><rect x="156" y="{Y+48}" width="96" height="28" rx="14" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".25" stroke-width="1.2"/>{icon("check",166,Y+54,.7,"#C9B3FF",1.8)}{T(188,Y+67,"Installed","lb",13)}</g>'
b+=f'<g><rect x="260" y="{Y+48}" width="136" height="28" rx="14" fill="none" stroke="#C9B3FF" stroke-width="1.5"/>{T(328,Y+67,"Update available","lb",13,"middle")}</g>'
b+=T(82,Y+100,"Thousands of ready-made workflows,",'s',13.5)+T(82,Y+118,"installed in one step, running the same day.",'s',13.5)
# rules
b+=T(452,Y+34,"Automation rules",'lb',18)
for i,(tg,w_) in enumerate([("WHEN",66),("IF",46),("THEN",66)]):
    x=452+[0,92,170][i]
    b+=f'<rect x="{x}" y="{Y+48}" width="{w_}" height="28" rx="8" fill="#6B3FE4" fill-opacity="{1 if i==2 else .22}" stroke="#C9B3FF" stroke-opacity=".5" stroke-width="1.2"/>'+T(x+w_/2,Y+67,tg,'m',11,'middle','style="fill:#fff;letter-spacing:.1em"')
    if i<2: b+=f'<path d="M{x+w_} {Y+62} H{x+[92,170][i]-0 if i==0 else x+24}" stroke="#fff" stroke-opacity=".4"/>'
b+=T(452,Y+100,"Set once: a trigger, conditions on orders",'s',13.5)+T(452,Y+118,"or documents, and an action.",'s',13.5)
# custom
b+=T(822,Y+34,"Built for you",'lb',18)
for i,ic in enumerate(['trigger','config','http','send']):
    x=822+i*58; b+=tile(x,Y+46,34,ic,.75)
    if i<3: b+=f'<path d="M{x+34} {Y+63} H{x+58}" stroke="#fff" stroke-opacity=".4"/>'
b+=T(822,Y+100,"Alpha Nodus builds and maintains it,",'s',13.5)+T(822,Y+118,"on the same engine.",'s',13.5)
# ---- engine band
LY0=316;LH=280
b+=glass(60,LY0,1080,LH,24,.09,.3)
for x in (230,600,970): b+=f'<path d="M{x} {Y+H} V{LY0}" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/><circle cx="{x}" cy="{LY0}" r="4.5" fill="#C9B3FF"/>'
# 02 start
b+=T(84,348,"02 · START",'m',12)+T(84,374,"Any event, or a schedule",'lb',15)
for i,t in enumerate(["Order created","Report signed","Appointment booked","Visit missed"]): b+=minipill(84,392+i*40,190,t,14)
# 03 limits
GX=330
b+=T(GX,348,"03 · LIMITS",'m',12)
b+=f'<rect x="{GX+22}" y="396" width="3" height="72" rx="1.5" fill="#C9B3FF"/><rect x="{GX+72}" y="396" width="3" height="72" rx="1.5" fill="#C9B3FF"/><circle cx="{GX+48}" cy="432" r="5" fill="#C9B3FF"/>'
b+=T(GX,496,"Checked before anything goes out",'s',13.5)
for i,t in enumerate(["Contact caps per day and visit","Do-not-contact","Business hours"]): b+=f'<circle cx="{GX+5}" cy="{517+i*20}" r="3" fill="#C9B3FF"/>'+T(GX+16,522+i*20,t,'l',13.5)
b+=f'<path d="M274 432 H{GX+22}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'
# 04 mode
b+=T(570,348,"04 · MODE",'m',12)
pa="M410 432 C 480 432 480 404 540 404 H 940 C 985 404 985 432 1030 432"
pg="M410 432 C 480 432 480 500 540 500 H 940 C 985 500 985 432 1030 432"
b+=f'<path d="M{GX+75} 432 H410" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'+conn(pa)+conn(pg)
b+=node(650,404,'auto',9)+T(570,384,"Automated: a rule, same result every time",'l',13.5)
b+=ring(650,500,24)+T(570,462,"Agentic: reads, decides and acts",'l',13.5)
# done (Lagoon once)
b+=f'<circle cx="1040" cy="432" r="46" fill="url(#ow)"/><circle cx="1040" cy="432" r="28" fill="#67E3EE" fill-opacity=".14" stroke="#67E3EE" stroke-opacity=".5" stroke-width="2"/><circle cx="1040" cy="432" r="16" fill="#67E3EE"/>'
b+=T(1040,372,"Done on its own",'d',20,'middle')
# 05 exceptions
b+=conn("M650 526 V 545 H 860")
b+=glass(860,504,260,82,16)+T(878,527,"05 · EXCEPTIONS",'m',11)+f'<circle cx="884" cy="552" r="5" fill="#F59E0B"/>'+T(898,556,"Goes to your team, with the",'l',13.5)+T(898,573,"history attached",'l',13.5)
# 06 record
b+=glass(60,608,1080,64,16)+T(84,636,"06 · EVERY RUN ON RECORD",'m',11.5)+T(1116,636,"WHO, WHEN, DELIVERED OR NOT",'m',10.5,'end')
for i,(tm,tx,col) in enumerate([("09:02","Reminder · Text · Delivered","#10B981"),("09:02","Report back · Fax · Delivered","#10B981"),("09:03","Earlier slot · Declined at limit","#F59E0B")]):
    x=84+i*340
    b+=T(x,662,tm,'m',11.5,'start','style="letter-spacing:0"')+f'<circle cx="{x+56}" cy="658" r="4.5" fill="{col}"/>'+T(x+68,663,tx,'l',14)
# 07 what you can see
b+=glass(60,688,590,172)+T(84,716,"07 · WHAT YOU CAN SEE",'m',12)+T(84,738,"A node graph your team can read, every step documented.",'s',13.5)
nodes=[('trigger','Trigger'),('config','Config'),('http','Fetch'),('filter','Filter'),('hours','Hours'),(None,'Agent'),('send','Send')]
for i,(ic,lb) in enumerate(nodes):
    x=84+i*58
    if ic: b+=tile(x,756,40,ic,.85)
    else: b+=f'<circle cx="{x+20}" cy="776" r="20" fill="#1B1430" stroke="#C9B3FF" stroke-width="1.8" stroke-opacity=".85"/><circle cx="{x+20}" cy="776" r="4.5" fill="#C9B3FF"/>'
    b+=T(x+20,822,lb,'s',12,'middle')
    if i<6: b+=f'<path d="M{x+40} 776 H{x+58}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>'
b+=f'<rect x="490" y="752" width="150" height="86" rx="10" fill="#C9B3FF" fill-opacity=".12" stroke="#C9B3FF" stroke-opacity=".4" stroke-width="1.2"/>'+T(502,772,"Configuration",'lb',12.5)
for i,t in enumerate(["tenant, service category","buffer days, tags","status, outreach intent"]): b+=T(502,792+i*15,t,'s',11.5)
b+=glass(670,688,470,172)+T(694,716,"THE FLOWS LIST",'m',12)
for i,(n_,st) in enumerate([("Booking outreach","i"),("Eligibility checks","d"),("Auto estimate","u")]):
    y=730+i*40
    b+=f'<rect x="686" y="{y}" width="438" height="34" rx="10" fill="#FFF" fill-opacity=".06"/>'+T(702,y+23,n_,'l',15)
    if st=="i": b+=pill(1010,y+3,"Install",66,True,12.5)
    elif st=="d": b+=f'<g>{icon("check",996,y+7,.75,"#C9B3FF",1.8)}{T(1018,y+23,"Installed","s",13)}</g>'
    else: b+=f'<g><rect x="950" y="{y+3}" width="126" height="28" rx="14" fill="none" stroke="#C9B3FF" stroke-width="1.5"/>{T(1013,y+22,"Update available","lb",12.5,"middle")}</g>'
    b+=f'<path d="M1100 {y+17} m-8 0 a8 5 0 1 0 16 0 a8 5 0 1 0 -16 0 M1100 {y+17} m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0" fill="none" stroke="#C9B3FF" stroke-width="1.4"/>'
page("Gravity Flow banner: the full picture",b,"Gravity Flow end to end. 01 A workflow arrives from the Flow Marketplace, from a rule you set once, or built by Alpha Nodus on the same engine. 02 An event or a schedule starts it. 03 Limits are checked before anything goes out. 04 It runs automated, as a rule, or agentic, where an agent reads, decides and acts. 05 What it cannot finish goes to your team with the history attached. 06 Every run is on record. 07 Workflows are readable node graphs with documented settings, and the flows list shows what is installed and what has updates.","banner-all-in-one")
print('ok')
