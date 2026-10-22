import html, os, subprocess, json
R='/home/user/Claude-Projects/linkedin-ads/'
C=R+'content/'
logo=open(R+'brand/alphanodus-logo-white.svg').read()
CSS='''
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
@page{size:Letter;margin:0}
*{box-sizing:border-box}
body{margin:0;font:11pt/1.5 Inter,sans-serif;color:#1B1430}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;page-break-after:always;padding:0.7in 0.75in 0.8in}
.hd{background:radial-gradient(ellipse at 15% 0%,#2D1B5D,#1B1430 60%),#1B1430;color:#fff;margin:-0.7in -0.75in 0.4in;padding:0.45in 0.75in 0.4in;}
.hd .logo{height:26px;margin-bottom:0.3in}.hd .logo svg{height:26px;width:auto}
.kick{font:500 8.5pt 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#C9B3FF;margin-bottom:8px}
h1{font:700 27pt/1.1 Urbanist,sans-serif;letter-spacing:-.03em;margin:0}
h1 em{font-style:normal;background:linear-gradient(90deg,#C9B3FF,#67E3EE);-webkit-background-clip:text;color:transparent}
.sub{color:#B4A8D6;margin-top:10px;font-size:11pt}
h2{font:700 14pt Urbanist,sans-serif;letter-spacing:-.02em;margin:18px 0 6px;color:#5B2FD1}
p{margin:0 0 8px}
ul{margin:0 0 8px;padding-left:18px} li{margin-bottom:3px}
.q{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #E6E0F2;font-size:10.5pt}
.q .n{font:500 9pt 'JetBrains Mono',monospace;color:#6B3FE4;width:22px;flex:none;padding-top:2px}
.q .t{flex:1}
.q .b{flex:none;display:flex;gap:6px}
.q .b span{border:1.5px solid #B4A8D6;border-radius:4px;font-size:7.5pt;padding:2px 6px;color:#6b6585}
.box{background:#F6F4FA;border-left:4px solid #6B3FE4;border-radius:6px;padding:12px 14px;margin:12px 0}
.quote{font:600 16pt/1.3 Urbanist,sans-serif;letter-spacing:-.02em;margin:14px 0 4px}
.who{color:#6b6585;font-size:9.5pt}
.stat{display:inline-block;margin:6px 18px 6px 0}.stat b{display:block;font:700 22pt Urbanist,sans-serif;color:#5B2FD1;letter-spacing:-.03em}.stat span{font-size:9pt;color:#6b6585}
.ft{position:absolute;left:0.75in;right:0.75in;bottom:0.4in;font-size:8.5pt;color:#6b6585;display:flex;justify-content:space-between;border-top:1px solid #E6E0F2;padding-top:8px}
.cta{background:#6B3FE4;color:#fff;border-radius:8px;padding:12px 16px;font-weight:600;margin-top:14px}
.line{border-bottom:1px solid #C9C2DA;height:26px}
table{border-collapse:collapse;width:100%;font-size:9.5pt}th,td{border:1px solid #D9D3E8;padding:7px 8px;text-align:left;vertical-align:top}th{background:#F6F4FA}
.tag{display:inline-block;font:500 7.5pt 'JetBrains Mono',monospace;background:#EDE6FF;color:#5B2FD1;border-radius:4px;padding:2px 6px;margin-right:6px}
.flag{font-size:8.5pt;color:#9a5b00;background:#FFF4DB;border-radius:4px;padding:2px 6px}
'''
def page(kick,title,sub,body,foot='alphanodus.com · 1-888-625-7420 · info@alphanodus.com'):
    return f'<section class="page"><div class="hd"><div class="logo">{logo}</div><div class="kick">{kick}</div><h1>{title}</h1><div class="sub">{sub}</div></div>{body}<div class="ft"><span>Alpha Nodus</span><span>{foot}</span></div></section>'
def doc(name,pages):
    h=f'<!doctype html><meta charset=utf-8><title>{name}</title><style>{CSS}</style>'+''.join(pages)
    open(C+'pdf-src/'+name+'.html','w').write(h)
def qs(items,start=1):
    return ''.join(f'<div class="q"><div class="n">{i+start:02d}</div><div class="t">{t}</div><div class="b"><span>Yes</span><span>No</span><span>Not sure</span></div></div>' for i,t in enumerate(items))

# 1 checklist
g1=['Do you know how many referring offices sent you orders this quarter compared with last?','Can you see, today, which referring offices sent fewer orders than usual?','Is the oldest unentered faxed order less than one business day old?','When a faxed order is missing a detail, does someone know who is chasing it?','Is every incoming order visible in one list, whatever channel it arrived by?']
g2=['Can a patient book an exam without calling you?','Do you know how long a new order waits before the patient is contacted?','Is coverage checked before the appointment is booked?','Is every authorization request tracked in one place with a status?','Do you know how many scheduled exams last month were rescheduled or cancelled?']
g3=['Does the patient see an estimate of what they owe before they arrive?','Can you list the top three reasons claims were denied last quarter?','Do your front-desk staff know which payer a patient has before the exam?','Does the signed report reach the referring office without someone sending it?','Can you follow any single order from referral to payment in under five minutes?']
doc('checklist',[page('Checklist','Score your center <em>before the next hire</em>','Fifteen yes-or-no questions. About ten minutes. Best done with your front desk and billing leads.','<h2>Part 1. Where orders disappear</h2>'+qs(g1)+'<h2>Part 2. Where visits stall</h2>'+qs(g2,6)),
 page('Checklist','Part 3, and how to read it','Circle every “No” or “Not sure”. Those are the places to look.','<h2>Part 3. Where money slips</h2>'+qs(g3,11)+'''<h2>How to read your answers</h2><ul><li><b>Mostly Part 1:</b> intake and referrals.</li><li><b>Mostly Part 2:</b> booking, authorizations, cancellations.</li><li><b>Mostly Part 3:</b> coverage, estimates, denials.</li></ul><div class="box">Pick one order from last week that touched those steps. Mark every place it waited on a person, a fax or a phone call.</div><div class="cta">Free 30-minute order trace: alphanodus.com/order-trace</div>''')])

# 2 order trace worksheet
rows=''.join(f'<tr><td style="height:46px"></td><td></td><td></td><td></td><td></td></tr>' for _ in range(9))
doc('order-trace-worksheet',[page('Worksheet','Trace one <em>order</em>','From referral to payment. Mark every place it waited on a person, a fax or a phone call.',
 '<p><b>Order (general terms, no names):</b></p><div class="line"></div><div class="line"></div><h2>Steps</h2><table><tr><th>Step</th><th>Who touched it</th><th>Tool or channel</th><th>Waited (hours/days)</th><th>Waited on a person?</th></tr>'+rows+'</table>'+
 '<div class="box"><b>Starter steps:</b> referral received · order read · patient found · exam chosen · patient contacted · coverage checked · authorization · booked · exam done · report signed · report sent · claim sent · paid.</div>')])

# 3 case studies
def case(name,kick,stats,quote,who,body):
    st=''.join(f'<div class="stat"><b>{a}</b><span>{b}</span></div>' for a,b in stats)
    return page('Customer story',f'{name}',kick,f'<div>{st}</div><div class="quote">“{quote}”</div><div class="who">{who}</div>{body}')
doc('case-iowa-radiology',[case('Iowa Radiology','Four clinics. Founded 2001.',[('~430','orders waiting on day one'),('Day 3–4','backlog gone'),('≥80%','of authorizations handled by Gravity')],'We are totally caught up. We have no backlog.','Mendy Christensen, Iowa Radiology','<h2>What happened</h2><p>After a system change, the prior authorization backlog grew to months. Two specialists handled all high-tech imaging authorizations. Gravity went live at the end of June 2025.</p><ul><li>About 430 orders were waiting on day one.</li><li>The backlog was gone by day three or four, and fully caught up in about four weeks.</li><li>No staff were added.</li></ul><p>Source: Alpha Nodus customer page.</p>')])
doc('case-downtown-radiology',[case('Downtown Radiology','Patients booking themselves.',[('19.7→43.8%','self-booking over 12 months'),('56.5%','of texted patients booked themselves'),('16.5%','booked off-hours')],'One in six books in the evening or at the weekend, when nobody could have picked up the phone.','Arshia Bivadi, CEO, Downtown Radiology','<h2>What happened</h2><ul><li>83.5% of self-bookings happen within a day; median 1.8 hours; 38.1% within an hour.</li><li>94.2% of those bookings were completed.</li><li>More than 5,000 appointments moved.</li></ul><p>Source: Alpha Nodus customer page (data attested October 2026, Pacific time).</p>')])
doc('case-mri-associates',[case('MRI Associates','Finding the root problem.',[('~1 in 3','appointments had Medicare wrongly primary'),('Same day','“Verify Medicare” worklist built')],"I've worked with plenty of vendors, but none identified the root problem like Alpha Nodus did.",'Amanda Maple, CAO, MRI Associates','<h2>What happened</h2><p>Medicare was listed as primary on nearly one in three appointments when it should not have been. A “Verify Medicare” worklist was built the same day.</p><p>Source: Alpha Nodus customer page.</p>')])

# 4 modules
M=[
('Grow','Referral management','The CRM that keeps referrers sending, and wins back the ones who stopped.',['Referrer record: an NPI-checked record of every referring provider, kept current from the national registry','Market intelligence: every physician in your market who orders imaging, including those sending orders elsewhere','Flags referrers whose volume is rising or falling']),
('Referral','Referring physician portal','Find the right imaging center, place the order in one step, and get the report back the day it’s signed.',['Upload the order once; it becomes a digital order with nothing to retype','Live order status: received, pending, needs information, authorized, booked, completed','Told right away what an order still needs']),
('Doc','Fax intake and order entry','Every document is read, filed and turned into a complete order.',['Reads the fax, finds the patient (or creates one for review) and creates the order','Draft order entry: the form arrives filled in so staff review and confirm instead of typing','Split multi-patient faxes, reorder and rotate pages without leaving the viewer']),
('Booking','Patient scheduling','The exam is booked in the right slot, on the right device, the first time, and schedules stay full.',['Booking rules checked on every booking','Exam booking and schedule templates','At Downtown Radiology, patients made 43.8% of bookings in September 2026, up from 19.7% in the first month']),
('Visit','Patient portal and check-in','The patient arrives booked, prepared, checked in and paid.',['Patients book from the app or by chat; an AI voice agent can book by phone under the same rules','Digital forms, filled in once','Patients can move an appointment from the same link']),
('Greeter','Check-in kiosk','Check-in at a lobby tablet, not a line at the desk.',['One tablet per location, in the lobby','Scan a license and the appointment comes up; manual entry is the fallback','Same check-in as on the patient’s phone']),
('Estimate','Eligibility and patient estimates','Coverage and the patient’s share are known before the exam.',['Coverage verified before arrival, without calling the payer or using a portal','Shows copay, coinsurance, deductible and out-of-pocket remaining by network tier','AI picks the benefit line that fits each exam, for one-click patient responsibility']),
('PriorAuth','Prior authorization','Every exam that needs a prior authorization has one.',['Rules say which exams need one for each payer and code','Each authorization sits on the order with its status, number and dates','Iowa Radiology: 80%+ of authorizations go through Gravity; a backlog of about 430 orders was gone by day 4']),
('Pay','Patient payments','The patient’s share is collected when the exam is booked, before the visit or at the visit.',['Patients pay before they arrive, from their phone, with no login','Card, cash, check or card reader at the front desk, with an automatic receipt','Card payments go straight onto the order']),
('Communication','Calls, texts and faxes','Voice, chat and document, built into Gravity.',['Every channel in one thread on the order and the patient','Calls, texts, chats, emails and faxes together','Scale on Gravity each month: 2 million texts, 1.2 million faxes, 500,000 emails, 200,000 calls']),
('Flow','Workflow automation','Thousands of ready-made flows, installed and running the same day.',['Any event in Gravity can start a flow','Routine work just runs; agents do the work that takes intelligence; people review or handle exceptions','10 million automated flows run every day']),
('Work','Worklists','Puts each piece of work that needs a person in front of the right one.',['Work is assigned on arrival, up to each person’s capacity and skill','Worklists for calls, documents, orders, referring providers and patients','Semantic search finds work by meaning, even handwritten documents']),
('Trust','Access and audit','Controls who can get in, what they can do, and records what was done.',['Single sign-on: staff use their existing work accounts, and IT keeps control of access','User groups and permissions: each person sees and does only what their job needs','An audit trail of every change']),
('Insight','Analytics and KPIs','See how the center is running without exporting a spreadsheet.',['Dashboards for orders, documents, booking and flows','Per-user dashboard access','Dashboards can be emailed on a schedule you set'])]
doc('module-one-pagers',[page('Gravity module','Gravity '+n,t,'<h2>What it does</h2><p>'+d+'</p><h2>Highlights</h2><ul>'+''.join(f'<li>{x}</li>' for x in f)+'</ul><p class="who">Source: alphanodus.com/products/gravity-'+n.lower()+'</p><div class="cta">See it on a 30-minute demo</div>') for n,t,d,f in M])

# 5 security
doc('security-sheet',[page('Trust','Access, control and <em>audit</em>','What Gravity Trust and the product pages state.','<h2>Single sign-on</h2><p>Staff sign in with their existing work accounts, so login security and password policy stay with your IT team. A change in your identity provider adds or removes the user in Gravity on its own.</p><h2>Permissions</h2><p>Groups control which screens and actions each person has, from built-in User and Admin to job-specific groups.</p><h2>Audit trail</h2><p>The record of every change, plus a timeline on each order.</p><h2>You decide how much a person reviews</h2><p>For order intake, review every order or only the unusual ones. For authorizations, review every run, let it finish on its own, or turn it off.</p><h2>What Gravity does not do</h2><p>It does not read the scan or write the report.</p><div class="box">This sheet states only what alphanodus.com states. It claims no certifications.</div>')])

# 6 role guides
def guide(role,intro,points):
    return page('Role guide',role,intro,'<h2>What to look at first</h2><ul>'+''.join(f'<li>{p}</li>' for p in points)+'</ul><div class="cta">Trace one order with us. Free, 30 minutes.</div>')
doc('role-guides',[
 guide('Billing lead','Prior authorization and denials.',['Which authorizations are waiting, and for how long?','Which denials trace back to something knowable at booking?','Do you know the payer before the exam?','Five checks at booking: payer, plan, authorization need, estimate, secondary coverage.']),
 guide('Front desk lead','Fax intake and booking.',['How old is your oldest unentered order?','Who chases missing details, and how?','How many bookings need a phone call?','Which exams could be booked by the patient?']),
 guide('Owner','Where profit leaks.',['Which referring offices sent fewer orders?','How long does an order wait before the patient is contacted?','How much staff time goes to retyping?','What changes if the next hire isn’t needed?']),
 guide('Radiologist-owner','Referrers and reports.',['Does the signed report reach the referring office without someone sending it?','Which referrers are quiet?','What does automation do, and where does it stop?','Can you see what it did on any order?'])])

# 7 rsna
doc('rsna-meeting-sheet',[page('RSNA 2026','Bring one order. <em>Booth 6537.</em>','North Hall, Level 3, McCormick Place, Chicago.','''<ul><li><b>Exhibits:</b> Sunday Nov 29 to Wednesday Dec 2, 10 a.m. to 5 p.m. CT</li><li><b>Booth:</b> 6537, North Hall, Level 3</li><li><b>Address:</b> 2301 S. Lake Shore Dr., Chicago</li><li><b>Walk-ins welcome.</b> RSNA registration is required.</li></ul><h2>What we’ll do</h2><p>Trace one order from the fax that brings it in to the payment, and mark each stall. 30 minutes. No patient names needed.</p><div class="cta">Book: alphanodus.cal.com/iris/rsna-2026</div>''')])

# 8 faq
faq=open(C+'faq/faq.md').read().split('\n\n')[1:]
fb=''.join(f'<p><b>{html.escape(x.split(chr(10))[0].strip("*"))}</b><br>{html.escape(" ".join(x.split(chr(10))[1:]))}</p>' for x in faq if x.startswith('**'))
doc('faq',[page('FAQ','Questions we <em>get asked</em>','Short answers from the Alpha Nodus website.',fb)])
