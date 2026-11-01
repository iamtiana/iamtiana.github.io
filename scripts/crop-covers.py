"""Crop book covers out of the two slide screenshots.
Usage: python3 scripts/crop-covers.py
"""
from PIL import Image, ImageOps
import os

OUT = 'images/books'
os.makedirs(OUT, exist_ok=True)

def runs(mask_1d, min_len):
    """Return [(start, end)] of consecutive True runs at least min_len long."""
    out, start = [], None
    for i, v in enumerate(mask_1d + [False]):
        if v and start is None: start = i
        if not v and start is not None:
            if i - start >= min_len: out.append((start, i))
            start = None
    return out

def segment(path, rows, cols, prefix, inner):
    im = Image.open(path).convert('RGB')
    im = im.crop(inner)  # drop the slide border and the title
    g = ImageOps.grayscale(im)
    w, h = g.size
    px = g.load()
    # a pixel is "ink" if clearly darker than the white slide background
    def ink(x, y): return px[x, y] < 235
    row_mask = [sum(ink(x, y) for x in range(0, w, 4)) > 3 for y in range(h)]
    row_runs = runs(row_mask, 80)
    assert len(row_runs) == rows, f'{path}: expected {rows} rows, got {row_runs}'
    n = 1
    for (y0, y1) in row_runs:
        col_mask = [sum(ink(x, y) for y in range(y0, y1, 4)) > 3 for x in range(w)]
        col_runs = runs(col_mask, 60)
        # merge gaps smaller than 25px (spine shadows etc.)
        merged = []
        for r in col_runs:
            if merged and r[0] - merged[-1][1] < 25: merged[-1] = (merged[-1][0], r[1])
            else: merged.append(r)
        assert len(merged) == cols, f'{path}: expected {cols} cols in row {y0}-{y1}, got {merged}'
        for (x0, x1) in merged:
            pad = 4
            box = (max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad))
            cover = im.crop(box)
            cover.thumbnail((400, 600))
            cover.save(f'{OUT}/{prefix}{n:02d}.jpg', quality=88)
            n += 1

# inner boxes exclude the dark-blue frame and the title text (measured on the screenshots)
segment('images/src/books-side-a.png', rows=2, cols=6, prefix='a', inner=(100, 230, 1786, 1000))
segment('images/src/books-side-b.png', rows=2, cols=4, prefix='b', inner=(100, 200, 1380, 940))

# b04 (非常關係) has a white cover, so auto-detection only finds the coloured shapes; use a hand-measured box
b04 = Image.open('images/src/books-side-b.png').convert('RGB').crop((1098, 262, 1322, 548))
b04.thumbnail((400, 600)); b04.save(f'{OUT}/b04.jpg', quality=88)

# contact sheet for a quick eyeball check
files = sorted(f for f in os.listdir(OUT) if f.endswith('.jpg') and f != 'contact.jpg')
thumbs = [Image.open(f'{OUT}/{f}') for f in files]
tw, th = 160, 240
sheet = Image.new('RGB', (tw * 6, th * ((len(thumbs) + 5) // 6)), 'white')
for i, t in enumerate(thumbs):
    t = t.copy(); t.thumbnail((tw - 10, th - 10))
    sheet.paste(t, ((i % 6) * tw + 5, (i // 6) * th + 5))
sheet.save(f'{OUT}/contact.jpg', quality=80)
print(f'wrote {len(files)} covers + contact.jpg')
