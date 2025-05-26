import React, { useReducer, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Countdown from "react-countdown";
import { useUserPlan } from "../../context/UserPlanContext";
import styles from "./PlanoUpgrade.module.css";

const planos = [
  {
    nome: "Free",
    preco: 0,
    label: "Grátis",
    recursos: [
      "Até 30 produtos",
      "1 imagem por produto",
      "Gerenciamento de estoque",
      "Integração com WhatsApp",
      "Relatórios Básicos",
      "Suporte por e-mail",
      "Certificado SSL",
    ],
  },
  {
    nome: "Plus",
    preco: 39.9,
    label: "R$ 39,90/mês",
    recursos: [
      "Até 300 produtos",
      "Até 3 imagens por produto",
      "Registro de vendas",
      "Gerenciamento de estoque",
      "Integração com WhatsApp",
      "Vários meios de pagamentos",
      "Relatórios completos",
      "Suporte Humanitário",
      "Certificado SSL",
    ],
  },
  {
    nome: "Premium",
    preco: 99.9,
    label: "R$ 99,90/mês",
    recursos: [
      "Tudo do Plus +",
      "Produtos ilimitados",
      "Até 5 imagens por produto",
      "Relatórios Avançados",
      "Suporte prioritário",
      "Suporte 24/7",
    ],
    recommended: true,
  },
];

const initialState = {
  dialogOpen: false,
  selectedPlan: null,
  updatingPlan: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_UPDATING_PLAN":
      return { ...state, updatingPlan: action.payload };
    case "OPEN_DIALOG":
      return { ...state, dialogOpen: true, selectedPlan: action.payload };
    case "CLOSE_DIALOG":
      return { ...state, dialogOpen: false, selectedPlan: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const PlanoUpgrade = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  
  // Usa apenas o Context
  const { 
    userPlan, 
    loading: contextLoading, 
    error: contextError,
    trialData,
    isTrialActive,
    isTrialExpired
  } = useUserPlan();

  const iniciarTeste = async (plano) => {
    if (plano.preco === 0) {
      alert("O plano Free não possui teste gratuito.");
      return;
    }

    try {
      if (!user || !user.uid) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      dispatch({ type: "SET_UPDATING_PLAN", payload: true });

      const now = new Date();
      const fim = new Date(now);
      fim.setDate(now.getDate() + 7); // 7 dias de teste

      const userRef = doc(db, "usuarios", user.uid);
      
      const updateData = {
        plano: plano.nome.toLowerCase(),
        planoAtivo: false, // Durante o teste não está ativo (pago)
        inicioTeste: now.toISOString(),
        fimTeste: fim.toISOString(),
        testeGratuito: true,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updateData);

      dispatch({ type: "CLOSE_DIALOG" });
      alert(`Teste gratuito de 7 dias do plano ${plano.nome} iniciado com sucesso!`);
      
    } catch (err) {
      console.error("Erro ao iniciar teste:", err);
      dispatch({ 
        type: "SET_ERROR", 
        payload: "Erro ao iniciar teste: " + err.message 
      });
    } finally {
      dispatch({ type: "SET_UPDATING_PLAN", payload: false });
    }
  };

  const comprarPlano = (plano) => {
    if (!user || !user.uid) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    if (plano.preco === 0) {
      // Para o plano free, apenas atualiza localmente
      handleUpgradeToFree();
      return;
    }

    const desconto = isTrialActive() && !trialData?.descontoAplicado ? 0.95 : 1;
    const precoFinal = plano.preco * desconto;

    navigate(
      `/checkout?plan=${encodeURIComponent(
        plano.nome.toLowerCase()
      )}&amount=${precoFinal.toFixed(2)}&userId=${user.uid}`
    );
  };

  const handleUpgradeToFree = async () => {
    try {
      dispatch({ type: "SET_UPDATING_PLAN", payload: true });
      
      const userRef = doc(db, "usuarios", user.uid);
      const updateData = {
        plano: "free",
        planoAtivo: true,
        testeGratuito: false,
        inicioTeste: null,
        fimTeste: null,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updateData);
      alert("Plano alterado para Free com sucesso!");
      
    } catch (err) {
      console.error("Erro ao alterar para plano free:", err);
      dispatch({ 
        type: "SET_ERROR", 
        payload: "Erro ao alterar plano: " + err.message 
      });
    } finally {
      dispatch({ type: "SET_UPDATING_PLAN", payload: false });
    }
  };

  const handleOpenDialog = (plano) => {
    dispatch({ type: "OPEN_DIALOG", payload: plano });
  };

  const handleCloseDialog = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const { 
    error, 
    dialogOpen, 
    selectedPlan, 
    updatingPlan 
  } = state;

  if (contextLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Carregando informações do plano...
        </Typography>
      </Box>
    );
  }

  if (error || contextError) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || contextError}
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            dispatch({ type: "CLEAR_ERROR" });
            window.location.reload();
          }}
          className={styles.buttonPrimary}
          aria-label="Tentar novamente"
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  const trialActive = isTrialActive();
  const trialExpired = isTrialExpired();

  return (
    <Box className={styles.planoUpgradeContainer}>
      <Typography variant="h4" className={styles.h4} gutterBottom>
        Escolha seu Plano
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Plano atual: <strong>{userPlan?.toUpperCase() || "FREE"}</strong>
        {trialData?.planoAtivo === false && trialActive && (
          <span> (em teste gratuito)</span>
        )}
        {trialExpired && (
          <span style={{ color: 'red' }}> (teste expirado)</span>
        )}
      </Typography>

      {trialActive && trialData?.fimTeste && (
        <Box className={styles.trialStatus}>
          <Typography variant="body1" className={styles.trialText}>
            ⏰ Teste gratuito ativo - Restam:
          </Typography>
          <Countdown
            date={new Date(trialData.fimTeste)}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return (
                  <Typography color="error" sx={{ fontWeight: 600 }}>
                    Teste expirado
                  </Typography>
                );
              }
              return (
                <Box className={styles.countdownContainer}>
                  <Box className={styles.countdownSegment}>
                    <Typography className={styles.countdownValue}>{days}</Typography>
                    <Typography className={styles.countdownLabel}>Dias</Typography>
                  </Box>
                  <Box className={styles.countdownSegment}>
                    <Typography className={styles.countdownValue}>{hours}</Typography>
                    <Typography className={styles.countdownLabel}>Horas</Typography>
                  </Box>
                  <Box className={styles.countdownSegment}>
                    <Typography className={styles.countdownValue}>{minutes}</Typography>
                    <Typography className={styles.countdownLabel}>Minutos</Typography>
                  </Box>
                  <Box className={styles.countdownSegment}>
                    <Typography className={styles.countdownValue}>{seconds}</Typography>
                    <Typography className={styles.countdownLabel}>Segundos</Typography>
                  </Box>
                </Box>
              );
            }}
          />
        </Box>
      )}

      {trialExpired && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Seu teste gratuito expirou. Escolha um plano para continuar aproveitando todos os recursos.
        </Alert>
      )}

      <Grid container spacing={3} className={styles.planGrid}>
        {planos.map((plano, index) => {
          const isCurrentPlan = userPlan === plano.nome.toLowerCase();
          const canUpgrade = !isCurrentPlan;
          const canStartTrial = 
            canUpgrade && 
            plano.preco > 0 && 
            !trialData?.testeGratuito && 
            !trialData?.fimTeste;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                className={`${styles.card} ${
                  plano.recommended ? styles.recommendedCard : ""
                } ${isCurrentPlan ? styles.currentPlanCard : ""}`}
              >
                {plano.recommended && (
                  <Box className={styles.recommendedBadge}>Recomendado</Box>
                )}
                
                <CardContent className={styles.cardContent}>
                  <Typography variant="h5" className={styles.cardTitle}>
                    {plano.nome}
                  </Typography>
                  <Typography variant="h6" className={styles.cardPrice}>
                    {plano.label}
                  </Typography>
                  
                  <ul className={styles.featureList}>
                    {plano.recursos.map((item, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <CheckCircleIcon className={styles.featureIcon} />
                        <Typography variant="body2">{item}</Typography>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrentPlan && (
                    <Typography className={styles.currentPlanText}>
                      ✓ Plano Atual
                    </Typography>
                  )}
                  
                  {/* Botões de ação */}
                  {isCurrentPlan ? (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled
                      className={styles.buttonDisabled}
                      aria-label={`Plano ${plano.nome} já ativo`}
                    >
                      Plano Ativo
                    </Button>
                  ) : canStartTrial ? (
                    <Tooltip title="Inicie um teste gratuito de 7 dias sem compromisso">
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleOpenDialog(plano)}
                        className={styles.buttonTrial}
                        disabled={updatingPlan}
                        aria-label={`Iniciar teste gratuito de 7 dias do plano ${plano.nome}`}
                      >
                        {updatingPlan ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Iniciar 7 dias grátis"
                        )}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        trialActive && !trialData?.descontoAplicado
                          ? "Aproveite 5% de desconto ao assinar durante o teste"
                          : plano.preco === 0 
                          ? "Alterar para plano gratuito"
                          : `Assinar plano ${plano.nome}`
                      }
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => comprarPlano(plano)}
                        className={styles.buttonPrimary}
                        disabled={updatingPlan}
                        aria-label={`Comprar plano ${plano.nome}`}
                      >
                        {updatingPlan ? (
                          <CircularProgress size={20} />
                        ) : trialActive && !trialData?.descontoAplicado && plano.preco > 0 ? (
                          "Pagar com 5% de desconto"
                        ) : plano.preco === 0 ? (
                          "Usar Plano Gratuito"
                        ) : (
                          "Assinar Plano"
                        )}
                      </Button>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog de confirmação para teste gratuito */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="trial-dialog-title"
        className={styles.dialog}
      >
        <DialogTitle id="trial-dialog-title" className={styles.dialogTitle}>
          Iniciar Teste Gratuito
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Typography variant="body1">
            Você está prestes a iniciar um teste gratuito de 7 dias do plano{" "}
            <strong>{selectedPlan?.nome}</strong>. 
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Durante o teste, você terá acesso completo aos recursos do plano. 
            Após o período de teste, você pode escolher assinar o plano ou 
            retornar ao plano gratuito.
          </Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleCloseDialog}
            className={styles.button}
            disabled={updatingPlan}
            aria-label="Cancelar"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => iniciarTeste(selectedPlan)}
            className={styles.buttonPrimary}
            disabled={updatingPlan}
            aria-label={`Confirmar teste gratuito do plano ${selectedPlan?.nome}`}
          >
            {updatingPlan ? (
              <CircularProgress size={20} />
            ) : (
              "Confirmar Teste"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanoUpgrade;