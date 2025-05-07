// src/components/PlanoUpgrade/PlanoUpgrade.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const planos = [
  { nome: 'Free', preco: 0, label: 'Grátis', recursos: ['Produtos limitados', 'Sem relatórios', 'Sem site próprio'] },
  { nome: 'Plus', preco: 39.9, label: 'R$ 39,90/mês', recursos: ['Produtos ilimitados', 'Relatórios básicos', 'Site personalizado'] },
  { nome: 'Premium', preco: 99.9, label: 'R$ 99,90/mês', recursos: ['Tudo do Plus', 'Relatórios avançados', 'Suporte prioritário'] },
];

const UpgradePlano = () => {
  const [user, setUser] = useState(null);
  const [testeAtivo, setTesteAtivo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, 'usuarios', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: currentUser.uid, ...docSnap.data() });

          const hoje = new Date();
          const fimTeste = docSnap.data().fimTeste?.toDate();
          if (fimTeste && hoje <= fimTeste) {
            setTesteAtivo(true);
          }
        }
      }
    };
    loadUser();
  }, []);

  const iniciarTeste = async (plano) => {
    const now = new Date();
    const fim = new Date(now);
    fim.setDate(now.getDate() + 7); // 7 dias

    await updateDoc(doc(db, 'usuarios', user.uid), {
      plano: plano.nome.toLowerCase(),
      planoAtivo: false,
      inicioTeste: now,
      fimTeste: fim,
    });

    alert(`Teste gratuito de 7 dias do plano ${plano.nome} iniciado!`);
    setTesteAtivo(true);
  };

  const comprarPlano = async (plano) => {
    const desconto = testeAtivo && !user.descontoAplicado ? 0.95 : 1;
    const precoFinal = plano.preco * desconto;
    const url = `/checkout?plan=${plano.nome.toLowerCase()}&amount=${precoFinal.toFixed(2)}`;
    navigate(url);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Escolha seu Plano</Typography>
      <Grid container spacing={3}>
        {planos.map((plano, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5">{plano.nome}</Typography>
                <Typography variant="h6" sx={{ my: 1 }}>{plano.label}</Typography>
                <ul>
                  {plano.recursos.map((item, idx) => (
                    <li key={idx}><Typography variant="body2">{item}</Typography></li>
                  ))}
                </ul>

                {plano.preco === 0 ? (
                  <Button variant="outlined" disabled>Plano atual</Button>
                ) : (
                  <>
                    {!testeAtivo ? (
                      <Button variant="outlined" onClick={() => iniciarTeste(plano)} sx={{ mt: 2 }}>
                        Iniciar 7 dias grátis
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={() => comprarPlano(plano)} sx={{ mt: 2 }}>
                        {user?.descontoAplicado ? 'Pagar Plano' : 'Pagar com 5% de desconto'}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UpgradePlano;
