const API_BASE = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/*$/, '');
const HEALTH_ENDPOINT = process.env.REACT_APP_HEALTH_ENDPOINT || '/api/health';
const USE_MOCK = String(process.env.REACT_APP_USE_MOCK_API || 'false').toLowerCase() === 'true';
const WITH_CREDENTIALS = String(process.env.REACT_APP_WITH_CREDENTIALS || 'false').toLowerCase() === 'true';

/**
 * Safely build full URL from base + path, avoiding double slashes.
 */
function buildUrl(base, path) {
  if (!path) return base || '';
  if (/^https?:\/\//i.test(path)) return path;
  const cleanBase = String(base || '').replace(/\/+$/, '');
  const cleanPath = String(path).startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

function normalizeError(e) {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  if (e?.message) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

function timeoutPromise(ms, { signal } = {}) {
  let timer;
  const p = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timeout')), ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Request aborted'));
      }, { once: true });
    }
  });
  return { p, clear: () => clearTimeout(timer) };
}

// PUBLIC_INTERFACE
export async function checkHealth({ signal } = {}) {
  /** Performs a GET health check and returns a normalized shape:
   *  - Success 2xx: { ok: true, status, data }
   *  - Failure: { ok: false, status, error }
   * Honors:
   *  - REACT_APP_API_BASE_URL
   *  - REACT_APP_HEALTH_ENDPOINT (default /api/health)
   *  - REACT_APP_WITH_CREDENTIALS (include cookies on CORS requests)
   *  - REACT_APP_USE_MOCK_API (short-circuit to ok: true)
   */
  if (USE_MOCK) {
    return { ok: true, status: 200, data: { mock: true, status: 'ok' } };
  }

  const url = buildUrl(API_BASE, HEALTH_ENDPOINT);
  const controller = !signal ? new AbortController() : null;
  const finalSignal = signal || controller?.signal;

  const { p: to, clear } = timeoutPromise(5000, { signal: finalSignal });

  const init = {
    method: 'GET',
    mode: 'cors',
    ...(WITH_CREDENTIALS ? { credentials: 'include' } : {}),
    headers: {
      'Accept': 'application/json'
    },
    signal: finalSignal
  };

  try {
    const resPromise = fetch(url, init);
    const res = await Promise.race([resPromise, to]);
    clear();

    const status = res.status;
    let text = '';
    try { text = await res.text(); } catch {}
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }

    if (res.ok) {
      return { ok: true, status, data };
    }
    const statusText = res.statusText || '';
    const errMsg = text?.trim() ? text : statusText || 'Health check failed';
    return { ok: false, status, error: errMsg };
  } catch (e) {
    clear();
    return { ok: false, status: 0, error: normalizeError(e) };
  }
}
