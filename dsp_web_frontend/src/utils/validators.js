const MIN_PASSWORD = 6;

// PUBLIC_INTERFACE
export function validateCredentials(username, password) {
  /** Returns a list of validation issues or empty array if valid. */
  const issues = [];
  if (!username || !username.trim()) issues.push('Username is required.');
  if (!password || password.length < MIN_PASSWORD) issues.push(`Password must be at least ${MIN_PASSWORD} characters.`);
  return issues;
}
