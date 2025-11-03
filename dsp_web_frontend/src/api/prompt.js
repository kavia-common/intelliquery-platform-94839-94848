import { apiFetch } from './client';
import { getItem } from '../utils/storage';

const PROMPT = process.env.REACT_APP_PROMPT_ENDPOINT || '/prompt';

// PUBLIC_INTERFACE
export async function submitPrompt(prompt) {
  /** Submits a prompt to the backend with auth header. */
  const token = getItem('auth_token');
  return apiFetch(PROMPT, { method: 'POST', body: { prompt }, token });
}
