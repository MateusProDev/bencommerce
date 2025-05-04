// server.js (Backend)
const express = require('express');
const MercadoPago = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
MercadoPago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

app.post('/api/mercadopago', async (req, res) => {
  const { userId, amount } = req.body;

  // Criação da preferência de pagamento
  const preference = {
    items: [
      {
        title: 'Plano Plus',
        quantity: 1,
        unit_price: amount,
      },
    ],
    back_urls: {
      success: `https://yourdomain.com/success?userId=${userId}`,
      failure: `https://yourdomain.com/failure?userId=${userId}`,
      pending: `https://yourdomain.com/pending?userId=${userId}`,
    },
    auto_return: 'approved',
  };

  try {
    const response = await MercadoPago.preferences.create(preference);
    res.json({ preference: response.body });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar preferência');
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
