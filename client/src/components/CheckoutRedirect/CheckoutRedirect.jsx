// src/components/CheckoutRedirect.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CheckoutRedirect = ({ currentUser }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planName = params.get("plan");
  const amount = params.get("amount");

  useEffect(() => {
    const createPreference = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.post('/api/create-preference', {
          userId: currentUser.uid,
          planName,
          amount,
        });

        const preferenceId = response.data.preferenceId;
        if (preferenceId) {
          window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
        } else {
          console.error("Preferência inválida.");
        }
      } catch (err) {
        console.error('Erro ao redirecionar para o checkout:', err);
      }
    };

    createPreference();
  }, [planName, amount, currentUser]);

  return (
    <div className="text-center mt-5">
      <h4>Redirecionando para o pagamento do plano {planName}...</h4>
    </div>
  );
};

export default CheckoutRedirect;
