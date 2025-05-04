// src/components/CheckoutTransparent.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CheckoutTransparent = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    // Configuração do SDK do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      // Configurar Mercado Pago com o seu access_token
      window.MercadoPago.setPublishableKey(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o usuário está logado
    if (!currentUser) {
      setError('Você precisa estar logado para fazer o pagamento.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cria a preferência no backend
      const response = await axios.post('/api/mercadopago', {
        userId: currentUser.uid,
        amount: 39.90, // valor do plano
      });

      // Obtém a preferência de pagamento
      const preference = response.data.preference;
      setPaymentData(preference);

      // Cria o formulário de pagamento e insere na página
      const mp = new window.MercadoPago('YOUR_PUBLIC_KEY');
      mp.checkout({
        preference: {
          id: preference.id,
        },
        render: {
          container: '.checkout-container', // onde o checkout será renderizado
          label: 'Pagar',
        },
      });

      setPaymentStatus('Aguardando pagamento...');
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upgrade da Conta</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Plano Plus</h5>
            <p className="card-text">R$39,90/mês</p>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Escolher Plano Plus'}
            </Button>
          </div>
        </div>
      </Form>

      <div className="checkout-container mt-3">
        {/* O Mercado Pago Checkout será renderizado aqui */}
      </div>

      {paymentStatus && <div className="alert alert-info mt-3">{paymentStatus}</div>}
    </div>
  );
};

export default CheckoutTransparent;
