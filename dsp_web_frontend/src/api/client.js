const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
const USE_MOCK = String(process.env.REACT_APP_USE_MOCK_API || 'false').toLowerCase() === 'true';

// PUBLIC_INTERFACE
export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  /** Minimal fetch wrapper with JSON handling, auth header, env base URL, and mock support. */
  if (USE_MOCK) {
    return mockFetch(path, { method, body, headers, token });
  }

  const url = `${API_BASE}${path}`;
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || 'Request failed';
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
