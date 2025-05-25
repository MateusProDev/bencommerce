import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { Button, TextField, List, ListItem, IconButton, Typography, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useAuth } from "../../utils/useAuth";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget/CloudinaryUploadWidget";

const CategoriasManager = ({ lojaId, onCategoriasChange }) => {
  const { user, loading } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [imgCategoria, setImgCategoria] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!lojaId) return;
    const unsubscribe = onSnapshot(doc(db, "lojas", lojaId), (docSnap) => {
      if (docSnap.exists()) {
        const cats = docSnap.data().categorias || [];
        setCategorias(cats);
        if (onCategoriasChange) onCategoriasChange(cats);
      }
    });
    return () => unsubscribe();
  }, [lojaId, onCategoriasChange]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Você não está autenticado.</div>;

  // Adiciona categoria (string) e imagem (objeto) separadamente
  const handleAddCategoria = async () => {
    if (!novaCategoria.trim() || !lojaId || loadingState) return;
    setLoadingState(true);
    try {
      const lojaRef = doc(db, "lojas", lojaId);
      // Adiciona no array de strings (compatibilidade)
      await updateDoc(lojaRef, {
        categorias: arrayUnion(novaCategoria.trim())
      });
      // Adiciona no array de objetos (imagem)
      if (imgCategoria) {
        await updateDoc(lojaRef, {
          imgcategorias: arrayUnion({
            nome: novaCategoria.trim(),
            imagem: imgCategoria
          })
        });
      }
      setNovaCategoria("");
      setImgCategoria("");
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
      // Opcional: remova também de imgcategorias se quiser
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
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <TextField
          label="Nova categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          size="small"
          disabled={loadingState}
          fullWidth
        />
        <Tooltip title="Adicionar imagem da categoria">
          <span>
            <CloudinaryUploadWidget
              onUpload={setImgCategoria}
              buttonText={
                imgCategoria ? (
                  <img
                    src={imgCategoria}
                    alt="Prévia"
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <AddAPhotoIcon style={{ fontSize: 28, color: "#1976d2" }} />
                )
              }
              disabled={loadingState}
            />
          </span>
        </Tooltip>
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