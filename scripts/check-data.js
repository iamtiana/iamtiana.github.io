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
for (const s of byId.reading.sides) for (const b of s.books) {
  assert(fs.existsSync(__dirname + '/../' + b.cover), `missing cover file ${b.cover}`);
}
console.log('data.js OK');
