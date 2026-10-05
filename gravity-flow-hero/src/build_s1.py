# Section 1: /no-referral-leaks  (Gravity Get the Order). 16:9 on ink.
import math
src=open('src/build_banners.py').read()
exec(src.split('# ============ Banner 1')[0])
IC['report']="M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M8.5 14.5l2.2 2.2 4.3-4.6"
IC['order']="M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M12 11v6M9 14h6"
IC['doc']="M6 2.5h8l4.5 4.5v12.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM14 2.5V7h4.5M8 12h8M8 15.5h8M8 19h5"
CSS169=CSS.replace('height:1200px','height:900px').replace('svg{position:absolute;left:48px;top:36px;width:1504px;display:block}','svg{position:absolute;left:0;top:0;width:1600px;display:block}').replace('#frame{width:1600px','#frame{width:1600px').replace('url(../fonts','url(../../fonts')
def page169(name,body,aria,title):
    svg=f'<svg viewBox="0 0 1600 900" role="img" aria-label="{html.escape(aria)}">{DEFS}<rect x="30" y="30" width="1540" height="840" rx="36" fill="#1B1430" fill-opacity="0.55"/><rect x="30" y="30" width="1540" height="840" rx="36" fill="url(#gw)" stroke="#FFF" stroke-opacity="0.22" stroke-width="1.5"/>{body}</svg>'
    open(f'sections/01-get-the-order/{name}.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(title)}</title><style>{CSS169}</style></head><body><div id="frame">{svg}</div></body></html>')
def bez(p0,p1,p2,p3,t): return tuple((1-t)**3*p0[i]+3*(1-t)**2*t*p1[i]+3*(1-t)*t**2*p2[i]+t**3*p3[i] for i in (0,1))
def src_node(x,y,r=22): return f'<circle cx="{x}" cy="{y}" r="{r+34}" fill="url(#nw)"/><circle cx="{x}" cy="{y}" r="{r+9}" fill="#C9B3FF" fill-opacity=".14" stroke="#C9B3FF" stroke-opacity=".45" stroke-width="2"/><circle cx="{x}" cy="{y}" r="{r}" fill="#C9B3FF"/>'
def target(x,y,r=40,arc=None,lag=False):
    c="#67E3EE" if lag else "#C9B3FF"
    s=f'<circle cx="{x}" cy="{y}" r="{r+130}" fill="url(#{"ow" if lag else "cw"})"/><circle cx="{x}" cy="{y}" r="{r+60}" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="1.5"/><circle cx="{x}" cy="{y}" r="{r+30}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.5"/>'
    if lag: s+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#67E3EE" fill-opacity=".16" stroke="#67E3EE" stroke-width="2.5"/><circle cx="{x}" cy="{y}" r="{r-20}" fill="#67E3EE"/>'
    else: s+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#1B1430" stroke="#C9B3FF" stroke-width="2.5" stroke-opacity=".9"/><circle cx="{x}" cy="{y}" r="{r-14}" fill="none" stroke="#C9B3FF" stroke-opacity=".28" stroke-width="1.5"/>'
    if arc is not None:
        L=2*math.pi*(r+16); s+=f'<circle cx="{x}" cy="{y}" r="{r+16}" fill="none" stroke="#C9B3FF" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="{L*arc:.1f} {L:.1f}" transform="rotate(-90 {x} {y})"/><circle cx="{x}" cy="{y}" r="{r+16}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/>'
    return s
def hair(d,w=3.5,col="#C9B3FF",cut=None):
    pl=f' pathLength="100" stroke-dasharray="{cut} 100"' if cut else ''
    return f'{conn(d)}<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"{pl}/><path d="{d}" fill="none" stroke="{col}" stroke-opacity=".22" stroke-width="12" stroke-linecap="round"{pl}/>'
def drops(x,y):
    return ''.join(f'<circle cx="{x+dx}" cy="{y+dy}" r="{r}" fill="#C9B3FF" fill-opacity="{o}"/>' for dx,dy,r,o in [(6,26,4,.7),(10,52,3.2,.5),(8,80,2.5,.32),(12,108,1.8,.18)])
ARIA_BASE="Referral leakage: "
# ---------- HERO V1: the gap ----------
b=src_node(300,450)+target(1300,450)
b+=hair("M322 450 H 940")+f'<circle cx="940" cy="450" r="6.5" fill="#C9B3FF"/>'
b+=f'<path d="M958 450 H 1258" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 12"/>'+drops(944,466)
page169("hero-v1-the-gap",b,ARIA_BASE+"a line leaves the referral node and stops short of the order node.","Hero V1")
# ---------- HERO V2: three ways an order leaks ----------
b=target(1330,450,42)
lanes=[300,450,600]
for y in lanes: b+=src_node(250,y,12).replace('r+34','r+34')
# lane 1: goes elsewhere
d1="M266 300 H 640 C 760 300 800 210 920 170"
b+=hair(d1,3)+f'<circle cx="968" cy="156" r="34" fill="none" stroke="#C9B3FF" stroke-opacity=".55" stroke-width="2" stroke-dasharray="3 6"/><circle cx="968" cy="156" r="70" fill="url(#nw)" opacity=".4"/>'
# lane 2: the fax that never becomes an order
b+=hair("M266 450 H 760",3)+f'<rect x="760" y="414" width="72" height="72" rx="16" fill="#FFF" fill-opacity=".1" stroke="#C9B3FF" stroke-opacity=".7" stroke-width="2"/>'+icon('doc',778,432,1.5,"#C9B3FF",1.6)
b+=f'<path d="M846 450 H 1280" stroke="#fff" stroke-opacity=".2" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 12"/>'
# lane 3: the referrer who quietly stops sending
x=266
for i,L_ in enumerate([150,110,78,52,32,18,9]):
    b+=f'<path d="M{x} 600 H{x+L_}" stroke="#C9B3FF" stroke-opacity="{max(.15,.95-i*.12):.2f}" stroke-width="{max(1.6,3.5-i*.3):.1f}" stroke-linecap="round"/>'; x+=L_+20+i*10
b+=f'<path d="M{x} 600 H 1280" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 14"/>'
page169("hero-v2-three-ways",b,ARIA_BASE+"three lines head for the order node. One veers off to another center, one stops at a fax that never becomes an order, one fades out as the referrer stops sending.","Hero V2")
# ---------- HERO V3: the funnel ----------
b=''
ys=[190+i*74 for i in range(8)]
fail={0:.50,3:.64,6:.40}
for i,y in enumerate(ys):
    d=f"M262 {y} C 560 {y} 700 450 940 450"
    if i in fail:
        cut=fail[i]*100*0.78
        t=cut/100*0.0+fail[i]*0.78  # fraction along the curve (approx. by parameter)
        pt=bez((262,y),(560,y),(700,450),(940,450),fail[i]*0.78+0.05)
        b+=conn(d).replace('stroke-opacity','stroke-opacity')+f'<path d="{d}" pathLength="100" fill="none" stroke="#C9B3FF" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="{fail[i]*78+5:.1f} 100"/><circle cx="{pt[0]:.1f}" cy="{pt[1]:.1f}" r="5" fill="#C9B3FF"/>'
    else:
        b+=conn(d)+f'<path d="{d}" fill="none" stroke="#C9B3FF" stroke-width="2.4" stroke-linecap="round"/>'
    b+=f'<circle cx="262" cy="{y}" r="9" fill="#C9B3FF"/><circle cx="262" cy="{y}" r="22" fill="url(#nw)"/>'
b+=hair("M940 450 H 1250",4)+target(1310,450,44,0.62)
page169("hero-v3-the-funnel",b,ARIA_BASE+"eight referral lines head for one order node. Five arrive and three stop short, so the ring around the order node is only partly lit.","Hero V3")
# ---------- HERO V4: before / after (two micro labels, flagged) ----------
b=T(120,236,"WITHOUT GRAVITY",'m',14)+T(120,566,"WITH GRAVITY",'m',14)
b+=src_node(250,300,16)+target(1330,300,34)+hair("M272 300 H 900",3.2)+f'<circle cx="900" cy="300" r="6" fill="#C9B3FF"/>'+f'<path d="M918 300 H 1292" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 12"/>'+drops(904,314)
b+=f'<line x1="120" y1="450" x2="1480" y2="450" stroke="#fff" stroke-opacity=".12"/>'
b+=src_node(250,640,16)+hair("M272 640 H 1290",3.2)
b+=f'<circle cx="760" cy="640" r="92" fill="url(#cw)"/><circle cx="760" cy="640" r="40" fill="#1B1430" stroke="#C9B3FF" stroke-width="2.2" stroke-opacity=".85"/><circle cx="760" cy="640" r="26" fill="none" stroke="#C9B3FF" stroke-opacity=".4" stroke-width="1.5"/><circle cx="760" cy="640" r="7" fill="#C9B3FF"/>'
b+=target(1330,640,34,None,True)
page169("hero-v4-before-after",b,ARIA_BASE+"above, without Gravity, the line stops short of the order node. Below, with Gravity, the line runs through Gravity and reaches the order.","Hero V4")
# ---------- POSTERS ----------
def play(x,y,r=64): return f'<circle cx="{x}" cy="{y}" r="{r+60}" fill="url(#cw)"/><circle cx="{x}" cy="{y}" r="{r+16}" fill="#C9B3FF" fill-opacity=".12" stroke="#C9B3FF" stroke-opacity=".45" stroke-width="2"/><circle cx="{x}" cy="{y}" r="{r}" fill="#C9B3FF"/><path d="M{x-r*.28} {y-r*.42} L{x+r*.5} {y} L{x-r*.28} {y+r*.42} Z" fill="#1B1430"/>'
# P1 title + hairline ending in the play node
b=T(150,250,"WATCH · 2 TO 3 MINUTES",'m',18)+T(150,380,"Get the order,",'d',104)+T(150,490,"in two minutes.",'d',104)
b+=hair("M150 720 H 1300",3)+play(1380,720,64)
b+=T(150,672,"NO REFERRAL LEAKS",'m',16)
page169("poster-p1-title-and-node",b,"Video poster: Get the order, in two minutes. A play button ends a hairline.","Poster P1")
# P2 frame from the video: fax -> order -> report back
def fax(x,y):
    s=f'<g transform="rotate(-4 {x+110} {y+130})"><rect x="{x}" y="{y}" width="220" height="260" rx="10" fill="#FBFBFA" fill-opacity=".96" stroke="#E5E7EB"/>'
    s+=f'<rect x="{x+20}" y="{y+24}" width="120" height="8" rx="4" fill="#94A3B8"/><rect x="{x+20}" y="{y+52}" width="170" height="10" rx="5" fill="#334155"/>'
    for i,w in enumerate([180,150,170,120,160,100]): s+=f'<rect x="{x+20}" y="{y+90+i*22}" width="{w}" height="8" rx="4" fill="#CBD5E1"/>'
    return s+'</g>'
b=T(150,160,"GET THE ORDER",'m',16)+T(150,230,"The fax becomes an order.",'d',58)
b+=fax(170,300)+hair("M420 450 H 700",3)
b+=glass(700,320,300,260,20,.09,.3)+T(730,368,"ORDER CREATED",'m',13)+f'<rect x="730" y="392" width="170" height="14" rx="7" fill="#fff" fill-opacity=".9"/><rect x="730" y="420" width="120" height="10" rx="5" fill="#C9B3FF" fill-opacity=".7"/><rect x="730" y="450" width="200" height="10" rx="5" fill="#fff" fill-opacity=".25"/><rect x="730" y="480" width="150" height="10" rx="5" fill="#fff" fill-opacity=".25"/>'+pill(730,520,"Ready to book",140,True,13)
b+=hair("M1000 450 H 1180",3)+f'<rect x="1180" y="390" width="150" height="120" rx="16" fill="#FFF" fill-opacity=".08" stroke="#C9B3FF" stroke-opacity=".6" stroke-width="2"/>'+icon('report',1226,420,2.2,"#C9B3FF",1.6)+T(1255,540,"Report back",'lb',18,'middle')
b+=play(1400,760,44)+T(150,770,"Every referral captured. Every report returned.",'s',24)
page169("poster-p2-fax-to-order-to-report",b,"Video poster: a fax becomes an order, and the report goes back to the referring office.","Poster P2")
# P3 question hook
b=T(150,230,"GET THE ORDER · 2 MINUTES",'m',18)+T(150,350,"How many referrals",'d',92)+T(150,452,"did you lose",'d',92)+T(150,554,"last month?",'d',92)
b+=T(150,640,"Most imaging centers can’t say, because the answer",'s',28)+T(150,678,"is split across three systems.",'s',28)
b+=hair("M150 780 H 1300",3)+play(1380,780,58)
page169("poster-p3-the-question",b,"Video poster: How many referrals did you lose last month? A play button ends a hairline.","Poster P3")
print('ok')
