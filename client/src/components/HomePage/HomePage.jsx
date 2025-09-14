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
} from "react-icons/fa";
import { 
  HiSparkles, 
  HiLightningBolt, 
  HiTrendingUp 
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useContactFunnel from "../../hooks/useContactFunnel";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { openContactFunnel } = useContactFunnel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWhatsappNotification, setShowWhatsappNotification] =
    useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleWhatsappNotification = () => {
    setShowWhatsappNotification(!showWhatsappNotification);
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
      title: "Site Personalizado",
      description:
        "Desenvolvemos seu site totalmente personalizado com identidade visual única para sua agência",
    },
    {
      icon: <FaUsers />,
      title: "Sistema de Clientes",
      description:
        "Cadastro completo de clientes com histórico de reservas e preferências de viagem",
    },
    {
      icon: <FaCar />,
      title: "Gestão de Motoristas",
      description:
        "Controle completo da frota e motoristas com agenda de serviços e acompanhamento em tempo real",
    },
    {
      icon: <FaChartLine />,
      title: "Dashboard Inteligente",
      description:
        "Acompanhe o desempenho da sua agência com relatórios detalhados e métricas importantes",
    },
    {
      icon: <FaCreditCard />,
      title: "Gestão Financeira",
      description:
        "Controle de pagamentos, comissões e finanças da sua agência de forma integrada",
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
      ctaText: "Contratar Agora",
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
      ctaText: "Testar Grátis",
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
      ctaText: "Falar com Vendas",
      featured: false,
    },
  ];

  const clients = [
    { name: "20Buscar Vacation Beach", logo: "/20buscar.png" },
    { name: "Lisboatur", logo: "/lisboa.png" },
    { name: "20Buscar Vacation Beach", logo: "/20buscar.png" },
    { name: "Lisboatur", logo: "/lisboa.png" },
    { name: "20Buscar Vacation Beach", logo: "/20buscar.png" },
    { name: "Lisboatur", logo: "/lisboa.png" },
    { name: "20Buscar Vacation Beach", logo: "/20buscar.png" },
    { name: "Lisboatur", logo: "/lisboa.png" },
  ];

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div
          className="homepage-navbar-logo"
          onClick={() => navigate("/")}
          title="Turvia — Para agências de Turismo"
        >
          <img
            className="homepage-navbar-logo-img"
            src="/turviasemfundo.png"
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
            Sistema completo para sua agência de turismo
          </h1>
          <p className="homepage-hero-subtitle">
            Site personalizado, gestão de clientes, motoristas e reservas em uma
            única plataforma. Tudo que você precisa para expandir seu negócio.
          </p>
          <div className="homepage-hero-buttons">
            <button
              onClick={() => openContactFunnel("completo")}
              className="homepage-hero-primary-button"
            >
              Solicitar Demonstração
            </button>
            <button
              onClick={() => openContactFunnel("completo")}
              className="homepage-hero-secondary-button"
            >
              Conhecer Soluções
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="homepage-features">
        <div className="homepage-features-container">
          <h2 className="homepage-features-title">
            Sistema três em um para agências de turismo
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
                  Saiba mais
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
                <img src="/20buscar.png" alt="Cliente" />
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
                src="/Turvia.jpg"
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
                window.open("https://wa.me/551133456789", "_blank")
              }
            >
              Iniciar Conversa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
