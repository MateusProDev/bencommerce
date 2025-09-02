import React from 'react';
import './StaticPages.css';

const PrivacidadePage = () => {
  return (
    <div className="static-page">
      <div className="static-container">
        <div className="static-hero">
          <h1>Política de Privacidade — Turvia</h1>
          <p>Última atualização: Setembro de 2025</p>
        </div>

        <div className="static-section">
          <h3>1. Informações que coletamos</h3>
          <p>Coletamos informações fornecidas por você (ex: nome, email, dados da agência) e dados de uso do serviço.</p>

          <h3>2. Como usamos</h3>
          <p>Utilizamos os dados para fornecer o serviço, melhorar a plataforma, enviar comunicações e segurança.</p>

          <h3>3. Compartilhamento</h3>
          <p>Não vendemos seus dados. Podemos compartilhar informações com fornecedores que suportam o serviço, sob acordos de confidencialidade.</p>

          <h3>4. Armazenamento e Segurança</h3>
          <p>Adotamos medidas de segurança técnicas e organizacionais para proteger os dados. Mantemos backups e criptografia conforme aplicável.</p>

          <h3>5. Seus direitos</h3>
          <p>Você pode solicitar acesso, correção ou exclusão dos dados, e controlar preferências de comunicação.</p>

          <h3>6. Contato</h3>
          <p>Para solicitações de privacidade, envie email ao time de privacidade.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacidadePage;
