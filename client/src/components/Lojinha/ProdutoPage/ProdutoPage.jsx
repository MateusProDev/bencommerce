import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Chip,
  TextField,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
} from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./ProdutoPage.css";

const ProdutoPage = () => {
  const { slug, produtoSlug } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [cartItemsInternal, setCartItemsInternal] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const placeholderLarge = "https://placehold.co/600x600/eef1f5/777?text=Imagem+Indisponível";
  const placeholderThumb = "https://placehold.co/100x100/eef1f5/777?text=Img";

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 'R$ 0,00';
    }
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  };

  const fetchProdutoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Busca dados da loja
      const lojaQuery = query(collection(db, "lojas"), where("slug", "==", slug));
      const lojaSnap = await getDocs(lojaQuery);
      if (lojaSnap.empty) {
        throw new Error(`Loja com slug "${slug}" não encontrada.`);
      }
      const lojaData = { id: lojaSnap.docs[0].id, ...lojaSnap.docs[0].data() };
      setLoja(lojaData);

      // Busca dados do produto
      let produtoData = null;
      const produtoQuery = query(
        collection(db, `lojas/${lojaData.id}/produtos`),
        where("slug", "==", produtoSlug)
      );
      const produtosSnap = await getDocs(produtoQuery);
      if (!produtosSnap.empty) {
        produtoData = { id: produtosSnap.docs[0].id, ...produtosSnap.docs[0].data() };
      } else {
        const produtoDocRef = doc(db, `lojas/${lojaData.id}/produtos`, produtoSlug);
        const produtoDocSnap = await getDoc(produtoDocRef);
        if (produtoDocSnap.exists()) {
          produtoData = { id: produtoDocSnap.id, ...produtoDocSnap.data() };
        } else {
          throw new Error(`Produto não encontrado na loja "${lojaData.nome}".`);
        }
      }

      // Garante que images seja um array
      if (produtoData && !Array.isArray(produtoData.images)) {
        produtoData.images = [];
      }

      // Validação de dados básicos
      if (!produtoData.name || !produtoData.price) {
        console.warn("Produto com dados incompletos:", produtoData);
      }
      setProduto(produtoData);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.message || "Erro ao carregar dados do produto.");
    } finally {
      setLoading(false);
    }
  }, [slug, produtoSlug]);

  useEffect(() => {
    if (!slug || !produtoSlug) {
      setError("Slugs da loja ou produto não fornecidos.");
      setLoading(false);
      return;
    }
    fetchProdutoData();
  }, [slug, produtoSlug, fetchProdutoData]);

  useEffect(() => {
    if (loja?.id) {
      const savedCart = localStorage.getItem(`lojinha_cart_${loja.id}`);
      try {
        const currentCart = savedCart ? JSON.parse(savedCart) : [];
        setCartItemsInternal(currentCart);
      } catch (e) {
        console.error("Erro ao parsear carrinho do localStorage:", e);
        setCartItemsInternal([]);
      }
    }
  }, [loja?.id]);

  useEffect(() => {
    if (loja?.id) {
      localStorage.setItem(`lojinha_cart_${loja.id}`, JSON.stringify(cartItemsInternal));
      const count = cartItemsInternal.reduce((sum, item) => sum + (item.qtd || 0), 0);
      setCartItemCount(count);
      window.dispatchEvent(new CustomEvent('cartUpdatedGlobal', { 
        detail: { lojaId: loja.id, itemCount: count } 
      }));
    }
  }, [cartItemsInternal, loja?.id]);

  useEffect(() => {
    if (produto) {
      // Inicializa variantes selecionadas
      if (produto.variants && Array.isArray(produto.variants)) {
        const initialVariants = {};
        produto.variants.forEach((variant, index) => {
          if (typeof variant === 'string') {
            initialVariants[`variant_${index}`] = variant;
          } else if (variant.name && Array.isArray(variant.options) && variant.options.length > 0) {
            initialVariants[variant.name] = variant.default || variant.options[0];
          }
        });
        setSelectedVariants(initialVariants);
      }
      // Reset imagem selecionada e quantidade
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [produto]);

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: value }));
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      const stockLimit = Number(produto?.stock) || 0;
      if (stockLimit > 0 && newQuantity > stockLimit) {
        showSnackbar(`Quantidade máxima em estoque: ${stockLimit}`);
        return stockLimit;
      }
      return newQuantity;
    });
  };

  const handleDirectQuantityInput = (e) => {
    let value = parseInt(e.target.value, 10) || 1;
    const stockLimit = Number(produto?.stock) || 0;
    if (stockLimit > 0 && value > stockLimit) {
      value = stockLimit;
      showSnackbar(`Quantidade máxima em estoque: ${stockLimit}`);
    } else if (value < 1) {
      value = 1;
    }
    setQuantity(value);
  };

  const handleAddToCartInternal = () => {
    if (!produto || !loja) {
      showSnackbar("Erro ao adicionar ao carrinho. Tente novamente.");
      return;
    }
    const currentStock = Number(produto.stock) || 0;
    if (currentStock <= 0) {
      showSnackbar("Produto fora de estoque.");
      return;
    }
    if (currentStock < quantity) {
      showSnackbar(`Quantidade solicitada excede o estoque disponível (${currentStock}).`);
      return;
    }

    // Valida variantes se necessário
    if (produto.variants && Array.isArray(produto.variants)) {
      for (const variant of produto.variants) {
        if (typeof variant !== 'string' && variant.options && variant.options.length > 0 && !selectedVariants[variant.name]) {
          showSnackbar(`Selecione uma opção para ${variant.name}.`);
          return;
        }
      }
    }

    const itemToAdd = {
      id: produto.id,
      name: produto.name,
      price: Number(produto.price),
      imageUrl: mainImageUrl,
      qtd: quantity,
      selectedVariants: { ...selectedVariants },
      lojaId: loja.id,
      lojaSlug: slug,
      stock: currentStock, // Adiciona informação de estoque para validações futuras
    };

    setCartItemsInternal(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemToAdd.id &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(itemToAdd.selectedVariants)
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newQtd = existingItem.qtd + quantity;
        if (existingItem.stock && newQtd > existingItem.stock) {
          showSnackbar(`Você já tem ${existingItem.qtd} no carrinho. Limite de estoque: ${existingItem.stock}`);
          return prevCart;
        }
        updatedCart[existingItemIndex] = {
          ...existingItem,
          qtd: newQtd
        };
        return updatedCart;
      } else {
        return [...prevCart, itemToAdd];
      }
    });

    showSnackbar(`${quantity} ${produto.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: produto?.name || "Confira este produto!",
        text: `Olha este produto que encontrei na loja ${loja?.nome || ''}: ${produto?.name || ''}`,
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSnackbar('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      showSnackbar('Não foi possível compartilhar o produto.');
    }
  };

  const getDiscountPercent = () => {
    if (produto && produto.anchorPrice && produto.price) {
      const anchor = Number(produto.anchorPrice);
      const current = Number(produto.price);
      if (anchor > current && anchor > 0) {
        return Math.round(((anchor - current) / anchor) * 100);
      }
    }
    return 0;
  };

  // Dados calculados
  const discountPercent = getDiscountPercent();
  const currentStock = Number(produto?.stock) || 0;
  const isOutOfStock = currentStock <= 0;
  const imagesArray = Array.isArray(produto?.images) ? produto.images : [];
  const safeSelectedImage = Math.max(0, Math.min(selectedImage, imagesArray.length - 1));
  const mainImageUrl = imagesArray[safeSelectedImage] || placeholderLarge;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <>
        <NavBar
          nomeLoja={loja?.nome || "Erro"}
          logoUrlState={loja?.logoUrl || ""}
          exibirLogo={loja?.exibirLogo !== false}
          cartCount={cartItemCount}
          onCartClick={() => loja?.id ? navigate(`/carrinho/${loja.id}`) : null}
        />
        <Container sx={{ textAlign: 'center', mt: 2, p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(slug ? `/${slug}` : '/')}>
            Voltar
          </Button>
        </Container>
        <Footer nomeLoja={loja?.nome || ""} footerData={loja?.footer || {}} />
      </>
    );
  }

  if (!produto || !loja) {
    return (
      <>
        <NavBar
          nomeLoja="Informação Indisponível"
          logoUrlState=""
          exibirLogo={false}
          cartCount={0}
          onCartClick={() => navigate('/')}
        />
        <Container sx={{ textAlign: 'center', mt: 10, p: 2 }}>
          <Typography variant="h6">Produto não encontrado</Typography>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Voltar para Home
          </Button>
        </Container>
        <Footer nomeLoja="" footerData={{}} />
      </>
    );
  }

  return (
    <>
      <NavBar
        nomeLoja={loja.nome}
        logoUrlState={loja.logoUrl || ""}
        exibirLogo={loja.exibirLogo !== false}
        cartCount={cartItemCount}
        onCartClick={() => navigate(`/carrinho/${loja.id}`)}
      />
      <Container maxWidth="lg" className="produto-page-container">
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/${slug}`)} 
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Voltar para {loja.nome}
        </Button>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 5 } }}>
            {/* Galeria de Imagens */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box className="image-gallery">
                <Box className="main-image-container" mb={1.5}>
                  <img
                    src={mainImageUrl}
                    alt={produto.name}
                    className="main-product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderLarge;
                    }}
                  />
                  {discountPercent > 0 && (
                    <Chip label={`${discountPercent}% OFF`} color="error" className="discount-badge" />
                  )}
                </Box>
                {imagesArray.length > 1 && (
                  <Box className="thumbnail-container">
                    {imagesArray.map((imgUrl, index) => (
                      <Box key={index} sx={{ width: 'calc(25% - 6px)' }}>
                        <img
                          src={imgUrl || placeholderThumb}
                          alt={`Miniatura ${index + 1}`}
                          className={`thumbnail-image ${safeSelectedImage === index ? "selected" : ""}`}
                          onClick={() => setSelectedImage(index)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholderThumb;
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
            {/* Detalhes do Produto */}
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box className="product-details">
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  {produto.name}
                </Typography>
                <Box mb={2.5}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(produto.price)}
                  </Typography>
                  {produto.anchorPrice && (
                    <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                      {formatCurrency(produto.anchorPrice)}
                    </Typography>
                  )}
                </Box>
                {produto.variants?.map((variant, index) => {
                  if (typeof variant === 'string') {
                    return <Chip label={variant} key={index} sx={{ mr: 1, mb: 1 }} />;
                  }
                  return (
                    <FormControl fullWidth sx={{ mb: 2.5 }} key={variant.name}>
                      <InputLabel>{variant.name}</InputLabel>
                      <Select
                        value={selectedVariants[variant.name] || ''}
                        label={variant.name}
                        onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                      >
                        {variant.options.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                })}
                <Box mb={3}>
                  <Typography variant="body2" sx={{ mb: 1, color: isOutOfStock ? 'error.main' : 'text.secondary' }}>
                    {isOutOfStock ? "Produto Esgotado" : `Em estoque: ${currentStock}`}
                  </Typography>
                  {!isOutOfStock && (
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        onClick={() => handleQuantityChange(-1)} 
                        disabled={quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={quantity}
                        onChange={handleDirectQuantityInput}
                        inputProps={{ min: 1, max: currentStock }}
                        sx={{ width: '70px', mx: 1 }}
                        size="small"
                      />
                      <IconButton 
                        onClick={() => handleQuantityChange(1)} 
                        disabled={quantity >= currentStock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCartInternal}
                    disabled={isOutOfStock}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {isOutOfStock ? "Esgotado" : "Adicionar ao Carrinho"}
                  </Button>
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Descrição */}
          <Box mt={5}>
            <Divider sx={{ mb: 3 }} />
            {produto.description && (
              <Box mb={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Descrição
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {produto.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
      <Footer nomeLoja={loja.nome} footerData={loja.footer || {}} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default ProdutoPage;