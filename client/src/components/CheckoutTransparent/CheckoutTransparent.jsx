// src/components/CheckoutTransparent.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../utils/api';

const CheckoutTransparent = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!window.MercadoPago) {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => {
        const mp = new window.MercadoPago(
          process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY,
          { locale: 'pt-BR' }
        );
        window.mpInstance = mp;
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('Você precisa estar logado para fazer o pagamento.');
      return;
    }

    if (!window.mpInstance) {
      setError('Erro ao carregar o Mercado Pago. Tente novamente.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/mercadopago`, {
        userId: currentUser.uid,
        amount: 39.90,
      });

      const preference = response.data.preference;

      if (!preference || !preference.id) {
        setError("Falha ao gerar a preferência de pagamento.");
        return;
      }

      window.mpInstance.checkout({
        preference: {
          id: preference.id,
        },
        render: {
          container: '.checkout-container',
          label: 'Pagar agora',
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
    <div className="container py-5">
      <h1 className="mb-4">Upgrade da Conta</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Plano Plus</h5>
            <p className="card-text">R$39,90/mês</p>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Escolher Plano Plus'}
            </Button>
          </div>
        </div>
      </Form>

      <div className="checkout-container mt-4">
        {/* Checkout Mercado Pago será renderizado aqui */}
      </div>

      {paymentStatus && <div className="alert alert-info mt-3">{paymentStatus}</div>}
    </div>
  );
};

export default CheckoutTransparent;
