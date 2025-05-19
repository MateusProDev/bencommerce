import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { Button, TextField, List, ListItem, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../utils/useAuth"; // Importação

const CategoriasManager = ({ lojaId, onCategoriasChange }) => {
  const { user, loading } = useAuth(); // Uso do hook

  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!lojaId) return;

    // Listener para atualizar as categorias em tempo real
    const unsubscribe = onSnapshot(doc(db, "lojas", lojaId), (doc) => {
      if (doc.exists()) {
        const cats = doc.data().categorias || [];
        setCategorias(cats);
        if (onCategoriasChange) onCategoriasChange(cats);
      }
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, [lojaId, onCategoriasChange]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Você não está autenticado.</div>;

  const handleAddCategoria = async () => {
    if (!novaCategoria.trim() || !lojaId || loadingState) return;
    setLoadingState(true);
    try {
      const lojaRef = doc(db, "lojas", lojaId);
      await updateDoc(lojaRef, {
        categorias: arrayUnion(novaCategoria.trim())
      });
      setNovaCategoria("");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert("Erro ao adicionar categoria: " + error.message);
    } finally {
      setLoadingState(false);
    }
  };

  const handleRemoveCategoria = async (cat) => {
    if (!lojaId || loadingState) return;
    setLoadingState(true);
    try {
      const lojaRef = doc(db, "lojas", lojaId);
      await updateDoc(lojaRef, {
        categorias: arrayRemove(cat)
      });
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Gerenciar Categorias
      </Typography>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TextField
          label="Nova categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          size="small"
          disabled={loadingState}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAddCategoria}
          disabled={!novaCategoria.trim() || loadingState}
        >
          {loadingState ? "Adicionando..." : "Adicionar"}
        </Button>
      </div>

      <List>
        {categorias.map((cat, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={() => handleRemoveCategoria(cat)}
                disabled={loadingState}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Typography>{cat}</Typography>
          </ListItem>
        ))}
      </List>

      {categorias.length === 0 && (
        <Typography color="textSecondary" style={{ textAlign: "center" }}>
          Nenhuma categoria cadastrada
        </Typography>
      )}
    </div>
  );
};

export default CategoriasManager;