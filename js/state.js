// État de démonstration : uniquement en mémoire, dans cet onglet, partagé par le site et l'administration.
// Aucun stockage navigateur : le rechargement, le bouton Réinitialiser et le retour bfcache remettent tout à zéro.
import * as D from '../data.js';

const clone = (v) => structuredClone(v);

const seed = () => ({
  settings: clone(D.SETTINGS),
  internal: clone(D.INTERNAL),
  families: clone(D.FAMILIES),
  suppliers: clone(D.SUPPLIERS),
  products: clone(D.PRODUCTS),
  requests: clone(D.REQUESTS),
  faq: clone(D.FAQ),
  pages: clone(D.PAGES),
  draft: emptyDraft(),
  catalog: { q: '', family: '', group: '', supplier: '' },
  seq: 3,
});

export const emptyDraft = () => ({ step: 1, productId: '', rubrique: '', need: '', unknown: false, sector: '', fluid: '', context: '', name: '', email: '', phone: '', company: '' });

// Objet stable : la réinitialisation le vide et le remplit, les importeurs gardent la même référence.
export const state = seed();

export function resetState() {
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, seed());
}

/* ---------- Lecture ---------- */

export const family = (id) => state.families.find((f) => f.id === id);
export const group = (fam, gid) => fam?.groups.find((g) => g.id === gid);
export const supplier = (id) => state.suppliers.find((s) => s.id === id);
export const product = (id) => state.products.find((p) => p.id === id);
export const page = (id) => state.pages.find((p) => p.id === id);
export const request = (id) => state.requests.find((r) => r.id === id);
export const isLive = (p) => p.status === 'publie';
export const publicProducts = () => state.products.filter(isLive);
export const featured = () => publicProducts().filter((p) => p.featured);
export const publicSuppliers = () => state.suppliers.filter((s) => s.published);
export const feature = (key) => state.settings.features[key] !== false;
export const pageText = (id, key) => page(id)?.[key] ?? '';
export const pageLive = (id) => page(id)?.status !== 'brouillon';
export const productsOf = (famId, groupId) => publicProducts().filter((p) => p.family === famId && (!groupId || p.group === groupId));
export const supplierName = (id) => supplier(id)?.name ?? 'Fournisseur non renseigné';
export const productPath = (p) => `${family(p.family)?.title ?? ''} › ${group(family(p.family), p.group)?.title ?? ''}`;

/* ---------- Écriture ---------- */

export function nextProductId(title) {
  const base = title.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'fiche';
  let id = base;
  let n = 2;
  while (product(id)) id = `${base}-${n++}`;
  return id;
}

export function addRequest(draft) {
  const id = `DEM-DEMO-${String(++state.seq).padStart(3, '0')}`;
  const r = { id, date: new Date().toISOString().slice(0, 10), status: 'Nouvelle', note: '', ...draft };
  delete r.step;
  state.requests.unshift(r);
  Object.assign(state.draft, emptyDraft());
  return r;
}
