import React, { useState } from "react";
import { Button, Grid, Card, CardMedia, CardContent, CardActions, Typography } from "@mui/material";
import ProductEditModal from "../Admin/ProductEditModal/ProductEditModal";

const ManageStock = ({ products, setProducts }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  return (
    <div>
      <h2>Gerenciar Produtos</h2>
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
        Adicionar Produto
      </Button>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || "/placeholder-product.jpg"}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  R$ {product.price?.toFixed(2) || "0.00"}
                </Typography>
                <Typography variant="body2">
                  Estoque: {product.stock || 0}
                </Typography>
              </CardContent>
              <CardActions>
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
      />
    </div>
  );
};

export default ManageStock;