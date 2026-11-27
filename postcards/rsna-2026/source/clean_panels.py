import sys, numpy as np, cv2
src, outdir = sys.argv[1], sys.argv[2]
im = cv2.imread(src)                      # BGR, 1200x1800
Y0, Y1 = 408, 1066
PANELS = [(0, 396), (402, 798), (804, 1200)]
# text boxes (x0,y0,x1,y1) per panel, from measurement, padded
BOX = {0: [(28, 756, 96, 824), (28, 832, 320, 914), (28, 928, 374, 1032)],
       1: [(430, 756, 498, 824), (430, 832, 738, 914), (430, 928, 756, 1032)],
       2: [(832, 756, 900, 824), (832, 832, 1137, 922), (832, 928, 1163, 994)]}
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.int16)
med = cv2.medianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), 31).astype(np.int16)
mask = np.zeros(gray.shape, np.uint8)
for i, boxes in BOX.items():
    for x0, y0, x1, y1 in boxes:
        sub = (gray[y0:y1, x0:x1] - med[y0:y1, x0:x1]) > 22
        mask[y0:y1, x0:x1] |= sub.astype(np.uint8) * 255
    # circles: whole disc
    x0, y0, x1, y1 = boxes[0]
    cv2.circle(mask, ((x0 + x1) // 2, (y0 + y1) // 2), 33, 255, -1)
mask = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=1)
clean = cv2.inpaint(im, mask, 6, cv2.INPAINT_TELEA)
cv2.imwrite(f"{outdir}/front_mask.png", mask)
cv2.imwrite(f"{outdir}/front_clean_full.png", clean)
B = 38  # bleed px
for i, (x0, x1) in enumerate(PANELS):
    p = clean[Y0:Y1, x0:x1]
    if i == 0: p = cv2.copyMakeBorder(p, 0, 0, B, 0, cv2.BORDER_REFLECT)
    if i == 2: p = cv2.copyMakeBorder(p, 0, 0, 0, B, cv2.BORDER_REFLECT)
    cv2.imwrite(f"{outdir}/panel{i+1}.png", p)
    print(i, p.shape)
