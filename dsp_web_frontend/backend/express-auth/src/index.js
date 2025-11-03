/**
 * Minimal Express server providing:
 *  - CORS for frontend origin
 *  - JSON body parsing
 *  - Health check: GET /api/health -> { status: 'ok' }
 *  - Auth: POST /api/auth/signup, POST /api/auth/login
 *
 * Environment:
 *  - PORT (default 8000)
 *  - JWT_SECRET (required in production)
 *  - DATABASE_URL (optional, default ./data/app.db)
 *  - FRONTEND_ORIGIN (optional, defaults to http://localhost:3000 and preview origin)
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import './db.js'; // ensure DB init

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS origins: localhost:3000 and preview origin by default
const defaultOrigins = [
  'http://localhost:3000',
  // Kavia preview origin pattern may vary; allow via env FRONTEND_ORIGIN as needed
];
const previewOrigin = process.env.PREVIEW_ORIGIN || '';
const envOrigin = process.env.FRONTEND_ORIGIN || '';

const allowedOrigins = [
  ...defaultOrigins,
  ...(previewOrigin ? [previewOrigin] : []),
  ...(envOrigin ? [envOrigin] : []),
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) and same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((o) => origin === o)) {
      return callback(null, true);
    }
    // Also allow if wildcard-like match for https preview subdomains when FRONTEND_ORIGIN is a prefix
    try {
      const url = new URL(origin);
      const host = url.host;
      // naive allowance for *.cloud.kavia.ai preview if envOrigin contains 'cloud.kavia.ai'
      if (envOrigin.includes('cloud.kavia.ai') && host.endsWith('cloud.kavia.ai')) {
        return callback(null, true);
      }
    } catch {}
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Health check
// PUBLIC_INTERFACE
app.get('/api/health', (req, res) => {
  /** Returns simple health status JSON: { status: 'ok' } */
  res.status(200).json({ status: 'ok' });
});

// Auth routes
app.use('/api/auth', authRouter);

// Root info
app.get('/', (req, res) => {
  res.type('text/plain').send('Express Auth Backend is running. See /api/health');
});

// Error handler for generic errors to ensure { message } shape
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
});

const PORT = Number(process.env.PORT || 8000);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (allowedOrigins.length) {
    console.log('CORS allowed origins:', allowedOrigins.join(', '));
  }
});
