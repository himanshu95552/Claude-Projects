import json, os
from PIL import ImageFont
H = os.path.expanduser("~/.fonts")
FONTS = {("Urbanist",700): f"{H}/Urbanist_700Bold.ttf", ("Urbanist",600): f"{H}/Urbanist_600SemiBold.ttf",
 ("Urbanist",500): f"{H}/Urbanist_500Medium.ttf", ("Urbanist",800): f"{H}/Urbanist_800ExtraBold.ttf",
 ("Inter",500): "/usr/share/fonts/opentype/inter/Inter-Medium.otf", ("Inter",600): "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf",
 ("Inter",700): "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
 ("JetBrains Mono",700): "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf"}
# id, text, family, weight, ink (left, top, right, bottom), size_from ('h' = fit size by ink height, or fixed number)
ITEMS = [
 ("mono1","THE IMAGING CENTER","JetBrains Mono",700,(852,58,1123,73),"h"),
 ("mono2","A MOCKUMENTARY","JetBrains Mono",700,(914,89,1124,104),"mono1"),
 ("h1a","3 ways your imaging center loses","Urbanist",800,(74,159,1087,232),"h"),
 ("h1b","money.","Urbanist",800,(76,253,293,304),"h1a"),
 ("h1c","Number 2 is in your fax tray.","Urbanist",800,(76,310,928,384),"h1a"),
 ("t1a","Referrals that go","Urbanist",700,(34,838,313,875),"h"),
 ("t1b","elsewhere","Urbanist",700,(33,879,203,907),"t1a"),
 ("t2a","Orders that never","Urbanist",700,(436,838,732,866),"t1a"),
 ("t2b","become exams","Urbanist",700,(436,879,692,907),"t1a"),
 ("t3a","Exams that never","Urbanist",700,(838,838,1131,866),"t1a"),
 ("t3b","get paid","Urbanist",700,(837,879,975,916),"t1a"),
 ("b1a","Jess brought donuts. The","Inter",600,(33,934,360,958),"h"),
 ("b1b","patient still went down the","Inter",600,(34,969,368,993),"b1a"),
 ("b1c","road.","Inter",600,(34,1003,95,1022),"b1a"),
 ("b2a","The fax machine says","Inter",600,(435,933,713,958),"b1a"),
 ("b2b","page three is \"in a better","Inter",600,(436,969,750,993),"b1a"),
 ("b2c","place.\"","Inter",600,(436,1003,519,1027),"b1a"),
 ("b3a","The payer's letter arrives","Inter",600,(837,934,1157,958),"b1a"),
 ("b3b","weeks after the exam.","Inter",600,(837,969,1116,988),"b1a"),
 ("p1","Imaging centers don't lose money in the scanner. They lose it","Inter",600,(75,1129,1006,1159),"h"),
 ("p2","between the referral and the payment. So we set a comedy there.","Inter",600,(74,1174,1070,1203),"p1"),
 ("why","WHY SCAN?","JetBrains Mono",700,(369,1375,501,1390),"mono1"),
 ("one","One of these is your center.","Urbanist",700,(370,1415,942,1463),"h"),
 ("see","See how it ends in less than 60 seconds.","Inter",700,(370,1479,894,1498),"h"),
 ("booth","Booth 6537","Urbanist",700,(206,1629,343,1649),"h"),
 ("hall","North Hall, Level 3 · McCormick Place, Chicago","Inter",600,(392,1629,1018,1655),"h"),
 ("made","Made by Alpha Nodus. Gravity runs the imaging order at more than 460 centers.","Inter",600,(84,1723,1115,1748),"h"),
]
REF = 200
res = {}
for iid, txt, fam, w, (l, t, r, b), sf in ITEMS:
    f = ImageFont.truetype(FONTS[(fam, w)], REF)
    bl, bt, br, bb = f.getbbox(txt, anchor="ls")       # relative to baseline origin
    if sf == "h":
        size = REF * (b - t) / (bb - bt)
    else:
        size = res[sf]["size"]
    k = size / REF
    f2 = ImageFont.truetype(FONTS[(fam, w)], max(1, round(size * 8)))  # hi-res for width
    k2 = size / (round(size * 8))
    bl2, bt2, br2, bb2 = f2.getbbox(txt, anchor="ls")
    ink_w = (br2 - bl2) * k2
    n = len(txt)
    ls = ((r - l) - ink_w) / (n - 1) if n > 1 else 0
    x = l - bl2 * k2
    base = t - bt2 * k2
    res[iid] = dict(text=txt, family=fam, weight=w, size=round(size, 2), x=round(x, 2), y=round(base, 2), ls=round(ls, 3),
                    ls_em=round(ls / size, 4))
for k, v in res.items():
    print(f"{k:6s} size {v['size']:6.2f} x {v['x']:7.2f} base {v['y']:7.2f} ls {v['ls']:6.2f}px ({v['ls_em']:+.3f}em)")
json.dump(res, open("front_fit.json", "w"), indent=1)
