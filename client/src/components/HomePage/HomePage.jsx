import React, { useState, useEffect } from "react";
import {
  FaGlobe,
  FaUsers,
  FaChartLine,
  FaBars,
  FaWhatsapp,
  FaCheck,
  FaStar,
  FaShieldAlt,
  FaBolt,
  FaHome,
  FaCogs,
  FaTags,
  FaEnvelope,
  FaPalette,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useContactFunnel from "../../hooks/useContactFunnel";
import useSocialMediaFunnel from "../../hooks/useSocialMediaFunnel";
import SocialMediaFunnel from "../SocialMediaFunnel/SocialMediaFunnel";
import SEO from "../SEO/SEO";
import TurviaLogo from "../../assets/Turvia.png";
import TurviaSemFundoLogo from "../../assets/TurviaSemFundo.png";
import BuscarLogo from "../../assets/20buscar.png";
import LisboaLogo from "../../assets/lisboa.png";
import VcTurLogo from "../../assets/VcturLogo.png";
import DineiLogo from "../../assets/logodinei.webp";
import NetoLogo from "../../assets/logoneto.jpeg";
import TransferLogo from "../../assets/logotransfer.webp";
import PasseioLegalLogo from "../../assets/logopasseiolegal.png";
import AvaliacaoUm from "../../assets/avaliacaoum.jpeg";
import AvaliacaoDois from "../../assets/avaliacaodois.jpeg";
import { trackEvents, pageView } from "../../utils/analytics";
import "./HomePage.css";

const WHATSAPP_URL = "https://wa.me/5585991470709";

const PLAN_TEASER = [
  {
    name: "Básico",
    tag: "Ideal para começar com anúncios pagos",
    price: "297,90",
    featured: false,
    items: [
      "Campanhas no Facebook/Instagram Ads",
      "Criação de criativos para anúncios",
      "Otimização semanal de campanhas",
      "Relatório mensal de performance",
    ],
  },
  {
    name: "Premium",
    tag: "Maximize resultados com estratégias avançadas",
    price: "497,90",
    featured: true,
    items: [
      "Tudo do plano Básico",
      "Campanhas em Facebook, Instagram e Google",
      "Otimização diária de campanhas",
      "A/B testing e remarketing",
    ],
  },
  {
    name: "Business",
    tag: "Escala máxima com equipe dedicada",
    price: "997,90",
    featured: false,
    items: [
      "Tudo do plano Premium",
      "Remarketing multi-plataforma avançado",
      "Copywriting profissional para anúncios",
      "Reunião mensal estratégica",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Preciso de contrato longo para começar?",
    a: "Não. Você começa com uma demonstração gratuita, sem compromisso, e só segue se fizer sentido para a sua agência.",
  },
  {
    q: "Em quanto tempo vejo resultado nas campanhas?",
    a: "A estrutura das campanhas fica no ar na primeira semana. Os primeiros ajustes de performance normalmente aparecem entre a segunda e a quarta semana, com otimização contínua a partir daí.",
  },
  {
    q: "Vocês atendem agências de qualquer região do Brasil?",
    a: "Sim. O atendimento é remoto, com reuniões online, e já atendemos agências de diferentes estados.",
  },
  {
    q: "Quem cuida do orçamento de mídia?",
    a: "O valor investido em anúncios é pago diretamente por você às plataformas (Meta e Google). A Turvia cuida da gestão, dos criativos e da otimização.",
  },
  {
    q: "Posso trocar de plano depois?",
    a: "Pode, a qualquer momento. Subir ou descer de plano é automático e você não fica preso a um nível.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { openContactFunnel } = useContactFunnel();
  const {
    isOpen: isSocialMediaOpen,
    selectedPlan,
    closeSocialMediaFunnel,
    submitLead,
  } = useSocialMediaFunnel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  const companyName = "Turvia";
  const reviewImages = [AvaliacaoUm, AvaliacaoDois];

  /* Loader curto: espera longa custa conversão de tráfego pago */
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Efeito máquina de escrever no loader */
  useEffect(() => {
    let timeout;
    if (typewriterText.length < companyName.length) {
      timeout = setTimeout(() => {
        setTypewriterText(companyName.slice(0, typewriterText.length + 1));
      }, 130);
    }
    return () => clearTimeout(timeout);
  }, [typewriterText, companyName]);

  /* Navbar com estado ao rolar */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Google Analytics */
  useEffect(() => {
    pageView(window.location.pathname + window.location.search);
  }, []);

  /* Carrossel automático de avaliações */
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviewImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviewImages.length]);

  const reviews = [
    {
      img: AvaliacaoUm,
      name: "Agência parceira",
      role: "Passeios e transfers",
      quote:
        "Estruturaram nossas campanhas do zero e as reservas passaram a chegar com muito mais previsibilidade. O acompanhamento é próximo.",
    },
    {
      img: AvaliacaoDois,
      name: "Agência parceira",
      role: "Receptivo turístico",
      quote:
        "Antes a gente anunciava no escuro. Agora sabemos quanto custa cada reserva e onde vale investir mais.",
    },
  ];

  const clients = [
    { name: "20Buscar", logo: BuscarLogo },
    { name: "Lisboatur", logo: LisboaLogo },
    { name: "VcTur", logo: VcTurLogo },
    { name: "Dinei Tur", logo: DineiLogo },
    { name: "Neto Beach Park", logo: NetoLogo },
    { name: "Transfer Fortaleza Tur", logo: TransferLogo },
    { name: "PasseioLegal", logo: PasseioLegalLogo },
  ];

  const services = [
    {
      icon: <FaGlobe />,
      title: "Tráfego Facebook e Instagram",
      description:
        "Campanhas otimizadas para atingir turistas que já buscam os seus destinos e pacotes.",
      features: [
        "Segmentação avançada de público",
        "Criativos de alta conversão",
        "Remarketing para conversões",
      ],
    },
    {
      icon: <FaChartLine />,
      title: "Tráfego no Google Ads",
      description:
        "Capture o cliente no momento exato em que ele pesquisa pelo destino que você vende.",
      features: [
        "Palavras-chave estratégicas",
        "Anúncios de pesquisa e display",
        "Maximização de ROI",
      ],
      featured: true,
    },
    {
      icon: <FaUsers />,
      title: "Remarketing Multi-plataforma",
      description:
        "Reconquiste quem já demonstrou interesse nos seus pacotes e não fechou a compra.",
      features: [
        "Públicos personalizados",
        "Funil de conversão",
        "Aumento da taxa de conversão",
      ],
    },
    {
      icon: <FaPalette />,
      title: "Criativos de Alta Conversão",
      description:
        "Artes e vídeos profissionais pensados para maximizar cliques e reservas.",
      features: [
        "Design orientado à conversão",
        "A/B testing de criativos",
        "Landing pages otimizadas",
      ],
    },
  ];

  const steps = [
    {
      title: "Diagnóstico gratuito",
      text: "Entendemos sua agência, seus destinos e o que já foi testado em anúncios até agora.",
    },
    {
      title: "Estruturação das campanhas",
      text: "Montamos contas, públicos, criativos e o rastreamento de conversão antes de subir verba.",
    },
    {
      title: "Otimização contínua",
      text: "Acompanhamos CPC, CTR, ROI e custo por reserva, ajustando o que não está performando.",
    },
    {
      title: "Relatórios e escala",
      text: "Você recebe relatórios claros e ampliamos o investimento no que comprovadamente vende.",
    },
  ];

  const stats = [
    { value: "4+", label: "Anos de mercado" },
    { value: "100%", label: "Projetos entregues" },
    { value: "24/7", label: "Suporte disponível" },
    { value: "5.0", label: "Avaliação média" },
  ];

  const handleWhatsAppClick = (location) => {
    trackEvents.whatsappClick(location);
    if (location === "floating") {
      setWhatsappModalOpen(true);
    } else {
      window.open(WHATSAPP_URL, "_blank");
    }
  };

  const whatsappServices = [
    {
      title: "Quero uma demonstração",
      icon: "📅",
      message:
        "Olá! Gostaria de agendar uma demonstração gratuita da gestão de tráfego pago da Turvia.",
    },
    {
      title: "Quero entender os planos",
      icon: "💬",
      message:
        "Olá! Gostaria de entender qual plano da Turvia faz mais sentido para a minha agência de turismo.",
    },
    {
      title: "Quero falar com um especialista",
      icon: "🎯",
      message:
        "Olá! Gostaria de falar com um especialista sobre gestão de tráfego pago para a minha agência.",
    },
  ];

  const handleWhatsAppServiceClick = (service) => {
    const message = encodeURIComponent(service.message);
    window.open(`${WHATSAPP_URL}?text=${message}`, "_blank");
    setWhatsappModalOpen(false);
  };

  const goToDemo = (origin) => {
    trackEvents.ctaClick("Agendar demonstração", origin);
    openContactFunnel("completo");
  };

  const goToPlans = (origin) => {
    trackEvents.ctaClick("Ver planos", origin);
    navigate("/planos");
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <SEO
        title="Turvia - Gestão de Tráfego Pago para Agências de Turismo | Maximize Conversões"
        description="Especialistas em gestão de tráfego pago para agências de turismo. Campanhas otimizadas no Facebook, Instagram e Google Ads para maximizar vendas e reservas."
        keywords="gestão de tráfego pago turismo, anúncios facebook instagram turismo, google ads turismo, tráfego pago agência viagens, marketing digital turismo, conversão turismo, remarketing turismo"
        url="/"
      />

      {showLoader && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-content">
            <div className="typewriter-container">
              <h1 className="typewriter-text">
                {typewriterText}
                <span className="cursor">|</span>
              </h1>
              <p className="loading-subtitle">
                Gestão de tráfego pago para agências de turismo
              </p>
            </div>
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      )}

      <div className="homepage-container">
        {/* ================= NAVBAR ================= */}
        <nav className={`homepage-navbar${scrolled ? " scrolled" : ""}`}>
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

          <ul
            className="homepage-nav-links"
            style={{ listStyleType: "none", paddingLeft: 0 }}
          >
            <li className="homepage-nav-link" onClick={() => navigate("/")}>
              Início
            </li>
            <li className="homepage-nav-link" onClick={() => scrollToSection("solucoes")}>
              Soluções
            </li>
            <li className="homepage-nav-link" onClick={() => goToPlans("navbar")}>
              Planos
            </li>
            <li className="homepage-nav-link" onClick={() => scrollToSection("faq")}>
              Dúvidas
            </li>
            <li
              className="homepage-nav-whatsapp"
              onClick={() => handleWhatsAppClick("navbar")}
              title="Fale conosco no WhatsApp"
            >
              <FaWhatsapp />
              +55 85 99147-0709
            </li>
            <li className="homepage-nav-button" onClick={() => goToDemo("navbar")}>
              Demonstração
            </li>
          </ul>

          <button
            className="homepage-mobile-menu-button toggle-button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              trackEvents.menuClick("mobile_menu_toggle");
            }}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

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
                  <FaHome /> Início
                </li>
                <li
                  className="homepage-mobile-menu-item"
                  onClick={() => scrollToSection("solucoes")}
                >
                  <FaCogs /> Soluções
                </li>
                <li
                  className="homepage-mobile-menu-item"
                  onClick={() => {
                    navigate("/planos");
                    setMobileMenuOpen(false);
                  }}
                >
                  <FaTags /> Planos
                </li>
                <li
                  className="homepage-mobile-menu-item"
                  onClick={() => scrollToSection("faq")}
                >
                  <FaEnvelope /> Dúvidas
                </li>
                <li
                  className="homepage-mobile-menu-whatsapp"
                  onClick={() => {
                    handleWhatsAppClick("mobile_menu");
                    setMobileMenuOpen(false);
                  }}
                >
                  <FaWhatsapp /> Falar no WhatsApp
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* ================= HERO ================= */}
        <section className="turvia-hero" id="inicio">
          <div className="turvia-shell">
            <div className="turvia-hero-inner">
              <div className="turvia-hero-copy">
                <span className="turvia-hero-badge">
                  <span className="dot-live"></span>
                  Mais de 4 anos gerindo tráfego para agências de turismo
                </span>

                <h1 className="turvia-hero-title">
                  Sua agência vende mais quando anuncia para{" "}
                  <span className="highlight">a pessoa certa</span>
                </h1>

                <p className="turvia-hero-subtitle">
                  Gestão de tráfego pago no Facebook, Instagram e Google Ads para
                  agências de turismo que querem previsibilidade de reservas — não
                  só cliques.
                </p>

                <div className="turvia-hero-actions">
                  <button className="turvia-btn-primary" onClick={() => goToDemo("hero")}>
                    Agendar demonstração gratuita
                  </button>
                  <button
                    className="turvia-btn-ghost"
                    onClick={() => scrollToSection("como-funciona")}
                  >
                    Ver como funciona
                  </button>
                </div>

                <div className="turvia-hero-trust">
                  <span>
                    <FaCheck /> Sem compromisso
                  </span>
                  <span>
                    <FaShieldAlt /> Sem fidelidade
                  </span>
                  <span>
                    <FaBolt /> Campanhas no ar em 7 dias
                  </span>
                </div>
              </div>

              <aside className="turvia-hero-card">
                <p className="turvia-hero-card-price">Planos a partir de</p>
                <div className="turvia-hero-card-value">
                  <strong>R$ 297,90</strong>
                  <span>/mês</span>
                </div>

                <ul className="turvia-hero-card-list">
                  <li>
                    <FaCheck /> Campanhas geridas de ponta a ponta
                  </li>
                  <li>
                    <FaCheck /> Criativos e copywriting inclusos
                  </li>
                  <li>
                    <FaCheck /> Relatório de ROI, CPC e conversões
                  </li>
                </ul>

                <button
                  className="turvia-hero-card-cta"
                  onClick={() => goToPlans("hero_card")}
                >
                  Comparar os planos
                </button>
                <p className="turvia-hero-card-note">
                  Você vê o que cada plano entrega antes de decidir.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ================= PROVA SOCIAL ================= */}
        <section className="turvia-proof" aria-label="Agências que confiam na Turvia">
          <div className="turvia-shell">
            <p className="turvia-proof-label">Agências que confiam na Turvia</p>
            <div className="turvia-proof-marquee">
              <div className="turvia-proof-track">
                {[...clients, ...clients].map((client, index) => (
                  <img
                    key={`${client.name}-${index}`}
                    className="turvia-proof-logo"
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SOLUÇÕES ================= */}
        <section className="turvia-section" id="solucoes">
          <div className="turvia-shell">
            <header className="turvia-section-head">
              <span className="turvia-eyebrow">Nossas soluções</span>
              <h2 className="turvia-section-title">Tráfego pago feito para o turismo</h2>
              <p className="turvia-section-sub">
                Estratégias desenhadas para o comportamento de quem compra viagem:
                pesquisa, compara e decide rápido quando o anúncio certo aparece.
              </p>
            </header>

            <div className="turvia-services-grid">
              {services.map((service) => (
                <article
                  className={`turvia-service-card${
                    service.featured ? " is-featured" : ""
                  }`}
                  key={service.title}
                >
                  {service.featured && (
                    <span className="turvia-service-badge">Mais procurado</span>
                  )}
                  <div className="turvia-service-icon">{service.icon}</div>
                  <h3 className="turvia-service-title">{service.title}</h3>
                  <p className="turvia-service-description">{service.description}</p>
                  <ul className="turvia-service-features">
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <FaCheck /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="turvia-service-link"
                    onClick={() => goToDemo(service.title)}
                  >
                    Quero saber mais <FaArrowRight />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= COMO FUNCIONA ================= */}
        <section className="turvia-section turvia-section--alt" id="como-funciona">
          <div className="turvia-shell">
            <header className="turvia-section-head">
              <span className="turvia-eyebrow">Como funciona</span>
              <h2 className="turvia-section-title">
                Do diagnóstico à escala, em quatro passos
              </h2>
              <p className="turvia-section-sub">
                Sem enrolação e sem promessa vaga: você acompanha cada etapa e vê
                os números que importam para a sua agência.
              </p>
            </header>

            <div className="turvia-steps">
              {steps.map((step, index) => (
                <article className="turvia-step" key={step.title}>
                  <div className="turvia-step-num">{index + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <div className="turvia-stats" style={{ marginTop: "2.5rem" }}>
              {stats.map((stat) => (
                <div className="turvia-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PLANOS ================= */}
        <section className="turvia-section" id="planos-home">
          <div className="turvia-shell">
            <header className="turvia-section-head">
              <span className="turvia-eyebrow">Planos</span>
              <h2 className="turvia-section-title">
                Escolha o tamanho do seu próximo mês
              </h2>
              <p className="turvia-section-sub">
                Preço fechado, escopo claro e sem surpresa na fatura. Você pode
                mudar de plano quando quiser.
              </p>
            </header>

            <div className="turvia-plans">
              {PLAN_TEASER.map((plan) => (
                <article
                  className={`turvia-plan${plan.featured ? " is-featured" : ""}`}
                  key={plan.name}
                >
                  {plan.featured && <span className="turvia-plan-flag">Mais popular</span>}
                  <h3 className="turvia-plan-name">{plan.name}</h3>
                  <p className="turvia-plan-tag">{plan.tag}</p>
                  <div className="turvia-plan-price">
                    <strong>R$ {plan.price}</strong>
                    <span>/mês</span>
                  </div>
                  <ul className="turvia-plan-list">
                    {plan.items.map((item) => (
                      <li key={item}>
                        <FaCheck /> {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="turvia-plan-btn"
                    onClick={() => goToPlans(`plan_${plan.name}`)}
                  >
                    Escolher {plan.name}
                  </button>
                </article>
              ))}
            </div>

            <p className="turvia-plans-foot">
              Precisa de algo sob medida?{" "}
              <button onClick={() => goToDemo("plans_foot")}>
                Fale com um especialista
              </button>
            </p>
          </div>
        </section>

        {/* ================= AVALIAÇÕES ================= */}
        <section className="turvia-section turvia-section--alt" id="avaliacoes">
          <div className="turvia-shell">
            <header className="turvia-section-head">
              <span className="turvia-eyebrow">Prova social</span>
              <h2 className="turvia-section-title">
                O que dizem as agências parceiras
              </h2>
            </header>

            <div className="turvia-reviews">
              {reviews.map((review, index) => (
                <article
                  className="turvia-review"
                  key={review.quote}
                  style={{ display: reviewIndex === index ? "block" : "none" }}
                >
                  <div className="turvia-review-stars" aria-label="5 de 5 estrelas">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="turvia-review-quote">“{review.quote}”</p>
                  <div className="turvia-review-author">
                    <img
                      className="turvia-review-avatar"
                      src={review.img}
                      alt={`Avaliação de ${review.name}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <strong>{review.name}</strong>
                      <span>{review.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="turvia-reviews-nav">
              {reviewImages.map((_, index) => (
                <button
                  key={index}
                  className={`turvia-reviews-dot${
                    reviewIndex === index ? " active" : ""
                  }`}
                  onClick={() => setReviewIndex(index)}
                  aria-label={`Ver avaliação ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="turvia-section" id="faq">
          <div className="turvia-shell">
            <header className="turvia-section-head">
              <span className="turvia-eyebrow">Dúvidas frequentes</span>
              <h2 className="turvia-section-title">Antes de você decidir</h2>
            </header>

            <div className="turvia-faq">
              {FAQ_ITEMS.map((item, index) => (
                <article
                  className={`turvia-faq-item${openFaq === index ? " open" : ""}`}
                  key={item.q}
                >
                  <button
                    className="turvia-faq-q"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    aria-expanded={openFaq === index}
                  >
                    {item.q}
                    <FaTimes />
                  </button>
                  {openFaq === index && <div className="turvia-faq-a">{item.a}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="turvia-final-cta">
          <div className="turvia-shell">
            <h2>Pronto para ter previsibilidade de reservas?</h2>
            <p>
              Agende uma demonstração gratuita e veja exatamente onde o seu
              investimento em anúncios está deixando dinheiro na mesa.
            </p>
            <div className="turvia-final-cta-actions">
              <button className="turvia-btn-primary" onClick={() => goToDemo("final_cta")}>
                Agendar demonstração gratuita
              </button>
              <button
                className="turvia-btn-ghost"
                onClick={() => handleWhatsAppClick("final_cta")}
              >
                <FaWhatsapp /> Falar no WhatsApp
              </button>
            </div>
            <p className="turvia-final-cta-note">
              Atendimento remoto para todo o Brasil · Sem compromisso
            </p>
          </div>
        </section>

        {/* ================= RODAPÉ ================= */}
        <footer className="turvia-footer">
          <div className="turvia-shell">
            <div className="turvia-footer-grid">
              <div className="turvia-footer-brand">
                <img src={TurviaLogo} alt="Turvia" loading="lazy" decoding="async" />
                <p>
                  Gestão de tráfego pago e tecnologia para agências de turismo.
                  Estratégia, criativos e otimização para transformar visitantes em
                  reservas.
                </p>
                <div className="turvia-footer-social">
                  <a
                    href="https://www.facebook.com/profile.php?id=61560019764963"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook da Turvia"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/Turvia_oficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram da Turvia"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp da Turvia"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>

              <div className="turvia-footer-col">
                <h4>Links rápidos</h4>
                <ul>
                  <li onClick={() => navigate("/sobre")}>Sobre nós</li>
                  <li onClick={() => navigate("/solucoes")}>Soluções</li>
                  <li onClick={() => navigate("/planos")}>Planos</li>
                  <li onClick={() => navigate("/blog")}>Blog</li>
                  <li onClick={() => navigate("/parceiro")}>Seja um parceiro</li>
                </ul>
              </div>

              <div className="turvia-footer-col">
                <h4>Suporte</h4>
                <ul>
                  <li onClick={() => navigate("/tutoriais")}>Tutoriais</li>
                  <li onClick={() => navigate("/faq")}>FAQ</li>
                  <li onClick={() => openContactFunnel()}>Contato</li>
                  <li onClick={() => navigate("/status")}>Status do sistema</li>
                </ul>
              </div>

              <div className="turvia-footer-col">
                <h4>Contato</h4>
                <ul>
                  <li>
                    <a href="mailto:contato@turvia.com.br">contato@turvia.com.br</a>
                  </li>
                  <li>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      +55 85 99147-0709
                    </a>
                  </li>
                  <li>Fortaleza — CE</li>
                </ul>
              </div>
            </div>

            <div className="turvia-footer-legal">
              <p className="turvia-footer-copy">
                © {new Date().getFullYear()} Turvia Tecnologia — CNPJ
                62.470.016/0001-15. Todos os direitos reservados. É proibida a
                reprodução total ou parcial deste site, do conteúdo e das marcas
                aqui apresentadas sem autorização prévia por escrito.
              </p>
              <div className="turvia-footer-legalrow">
                <a onClick={() => navigate("/termos")}>Termos de Uso</a>
                <a onClick={() => navigate("/privacidade")}>Política de Privacidade</a>
                <a onClick={() => navigate("/cookies")}>Cookies</a>
              </div>
            </div>
          </div>
        </footer>

        {/* CTA fixo no mobile */}
        <div className="turvia-mobile-cta">
          <button className="mc-primary" onClick={() => goToDemo("mobile_bar")}>
            Agendar demonstração
          </button>
          <button
            className="mc-secondary"
            onClick={() => handleWhatsAppClick("mobile_bar")}
          >
            WhatsApp
          </button>
        </div>

        {/* WhatsApp flutuante */}
        <button
          className="turvia-whatsapp-float"
          onClick={() => handleWhatsAppClick("floating")}
          aria-label="Fale conosco no WhatsApp"
          title="Fale conosco no WhatsApp"
        >
          <FaWhatsapp />
        </button>

        {/* Modal WhatsApp */}
        {whatsappModalOpen && (
          <div
            className="whatsapp-modal-overlay"
            onClick={() => setWhatsappModalOpen(false)}
          >
            <div className="whatsapp-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="whatsapp-modal-close"
                onClick={() => setWhatsappModalOpen(false)}
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
              <h3 className="whatsapp-modal-title">Como podemos ajudar?</h3>
              <div className="whatsapp-modal-services">
                {whatsappServices.map((service) => (
                  <button
                    key={service.title}
                    className="whatsapp-modal-service"
                    onClick={() => handleWhatsAppServiceClick(service)}
                  >
                    <span className="whatsapp-modal-icon">{service.icon}</span>
                    <span>{service.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <SocialMediaFunnel
          isOpen={isSocialMediaOpen}
          onClose={closeSocialMediaFunnel}
          onSubmit={submitLead}
          plan={selectedPlan}
        />
      </div>
    </>
  );
};

export default HomePage;
