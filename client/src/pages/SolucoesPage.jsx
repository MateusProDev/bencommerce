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
      icon: <FaGlobe />,
      title: "Gestão de Tráfego Facebook/Instagram",
      description: "Campanhas otimizadas para atingir turistas interessados nos seus destinos.",
      features: [
        "Segmentação avançada de público",
        "Criativos de alta conversão",
        "Otimização contínua de lances",
        "Remarketing para conversões",
        "Anúncios em Stories e Feed"
      ],
      color: "#3b82f6"
    },
    {
      icon: <FaChartLine />,
      title: "Gestão de Tráfego Google Ads",
      description: "Capture clientes no momento exato em que buscam por destinos turísticos.",
      features: [
        "Palavras-chave estratégicas",
        "Anúncios de pesquisa e display",
        "Google Meu Negócio otimizado",
        "Maximização de ROI",
        "Campanhas de remarketing"
      ],
      color: "#10b981"
    },
    {
      icon: <FaUsers />,
      title: "Remarketing Multi-plataforma",
      description: "Reconquiste visitantes que já demonstraram interesse nos seus pacotes.",
      features: [
        "Públicos personalizados",
        "Remarketing dinâmico",
        "Funis de conversão",
        "Aumento de taxa de conversão",
        "Cross-selling inteligente"
      ],
      color: "#f59e0b"
    },
    {
      icon: <FaCamera />,
      title: "Criativos de Alta Conversão",
      description: "Artes e vídeos profissionais otimizados para maximizar cliques e conversões.",
      features: [
        "Design orientado à conversão",
        "A/B testing de criativos",
        "Vídeos para anúncios",
        "Landing pages otimizadas",
        "Copywriting persuasivo"
      ],
      color: "#8b5cf6"
    },
    {
      icon: <FaFileInvoiceDollar />,
      title: "Análise de ROI e Performance",
      description: "Acompanhe o desempenho das campanhas com relatórios detalhados.",
      features: [
        "Dashboard em tempo real",
        "Relatórios de CPC, CTR e ROI",
        "Análise de conversão por campanha",
        "Métricas de custo por aquisição",
        "Otimização baseada em dados"
      ],
      color: "#ef4444"
    },
    {
      icon: <FaHeadset />,
      title: "Suporte Especializado",
      description: "Equipe dedicada com expertise em tráfego pago para turismo.",
      features: [
        "Suporte prioritário 24h-48h",
        "Consultoria estratégica",
        "Otimização contínua",
        "Reuniões mensais",
        "Ajustes proativos"
      ],
      color: "#06b6d4"
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de conhecer melhor as soluções de gestão de tráfego pago para turismo.");
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
          <h1>Soluções de Tráfego Pago para Turismo</h1>
          <p>
            Maximize suas vendas e reservas com estratégias de anúncios otimizadas. 
            Transforme visitantes em clientes com nossa expertise em gestão de tráfego.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="solucoes-main">
        <div className="solucoes-container">
          <h2 className="section-title">Nossas Soluções de Tráfego</h2>
          <p className="section-subtitle">
            Cada solução foi desenvolvida especificamente para maximizar 
            conversões e ROI de agências de turismo
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
          <h2>Pronto para aumentar suas conversões?</h2>
          <p>
            Converse com nossos especialistas e descubra como nossas estratégias 
            de tráfego pago podem transformar suas vendas.
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
