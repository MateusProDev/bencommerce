import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Garanta que este caminho está correto
import React, { useEffect, useState, useRef } from "react";
import NavBar from "./NavBar/NavBar";
import SideMenu from "./SideMenu/SideMenu";
import Cart from "./Cart/Cart";
import ProductSection from "./ProductSection/ProductSection";
import Footer from "./Footer/Footer"; // Importa o Footer
import Banner from "./Banner/Banner";
import "./Lojinha.css";
import { useNavigate, useParams } from "react-router-dom";

// Função Debounce (pode ser movida para um arquivo utilitário se preferir)
function debounce(func, delay) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

const Lojinha = ({
  lojaId,
  logoUrl, // Prop inicial, pode ser sobrescrita pelo Firestore
  menuItems = [],
  // footerInfo não é mais necessário se buscamos tudo
}) => {
  const [cart, setCart] = useState(() => {
    // Tenta carregar o carrinho do localStorage ao iniciar
    const saved = localStorage.getItem("lojinha_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [imgCategorias, setImgCategorias] = useState([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [nomeLoja, setNomeLoja] = useState("Sua Loja"); // Valor padrão
  const [bannerImages, setBannerImages] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exibirLogo, setExibirLogo] = useState(true);
  const [logoUrlState, setLogoUrlState] = useState(logoUrl || "");
  const navigate = useNavigate();
  const { slug } = useParams(); // Pega o 'slug' da URL (se estiver usando)
  const [storeData, setStoreData] = useState(null); // Armazena todos os dados da loja

  // Efeito para buscar dados iniciais da loja
  useEffect(() => {
    async function fetchStoreData() {
      if (!lojaId) {
        console.warn("lojaId não foi fornecido ao componente Lojinha.");
        return;
      }
      try {
        const lojaRef = doc(db, "lojas", lojaId);
        const lojaSnap = await getDoc(lojaRef);
        if (lojaSnap.exists()) {
          const lojaData = lojaSnap.data();
          setStoreData(lojaData); // Armazena todos os dados
          setNomeLoja(lojaData.nome || "Minha Loja");
          setLogoUrlState(lojaData.logoUrl || logoUrl || "");
          setExibirLogo(lojaData.exibirLogo !== false);

          // Processa banners (com lógica aprimorada)
          if (lojaData.bannerImages) {
            const banners = Array.isArray(lojaData.bannerImages)
              ? lojaData.bannerImages.map(b => (typeof b === 'string' ? b : b.url))
              : typeof lojaData.bannerImages === 'object'
                ? Object.values(lojaData.bannerImages).map(b => (typeof b === 'string' ? b : b.url))
                : [];
            setBannerImages(banners.filter(Boolean)); // Filtra URLs vazias/inválidas
          } else {
            setBannerImages([]);
          }

          // Processa categorias e imagens
          setCategorias(lojaData.categorias || []);
          setImgCategorias(lojaData.imgcategorias || []);

        } else {
          console.warn(`Loja com ID ${lojaId} não encontrada.`);
          // Aqui você pode navegar para 404 ou mostrar uma mensagem
        }
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error);
      }
    }
    fetchStoreData();
  }, [lojaId, logoUrl]); // Depende do lojaId e logoUrl inicial

  // Efeito para ouvir produtos em tempo real
  useEffect(() => {
    if (!lojaId) return;

    const q = query(collection(db, `lojas/${lojaId}/produtos`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

      // Filtra e ordena produtos
      const produtosAtivos = produtos.filter(p => p.ativo !== false);
      const produtosOrdenados = [...produtosAtivos].sort((a, b) => {
        if (a.prioridade === true && (b.prioridade !== true)) return -1;
        if ((a.prioridade !== true) && b.prioridade === true) return 1;
        // Adicione outros critérios de ordenação se necessário
        return 0;
      });

      // Agrupa produtos por categoria
      const agrupados = {};
      produtosOrdenados.forEach(prod => {
        // Assume que o campo de categoria é 'category'
        // Assume que o nome do produto é 'name' (verifique se é 'nome' no seu DB)
        const cat = prod.category || "Outros"; // Categoria padrão
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(prod);
      });

      setProdutosPorCategoria(agrupados);
    }, (error) => {
      console.error("Erro ao buscar produtos em tempo real:", error);
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar
  }, [lojaId]);

  // Efeito para persistir o carrinho no localStorage
  useEffect(() => {
    localStorage.setItem("lojinha_cart", JSON.stringify(cart));
  }, [cart]);

  // Funções de toggle para menu e carrinho
  const handleMenuToggle = () => {
    setSideMenuOpen(prev => !prev);
    if (cartOpen) setCartOpen(false);
  };
  const handleSideMenuClose = () => setSideMenuOpen(false);
  const handleCartToggle = () => {
    setCartOpen(prev => !prev);
    if (sideMenuOpen) setSideMenuOpen(false);
  };

  // Funções de manipulação do carrinho
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qtd: (item.qtd || 0) + 1 } : item
        );
      }
      return [...prevCart, { ...product, qtd: 1 }];
    });
    setCartOpen(true);
  };
  const handleRemoveItemFromCartCompletely = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  const handleIncrement = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, qtd: (item.qtd || 0) + 1 } : item
      )
    );
  };
  const handleDecrement = (productId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === productId ? { ...item, qtd: Math.max(0, (item.qtd || 0) - 1) } : item
        )
        .filter(item => item.qtd > 0) // Remove se a quantidade for 0
    );
  };
  const handleCheckout = () => {
    console.log("Prosseguindo para checkout com os itens:", cart);
    setCartOpen(false);
    // Navegue para a página de checkout ou abra o modal
  };

  // Cálculos do carrinho
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qtd || 0)), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.qtd || 0), 0);

  // Função para obter sugestões de busca
  const getSuggestions = (input) => {
    if (!input || input.trim() === "") return [];
    const inputLower = input.toLowerCase().trim();

    // Sugestões de categorias
    const catSuggestions = categorias
      .filter(cat => (cat.nome || cat).toLowerCase().includes(inputLower))
      .map(cat => ({
        type: "categoria",
        value: cat.id || cat.nome || cat,
        label: cat.nome || cat
      }));

    // Sugestões de produtos (assume que o campo é 'name')
    let prodSuggestions = [];
    Object.entries(produtosPorCategoria).forEach(([catId, prods]) => {
      prods.forEach(prod => {
        // !!! VERIFIQUE SE O CAMPO É 'name' OU 'nome' NO SEU FIREBASE !!!
        if (prod.name && prod.name.toLowerCase().includes(inputLower)) {
          prodSuggestions.push({
            type: "produto",
            value: prod.id,
            label: prod.name,
            categoria: catId
          });
        }
      });
    });

    const uniqueProdSuggestions = Array.from(new Map(prodSuggestions.map(item => [item.value, item])).values());
    return [...catSuggestions, ...uniqueProdSuggestions].slice(0, 10);
  };

  // Debounce para a busca
  const debouncedSetSearch = useRef(
    debounce(newVal => {
      const suggestions = getSuggestions(newVal);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    }, 300)
  ).current;

  // Handler para mudança no input de busca
  const handleSearchChange = e => {
    const val = e.target.value;
    setSearch(val);
    debouncedSetSearch(val);
  };

  // Função para lidar com clique na sugestão
  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearch(suggestion.label); // Preenche a busca

    // Navega ou filtra - Adicione sua lógica aqui
    if (suggestion.type === 'categoria') {
        // Se o slug for necessário na URL, use-o
        // navigate(`/${slug}/categoria/${encodeURIComponent(suggestion.label)}`);
        // Ou, se a busca já filtra, apenas preencher pode ser suficiente
    } else if (suggestion.type === 'produto') {
        // Talvez rolar para o produto ou ir para a página do produto?
        // const element = document.getElementById(`product-${suggestion.value}`);
        // if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para renderizar os produtos (normal ou busca)
  const renderProducts = () => {
    const searchTermLower = search.trim().toLowerCase();

    // Se não houver busca, mostra tudo
    if (!searchTermLower) {
      return categorias.map(cat => {
        const nome = typeof cat === "string" ? cat : cat.nome;
        const key = (typeof cat === 'object' && cat.id) ? cat.id : nome;
        const produtos = produtosPorCategoria[nome] || [];
        return produtos.length > 0 ? (
          <ProductSection
            key={key}
            id={`category-title-${key}`}
            title={nome}
            products={produtos}
            onAddToCart={handleAddToCart}
            navigate={navigate}
          />
        ) : null;
      });
    }

    // Se houver busca, filtra
    let foundSomething = false;
    const searchResults = categorias.map(cat => {
      const nome = typeof cat === "string" ? cat : cat.nome;
      const key = (typeof cat === 'object' && cat.id) ? cat.id : nome;

      // Filtra produtos pelo nome (Verifique se é 'name' ou 'nome')
      const produtosFiltrados = (produtosPorCategoria[nome] || [])
        .filter(prod => prod.name && prod.name.toLowerCase().includes(searchTermLower));

      // Verifica se a categoria bate com a busca
      const categoryMatches = nome.toLowerCase().includes(searchTermLower);

      if (produtosFiltrados.length > 0 || categoryMatches) {
        foundSomething = true;
        // Se a categoria bate, mostra todos os produtos dela
        // Se não, mostra apenas os filtrados
        const productsToShow = categoryMatches ? (produtosPorCategoria[nome] || []) : produtosFiltrados;

        return productsToShow.length > 0 ? (
            <ProductSection
                key={key}
                id={`category-title-${key}`}
                title={nome}
                products={productsToShow}
                onAddToCart={handleAddToCart}
                navigate={navigate}
            />
        ) : null;
      }
      return null;
    }).filter(Boolean); // Remove nulos

    return foundSomething ? searchResults : (
      <div className="lojinha-no-results">
        Nenhum produto ou categoria encontrada para "{search}".
      </div>
    );
  };


  return (
    <div className="lojinha-container">
      <NavBar
        logoUrl={logoUrlState}
        nomeLoja={nomeLoja}
        exibirLogo={exibirLogo}
        onMenuClick={handleMenuToggle}
        onCartClick={handleCartToggle}
        cartCount={cartItemCount}
      />

      {/* SideMenu com Overlay */}
      {sideMenuOpen && (
        <>
          <div className="overlay" onClick={handleSideMenuClose}></div>
          <SideMenu
            open={sideMenuOpen}
            menuItems={menuItems}
            onClose={handleSideMenuClose}
          />
        </>
      )}

      {/* Cart com Overlay */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={handleCartToggle}></div>
          <Cart
            items={cart}
            onRemoveItemCompletely={handleRemoveItemFromCartCompletely}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onCheckout={handleCheckout}
            open={cartOpen}
            onClose={handleCartToggle}
            userPlan={storeData?.plano || "free"}
            whatsappNumber={storeData?.whatsappNumber || ""}
            onCheckoutTransparent={() => navigate(`/checkout-transparente?loja=${lojaId}`)}
            enableWhatsappCheckout={storeData?.enableWhatsappCheckout ?? true}
            enableMpCheckout={storeData?.enableMpCheckout ?? false}
            cartTotal={cartTotal}
          />
        </>
      )}

      {/* Banner */}
      {bannerImages?.length > 0 && (
        <div className="lojinha-banner-wrapper">
          <Banner banners={bannerImages} />
        </div>
      )}

      {/* Categorias */}
      {categorias.length > 0 && (
        <div className="lojinha-categorias-scroll-wrapper">
          <div className="lojinha-categorias-scroll">
            {categorias.map(cat => {
              const nome = typeof cat === "string" ? cat : cat.nome;
              const key = (typeof cat === 'object' && cat.id) ? cat.id : nome;
              const imgCat = imgCategorias.find(c => c.nome === nome);
              return (
                <button
                  key={key}
                  className="lojinha-categoria-btn"
                  // Ação ao clicar: rolar para a seção ou navegar
                  onClick={() => {
                     const element = document.getElementById(`category-title-${key}`);
                     if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     } else {
                        // Opcional: navegar se a seção não estiver visível (ex: outra página)
                        // navigate(`/${slug}/categoria/${encodeURIComponent(nome)}`);
                     }
                  }}
                  title={`Ver categoria ${nome}`}
                >
                  <img
                    src={imgCat?.imagem || "/placeholder-categoria.jpg"}
                    alt={nome}
                    className="lojinha-categoria-icone"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-categoria.jpg";
                    }}
                    loading="lazy"
                  />
                  <span className="lojinha-categoria-nome">{nome}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="lojinha-search-container">
        <input
          type="search"
          className="lojinha-pesquisa-input"
          placeholder="Pesquisar produtos ou categorias..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => search.length > 0 && setShowSuggestions(true)}
          // Aumenta o tempo para permitir o clique na sugestão
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          aria-label="Pesquisar produtos ou categorias"
        />
        <span className="lojinha-search-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="lojinha-suggestions-list" role="listbox">
            {suggestions.map((s, idx) => (
              <li
                key={s.value + idx}
                className="lojinha-suggestion-item"
                role="option"
                aria-selected={false}
                // Usa onMouseDown para executar antes do onBlur
                onMouseDown={() => handleSuggestionClick(s)}
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

      {/* Conteúdo Principal (Produtos) */}
      <main className="lojinha-main">
          {renderProducts()}
      </main>

      {/* Footer */}
      <Footer
        nomeLoja={nomeLoja}
        // Passa os dados ACESSANDO DENTRO DE 'storeData.footer'
        footerData={{
          descricao: storeData?.footer?.descricao || "", // <--- CORRIGIDO
          social: {
            instagram: storeData?.footer?.instagram || "", // <--- CORRIGIDO
            facebook: storeData?.footer?.facebook || "",  // <--- CORRIGIDO
            twitter: storeData?.footer?.twitter || "",    // <--- CORRIGIDO
            youtube: storeData?.footer?.youtube || ""     // <--- CORRIGIDO
          },
          extras: storeData?.footer?.extras || [] // <--- CORRIGIDO (caminho e nome)
        }}
        showSocial={true}
        showExtras={true}
      />
    </div>
  );
};

export default Lojinha;