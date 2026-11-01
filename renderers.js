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
