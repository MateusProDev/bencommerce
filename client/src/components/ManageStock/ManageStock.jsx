import React, { useState } from "react";
import { Button, Grid, Card, CardMedia, CardContent, CardActions, Typography } from "@mui/material";
import ProductEditModal from "../Admin/ProductEditModal/ProductEditModal";
import "./ManageStock.css";

const ManageStock = ({ products, setProducts, categories = [], userPlan = "free", lojaId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // Estado local para categorias
  const [localCategories, setLocalCategories] = useState(categories);

  // Abrir modal para adicionar
  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Salvar produto (adicionar ou editar)
  const handleSave = (product) => {
    if (editingProduct) {
      // Editar
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...product } : p))
      );
    } else {
      // Adicionar
      setProducts((prev) => [
        ...prev,
        { ...product, id: Date.now().toString() },
      ]);
    }
    setModalOpen(false);
  };

  // Remover produto
  const handleRemove = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Atualiza o estado local de categorias ao criar uma nova
  const handleCreateCategory = (category) => {
    setLocalCategories((prev) =>
      prev.includes(category) ? prev : [...prev, category]
    );
  };

  return (
    <div className="manage-stock-container">
      <h2 className="manage-stock-title">Gerenciar Produtos</h2>
      <Button
        variant="contained"
        className="manage-stock-add-btn"
        sx={{ mb: 2 }}
        onClick={handleAdd}
      >
        Adicionar Produto
      </Button>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card className="manage-stock-card">
              <CardMedia
                component="img"
                height="140"
                image={product.images?.[0] || "/placeholder-product.jpg"}
                alt={product.name}
                className="manage-stock-card-img"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" className="manage-stock-card-title">
                  {product.name}
                </Typography>
                <div className="lojinha-product-price">
                  R$ {Number(product.price).toFixed(2)}
                </div>
                <div className="lojinha-product-stock">
                  Estoque: {Number(product.stock) ?? 0}
                </div>
              </CardContent>
              <CardActions className="manage-stock-card-actions">
                <Button size="small" onClick={() => handleEdit(product)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => handleRemove(product)}>
                  Remover
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ProductEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialProduct={editingProduct}
        isEdit={!!editingProduct}
        categories={localCategories}
        onCreateCategory={handleCreateCategory}
        userPlan={userPlan}
        lojaId={lojaId}
      />
    </div>
  );
};

export default ManageStock;