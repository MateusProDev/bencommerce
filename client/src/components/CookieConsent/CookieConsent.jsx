import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';
import loadCJScript from '../../utils/loadCJ';
import { AuthContext } from '../../context/AuthContext';

const CONSENT_KEY = 'turvia_cookie_consent';

const API_BASE = process.env.REACT_APP_API_URL || '';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted') {
        setConsent('accepted');
        // If already accepted, load CJ immediately
        // Best-effort: try to notify server (fire-and-forget) then load CJ
        sendConsent('accepted').finally(() => loadCJScript());
      } else if (stored === 'denied') {
        setConsent('denied');
      } else {
        setVisible(true);
      }
    } catch (e) {
      // If localStorage not available, still show banner
      setVisible(true);
    }
  }, []);

  async function sendConsent(value) {
    const payload = {
      consent: value,
      userId: user?.uid || null,
      page: window?.location?.pathname || null,
      userAgent: navigator?.userAgent || null,
      timestamp: new Date().toISOString(),
    };

    try {
      const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/consents` : '/api/consents';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
    } catch (err) {
      // don't block user flow on audit failure; log for debugging
      // eslint-disable-next-line no-console
      console.warn('Failed to register consent audit:', err?.message || err);
    }
  }

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
    setConsent('accepted');
    setVisible(false);
    // Register consent server-side for audit, then load CJ
    sendConsent('accepted').finally(() => loadCJScript());
  };

  const refuse = () => {
    try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e) {}
    setConsent('denied');
    setVisible(false);
    // Register refusal for audit
    sendConsent('denied');
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <strong>Usamos cookies</strong>
          <p>
            Este site usa cookies para rastreamento de afiliados e melhorias de
            experiência. Ao aceitar, você autoriza o carregamento de scripts
            de parceiros para rastrear cliques e impressões. Consulte nossa{' '}
            <Link to="/cookies" className="cookie-policy-link">política de cookies</Link>.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button className="cookie-btn cookie-btn-secondary" onClick={refuse}>
            Recusar
          </button>
          <button className="cookie-btn" onClick={accept}>
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
