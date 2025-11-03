/**
 * Basic input validation middleware.
 */
const USER_MIN = 3;
const USER_MAX = 50;
// Backend requirement says min 8 for password
const PASS_MIN = 8;

// PUBLIC_INTERFACE
export function validateCredentials(req, res, next) {
  /** Validates req.body.username and req.body.password. Sends 400 with { message } on failure. */
  const { username, password } = req.body || {};
  const errors = [];

  if (!username || typeof username !== 'string') {
    errors.push('Username is required.');
  } else {
    const u = username.trim();
    if (u.length < USER_MIN) errors.push(`Username must be at least ${USER_MIN} characters.`);
    if (u.length > USER_MAX) errors.push(`Username must be at most ${USER_MAX} characters.`);
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  } else if (password.length < PASS_MIN) {
    errors.push(`Password must be at least ${PASS_MIN} characters.`);
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  }
  next();
}
