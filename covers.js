// Cover artwork and "likes" icons, all inline SVG so they stay crisp and easy to recolor.
// Each cover mark is a function (colors) => svg string; colors come from data.js `cover`.
window.COVER_MARKS = {
  // 01 music: teal panel, cream record, accent centre
  record: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <circle cx="32" cy="32" r="24" fill="${c.paper}"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="${c.panel}" stroke-width="1.5"/>
    <circle cx="32" cy="32" r="10" fill="none" stroke="${c.panel}" stroke-width="1.5"/>
    <circle cx="32" cy="32" r="4.5" fill="${c.bg}"/></svg>`,
  // 02 reading: sand panel, book spines, one accent book, dark shelf
  shelf: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <rect x="10" y="16" width="8" height="36" fill="${c.bg}"/>
    <rect x="21" y="10" width="8" height="42" fill="${c.bg}"/>
    <rect x="32" y="20" width="8" height="32" fill="${c.accent}"/>
    <rect x="44" y="12" width="9" height="40" fill="${c.bg}" transform="rotate(9 48 32)"/>
    <rect x="6" y="52" width="52" height="3" fill="${c.dark}"/></svg>`,
  // 03 screen: navy panel, cream screen, coral heart
  screen: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <rect x="8" y="12" width="48" height="34" rx="3" fill="${c.paper}"/>
    <path d="M32 40 C24 34 19 29 19 23.5 a6.5 6.5 0 0 1 13 -2.5 a6.5 6.5 0 0 1 13 2.5 c0 5.5 -5 10.5 -13 16.5z" fill="${c.accent}"/>
    <rect x="26" y="48" width="12" height="4" fill="${c.paper}"/></svg>`,
  // 04 way finding: cream panel, yellow sun, orange path, navy pins
  path: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    <circle cx="32" cy="32" r="22" fill="${c.panel}"/>
    <path d="M12 50 L26 34 L33 41 L52 14" fill="none" stroke="${c.accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="52" cy="14" r="5" fill="${c.dark}"/>
    <circle cx="12" cy="50" r="3" fill="${c.dark}"/></svg>`,
  // 05 likes: cream panel, sun, two waves
  waves: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    <circle cx="46" cy="18" r="8" fill="${c.accent}"/>
    <path d="M0 40 Q8 32 16 40 T32 40 T48 40 T64 40 V64 H0z" fill="${c.bg}"/>
    <path d="M0 50 Q8 42 16 50 T32 50 T48 50 T64 50 V64 H0z" fill="${c.dark}"/></svg>`,

  // ---- alternate editions ----
  // music: equalizer bars
  equalizer: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    ${[18, 34, 26, 44, 30, 20].map((h, i) => `<rect x="${8 + i * 9}" y="${54 - h}" width="6" height="${h}" fill="${i === 3 ? c.accent : c.paper}"/>`).join('')}
    <rect x="6" y="54" width="52" height="2" fill="${c.dark}"/></svg>`,
  // music: sound waves from a corner
  soundwave: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    <circle cx="10" cy="54" r="48" fill="${c.panel}"/>
    <circle cx="10" cy="54" r="36" fill="${c.paper}"/>
    <circle cx="10" cy="54" r="24" fill="${c.bg}"/>
    <circle cx="10" cy="54" r="12" fill="${c.paper}"/>
    <circle cx="10" cy="54" r="4" fill="${c.dark}"/></svg>`,
  // reading: open book
  openbook: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <path d="M8 16 Q20 12 32 18 V50 Q20 44 8 48z" fill="${c.paper}"/>
    <path d="M56 16 Q44 12 32 18 V50 Q44 44 56 48z" fill="${c.paper}"/>
    <path d="M32 18 V50" stroke="${c.dark}" stroke-width="2"/>
    <rect x="40" y="10" width="5" height="22" fill="${c.accent}"/>
    <path d="M40 32 l2.5 -3 2.5 3z" fill="${c.panel}"/></svg>`,
  // reading: a stack of books
  stack: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <rect x="14" y="44" width="38" height="8" fill="${c.paper}"/>
    <rect x="10" y="34" width="40" height="8" fill="${c.dark}"/>
    <rect x="16" y="24" width="36" height="8" fill="${c.accent}"/>
    <rect x="12" y="14" width="34" height="8" fill="${c.paper}"/></svg>`,
  // screen: clapperboard
  clapper: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <rect x="8" y="24" width="48" height="30" rx="2" fill="${c.dark}"/>
    <path d="M8 24 l4 -12 h44 l-4 12z" fill="${c.paper}"/>
    <path d="M14 12 l-4 12 M24 12 l-4 12 M34 12 l-4 12 M44 12 l-4 12 M54 12 l-4 12" stroke="${c.dark}" stroke-width="3"/>
    <circle cx="32" cy="40" r="6" fill="${c.accent}"/></svg>`,
  // screen: popcorn
  popcorn: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <path d="M14 26 h36 l-4 28 h-28z" fill="${c.paper}"/>
    <path d="M22 26 l-1 28 M32 26 v28 M42 26 l1 28" stroke="${c.accent}" stroke-width="4"/>
    <g fill="${c.paper}"><circle cx="20" cy="22" r="6"/><circle cx="32" cy="16" r="7"/><circle cx="44" cy="22" r="6"/><circle cx="26" cy="14" r="5"/><circle cx="38" cy="13" r="5"/></g></svg>`,
  // way finding: compass
  compass: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.panel}"/>
    <circle cx="32" cy="32" r="24" fill="${c.paper}"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="${c.dark}" stroke-width="2"/>
    <path d="M32 10 L38 32 L32 54 L26 32z" fill="${c.dark}"/>
    <path d="M32 10 L38 32 L26 32z" fill="${c.accent}"/>
    <circle cx="32" cy="32" r="3" fill="${c.paper}"/></svg>`,
  // way finding: signpost
  signpost: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    <rect x="30" y="10" width="4" height="48" fill="${c.dark}"/>
    <path d="M14 16 h26 l5 5 -5 5 h-26z" fill="${c.panel}"/>
    <path d="M50 30 h-26 l-5 5 5 5 h26z" fill="${c.accent}"/>
    <path d="M18 44 h22 l5 5 -5 5 h-22z" fill="${c.bg}"/></svg>`,
  // likes: rising sun
  sun: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    ${[0, 30, 60, 90, 120, 150, 180].map(a => `<line x1="32" y1="40" x2="${(32 + 30 * Math.cos(Math.PI * a / 180)).toFixed(1)}" y2="${(40 - 30 * Math.sin(Math.PI * a / 180)).toFixed(1)}" stroke="${c.panel}" stroke-width="2.5"/>`).join('')}
    <circle cx="32" cy="40" r="14" fill="${c.accent}"/>
    <rect x="0" y="40" width="64" height="24" fill="${c.bg}"/>
    <rect x="0" y="40" width="64" height="3" fill="${c.dark}"/></svg>`,
  // likes: horizon stripes
  stripes: c => `<svg viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${c.paper}"/>
    <rect y="8" width="64" height="10" fill="${c.panel}"/>
    <rect y="22" width="64" height="10" fill="${c.accent}"/>
    <rect y="36" width="64" height="10" fill="${c.bg}"/>
    <rect y="50" width="64" height="10" fill="${c.dark}"/>
    <circle cx="46" cy="27" r="7" fill="${c.paper}"/></svg>`,
};

// Icons for the "My Likes" page. Keyed by the `icon` field in data.js. Drawn in the same flat style.
const P = '#f6efe3', K = '#2b2722', N = '#2b3a4f';
window.LIKE_ICONS = {
  sea: `<svg viewBox="0 0 40 40"><path d="M2 16 Q7 10 12 16 T22 16 T32 16 T42 16" fill="none" stroke="${P}" stroke-width="3" stroke-linecap="round"/><path d="M2 26 Q7 20 12 26 T22 26 T32 26 T42 26" fill="none" stroke="${P}" stroke-width="3" stroke-linecap="round"/></svg>`,
  longEarDog: `<svg viewBox="0 0 40 40"><ellipse cx="7" cy="22" rx="5" ry="12" fill="#fff" transform="rotate(14 7 22)"/><ellipse cx="33" cy="22" rx="5" ry="12" fill="#fff" transform="rotate(-14 33 22)"/><circle cx="20" cy="20" r="13" fill="#fff"/><circle cx="15" cy="19" r="1.6" fill="${K}"/><circle cx="25" cy="19" r="1.6" fill="${K}"/><path d="M17 25 q3 2.5 6 0" fill="none" stroke="${K}" stroke-width="1.4" stroke-linecap="round"/><circle cx="12.5" cy="23.5" r="1.6" fill="#f3b7c3"/><circle cx="27.5" cy="23.5" r="1.6" fill="#f3b7c3"/></svg>`,
  // nine Pantone-ish blues, sky → navy, laid out like a swatch book
  blue: `<svg viewBox="0 0 40 40">${[
      '#a7d8f0', '#7fb3d5', '#5b9bd5',
      '#3d8fd1', '#2f6fb0', '#0f4c81',
      '#1f3a93', '#223a5e', '#14213d',
    ].map((c, i) => `<rect x="${4 + (i % 3) * 11}" y="${4 + Math.floor(i / 3) * 11}" width="10" height="10" rx="1.5" fill="${c}"/>`).join('')}</svg>`,
  cafe: `<svg viewBox="0 0 40 40"><path d="M8 16 h20 v9 a8 8 0 0 1 -8 8 h-4 a8 8 0 0 1 -8 -8z" fill="${P}"/><path d="M28 18 h3 a4 4 0 0 1 0 8 h-3" fill="none" stroke="${P}" stroke-width="2.5"/><path d="M14 12 q1 -3 0 -5 M20 12 q1 -3 0 -5" fill="none" stroke="${P}" stroke-width="2" stroke-linecap="round"/></svg>`,
  cat: `<svg viewBox="0 0 40 40"><path d="M9 30 V13 l6 5 h10 l6 -5 v17z" fill="#ecbc5a"/><circle cx="16" cy="22" r="1.6" fill="${N}"/><circle cx="24" cy="22" r="1.6" fill="${N}"/><path d="M18.5 26 h3 l-1.5 1.5z" fill="${N}"/></svg>`,
  tv: `<svg viewBox="0 0 40 40"><rect x="5" y="9" width="30" height="20" rx="2" fill="${K}"/><path d="M17 14 l9 5 -9 5z" fill="#ecbc5a"/><rect x="14" y="31" width="12" height="2.5" fill="${K}"/></svg>`,
  strawberry: `<svg viewBox="0 0 40 40"><path d="M20 12 c8 0 12 5 12 10 c0 7 -6 13 -12 13 s-12 -6 -12 -13 c0 -5 4 -10 12 -10z" fill="#d7463e"/><path d="M14 11 q6 -5 12 0 l-3 4 h-6z" fill="#5c8a5a"/><g fill="${P}"><circle cx="16" cy="21" r="1.1"/><circle cx="24" cy="21" r="1.1"/><circle cx="20" cy="26" r="1.1"/><circle cx="16" cy="29" r="1.1"/><circle cx="24" cy="29" r="1.1"/></g></svg>`,
  walk: `<svg viewBox="0 0 40 40"><g fill="${P}"><ellipse cx="14" cy="24" rx="4" ry="6"/><ellipse cx="14" cy="14" rx="2" ry="2.5"/><ellipse cx="26" cy="20" rx="4" ry="6" transform="rotate(10 26 20)"/><ellipse cx="27" cy="10" rx="2" ry="2.5"/></g></svg>`,
  music: `<svg viewBox="0 0 40 40"><path d="M16 29 V11 l14 -3 v16" fill="none" stroke="${P}" stroke-width="3" stroke-linejoin="round"/><circle cx="12" cy="29" r="4" fill="${P}"/><circle cx="26" cy="25" r="4" fill="${P}"/></svg>`,
  disco: `<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="11" fill="#c9c2b5"/><g stroke="${K}" stroke-width="1" fill="none"><path d="M9 22 h22 M11 17 h18 M11 27 h18 M20 11 v22 M15 12 v20 M25 12 v20"/></g><rect x="19" y="5" width="2" height="6" fill="#c9c2b5"/><circle cx="7" cy="12" r="1.5" fill="#ecbc5a"/><circle cx="33" cy="10" r="1.5" fill="#e8826f"/><circle cx="32" cy="32" r="1.5" fill="#4f86b3"/></svg>`,
  food: `<svg viewBox="0 0 40 40"><path d="M7 19 h26 a13 13 0 0 1 -26 0z" fill="${P}"/><rect x="5" y="17" width="30" height="3" rx="1.5" fill="${K}"/><path d="M12 8 l16 9 M16 6 l12 11" stroke="${K}" stroke-width="2" stroke-linecap="round"/></svg>`,
  // cupcake: pleated wrapper, swirl of frosting, cherry
  dessert: `<svg viewBox="0 0 40 40"><path d="M11 22 h18 l-2.5 11 h-13z" fill="#6b3f2a"/><path d="M15 22 v11 M20 22 v11 M25 22 v11" stroke="${P}" stroke-width="1" opacity=".5"/><circle cx="14" cy="20" r="5" fill="${P}"/><circle cx="26" cy="20" r="5" fill="${P}"/><circle cx="20" cy="16" r="6" fill="${P}"/><circle cx="20" cy="11.5" r="3" fill="${P}"/><circle cx="20" cy="8.5" r="2.4" fill="#d7463e"/></svg>`,
  // milk tea: cup with lid, straw, a few pearls
  milkTea: `<svg viewBox="0 0 40 40"><path d="M11 13 h18 l-2 19 a3 3 0 0 1 -3 2.5 h-8 a3 3 0 0 1 -3 -2.5z" fill="#e9d8a6"/><path d="M11 13 h18 l-2 19 a3 3 0 0 1 -3 2.5 h-8 a3 3 0 0 1 -3 -2.5z" fill="none" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"/><rect x="9.5" y="11" width="21" height="3" rx="1.5" fill="${K}"/><path d="M23 5 l-4 10" stroke="${K}" stroke-width="2" stroke-linecap="round"/><g fill="${K}"><circle cx="16" cy="29" r="1.5"/><circle cx="20.5" cy="30.5" r="1.5"/><circle cx="24" cy="28.5" r="1.5"/></g></svg>`,
  // Sicilian coffee: iced americano in a glass with a lemon wheel
  sicilianCoffee: `<svg viewBox="0 0 40 40"><path d="M11 10 h18 l-1.5 22 a2.5 2.5 0 0 1 -2.5 2.5 h-10 a2.5 2.5 0 0 1 -2.5 -2.5z" fill="#6b3f2a"/><path d="M11 10 h18 l-1.5 22 a2.5 2.5 0 0 1 -2.5 2.5 h-10 a2.5 2.5 0 0 1 -2.5 -2.5z" fill="none" stroke="${P}" stroke-width="1.4" stroke-linejoin="round"/><g fill="${P}" opacity=".85"><rect x="14" y="19" width="4" height="4" rx="1" transform="rotate(12 16 21)"/><rect x="21" y="24" width="4" height="4" rx="1" transform="rotate(-10 23 26)"/></g><circle cx="27" cy="10" r="5" fill="#ecbc5a"/><circle cx="27" cy="10" r="5" fill="none" stroke="${P}" stroke-width="1.2"/><path d="M27 5 v10 M22 10 h10 M23.5 6.5 l7 7 M30.5 6.5 l-7 7" stroke="${P}" stroke-width=".9"/></svg>`,
  // matcha oat latte: tall glass, green bottom, milk layer, straw
  matchaLatte: `<svg viewBox="0 0 40 40"><path d="M12 9 h16 v22 a3 3 0 0 1 -3 3 h-10 a3 3 0 0 1 -3 -3z" fill="${P}"/><path d="M12 20 h16 v11 a3 3 0 0 1 -3 3 h-10 a3 3 0 0 1 -3 -3z" fill="#6fa36b"/><path d="M12 17 q4 -3 8 0 t8 0 v4 h-16z" fill="#a9c99b"/><path d="M12 9 h16 v22 a3 3 0 0 1 -3 3 h-10 a3 3 0 0 1 -3 -3z" fill="none" stroke="${K}" stroke-width="1.4" stroke-linejoin="round"/><path d="M24 4 l-3 9" stroke="${K}" stroke-width="2" stroke-linecap="round"/></svg>`,
  volleyball: `<svg viewBox="0 0 40 40"><defs><clipPath id="vb"><circle cx="20" cy="20" r="13"/></clipPath></defs><circle cx="20" cy="20" r="13" fill="${P}"/><g clip-path="url(#vb)" fill="none" stroke="${N}" stroke-width="1.5" stroke-linecap="round"><path d="M20 20 Q29 20 31.3 13.5"/><path d="M20 20 Q15.5 27.8 20 33"/><path d="M20 20 Q15.5 12.2 8.7 13.5"/><path d="M22 23.5 Q31 23.5 34 17"/><path d="M16 20 Q11.5 27.8 16 34"/><path d="M22 16.5 Q17.5 8.7 10 10"/></g><circle cx="20" cy="20" r="13" fill="none" stroke="${N}" stroke-width="1.6"/></svg>`,
};
