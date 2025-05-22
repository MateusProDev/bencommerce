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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudinaryUploadWidget from "../../CloudinaryUploadWidget/CloudinaryUploadWidget";
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import "./ProductEditModal.css"

const MAX_IMAGES = {
  free: 1,
  plus: 3,
  premium: 5,
};
 
const ProductEditModal = ({
  open,
  onClose,
  onSave,
  initialProduct = {},
  categories = [],
  userPlan = "free",
  onCreateCategory,
  lojaId,
}) => {
  // Fallback para lojaId usando o usuário autenticado, se não for passado
  const auth = getAuth();
  const resolvedLojaId = lojaId || auth.currentUser?.uid;

  const safeProduct = initialProduct || {};
  const [product, setProduct] = useState({
    name: safeProduct.name || "",
    price: safeProduct.price || "",
    anchorPrice: safeProduct.anchorPrice || "",
    stock: safeProduct.stock || "",
    description: safeProduct.description || "",
    images: safeProduct.images || [],
    category: safeProduct.category || "", // <-- Corrigido para singular
    variants: safeProduct.variants || [],
  });
  const [variantInput, setVariantInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState("");

  const maxImages = MAX_IMAGES[userPlan] || 1;

  // Debug: categorias recebidas
  console.log("Categorias recebidas no modal:", categories);

  // Debug: produto inicial
  console.log("Produto inicial:", initialProduct);

  // Debug: estado do produto editado/criado
  console.log("Estado atual do produto:", product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Alterando campo: ${name} para valor:`, value);
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    if (product.images.length < maxImages) {
      setProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
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
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');

  const handleSave = async () => {
    try {
      console.log("Tentando salvar produto:", product);
      if (!product.name || !product.price) {
        alert("Nome e preço são obrigatórios!");
        console.error("Erro: Nome ou preço não preenchidos.");
        return;
      }
      if (product.images.length === 0) {
        alert("Adicione pelo menos uma imagem do produto.");
        console.error("Erro: Nenhuma imagem adicionada.");
        return;
      }
      const productSlug = generateSlug(product.name);
      const productData = { ...product, slug: productSlug };
      if (initialProduct && initialProduct.id) {
        // Editar produto existente
        console.log("Editando produto existente:", initialProduct.id, productData);
        await updateDoc(
          doc(db, `lojas/${resolvedLojaId}/produtos/${initialProduct.id}`),
          productData
        );
      } else {
        // Adicionar novo produto
        console.log("Adicionando novo produto:", productData);
        await addDoc(collection(db, `lojas/${resolvedLojaId}/produtos`), productData);
      }
      onSave(productData);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("produto-adicionado"));
      }
      console.log("Produto salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto: " + err.message);
    }
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setCreatingCategory(true);
    try {
      // Atualiza o campo global categorias da loja
      await updateDoc(
        doc(db, "lojas", resolvedLojaId),
        { categorias: arrayUnion(trimmed) }
      );
      // Seleciona a nova categoria para o produto
      setProduct(prev => ({ ...prev, category: trimmed })); // <-- Corrigido para singular
      setNewCategory("");
      // Opcional: notifique o contexto/callback para atualizar categorias globais
      if (onCreateCategory) onCreateCategory(trimmed);
    } catch (err) {
      alert("Erro ao criar categoria: " + err.message);
    }
    setCreatingCategory(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {(initialProduct && initialProduct.id) ? "Editar Produto" : "Adicionar Produto"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nome"
            name="name"
            value={product.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Preço"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Preço de Ancoragem (opcional)"
            name="anchorPrice"
            type="number"
            value={product.anchorPrice}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Estoque"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Descrição"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
          {/* Categoria */}
          <Box>
            <TextField
              select
              label="Categoria"
              name="category"
              value={product.category || ""}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 1 }}
            >
              <MenuItem value="">
                <em>Selecione uma categoria</em>
              </MenuItem>
              {categories.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <Box display="flex" gap={1} mt={1}>
              <TextField
                label="Nova categoria"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                size="small"
                disabled={creatingCategory}
              />
              <Button
                variant="outlined"
                onClick={handleCreateCategory}
                disabled={!newCategory.trim() || creatingCategory}
              >
                Criar e Selecionar
              </Button>
            </Box>
          </Box>
          {/* Variantes */}
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
          {/* Imagens */}
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
              {userPlan === "free" && "No plano Free, apenas 1 imagem por produto."}
              {userPlan === "plus" && "No plano Plus, até 3 imagens por produto."}
              {userPlan === "premium" && "No plano Premium, até 5 imagens por produto."}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditModal;