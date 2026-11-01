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
