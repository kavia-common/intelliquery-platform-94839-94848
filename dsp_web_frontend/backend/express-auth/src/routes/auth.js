import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsername, createUser } from '../db.js';
import { validateCredentials } from '../middleware/validate.js';

const router = express.Router();

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('Warning: JWT_SECRET is not set. Using a weak default. Do not use in production.');
  }
  return secret || 'dev-insecure-secret';
}

function signToken(username) {
  // 24h expiry
  const payload = { sub: username };
  const options = { expiresIn: '24h' };
  return jwt.sign(payload, getJwtSecret(), options);
}

// PUBLIC_INTERFACE
router.post('/signup', validateCredentials, async (req, res) => {
  /** Signup endpoint.
   * Body: { username, password }
   * Rules:
   *  - 409 if username exists
   *  - bcrypt hash password
   *  - store in SQLite
   *  - issue JWT with { sub: username }, exp 24h
   * Response: { token, user: { username } }
   */
  try {
    const { username, password } = req.body;
    const existing = await findUserByUsername(username.trim());
    if (existing) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    await createUser(username.trim(), hash);
    const token = signToken(username.trim());
    return res.status(201).json({ token, user: { username: username.trim() } });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUBLIC_INTERFACE
router.post('/login', validateCredentials, async (req, res) => {
  /** Login endpoint.
   * Body: { username, password }
   * Rules:
   *  - 400 for invalid input (handled by middleware)
   *  - 401 if user not found or password mismatch
   *  - issue JWT with { sub: username }, exp 24h
   * Response: { token, user: { username } }
   */
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username.trim());
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const token = signToken(user.username);
    return res.status(200).json({ token, user: { username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
