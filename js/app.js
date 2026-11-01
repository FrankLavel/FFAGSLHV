// Progreso guardado en este dispositivo (localStorage).
const KEY = 'cartitas-progreso';
const state = Object.assign({ cartas: [], recuerdos: [], flores: 0, juego: false }, load());
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} refresh(); }

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const M = DATA.metas;

function goals() {
  return [
    { txt: `Abrir ${M.cartas} cartitas`, n: state.cartas.length, of: M.cartas },
    { txt: `Plantar ${M.flores} flores`, n: state.flores, of: M.flores },
    { txt: `Explorar ${M.recuerdos} recuerdos`, n: state.recuerdos.length, of: M.recuerdos },
    { txt: `Atrapar ${M.corazones} corazones`, n: state.juego ? 1 : 0, of: 1, juego: true }
  ].filter(g => g.of > 0);
}
const soon = () => el('div', 'paper soon', '<div class="lock">🌱</div><h3>Próximamente</h3><p class="hand">Aquí todavía estoy guardando algo bonito para ti</p>');
const unlocked = () => goals().every(g => g.n >= g.of);

/* Navegación */
function go(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.go === id));
  scrollTo({ top: 0, behavior: 'smooth' });
}
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });

/* Modal */
const modal = $('#modal');
function show(html) { $('#modal-body').innerHTML = html; modal.showModal(); }
modal.querySelector('.close').onclick = () => modal.close();
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

/* Inicio */
$('#w-title').textContent = DATA.bienvenida.titulo;
$('#w-text').textContent = DATA.bienvenida.texto;
$('#w-q').textContent = DATA.bienvenida.pregunta;

/* Cartitas */
DATA.cartas.forEach(c => {
  const b = el('button', 'envelope', `<span>${esc(c.titulo)}</span>`);
  b.dataset.id = c.id;
  b.onclick = () => {
    b.classList.add('opening');
    setTimeout(() => {
      b.classList.remove('opening');
      show(`<h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p>`);
      if (!state.cartas.includes(c.id)) { state.cartas.push(c.id); save(); }
    }, 500);
  };
  $('#letters').append(b);
});

/* Recuerdos */
const photo = r => `<div class="photo" style="${r.img ? `background-image:url('${esc(r.img)}')` : ''}">${r.img ? '' : '📷'}</div>`;
DATA.recuerdos.forEach((r, i) => {
  const b = el('button', 'polaroid', `${photo(r)}<span class="hand">${esc(r.titulo)}</span>`);
  b.onclick = () => {
    show(`${photo(r)}<small class="hand">${esc(r.fecha)}</small><h3>${esc(r.titulo)}</h3><p>${esc(r.texto)}</p>`);
    if (!state.recuerdos.includes(i)) { state.recuerdos.push(i); save(); }
  };
  $('#gallery').append(b);
});
if (!DATA.recuerdos.length) $('#gallery').replaceWith(soon());

/* Jardín: tocar para plantar, luego regar hasta que florezca */
const pot = $('#pot');
const hints = ['Toca la tierra para plantar una semilla', 'Riégala tocando la maceta 💧', 'Está creciendo… riégala otra vez 💧', 'Un poquito más de agua 💧', 'Toca la maceta para plantar otra semilla 🌱'];
let stage = 0, blooming = false;
function setStage(s) {
  stage = s; pot.dataset.stage = s;
  const f = DATA.flores[state.flores];
  if (f && s === 0) pot.style.setProperty('--flower', f.color);
  $('#garden-hint').textContent = state.flores >= DATA.flores.length ? 'Tu jardín está completo ♡ Toca cada flor para leerla' : hints[s];
}
pot.onclick = () => {
  if (blooming || state.flores >= DATA.flores.length) return;
  if (stage === 4) setStage(0); // la flor anterior ya se vio; empieza otra
  pot.classList.remove('water'); void pot.offsetWidth; pot.classList.add('water');
  setStage(stage + 1);
  if (stage === 4) {
    blooming = true;
    setTimeout(() => {
      const f = DATA.flores[state.flores];
      show(`<h3>🌸 ${esc(f.nombre)}</h3><p>${esc(f.razon)}</p>`);
      state.flores++; save(); setStage(4); blooming = false;
    }, 900);
  }
};
function drawBed() {
  $('#flowerbed').innerHTML = '';
  DATA.flores.forEach((f, i) => {
    const grown = i < state.flores;
    const b = el('button', grown ? 'grown' : '', grown ? '🌸' : '');
    b.setAttribute('aria-label', grown ? f.nombre : 'Espacio vacío');
    if (grown) b.onclick = () => show(`<h3>🌸 ${esc(f.nombre)}</h3><p>${esc(f.razon)}</p>`);
    $('#flowerbed').append(b);
  });
}

/* Historia */
DATA.historia.forEach(h => {
  $('#timeline').append(el('li', '', `<div class="paper"><time>${esc(h.fecha)}</time><h3>${esc(h.titulo)}</h3><p>${esc(h.texto)}</p></div>`));
});
if (!DATA.historia.length) $('#timeline').replaceWith(soon());

/* Sorpresa: minijuego de corazones */
$('#start-game').onclick = () => {
  const arena = $('#arena');
  let caught = 0;
  arena.innerHTML = `<span class="score">0 / ${M.corazones}</span>`;
  const spawn = () => {
    if (caught >= M.corazones) return;
    const h = el('button', 'heart', ['💗', '💖', '💕', '❤️'][Math.random() * 4 | 0]);
    h.setAttribute('aria-label', 'Corazón');
    h.style.left = `${5 + Math.random() * 75}%`;
    h.style.top = `${30 + Math.random() * 50}%`;
    h.onclick = () => {
      h.remove(); caught++;
      arena.querySelector('.score').textContent = `${caught} / ${M.corazones}`;
      if (caught >= M.corazones) { state.juego = true; save(); arena.innerHTML = '<p class="hand" style="font-size:1.5rem">¡Los atrapaste todos! ♡</p>'; }
    };
    arena.append(h);
    setTimeout(() => h.remove(), 1600);
    setTimeout(spawn, 700);
  };
  spawn();
};
const s = DATA.sorpresa;
$('#s-title').textContent = s.titulo;
$('#s-text').innerHTML = s.texto.split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join('');
$('#s-sign').textContent = s.firma;

/* Refrescar indicadores */
function refresh() {
  document.querySelectorAll('.envelope').forEach(b => b.classList.toggle('opened', state.cartas.includes(b.dataset.id)));
  document.querySelectorAll('.polaroid').forEach((b, i) => b.classList.toggle('seen', state.recuerdos.includes(i)));
  drawBed();

  const items = [
    ['💌 Cartitas', state.cartas.length, DATA.cartas.length],
    ['🌷 Flores', state.flores, DATA.flores.length],
    ['📷 Recuerdos', state.recuerdos.length, DATA.recuerdos.length],
    ['🎁 Sorpresa', unlocked() ? 1 : 0, 1]
  ].filter(([, , of]) => of > 0);
  $('#progress').innerHTML = items.map(([t, n, of]) =>
    `<li><span>${t}</span><span>${n}/${of}</span><div class="bar"><i style="width:${n / of * 100}%"></i></div></li>`).join('');

  $('#goals').innerHTML = goals().map(g => `<li class="${g.n >= g.of ? 'ok' : ''}">${g.n >= g.of ? '✅' : '◻️'} ${g.txt}</li>`).join('');
  const others = goals().filter(g => !g.juego).every(g => g.n >= g.of);
  $('#game').hidden = state.juego || !others;
  $('#locked').hidden = unlocked();
  $('#secret').hidden = !unlocked();
}

/* Pétalos decorativos */
for (let i = 0; i < 12; i++) {
  const p = el('i');
  p.style.left = `${Math.random() * 100}%`;
  p.style.animationDuration = `${9 + Math.random() * 10}s`;
  p.style.animationDelay = `${-Math.random() * 15}s`;
  $('#petals').append(p);
}

/* Botón de instalación: Chrome/Android usa el aviso nativo; iPhone necesita instrucciones */
const installBtn = $('#install');
let installPrompt = null;
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
installBtn.hidden = standalone;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
addEventListener('appinstalled', () => { installBtn.hidden = true; });
installBtn.onclick = async () => {
  if (installPrompt) {
    installPrompt.prompt();
    if ((await installPrompt.userChoice).outcome === 'accepted') installBtn.hidden = true;
    installPrompt = null;
  } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    show('<h3>📲 Instalar en tu iPhone</h3><p>1. Abre esta página en <b>Safari</b>.\n2. Toca el botón <b>Compartir</b> (el cuadrito con la flecha hacia arriba).\n3. Elige <b>«Agregar a inicio»</b>.\n\n¡Y listo! Tendrás tu pequeño mundo a un toque. ♡</p>');
  } else {
    show('<h3>📲 Instalar en tu celular</h3><p>1. Abre esta página en <b>Chrome</b>.\n2. Toca el menú <b>⋮</b> (arriba a la derecha).\n3. Elige <b>«Instalar app»</b> o <b>«Agregar a pantalla de inicio»</b>.\n\n¡Y listo! Tendrás tu pequeño mundo a un toque. ♡</p>');
  }
};

setStage(0);
refresh();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
