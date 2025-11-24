// Vercel Serverless Function: /api/pixel
// Records a fallback impression and returns a 1x1 transparent GIF
const admin = require('firebase-admin');

function buildServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    privateKey = privateKey.trim();
    if ((privateKey.startsWith("\"") && privateKey.endsWith("\"")) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\r\\n/g, '\\n').replace(/\\n/g, '\n');
    privateKey = privateKey.replace(/\r\n/g, '\n');
    privateKey = privateKey.trim();
  } catch (e) {}

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
    } else {
      const serviceAccount = buildServiceAccountFromEnv();
      if (serviceAccount) {
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
      } else {
        return null;
      }
    }
    return admin.firestore();
  } catch (err) {
    console.error('[pixel] Firebase init error:', err?.message || err);
    return null;
  }
}

module.exports = async (req, res) => {
  const partner = req.query && req.query.partner;
  const record = {
    partner: partner || null,
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null,
    ua: req.headers['user-agent'] || null,
    timestamp: new Date().toISOString(),
    path: req.url,
  };

  try {
    const db = await initFirebase();
    if (db) {
      try {
        await db.collection('affiliate_impressions').add(record);
        console.log('[pixel] recorded impression to Firestore');
      } catch (dbErr) {
        console.warn('[pixel] failed to write to Firestore:', dbErr?.message || dbErr);
      }
    } else {
      console.log('[pixel] Firestore not configured, logging impression:', JSON.stringify(record));
    }
  } catch (err) {
    console.error('[pixel] error during impression handling:', err?.message || err);
  }

  // 1x1 transparent GIF (base64)
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Length', gif.length);
  res.status(200).end(gif);
};

