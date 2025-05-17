import React from "react";
import "./ProductSection.css";

const ProductSection = ({ title, products, onAddToCart }) => (
  <section className="lojinha-product-section">
    <h2>{title}</h2>
    <div className="lojinha-products">
      {products.map((prod) => (
        <div key={prod.id} className="lojinha-product-card">
          <img src={prod.images?.[0] || "/placeholder-product.jpg"} alt={prod.name} />
          <div className="lojinha-product-title">{prod.name}</div>
          <div className="lojinha-product-price">R$ {Number(prod.price).toFixed(2)}</div>
          <div className="lojinha-product-stock">Estoque: {Number(prod.stock) ?? 0}</div>
          <button
            onClick={() => onAddToCart(prod)}
            disabled={Number(prod.stock) === 0}
            className="lojinha-product-add-btn"
          >
            {Number(prod.stock) === 0 ? "Esgotado" : "Adicionar"}
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductSection;