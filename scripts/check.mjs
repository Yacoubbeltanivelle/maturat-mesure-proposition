// Vérification statique sans dépendance : node scripts/check.mjs [--strict]
// Syntaxe, imports, ressources locales, cohérence des données, routes et interdits de la maquette.
// Sans --strict, les ressources fournies à part (atlas, photos, PDF, crédits) ne produisent qu'un avertissement.
import { readFileSync, existsSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const read = (f) => readFileSync(join(root, f), 'utf8');

const jsFiles = ['app.js', 'data.js', ...readdirSync(join(root, 'js')).filter((f) => f.endsWith('.js')).map((f) => `js/${f}`)];
const cssFiles = ['styles.css', 'admin.css'];
const allText = Object.fromEntries([...jsFiles, ...cssFiles, 'index.html'].map((f) => [f, read(f)]));

// 1. Syntaxe : copie en .mjs pour ne pas dépendre de la détection de module de la version de Node.
const tmp = mkdtempSync(join(tmpdir(), 'maturat-check-'));
for (const f of jsFiles) {
  const p = join(tmp, f.replace(/[\\/]/g, '_') + '.mjs');
  writeFileSync(p, allText[f]);
  const r = spawnSync(process.execPath, ['--check', p], { encoding: 'utf8' });
  if (r.status !== 0) err(`Syntaxe : ${f}\n${r.stderr}`);
}
rmSync(tmp, { recursive: true, force: true });

// 2. Imports relatifs
for (const f of jsFiles) {
  for (const m of allText[f].matchAll(/from\s+'(\.[^']+)'/g)) {
    if (!existsSync(resolve(root, dirname(f), m[1]))) err(`Import introuvable : ${f} → ${m[1]}`);
  }
}

// 3. Ressources locales référencées (HTML, CSS, JS) : relatives, jamais distantes.
const pending = new Set(['assets/product-atlas.png', 'assets/photos/industrial-pipes.jpg', 'assets/photos/industrial-blue.jpg', 'assets/documents/fiche-demonstration.pdf', 'assets/CREDITS-MEDIA.md']);
const refs = new Set();
for (const [f, t] of Object.entries(allText)) {
  for (const m of t.matchAll(/(?:src|href|url\()\s*=?\s*["']?(assets\/[^"')\s]+)/g)) refs.add(m[1]);
  for (const m of t.matchAll(/'(assets\/[^']+\.[a-z0-9]+)'/g)) refs.add(m[1]);
  if (/(?:src|href)=["']https?:\/\//.test(t) || /url\(["']?https?:/.test(t)) err(`Ressource distante dans ${f}`);
  if (/(?:src|href)=["']\//.test(t)) err(`Chemin absolu dans ${f} (la base Pages impose des chemins relatifs)`);
}
for (const r of refs) {
  if (existsSync(join(root, r))) continue;
  if (pending.has(r) && !strict) warns.push(`Ressource à fournir : ${r}`);
  else err(`Ressource manquante : ${r}`);
}

// 4. Données
const dataUrl = `data:text/javascript;base64,${Buffer.from(allText['data.js']).toString('base64')}`;
const D = await import(dataUrl);
const ids = (arr) => new Set(arr.map((x) => x.id));
const famIds = ids(D.FAMILIES);
const supIds = ids(D.SUPPLIERS);
if (D.FAMILIES.length !== 7) err(`7 rubriques attendues, ${D.FAMILIES.length} trouvées`);
if (D.PRODUCTS.length !== 10) err(`10 fiches attendues, ${D.PRODUCTS.length} trouvées`);
if (ids(D.PRODUCTS).size !== D.PRODUCTS.length) err('Identifiants de fiches en double');
if (D.ATLAS.length !== 12) err('L’atlas doit compter 12 libellés (4 colonnes x 3 lignes)');
for (const p of D.PRODUCTS) {
  const fam = D.FAMILIES.find((f) => f.id === p.family);
  if (!fam) { err(`Fiche ${p.id} : rubrique inconnue`); continue; }
  if (!fam.groups.some((g) => g.id === p.group)) err(`Fiche ${p.id} : sous-famille inconnue`);
  if (!supIds.has(p.supplier)) err(`Fiche ${p.id} : fournisseur inconnu`);
  if (!Number.isInteger(p.cell) || p.cell < 0 || p.cell > 11) err(`Fiche ${p.id} : cellule d'atlas hors 0-11`);
}
for (const f of D.FAMILIES) {
  if (!D.PRODUCTS.some((p) => p.family === f.id)) err(`Rubrique sans fiche : ${f.id}`);
  if (f.cell < 0 || f.cell > 11) err(`Rubrique ${f.id} : cellule d'atlas hors 0-11`);
}
if (D.PRODUCTS.filter((p) => p.featured).length !== 2) err('Deux fiches à la une attendues');
if (D.PRODUCTS.filter((p) => p.models.length).length < 2) err('Deux fiches de gamme attendues');
if (D.PRODUCTS.some((p) => p.status !== 'publie')) warns.push('Certaines fiches initiales ne sont pas publiées');
const mailRx = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
for (const m of JSON.stringify(D).matchAll(mailRx)) if (!m[0].endsWith('example.test')) err(`Adresse e-mail réelle possible : ${m[0]}`);
if (!/^(00 ){4}00$/.test(D.SETTINGS.contact.phone)) err('Téléphone : 00 00 00 00 00 attendu');

// 5. Routes : liens statiques vers des routes enregistrées
const patterns = [...allText['app.js'].matchAll(/route\('([^']+)'/g)].map((m) => m[1]);
for (const id of ['mentions-legales', 'confidentialite', 'credits']) patterns.push(`/${id}`);
const known = (path) => patterns.some((p) => new RegExp(`^${p.replace(/:[a-z]+/g, '[^/]+')}$`).test(path));
for (const f of jsFiles.filter((x) => x.startsWith('js/'))) {
  for (const m of allText[f].matchAll(/(?:link|href)\(\s*(A\()?'(\/[^'?${}]*)'/g)) {
    const path = m[1] ? `/admin${m[2]}` : m[2];
    if (!known(path === '/admin/' ? '/admin' : path)) err(`Route inconnue : ${path} (${f})`);
  }
}

// 6. Interdits
const jsOnly = jsFiles.filter((f) => f.startsWith('js/') || f === 'app.js');
for (const f of jsOnly) {
  const t = allText[f];
  if (/localStorage|sessionStorage|indexedDB|document\.cookie|innerHTML|XMLHttpRequest|sendBeacon/.test(t)) err(`API interdite dans ${f}`);
  if (/fetch\(/.test(t) && f !== 'js/pages.js') err(`fetch( inattendu dans ${f}`);
  if (/href:\s*['"]#['"]|href="#"/.test(t)) err(`Lien inerte href="#" dans ${f}`);
}
if (/fetch\(/.test(allText['js/pages.js']) && !/fetch\(CREDITS_MEDIA_FILE\)/.test(allText['js/pages.js'])) err('fetch( autorisé uniquement pour le fichier de crédits local');
for (const f of ['js/pages.js', 'js/layout.js', 'js/request.js']) if (/notifyEmail|INTERNAL|state\.internal/.test(allText[f])) err(`Donnée interne référencée côté public : ${f}`);
for (const f of cssFiles) if (/font-style:\s*italic/.test(allText[f])) err(`Italique dans ${f}`);
const all = Object.values(allText).join('\n');
if (/home-(?:level|flow|temperature|pressure)-|dropout-cutout/.test(all)) err('Image fournisseur ancienne encore référencée');
if (!/data-pack="E"/.test(allText['index.html'])) err('body data-pack="E" manquant');
if (!/noindex, nofollow/.test(allText['index.html'])) err('Consigne noindex/nofollow manquante');

for (const w of warns) console.warn(`⚠ ${w}`);
if (errors.length) { for (const e of errors) console.error(`✗ ${e}`); console.error(`\n${errors.length} erreur(s).`); process.exit(1); }
console.log(`✓ Vérification statique réussie (${jsFiles.length} modules JS, ${refs.size} ressources, ${D.PRODUCTS.length} fiches, ${D.FAMILIES.length} rubriques).`);
