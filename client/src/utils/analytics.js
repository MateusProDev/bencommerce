// utils/analytics.js - Google Analytics 4 (GA4) Integration
import { GA_CONFIG } from '../config/analytics';

const GA_TRACKING_ID = GA_CONFIG.TRACKING_ID;

// Função para rastrear page views
export const pageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Função para rastrear eventos personalizados
export const event = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Eventos específicos para Turvia
export const trackEvents = {
  // Contato/Lead Generation
  contactFormSubmit: (source) => {
    event('submit_contact_form', 'lead_generation', source);
  },
  
  whatsappClick: (location) => {
    event('whatsapp_click', 'contact', location);
  },
  
  phoneClick: (number) => {
    event('phone_click', 'contact', number);
  },
  
  emailClick: (email) => {
    event('email_click', 'contact', email);
  },

  // Navigation
  menuClick: (menuItem) => {
    event('menu_click', 'navigation', menuItem);
  },
  
  ctaClick: (ctaText, location) => {
    event('cta_click', 'engagement', `${ctaText} - ${location}`);
  },
  
  scrollToSection: (section) => {
    event('scroll_to_section', 'navigation', section);
  },

  // Engagement
  videoPlay: (videoTitle) => {
    event('video_play', 'engagement', videoTitle);
  },
  
  downloadPDF: (fileName) => {
    event('download', 'resource', fileName);
  },
  
  testimonialView: (testimonialAuthor) => {
    event('testimonial_view', 'engagement', testimonialAuthor);
  },

  // Dashboard/Admin
  loginAttempt: (method) => {
    event('login_attempt', 'authentication', method);
  },
  
  dashboardView: (section) => {
    event('dashboard_view', 'admin', section);
  },
  
  reportDownload: (reportType) => {
    event('report_download', 'admin', reportType);
  }
};

export default trackEvents;
