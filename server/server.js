const express = require('express');
const MercadoPago = require('mercadopago');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['https://storesync-two.vercel.app/'], // ajuste com seu domínio real
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Configuração Mercado Pago
MercadoPago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// 🎯 Checkout padrão via redirecionamento
app.post('/api/create-preference', async (req, res) => {
  const { userId, planName, amount } = req.body;

  if (!userId || !planName || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const preference = {
    items: [
      {
        title: `Plano ${planName}`,
        quantity: 1,
        unit_price: parseFloat(amount),
      },
    ],
    back_urls: {
      success: `https://storesync.vercel.app/success?userId=${userId}`,
      failure: `https://storesync.vercel.app/failure?userId=${userId}`,
      pending: `https://storesync.vercel.app/pending?userId=${userId}`,
    },
    auto_return: 'approved',
    metadata: {
      userId,
      planName,
    },
  };

  try {
    const response = await MercadoPago.preferences.create(preference);
    res.json({ preferenceId: response.body.id });
  } catch (err) {
    console.error('Erro ao criar preferência:', err);
    res.status(500).send('Erro ao criar preferência');
  }
});

// 🧾 Checkout transparente
app.post('/api/mercadopago', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const preference = {
    items: [
      {
        title: 'Plano Plus',
        quantity: 1,
        unit_price: parseFloat(amount),
      },
    ],
    metadata: {
      userId,
    },
  };

  try {
    const response = await MercadoPago.preferences.create(preference);
    res.json({ preference: response.body });
  } catch (err) {
    console.error('Erro no checkout transparente:', err);
    res.status(500).send('Erro ao gerar checkout transparente');
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
