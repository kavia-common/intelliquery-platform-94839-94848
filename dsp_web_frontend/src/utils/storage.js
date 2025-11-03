const isBrowser = typeof window !== 'undefined';

// PUBLIC_INTERFACE
export function getItem(key) {
  /** Safe getItem from localStorage. */
  if (!isBrowser) return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}

// PUBLIC_INTERFACE
export function setItem(key, value) {
  /** Safe setItem for localStorage. */
  if (!isBrowser) return;
  try { window.localStorage.setItem(key, value); } catch {}
}

// PUBLIC_INTERFACE
export function removeItem(key) {
  /** Safe removeItem for localStorage. */
  if (!isBrowser) return;
  try { window.localStorage.removeItem(key); } catch {}
}
