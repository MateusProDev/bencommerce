import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ensure this path is correct
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
  logoUrl, // This is an initial prop, might be overridden by Firestore data
  menuItems = [],
  footerInfo = {},
  // initialCart = [], // initialCart prop is not actively used if localStorage has data
}) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("lojinha_cart");
    // const saved = typeof window !== 'undefined' ? localStorage.getItem("lojinha_cart") : null; // If using SSR/Next.js
    return saved ? JSON.parse(saved) : [];
  });
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [imgCategorias, setImgCategorias] = useState([]);
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [nomeLoja, setNomeLoja] = useState("");
  const [bannerImages, setBannerImages] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exibirLogo, setExibirLogo] = useState(true);
  const [logoUrlState, setLogoUrlState] = useState(logoUrl || "");
  const navigate = useNavigate();
  const { slug } = useParams(); // Assuming 'slug' is used for store identification in URL
  const [storeData, setStoreData] = useState(null);
  // const categoriasRefs = useRef({}); // This ref is declared but not used. Remove if not needed.

  // Busca dados iniciais da loja
  useEffect(() => {
    async function fetchStoreData() {
      if (!lojaId) {
        console.warn("lojaId is not provided to Lojinha component.");
        return;
      }
      try {
        const lojaRef = doc(db, "lojas", lojaId);
        const lojaSnap = await getDoc(lojaRef);
        if (lojaSnap.exists()) {
          const lojaData = lojaSnap.data();
          setStoreData(lojaData);
          setNomeLoja(lojaData.nome || "Minha Loja");
          setLogoUrlState(lojaData.logoUrl || logoUrl || ""); // Prioritize Firestore logo, then prop, then empty
          setExibirLogo(lojaData.exibirLogo !== false);
          
          // Processa banners
          if (lojaData.bannerImages) {
            setBannerImages(
              Array.isArray(lojaData.bannerImages)
                ? lojaData.bannerImages.map(b => (typeof b === 'string' ? b : b.url)) // Handle array of strings or objects
                : typeof lojaData.bannerImages === 'object' 
                    ? Object.values(lojaData.bannerImages).map(b => (typeof b === 'string' ? b : b.url)) // Handle object of objects/strings
                    : []
            );
          } else {
            setBannerImages([]);
          }
          
          // Processa categorias e imagens
          setCategorias(lojaData.categorias || []);
          setImgCategorias(lojaData.imgcategorias || []);
        } else {
          console.warn(`Loja com ID ${lojaId} não encontrada.`);
          // Handle store not found, e.g., navigate to a 404 page or show a message
        }
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error);
        // Handle error, e.g., show an error message to the user
      }
    }
    fetchStoreData();
  }, [lojaId, logoUrl]); // Added logoUrl to dependency array if it can change and should update logoUrlState

  // Listener para produtos em tempo real
  useEffect(() => {
    if (!lojaId) return;
    
    const q = query(collection(db, `lojas/${lojaId}/produtos`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      const produtosAtivos = produtos.filter(p => p.ativo !== false);
      const produtosOrdenados = [...produtosAtivos].sort((a, b) => {
        // Prioridade: true comes first, then sort by any other criteria if needed
        if (a.prioridade === true && (b.prioridade === false || b.prioridade === undefined)) return -1;
        if ((a.prioridade === false || a.prioridade === undefined) && b.prioridade === true) return 1;
        // Add secondary sort criteria if necessary, e.g., by name or date
        // return a.nome.localeCompare(b.nome); 
        return 0;
      });
      
      const agrupados = {};
      produtosOrdenados.forEach(prod => {
        const cat = prod.category || "outros"; // Ensure 'outros' is a valid category name if used
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(prod);
      });
      
      setProdutosPorCategoria(agrupados);
    }, (error) => {
      console.error("Erro ao buscar produtos em tempo real:", error);
    });

    return () => unsubscribe();
  }, [lojaId]);

  // Persiste carrinho no localStorage
  useEffect(() => {
    // if (typeof window !== 'undefined') { // If using SSR/Next.js
    localStorage.setItem("lojinha_cart", JSON.stringify(cart));
    // }
  }, [cart]);

  const handleMenuToggle = () => {
    setSideMenuOpen(prev => !prev);
    if (cartOpen) setCartOpen(false);
  };
  
  const handleSideMenuClose = () => setSideMenuOpen(false);
  
  const handleCartToggle = () => {
    setCartOpen(prev => !prev);
    if (sideMenuOpen) setSideMenuOpen(false);
  };
  
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
    setCartOpen(true); // Optionally open cart on add
  };
  
  // This function is for the main "remove item" (X) button in the cart.
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
        .filter(item => item.qtd > 0) // Remove if quantity is 0
    );
  };

  const handleCheckout = () => {
    console.log("Prosseguindo para checkout com os itens:", cart);
    // Here you would typically navigate to a checkout page or open a payment modal
    setCartOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.qtd || 0)), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.qtd || 0), 0);

  const getSuggestions = (input) => {
    if (!input || input.trim() === "") return [];
    const inputLower = input.toLowerCase().trim();

    const catSuggestions = categorias
      .filter(cat => (cat.nome || cat).toLowerCase().includes(inputLower))
      .map(cat => ({
        type: "categoria",
        value: cat.id || cat.nome || cat, // Ensure 'value' is useful for navigation or filtering
        label: cat.nome || cat
      }));

    let prodSuggestions = [];
    Object.entries(produtosPorCategoria).forEach(([catId, prods]) => {
      prods.forEach(prod => {
        if (prod.name.toLowerCase().includes(inputLower)) {
          prodSuggestions.push({
            type: "produto",
            value: prod.id, // Product ID
            label: prod.name,
            categoria: catId // Category this product belongs to
          });
        }
      });
    });

    // A more robust way to remove duplicates if products can appear in multiple categories (not the case here)
    // or if names are not unique across categories (which they should be by ID)
    const uniqueProdSuggestions = Array.from(new Map(prodSuggestions.map(item => [item.value, item])).values());

    return [...catSuggestions, ...uniqueProdSuggestions].slice(0, 10); // Limit suggestions
  };
  
  // Debounce search input
  const debouncedSetSearch = useRef(
    debounce(newVal => {
      if (newVal.length > 0) {
        setSuggestions(getSuggestions(newVal));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300)
  ).current;

  const handleSearchChange = e => {
    const val = e.target.value;
    setSearch(val);
    debouncedSetSearch(val);
  };

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

      {sideMenuOpen && (
        <>
          <div className="overlay" onClick={handleSideMenuClose}></div>
          <SideMenu
            open={sideMenuOpen}
            menuItems={menuItems} // These would be actual navigation links
            onClose={handleSideMenuClose}
          />
        </>
      )}

      {cartOpen && (
        <>
          <div className="overlay" onClick={handleCartToggle}></div>
          <Cart
            items={cart}
            onRemoveItemCompletely={handleRemoveItemFromCartCompletely} // Renamed prop for clarity
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onCheckout={handleCheckout}
            open={cartOpen} // Prop might be redundant if visibility is handled by conditional rendering
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
      
      {bannerImages?.length > 0 && (
        <div className="lojinha-banner-wrapper">
            <Banner banners={bannerImages} />
        </div>
      )}

      {categorias.length > 0 && (
        <div className="lojinha-categorias-scroll-wrapper">
          <div className="lojinha-categorias-scroll">
            {categorias.map(cat => {
              const nome = typeof cat === "string" ? cat : cat.nome;
              // Ensure `cat.id` or a unique identifier for key if `nome` can have duplicates
              const key = (typeof cat === 'object' && cat.id) ? cat.id : nome; 
              const imgCat = imgCategorias.find(c => c.nome === nome);
              return (
                <button
                  key={key}
                  className="lojinha-categoria-btn"
                  onClick={() => navigate(`/${slug}/categoria/${encodeURIComponent(nome)}`)}
                  title={`Ver categoria ${nome}`}
                >
                  <img
                    src={imgCat?.imagem || "/placeholder-categoria.jpg"} // Provide a real placeholder
                    alt={nome} // Alt text should describe the image or category if image is decorative
                    className="lojinha-categoria-icone"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      e.target.src = "/placeholder-categoria.jpg";
                    }}
                    loading="lazy" // Lazy load category images
                  />
                  <span className="lojinha-categoria-nome">{nome}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="lojinha-search-container">
        <input
          type="search" // Use type="search" for semantics and potential browser features (like 'x' to clear)
          className="lojinha-pesquisa-input"
          placeholder="Pesquisar produtos ou categorias..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => search.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Increased timeout slightly
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
                key={s.value + idx} // Use a more unique key
                className="lojinha-suggestion-item"
                role="option"
                aria-selected={false} // This would be managed if using arrow keys for selection
                onMouseDown={() => { // Use onMouseDown to fire before onBlur hides the list
                  setSearch(s.label); // Update search bar with the label
                  setShowSuggestions(false);
                  // Potentially navigate or filter directly based on s.type and s.value here
                  // e.g., if (s.type === 'categoria') navigate(`/${slug}/categoria/${encodeURIComponent(s.label)}`);
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
        {!search.trim() ? (
          categorias.map(cat => {
            const nome = typeof cat === "string" ? cat : cat.nome;
            const key = (typeof cat === 'object' && cat.id) ? cat.id : nome;
            const produtos = produtosPorCategoria[nome] || [];
            return produtos.length > 0 ? (
              <section key={key} className="lojinha-categoria-section" aria-labelledby={`category-title-${key}`}>
                <ProductSection
                  id={`category-title-${key}`} // For aria-labelledby
                  title={nome}
                  products={produtos}
                  onAddToCart={handleAddToCart}
                  // Pass other necessary props to ProductSection, like navigate for "Ver Mais"
                  navigate={navigate} 
                />
              </section>
            ) : null;
          })
        ) : (
          (() => {
            const searchTermLower = search.trim().toLowerCase();
            const catMatch = categorias.find(cat =>
              (cat.nome || cat).toLowerCase() === searchTermLower
            );
            
            if (catMatch) {
              const nome = typeof catMatch === "string" ? catMatch : catMatch.nome;
              const key = (typeof catMatch === 'object' && catMatch.id) ? catMatch.id : nome;
              const produtos = produtosPorCategoria[nome] || [];
              return produtos.length > 0 ? (
                <section key={key} className="lojinha-categoria-section" aria-labelledby={`category-title-${key}`}>
                  <ProductSection
                    id={`category-title-${key}`}
                    title={nome}
                    products={produtos}
                    onAddToCart={handleAddToCart}
                    navigate={navigate}
                  />
                </section>
              ) : (
                <div className="lojinha-no-results">
                  Nenhum produto encontrado na categoria "{nome}".
                </div>
              );
            }
            
            let foundProductsInSection = false;
            const resultados = categorias.map(cat => {
              const nome = typeof cat === "string" ? cat : cat.nome;
              const key = (typeof cat === 'object' && cat.id) ? cat.id : nome;

              const produtosFiltrados = (produtosPorCategoria[nome] || [])
                .filter(prod => prod.name.toLowerCase().includes(searchTermLower));
              
              if (produtosFiltrados.length > 0) foundProductsInSection = true;
              
              return produtosFiltrados.length > 0 ? (
                <section key={key} className="lojinha-categoria-section" aria-labelledby={`category-title-${key}`}>
                  <ProductSection
                    id={`category-title-${key}`}
                    title={nome} // Display original category title
                    products={produtosFiltrados}
                    onAddToCart={handleAddToCart}
                    navigate={navigate}
                  />
                </section>
              ) : null;
            }).filter(Boolean); // Remove null entries for cleaner rendering
            
            return foundProductsInSection ? resultados : (
              <div className="lojinha-no-results">
                Nenhum produto ou categoria encontrada para "{search}".
              </div>
            );
          })()
        )}
      </main>

      <Footer info={footerInfo} />
    </div>
  );
};

export default Lojinha;