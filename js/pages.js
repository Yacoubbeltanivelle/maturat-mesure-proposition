// Vues publiques. Chaque vue renvoie { title, node } ; les contenus viennent de data.js et de l'état mémoire.
import { HOME, COMPANY, CATALOGUE_GUIDE, BASE_ASSETS, ATLAS, LEGAL, CREDITS_MEDIA_FILE, SITE, PRODUCT_NOTE } from '../data.js';
import { h, link, href, atlas, norm, plural, options, field, $ } from './dom.js';
import * as S from './state.js';
import { pageHead, sectionHead, productCard, emptyState, specNote, ctaBand, crumbs } from './layout.js';

const { state } = S;
const photo = (src, cls) => {
  const img = h('img', { src, alt: '', loading: 'lazy', decoding: 'async', class: cls });
  img.addEventListener('error', () => img.classList.add('is-missing'));
  return img;
};
const faqItem = (f) => h('details', {}, h('summary', { text: f.q }), h('p', { text: f.a }));
const fam = S.family;

/* ---------- Accueil ---------- */

export function home() {
  const a = (cell) => atlas(cell, `Illustration : ${ATLAS[cell]} (produit fictif)`);
  const t = S.pageText('accueil', 'title');
  const hero = h('section', { class: 'hero' },
    h('div', { class: 'hero__grain', 'aria-hidden': 'true' }),
    h('div', { class: 'wrap hero__in' },
      h('h1', { text: t, tabindex: '-1' }),
      h('p', { class: 'lede', text: S.pageText('accueil', 'intro') }),
      h('div', { class: 'actions actions--center' }, link('/catalogue', HOME.primary, 'btn btn--primary btn--lg'), link('/demande', HOME.secondary, 'btn btn--line')),
      h('p', { class: 'rule-label' }, h('span', { text: HOME.measuresLabel })),
      h('ul', { class: 'measures' }, HOME.measures.map((m, i) =>
        h('li', {}, h('a', { class: 'mcard', href: href('/rubrique/instrumentation', { sous: m.id }) },
          h('span', { class: 'mcard__top' }, h('span', { class: 'mono', text: `0${i + 1} / ${m.unit}` }), h('span', { class: 'mcard__arrow', 'aria-hidden': 'true', text: '↗' })),
          h('span', { class: 'mcard__stage' }, a(m.cell)),
          h('span', { class: 'mcard__title', text: m.label }),
          h('span', { class: 'mcard__text', text: m.text }),
          h('span', { class: 'mcard__foot', text: `Voir les fiches ${m.label}` }))))),
      h('p', { class: 'fineprint center', text: HOME.measureNote })));

  const domains = h('section', { class: 'section section--pale' },
    h('div', { class: 'wrap split' },
      h('div', { class: 'split__lead' }, sectionHead(HOME.domainsTitle, HOME.domainsIntro), link('/catalogue', 'Voir tout le catalogue', 'arrow-link')),
      h('ol', { class: 'domains' }, state.families.map((f, i) =>
        h('li', {}, h('a', { class: 'domain', href: href(`/rubrique/${f.id}`) },
          h('span', { class: 'domain__n mono', text: String(i + 1).padStart(2, '0') }),
          h('span', { class: 'domain__t' }, h('strong', { text: f.title }), h('span', { text: f.groups.map((g) => g.title).join(' · ') })),
          h('span', { class: 'domain__v' }, a(f.cell)),
          h('span', { class: 'domain__go', 'aria-hidden': 'true', text: '→' })))))));

  const feats = S.featured().slice(0, 3);
  const featured = h('section', { class: 'section' },
    h('div', { class: 'wrap' }, sectionHead(HOME.featuredTitle, HOME.featuredIntro),
      feats.length ? h('div', { class: 'features' }, feats.map((p, i) => h('article', { class: `feature ${i % 2 ? 'feature--rev' : ''}` },
        h('div', { class: 'stage' }, a(p.cell)),
        h('div', { class: 'feature__copy' },
          h('p', { class: 'kicker', text: S.productPath(p) }),
          h('h3', {}, link(`/produit/${p.id}`, p.title)),
          h('p', { text: p.summary }),
          h('p', { class: 'meta', text: `${p.ref} · ${S.supplierName(p.supplier)}` }),
          h('div', { class: 'actions' }, link(`/produit/${p.id}`, 'Voir la fiche', 'btn btn--quiet'), link('/demande', SITE.productCta, 'btn btn--primary', { produit: p.id })))))) :
        emptyState('Aucune fiche à la une', 'Dans l’administration de démonstration, cochez « À la une » sur une fiche publiée.', link('/admin/catalogue', 'Ouvrir le catalogue de démonstration', 'btn btn--quiet'))));

  const d = HOME.dropout;
  const dropout = h('section', { class: 'section section--deep' },
    photo(BASE_ASSETS.photoBlue, 'deep__photo'),
    h('div', { class: 'wrap dropout' },
      h('div', { class: 'dropout__copy' }, h('p', { class: 'kicker', text: d.kicker }), h('h2', { text: d.title }), h('p', { class: 'lede', text: d.text }),
        h('ul', { class: 'points' }, d.points.map((x) => h('li', { text: x }))),
        h('div', { class: 'actions' }, link('/dropout', d.cta, 'btn btn--primary'), link('/catalogue', 'Voir les fiches Dropout', 'btn btn--text', { rubrique: 'traitement-air' }))),
      h('div', { class: 'dropout__stage' }, flow(), h('div', { class: 'dropout__obj' }, a(6)))));

  const apps = h('section', { class: 'section' },
    h('div', { class: 'wrap apps' },
      h('div', { class: 'apps__photo' }, photo(BASE_ASSETS.photoPipes, 'cover')),
      h('div', {}, sectionHead(HOME.applicationsTitle, HOME.applicationsIntro),
        h('ul', { class: 'rows' }, HOME.applications.map((x) => h('li', {}, h('h3', { text: x.title }), h('p', { text: x.text }),
          h('p', { class: 'row-links' }, x.links.map(([f, g]) => link(`/rubrique/${f}`, `${fam(f).title}${g ? ` › ${S.group(fam(f), g).title}` : ''}`, '', g ? { sous: g } : null)))))))));

  const sup = S.publicSuppliers();
  const suppliers = S.feature('showSuppliers') ? h('section', { class: 'section section--pale' },
    h('div', { class: 'wrap' }, sectionHead(HOME.suppliersTitle, HOME.suppliersIntro),
      h('ul', { class: 'supplier-strip' }, sup.map((s) => h('li', {}, h('a', { href: href(`/fournisseur/${s.id}`) }, h('strong', { text: s.name }), h('span', { text: s.specialty }))))),
      link('/fournisseurs', 'Voir les fournisseurs', 'arrow-link'))) : null;

  const company = h('section', { class: 'section' },
    h('div', { class: 'wrap company' },
      h('div', { class: 'company__visual' }, photo(BASE_ASSETS.photoBlue, 'cover'), h('div', { class: 'company__obj' }, a(0)), h('div', { class: 'company__obj company__obj--2' }, a(3))),
      h('div', {}, h('h2', { text: HOME.companyTitle }), h('p', { class: 'lede', text: HOME.companyText }),
        h('ul', { class: 'roles' }, COMPANY.roles.map((r) => h('li', {}, h('strong', { text: r.title }), h('span', { text: r.text })))),
        link('/entreprise', 'Découvrir notre façon de travailler', 'arrow-link'))));

  const faqs = state.faq.filter((f) => f.published).slice(0, 4);
  const faq = S.feature('showFaqHome') && faqs.length ? h('section', { class: 'section section--pale' },
    h('div', { class: 'wrap split split--faq' }, h('div', {}, h('h2', { text: HOME.faqTitle }), link('/faq', 'Toutes les questions', 'arrow-link')),
      h('div', { class: 'faq' }, faqs.map(faqItem)))) : null;

  return { title: '', node: h('div', {}, hero, domains, featured, dropout, apps, suppliers, company, faq, contactBand()) };
}

function flow() {
  return h('div', { class: 'flow', role: 'img', 'aria-label': 'Schéma illustratif : de l’eau liquide séparée d’un flux d’air' },
    h('span', { class: 'flow__pipe' }), ...[0, 1, 2, 3, 4].map((i) => h('span', { class: 'drop', style: `--i:${i}` })), h('span', { class: 'flow__pool' }));
}

export function contactBand() {
  const c = state.settings.contact;
  return h('section', { class: 'cta-band' },
    h('div', { class: 'wrap cta-band__in' },
      h('div', {}, h('h2', { text: HOME.contactTitle }), h('p', { text: HOME.contactText }),
        h('p', { class: 'cta-band__contact' }, h('span', { text: c.email }), h('span', { text: c.phone }))),
      h('div', { class: 'actions' }, link('/demande', SITE.cta, 'btn btn--primary btn--lg'), link('/catalogue', 'Explorer le catalogue', 'btn btn--text'))));
}

/* ---------- Catalogue ---------- */

const matches = (p, f) => {
  if (f.family && p.family !== f.family) return false;
  if (f.group && p.group !== f.group) return false;
  if (f.supplier && p.supplier !== f.supplier) return false;
  const q = norm(f.q).trim();
  return !q || norm(p.title).includes(q) || norm(p.ref).includes(q);
};

export function catalogue({ query }) {
  const f = state.catalog;
  if ('rubrique' in query || 'sous' in query || 'fournisseur' in query || 'q' in query) {
    Object.assign(f, { family: query.rubrique || '', group: query.sous || '', supplier: query.fournisseur || '', q: query.q || '' });
  }
  const live = S.publicProducts();
  const count = h('p', { class: 'count', role: 'status', 'aria-live': 'polite' });
  const grid = h('div', { class: 'catalog__results' });
  const q = field({ label: 'Rechercher un nom ou une référence', name: 'q', type: 'search', value: f.q, placeholder: 'Ex. niveau, DEMO-DEB-200' });
  const rub = field({ label: 'Rubrique', name: 'family', type: 'select', value: f.family, options: options(state.families.map((x) => [x.id, x.title]), 'Toutes les rubriques') });
  const sub = field({ label: 'Sous-famille', name: 'group', type: 'select', value: f.group, options: [] });
  const sup = field({ label: 'Fournisseur', name: 'supplier', type: 'select', value: f.supplier, options: options(S.publicSuppliers().map((x) => [x.id, x.name]), 'Tous les fournisseurs') });
  const reset = h('button', { class: 'btn btn--quiet btn--sm', type: 'button', text: 'Réinitialiser les filtres' });
  const advice = link('/demande', CATALOGUE_GUIDE.advice, 'btn btn--quiet btn--sm');

  const fillGroups = () => {
    const sel = $('select', sub);
    const list = fam(f.family)?.groups ?? [];
    sel.replaceChildren(...options(list.map((g) => [g.id, g.title]), f.family ? 'Toutes les sous-familles' : 'Choisissez d’abord une rubrique').map((o) => h('option', { value: o.value, text: o.label })));
    sel.disabled = !f.family;
    sel.value = list.some((g) => g.id === f.group) ? f.group : '';
    f.group = sel.value;
  };
  const draw = () => {
    advice.setAttribute('href', href('/demande', f.q ? { besoin: f.q } : null));
    const res = live.filter((p) => matches(p, f));
    const active = f.q || f.family || f.group || f.supplier;
    count.textContent = `${plural(res.length, 'fiche affichée', 'fiches affichées')} sur ${live.length}`;
    reset.hidden = !active;
    grid.replaceChildren(...(res.length ? [h('div', { class: 'pgrid' }, res.map(productCard))] : [emptyState('Aucune fiche ne correspond',
      'Essayez un mot plus simple (niveau, vanne, pH), retirez un filtre, ou décrivez votre besoin tel quel : il n’est pas nécessaire de connaître la référence.',
      [h('button', { class: 'btn btn--quiet', type: 'button', text: 'Réinitialiser les filtres', onclick: () => doReset() }), link('/demande', 'Décrire mon besoin', 'btn btn--primary', f.q ? { besoin: f.q } : null)])]));
  };
  const doReset = () => {
    Object.assign(f, { q: '', family: '', group: '', supplier: '' });
    $('input', q).value = ''; $('select', rub).value = ''; $('select', sup).value = '';
    fillGroups(); draw();
  };
  $('input', q).addEventListener('input', (e) => { f.q = e.target.value; draw(); });
  $('select', rub).addEventListener('change', (e) => { f.family = e.target.value; f.group = ''; fillGroups(); draw(); });
  $('select', sub).addEventListener('change', (e) => { f.group = e.target.value; draw(); });
  $('select', sup).addEventListener('change', (e) => { f.supplier = e.target.value; draw(); });
  reset.addEventListener('click', doReset);
  fillGroups(); draw();

  return { title: S.pageText('catalogue', 'title'), node: h('div', {},
    pageHead({ kicker: 'Catalogue de démonstration', title: S.pageText('catalogue', 'title'), intro: S.pageText('catalogue', 'intro'), trail: [['Accueil', '/'], ['Catalogue', '/catalogue']] }),
    h('div', { class: 'wrap' }, h('aside', { class: 'catalog-guide', 'aria-label': 'Choisir votre parcours' },
      h('p', {}, h('strong', { text: CATALOGUE_GUIDE.title }), h('span', { text: CATALOGUE_GUIDE.text })),
      advice)),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap catalog' },
      h('form', { class: 'filters', role: 'search', 'aria-label': 'Filtres du catalogue', onsubmit: (e) => e.preventDefault() }, q, rub, sub, sup, reset),
      h('div', {}, count, grid))),
    contactBand()) };
}

/* ---------- Rubrique ---------- */

export function rubrique({ params, query }) {
  const f = fam(params.id);
  if (!f) return notFound();
  const idx = state.families.indexOf(f);
  let sel = f.groups.some((g) => g.id === query.sous) ? query.sous : '';
  const list = h('div', {});
  const subs = h('div', { class: 'subs', role: 'group', 'aria-label': 'Sous-familles' });
  const draw = () => {
    subs.replaceChildren(...[{ id: '', title: 'Toutes' }, ...f.groups].map((g) => h('button', { type: 'button', class: 'chip', 'aria-pressed': String(sel === g.id), text: g.title, onclick: () => { sel = g.id; draw(); } })));
    const items = S.productsOf(f.id, sel);
    const g = S.group(f, sel);
    list.replaceChildren(...[
      g ? h('p', { class: 'lede', text: g.text }) : null,
      items.length ? h('ul', { class: 'rlist' }, items.map((p) => h('li', {}, h('a', { class: 'rrow', href: href(`/produit/${p.id}`) },
        h('span', { class: 'rrow__v' }, atlas(p.cell, `Illustration : ${ATLAS[p.cell]} (produit fictif)`)),
        h('span', { class: 'rrow__t' }, h('strong', { text: p.title }), h('span', { text: p.summary }), h('span', { class: 'meta', text: `${p.ref} · ${S.supplierName(p.supplier)}` })),
        h('span', { class: 'rrow__go', 'aria-hidden': 'true', text: 'Voir la fiche →' }))))) :
        emptyState('Pas encore de fiche de démonstration ici', 'Cette sous-famille existe, mais aucune fiche d’exemple n’est publiée. Décrivez votre besoin : il n’a pas besoin d’être technique.', link('/demande', 'Décrire mon besoin', 'btn btn--primary', { rubrique: f.id }))].filter(Boolean));
  };
  draw();
  const prev = state.families[(idx + state.families.length - 1) % state.families.length];
  const next = state.families[(idx + 1) % state.families.length];
  return { title: f.title, node: h('div', {},
    pageHead({ kicker: `Rubrique ${String(idx + 1).padStart(2, '0')} sur 07`, title: f.title, intro: f.description, trail: [['Accueil', '/'], ['Catalogue', '/catalogue'], [f.title]], tone: 'phead--family',
      side: h('div', { class: 'stage stage--head' }, atlas(f.cell, `Illustration de la rubrique ${f.title} (produit fictif)`)) }),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap' }, subs, list,
      h('div', { class: 'actions' }, link('/demande', 'Décrire un besoin dans cette rubrique', 'btn btn--primary', { rubrique: f.id }), link('/catalogue', 'Filtrer dans le catalogue', 'btn btn--quiet', { rubrique: f.id })))),
    h('section', { class: 'section section--pale section--tight' }, h('nav', { class: 'wrap pager', 'aria-label': 'Autres rubriques' },
      link(`/rubrique/${prev.id}`, `← ${prev.title}`), link(`/rubrique/${next.id}`, `${next.title} →`)))) };
}

/* ---------- Fiche produit ---------- */

export function produit({ params }) {
  const p = S.product(params.id);
  if (!p || !S.isLive(p)) return unavailable('Cette fiche n’est pas disponible', 'Elle n’existe pas ou n’est pas publiée. Revenez au catalogue pour voir les fiches disponibles.', '/catalogue', 'Retour au catalogue');
  const f = fam(p.family);
  const related = S.productsOf(p.family).filter((x) => x.id !== p.id).concat(S.publicProducts().filter((x) => x.family !== p.family && x.supplier === p.supplier)).slice(0, 3);
  const pdf = p.document && S.feature('showPdf') ? h('a', { class: 'btn btn--quiet', href: BASE_ASSETS.pdf, download: '', text: 'Télécharger la fiche de démonstration (PDF)' }) : null;
  const dl = (rows) => h('dl', { class: 'facts' }, rows.map(([k, v]) => h('div', {}, h('dt', { text: k }), h('dd', { text: v }))));
  return { title: p.title, node: h('div', {},
    h('div', { class: 'wrap product-top' }, crumbs([['Accueil', '/'], ['Catalogue', '/catalogue'], [f.title, `/rubrique/${f.id}`], [p.title]])),
    h('section', { class: 'wrap product' },
      h('div', { class: 'stage stage--product' }, atlas(p.cell, `Illustration : ${ATLAS[p.cell]} (produit fictif)`), h('span', { class: 'stage__tag', text: 'Visuel d’illustration' })),
      h('div', { class: 'product__copy' },
        h('p', { class: 'kicker', text: S.productPath(p) }),
        h('h1', { text: p.title, tabindex: '-1' }),
        h('p', { class: 'meta' }, h('span', { text: `${p.models.length ? 'Réf. de gamme' : 'Réf.'} ${p.ref}` }), ' · ', link(`/fournisseur/${p.supplier}`, S.supplierName(p.supplier))),
        h('p', { class: 'lede', text: p.summary }),
        p.models.length ? h('p', { class: 'product__type', text: 'Plusieurs modèles dans cette gamme. Le choix se précise selon votre installation.' }) : null,
        h('div', { class: 'actions' }, link('/demande', SITE.productCta, 'btn btn--primary btn--lg', { produit: p.id }), pdf),
        h('p', { class: 'fineprint product__hint', text: SITE.productHint }))),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap pdetail' },
      h('div', {}, h('h2', { text: 'À quoi il sert' }), h('p', { text: p.usage }), h('h2', { text: 'Description' }), h('p', { text: p.description }),
        p.applications.length ? [h('h2', { text: 'Applications' }), h('ul', { class: 'plain' }, p.applications.map((a) => h('li', { text: a })))] : null),
      h('div', {}, h('h2', { text: 'Caractéristiques' }), dl(p.specs), specNote()))),
    p.models.length ? h('section', { class: 'section section--pale section--tight' }, h('div', { class: 'wrap' }, h('h2', { text: 'Les modèles de la gamme' }),
      h('p', { class: 'fineprint', text: 'Pour comprendre la gamme. Le choix du modèle se précise avec vous : aucune variante n’est à configurer.' }),
      h('ul', { class: 'models' }, p.models.map(([n, t]) => h('li', {}, h('strong', { text: n }), h('span', { text: t })))))) : null,
    related.length ? h('section', { class: 'section section--tight' }, h('div', { class: 'wrap' }, h('h2', { text: 'Produits proches' }), h('div', { class: 'pgrid' }, related.map(productCard)))) : null,
    ctaBand('Une question sur cette fiche ?', 'Décrivez votre application : la demande reprend automatiquement cette fiche.', ['/demande', SITE.productCta, { produit: p.id }])) };
}

/* ---------- Dropout ---------- */

export function dropout() {
  const prods = S.publicProducts().filter((p) => p.family === 'traitement-air');
  const steps = [['L’eau arrive avec l’air', 'Condensats et gouttes circulent dans la ligne avec l’air de service.'], ['Le séparateur la retient', 'Le séparateur est conçu pour décanter les gouttes de l’air ; le principe exact dépend du modèle et se confirme avec le fournisseur.'], ['L’eau est évacuée', 'L’eau retenue est purgée, selon l’installation, pour ne pas retourner vers les instruments.']];
  return { title: S.pageText('dropout', 'title'), node: h('div', {},
    pageHead({ kicker: 'Traitement d’air', title: S.pageText('dropout', 'title'), intro: S.pageText('dropout', 'intro'), trail: [['Accueil', '/'], ['Dropout']], tone: 'phead--deep',
      side: h('div', { class: 'dropout__stage dropout__stage--head' }, flow(), h('div', { class: 'dropout__obj' }, atlas(6, 'Illustration : séparateur air (produit fictif)'))) }),
    h('section', { class: 'section' }, h('div', { class: 'wrap split' },
      h('div', { class: 'split__lead' }, h('h2', { text: 'Le problème : l’eau liquide' }), h('p', { class: 'lede', text: 'Un circuit d’air de service peut transporter de l’eau liquide. Elle perturbe des instruments et des actionneurs qui attendent un air propre.' })),
      h('ol', { class: 'steps' }, steps.map(([t, x], i) => h('li', {}, h('span', { class: 'mono', text: String(i + 1).padStart(2, '0') }), h('div', {}, h('h3', { text: t }), h('p', { text: x }))))))),
    h('section', { class: 'section section--deep' }, photo(BASE_ASSETS.photoBlue, 'deep__photo'), h('div', { class: 'wrap split' },
      h('div', { class: 'split__lead' }, h('h2', { text: 'Limites et accompagnement' })),
      h('ul', { class: 'limits' }, [
        ['Eau liquide, pas humidité dissoute', 'Un séparateur traite l’eau liquide. Si l’humidité de la vapeur d’eau est le sujet, une autre solution est à discuter.'],
        ['Aucun résultat garanti ici', 'Cette page n’annonce aucun taux de performance. Les caractéristiques se confirment sur la fiche du fournisseur.'],
        ['Dimensionnement et entretien', 'Ils dépendent du débit, de la pression et de l’installation. Nous les abordons avec vous avant toute décision.']].map(([t, x]) => h('li', {}, h('strong', { text: t }), h('span', { text: x })))))),
    h('section', { class: 'section' }, h('div', { class: 'wrap' }, sectionHead('Fiches d’exemple', 'Produits fictifs pour illustrer la présentation.'),
      prods.length ? h('div', { class: 'pgrid' }, prods.map(productCard)) : emptyState('Aucune fiche publiée', 'Aucune fiche de traitement d’air n’est publiée dans cette démonstration.', link('/demande', 'Décrire mon besoin', 'btn btn--primary', { rubrique: 'traitement-air' })))),
    ctaBand('De l’eau dans votre circuit d’air ?', 'Décrivez ce que vous observez. Il n’est pas nécessaire de connaître le produit.', ['/demande', 'Décrire mon besoin', { rubrique: 'traitement-air' }])) };
}

/* ---------- Fournisseurs ---------- */

export function fournisseurs() {
  if (!S.feature('showSuppliers')) return unavailable('Page désactivée', 'La présentation des fournisseurs est désactivée dans les réglages de la démonstration.', '/', 'Retour à l’accueil');
  const list = S.publicSuppliers();
  return { title: S.pageText('fournisseurs', 'title'), node: h('div', {},
    pageHead({ kicker: 'Exemples fictifs', title: S.pageText('fournisseurs', 'title'), intro: S.pageText('fournisseurs', 'intro'), trail: [['Accueil', '/'], ['Fournisseurs']] }),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap' },
      list.length ? h('ul', { class: 'rlist' }, list.map((s) => h('li', {}, h('a', { class: 'srow', href: href(`/fournisseur/${s.id}`) },
        h('span', { class: 'srow__t' }, h('strong', { text: s.name }), h('span', { text: s.specialty })),
        h('span', { class: 'srow__n', text: plural(S.publicProducts().filter((p) => p.supplier === s.id).length, 'fiche', 'fiches') }),
        h('span', { class: 'rrow__go', 'aria-hidden': 'true', text: 'Voir →' }))))) : emptyState('Aucun fournisseur publié', 'Rien à afficher pour le moment.'))),
    contactBand()) };
}

export function fournisseur({ params }) {
  const s = S.supplier(params.id);
  if (!s || !s.published) return unavailable('Fournisseur introuvable', 'Ce fournisseur n’existe pas ou n’est pas publié.', '/fournisseurs', 'Voir les fournisseurs');
  const prods = S.publicProducts().filter((p) => p.supplier === s.id);
  return { title: s.name, node: h('div', {},
    pageHead({ kicker: 'Fournisseur d’exemple (fictif)', title: s.name, intro: s.text, trail: [['Accueil', '/'], ['Fournisseurs', '/fournisseurs'], [s.name]] }),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap' }, h('h2', { text: `Fiches de ${s.name}` }),
      prods.length ? h('div', { class: 'pgrid' }, prods.map(productCard)) : emptyState('Aucune fiche publiée', 'Ce fournisseur n’a pas de fiche publiée dans la démonstration.', link('/catalogue', 'Voir le catalogue', 'btn btn--quiet')))),
    contactBand()) };
}

/* ---------- Entreprise, FAQ, pages éditoriales ---------- */

export function entreprise() {
  const doms = state.families;
  return { title: S.pageText('entreprise', 'title'), node: h('div', {},
    pageHead({ kicker: 'Entreprise', title: S.pageText('entreprise', 'title'), intro: S.pageText('entreprise', 'intro'), trail: [['Accueil', '/'], ['Entreprise']],
      side: h('div', { class: 'company__visual company__visual--head' }, photo(BASE_ASSETS.photoPipes, 'cover'), h('div', { class: 'company__obj' }, atlas(1, `Illustration : ${ATLAS[1]} (produit fictif)`))) }),
    h('section', { class: 'section' }, h('div', { class: 'wrap split' }, h('div', { class: 'split__lead' }, h('h2', { text: 'Notre rôle' })),
      h('ul', { class: 'roles roles--big' }, COMPANY.roles.map((r) => h('li', {}, h('strong', { text: r.title }), h('span', { text: r.text })))))),
    h('section', { class: 'section section--pale' }, h('div', { class: 'wrap split' }, h('div', { class: 'split__lead' }, h('h2', { text: 'Méthode de travail' })),
      h('ol', { class: 'steps' }, COMPANY.method.map((m, i) => h('li', {}, h('span', { class: 'mono', text: String(i + 1).padStart(2, '0') }), h('div', {}, h('h3', { text: m.title }), h('p', { text: m.text }))))))),
    h('section', { class: 'section' }, h('div', { class: 'wrap' }, sectionHead('Sept domaines', 'Les familles que Maturat Mesure peut vous aider à explorer.'),
      h('ul', { class: 'chips' }, doms.map((f) => h('li', {}, link(`/rubrique/${f.id}`, f.title, 'chip chip--link')))))),
    ctaBand('Parlons de votre application', COMPANY.requestHint)) };
}

export function faq() {
  const items = state.faq.filter((f) => f.published);
  const groups = [...new Set(items.map((f) => f.group))];
  return { title: S.pageText('faq', 'title'), node: h('div', {},
    pageHead({ kicker: 'Questions', title: S.pageText('faq', 'title'), intro: S.pageText('faq', 'intro'), trail: [['Accueil', '/'], ['Questions']] }),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap faq-layout' },
      h('div', {}, groups.length ? groups.map((g) => h('section', { class: 'faq-group' }, h('h2', { text: g }), h('div', { class: 'faq' }, items.filter((f) => f.group === g).map(faqItem)))) : emptyState('Aucune question publiée', 'Rien à afficher pour le moment.')),
      h('aside', { class: 'aside-links' }, h('h2', { text: 'Liens utiles' }), h('ul', {}, [['/catalogue', 'Explorer le catalogue'], ['/dropout', 'Comprendre Dropout'], ['/entreprise', 'Notre façon de travailler'], ['/demande', 'Décrire mon besoin']].map(([r, t]) => h('li', {}, link(r, t))))))),
    ctaBand('Votre question n’est pas là ?', 'Posez-la dans la demande : un conseiller vous répondra.')) };
}

export function comingSoon(id, kicker, text) {
  return { title: S.pageText(id, 'title'), node: h('div', {},
    pageHead({ kicker, title: S.pageText(id, 'title'), intro: S.pageText(id, 'intro'), trail: [['Accueil', '/'], [S.pageText(id, 'title')]] }),
    h('section', { class: 'section' }, h('div', { class: 'wrap soon' }, h('p', { class: 'tag', text: 'Bientôt' }), h('p', { class: 'lede', text }),
      h('div', { class: 'actions' }, link('/', 'Retour à l’accueil', 'btn btn--quiet'), link('/catalogue', 'Explorer le catalogue', 'btn btn--primary'))))) };
}

export function legal(id) {
  const blocks = LEGAL[id] ?? [];
  const extra = id === 'credits' ? creditsExtra() : null;
  return { title: S.pageText(id, 'title'), node: h('div', {},
    pageHead({ kicker: 'Information', title: S.pageText(id, 'title'), intro: S.pageText(id, 'intro'), trail: [['Accueil', '/'], [S.pageText(id, 'title')]] }),
    h('section', { class: 'section section--tight' }, h('div', { class: 'wrap prose' },
      h('p', { class: 'tag', text: 'Texte de démonstration à remplacer' }),
      blocks.map(([t, x]) => h('section', {}, h('h2', { text: t }), h('p', { text: x }))), extra,
      h('div', { class: 'actions' }, link('/', 'Retour à l’accueil', 'btn btn--quiet'))))) };
}

function creditsExtra() {
  const pre = h('pre', { class: 'credits-pre', hidden: true });
  // Lecture d'un fichier statique local : aucun service distant.
  fetch(CREDITS_MEDIA_FILE).then((r) => (r.ok ? r.text() : Promise.reject())).then((t) => { pre.textContent = t; pre.hidden = false; }).catch(() => {});
  return h('section', {}, h('h2', { text: 'Photographies' }),
    h('p', {}, 'Les photographies industrielles sont des images libres de droits d’Unsplash. Crédits exacts : ', h('a', { href: CREDITS_MEDIA_FILE, text: 'fichier CREDITS-MEDIA.md' }), '.'),
    pre,
    h('p', {}, 'Une fiche PDF d’exemple est disponible depuis les fiches qui en disposent : ', h('a', { href: BASE_ASSETS.pdf, text: 'ouvrir la fiche de démonstration' }), '. ', PRODUCT_NOTE));
}

/* ---------- Cas d'arrêt ---------- */

export function unavailable(title, text, to, label) {
  return { title, node: h('div', { class: 'wrap section' }, h('h1', { text: title, tabindex: '-1' }), h('p', { class: 'lede', text }), h('div', { class: 'actions' }, link(to, label, 'btn btn--primary'), link('/', 'Retour à l’accueil', 'btn btn--quiet'))) };
}

export const notFound = () => unavailable('Page introuvable', 'Cette adresse ne correspond à aucune page de la maquette. Choisissez une sortie ci-dessous.', '/catalogue', 'Explorer le catalogue');
