import React, { useState, useEffect, useCallback } from "react";
import { Button, Grid, Dialog, Card, CardMedia, CardContent, CardActions, Typography } from "@mui/material";
import ProductEditModal from "../Admin/ProductEditModal/ProductEditModal";
import CategoriasManager from "../CategoriasManager/CategoriasManager";
import { useCategorias } from "../../context/CategoriasContext";

const ManageStock = ({ products, setProducts, userPlan = "free", lojaId }) => {
  const { categorias } = useCategorias(); // <-- use o contexto
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoriasModalOpen, setCategoriasModalOpen] = useState(false);

  // Não precisa mais de fetchCategories nem setCategories
 
  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  }; 

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleRemove = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  return (
    <div className="manage-stock-container">
      <h2 className="manage-stock-title">Gerenciar Produtos</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Button
          variant="contained"
          className="manage-stock-add-btn"
          sx={{ mb: 2 }}
          onClick={handleAdd}
        >
          Adicionar Produto
        </Button>
      </div>
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
                {product.categorias && product.categorias.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <Typography variant="caption" color="textSecondary">
                      Categorias: {product.categorias.join(", ")}
                    </Typography>
                  </div>
                )}
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
        onSave={() => setModalOpen(false)}
        initialProduct={editingProduct}
        categories={categorias} // <-- passa as categorias globais
        userPlan={userPlan}
        lojaId={lojaId}
      />
      <Dialog open={categoriasModalOpen} onClose={() => setCategoriasModalOpen(false)} maxWidth="sm" fullWidth>
        <CategoriasManager lojaId={lojaId} />
      </Dialog>
    </div>
  );
};

export default ManageStock;