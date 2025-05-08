import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { doc, getDoc, setDoc, deleteField, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

const RelatorioAnalytics = () => {
  const [measurementId, setMeasurementId] = useState("");
  const [savedId, setSavedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurementId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const id = snap.data()?.measurementId || "";
        setSavedId(id);
        setMeasurementId(id);
      }
      setLoading(false);
    };

    fetchMeasurementId();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !measurementId) return;

    const docRef = doc(db, "usuarios", user.uid);
    await setDoc(docRef, { measurementId }, { merge: true });
    setSavedId(measurementId);
  };

  const handleReset = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "usuarios", user.uid);
    await updateDoc(docRef, { measurementId: deleteField() });
    setMeasurementId("");
    setSavedId("");
  };

  if (loading) return <p>Carregando configuração...</p>;

  return (
    <Box p={3}>
      {!savedId ? (
        <>
          <Typography variant="h6">Configurar Google Analytics</Typography>
          <TextField
            label="Measurement ID (GA4)"
            value={measurementId}
            onChange={(e) => setMeasurementId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleSave}>
            Salvar Configuração
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6">Relatório de Acessos</Typography>
          <Typography>Measurement ID atual: <strong>{savedId}</strong></Typography>

          {/* Aqui futuramente virá o gráfico, pode usar Chart.js ou a API do GA4 */}
          <Box mt={2} mb={2} p={2} bgcolor="#f1f1f1">
            <Typography>Aqui será exibido o gráfico do GA4 com base no ID salvo.</Typography>
          </Box>

          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Redefinir Configuração
          </Button>
        </>
      )}
    </Box>
  );
};

export default RelatorioAnalytics;
