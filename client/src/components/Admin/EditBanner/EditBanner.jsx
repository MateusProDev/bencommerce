import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Grid, 
  Card, 
  CardMedia, 
  CardActions, 
  Typography, 
  Alert, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from "@mui/material";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import CloudinaryUploadWidget from "../../CloudinaryUploadWidget/CloudinaryUploadWidget";

const EditBanner = ({
  currentUser,
  userPlan = "free"
}) => {
  const [banners, setBanners] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [bannerFormData, setBannerFormData] = useState({
    alt: "",
    linkTo: ""
  });

  // Define banner limits based on user plan
  const getPlanBannerLimit = () => {
    switch (userPlan) {
      case "premium":
        return 5;
      case "plus":
        return 3;
      case "free":
      default:
        return 1;
    }
  };

  const bannerLimit = getPlanBannerLimit();
  const remainingBanners = bannerLimit - banners.length;

  // Resgatar banners do Firestore ao carregar o componente
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const storeDoc = await getDoc(doc(db, "lojas", currentUser.uid));
        
        if (storeDoc.exists()) {
          const storeData = storeDoc.data();
          // Converter os banners do formato de mapa para array
          if (storeData.bannerImages) {
            const bannersArray = [];
            // Iterar sobre as chaves do mapa de banners
            Object.keys(storeData.bannerImages).forEach(key => {
              const banner = storeData.bannerImages[key];
              // Verificar se é realmente um objeto de banner
              if (banner && typeof banner === 'object' && banner.url) {
                bannersArray.push({
                  ...banner,
                  key: key // Salvar a chave original para referência
                });
              }
            });
            // Ordenar por posição
            bannersArray.sort((a, b) => a.position - b.position);
            setBanners(bannersArray);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
        setUploadError("Erro ao carregar os banners");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.uid) {
      fetchBanners();
    }
  }, [currentUser]);

  // Salvar mudanças no Firestore
  const saveBannerChanges = async (updatedBanners) => {
    try {
      // Converter array de volta para o formato de mapa
      const bannerMap = {};
      updatedBanners.forEach(banner => {
        const { key, ...bannerData } = banner;
        bannerMap[key] = bannerData;
      });

      await updateDoc(doc(db, "lojas", currentUser.uid), {
        bannerImages: bannerMap
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar banners:", error);
      setUploadError("Erro ao salvar as imagens do banner");
      return false;
    }
  };

  const handleAddBanner = async (url) => {
    if (banners.length >= bannerLimit) {
      setUploadError(`Seu plano ${userPlan} permite apenas ${bannerLimit} banner(s)`);
      return;
    }

    // Abrir diálogo para adicionar informações do banner
    setCurrentBanner({
      url: url,
      id: generateId(),
      active: true,
      addedAt: new Date(),
      position: banners.length + 1,
      key: generateId() // Gerar uma chave única para o novo banner
    });
    setBannerFormData({
      alt: "",
      linkTo: ""
    });
    setOpenDialog(true);
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleRemoveBanner = async (index) => {
    const updatedBanners = banners.filter((_, i) => i !== index);
    // Atualizar posições após remoção
    updatedBanners.forEach((banner, idx) => {
      banner.position = idx + 1;
    });
    setBanners(updatedBanners);
    await saveBannerChanges(updatedBanners);
    setUploadError("");
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentBanner(null);
  };

  const handleDialogSave = async () => {
    if (!currentBanner) return;

    const newBanner = {
      ...currentBanner,
      alt: bannerFormData.alt,
      linkTo: bannerFormData.linkTo
    };

    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    await saveBannerChanges(updatedBanners);
    setOpenDialog(false);
    setCurrentBanner(null);
    setUploadError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerFormData({
      ...bannerFormData,
      [name]: value
    });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Editar Banner
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Seu plano <strong>{userPlan.toUpperCase()}</strong> permite até <strong>{bannerLimit}</strong> banner(s).
          {remainingBanners > 0 ? (
            <span> Você ainda pode adicionar <strong>{remainingBanners}</strong> banner(s).</span>
          ) : (
            <span> Você atingiu o limite de banners para seu plano.</span>
          )}
        </Typography>
      </Box>

      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      {loading ? (
        <Typography>Carregando banners...</Typography>
      ) : (
        <>
          {remainingBanners > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar banner
              </Typography>
              <CloudinaryUploadWidget onUpload={handleAddBanner} />
            </Box>
          )}

          {banners.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {banners.map((banner, idx) => (
                <Grid item xs={12} sm={6} md={4} key={banner.key || idx}>
                  <Card>
                    <CardMedia 
                      component="img" 
                      height="180" 
                      image={banner.url} 
                      alt={banner.alt || `Banner ${idx + 1}`} 
                    />
                    <Box p={1}>
                      {banner.alt && (
                        <Typography variant="body2" color="text.secondary">
                          Texto alternativo: {banner.alt}
                        </Typography>
                      )}
                      {banner.linkTo && (
                        <Typography variant="body2" color="text.secondary">
                          Link: {banner.linkTo}
                        </Typography>
                      )}
                    </Box>
                    <CardActions>
                      <Button 
                        variant="contained" 
                        color="error" 
                        size="small"
                        onClick={() => handleRemoveBanner(idx)}
                      >
                        Remover
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              Você ainda não adicionou nenhum banner. Adicione imagens para exibir na página inicial da sua loja.
            </Alert>
          )}

          {userPlan === "free" && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Faça upgrade para o plano Plus e tenha direito a 3 banners, ou para o Premium e tenha direito a 5 banners!
            </Alert>
          )}
          
          {userPlan === "plus" && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Faça upgrade para o plano Premium e tenha direito a 5 banners!
            </Alert>
          )}
        </>
      )}

      {/* Diálogo para adicionar informações do banner */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Detalhes do Banner</DialogTitle>
        <DialogContent>
          {currentBanner && (
            <>
              <Box sx={{ mb: 2, mt: 1 }}>
                <img 
                  src={currentBanner.url} 
                  alt="Preview do banner" 
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                />
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="banner-alt">Texto alternativo</InputLabel>
                <OutlinedInput
                  id="banner-alt"
                  name="alt"
                  value={bannerFormData.alt}
                  onChange={handleInputChange}
                  label="Texto alternativo"
                />
                <FormHelperText>Descreva o conteúdo do banner (ajuda na acessibilidade)</FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="banner-link">Link (opcional)</InputLabel>
                <OutlinedInput
                  id="banner-link"
                  name="linkTo"
                  value={bannerFormData.linkTo}
                  onChange={handleInputChange}
                  label="Link (opcional)"
                  placeholder="/promocao ou https://..."
                />
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleDialogSave}>
            Salvar Banner
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditBanner;