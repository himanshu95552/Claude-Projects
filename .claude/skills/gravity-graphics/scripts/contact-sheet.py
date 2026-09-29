# usage: python3 contact-sheet.py sheet.png frame1.png frame2.png ...
import sys
from PIL import Image
out,*fr=sys.argv[1:]
ims=[Image.open(f).convert('RGB') for f in fr]
w,h=ims[0].size;s=0.33;tw,th=int(w*s),int(h*s);cols=6
rows=(len(ims)+cols-1)//cols
sh=Image.new('RGB',(cols*tw,rows*th),'#888')
for i,im in enumerate(ims):sh.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sh.save(out)
