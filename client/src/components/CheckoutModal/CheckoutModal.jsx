import React, { useState, useEffect } from 'react';
import './CheckoutModal.css'; // Certifique-se que este arquivo CSS está na mesma pasta ou o caminho está correto
import { Close } from '@mui/icons-material';

const CheckoutModal = ({
  isOpen,
  onClose,
  onSubmit, // Função para lidar com os dados quando o formulário for enviado
  cartItems,
  cartTotal,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    deliveryOption: 'retirada', // Valores: 'retirada', 'uber', 'correios'
    paymentMethod: 'pix', // Valores: 'pix', 'credito', 'debito', 'dinheiro'
    observation: '',
  });

  const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Efeito para buscar endereço pelo CEP (ViaCEP API)
  useEffect(() => {
    const currentCep = formData.cep.replace(/\D/g, ''); // Remove não-dígitos
    if (currentCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${currentCep}/json/`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Resposta da rede não foi ok.');
          }
          return res.json();
        })
        .then(data => {
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              street: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || '',
            }));
          } else {
            console.log("CEP não encontrado ou inválido.");
            // Opcional: Limpar campos ou notificar usuário
            // setFormData(prev => ({ ...prev, street: '', neighborhood: '', city: '', state: '' }));
          }
        })
        .catch(err => {
            console.error("Erro ao buscar CEP:", err);
            // Opcional: Limpar campos ou notificar usuário
        });
    }
  }, [formData.cep]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Por favor, preencha seu Nome e Telefone.');
      return;
    }
    if (formData.deliveryOption !== 'retirada' && (!formData.street.trim() || !formData.cep.trim() || !formData.number.trim() || !formData.neighborhood.trim() || !formData.city.trim() || !formData.state.trim())) {
      alert('Por favor, preencha todos os campos do Endereço de Entrega ou selecione "Retirada no Local".');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="checkout-overlay" onClick={onClose}></div>
      <div className="checkout-modal">
        <div className="checkout-modal-header">
          <h3>Finalizar Pedido</h3>
          <button onClick={onClose} className="checkout-modal-close-btn">
            <Close />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="checkout-modal-body">
          <h4>Seus Dados</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome Completo*</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone/WhatsApp*</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
            </div>
          </div>

          <h4>Opção de Entrega*</h4>
          <div className="form-group radio-group">
            <label><input type="radio" name="deliveryOption" value="retirada" checked={formData.deliveryOption === 'retirada'} onChange={handleChange} /> Retirada no Local</label>
            <label><input type="radio" name="deliveryOption" value="uber" checked={formData.deliveryOption === 'uber'} onChange={handleChange} /> Entrega (Ex: Uber, Motoboy)</label>
            <label><input type="radio" name="deliveryOption" value="correios" checked={formData.deliveryOption === 'correios'} onChange={handleChange} /> Envio via Correios</label>
          </div>

          {formData.deliveryOption !== 'retirada' && (
            <>
              <h4>Endereço de Entrega*</h4>
              <div className="form-row">
                 <div className="form-group fg-cep">
                    <label htmlFor="cep">CEP*</label>
                    <input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" maxLength="9" required={formData.deliveryOption !== 'retirada'} />
                 </div>
                 <div className="form-group fg-street">
                    <label htmlFor="street">Rua/Avenida*</label>
                    <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} required={formData.deliveryOption !== 'retirada'} />
                 </div>
              </div>
              <div className="form-row">
                 <div className="form-group fg-number">
                    <label htmlFor="number">Número*</label>
                    <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} required={formData.deliveryOption !== 'retirada'} />
                 </div>
                 <div className="form-group fg-complement">
                    <label htmlFor="complement">Complemento</label>
                    <input type="text" id="complement" name="complement" value={formData.complement} onChange={handleChange} placeholder="Ap, Bloco, Casa..." />
                 </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                    <label htmlFor="neighborhood">Bairro*</label>
                    <input type="text" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required={formData.deliveryOption !== 'retirada'} />
                </div>
              </div>
              <div className="form-row">
                 <div className="form-group fg-city">
                    <label htmlFor="city">Cidade*</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required={formData.deliveryOption !== 'retirada'} />
                 </div>
                 <div className="form-group fg-state">
                    <label htmlFor="state">Estado (UF)*</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} maxLength="2" required={formData.deliveryOption !== 'retirada'} />
                 </div>
              </div>
            </>
          )}

          <h4>Forma de Pagamento*</h4>
          <div className="form-group">
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
              <option value="pix">PIX</option>
              <option value="credito">Cartão de Crédito (a combinar)</option>
              <option value="debito">Cartão de Débito (a combinar)</option>
              <option value="dinheiro">Dinheiro (para retirada/entrega local)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="observation">Observações</label>
            <textarea id="observation" name="observation" value={formData.observation} onChange={handleChange} rows="3" placeholder="Alguma preferência ou detalhe adicional?"></textarea>
          </div>

          <div className="checkout-modal-summary">
            <h5>Resumo do Pedido</h5>
            <ul>
              {cartItems.map(item => (
                <li key={item.id}>{item.qtd}x {item.name} - {formatCurrency(item.price * item.qtd)}</li>
              ))}
            </ul>
            <p className="summary-total">Total: <strong>{formatCurrency(cartTotal)}</strong></p>
          </div>

          <div className="checkout-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-confirm">Confirmar Pedido e Enviar</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckoutModal;