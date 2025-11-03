import { apiFetch } from './client';

const LOGIN = process.env.REACT_APP_AUTH_LOGIN_ENDPOINT || '/auth/login';
const SIGNUP = process.env.REACT_APP_AUTH_SIGNUP_ENDPOINT || '/auth/signup';

// PUBLIC_INTERFACE
export async function loginRequest(username, password) {
  /** Calls login endpoint and returns token + user info. */
  return apiFetch(LOGIN, { method: 'POST', body: { username, password } });
}

// PUBLIC_INTERFACE
export async function signupRequest(username, password) {
  /** Calls signup endpoint and returns token + user info. */
  return apiFetch(SIGNUP, { method: 'POST', body: { username, password } });
}
