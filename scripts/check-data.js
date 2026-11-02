// Loads data.js in a fake browser global and asserts the content shape.
const fs = require('fs');
const assert = require('assert');
global.window = {};
eval(fs.readFileSync(__dirname + '/../data.js', 'utf8'));
const T = window.TAPES;
assert(Array.isArray(T) && T.length === 5, 'TAPES must have 5 books');
const byId = Object.fromEntries(T.map(t => [t.id, t]));
assert.deepStrictEqual(T.map(t => t.id), ['music', 'reading', 'screen', 'wayfinding', 'likes']);
for (const t of T) {
  assert(t.label && t.title, `book ${t.id} needs label and title`);
  const eds = (t.covers && t.covers.length) ? t.covers : [t.cover];
  assert(eds.length >= 1 && eds[0], `book ${t.id} needs at least one cover`);
  for (const c of eds) {
    assert(c.bg && c.mark, `book ${t.id}: every cover needs bg and mark`);
    assert(!c.layout || ['bottom', 'top', 'band'].includes(c.layout), `book ${t.id}: layout must be bottom/top/band`);
  }
}
// every mark name must exist in covers.js
global.window = Object.assign(global.window, {});
eval(fs.readFileSync(__dirname + '/../covers.js', 'utf8'));
for (const t of T) for (const c of ((t.covers && t.covers.length) ? t.covers : [t.cover])) {
  assert(window.COVER_MARKS[c.mark], `book ${t.id}: unknown mark "${c.mark}"`);
}
for (const it of byId.likes.items) assert(window.LIKE_ICONS[it.icon], `unknown like icon "${it.icon}"`);
assert(byId.likes.items.length >= 1, 'likes needs items');
for (const it of byId.likes.items) assert(it.name && it.en && it.icon && it.bg, `bad like ${JSON.stringify(it)}`);
assert(byId.music.artists.length >= 1, 'at least 1 artist');
for (const a of byId.music.artists) assert(/^[A-Za-z0-9]{22}$/.test(a.spotifyId), `bad spotifyId for ${a.name}`);
for (const t of (byId.music.tracks || [])) assert(t.name && t.artist && /^[A-Za-z0-9]{22}$/.test(t.spotifyId), `bad track ${JSON.stringify(t)}`);
assert.strictEqual(byId.reading.sides.length, 2, '2 sides');
assert.strictEqual(byId.reading.sides[0].books.length, 12, 'side A has 12 books');
assert.strictEqual(byId.reading.sides[1].books.length, 8, 'side B has 8 books');
for (const s of byId.reading.sides) for (const b of s.books) assert(b.title && /^images\/books\/.+\.jpg$/.test(b.cover), `bad book ${JSON.stringify(b)}`);
assert(byId.screen.items.length >= 1, 'at least 1 screen item');
assert.strictEqual(new Set(byId.screen.items.map(i => typeof i === 'string' ? i : i.title)).size, byId.screen.items.length, 'duplicate screen title');
for (const it of byId.screen.items) {
  if (typeof it === 'string') continue;
  assert(it.title, `screen item needs a title: ${JSON.stringify(it)}`);
  if (it.poster) assert(/^https:\/\//.test(it.poster), `poster must be an https URL: ${it.title}`);
}
assert.strictEqual(byId.wayfinding.fields.length, 5, '5 fields');
assert.strictEqual(byId.wayfinding.now.lines.length, 3, 'now has 3 lines');
assert(!JSON.stringify(T).includes('好好'), 'client name must not appear');
assert(!JSON.stringify(T).includes('T-Pharma'), 'project code name must not appear');
for (const s of byId.reading.sides) for (const b of s.books) {
  assert(fs.existsSync(__dirname + '/../' + b.cover), `missing cover file ${b.cover}`);
}
console.log('data.js OK');
