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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Countdown from "react-countdown"; // Importação da biblioteca react-countdown
import styles from "./PlanoUpgrade.module.css";

const planos = [
  {
    nome: "Free",
    preco: 0,
    label: "Grátis",
    recursos: [
      "Até 30 produtos",
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
      "Relatórios Avançados",
      "Suporte prioritário",
      "Suporte 24/7",
    ],
    recommended: true,
  },
];

const initialState = {
  userData: null,
  loading: true,
  error: null,
  dialogOpen: false,
  selectedPlan: null,
  trialEndTime: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
        trialEndTime: action.payload?.fimTeste || null,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "OPEN_DIALOG":
      return { ...state, dialogOpen: true, selectedPlan: action.payload };
    case "CLOSE_DIALOG":
      return { ...state, dialogOpen: false, selectedPlan: null };
    default:
      return state;
  }
};

const PlanoUpgrade = ({ user }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!user || !user.uid) {
        dispatch({ type: "SET_ERROR", payload: "Usuário não autenticado" });
        return;
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const userRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          if (!data.plano) {
            data.plano = "free"; // Default to free if no plan
          }
          dispatch({ type: "SET_USER_DATA", payload: data });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: "Dados do usuário não encontrados",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        dispatch({
          type: "SET_ERROR",
          payload:
            err.code === "permission-denied"
              ? "Permissão negada ao acessar dados"
              : "Erro ao carregar dados. Tente novamente.",
        });
      }
    };

    loadUser();
  }, [user]);

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

      const now = new Date();
      const fim = new Date(now);
      fim.setDate(now.getDate() + 7);

      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        plano: plano.nome.toLowerCase(),
        planoAtivo: false,
        inicioTeste: now.toISOString(),
        fimTeste: fim.toISOString(),
        testeGratuito: true,
      });

      dispatch({
        type: "SET_USER_DATA",
        payload: {
          ...state.userData,
          plano: plano.nome.toLowerCase(),
          planoAtivo: false,
          inicioTeste: now.toISOString(),
          fimTeste: fim.toISOString(),
          testeGratuito: true,
        },
      });

      dispatch({ type: "CLOSE_DIALOG" });
      alert(`Teste gratuito de 7 dias do plano ${plano.nome} iniciado!`);
    } catch (err) {
      console.error("Erro ao iniciar teste:", err);
      alert("Erro ao iniciar teste. Tente novamente.");
    }
  };

  const comprarPlano = (plano) => {
    if (!user || !user.uid) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    if (plano.preco === 0) {
      alert("O plano Free é gratuito e não requer pagamento.");
      return;
    }

    const desconto =
      state.trialEndTime && !state.userData?.descontoAplicado ? 0.95 : 1;
    const precoFinal = plano.preco * desconto;

    navigate(
      `/checkout?plan=${encodeURIComponent(
        plano.nome.toLowerCase()
      )}&amount=${precoFinal.toFixed(2)}`
    );
  };

  const handleOpenDialog = (plano) => {
    dispatch({ type: "OPEN_DIALOG", payload: plano });
  };

  const handleCloseDialog = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const { userData, loading, error, dialogOpen, selectedPlan, trialEndTime } =
    state;

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" className={styles.errorText}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          className={styles.buttonPrimary}
          aria-label="Tentar novamente"
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" className={styles.errorText}>
          Não foi possível carregar dados do usuário
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          className={styles.buttonPrimary}
          aria-label="Tentar novamente"
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.planoUpgradeContainer}>
      <Typography variant="h4" className={styles.h4} gutterBottom>
        Escolha seu Plano
      </Typography>

      {trialEndTime && (
        <Box className={styles.trialStatus}>
          <Typography variant="body1" className={styles.trialText}>
            Teste gratuito ativo:
          </Typography>
          <Countdown
            date={new Date(trialEndTime)}
            renderer={({ days, hours, minutes, seconds, completed }) => (
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
            )}
          />
        </Box>
      )}

      <Grid container spacing={3} className={styles.planGrid}>
        {planos.map((plano, index) => {
          const isCurrentPlan = userData.plano === plano.nome.toLowerCase();
          const canUpgrade = !isCurrentPlan && plano.preco > 0;
          const canStartTrial =
            canUpgrade && !userData.testeGratuito && !userData.fimTeste;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                className={`${styles.card} ${
                  plano.recommended ? styles.recommendedCard : ""
                }`}
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
                      Plano Atual
                    </Typography>
                  )}
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
                        aria-label={`Iniciar teste gratuito de 7 dias do plano ${plano.nome}`}
                      >
                        Iniciar 7 dias grátis
                      </Button>
                    </Tooltip>
                  ) : (
                    plano.preco > 0 && (
                      <Tooltip
                        title={
                          trialEndTime && !userData.descontoAplicado
                            ? "Aproveite 5% de desconto ao assinar durante o teste"
                            : `Assinar plano ${plano.nome}`
                        }
                      >
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => comprarPlano(plano)}
                          className={styles.buttonPrimary}
                          aria-label={`Comprar plano ${plano.nome}`}
                        >
                          {trialEndTime && !userData.descontoAplicado
                            ? "Pagar com 5% de desconto"
                            : "Pagar Plano"}
                        </Button>
                      </Tooltip>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

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
            <strong>{selectedPlan?.nome}</strong>. Durante o teste, você terá acesso
            completo aos recursos do plano. Deseja continuar?
          </Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={handleCloseDialog}
            className={styles.button}
            aria-label="Cancelar"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => iniciarTeste(selectedPlan)}
            className={styles.buttonPrimary}
            aria-label={`Confirmar teste gratuito do plano ${selectedPlan?.nome}`}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanoUpgrade;