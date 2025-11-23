import React, { useEffect } from 'react';
import loadCJScript from '../../utils/loadCJ';

const CookieConsent = () => {
  useEffect(() => {
    try {
      loadCJScript();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load CJ script automatically:', err);
    }
  }, []);

  return null;
};

export default CookieConsent;
