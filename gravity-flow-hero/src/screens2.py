# Cropped, zoomed product views for Gravity Flow (real elements from the screenshots, brand styling).
import sys; sys.path.insert(0,'src')
from screens import *
def node_tile(x,y,icn,s=1.3):
    h=56*s; return f'<rect x="{x-h/2}" y="{y-h/2}" width="{h}" height="{h}" rx="{14*s*.8}" fill="#FFF" stroke="#CBD5E1" stroke-width="1.4"/>'+ic(icn,x-12*s,y-12*s,s,"#6B3FE4",1.8)
def marker(x,y,n): return f'<circle cx="{x}" cy="{y}" r="13" fill="#6B3FE4" stroke="#FFF" stroke-width="2.5"/>'+tx(x,y+5,str(n),'p-wh',13,'middle')
def note(x,y,w,title,lines,fs=11.5,lh=15):
    h=34+len(lines)*lh
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#F3EEFE" stroke="#E7DDFF"/>'+tx(x+12,y+22,title,'p-tx',13.5,'start','font-weight="600"')
    for k,l in enumerate(lines): s+=tx(x+12,y+42+k*lh,l,'p-t2',fs)
    return s,h
def wf_window(w,h,title="Appointment feedback",numbered=True,show_config=True,branch=True,nyf=0.62):
    b=f'<rect width="{w}" height="{h}" fill="#F6F4FA"/><rect width="{w}" height="{h}" fill="url(#dots)"/>'
    b+=f'<rect width="{w}" height="46" fill="#FFF"/><rect y="45" width="{w}" height="1" fill="#E5E7EB"/>'+tx(22,30,title,'p-dh',19)
    cw=len(title)*10.5+34
    b+=f'<rect x="{cw}" y="13" width="84" height="22" rx="7" fill="#ECFDF5" stroke="#A7F3D0"/>'+tx(cw+42,28,"Installed",'p-ok',12,'middle')
    b+=tx(w-22,29,"Settings > Automations > Flows",'p-t3',12.5,'end')
    ny=int(h*nyf)
    xs=[110+i*((w-220)/5) for i in range(6)]
    nodes=[('trigger',"Schedule trigger"),('graph',"Appointment\\feedback list"),('code',"Format\\feedback list"),('filter',"Filter\\non-eligible"),('branch',"Business\\hour check"),('send',"Send\\feedback text")]
    edges=[None,None,None,"Kept","true"]
    for i in range(5):
        b+=f'<path d="M{xs[i]+38} {ny} H{xs[i+1]-38}" stroke="#94A3B8" stroke-width="1.8"/><circle cx="{xs[i+1]-38}" cy="{ny}" r="3" fill="#94A3B8"/>'
        if edges[i]: b+=tx((xs[i]+xs[i+1])/2,ny-8,edges[i],'p-t3',11.5,'middle')
    if branch:
        bx=xs[4]; b+=f'<path d="M{bx} {ny+80} V{ny+96}" stroke="#94A3B8" stroke-width="1.8"/>'+tx(bx+10,ny+92,"false",'p-t3',11.5)
        b+=f'<rect x="{bx-26}" y="{ny+96}" width="52" height="52" rx="12" fill="#FFF" stroke="#CBD5E1" stroke-width="1.4"/>'+ic('loop',bx-11,ny+111,.95,"#6B3FE4",1.8)+tx(bx+36,ny+127,"Next page",'p-t2',11.5)
        b+=f'<path d="M{bx-26} {ny+122} H{xs[1]} V{ny+80}" fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-dasharray="5 5"/>'
    for i,(icn,lab) in enumerate(nodes):
        b+=node_tile(xs[i],ny,icn)
        for k,l in enumerate(lab.split(chr(92))): b+=tx(xs[i],ny+58+k*14,l,'p-t2',12,'middle')
    if numbered:
        for i,n in [(0,1),(1,2),(3,3),(4,4),(5,5)]: b+=marker(xs[i]+30,ny-30,n)
    if show_config:
        c,hh=note(22,58,300,"Configuration",["tenant: tenant id","service category: provide in the array","feedback buffer time: days to look back","healthcare service tags: include or exclude","appointment status: statuses to send for","text outreach intent name"]); b+=c
        c,hh=note(xs[2]-60,58,236,"Format feedback list",["Keeps one feedback form per patient","per day and skips appointments","where a form has already been sent."],11,14.5); b+=c
        c,hh=note(xs[3]+48,58,176,"Filter",["Skips appointments that fall","under the buffer range."],11,14.5); b+=c
    return win(w,h,b),xs,ny
def flow_rows(x,y,w,rows,rh=48):
    s=''
    for i,(n,st) in enumerate(rows):
        yy=y+i*rh
        s+=f'<rect x="{x}" y="{yy}" width="{w}" height="{rh-6}" rx="10" fill="#FFF" stroke="#E5E7EB"/>'+tx(x+16,yy+(rh-6)/2+5,n,'p-tx',14.5)
        bx=x+w-14
        if st=='install': s+=pill_btn(bx-92,yy+(rh-36)/2+1,92,"Install",'install')
        elif st=='update_s': s+=pill_btn(bx-84,yy+(rh-36)/2+1,84,"Update",'update')+icon_btn(bx-120,yy+(rh-36)/2+1,'history')
        elif st=='update': s+=pill_btn(bx-140,yy+(rh-36)/2+1,140,"Update available",'update')+icon_btn(bx-176,yy+(rh-36)/2+1,'history')
        else: s+=pill_btn(bx-92,yy+(rh-36)/2+1,92,"Installed",'done')+icon_btn(bx-128,yy+(rh-36)/2+1,'history')
    return s
