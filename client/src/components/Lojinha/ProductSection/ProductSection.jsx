import React from "react";
import "./ProductSection.css";

const ProductSection = ({ title, products, onAddToCart }) => (
  <section className="lojinha-product-section">
    <h2>{title}</h2>
    <div className="lojinha-products">
      {products.map((prod) => (
        <div key={prod.id} className="lojinha-product-card">
          <img src={prod.imageUrl} alt={prod.nome} />
          <div>{prod.nome}</div>
          <div>R$ {prod.preco.toFixed(2)}</div>
          <button onClick={() => onAddToCart(prod)}>Adicionar</button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductSection;