import React, { useState, useEffect } from "react";
import {
  FaGlobe,
  FaUsers,
  FaCar,
  FaChartLine,
  FaCreditCard,
  FaBars,
  FaWhatsapp,
  FaCheck,
  FaPlane,
  FaHotel,
  FaUmbrellaBeach,
  FaRocket,
  FaStar,
  FaShieldAlt,
  FaBolt,
  FaHeart,
  FaHome,
  FaCogs,
  FaTags,
  FaEnvelope,
  FaPalette,
} from "react-icons/fa";
import { 
  HiSparkles, 
  HiLightningBolt, 
  HiTrendingUp 
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useContactFunnel from "../../hooks/useContactFunnel";
import useSocialMediaFunnel from "../../hooks/useSocialMediaFunnel";
import SocialMediaFunnel from "../SocialMediaFunnel/SocialMediaFunnel";
import TurviaLogo from "../../assets/Turvia.png";
import TurviaSemFundoLogo from "../../assets/TurviaSemFundo.png";
import BuscarLogo from "../../assets/20buscar.png";
import LisboaLogo from "../../assets/lisboa.png";
import { trackEvents, pageView } from "../../utils/analytics";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { openContactFunnel } = useContactFunnel();
  const { 
    isOpen: isSocialMediaOpen, 
    selectedPlan, 
    openSocialMediaFunnel, 
    closeSocialMediaFunnel, 
    submitLead 
  } = useSocialMediaFunnel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWhatsappNotification, setShowWhatsappNotification] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');

  // Nome da empresa para efeito typewriter
  const companyName = "Turvia";

  // Efeito typewriter em loop contínuo
  useEffect(() => {
    let timeout;
    
    if (typewriterText.length < companyName.length) {
      // Digitando o nome
      timeout = setTimeout(() => {
        setTypewriterText(companyName.slice(0, typewriterText.length + 1));
      }, 150); // 150ms por caractere
    } else {
      // Nome completo - espera e depois apaga para repetir
      timeout = setTimeout(() => {
        setTypewriterText(''); // Apaga e reinicia
      }, 1500); // Pausa 1.5s com nome completo
    }

    return () => clearTimeout(timeout);
  }, [typewriterText, companyName]);

  // Auto-finalizar loading após algumas repetições
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 segundos de animação loop

    return () => clearTimeout(loadingTimer);
  }, []);

  // Google Analytics - Page View
  useEffect(() => {
    pageView(window.location.pathname + window.location.search);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    trackEvents.menuClick('mobile_menu_toggle');
  };

  const toggleWhatsappNotification = () => {
    setShowWhatsappNotification(!showWhatsappNotification);
  };

  // Funções auxiliares para tracking
  const handleContactFunnelOpen = (type, location) => {
    trackEvents.contactFormSubmit(`${type} - ${location}`);
    openContactFunnel(type);
  };

  const handleSocialMediaFunnelOpen = (plan, location) => {
    trackEvents.contactFormSubmit(`Social Media ${plan} - ${location}`);
    openSocialMediaFunnel(plan);
  };

  const handleWhatsAppClick = (location) => {
    trackEvents.whatsappClick(location);
    if (location === 'floating') {
      setWhatsappModalOpen(true);
    } else {
      window.open('https://wa.me/5585991470709', '_blank');
    }
  };

  const whatsappServices = [
    {
      title: "Site Personalizado",
      icon: "🌐",
      message: "Olá! Gostaria de saber mais sobre criação de site personalizado para minha agência de turismo. Podem me ajudar com mais informações sobre preços e funcionalidades?"
    },
    {
      title: "Sistema Completo",
      icon: "⚙️",
      message: "Olá! Tenho interesse no sistema completo 3em1 para agência de turismo. Gostaria de saber mais sobre as funcionalidades, preços e como funciona a implementação."
    },
    {
      title: "Gerenciamento de Redes Sociais",
      icon: "📱",
      message: "Olá! Preciso de ajuda com gerenciamento de redes sociais para minha agência de turismo. Podem me explicar como funciona o serviço e os valores?"
    },
    {
      title: "Criação de Identidade Visual",
      icon: "🎨",
      message: "Olá! Gostaria de criar uma identidade visual profissional para minha agência de turismo. Podem me mostrar portfólio e orçamento?"
    }
  ];

  const handleWhatsAppServiceClick = (service) => {
    const message = encodeURIComponent(service.message);
    window.open(`https://wa.me/5585991470709?text=${message}`, '_blank');
    setWhatsappModalOpen(false);
  };

  const handleCTAClick = (ctaText, location) => {
    trackEvents.ctaClick(ctaText, location);
  };

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FaGlobe />,
      title: "Desenvolvimento Web Especializado",
      description:
        "Criamos sites únicos para agências de turismo com foco em conversão e experiência do usuário, otimizados para o mercado turístico",
    },
    {
      icon: <FaCogs />,
      title: "Integração Completa",
      description:
        "Desenvolvemos sistemas que integram site, gestão de clientes, reservas e pagamentos em uma única plataforma eficiente",
    },
    {
      icon: <FaUsers />,
      title: "Estratégia Digital",
      description:
        "Cuidamos da presença digital completa da sua agência: redes sociais, identidade visual e marketing digital especializado",
    },
    {
      icon: <FaChartLine />,
      title: "Análise e Otimização",
      description:
        "Monitoramos e otimizamos constantemente o desempenho digital da sua agência com relatórios detalhados e insights valiosos",
    },
    {
      icon: <FaRocket />,
      title: "Suporte Especializado",
      description:
        "Equipe dedicada com expertise em turismo para garantir que sua agência tenha sempre o melhor suporte técnico e estratégico",
    },
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$149",
      period: "/mês",
      icon: <FaGlobe />,
      features: [
        "Site personalizado",
        "Até 100 clientes",
        "5 motoristas",
        "Gestão de reservas básica",
        "Relatórios simples",
        "Suporte horário comercial",
      ],
      ctaText: "Vamos Começar",
      featured: false,
    },
    {
      name: "Completo",
      price: "R$299",
      period: "/mês",
      icon: <FaUsers />,
      features: [
        "Site premium personalizado",
        "Clientes ilimitados",
        "Motoristas ilimitados",
        "Sistema de reservas avançado",
        "Dashboard completo",
        "Gestão financeira integrada",
        "Integração com pagamentos",
        "Suporte prioritário",
        "7 dias grátis para teste",
      ],
      ctaText: "Agendar Demonstração",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      icon: <FaChartLine />,
      features: [
        "Solução personalizada",
        "Múltiplas agências",
        "Relatórios avançados personalizados",
        "API completa",
        "Integrações específicas",
        "Suporte 24/7 dedicado",
        "Treinamento da equipe",
        "Consultoria especializada",
      ],
      ctaText: "Vamos Conversar",
      featured: false,
    },
  ];

  const clients = [
    { name: "20Buscar Vacation Beach", logo: BuscarLogo },
    { name: "Lisboatur", logo: LisboaLogo },
    { name: "20Buscar Vacation Beach", logo: BuscarLogo },
    { name: "Lisboatur", logo: LisboaLogo },
    // { name: "VcTur", logo: VcTurLogo },
  ];

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="typewriter-container">
              <h1 className="typewriter-text">
                {typewriterText}
                <span className="cursor">|</span>
              </h1>
              <p className="loading-subtitle">Plataforma para agências de turismo</p>
            </div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <div className="loading-background">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
      )}

      <div className="homepage-container">{/* Navbar */}
      <nav className="homepage-navbar">
        <div
          className="homepage-navbar-logo"
          onClick={() => navigate("/")}
          title="Turvia — Para agências de Turismo"
        >
          <img
            className="homepage-navbar-logo-img"
            src={TurviaSemFundoLogo}
            alt="Logo Turvia"
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Menu Desktop */}
        <ul
          className="homepage-nav-links"
          style={{ listStyleType: "none", paddingLeft: 0 }}
        >
          <li className="homepage-nav-link" onClick={() => navigate("/")}>
            Início
          </li>
          <li
            className="homepage-nav-link"
            onClick={() => navigate("/solucoes")}
          >
            Soluções
          </li>
          <li className="homepage-nav-link" onClick={() => navigate("/planos")}>
            Planos
          </li>
          <li className="homepage-nav-link" onClick={() => openContactFunnel()}>
            Contato
          </li>
          <li 
            className="homepage-nav-whatsapp"
            onClick={() => window.open('https://wa.me/5585991470709', '_blank')}
            title="Fale conosco no WhatsApp"
          >
            <FaWhatsapp />
            +55 85 99147-0709
          </li>
          <li
            className="homepage-nav-button"
            onClick={() => openContactFunnel("completo")}
          >
            Demonstração
          </li>
        </ul>
        {/* Botão do menu mobile */}
        <button
          className="homepage-mobile-menu-button toggle-button"
          onClick={toggleMobileMenu}
        >
          <FaBars className="homepage-mobile-menu-icon" />
        </button>
        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="homepage-mobile-menu">
            <ul
              className="homepage-mobile-menu-list"
              style={{ listStyleType: "none", paddingLeft: 0 }}
            >
              <li
                className="homepage-mobile-menu-item"
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                <FaHome />
                Início
              </li>
              <li
                className="homepage-mobile-menu-item"
                onClick={() => {
                  navigate("/solucoes");
                  setMobileMenuOpen(false);
                }}
              >
                <FaCogs />
                Soluções
              </li>
              <li
                className="homepage-mobile-menu-item"
                onClick={() => {
                  navigate("/planos");
                  setMobileMenuOpen(false);
                }}
              >
                <FaTags />
                Planos
              </li>
              <li
                className="homepage-mobile-menu-item"
                onClick={() => {
                  openContactFunnel();
                  setMobileMenuOpen(false);
                }}
              >
                <FaEnvelope />
                Contato
              </li>
              <li
                className="homepage-mobile-menu-whatsapp"
                onClick={() => {
                  window.open('https://wa.me/5585991470709', '_blank');
                  setMobileMenuOpen(false);
                }}
              >
                <FaWhatsapp />
                WhatsApp
              </li>
              <li
                className="homepage-mobile-menu-button teste-toggle"
                onClick={() => {
                  openContactFunnel("completo");
                  setMobileMenuOpen(false);
                }}
              >
                <FaRocket />
                Demonstração
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="homepage-hero-background">
          <div className="homepage-hero-overlay"></div>
          <div className="homepage-hero-blob homepage-hero-blob-1"></div>
          <div className="homepage-hero-blob homepage-hero-blob-2"></div>
          <div className="homepage-hero-blob homepage-hero-blob-3"></div>
        </div>

        <div className="homepage-hero-content">
          <h1 className="homepage-hero-title">
            Turvia - Agência Especializada em Soluções Digitais
          </h1>
          <p className="homepage-hero-subtitle">
            Para donos de agências: criamos sites personalizados, sistemas completos 3em1, 
            gerenciamento de redes sociais e desenvolvemos sua identidade visual. 
            Sua agência com presença digital completa e profissional.
          </p>
          <div className="homepage-hero-buttons">
            <button
              onClick={() => {
                handleCTAClick('Vamos Trabalhar Juntos', 'hero');
                handleContactFunnelOpen("completo", "hero_primary");
              }}
              className="homepage-hero-primary-button"
            >
              Vamos Trabalhar Juntos
            </button>
            <button
              onClick={() => {
                handleCTAClick('Ver Nossos Serviços', 'hero');
                handleContactFunnelOpen("completo", "hero_secondary");
              }}
              className="homepage-hero-secondary-button"
            >
              Ver Nossos Serviços
            </button>
          </div>
        </div>
      </section>

      {/* Turvia Agency Services Section */}
      <section className="turvia-services-section">
        <div className="turvia-services-container">
          <div className="turvia-services-header">
            <h2 className="turvia-services-title">
              Soluções Completas para Agências de Turismo
            </h2>
            <p className="turvia-services-subtitle">
              Somos especialistas em transformar agências de turismo com soluções digitais completas e personalizadas
            </p>
          </div>

          <div className="turvia-services-grid">
            <div className="turvia-service-card">
              <div className="turvia-service-icon">
                <FaGlobe />
              </div>
              <h3 className="turvia-service-title">Sites Personalizados</h3>
              <p className="turvia-service-description">
                Criamos sites únicos e responsivos que representam a identidade da sua agência e convertem visitantes em clientes.
              </p>
              <ul className="turvia-service-features">
                <li>Design exclusivo e responsivo</li>
                <li>SEO otimizado para turismo</li>
                <li>Integração com redes sociais</li>
                <li>Sistema de reservas integrado</li>
              </ul>
            </div>

            <div className="turvia-service-card featured">
              <div className="turvia-service-badge">Mais Popular</div>
              <div className="turvia-service-icon">
                <FaCogs />
              </div>
              <h3 className="turvia-service-title">Sistema Completo 3em1</h3>
              <p className="turvia-service-description">
                Plataforma completa que integra site, gestão de clientes e sistema de reservas em uma única solução.
              </p>
              <ul className="turvia-service-features">
                <li>Site + Gestão + Reservas</li>
                <li>Dashboard inteligente</li>
                <li>Controle financeiro</li>
                <li>Relatórios avançados</li>
              </ul>
            </div>

            <div className="turvia-service-card">
              <div className="turvia-service-icon">
                <FaUsers />
              </div>
              <h3 className="turvia-service-title">Gerenciamento de Redes Sociais</h3>
              <p className="turvia-service-description">
                Cuidamos das suas redes sociais com conteúdo profissional e estratégias que atraem turistas.
              </p>
              <ul className="turvia-service-features">
                <li>Conteúdo visual profissional</li>
                <li>Campanhas direcionadas</li>
                <li>Relatórios de performance</li>
                <li>Engajamento 24/7</li>
              </ul>
            </div>

            <div className="turvia-service-card">
              <div className="turvia-service-icon">
                <FaPalette />
              </div>
              <h3 className="turvia-service-title">Identidade Visual</h3>
              <p className="turvia-service-description">
                Desenvolvemos a identidade visual completa da sua agência, desde logo até materiais promocionais.
              </p>
              <ul className="turvia-service-features">
                <li>Logo e marca profissional</li>
                <li>Materiais gráficos</li>
                <li>Identidade digital</li>
                <li>Manual da marca</li>
              </ul>
            </div>
          </div>

          <div className="turvia-services-cta">
            <button
              onClick={() => {
                handleCTAClick('Vamos Conversar Sobre Seu Projeto', 'services');
                handleContactFunnelOpen("completo", "services_cta");
              }}
              className="turvia-services-cta-button"
            >
              <FaRocket />
              Vamos Conversar Sobre Seu Projeto
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="homepage-features">
        <div className="homepage-features-container">
          <h2 className="homepage-features-title">
            Como Transformamos Sua Agência Digitalmente
          </h2>

          <div className="homepage-features-tabs">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`homepage-features-tab ${
                  activeFeature === index
                    ? "homepage-features-tab-active"
                    : "homepage-features-tab-inactive"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.title}
              </button>
            ))}
          </div>

          <div className="homepage-feature-card">
            <div className="homepage-feature-content">
              <div className="homepage-feature-icon-container">
                <div className="homepage-feature-icon">
                  {features[activeFeature].icon}
                </div>
              </div>
              <div className="homepage-feature-text">
                <h3 className="homepage-feature-name">
                  {features[activeFeature].title}
                </h3>
                <p className="homepage-feature-description">
                  {features[activeFeature].description}
                </p>
                <button
                  className="homepage-feature-button"
                  onClick={() => openContactFunnel("completo")}
                >
                  Vamos Conversar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview Section */}
      <section className="homepage-system-overview">
        <div className="homepage-system-container">
          <h2 className="homepage-system-title">
            Como funciona nosso sistema integrado
          </h2>

          <div className="homepage-system-cards">
            <div className="homepage-system-card">
              <div className="homepage-system-card-icon">
                <FaGlobe />
              </div>
              <h3>Site Personalizado</h3>
              <p>
                Seu site com design exclusivo para apresentar serviços, destinos
                e pacotes promocionais.
              </p>
              <button
                className="homepage-system-card-button"
                onClick={() => openContactFunnel("basico")}
              >
                Solicitar Site
              </button>
            </div>

            <div className="homepage-system-card">
              <div className="homepage-system-card-icon">
                <FaUsers />
              </div>
              <h3>Dashboard do Proprietário</h3>
              <p>
                Controle completo da operação: finanças, relatórios,
                funcionários e desempenho geral.
              </p>
              <button
                className="homepage-system-card-button"
                onClick={() => openContactFunnel("completo")}
              >
                Ver Demo
              </button>
            </div>

            <div className="homepage-system-card">
              <div className="homepage-system-card-icon">
                <FaCar />
              </div>
              <h3>Portal do Motorista</h3>
              <p>
                Aplicativo dedicado para motoristas com agenda de serviços,
                navegação e gestão de pagamentos.
              </p>
              <button
                className="homepage-system-card-button"
                onClick={() => openContactFunnel("completo")}
              >
                Conhecer
              </button>
            </div>

            <div className="homepage-system-card">
              <div className="homepage-system-card-icon">
                <FaUmbrellaBeach />
              </div>
              <h3>Área do Cliente</h3>
              <p>
                Espaço para clientes agendarem serviços, acompanharem reservas e
                histórico de viagens.
              </p>
              <button
                className="homepage-system-card-button"
                onClick={() => openContactFunnel("completo")}
              >
                Experimentar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="homepage-clients">
        <div className="homepage-clients-container">
          <h2 className="homepage-clients-title">
            Agências que confiam na Turvia
          </h2>

          <div className="homepage-clients-row">
            <div className="homepage-clients-track">
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="homepage-client-slide">
                  <div className="homepage-client-card">
                    <div className="homepage-client-logo-container">
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="homepage-client-logo"
                      />
                    </div>
                    <p className="homepage-client-name">{client.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="homepage-clients-row">
            <div className="homepage-clients-track homepage-clients-track-reverse">
              {[...clients.reverse(), ...clients].map((client, index) => (
                <div key={index} className="homepage-client-slide">
                  <div className="homepage-client-card">
                    <div className="homepage-client-logo-container">
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="homepage-client-logo"
                      />
                    </div>
                    <p className="homepage-client-name">{client.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Management Section */}
      <section className="homepage-social-media">
        <div className="homepage-social-media-container">
          <div className="homepage-social-media-content">
            <div className="homepage-social-media-left">
              <h2 className="homepage-social-media-title">
                <FaRocket className="title-icon" />
                Gerenciamento de Redes Sociais!
              </h2>
              <p className="homepage-social-media-subtitle">
                Deixe que nossa equipe especializada cuide das redes sociais da sua agência 
                enquanto você foca no que faz de melhor: atender seus clientes.
              </p>
              <div className="homepage-social-media-benefits">
                <div className="benefit-item">
                  <FaCheck className="benefit-icon" />
                  <span>Conteúdo visual profissional dos destinos</span>
                </div>
                <div className="benefit-item">
                  <FaCheck className="benefit-icon" />
                  <span>Campanhas direcionadas para seu público</span>
                </div>
                <div className="benefit-item">
                  <FaCheck className="benefit-icon" />
                  <span>Relatórios detalhados de performance</span>
                </div>
                <div className="benefit-item">
                  <FaCheck className="benefit-icon" />
                  <span>Engajamento e interação 24/7</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Central acima dos planos
          <div className="social-media-cta-section">
            <button
              onClick={() => {
                handleCTAClick('Impulsionar Redes Sociais', 'social_media');
                handleSocialMediaFunnelOpen("", "social_media_cta");
              }}
              className="homepage-social-media-cta central"
            >
              <FaBolt className="cta-icon" />
              🚀 Impulsionar Redes Sociais!
            </button>
          </div> */}

          {/* Planos de Preços */}
          <div className="social-pricing-section">
            <div className="homepage-social-media-right">
              <div className="social-pricing-plans">
                <div className="social-plan-card basic-plan">
                  <div className="plan-header">
                    <h3>Plano Básico</h3>
                    <div className="plan-price">
                      <span className="currency">R$</span>
                      <span className="amount">99,99</span>
                      <span className="period">/mês</span>
                    </div>
                  </div>
                  <div className="plan-platforms">
                    <div className="platform-tag instagram">
                      <i className="fab fa-instagram"></i>
                      Instagram
                    </div>
                    <div className="platform-tag facebook">
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </div>
                  </div>
                  <div className="plan-features">
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>15 posts mensais por plataforma</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Stories personalizados</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Conteúdo visual profissional</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Planejamento de conteúdo</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Engajamento e respostas</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Relatório mensal básico</span>
                    </div>
                  </div>
                  <button 
                    className="social-plan-btn"
                    onClick={() => {
                      handleCTAClick('Solicitar Plano Básico', 'social_media_basic');
                      handleSocialMediaFunnelOpen("basic", "social_media_basic_card");
                    }}
                  >
                    <FaRocket /> 🌟 Solicitar Plano Básico!
                  </button>
                </div>

                <div className="social-plan-card premium-plan">
                  <div className="plan-badge">Mais Completo</div>
                  <div className="plan-header">
                    <h3>Plano Premium</h3>
                    <div className="plan-price">
                      <span className="currency">R$</span>
                      <span className="amount">197,99</span>
                      <span className="period">/mês</span>
                    </div>
                  </div>
                  <div className="plan-platforms">
                    <div className="platform-tag instagram">
                      <i className="fab fa-instagram"></i>
                      Instagram
                    </div>
                    <div className="platform-tag facebook">
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </div>
                  </div>
                  <div className="plan-features">
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span><strong>Tudo do Plano Básico +</strong></span>
                    </div>
                    <div className="feature-item premium">
                      <FaBolt className="feature-icon" />
                      <span><strong>Gestão de Tráfego Pago</strong></span>
                    </div>
                    <div className="feature-item premium">
                      <FaBolt className="feature-icon" />
                      <span>Campanhas Facebook/Instagram Ads</span>
                    </div>
                    <div className="feature-item premium">
                      <FaBolt className="feature-icon" />
                      <span>Segmentação avançada de público</span>
                    </div>
                    <div className="feature-item premium">
                      <FaBolt className="feature-icon" />
                      <span>Otimização de conversões</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>25 posts mensais por plataforma</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Relatórios detalhados de ROI</span>
                    </div>
                    <div className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>Suporte prioritário</span>
                    </div>
                  </div>
                  <button 
                    className="social-plan-btn premium"
                    onClick={() => {
                      handleCTAClick('Solicitar Plano Premium', 'social_media_premium');
                      handleSocialMediaFunnelOpen("premium", "social_media_premium_card");
                    }}
                  >
                    <FaBolt /> 🚀 Solicitar Plano Premium!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="homepage-stats">
        <div className="homepage-stats-container">
          <div className="homepage-stats-grid">
            <div className="homepage-stat-card">
              <div className="homepage-stat-icon">
                <FaRocket />
              </div>
              <div className="homepage-stat-number">3+</div>
              <div className="homepage-stat-label">Anos de Experiência</div>
            </div>
            <div className="homepage-stat-card">
              <div className="homepage-stat-icon">
                <FaShieldAlt />
              </div>
              <div className="homepage-stat-number">100%</div>
              <div className="homepage-stat-label">Projetos Entregues</div>
            </div>
            <div className="homepage-stat-card">
              <div className="homepage-stat-icon">
                <FaBolt />
              </div>
              <div className="homepage-stat-number">24/7</div>
              <div className="homepage-stat-label">Suporte Disponível</div>
            </div>
            <div className="homepage-stat-card">
              <div className="homepage-stat-icon">
                <FaStar />
              </div>
              <div className="homepage-stat-number">5.0</div>
              <div className="homepage-stat-label">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="homepage-plans">
        <div className="homepage-plans-container">
          <h2 className="homepage-plans-title">
            Planos para todos os tamanhos de agência
          </h2>
          <p className="homepage-plans-subtitle">
            Escolha a solução ideal para o seu negócio e potencialize suas
            operações
          </p>

          <div className="homepage-plans-grid">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`homepage-plan-card ${
                  plan.featured ? "homepage-plan-card-featured" : ""
                }`}
              >
                {plan.featured && (
                  <div className="homepage-plan-badge">Mais Popular</div>
                )}

                <div className="homepage-plan-content">
                  <div
                    className={`homepage-plan-icon-container ${
                      plan.featured
                        ? "homepage-plan-icon-container-featured"
                        : ""
                    }`}
                  >
                    <span className="homepage-plan-icon">{plan.icon}</span>
                  </div>

                  <h3
                    className={`homepage-plan-name ${
                      plan.featured ? "homepage-plan-name-featured" : ""
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="homepage-plan-price">
                    <span
                      className={`homepage-plan-price-amount ${
                        plan.featured
                          ? "homepage-plan-price-amount-featured"
                          : ""
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="homepage-plan-price-period">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="homepage-plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="homepage-plan-feature">
                        <FaCheck className="homepage-plan-feature-icon" />
                        <span className="homepage-plan-feature-text">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`homepage-plan-button ${
                      plan.featured
                        ? "homepage-plan-button-featured"
                        : "homepage-plan-button-regular"
                    }`}
                    onClick={() => openContactFunnel(plan.name.toLowerCase())}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="homepage-testimonials">
        <div className="homepage-testimonials-container">
          <h2 className="homepage-testimonials-title">
            O que nossos clientes dizem
          </h2>

          <div className="homepage-testimonial-card">
            <div className="homepage-testimonial-content">
              <div className="homepage-testimonial-avatar">
                <img src={BuscarLogo} alt="Cliente" />
              </div>
              <p className="homepage-testimonial-text">
                "Desde que começamos a usar o sistema Turvia, nossa agência
                ficou muito mais organizada nas reservas e com menos erros. O
                suporte também é excelente!"
              </p>
              <div>
                <p className="homepage-testimonial-author">Edinardo Crispim</p>
                <p className="homepage-testimonial-company">
                  20Buscar Vacation Beach
                </p>
              </div>
              <button
                className="homepage-testimonial-button"
                onClick={() => openContactFunnel("completo")}
              >
                Quero resultados similares
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="homepage-cta">
        <div className="homepage-cta-background">
          <div className="homepage-cta-blob homepage-cta-blob-1"></div>
          <div className="homepage-cta-blob homepage-cta-blob-2"></div>
        </div>

        <div className="homepage-cta-content">
          <h2 className="homepage-cta-title">
            Pronto para modernizar sua agência?
          </h2>
          <p className="homepage-cta-text">
            Agende uma demonstração gratuita e descubra como nosso sistema pode
            transformar sua operação. Sem compromisso e adaptado às suas
            necessidades.
          </p>
          <button
            onClick={() => openContactFunnel("completo")}
            className="homepage-cta-button"
          >
            Agendar Demonstração
          </button>
          <p className="homepage-cta-subtext">
            Junte-se às agências que já estão modernizando sua operação com
            nossa plataforma.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="homepage-footer-container">
          <div className="homepage-footer-brand-section">
            <div className="homepage-footer-brand">
              <img
                className="homepage-footer-brand-img"
                src={TurviaLogo}
                alt="Logo Turvia"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="homepage-footer-description">
              Soluções tecnológicas completas para agências de turismo. Sites
              personalizados e sistema de gestão integrado.
            </p>
            <div className="homepage-footer-social">
              <a
                href="https://www.facebook.com/profile.php?id=61560019764963"
                className="homepage-footer-social-link"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="homepage-footer-social-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/Turvia_oficial/"
                className="homepage-footer-social-link"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="homepage-footer-social-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#!" className="homepage-footer-social-link">
                <span className="sr-only">Twitter</span>
                <svg
                  className="homepage-footer-social-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="homepage-footer-links-section">
            <h3 className="homepage-footer-title">Links Rápidos</h3>
            <ul
              className="homepage-footer-links"
              style={{ listStyleType: "none", paddingLeft: 0 }}
            >
              <li>
                <a href="/sobre" className="homepage-footer-link">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="/solucoes" className="homepage-footer-link">
                  Soluções
                </a>
              </li>
              <li>
                <a href="/planos" className="homepage-footer-link">
                  Planos
                </a>
              </li>
              <li>
                <a href="/blog" className="homepage-footer-link">
                  Blog
                </a>
              </li>
              <li>
                <a href="/parceiro" className="homepage-footer-link">
                  Seja um Parceiro
                </a>
              </li>
            </ul>
          </div>

          <div className="homepage-footer-support-section">
            <h3 className="homepage-footer-title">Suporte</h3>
            <ul
              className="homepage-footer-links"
              style={{ listStyleType: "none", paddingLeft: 0 }}
            >
              
              <li>
                <a href="/tutoriais" className="homepage-footer-link">
                  Tutoriais
                </a>
              </li>
              <li>
                <a href="/faq" className="homepage-footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contato" className="homepage-footer-link">
                  Contato
                </a>
              </li>
              <li>
                <a href="/status" className="homepage-footer-link">
                  Status do Sistema
                </a>
              </li>
            </ul>
          </div>

          <div className="homepage-footer-contact-section">
            <h3 className="homepage-footer-title">Contato</h3>
            <ul
              className="homepage-footer-contact"
              style={{ listStyleType: "none", paddingLeft: 0 }}
            >
              <li className="homepage-footer-contact-item">
                <svg
                  className="homepage-footer-contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="homepage-footer-contact-text">
                  contato@Turvia.com.br
                </span>
              </li>
              <li className="homepage-footer-contact-item">
                <svg
                  className="homepage-footer-contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span className="homepage-footer-contact-text">
                  (11) 85 9 9147-0709
                </span>
              </li>
              <li className="homepage-footer-contact-item">
                <svg
                  className="homepage-footer-contact-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="homepage-footer-contact-text">
                  Fortaleza
                  <br />
                  CE
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="homepage-footer-bottom">
          <p className="homepage-footer-copyright">
            © 2025 Turvia. Todos os direitos reservados.<br />
            CNPJ: 62.470.016/0001-15
          </p>
          <div className="homepage-footer-legal">
            <a href="/termos" className="homepage-footer-legal-link">
              Termos de Uso
            </a>
            <a href="/privacidade" className="homepage-footer-legal-link">
              Privacidade
            </a>
            <a href="/cookies" className="homepage-footer-legal-link">
              Cookies
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div className="homepage-whatsapp-button">
        <button
          className="homepage-whatsapp-button-icon"
          onClick={toggleWhatsappNotification}
        >
          <FaWhatsapp className="homepage-whatsapp-icon" />
        </button>

        {/* WhatsApp Notification */}
        {showWhatsappNotification && (
          <div className="homepage-whatsapp-notification">
            <div className="homepage-whatsapp-notification-header">
              <div className="homepage-whatsapp-notification-title">
                <FaWhatsapp className="homepage-whatsapp-notification-title-icon" />
                <span>Atendimento</span>
              </div>
              <button
                className="homepage-whatsapp-notification-close"
                onClick={toggleWhatsappNotification}
              >
                <svg
                  className="homepage-whatsapp-notification-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <p className="homepage-whatsapp-notification-message">
              Olá! Como posso ajudar sua agência hoje?
            </p>
            <button
              className="homepage-whatsapp-notification-button"
              onClick={() =>
                window.open("https://wa.me/5585991470709", "_blank")
              }
            >
              Iniciar Conversa
            </button>
          </div>
        )}

        {/* Social Media Funnel Modal */}
        <SocialMediaFunnel 
          isOpen={isSocialMediaOpen}
          onClose={closeSocialMediaFunnel}
          onSubmit={submitLead}
          initialPlan={selectedPlan}
        />

        {/* Botão Flutuante WhatsApp */}
        <div 
          className="whatsapp-floating-button"
          onClick={() => handleWhatsAppClick('floating')}
          title="Fale conosco no WhatsApp"
        >
          <FaWhatsapp />
        </div>

        {/* WhatsApp Services Modal */}
        {whatsappModalOpen && (
          <div className="whatsapp-modal-overlay" onClick={() => setWhatsappModalOpen(false)}>
            <div className="whatsapp-modal" onClick={e => e.stopPropagation()}>
              <div className="whatsapp-modal-header">
                <h3>Sobre qual assunto você deseja falar?</h3>
                <button 
                  className="whatsapp-modal-close"
                  onClick={() => setWhatsappModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="whatsapp-modal-services">
                {whatsappServices.map((service, index) => (
                  <button
                    key={index}
                    className="whatsapp-service-option"
                    onClick={() => handleWhatsAppServiceClick(service)}
                  >
                    <span className="whatsapp-service-icon">{service.icon}</span>
                    <span className="whatsapp-service-title">{service.title}</span>
                    <FaWhatsapp className="whatsapp-service-arrow" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default HomePage;
