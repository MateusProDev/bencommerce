import React from 'react';
import PARTNERS from './partnersData';
import './Partners.css';

// Agora usamos links diretos (anchor href) para que o script CJ possa
// detectar e transformar os links em deeplinks/affiliated links automaticamente.
const PartnersList = () => {
  return (
    <div className="partners-page">
      <div className="partners-container">
        <h1>Parceiros</h1>
        <p>Escolha um parceiro para ser redirecionado ao site e concluir sua reserva.</p>

        <div className="partners-grid">
          {PARTNERS.map((p) => (
            <div key={p.id} className="partner-card">
              <h3>{p.name}</h3>
              <p>{p.note || 'Reservas'}</p>
              <a
                href={p.affiliateUrl || p.url}
                className="partner-cta cj-link"
                target="_blank"
                rel="noopener noreferrer"
                data-partner-id={p.id}
                data-cj-pid="101595768"
                data-cj-sid="turvia-reservas"
              >
                Ir para {p.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersList;
