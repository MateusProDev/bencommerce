import React from "react";
import "./Cart.css";


const Cart = ({ items, onRemove, onCheckout, open, onClose }) => (
  <div className={`lojinha-cart-modal${open ? " open" : ""}`}>
    <button className="close-btn" onClick={onClose}>×</button>
    <h3>Carrinho</h3>
    {items.length === 0 ? (
      <p>Seu carrinho está vazio.</p>
    ) : (
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            {item.nome} - {item.qtd} x R$ {item.preco.toFixed(2)}
            <button onClick={() => onRemove(item)}>Remover</button>
          </li>
        ))}
      </ul>
    )}
    {items.length > 0 && (
      <button onClick={onCheckout}>Finalizar Compra</button>
    )}
  </div>
);

export default Cart;