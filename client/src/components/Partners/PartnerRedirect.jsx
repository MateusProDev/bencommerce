import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PARTNERS from './partnersData';

const PartnerRedirect = () => {
  const { id } = useParams();
  const mapping = PARTNERS.reduce((acc, p) => ({ ...acc, [p.id]: p.url }), {});

  useEffect(() => {
    const target = mapping[id];
    if (target) {
      // Redireciona para a URL do parceiro
      window.location.href = target;
    } else {
      window.location.href = '/';
    }
  }, [id]);

  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h2>Redirecionando...</h2>
      <p>Se não for redirecionado automaticamente, <a href={mapping[id] || '/'}>clique aqui</a>.</p>
    </div>
  );
};

export default PartnerRedirect;
