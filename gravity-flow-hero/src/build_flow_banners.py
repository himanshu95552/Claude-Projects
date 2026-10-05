# Two 4:3 Gravity Flow banners (A: real screens in brand, B: numbered diagram with the real screens embedded).
import sys; sys.path.insert(0,'src')
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
import screens as S
CSSX=CSS+S.SCREEN_CSS
def out(name,svg,title):
    open(f'flow-banners/{name}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>{CSSX}</style></head><body><div id="frame">{svg}</div></body></html>')
def g(x,y,s,body): return f'<g transform="translate({x} {y}) scale({s})">{body}</g>'
# ================= A: real screens only =================
svgA=f'<svg viewBox="0 0 1600 1200" style="left:0;top:0;width:1600px" role="img" aria-label="Gravity Flow in the product: the workflow canvas, with documented settings on each step, and the Flows list with Install, Installed and Update available.">{DEFS}{S.SCREEN_DEFS}'
svgA+=g(50,64,1,S.canvas_window(1060,560))
svgA+=g(430,520,1,S.flows_window(1120,640))
svgA+='</svg>'
out('banner-flow-A-real-screens',svgA,'Gravity Flow banner A: real screens')
# ================= B: diagram + real screens =================
b=head("GRAVITY FLOW · ONE RUN, END TO END","The routine work, done on its own.")
b+=T(60,160,"01 · HOW IT ARRIVES",'m',12)
Y=170;H=88
for x in (60,430,800): b+=glass(x,Y,340,H)
b+=T(82,Y+28,"Flow Marketplace",'lb',16)+pill(82,Y+38,"Install",62,True,12)+pill(152,Y+38,"Installed",82,False,12)+f'<g><rect x="242" y="{Y+38}" width="118" height="28" rx="14" fill="none" stroke="#C9B3FF" stroke-width="1.5"/>{T(301,Y+57,"Update available","lb",12,"middle")}</g>'
b+=T(452,Y+28,"Automation rules",'lb',16)
for i,(tg,w_) in enumerate([("WHEN",62),("IF",44),("THEN",62)]):
    x=452+[0,84,152][i]; b+=f'<rect x="{x}" y="{Y+38}" width="{w_}" height="28" rx="8" fill="#6B3FE4" fill-opacity="{1 if i==2 else .22}" stroke="#C9B3FF" stroke-opacity=".5"/>'+T(x+w_/2,Y+57,tg,'m',10.5,'middle','style="fill:#fff;letter-spacing:.1em"')
b+=T(452,Y+82,"Set once. The system does the rest.",'s',13)
b+=T(822,Y+28,"Built for you",'lb',16)+T(822,Y+52,"Alpha Nodus builds and maintains it,",'s',13.5)+T(822,Y+70,"on the same engine.",'s',13.5)
LY0=274;LH=170
b+=glass(60,LY0,1080,LH,22,.09,.3)
for x in (230,600,970): b+=f'<path d="M{x} {Y+H} V{LY0}" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="1.6"/><circle cx="{x}" cy="{LY0}" r="4" fill="#C9B3FF"/>'
b+=T(84,304,"02 · START",'m',12)+T(84,326,"Any event, or a schedule",'lb',14)
for i,t in enumerate(["Order created","Report signed","Appointment booked","Visit missed"]):
    xx=84+(i%2)*92; 
for i,t in enumerate(["Order created","Report signed"]): b+=f'<rect x="84" y="{338+i*34}" width="180" height="28" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".22"/><circle cx="100" cy="{352+i*34}" r="4" fill="#C9B3FF"/>'+T(114,{0:357,1:391}[i],t,'l',13.5)
b+=T(84,422,"Appointment booked · Visit missed",'s',12.5)
GX=300
b+=T(GX,304,"03 · LIMITS",'m',12)+f'<rect x="{GX+14}" y="332" width="3" height="60" rx="1.5" fill="#C9B3FF"/><rect x="{GX+54}" y="332" width="3" height="60" rx="1.5" fill="#C9B3FF"/><circle cx="{GX+36}" cy="362" r="4.5" fill="#C9B3FF"/>'
b+=f'<path d="M264 362 H{GX+14}" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'
b+=T(GX+80,392,"Contact caps per day and visit",'l',12.5)+T(GX+80,410,"Do-not-contact",'l',12.5)+T(GX+80,428,"Business hours",'l',12.5)
b+=T(620,304,"04 · MODE",'m',12)
pa="M371 362 H 560 C 590 362 590 336 620 336 H 900 C 950 336 950 362 1000 362"
pg="M371 362 H 560 C 590 362 590 400 620 400 H 900 C 950 400 950 362 1000 362"
b+=conn(pa)+conn(pg)+node(700,336,'auto',8)+T(620,324,"Automated: a rule, same result every time",'l',12.5)
b+=f'<circle cx="700" cy="400" r="14" fill="#1B1430" stroke="#C9B3FF" stroke-width="2"/><circle cx="700" cy="400" r="4" fill="#C9B3FF"/>'+T(620,430,"Agentic: reads, decides and acts",'l',12.5)
b+=f'<circle cx="1030" cy="362" r="36" fill="url(#ow)"/><circle cx="1030" cy="362" r="22" fill="#67E3EE" fill-opacity=".14" stroke="#67E3EE" stroke-opacity=".5" stroke-width="2"/><circle cx="1030" cy="362" r="12" fill="#67E3EE"/>'+T(1030,318,"Done on its own",'d',17,'middle')
b+=conn("M700 414 V 425 H 830")+glass(830,410,300,30,12)+f'<circle cx="850" cy="425" r="5" fill="#F59E0B"/>'+T(864,429,"05 · Exceptions go to your team, history attached",'l',11.5)
b+=glass(60,456,1080,46,14)+T(84,484,"06 · EVERY RUN ON RECORD",'m',11)
for i,(tm,tx_,col) in enumerate([("09:02","Reminder · Text · Delivered","#10B981"),("09:02","Report back · Fax · Delivered","#10B981"),("09:03","Earlier slot · Declined at limit","#F59E0B")]):
    x=330+i*270; b+=T(x,484,tm,'m',11,'start','style="letter-spacing:0"')+f'<circle cx="{x+48}" cy="480" r="4" fill="{col}"/>'+T(x+60,485,tx_,'l',12.5)
b+=T(60,528,"07 · WHAT YOU CAN SEE",'m',12)+T(1140,528,"The real workflow canvas and the Flows list, in the product",'s',13,'end')
b+=g(60,540,0.5,S.canvas_window(1060,640))
b+=g(610,540,0.45,S.flows_window(1180,700))
svgB=f'<svg viewBox="0 0 1200 900" role="img" aria-label="Gravity Flow end to end, with the real workflow canvas and the Flows list shown in the product." >{DEFS}{S.SCREEN_DEFS}<rect x="24" y="24" width="1152" height="852" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="24" y="24" width="1152" height="852" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{b}</svg>'
out('banner-flow-B-diagram-with-screens',svgB,'Gravity Flow banner B: diagram with screens')
print('ok')
