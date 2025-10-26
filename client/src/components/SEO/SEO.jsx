import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  
  return (
    <Helmet>
      {/* Título da página */}
      <title>{title}</title>
      
      {/* Meta tags básicas */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Turvia" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEO;
