import json, sys, numpy as np
from PIL import Image
fit = json.load(open('front_fit.json'))
exp = {}
src = open('fit_front.py').read(); exec(src[src.index('ITEMS = ['):src.index(']\nREF')+1])
for iid, txt, fam, w, box, sf in ITEMS: exp[iid] = box
COL = {'mono1':(0x67,0xe3,0xee),'mono2':(0x67,0xe3,0xee),'h1a':(255,)*3,'h1b':(255,)*3,'h1c':(0x67,0xe3,0xee),
 'why':(0x6b,0x3f,0xe4),'one':(0x1b,0x14,0x30),'see':(0x4a,0x44,0x60),'booth':(0x1b,0x14,0x30),'hall':(0xd9,0xd3,0xee),'p1':(0xe2,0xdc,0xf7),'made':None,'p2':None}
img = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)[37:1837, 37:1237]
orig = np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(int)
def ink(a, box, col, tol=90, pad=14):
    l,t,r,b = box; x0=max(0,l-pad); x1=min(1200,r+pad)
    reg = a[t+3:b-2, x0:x1]
    if col is None: m = reg.sum(2) > 500
    else: m = np.abs(reg - np.array(col)).sum(2) < tol
    xs = np.where(m.any(0))[0]
    return (x0+xs.min(), x0+xs.max()) if len(xs) else None
adj = {}
for iid, box in exp.items():
    col = COL.get(iid, 'light')
    if col == 'light': col = None
    o = ink(orig, box, col); m = ink(img, (box[0]+(6 if iid[1:2]=='1' and iid[0] in 'tb' else 0),)+box[1:], col)
    if not o or not m: print(iid, 'n/a', o, m); continue
    ow, mw = o[1]-o[0], m[1]-m[0]
    n = len(fit[iid]['text']); adj[iid] = (ow-mw)/(n-1)/fit[iid]['size']
    print(f"{iid:6s} orig {ow:4d} mine {mw:4d}  diff {ow-mw:+4d}  adj {adj[iid]:+.4f}em")
json.dump(adj, open('front_adj_delta.json','w'))
