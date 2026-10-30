// Administration de démonstration : modifie l'état en mémoire, lu ensuite par le site public.
// Aucun enregistrement réel, aucune connexion : chaque action non simulée le dit.
import { SITE, ATLAS, BASE_ASSETS, MEDIA, REQUEST_STATUSES } from '../data.js';
import { h, link, href, atlas, field, check, setError, options, slug, plural, norm, notice, $, $$ } from './dom.js';
import * as S from './state.js';
import { banner } from './layout.js';

const { state } = S;
let flashMsg = '';
let redraw = () => {};
export const setRedraw = (fn) => { redraw = fn; };
const flash = (m) => { flashMsg = m; redraw(); };
// Enregistre le message puis navigue : la vue suivante l'affiche une seule fois.
const done = (route, m) => { flashMsg = m; location.hash = route; };
const A = (r) => `/admin${r}`;
const badge = (text, tone = '') => h('span', { class: `badge ${tone}`.trim(), text });
const cellOptions = () => ATLAS.map((l, i) => [String(i), `${i + 1}. ${l}`]);
const lines = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);
const pairs = (t) => lines(t).map((l) => { const i = l.indexOf(':'); return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });
const unpairs = (arr) => arr.map(([a, b]) => (b ? `${a} : ${b}` : a)).join('\n');
const statusTone = { Nouvelle: 'badge--orange', 'En cours': 'badge--blue', Traitée: '', Archivée: '' };

/* ---------- Coque ---------- */

export function shell(path, view, onReset) {
  const nav = [['', 'Tableau de bord'], ['/catalogue', 'Catalogue'], ['/demandes', 'Demandes'], ['/familles', 'Familles'], ['/fournisseurs', 'Fournisseurs'], ['/pages', 'Pages'], ['/faq', 'FAQ'], ['/medias', 'Médias'], ['/parametres', 'Paramètres']];
  const fresh = state.requests.filter((r) => r.status === 'Nouvelle').length;
  const on = (r) => (r === '' ? path === '/admin' : path === A(r) || path.startsWith(`${A(r)}/`));
  const msg = flashMsg; flashMsg = '';
  return h('div', { class: 'admin' },
    banner(link('/', 'Retour au site')),
    h('div', { class: 'admin__layout' },
      h('aside', { class: 'sidebar' },
        h('a', { class: 'sidebar__brand', href: href('/admin') }, h('img', { src: BASE_ASSETS.logo, alt: 'Maturat Mesure', width: 1107, height: 324 }), h('span', { text: SITE.adminLink })),
        badge('Démonstration', 'badge--orange'),
        h('nav', { 'aria-label': 'Administration' }, h('ul', {}, nav.map(([r, t]) => h('li', {}, h('a', { href: href(A(r) || '/admin'), 'aria-current': on(r) ? 'page' : null }, t, r === '/demandes' && fresh ? h('span', { class: 'count', text: String(fresh) }) : null))))),
        h('div', { class: 'sidebar__foot' }, link('/', '← Retour au site', 'btn btn--ghost btn--sm'), h('button', { class: 'btn btn--ghost btn--sm', type: 'button', text: 'Réinitialiser', onclick: onReset }))),
      h('main', { class: 'admin__main', id: 'main' }, msg ? h('p', { class: 'flash', role: 'status' }, msg) : null, view.node)));
}

const head = (title, intro, actions) => h('header', { class: 'admin__head' }, h('div', {}, h('h1', { text: title, tabindex: '-1' }), intro ? h('p', { text: intro }) : null), actions ? h('div', { class: 'actions' }, actions) : null);
const wrap = (title, intro, body, actions) => ({ title: `${title} · Administration`, node: h('div', {}, head(title, intro, actions), body) });

/* ---------- Formulaires génériques ---------- */

function build(spec, vals) {
  return spec.map((s) => (s.node ? s.node : s.check ? check({ ...s, checked: vals[s.name] }) : field({ ...s, value: vals[s.name] ?? '' })));
}
function collect(form, spec, validate) {
  const data = {};
  spec.filter((s) => s.name).forEach((s) => { const el = form.elements[s.name]; data[s.name] = s.check ? el.checked : el.value.trim(); });
  const errs = spec.filter((s) => s.required && !data[s.name]).map((s) => [s.name, `${s.label} est obligatoire.`]);
  errs.push(...(validate?.(data) ?? []));
  $$('[data-field]', form).forEach((w) => { if (!w.classList.contains('field--check')) setError(w, ''); });
  errs.forEach(([n, m]) => setError($(`[data-field="${n}"]`, form), m));
  if (errs.length) $(`[data-field="${errs[0][0]}"] input, [data-field="${errs[0][0]}"] textarea, [data-field="${errs[0][0]}"] select`, form).focus();
  return errs.length ? null : data;
}
function form(spec, vals, { onSave, validate, label = 'Enregistrer la démo', cancel }) {
  const f = h('form', { class: 'aform', novalidate: true }, build(spec, vals),
    h('div', { class: 'actions' }, h('button', { class: 'btn btn--primary', type: 'submit', text: label }), cancel ? link(cancel, 'Annuler', 'btn btn--quiet') : null));
  f.addEventListener('submit', (e) => { e.preventDefault(); const data = collect(f, spec, validate); if (data) onSave(data); });
  return f;
}
const preview = (selectWrap, label) => {
  const box = h('div', { class: 'cell-preview' });
  const sel = $('select', selectWrap);
  const draw = () => box.replaceChildren(atlas(Number(sel.value), `Aperçu : ${label ? label : ATLAS[Number(sel.value)]}`));
  sel.addEventListener('change', draw); draw();
  return box;
};

/* ---------- Tableau de bord ---------- */

export function dashboard() {
  const all = state.products;
  const counters = [['Fiches produits', all.length], ['Publiées', all.filter(S.isLive).length], ['Brouillons', all.filter((p) => !S.isLive(p)).length], ['Nouvelles demandes', state.requests.filter((r) => r.status === 'Nouvelle').length]];
  const recent = state.requests.slice(0, 3);
  return wrap('Tableau de bord', 'Compteurs calculés depuis les données en mémoire de cet onglet.',
    h('div', {},
      h('ul', { class: 'counters' }, counters.map(([t, n]) => h('li', {}, h('strong', { text: String(n) }), h('span', { text: t })))),
      h('div', { class: 'admin__cols' },
        h('section', { class: 'panel' }, h('h2', { text: 'Raccourcis' }), h('ul', { class: 'shortcuts' }, [['/catalogue/nouveau', 'Créer une fiche'], ['/demandes', 'Voir les demandes'], ['/parametres', 'Ouvrir les paramètres'], ['/pages', 'Modifier les textes des pages']].map(([r, t]) => h('li', {}, link(A(r), t))), h('li', {}, link('/', 'Voir le site')))),
        h('section', { class: 'panel' }, h('h2', { text: 'Demandes récentes' }),
          recent.length ? h('ul', { class: 'recent' }, recent.map((r) => h('li', {}, h('a', { href: href(A(`/demandes/${r.id}`)) }, h('strong', { text: r.id }), h('span', { text: r.name || 'Sans nom' })), badge(r.status, statusTone[r.status])))) : h('p', { class: 'fineprint', text: 'Aucune demande pour le moment.' })))));
}

/* ---------- Catalogue ---------- */

export function catalogue() {
  let q = '';
  let st = '';
  const body = h('tbody');
  const count = h('p', { class: 'count', role: 'status', 'aria-live': 'polite' });
  const draw = () => {
    const res = state.products.filter((p) => (!st || p.status === st) && (!q || norm(p.title + p.ref).includes(norm(q))));
    count.textContent = plural(res.length, 'fiche', 'fiches');
    body.replaceChildren(...(res.length ? res.map(row) : [h('tr', {}, h('td', { colspan: 6, text: 'Aucune fiche ne correspond. Modifiez la recherche ou le statut.' }))]));
  };
  const row = (p) => h('tr', {},
    h('td', {}, h('strong', { text: p.title }), h('span', { class: 'sub', text: `${p.ref} · ${S.supplierName(p.supplier)}` })),
    h('td', { text: S.productPath(p) }),
    h('td', {}, badge(S.isLive(p) ? 'Publié' : 'Brouillon', S.isLive(p) ? 'badge--blue' : ''), p.featured ? badge('À la une', 'badge--orange') : null),
    h('td', { class: 'row-actions' },
      link(A(`/catalogue/${p.id}`), 'Modifier', 'btn btn--quiet btn--xs'),
      h('button', { class: 'btn btn--ghost btn--xs', type: 'button', text: 'Dupliquer', onclick: () => duplicate(p) }),
      h('button', { class: 'btn btn--ghost btn--xs', type: 'button', text: S.isLive(p) ? 'Masquer' : 'Publier', onclick: () => { p.status = S.isLive(p) ? 'brouillon' : 'publie'; flash(`« ${p.title} » : ${S.isLive(p) ? 'publiée' : 'masquée'} sur le site.`); } }),
      S.isLive(p) ? link(`/produit/${p.id}`, 'Voir sur le site', 'btn btn--ghost btn--xs') : null));
  const duplicate = (p) => {
    const c = structuredClone(p);
    c.title = `${p.title} (copie)`; c.ref = `${p.ref}-COPIE`; c.id = S.nextProductId(c.title); c.status = 'brouillon'; c.featured = false;
    state.products.unshift(c);
    flash(`Copie créée en brouillon : « ${c.title} ».`);
  };
  const search = field({ label: 'Rechercher une fiche', name: 'q', type: 'search', placeholder: 'Titre ou référence' });
  const stat = field({ label: 'Statut', name: 'st', type: 'select', options: options([['publie', 'Publié'], ['brouillon', 'Brouillon']], 'Tous') });
  $('input', search).addEventListener('input', (e) => { q = e.target.value; draw(); });
  $('select', stat).addEventListener('change', (e) => { st = e.target.value; draw(); });
  draw();
  return wrap('Catalogue', 'Les modifications sont visibles tout de suite sur le site, dans cet onglet.',
    h('div', {}, h('div', { class: 'toolbar' }, search, stat, count),
      h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Fiche', 'Rubrique', 'Statut', 'Actions'].map((t) => h('th', { scope: 'col', text: t })))), body))),
    link(A('/catalogue/nouveau'), 'Créer une fiche', 'btn btn--primary'));
}

export function productForm({ params }) {
  const isNew = params.id === 'nouveau';
  const p = isNew ? { title: '', ref: '', supplier: state.suppliers[0]?.id, family: state.families[0].id, group: state.families[0].groups[0].id, status: 'brouillon', featured: false, cell: 0, summary: '', usage: '', description: '', specs: [], applications: [], models: [], document: false } : S.product(params.id);
  if (!p) return wrap('Fiche introuvable', 'Cette fiche n’existe pas (ou a disparu avec la réinitialisation).', h('p', {}, link(A('/catalogue'), '← Retour au catalogue')));
  const spec = [
    { label: 'Titre de la fiche', name: 'title', required: true },
    { label: 'Référence', name: 'ref', optional: true, hint: 'Référence fictive de démonstration.' },
    { label: 'Fournisseur', name: 'supplier', type: 'select', options: options(state.suppliers.map((s) => [s.id, s.name])) },
    { label: 'Rubrique', name: 'family', type: 'select', options: options(state.families.map((f) => [f.id, f.title])) },
    { label: 'Sous-famille', name: 'group', type: 'select', options: [] },
    { label: 'Statut', name: 'status', type: 'select', options: options([['publie', 'Publié'], ['brouillon', 'Brouillon']]), hint: 'Publié : visible dans cette maquette. Brouillon : visible seulement dans l’admin. Tout disparaît au rechargement.' },
    { check: true, label: 'À la une sur l’accueil', name: 'featured' },
    { label: 'Visuel (atlas de produits)', name: 'cell', type: 'select', options: options(cellOptions()) },
    { node: h('div', { class: 'preview-slot' }) },
    { label: 'Résumé', name: 'summary', type: 'textarea', rows: 2, hint: 'En une phrase : ce que fait le produit et pour quel besoin.' },
    { label: 'Usage', name: 'usage', type: 'textarea', rows: 2, hint: 'Dans quelle installation ou situation ce produit est-il utile ?' },
    { label: 'Description', name: 'description', type: 'textarea', rows: 4 },
    { label: 'Applications', name: 'applications', type: 'textarea', rows: 3, hint: 'Une application par ligne.', optional: true },
    { label: 'Caractéristiques', name: 'specs', type: 'textarea', rows: 4, hint: 'Une ligne par caractéristique : Nom : valeur. Valeurs fictives à signaler.', optional: true },
    { label: 'Modèles (fiche de gamme)', name: 'models', type: 'textarea', rows: 3, hint: 'Une ligne par modèle : Nom : note. Laissez vide pour une fiche simple.', optional: true },
    { check: true, label: 'Proposer la fiche PDF de démonstration', name: 'document', hint: 'Affiche le bouton de téléchargement du PDF d’exemple sur la fiche.' },
  ];
  const vals = { ...p, cell: String(p.cell), applications: p.applications.join('\n'), specs: unpairs(p.specs), models: unpairs(p.models) };
  const f = form(spec, vals, { cancel: A('/catalogue'), label: isNew ? 'Créer la fiche (démo)' : 'Enregistrer la démo', onSave: (d) => {
    Object.assign(p, d, { cell: Number(d.cell), applications: lines(d.applications), specs: pairs(d.specs), models: pairs(d.models) });
    if (isNew) { p.id = S.nextProductId(d.title); state.products.unshift(p); }
    done(A('/catalogue'), [
      `Fiche « ${p.title} » enregistrée dans la démo (${S.isLive(p) ? 'publiée' : 'brouillon'}). `,
      S.isLive(p) ? link(`/produit/${p.id}`, 'Vérifier la fiche sur le site') : null,
    ]);
  } });
  const fam = $('[name=family]', f); const grp = $('[name=group]', f);
  const fillGroups = (keep) => {
    const list = S.family(fam.value).groups;
    grp.replaceChildren(...list.map((g) => h('option', { value: g.id, text: g.title })));
    grp.value = list.some((g) => g.id === keep) ? keep : list[0].id;
  };
  fillGroups(p.group); fam.addEventListener('change', () => fillGroups());
  $('.preview-slot', f).replaceWith(preview($('[data-field=cell]', f)));
  return wrap(isNew ? 'Nouvelle fiche' : 'Modifier la fiche', isNew ? 'Une fiche créée ici apparaît dans la maquette de cet onglet si elle est publiée.' : p.title,
    h('div', {}, !isNew && S.isLive(p) ? h('p', { class: 'fineprint' }, link(`/produit/${p.id}`, 'Voir la fiche sur le site'), ' · Aperçu de la dernière version enregistrée dans cet onglet. Enregistrez vos modifications avant de l’ouvrir.') : null, f));
}

/* ---------- Demandes ---------- */

export function demandes() {
  const list = state.requests;
  return wrap('Demandes', 'Demandes fictives et celles saisies dans le formulaire de cet onglet. Aucune réponse e-mail n’est possible depuis ici.',
    list.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Demande', 'Contact', 'Objet', 'Statut'].map((t) => h('th', { scope: 'col', text: t })))),
      h('tbody', {}, list.map((r) => h('tr', {},
        h('td', {}, link(A(`/demandes/${r.id}`), r.id), h('span', { class: 'sub', text: r.date })),
        h('td', { text: r.name || '—' }),
        h('td', { text: S.product(r.productId)?.title ?? S.family(r.rubrique)?.title ?? (r.need ? r.need.slice(0, 60) : 'À préciser') }),
        h('td', {}, badge(r.status, statusTone[r.status]))))))) : h('p', { text: 'Aucune demande pour le moment.' }));
}

export function demandeDetail({ params }) {
  const r = S.request(params.id);
  if (!r) return wrap('Demande introuvable', 'Cette demande n’existe pas (ou a disparu avec la réinitialisation).', h('p', {}, link(A('/demandes'), '← Retour aux demandes')));
  const rows = [['Date', r.date], ['Nom', r.name || '—'], ['E-mail', r.email || '—'], ['Téléphone', r.phone || '—'], ['Entreprise', r.company || '—'],
    ['Produit', S.product(r.productId)?.title ?? '—'], ['Rubrique', S.family(r.rubrique)?.title ?? '—'], ['Besoin', r.need || (r.unknown ? 'Je ne sais pas encore' : '—')], ['Contexte', r.sector || '—'], ['Fluide', r.fluid || '—'], ['Précision', r.context || '—']];
  const spec = [{ label: 'Statut de suivi interne', name: 'status', type: 'select', options: options(REQUEST_STATUSES) }, { label: 'Note interne', name: 'note', type: 'textarea', rows: 4, optional: true, hint: 'Visible uniquement dans l’administration.' }];
  const f = form(spec, r, { label: 'Enregistrer la démo', onSave: (d) => { Object.assign(r, d); flash(`Demande ${r.id} mise à jour.`); } });
  return wrap(`Demande ${r.id}`, 'Détail de la demande et suivi interne.', h('div', { class: 'admin__cols' },
    h('section', { class: 'panel' }, h('h2', { text: 'Contenu' }), h('dl', { class: 'facts' }, rows.map(([k, v]) => h('div', {}, h('dt', { text: k }), h('dd', { class: 'pre', text: v })))),
      h('p', { class: 'fineprint', text: 'Le suivi se fait ici ; les réponses aux clients se font depuis votre messagerie habituelle. Aucun e-mail ne peut être envoyé depuis cette maquette.' })),
    h('section', { class: 'panel' }, h('h2', { text: 'Suivi interne' }), f)),
    link(A('/demandes'), '← Retour aux demandes', 'btn btn--quiet'));
}

/* ---------- Familles ---------- */

export function familles() {
  const move = (i, d) => { const a = state.families; [a[i], a[i + d]] = [a[i + d], a[i]]; flash('Ordre mis à jour : il s’applique au site.'); };
  return wrap('Familles', 'Les sept rubriques du site. L’ordre choisi se retrouve dans les pages publiques.',
    h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Ordre', 'Rubrique', 'Sous-familles', 'Actions'].map((t) => h('th', { scope: 'col', text: t })))),
      h('tbody', {}, state.families.map((f, i) => h('tr', {},
        h('td', { class: 'row-actions' }, h('span', { text: String(i + 1) }),
          h('button', { class: 'btn btn--ghost btn--xs', type: 'button', text: '↑', 'aria-label': `Monter ${f.title}`, disabled: i === 0, onclick: () => move(i, -1) }),
          h('button', { class: 'btn btn--ghost btn--xs', type: 'button', text: '↓', 'aria-label': `Descendre ${f.title}`, disabled: i === state.families.length - 1, onclick: () => move(i, 1) })),
        h('td', {}, h('strong', { text: f.title }), h('span', { class: 'sub', text: f.short })),
        h('td', { text: f.groups.map((g) => g.title).join(', ') }),
        h('td', { class: 'row-actions' }, link(A(`/familles/${f.id}`), 'Modifier', 'btn btn--quiet btn--xs'), link(`/rubrique/${f.id}`, 'Voir sur le site', 'btn btn--ghost btn--xs'))))))));
}

export function familleForm({ params }) {
  const fam = S.family(params.id);
  if (!fam) return wrap('Famille introuvable', 'Cette rubrique n’existe pas.', h('p', {}, link(A('/familles'), '← Retour aux familles')));
  const spec = [
    { label: 'Titre', name: 'title', required: true }, { label: 'Phrase courte', name: 'short', required: true },
    { label: 'Description', name: 'description', type: 'textarea', rows: 4 },
    { label: 'Visuel (atlas de produits)', name: 'cell', type: 'select', options: options(cellOptions()) }, { node: h('div', { class: 'preview-slot' }) },
    { label: 'Sous-familles', name: 'groups', type: 'textarea', rows: 5, required: true, hint: 'Une par ligne. Une sous-famille qui contient des fiches ne peut pas être retirée.' }];
  const f = form(spec, { ...fam, cell: String(fam.cell), groups: fam.groups.map((g) => g.title).join('\n') }, { cancel: A('/familles'),
    validate: (d) => {
      const next = lines(d.groups);
      const lost = fam.groups.slice(next.length).filter((g) => state.products.some((p) => p.family === fam.id && p.group === g.id));
      return lost.length ? [['groups', `« ${lost[0].title} » contient des fiches : déplacez-les avant de la retirer.`]] : [];
    },
    onSave: (d) => {
      const used = new Set();
      const groups = lines(d.groups).map((t, i) => {
        let id = fam.groups[i]?.id ?? slug(t);
        while (used.has(id)) id += '-2';
        used.add(id);
        return { id, title: t, text: fam.groups[i]?.text ?? '' };
      });
      Object.assign(fam, { title: d.title, short: d.short, description: d.description, cell: Number(d.cell), groups });
      done(A('/familles'), `Famille « ${fam.title} » enregistrée dans la démo.`);
    } });
  $('.preview-slot', f).replaceWith(preview($('[data-field=cell]', f)));
  return wrap('Modifier la famille', fam.title, f);
}

/* ---------- Fournisseurs ---------- */

export function fournisseurs() {
  return wrap('Fournisseurs', 'Fournisseurs fictifs de démonstration.',
    h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Fournisseur', 'Fiches', 'Statut', 'Actions'].map((t) => h('th', { scope: 'col', text: t })))),
      h('tbody', {}, state.suppliers.map((s) => h('tr', {},
        h('td', {}, h('strong', { text: s.name }), h('span', { class: 'sub', text: s.specialty })),
        h('td', { text: String(state.products.filter((p) => p.supplier === s.id).length) }),
        h('td', {}, badge(s.published ? 'Publié' : 'Masqué', s.published ? 'badge--blue' : '')),
        h('td', { class: 'row-actions' }, link(A(`/fournisseurs/${s.id}`), 'Modifier', 'btn btn--quiet btn--xs'), s.published ? link(`/fournisseur/${s.id}`, 'Voir sur le site', 'btn btn--ghost btn--xs') : null)))))),
    link(A('/fournisseurs/nouveau'), 'Ajouter un fournisseur', 'btn btn--primary'));
}

export function fournisseurForm({ params }) {
  const isNew = params.id === 'nouveau';
  const s = isNew ? { name: '', specialty: '', text: '', published: true } : S.supplier(params.id);
  if (!s) return wrap('Fournisseur introuvable', 'Ce fournisseur n’existe pas.', h('p', {}, link(A('/fournisseurs'), '← Retour aux fournisseurs')));
  const spec = [{ label: 'Nom', name: 'name', required: true }, { label: 'Spécialité', name: 'specialty', optional: true }, { label: 'Présentation', name: 'text', type: 'textarea', rows: 3, optional: true },
    { check: true, label: 'Publié sur le site', name: 'published' }];
  return wrap(isNew ? 'Nouveau fournisseur' : 'Modifier le fournisseur', 'Exemple fictif : aucun fournisseur réel n’est enregistré.', form(spec, s, { cancel: A('/fournisseurs'), onSave: (d) => {
    Object.assign(s, d);
    if (isNew) { s.id = S.supplier(slug(d.name)) ? `${slug(d.name)}-2` : slug(d.name); state.suppliers.push(s); }
    done(A('/fournisseurs'), `Fournisseur « ${s.name} » enregistré dans la démo.`);
  } }));
}

/* ---------- Pages ---------- */

export function pages() {
  return wrap('Pages', 'Pages prévues du site : modèle, titre, statut et textes importants. Ce n’est pas un constructeur de pages.',
    h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Page', 'Modèle', 'Statut', 'Actions'].map((t) => h('th', { scope: 'col', text: t })))),
      h('tbody', {}, state.pages.map((p) => h('tr', {},
        h('td', {}, h('strong', { text: p.label }), h('span', { class: 'sub', text: p.title })),
        h('td', { text: p.model }),
        h('td', {}, badge(p.status === 'publie' ? 'Publié' : 'Brouillon', p.status === 'publie' ? 'badge--blue' : '')),
        h('td', { class: 'row-actions' }, link(A(`/pages/${p.id}`), 'Modifier', 'btn btn--quiet btn--xs'), link(p.route, 'Aperçu', 'btn btn--ghost btn--xs'))))))));
}

export function pageForm({ params }) {
  const p = S.page(params.id);
  if (!p) return wrap('Page introuvable', 'Cette page n’existe pas.', h('p', {}, link(A('/pages'), '← Retour aux pages')));
  const spec = [{ label: 'Titre', name: 'title', required: true }, { label: 'Texte d’introduction', name: 'intro', type: 'textarea', rows: 4 },
    { label: 'Statut', name: 'status', type: 'select', options: options([['publie', 'Publié'], ['brouillon', 'Brouillon']]), hint: p.id === 'accueil' ? 'L’accueil reste toujours publié.' : undefined }];
  const f = form(spec, p, { cancel: A('/pages'), onSave: (d) => { Object.assign(p, d, p.id === 'accueil' ? { status: 'publie' } : {}); done(A('/pages'), `Page « ${p.label} » enregistrée dans la démo.`); } });
  return wrap(`Page : ${p.label}`, `Modèle : ${p.model}.`, h('div', {}, f, h('p', {}, link(p.route, 'Ouvrir l’aperçu sur le site'))));
}

/* ---------- FAQ ---------- */

export function faq() {
  const items = state.faq;
  return wrap('FAQ', 'Questions affichées sur la page Questions et sur l’accueil.',
    h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, ['Question', 'Groupe', 'Statut', 'Actions'].map((t) => h('th', { scope: 'col', text: t })))),
      h('tbody', {}, items.map((q) => h('tr', {},
        h('td', { text: q.q }), h('td', { text: q.group }),
        h('td', {}, badge(q.published ? 'Publiée' : 'Masquée', q.published ? 'badge--blue' : '')),
        h('td', { class: 'row-actions' }, link(A(`/faq/${q.id}`), 'Modifier', 'btn btn--quiet btn--xs'),
          h('button', { class: 'btn btn--ghost btn--xs', type: 'button', text: q.published ? 'Masquer' : 'Publier', onclick: () => { q.published = !q.published; flash('Statut de la question mis à jour.'); } }))))))),
    link(A('/faq/nouveau'), 'Ajouter une question', 'btn btn--primary'));
}

export function faqForm({ params }) {
  const isNew = params.id === 'nouveau';
  const q = isNew ? { group: state.faq[0]?.group ?? 'Général', q: '', a: '', published: true } : state.faq.find((x) => x.id === params.id);
  if (!q) return wrap('Question introuvable', 'Cette question n’existe pas.', h('p', {}, link(A('/faq'), '← Retour à la FAQ')));
  const spec = [{ label: 'Groupe', name: 'group', required: true }, { label: 'Question', name: 'q', required: true }, { label: 'Réponse', name: 'a', type: 'textarea', rows: 4, required: true }, { check: true, label: 'Publiée sur le site', name: 'published' }];
  return wrap(isNew ? 'Nouvelle question' : 'Modifier la question', null, form(spec, q, { cancel: A('/faq'), onSave: (d) => {
    Object.assign(q, d);
    if (isNew) { q.id = `faq-${Date.now()}`; state.faq.push(q); }
    done(A('/faq'), 'Question enregistrée dans la démo.');
  } }));
}

/* ---------- Médias ---------- */

export function medias() {
  return wrap('Médias', 'Visuels publics de la maquette, leur usage et leurs droits. Le téléversement n’est pas simulé.',
    h('ul', { class: 'media-grid' }, MEDIA.map((m) => h('li', {},
      h('div', { class: 'media__thumb' }, m.pdf ? h('span', { class: 'mono', text: 'PDF' }) : h('img', { src: m.file, alt: '', loading: 'lazy' })),
      h('strong', { text: m.name }), h('code', { text: m.file }), h('span', { text: `Usage : ${m.usage}` }), h('span', { class: 'fineprint', text: m.rights })))),
    h('button', { class: 'btn btn--quiet', type: 'button', text: 'Ajouter un média', onclick: () => notice('Non simulé', 'Le téléversement n’existe pas dans cette maquette : aucun fichier ne peut être ajouté. Les médias ci-dessous sont ceux du dossier public.') }));
}

/* ---------- Paramètres ---------- */

export function parametres() {
  const s = state.settings;
  const sections = [
    ['Contact & localisation', [{ label: 'E-mail public', name: 'email', type: 'email' }, { label: 'Téléphone', name: 'phone' }, { label: 'Adresse', name: 'address', type: 'textarea', rows: 2 }], { email: s.contact.email, phone: s.contact.phone, address: s.contact.address }],
    ['Adresse interne de notification', [{ label: 'E-mail interne', name: 'notifyEmail', type: 'email', hint: 'Interne : jamais affichée sur le site public. Aucune notification n’est envoyée dans cette démonstration.' }], { notifyEmail: state.internal.notifyEmail }],
    ['Horaires', [{ label: 'Horaires affichés', name: 'hours', type: 'textarea', rows: 2 }], { hours: s.contact.hours }],
    ['SEO / OG', [{ label: 'Titre du site', name: 'seoTitle', hint: 'Mis à jour dans l’onglet du navigateur. Aucune balise n’est publiée.' }, { label: 'Description', name: 'seoDescription', type: 'textarea', rows: 2 }, { label: 'Titre de partage (OG)', name: 'ogTitle' }], { seoTitle: s.seo.title, seoDescription: s.seo.description, ogTitle: s.seo.ogTitle }],
    ['Fonctionnalités actives', [
      { check: true, label: 'Page Fournisseurs', name: 'showSuppliers' }, { check: true, label: 'Page Actualités (menu pied de page)', name: 'showNews' }, { check: true, label: 'Page Recrutement (pied de page)', name: 'showRecruitment' },
      { check: true, label: 'Bouton de téléchargement du PDF', name: 'showPdf' }, { check: true, label: 'Formulaire de demande', name: 'requestForm' }, { check: true, label: 'FAQ sur l’accueil', name: 'showFaqHome' }], s.features],
    ['Réseaux', [{ label: 'LinkedIn (adresse complète)', name: 'linkedin', type: 'url', optional: true }, { label: 'YouTube (adresse complète)', name: 'youtube', type: 'url', optional: true }], s.social],
    ['Société / pied de page', [{ label: 'Nom de la société', name: 'legalName' }, { label: 'Texte du pied de page', name: 'footerText', type: 'textarea', rows: 2 }, { label: 'Mention du pied de page', name: 'footerNote' }], s.company]];
  const all = sections.flatMap(([, f]) => f);
  const vals = Object.assign({}, ...sections.map((x) => x[2]));
  const f = form(all.map((x) => ({ ...x, node: undefined })), vals, { onSave: (d) => {
    Object.assign(s.contact, { email: d.email, phone: d.phone, address: d.address, hours: d.hours });
    Object.assign(s.seo, { title: d.seoTitle, description: d.seoDescription, ogTitle: d.ogTitle });
    Object.keys(s.features).forEach((k) => { s.features[k] = d[k]; });
    Object.assign(s.social, { linkedin: d.linkedin, youtube: d.youtube });
    Object.assign(s.company, { legalName: d.legalName, footerText: d.footerText, footerNote: d.footerNote });
    state.internal.notifyEmail = d.notifyEmail;
    flash('Réglages enregistrés dans la démo : le site public les reflète (mémoire de l’onglet).');
  }, validate: (d) => [d.email && !/^[^\s@]+@[^\s@]+$/.test(d.email) ? ['email', 'Adresse e-mail non valide.'] : null].filter(Boolean) });
  // Regroupement visuel en blocs, sans changer les champs.
  const blocks = [];
  const nodes = [...f.children];
  let i = 0;
  sections.forEach(([title, fields]) => {
    const fs = h('fieldset', { class: 'block' }, h('legend', { text: title }));
    fields.forEach(() => { fs.append(nodes[i++]); });
    blocks.push(fs);
  });
  const actions = f.lastElementChild;
  f.replaceChildren(...blocks, actions);
  return wrap('Paramètres', 'Blocs de réglages inspirés d’un CMS. Les champs principaux et les interrupteurs modifient le site public dans cet onglet.', f);
}
