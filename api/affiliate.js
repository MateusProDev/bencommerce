// Vercel Serverless Function: /api/affiliate
// Recebe query param `id` do parceiro, registra uma impressão (se Firestore disponível)
// e redireciona o usuário para a URL do parceiro (affiliateUrl se disponível).
const admin = require('firebase-admin');

function buildServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return null;
  privateKey = privateKey.replace(/\\n/g, '\n');
  return {
    type: 'service_account',
    project_id: projectId,
    private_key: privateKey,
    client_email: clientEmail,
  };
}

async function initFirebase() {
  if (admin.apps && admin.apps.length) {
    console.log('[LOG] Firebase já inicializado. Retornando Firestore.');
    return admin.firestore();
  }
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      console.log('[LOG] Inicializando Firebase com GOOGLE_APPLICATION_CREDENTIALS_JSON');
      const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      const serviceAccount = buildServiceAccountFromEnv();
      if (serviceAccount) {
        console.log('[LOG] Inicializando Firebase com variáveis FIREBASE_*');
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log('[LOG] Inicializando Firebase com GOOGLE_APPLICATION_CREDENTIALS (path)');
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
      } else {
        console.error('[LOG] Nenhuma credencial Firebase encontrada nas variáveis de ambiente.');
        return null;
      }
    }
    console.log('[LOG] Firebase inicializado com sucesso. Retornando Firestore.');
    return admin.firestore();
  } catch (err) {
    console.error('[LOG] Erro ao inicializar Firebase (affiliate):', err?.message || err);
    return null;
  }
}

// Simple partners mapping (mirror of client-side list)
const PARTNERS = {
  'booking-com': { name: 'Booking.com', url: 'https://www.booking.com', affiliateUrl: null },
  'expedia': { name: 'Expedia', url: 'https://www.expedia.com', affiliateUrl: null },
  'hotels-com': { name: 'Hotels.com', url: 'https://www.hotels.com', affiliateUrl: null },
  'agoda': { name: 'Agoda', url: 'https://www.agoda.com', affiliateUrl: null },
  'getyourguide': { name: 'GetYourGuide', url: 'https://www.getyourguide.com', affiliateUrl: null },
  'tripadvisor': { name: 'TripAdvisor', url: 'https://www.tripadvisor.com', affiliateUrl: null },
};

module.exports = async (req, res) => {
  try {
    const id = (req.query && req.query.id) || (req.body && req.body.id);
    console.log(`[LOG] Requisição recebida para parceiro: ${id}`);
    if (!id || !PARTNERS[id]) {
      console.error(`[LOG] ID de parceiro inválido: ${id}`);
      return res.status(400).json({ error: 'invalid_partner_id' });
    }

    const partner = PARTNERS[id];
    const target = partner.affiliateUrl || partner.url;
    console.log(`[LOG] Redirecionando para: ${target}`);

    // Record impression/click for auditing
    const db = await initFirebase();
    const record = {
      partnerId: id,
      partnerName: partner.name,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null,
      userAgent: req.headers['user-agent'] || null,
      timestamp: new Date().toISOString(),
      path: req.url,
    };

    if (db) {
      try {
        const docRef = await db.collection('affiliate_impressions').add(record);
        console.log(`[LOG] Impressão registrada no Firestore. ID: ${docRef.id}`);
      } catch (dbErr) {
        console.error('[LOG] Erro ao registrar impressão no Firestore:', dbErr?.message || dbErr);
      }
    } else {
      console.warn('[LOG] Firestore não disponível. Impressão não registrada no banco.');
      console.log('[LOG] Dados da impressão:', JSON.stringify(record));
    }

    // Redirect user to partner (302)
    res.writeHead(302, { Location: target });
    console.log('[LOG] Redirecionamento realizado com sucesso.');
    return res.end();
  } catch (err) {
    console.error('[LOG] Erro na função /api/affiliate:', err?.message || err);
    return res.status(500).json({ error: 'server_error' });
  }
};
