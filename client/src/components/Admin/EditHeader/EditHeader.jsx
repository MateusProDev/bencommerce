import React, { useRef } from "react";
import { Button, TextField, Box, Avatar } from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import CloudinaryUploadWidget from "../../CloudinaryUploadWidget/CloudinaryUploadWidget"; // Crie esse componente para upload

const EditHeader = ({
  headerTitle,
  setHeaderTitle,
  logoUrl,
  setLogoUrl,
  onSave,
  currentUser,
}) => {
  const handleLogoUpload = (url) => {
    setLogoUrl(url);
  };

  const handleSave = async () => {
    await updateDoc(doc(db, "lojas", currentUser.uid), {
      headerTitle,
      logoUrl,
    });
    onSave && onSave();
    alert("Cabeçalho atualizado!");
  };

  return (
    <Box>
      <h2>Editar Cabeçalho</h2>
      <TextField
        label="Nome da Loja"
        value={headerTitle}
        onChange={(e) => setHeaderTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={logoUrl} sx={{ width: 64, height: 64 }} />
        <CloudinaryUploadWidget onUpload={handleLogoUpload} />
      </Box>
      <Button variant="contained" onClick={handleSave}>
        Salvar Alterações
      </Button>
    </Box>
  );
};

export default EditHeader;