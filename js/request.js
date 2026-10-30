// Parcours de demande guidé en 4 étapes. Les saisies restent dans state.draft (mémoire) ;
// la confirmation est simulée : rien n'est envoyé.
import { HOME } from '../data.js';
import { h, link, field, check, setError, options, $, $$ } from './dom.js';
import * as S from './state.js';
import { pageHead, emptyState } from './layout.js';

const { state } = S;
const STEPS = ['Besoin', 'Application', 'Coordonnées', 'Récapitulatif'];
const SECTORS = [['', 'Je ne sais pas'], ...HOME.applications.map((a) => [a.title, a.title])];
const FLUIDS = [['', 'Je ne sais pas'], ['Liquide', 'Liquide'], ['Gaz', 'Gaz'], ['Air comprimé', 'Air comprimé'], ['Solide', 'Solide ou poudre']];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function demande({ query }) {
  const d = state.draft;
  const p = S.product(query.produit);
  if (p && S.isLive(p)) { d.productId = p.id; d.rubrique = p.family; }
  if (query.rubrique && S.family(query.rubrique) && !query.produit) d.rubrique = query.rubrique;
  if (query.besoin && !d.need) d.need = query.besoin;

  const head = pageHead({ kicker: 'Demande', title: S.pageText('demande', 'title'), intro: S.pageText('demande', 'intro'), trail: [['Accueil', '/'], ['Décrire mon besoin']] });
  if (!S.feature('requestForm')) {
    return { title: 'Décrire mon besoin', node: h('div', {}, head, h('section', { class: 'section' }, h('div', { class: 'wrap' },
      emptyState('Le formulaire est désactivé', `Dans les réglages de démonstration, la demande en ligne est désactivée. Vous pouvez écrire à ${state.settings.contact.email} (adresse fictive).`, link('/', 'Retour à l’accueil', 'btn btn--quiet'))))) };
  }

  const box = h('div', { class: 'wizard' });
  const render = (focus = true) => {
    box.replaceChildren(stepper(d.step), [form1, form2, form3, recap][d.step - 1](render));
    if (focus) { const t = $('h2', box); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); box.scrollIntoView({ block: 'start' }); }
  };
  const confirm = (r) => {
    box.replaceChildren(h('div', { class: 'confirm', role: 'status' },
      h('p', { class: 'tag', text: 'Simulation' }),
      h('h2', { text: 'Demande simulée enregistrée', tabindex: '-1' }),
      h('p', { class: 'lede', text: `Identifiant fictif : ${r.id}.` }),
      h('p', { text: 'Rien n’a été envoyé ni conservé réellement. Cette demande existe seulement en mémoire, dans cet onglet, et apparaît dans l’administration de démonstration.' }),
      h('div', { class: 'actions' }, link(`/admin/demandes/${r.id}`, 'Voir cette demande dans l’administration', 'btn btn--primary'), link('/catalogue', 'Retour au catalogue', 'btn btn--quiet'),
        h('button', { class: 'btn btn--quiet', type: 'button', text: 'Faire une autre demande', onclick: () => render() }))));
    $('h2', box).focus();
  };

  const bind = (form) => $$('input, textarea, select', form).forEach((el) => {
    const set = () => { d[el.name] = el.type === 'checkbox' ? el.checked : el.value; };
    el.addEventListener('input', set); el.addEventListener('change', set);
  });
  const summary = (form, errs) => {
    let box2 = $('.error-summary', form);
    box2?.remove();
    if (!errs.length) return;
    box2 = h('div', { class: 'error-summary', role: 'alert' }, h('p', { text: 'Quelques points à corriger :' }), h('ul', {}, errs.map(([, m]) => h('li', { text: m }))));
    form.prepend(box2);
    $('input, textarea, select', errs[0][0])?.focus();
  };
  const nav = (form, rerender, { validate, next = 'Continuer', skip } = {}) => {
    const go = (n) => { d.step = n; rerender(); };
    const row = h('div', { class: 'actions wizard__nav' },
      d.step > 1 ? h('button', { class: 'btn btn--quiet', type: 'button', text: 'Retour', onclick: () => go(d.step - 1) }) : null,
      h('button', { class: 'btn btn--primary', type: 'submit', text: next }),
      skip ? h('button', { class: 'btn btn--ghost', type: 'button', text: 'Passer cette étape', onclick: () => go(d.step + 1) }) : null);
    form.append(row);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = validate ? validate() : [];
      summary(form, errs);
      if (!errs.length) go(d.step + 1);
    });
  };

  function form1(rerender) {
    const form = h('form', { novalidate: true, 'aria-labelledby': 'w-title' }, h('h2', { id: 'w-title', text: 'Votre besoin' }));
    const prod = S.product(d.productId);
    if (prod) form.append(h('div', { class: 'context-box' }, h('p', {}, h('strong', { text: 'Produit concerné : ' }), `${prod.title} (réf. ${prod.ref})`),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', text: 'Retirer ce produit', onclick: () => { d.productId = ''; rerender(false); } })));
    const rub = field({ label: 'Rubrique concernée', name: 'rubrique', type: 'select', value: d.rubrique, optional: true, options: options(state.families.map((f) => [f.id, f.title]), 'Je ne sais pas encore') });
    const need = field({ label: 'Votre besoin, avec vos mots', name: 'need', type: 'textarea', value: d.need, required: !d.productId, hint: 'Quelques mots suffisent. Aucune donnée technique n’est exigée.' });
    const unk = check({ label: 'Je ne sais pas encore, je préfère en parler avec un conseiller', name: 'unknown', checked: d.unknown });
    form.append(rub, need, unk);
    bind(form);
    const syncRequired = () => {
      const required = !d.productId && !d.unknown;
      $('textarea', need).setAttribute('aria-required', String(required));
      const marker = $('.req', need);
      if (marker) marker.hidden = !required;
      if (!required) { setError(need, ''); summary(form, []); }
    };
    $('input', unk).addEventListener('change', syncRequired);
    syncRequired();
    nav(form, rerender, { validate: () => {
      const bad = !d.productId && !d.unknown && d.need.trim().length < 3;
      setError(need, bad ? 'Décrivez votre besoin en quelques mots, ou cochez « Je ne sais pas encore ».' : '');
      return bad ? [[need, 'Décrivez votre besoin, ou cochez « Je ne sais pas encore ».']] : [];
    } });
    return form;
  }

  function form2(rerender) {
    const form = h('form', { novalidate: true, 'aria-labelledby': 'w-title' }, h('h2', { id: 'w-title', text: 'Votre application (facultatif)' }), h('p', { class: 'fineprint', text: 'Ces précisions aident à orienter la réponse. Vous pouvez passer cette étape.' }));
    form.append(
      field({ label: 'Contexte d’application', name: 'sector', type: 'select', value: d.sector, options: options(SECTORS.slice(1), 'Je ne sais pas') }),
      field({ label: 'Nature du fluide ou du produit', name: 'fluid', type: 'select', value: d.fluid, options: options(FLUIDS.slice(1), 'Je ne sais pas') }),
      field({ label: 'Autre précision utile', name: 'context', type: 'textarea', value: d.context, rows: 3, optional: true, hint: 'Montage, environnement, existant à remplacer… ce que vous savez.' }));
    bind(form);
    nav(form, rerender, { skip: true });
    return form;
  }

  function form3(rerender) {
    const form = h('form', { novalidate: true, 'aria-labelledby': 'w-title' }, h('h2', { id: 'w-title', text: 'Vos coordonnées' }), h('p', { class: 'fineprint', text: 'Sur le site final, ces coordonnées serviront à vous recontacter pour préciser votre besoin. Dans cette maquette, utilisez uniquement des données fictives : aucun message ne sera envoyé.' }));
    const name = field({ label: 'Nom', name: 'name', value: d.name, required: true, autocomplete: 'name' });
    const email = field({ label: 'Adresse e-mail', name: 'email', type: 'email', value: d.email, required: true, autocomplete: 'email' });
    form.append(name, email,
      field({ label: 'Téléphone', name: 'phone', type: 'tel', value: d.phone, optional: true, autocomplete: 'tel' }),
      field({ label: 'Entreprise', name: 'company', value: d.company, optional: true, autocomplete: 'organization' }));
    bind(form);
    nav(form, rerender, { validate: () => {
      const errs = [];
      const n = d.name.trim() ? '' : 'Indiquez votre nom.';
      const e = !d.email.trim() ? 'Indiquez votre adresse e-mail.' : (EMAIL.test(d.email.trim()) ? '' : 'Cette adresse e-mail ne semble pas valide (exemple : nom@example.test).');
      setError(name, n); setError(email, e);
      if (n) errs.push([name, n]);
      if (e) errs.push([email, e]);
      return errs;
    } });
    return form;
  }

  function recap(rerender) {
    const prod = S.product(d.productId);
    const rows = [
      ['Produit', prod ? `${prod.title} (réf. ${prod.ref})` : 'Aucun produit précis', 1],
      ['Rubrique', S.family(d.rubrique)?.title ?? 'Je ne sais pas encore', 1],
      ['Besoin', d.unknown && !d.need ? 'Je préfère en parler avec un conseiller' : (d.need || '—'), 1],
      ['Contexte', d.sector || 'Je ne sais pas', 2], ['Fluide', d.fluid || 'Je ne sais pas', 2], ['Précision', d.context || '—', 2],
      ['Nom', d.name, 3], ['E-mail', d.email, 3], ['Téléphone', d.phone || '—', 3], ['Entreprise', d.company || '—', 3]];
    const form = h('form', { novalidate: true, 'aria-labelledby': 'w-title' }, h('h2', { id: 'w-title', text: 'Récapitulatif' }),
      h('p', { class: 'fineprint', text: 'Vérifiez vos réponses. L’envoi est simulé : rien ne part réellement.' }),
      h('dl', { class: 'facts' }, rows.map(([k, v]) => h('div', {}, h('dt', { text: k }), h('dd', { class: 'pre', text: v })))),
      h('div', { class: 'actions' }, [[1, 'Modifier le besoin'], [2, 'Modifier l’application'], [3, 'Modifier les coordonnées']].map(([n, t]) => h('button', { class: 'btn btn--ghost btn--sm', type: 'button', text: t, onclick: () => { d.step = n; rerender(); } }))),
      h('div', { class: 'actions wizard__nav' }, h('button', { class: 'btn btn--quiet', type: 'button', text: 'Retour', onclick: () => { d.step = 3; rerender(); } }),
        h('button', { class: 'btn btn--primary btn--lg', type: 'submit', text: 'Envoyer la demande (simulation)' })));
    form.addEventListener('submit', (e) => { e.preventDefault(); confirm(S.addRequest({ ...d, unknown: d.unknown && !d.need })); });
    return form;
  }

  render(false);
  const c = state.settings.contact;
  return { title: S.pageText('demande', 'title'), node: h('div', {}, head, h('section', { class: 'section section--tight' }, h('div', { class: 'wrap request' },
    box,
    h('aside', { class: 'aside-links' }, h('h2', { text: 'Autres moyens' }), h('p', { text: 'Coordonnées d’exemple, fictives :' }), h('ul', {}, h('li', { text: c.email }), h('li', { text: c.phone }), h('li', { text: c.hours })),
      h('p', { class: 'fineprint', text: 'Vos saisies sont conservées si vous quittez le formulaire puis y revenez, tant que vous restez dans cet onglet.' }))))) };
}

function stepper(step) {
  return h('ol', { class: 'stepper', 'aria-label': 'Étapes de la demande' }, STEPS.map((t, i) => h('li', { 'aria-current': step === i + 1 ? 'step' : null, class: step > i + 1 ? 'is-done' : '' }, h('span', { class: 'mono', text: String(i + 1) }), h('span', { text: t }))));
}
