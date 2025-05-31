import React, { useState } from "react";
import {
  Add,
  Remove,
  Close,
  DeleteOutline,
  WhatsApp,
  CreditCard
} from '@mui/icons-material';
import CheckoutModal from '../../CheckoutModal/CheckoutModal';
import './Cart.css';

const Cart = ({
  items,
  onRemoveItemCompletely,
  onIncrement,
  onDecrement,
  open,
  onClose,
  whatsappNumber,
  onCheckoutTransparent,
  enableWhatsappCheckout,
  enableMpCheckout,
  cartTotal
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleOpenWhatsappModal = () => {
    if (whatsappNumber) {
      setIsCheckoutModalOpen(true);
    } else {
      alert("Checkout via WhatsApp não configurado.");
    }
  };

  const handleSubmitToWhatsapp = (formData) => {
    let message = `*Pedido Confirmado - ${formData.name}*\n\n`;
    message += `*Telefone:* ${formData.phone}\n\n`;
    message += "*Itens do Pedido:*\n";
    
    items.forEach(item => {
      message += `➤ ${item.qtd}x ${item.name}`;
      if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
        message += ` (${Object.values(item.selectedVariants).join(', ')})`;
      }
      message += ` - ${formatCurrency(item.price * item.qtd)}\n`;
    });
    
    message += `\n*Total:* ${formatCurrency(cartTotal)}\n\n`;
    
    if (formData.deliveryOption !== 'retirada') {
      message += "*Endereço de Entrega:*\n";
      message += `${formData.street}, ${formData.number}\n`;
      if (formData.complement) message += `Complemento: ${formData.complement}\n`;
      message += `${formData.neighborhood}\n`;
      message += `${formData.city}/${formData.state}\n`;
      message += `CEP: ${formData.cep}\n\n`;
    }
    
    message += `*Entrega:* ${formData.deliveryOption === 'retirada' ? 'Retirada' : 'Entrega'}\n`;
    message += `*Pagamento:* ${formData.paymentMethod}\n`;
    
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
          <h4>Meu Carrinho ({items.length})</h4>
          <button className="cart-close-btn-min" onClick={onClose}>
            <Close />
          </button>
        </div>
        
        <div className="cart-body-min">
          {items.length === 0 ? (
            <div className="cart-empty-min">
              <p>Seu carrinho está vazio</p>
              <button className="btn-back-min" onClick={onClose}>
                Continuar Comprando
              </button>
            </div>
          ) : (
            <ul className="cart-items-list-min">
              {items.map((item, index) => (
                <li key={`${item.id}-${index}`} className="cart-item-min">
                  <div className="cart-item-info-min">
                    <span className="cart-item-name-min">{item.name}</span>
                    {item.selectedVariants && (
                      <span className="cart-item-variants-min">
                        {Object.values(item.selectedVariants).join(', ')}
                      </span>
                    )}
                    <span className="cart-item-price-min">
                      {item.qtd} × {formatCurrency(item.price)}
                    </span>
                  </div>
                  
                  <div className="cart-item-controls-min">
                    <div className="cart-item-qty-min">
                      <button 
                        onClick={() => onDecrement(item.id, item.selectedVariants)}
                        disabled={item.qtd <= 1}
                      >
                        <Remove fontSize="small" />
                      </button>
                      <span>{item.qtd}</span>
                      <button 
                        onClick={() => onIncrement(item.id, item.selectedVariants)}
                        disabled={item.qtd >= (item.stock || 99)}
                      >
                        <Add fontSize="small" />
                      </button>
                    </div>
                    
                    <span className="cart-item-subtotal-min">
                      {formatCurrency(item.price * item.qtd)}
                    </span>
                    
                    <button
                      className="cart-item-remove-min"
                      onClick={() => onRemoveItemCompletely(item.id, item.selectedVariants)}
                    >
                      <DeleteOutline fontSize="small" />
                    </button>
                  </div>
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
            
            <div className="cart-checkout-buttons-min">
              {enableWhatsappCheckout && (
                <button
                  className="btn-checkout-min btn-whatsapp-min"
                  onClick={handleOpenWhatsappModal}
                >
                  <WhatsApp /> Finalizar via WhatsApp
                </button>
              )}
              
              {enableMpCheckout && (
                <button
                  className="btn-checkout-min btn-mp-min"
                  onClick={onCheckoutTransparent}
                >
                  <CreditCard /> Pagar com Mercado Pago
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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