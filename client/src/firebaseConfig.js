import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// 🔐 Configuração com variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // 🔍 analytics
};

// 🔧 Inicializa o app — só se tivermos apiKey configurada
const hasApiKey = !!firebaseConfig.apiKey;

let app = null;
let auth = null;
let db = null;
let analytics = null;

if (!hasApiKey) {
  // Se a API key do Firebase estiver ausente (desenvolvimento), inicializamos um app
  // com valores placeholder para evitar erros "No Firebase App '[DEFAULT]' has been created".
  // Observação: operações reais de Auth/Firestore podem falhar sem credenciais válidas.
  console.warn('[firebaseConfig] REACT_APP_FIREBASE_API_KEY ausente — inicializando app placeholder para evitar crash. Configure as variáveis de ambiente para uso real.');
  const placeholderConfig = {
    apiKey: 'placeholder-api-key',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'localhost',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'local-project',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'local-bucket',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '0',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:0:web:placeholder',
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-PLACEHOLDER',
  };
  try {
    app = initializeApp(placeholderConfig);
    console.log('[firebaseConfig] placeholder Firebase app inicializado');
  } catch (e) {
    console.error('[firebaseConfig] falha ao inicializar placeholder app:', e?.message || e);
  }
  // Tentativa de inicializar serviços mesmo com placeholder (evita null em getAuth())
  try {
    auth = getAuth(app);
    console.log('[firebaseConfig] placeholder auth inicializado');
  } catch (e) {
    console.warn('[firebaseConfig] getAuth (placeholder) falhou:', e?.message || e);
    auth = null;
  }
  try {
    db = getFirestore(app);
    console.log('[firebaseConfig] placeholder firestore inicializado');
  } catch (e) {
    console.warn('[firebaseConfig] getFirestore (placeholder) falhou:', e?.message || e);
    db = null;
  }
} else {
  // Inicializa normalmente
  app = initializeApp(firebaseConfig);

  // 🔓 Serviços principais
  try {
    auth = getAuth(app);
  } catch (e) {
    console.warn('[firebaseConfig] getAuth falhou:', e?.message || e);
    auth = null;
  }

  try {
    db = getFirestore(app);
  } catch (e) {
    console.warn('[firebaseConfig] getFirestore falhou:', e?.message || e);
    db = null;
  }

  // 📊 Analytics (somente se suportado pelo navegador)
  isSupported().then((yes) => {
    if (yes) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn('[firebaseConfig] getAnalytics falhou:', e?.message || e);
        analytics = null;
      }
    }
  });
}

export { app, auth, db, analytics, firebaseConfig };
