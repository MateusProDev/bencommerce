import React from 'react';
import './StaticPages.css';

const TermosPage = () => {
  return (
    <div className="static-page">
      <div className="static-container">
        <div className="static-hero">
          <h1>Termos de Uso — Turvia</h1>
          <p>Última atualização: Setembro de 2025</p>
        </div>

        <div className="static-section">
          <h3>1. Aceitação dos Termos</h3>
          <p>Ao acessar e usar os serviços da Turvia, você concorda com estes Termos de Uso. Se não concordar, não utilize os serviços.</p>

          <h3>2. Uso do Serviço</h3>
          <p>Você concorda em usar o serviço apenas para finalidades legais e em conformidade com todas as leis aplicáveis e políticas da Turvia.</p>

          <h3>3. Conta e Segurança</h3>
          <p>O usuário é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.</p>

          <h3>4. Propriedade Intelectual</h3>
          <p>O conteúdo, marcas e software relacionados ao Turvia são propriedade da Turvia ou de seus licenciadores.</p>

          <h3>5. Limitação de Responsabilidade</h3>
          <p>A Turvia não se responsabiliza por perdas indiretas, incidentais ou consequenciais. A responsabilidade total estará limitada conforme a legislação aplicável.</p>

          <h3>6. Alterações</h3>
          <p>Podemos alterar estes Termos a qualquer momento; notificaremos por email ou via painel. Alterações entrarão em vigor conforme descrito na notificação.</p>

          <h3>7. Contato</h3>
          <p>Para dúvidas sobre estes Termos, entre em contato pelo suporte.</p>
        </div>
      </div>
    </div>
  );
};

export default TermosPage;
