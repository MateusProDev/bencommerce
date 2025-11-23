import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';
import loadCJScript from '../../utils/loadCJ';
import { AuthContext } from '../../context/AuthContext';

const CONSENT_KEY = 'turvia_cookie_consent';

const CookieConsent = () => {
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

  useEffect(() => {
    try {
      // Directly load CJ script (no consent banner)
      loadCJScript();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load CJ script automatically:', err);
    }
  }, []);

  return null; // no UI
};

export default CookieConsent;
