import React from "react";
import "./Cart.css";

const Cart = ({
  items,
  onRemove,
  onIncrement,
  onDecrement,
  onCheckout,
  open,
  onClose,
  userPlan = "free",
  whatsappNumber,
  onCheckoutTransparent,
  enableWhatsappCheckout,
  enableMpCheckout,
  cartTotal
}) => (
  <div className={`lojinha-cart-modal${open ? " open" : ""}`}>
    <button className="close-btn" onClick={onClose}>×</button>
    <h3>Carrinho</h3>
    {items.length === 0 ? (
      <p>Seu carrinho está vazio.</p>
    ) : (
      <ul>
        {items.map((item, idx) => (
          <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {item.name} - R$ {Number(item.price).toFixed(2)}
            <button onClick={() => onDecrement(item.id)} style={{ marginLeft: 8 }}>-</button>
            <span style={{ minWidth: 24, textAlign: "center" }}>{item.qtd}</span>
            <button onClick={() => onIncrement(item.id)}>+</button>
            <button onClick={() => onRemove(item.id)} style={{ marginLeft: 8 }}>Remover</button>
          </li>
        ))}
      </ul>
    )}
    <div style={{ marginTop: 16, fontWeight: "bold" }}>
      Total: R$ {cartTotal.toFixed(2)}
    </div>
    {items.length > 0 && (
      <div style={{ marginTop: 16 }}>
        {enableWhatsappCheckout && (
          <button
            onClick={() => {
              const msg = encodeURIComponent(
                "Olá! Gostaria de comprar: " +
                items.map(i => `${i.qtd}x ${i.name} (R$${Number(i.price).toFixed(2)})`).join(", ") +
                `. Total: R$ ${cartTotal.toFixed(2)}`
              );
              window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
            }}
          >
            Finalizar pelo WhatsApp
          </button>
        )}
        {enableMpCheckout && (userPlan === "plus" || userPlan === "premium") && (
          <button onClick={onCheckoutTransparent} style={{ marginLeft: 8 }}>
            Finalizar pelo Cartão (Mercado Pago)
          </button>
        )}
      </div>
    )}
  </div>
);

export default Cart;