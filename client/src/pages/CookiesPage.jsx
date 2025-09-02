import React from 'react';
import './StaticPages.css';

const CookiesPage = () => {
  return (
    <div className="static-page">
      <div className="static-container">
        <div className="static-hero">
          <h1>Política de Cookies — Turvia</h1>
          <p>Última atualização: Setembro de 2025</p>
        </div>

        <div className="static-section">
          <h3>1. O que são Cookies</h3>
          <p>Cookies são pequenos arquivos armazenados no seu dispositivo para melhorar a experiência e lembrar preferências.</p>

          <h3>2. Tipos que usamos</h3>
          <p>Usamos cookies essenciais, de análise (para entender uso) e de marketing (para anúncios e integrações).</p>

          <h3>3. Como controlar</h3>
          <p>Você pode gerenciar cookies pelo seu navegador ou pelas configurações do painel da sua conta quando disponível.</p>

          <h3>4. Terceiros</h3>
          <p>Alguns cookies são definidos por serviços terceiros (ex.: Google Analytics, provedores de pagamento).</p>

          <h3>5. Contato</h3>
          <p>Para dúvidas sobre cookies, entre em contato com suporte.</p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
