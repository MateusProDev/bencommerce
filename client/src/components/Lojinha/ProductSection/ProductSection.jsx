import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductSection.css";

const ProductSection = ({ title, products, onAddToCart }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <section className="lojinha-product-section">
      <h2>{title}</h2>
      <div className="lojinha-products">
        {products.map((prod) => (
          <div key={prod.id} className="lojinha-product-card">
            <img
              src={prod.images?.[0] || "/placeholder-product.jpg"}
              alt={prod.name}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/${slug}/produto/${prod.slug}`)}
            />
            <div>{prod.name}</div>
            <div>R$ {Number(prod.price).toFixed(2)}</div>
            <button onClick={() => onAddToCart(prod)}>Adicionar</button>
            <button
              onClick={() => navigate(`/${slug}/produto/${prod.slug}`)}
            >
              Ver mais detalhes
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;