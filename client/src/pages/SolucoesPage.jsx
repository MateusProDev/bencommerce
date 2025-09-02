import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlane, 
  FaHotel, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine, 
  FaMobile,
  FaGlobe,
  FaCreditCard,
  FaHeadset,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaHome,
  FaMapMarkedAlt,
  FaCamera,
  FaFileInvoiceDollar,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';
import './SolucoesPage.css';

const SolucoesPage = () => {
  const navigate = useNavigate();

  const solucoes = [
    {
      icon: <FaPlane />,
      title: "Gestão de Viagens",
      description: "Sistema completo para organizar e gerenciar todos os tipos de viagens e roteiros.",
      features: [
        "Catálogo de destinos personalizável",
        "Montagem de roteiros inteligente",
        "Gestão de reservas em tempo real",
        "Controle de disponibilidade automático",
        "Integração com fornecedores"
      ],
      color: "#3b82f6"
    },
    {
      icon: <FaHotel />,
      title: "Reservas de Hospedagem",
      description: "Integração com hotéis e pousadas para reservas automáticas e controle de ocupação.",
      features: [
        "Sistema de reservas online",
        "Check-in/Check-out digital",
        "Controle de quartos e ocupação",
        "Integração hoteleira completa",
        "Gestão de tarifas dinâmicas"
      ],
      color: "#10b981"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Agenda Inteligente",
      description: "Organize excursões, eventos e compromissos com calendário interativo.",
      features: [
        "Calendário de eventos interativo",
        "Agendamento online 24/7",
        "Lembretes automáticos",
        "Sincronização multi-dispositivo",
        "Notificações personalizadas"
      ],
      color: "#f59e0b"
    },
    {
      icon: <FaUsers />,
      title: "CRM de Clientes",
      description: "Gerencie todos os seus clientes e histórico de viagens em um só lugar.",
      features: [
        "Base de dados completa de clientes",
        "Histórico de viagens detalhado",
        "Segmentação avançada",
        "Campanhas de marketing direcionadas",
        "Análise de comportamento do cliente"
      ],
      color: "#8b5cf6"
    },
    {
      icon: <FaChartLine />,
      title: "Relatórios e Analytics",
      description: "Acompanhe o desempenho da sua agência com relatórios detalhados.",
      features: [
        "Dashboard executivo em tempo real",
        "Relatórios de vendas detalhados",
        "Análise de ROI por campanha",
        "Métricas de satisfação do cliente",
        "Previsões e tendências de mercado"
      ],
      color: "#ef4444"
    },
    {
      icon: <FaMobile />,
      title: "App Mobile",
      description: "Aplicativo mobile para gestão completa da sua agência em qualquer lugar.",
      features: [
        "Gestão móvel completa",
        "Notificações push",
        "Acesso offline limitado",
        "Sincronização automática",
        "Interface otimizada para mobile"
      ],
      color: "#06b6d4"
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de conhecer melhor as soluções para agência de turismo.");
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="solucoes-page">
      {/* Header Section */}
      <section className="solucoes-header">
        <div className="solucoes-header-background">
          <div className="solucoes-header-blob solucoes-header-blob-1"></div>
          <div className="solucoes-header-blob solucoes-header-blob-2"></div>
          <div className="solucoes-header-blob solucoes-header-blob-3"></div>
        </div>
        
        <button className="back-button" onClick={() => navigate('/')}>
          <FaHome /> Voltar ao Início
        </button>
        
        <div className="solucoes-header-content">
          <h1>Soluções Completas para Agências de Turismo</h1>
          <p>
            Transforme sua agência com nossa plataforma integrada. 
            Gerencie clientes, reservas, viagens e muito mais em um só lugar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="solucoes-main">
        <div className="solucoes-container">
          <h2 className="section-title">Nossas Soluções</h2>
          <p className="section-subtitle">
            Cada módulo foi desenvolvido especificamente para as necessidades 
            do mercado de turismo brasileiro
          </p>
          
          {/* Solutions Grid */}
          <div className="solucoes-grid">
            {solucoes.map((solucao, index) => (
              <div key={index} className="solucao-card">
                <div className="solucao-icon" style={{ background: solucao.color }}>
                  {solucao.icon}
                </div>
                <h3>{solucao.title}</h3>
                <p>{solucao.description}</p>
                <ul className="features-list">
                  {solucao.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Pronto para revolucionar sua agência?</h2>
          <p>
            Converse com nossos especialistas e descubra como nossa plataforma 
            pode transformar seu negócio de turismo.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => navigate('/contato')}>
              <FaEnvelope /> Solicitar Demonstração
            </button>
            <button className="cta-whatsapp" onClick={handleWhatsApp}>
              <FaWhatsapp /> Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolucoesPage;
