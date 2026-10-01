"""Personalize the coffee-cup photo: python make_cup.py "Sunrise Imaging" [more names...]
Writes out/cup_<slug>.jpg for each name. Needs: pip install pillow"""
import re, sys, random
from PIL import Image, ImageDraw, ImageFont

BASE = "cup_base.jpg"
BOX = (234, 574, 438, 640)          # area holding the original "Shamit"
INK = (30, 24, 20)
FONT = "/usr/share/fonts/truetype/freefont/FreeSansOblique.ttf"  # swap for a handwriting .ttf if you have one

def blank(img):
    """Erase the original name: replace only the dark ink pixels (dilated) with cup paper from just above."""
    from PIL import ImageFilter
    x0, y0, x1, y1 = BOX
    crop = img.crop(BOX)
    mask = crop.convert("L").point(lambda v: 255 if v < 100 else 0).filter(ImageFilter.MaxFilter(7))
    patch = img.crop((x0, y0 - 70, x1, y1 - 70))
    img.paste(patch, (x0, y0), mask)

def make(name):
    random.seed(1)
    img = Image.open(BASE).convert("RGB")
    blank(img)
    size = 60
    while size > 16:
        f = ImageFont.truetype(FONT, size)
        w = f.getbbox(name)[2]
        if w <= 215:
            break
        size -= 2
    layer = Image.new("RGBA", (260, 110), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    bw, bh = f.getbbox(name)[2], f.getbbox(name)[3]
    d.text(((260 - bw) / 2, (110 - bh) / 2 - 6), name, font=f, fill=INK + (235,))
    layer = layer.rotate(2, resample=Image.BICUBIC)
    img.paste(layer, (BOX[0] - 17, BOX[1] - 12), layer)
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    out = f"out/cup_{slug}.jpg"
    img.save(out, quality=92)
    print(out)

if __name__ == "__main__":
    for n in sys.argv[1:] or ["Your Center"]:
        make(n)
