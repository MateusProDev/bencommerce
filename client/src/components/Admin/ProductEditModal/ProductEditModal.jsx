import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Grid,
  CircularProgress,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloudinaryUploadWidget from "../../CloudinaryUploadWidget/CloudinaryUploadWidget";
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import "./ProductEditModal.css";
import useUserPlan from "../../../hooks/useUserPlan";
import { MAX_IMAGES, PRODUCT_LIMITS } from '../../../utils/planLimits';

const ProductEditModal = ({
  open,
  onClose,
  onSave,
  initialProduct = {},
  categories = [],
  userPlan: initialUserPlan,
  onCreateCategory,
  lojaId,
  currentProductCount = 0,
}) => {
  const auth = getAuth();
  const resolvedLojaId = lojaId || auth.currentUser?.uid;
  const { userPlan } = useUserPlan(resolvedLojaId) || { userPlan: initialUserPlan };
  const [saveLoading, setSaveLoading] = useState(false);

  const safeProduct = initialProduct || {};
  const [product, setProduct] = useState({
    name: safeProduct.name || "",
    price: safeProduct.price || "",
    anchorPrice: safeProduct.anchorPrice || "",
    stock: safeProduct.stock || "",
    description: safeProduct.description || "",
    images: safeProduct.images || [],
    category: safeProduct.category || "",
    variants: safeProduct.variants || [],
    ativo: safeProduct.ativo !== false,
    prioridade: safeProduct.prioridade || false,
  });

  const [variantInput, setVariantInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryImage, setNewCategoryImage] = useState("");

  const maxImages = MAX_IMAGES[userPlan] || 1;
  const maxProducts = PRODUCT_LIMITS[userPlan] || 30;
  

  const handleImageUpload = (url) => {
    if (product.images.length < maxImages) {
      setProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
    } else {
      alert(`Você atingiu o limite máximo de ${maxImages} imagens para o seu plano ${userPlan}.`);
    }
  };

  const handleRemoveImage = (idx) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleAddVariant = () => {
    if (variantInput.trim()) {
      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, variantInput.trim()],
      }));
      setVariantInput("");
    }
  };

  const handleRemoveVariant = (idx) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      if (!product.name || !product.price) {
        alert("Nome e preço são obrigatórios!");
        return;
      }

      if (product.images.length === 0) {
        alert("Adicione pelo menos uma imagem do produto.");
        return;
      }

      if (!initialProduct.id && currentProductCount >= maxProducts) {
        alert(`Você atingiu o limite máximo de ${maxProducts} produtos para o plano ${userPlan}.`);
        return;
      }

      const productSlug = generateSlug(product.name);
      const productData = { 
        ...product,
        slug: productSlug,
        updatedAt: new Date().toISOString(),
      };

      if (initialProduct && initialProduct.id) {
        await updateDoc(
          doc(db, `lojas/${resolvedLojaId}/produtos/${initialProduct.id}`),
          productData
        );
      } else {
        productData.createdAt = new Date().toISOString();
        await addDoc(
          collection(db, `lojas/${resolvedLojaId}/produtos`),
          productData
        );
      }

      onSave(productData);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    setCreatingCategory(true);
    try {
      await updateDoc(doc(db, "lojas", resolvedLojaId), {
        categorias: arrayUnion(trimmed),
      });

      if (newCategoryImage) {
        await updateDoc(doc(db, "lojas", resolvedLojaId), {
          imgcategorias: arrayUnion({ nome: trimmed, imagem: newCategoryImage }),
        });
      }

      setProduct((prev) => ({ ...prev, category: trimmed }));
      setNewCategory("");
      setNewCategoryImage("");
      if (onCreateCategory) onCreateCategory(trimmed);
    } catch (err) {
      alert("Erro ao criar categoria: " + err.message);
    }
    setCreatingCategory(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialProduct && initialProduct.id ? "Editar Produto" : "Adicionar Produto"}
        {userPlan && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            (Plano {userPlan.toUpperCase()})
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nome"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="Preço"
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            fullWidth
            required
            inputProps={{ step: "0.01", min: "0" }}
          />

          <TextField
            label="Preço de Ancoragem (opcional)"
            type="number"
            value={product.anchorPrice}
            onChange={(e) => setProduct({ ...product, anchorPrice: e.target.value })}
            fullWidth
            inputProps={{ step: "0.01", min: "0" }}
          />

          <TextField
            label="Estoque"
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            fullWidth
            inputProps={{ min: "0" }}
          />

          <TextField
            label="Descrição"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            fullWidth
            multiline
            minRows={2}
          />

          <Box>
            <TextField
              select
              label="Categoria"
              value={product.category || ""}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              fullWidth
              sx={{ mb: 1 }}
            >
              <MenuItem value="">
                <em>Selecione uma categoria</em>
              </MenuItem>
              {categories.map((cat, idx) => (
                <MenuItem key={idx} value={typeof cat === "string" ? cat : cat.nome}>
                  {typeof cat === "string" ? cat : cat.nome}
                </MenuItem>
              ))}
            </TextField>
            
            <Box display="flex" gap={1} mt={1}>
              <TextField
                label="Nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                size="small"
                disabled={creatingCategory}
                fullWidth
              />
              <CloudinaryUploadWidget
                onUpload={setNewCategoryImage}
                buttonText={
                  newCategoryImage ? (
                    <img
                      src={newCategoryImage}
                      alt="Prévia"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <AddAPhotoIcon style={{ fontSize: 28, color: "#1976d2" }} />
                  )
                }
                disabled={creatingCategory}
              />
              <Button
                variant="outlined"
                onClick={handleCreateCategory}
                disabled={!newCategory.trim() || creatingCategory}
              >
                {creatingCategory ? <CircularProgress size={24} /> : "Criar"}
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Variantes (ex: cor, tamanho)
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <TextField
                label="Adicionar variante"
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                size="small"
                fullWidth
              />
              <IconButton onClick={handleAddVariant} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 1 }}>
              {product.variants.map((variant, idx) => (
                <Chip
                  key={idx}
                  label={variant}
                  onDelete={() => handleRemoveVariant(idx)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Imagens do produto ({product.images.length}/{maxImages})
            </Typography>
            <CloudinaryUploadWidget
              onUpload={handleImageUpload}
              disabled={product.images.length >= maxImages}
            />
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {product.images.map((img, idx) => (
                <Grid item key={idx}>
                  <Box position="relative" display="inline-block">
                    <img
                      src={img}
                      alt={`Produto ${idx + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #eee",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(idx)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#fff",
                        p: "2px",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" color="text.secondary">
              {userPlan === "free" && "Plano Free: 1 imagem por produto"}
              {userPlan === "plus" && "Plano Plus: até 3 imagens por produto"}
              {userPlan === "premium" && "Plano Premium: até 5 imagens por produto"}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2">Status</Typography>
              <Switch
                checked={product.ativo}
                onChange={(e) => setProduct({ ...product, ativo: e.target.checked })}
                color="primary"
              />
              <Typography variant="caption" display="block">
                {product.ativo ? "Ativo" : "Inativo"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Prioridade</Typography>
              <Switch
                checked={product.prioridade}
                onChange={(e) => setProduct({ ...product, prioridade: e.target.checked })}
                color="secondary"
              />
              <Typography variant="caption" display="block">
                {product.prioridade ? "Prioritário" : "Normal"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saveLoading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={saveLoading}
        >
          {saveLoading ? <CircularProgress size={24} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditModal;