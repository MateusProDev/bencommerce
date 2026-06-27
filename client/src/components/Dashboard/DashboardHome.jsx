import React from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button, Alert, Box } from "@mui/material";
import { Add as AddIcon, Settings as SettingsIcon, Preview as PreviewIcon, TrendingUp, Inventory, ShoppingCart, Star } from "@mui/icons-material";
import "./Dashboard.premium.css";

const DashboardHome = ({ storeData, userPlan, navigate, setSelectedSection }) => {
  const planColors = {
    free: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🆓' },
    plus: { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '⭐' },
    premium: { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '💎' }
  };

  const currentPlan = planColors[userPlan] || planColors.free;

  return (
    <div className="pd-main-content">
      {/* Header */}
      <div className="pd-header">
        <h1 className="pd-header-title">
          <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bem-vindo</span> ao Painel
        </h1>
        <p className="pd-header-subtitle">
          Gerencie sua loja com estilo e eficiência
        </p>
      </div>

      {/* Cards Grid */}
      <div className="pd-cards-grid">
        {/* Card Resumo da Loja */}
        <div className="pd-card pd-card-purple">
          <div className="pd-card-icon">🏪</div>
          <h3 className="pd-card-title">Resumo da Loja</h3>
          <div className="pd-card-value">{storeData?.nome || "Não definido"}</div>
          <p className="pd-card-label">Nome da Loja</p>
          <div className="pd-flex pd-gap-2 pd-mt-3">
            <span className="pd-badge pd-badge-purple">{storeData?.segmento || "Sem segmento"}</span>
            <span className="pd-badge pd-badge-pink">{currentPlan.icon} {userPlan.toUpperCase()}</span>
          </div>
          <div className="pd-mt-4">
            <button className="pd-btn pd-btn-primary" onClick={() => navigate(`/${storeData.slug}`)}>
              <PreviewIcon /> Visualizar Loja
            </button>
          </div>
        </div>

        {/* Card Ações Rápidas */}
        <div className="pd-card pd-card-pink">
          <div className="pd-card-icon">⚡</div>
          <h3 className="pd-card-title">Ações Rápidas</h3>
          <div className="pd-flex pd-gap-2 pd-mt-3">
            <button className="pd-btn pd-btn-primary" onClick={() => setSelectedSection("Gerenciar Estoque")}>
              <AddIcon /> Adicionar Produto
            </button>
            <button className="pd-btn pd-btn-secondary" onClick={() => setSelectedSection("Editar Cabeçalho")}>
              <SettingsIcon /> Configurar Loja
            </button>
          </div>
        </div>

        {/* Card Estatísticas */}
        <div className="pd-card pd-card-cyan">
          <div className="pd-card-icon">📊</div>
          <h3 className="pd-card-title">Estatísticas</h3>
          <div className="pd-flex pd-gap-3 pd-mt-3">
            <div>
              <div className="pd-card-value">{products.length}</div>
              <p className="pd-card-label">Produtos</p>
            </div>
            <div>
              <div className="pd-card-value">0</div>
              <p className="pd-card-label">Vendas</p>
            </div>
          </div>
          <div className="pd-mt-4">
            <button className="pd-btn pd-btn-secondary" onClick={() => setSelectedSection("Relatórios de Vendas")}>
              Ver Relatórios
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de Upgrade */}
      {userPlan === "free" && (
        <div className="pd-card pd-card-orange" style={{ marginTop: '2rem' }}>
          <div className="pd-card-icon">⚡</div>
          <h3 className="pd-card-title">Desbloqueie o Poder Completo!</h3>
          <p className="pd-card-label" style={{ fontSize: '1rem', textTransform: 'none' }}>Você está no plano Free. Faça upgrade para acessar recursos premium.</p>
          <div className="pd-mt-4">
            <button className="pd-btn pd-btn-success" onClick={() => setSelectedSection("Upgrade de Plano")}>
              <Star /> Fazer Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;