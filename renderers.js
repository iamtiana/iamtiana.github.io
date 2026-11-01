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

// 02 READING — two sides, flip button, cover grid; click a cover to open it in the "now open" panel above the grid.
window.RENDERERS.reading = (tape, el) => {
  let side = 0;
  const picked = tape.sides.map(() => 0); // selected book index per side
  const draw = (scrollToDetail) => {
    const s = tape.sides[side];
    const b = s.books[picked[side]];
    el.innerHTML = `
      <div class="side-bar">
        <span class="label">${esc(s.name)}</span>
        <button class="flip" type="button">flip to side ${side === 0 ? 'B' : 'A'} ↻</button>
      </div>
      <div class="book-detail">
        <img src="${esc(b.cover)}" alt="">
        <div class="book-text">
          <span class="label">now open · ${String(picked[side] + 1).padStart(2, '0')} / ${String(s.books.length).padStart(2, '0')}</span>
          <h3>${esc(b.title)}</h3>
          ${b.author ? `<p class="book-author">${esc(b.author)}</p>` : ''}
          ${b.blurb ? `<p class="book-blurb">${esc(b.blurb)}</p>` : ''}
        </div>
      </div>
      <ul class="shelf">${s.books.map((bk, i) => `
        <li class="${i === picked[side] ? 'is-selected' : ''}" data-i="${i}"><img src="${esc(bk.cover)}" alt="" loading="lazy"><span>${esc(bk.title)}</span></li>`).join('')}</ul>`;
    el.querySelector('.flip').addEventListener('click', () => { side = 1 - side; draw(false); });
    el.querySelectorAll('.shelf li').forEach(li => li.addEventListener('click', () => {
      picked[side] = Number(li.dataset.i);
      draw(true);
    }));
    if (scrollToDetail) el.querySelector('.book-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  draw(false);
};

// 03 SCREEN — poster wall; each poster links to its source page. Items without a poster fall back to a text row.
window.RENDERERS.screen = (tape, el) => {
  const items = tape.items.map(t => typeof t === 'string' ? { title: t } : t);
  const withPoster = items.filter(t => t.poster);
  const textOnly = items.filter(t => !t.poster);
  el.innerHTML = `
    ${withPoster.length ? `<ul class="shelf posters">${withPoster.map(t => `
      <li><a href="${esc(t.link || '#')}" target="_blank" rel="noopener"><img src="${esc(t.poster)}" alt="" loading="lazy"></a><span>${esc(t.title)}</span></li>`).join('')}</ul>` : ''}
    ${textOnly.length ? `<ol class="list">${textOnly.map((t, i) => `
      <li><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(t.title)}</span></li>`).join('')}</ol>` : ''}
    ${tape.credit ? `<p class="label credit">${esc(tape.credit)}</p>` : ''}`;
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
