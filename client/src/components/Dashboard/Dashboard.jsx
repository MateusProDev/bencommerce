import React, { useState, useEffect } from "react";
import {
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Toolbar, 
  AppBar, 
  Typography, 
  Box, 
  CssBaseline,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import {
  Menu as MenuIcon, 
  Logout as LogoutIcon, 
  Edit as EditIcon,
  Image as ImageIcon, 
  ShoppingCart as ShoppingCartIcon,
  WhatsApp as WhatsAppIcon, 
  People as PeopleIcon,
  Inventory as InventoryIcon, 
  PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon, 
  Home as HomeIcon,
  Upgrade as UpgradeIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import PlanoUpgrade from "../PlanoUpgrade/PlanoUpgrade";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Home");
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Se não temos user nos props, tentamos pegar do auth atual
        const currentAuthUser = user || auth.currentUser;
        
        if (currentAuthUser) {
          setCurrentUser(currentAuthUser);
          
          const [userSnap, storeSnap] = await Promise.all([
            getDoc(doc(db, "usuarios", currentAuthUser.uid)),
            getDoc(doc(db, "lojas", currentAuthUser.uid))
          ]);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserPlan(userData.planoAtual || userData.plano || "free");
          }
          
          if (!storeSnap.exists()) {
            navigate('/criar-loja');
          }
        } else {
          // Se não temos usuário autenticado, redirecionamos para login
          navigate('/login');
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate, auth]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar Cabeçalho", icon: <EditIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar Banner", icon: <ImageIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar Produtos", icon: <ShoppingCartIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar WhatsApp", icon: <WhatsAppIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Gerenciar Clientes", icon: <PeopleIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Ver Usuários", icon: <PeopleIcon />, allowedPlans: ["premium"] },
    { text: "Gerenciar Estoque", icon: <InventoryIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Registrar Venda", icon: <PointOfSaleIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Relatórios de Vendas", icon: <AssessmentIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Upgrade de Plano", icon: <UpgradeIcon />, allowedPlans: ["free", "plus"] },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (selectedSection) {
      case "Upgrade de Plano":
        return currentUser ? <PlanoUpgrade user={currentUser} /> : null;
      default:
        return (
          <div>
            <h2>Bem-vindo ao Painel</h2>
            <p>Selecione uma opção no menu para começar.</p>
            {userPlan === "free" && (
              <Alert severity="info">
                Você está no plano Free. <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => setSelectedSection("Upgrade de Plano")}
                >
                  Faça upgrade agora
                </Button> para acessar todos os recursos.
              </Alert>
            )}
          </div>
        );
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.allowedPlans.includes(userPlan)
  );

  const drawerContent = (
    <div className="admin-loja-drawer-container">
      <Toolbar className="admin-loja-drawer-header">
        <Typography variant="h6" noWrap>
          Painel Admin
        </Typography>
      </Toolbar>

      <List className="admin-loja-menu-list">
        {filteredMenuItems.map((item, index) => (
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Painel Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
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
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 260 },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 260px)` },
          ml: { sm: '260px' },
          mt: { xs: '56px', sm: 0 }
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;