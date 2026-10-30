// Point d'entrée : routes, rendu et réinitialisation. L'état reste en mémoire (aucun stockage navigateur).
import { SITE } from './data.js';
import { h, $, probeAtlas } from './js/dom.js';
import { route, resolve } from './js/router.js';
import * as S from './js/state.js';
import { header, footer } from './js/layout.js';
import * as P from './js/pages.js';
import { demande } from './js/request.js';
import * as A from './js/admin.js';

const root = $('#root');
const live = $('#live');

// Une page peut être mise en brouillon, ou sa fonction désactivée, depuis l'administration.
const gated = (id, fn, feat) => (ctx) => {
  if (!S.pageLive(id) || (feat && !S.feature(feat))) return P.unavailable('Page non disponible', 'Cette page est masquée dans les réglages de la démonstration.', '/', 'Retour à l’accueil');
  return fn(ctx);
};

route('/', gated('accueil', P.home));
route('/catalogue', gated('catalogue', P.catalogue));
route('/rubrique/:id', P.rubrique);
route('/produit/:id', P.produit);
route('/dropout', gated('dropout', P.dropout));
route('/fournisseurs', gated('fournisseurs', P.fournisseurs));
route('/fournisseur/:id', P.fournisseur);
route('/entreprise', gated('entreprise', P.entreprise));
route('/faq', gated('faq', P.faq));
route('/demande', gated('demande', demande));
route('/actualites', gated('actualites', () => P.comingSoon('actualites', 'Bientôt', 'Aucun article n’est publié. Cette rubrique accueillera les actualités de Maturat Mesure.'), 'showNews'));
route('/recrutement', gated('recrutement', () => P.comingSoon('recrutement', 'Bientôt', 'Aucune offre n’est publiée et aucune candidature ne peut être envoyée pour le moment.'), 'showRecruitment'));
for (const id of ['mentions-legales', 'confidentialite', 'credits']) route(`/${id}`, gated(id, () => P.legal(id)));

route('/admin', A.dashboard);
route('/admin/catalogue', A.catalogue);
route('/admin/catalogue/:id', A.productForm);
route('/admin/demandes', A.demandes);
route('/admin/demandes/:id', A.demandeDetail);
route('/admin/familles', A.familles);
route('/admin/familles/:id', A.familleForm);
route('/admin/fournisseurs', A.fournisseurs);
route('/admin/fournisseurs/:id', A.fournisseurForm);
route('/admin/pages', A.pages);
route('/admin/pages/:id', A.pageForm);
route('/admin/faq', A.faq);
route('/admin/faq/:id', A.faqForm);
route('/admin/medias', A.medias);
route('/admin/parametres', A.parametres);

function setMeta(name, attr, value) {
  const m = $(`meta[${attr}="${name}"]`);
  if (m) m.setAttribute('content', value);
}

function render(toTop) {
  const r = resolve();
  const isAdmin = r.path.startsWith('/admin');
  const view = r.handler ? r.handler(r) : P.notFound();
  const y = window.scrollY;
  document.body.classList.toggle('is-admin', isAdmin);
  const seo = S.state.settings.seo;
  document.title = isAdmin ? view.title : view.title ? `${view.title} · ${seo.title}` : seo.title;
  setMeta('description', 'name', seo.description);
  setMeta('og:title', 'property', seo.ogTitle);
  root.replaceChildren(...(isAdmin ? [A.shell(r.path, view, reset)] : [
    h('button', { class: 'skip', type: 'button', text: 'Aller au contenu', onclick: () => $('#main').focus() }),
    header(r.path), h('main', { id: 'main', tabindex: '-1' }, view.node), footer(reset)]));
  if (toTop) {
    window.scrollTo(0, 0);
    $('h1', root)?.focus({ preventScroll: true });
  } else window.scrollTo(0, y);
}

function reset() {
  S.resetState();
  render(false);
  live.textContent = '';
  setTimeout(() => { live.textContent = 'Démonstration réinitialisée : toutes les modifications et saisies ont été effacées.'; }, 50);
}

A.setRedraw(() => render(false));
window.addEventListener('hashchange', () => render(true));
// Retour depuis le cache avant/arrière : on repart d'un état neuf, comme au rechargement.
window.addEventListener('pageshow', (e) => { if (e.persisted) { S.resetState(); render(false); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('dialog[open]')?.close(); });

probeAtlas();
render(false);
