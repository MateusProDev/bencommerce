import React, { useState, useEffect } from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Toolbar, AppBar, Typography, Box, CssBaseline
} from "@mui/material";
import {
  Menu as MenuIcon, Logout as LogoutIcon, Edit as EditIcon,
  Image as ImageIcon, ShoppingCart as ShoppingCartIcon,
  WhatsApp as WhatsAppIcon, People as PeopleIcon,
  Inventory as InventoryIcon, PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon, Home as HomeIcon,
  Upgrade as UpgradeIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { verificarPlanoUsuario } from '../../utils/verificarPlanoUsuario';

// ✅ Componente para upgrade
import UpgradePlano from "../PlanoUpgrade/PlanoUpgrade";

// ❌ Comentados para evitar erro
// import { auth } from "../../../firebase/firebaseConfig";
// import EditLojinhaHeader from "../../Admin/EditLojinhaHeader/EditLojinhaHeader";
// import BannerAdmin from "../../Admin/EditBanner/EditBanner";
// import EditProdutos from "../../Admin/EditProducts/EditProducts";
// import EditWhatsApp from "../../Admin/EditWhatsApp/EditWhatsApp";
// import ClientManagement from "../../Lojinha/ClientManagement/ClientManagement";
// import ViewUsers from "../../ViewUsers/ViewUsers";
// import StockManagement from "../../Lojinha/StockManagement/StockManagement";
// import SalesEntry from "../../Lojinha/SalesEntry/SalesEntry";
// import SalesReports from "../../Lojinha/SalesReports/SalesReports";
// import HomeContent from "../../Lojinha/HomeContent/HomeContent";
// import { AdminContext } from "../../Lojinha/AdminContext/AdminContext";

import "./Dashboard.css";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await verificarPlanoUsuario(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/loja/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, component: "HomeContent" },
    { text: "Editar Cabeçalho", icon: <EditIcon />, component: "EditLojinhaHeader" },
    { text: "Editar Banner", icon: <ImageIcon />, component: "BannerAdmin" },
    { text: "Editar Produtos", icon: <ShoppingCartIcon />, component: "EditProdutos" },
    { text: "Editar WhatsApp", icon: <WhatsAppIcon />, component: "EditWhatsApp" },
    { text: "Gerenciar Clientes", icon: <PeopleIcon />, component: "ClientManagement" },
    { text: "Ver Usuários", icon: <PeopleIcon />, component: "ViewUsers" },
    { text: "Gerenciar Estoque", icon: <InventoryIcon />, component: "StockManagement" },
    { text: "Registrar Venda", icon: <PointOfSaleIcon />, component: "SalesEntry" },
    { text: "Relatórios de Vendas", icon: <AssessmentIcon />, component: "SalesReports" },
    { text: "Upgrade de Plano", icon: <UpgradeIcon />, component: "UpgradePlano" },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case "Upgrade de Plano":
        return <UpgradePlano />;
      // ❌ Aqui você adiciona os outros cases se quiser reativar os imports futuramente
      default:
        return <div>Bem-vindo ao painel!</div>;
    }
  };

  const drawerContent = (
    <div className="admin-loja-drawer-container">
      <Toolbar className="admin-loja-drawer-header">
        <Typography variant="h6" noWrap>
          Painel Admin
        </Typography>
      </Toolbar>
      <List className="admin-loja-menu-list">
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              setSelectedSection(item.text);
              setMobileOpen(false);
            }}
            className={selectedSection === item.text ? "admin-loja-active" : ""}
          >
            <ListItemIcon className="admin-loja-menu-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <div className="admin-loja-logout-button" onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} />
        Sair
      </div>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "#2c3e50",
          display: { sm: "none" },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Painel Admin
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: "absolute",
              right: 0,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: 260,
            position: "fixed",
            height: "100vh",
            boxSizing: "border-box",
            zIndex: 1200,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          flexShrink: 0,
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        className="admin-loja-main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { xs: "100%", sm: "calc(100% - 260px)" },
          ml: { sm: "260px" },
          mt: { xs: 8, sm: 0 },
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="admin-loja-dashboard">{renderContent()}</div>
      </Box>
    </Box>
  );
};

export default Dashboard;
