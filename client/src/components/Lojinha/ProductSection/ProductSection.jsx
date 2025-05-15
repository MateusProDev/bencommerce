import React from "react";
import "./ProductSection.css";

const ProductSection = ({ title, products, onAddToCart }) => (
  <section className="lojinha-product-section">
    <h2>{title}</h2>
    <div className="lojinha-products">
      {products.map((prod) => (
        <div key={prod.id} className="lojinha-product-card">
          <img src={prod.images?.[0] || "/placeholder-product.jpg"} alt={prod.name} />
          <div>{prod.name}</div>
          <div>R$ {Number(prod.price).toFixed(2)}</div>
          <button onClick={() => onAddToCart(prod)}>Adicionar</button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductSection;