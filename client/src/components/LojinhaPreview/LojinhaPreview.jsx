// Exemplo para src/components/LojinhaPreview/LojinhaPreview.jsx
import React from "react";
import { Button } from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";

const LojinhaPreview = ({ storeData }) => {
  const navigate = useNavigate();

  return (
    <div>
      Lojinha
      <Button
        variant="contained"
        onClick={() => navigate(`/loja/${storeData.slug}`)}
        startIcon={<PreviewIcon />}
        sx={{ mt: 3 }}
      >
        Publicar Loja
      </Button>
    </div>
  );
};

export default LojinhaPreview;