import { DATA } from './data.js';

/* ---------- Utilitaires ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), DATA);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Construit un nœud sans innerHTML : tout le texte passe par textContent.
function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids) if (kid != null) node.append(kid);
  return node;
}

const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const familyOf = (id) => DATA.families.find((f) => f.id === id);
const exampleOf = (id) => DATA.examples.find((e) => e.id === id);
const groupOf = (fam, gid) => fam.groups.find((g) => g.id === gid);
const scrollTo = (target) => target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });

// Image large aux marges transparentes : on recadre en CSS, sans déformer.
function cropFigure(img, cls, decorative = false) {
  const { crop } = img;
  const wrap = el('span', { class: `crop ${cls}` });
  wrap.style.setProperty('--ar', crop.w / crop.h);
  const pic = el('img', { src: img.src, alt: decorative ? '' : img.alt, decoding: 'async', draggable: 'false' });
  pic.style.width = `${(crop.iw / crop.w) * 100}%`;
  pic.style.left = `${(-crop.x / crop.w) * 100}%`;
  pic.style.top = `${(-crop.y / crop.h) * 100}%`;
  wrap.append(pic);
  return wrap;
}

const dial = () => el('span', { class: 'dial', 'aria-hidden': 'true' }, el('span', { class: 'dial__needle' }));

function pathOf(ex) {
  const fam = familyOf(ex.family);
  return `${fam.title} › ${groupOf(fam, ex.group).title}`;
}

/* ---------- État en mémoire (aucun stockage durable) ---------- */

const defaults = () => ({ family: 'instrumentation', group: 'niveau', query: '', context: null, situation: null, answers: {}, dropout: 'besoin', sector: DATA.applications.sectors[0].id });
let state = defaults();

// Annonce courte et différée pour les lecteurs d'écran (le panneau complet n'est pas relu).
let liveTimer = 0;
function announce(text, delay = 0) {
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => { $('[data-live]').textContent = text; }, delay);
}
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

/* ---------- Textes liés ---------- */

function bindText() {
  $$('[data-t]').forEach((node) => { node.textContent = get(node.dataset.t) ?? ''; });
}

/* ---------- En-tête et menu ---------- */

function initNav() {
  const list = $('[data-nav]');
  DATA.site.nav.forEach((n) => list.append(el('li', {}, el('a', { href: n.href, text: n.label }))));

  const toggle = $('.menu-toggle');
  const menu = $('#menu');
  const setOpen = (open, restoreFocus = false) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
    if (!open && restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    if (open) $('a', menu).focus();
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && !$('[data-dialog]').open && !$('[data-info-dialog]').open) setOpen(false, true);
  });
  document.addEventListener('click', (e) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.bar')) setOpen(false);
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
}

/* ---------- Hero : plateau des quatre instruments ---------- */

function renderTray() {
  const tray = $('[data-tray]');
  DATA.hero.instruments.forEach((inst) => {
    const ex = exampleOf(inst.example);
    const btn = el('button', { class: 'btn btn--tile', type: 'button', 'data-pick': inst.id },
      DATA.hero.pick, el('span', { class: 'sr', text: ` ${inst.label}` }));
    tray.append(el('li', { class: 'tray__item' },
      el('div', { class: 'stage' }, cropFigure(ex.img, 'crop--tray')),
      el('p', { class: 'tray__label', text: inst.label }),
      btn));
  });
  tray.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]');
    if (b) goToSolutions('instrumentation', b.dataset.pick);
  });
}

/* ---------- Hero : accès par activité ---------- */

function renderUnivers() {
  const list = $('[data-univers]');
  DATA.families.forEach((f) => list.append(el('li', {}, el('button', { class: 'univers__btn', type: 'button', 'data-univers-id': f.id, text: f.title }))));
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-univers-id]');
    if (b) goToSolutions(b.dataset.universId);
  });
}

/* ---------- Explorateur de solutions ---------- */

const stacked = window.matchMedia('(max-width: 960px)');

function goToSolutions(familyId, groupId) {
  selectFamily(familyId, groupId);
  // Colonne unique : le panneau est sous la liste des familles, on y va directement.
  scrollTo(stacked.matches ? $('[data-panel]') : $('#solutions'));
  const target = $('[data-panel] [aria-pressed="true"]') || $('[data-panel] h3');
  if (target) target.focus({ preventScroll: true });
}

function selectFamily(familyId, groupId) {
  const fam = familyOf(familyId);
  state.family = familyId;
  state.group = fam.tabs ? (groupOf(fam, groupId) ? groupId : fam.groups[0].id) : null;
  state.query = '';
  $('#search').value = '';
  renderFamilies();
  renderPanel();
  renderSearchClear();
}

function renderFamilies() {
  const list = $('[data-families]');
  // Construite une fois : le bouton focalisé n'est jamais remplacé.
  if (!list.children.length) {
    DATA.families.forEach((f) => {
      list.append(el('li', {}, el('button', { class: 'family', type: 'button', 'data-family': f.id },
        el('span', { class: 'family__title', text: f.title }),
        el('span', { class: 'family__short', text: f.short }))));
    });
  }
  $$('[data-family]', list).forEach((b) => b.setAttribute('aria-pressed', String(!state.query && b.dataset.family === state.family)));
}

function exampleRow(ex, withPath) {
  const thumb = el('span', { class: 'thumb' }, ex.img ? cropFigure(ex.img, 'crop--thumb', true) : dial());
  return el('li', { class: 'ex' },
    el('button', { class: 'ex__btn', type: 'button', 'data-ex': ex.id },
      thumb,
      el('span', { class: 'ex__text' },
        el('span', { class: 'ex__title', text: ex.title }),
        el('span', { class: 'ex__use', text: withPath ? `${pathOf(ex)} · ${ex.usage}` : ex.usage })),
      el('span', { class: 'ex__go', text: DATA.solutions.openCard })));
}

function matches(ex, q) {
  const hay = norm([ex.title, ex.usage, ex.keywords, ex.maker || '', pathOf(ex)].join(' '));
  return norm(q).split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

function renderPanel() {
  const panel = $('[data-panel]');
  const S = DATA.solutions;
  const inner = el('div', { class: 'panel__inner' });

  if (state.query) {
    const found = DATA.examples.filter((ex) => matches(ex, state.query));
    if (found.length) {
      inner.append(
        el('h3', { tabindex: '-1', text: `${found.length} ${found.length > 1 ? S.resultsMany : S.resultsOne}` }),
        el('p', { class: 'panel__intro' }, '« ', el('span', { text: state.query }), ' »'),
        el('ul', { class: 'ex-list' }, ...found.map((ex) => exampleRow(ex, true))));
    } else {
      inner.append(
        el('h3', { tabindex: '-1', text: S.emptyTitle }),
        el('p', { class: 'panel__intro' }, '« ', el('span', { text: state.query }), ' ». ', S.emptyText),
        el('div', { class: 'actions' },
          el('button', { class: 'btn btn--primary', type: 'button', 'data-search-reset': '', text: S.searchClear }),
          el('button', { class: 'btn btn--quiet', type: 'button', 'data-need': '', text: S.emptyNeed })));
    }
    panel.replaceChildren(inner);
    return;
  }

  const fam = familyOf(state.family);
  inner.append(el('h3', { tabindex: '-1', text: fam.title }), el('p', { class: 'panel__intro', text: fam.intro }));

  let list;
  if (fam.tabs) {
    const tabs = el('div', { class: 'toggle toggle--light', role: 'group', 'aria-label': S.subTitle });
    fam.groups.forEach((g) => tabs.append(el('button', { type: 'button', 'data-group': g.id, 'aria-pressed': String(g.id === state.group), text: g.title })));
    inner.append(tabs, el('p', { class: 'panel__sub', text: groupOf(fam, state.group).intro }));
    list = DATA.examples.filter((ex) => ex.family === fam.id && ex.group === state.group);
  } else {
    inner.append(
      el('h4', { text: S.subTitle }),
      el('ul', { class: 'chips' }, ...fam.groups.map((g) => el('li', { text: g.title }))));
    list = DATA.examples.filter((ex) => ex.family === fam.id);
  }
  inner.append(
    el('h4', { text: S.examplesTitle }),
    el('ul', { class: 'ex-list' }, ...list.map((ex) => exampleRow(ex, false))),
    el('div', { class: 'actions' }, el('button', { class: 'btn btn--primary', type: 'button', 'data-choose-family': '', text: S.chooseFamily })));
  panel.replaceChildren(inner);
}

function renderSearchClear() {
  const b = $('[data-search-clear]');
  b.hidden = !state.query;
}

function initExplorer() {
  const S = DATA.solutions;
  $('#search').placeholder = S.searchPlaceholder;
  $('[data-search-clear]').textContent = S.searchClear;

  $('#search').addEventListener('input', (e) => {
    state.query = e.target.value.trim();
    renderFamilies();
    renderPanel();
    renderSearchClear();
    if (state.query) {
      const n = DATA.examples.filter((ex) => matches(ex, state.query)).length;
      announce(n ? plural(n, S.resultsOne, S.resultsMany) : S.emptyTitle, 500);
    } else announce('');
  });
  const clear = () => {
    state.query = '';
    $('#search').value = '';
    $('#search').focus();
    renderFamilies();
    renderPanel();
    renderSearchClear();
  };
  $('[data-search-clear]').addEventListener('click', clear);

  $('[data-families]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-family]');
    if (!b) return;
    selectFamily(b.dataset.family, null);
    const fam = familyOf(b.dataset.family);
    announce(`${fam.title} : ${plural(DATA.examples.filter((x) => x.family === fam.id).length, S.countOne, S.countMany)}`, 150);
  });

  $('[data-panel]').addEventListener('click', (e) => {
    const t = e.target;
    const group = t.closest('[data-group]');
    const ex = t.closest('[data-ex]');
    if (group) {
      state.group = group.dataset.group;
      renderPanel();
      $(`[data-panel] [data-group="${state.group}"]`).focus();
    } else if (ex) {
      openCard(ex.dataset.ex, ex);
    } else if (t.closest('[data-choose-family]')) {
      const fam = familyOf(state.family);
      const path = fam.tabs ? `${fam.title} › ${groupOf(fam, state.group).title}` : fam.title;
      chooseContext({ label: 'Famille', value: path, family: fam.id });
    } else if (t.closest('[data-search-reset]')) {
      clear();
    } else if (t.closest('[data-need]')) {
      chooseContext({ label: 'Besoin recherché', value: state.query });
    }
  });
}

/* ---------- Contexte de demande ---------- */

let contextTrigger = null;

function chooseContext(ctx) {
  state.context = ctx;
  renderContext();
  const dlg = $('[data-dialog]');
  if (dlg.open) { skipRestore = true; dlg.close(); }
  scrollTo($('#contact'));
  $('#f-message').focus({ preventScroll: true });
}

// La situation s'ajoute au contexte sans le remplacer, ni toucher à la saisie.
function chooseSituation(sit) {
  state.situation = { id: sit.id, value: sit.value };
  renderContext();
  if (sit.target === 'solutions') {
    scrollTo($('#solutions'));
    $('#search').focus({ preventScroll: true });
  } else {
    scrollTo($('#contact'));
    $('#f-message').focus({ preventScroll: true });
  }
}

function renderContext() {
  const C = DATA.contact;
  const S = DATA.solutions;
  const box = $('[data-context-box]');
  const line = $('[data-context-line]');
  box.replaceChildren(el('h3', { text: C.contextTitle }));
  line.replaceChildren();
  const rows = [];
  if (state.situation) rows.push(['situation', DATA.conseil.situationLabel, state.situation.value]);
  if (state.context) rows.push(['context', state.context.label, state.context.value]);
  if (rows.length) {
    rows.forEach(([kind, label, value]) => box.append(
      el('div', { class: 'context-box__row' },
        el('p', { class: 'context-box__value' }, el('span', { class: 'context-box__label', text: `${label} : ` }), el('span', { text: value })),
        el('button', { class: 'btn btn--quiet btn--sm', type: 'button', 'data-context-remove': kind, 'aria-label': C.contextRemoveFor(`${label} ${value}`), text: C.contextRemove }))));
  } else {
    box.append(
      el('p', { text: C.contextEmpty }),
      el('a', { class: 'btn btn--quiet btn--sm', href: '#solutions', text: C.contextExplore }));
  }
  if (state.context) {
    line.append(`${S.contextLabel} `, el('strong', { text: `${state.context.label} : ${state.context.value}` }), ' ',
      el('a', { href: '#contact', text: S.contextGo }));
  }
  renderExtra();
}

// Deux questions facultatives selon la famille choisie ; réponses gardées en mémoire par famille.
function renderExtra() {
  const X = DATA.contact.followups;
  const box = $('[data-extra]');
  const fam = state.context && state.context.family;
  const qs = fam && X.byFamily[fam];
  box.hidden = !qs;
  box.replaceChildren();
  if (!qs) return;
  const saved = state.answers[fam] || [];
  box.append(el('legend', { text: X.title(familyOf(fam).title) }), el('p', { class: 'hint', text: X.hint }));
  qs.forEach((label, i) => {
    const input = el('input', { id: `x-${i}`, type: 'text', 'data-extra-index': i, placeholder: X.placeholder, maxlength: '120', autocomplete: 'off' });
    input.value = saved[i] || '';
    box.append(el('div', { class: 'field' }, el('label', { for: `x-${i}`, text: label }), input));
  });
}

/* ---------- Fiche (dialog natif) ---------- */

let skipRestore = false;

function openCard(id, trigger) {
  const ex = exampleOf(id);
  const K = DATA.card;
  const dlg = $('[data-dialog]');
  contextTrigger = trigger || document.activeElement;
  skipRestore = false;

  const visual = ex.img
    ? el('div', { class: 'card__photo' }, cropFigure(ex.img, 'crop--card'))
    : el('div', { class: 'card__photo card__photo--empty' }, dial(), el('p', { text: K.noVisual }));

  const rows = [
    [K.usage, el('p', { text: ex.usage })],
    [K.family, el('p', { text: pathOf(ex) })],
    [K.visual, el('p', { text: ex.maker ? K.visualMaker(ex.maker, ex.makerNote) : K.visualGeneric })],
    [K.reference, el('p', { text: K.refPending })],
    [K.toSpecify, el('ul', { class: 'plain' }, ...K.toSpecifyList.map((t) => el('li', { text: t })))],
  ];
  const dl = el('dl', { class: 'facts' });
  rows.forEach(([k, v]) => dl.append(el('div', {}, el('dt', { text: k }), el('dd', {}, v))));

  $('[data-dialog-body]').replaceChildren(
    el('div', { class: 'card__head' },
      el('h2', { id: 'dialog-title', text: ex.title }),
      el('button', { class: 'btn btn--quiet btn--sm', type: 'button', 'data-dialog-close': '', text: K.close })),
    el('div', { class: 'card__grid' }, visual,
      el('div', { class: 'card__info' }, dl,
        el('div', { class: 'actions' },
          el('button', { class: 'btn btn--primary', type: 'button', 'data-dialog-choose': id, text: K.choose })))));
  dlg.showModal();
  dlg.scrollTop = 0;
}

function initDialog() {
  const dlg = $('[data-dialog]');
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.closest('[data-dialog-close]')) dlg.close();
    const c = e.target.closest('[data-dialog-choose]');
    if (c) {
      const ex = exampleOf(c.dataset.dialogChoose);
      chooseContext({ label: 'Fiche d’exemple', value: `${ex.title} (${pathOf(ex)})`, family: ex.family });
    }
  });
  dlg.addEventListener('close', () => {
    if (!skipRestore && contextTrigger && contextTrigger.isConnected) contextTrigger.focus();
    skipRestore = false;
  });
}

/* ---------- Dropout : besoin / principe ---------- */

function initDropout() {
  const D = DATA.dropout;
  const ex = exampleOf('air-dropout');
  $('[data-dropout-photo]').append(cropFigure(ex.img, 'crop--dropout'));

  const flow = $('[data-flow]');
  flow.setAttribute('aria-label', D.diagramLabel);
  for (let i = 0; i < 5; i += 1) flow.append(el('span', { class: 'air', style: `--i:${i}` }));
  for (let i = 0; i < 5; i += 1) flow.append(el('span', { class: 'drop', style: `--i:${i}` }));
  flow.append(el('span', { class: 'flow__pool' }));

  const toggle = $('[data-dropout-toggle]');
  D.modes.forEach((m) => toggle.append(el('button', { type: 'button', 'data-mode': m.id, text: m.label })));
  toggle.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    state.dropout = b.dataset.mode;
    renderDropout();
  });
  const open = $('[data-dropout-open]');
  open.textContent = D.cta;
  open.addEventListener('click', () => openCard('air-dropout', open));
}

function renderDropout() {
  const mode = DATA.dropout.modes.find((m) => m.id === state.dropout);
  $$('[data-dropout-toggle] [data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === state.dropout)));
  $('[data-dropout-title]').textContent = mode.title;
  $('[data-dropout-text]').textContent = mode.text;
  $('[data-flow]').dataset.mode = state.dropout;
}

/* ---------- Secteurs ---------- */

function initSectors() {
  const list = $('[data-sectors]');
  DATA.applications.sectors.forEach((s) => list.append(el('button', { type: 'button', class: 'sector', 'data-sector': s.id, text: s.label })));
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sector]');
    if (!b) return;
    state.sector = b.dataset.sector;
    renderSectors();
    $(`[data-sector="${state.sector}"]`).focus();
    announce(b.textContent, 100);
  });
  $('[data-sector-body]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lead]');
    if (b) goToSolutions(b.dataset.family, b.dataset.group);
  });
}

function renderSectors() {
  const A = DATA.applications;
  const s = A.sectors.find((x) => x.id === state.sector);
  $$('[data-sector]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sector === state.sector)));
  $('[data-sector-body]').replaceChildren(el('div', { class: 'panel__inner' },
    el('h3', { text: s.label }),
    el('p', { class: 'panel__intro', text: s.context }),
    el('ul', { class: 'leads' }, ...s.leads.map((l) =>
      el('li', {},
        el('div', {}, el('p', { class: 'lead__title', text: l.title }), el('p', { text: l.text })),
        el('button', { class: 'btn btn--quiet btn--sm', type: 'button', 'data-lead': '', 'data-family': l.family, 'data-group': l.group, text: A.seeIn },
          el('span', { class: 'sr', text: ` : ${l.title}` }))))),
    el('p', { class: 'fineprint', text: A.illustrative })));
}

/* ---------- Conseil, entreprise, FAQ ---------- */

function renderStatic() {
  const sits = $('[data-situations]');
  DATA.conseil.situations.forEach((s) => sits.append(el('li', {},
    el('h3', { text: s.title }), el('p', { text: s.text }),
    el('button', { class: 'btn btn--quiet btn--sm', type: 'button', 'data-situation': s.id, text: s.cta }))));
  sits.addEventListener('click', (e) => {
    const b = e.target.closest('[data-situation]');
    if (b) chooseSituation(DATA.conseil.situations.find((x) => x.id === b.dataset.situation));
  });

  const facts = $('[data-facts]');
  DATA.entreprise.facts.forEach((f) => facts.append(el('div', {}, el('dt', { text: f.label }), el('dd', { text: f.value }))));

  const overlay = $('[data-overlay]');
  DATA.entreprise.overlay.forEach((id, i) => {
    const wrap = el('div', { class: `overlay__item overlay__item--${i + 1}` }, cropFigure(exampleOf(id).img, 'crop--overlay', true));
    overlay.append(wrap);
  });

  const faq = $('[data-faq]');
  DATA.faq.items.forEach((it) => faq.append(el('details', {}, el('summary', { text: it.q }), el('p', { text: it.a }))));
}

/* ---------- Pied de page ---------- */

function renderFooter() {
  const F = DATA.footer;
  const nav = $('[data-footer-nav]');
  [...DATA.site.nav, { href: '#contact', label: 'Contact' }].forEach((n) => nav.append(el('li', {}, el('a', { href: n.href, text: n.label }))));

  const ext = { target: '_blank', rel: 'noopener noreferrer' };
  const builders = {
    credits: () => [F.creditsTitle, el('ul', { class: 'plain' }, ...F.credits.map((c) => {
      const li = el('li');
      li.append(c.href ? el('a', { href: c.href, ...ext, text: c.name }) : el('strong', { text: c.name }), ` : ${c.text}`);
      if (c.extra) li.append(' ', el('a', { href: c.extra.href, ...ext, text: c.extra.label }));
      return li;
    }))],
    about: () => [F.aboutTitle, el('ul', { class: 'plain' }, ...F.limits.map((t) => el('li', { text: t })))],
  };

  const dlg = $('[data-info-dialog]');
  let trigger = null;
  const openInfo = (kind, from) => {
    const [title, content] = builders[kind]();
    trigger = from;
    $('[data-info-body]').replaceChildren(
      el('div', { class: 'card__head' },
        el('h2', { id: 'info-title', text: title }),
        el('button', { class: 'btn btn--quiet btn--sm', type: 'button', 'data-info-close': '', text: F.closeLabel })),
      content);
    dlg.showModal();
    dlg.querySelector('.dialog-body').scrollTop = 0;
  };
  $$('[data-info-open]').forEach((b) => b.addEventListener('click', () => openInfo(b.dataset.infoOpen, b)));
  $('[data-banner-link]').addEventListener('click', (e) => { e.preventDefault(); openInfo('about', e.currentTarget); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-info-close]')) dlg.close(); });
  dlg.addEventListener('close', () => { if (trigger && trigger.isConnected) trigger.focus(); });
}

/* ---------- Formulaire ---------- */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function initForm() {
  const C = DATA.contact;
  const form = $('[data-form]');
  const summary = $('[data-summary]');

  Object.entries(C.fields).forEach(([key, f]) => {
    const field = $(`[data-field="${key}"]`);
    const label = $('label', field);
    label.firstChild.textContent = `${f.label} `;
    if (f.hint) $('.hint', field).textContent = f.hint;
  });

  const setError = (key, msg) => {
    const field = $(`[data-field="${key}"]`);
    const input = $('input, textarea', field);
    const err = $('.error', field);
    if (!err) return;
    err.hidden = !msg;
    err.textContent = msg || '';
    field.classList.toggle('has-error', Boolean(msg));
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  };
  const check = (key, value) => {
    const v = value.trim();
    if (key === 'name' && !v) return C.fields.name.error;
    if (key === 'email' && !EMAIL.test(v)) return C.fields.email.error;
    if (key === 'message' && !v) return C.fields.message.error;
    return '';
  };

  form.addEventListener('input', (e) => {
    const key = e.target.name;
    if (key && $(`[data-field="${key}"]`)?.classList.contains('has-error')) setError(key, check(key, e.target.value));
    if (e.target.dataset.extraIndex !== undefined && state.context?.family) {
      const fam = state.context.family;
      (state.answers[fam] ||= [])[Number(e.target.dataset.extraIndex)] = e.target.value;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    let first = null;
    ['name', 'email', 'message'].forEach((key) => {
      const msg = check(key, values[key] || '');
      setError(key, msg);
      if (msg && !first) first = $(`[name="${key}"]`, form);
    });
    if (first) { first.focus(); return; }

    const L = C.summaryLabels;
    const list = $('[data-summary-list]');
    const ctx = state.context ? `${state.context.label} : ${state.context.value}` : C.summaryEmptyContext;
    const qs = (state.context && C.followups.byFamily[state.context.family]) || [];
    const saved = (state.context && state.answers[state.context.family]) || [];
    list.replaceChildren(...[
      [L.name, values.name.trim()],
      [L.email, values.email.trim()],
      [L.company, values.company.trim() || C.summaryEmptyCompany],
      [L.message, values.message.trim()],
      ...(state.situation ? [[L.situation, state.situation.value]] : []),
      [L.context, ctx],
      ...qs.map((q, i) => [q, (saved[i] || '').trim() || C.followups.empty]),
    ].map(([k, v]) => el('div', {}, el('dt', { text: k }), el('dd', { class: 'pre', text: v }))));
    form.hidden = true;
    summary.hidden = false;
    summary.focus();
  });

  $('[data-summary-edit]').addEventListener('click', () => {
    summary.hidden = true;
    form.hidden = false;
    $('#f-name').focus();
  });

  $('[data-context-box]').addEventListener('click', (e) => {
    const rm = e.target.closest('[data-context-remove]');
    if (rm) {
      if (rm.dataset.contextRemove === 'situation') state.situation = null; else state.context = null;
      renderContext();
      ($('[data-context-remove]') || $('[data-context-box] a'))?.focus();
    }
  });
}

/* ---------- Réinitialisation de la démonstration ---------- */

function resetAll(announce) {
  state = defaults();
  const dlg = $('[data-dialog]');
  if (dlg.open) { skipRestore = true; dlg.close(); }
  const form = $('[data-form]');
  form.reset();
  form.hidden = false;
  $('[data-summary]').hidden = true;
  ['name', 'email', 'message'].forEach((k) => {
    $(`[data-field="${k}"]`).classList.remove('has-error');
    $(`#e-${k}`).hidden = true;
    $(`[name="${k}"]`, form).removeAttribute('aria-invalid');
  });
  $('#search').value = '';
  $$('details', $('[data-faq]')).forEach((d) => { d.open = false; });
  renderAll();
  const status = $('[data-reset-status]');
  status.textContent = announce ? DATA.footer.resetDone : '';
}

function renderAll() {
  renderFamilies();
  renderPanel();
  renderSearchClear();
  renderContext();
  renderDropout();
  renderSectors();
}

/* ---------- Démarrage ---------- */

bindText();
initNav();
renderTray();
renderUnivers();
initExplorer();
initDialog();
initDropout();
initSectors();
renderStatic();
renderFooter();
initForm();
renderAll();

$('[data-reset]').addEventListener('click', () => resetAll(true));
// Retour via le cache de navigation : on repart d'un état propre.
window.addEventListener('pageshow', (e) => { if (e.persisted) resetAll(false); });
