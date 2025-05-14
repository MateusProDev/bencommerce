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
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  Divider,
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
  Upgrade as UpgradeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import PlanoUpgrade from "../PlanoUpgrade/PlanoUpgrade";
import { verificarPlanoUsuario } from "../../utils/verificarPlanoUsuario";
import { useTheme } from "@mui/material/styles";
import "./Dashboard.css";
import EditHeader from "../Admin/EditHeader/EditHeader";
import EditBanner from "../Admin/EditBanner/EditBanner";
// Removido ManageProducts import, pois o ManageStock já gerencia os produtos
import ManageStock from "../ManageStock/ManageStock";
import SalesReports from "../SalesReports/SalesReports";

const Dashboard = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Home");
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerImages, setBannerImages] = useState([]);
  const [newBannerImage, setNewBannerImage] = useState("");
  const [storeTheme, setStoreTheme] = useState("claro");
  const [corPrimaria, setCorPrimaria] = useState("#4a6bff");
  const [corSecundaria, setCorSecundaria] = useState("#2541b2");
  const navigate = useNavigate();
  const auth = getAuth();
  const theme = useTheme();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentAuthUser = user || auth.currentUser;
        if (currentAuthUser) {
          setCurrentUser(currentAuthUser);
          setLoading(true);
          // Verifica plano do usuário
          await verificarPlanoUsuario(currentAuthUser.uid);
          // Verifica se o usuário tem uma loja
          const [userSnap, storeSnap] = await Promise.all([
            getDoc(doc(db, "usuarios", currentAuthUser.uid)),
            getDoc(doc(db, "lojas", currentAuthUser.uid)),
          ]);
          const userData = userSnap.exists() ? userSnap.data() : {};
          const storeDataExists = storeSnap.exists();
          setUserPlan(userData.planoAtual || userData.plano || "free");
          if (storeDataExists) {
            const storeData = storeSnap.data();
            setStoreData(storeData);
            setHeaderTitle(storeData.headerTitle || "Minha Loja");
            setWhatsappNumber(storeData.whatsappNumber || "");
            setLogoUrl(storeData.logoUrl || "");
            setBannerImages(storeData.bannerImages || []);
            setStoreTheme(storeData.configs?.tema || "claro");
            setCorPrimaria(storeData.configs?.corPrimaria || "#4a6bff");
            setCorSecundaria(storeData.configs?.corSecundaria || "#2541b2");
            // Carrega produtos
            const productsCollection = collection(
              db,
              `lojas/${currentAuthUser.uid}/produtos`
            );
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProducts(productsList);
          } else {
            navigate("/criar-loja");
          }
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user, navigate, auth, selectedSection]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  const saveHeaderChanges = async () => {
    try {
      await updateDoc(doc(db, "lojas", currentUser.uid), {
        headerTitle,
      });
      alert("Cabeçalho atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar cabeçalho:", error);
      alert("Erro ao salvar cabeçalho");
    }
  };
  const saveWhatsappChanges = async () => {
    try {
      await updateDoc(doc(db, "lojas", currentUser.uid), {
        whatsappNumber,
      });
      alert("WhatsApp atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar WhatsApp:", error);
      alert("Erro ao salvar WhatsApp");
    }
  };
  const addBannerImage = async () => {
    if (!newBannerImage) return;
    try {
      const updatedBannerImages = [...bannerImages, newBannerImage];
      await updateDoc(doc(db, "lojas", currentUser.uid), {
        bannerImages: updatedBannerImages,
      });
      setBannerImages(updatedBannerImages);
      setNewBannerImage("");
      alert("Imagem adicionada ao banner!");
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error);
      alert("Erro ao adicionar imagem");
    }
  };
  const removeBannerImage = async (index) => {
    try {
      const updatedBannerImages = bannerImages.filter((_, i) => i !== index);
      await updateDoc(doc(db, "lojas", currentUser.uid), {
        bannerImages: updatedBannerImages,
      });
      setBannerImages(updatedBannerImages);
      alert("Imagem removida do banner!");
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      alert("Erro ao remover imagem");
    }
  };

  // Atualize os itens do menu, removendo a opção "Gerenciar Produtos"
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar Cabeçalho", icon: <EditIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Editar Banner", icon: <ImageIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Configurar WhatsApp", icon: <WhatsAppIcon />, allowedPlans: ["free", "plus", "premium"] },
    { text: "Gerenciar Estoque", icon: <InventoryIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Registrar Venda", icon: <PointOfSaleIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Relatórios de Vendas", icon: <AssessmentIcon />, allowedPlans: ["plus", "premium"] },
    { text: "Upgrade de Plano", icon: <UpgradeIcon />, allowedPlans: ["free", "plus"] },
    { text: "Visualizar Loja", icon: <PreviewIcon />, allowedPlans: ["free", "plus", "premium"] },
  ];
  
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    switch (selectedSection) {
      case "Home":
        return (
          <div>
            <h2>Bem-vindo ao Painel da sua Loja</h2>
            <p>Aqui você pode gerenciar todos os aspectos da sua loja virtual.</p>
            <Grid container spacing={3} mt={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Resumo da Loja</Typography>
                    <Typography variant="body2">
                      <strong>Nome:</strong> {storeData?.storeName || "Não definido"}<br />
                      <strong>Segmento:</strong> {storeData?.segmento || "Não definido"}<br />
                      <strong>Plano:</strong> {userPlan}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => navigate(`/loja/${currentUser.uid}`)}
                    >
                      Visualizar Loja
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Ações Rápidas</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setSelectedSection("Gerenciar Estoque")}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Adicionar Produto
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={() => setSelectedSection("Editar Cabeçalho")}
                      sx={{ mt: 1 }}
                    >
                      Configurar Loja
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {userPlan === "free" && (
              <Alert severity="info" sx={{ mt: 3 }}>
                Você está no plano Free.{" "}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => setSelectedSection("Upgrade de Plano")}
                  sx={{ ml: 1 }}
                >
                  Faça upgrade agora
                </Button>{" "}
                para acessar todos os recursos.
              </Alert>
            )}
          </div>
        );
      case "Editar Cabeçalho":
        return (
          <EditHeader
            headerTitle={headerTitle}
            setHeaderTitle={setHeaderTitle}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            onSave={saveHeaderChanges}
            currentUser={currentUser}
          />
        );
      case "Editar Banner":
        return (
          <EditBanner
            bannerImages={bannerImages}
            setBannerImages={setBannerImages}
            newBannerImage={newBannerImage}
            setNewBannerImage={setNewBannerImage}
            onAddBanner={addBannerImage}
            onRemoveBanner={removeBannerImage}
            currentUser={currentUser}
            userPlan={userPlan} // "free", "plus", or "premium"
          />
        );
      case "Gerenciar Estoque":
        return (
          <ManageStock
            products={products}
            setProducts={setProducts}
            currentUser={currentUser}
          />
        );
      case "Relatórios de Vendas":
        return <SalesReports currentUser={currentUser} />;
      case "Configurar WhatsApp":
        return (
          <div>
            <h2>Configurar WhatsApp para Vendas</h2>
            <TextField
              label="Número do WhatsApp (com DDD)"
              fullWidth
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Ex: 5585999999999"
            />
            <Button variant="contained" onClick={saveWhatsappChanges}>
              Salvar Número
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Este número será usado para os clientes entrarem em contato diretamente da loja.
            </Typography>
          </div>
        );
      case "Visualizar Loja":
        return (
          <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(`/loja/${currentUser.uid}`)}
              startIcon={<PreviewIcon />}
            >
              Abrir Loja em Nova Guia
            </Button>
          </Box>
        );
      case "Upgrade de Plano":
        return currentUser ? <PlanoUpgrade user={currentUser} /> : null;
      case "Preview Estático":
        return (
          <div>
            <h2>Preview Estático da Loja</h2>
            <div
              style={{
                backgroundColor: corPrimaria,
                color: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <h1>{headerTitle}</h1>
              <img src={logoUrl} alt="Logo da Loja" style={{ maxWidth: "100%", maxHeight: "200px" }} />
              <div>
                {bannerImages.length === 0 ? (
                  <p>Nenhuma imagem adicionada ainda.</p>
                ) : (
                  <Grid container spacing={2}>
                    {bannerImages.map((image, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="140"
                            image={image}
                            alt={`Banner ${index + 1}`}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate(`/loja/${currentUser.uid}`)}
              startIcon={<PreviewIcon />}
              sx={{ mt: 3 }}
            >
              Publicar Loja
            </Button>
          </div>
        );
      default:
        return (
          <div>
            <h2>{selectedSection}</h2>
            <p>Seção em desenvolvimento.</p>
          </div>
        );
    }
  };
  
  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedPlans.includes(userPlan)
  );
  const drawerContent = (
    <div className="admin-loja-drawer-container">
      <Toolbar className="admin-loja-drawer-header">
        <Typography variant="h6" noWrap>
          {storeData?.storeName || "Minha Loja"}
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
          backgroundColor: (theme) => theme.palette.primary.main || "#4a6bff",
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
            {storeData?.storeName || "Minha Loja"}
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