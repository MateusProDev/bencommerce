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
import { useNavigate, useParams } from "react-router-dom";

const Lojinha = ({
  lojaId,
  logoUrl,
  menuItems = [],
  footerInfo = {},
  initialCart = [],
}) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("lojinha_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const categoriasRefs = useRef({});
  const [nomeLoja, setNomeLoja] = useState("");
  const [bannerImages, setBannerImages] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exibirLogo, setExibirLogo] = useState(true);
  const [logoUrlState, setLogoUrlState] = useState(logoUrl || "");
  const navigate = useNavigate();
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
  async function fetchStoreData() {
    if (!lojaId) return;
    const lojaRef = doc(db, "lojas", lojaId);
    const lojaSnap = await getDoc(lojaRef);
    if (lojaSnap.exists()) {
      const lojaData = lojaSnap.data();
      setStoreData(lojaData);
      setNomeLoja(lojaData.nome || "Minha Loja");
      setLogoUrlState(lojaData.logoUrl || "");
      setExibirLogo(lojaData.exibirLogo !== false);
    }
  }
  fetchStoreData();
}, [lojaId]);

  useEffect(() => {
  if (!lojaId) return;
  const lojaRef = doc(db, "lojas", lojaId);

  // Listener para atualizar as categorias em tempo real
  const unsubscribeCategorias = onSnapshot(lojaRef, (doc) => {
    if (doc.exists()) {
      const lojaData = doc.data();
      setNomeLoja(lojaData.nome || "");
      
      // CORREÇÃO: Atualizar também o estado exibirLogo
      setExibirLogo(lojaData.exibirLogo !== false);
      setLogoUrlState(lojaData.logoUrl || "");
      
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
      
      // Agrupa produtos por categoria
      const agrupados = {};
      const categoriasUnicas = new Set(); // Usar Set para garantir valores únicos
      
      // Supondo que 'produtos' é o array de todos os produtos da loja
      const produtosAtivos = produtos.filter(p => p.ativo !== false); // Mostra só ativos

      // Para priorizar, ordene antes de agrupar:
      const produtosOrdenados = [...produtosAtivos].sort((a, b) => {
        if (b.prioridade === true && !a.prioridade) return 1;
        if (a.prioridade === true && !b.prioridade) return -1;
        return 0;
      });
      
      produtosOrdenados.forEach(prod => {
        const cat = prod.category || "outros";
        if (!agrupados[cat]) {
          agrupados[cat] = [];
          if (cat !== "outros") {
            categoriasUnicas.add(cat);
          }
        }
        agrupados[cat].push(prod);
      });

      setProdutosPorCategoria(agrupados);
      
      // Converte Set para array de objetos únicos
      const categoriasArray = Array.from(categoriasUnicas).map(cat => ({
        id: cat,
        nome: cat.charAt(0).toUpperCase() + cat.slice(1) // Capitaliza primeira letra
      }));
      
      setCategorias(categoriasArray);
    });

    return () => unsubscribe();
  }, [lojaId]);

  useEffect(() => {
    localStorage.setItem("lojinha_cart", JSON.stringify(cart));
  }, [cart]);

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
  
  const handleIncrement = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, qtd: (item.qtd || 1) + 1 } : item
      )
    );
  };

  const handleDecrement = (productId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === productId ? { ...item, qtd: item.qtd - 1 } : item
        )
        .filter(item => item.qtd > 0)
    );
  };

  const handleCheckout = () => {
    console.log("Prosseguindo para checkout com os itens:", cart);
    // Implementar lógica de checkout
    alert("Redirecionando para checkout!");
    setCartOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qtd || 1)), 0);

  const getSuggestions = (input) => {
    if (!input) return [];
    const inputLower = input.toLowerCase();

    // Sugestões de categorias
    const catSuggestions = categorias
      .filter(cat => (cat.nome || cat).toLowerCase().includes(inputLower))
      .map(cat => ({
        type: "categoria",
        value: cat.id || cat.nome || cat,
        label: cat.nome || cat
      }));

    // Sugestões de produtos
    let prodSuggestions = [];
    Object.entries(produtosPorCategoria).forEach(([catId, prods]) => {
      prods.forEach(prod => {
        if (prod.name.toLowerCase().includes(inputLower)) {
          prodSuggestions.push({
            type: "produto",
            value: prod.id,
            label: prod.name,
            categoria: catId
          });
        }
      });
    });

    // Remove duplicados de produto
    prodSuggestions = prodSuggestions.filter(
      (v, i, a) => a.findIndex(t => t.value === v.value) === i
    );

    return [...catSuggestions, ...prodSuggestions];
  };

  console.log("Categorias:", categorias);
  console.log("Produtos agrupados:", produtosPorCategoria);

  return (
    <div className="lojinha-container">
      <NavBar
        logoUrl={logoUrlState}
        nomeLoja={nomeLoja}
        exibirLogo={exibirLogo} // Este já está correto
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
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onCheckout={handleCheckout}
          open={cartOpen}
          onClose={handleCartToggle}
          userPlan={storeData?.plano || "free"}
          whatsappNumber={storeData?.whatsappNumber || ""}
          onCheckoutTransparent={() => {
            // Redirecione para página de checkout transparente
            navigate(`/checkout-transparente?loja=${lojaId}`);
          }}
          enableWhatsappCheckout={storeData?.enableWhatsappCheckout ?? true}
          enableMpCheckout={storeData?.enableMpCheckout ?? false}
          cartTotal={cartTotal}
        />
      )}

      {/* Banner logo após seus outros handlers */}
      {bannerImages?.length > 0 && <Banner banners={bannerImages} />}

      <div className="lojinha-categorias-scroll">
        {categorias.map(cat => {
          const nome = typeof cat === "string" ? cat : cat.nome;
          const imgCat = (storeData?.imgcategorias || []).find(c => c.nome === nome);
          return (
            <button
              key={cat.id || nome}
              className="lojinha-categoria-btn"
              onClick={() => navigate(`/${slug}/categoria/${encodeURIComponent(cat.id || nome)}`)}
            >
              <img
                src={imgCat?.imagem || "/placeholder-categoria.jpg"}
                alt={nome}
                className="lojinha-categoria-icone"
              />
              <span className="lojinha-categoria-nome">{nome}</span>
            </button>
          );
        })}
      </div>

      {/* Campo de pesquisa */}
      <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 370,
  margin: "0 auto 24px auto",
  position: "relative"
}}>
  <input
    type="text"
    className="lojinha-pesquisa-input"
    placeholder="Pesquisar produto ou categoria..."
    value={search}
    onChange={e => {
      const val = e.target.value;
      setSearch(val);
      if (val.length > 0) {
        setSuggestions(getSuggestions(val));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }}
    onFocus={() => {
      if (search.length > 0) setShowSuggestions(true);
    }}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
    style={{ paddingRight: 38 }}
  />
  <span style={{
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#1976d2",
    pointerEvents: "none"
  }}>
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7"/>
      <line x1="15.5" y1="15.5" x2="20" y2="20"/>
    </svg>
  </span>
  {showSuggestions && suggestions.length > 0 && (
    <ul className="lojinha-suggestions-list" style={{ left: 0, right: 0 }}>
      {suggestions.map((s, idx) => (
        <li
          key={s.type + s.value + idx}
          className="lojinha-suggestion-item"
          onMouseDown={() => {
            setSearch(s.label);
            setShowSuggestions(false);
          }}
        >
          <span className="lojinha-suggestion-type">
            {s.type === "categoria" ? "Categoria" : "Produto"}:
          </span>
          {s.label}
        </li>
      ))}
    </ul>
  )}
</div>

      <main className="lojinha-main">
        {(() => {
  // Se search vazio, mostra tudo
  if (!search.trim()) {
    return categorias.map(cat => (
      <section key={cat.id} ref={el => categoriasRefs.current[cat.id] = el} className="lojinha-categoria-section">
        <ProductSection
          title={cat.nome}
          products={produtosPorCategoria[cat.id] || []}
          onAddToCart={handleAddToCart}
          categoriaId={cat.id}
        />
      </section>
    ));
  }

  // Se search bate com categoria
  const catMatch = categorias.find(cat =>
    (cat.nome || cat).toLowerCase() === search.trim().toLowerCase()
  );
  if (catMatch) {
    return (
      <section key={catMatch.id} ref={el => categoriasRefs.current[catMatch.id] = el} className="lojinha-categoria-section">
        <ProductSection
          title={catMatch.nome}
          products={produtosPorCategoria[catMatch.id] || []}
          onAddToCart={handleAddToCart}
          categoriaId={catMatch.id}
        />
      </section>
    );
  }

  // Se search bate com produto(s)
  let found = false;
  return categorias.map(cat => {
    const filtered = (produtosPorCategoria[cat.id] || []).filter(prod =>
      prod.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) found = true;
    return filtered.length > 0 ? (
      <section key={cat.id} ref={el => categoriasRefs.current[cat.id] = el} className="lojinha-categoria-section">
        <ProductSection
          title={cat.nome}
          products={filtered}
          onAddToCart={handleAddToCart}
          categoriaId={cat.id}
        />
      </section>
    ) : null;
  }).concat(!found ? (
    <div style={{ textAlign: "center", margin: "2rem 0", color: "#888" }}>
      Nenhum produto ou categoria encontrada.
    </div>
  ) : null);
})()}
      </main>

      <Footer info={footerInfo} />
    </div>
  );
};

export default Lojinha;
