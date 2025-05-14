import React, { useState } from "react";
import NavBar from "./NavBar/NavBar";
import SideMenu from "./SideMenu/SideMenu";
import Cart from "./Cart/Cart";
import Banner from "./Banner/Banner";
import ProductSection from "./ProductSection/ProductSection";
import Footer from "./Footer/Footer";
import "./Lojinha.css";

const Lojinha = ({
  logoUrl,
  menuItems = [],
  banners = [],
  sections = [],
  footerInfo = {},
  initialCart = [],
}) => {
  // Estados locais para gerenciar o carrinho e menus
  const [cart, setCart] = useState(initialCart);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Cálculo da quantidade total de itens no carrinho
  const cartCount = cart.reduce((sum, item) => sum + (item.qtd || 1), 0);
  
  // Handlers para o menu lateral
  const handleMenuToggle = () => {
    setSideMenuOpen(!sideMenuOpen);
    if (cartOpen) setCartOpen(false); // Fecha o carrinho se estiver aberto
  };
  
  const handleSideMenuClose = () => {
    setSideMenuOpen(false);
  };
  
  const handleSideMenuSelect = (item) => {
    console.log("Menu item selecionado:", item);
    setSideMenuOpen(false);
    // Implementar navegação ou ação conforme necessário
  };
  
  // Handlers para o carrinho
  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
    if (sideMenuOpen) setSideMenuOpen(false); // Fecha o menu lateral se estiver aberto
  };
  
  const handleCartClose = () => {
    setCartOpen(false);
  };
  
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      // Verifica se o produto já existe no carrinho
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Atualiza a quantidade se o produto já existe
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, qtd: (item.qtd || 1) + 1 } 
            : item
        );
      } else {
        // Adiciona novo produto ao carrinho
        return [...prevCart, { ...product, qtd: 1 }];
      }
    });
    
    // Opcionalmente abre o carrinho ao adicionar um item
    setCartOpen(true);
  };
  
  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => {
      // Filtra o item a ser removido ou reduz sua quantidade
      const itemToUpdate = prevCart.find(item => item.id === productId);
      
      if (itemToUpdate && itemToUpdate.qtd > 1) {
        // Reduz a quantidade se for mais de 1
        return prevCart.map(item => 
          item.id === productId 
            ? { ...item, qtd: item.qtd - 1 } 
            : item
        );
      } else {
        // Remove o item completamente
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };
  
  const handleCheckout = () => {
    console.log("Prosseguindo para checkout com os itens:", cart);
    // Implementar lógica de checkout
    alert("Redirecionando para checkout!");
    setCartOpen(false);
  };

  return (
    <div className="lojinha-container">
      <NavBar
        logoUrl={logoUrl}
        onMenuClick={handleMenuToggle}
        onCartClick={handleCartToggle}
        cartCount={cartCount}
      />
      
      {sideMenuOpen && (
        <SideMenu
          open={sideMenuOpen}
          menuItems={menuItems}
          onClose={handleSideMenuClose}
          onSelect={handleSideMenuSelect}
        />
      )}
      
      {cartOpen && (
        <Cart
          items={cart}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          open={cartOpen}
          onClose={handleCartClose}
        />
      )}
      
      <main className="lojinha-main">
        {banners && banners.length > 0 && <Banner banners={banners} />}
        
        {sections.map((section, index) => (
          <ProductSection
            key={`section-${index}`}
            title={section.title}
            products={section.products}
            onAddToCart={handleAddToCart}
          />
        ))}
      </main>
      
      <Footer info={{
        nomeLoja: "Minha Lojinha",
        endereco: "Rua Exemplo, 123",
        whatsapp: "(11) 99999-9999",
        email: "contato@minhaloja.com",
        instagram: "https://instagram.com/minhaloja",
        facebook: "https://facebook.com/minhaloja",
        copyright: "© 2025 Minha Lojinha"
      }} />
    </div>
  );
};

export default Lojinha;