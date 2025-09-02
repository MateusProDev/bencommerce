import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaGlobe, 
  FaUsers, 
  FaChartLine, 
  FaRocket, 
  FaStar,
  FaCheck,
  FaWhatsapp,
  FaEnvelope,
  FaCreditCard,
  FaCar,
  FaBolt,
  FaShieldAlt,
  FaHeadset,
  FaCogs,
  FaPlane,
  FaHotel
} from 'react-icons/fa';
import './PlanosPage.css';

const PlanosPage = () => {
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState('mensal');

  const plans = [
    {
      id: 1,
      name: "Básico",
      subtitle: "Ideal para agências pequenas",
      price: billingType === 'mensal' ? 149 : 1490,
      originalPrice: billingType === 'anual' ? 1788 : null,
      period: billingType === 'mensal' ? '/mês' : '/ano',
      icon: <FaGlobe />,
      color: '#3b82f6',
      popular: false,
      features: [
        "Site personalizado",
        "Até 100 clientes",
        "5 motoristas",
        "Gestão de reservas básica",
        "Relatórios simples",
        "Suporte horário comercial"
      ]
    },
    {
      id: 2,
      name: "Completo",
      subtitle: "Mais escolhido pelas agências",
      price: billingType === 'mensal' ? 299 : 2990,
      originalPrice: billingType === 'anual' ? 3588 : null,
      period: billingType === 'mensal' ? '/mês' : '/ano',
      icon: <FaUsers />,
      color: '#06b6d4',
      popular: true,
      features: [
        "Site premium personalizado",
        "Clientes ilimitados",
        "Motoristas ilimitados",
        "Sistema de reservas avançado",
        "Dashboard completo",
        "Gestão financeira integrada",
        "Integração com pagamentos",
        "Suporte prioritário",
        "7 dias grátis para teste"
      ]
    },
    {
      id: 3,
      name: "Enterprise",
      subtitle: "Para grandes agências",
      price: null,
      period: '',
      icon: <FaChartLine />,
      color: '#8b5cf6',
      popular: false,
      customPrice: "Sob consulta",
      features: [
        "Solução personalizada",
        "Múltiplas agências",
        "Relatórios avançados personalizados",
        "API completa",
        "Integrações específicas",
        "Suporte 24/7 dedicado",
        "Treinamento da equipe",
        "Consultoria especializada"
      ]
    }
  ];

  const funcionalidades = [
    {
      icon: <FaPlane />,
      title: "Gestão de Viagens",
      description: "Sistema completo para organizar roteiros, excursões e pacotes turísticos"
    },
    {
      icon: <FaHotel />,
      title: "Reservas Hoteleiras", 
      description: "Integração com hotéis, pousadas e controle de hospedagem em tempo real"
    },
    {
      icon: <FaUsers />,
      title: "CRM de Clientes",
      description: "Gerencie clientes, histórico de viagens e preferências personalizadas"
    },
    {
      icon: <FaCogs />,
      title: "Agenda Inteligente",
      description: "Calendário de eventos, compromissos e agendamento online automatizado"
    },
    {
      icon: <FaChartLine />,
      title: "Relatórios e Analytics",
      description: "Dashboards completos com métricas de vendas e performance da agência"
    },
    {
      icon: <FaBolt />,
      title: "App Mobile Nativo",
      description: "Aplicativo mobile para gestão completa da agência em qualquer lugar"
    },
    {
      icon: <FaCar />,
      title: "Roteiros Personalizados",
      description: "Criação de roteiros únicos com mapas interativos e pontos de interesse"
    },
    {
      icon: <FaHeadset />,
      title: "Suporte Especializado",
      description: "Equipe de suporte 24/7 especializada no setor de turismo"
    }
  ];

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
    },
    {
      question: "Há período de carência?",
      answer: "Não, você pode cancelar a qualquer momento sem multas ou taxas adicionais."
    },
    {
      question: "Os preços incluem hospedagem do sistema?",
      answer: "Sim, hospedagem, SSL, domínio e suporte técnico estão inclusos no plano."
    },
    {
      question: "Há taxa de transação nas reservas?",
      answer: "Não cobramos taxa sobre suas vendas de viagens. Você paga apenas o plano mensal."
    }
  ];

  const handleContactPlan = (planId) => {
    const plan = plans.find(p => p.id === planId);
    const message = encodeURIComponent(`Olá! Gostaria de contratar o plano ${plan.name}. Podem me ajudar?`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  const handleWhatsApp = (action) => {
    const message = encodeURIComponent(`Olá! Gostaria de ${action === 'Informações' ? 'mais informações sobre os planos' : 'falar com vocês'}.`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="planos-page">
      {/* Header */}
      <section className="planos-header">
        <div className="planos-header-background">
          <div className="planos-header-blob planos-header-blob-1"></div>
          <div className="planos-header-blob planos-header-blob-2"></div>
          <div className="planos-header-blob planos-header-blob-3"></div>
        </div>
        
        <button className="back-button" onClick={() => navigate('/')}>
          <FaHome /> Voltar ao Início
        </button>
        
        <div className="planos-header-content">
          <h1>Planos para Agências de Turismo</h1>
          <p>Escolha o plano ideal para o tamanho da sua agência e comece a transformar seu negócio hoje mesmo</p>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className="billing-label">Escolha o período:</span>
            <div className="toggle-buttons">
              <button 
                className={billingType === 'mensal' ? 'active' : ''}
                onClick={() => setBillingType('mensal')}
              >
                Mensal
              </button>
              <button 
                className={billingType === 'anual' ? 'active' : ''}
                onClick={() => setBillingType('anual')}
              >
                Anual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="planos-main">
        <div className="planos-container">
          {/* Planos Grid */}
          <section className="planos-grid">
            {plans.map((plano) => (
              <div 
                key={plano.id}
                className={`plano-card ${plano.popular ? 'popular' : ''}`}
                style={{ '--accent-color': plano.color }}
              >
                {plano.popular && (
                  <div className="popular-badge">
                    <FaStar /> Mais Popular
                  </div>
                )}
                
                <div className="plano-header">
                  <div className="plano-icon" style={{ background: plano.color }}>
                    {plano.icon}
                  </div>
                  <h3>{plano.name}</h3>
                  <p className="plano-subtitle">{plano.subtitle}</p>
                </div>

                <div className="plano-pricing">
                  {plano.customPrice ? (
                    <div className="custom-price">{plano.customPrice}</div>
                  ) : (
                    <>
                      {plano.originalPrice && (
                        <div className="original-price">
                          De R${plano.originalPrice.toLocaleString('pt-BR')}
                        </div>
                      )}
                      <div className="plano-price">
                        <span className="currency">R$</span>
                        <span className="amount">{plano.price.toLocaleString('pt-BR')}</span>
                        <span className="period">{plano.period}</span>
                      </div>
                      {plano.originalPrice && (
                        <div className="savings">
                          Economize R${(plano.originalPrice - plano.price).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <ul className="plano-features">
                  {plano.features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  className={`plano-button ${plano.popular ? 'primary' : 'secondary'}`}
                  onClick={() => handleContactPlan(plano.id)}
                >
                  <FaRocket /> 
                  {plano.customPrice ? 'Falar com Vendas' : 'Escolher Plano'}
                </button>
              </div>
            ))}
          </section>

          {/* Funcionalidades */}
          <section className="funcionalidades-section">
            <h2>Tudo incluído em todos os planos</h2>
            <p>Todas as funcionalidades essenciais para sua agência de turismo, sem custos extras</p>
            <div className="funcionalidades-grid">
              {funcionalidades.map((func, index) => (
                <div key={index} className="funcionalidade-item">
                  <div className="func-icon">
                    {func.icon}
                  </div>
                  <h3>{func.title}</h3>
                  <p>{func.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="faq-section">
            <h2>Perguntas Frequentes</h2>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="cta-final">
            <h2>Ainda tem dúvidas?</h2>
            <p>Entre em contato conosco e tire todas as suas dúvidas</p>
            <div className="cta-buttons">
              <button className="cta-primary" onClick={() => handleWhatsApp('Contato')}>
                <FaEnvelope /> Falar Conosco
              </button>
              <button className="cta-whatsapp" onClick={() => handleWhatsApp('Informações')}>
                <FaWhatsapp /> WhatsApp
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PlanosPage;
