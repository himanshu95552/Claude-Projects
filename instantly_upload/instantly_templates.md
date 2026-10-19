# Instantly templates (paste into the HTML editor)

Upload `instantly_campaign_A_upload.csv` to campaign A and `instantly_campaign_B_upload.csv` to campaign B. Map Email, First Name, Last Name, Company Name and Title to Instantly's standard fields. Map every other column as a custom variable with the same name: Subject, Opener, Bridge, LinkURL1, LinkText1, F1Line, F2Line, LinkURL3, LinkText3, RIS, LeadID.

Step 2 and step 3 leave the subject blank so they send as replies in the same thread. Delays: step 2 after 3 days, step 3 after 4 days.

## Campaign A: orders

### Step 1 (day 0), subject: {{Subject}}
```html
Hi {{firstName}},<br><br>{{Opener}}<br><br>{{Bridge}} <a href="{{LinkURL1}}">{{LinkText1}}</a>.<br><br>Worth 15 minutes next Tuesday or Thursday?<br><br>Best,<br>{{accountSignature}}
```

### Step 2 (+3 days), subject blank
```html
Hi {{firstName}},<br><br>In September 2026, patients made 43.8% of Downtown Radiology's bookings themselves, for the exams the center opened to patient booking.<br><br>{{F1Line}}<br><br>Best,<br>{{accountSignature}}
```

### Step 3 (+4 days), subject blank
```html
Hi {{firstName}},<br><br>{{F2Line}}<br><br>If more exams from the orders you already have isn't a priority right now, no worries at all. If it is, does next Tuesday or Thursday work for a quick chat? Or <a href="{{LinkURL3}}">{{LinkText3}}</a> first.<br><br>Best,<br>{{accountSignature}}
```

## Campaign B: authorizations

### Step 1 (day 0), subject: {{Subject}}
```html
Hi {{firstName}},<br><br>{{Opener}}<br><br>{{Bridge}} <a href="{{LinkURL1}}">{{LinkText1}}</a>.<br><br>Worth 15 minutes next Tuesday or Thursday?<br><br>Best,<br>{{accountSignature}}
```

### Step 2 (+3 days), subject blank
```html
Hi {{firstName}},<br><br>At Iowa Radiology, about 430 orders were waiting for prior authorization on day one. By day three or four, the backlog was gone.<br><br>{{F1Line}}<br><br>Best,<br>{{accountSignature}}
```

### Step 3 (+4 days), subject blank
```html
Hi {{firstName}},<br><br>{{F2Line}}<br><br>If settling authorizations before the patient arrives isn't a priority right now, no worries at all. If it is, does next Tuesday or Thursday work for a quick chat? Or <a href="{{LinkURL3}}">{{LinkText3}}</a>.<br><br>Best,<br>{{accountSignature}}
```

## Notes
- Each email is one line of HTML with `<br><br>` between paragraphs. Paste it as it is. Do not add line breaks or `<p>` tags: either one makes the gaps between paragraphs too big in Gmail.
- Every lead's link carries its own `utm_term` (LeadID), so a click maps to one person. `utm_content` says variant and step (va1, va3, vb1, vb3).
- If your sending tool does not accept a variable inside `href`, tell me and I will write each link into the body column instead.
- If the HTML renders as text, paste it with the editor in source or HTML mode.
- `review_notes_not_for_upload.csv` holds the original opener beside the new one, plus your rep notes. Do not import it.
