#!/usr/bin/env python3
"""Build the one-page-per-section project report as a PDF:  python3 make_report_pdf.py imaging-leads-report.pdf"""
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ss = getSampleStyleSheet()
H1 = ParagraphStyle("h1", parent=ss["Title"], fontSize=20, spaceAfter=4, alignment=0)
H2 = ParagraphStyle("h2", parent=ss["Heading2"], fontSize=13, spaceBefore=12, spaceAfter=6, textColor=colors.HexColor("#1f3a5f"))
P = ParagraphStyle("p", parent=ss["BodyText"], fontSize=9, leading=12)
C = ParagraphStyle("c", parent=P, fontSize=8, leading=10)
CB = ParagraphStyle("cb", parent=C, fontName="Helvetica-Bold", textColor=colors.white)


def table(rows, widths):
    data = [[Paragraph(str(c), CB if i == 0 else C) for c in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f3a5f")), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#c9d1da")),
                           ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f6f9")]),
                           ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
    return t


def build(path):
    s = [Paragraph("Imaging leads: from the original sheets to today", H1),
         Paragraph("Organizations, people and facilities: what came in, what we did, and where it stands.", P)]
    s += [Paragraph("1. Then and now", H2), table([
        ["", "Original", "Now"],
        ["Organizations", "2,511 names and websites", "LinkedIn link where one exists (1,968, 78%); social and contact fields from their own site; evidence flag"],
        ["People", "23,569 rows, no check that they still work there", "23,248 cleaned people with confidence (high / medium / low / none), verified title and LinkedIn link where found; 18,266 high confidence"],
        ["Facilities", "6,478 sites, not linked to anyone", "6,474 linked to their organization, with its LinkedIn and contact data"],
        ["Work emails", "Mostly none", "298 confident, 1,133 unproven guesses, 21,817 none (will change after the Hunter run)"]], [32, 55, 93])]
    s += [Paragraph("2. What we did, step by step", H2), table([
        ["#", "Step", "What it did", "Result", "Cost"],
        ["1", "Clean the people list", "Fixed HTML characters, split credentials, dropped website labels and organization-like strings, merged duplicates", "321 junk or duplicate rows removed; 23,248 left", "Free"],
        ["2", "Crawl organization websites", "Read home, team, about and contact pages (up to 12 per site)", "Emails, phones, social links and staff lists", "Free"],
        ["3", "Match people to sites", "First name then last name next to each other = confirmed", "Confirmed or possible matches for most people", "Free"],
        ["4", "Web search for the rest (Exa)", "One search per person not found on the site, decision-makers first", "Evidence of who works where, incl. LinkedIn pages", "About $90"],
        ["5", "Score the evidence", "Ranked evidence from the organization site down to name-only hits", "Confidence per person; contradictions flagged", "Free"],
        ["6", "Organization LinkedIn pages", "Cross-checked site link against search and Crustdata; fixed truncated or wrong links", "1,968 of 2,511 with a link; 238 to review; 465 none found", "Small"],
        ["7", "Team and title check (Crustdata)", "Looked up our people at 1,313 organizations by name", "Titles and LinkedIn added or confirmed; 461 titles differ; 21 LinkedIn conflicts", "Crustdata credits"],
        ["8", "Work emails", "Published emails, Crustdata, and pattern guesses checked with Emailable, ZeroBounce tests and Reacher", "136 published, 11 Crustdata, 123 verified guesses", "Free to about $1 per Crustdata email"],
        ["9", "Hunter Email Finder test", "50 top-tier names by name and domain", "28 valid, 7 accept-all, 11 not found (about 60% valid)", "36 credits (free)"],
        ["10", "Workbook", "imaging-leads.xlsx with People, Organizations, Facilities, New people, Needs review, Summary", "Everything above in one file", "Free"]],
        [7, 30, 55, 60, 28])]
    s += [Paragraph("3. What we deliberately did not do", H2),
          Paragraph("No personal emails, mobile numbers or personal social accounts were collected. Only business contact data is in the files. "
                    "No logins to LinkedIn or scraping of social platforms. Nothing was sent to anyone.", P)]
    s += [Paragraph("4. Where it stands", H2), table([
        ["Item", "Status"],
        ["Confident work emails", "298 (136 published, 11 Crustdata, 123 verified guesses, 28 Hunter)"],
        ["Unproven emails", "1,133 (accept-all or unverifiable guesses). Fine for small tests, not bulk sends"],
        ["No email", "21,817"],
        ["Next", "Hunter run on 3,240 decision-makers (files ready), then the remaining ~18,500 people if the hit rate holds"],
        ["Caveat", "High confidence means the person appeared with the organization on a page at the time, not that employment was checked today. Spot-check titles and emails before outreach"]], [45, 135])]
    s += [Paragraph("5. Still to review by hand", H2), table([
        ["List", "Rows"], ["People needing review", "about 1,744"], ["Organization LinkedIn matches to check", "238"],
        ["Titles that differ from Crustdata", "461"], ["LinkedIn conflicts", "21"]], [120, 60])]
    s += [Paragraph("6. Social accounts in the files", H2), table([
        ["Where", "Columns"],
        ["Organizations sheet", "linkedin_final (verified), linkedin, facebook, instagram, x, youtube: organization pages found on the site or in search"],
        ["Facilities sheet", "The same fields from the parent organization, prefixed org_"],
        ["People sheet", "linkedin_final: professional profile where found. Personal Facebook or Instagram accounts of individuals are not collected"]], [45, 135])]
    SimpleDocTemplate(path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=15*mm, bottomMargin=15*mm,
                      title="Imaging leads report").build(s)


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else "imaging-leads-report.pdf")
