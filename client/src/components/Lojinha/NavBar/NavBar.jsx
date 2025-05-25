import React from "react";
import { ShoppingBag, Menu } from '@mui/icons-material';
import "./NavBar.css";

const NavBar = ({
  logoUrl,
  nomeLoja,
  exibirLogo = true,
  onMenuClick,
  onCartClick,
  cartCount
}) => {
  console.log("NavBar - exibirLogo:", exibirLogo, "logoUrl:", logoUrl, "nomeLoja:", nomeLoja);
  
  return (
    <div className="lojinha-navbar">
      <div className="lojinha-navbar-left">
        {exibirLogo ? (
          logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo da Loja"
              className="lojinha-navbar-logo"
              style={{
                maxHeight: '60px',
                maxWidth: '200px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div className="lojinha-navbar-no-logo">
              Sem logo
            </div>
          )
        ) : (
          <div className="lojinha-navbar-title">
            {nomeLoja || "Minha Loja"}
          </div>
        )}
      </div>
      
      <div className="lojinha-navbar-right">
        <button 
          className="lojinha-navbar-cart-btn"
          onClick={onCartClick}
          aria-label="Carrinho de compras"
        >
          <ShoppingBag sx={{ fontSize: 32 }} />
          {cartCount > 0 && (
            <span className="lojinha-navbar-cart-count">
              {cartCount}
            </span>
          )}
        </button>
        
        <button 
          className="lojinha-navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu sx={{ fontSize: 32 }} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;