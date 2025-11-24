import React, { useEffect, useState } from 'react';
import loadCJScript from '../../utils/loadCJ';
import './CookieConsent.css';

const CONSENT_KEY = 'turvia_cookie_consent';

function readConsent() {
  try {
    // Prefer cookie (server-friendly), fallback to localStorage
    const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(CONSENT_KEY + '='));
    if (match) {
      const value = decodeURIComponent(match.split('=')[1]);
      return JSON.parse(value);
    }
  } catch (e) {
    // ignore
  }
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return null;
}

function writeConsent(obj) {
  try {
    const json = JSON.stringify(obj);
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(json)}; path=/; expires=${expires}; Secure; SameSite=Lax`;
    try { localStorage.setItem(CONSENT_KEY, json); } catch (e) {}
  } catch (e) {
    // ignore
  }
}

async function logConsentToServer(consent) {
  try {
    await fetch('/api/consents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent, userAgent: navigator.userAgent, timestamp: new Date().toISOString() })
    });
  } catch (e) {
    // do not block user flow
    // eslint-disable-next-line no-console
    console.warn('Failed to POST consent to server:', e);
  }
}

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [consent, setConsent] = useState(() => readConsent() || { necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setConsent(existing);
      // Load CJ if marketing allowed
      if (existing.marketing) loadCJScript();
    }
  }, []);

  const acceptAll = async () => {
    const c = { necessary: true, analytics: true, marketing: true };
    writeConsent(c);
    setConsent(c);
    setVisible(false);
    await logConsentToServer({ action: 'accept_all', preferences: c });
    loadCJScript();
  };

  const refuseAll = async () => {
    const c = { necessary: true, analytics: false, marketing: false };
    writeConsent(c);
    setConsent(c);
    setVisible(false);
    await logConsentToServer({ action: 'refuse_all', preferences: c });
  };

  const savePreferences = async (prefs) => {
    const c = { necessary: true, analytics: !!prefs.analytics, marketing: !!prefs.marketing };
    writeConsent(c);
    setConsent(c);
    setPreferencesOpen(false);
    setVisible(false);
    await logConsentToServer({ action: 'save_preferences', preferences: c });
    if (c.marketing) loadCJScript();
  };

  if (!visible && !preferencesOpen) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <strong>Usamos cookies</strong>
          <p>
            Nós utilizamos cookies necessários para o funcionamento do site. Podemos também usar cookies para
            fins analíticos e de marketing — estes só serão ativados com o seu consentimento.
          </p>
          <p style={{ marginTop: 8 }}>
            <a className="cookie-policy-link" href="/privacidade">Política de Privacidade</a>
          </p>
        </div>

        <div className="cookie-consent-actions">
          <button className="cookie-btn cookie-btn-secondary" onClick={() => setPreferencesOpen(true)}>Preferências</button>
          <button className="cookie-btn cookie-btn-secondary" onClick={refuseAll}>Recusar</button>
          <button className="cookie-btn" onClick={acceptAll}>Aceitar tudo</button>
        </div>
      </div>

      {preferencesOpen && (
        <div className="cookie-consent-inner" style={{ marginTop: 12, flexDirection: 'column' }}>
          <h4>Configurações de cookies</h4>
          <div style={{ margin: '8px 0' }}>
            <label><strong>Cookies necessários</strong> — Necessários para o funcionamento do site. Sempre ativos.</label>
          </div>
          <div style={{ margin: '8px 0' }}>
            <label>
              <input type="checkbox" checked={!!consent.analytics} onChange={(e) => setConsent(s => ({ ...s, analytics: e.target.checked }))} />{' '}
              Cookies de Analytics — ajudam a entender o uso do site.
            </label>
          </div>
          <div style={{ margin: '8px 0' }}>
            <label>
              <input type="checkbox" checked={!!consent.marketing} onChange={(e) => setConsent(s => ({ ...s, marketing: e.target.checked }))} />{' '}
              Cookies de Marketing — usados para rastrear parcerias e anúncios (ex.: afiliados).
            </label>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="cookie-btn cookie-btn-secondary" onClick={() => setPreferencesOpen(false)}>Cancelar</button>
            <button className="cookie-btn" onClick={() => savePreferences(consent)}>Salvar preferências</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
