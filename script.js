// Renders the bookshelf (one cover per entry in window.TAPES) and the J-cards; handles open/close.
// Each book may have several cover editions (`covers`); one is picked at random per page load,
// and the "shuffle" link under the shelf re-deals them.
(function () {
  const tapes = window.TAPES;
  const site = window.SITE || { name: "Tiana's Library" };
  const shelf = document.querySelector('.books');
  const cards = document.querySelector('.cards');
  const nameEl = document.querySelector('.box-label .name');
  const count = document.querySelector('.box-label .count');
  const shuffleBtn = document.querySelector('.box-label .shuffle');
  window.RENDERERS = window.RENDERERS || {};

  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const editionsOf = tape => (tape.covers && tape.covers.length) ? tape.covers : [tape.cover || {}];

  // Paint one cover edition onto a book button.
  function paint(btn, tape, i, c) {
    let mark = (window.COVER_MARKS && window.COVER_MARKS[c.mark]) ? window.COVER_MARKS[c.mark](c) : '';
    if (c.layout === 'band') mark = mark.replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
    btn.className = `book layout-${c.layout || 'bottom'}`;
    btn.style.background = c.bg || '#2b2722';
    btn.style.color = c.ink || '#f6efe3';
    btn.innerHTML = `
      <span class="k"><span>${esc(tape.label)}</span><span>${pad(i + 1)}</span></span>
      <span class="mark">${mark}</span>
      <span class="t">${esc(tape.title)}</span>`;
  }

  // Deal a random edition to every book; avoid repeating the current one when there are alternatives.
  function deal() {
    shelf.querySelectorAll('.book').forEach((btn, i) => {
      const tape = tapes[i];
      const eds = editionsOf(tape);
      let idx = Math.floor(Math.random() * eds.length);
      if (eds.length > 1 && String(idx) === btn.dataset.edition) idx = (idx + 1) % eds.length;
      btn.dataset.edition = idx;
      paint(btn, tape, i, eds[idx]);
    });
  }

  tapes.forEach((tape, i) => {
    const btn = document.createElement('button');
    btn.className = 'book';
    btn.dataset.id = tape.id;
    btn.setAttribute('aria-label', `Open ${tape.title}`);
    btn.addEventListener('click', () => open(tape.id));
    shelf.appendChild(btn);

    const card = document.createElement('section');
    card.className = 'jcard';
    card.dataset.id = tape.id;
    card.hidden = true;
    card.innerHTML = `
      <button class="jcard-close" type="button" aria-label="Close">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
      <div class="jcard-scroll">
        <header class="jcard-head">
          <div class="label"><span>${esc(site.name)}</span><span>${pad(i + 1)} / ${pad(tapes.length)}</span></div>
          <h2></h2>
          <p class="label subtitle"></p>
        </header>
        <div class="jcard-body"></div>
      </div>`;
    card.querySelector('h2').textContent = tape.title;
    card.querySelector('.subtitle').textContent = tape.subtitle || '';
    card.querySelector('.jcard-close').addEventListener('click', close);
    const render = window.RENDERERS[tape.id];
    if (render) render(tape, card.querySelector('.jcard-body'));
    cards.appendChild(card);
  });

  deal();
  nameEl.textContent = site.name;
  count.textContent = `${tapes.length} books`;
  if (shuffleBtn) shuffleBtn.addEventListener('click', deal);

  function open(id) {
    close();
    document.body.dataset.open = id;
    shelf.querySelector(`.book[data-id="${id}"]`).dataset.active = '';
    const card = cards.querySelector(`.jcard[data-id="${id}"]`);
    card.hidden = false;
    requestAnimationFrame(() => card.classList.add('is-open'));
    if (window.matchMedia('(max-width: 640px)').matches) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function close() {
    const id = document.body.dataset.open;
    if (!id) return;
    delete document.body.dataset.open;
    const t = shelf.querySelector('.book[data-active]');
    if (t) delete t.dataset.active;
    const card = cards.querySelector(`.jcard[data-id="${id}"]`);
    card.classList.remove('is-open');
    card.hidden = true;
  }

  // click outside the card (desktop overlay) or press Escape closes it
  cards.addEventListener('click', e => { if (e.target === cards) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
