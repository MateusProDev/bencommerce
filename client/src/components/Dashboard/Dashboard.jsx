// src/components/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Toolbar, AppBar, Typography, Box, CssBaseline
} from "@mui/material";
import {
  Menu as MenuIcon, Logout as LogoutIcon, Edit as EditIcon,
  Image as ImageIcon, ShoppingCart as ShoppingCartIcon,
  WhatsApp as WhatsAppIcon, People as PeopleIcon,
  Inventory as InventoryIcon, PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon, Home as HomeIcon
  
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


// import { auth } from "../../../firebase/firebaseConfig"; // Comentado para evitar erro

// Importação dos componentes
// import EditLojinhaHeader from "../../Admin/EditLojinhaHeader/EditLojinhaHeader"; // Comentado para evitar erro
// import BannerAdmin from "../../Admin/EditBanner/EditBanner"; // Comentado para evitar erro
// import EditProdutos from "../../Admin/EditProducts/EditProducts"; // Comentado para evitar erro
// import EditWhatsApp from "../../Admin/EditWhatsApp/EditWhatsApp"; // Comentado para evitar erro
// import ClientManagement from "../../Lojinha/ClientManagement/ClientManagement"; // Comentado para evitar erro
// import ViewUsers from "../../ViewUsers/ViewUsers"; // Comentado para evitar erro
// import StockManagement from "../../Lojinha/StockManagement/StockManagement"; // Comentado para evitar erro
// import SalesEntry from "../../Lojinha/SalesEntry/SalesEntry"; // Comentado para evitar erro
// import SalesReports from "../../Lojinha/SalesReports/SalesReports"; // Comentado para evitar erro
// import HomeContent from "../../Lojinha/HomeContent/HomeContent"; // Comentado para evitar erro

// import { AdminContext } from "../../Lojinha/AdminContext/AdminContext"; // Comentado para evitar erro

import "./Dashboard.css";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Home");
  const navigate = useNavigate();

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
    { text: "Home", icon: <HomeIcon />, component: "HomeContent" }, // Comentado para evitar erro
    { text: "Editar Cabeçalho", icon: <EditIcon />, component: "EditLojinhaHeader" }, // Comentado para evitar erro
    { text: "Editar Banner", icon: <ImageIcon />, component: "BannerAdmin" }, // Comentado para evitar erro
    { text: "Editar Produtos", icon: <ShoppingCartIcon />, component: "EditProdutos" }, // Comentado para evitar erro
    { text: "Editar WhatsApp", icon: <WhatsAppIcon />, component: "EditWhatsApp" }, // Comentado para evitar erro
    { text: "Gerenciar Clientes", icon: <PeopleIcon />, component: "ClientManagement" }, // Comentado para evitar erro
    { text: "Ver Usuários", icon: <PeopleIcon />, component: "ViewUsers" }, // Comentado para evitar erro
    { text: "Gerenciar Estoque", icon: <InventoryIcon />, component: "StockManagement" }, // Comentado para evitar erro
    { text: "Registrar Venda", icon: <PointOfSaleIcon />, component: "SalesEntry" }, // Comentado para evitar erro
    { text: "Relatórios de Vendas", icon: <AssessmentIcon />, component: "SalesReports" }, // Comentado para evitar erro
  ];

  const renderContent = () => {
    const selectedItem = menuItems.find((item) => item.text === selectedSection);
    const Component = selectedItem ? selectedItem.component : "HomeContent"; // Comentado para evitar erro
    return <Component />; // Comentado para evitar erro
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
    // <AdminContext.Provider value={{ selectedSection, setSelectedSection }}> // Comentado para evitar erro
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
    // </AdminContext.Provider> // Comentado para evitar erro
  );
};

export default Dashboard;
