/**
 * SQLite database initialization and user helper functions.
 * Ensures the data directory and users table exist.
 */
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve database file path from env or default to backend/express-auth/data/app.db
const defaultDbPath = path.resolve(__dirname, '..', 'data', 'app.db');
const DB_FILE = process.env.DATABASE_URL
  ? path.isAbsolute(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : path.resolve(__dirname, '..', process.env.DATABASE_URL)
  : defaultDbPath;

// Ensure containing directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
sqlite3.verbose();
export const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('SQLite connected at', DB_FILE);
  }
});

// Initialize schema: users table
const initSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// Run initialization
db.serialize(() => {
  db.run(initSQL, (err) => {
    if (err) {
      console.error('Failed to create users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });
});

// PUBLIC_INTERFACE
export function findUserByUsername(username) {
  /** Find a user row by username. Resolves to { id, username, password_hash, created_at } or null. */
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, password_hash, created_at FROM users WHERE username = ? LIMIT 1', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

// PUBLIC_INTERFACE
export function createUser(username, passwordHash) {
  /** Insert a new user. Resolves to the created user { id, username }. */
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    stmt.run([username, passwordHash], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, username });
    });
    stmt.finalize();
  });
}
