// Routage par hash : #/chemin?cle=valeur. Fonctionne sous n'importe quelle base (GitHub Pages inclus).

const routes = [];

export function route(pattern, handler) {
  const keys = [];
  const rx = new RegExp(`^${pattern.replace(/:([a-z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; })}$`);
  routes.push({ rx, keys, handler });
}

export function current() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  return { path: path.length > 1 ? path.replace(/\/$/, '') : path, query };
}

export function resolve() {
  const { path, query } = current();
  for (const r of routes) {
    const m = r.rx.exec(path);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { handler: r.handler, params, query, path };
    }
  }
  return { handler: null, params: {}, query, path };
}

export const go = (target) => { location.hash = target; };
