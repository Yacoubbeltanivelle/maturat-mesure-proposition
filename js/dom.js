// Utilitaires DOM : tout le texte passe par textContent, jamais par du balisage injecté.
import { BASE_ASSETS } from '../data.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function h(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) if (kid !== null && kid !== undefined && kid !== false) node.append(kid);
  return node;
}

export const norm = (s) => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
export const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;
export const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'element';
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lien interne par hash : la base GitHub Pages n'a aucune incidence.
export const href = (route, query) => {
  const qs = query ? Object.entries(query).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&') : '';
  return `#${route}${qs ? `?${qs}` : ''}`;
};
export const link = (route, text, cls = '', query) => h('a', { href: href(route, query), class: cls, text });

// Visuel d'atlas : 4 colonnes x 3 lignes, recadré en CSS sans étirement.
export function atlas(cell, label, cls = '') {
  const col = cell % 4;
  const row = Math.floor(cell / 4);
  const node = h('span', { class: `atlas ${cls}`.trim(), role: 'img', 'aria-label': label });
  node.style.backgroundPosition = `${(col / 3) * 100}% ${(row / 2) * 100}%`;
  return node;
}

// Sonde l'atlas : fixe le ratio d'une cellule, ou signale son absence sans lien cassé.
export function probeAtlas() {
  const img = new Image();
  img.onload = () => {
    document.documentElement.style.setProperty('--atlas-ar', String((img.naturalWidth / 4) / (img.naturalHeight / 3)));
    document.documentElement.classList.remove('no-atlas');
  };
  img.onerror = () => document.documentElement.classList.add('no-atlas');
  img.src = BASE_ASSETS.atlas;
}

/* ---------- Champs de formulaire ---------- */

let uid = 0;
export function field({ label, name, type = 'text', value = '', options, hint, required, rows = 4, placeholder, autocomplete, optional }) {
  const id = `f${++uid}-${name}`;
  const wrap = h('div', { class: 'field', 'data-field': name });
  const lab = h('label', { for: id }, label, required ? h('span', { class: 'req', 'aria-hidden': 'true', text: ' *' }) : null, optional ? h('span', { class: 'opt', text: ' (facultatif)' }) : null);
  let input;
  if (type === 'textarea') input = h('textarea', { id, name, rows, placeholder });
  else if (type === 'select') {
    input = h('select', { id, name }, options.map((o) => h('option', { value: o.value, text: o.label })));
  } else input = h('input', { id, name, type, placeholder, autocomplete });
  input.value = value ?? '';
  if (required) input.setAttribute('aria-required', 'true');
  const descr = [];
  if (hint) { const p = h('p', { class: 'hint', id: `${id}-h`, text: hint }); descr.push(p.id); wrap.append(lab, input, p); } else wrap.append(lab, input);
  const err = h('p', { class: 'error', id: `${id}-e`, hidden: true });
  wrap.append(err);
  input.dataset.errId = err.id;
  if (descr.length) input.setAttribute('aria-describedby', descr.join(' '));
  return wrap;
}

export function check({ label, name, checked, hint }) {
  const id = `f${++uid}-${name}`;
  const input = h('input', { id, name, type: 'checkbox' });
  input.checked = !!checked;
  return h('div', { class: 'field field--check', 'data-field': name }, input, h('label', { for: id, text: label }), hint ? h('p', { class: 'hint', text: hint }) : null);
}

export function setError(wrap, message) {
  const input = $('input, textarea, select', wrap);
  const err = $('.error', wrap);
  wrap.classList.toggle('has-error', !!message);
  err.hidden = !message;
  err.textContent = message || '';
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (!ids.includes(err.id)) input.setAttribute('aria-describedby', [...ids, err.id].join(' '));
  } else input.removeAttribute('aria-invalid');
}

export const values = (form) => Object.fromEntries([...new FormData(form).entries()]);

export const options = (list, first) => [...(first ? [{ value: '', label: first }] : []), ...list.map((o) => (Array.isArray(o) ? { value: o[0], label: o[1] } : typeof o === 'string' ? { value: o, label: o } : o))];

/* ---------- Dialogue d'information (Échap et clic hors cadre ferment) ---------- */

export function notice(title, text) {
  const dialog = h('dialog', { class: 'notice', 'aria-labelledby': 'notice-title' },
    h('div', { class: 'notice__body' },
      h('h2', { id: 'notice-title', text: title }),
      h('p', { text }),
      h('button', { class: 'btn btn--primary', type: 'button', text: 'Fermer', onclick: () => dialog.close() })));
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.body.append(dialog);
  dialog.showModal();
}
