# Tiana's Tapes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page personal site at https://iamtiana.github.io: a box of four cassette tapes (Music / Reading / Screen / Way Finding); click a tape to slide it out and read its J-card.

**Architecture:** Static site, no framework, no build. `data.js` holds all content as one global object `TAPES`; `script.js` renders the tape box and the four J-cards from it and handles open/close; `style.css` holds every style. Verification is a Node data-shape check plus Chrome screenshots at desktop and 400px width.

**Tech Stack:** HTML, CSS, vanilla JS (ES2020), Google Fonts (Oswald, Jost, Noto Sans TC), Spotify public embeds, Python 3 + Pillow (one-off cover cropping), Node (data check), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-01-tiana-tapes-design.md`

## Global Constraints

- Fonts: headings **Oswald 600, title case** (`Way Finding`, `On Repeat`); labels/spines **Jost, uppercase, letter-spacing .22em**; Chinese/body **Noto Sans TC**, Chinese bold 700. **No serif anywhere.**
- Colors: background `#f3efe6`, ink `#2b2722`, tape shell `#2b2722`, accent `#d9534f` (only for small labels like "now building"), muted text `#6d6559`, hairline `#d9d1c2`.
- Whitespace is a feature: J-card max-width 560px, body line-height 1.8. If it looks dense, add space.
- Never write the pharmacy client's name or the project code name on the site. The Way Finding copy below is final; do not add numbers or detail.
- Only `data.js` is meant to be edited by the owner later; keep all content there, none hard-coded in `script.js` or `index.html`.
- Commit after every task from the worktree directory with plain, separate git commands (`git add -A`, then `git commit -m "..."`). End commit messages with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Local preview: `python3 -m http.server 8787` from the project root, open `http://localhost:8787/`.

---

### Task 1: Content file `data.js` + shape check

**Files:**
- Create: `data.js`
- Create: `scripts/check-data.js`

**Interfaces:**
- Produces: global `window.TAPES` (array of 4 tape objects) consumed by `script.js` in Tasks 3–4. Shape:
  ```js
  { id: 'music'|'reading'|'screen'|'wayfinding', label: string /* spine text */,
    title: string, subtitle: string, /* plus one of: */
    artists: [{name, spotifyId}] | sides: [{name, books:[{title, cover}]}] |
    items: [string] | fields: [{name, note}], now: {label, lines:[string]}, photo: null }
  ```

- [ ] **Step 1: Write the failing check**

`scripts/check-data.js`:
```js
// Loads data.js in a fake browser global and asserts the content shape.
const fs = require('fs');
const assert = require('assert');
global.window = {};
eval(fs.readFileSync(__dirname + '/../data.js', 'utf8'));
const T = window.TAPES;
assert(Array.isArray(T) && T.length === 4, 'TAPES must have 4 tapes');
const byId = Object.fromEntries(T.map(t => [t.id, t]));
assert.deepStrictEqual(T.map(t => t.id), ['music', 'reading', 'screen', 'wayfinding']);
for (const t of T) { assert(t.label && t.title, `tape ${t.id} needs label and title`); }
assert.strictEqual(byId.music.artists.length, 6, '6 artists');
for (const a of byId.music.artists) assert(/^[A-Za-z0-9]{22}$/.test(a.spotifyId), `bad spotifyId for ${a.name}`);
assert.strictEqual(byId.reading.sides.length, 2, '2 sides');
assert.strictEqual(byId.reading.sides[0].books.length, 12, 'side A has 12 books');
assert.strictEqual(byId.reading.sides[1].books.length, 8, 'side B has 8 books');
for (const s of byId.reading.sides) for (const b of s.books) assert(b.title && /^images\/books\/.+\.jpg$/.test(b.cover), `bad book ${JSON.stringify(b)}`);
assert.strictEqual(byId.screen.items.length, 6, '6 screen items');
assert.strictEqual(byId.wayfinding.fields.length, 5, '5 fields');
assert.strictEqual(byId.wayfinding.now.lines.length, 3, 'now has 3 lines');
assert(!JSON.stringify(T).includes('好好'), 'client name must not appear');
assert(!JSON.stringify(T).includes('T-Pharma'), 'project code name must not appear');
console.log('data.js OK');
```

- [ ] **Step 2: Run it, expect failure**

Run: `node scripts/check-data.js`
Expected: error `ENOENT ... data.js`

- [ ] **Step 3: Write `data.js`**

```js
// ============================================================
//  Tiana's Tapes — 這是唯一需要改的檔案。
//  改完存檔、git push，一兩分鐘後網站就更新。
// ============================================================
window.TAPES = [
  {
    id: 'music',
    label: 'Music',
    title: 'On Repeat',
    subtitle: 'from YouTube Music',
    // Spotify 歌手 ID：打開 open.spotify.com 的歌手頁，網址最後那串 22 碼就是
    artists: [
      { name: 'The Weeknd',       spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ' },
      { name: 'Taylor Swift',     spotifyId: '06HL4z0CvFAxyc27GXpf02' },
      { name: 'Ariana Grande',    spotifyId: '66CXWjxzNUsdJxJ2JdwvnR' },
      { name: 'Tate McRae',       spotifyId: '45dkTj5sMRSjrmBSBeiHym' },
      { name: 'LANY',             spotifyId: '49tQo2QULno7gxHutgccqF' },
      { name: 'The Chainsmokers', spotifyId: '69GGBxA162lTqCwzJG5jLp' },
    ],
  },
  {
    id: 'reading',
    label: 'Reading',
    title: 'Shelf',
    subtitle: 'two sides, flip to switch',
    // 封面圖放 images/books/，檔名自己取，這裡填路徑
    sides: [
      { name: 'Side A · 商業・成長', books: [
        { title: '發現你的天職',            cover: 'images/books/a01.jpg' },
        { title: '好策略・壞策略',          cover: 'images/books/a02.jpg' },
        { title: '大格局大思維',            cover: 'images/books/a03.jpg' },
        { title: '底層邏輯',                cover: 'images/books/a04.jpg' },
        { title: '原子習慣',                cover: 'images/books/a05.jpg' },
        { title: '與成功有約',              cover: 'images/books/a06.jpg' },
        { title: '致富心態',                cover: 'images/books/a07.jpg' },
        { title: '慣習 Habitus',            cover: 'images/books/a08.jpg' },
        { title: '給予',                    cover: 'images/books/a09.jpg' },
        { title: 'The Diary of a CEO',      cover: 'images/books/a10.jpg' },
        { title: '世界盡頭的咖啡館',        cover: 'images/books/a11.jpg' },
        { title: 'Google 超級用人學',       cover: 'images/books/a12.jpg' },
      ]},
      { name: 'Side B · 心理・人性', books: [
        { title: '當你自律自控，才能又美又爽', cover: 'images/books/b01.jpg' },
        { title: '一個司法心理學家的告白',   cover: 'images/books/b02.jpg' },
        { title: '驗屍官傳奇',              cover: 'images/books/b03.jpg' },
        { title: '非常關係',                cover: 'images/books/b04.jpg' },
        { title: '也許你該找人聊聊',        cover: 'images/books/b05.jpg' },
        { title: '誰說人是理性的！',        cover: 'images/books/b06.jpg' },
        { title: '教出殺人犯',              cover: 'images/books/b07.jpg' },
        { title: '我們為何不愛了？',        cover: 'images/books/b08.jpg' },
      ]},
    ],
  },
  {
    id: 'screen',
    label: 'Screen',
    title: 'Rom-com Forever',
    subtitle: 'genre: rom-com',
    items: [
      '10 Things I Hate About You',
      'Love and Other Drugs',
      'Off Campus',
      'Friends',
      'The Big Bang Theory',
      'Suits',
    ],
  },
  {
    id: 'wayfinding',
    label: 'Way Finding',
    title: 'Way Finding',
    subtitle: 'fields I have wandered through',
    fields: [
      { name: '人資',        note: '工研院、金士頓人資實習；人資聚會總召' },
      { name: '心理諮商',    note: '清大教育心理與諮商學系' },
      { name: '顧問',        note: '清大管顧社 專案生、人才長，現在是專案助教' },
      { name: '引導 / 講師', note: 'Xplore 交大設計人生' },
      { name: '產品 PM',     note: '新創，專案開發與管理' },
    ],
    now: {
      label: 'now building',
      lines: [
        '正在幫連鎖藥局做一套新系統。',
        '先去藥局站在櫃台後面，看藥師怎麼叫藥、怎麼盤點、怎麼在 LINE 群組裡撈公告，把現場流程搞懂。',
        '然後把需求整理出來和跟 AI 一起 vibe coding，把系統做出來。',
      ],
    },
    photo: null, // 之後要放照片：改成 'images/me.jpg'
  },
];
```

- [ ] **Step 4: Run the check, expect pass**

Run: `node scripts/check-data.js`
Expected: `data.js OK`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: content data file and shape check

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Crop the 20 book covers

**Files:**
- Create: `scripts/crop-covers.py`
- Create: `images/books/a01.jpg` … `a12.jpg`, `b01.jpg` … `b08.jpg`
- Create: `images/books/contact.jpg` (temporary visual check, deleted at end of task)
- Source already present: `images/src/books-side-a.png` (1786×1052, 2 rows × 6), `images/src/books-side-b.png` (1380×942, 2 rows × 4)

**Interfaces:**
- Produces: the 20 cover files whose paths `data.js` already references.

- [ ] **Step 1: Write the failing check**

Append to `scripts/check-data.js`, just before `console.log('data.js OK')`:
```js
for (const s of byId.reading.sides) for (const b of s.books) {
  assert(fs.existsSync(__dirname + '/../' + b.cover), `missing cover file ${b.cover}`);
}
```

- [ ] **Step 2: Run it, expect failure**

Run: `node scripts/check-data.js`
Expected: `missing cover file images/books/a01.jpg`

- [ ] **Step 3: Write the crop script**

`scripts/crop-covers.py` — segments each slide by finding non-background columns/rows, so it does not depend on hand-measured pixel boxes:
```python
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
```

- [ ] **Step 4: Run it and look at the contact sheet**

Run: `python3 scripts/crop-covers.py`
Expected: `wrote 20 covers + contact.jpg`. If an assertion fires about row/col counts, adjust the `inner` box or the `< 25` merge gap and rerun.

Then view `images/books/contact.jpg` (Read tool on the image). Expected: 20 covers in order a01–a12 then b01–b08, each one a single whole book with no neighbor bleed. Check the right-most cover of side A row 2 (`a12`, Google 超級用人學): the slide clips it at the edge, so it will be narrower; that is acceptable.

- [ ] **Step 5: Run the data check, expect pass; remove the contact sheet**

Run: `node scripts/check-data.js`
Expected: `data.js OK`

Run: `rm images/books/contact.jpg`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: book cover images cropped from slides

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Page skeleton, tape box, open/close

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `script.js`

**Interfaces:**
- Consumes: `window.TAPES` from Task 1.
- Produces: DOM structure used by Task 4's renderers:
  - `<main class="box">` containing one `<button class="tape" data-id="…">` per tape, each with `<span class="spine">` text.
  - `<section class="jcard" data-id="…" hidden>` per tape, each with `.jcard-head` (counter + title + subtitle) and an empty `<div class="jcard-body">` that Task 4 fills via `RENDERERS[id](tape, bodyEl)`.
  - `script.js` exposes `window.RENDERERS = {}` (an object Task 4 populates) and calls `RENDERERS[tape.id]` if present when building each card.
  - State: `<body data-open="music">` while a tape is open, attribute removed when closed.

- [ ] **Step 1: Write `index.html`**

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tiana's Tapes</title>
  <meta name="description" content="A box of four tapes: music, reading, screen, and the way I'm finding.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Jost:wght@400;500&family=Noto+Sans+TC:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="box" aria-label="Tiana's Tapes"></main>
  <div class="cards"></div>
  <p class="box-label"><span>Tiana's Tapes</span><span class="count"></span></p>
  <script src="data.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `style.css`**

```css
:root {
  --bg: #f3efe6;
  --ink: #2b2722;
  --shell: #2b2722;
  --shell-ink: #f3efe6;
  --muted: #6d6559;
  --line: #d9d1c2;
  --accent: #d9534f;
  --font-head: 'Oswald', 'Noto Sans TC', sans-serif;
  --font-label: 'Jost', 'Noto Sans TC', sans-serif;
  --font-body: 'Noto Sans TC', -apple-system, 'PingFang TC', sans-serif;
  --ease: cubic-bezier(.2, .7, .2, 1);
}

* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
}

/* ---------- labels ---------- */
.label {
  font-family: var(--font-label);
  font-size: 11px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------- the box ---------- */
.box {
  width: min(420px, 100%);
  padding: 22px 22px 14px;
  border: 1px solid #9a9183;
  border-radius: 6px;
  background: #ece6da;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tape {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 18px;
  background: var(--shell);
  color: var(--shell-ink);
  border-radius: 3px;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.4);
  transition: transform .3s var(--ease), opacity .3s var(--ease);
}
.tape:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.tape:hover { transform: translateX(10px); }
.tape .spine {
  font-family: var(--font-label);
  font-size: 12px;
  letter-spacing: .24em;
  text-transform: uppercase;
}
/* slight stagger so it looks hand-placed */
.tape:nth-child(2) { margin-left: 14px; }
.tape:nth-child(3) { margin-left: 4px; }
.tape:nth-child(4) { margin-left: 20px; }

.box-label {
  margin: 14px 0 0;
  display: flex;
  gap: 22px;
  font-family: var(--font-label);
  font-size: 11px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------- open state ---------- */
body[data-open] .box, body[data-open] .box-label { opacity: .25; pointer-events: none; }
body[data-open] .tape[data-active] { transform: translateX(40px); opacity: 0; }

/* ---------- J-card ---------- */
.cards { position: fixed; inset: 0; display: grid; place-items: center; padding: 24px 16px; pointer-events: none; overflow-y: auto; }
.jcard {
  pointer-events: auto;
  width: min(560px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 48px 44px 44px;
  box-shadow: 0 24px 60px rgba(43,39,34,.18);
  transform: translateY(24px);
  opacity: 0;
  transition: transform .3s var(--ease), opacity .3s var(--ease);
}
.jcard[hidden] { display: none; }
.jcard.is-open { transform: none; opacity: 1; }
.jcard-head { margin-bottom: 36px; }
.jcard-head .label { display: flex; justify-content: space-between; margin-bottom: 14px; }
.jcard-head h2 {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: 40px;
  line-height: 1;
  margin: 0 0 8px;
  letter-spacing: .01em;
}
.jcard-head .subtitle { margin: 0; }
.jcard-body { font-size: 15px; line-height: 1.8; }
.jcard-close {
  all: unset;
  cursor: pointer;
  position: sticky;
  top: 0;
  float: right;
  margin: -24px -16px 0 0;
  font-family: var(--font-label);
  font-size: 11px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 8px 10px;
}
.jcard-close:hover { color: var(--ink); }

/* ---------- phone ---------- */
@media (max-width: 640px) {
  body { padding: 32px 16px; justify-content: flex-start; }
  .cards { position: static; display: block; padding: 0; }
  .jcard { width: 100%; max-height: none; margin-top: 16px; padding: 36px 24px; box-shadow: none; transform: none; }
  .jcard-head h2 { font-size: 32px; }
  body[data-open] .box, body[data-open] .box-label { opacity: 1; pointer-events: auto; }
  body[data-open] .tape[data-active] { transform: none; opacity: 1; outline: 2px solid var(--accent); }
  .tape:hover { transform: none; }
}
```

- [ ] **Step 3: Write `script.js`**

```js
// Renders the tape box and J-cards from window.TAPES; handles open/close.
(function () {
  const tapes = window.TAPES;
  const box = document.querySelector('.box');
  const cards = document.querySelector('.cards');
  const count = document.querySelector('.box-label .count');
  window.RENDERERS = window.RENDERERS || {};

  const pad = n => String(n).padStart(2, '0');

  tapes.forEach((tape, i) => {
    const btn = document.createElement('button');
    btn.className = 'tape';
    btn.dataset.id = tape.id;
    btn.setAttribute('aria-label', `Open ${tape.label}`);
    btn.innerHTML = `<span class="spine">${tape.label}</span>`;
    btn.addEventListener('click', () => open(tape.id));
    box.appendChild(btn);

    const card = document.createElement('section');
    card.className = 'jcard';
    card.dataset.id = tape.id;
    card.hidden = true;
    card.innerHTML = `
      <button class="jcard-close" type="button">close</button>
      <header class="jcard-head">
        <div class="label"><span>Tiana's Tapes</span><span>${pad(i + 1)} / ${pad(tapes.length)}</span></div>
        <h2></h2>
        <p class="label subtitle"></p>
      </header>
      <div class="jcard-body"></div>`;
    card.querySelector('h2').textContent = tape.title;
    card.querySelector('.subtitle').textContent = tape.subtitle || '';
    card.querySelector('.jcard-close').addEventListener('click', close);
    const render = window.RENDERERS[tape.id];
    if (render) render(tape, card.querySelector('.jcard-body'));
    cards.appendChild(card);
  });

  count.textContent = `${tapes.length} tapes`;

  function open(id) {
    close();
    document.body.dataset.open = id;
    box.querySelector(`.tape[data-id="${id}"]`).dataset.active = '';
    const card = cards.querySelector(`.jcard[data-id="${id}"]`);
    card.hidden = false;
    requestAnimationFrame(() => card.classList.add('is-open'));
    if (window.matchMedia('(max-width: 640px)').matches) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function close() {
    const id = document.body.dataset.open;
    if (!id) return;
    delete document.body.dataset.open;
    const t = box.querySelector('.tape[data-active]');
    if (t) delete t.dataset.active;
    const card = cards.querySelector(`.jcard[data-id="${id}"]`);
    card.classList.remove('is-open');
    card.hidden = true;
  }

  // click outside the card (desktop overlay) or press Escape closes it
  cards.addEventListener('click', e => { if (e.target === cards) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
```

- [ ] **Step 4: Verify in the browser**

Run (background): `python3 -m http.server 8787`
Open `http://localhost:8787/` in Chrome (claude-in-chrome tools), take a screenshot.
Expected: cream page, one box with four dark tapes labeled MUSIC / READING / SCREEN / WAY FINDING in spaced caps, "TIANA'S TAPES   4 TAPES" under the box.
Click MUSIC. Expected: box fades, a card appears centered with "TIANA'S TAPES   01 / 04", heading "On Repeat" in Oswald, subtitle "FROM YOUTUBE MUSIC". Body empty (renderers come in Task 4).
Press Escape. Expected: card gone, box back to full opacity.
Check the console (`read_console_messages`): no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tape box, J-card shell, open/close

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: The four J-card renderers

**Files:**
- Create: `renderers.js`
- Modify: `index.html` (add `<script src="renderers.js"></script>` **before** `script.js`, after `data.js`)
- Modify: `style.css` (append the section below)

**Interfaces:**
- Consumes: `window.RENDERERS` object created by `script.js`; but since `renderers.js` loads first it must create it: `window.RENDERERS = window.RENDERERS || {}`. Each renderer: `(tape, bodyEl) => void`.

- [ ] **Step 1: Write `renderers.js`**

```js
// One renderer per tape. Each fills the J-card body from the tape object in data.js.
window.RENDERERS = window.RENDERERS || {};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 01 MUSIC — Spotify public artist embeds; falls back to a plain list if an iframe fails to load.
window.RENDERERS.music = (tape, el) => {
  el.innerHTML = `<ol class="artists">${tape.artists.map((a, i) => `
    <li class="artist">
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
      <div class="artist-embed">
        <iframe title="${esc(a.name)} on Spotify" loading="lazy"
          src="https://open.spotify.com/embed/artist/${esc(a.spotifyId)}?utm_source=generator&theme=0"
          width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        <span class="artist-name">${esc(a.name)}</span>
      </div>
    </li>`).join('')}</ol>`;
  el.querySelectorAll('iframe').forEach(f => f.addEventListener('error', () => f.remove()));
};

// 02 READING — two sides, flip button, cover grid.
window.RENDERERS.reading = (tape, el) => {
  let side = 0;
  const draw = () => {
    const s = tape.sides[side];
    el.innerHTML = `
      <div class="side-bar">
        <span class="label">${esc(s.name)}</span>
        <button class="flip" type="button">flip to side ${side === 0 ? 'B' : 'A'} ↻</button>
      </div>
      <ul class="shelf">${s.books.map(b => `
        <li><img src="${esc(b.cover)}" alt="" loading="lazy"><span>${esc(b.title)}</span></li>`).join('')}</ul>`;
    el.querySelector('.flip').addEventListener('click', () => { side = 1 - side; draw(); });
  };
  draw();
};

// 03 SCREEN — plain numbered list.
window.RENDERERS.screen = (tape, el) => {
  el.innerHTML = `<ol class="list">${tape.items.map((t, i) => `
    <li><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(t)}</span></li>`).join('')}</ol>`;
};

// 04 WAY FINDING — five fields, then the "now building" block.
window.RENDERERS.wayfinding = (tape, el) => {
  el.innerHTML = `
    <ol class="fields">${tape.fields.map((f, i) => `
      <li><span class="n">${String(i + 1).padStart(2, '0')}</span><b>${esc(f.name)}</b><span class="note">${esc(f.note)}</span></li>`).join('')}</ol>
    <hr>
    <div class="now">
      <span class="label accent">● ${esc(tape.now.label)}</span>
      ${tape.now.lines.map(l => `<p>${esc(l)}</p>`).join('')}
      ${tape.photo ? `<img class="photo" src="${esc(tape.photo)}" alt="">` : ''}
    </div>`;
};
```

- [ ] **Step 2: Append to `style.css`**

```css
/* ---------- shared list bits ---------- */
.n { font-family: var(--font-label); font-size: 11px; letter-spacing: .1em; color: var(--muted); width: 28px; flex: none; font-variant-numeric: tabular-nums; }
.list, .fields, .artists { list-style: none; margin: 0; padding: 0; }
.list li { display: flex; align-items: baseline; gap: 14px; padding: 12px 0; border-bottom: 1px dotted var(--line); font-size: 16px; }

/* ---------- music ---------- */
.artist { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
.artist-embed { flex: 1; min-width: 0; }
.artist-embed iframe { display: block; border-radius: 12px; }
.artist-name { display: none; } /* shown only if the iframe was removed */
.artist-embed:not(:has(iframe)) .artist-name { display: block; padding: 12px 0; border-bottom: 1px dotted var(--line); font-size: 16px; }

/* ---------- reading ---------- */
.side-bar { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 22px; }
.flip { all: unset; cursor: pointer; font-family: var(--font-label); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink); border-bottom: 1px solid var(--ink); padding-bottom: 2px; }
.flip:hover { color: var(--accent); border-color: var(--accent); }
.shelf { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px 16px; }
.shelf li { display: flex; flex-direction: column; gap: 8px; }
.shelf img { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 2px; box-shadow: 0 2px 8px rgba(43,39,34,.15); background: #e4ded2; }
.shelf span { font-size: 12px; line-height: 1.5; color: var(--muted); }

/* ---------- way finding ---------- */
.fields { display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; }
.fields li { display: flex; align-items: baseline; gap: 14px; }
.fields b { font-size: 17px; font-weight: 700; min-width: 108px; }
.fields .note { font-size: 13px; color: var(--muted); }
.jcard hr { border: 0; border-top: 1px solid var(--line); margin: 0 0 32px; }
.now .label.accent { color: var(--accent); display: block; margin-bottom: 10px; }
.now p { margin: 0 0 6px; font-size: 15px; }
.now .photo { display: block; width: 140px; margin-top: 24px; border-radius: 4px; }

@media (max-width: 640px) {
  .shelf { grid-template-columns: repeat(3, 1fr); gap: 18px 12px; }
  .fields b { min-width: 0; }
  .fields li { flex-wrap: wrap; }
  .fields .note { width: 100%; padding-left: 42px; }
}
```

- [ ] **Step 3: Wire the script into `index.html`**

Change the two script tags to three:
```html
  <script src="data.js"></script>
  <script src="renderers.js"></script>
  <script src="script.js"></script>
```

- [ ] **Step 4: Verify every card in the browser**

Reload `http://localhost:8787/` in Chrome, then for each tape click it, screenshot, press Escape:
- MUSIC: six Spotify artist cards stacked, each with artist image and a play button. If an embed shows "Couldn't load", that is a Spotify-side block and the fallback name should appear instead; note it in the report.
- READING: "SIDE A · 商業・成長", a 4-column grid of 12 covers with titles under them; click "FLIP TO SIDE B": 8 covers, side label changes; click again returns to A.
- SCREEN: six numbered titles, dotted dividers.
- WAY FINDING: five numbered fields with bold name and muted note; hairline; red "● NOW BUILDING"; the three lines of copy; no photo.
Console: no errors (Spotify's own iframe warnings are fine).
Expected overall feel: airy. If any card looks crowded, increase the `gap`/`margin` values in that card's section rather than shrinking type.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: music, reading, screen, way finding cards

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Phone layout check

**Files:**
- Modify: `style.css` (only if the check below finds problems)

- [ ] **Step 1: Resize and check**

With the local server still running, use `mcp__claude-in-chrome__resize_window` to 400×800 and reload. Screenshot the box, then open each tape in turn and screenshot.
Expected:
- Box fills the width with a 16px gutter each side; four tapes stacked; no horizontal scrollbar (`document.documentElement.scrollWidth === window.innerWidth` via `javascript_tool`).
- Opening a tape keeps the box visible (not dimmed), highlights the active tape with a red outline, and the card appears below the box; page scrolls to the card.
- READING grid is 3 columns; WAY FINDING notes wrap under their field name.

- [ ] **Step 2: Fix anything that broke**

Typical fixes: if the card's `48px 44px` padding survives at phone width the media query did not apply (check the `max-width: 640px` block is after the desktop rules); if the Spotify iframes overflow, add `.artist-embed iframe { max-width: 100%; }`.

- [ ] **Step 3: Re-run the data check and commit**

Run: `node scripts/check-data.js` → `data.js OK`
```bash
git add -A
git commit -m "fix: phone layout adjustments

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```
(Skip the commit if nothing changed.)

---

### Task 6: README for the owner

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`** (Traditional Chinese, for the owner who is new to code)

```markdown
# Tiana's Tapes

我的個人網站：https://iamtiana.github.io

## 想改內容的時候

只要改 `data.js` 這一個檔案。

- 歌手：改 `artists` 裡的名字和 Spotify ID（打開 open.spotify.com 的歌手頁，網址最後那串 22 碼）。
- 書：封面圖放進 `images/books/`，然後在 `sides` 裡加一行 `{ title: '書名', cover: 'images/books/檔名.jpg' }`。
- 影集：`items` 裡加一行字串。
- Way Finding：`fields` 改領域，`now.lines` 改現在在做的事，`photo` 填圖片路徑就會顯示照片。

改完存檔，在這個資料夾執行：

    git add -A
    git commit -m "update content"
    git push

一兩分鐘後網站就更新了。

## 在本機預覽

    python3 -m http.server 8787

然後打開 http://localhost:8787/

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `data.js` | 所有內容（唯一要改的檔案） |
| `index.html` | 頁面骨架 |
| `style.css` | 樣式 |
| `renderers.js` | 四捲卡帶內頁怎麼畫 |
| `script.js` | 卡帶箱、開合互動 |
| `scripts/check-data.js` | 檢查 `data.js` 有沒有填錯：`node scripts/check-data.js` |
| `scripts/crop-covers.py` | 當初從投影片裁書封用的，平常不用碰 |
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "docs: owner README

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Publish to GitHub Pages

**Files:** none new.

**Note on branches:** this session works on branch `worktree-site`. GitHub Pages for a `<user>.github.io` repo serves the `main` branch root. The session rules forbid pushing to `main` directly, so: push `worktree-site`, open a PR, and tell the owner to merge it (one click). Pages then publishes automatically.

- [ ] **Step 1: Create the repo and push the branch**

```bash
gh repo create iamtiana/iamtiana.github.io --public --source=. --remote=origin --push
```
If the repo already exists: `git remote add origin https://github.com/iamtiana/iamtiana.github.io.git` then `git push -u origin worktree-site`.
Expected: branch `worktree-site` on GitHub. Also push `main` from the shared checkout is NOT allowed from this session; the PR handles it.

- [ ] **Step 2: Open the PR**

```bash
gh pr create --base main --head worktree-site --title "Tiana's Tapes v1" --body "First version of the site: tape box with Music / Reading / Screen / Way Finding.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
Expected: a PR URL. Report it to the owner.

- [ ] **Step 3: After the owner merges, verify live**

Open `https://iamtiana.github.io/` in Chrome (may take 1–2 minutes after merge). Expected: identical to local. If 404 persists after 5 minutes, check repo Settings → Pages → Source is "Deploy from a branch", branch `main`, folder `/ (root)`.

---

## Self-review notes

- Spec coverage: box + spines (T3), open/close + Escape + outside click (T3), phone stacking (T3 CSS + T5), Music embeds with text fallback (T4), Reading A/B flip + 4/3 columns (T4), Screen list (T4), Way Finding fields + now block + photo slot (T4), data-only editing (T1, T6), no client name (T1 check), deploy + live check (T7). No dark mode, blog, CMS, domain (spec's YAGNI list).
- Names used consistently: `window.TAPES`, `window.RENDERERS`, `.jcard`, `.jcard-body`, `data-open`, `data-active`, `scripts/check-data.js`.
- `renderers.js` must load before `script.js` (T4 step 3) because `script.js` calls renderers at build time.
