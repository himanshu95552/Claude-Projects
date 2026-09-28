"""Build the one-sheet, easy-to-read Alpha Nodus post tracker.

Run:  python build_simple.py  ->  AlphaNodus_Simple_Post_Tracker.xlsx
"""
import datetime as dt
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).with_name("AlphaNodus_Simple_Post_Tracker.xlsx")
FONT, NAVY, GREY = "Arial", "1F3864", "595959"
INPUT = PatternFill("solid", fgColor="FFF8DC")
CALC = PatternFill("solid", fgColor="EDEDED")
SIDE = Side(style="thin", color="D0D0D0")
BOX = Border(left=SIDE, right=SIDE, top=SIDE, bottom=SIDE)
WRAP = Alignment(wrap_text=True, vertical="top")
LANDING = "https://www.alphanodus.com/contact"


def font(bold=False, color="000000", size=10, italic=False):
    return Font(name=FONT, bold=bold, color=color, size=size, italic=italic)


def fill(hex_):
    return PatternFill("solid", fgColor=hex_)


PLATFORMS = ["LinkedIn", "Instagram", "X"]
FOLLOWERS = {"LinkedIn": 2640, "Instagram": 61, "X": 46}   # public counts, 28 Sep 2026
PILLARS = ["Product / Demo", "Operations Tips", "Revenue Cycle", "Industry Insight", "Case Study",
           "Thought Leadership", "Testimonial", "Regulatory", "Team / Culture", "Event"]
HOOKS = ["Stat / Number", "Question", "Story", "Contrarian", "How-To / List", "Customer Quote", "News"]
ACTIONS = ["Repeat", "Improve & Retry", "Stop", "Wait for Data"]

# (key, header, width, kind, number format, header note)
COLS = [
    ("date", "Date", 11, "in", "mm/dd/yyyy", None),
    ("platform", "Platform", 10, "in", None, None),
    ("what", "What Was Posted", 38, "in", None, "One line: the topic and the format (video, image, carousel, poll…)."),
    ("pillar", "Content Pillar", 15, "in", None, None),
    ("hook", "Hook Type", 13, "in", None, "How the first line grabs attention."),
    ("link", "Post Link", 24, "in", None, None),
    ("impr", "Impressions", 11, "in", "#,##0", "From the platform's analytics (X shows views publicly)."),
    ("reach", "Reach", 9, "in", "#,##0", "Unique people who saw it — from the platform's analytics."),
    ("likes", "Likes", 7, "in", "#,##0", None),
    ("comments", "Comments", 9, "in", "#,##0", None),
    ("shares", "Shares / Reposts", 9, "in", "#,##0", None),
    ("saves", "Saves", 7, "in", "#,##0", None),
    ("clicks", "Clicks", 7, "in", "#,##0", "All clicks on the post. LinkedIn: 'Clicks'. X: detail expands + profile visits + link clicks. Both platforms count these in their own engagement rate."),
    ("newfol", "New Followers (3 days after post)", 11, "in", "#,##0", "Followers gained on the post day + the next 2 days. LinkedIn doesn't credit follows to organic posts, so this is the closest fair signal."),
    ("target", "Target List Engaged?", 10, "in", None, "Did anyone from our target list (imaging / radiology center decision-makers) like, comment or share?"),
    ("eng", "Total Engagement", 10, "calc", "#,##0", "Likes + Comments + Shares + Saves + Link Clicks (same as LinkedIn's own definition)"),
    ("er", "Engagement Rate", 10, "calc", "0.0%", "Total Engagement ÷ Reach (or Impressions). Only if no post on that platform has impressions yet: ÷ followers in the box above."),
    ("rating", "Rating", 14, "calc", None, "Compared with our own average on the same platform — see the rule box above."),
    ("weak", "What Was Weak", 40, "in", None, None),
    ("improve", "What to Improve", 40, "in", None, None),
    ("action", "Next Action", 14, "in", None, None),
    ("url", "Tracking URL (use this link in the post)", 44, "calc", None, "Built automatically. Paste it in the post, first comment or bio so website visits can be traced to this post."),
]
L = {k: chr(ord("A") + i) for i, (k, *_rest) in enumerate(COLS)}
HDR, FIRST, LAST = 11, 12, 211

wb = Workbook()
ws = wb.active
ws.title = "Post Tracker"
ws.sheet_view.showGridLines = False

ws["A1"] = "Alpha Nodus — Social Post Tracker"
ws["A1"].font = font(True, NAVY, 16)
ws["A2"] = ("One row per post. Fill the yellow cells; grey cells calculate themselves. "
            "Check numbers 7 days after posting, then read the Rating and pick the Next Action.")
ws["A2"].font = font(italic=True, color=GREY)

# Summary box (A4:F8)
box_hdr = ["Platform", "Followers Today", "Posts", "Avg Engagement Rate", "Good Posts", "Below Standard Posts"]
for j, h in enumerate(box_hdr):
    c = ws.cell(4, 1 + j, h)
    c.font, c.fill, c.border = font(True, "FFFFFF"), fill(NAVY), BOX
    c.alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
ws.row_dimensions[4].height = 28
rng = lambda k: f"${L[k]}${FIRST}:${L[k]}${LAST}"
for i, p in enumerate(PLATFORMS):
    r = 5 + i
    ws.cell(r, 1, p).font = font(True)
    fc = ws.cell(r, 2, FOLLOWERS[p])
    fc.fill, fc.font, fc.number_format = INPUT, font(color="0000FF"), "#,##0"
    ws.cell(r, 3, f'=COUNTIF({rng("platform")},A{r})')
    ws.cell(r, 4, f'=IFERROR(AVERAGEIF({rng("platform")},A{r},{rng("er")}),"")').number_format = "0.0%"
    ws.cell(r, 5, f'=COUNTIFS({rng("platform")},A{r},{rng("rating")},"Good")')
    ws.cell(r, 6, f'=COUNTIFS({rng("platform")},A{r},{rng("rating")},"Below Standard")')
    for j in range(1, 7):
        cc = ws.cell(r, j)
        cc.border = BOX
        if j > 2:
            cc.fill, cc.font = CALC, font()
        cc.alignment = Alignment(horizontal="left" if j == 1 else "center")
ws["A8"] = "Followers Today: update every Monday."
ws["A8"].font = font(italic=True, color=GREY, size=9)
FOL_TABLE = "$A$5:$B$7"

# Rule box (H4:M9)
rules = [
    ("How the Rating works", True),
    ("Good = engagement rate at least 1.2× our average for that platform", False),
    ("Average = between 0.8× and 1.2× our average", False),
    ("Below Standard = under 0.8× our average", False),
    ("No Data Yet = numbers not entered, or fewer than 2 posts on that platform", False),
    ("Engagement Rate = (likes + comments + shares + saves + clicks) ÷ reach, or ÷ impressions if reach is blank", False),
    ("Why our own average: each platform behaves differently, and it improves as we post more.", False),
]
for i, (t, b) in enumerate(rules):
    c = ws.cell(4 + i, 8, t)
    c.font = font(b, NAVY if b else "000000", 11 if b else 10)
ws.cell(4, 8).fill = fill("DEEAF6")

# Legend
ws["S4"], ws["S5"], ws["S6"] = "Yellow = type here", "Grey = automatic", "Blue text = data (LinkedIn: page analytics export, Aug 28–Sep 26)"
ws["S4"].fill, ws["S5"].fill = INPUT, CALC
ws["S6"].font = font(color="0000FF")
ws["S7"] = "X: X analytics export (Sep 1–28). Instagram: public profile, 9/28/2026"
ws["S7"].font = font(color="0000FF")
for a in ("S4", "S5"):
    ws[a].font, ws[a].border = font(True), BOX

# Header row
for j, (key, head, width, kind, nf, note) in enumerate(COLS, start=1):
    c = ws.cell(HDR, j, head)
    c.font = font(True, "FFFFFF")
    c.fill = fill(NAVY if kind == "in" else "548235")
    c.alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
    c.border = BOX
    if note:
        c.comment = Comment(note, "Tracker")
    ws.column_dimensions[L[key]].width = width
ws.row_dimensions[HDR].height = 42


def formula(key, r):
    x = {k: f"{v}{r}" for k, v in L.items()}
    blank = f'OR({x["date"]}="",{x["platform"]}="")'
    has_views = (f'COUNTIFS({rng("platform")},{x["platform"]},{rng("impr")},">0")'
                 f'+COUNTIFS({rng("platform")},{x["platform"]},{rng("reach")},">0")')
    denom = (f'IF(N({x["reach"]})>0,{x["reach"]},IF(N({x["impr"]})>0,{x["impr"]},'
             f'IF({has_views}>0,"",INDEX($B$5:$B$7,MATCH({x["platform"]},$A$5:$A$7,0)))))')
    return {
        "eng": f'=IF({blank},"",IF(COUNT({x["likes"]}:{x["clicks"]})=0,"",SUM({x["likes"]}:{x["clicks"]})))',
        "er": f'=IF(OR({blank},{x["eng"]}=""),"",IFERROR({x["eng"]}/({denom}),""))',
        "rating": (f'=IF({blank},"",IF(OR({x["er"]}="",COUNTIFS({rng("platform")},{x["platform"]},{rng("er")},">=0")<2),"No Data Yet",'
                   f'IFERROR(IF({x["er"]}/AVERAGEIFS({rng("er")},{rng("platform")},{x["platform"]})>=1.2,"Good",'
                   f'IF({x["er"]}/AVERAGEIFS({rng("er")},{rng("platform")},{x["platform"]})>=0.8,"Average","Below Standard")),"Average")))'),
        "url": (f'=IF({blank},"","{LANDING}?utm_source="&IF({x["platform"]}="X","twitter",LOWER({x["platform"]}))'
                f'&"&utm_medium=social&utm_campaign="&IF({x["pillar"]}="","general",LOWER(SUBSTITUTE(SUBSTITUTE({x["pillar"]}," / ","-")," ","-")))'
                f'&"&utm_content="&LOWER(LEFT({x["platform"]},2))&"-"&TEXT({x["date"]},"yymmdd"))'),
    }[key]


for r in range(FIRST, LAST + 1):
    for j, (key, _h, _w, kind, nf, _n) in enumerate(COLS, start=1):
        c = ws.cell(r, j)
        c.font, c.border = font(), BOX
        c.fill = CALC if kind == "calc" else INPUT
        if key in ("what", "weak", "improve"):
            c.alignment = WRAP
        else:
            c.alignment = Alignment(vertical="top")
        if nf:
            c.number_format = nf
        if kind == "calc":
            c.value = formula(key, r)


def dv(key, items):
    v = DataValidation(type="list", formula1='"' + ",".join(items) + '"', allow_blank=True)
    ws.add_data_validation(v)
    v.add(f"{L[key]}{FIRST}:{L[key]}{LAST}")


dv("platform", PLATFORMS + ["Facebook", "YouTube"])
dv("pillar", PILLARS)
dv("hook", HOOKS)
dv("target", ["Yes", "No", "Not Checked"])
dv("action", ACTIONS)

rat = f"{L['rating']}{FIRST}:{L['rating']}{LAST}"
for word, bg, fg in (("Good", "C6EFCE", "006100"), ("Average", "FFEB9C", "9C5700"),
                     ("Below Standard", "FFC7CE", "9C0006"), ("No Data Yet", "EDEDED", GREY)):
    ws.conditional_formatting.add(rat, CellIsRule(operator="equal", formula=[f'"{word}"'], fill=fill(bg),
                                                  font=Font(name=FONT, bold=True, color=fg)))
act = f"{L['action']}{FIRST}:{L['action']}{LAST}"
for word, bg in (("Repeat", "C6EFCE"), ("Improve & Retry", "FFEB9C"), ("Stop", "FFC7CE"), ("Wait for Data", "EDEDED")):
    ws.conditional_formatting.add(act, CellIsRule(operator="equal", formula=[f'"{word}"'], fill=fill(bg)))

# September 2026 posts (public-profile pull on 28 Sep 2026; blanks = not public, fill from analytics)
D = dt.date
POSTS = [
    (D(2026, 9, 11), "LinkedIn", "3-min Gravity AI explainer video: 'Still running on fax, phones and payer portals?'", "Product / Demo", "Question",
     "https://www.linkedin.com/feed/update/urn:li:activity:7504198831056764928",
     413, None, 14, 0, 1, None, 24, 0,
     "Most seen (413) and most clicked (24) post of the month, but 0 comments, and only 198 of 413 people started the video.",
     "Keep video. Make a 30–45 sec cut with captions and the problem in the first 3 seconds, and end with one question to get comments.", "Improve & Retry"),
    (D(2026, 9, 14), "LinkedIn", "Text post: 'Scanners idle a third of the day, next slot 3 weeks out'", "Operations Tips", "Stat / Number",
     "https://www.linkedin.com/feed/update/urn:li:activity:7505309133571686400",
     322, None, 16, 0, 1, None, 17, 3,
     "Most likes of the month (16) but 0 comments: nobody used the 'comment GravityAI' ask. Very long text.",
     "Repeat the stat-led opening. Replace the comment-keyword ask with one simple question, and put the demo link in the first comment.", "Repeat"),
    (D(2026, 9, 18), "LinkedIn", "Post: an order arrives with one field missing — when does it get flagged?", "Revenue Cycle", "Story",
     "https://www.linkedin.com/feed/update/urn:li:activity:7506754588167806979",
     217, None, 5, 1, 1, None, 18, 1,
     "Best engagement rate and best click rate (8.3%), but the fewest impressions (217) — the billing topic reached fewer people.",
     "Repeat the short story + question format. Write the first line for center owners (lost revenue), not only billing teams, to reach more people.", "Repeat"),
    (D(2026, 9, 23), "LinkedIn", "Post: an imaging order passes 4 manual handoffs before it's billable", "Revenue Cycle", "Story",
     "https://www.linkedin.com/feed/update/urn:li:activity:7508663072018939904",
     234, None, 4, 1, 0, None, 16, 6,
     "Lowest engagement rate of the month and no reposts. Second billing post in 5 days; demo link hidden in the comments.",
     "Space out Revenue Cycle posts (one every 2 weeks). Open with a specific denial number, not a process description.", "Improve & Retry"),
    (D(2026, 9, 28), "LinkedIn", "Poll: how many referrals went to another center last month?", "Industry Insight", "Question",
     "https://www.linkedin.com/posts/alphanodus_imagingcenters-healthcareoperations-radiology-activity-7510401945279295488-5wJH",
     None, None, 1, 1, None, None, None, None,
     "Posted after the LinkedIn export ended (Sep 26), so there are no impressions yet.",
     "Re-export LinkedIn analytics after Oct 5. Post the poll results next week as promised in the post.", "Wait for Data"),
    (D(2026, 9, 11), "Instagram", "Reel: 3-min Gravity AI explainer video", "Product / Demo", "Question",
     "https://www.instagram.com/alphanodus/reel/DdJxFt3t07x/",
     None, None, 7, 0, None, None, None, None,
     "No comments. 3 minutes is far too long for a Reel.",
     "Cut a 20–30 sec Reel with on-screen text. End with 'link in bio to book a demo'.", "Improve & Retry"),
    (D(2026, 9, 14), "Instagram", "Image: 'Scanners idle a third of the day, next slot 3 weeks out'", "Operations Tips", "Stat / Number",
     "https://www.instagram.com/alphanodus/p/DdRoAPjkqqy/",
     None, None, 8, 0, None, None, None, None,
     "Best Instagram post, but the caption is very long and the 'comment GravityAI' ask got 0 comments.",
     "Keep the stat-led visual. Shorten the caption to 3–4 lines with one question at the end.", "Repeat"),
    (D(2026, 9, 18), "Instagram", "Carousel: an order arrives with one field missing", "Revenue Cycle", "Story",
     "https://www.instagram.com/alphanodus/p/DdcD_2JkjH0/",
     None, None, 7, 0, None, None, None, None,
     "Ended with a question but got 0 comments — the question was only in the caption.",
     "Put the question on the last slide too, with 2–3 answer options people can reply with.", "Improve & Retry"),
    (D(2026, 9, 23), "Instagram", "Image: 4 manual handoffs before an order is billable", "Revenue Cycle", "Story",
     "https://www.instagram.com/alphanodus/p/DdpdTFWN9JR/",
     None, None, 2, 0, None, None, None, None,
     "Weakest Instagram post: text-heavy single image, same theme as Sep 18.",
     "Tell process stories as a carousel or short Reel. Avoid two Revenue Cycle posts in a row.", "Improve & Retry"),
    (D(2026, 9, 11), "X", "Video: 3-min Gravity AI explainer + demo link", "Product / Demo", "Question",
     "https://x.com/AlphaNodus/status/2098433794022006872",
     27, None, 0, 0, 0, 0, 5, 0,
     "Only 6 video views all month and nobody watched to the end (average watch 2–14 sec). No likes, replies or link clicks — the 5 engagements were 4 'show more' taps + 1 profile visit.",
     "Post a 20–30 sec clip with captions instead of the 3-min video, with the demo link in the text.", "Improve & Retry"),
    (D(2026, 9, 14), "X", "Image: 'Scanners idle a third of the day' + comment GravityAI ask", "Operations Tips", "Stat / Number",
     "https://x.com/AlphaNodus/status/2099545479755583973",
     16, None, 0, 0, 0, 0, 1, 0,
     "16 impressions and only 1 'show more' tap. Nobody replied to the 'comment GravityAI' ask.",
     "Drop the comment-keyword ask. Tag 1–2 relevant industry accounts so more people see it.", "Improve & Retry"),
    (D(2026, 9, 18), "X", "3-tweet thread: an order with one field missing — when is it flagged?", "Revenue Cycle", "Story",
     "https://x.com/AlphaNodus/status/2101017252221128863",
     26, None, 0, 0, 0, 0, 1, 0,
     "Only 1 'show more' tap. The '1 reply' X shows is our own next tweet in the thread, not a customer. The question sat in tweet 3, which only 3 people saw.",
     "Put the question in the first tweet. Keep threads to 1–2 tweets.", "Improve & Retry"),
    (D(2026, 9, 23), "X", "2-tweet thread: 4 manual handoffs before an order is billable (pinned)", "Revenue Cycle", "Story",
     "https://x.com/AlphaNodus/status/2102915695722045558",
     13, None, 0, 0, 0, 0, 2, 0,
     "Rated Good only because 2 of 13 viewers tapped 'show more' — too few views to mean much. The '1 reply' is our own thread tweet. No likes or replies from others.",
     "Keep the short list format, but get it seen: ask the team to repost and tag 1–2 industry accounts.", "Improve & Retry"),
]
keys = ["date", "platform", "what", "pillar", "hook", "link", "impr", "reach", "likes", "comments", "shares", "saves",
        "clicks", "newfol", "weak", "improve", "action"]
for i, row in enumerate(POSTS):
    r = FIRST + i
    for k, v in zip(keys, row):
        if v is None:
            continue
        c = ws[f"{L[k]}{r}"]
        c.value = v
        c.font = font(color="0000FF") if k not in ("weak", "improve", "action") else font()
    ws[f"{L['target']}{r}"] = "Not Checked"
    ws.row_dimensions[r].height = 54

ws.freeze_panes = f"C{FIRST}"
ws.auto_filter.ref = f"A{HDR}:{L['url']}{LAST}"
ws.sheet_view.zoomScale = 90
wb.save(OUT)
print("saved", OUT)
