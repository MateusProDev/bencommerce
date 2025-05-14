// src/components/PlanoUpgrade/PlanoUpgrade.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const planos = [
  { nome: 'Free', preco: 0, label: 'Grátis', recursos: ['Produtos limitados', 'Sem relatórios', 'Sem site próprio'] },
  { nome: 'Plus', preco: 39.9, label: 'R$ 39,90/mês', recursos: ['Produtos ilimitados', 'Relatórios básicos', 'Site personalizado'] },
  { nome: 'Premium', preco: 99.9, label: 'R$ 99,90/mês', recursos: ['Tudo do Plus', 'Relatórios avançados', 'Suporte prioritário'] },
];

const PlanoUpgrade = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!user || !user.uid) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }
      
      try {
        const userRef = doc(db, 'usuarios', user.uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          setError("Dados do usuário não encontrados");
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [user]);

  const isInTrial = userData?.inicioTeste && !userData?.planoAtivo;

  const iniciarTeste = async (plano) => {
    try {
      if (!user || !user.uid) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }
      
      const now = new Date();
      const fim = new Date(now);
      fim.setDate(now.getDate() + 7); // 7 dias de teste

      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        plano: plano.nome.toLowerCase(),
        planoAtivo: false,
        inicioTeste: now,
        fimTeste: fim,
        testeGratuito: true,
      });

      alert(`Teste gratuito de 7 dias do plano ${plano.nome} iniciado!`);
      setUserData({
        ...userData,
        plano: plano.nome.toLowerCase(),
        planoAtivo: false,
        inicioTeste: now,
        fimTeste: fim,
        testeGratuito: true,
      });
    } catch (err) {
      console.error('Erro ao iniciar teste:', err);
      alert('Erro ao iniciar teste. Tente novamente.');
    }
  };

  const comprarPlano = async (plano) => {
    if (!user || !user.uid) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const desconto = isInTrial && !userData.descontoAplicado ? 0.95 : 1;
    const precoFinal = plano.preco * desconto;
    navigate(`/checkout?plan=${encodeURIComponent(plano.nome.toLowerCase())}&amount=${precoFinal.toFixed(2)}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ p: 4, color: 'warning.main' }}>
        <Typography variant="h6">Não foi possível carregar dados do usuário</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Escolha seu Plano</Typography>
      <Grid container spacing={3}>
        {planos.map((plano, index) => {
          const isCurrentPlan = userData.plano === plano.nome.toLowerCase();
          const podeAssinar = !isCurrentPlan;

          return (
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

                  {isCurrentPlan && (
                    <Typography color="success.main">Plano Atual</Typography>
                  )}

                  {!podeAssinar ? null : userData.plano !== plano.nome.toLowerCase() ? (
                    <>
                      {!userData.testeGratuito || userData.fimTeste ? (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => comprarPlano(plano)}
                          sx={{ mt: 2 }}
                        >
                          {userData.descontoAplicado ? 'Pagar Plano' : 'Pagar com 5% de desconto'}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => iniciarTeste(plano)}
                          sx={{ mt: 2 }}
                        >
                          Iniciar 7 dias grátis
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button disabled fullWidth>Pagar</Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PlanoUpgrade;