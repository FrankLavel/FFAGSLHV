// Progreso guardado en este dispositivo (localStorage).
const KEY = 'cartitas-progreso';
const state = Object.assign({ cartas: [], recuerdos: [], flores: 0, juego: false }, load());
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} refresh(); }

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(2, '0');
const M = DATA.metas;

/* Ilustraciones SVG */
// Degradados compartidos en un SVG siempre visible (los SVG dentro de vistas ocultas no los resuelven bien).
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <radialGradient id="wax" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#A8475F"/><stop offset=".55" stop-color="#7A2E44"/><stop offset="1" stop-color="#4A1726"/></radialGradient>
  <linearGradient id="potg" x1="0" x2="1"><stop offset="0" stop-color="#B8693F"/><stop offset=".45" stop-color="#CD8059"/><stop offset="1" stop-color="#9A4E30"/></linearGradient>
  <linearGradient id="rimg" x1="0" x2="1"><stop offset="0" stop-color="#C77A52"/><stop offset=".45" stop-color="#DC9470"/><stop offset="1" stop-color="#AE5E3A"/></linearGradient>
  <linearGradient id="leafg" x1="0" x2="1"><stop offset="0" stop-color="#5E8C55"/><stop offset="1" stop-color="#94C080"/></linearGradient>
  <linearGradient id="heartg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E28A9F"/><stop offset="1" stop-color="#9E3A57"/></linearGradient>
</defs></svg>`);

// Borde irregular del sello de cera.
const BLOB = Array.from({ length: 73 }, (_, i) => {
  const a = i / 72 * Math.PI * 2, r = 46 + 1.6 * Math.sin(a * 7) + 1.1 * Math.sin(a * 13 + 1);
  return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join('') + 'Z';
const seal = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${BLOB}" fill="url(#wax)"/>
  <circle cx="50" cy="50" r="31" fill="none" stroke="#3E1220" stroke-opacity=".4" stroke-width="2.5"/>
  <circle cx="49.3" cy="49.3" r="31" fill="none" stroke="#fff" stroke-opacity=".16"/>
  <text x="50" y="64" text-anchor="middle" font-family="Pinyon Script, cursive" font-size="42" fill="#F4CDD0" fill-opacity=".9">A</text></svg>`;

const flower = color => {
  let g = '';
  for (let k = 0; k < 8; k++) g += `<ellipse cx="0" cy="-17" rx="10" ry="17" transform="rotate(${k * 45})" style="fill:${color}" stroke="#000" stroke-opacity=".07"/>`;
  for (let k = 0; k < 8; k++) g += `<ellipse cx="0" cy="-11" rx="5.5" ry="11" transform="rotate(${k * 45 + 22.5})" fill="#fff" fill-opacity=".28"/>`;
  g += '<circle r="7.5" fill="#E9B65C" stroke="#C9933F"/>';
  for (let k = 0; k < 6; k++) g += `<circle r="1" cx="${(3.5 * Math.cos(k)).toFixed(1)}" cy="${(3.5 * Math.sin(k)).toFixed(1)}" fill="#A8742F"/>`;
  return g;
};
const flowerSVG = color => `<svg viewBox="-36 -36 72 72" aria-hidden="true">${flower(color)}</svg>`;
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="url(#heartg)" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.6 1.2 5.4 3.2 1.8-2 3.2-3.2 5.4-3.2 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ART = {
  fotos: '<svg viewBox="0 0 120 90" aria-hidden="true"><g transform="rotate(-8 40 45)"><rect x="16" y="14" width="48" height="58" rx="3"/><rect x="22" y="20" width="36" height="34"/></g><g transform="rotate(7 78 42)"><rect x="54" y="10" width="48" height="58" rx="3"/><rect x="60" y="16" width="36" height="34"/><path d="M78 40s-6-3.5-6-7.5c0-2.2 1.6-3.5 3.2-3.5 1.3 0 2.2.7 2.8 1.7.6-1 1.5-1.7 2.8-1.7 1.6 0 3.2 1.3 3.2 3.5 0 4-6 7.5-6 7.5z"/></g></svg>',
  libro: '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M60 22c-10-7-26-9-40-6v56c14-3 30-1 40 6 10-7 26-9 40-6V16c-14-3-30-1-40 6zm0 0v56"/><path d="M30 32h20M30 41h20M30 50h14M70 32h20M70 41h20M70 50h12"/></svg>'
};
const soon = art => el('div', 'card soon', `${ART[art]}<p class="eyebrow">Muy pronto</p><h3>Próximamente</h3><p class="lede">Aquí todavía estoy guardando algo bonito para ti.</p>`);

/* Metas de la sorpresa */
function goals() {
  return [
    { txt: `Abrir ${M.cartas} cartitas`, n: state.cartas.length, of: M.cartas },
    { txt: `Hacer crecer ${M.flores} flores`, n: state.flores, of: M.flores },
    { txt: `Explorar ${M.recuerdos} recuerdos`, n: state.recuerdos.length, of: M.recuerdos },
    { txt: `Atrapar ${M.corazones} corazones`, n: state.juego ? 1 : 0, of: 1, juego: true }
  ].filter(g => g.of > 0);
}
const unlocked = () => goals().every(g => g.n >= g.of);

/* Navegación */
function go(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.go === id));
  scrollTo({ top: 0 });
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });

/* Modal */
const modal = $('#modal');
function show(html) { $('#modal-body').innerHTML = `<article class="sheet letter">${html}</article>`; modal.showModal(); $('#modal-body').scrollTop = 0; }
modal.querySelector('.close').onclick = () => modal.close();
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

/* Intro: sobre sellado, una vez por sesión */
const intro = $('#intro');
let seen = false;
try { seen = sessionStorage.getItem('intro') === '1'; } catch {}
if (!seen) {
  intro.hidden = false;
  $('#intro-seal').innerHTML = seal();
  $('#intro-env').onclick = () => {
    if (intro.classList.contains('opening')) return;
    intro.classList.add('opening'); $('#intro-env').classList.add('open');
    try { sessionStorage.setItem('intro', '1'); } catch {}
    setTimeout(() => intro.classList.add('leaving'), 2300);
    setTimeout(() => { intro.hidden = true; }, 3200);
  };
}

/* Inicio */
$('#w-title').textContent = DATA.bienvenida.titulo.replace(/\s*♡\s*$/, '');
$('#w-text').textContent = DATA.bienvenida.texto;
$('#w-q').textContent = DATA.bienvenida.pregunta;

/* Cartitas */
DATA.cartas.forEach((c, i) => {
  const b = el('button', 'letter-card', `<div class="env"><i class="env-inside"></i><i class="env-front"></i><i class="env-flap"></i><span class="seal">${seal()}</span></div>
    <span class="no">N.º ${pad(i + 1)}<span class="chip" hidden>LEÍDA</span></span><span class="ttl">${esc(c.titulo)}</span>`);
  b.dataset.id = c.id;
  b.onclick = () => {
    const env = b.querySelector('.env');
    env.classList.add('open');
    setTimeout(() => {
      show(`<p class="eyebrow">Carta N.º ${pad(i + 1)}</p><h3>${esc(c.titulo)}</h3><div class="orn"></div><p>${esc(c.texto)}</p><div class="orn"></div>`);
      if (!state.cartas.includes(c.id)) { state.cartas.push(c.id); save(); }
      setTimeout(() => env.classList.remove('open'), 400);
    }, 650);
  };
  $('#letters').append(b);
});

/* Recuerdos */
const photo = r => `<div class="photo"${r.img ? ` style="background-image:url('${esc(r.img)}')"` : ''}></div>`;
DATA.recuerdos.forEach((r, i) => {
  const b = el('button', 'polaroid', `${photo(r)}<span class="ttl">${esc(r.titulo)}</span>`);
  b.onclick = () => {
    show(`${photo(r)}<p class="eyebrow" style="margin-top:18px">${esc(r.fecha)}</p><h3>${esc(r.titulo)}</h3><div class="orn"></div><p>${esc(r.texto)}</p>`);
    if (!state.recuerdos.includes(i)) { state.recuerdos.push(i); save(); }
  };
  $('#gallery').append(b);
});
if (!DATA.recuerdos.length) $('#gallery').replaceWith(soon('fotos'));

/* Jardín: tocar para plantar, luego regar hasta que florezca */
const pot = $('#pot');
pot.innerHTML = `<svg viewBox="0 0 220 260" aria-hidden="true">
  <ellipse cx="110" cy="252" rx="72" ry="7" fill="#5A1F31" opacity=".13"/>
  <path d="M52 192 H168 L155 246 Q154 252 148 252 H72 Q66 252 65 246 Z" fill="url(#potg)"/>
  <path d="M64 202 L73 244" stroke="#fff" stroke-opacity=".2" stroke-width="5" stroke-linecap="round"/>
  <path d="M110 232s-8-4.8-8-10c0-2.8 2-4.5 4.2-4.5 1.6 0 2.9.9 3.8 2.2.9-1.3 2.2-2.2 3.8-2.2 2.2 0 4.2 1.7 4.2 4.5 0 5.2-8 10-8 10z" fill="#F4CDD0" fill-opacity=".55"/>
  <rect x="42" y="176" width="136" height="22" rx="6" fill="url(#rimg)"/>
  <ellipse cx="110" cy="180" rx="60" ry="5" fill="#4A3027"/>
  <g class="sway">
    <path class="stem" d="M110 180 C 103 152, 117 124, 110 92"/>
    <g transform="translate(108 156) rotate(-150)"><path class="leaf" d="M0 0 C 10 -12, 30 -12, 38 0 C 30 10, 10 10, 0 0Z"/></g>
    <g transform="translate(112 132) rotate(-30)"><path class="leaf" d="M0 0 C 10 -12, 30 -12, 38 0 C 30 10, 10 10, 0 0Z"/></g>
    <g transform="translate(110 88)"><g class="bloom">${flower('var(--flower)')}</g></g>
    <ellipse class="seed" cx="110" cy="178" rx="6" ry="4" fill="#8A5A3C"/>
  </g>
</svg>`;
const hints = ['Toca la tierra para plantar una semilla', 'Ahora riégala con cariño', 'Está creciendo… un poco más de agua', 'Ya casi, una última vez', 'Toca la maceta para plantar otra semilla'];
let stage = 0, blooming = false, fresh = -1;
function setStage(s) {
  stage = s; pot.dataset.stage = s;
  const f = DATA.flores[state.flores];
  if (f && s === 0) pot.style.setProperty('--flower', f.color);
  document.querySelectorAll('#stage-dots i').forEach((d, i) => d.classList.toggle('on', i < s));
  $('#garden-hint').textContent = state.flores >= DATA.flores.length ? 'Tu jardín está completo. Cada flor guarda su razón.' : hints[s];
}
function rain() {
  const g = $('.garden'), x = g.clientWidth / 2;
  for (let i = 0; i < 4; i++) {
    const d = el('i', 'drop');
    d.style.left = `${x - 28 + Math.random() * 56}px`; d.style.top = `${30 + Math.random() * 20}px`; d.style.animationDelay = `${i * .08}s`;
    g.append(d); setTimeout(() => d.remove(), 1100);
  }
}
const flowerCard = (f, i) => `<p class="eyebrow">Flor N.º ${pad(i + 1)}</p><div style="width:96px;margin:6px auto 14px">${flowerSVG(f.color)}</div><h3>${esc(f.nombre)}</h3><div class="orn"></div><p style="text-align:center">${esc(f.razon)}</p>`;
pot.onclick = () => {
  if (blooming || state.flores >= DATA.flores.length) return;
  if (stage === 4) setStage(0); // la flor anterior ya se vio; empieza otra
  pot.classList.remove('water'); void pot.offsetWidth; pot.classList.add('water');
  if (stage > 0) rain();
  setStage(stage + 1);
  if (stage === 4) {
    blooming = true;
    setTimeout(() => {
      show(flowerCard(DATA.flores[state.flores], state.flores));
      fresh = state.flores; state.flores++; save(); setStage(4); blooming = false;
    }, 1100);
  }
};
function drawBed() {
  $('#flowerbed').innerHTML = '';
  DATA.flores.forEach((f, i) => {
    const grown = i < state.flores;
    const b = el('button', `specimen${grown ? '' : ' locked'}${i === fresh ? ' fresh' : ''}`, grown
      ? `<span class="thumb">${flowerSVG(f.color)}</span><span><strong>${esc(f.nombre)}</strong><small>Toca para leerla</small></span><span class="num">${pad(i + 1)}</span>`
      : `<span class="thumb">?</span><span><strong>Por descubrir</strong></span><span class="num">${pad(i + 1)}</span>`);
    if (grown) b.onclick = () => show(flowerCard(f, i)); else b.disabled = true;
    $('#flowerbed').append(b);
  });
  fresh = -1;
}

/* Historia */
DATA.historia.forEach(h => {
  $('#timeline').append(el('li', '', `<div class="card"><time>${esc(h.fecha)}</time><h3>${esc(h.titulo)}</h3><p>${esc(h.texto)}</p></div>`));
});
if (!DATA.historia.length) $('#timeline').replaceWith(soon('libro'));

/* Sorpresa: minijuego de corazones */
$('#vault-seal').innerHTML = seal();
$('#start-game').onclick = () => {
  const arena = $('#arena');
  let caught = 0;
  arena.innerHTML = `<span class="score">0 / ${M.corazones}</span>`;
  const spawn = () => {
    if (caught >= M.corazones) return;
    const h = el('button', 'heart', HEART);
    h.setAttribute('aria-label', 'Corazón');
    h.style.left = `${4 + Math.random() * 76}%`;
    h.style.top = `${30 + Math.random() * 48}%`;
    h.onclick = () => {
      h.remove(); caught++;
      arena.querySelector('.score').textContent = `${caught} / ${M.corazones}`;
      if (caught >= M.corazones) { arena.innerHTML = '<p class="won">¡Los atrapaste todos!</p>'; setTimeout(() => { state.juego = true; save(); }, 1200); }
    };
    arena.append(h);
    setTimeout(() => h.remove(), 1700);
    setTimeout(spawn, 700);
  };
  spawn();
};
const s = DATA.sorpresa;
$('#s-title').textContent = s.titulo.replace(/\s*❤️\s*$/, '');
$('#s-text').innerHTML = s.texto.split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join('');
$('#s-sign').textContent = s.firma;

/* Refrescar indicadores */
function refresh() {
  document.querySelectorAll('.letter-card').forEach(b => {
    const read = state.cartas.includes(b.dataset.id);
    b.classList.toggle('read', read); b.querySelector('.chip').hidden = !read;
  });
  drawBed();

  const C = 2 * Math.PI * 28;
  $('#progress').innerHTML = [
    ['Cartitas', state.cartas.length, DATA.cartas.length, 'cartitas'],
    ['Flores', state.flores, DATA.flores.length, 'jardin'],
    ['Recuerdos', state.recuerdos.length, DATA.recuerdos.length, 'recuerdos'],
    ['Sorpresa', unlocked() ? 1 : 0, 1, 'sorpresa']
  ].filter(([, , of]) => of > 0).map(([t, n, of, go]) => `<button class="ring" data-go="${go}">
    <span class="ring-svg"><svg viewBox="0 0 64 64"><circle class="track" cx="32" cy="32" r="28"/><circle class="val" cx="32" cy="32" r="28" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - n / of)}"/></svg>
    <b>${t === 'Sorpresa' ? (n ? CHECK.replace('<svg', '<svg style="width:22px;stroke:#762D42;fill:none;stroke-width:2.5;stroke-linecap:round"') : '<small>—</small>') : `${n}<small>/${of}</small>`}</b></span>
    <span>${t}</span></button>`).join('');

  $('#goals').innerHTML = goals().map(g => `<li class="${g.n >= g.of ? 'ok' : ''}"><span class="chk">${CHECK}</span><span>${g.txt}</span><em>${g.juego ? '' : `${Math.min(g.n, g.of)}/${g.of}`}</em></li>`).join('');
  const others = goals().filter(g => !g.juego).every(g => g.n >= g.of);
  $('#game').hidden = state.juego || !others;
  $('#locked').hidden = unlocked();
  $('#secret').hidden = !unlocked();
}

/* Pétalos decorativos */
for (let i = 0; i < 9; i++) {
  const p = el('i');
  p.style.left = `${Math.random() * 100}%`;
  p.style.animationDuration = `${14 + Math.random() * 12}s`;
  p.style.animationDelay = `${-Math.random() * 20}s`;
  p.style.scale = (.7 + Math.random() * .6).toFixed(2);
  $('#petals').append(p);
}

/* Instalación: Chrome/Android usa el aviso nativo; iPhone necesita instrucciones */
const installCard = $('#install');
let installPrompt = null;
installCard.hidden = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
addEventListener('appinstalled', () => { installCard.hidden = true; });

const ICON = {
  share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>',
  plus: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  dots: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
};
const ico = name => `<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg></span>`;
const steps = (title, items) => show(`<p class="eyebrow">Instalar</p><h3>${title}</h3><ol class="steps">${items.map(s => `<li><span>${s}</span></li>`).join('')}</ol>
  <p class="steps-note">El ícono aparecerá en tu pantalla de inicio y se abrirá como una app.</p>`);

$('#install-btn').onclick = async () => {
  if (installPrompt) {
    installPrompt.prompt();
    if ((await installPrompt.userChoice).outcome === 'accepted') installCard.hidden = true;
    installPrompt = null;
  } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    steps('En tu iPhone', [
      'Abre esta página en <b>Safari</b>.',
      `Toca ${ico('share')} <b>Compartir</b> en la barra inferior.`,
      `Elige ${ico('plus')} <b>Agregar a inicio</b> y confirma.`
    ]);
  } else {
    steps('En tu Android', [
      'Abre esta página en <b>Chrome</b>.',
      `Toca el menú ${ico('dots')} arriba a la derecha.`,
      `Elige ${ico('phone')} <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.`
    ]);
  }
};

setStage(0);
refresh();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
