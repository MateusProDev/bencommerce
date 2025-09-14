// config/analytics.js - Configuração do Google Analytics
// Instrução: Substitua o ID abaixo pelo seu próprio Google Analytics ID

export const GA_CONFIG = {
  // Substitua 'G-XXXXXXXXXX' pelo seu ID real do Google Analytics 4
  // Exemplo: 'G-ABC1234DEF' 
  TRACKING_ID: 'G-1HMMH0L3QH',
  
  // Configurações opcionais
  DEBUG: false, // Altere para true se quiser ver logs no console durante desenvolvimento
  
  // Configurações de consentimento (LGPD/GDPR)
  CONSENT: {
    AD_STORAGE: 'denied',
    ANALYTICS_STORAGE: 'granted',
    FUNCTIONALITY_STORAGE: 'granted',
    PERSONALIZATION_STORAGE: 'denied',
    SECURITY_STORAGE: 'granted'
  }
};

export default GA_CONFIG;
