import React, { useEffect, useState } from 'react';
import loadCJScript, { CJ_SRC } from '../../utils/loadCJ';
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
      if (existing.marketing) {
        enableMarketingTech();
      }
    }
  }, []);

  const acceptAll = async () => {
    const c = { necessary: true, analytics: true, marketing: true };
    writeConsent(c);
    setConsent(c);
    setVisible(false);
    await logConsentToServer({ action: 'accept_all', preferences: c });
    enableMarketingTech();
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
    if (c.marketing) enableMarketingTech();
  };

  function loadScriptWithHandlers(src, onLoad, onError) {
    try {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.onload = onLoad;
        existing.onerror = onError;
        return existing;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      s.crossOrigin = 'anonymous';
      s.onload = onLoad;
      s.onerror = onError;
      document.body.appendChild(s);
      return s;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to insert script', src, e);
      if (onError) onError(e);
    }
    return null;
  }

  async function reportBlocked(partner) {
    try {
      await fetch(`/api/pixel?partner=${encodeURIComponent(partner)}`, { method: 'GET', cache: 'no-store' });
      // eslint-disable-next-line no-console
      console.info('[CookieConsent] Reported blocked partner to server:', partner);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[CookieConsent] Failed to report blocked partner:', partner, e);
    }
  }

  function enableMarketingTech() {
    // Attempt to load CJ via existing utility which inserts the script
    try {
      loadCJScript();
      // Attach fallback: if the script fails to load (blocked by client), notify server
      const cjScript = document.querySelector(`script[src="${CJ_SRC}"]`);
      if (cjScript) {
        cjScript.onerror = (e) => {
          // eslint-disable-next-line no-console
          console.error('[CookieConsent] CJ script blocked by client', e);
          reportBlocked('CJ');
        };
      } else {
        // If not present yet, add with handlers ourselves
        loadScriptWithHandlers(CJ_SRC, () => console.log('[CookieConsent] CJ loaded'), () => reportBlocked('CJ'));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('CJ load failed', e);
      reportBlocked('CJ');
    }

    // Try to load Google Analytics (gtag). If blocked, report so server-side fallback can count it.
    try {
      const gaId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.REACT_APP_MEASUREMENT_ID || 'G-R7FYMW7HVB';
      const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      loadScriptWithHandlers(gaSrc, () => {
        try {
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);} // eslint-disable-line no-inner-declarations
          gtag('js', new Date());
          gtag('config', gaId);
          // eslint-disable-next-line no-console
          console.info('[CookieConsent] GA loaded', gaId);
        } catch (e) {
          // ignore
        }
      }, () => reportBlocked('GA4'));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('GA load setup failed', e);
      reportBlocked('GA4');
    }
  }

  if (!visible && !preferencesOpen) return null;

  return (
    <div className="cookie-consent-modal" role="dialog" aria-live="polite">
      <div className="cookie-consent-header">
        <div className="cookie-consent-title">Usamos cookies</div>
      </div>
      <div className="cookie-consent-body">
        Nós utilizamos cookies necessários para o funcionamento do site. Podemos também usar cookies para fins
        analíticos e de marketing — estes só serão ativados com o seu consentimento.
        <div className="cookie-small"><a href="/privacidade">Política de Privacidade</a></div>

        <div className="cookie-consent-preferences">
          <div className="preference-row">
            <div>
              <strong>Cookies necessários</strong>
              <div className="cookie-small">Essenciais para o funcionamento — sempre ativos.</div>
            </div>
            <div style={{ opacity: 0.6 }}>Ativo</div>
          </div>

          <div className="preference-row">
            <div>
              <strong>Analytics</strong>
              <div className="cookie-small">Ajuda a entender tráfego e performance.</div>
            </div>
            <div className={`toggle ${consent.analytics ? 'on' : ''}`} onClick={() => setConsent(s => ({ ...s, analytics: !s.analytics }))}>
              <div className="knob" />
            </div>
          </div>

          <div className="preference-row">
            <div>
              <strong>Marketing</strong>
              <div className="cookie-small">Ativa parcerias e scripts de afiliados.</div>
            </div>
            <div className={`toggle ${consent.marketing ? 'on' : ''}`} onClick={() => setConsent(s => ({ ...s, marketing: !s.marketing }))}>
              <div className="knob" />
            </div>
          </div>
        </div>

        <div className="cookie-consent-actions">
          <button className="cookie-btn secondary" onClick={() => { setPreferencesOpen(false); setVisible(false); refuseAll(); }}>Recusar</button>
          <button className="cookie-btn secondary" onClick={() => { setPreferencesOpen(true); }}>Preferências</button>
          <button className="cookie-btn primary" onClick={acceptAll}>Aceitar tudo</button>
        </div>

        {preferencesOpen && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="cookie-btn secondary" onClick={() => setPreferencesOpen(false)}>Cancelar</button>
              <button className="cookie-btn primary" onClick={() => savePreferences(consent)}>Salvar preferências</button>
            </div>
            <div className="cookie-partners">
              <div className="cookie-small">Parceiros</div>
              <div className="partner-row">
                <div>Booking.com</div>
                <button className="partner-btn" onClick={() => window.open('https://www.booking.com', '_blank')}>Ir para Booking.com</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
