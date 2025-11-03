const API_BASE = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, '');
const USE_MOCK = String(process.env.REACT_APP_USE_MOCK_API || 'false').toLowerCase() === 'true';
const WITH_CREDENTIALS = String(process.env.REACT_APP_WITH_CREDENTIALS || 'false').toLowerCase() === 'true';

/**
 * Build a safe URL by allowing fully-qualified paths and avoiding double slashes.
 */
function buildUrl(path) {
  if (!path) return API_BASE || '';
  // If path is already absolute (http/https), pass-through
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path).startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

/**
 * Extract a meaningful error message from a variety of backend response shapes.
 */
function extractErrorMessage(status, statusText, data, rawText) {
  if (!data && rawText && rawText.trim()) return rawText;
  const candidates = [
    data?.message,
    data?.error,
    data?.detail,
  ];

  // handle common error envelopes { errors: {...} } or array
  if (Array.isArray(data?.errors) && data.errors.length) {
    candidates.push(
      typeof data.errors[0] === 'string'
        ? data.errors[0]
        : (data.errors[0]?.message || JSON.stringify(data.errors[0]))
    );
  } else if (data?.errors && typeof data.errors === 'object') {
    // pick first field error
    const firstKey = Object.keys(data.errors)[0];
    const val = data.errors[firstKey];
    if (Array.isArray(val) && val.length) {
      candidates.push(val[0]);
    } else if (typeof val === 'string') {
      candidates.push(val);
    } else {
      candidates.push(JSON.stringify(val));
    }
  }

  const msg = candidates.find(Boolean) || statusText || 'Request failed';
  return `(${status}) ${msg}`;
}

// PUBLIC_INTERFACE
export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  /** Minimal fetch wrapper with JSON handling, auth header, env base URL, and mock support. */
  if (USE_MOCK) {
    return mockFetch(path, { method, body, headers, token });
  }

  const url = buildUrl(path);
  const init = {
    method,
    mode: 'cors',
    // Only include credentials if explicitly enabled via env; avoids accidental cookie leakage/CORS issues
    ...(WITH_CREDENTIALS ? { credentials: 'include' } : {}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  let res;
  try {
    res = await fetch(url, init);
  } catch (networkErr) {
    // Surface network/CORS errors clearly
    throw new Error(`Network error contacting ${url}: ${networkErr?.message || 'Unknown error'}`);
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* keep data as null and retain raw text */ }

  if (!res.ok) {
    const msg = extractErrorMessage(res.status, res.statusText, data, text);
    throw new Error(msg);
  }
  return data;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function mockFetch(path, { method = 'GET', body, token }) {
  // Simple in-memory mock emulation for auth and prompt
  await delay(300);
  const loginPath = process.env.REACT_APP_AUTH_LOGIN_ENDPOINT || '/auth/login';
  const signupPath = process.env.REACT_APP_AUTH_SIGNUP_ENDPOINT || '/auth/signup';
  const promptPath = process.env.REACT_APP_PROMPT_ENDPOINT || '/prompt';

  if (path === loginPath && method === 'POST') {
    return { token: 'mock-token', username: body?.username || 'user' };
  }
  if (path === signupPath && method === 'POST') {
    return { token: 'mock-token', username: body?.username || 'user' };
  }
  if (path === promptPath && method === 'POST') {
    if (!token) throw new Error('Unauthorized');
    const prompt = body?.prompt || '';
    return {
      results: [
        { title: 'Echo', content: `You said: ${prompt}` },
        { title: 'Analysis', content: 'This is a mock analysis result from the DSP system.' }
      ]
    };
  }
  return { ok: true };
}


