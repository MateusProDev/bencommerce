import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import React, { useEffect, useState, useRef } from "react";
import NavBar from "./NavBar/NavBar";
import SideMenu from "./SideMenu/SideMenu";
import Cart from "./Cart/Cart";
import ProductSection from "./ProductSection/ProductSection";
import Footer from "./Footer/Footer";
import Banner from "./Banner/Banner";
import "./Lojinha.css";
import { Route, useNavigate, useParams } from "react-router-dom";

const Lojinha = ({
  lojaId,
  logoUrl,
  menuItems = [],
  footerInfo = {},
  initialCart = [],
}) => {
  const [cart, setCart] = useState(initialCart);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const categoriasRefs = useRef({});
  const [nomeLoja, setNomeLoja] = useState("");
  const [bannerImages, setBannerImages] = useState([]);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (!lojaId) return;
    const lojaRef = doc(db, "lojas", lojaId);

    // Listener para atualizar as categorias em tempo real
    const unsubscribeCategorias = onSnapshot(lojaRef, (doc) => {
      if (doc.exists()) {
        const lojaData = doc.data();
        setNomeLoja(lojaData.nome || "");
        // Ajuste para pegar banners do Firestore
        if (lojaData.bannerImages) {
          setBannerImages(Array.isArray(lojaData.bannerImages)
            ? lojaData.bannerImages.map(b => b.url || b)
            : Object.values(lojaData.bannerImages).map(b => b.url));
        } else {
          setBannerImages([]);
        }
        setCategorias(lojaData.categorias || []); // Atualiza as categorias
      }
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribeCategorias();
  }, [lojaId]);

  useEffect(() => {
    if (!lojaId) return;
    const q = query(collection(db, `lojas/${lojaId}/produtos`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Produtos recebidos do Firestore:", produtos);
      // Agrupa produtos por categoria
      const agrupados = {};
      produtos.forEach(prod => {
        if (Array.isArray(prod.categorias) && prod.categorias.length > 0) {
          prod.categorias.forEach(catId => {
            if (!agrupados[catId]) agrupados[catId] = [];
            agrupados[catId].push(prod);
          });
        } else {
          if (!agrupados["sem-categoria"]) agrupados["sem-categoria"] = [];
          agrupados["sem-categoria"].push(prod);
        }
      });
      setProdutosPorCategoria(agrupados);

      // Gera categorias dinamicamente a partir dos produtos
      const categoriasDinamicas = Object.keys(agrupados)
        .filter(cat => cat && cat !== "sem-categoria")
        .map(cat => ({ id: cat, nome: cat }));
      setCategorias(categoriasDinamicas);
    });
    return () => unsubscribe();
  }, [lojaId]);

  const scrollToCategoria = (catId) => {
    if (categoriasRefs.current[catId]) {
      categoriasRefs.current[catId].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  console.log("Categorias:", categorias);
  console.log("Produtos agrupados:", produtosPorCategoria);

  return (
    <div className="lojinha-container">
      <NavBar
        logoUrl={logoUrl}
        onMenuClick={handleMenuToggle}
        onCartClick={handleCartToggle}
        cartCount={cart.reduce((sum, item) => sum + (item.qtd || 1), 0)}
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
          onClose={handleCartToggle} // Troque para handleCartToggle
        />
      )}

      {/* Banner logo abaixo do NavBar */}
      {bannerImages?.length > 0 && <Banner banners={bannerImages} />}

      <div className="lojinha-categorias-scroll">
        {categorias.map(cat => (
          <button
            key={cat.id}
            className="lojinha-categoria-btn"
            onClick={() => navigate(`/${slug}/categoria/${encodeURIComponent(cat.id)}`)}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      <main className="lojinha-main">
        {categorias.map(cat => (
          <section key={cat.id} ref={el => categoriasRefs.current[cat.id] = el} className="lojinha-categoria-section">
            <h2>{cat.nome}</h2>
            <ProductSection
              title={cat.nome}
              products={produtosPorCategoria[cat.id] || []}
              onAddToCart={handleAddToCart}
            />
          </section>
        ))}
        {produtosPorCategoria["sem-categoria"] && (
          <section>
            <h2>Outros Produtos</h2>
            <ProductSection
              title="Outros Produtos"
              products={produtosPorCategoria["sem-categoria"]}
              onAddToCart={handleAddToCart}
            />
          </section>
        )}
      </main>

      <Footer info={footerInfo} />
    </div>
  );
};

export default Lojinha;
