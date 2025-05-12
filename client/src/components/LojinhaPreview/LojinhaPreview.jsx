import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { Preview as PreviewIcon, Settings as SettingsIcon, Add as AddIcon } from '@mui/icons-material';
import './LojinhaPreview.css';

const LojinhaPreview = ({ user }) => {
  return (
    <div className="lojinha-preview-container">
      <Typography variant="h4" gutterBottom>
        Sua Lojinha Virtual
      </Typography>
      <Typography variant="body1" gutterBottom>
        Gerencie sua loja virtual personalizada e acompanhe suas vendas.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="preview-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pré-visualização da Loja
              </Typography>
              {user && (
                <Button
                  variant="contained"
                  component={Link}
                  to={`/loja/${user.uid}`}
                  className="view-store-btn"
                  startIcon={<PreviewIcon />}
                  fullWidth
                >
                  Ver Loja Completa
                </Button>
              )}
              
              <div className="store-preview">
                <div className="store-header-preview">
                  <img 
                    src="/logo-placeholder.png" 
                    alt="Logo da Loja" 
                    className="store-logo-preview" 
                  />
                  <Typography variant="h6">Nome da Sua Loja</Typography>
                </div>
                
                <div className="product-grid-preview">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="product-preview-item">
                      <div className="product-image-placeholder"></div>
                      <div className="product-info-preview">
                        <Typography variant="subtitle1">Produto {item}</Typography>
                        <Typography variant="body2">R$ XX,XX</Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ações Rápidas
              </Typography>
              <div className="store-actions">
                <Button
                  variant="contained"
                  component={Link}
                  to="/dashboard/loja-config"
                  className="action-btn"
                  startIcon={<SettingsIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Configurar Loja
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/dashboard/produtos"
                  className="action-btn"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Gerenciar Produtos
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/dashboard/vendas"
                  className="action-btn"
                  startIcon={<PreviewIcon />}
                  fullWidth
                >
                  Visualizar Vendas
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default LojinhaPreview;