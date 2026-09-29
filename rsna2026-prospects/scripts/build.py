import json, glob, csv, re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classify import classify
S = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'private'); R = S + '/raw'
OUT = sys.argv[1] if len(sys.argv) > 1 else S + '/out'
os.makedirs(OUT, exist_ok=True)

def clean(v):
    if v is None: return ''
    if isinstance(v, list): v = '; '.join(str(x) for x in v if x)
    v = str(v).strip()
    return '' if v.lower() in ('none', 'null', 'n/a', 'not found', 'unknown') else v

def load_agent(path):
    d = json.load(open(path)); o = d['output']
    rows = o['content'] if isinstance(o['content'], list) else []
    low = {}
    for cl in (o.get('trust') or {}).get('claims', []):
        m = re.match(r'\$\[(\d+)\]\.(\w+)', cl.get('path', ''))
        if m and cl.get('confidence') != 'high':
            low.setdefault(int(m.group(1)), set()).add(m.group(2))
    return rows, low

def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower())

# ---------------- exhibitors ----------------
ex = list(csv.DictReader(open(R + '/exhibitors_raw.csv')))
extra = {r['exhid_or_name']: r['booth'] for r in csv.DictReader(open(R + '/extra_booths.tsv'), delimiter='\t')}
FEATURED = {'AbbaDox','ABLIC','Adaptix Ltd','Barco','Bayer','Beekley Medical','Bracco','Circle Cardiovascular Imaging','CMI','Computer Vision AG','DataFirst','Eon','Fovia AI','FUJIFILM Healthcare Americas Corporation','Imorgon Medical','INFINITT North America / INFINITT Healthcare','Intelerad, A GE HealthCare Company','IRADIMED','Jacobian','Kailo Medical','Konica Minolta Healthcare Americas, Inc.','Kontron','Krsnaa Diagnostics Ltd.','Laurel Bridge Software, Inc.','MedInformatix Inc','Metrasens Inc','Nationwide Imaging Services, An MXR Imaging Company','New Lantern','OnePACS','Protech Medical','Radloop','RamSoft, Inc','ScreenPoint Medical','SST Group Inc','Viz.ai','Ziosoft'}
for r in ex:
    if not r['booth'] and r['exhibitor'] in extra: r['booth'] = extra[r['exhibitor']]
    r['segment'] = classify(r['exhibitor'])
    r['featured'] = 'Yes' if r['exhibitor'] in FEATURED else ''
ex_by_norm = {norm(r['exhibitor']): r for r in ex}

# brand name (as sent to agent) -> exhibitor name on MYS
ALIAS = {'Philips (Healthcare)':'Philips','Canon Medical Systems USA':'Canon Medical Systems USA, Inc.','FUJIFILM Healthcare Americas':'FUJIFILM Healthcare Americas Corporation','Samsung (Medison / NeuroLogica)':'Samsung','Hologic':'Hologic, Inc','Bayer (Radiology)':'Bayer','Bracco Diagnostics':'Bracco','Konica Minolta Healthcare Americas':'Konica Minolta Healthcare Americas, Inc.','Merge (Merative)':'Merge','Intelerad, a GE HealthCare company':'Intelerad, A GE HealthCare Company','RamSoft':'RamSoft, Inc','Microsoft (healthcare / Nuance PowerScribe)':'Microsoft','Dell Technologies (healthcare)':'Dell Technologies','Qure.ai':'Qure.ai Technologies Inc','DeepHealth (RadNet)':'DeepHealth / RadNet','Subtle Medical':'Subtle Medical Inc','Oxipit':'Oxipit, UAB','Milvue':'MILVUE','Sirona Medical':'Sirona Medical Inc.','Blackford Analysis':'Blackford','Hyperfine':'Hyperfine Inc.','Stryker':'Stryker','BD (Becton Dickinson)':'BD','Barco (healthcare)':'Barco','EIZO':'EIZO Corporation','Enlitic':'Enlitic Inc','MedInformatix':'MedInformatix Inc','Laurel Bridge Software':'Laurel Bridge Software, Inc.','INFINITT North America':'INFINITT North America / INFINITT Healthcare','Metrasens':'Metrasens Inc','Shimadzu Medical Systems':'Shimadzu Medical Systems','Varex Imaging':'Varex Imaging','Heartflow':'Heartflow','TeraRecon / ConcertAI':'TeraRecon / ConcertAI'}
def match_ex(name):
    n = ALIAS.get(name, name)
    return ex_by_norm.get(norm(n)) or next((r for k, r in ex_by_norm.items() if norm(n) and (k.startswith(norm(n)) or norm(n).startswith(k))), None)

pages = {}
for r in csv.DictReader(open(R + '/company_rsna_pages.tsv'), delimiter='\t'):
    pages[norm(r['company'])] = r

brands, people = [], []
seen_brand = set()
for f in sorted(glob.glob(R + '/agent_brands_*.json')):
    rows, low = load_agent(f)
    for i, b in enumerate(rows):
        name = clean(b.get('company'))
        if not name or norm(name) in seen_brand: continue
        seen_brand.add(norm(name))
        exr = match_ex(name)
        exname = exr['exhibitor'] if exr else name
        pg = pages.get(norm(exname)) or pages.get(norm(name)) or {}
        booth = (exr or {}).get('booth') or pg.get('booth_from_page', '')
        rsna_page = clean(b.get('rsna2026_page_url')) or pg.get('rsna2026_page', '')
        if exr: exr['enriched'] = 'Yes'
        web = clean(b.get('website'))
        if web and not web.startswith('http'): web = 'https://' + web
        verify = sorted(low.get(i, set()) - {'company'})
        brands.append({
            'Company': exname, 'Segment': classify(exname) if exr else '', 'Booth': booth,
            'Featured exhibitor': (exr or {}).get('featured', ''),
            'Website': web, 'LinkedIn': clean(b.get('linkedin_url')), 'X / Twitter': clean(b.get('x_handle')),
            'Instagram': clean(b.get('instagram_handle')), 'Facebook': clean(b.get('facebook_url')), 'YouTube': clean(b.get('youtube_url')),
            'Public contact email': clean(b.get('public_contact_email')), 'Press / media email': clean(b.get('press_email')),
            'HQ': clean(b.get('hq')), 'What they sell': clean(b.get('what_they_sell')),
            'Key people (name - title - LinkedIn)': clean(b.get('key_people')),
            'RSNA 2026 page / meeting form': rsna_page,
            'MYS exhibitor profile': (exr or {}).get('mys_profile_url', ''),
            'Fields to double-check': ', '.join(verify)})
        for kp in re.split(r';\s*', clean(b.get('key_people'))):
            if not kp: continue
            parts = [p.strip() for p in re.split(r'\s+[-—–]\s+', kp)]
            nm = re.sub(r'\(.*?\)', '', parts[0]).strip()
            nm = re.sub(r'^(Dr\.?|Prof\.?)\s+', '', nm)
            if not re.fullmatch(r"[A-Z][\w'.\-]*(\s+[A-Z][\w'.\-]*){1,4}(,?\s*(MD|PhD|MBA|MSN|RN|MD MBA))*", nm) \
               or re.search(r'\b(team|leadership|management|executive|per|company)\b', nm, re.I): continue
            m = re.search(r'(?:https?://)?[\w.]*linkedin\.com/in/[^\s);,]+', kp)
            li = m.group(0) if m else ''
            if li and not li.startswith('http'): li = 'https://' + li
            title = parts[1] if len(parts) > 1 else ''
            title = re.sub(r'\(?\s*(?:https?://)?[\w.]*linkedin\.com\S*\s*\)?', '', title)
            title = re.sub(r'\((per|via|see)[^)]*\)?', '', title, flags=re.I).strip(' ;,')
            title = re.sub(r'\s*\([^)]*$', '', title)
            if 'http' in title: title = ''
            t = title.lower()
            sec = 'Brand – PR/Communications' if re.search(r'press|public relations|communicat|external relations|\bpr\b', t) else \
                  'Brand – Marketing/Events' if re.search(r'market|event|brand', t) else \
                  'Brand – Sales/Commercial' if re.search(r'sales|commercial|revenue|business dev', t) else \
                  'Brand – Executive (C-suite/Founder)' if re.search(r'ceo|chief|founder|president|chair|cfo|coo|cto|gm|general manager', t) else 'Brand – Staff'
            email = clean(b.get('press_email')) if 'PR' in sec else ''
            people.append({'Name': nm, 'Primary tag': 'Brand Representative', 'Secondary tag': sec,
                'Title / role': title, 'Organization / brand': exname, 'Brand website': web, 'Booth': booth,
                'RSNA 2026 status': 'Exhibiting company (staff attendance very likely)',
                'Signal / evidence': f'{exname} is a confirmed RSNA 2026 exhibitor' + (f' (booth {booth})' if booth else ''),
                'Evidence URL': (exr or {}).get('mys_profile_url', '') or rsna_page,
                'LinkedIn': li, 'X / Twitter': '', 'Instagram': '', 'Other social / channel': '',
                'Public email': email, 'Phone': '', 'Source': 'Nimble web research agent (company sites, press releases, LinkedIn)'})

# ---------------- officials / media ----------------
orgc = []
CATMAP = [('rsna board', 'Authorized Official', 'RSNA Board of Directors'),
          ('plenary', 'Speaker', 'RSNA 2026 Plenary Speaker'),
          ('rsna executive', 'Authorized Official', 'RSNA Executive / Staff'),
          ('rsna media', 'Authorized Official', 'RSNA Staff – Media Relations'),
          ('rsna exhibitor', 'Authorized Official', 'RSNA Staff – Exhibits/Sponsorship'),
          ('society executive', 'Society Official', 'Society executive'),
          ('society leader', 'Society Official', 'Society leader (president/board)'),
          ('trade media', 'Media / Press', 'Trade media editor/reporter'),
          ('trade / society publication', 'Media / Press', 'Society publication')]
for f in glob.glob(R + '/agent_officials.json'):
    rows, low = load_agent(f)
    for i, r in enumerate(rows):
        name = clean(r.get('name')); cat = clean(r.get('category')).lower()
        prim, sec = 'Other', clean(r.get('category'))
        for k, p, s in CATMAP:
            if k in cat: prim, sec = p, s; break
        generic = bool(re.search(r'\(|desk|office|contact|main|board \(|general|customer service|sales & sponsorship|exhibition services|editorial board', name, re.I)) or name.startswith('RSNA ')
        li = clean(r.get('linkedin_url'))
        if 'jeffrey-s-klein-md-rsna-president' in li: li = ''  # unverifiable slug, dropped
        rec = {'Name': name, 'Primary tag': prim, 'Secondary tag': sec, 'Title / role': clean(r.get('title')),
               'Organization / brand': clean(r.get('organization')), 'Brand website': '', 'Booth': '',
               'RSNA 2026 status': 'Confirmed (program/official role)' if prim in ('Authorized Official', 'Speaker') else 'Very likely (role typically attends)',
               'Signal / evidence': clean(r.get('title')), 'Evidence URL': clean(r.get('source_url')),
               'LinkedIn': li, 'X / Twitter': clean(r.get('x_handle')), 'Instagram': '', 'Other social / channel': '',
               'Public email': clean(r.get('public_email')), 'Phone': clean(r.get('phone')),
               'Source': 'Nimble web research agent – official pages'}
        if generic:
            orgc.append({'Contact': name, 'Purpose': clean(r.get('title')), 'Email': rec['Public email'], 'Phone': rec['Phone'], 'Source': rec['Evidence URL']})
        else:
            if name == 'Mark G. Watson': rec['Public email'] = ''  # agent gave generic customerservice@ for him; kept in org contacts
            people.append(rec)
for r in csv.DictReader(open(R + '/rsna_org_contacts.tsv'), delimiter='\t'):
    if r['email'] and not any(o['Email'] == r['email'] for o in orgc):
        orgc.append({'Contact': r['name'], 'Purpose': r['title'], 'Email': r['email'], 'Phone': r['phone'], 'Source': r['source']})

# ---------------- manual signals ----------------
PT = {'Brand/Exhibitor rep': ('Brand Representative', 'Exhibitor rep (posted booth)'),
      'Official/Committee': ('Authorized Official', 'RSNA committee / program'),
      'Radiology practice leader': ('Radiologist / Clinical Leader', 'Practice leader'),
      'Industry/Service provider': ('Service Provider', 'Industry / services'),
      'Attendee - presenter': ('Speaker', 'Abstract presenter'),
      'Attendee - faculty': ('Speaker', 'Session faculty / moderator'),
      'Attendee - invited faculty': ('Speaker', 'Invited faculty'),
      'Attendee - radiologist': ('Radiologist / Clinical Leader', 'Attendee'),
      'Attendee - international young academic': ('Speaker', 'RSNA IRIYA program participant'),
      'Key opinion leader / Speaker': ('Influencer', 'Key opinion leader (KOL) + speaker'),
      'Startup founder / presenter': ('Startup Founder', 'Founder + presenter'),
      'Influencer (technologist community)': ('Influencer', 'Technologist community creator')}
for r in csv.DictReader(open(R + '/manual_signals.tsv'), delimiter='\t'):
    p, s = PT.get(r['person_type'], ('Other', r['person_type']))
    exr = match_ex(r['company']) if r['company'] else None
    people.append({'Name': r['name'], 'Primary tag': p, 'Secondary tag': s, 'Title / role': r['title_or_role'],
        'Organization / brand': r['company'], 'Brand website': '', 'Booth': r['booth'] or (exr or {}).get('booth', ''),
        'RSNA 2026 status': 'Confirmed (public post)', 'Signal / evidence': r['signal'], 'Evidence URL': r['url'],
        # a personal post URL (/posts/<vanity>_...) carries the author's profile vanity; company-page posts do not
        'LinkedIn': re.sub(r'/posts/([^_]+)_.*', r'/in/\1', r['url']) if '/posts/' in r['url'] and '/posts/forensic-radiology-group' not in r['url'] else '',
        'X / Twitter': '', 'Instagram': '', 'Other social / channel': '', 'Public email': '', 'Phone': '',
        'Source': 'Manual web search (LinkedIn posts indexed by search engines)'})

# ---------------- influencers ----------------
for f in glob.glob(R + '/agent_influencers.json'):
    rows, low = load_agent(f)
    for i, r in enumerate(rows):
        oth = '; '.join(x for x in [clean(r.get('youtube_or_podcast')), ('TikTok ' + clean(r.get('tiktok_handle'))) if clean(r.get('tiktok_handle')) else '', clean(r.get('website'))] if x)
        ev = clean(r.get('rsna_evidence'))
        m = re.search(r'https?://\S+', ev)
        people.append({'Name': clean(r.get('name')), 'Primary tag': 'Influencer', 'Secondary tag': clean(r.get('influencer_type')),
            'Title / role': clean(r.get('role_title')), 'Organization / brand': clean(r.get('organization')), 'Brand website': '', 'Booth': '',
            'RSNA 2026 status': 'Confirmed (RSNA 2026 evidence)' if re.search(r'RSNA\s?2026|RSNA26|#RSNA2026', ev, re.I) else 'Likely (attended prior RSNA / regular)',
            'Signal / evidence': ev + (f" | followers: {clean(r.get('approx_followers'))}" if clean(r.get('approx_followers')) else ''),
            'Evidence URL': m.group(0).rstrip(').,;') if m else '',
            'LinkedIn': clean(r.get('linkedin_url')), 'X / Twitter': clean(r.get('x_handle')), 'Instagram': clean(r.get('instagram_handle')),
            'Other social / channel': oth, 'Public email': clean(r.get('public_contact_email')), 'Phone': '',
            'Source': 'Nimble web research agent – social profiles, RSNA program, posts' + ('; verify: ' + ', '.join(sorted(low[i])) if i in low else '')})

# ---------------- attendance signals ----------------
TMAP = [('brand', 'Brand Representative', 'Exhibitor rep (posted about RSNA 2026)'), ('exhibitor', 'Brand Representative', 'Exhibitor rep (posted about RSNA 2026)'),
        ('founder', 'Startup Founder', 'Founder (posted about RSNA 2026)'), ('investor', 'Investor', 'Investor'),
        ('media', 'Media / Press', 'Media'), ('radiologist', 'Radiologist / Clinical Leader', 'Attendee (posted)'), ('clinician', 'Radiologist / Clinical Leader', 'Attendee (posted)'),
        ('leader', 'Radiologist / Clinical Leader', 'Imaging leader at provider')]
for f in glob.glob(R + '/agent_signals.json'):
    rows, low = load_agent(f)
    for i, r in enumerate(rows):
        pt = clean(r.get('person_type')).lower(); prim, sec = 'Interested / Attending', clean(r.get('person_type'))
        for k, p, s in TMAP:
            if k in pt: prim, sec = p, s; break
        sig = clean(r.get('signal'))
        if re.search(r'\bspeak|\bpresent|\bpanel|moderat|faculty|abstract|exhibit has been accepted|educational exhibit', sig, re.I) and prim not in ('Brand Representative',): prim, sec = 'Speaker', sec or 'Speaker'
        if re.search(r'recruit|talent acquisition', clean(r.get('title')) + ' ' + sig, re.I): prim, sec = 'Health System Recruiter', 'Recruiting at an exhibiting health system / practice'
        people.append({'Name': clean(r.get('name')), 'Primary tag': prim, 'Secondary tag': sec, 'Title / role': clean(r.get('title')),
            'Organization / brand': clean(r.get('company')), 'Brand website': clean(r.get('company_website')), 'Booth': clean(r.get('booth')),
            'RSNA 2026 status': 'Likely (tagged in / associated with an RSNA 2026 post)' if re.search(r'^Tagged|commenter|Technical Blog', sig, re.I) else 'Confirmed (public post)',
            'Signal / evidence': sig + (f" [{clean(r.get('platform'))}]" if clean(r.get('platform')) else ''),
            'Evidence URL': clean(r.get('post_url')), 'LinkedIn': clean(r.get('linkedin_url')), 'X / Twitter': clean(r.get('x_handle')), 'Instagram': '',
            'Other social / channel': '', 'Public email': '', 'Phone': '',
            'Source': 'Nimble web research agent – public posts' + ('; verify: ' + ', '.join(sorted(low[i])) if i in low else '')})

# ---------------- dedupe + enrich people ----------------
brand_by_org = {norm(b['Company']): b for b in brands}
merged = {}
for p in people:
    if not p['Name']: continue
    k = norm(re.sub(r',.*$|\b(dr|md|phd|mba|prof)\b\.?|\s[A-Z]\.(?=\s)', '', p['Name'], flags=re.I))
    if k in merged:
        q = merged[k]
        for f, v in p.items():
            if v and not q.get(f): q[f] = v
        if p['Primary tag'] != q['Primary tag'] and p['Primary tag'] not in q['Secondary tag']:
            q['Secondary tag'] = (q['Secondary tag'] + '; also ' + p['Primary tag']).strip('; ')
        if 'Confirmed' in p['RSNA 2026 status'] and 'Confirmed' not in q['RSNA 2026 status']:
            keep = q['Primary tag'] in ('Influencer', 'Speaker', 'Authorized Official', 'Society Official', 'Media / Press')
            for f in ('RSNA 2026 status', 'Title / role', 'Organization / brand', 'Booth', 'Signal / evidence', 'Evidence URL') + (() if keep else ('Primary tag',)):
                if p.get(f): q[f] = p[f]
        continue
    merged[k] = dict(p)
people = list(merged.values())
for p in people:
    b = brand_by_org.get(norm(p['Organization / brand']))
    if b:
        p['Brand website'] = p['Brand website'] or b['Website']
        p['Booth'] = p['Booth'] or b['Booth']
    if p['LinkedIn'] and '/posts/' in p['LinkedIn']: p['LinkedIn'] = ''
    has_email = bool(p['Public email'])
    p['Email status'] = 'Published on official/public page' if has_email else ('Not public – enrich from LinkedIn URL (Apollo/Hunter/Crustdata)' if p['LinkedIn'] else 'Not public – find LinkedIn first')
    ch = 'Email' if has_email else 'LinkedIn DM / connect' if p['LinkedIn'] else 'X DM' if p['X / Twitter'] else 'Instagram DM' if p['Instagram'] else 'Via company booth / meeting form' if p['Booth'] else 'Research further'
    p['Best first channel'] = ch
    conf = 'Confirmed' in p['RSNA 2026 status']
    reach = has_email or bool(p['LinkedIn'] or p['X / Twitter'] or p['Instagram'])
    p['Priority'] = 'A' if conf and reach else 'B' if (conf or reach) else 'C'

ORDER = ['Priority', 'Name', 'Primary tag', 'Secondary tag', 'Title / role', 'Organization / brand', 'Brand website', 'Booth',
         'RSNA 2026 status', 'Signal / evidence', 'Evidence URL', 'LinkedIn', 'X / Twitter', 'Instagram', 'Other social / channel',
         'Public email', 'Phone', 'Email status', 'Best first channel', 'Source']
TAGORDER = ['Authorized Official', 'Speaker', 'Influencer', 'Media / Press', 'Society Official', 'Brand Representative', 'Startup Founder', 'Health System Recruiter', 'Investor', 'Radiologist / Clinical Leader', 'Service Provider', 'Interested / Attending', 'Other']
people.sort(key=lambda p: (p['Priority'], TAGORDER.index(p['Primary tag']) if p['Primary tag'] in TAGORDER else 99, p['Organization / brand'], p['Name']))
brands.sort(key=lambda b: (b['Segment'], b['Company']))
for r in ex: r.setdefault('enriched', '')
json.dump({'people': people, 'people_cols': ORDER, 'brands': brands, 'exhibitors': ex, 'orgc': orgc}, open(S + '/merged.json', 'w'), indent=1)
print('people', len(people), 'brands', len(brands), 'exhibitors', len(ex), 'org contacts', len(orgc))
import collections
print(collections.Counter(p['Primary tag'] for p in people))
print(collections.Counter(p['Priority'] for p in people))
