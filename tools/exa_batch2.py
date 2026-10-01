#!/usr/bin/env python3
"""v2: read each organization's own website first, search Exa only for the rest.

Per organization:
  1. Fetch the homepage and its team/staff/about/contact pages (plain HTTP, free).
  2. Pull published emails, phones and social links from those pages.
  3. Mark each listed person "confirmed_on_site" if their name appears on those pages.
  4. Run Exa searches only for people not confirmed (plus org socials/contacts if the
     site did not publish them, and a staff-discovery search if few people are listed).

Output: OUT/<org_id>/ raw files, OUT/<org_id>/summary.json, and OUT/results.csv.
Resumable. Use --dry-run to see what would be searched.

  python3 exa_batch2.py --orgs ORG00001,ORG00002 --people people.csv --orgfile orgs.csv
"""
import argparse, csv, json, re, subprocess, time, urllib.request, urllib.parse
from html.parser import HTMLParser
from pathlib import Path

try:  # use the operating system's trusted certificates (needed behind VPNs / security software)
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

UA = {"User-Agent": "Mozilla/5.0 (compatible; lead-research/1.0)"}
PAGE_WORDS = re.compile(r"about|team|staff|physician|doctor|provider|radiolog|leader|manage|who-we-are|contact|our-", re.I)
SOCIAL = re.compile(r"https?://(?:www\.)?(?:facebook|instagram|linkedin|twitter|x|youtube)\.com/[^\s\"'<>)]+", re.I)
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE = re.compile(r"\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b")
CREDS = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|rn|rt|dr\.?)\b", re.I)


class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.text = []; self.skip = 0
    def handle_starttag(self, t, a):
        if t in ("script", "style"): self.skip += 1
        if t == "a":
            h = dict(a).get("href")
            if h: self.links.append(h)
    def handle_endtag(self, t):
        if t in ("script", "style") and self.skip: self.skip -= 1
    def handle_data(self, d):
        if not self.skip and d.strip(): self.text.append(d.strip())


LAST_ERR = {"msg": ""}


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
            if "html" not in r.headers.get("Content-Type", "html"): return ""
            return r.read(2_000_000).decode("utf-8", "ignore")
    except Exception as e:
        LAST_ERR["msg"] = f"{type(e).__name__}: {e}"[:160]
        return ""


def parse(html):
    p = Links(); p.feed(html); return p.links, " ".join(p.text)


def crawl(site, maxpages=6):
    if not site: return {}, ""
    base = site if site.startswith("http") else "https://" + site
    pages, text, raw = {}, [], ""
    html = get(base)
    if not html and not site.startswith("http"):
        base = "http://" + site; html = get(base)
    if not html: return {}, ""
    links, t = parse(html); text.append(t); raw += html
    host = urllib.parse.urlparse(base).netloc.replace("www.", "")
    todo = []
    for l in links:
        u = urllib.parse.urljoin(base, l.split("#")[0])
        pu = urllib.parse.urlparse(u)
        if pu.netloc.replace("www.", "") == host and PAGE_WORDS.search(pu.path) and u not in todo and u != base:
            todo.append(u)
    for u in todo[: maxpages - 1]:
        h = get(u)
        if h:
            raw += h; text.append(parse(h)[1]); pages[u] = 1
        time.sleep(0.5)
    full = " ".join(text)
    info = {"pages": [base] + list(pages),
            "emails": sorted(set(EMAIL.findall(raw)))[:15],
            "phones": sorted(set(PHONE.findall(full)))[:15],
            "social": sorted(set(SOCIAL.findall(raw)))[:15]}
    return info, full


def name_found(name, text):
    n = re.sub(r"\(.*?\)", " ", name); n = CREDS.sub(" ", n)
    parts = [x for x in re.split(r"[\s,]+", n) if len(x) > 1 or x.isalpha()]
    parts = [x.strip(".") for x in parts if x.strip(".")]
    if len(parts) < 2: return ""
    first, last = re.escape(parts[0]), re.escape(parts[-1])
    m = re.search(rf"\b{first}\b.{{0,30}}\b{last}\b|\b{last}\b,\s*{first}\b", text, re.I)
    if not m: return ""
    return text[max(0, m.start() - 80): m.end() + 140].replace("\n", " ")


def exa(query, n):
    r = subprocess.run(["mcporter", "call", "exa.web_search_exa", f"query={query}", f"numResults={n}"],
                       capture_output=True, text=True, timeout=120)
    return r.stdout if r.returncode == 0 else f"ERROR rc={r.returncode}\n{r.stderr}"


def slug(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--orgs", required=True); ap.add_argument("--people", required=True)
    ap.add_argument("--orgfile", required=True); ap.add_argument("--out", default="exa_out2")
    ap.add_argument("--num", type=int, default=5); ap.add_argument("--delay", type=float, default=3.0)
    ap.add_argument("--max-people", type=int, default=40); ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    orgs = {r["org_id"]: r for r in csv.DictReader(open(a.orgfile, newline="", encoding="utf-8"))}
    people = {}
    for r in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        people.setdefault(r["org_id"], []).append(r)
    out = Path(a.out); out.mkdir(exist_ok=True)
    rf = out / "results.csv"
    res = csv.writer(open(rf, "w", newline="", encoding="utf-8"))  # rebuilt every run
    if True: res.writerow(["org_id", "org_name", "person_id", "name", "input_title", "status", "site_context"])

    for oid in a.orgs.split(","):
        o = orgs.get(oid)
        if not o: print(f"!! unknown {oid}"); continue
        d = out / oid; d.mkdir(exist_ok=True)
        name, states = o["org_name"], o["states"]
        sj = d / "summary.json"
        cached = json.loads(sj.read_text()) if sj.exists() else {}
        if cached.get("pages"):  # an empty summary means the fetch failed: try again
            info = cached; text = (d / "site_text.txt").read_text() if (d / "site_text.txt").exists() else ""
        else:
            info, text = crawl(o["website"]); sj.write_text(json.dumps(info, indent=1)); (d / "site_text.txt").write_text(text)
        if not info.get("pages") and LAST_ERR["msg"]:
            print(f"    !! site fetch failed: {LAST_ERR['msg']}")
            if "CERTIFICATE" in LAST_ERR["msg"]:
                print("       fix: python3 -m pip install truststore   (then re-run)")
        print(f"[{oid}] {name}: site pages={len(info.get('pages', []))} emails={len(info.get('emails', []))} "
              f"phones={len(info.get('phones', []))} social={len(info.get('social', []))}")
        plist = people.get(oid, [])[: a.max_people]
        todo, confirmed = [], 0
        for p in plist:
            ctx = name_found(p["name"], text) if text else ""
            if ctx: confirmed += 1
            else: todo.append(p)
            res.writerow([oid, name, p["person_id"], p["name"], p["title"],
                          "confirmed_on_site" if ctx else "needs_search", ctx])
        jobs = []
        if not any("linkedin" in s.lower() for s in info.get("social", [])):
            jobs.append(("org-socials", f"{name} {o['website']} {states} official LinkedIn Facebook Instagram page"))
        if not info.get("emails") or not info.get("phones"):
            jobs.append(("org-contact", f"{name} {o['website']} contact phone email address"))
        if len(plist) < 3 or len(todo) > len(plist) / 2:
            jobs.append(("org-staff", f"{name} {o['website']} administrator OR manager OR director OR owner OR radiologist"))
        for p in todo:
            jobs.append((f"person-{p['person_id']}-{slug(p['name'])}",
                         f'"{p["name"]}" {p["title"] or p["credentials"] or "radiology"} {name} {states}'))
        print(f"    confirmed on site: {confirmed}/{len(plist)}; Exa searches queued: {len(jobs)}")
        for tag, q in jobs:
            f = d / f"{tag}.txt"
            if f.exists(): continue
            print(f"    search {tag}: {q}")
            if a.dry_run: continue
            r = exa(q, a.num)
            if r.startswith("ERROR"):  # do not save failures, so a re-run retries them
                print(f"    !! failed, will retry next run: {r[:120]!r}"); continue
            f.write_text(f"QUERY: {q}\n\n{r}"); time.sleep(a.delay)


if __name__ == "__main__":
    main()
