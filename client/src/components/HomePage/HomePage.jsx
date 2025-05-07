import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000); // Exibe a notificação após 3 segundos

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, []);

  const handleWhatsappClick = () => {
    window.open("https://wa.me/+5585991470709", "_blank"); // Substitua pelo seu número de WhatsApp
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Alterna o estado do menu
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          StoreSync
        </div>
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => navigate("/login")}>Login</li>
          <li onClick={() => navigate("/criar-loja")}>Criar Loja</li>
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
        <h1>StoreSync</h1>
        <p>Crie sua loja virtual em segundos. Sem complicação. 100% automático.</p>
        <button onClick={() => navigate("/login")}>Criar minha loja agora</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Por que escolher o StoreSync?</h2>
        <div className="cards">
          <div className="card">
            <h3>Criação Instantânea</h3>
            <p>Seu site e loja prontos em segundos, com painel de controle completo.</p>
          </div>
          <div className="card">
            <h3>Planos flexíveis</h3>
            <p>Comece grátis e evolua com planos acessíveis para vender mais.</p>
          </div>
          <div className="card">
            <h3>Controle Total</h3>
            <p>Gerencie produtos, categorias, pedidos e muito mais no seu painel.</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans">
        <h2>Planos</h2>
        <div className="plans-grid">
          <div className="plan">
            <h3>Free</h3>
            <p>Ideal para começar</p>
            <p>R$ 0/mês</p>
            <button onClick={() => navigate("/login")}>Começar grátis</button>
          </div>
          <div className="plan destaque">
            <h3>Plus</h3>
            <p>Para quem quer vender mais</p>
            <p>R$ 39,90/mês</p>
            <button onClick={() => navigate("/checkout?plan=Plus&amount=39.90")}>Assinar Plus</button>
          </div>
          <div className="plan">
            <h3>Premium</h3>
            <p>Recursos avançados e relatórios</p>
            <p>R$ 99,90/mês</p>
            <button onClick={() => navigate("/checkout?plan=Premium&amount=99.90")}>Assinar Premium</button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <p>© 2025 StoreSync - Todos os direitos reservados</p>
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