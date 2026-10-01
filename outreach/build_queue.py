import csv, json, re, urllib.parse, os
rows=list(csv.DictReader(open('leads-source.csv',encoding='utf-8')))
FOOT=('Alpha Nodus, 1341 Sawgrass Corporate Parkway, Suite 104, Sunrise, FL 33323. '
      'Not the right person or not interested? Reply "no" and I will stop.')
# org key -> (display name, short name, note)
ORG={
 '14 Street Medical':('14 Street Medical','14 Street Medical','Not clearly an imaging center: qualify first'),
 '3tradiology.com':('3T Radiology and Research','3T','Five South Florida sites per search snippet (verify). Not 3T Imaging of Morton Grove'),
 '611 Open Mri Altoona':('611 MRI','611 MRI','Altoona PA, since 2004 per search snippet (verify)'),
 'Abercrombie Radiological Consultants':('Abercrombie Radiology','Abercrombie','Assumed Knoxville TN, e-Rad RIS per eRAD release of unknown date (verify)'),
 'Abq Orthopedics':('ABQ Orthopedics','ABQ Orthopedics','Orthopedic group: confirm it runs imaging before writing for it'),
 'Accurate Medical Diagnostic Services':('Accurate Medical Diagnostic Services','Accurate Medical','NYC; ownership and size unverified'),
 'Advanced Diagnostic Imaging Of New Jersey':('Advanced Diagnostic Imaging of New Jersey','Advanced Diagnostic','Marketing contact only'),
 'Advanced Heart Vascular Center Of Carlsbad':('Advanced Heart Vascular Center','Advanced Heart Vascular','Cardiology organization on the currentclinic.com domain: qualify first; seven contacts on one domain'),
 'Advanced Orthopedic And Spine Care Sc':('Advanced Orthopedic and Spine Care','Advanced Ortho and Spine','Orthopedic group: confirm it runs imaging'),
 'advancedradiology.com':('Advanced Radiology','Advanced Radiology','Email domain is radnet.com: RadNet is enterprise, outside the independent ICP'),
 'Adirondack Radiology Albany':('Adirondack Radiology','Adirondack','Catch-all domain: bounce risk'),
 '3T Imaging Of Morton Grove':('3T Imaging','3T Imaging','Catch-all domain; different company from 3T Radiology'),
 'Advanced Health Imaging LLC':('Advanced Health Imaging','Advanced Health Imaging','Catch-all domain: bounce risk'),
 'Advance Technological Radiology':('Advance Technological Radiology','Advance Technological','Catch-all domain: bounce risk'),
 'advanceddiagnosticgroup.com':('Advanced Diagnostic Group','Advanced Diagnostic Group','Catch-all domain: bounce risk'),
}
# status per email: (status, send_day, reason)
SEND1,SEND5='SEND (day 1)','SEND (day 5)'
ST={
 'isaac@3tradiology.com':(SEND1,'Approved B1; first contact at 3T'),
 'vanessa@3tradiology.com':(SEND5,'Second contact at 3T, staggered 4 days after Isaac'),
 'barbn@611mri.com':(SEND1,'First contact at 611 MRI; owner'),
 'shelleyr@611mri.com':(SEND5,'Second contact at 611 MRI, staggered'),
 'aadams@arcrad.org':(SEND1,'Approved A1; first contact at Abercrombie'),
 'jclark@arcrad.org':(SEND5,'Second contact at Abercrombie, staggered'),
 'sidprakash@amds-nyc.com':(SEND1,'Owner; Hunter valid 100%'),
 'emelin@openmri17.com':(SEND1,'Routing email only (marketing seat, only contact at this org)'),
}
def status(r):
    e=r['Email']
    if e in ST: return ST[e]
    g=r['Group']
    if g.startswith('B'): return ('HOLD','Catch-all domain: cannot verify the mailbox; bounce risk. Verify another way or send only a tiny test')
    if g.startswith('C'): return ('HOLD','Ambiguous: same mailbox returned for two different people')
    org=r['Organization']
    if org=='advancedradiology.com': return ('HOLD','radnet.com domain: enterprise, outside the independent ICP')
    if org in ('14 Street Medical','Abq Orthopedics','Advanced Orthopedic And Spine Care Sc','Advanced Heart Vascular Center Of Carlsbad'):
        return ('HOLD','Qualify the organization first (not clearly an imaging center)')
    t=r['Role tag']
    if t=='clinical': return ('HOLD','Clinical seat: send only after an administrator at the same organization has replied or gone quiet')
    return ('HOLD','Organization contact cap (2 per organization): hold until the first two have replied or gone quiet')
def first(name): return name.split()[0]
def greet(r):
    t=r['Title']
    if re.search(r'\((MD|DO)\)',t): return 'Dr. '+r['Person'].split()[-1]
    return first(r['Person'])
def kind(r): return 'timer' if r['Role tag']=='financer' else 'slot'
def build(r):
    org,short,_=ORG[r['Organization']]; tag=r['Role tag']; f=first(r['Person']); e=r['Email']
    if e=='aadams@arcrad.org':
        subj='can abercrombie beat 90 seconds?'
        body=("Amy,\n\nSmall experiment. Our agent reads a faxed order in about 90 seconds, and it has processed 83M documents so far. I'm curious how that compares to what Abercrombie does today.\n\nWe have a live demo on our website. Try it with a test order, no call needed.\n\nWant the link, or is that too forward?\n\nShamit")
    elif e=='isaac@3tradiology.com':
        subj='3t, tuesday at 3:15'
        body=("Isaac,\n\nIt's 3:15 on a Tuesday. The MRI is ready, the tech is ready, and a late cancellation just left one of the five 3T tables empty.\n\nGravity's agents fill that slot automatically. Atlantic Medical Imaging, a multi-site group in New Jersey, uses Gravity for scheduling and prior authorization.\n\nWe have a demo live on our website if you'd like to watch it work. Odd to ask, or worth a look?\n\nShamit")
    elif tag=='financer':
        subj=f"can {short.lower()} beat 90 seconds?"
        body=(f"{f},\n\nYou see what a bad order costs once it reaches billing. Small experiment: our agent reads a faxed order in about 90 seconds, and it has processed 83M documents so far. I'm curious how that compares to what {org} does today.\n\nWe have a live demo on our website. Try it with a test order, no call needed.\n\nWant the link, or is that too forward?\n\nShamit")
    elif tag in ('operator','owner'):
        subj=f"{short.lower()}, tuesday at 3:15"
        body=(f"{f},\n\nIt's 3:15 on a Tuesday. The MRI is ready, the tech is ready, and a late cancellation just left one of {org}'s tables empty.\n\nGravity's agents fill that slot automatically. Atlantic Medical Imaging, a multi-site group in New Jersey, uses Gravity for scheduling and prior authorization.\n\nWe have a demo live on our website if you'd like to watch it work. Odd to ask, or worth a look?\n\nShamit")
    elif tag=='technical':
        subj=f"hl7 and fhir at {short.lower()}"
        body=(f"{f},\n\nA quick one for the IT seat. Gravity works alongside the RIS you already run, over HL7 and FHIR, and we list 13 integrations including e-Rad, Epic, ADS and RamSoft. It does not replace your RIS.\n\nWe have a live demo on our website, and I can send the integration list and security statement first. Who owns RIS integrations at {org}?\n\nShamit")
    elif tag=='clinical':
        subj=f"prior auth at {short.lower()}"
        body=(f"{greet(r)},\n\nA physician-side question. In the AMA's 2025 survey, 95% of physicians said prior authorization delays necessary care. Gravity automates 80% of the prior auth work, so the paperwork stays off your desk.\n\nWho owns prior auth at {org}? I'd like to send them a short demo.\n\nShamit")
    else: # marketeer: routing only
        subj=f"who runs scheduling at {short.lower()}?"
        body=(f"{f},\n\nNot a marketing pitch. I'm trying to reach whoever runs scheduling and prior authorization at {org}, and I'm not sure who that is.\n\nWe build software that automates 80% of the prior auth work and reads a faxed order in about 90 seconds. Could you point me to the right person?\n\nShamit")
    return subj,body

out=[];jobs={};
for i,r in enumerate(rows,1):
    org,short,note=ORG[r['Organization']]
    st,why=status(r); subj,body=build(r); k=kind(r)
    slug=re.sub(r'[^a-z0-9]+','-',(org+'-'+k).lower()).strip('-')
    img=f"images/queue/{slug}.png"
    if k=='slot': alt=f"Schedule card showing an open 3:15 slot at {org}"
    else: alt=f"Can {short} beat 90 seconds? Our agent reads a faxed order in about 90 seconds"
    q=urllib.parse.urlencode({'kind':k,'org':org,'short':short},quote_via=urllib.parse.quote)
    jobs[img]=q
    out.append(dict(n=i,status=st,reason=why,group=r['Group'],organization=org,person=r['Person'],role=r['Role tag'],title=r['Title'],email=r['Email'],
        subject=subj,body=body,footer=FOOT,image=img,image_alt=alt,words=len(body.split()),verify=note))
os.makedirs('images/queue',exist_ok=True)
json.dump([{'file':f,'query':q} for f,q in jobs.items()],open('/tmp/jobs.json','w'))
json.dump(out,open('queue.json','w'),indent=1)
with open('email-queue.csv','w',newline='',encoding='utf-8') as fh:
    w=csv.DictWriter(fh,fieldnames=list(out[0].keys()));w.writeheader();w.writerows(out)
# readable copy-paste file
def block(o):
    return (f"### {o['n']}. {o['person']}, {o['title']}, {o['organization']}\n"
      f"- To: {o['email']}\n- Status: {o['status']} ({o['reason']})\n- Verify before sending: {o['verify']}\n"
      f"- Banner: `{o['image']}`  |  Alt text: {o['image_alt']}\n\n**Subject:** {o['subject']}\n\n```\n{o['body']}\n\n{o['footer']}\n```\n")
md=["# Gravity cold emails: copy and paste queue\n",
"Plain-text emails. Paste the body exactly as shown (it is the text between the code fences), add the banner as an inline image under the sign-off where the sequence says so (touch 2 onward is recommended; touch 1 stays plain text), and keep the footer. Statuses: SEND (day 1), SEND (day 5) and HOLD. HOLD emails are written but should not go out until the reason is cleared.\n"]
for label,pred in (('Send on day 1',lambda o:o['status']=='SEND (day 1)'),('Send on day 5 (staggered)',lambda o:o['status']=='SEND (day 5)'),('Hold: written, not cleared to send',lambda o:o['status']=='HOLD')):
    sel=[o for o in out if pred(o)]
    md.append(f"\n## {label} ({len(sel)})\n")
    md+= [block(o) for o in sel]
open('all-emails.md','w',encoding='utf-8').write('\n'.join(md))
from collections import Counter
print(Counter(o['status'] for o in out)); print(max(o['words'] for o in out), len(jobs),'images')
