import React from "react";
import "./NavBar.css";

const NavBar = ({ logoUrl, onMenuClick, onCartClick, cartCount }) => {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo da Loja" className="navbar-logo" />
        ) : (
          <span className="placeholder-logo">Minha Loja</span>
        )}
      </div>
      
      <div className="navbar-right">
        <button 
          className="cart-icon" 
          onClick={onCartClick} 
          aria-label="Abrir carrinho"
        >
          🛒 
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        
        <button 
          className="menu-toggle" 
          onClick={onMenuClick} 
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default NavBar;