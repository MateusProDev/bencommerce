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
  FaPalette,
  FaWhatsapp,
  FaEnvelope,
  FaBolt,
  FaHeadset,
  FaCogs
} from 'react-icons/fa';
import { buildWhatsAppUrl } from '../utils/leadPlans';
import './PlanosPage.css';

const PlanosPage = () => {
  const navigate = useNavigate();
  const [billingType, setBillingType] = useState('mensal');

  /* Preços em número para permitir o cálculo do plano anual. */
  const plans = [
    {
      id: 'basico',
      name: "Básico",
      subtitle: "Ideal para começar com anúncios pagos",
      monthly: 500,
      icon: <FaGlobe />,
      color: '#3b82f6',
      popular: false,
      features: [
        "Configuração de campanhas no Facebook/Instagram Ads",
        "Criação de criativos para anúncios",
        "Segmentação de público básica",
        "Otimização semanal de campanhas",
        "Relatório mensal de performance",
        "Suporte por e-mail"
      ]
    },
    {
      id: 'normal',
      name: "Normal",
      subtitle: "Maximize resultados com estratégias avançadas",
      monthly: 800,
      icon: <FaUsers />,
      color: '#06b6d4',
      popular: true,
      features: [
        "Tudo do plano Básico",
        "Campanhas em múltiplas plataformas (Facebook, Instagram, Google)",
        "Segmentação avançada de público",
        "Otimização diária de campanhas",
        "Relatório mensal com insights estratégicos",
        "Suporte prioritário 24h-48h",
        "A/B testing de anúncios",
        "Estratégias de remarketing"
      ]
    },
    {
      id: 'personalizado',
      name: "Personalizado",
      subtitle: "Projeto sob medida para a sua operação",
      monthly: null,
      customPrice: "Sob consulta",
      icon: <FaChartLine />,
      color: '#8b5cf6',
      popular: false,
      features: [
        "Tudo do plano Normal",
        "Campanhas avançadas de remarketing multi-plataforma",
        "Copywriting profissional para anúncios",
        "Desenvolvedor dedicado para landing pages",
        "Monitoramento diário em tempo real",
        "Testes A/B avançados (criativos, público, oferta)",
        "Reunião mensal estratégica",
        "Consultoria de crescimento dedicada"
      ]
    }
  ];

  /* Preço exibido conforme o período; o anual tem 2 meses de desconto. */
  const getPrice = (plan) => {
    if (!plan.monthly) return null;
    if (billingType === 'mensal') return plan.monthly;
    return Math.round(plan.monthly * 10);
  };

  const funcionalidades = [
    {
      icon: <FaRocket />,
      title: "Gestão de Tráfego Pago",
      description: "Criação, segmentação e otimização de campanhas no Facebook, Instagram e Google Ads"
    },
    {
      icon: <FaChartLine />,
      title: "Relatórios e Analytics",
      description: "Dashboards com métricas de ROI, CPC, CTR e conversão das campanhas"
    },
    {
      icon: <FaPalette />,
      title: "Criativos para Anúncios",
      description: "Artes e imagens profissionais otimizadas para alta conversão em anúncios"
    },
    {
      icon: <FaBolt />,
      title: "Otimização Contínua",
      description: "Ajustes constantes em lances, segmentações e criativos para maximizar resultados"
    },
    {
      icon: <FaUsers />,
      title: "Segmentação Avançada",
      description: "Públicos personalizados, lookalike e remarketing para atingir clientes qualificados"
    },
    {
      icon: <FaCogs />,
      title: "A/B Testing",
      description: "Testes contínuos de criativos, ofertas e públicos para encontrar a melhor combinação"
    },
    {
      icon: <FaHeadset />,
      title: "Suporte Especializado",
      description: "Equipe dedicada com expertise em tráfego pago para turismo"
    }
  ];

  const faqs = [
    {
      question: "Posso mudar de plano a qualquer momento?",
      answer: "Sim — você pode subir ou descer de plano quando quiser. Ajustes são aplicados automaticamente."
    },
    {
      question: "O que está incluído em todos os planos?",
      answer: "Configuração de campanhas, criação de criativos, otimização, relatórios e suporte especializado."
    },
    {
      question: "Como funciona o plano Personalizado?",
      answer: "O valor é definido sob consulta. Montamos uma proposta específica para operações com múltiplas unidades, sazonalidade forte ou necessidade de landing pages dedicadas."
    },
    {
      question: "Como funciona o processo de aprovação das publicações?",
      answer: "Enviamos um calendário mensal para aprovação. Você pode pedir ajustes antes da publicação."
    }
  ];

  const handleContactPlan = (plan) => {
    const message = plan.monthly
      ? `Olá! Gostaria de contratar o plano ${plan.name} (R$ ${plan.monthly}/mês) de gestão de tráfego pago. Podem me ajudar?`
      : `Olá! Gostaria de um orçamento para o plano Personalizado de gestão de tráfego pago, com escopo sob medida.`;
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  const handleWhatsApp = (action) => {
    const message = action === 'Informações'
      ? 'Olá! Gostaria de mais informações sobre os planos de gestão de tráfego pago da Turvia.'
      : 'Olá! Gostaria de falar com a Turvia sobre gestão de tráfego pago.';
    window.open(buildWhatsAppUrl(message), '_blank');
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
          <h1>Gestão de Tráfego Pago para Agências de Turismo</h1>
          <p>Especialistas em anúncios pagos para maximizar suas vendas e reservas</p>

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
                    <div className="plano-price">
                      <span className="currency">R$</span>
                      <span className="amount">
                        {getPrice(plano).toLocaleString('pt-BR')}
                      </span>
                      <span className="period">
                        {billingType === 'mensal' ? '/mês' : '/ano'}
                      </span>
                    </div>
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
                  onClick={() => handleContactPlan(plano)}
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
              <button className="cta-primary" onClick={() => navigate('/contato')}>
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
