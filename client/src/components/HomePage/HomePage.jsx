import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes, FaRocket, FaChartLine, FaShieldAlt, FaStore, FaBoxes, FaCreditCard } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsappClick = () => {
    window.open("https://wa.me/+5585991470709", "_blank");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handlePlanClick = (plan) => {
    navigate("/criar-loja", { state: { selectedPlan: plan } });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCreateStoreClick = () => {
    navigate("/criar-loja");
  };

  // Configurações do carrossel
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Dados dos clientes
  const clients = [
    { id: 1, name: "Loja do João", logo: "https://via.placeholder.com/100" },
    { id: 2, name: "Moda Feminina", logo: "https://via.placeholder.com/100" },
    { id: 3, name: "Eletrônicos Tech", logo: "https://via.placeholder.com/100" },
    { id: 4, name: "Casa & Decoração", logo: "https://via.placeholder.com/100" },
    { id: 5, name: "Esportes & Lazer", logo: "https://via.placeholder.com/100" },
  ];

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          StoreSync
        </div>
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li onClick={handleLoginClick}>Login</li>
          <li onClick={handleCreateStoreClick}>Criar Loja</li>
        </ul>
        <button
          className={`navbar-toggle ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Sua Loja Virtual em Minutos</h1>
        <p>Comece a vender online hoje mesmo com a plataforma mais simples do mercado</p>
        <button onClick={handleCreateStoreClick}>Criar minha loja agora</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Por que escolher o StoreSync?</h2>
        <div className="cards">
          <div className="card">
            <div className="card-icon">
              <FaRocket size={40} />
            </div>
            <h3>Criação Instantânea</h3>
            <p>Seu site e loja prontos em segundos, com painel de controle completo.</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <FaChartLine size={40} />
            </div>
            <h3>Crescimento Garantido</h3>
            <p>Ferramentas profissionais para escalar suas vendas.</p>
          </div>
          <div className="card">
            <div className="card-icon">
              <FaShieldAlt size={40} />
            </div>
            <h3>Segurança Total</h3>
            <p>Proteção de dados e transações seguras para você e seus clientes.</p>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="clients">
        <h2>Nossos Clientes</h2>
        <div className="clients-slider">
          <Slider {...sliderSettings}>
            {clients.map(client => (
              <div key={client.id} className="client-slide">
                <img src={client.logo} alt={client.name} />
                <p>{client.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans">
        <h2>Escolha o Plano Perfeito</h2>
        <div className="plans-grid">
          <div className="plan">
            <div className="plan-icon">
              <FaStore size={30} />
            </div>
            <h3>Free</h3>
            <p>Ideal para começar</p>
            <p className="price">R$ 0/mês</p>
            <ul className="features">
              <li><FaBoxes /> Até 30 produtos</li>
              <li><FaCreditCard /> Pagamentos online</li>
              <li><FaChartLine /> Relatórios básicos</li>
            </ul>
            <button onClick={() => handlePlanClick('free')}>Começar grátis</button>
          </div>
          <div className="plan destaque">
            <div className="plan-icon">
              <FaChartLine size={30} />
            </div>
            <h3>Plus</h3>
            <p>Para quem quer vender mais</p>
            <p className="price">R$ 39,90/mês</p>
            <ul className="features">
              <li><FaBoxes /> Até 300 produtos</li>
              <li><FaCreditCard /> Todos os métodos de pagamento</li>
              <li><FaChartLine /> Relatórios completos</li>
            </ul>
            <button onClick={() => handlePlanClick('plus')}>Assinar Plus</button>
          </div>
          <div className="plan">
            <div className="plan-icon">
              <FaRocket size={30} />
            </div>
            <h3>Premium</h3>
            <p>Recursos avançados</p>
            <p className="price">R$ 99,90/mês</p>
            <ul className="features">
              <li><FaBoxes /> Produtos ilimitados</li>
              <li><FaCreditCard /> Checkout premium</li>
              <li><FaChartLine /> Relatórios avançados</li>
            </ul>
            <button onClick={() => handlePlanClick('premium')}>Assinar Premium</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Pronto para começar a vender online?</h2>
        <button onClick={handleCreateStoreClick}>Criar minha loja agora</button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StoreSync</h3>
            <p>A solução completa para seu e-commerce</p>
          </div>
          <div className="footer-section">
            <h3>Links</h3>
            <ul>
              <li onClick={handleLoginClick}>Login</li>
              <li onClick={handleCreateStoreClick}>Criar Loja</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contato</h3>
            <p>suporte@storesync.com</p>
            <p>(85) 99147-0709</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 StoreSync - Todos os direitos reservados</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <div
        className={`whatsapp-button ${showNotification ? "show" : ""}`}
        onClick={handleWhatsappClick}
        aria-label="Fale conosco pelo WhatsApp"
      >
        <FaWhatsapp size={30} color="#fff" />
        {showNotification && (
          <span className="notification">Precisa de ajuda? Estamos aqui!</span>
        )}
      </div>
    </div>
  );
};

export default HomePage;