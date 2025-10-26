import { useEffect } from 'react';

const SEO = ({ 
  title = "Turvia - Soluções Digitais para Agências de Turismo",
  description = "Sites personalizados, sistemas completos, redes sociais e identidade visual. Tudo para sua agência de turismo conquistar mais clientes online.",
  keywords = "sistema para agência de turismo, site para turismo, gestão de agência de viagens, reservas online, dashboard turismo",
  image = "/TurviaSemFundo.png",
  url = "https://turvia.com.br",
  type = "website"
}) => {
  const siteUrl = "https://turvia.com.br";
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };
    
    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', fullImage, true);
    updateMetaTag('og:site_name', 'Turvia', true);
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', fullUrl, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', fullImage, true);
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', fullUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', fullUrl);
      document.head.appendChild(canonicalLink);
    }
  }, [title, description, keywords, fullUrl, fullImage, type]);
  
  return null;
};

export default SEO;
