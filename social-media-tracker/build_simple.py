"""Build the easy-to-read Alpha Nodus post tracker (main sheet + who-engaged log + target/team lists).

Run:  python build_simple.py  ->  AlphaNodus_Simple_Post_Tracker.xlsx
"""
import datetime as dt
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.formula import ArrayFormula
from openpyxl.worksheet.table import Table, TableStyleInfo

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
    ("postid", "Post ID", 15, "in", None, "Short unique ID, e.g. li-261002 (add -story / -reel if you post twice that day). Links this post to the Who Engaged sheet and goes into the tracking URL."),
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
    ("clicks", "Clicks", 7, "in", "#,##0", "All clicks on the post. LinkedIn: 'Clicks'. X: detail expands + profile visits + link clicks. Instagram: profile visits + link taps."),
    ("newfol", "New Followers", 10, "in", "#,##0", "Instagram & X: follows credited to the post. LinkedIn doesn't credit follows to posts, so use followers gained on the post day + the next 2 days."),
    ("eng", "Total Engagement (all)", 10, "calc", "#,##0", "Likes + Comments + Shares + Saves + Clicks, as the platform reports them."),
    ("team", "Our Team's Engagement (removed)", 11, "calc", "#,##0", "Likes, comments, shares and saves by Alpha Nodus staff, counted from the Who Engaged sheet. These don't count as real engagement."),
    ("real", "Real Engagement (excl. our team)", 11, "calc", "#,##0", "Total Engagement minus our team's engagement."),
    ("er", "Engagement Rate", 10, "calc", "0.0%", "Real Engagement ÷ Impressions/Views (or Reach if views are missing). Only if no post on that platform has either yet: ÷ followers in the box above."),
    ("rating", "Rating", 14, "calc", None, "Compared with our own average on the same platform — see the rule box above."),
    ("tgt_n", "Target Accounts Engaged", 10, "calc", "#,##0", "People from our target list who liked, commented, shared or saved this post (from the Who Engaged sheet)."),
    ("tgt_fol", "Target Accounts Followed", 10, "calc", "#,##0", "People from our target list who followed us because of this post (from the Who Engaged sheet)."),
    ("tgt_who", "Who (from our target list)", 34, "calc", None, "Name – company of each target-list person who engaged with or followed us from this post."),
    ("weak", "What Was Weak", 40, "in", None, None),
    ("improve", "Suggestion — and the data behind it", 52, "in", None, "What to do next time, with the number from our own September data that supports it."),
    ("action", "Next Action", 14, "in", None, None),
    ("url", "Tracking URL (use this link in the post)", 44, "calc", None, "Built automatically. Paste it in the post, first comment or bio so website visits can be traced to this post."),
]
L = {k: get_column_letter(i + 1) for i, (k, *_rest) in enumerate(COLS)}
HDR, FIRST, LAST = 15, 16, 215

wb = Workbook()
ws = wb.active
ws.title = "Post Tracker"
ws.sheet_view.showGridLines = False

ws["A1"] = "Alpha Nodus — Social Post Tracker"
ws["A1"].font = font(True, NAVY, 16)
ws["A2"] = ("One row per post. Fill the yellow cells; grey cells calculate themselves. "
            "Check numbers 7 days after posting, then read the Rating and pick the Next Action. "
            "Blue = real numbers from each platform's analytics (September 2026).")
ws["A2"].font = font(italic=True, color=GREY)

# Summary box (A4:J8): September at a glance, all calculated from the rows below
box_hdr = ["Platform", "Followers Today", "Posts", "Impressions / Views", "Real Engagement", "Avg Engagement Rate",
           "Clicks", "New Followers", "Good Posts", "Below Standard Posts", "Target Accounts Engaged", "Target Accounts Followed"]
for j, h in enumerate(box_hdr):
    c = ws.cell(4, 1 + j, h)
    c.font, c.fill, c.border = font(True, "FFFFFF"), fill(NAVY), BOX
    c.alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
ws.row_dimensions[4].height = 30
rng = lambda k: f"${L[k]}${FIRST}:${L[k]}${LAST}"
for i, p in enumerate(PLATFORMS):
    r = 5 + i
    ws.cell(r, 1, p)
    fc = ws.cell(r, 2, FOLLOWERS[p])
    fc.fill, fc.font, fc.number_format = INPUT, font(color="0000FF"), "#,##0"
    ws.cell(r, 3, f'=COUNTIF({rng("platform")},A{r})')
    ws.cell(r, 4, f'=SUMIF({rng("platform")},A{r},{rng("impr")})')
    ws.cell(r, 5, f'=SUMIF({rng("platform")},A{r},{rng("real")})')
    ws.cell(r, 6, f'=IFERROR(AVERAGEIF({rng("platform")},A{r},{rng("er")}),"")')
    ws.cell(r, 7, f'=SUMIF({rng("platform")},A{r},{rng("clicks")})')
    ws.cell(r, 8, f'=SUMIF({rng("platform")},A{r},{rng("newfol")})')
    ws.cell(r, 9, f'=COUNTIFS({rng("platform")},A{r},{rng("rating")},"Good")')
    ws.cell(r, 10, f'=COUNTIFS({rng("platform")},A{r},{rng("rating")},"Below Standard")')
    ws.cell(r, 11, f'=SUMIF({rng("platform")},A{r},{rng("tgt_n")})')
    ws.cell(r, 12, f'=SUMIF({rng("platform")},A{r},{rng("tgt_fol")})')
ws.cell(8, 1, "All platforms")
for j in (2, 3, 4, 5, 7, 8, 9, 10, 11, 12):
    col = chr(ord("A") + j - 1)
    ws.cell(8, j, f"=SUM({col}5:{col}7)")
ws.cell(8, 6, f'=IFERROR(AVERAGE({rng("er")}),"")')
for r in range(5, 9):
    for j in range(1, 13):
        cc = ws.cell(r, j)
        cc.border = BOX
        cc.font = font(bold=(j == 1 or r == 8), color="0000FF" if (j == 2 and r < 8) else "000000")
        if j > 2 or r == 8:
            cc.fill = CALC if r < 8 else fill("DEEAF6")
        cc.number_format = "0.0%" if j == 6 else "#,##0"
        cc.alignment = Alignment(horizontal="left" if j == 1 else "center")
ws["A9"] = ("Followers Today: update every Monday. No founder or team LinkedIn posts in September. "
            "Target / team columns fill in from the 'Who Engaged' sheet.")
ws["A9"].font = font(italic=True, color=GREY, size=9)
ws["A11"] = "Website & demos — September 2026"
ws["A11"].font = font(True, NAVY, 11)
ws["A12"] = ("Website visits from social media: 12 of 7,424 site visits (0.16%)  ·  1.6 sec average time on site  "
             "(Google Analytics → Acquisition → Traffic acquisition → Organic Social)")
ws["A13"] = ("Demos booked: 1 in September — where it came from wasn't recorded, so it can't be credited to any post. "
             "From October, log the source of every demo.")
for a in ("A12", "A13"):
    ws[a].font = font(color="0000FF")
FOL_TABLE = "$A$5:$B$7"

# Rule box (H4:M9)
rules = [
    ("How the Rating works", True),
    ("Good = engagement rate at least 1.2× our average for that platform", False),
    ("Average = between 0.8× and 1.2× our average", False),
    ("Below Standard = under 0.8× our average", False),
    ("No Data Yet = numbers not entered, or fewer than 2 posts on that platform", False),
    ("Engagement Rate = real engagement (likes + comments + shares + saves + clicks, minus our own team's) ÷ impressions / views", False),
    ("Why our own average: each platform behaves differently, and it improves as we post more.", False),
]
for i, (t, b) in enumerate(rules):
    c = ws.cell(4 + i, 14, t)
    c.font = font(b, NAVY if b else "000000", 11 if b else 10)
ws.cell(4, 14).fill = fill("DEEAF6")

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


LOG_FIRST, LOG_LAST = 5, 1004
LOG_COLS = [  # (key, header, width, kind)
    ("date", "Date", 11, "in"), ("platform", "Platform", 10, "in"),
    ("post", "Post ID (from Post Tracker)", 16, "in"), ("name", "Person's Name", 22, "in"),
    ("title", "Title / Role", 24, "in"), ("company", "Company", 26, "in"), ("profile", "Profile Link", 26, "in"),
    ("like", "Liked", 7, "in"), ("comment", "Commented", 9, "in"), ("share", "Shared / Reposted", 9, "in"),
    ("save", "Saved", 7, "in"), ("follow", "Followed Us", 8, "in"),
    ("engaged", "Engaged?", 8, "calc"), ("team", "Our Team?", 9, "calc"), ("target", "On Target List?", 10, "calc"),
    ("notes", "Notes", 30, "in"),
]
LL = {k: get_column_letter(i + 1) for i, (k, *_r) in enumerate(LOG_COLS)}
LOG = {k: f"'Who Engaged'!${v}${LOG_FIRST}:${v}${LOG_LAST}" for k, v in LL.items()}
TGT_FIRST, TGT_LAST, TEAM_FIRST, TEAM_LAST = 5, 504, 5, 204
TGT_COMPANIES = f"'Target & Team Lists'!$A${TGT_FIRST}:$A${TGT_LAST}"
TGT_CONTACTS = f"'Target & Team Lists'!$E${TGT_FIRST}:$E${TGT_LAST}"
TEAM_NAMES = f"'Target & Team Lists'!$J${TEAM_FIRST}:$J${TEAM_LAST}"


def formula(key, r):
    x = {k: f"{v}{r}" for k, v in L.items()}
    blank = f'OR({x["date"]}="",{x["platform"]}="",{x["postid"]}="")'
    has_views = (f'COUNTIFS({rng("platform")},{x["platform"]},{rng("impr")},">0")'
                 f'+COUNTIFS({rng("platform")},{x["platform"]},{rng("reach")},">0")')
    denom = (f'IF(N({x["impr"]})>0,{x["impr"]},IF(N({x["reach"]})>0,{x["reach"]},'
             f'IF({has_views}>0,"",INDEX($B$5:$B$7,MATCH({x["platform"]},$A$5:$A$7,0)))))')
    return {
        "eng": f'=IF({blank},"",IF(COUNT({x["likes"]}:{x["clicks"]})=0,"",SUM({x["likes"]}:{x["clicks"]})))',
        "team": (f'=IF({blank},"",' + "+".join(f'SUMIFS({LOG[c]},{LOG["post"]},{x["postid"]},{LOG["team"]},"Yes")'
                                               for c in ("like", "comment", "share", "save")) + ')'),
        "real": f'=IF(OR({blank},{x["eng"]}=""),"",MAX(0,{x["eng"]}-N({x["team"]})))',
        "tgt_n": f'=IF({blank},"",COUNTIFS({LOG["post"]},{x["postid"]},{LOG["target"]},"Yes",{LOG["engaged"]},1))',
        "tgt_fol": f'=IF({blank},"",COUNTIFS({LOG["post"]},{x["postid"]},{LOG["target"]},"Yes",{LOG["follow"]},1))',
        "tgt_who": (f'=IF({blank},"",_xlfn.TEXTJOIN("; ",TRUE,IF(({LOG["post"]}={x["postid"]})*({LOG["target"]}="Yes"),'
                    f'{LOG["name"]}&" – "&{LOG["company"]}&IF({LOG["follow"]}=1," (followed)",""),"")))'),
        "er": f'=IF(OR({blank},{x["real"]}=""),"",IFERROR({x["real"]}/({denom}),""))',
        "rating": (f'=IF({blank},"",IF(OR({x["er"]}="",COUNTIFS({rng("platform")},{x["platform"]},{rng("er")},">=0")<2),"No Data Yet",'
                   f'IFERROR(IF({x["er"]}/AVERAGEIFS({rng("er")},{rng("platform")},{x["platform"]})>=1.2,"Good",'
                   f'IF({x["er"]}/AVERAGEIFS({rng("er")},{rng("platform")},{x["platform"]})>=0.8,"Average","Below Standard")),"Average")))'),
        "url": (f'=IF({blank},"","{LANDING}?utm_source="&IF({x["platform"]}="X","twitter",LOWER({x["platform"]}))'
                f'&"&utm_medium=social&utm_campaign="&IF({x["pillar"]}="","general",LOWER(SUBSTITUTE(SUBSTITUTE({x["pillar"]}," / ","-")," ","-")))'
                f'&"&utm_content="&LOWER({x["postid"]}))'),
    }[key]


for r in range(FIRST, LAST + 1):
    for j, (key, _h, _w, kind, nf, _n) in enumerate(COLS, start=1):
        c = ws.cell(r, j)
        c.font, c.border = font(), BOX
        c.fill = CALC if kind == "calc" else INPUT
        if key in ("what", "weak", "improve", "tgt_who"):
            c.alignment = WRAP
        else:
            c.alignment = Alignment(vertical="top")
        if nf:
            c.number_format = nf
        if key == "tgt_who":
            c.alignment = WRAP
            c.value = ArrayFormula(f"{L[key]}{r}", formula(key, r))
        elif kind == "calc":
            c.value = formula(key, r)


def dv(key, items):
    v = DataValidation(type="list", formula1='"' + ",".join(items) + '"', allow_blank=True)
    ws.add_data_validation(v)
    v.add(f"{L[key]}{FIRST}:{L[key]}{LAST}")


dv("platform", PLATFORMS + ["Facebook", "YouTube"])
dv("pillar", PILLARS)
dv("hook", HOOKS)
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
     224, 158, 7, 0, 0, 1, 0, 0,
     "Low engagement rate (8 interactions on 224 views), no comments, no profile visits. But it's the only Instagram post reaching new people: 86% of views were non-followers.",
     "Keep making Reels — they reach new people. Cut to 20–30 sec with on-screen text and end with 'link in bio to book a demo'.", "Improve & Retry"),
    (D(2026, 9, 14), "Instagram", "Image: 'Scanners idle a third of the day, next slot 3 weeks out'", "Operations Tips", "Stat / Number",
     "https://www.instagram.com/alphanodus/p/DdRoAPjkqqy/",
     157, 53, 8, 0, 0, 0, 1, 0,
     "Most likes of any post (8) but 0 comments, saves or shares. 3 in 4 views came from existing followers. The 'comment GravityAI' ask got nothing.",
     "Keep the stat-led visual. Shorten the caption to 3–4 lines with one question at the end.", "Repeat"),
    (D(2026, 9, 18), "Instagram", "Carousel: an order arrives with one field missing", "Revenue Cycle", "Story",
     "https://www.instagram.com/alphanodus/p/DdcD_2JkjH0/",
     183, 57, 7, 0, 0, 0, 5, 0,
     "Most profile visits of any post (5) but 0 comments, even though it ended with a question — the question was only in the caption.",
     "Put the question on the last slide too, with 2–3 answer options people can reply with.", "Improve & Retry"),
    (D(2026, 9, 18), "Instagram", "Story: 'Wanna see Gravity in action?' question box + website link (shares the carousel)", "Revenue Cycle", "Question",
     "https://www.instagram.com/alphanodus/",
     54, 40, 2, 0, 0, None, 2, 0,
     "Nobody typed an answer in the question box, and 11 of 54 views exited here. 2 likes, 1 link click, 1 profile visit.",
     "Use a one-tap poll instead of a type-in question box. Keep the website link sticker.", "Improve & Retry"),
    (D(2026, 9, 23), "Instagram", "Image: 4 manual handoffs before an order is billable", "Revenue Cycle", "Story",
     "https://www.instagram.com/alphanodus/p/DdpdTFWN9JR/",
     88, 37, 2, 0, 0, 0, 2, 0,
     "Fewest views of any Instagram feed post (88) and only 2 likes. Text-heavy single image; second billing post in 5 days.",
     "Tell process stories as a carousel or short Reel. Avoid two Revenue Cycle posts in a row.", "Improve & Retry"),
    (D(2026, 9, 23), "Instagram", "Story series (4 frames): fax poll → handoffs poll → 'Gravity watches' → Book a demo + link", "Revenue Cycle", "Question",
     "https://www.instagram.com/alphanodus/",
     62, 38, 0, 0, 0, None, 7, 0,
     "Best Instagram result for the website: the 'Book a demo' frame got 2 link clicks and the series got 5 profile visits. But 0 votes on both polls, viewers fell from 38 to 29 across the frames, and 96% were existing followers.",
     "Keep the Book-a-demo frame with the link sticker. Cut to 2 frames (hook + demo link) and use one poll at most.", "Repeat"),
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
SUGGEST = [
    # LinkedIn
    "Cut a 30–45 sec version with captions. Data: most seen (413) and most clicked (24) LinkedIn post, but only 198 of 413 people started the video — and on X the same video was watched for 2–14 sec on average; nobody finished it.",
    "Open with a number again. Data: 16 likes — the most on LinkedIn — and 10.6% engagement vs our 10.1% LinkedIn average. Drop 'comment GravityAI': it got 0 comments here, on Instagram and on X.",
    "Keep the short story + question format; write line 1 for center owners. Data: best LinkedIn engagement (11.5%) and click rate (8.3%), but the fewest impressions (217) — the billing-team angle reached fewer people.",
    "Space billing topics 2 weeks apart. Data: posted 5 days after Sep 18's billing post, it hit 9.0% — lowest on LinkedIn — and the same story got the fewest views of any Instagram feed post (88) and of any X post (13).",
    "Re-check on Oct 5 and post the results. Data: 5 LinkedIn posts drew only 3 comments all month — a one-click poll is the test of whether people will answer at all.",
    # Instagram
    "Keep making Reels, 20–30 sec. Data: 86% of its 224 views came from non-followers — the only Instagram content reaching new people (stories were 96% existing followers).",
    "Keep the stat visual, cut the caption to 3–4 lines. Data: most likes of any Instagram feed post (8) but 0 comments, saves or shares; the 'comment GravityAI' ask got 0 on all 3 platforms.",
    "Put the question on the last slide with 2–3 answer options. Data: 5 profile visits — the most of any Instagram feed post — but 0 comments, because the question was only in the caption.",
    "Replace the type-in question box with a 'Book a demo' link sticker. Data: 0 typed answers and 11 of 54 viewers exited; stories with links got the month's only 3 story link clicks.",
    "Use a carousel or Reel for process stories, not one text-heavy image. Data: 88 views vs 183 for the Sep 18 carousel and 224 for the Reel.",
    "Repeat the Book-a-demo frame, cut to 2 frames, skip polls. Data: best Instagram engagement (11.3%); the demo frame got 2 of the month's 3 story link clicks; viewers fell 38 → 29 over 4 frames; 0 poll votes.",
    # X
    "Post a 20–30 sec clip, not the full video. Data: X's best post (27 impressions), but only 6 video views all month, 2–14 sec average watch, 0 finished.",
    "Tag 1–2 industry accounts so it's seen beyond our 46 followers. Data: 16 impressions, 1 tap, 0 likes.",
    "Put the question in tweet 1. Data: tweet 1 got 26 impressions; tweet 3 — the one with the question — got 3.",
    "Grow to 50 followers (4 to go) to unlock X analytics; ask the team to repost. Data: 13 impressions, lowest of the month — its 'Good' rating is just 2 taps.",
]
assert len(SUGGEST) == len(POSTS)
POSTS = [row[:15] + (SUGGEST[i],) + row[16:] for i, row in enumerate(POSTS)]
POST_IDS = ["li-260911", "li-260914", "li-260918", "li-260923", "li-260928",
            "ig-260911-reel", "ig-260914", "ig-260918", "ig-260918-story", "ig-260923", "ig-260923-story",
            "x-260911", "x-260914", "x-260918", "x-260923"]
assert len(POST_IDS) == len(POSTS)
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
    ws.row_dimensions[r].height = 68
    c = ws[f"{L['postid']}{r}"]
    c.value, c.font = POST_IDS[i], font(color="0000FF")

pid = f"{L['postid']}{FIRST}:{L['postid']}{LAST}"
ws.conditional_formatting.add(pid, FormulaRule(
    formula=[f'AND({L["postid"]}{FIRST}<>"",COUNTIF(${L["postid"]}${FIRST}:${L["postid"]}${LAST},{L["postid"]}{FIRST})>1)'],
    fill=fill("FFC7CE"), font=Font(name=FONT, bold=True, color="9C0006")))
ws.freeze_panes = f"D{FIRST}"
ws.auto_filter.ref = f"A{HDR}:{L['url']}{LAST}"   # sort / filter arrows on every column
ws.sheet_view.zoomScale = 90


# ---------------------------------------------------------------- Who Engaged (one row per person per post)
def header(sheet, row, col, text, calc=False, width=None):
    c = sheet.cell(row, col, text)
    c.font, c.fill, c.border = font(True, "FFFFFF"), fill("548235" if calc else NAVY), BOX
    c.alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
    if width:
        sheet.column_dimensions[get_column_letter(col)].width = width


wl = wb.create_sheet("Who Engaged")
wl.sheet_view.showGridLines = False
wl["A1"] = "Who Engaged — one row per person per post"
wl["A1"].font = font(True, NAVY, 16)
wl["A2"] = ("Copy names from each post's likes / comments / reposts list and from new-follower lists. Put 1 under each thing "
            "they did. 'Our Team?' and 'On Target List?' fill in automatically from the Target & Team Lists sheet. "
            "Leave Post ID blank for a follow you can't tie to a post.")
wl["A2"].font = font(italic=True, color=GREY)
for j, (k, h, w, kind) in enumerate(LOG_COLS, start=1):
    header(wl, 4, j, h, kind == "calc", w)
wl.row_dimensions[4].height = 32
for r in range(LOG_FIRST, LOG_LAST + 1):
    x = {k: f"{v}{r}" for k, v in LL.items()}
    for j, (k, h, w, kind) in enumerate(LOG_COLS, start=1):
        c = wl.cell(r, j)
        c.font, c.border = font(), BOX
        c.fill = CALC if kind == "calc" else INPUT
        if k == "date":
            c.number_format = "mm/dd/yyyy"
    wl[x["engaged"]] = f'=IF({x["name"]}="","",IF(SUM({x["like"]}:{x["save"]})>0,1,0))'
    wl[x["team"]] = (f'=IF({x["name"]}="","",IF(OR(COUNTIF({TEAM_NAMES},{x["name"]})>0,'
                     f'ISNUMBER(SEARCH("alpha nodus",{x["company"]}))),"Yes","No"))')
    wl[x["target"]] = (f'=IF({x["name"]}="","",IF({x["team"]}="Yes","No",IF(OR(AND({x["company"]}<>"",'
                       f'COUNTIF({TGT_COMPANIES},{x["company"]})>0),COUNTIF({TGT_CONTACTS},{x["name"]})>0),"Yes","No")))')
ex = {"date": dt.date(2026, 9, 14), "platform": "LinkedIn", "post": "EXAMPLE", "name": "EXAMPLE – Jane Doe",
      "title": "Owner", "company": "EXAMPLE Imaging Center", "like": 1, "comment": 1, "follow": 1,
      "notes": "Example row — delete. Post ID 'EXAMPLE' matches no post, so it isn't counted."}
for k, v in ex.items():
    c = wl[f"{LL[k]}{LOG_FIRST}"]
    c.value, c.font = v, font(italic=True, color="0000FF")
v = DataValidation(type="list", formula1=f"='Post Tracker'!${L['postid']}${FIRST}:${L['postid']}${LAST}", allow_blank=True)
v.showErrorMessage = False
wl.add_data_validation(v)
v.add(f"{LL['post']}{LOG_FIRST}:{LL['post']}{LOG_LAST}")
v2 = DataValidation(type="list", formula1='"' + ",".join(PLATFORMS) + '"', allow_blank=True)
wl.add_data_validation(v2)
v2.add(f"{LL['platform']}{LOG_FIRST}:{LL['platform']}{LOG_LAST}")
v3 = DataValidation(type="list", formula1=f"={TGT_COMPANIES}", allow_blank=True)
v3.showErrorMessage = False
wl.add_data_validation(v3)
v3.add(f"{LL['company']}{LOG_FIRST}:{LL['company']}{LOG_LAST}")
v4 = DataValidation(type="whole", operator="between", formula1="0", formula2="1", allow_blank=True)
wl.add_data_validation(v4)
v4.add(f"{LL['like']}{LOG_FIRST}:{LL['follow']}{LOG_LAST}")
for k, bg, fg in (("target", "C6EFCE", "006100"), ("team", "EDEDED", GREY)):
    wl.conditional_formatting.add(f"{LL[k]}{LOG_FIRST}:{LL[k]}{LOG_LAST}", CellIsRule(
        operator="equal", formula=['"Yes"'], fill=fill(bg), font=Font(name=FONT, bold=True, color=fg)))
wl.freeze_panes = f"E{LOG_FIRST}"
wl.auto_filter.ref = f"A4:{LL['notes']}{LOG_LAST}"

# ---------------------------------------------------------------- Target & Team Lists
tl = wb.create_sheet("Target & Team Lists")
tl.sheet_view.showGridLines = False
tl["A1"] = "Target & Team Lists"
tl["A1"].font = font(True, NAVY, 16)
tl["A2"] = ("Target list: type each company exactly as it appears on LinkedIn. A person counts as 'target' if their company "
            "or their name is here. Team list: anyone here — or anyone whose company contains 'Alpha Nodus' — is our team.")
tl["A2"].font = font(italic=True, color=GREY)
tl["A3"], tl["J3"] = "TARGET LIST (imaging & radiology centers)", "OUR TEAM (their engagement is not counted)"
tl["A3"].font = tl["J3"].font = font(True, NAVY, 11)
for j, (h, w) in enumerate([("Company", 30), ("Website", 22), ("City", 14), ("State", 7), ("Key Contact Name", 22),
                            ("Title", 22), ("LinkedIn URL", 26), ("Notes", 24)], start=1):
    header(tl, 4, j, h, width=w)
for j, (h, w) in enumerate([("Team Member Name", 22), ("Role", 18), ("Profile / Handle", 26)], start=10):
    header(tl, 4, j, h, width=w)
tl.column_dimensions["I"].width = 3
for r in range(TGT_FIRST, TGT_LAST + 1):
    for j in range(1, 9):
        c = tl.cell(r, j)
        c.fill, c.border, c.font = INPUT, BOX, font()
for r in range(TEAM_FIRST, TEAM_LAST + 1):
    for j in range(10, 13):
        c = tl.cell(r, j)
        c.fill, c.border, c.font = INPUT, BOX, font()
for j, v in enumerate(["EXAMPLE Imaging Center", "example.com", "Austin", "TX", "EXAMPLE – Jane Doe", "Owner", "",
                       "Example row — delete when you paste your list."], start=1):
    c = tl.cell(TGT_FIRST, j, v)
    c.font = font(italic=True, color="0000FF")
for j, v in enumerate(["Tushant Suneja", "Posts company-page content", ""], start=10):
    c = tl.cell(TEAM_FIRST, j, v)
    c.font = font(color="0000FF")
tl.freeze_panes = "A5"

for sheet, color in ((ws, NAVY), (wl, "548235"), (tl, "7F7F7F")):
    sheet.sheet_properties.tabColor = color
wb.save(OUT)
print("saved", OUT)
