# Restyled Gravity product screens (brand guidelines): Settings > Automations > Flows (list + preview) and the workflow canvas.
# Real elements from the screenshots; patient data none; deactivated markers dropped for marketing use.
import base64,html
LOGO=base64.b64encode(open('../.claude/skills/alphanodus-brand/assets/logo/Horizontal/Black.png','rb').read()).decode() if False else None
IC={
 'trigger':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
 'click':"M9 3v3M4.5 7.5l2 2M3 12h3M12.5 12l7 2.5-3 1.5-1.5 3zM7 7a5 5 0 0 1 7-1",
 'config':"M4 20h4l10-10-4-4L4 16zM13 7l4 4",
 'http':"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18",
 'code':"M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14",
 'graph':"M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 3v18M4 7.5l8 4.5 8-4.5",
 'filter':"M4 5h16l-6 7.5V19l-4 2v-8.5z",
 'branch':"M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9c0 4-3 6-8 6",
 'send':"M21 3L3 11l7 3 3 7zM10 14l11-11",
 'loop':"M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
 'down':"M12 3v12M7 11l5 5 5-5M5 21h14",
 'check':"M5 12.5l4.5 4.5L19 7",
 'eye':"M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
 'history':"M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2",
 'refresh':"M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5",
 'zoomin':"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.5-4.5M11 8v6M8 11h6",
 'zoomout':"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.5-4.5M8 11h6",
 'fit':"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
 'bell':"M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
 'gear':"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
}
def ic(name,x,y,s=1.0,col="#6B3FE4",sw=1.7):
    return f'<path d="{IC[name]}" transform="translate({x} {y}) scale({s})" fill="none" stroke="{col}" stroke-width="{sw/s:.2f}" stroke-linecap="round" stroke-linejoin="round"/>'
def esc(t): return html.escape(t)
def tx(x,y,t,cls,size,anchor='start',extra=''): return f'<text x="{x}" y="{y}" class="{cls}" font-size="{size}" text-anchor="{anchor}" {extra}>{esc(t)}</text>'
def win(w,h,body,r=16):
    return f'<g><rect x="0" y="0" width="{w}" height="{h}" rx="{r}" fill="#FFF" filter="url(#sh)"/><clipPath id="cp{w}x{h}"><rect width="{w}" height="{h}" rx="{r}"/></clipPath><g clip-path="url(#cp{w}x{h})">{body}</g><rect x=".5" y=".5" width="{w-1}" height="{h-1}" rx="{r}" fill="none" stroke="#E5E7EB"/></g>'
def topnav(w):
    s=f'<rect width="{w}" height="52" fill="#FFF"/><rect y="52" width="{w}" height="1" fill="#E5E7EB"/>'
    s+=f'<image href="data:image/png;base64,{LOGOB64}" x="22" y="10" width="150" height="32" preserveAspectRatio="xMinYMid meet"/>'
    for i,n in enumerate(["Documents","Orders","Patients","Bookings","Charges","Analytics"]): s+=tx(196+i*104,32,n,'p-t3',14.5)
    s+=f'<circle cx="{w-120}" cy="26" r="11" fill="#F3EEFE" stroke="#E7DDFF"/>'+ic('bell',w-127,19,.58)
    s+=f'<rect x="{w-90}" y="12" width="72" height="28" rx="8" fill="#FFF" stroke="#CBD5E1"/>'+tx(w-54,31,"Logout",'p-tx',13,'middle')
    return s
LOGOB64=base64.b64encode(open('../.claude/skills/alphanodus-brand/assets/logo/Horizontal/Black.png','rb').read()).decode()
def sidebar(h):
    s=f'<rect y="53" width="224" height="{h-53}" fill="#FFF"/><rect x="223" y="53" width="1" height="{h-53}" fill="#E5E7EB"/>'
    s+=ic('gear',22,70,.8,"#0F172A",1.9)+tx(54,89,"Settings",'p-dh',22)
    items=[("Notifications",0),("User management",0),("Notes",0),("Locations",0),("Insurance",0),("Healthcare services",0),("Report settings",0),("Automations",2),("List",3),("Webhooks",3),("Flows",4),("Inbound events",0),("Outbound events",0),("Providers",0),("Claim simulator",0),("Billing",0),("Tags",0)]
    y=124
    for n,k in items:
        if k==4: s+=f'<rect x="10" y="{y-20}" width="204" height="34" rx="8" fill="#F3EEFE"/>'
        col='p-pl' if k in (2,4) else 'p-t2'
        s+=tx(24+(22 if k>=3 else 0),y,n,col,14.5)
        if n=="List": s+=f'<rect x="76" y="{y-14}" width="38" height="18" rx="5" fill="#F3EEFE"/>'+tx(95,y-1,"Beta",'p-pl',10.5,'middle')
        y+=36 if k!=3 else 34
    return s
def pill_btn(x,y,w,label,kind):
    if kind=='install': return f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="8" fill="#6B3FE4"/>'+ic('down',x+10,y+7,.68,"#FFF",2)+tx(x+w/2+8,y+20,label,'p-wh',13,'middle')
    if kind=='update': return f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="8" fill="#FFF" stroke="#6B3FE4" stroke-width="1.4"/>'+tx(x+w/2,y+20,label,'p-pl',13,'middle')
    return f'<rect x="{x}" y="{y}" width="{w}" height="30" rx="8" fill="#F3F4F6"/>'+tx(x+w/2,y+20,label,'p-t3',13,'middle')
def icon_btn(x,y,name):
    return f'<rect x="{x}" y="{y}" width="30" height="30" rx="8" fill="#FFF" stroke="#E5E7EB"/>'+ic(name,x+7,y+7,.66,"#334155",1.9)
FLOWS=[("Booking text outreach","install"),("Eligibility check","installed"),("Eligibility and estimate workflow","install"),("Appointment feedback campaign","install"),("Auto estimate","installed"),("Breast tracking and recall","update"),("Prior auth workflow","install"),("Verify Medicare coverage","install"),("Estimate workflow","install"),("Order created, auto text","installed")]
def flows_list_body(x0,w,h,rows=8):
    s=tx(x0,100,"Flows",'p-dh',26)
    s+=f'<rect x="{x0}" y="118" width="94" height="26" rx="8" fill="#ECFDF5" stroke="#A7F3D0"/>'+ic('check',x0+9,123,.6,"#047857",2.2)+tx(x0+56,136,"Installed",'p-ok',12.5,'middle')
    s+=f'<rect x="{x0+104}" y="118" width="140" height="26" rx="8" fill="#F3EEFE" stroke="#E7DDFF"/>'+tx(x0+174,136,"Updates available",'p-pl',12.5,'middle')
    s+=icon_btn(x0+w-34,114,'refresh')
    y=170
    for n,st in FLOWS[:rows]:
        s+=f'<rect x="{x0}" y="{y+43}" width="{w}" height="1" fill="#EEF0F3"/>'+tx(x0+4,y+25,n,'p-tx',14.5)
        bx=x0+w-34-8
        s+=icon_btn(bx,y+6,'eye')
        if st=='install': s+=pill_btn(bx-98,y+6,90,"Install",'install')
        elif st=='update': s+=pill_btn(bx-140,y+6,132,"Update available",'update')+icon_btn(bx-176,y+6,'history')
        else: s+=pill_btn(bx-98,y+6,90,"Installed",'done')+icon_btn(bx-134,y+6,'history')
        y+=50
    return s
NODEDEF=[('click',"When clicking\\Test workflow"),('config',"Configuration"),('http',"Tenant\\timezone"),('code',"Start and end\\date time"),('graph',"Appointment\\feedback list"),('code',"Format\\feedback list"),('filter',"Filter\\non-eligible"),('branch',"Business\\hour check"),('send',"Send\\feedback text"),('branch',"If"),('config',"Increment\\page")]
def canvas_body(x0,y0,w,h,notes=True,spacing=None,scale=1.0,nyf=0.58,labels=True,note_text=True):
    n=len(NODEDEF); sp=spacing or (w-2*52)/(n-1); ny=y0+h*nyf
    s=''
    xs=[x0+52+i*sp for i in range(n)]
    for i in range(n-1): s+=f'<path d="M{xs[i]+28*scale} {ny} H{xs[i+1]-28*scale}" stroke="#CBD5E1" stroke-width="1.6"/><circle cx="{xs[i+1]-28*scale}" cy="{ny}" r="2.6" fill="#94A3B8"/>'
    # loop back
    s+=f'<path d="M{xs[-1]+28*scale} {ny} C {xs[-1]+60*scale} {ny} {xs[-1]+60*scale} {ny+78*scale} {xs[-1]-10*scale} {ny+78*scale} H {xs[4]} V {ny+30*scale}" fill="none" stroke="#CBD5E1" stroke-width="1.6"/>'
    for i,(icn,lab) in enumerate(NODEDEF):
        x=xs[i]; hsz=56*scale
        s+=f'<rect x="{x-hsz/2}" y="{ny-hsz/2}" width="{hsz}" height="{hsz}" rx="{12*scale}" fill="#FFF" stroke="#CBD5E1" stroke-width="1.3"/>'+ic(icn,x-12*scale*1.0,ny-12*scale,1.0*scale,"#6B3FE4",1.8)
        for k,l in (enumerate(lab.split(chr(92))) if labels else []): s+=tx(x,ny+hsz/2+16*scale+k*14*scale,l,'p-t2',11*scale,'middle')
    if notes:
        def note(x,y,wn,hn,title,lines):
            t=f'<rect x="{x}" y="{y}" width="{wn}" height="{hn}" rx="6" fill="#F3EEFE" stroke="#E7DDFF"/>'+(tx(x+10,y+19,title,'p-tx',12*scale,'start','font-weight="600"') if note_text else '')
            for k,l in (enumerate(lines) if note_text else []): t+=tx(x+10,y+36*scale+k*13*scale,l,'p-t2',9.5*scale)
            return t
        s+=note(xs[0]-40*scale,y0+h*0.2,200*scale,64*scale,"Appointment feedback",["Sends the feedback texts for","booked patients, based on the","configuration set."])
        s+=note(xs[2],y0+h*0.04,260*scale,118*scale,"Configuration",["tenant: tenant id","service category: provide in the array","feedback buffer time: days to look back","healthcare service tags: include or exclude","appointment status: statuses to send for","text outreach intent name"])
        s+=note(xs[5]-30*scale,y0+h*0.22,200*scale,60*scale,"Filter",["Skips appointments that fall","under the buffer range."])
    return s
def zoom_controls(x,y):
    return ''.join(icon_btn(x+i*40,y,n) for i,n in enumerate(['fit','zoomin','zoomout']))
def canvas_window(w,h,title="Appointment feedback"):
    b=f'<rect width="{w}" height="{h}" fill="#F6F4FA"/><rect width="{w}" height="{h}" fill="url(#dots)"/>'+topnav(w)
    b+=f'<rect y="53" width="{w}" height="46" fill="#FFF"/><rect y="98" width="{w}" height="1" fill="#E5E7EB"/>'+tx(24,82,title,'p-dh',20)+f'<rect x="{24+len(title)*11+18}" y="66" width="82" height="22" rx="7" fill="#ECFDF5" stroke="#A7F3D0"/>'+tx(24+len(title)*11+59,81,"Installed",'p-ok',12,'middle')
    b+=canvas_body(0,110,w,h-110,True,None,1.0,0.5)
    b+=zoom_controls(20,h-54)
    return win(w,h,b)
def flows_window(w,h):
    b=topnav(w)+sidebar(h)
    lw=430; b+=flows_list_body(250,lw,h)
    px=250+lw+22; pw=w-px-16
    b+=f'<rect x="{px-10}" y="53" width="1" height="{h-53}" fill="#E5E7EB"/><rect x="{px}" y="72" width="{pw}" height="{h-72-16}" rx="12" fill="#F6F4FA" stroke="#E5E7EB"/><rect x="{px}" y="72" width="{pw}" height="{h-72-16}" rx="12" fill="url(#dots)"/>'
    b+=tx(px+16,98,"Preview",'p-t3',12.5)+canvas_body(px+4,74,pw-8,h-90,True,(pw-90)/10,0.62,0.55,False,False)
    b+=zoom_controls(px+14,h-72)
    return win(w,h,b)
SCREEN_CSS="""
.p-t3{font-family:Inter,sans-serif;font-weight:500;fill:#64748B}.p-t2{font-family:Inter,sans-serif;font-weight:400;fill:#334155}.p-tx{font-family:Inter,sans-serif;font-weight:500;fill:#0F172A}
.p-dh{font-family:Urbanist,sans-serif;font-weight:700;fill:#0F172A}.p-pl{font-family:Inter,sans-serif;font-weight:600;fill:#582FD1}.p-wh{font-family:Inter,sans-serif;font-weight:600;fill:#fff}.p-ok{font-family:Inter,sans-serif;font-weight:600;fill:#047857}
"""
SCREEN_DEFS='<filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity=".5"/></filter><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="#CBD5E1" fill-opacity=".7"/></pattern>'
