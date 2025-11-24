// Vercel Serverless Function: /api/consents
// Recebe POST com payload de consentimento e grava no Firestore (se credenciais disponíveis)
const admin = require('firebase-admin');

function buildServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  // Normalize common env var formatting mistakes:
  // - Remove surrounding quotes (some dashboards copy/paste with quotes)
  // - Replace escaped newlines with real newlines
  // - Trim whitespace
  try {
    privateKey = privateKey.trim();
    if ((privateKey.startsWith("\"") && privateKey.endsWith("\"")) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\r\\n/g, '\\n').replace(/\\n/g, '\n');
    privateKey = privateKey.replace(/\r\n/g, '\n');
    privateKey = privateKey.trim();
  } catch (e) {
    // if normalization fails, continue and let admin.credential.cert throw a meaningful error
  }

  return {
    type: 'service_account',
    project_id: projectId,
    private_key: privateKey,
    client_email: clientEmail,
  };
}

async function initFirebase() {
  if (admin.apps && admin.apps.length) return admin.firestore();

  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase initialized from GOOGLE_APPLICATION_CREDENTIALS_JSON');
    } else {
      const serviceAccount = buildServiceAccountFromEnv();
      if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        console.log('Firebase initialized from FIREBASE_* env vars');
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Path-based credential (unlikely on Vercel)
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
        console.log('Firebase initialized from application default credentials');
      } else {
        console.warn('No Firebase credentials found in env; Firestore will not be available');
        return null;
      }
    }

    return admin.firestore();
  } catch (err) {
    console.error('Firebase init error:', err?.message || err);
    return null;
  }
}

module.exports = async (req, res) => {
  // Basic CORS handling for non-GET requests from other origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { consent, userId, page, userAgent, timestamp, metadata } = body;

  const record = {
    consent: consent || 'unknown',
    userId: userId || null,
    page: page || req.headers.referer || null,
    userAgent: userAgent || req.headers['user-agent'] || null,
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null,
    timestamp: timestamp || new Date().toISOString(),
    metadata: metadata || null,
  };

  try {
    const db = await initFirebase();
    if (db) {
      const docRef = await db.collection('consents').add(record);
      return res.status(201).json({ id: docRef.id });
    }

    // If Firestore not configured, log and return success WITHOUT id
    console.warn('Firestore not configured for consents - logging to console');
    console.log(JSON.stringify(record));
    return res.status(201).json({ id: null, note: 'db-not-available' });
  } catch (err) {
    console.error('Error saving consent:', err?.message || err);
    return res.status(500).json({ error: 'failed_to_save_consent' });
  }
};

