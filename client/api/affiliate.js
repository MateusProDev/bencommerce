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
    console.error('Firebase init error (affiliate):', err?.message || err);
    return null;
  }
}

const PARTNERS = {
  'booking-com': { name: 'Booking.com', url: 'https://www.booking.com', affiliateUrl: null },
  'expedia': { name: 'Expedia', url: 'https://www.expedia.com', affiliateUrl: null },
  'hotels-com': { name: 'Hotels.com', url: 'https://www.hotels.com', affiliateUrl: null },
  'agoda': { name: 'Agoda', url: 'https://www.agoda.com', affiliateUrl: null },
  'getyourguide': { name: 'GetYourGuide', url: 'https://www.getyourguide.com', affiliateUrl: null },
  'tripadvisor': { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', affiliateUrl: null },
};

module.exports = async (req, res) => {
  // Debug: log every call and bypass info
  console.log('[Affiliate API] Called:', {
    url: req.url,
    method: req.method,
    bypass: req.query && req.query['x-vercel-protection-bypass'],
    headers: {
      'x-vercel-protection-bypass': req.headers['x-vercel-protection-bypass'],
      'x-vercel-set-bypass-cookie': req.headers['x-vercel-set-bypass-cookie'],
      'user-agent': req.headers['user-agent'],
    }
  });
  try {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    if (!id || !PARTNERS[id]) {
      return res.status(400).json({ error: 'invalid_partner_id' });
    }

    const partner = PARTNERS[id];
    const target = partner.affiliateUrl || partner.url;

    // Allow a debug mode so we can inspect behavior without following the redirect.
    const debug = req.query && (req.query.debug === '1' || req.query.debug === 'true');

    const db = await initFirebase();
    const record = {
      partnerId: id,
      partnerName: partner.name,
      ip: req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || null,
      userAgent: req.headers['user-agent'] || null,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (db) {
      try {
        await db.collection('affiliate_impressions').add(record);
      } catch (dbErr) {
        // Log DB errors but continue to redirect (best-effort logging)
        console.error('Failed to write affiliate impression:', dbErr?.message || dbErr);
      }
    } else {
      console.log('Affiliate impression (no db):', JSON.stringify(record));
    }

    if (debug) {
      // Return useful debug info instead of redirecting
      return res.status(200).json({ ok: true, target, record, dbConfigured: !!db });
    }

    // Normal behavior: redirect the user to the partner target
    res.writeHead(302, { Location: target });
    return res.end();
  } catch (err) {
    console.error('Error in /api/affiliate:', err?.stack || err?.message || err);
    // Provide a small helpful message for quick debugging
    return res.status(500).json({ error: 'server_error', message: String(err?.message || err) });
  }
};
