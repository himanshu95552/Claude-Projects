#!/usr/bin/env python3
"""Full-list runner: read each organization's website, then search Exa for what is missing.

Stages (all resumable, safe to stop and restart):
  1. crawl   fetch each site's team/staff/about/contact pages (parallel, free)
  2. search  match people against the site text; Exa-search only the unresolved ones
  3. merge   build OUT/results.csv (one row per person) and OUT/orgs.csv (one row per org)

People status:  confirmed_on_site  (full name found)
                possible_on_site   (first and last name both on the site, not adjacent)
                needs_search       (searched via Exa)

Examples
  python3 exa_run.py --orgs ORG00081,ORG00116 --people P.csv --orgfile O.csv
  python3 exa_run.py --orgs all --offset 0 --limit 200 --people P.csv --orgfile O.csv
  python3 exa_run.py --orgs all --stage merge --people P.csv --orgfile O.csv
"""
import argparse, collections, csv, json, re, shutil, subprocess, sys, threading, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path

try:  # trust the operating system's certificates (VPNs / security software re-sign traffic)
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

UA = {"User-Agent": "Mozilla/5.0 (compatible; lead-research/1.0)"}
TEAM = re.compile(r"team|staff|physician|doctor|provider|radiolog|leader|manage|executive|our-people|meet|bio", re.I)
MID = re.compile(r"about|who-we-are|our-", re.I)
LOW = re.compile(r"contact|location", re.I)
SOCIAL = re.compile(r"https?://(?:www\.)?(?:facebook|instagram|linkedin|twitter|x|youtube)\.com/[^\s\"'<>)]+", re.I)
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE = re.compile(r"\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b")
CREDS = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|rn|rt|dr\.?|np|pa-c|fnp-c|dpm|dc)\b", re.I)
JUNK_EXT = re.compile(r"\.(png|jpe?g|gif|svg|webp|css|js|pdf|zip)$", re.I)
ERR = {"msg": ""}
DM = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|partner|administrator|director|manager|head of|supervisor|officer|controller|coordinator|executive|operations|billing|revenue|information technology|marketing|business development|practice|lead)\b", re.I)


class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.text = []; self.skip = 0
    def handle_starttag(self, t, a):
        if t in ("script", "style"): self.skip += 1
        if t == "a" and dict(a).get("href"): self.links.append(dict(a)["href"])
    def handle_endtag(self, t):
        if t in ("script", "style") and self.skip: self.skip -= 1
    def handle_data(self, d):
        if not self.skip and d.strip(): self.text.append(d.strip())


def get_ex(url):
    """(html, error). One slow retry if the site says 429 (too many requests)."""
    for attempt in (1, 2):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
                if "html" not in r.headers.get("Content-Type", "html"): return "", ""
                return r.read(2_000_000).decode("utf-8", "ignore"), ""
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt == 1:
                time.sleep(10); continue
            return "", f"HTTPError: HTTP Error {e.code}"
        except Exception as e:
            return "", f"{type(e).__name__}: {e}"[:140]
    return "", "HTTPError: HTTP Error 429"


def get(url): return get_ex(url)[0]


def parse(h):
    p = Page(); p.feed(h); return p.links, " ".join(p.text)


def rank(path):
    return 0 if TEAM.search(path) else 1 if MID.search(path) else 2 if LOW.search(path) else 9


def crawl(site, max_pages):
    if not site: return {"error": "no website"}, ""
    base = site if site.startswith("http") else "https://" + site
    html, err = get_ex(base)
    if not html and not site.startswith("http") and "403" not in err:
        base = "http://" + site; html, err2 = get_ex(base); err = err or err2
    if not html: return {"error": err or "empty page"}, ""
    host = urllib.parse.urlparse(base).netloc.replace("www.", "")
    raw, texts, seen = html, [parse(html)[1]], {base}
    def cand(links, src):
        out = []
        for l in links:
            u = urllib.parse.urljoin(src, l.split("#")[0].split("?")[0]); pu = urllib.parse.urlparse(u)
            if pu.netloc.replace("www.", "") == host and u not in seen and not JUNK_EXT.search(pu.path) and rank(pu.path) < 9:
                out.append((rank(pu.path), len(pu.path), u))
        return sorted(set(out))
    queue = cand(parse(html)[0], base); pages = [base]; depth2 = True
    while queue and len(pages) < max_pages:
        _, _, u = queue.pop(0)
        if u in seen: continue
        seen.add(u); h = get(u)
        if not h: continue
        raw += h; links, t = parse(h); texts.append(t); pages.append(u)
        if depth2 and TEAM.search(urllib.parse.urlparse(u).path):  # follow one level into bio pages
            queue = sorted(set(queue + cand(links, u)))
        time.sleep(0.3)
    full = " ".join(texts)
    info = {"pages": pages,
            "emails": sorted({e for e in EMAIL.findall(raw) if not JUNK_EXT.search(e)})[:20],
            "phones": sorted(set(PHONE.findall(full)))[:20],
            "social": sorted(set(SOCIAL.findall(raw)))[:20]}
    return info, full


def match(name, text):
    """('confirmed'|'possible'|'', context)"""
    n = CREDS.sub(" ", re.sub(r"\(.*?\)", " ", name))
    parts = [x.strip(".,") for x in re.split(r"[\s,]+", n) if x.strip(".,")]
    if len(parts) < 2 or not text: return "", ""
    first, last = re.escape(parts[0]), re.escape(parts[-1])
    m = re.search(rf"\b{first}\b.{{0,16}}\b{last}\b|\b{last}\b,\s*{first}\b", text, re.I)
    if m: return "confirmed", text[max(0, m.start() - 80): m.end() + 140]
    if len(text) > 2000 and re.search(rf"\b{first}\b", text, re.I) and re.search(rf"\b{last}\b", text, re.I):
        m = re.search(rf"\b{last}\b", text, re.I)
        return "possible", text[max(0, m.start() - 100): m.end() + 100]
    return "", ""


def exa(query, n, delay):
    try:
        r = subprocess.run(["mcporter", "call", "exa.web_search_exa", f"query={query}", f"numResults={n}"],
                           capture_output=True, text=True, timeout=120)
        out = r.stdout if r.returncode == 0 and r.stdout.strip() else f"ERROR rc={r.returncode} {r.stderr[:200]}"
    except Exception as e:
        out = f"ERROR {type(e).__name__}: {e}"[:200]
    time.sleep(delay)
    return out


SOC_SKIP = {"facebook": {"sharer", "sharer.php", "share", "share.php", "tr", "plugins", "dialog", "2008", "login", "login.php", "policies", "help", "watch", "hashtag", "events", "groups", "pages", "tr.php", "l.php", "home.php", "legal", "privacy", "about"},
            "instagram": {"accounts", "p", "reel", "reels", "explore", "stories", "tv", "about", "legal"},
            "x": {"share", "intent", "home", "search", "i", "hashtag", "login", "privacy", "tos", "settings", "widgets.js"},
            "youtube": set()}
ROLE_MAIL = re.compile(r"^(info|contact|contactus|office|admin|administrator|billing|scheduling|schedule|appointments?|marketing|hr|careers?|jobs|media|press|privacy|compliance|support|service|services|records|medrec\w*|referrals?|hello|mail|frontdesk|reception|webmaster|noreply|no-reply|sales|help|feedback|customerservice|patientservices|orders|intake|registration|radiology|imaging|mri|xray|[a-z]*billing|[a-z]*scheduling|estimatedcost|pricing)@", re.I)
JUNK_MAIL = re.compile(r"(sentry\.io|wixpress|example\.com|domain\.com|yoursite|email\.com$|\.(png|jpe?g|gif|svg|webp)$)|^[0-9a-f]{20,}@", re.I)


def clean_social(urls):
    """Pick one profile URL per platform from a raw list of social links."""
    import html as _h, collections as _c
    pick = {k: _c.Counter() for k in ("linkedin", "facebook", "instagram", "x", "youtube")}
    for u in urls:
        u = _h.unescape(_h.unescape(u)).split("&quot")[0].split("&#34")[0].strip(" \"'\\,;}{)")
        m = re.match(r"https?://(?:www\.|m\.)?([a-z]+)\.com/(.+)$", u, re.I)
        if not m: continue
        host, path = m.group(1).lower(), m.group(2)
        seg = path.split("?")[0].strip("/").split("/")
        if host == "linkedin" and len(seg) >= 2 and seg[0] in ("company", "showcase", "in", "school") and seg[1] and "share" not in seg[1]:
            pick["linkedin"]["https://www.linkedin.com/" + "/".join(seg[:2])] += 1
        elif host == "facebook" and seg and seg[0].lower() not in SOC_SKIP["facebook"] and not re.search(r"[<>{}]", path):
            if seg[0] == "profile.php" and "id=" in path: pick["facebook"]["https://www.facebook.com/profile.php?id=" + re.search(r"id=(\d+)", path).group(1)] += 1
            elif seg[0] in ("p", "people", "pages") and len(seg) >= 2: pick["facebook"]["https://www.facebook.com/" + "/".join(seg[:3 if seg[0] == "pages" and len(seg) > 2 else 2])] += 1
            elif re.fullmatch(r"[A-Za-z0-9.\-]{3,}", seg[0]): pick["facebook"]["https://www.facebook.com/" + seg[0]] += 1
        elif host == "instagram" and seg and seg[0].lower() not in SOC_SKIP["instagram"] and re.fullmatch(r"[A-Za-z0-9._]{2,30}", seg[0]):
            pick["instagram"]["https://www.instagram.com/" + seg[0]] += 1
        elif host in ("twitter", "x") and seg and seg[0].lower() not in SOC_SKIP["x"] and re.fullmatch(r"@?[A-Za-z0-9_]{2,15}", seg[0]):
            pick["x"]["https://x.com/" + seg[0].lstrip("@")] += 1
        elif host == "youtube" and seg and (seg[0].startswith("@") or (seg[0] in ("channel", "c", "user") and len(seg) > 1)):
            pick["youtube"]["https://www.youtube.com/" + "/".join(seg[:2] if seg[0] in ("channel", "c", "user") else seg[:1])] += 1
    return {k: (v.most_common(1)[0][0] if v else "") for k, v in pick.items()}


def split_emails(emails):
    named, role = [], []
    for e in emails:
        e = e.strip().strip(".,;")
        if not e or JUNK_MAIL.search(e) or e.count("@") != 1: continue
        (role if ROLE_MAIL.match(e) else named).append(e.lower())
    return sorted(set(named)), sorted(set(role))


def slug(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:50]


def do_crawl(o, d, max_pages):
    sj = d / "summary.json"
    try:
        old = json.loads(sj.read_text())
        if old.get("pages"): return o["org_id"], "cached", ""
        if "403" in old.get("error", ""): return o["org_id"], 0, "blocked (403), skipped"  # do not retry blocks
    except Exception: pass
    info, text = crawl(o["website"], max_pages)
    sj.write_text(json.dumps(info, indent=1)); (d / "site_text.txt").write_text(text)
    return o["org_id"], len(info.get("pages", [])), info.get("error", "")


def domain(u):
    return re.sub(r"^https?://(www\.)?", "", (u or "").lower()).split("/")[0]


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--orgs", required=True, help="'all', a comma list, or a file with one org_id per line")
    a.add_argument("--people", required=True); a.add_argument("--orgfile", required=True)
    a.add_argument("--out", default="exa_run_out"); a.add_argument("--stage", default="all", choices=["all", "crawl", "search", "merge"])
    a.add_argument("--offset", type=int, default=0); a.add_argument("--limit", type=int, default=0)
    a.add_argument("--num", type=int, default=5); a.add_argument("--delay", type=float, default=3.0)
    a.add_argument("--workers", type=int, default=1, help="parallel Exa calls (try 3)")
    a.add_argument("--crawl-workers", type=int, default=8); a.add_argument("--max-pages", type=int, default=12)
    a.add_argument("--max-people", type=int, default=40); a.add_argument("--dry-run", action="store_true")
    a.add_argument("--search-filter", default="all", choices=["all", "dm"], help="dm = Exa-search only people whose title looks like a decision-maker")
    a.add_argument("--max-searches", type=int, default=0, help="hard cap on Exa searches in this run (0 = no cap); protects your balance")
    a = a.parse_args()

    orgs = {r["org_id"]: r for r in csv.DictReader(open(a.orgfile, newline="", encoding="utf-8"))}
    people = {}
    for r in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        people.setdefault(r["org_id"], []).append(r)
    if a.orgs == "all": ids = sorted(orgs)
    elif Path(a.orgs).exists(): ids = [x.strip() for x in open(a.orgs) if x.strip()]
    else: ids = a.orgs.split(",")
    ids = [i for i in ids if i in orgs]
    ids = ids[a.offset: a.offset + a.limit] if a.limit else ids[a.offset:]
    out = Path(a.out); out.mkdir(exist_ok=True)
    for i in ids: (out / i).mkdir(exist_ok=True)
    print(f"{len(ids)} organizations selected")
    if not shutil.which("mcporter") and a.stage in ("all", "search") and not a.dry_run:
        sys.exit("mcporter not found on PATH")

    do_crawl_stage = a.stage in ("all", "crawl")
    do_search_stage = a.stage in ("all", "search")
    lock = threading.Lock(); st = collections.Counter(); t0 = time.time()
    exa_ex = ThreadPoolExecutor(a.workers) if do_search_stage and not a.dry_run else None

    def build_jobs(oid):
        o, d = orgs[oid], out / oid
        try: info = json.loads((d / "summary.json").read_text())
        except Exception: info = {}
        tf = d / "site_text.txt"; text = tf.read_text() if tf.exists() else ""
        plist = people.get(oid, [])[: a.max_people]
        rows, need, jobs = [], [], []
        for p in plist:
            m, ctx = match(p["name"], text)
            status = {"confirmed": "confirmed_on_site", "possible": "possible_on_site"}.get(m, "needs_search")
            if status == "needs_search":
                if a.search_filter == "dm" and not DM.search(p["title"] or ""): status = "not_searched"
                else: need.append(p)
            rows.append([oid, o["org_name"], p["person_id"], p["name"], p["title"], status, ctx.replace("\n", " ")])
        with open(d / "people_status.csv", "w", newline="", encoding="utf-8") as f:
            csv.writer(f).writerows(rows)
        states = o["states"]; nm = o["org_name"]; web = o["website"]
        if not any("linkedin" in x.lower() for x in info.get("social", [])):
            jobs.append((d / "org-socials.txt", f"{nm} {web} {states} official LinkedIn Facebook Instagram page"))
        if not info.get("emails") or not info.get("phones"):
            jobs.append((d / "org-contact.txt", f"{nm} {web} contact phone email address"))
        unresolved = sum(1 for r_ in rows if r_[5] in ("needs_search", "not_searched"))
        if len(plist) < 3 or unresolved > len(plist) / 2:
            jobs.append((d / "org-staff.txt", f"{nm} {web} administrator OR manager OR director OR owner OR radiologist"))
        for p in need:
            jobs.append((d / f"person-{p['person_id']}-{slug(p['name'])}.txt",
                         f'"{p["name"]}" {p["title"] or p["credentials"] or "radiology"} {nm} {states}'))
        return [(f, q) for f, q in jobs if not f.exists()]

    def run_job(j):
        f, q = j; r = exa(q, a.num, a.delay)
        if r.startswith("ERROR"):
            time.sleep(20)  # back off after a failure (rate limit or network blip)
            return f, q, r
        f.write_text(f"QUERY: {q}\n\n{r}"); return f, q, None

    def exa_done(fut):
        f, q, err = fut.result()
        with lock:
            st["bad" if err else "ok"] += 1; n = st["ok"] + st["bad"]
            if err and st["bad"] <= 5: print(f"  !! search failed (retried next run): {q[:60]}  {err[:70]}")

    stop = threading.Event(); crawl_err = collections.Counter(); crawl_state = {"done": 0, "total": 0}

    def ticker():
        while not stop.wait(15):
            with lock:
                n = st["ok"] + st["bad"]; mins = max((time.time() - t0) / 60, 0.01); rate = n / mins
                left = max(st["queued"] - n, 0)
                eta = f"ETA ~{left / rate:.0f} min" if rate > 0 and n >= 5 else "ETA ..."
                crawl = f"sites {crawl_state['done']}/{crawl_state['total']}" if crawl_state["total"] else "sites -"
                print(f"  [{mins:4.1f} min] {crawl} | searches {n}/{st['queued']} queued ({rate:.0f}/min, {eta}) | search failures {st['bad']}", flush=True)

    threading.Thread(target=ticker, daemon=True).start()

    def queue_org(oid):
        jobs = build_jobs(oid)
        if a.max_searches:
            jobs = jobs[: max(a.max_searches - st["queued"], 0)]
            if len(jobs) == 0 and not st["capped"]: st["capped"] = 1; print(f"  cap of {a.max_searches} searches reached; remaining organizations are not searched this run", flush=True)
        with lock: st["queued"] += len(jobs)
        if exa_ex:
            for j in jobs: exa_ex.submit(run_job, j).add_done_callback(exa_done)

    if do_crawl_stage:
        by_dom = {}
        for i in ids:
            if orgs[i]["website"]: by_dom.setdefault(domain(orgs[i]["website"]), []).append(i)
            elif do_search_stage: queue_org(i)
        todo = [v[0] for v in by_dom.values()]
        print(f"  {len(todo)} distinct websites to crawl ({sum(len(v) - 1 for v in by_dom.values())} organizations share a site)")
        crawl_state["total"] = len(todo)
        done = fails = 0
        with ThreadPoolExecutor(a.crawl_workers) as ex:
            futs = {ex.submit(do_crawl, orgs[i], out / i, a.max_pages): i for i in todo}
            for f in as_completed(futs):
                oid, pages, err = f.result(); done += 1; fails += (pages == 0)
                dom = domain(orgs[oid]["website"])
                for sib in by_dom[dom][1:]:  # share the result with organizations on the same site
                    for fn in ("summary.json", "site_text.txt"):
                        if (out / oid / fn).exists(): shutil.copyfile(out / oid / fn, out / sib / fn)
                if pages == 0:
                    crawl_err["blocked by site (403)" if "403" in err else (err.split(":")[0] or "other")[:30]] += 1
                crawl_state["done"] = done
                if do_search_stage:  # start searching this organization right away
                    for member in by_dom[dom]: queue_org(member)
        print(f"  sites done: {done - fails} loaded, {fails} not readable {dict(crawl_err)}  (those go to Exa search)")
    elif do_search_stage:
        for oid in ids: queue_org(oid)
    if exa_ex: exa_ex.shutdown(wait=True)
    stop.set()
    if do_search_stage:
        print(f"{st['queued']} searches {'would run' if a.dry_run else 'queued'}; "
              f"{st['ok']} ok, {st['bad']} failed, {(time.time() - t0) / 60:.1f} min total")

    if a.stage in ("all", "search", "merge"):
        # merge every organization folder in OUT, so results from earlier batches are kept
        all_ids = sorted(p.name for p in out.iterdir() if p.is_dir() and p.name in orgs)
        with open(out / "results.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(["org_id", "org_name", "person_id", "name", "input_title", "status", "site_context"])
            for oid in all_ids:
                pf = out / oid / "people_status.csv"
                if pf.exists(): w.writerows(csv.reader(open(pf, newline="", encoding="utf-8")))
        with open(out / "orgs.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(["org_id", "org_name", "website", "site_pages", "linkedin", "facebook", "instagram", "x", "youtube", "emails_named", "emails_role", "phones"])
            for oid in all_ids:
                try: s = json.loads((out / oid / "summary.json").read_text())
                except Exception: s = {}
                soc = clean_social(s.get("social", [])); named, role = split_emails(s.get("emails", []))
                w.writerow([oid, orgs[oid]["org_name"], orgs[oid]["website"], len(s.get("pages", [])), soc["linkedin"], soc["facebook"],
                            soc["instagram"], soc["x"], soc["youtube"], "; ".join(named), "; ".join(role), "; ".join(s.get("phones", []))])
        print(f"wrote {out/'results.csv'} and {out/'orgs.csv'} ({len(all_ids)} organizations so far)")


if __name__ == "__main__":
    main()
