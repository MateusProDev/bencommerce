import React, { useState } from "react";
import "./Cart.css"; // Certifique-se de que o CSS existe
import { Add, Remove, Close, DeleteOutline } from '@mui/icons-material';
import CheckoutModal from '../../CheckoutModal/CheckoutModal'; // Seu modal de WPP

const Cart = ({
  items,
  onRemoveItemCompletely,
  onIncrement,
  onDecrement,
  open,
  onClose,
  whatsappNumber,
  onCheckoutTransparent, // <-- Esta é a função importante que vem do Lojinha.js
  enableWhatsappCheckout,
  enableMpCheckout,     // <-- Controla se o botão MP aparece
  cartTotal
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

  // Função para abrir o modal do WhatsApp
  const handleOpenWhatsappModal = () => {
    if (whatsappNumber) {
      setIsCheckoutModalOpen(true);
    } else {
      alert("O checkout via WhatsApp não está configurado para esta loja.");
    }
  };

  // Sua função existente para enviar o pedido via WhatsApp
  const handleSubmitToWhatsapp = (formData) => {
    // ... (sua lógica de montar a mensagem e abrir o WhatsApp) ...
    let message = "Pedido Confirmado:\n\n";
    message += `*Cliente:* ${formData.name}\n`;
    message += `*Telefone:* ${formData.phone}\n\n`;
    message += "*Itens do Pedido:*\n";
    items.forEach(item => {
      message += `• ${item.qtd}x ${item.name} (${formatCurrency(item.price)}) - Subtotal: ${formatCurrency(item.price * item.qtd)}\n`;
    });
    message += `\n*Total Geral: ${formatCurrency(cartTotal)}*\n\n`;
    if (formData.deliveryOption !== 'retirada') {
      message += "*Endereço de Entrega:*\n";
      message += `${formData.street}, Nº ${formData.number}\n`;
      if (formData.complement) message += `Complemento: ${formData.complement}\n`;
      message += `Bairro: ${formData.neighborhood}\n`;
      message += `Cidade: ${formData.city} - ${formData.state}\n`;
      message += `CEP: ${formData.cep}\n\n`;
    }
    message += `*Opção de Entrega:* ${formData.deliveryOption.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}\n`;
    message += `*Forma de Pagamento:* ${formData.paymentMethod.replace(/^\w/, c => c.toUpperCase())}\n`;
    if (formData.observation) {
      message += `\n*Observações:*\n${formData.observation}\n`;
    }
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
    setIsCheckoutModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className={`cart-overlay-min${open ? " open" : ""}`} onClick={onClose}></div>
      <div className={`cart-modal-min${open ? " open" : ""}`}>
        <div className="cart-header-min">
          <h4>Meu Carrinho 🛒</h4>
          <button className="cart-close-btn-min" onClick={onClose}>
            <Close />
          </button>
        </div>
        <div className="cart-body-min">
          {items.length === 0 ? (
            <div className="cart-empty-min">
              <p>Seu carrinho está vazio.</p>
              <span>Adicione produtos para vê-los aqui.</span>
              <button className="btn-back-min" onClick={onClose}>
                Voltar a Comprar
              </button>
            </div>
          ) : (
            <ul className="cart-items-list-min">
              {items.map((item) => (
                <li key={item.id || item.name} className="cart-item-min"> {/* Adicionado fallback para key */}
                  <div className="cart-item-info-min">
                    <span className="cart-item-name-min">{item.name}</span>
                    <span className="cart-item-price-min">
                      {item.qtd} x {formatCurrency(item.price)}
                    </span>
                  </div>
                  <div className="cart-item-controls-min">
                    <div className="cart-item-qty-min">
                      <button onClick={() => onDecrement(item.id)} aria-label="Diminuir">
                        <Remove style={{ fontSize: '16px' }} />
                      </button>
                      <span>{item.qtd}</span>
                      <button onClick={() => onIncrement(item.id)} aria-label="Aumentar">
                        <Add style={{ fontSize: '16px' }}/>
                      </button>
                    </div>
                    <span className="cart-item-subtotal-min">
                      {formatCurrency(item.price * item.qtd)}
                    </span>
                  </div>
                  <button
                    className="cart-item-remove-min"
                    onClick={() => onRemoveItemCompletely(item.id)}
                    aria-label="Remover item"
                  >
                    <DeleteOutline style={{ fontSize: '20px' }} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-footer-min">
            <div className="cart-total-min">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            {/* Botão WhatsApp */}
            {enableWhatsappCheckout && whatsappNumber && (
              <button
                className="btn-checkout-min btn-whatsapp-min"
                onClick={handleOpenWhatsappModal}
              >
                Finalizar via WhatsApp
              </button>
            )}
            {/* Botão Mercado Pago */}
            {enableMpCheckout && ( // Só mostra se a loja habilitou
              <button
                className="btn-checkout-min btn-mp-min"
                onClick={onCheckoutTransparent} // <-- ELE APENAS CHAMA A FUNÇÃO QUE VEIO DO PAI
              >
                Pagar com Mercado Pago
              </button>
            )}
          </div>
        )}
      </div>

      {/* Renderiza o Modal de Checkout do WhatsApp */}
      {whatsappNumber && (
          <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            onSubmit={handleSubmitToWhatsapp}
            cartItems={items}
            cartTotal={cartTotal}
          />
      )}
    </>
  );
};

export default Cart;