import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./CategoriaPage.css";

const SkeletonCard = () => (
  <div className="categoria-produto-card skeleton">
    <div className="categoria-produto-img skeleton-img" />
    <div className="categoria-produto-nome skeleton-line" />
    <div className="categoria-produto-preco skeleton-line" />
    <div className="categoria-produto-btn skeleton-btn" />
  </div>
);

const CategoriaPage = () => {
  const { slug, categoria } = useParams();
  const [lojaId, setLojaId] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // Estado para a pesquisa

  // Carrossel drag
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function fetchLojaIdAndProdutos() {
      setLoading(true);
      const lojaSnap = await getDocs(query(collection(db, "lojas"), where("slug", "==", slug)));
      if (!lojaSnap.empty) {
        const lojaId = lojaSnap.docs[0].id;
        setLojaId(lojaId);

        // Busca produtos da categoria (case insensitive)
        const produtosSnap = await getDocs(query(
          collection(db, `lojas/${lojaId}/produtos`),
          where("category", "==", categoria.toLowerCase())
        ));

        // Adicione este filtro e ordenação:
        const produtosFiltrados = produtosSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(prod => prod.ativo !== false) // Só ativos
          .sort((a, b) => {
            if (b.prioridade === true && !a.prioridade) return 1;
            if (a.prioridade === true && !b.prioridade) return -1;
            return 0;
          });

        setProdutos(produtosFiltrados);
      }
      setLoading(false);
    }
    fetchLojaIdAndProdutos();
  }, [slug, categoria]);

  // Funções de drag para carrossel
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDragging.current = false; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Touch events
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };
  const handleTouchEnd = () => { isDragging.current = false; };
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Badge de desconto
  const getDiscount = (price, anchorPrice) => {
    if (!anchorPrice || !price) return 0;
    return Math.round(((anchorPrice - price) / anchorPrice) * 100);
  };

  return (
    <div className="categoria-page-container">
      <h1 className="categoria-titulo">Categoria: {categoria}</h1>
      <input
        type="text"
        className="categoria-pesquisa-input"
        placeholder="Pesquisar produto nesta categoria..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div
        className="categoria-produtos-carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : produtos
              .filter(produto => produto.name.toLowerCase().includes(search.toLowerCase())) // Filtro de pesquisa
              .map(produto => {
              const desconto = getDiscount(produto.price, produto.anchorPrice);
              return (
                <div className="categoria-produto-card" key={produto.id}>
                  {desconto > 0 && (
                    <span className="categoria-produto-desconto">{desconto}% OFF</span>
                  )}
                  <img
                    src={produto.images?.[0] || "/placeholder-product.jpg"}
                    alt={produto.name}
                    className="categoria-produto-img"
                  />
                  <div className="categoria-produto-nome">{produto.name}</div>
                  <div className="categoria-produto-preco">
                    {produto.anchorPrice && (
                      <span className="categoria-produto-preco-antigo">
                        R$ {Number(produto.anchorPrice).toFixed(2)}
                      </span>
                    )}
                    R$ {Number(produto.price).toFixed(2)}
                  </div>
                  <button className="categoria-produto-btn">Adicionar ao carrinho</button>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CategoriaPage;