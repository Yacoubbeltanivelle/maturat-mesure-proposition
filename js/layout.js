// Coque publique et composants partagés entre les vues du site.
import { SITE, BASE_ASSETS, ATLAS, PRODUCT_NOTE } from '../data.js';
import { h, link, href, atlas } from './dom.js';
import { state, feature, family, group, supplierName } from './state.js';

export const banner = (right) => h('div', { class: 'banner' }, h('p', {}, h('span', { text: SITE.banner }), ' ', right));

export function header(path) {
  const active = (r) => path === r || (r !== '/' && path.startsWith(`${r}/`)) || (r === '/catalogue' && (path.startsWith('/produit') || path.startsWith('/rubrique')));
  const items = SITE.nav.filter((n) => !n.feature || feature(n.feature));
  return h('header', { class: 'site-header' },
    banner(link('/admin', SITE.adminLink)),
    h('div', { class: 'bar' },
      h('a', { class: 'brand', href: href('/'), 'aria-label': 'Maturat Mesure, accueil' }, h('img', { src: BASE_ASSETS.logo, alt: 'Maturat Mesure', width: 1107, height: 324 })),
      h('nav', { class: 'nav', 'aria-label': 'Navigation principale' },
        h('ul', {}, items.map((n) => h('li', {}, h('a', { href: href(n.route), text: n.label, 'aria-current': active(n.route) ? 'page' : null })))),
        link('/demande', SITE.cta, 'btn btn--primary btn--sm'))));
}

export function footer(onReset) {
  const s = state.settings;
  const legal = [['/entreprise', 'Entreprise'], ['/faq', 'Questions fréquentes'],
    feature('showNews') && ['/actualites', 'Actualités'], feature('showRecruitment') && ['/recrutement', 'Recrutement'],
    ['/mentions-legales', 'Mentions légales'], ['/confidentialite', 'Confidentialité'], ['/credits', 'Crédits et limites']].filter(Boolean);
  const social = Object.entries(s.social).filter(([, v]) => v);
  return h('footer', { class: 'site-footer' },
    h('div', { class: 'wrap footer__grid' },
      h('div', { class: 'footer__about' },
        h('p', { class: 'footer__brand', text: s.company.legalName }),
        h('p', { text: s.company.footerText }),
        h('address', {}, h('span', { text: s.contact.address }), h('span', { text: s.contact.email }), h('span', { text: s.contact.phone }), h('span', { text: s.contact.hours })),
        social.length ? h('p', { class: 'footer__social' }, social.map(([k, v]) => h('a', { href: v, rel: 'noopener', target: '_blank', text: k[0].toUpperCase() + k.slice(1) }))) : null),
      h('nav', { 'aria-label': 'Rubriques' }, h('p', { class: 'footer__title', text: 'Rubriques' }),
        h('ul', {}, state.families.map((f) => h('li', {}, link(`/rubrique/${f.id}`, f.title))))),
      h('nav', { 'aria-label': 'Informations' }, h('p', { class: 'footer__title', text: 'Informations' }),
        h('ul', {}, [['/catalogue', 'Catalogue'], ['/dropout', 'Dropout'], ...legal].map(([r, t]) => h('li', {}, link(r, t))),
          h('li', {}, link('/admin', SITE.adminLink))))),
    h('div', { class: 'wrap footer__bottom' },
      h('p', { text: s.company.footerNote }),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', text: 'Réinitialiser la démonstration', onclick: onReset })));
}

export const crumbs = (list) => h('nav', { class: 'crumbs', 'aria-label': 'Fil d’Ariane' },
  h('ol', {}, list.map(([t, r], i) => h('li', {}, r && i < list.length - 1 ? link(r, t) : h('span', { text: t, 'aria-current': i === list.length - 1 ? 'page' : null })))));

export function pageHead({ kicker, title, intro, trail, side, tone = '' }) {
  return h('header', { class: `phead ${tone}`.trim() },
    h('div', { class: 'phead__grain', 'aria-hidden': 'true' }),
    h('div', { class: 'wrap phead__grid' },
      h('div', { class: 'phead__copy' },
        trail ? crumbs(trail) : null,
        kicker ? h('p', { class: 'kicker', text: kicker }) : null,
        h('h1', { text: title, tabindex: '-1' }),
        intro ? h('p', { class: 'lede', text: intro }) : null),
      side ? h('div', { class: 'phead__side' }, side) : null));
}

export const sectionHead = (title, intro, extra) => h('div', { class: 'section-head' }, h('h2', { text: title }), intro ? h('p', { text: intro }) : null, extra);

export function productCard(p) {
  return h('a', { class: 'pcard', href: href(`/produit/${p.id}`) },
    h('span', { class: 'pcard__stage' }, atlas(p.cell, `Illustration : ${ATLAS[p.cell]} (produit fictif)`)),
    h('span', { class: 'pcard__body' },
      h('span', { class: 'pcard__path', text: `${family(p.family)?.title} › ${group(family(p.family), p.group)?.title ?? ''}` }),
      h('span', { class: 'pcard__title', text: p.title }),
      h('span', { class: 'pcard__meta' }, h('span', { text: p.ref }), h('span', { text: supplierName(p.supplier) })),
      p.models.length ? h('span', { class: 'tag', text: `Gamme · ${p.models.length} modèles` }) : null));
}

export const emptyState = (title, text, actions) => h('div', { class: 'empty', role: 'status' }, h('h2', { text: title }), h('p', { text }), actions ? h('div', { class: 'actions' }, actions) : null);

export const specNote = () => h('p', { class: 'fineprint', text: PRODUCT_NOTE });

export function ctaBand(title, text, primary = ['/demande', SITE.cta], secondary) {
  return h('section', { class: 'cta-band' },
    h('div', { class: 'wrap cta-band__in' },
      h('div', {}, h('h2', { text: title }), h('p', { text })),
      h('div', { class: 'actions' }, link(primary[0], primary[1], 'btn btn--primary', primary[2]), secondary ? link(secondary[0], secondary[1], 'btn btn--text', secondary[2]) : null)));
}
