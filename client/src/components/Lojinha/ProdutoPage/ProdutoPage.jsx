import React, { useEffect, useState } from "react";
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
  Divider,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Badge,
  Tooltip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
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
  const [expandedAccordion, setExpandedAccordion] = useState('description');
  const placeholderLarge = "https://placehold.co/600x600/eef1f5/777?text=Imagem+Indisponível";
  const placeholderThumb = "https://placehold.co/100x100/eef1f5/777?text=Img";

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

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

  const fetchProdutoData = async () => {
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
  };

  useEffect(() => {
    if (!slug || !produtoSlug) {
      setError("Slugs da loja ou produto não fornecidos.");
      setLoading(false);
      return;
    }
    fetchProdutoData();
  }, [slug, produtoSlug]);

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
      // Inicializa variantes selecionadas de forma robusta
      let variantsArray = [];
      
      // Caso 1: Variantes como array (estrutura correta)
      if (Array.isArray(produto.variants)) {
        variantsArray = produto.variants;
      } 
      // Caso 2: Variantes como objeto (estrutura antiga - compatibilidade)
      else if (produto.variants && typeof produto.variants === 'object') {
        // Converte o objeto de variantes para array
        variantsArray = [{
          name: produto.variants.name || "Tamanho",
          options: Array.isArray(produto.variants.options) ? produto.variants.options : [],
          default: produto.variants.default,
          required: produto.variants.required !== false
        }];
      }

      const initialVariants = {};
      variantsArray.forEach(variant => {
        if (variant && variant.options && variant.options.length > 0) {
          // Seleciona a opção padrão ou a primeira opção disponível
          initialVariants[variant.name || "Tamanho"] = variant.default || variant.options[0];
        }
      });
      setSelectedVariants(initialVariants);
      
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

    // Verifica se todas as variantes obrigatórias foram selecionadas
    let variantsToCheck = [];
    if (Array.isArray(produto.variants)) {
      variantsToCheck = produto.variants;
    } else if (produto.variants && typeof produto.variants === 'object') {
      variantsToCheck = [{
        name: produto.variants.name || "Tamanho",
        options: Array.isArray(produto.variants.options) ? produto.variants.options : [],
        required: produto.variants.required !== false
      }];
    }

    for (const variant of variantsToCheck) {
      if (typeof variant === 'object' && variant.required) {
        const variantName = variant.name || "Tamanho";
        if (!selectedVariants[variantName]) {
          showSnackbar(`Por favor, selecione uma opção para ${variantName}`);
          return;
        }
      }
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

    // Calcula preço com base nas condições de preço
    let pricePerUnit = Number(produto.price);
    if (produto.priceConditions && Array.isArray(produto.priceConditions)) {
      // Ordena as condições por quantidade (maior primeiro)
      const sortedConditions = [...produto.priceConditions].sort((a, b) => b.quantity - a.quantity);
      
      for (const condition of sortedConditions) {
        if (quantity >= condition.quantity) {
          pricePerUnit = Number(condition.pricePerUnit);
          break; // Usa a primeira condição que atende (a maior com menor preço)
        }
      }
    }

    // Cria objeto do item com as variantes selecionadas
    const itemToAdd = {
      id: produto.id,
      name: produto.name,
      price: pricePerUnit,
      imageUrl: mainImageUrl,
      qtd: quantity,
      variants: selectedVariants, // Inclui todas as variantes selecionadas
      lojaId: loja.id,
      lojaSlug: slug,
      stock: currentStock,
      priceConditions: produto.priceConditions || [],
      // Adiciona uma chave única considerando as variantes
      uniqueKey: `${produto.id}_${JSON.stringify(selectedVariants)}`
    };

    setCartItemsInternal(prevCart => {
      // Verifica se já existe um item igual no carrinho (mesmo ID e mesmas variantes)
      const existingIndex = prevCart.findIndex(
        item => item.uniqueKey === itemToAdd.uniqueKey
      );

      if (existingIndex > -1) {
        // Atualiza quantidade se o item já existe
        const updatedCart = [...prevCart];
        const newQtd = updatedCart[existingIndex].qtd + quantity;
        
        if (newQtd > currentStock) {
          showSnackbar(`Você já tem ${updatedCart[existingIndex].qtd} no carrinho. Limite de estoque: ${currentStock}`);
          return prevCart;
        }
        
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qtd: newQtd
        };
        return updatedCart;
      } else {
        // Adiciona novo item ao carrinho
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

  const getCurrentPricePerUnit = () => {
    let pricePerUnit = Number(produto?.price) || 0;
    if (produto?.priceConditions && Array.isArray(produto.priceConditions)) {
      // Ordena as condições por quantidade (maior primeiro)
      const sortedConditions = [...produto.priceConditions].sort((a, b) => b.quantity - a.quantity);
      
      for (const condition of sortedConditions) {
        if (quantity >= condition.quantity) {
          pricePerUnit = Number(condition.pricePerUnit);
          break;
        }
      }
    }
    return pricePerUnit;
  };

  // Dados calculados
  const discountPercent = getDiscountPercent();
  const currentStock = Number(produto?.stock) || 0;
  const isOutOfStock = currentStock <= 0;
  const imagesArray = Array.isArray(produto?.images) ? produto.images : [];
  const safeSelectedImage = Math.max(0, Math.min(selectedImage, imagesArray.length - 1));
  const mainImageUrl = imagesArray[safeSelectedImage] || placeholderLarge;
  const currentPrice = getCurrentPricePerUnit();
  const totalPrice = currentPrice * quantity;

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
        {/* <NavBar
          nomeLoja="Informação Indisponível"
          logoUrlState=""
          exibirLogo={false}
          cartCount={0}
          onCartClick={() => navigate('/')}
        /> */}
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
      {/* <NavBar
        nomeLoja={loja.nome}
        logoUrlState={loja.logoUrl || ""}
        exibirLogo={loja.exibirLogo !== false}
        cartCount={cartItemCount}
        onCartClick={() => navigate(`/carrinho/${loja.id}`)}
      /> */}
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
                
                {/* Preço e Desconto */}
                <Box mb={2.5}>
                  <Box display="flex" alignItems="flex-end" gap={1}>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(currentPrice)}
                    </Typography>
                    {quantity > 1 && (
                      <Typography variant="body1" color="text.secondary">
                        ({formatCurrency(totalPrice)} total)
                      </Typography>
                    )}
                  </Box>
                  {produto.anchorPrice && (
                    <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                      {formatCurrency(produto.anchorPrice)}
                    </Typography>
                  )}
                  {discountPercent > 0 && (
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                      {discountPercent}% de desconto
                    </Typography>
                  )}
                </Box>

                {/* Condições de Preço */}
                {produto.priceConditions && produto.priceConditions.length > 0 && (
                  <Box mb={3} sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Descontos progressivos:
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      {produto.priceConditions
                        .sort((a, b) => b.quantity - a.quantity)
                        .map((condition, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5, px: 1 }}>
                            <ListItemText
                              primary={`Leve ${condition.quantity} un. por ${formatCurrency(condition.pricePerUnit)} cada`}
                              secondary={`Economize ${Math.round((produto.price - condition.pricePerUnit) / produto.price * 100)}%`}
                              secondaryTypographyProps={{ color: 'success.main' }}
                            />
                            {quantity >= condition.quantity && (
                              <Badge badgeContent="✓" color="success" sx={{ mr: 1 }} />
                            )}
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                )}

                {/* Variantes do Produto */}
                {(Array.isArray(produto.variants) || (produto.variants && typeof produto.variants === 'object')) && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Opções disponíveis:
                    </Typography>
                    
                    {/* Converter para array se for objeto (estrutura antiga) */}
                    {(() => {
                      let variantsToRender = [];
                      
                      if (Array.isArray(produto.variants)) {
                        variantsToRender = produto.variants;
                      } else if (produto.variants && typeof produto.variants === 'object') {
                        variantsToRender = [{
                          name: produto.variants.name || "Tamanho",
                          options: Array.isArray(produto.variants.options) ? produto.variants.options : [],
                          default: produto.variants.default,
                          required: produto.variants.required !== false
                        }];
                      }
                      
                      return variantsToRender.map((variant, index) => {
                        // Variante simples (apenas texto)
                        if (typeof variant === 'string') {
                          return <Chip label={variant} key={index} sx={{ mr: 1, mb: 1 }} />;
                        }
                        
                        // Variante com opções selecionáveis
                        return (
                          <Box key={variant.name || `variant-${index}`} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                              {variant.name || "Tamanho"}:
                              {variant.required && (
                                <Typography component="span" color="error.main" sx={{ ml: 1 }}>
                                  *
                                </Typography>
                              )}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {variant.options.map((option) => {
                                const variantName = variant.name || "Tamanho";
                                const isSelected = selectedVariants[variantName] === option;
                                return (
                                  <Button
                                    key={option}
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    onClick={() => handleVariantChange(variantName, option)}
                                    sx={{
                                      textTransform: 'none',
                                      minWidth: 'auto',
                                      borderRadius: '8px',
                                      border: isSelected ? '2px solid' : '1px solid',
                                      borderColor: isSelected ? 'primary.main' : 'divider',
                                      backgroundColor: isSelected ? 'primary.light' : 'background.paper',
                                      color: isSelected ? 'primary.contrastText' : 'text.primary',
                                      '&:hover': {
                                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                                      }
                                    }}
                                  >
                                    {option}
                                  </Button>
                                );
                              })}
                            </Box>
                          </Box>
                        );
                      });
                    })()}
                  </Box>
                )}

                {/* Quantidade e Estoque */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: isOutOfStock ? 'error.main' : 'text.secondary' }}>
                      <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {isOutOfStock ? "Produto Esgotado" : `Em estoque: ${currentStock}`}
                    </Typography>
                    {produto.sku && (
                      <Typography variant="body2" color="text.secondary">
                        SKU: {produto.sku}
                      </Typography>
                    )}
                  </Box>
                  {!isOutOfStock && (
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Diminuir quantidade">
                        <IconButton 
                          onClick={() => handleQuantityChange(-1)} 
                          disabled={quantity <= 1}
                          size="small"
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <TextField
                        value={quantity}
                        onChange={handleDirectQuantityInput}
                        inputProps={{ 
                          min: 1, 
                          max: currentStock,
                          style: { textAlign: 'center' }
                        }}
                        sx={{ width: '70px', mx: 1 }}
                        size="small"
                      />
                      <Tooltip title="Aumentar quantidade">
                        <IconButton 
                          onClick={() => handleQuantityChange(1)} 
                          disabled={quantity >= currentStock}
                          size="small"
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {/* Botões de Ação */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCartInternal}
                    disabled={isOutOfStock}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: '8px' }}
                  >
                    {isOutOfStock ? "Esgotado" : "Adicionar ao Carrinho"}
                  </Button>
                  <Tooltip title="Compartilhar">
                    <IconButton 
                      onClick={handleShare}
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: '8px'
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Seções de Informações */}
          <Box mt={5}>
            <Divider sx={{ mb: 3 }} />
            
            {/* Descrição */}
            <Accordion 
              expanded={expandedAccordion === 'description'} 
              onChange={handleAccordionChange('description')}
              elevation={0}
              sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: '8px !important',
                mb: 2
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Descrição do Produto</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {produto.description ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {produto.description}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma descrição disponível para este produto.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
            
            {/* Especificações */}
            {produto.specifications && Object.keys(produto.specifications).length > 0 && (
              <Accordion 
                expanded={expandedAccordion === 'specs'} 
                onChange={handleAccordionChange('specs')}
                elevation={0}
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: '8px !important',
                  mb: 2
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Especificações</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {Object.entries(produto.specifications).map(([key, value]) => (
                      <ListItem key={key} sx={{ py: 0.5 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={4} sm={3}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {key}:
                            </Typography>
                          </Grid>
                          <Grid item xs={8} sm={9}>
                            <Typography variant="body2">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
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