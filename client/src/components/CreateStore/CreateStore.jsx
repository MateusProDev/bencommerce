import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { setDoc, doc, writeBatch, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import JSConfetti from 'js-confetti';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiShoppingBag, FiTag, FiImage, FiDollarSign } from 'react-icons/fi';
import './CreateStore.css';

const CreateStore = ({ onStoreCreated }) => {
  const steps = [
    { 
      title: 'Nome da Loja', 
      description: 'Como sua loja será chamada?',
      icon: <FiShoppingBag size={24} />
    },
    { 
      title: 'Segmento', 
      description: 'Qual o segmento do seu negócio?',
      icon: <FiTag size={24} />
    },
    { 
      title: 'Logo', 
      description: 'Adicione uma imagem para sua loja',
      icon: <FiImage size={24} />
    },
    { 
      title: 'Plano', 
      description: 'Escolha o plano ideal para você',
      icon: <FiDollarSign size={24} />
    },
    { 
      title: 'Confirmação', 
      description: 'Revise os dados e finalize',
      icon: <FiCheck size={24} />
    }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [nomeLoja, setNomeLoja] = useState('');
  const [segmento, setSegmento] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [plano, setPlano] = useState('free');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [jsConfetti, setJsConfetti] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    // Inicializa o JSConfetti
    setJsConfetti(new JSConfetti());
    
    // Verifica se há um plano selecionado na navegação
    if (location.state?.selectedPlan) {
      setPlano(location.state.selectedPlan);
    }
  }, [location.state]);

  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      navigate('/dashboard');
    }
  }, [showSuccess, countdown, navigate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setLogoUrl(data.secure_url);
        setUploadProgress(100);
      } else {
        throw new Error('Erro ao fazer upload da imagem');
      }
    } catch (err) {
      console.error('Erro no upload da imagem:', err);
      setErrorMsg('Erro ao enviar imagem. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    switch(currentStep) {
      case 0:
        if (!nomeLoja.trim()) {
          setErrorMsg('Por favor, insira um nome para sua loja');
          return false;
        }
        if (nomeLoja.length < 3) {
          setErrorMsg('O nome da loja deve ter pelo menos 3 caracteres');
          return false;
        }
        break;
      case 1:
        if (!segmento.trim()) {
          setErrorMsg('Por favor, insira o segmento da sua loja');
          return false;
        }
        break;
      case 2:
        if (!logoUrl) {
          setErrorMsg('Por favor, faça upload de uma imagem para sua loja');
          return false;
        }
        break;
      case 3:
        if (!plano) {
          setErrorMsg('Por favor, selecione um plano');
          return false;
        }
        break;
      default:
        break;
    }
    setErrorMsg('');
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setErrorMsg('');
  };

  const handleCreateStore = async () => {
    if (!validateStep()) return;
    
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const agora = new Date();
      const expiracaoDate = new Date();
      expiracaoDate.setDate(expiracaoDate.getDate() + 7);

      // Cria um slug amigável para a URL da loja
      const slug = nomeLoja.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');

      const lojaData = {
        nome: nomeLoja,
        segmento,
        logoUrl,
        plano,
        donoUid: user.uid,
        status: 'ativa',
        slug,
        criadaEm: agora.toISOString(),
        atualizadaEm: agora.toISOString(),
        categorias: [], // Inicializa array vazio
        configs: {
          corPrimaria: '#4a6bff',
          corSecundaria: '#2541b2',
          tema: 'claro'
        }
      };

      const usuarioData = {
        planoAtual: plano,
        plano,
        dataInicioPlano: agora.toISOString(),
        expiracaoPlano: plano === 'free' ? null : expiracaoDate.toISOString(),
        emTeste: plano !== 'free',
        testeGratuito: plano !== 'free',
        inicioTeste: plano !== 'free' ? agora.toISOString() : null,
        fimTeste: plano !== 'free' ? expiracaoDate.toISOString() : null,
        storeCreated: true,
        descontoAplicado: false,
        planoAtivo: false,
        ultimoLogin: agora.toISOString()
      };

      // Usa uma transação batch para garantir que ambas as operações sejam completadas
      const batch = writeBatch(db);
      batch.set(doc(db, 'lojas', user.uid), lojaData);
      batch.set(doc(db, 'usuarios', user.uid), usuarioData, { merge: true });
      await batch.commit();

      // Crie a subcoleção 'produtos' com um documento vazio (ou placeholder)
      const produtoRef = doc(collection(db, "lojas", user.uid, "produtos"));
      await setDoc(produtoRef, {
        name: "Produto de exemplo",
        price: "0.00",
        stock: "0",
        images: [],
        category: "",
        description: "",
        variants: [],
        createdAt: new Date().toISOString(),
        isPlaceholder: true // para você poder filtrar depois se quiser
      });

      // Efeito de confetti para celebrar a criação da loja
      if (jsConfetti) {
        jsConfetti.addConfetti({
          emojis: ['🛍️', '💰', '🛒', '💳', '✨', '🎉'],
          emojiSize: 50,
          confettiNumber: 100,
        });
      }

      setShowSuccess(true);
      if (onStoreCreated) onStoreCreated();
    } catch (err) {
      console.error('Erro ao criar loja:', err);
      setErrorMsg('Erro ao criar loja. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="step-content-inner">
            <div className="form-group mb-4">
              <label className="form-label-custom">Nome da Loja*</label>
              <input
                value={nomeLoja}
                onChange={(e) => setNomeLoja(e.target.value)}
                placeholder="Ex: Loja da Maria"
                className="form-control-custom"
                required
                maxLength={50}
              />
              <small className="form-text-custom">
                Este será o nome que seus clientes verão (máx. 50 caracteres)
              </small>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="step-content-inner">
            <div className="form-group mb-4">
              <label className="form-label-custom">Segmento*</label>
              <input
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                placeholder="Ex: Roupas, Calçados, Eletrônicos"
                className="form-control-custom"
                required
                maxLength={30}
              />
              <small className="form-text-custom">
                Escolha o segmento que melhor descreve seu negócio
              </small>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content-inner">
            <div className="form-group mb-4">
              <label className="form-label-custom">Logo*</label>
              <div className="file-upload-wrapper">
                <label className="file-upload-label">
                  <FiUpload className="me-2" />
                  {uploadProgress > 0 ? 'Enviando...' : 'Selecionar Imagem'}
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    className="file-upload-input" 
                    accept="image/*"
                    required
                  />
                </label>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress mt-3">
                  <div style={{ width: `${uploadProgress}%`, background: 'var(--gradient)', height: 8, borderRadius: 4 }} />
                  <span>{uploadProgress}%</span>
                </div>
              )}
              {logoUrl && (
                <div className="image-preview-wrapper mt-4">
                  <div className="image-preview-container">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="image-preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content-inner">
            <div className="form-group mb-4">
              <label className="form-label-custom">Plano*</label>
              <div className="plan-options">
                <div 
                  className={`plan-option ${plano === 'free' ? 'selected' : ''}`}
                  onClick={() => setPlano('free')}
                >
                  <h5>Free</h5>
                  <div className="price">R$0/mês</div>
                  <ul className="plan-features">
                    <li>Até 30 produtos</li>
                    <li>Certificado SSL</li>
                    <li>Gerenciamento de estoque</li>
                    <li>Suporte por email</li>
                  </ul>
                  <div className="plan-badge">Básico</div>
                </div>
                
                <div 
                  className={`plan-option ${plano === 'plus' ? 'selected' : ''}`}
                  onClick={() => setPlano('plus')}
                >
                  <h5>Plus</h5>
                  <div className="price">R$39,90/mês</div>
                  <ul className="plan-features">
                    <li>Até 300 produtos</li>
                    <li>Certificado SSL</li>
                    <li>Gerenciamento de estoque</li>
                    <li>Registro de vendas</li>
                    <li>Relatórios completos</li>
                    <li>Suporte prioritário</li>
                    <li>7 dias grátis</li>
                  </ul>
                  <div className="plan-badge popular">Popular</div>
                </div>
                
                <div 
                  className={`plan-option ${plano === 'premium' ? 'selected' : ''}`}
                  onClick={() => setPlano('premium')}
                >
                  <h5>Premium</h5>
                  <div className="price">R$99,90/mês</div>
                  <ul className="plan-features">
                    <li>Produtos ilimitados</li>
                    <li>Certificado SSL</li>
                    <li>Gerenciamento de estoque</li>
                    <li>Registro de vendas</li>
                    <li>Relatórios avançados</li>
                    <li>Suporte 24/7</li>
                    <li>7 dias grátis</li>
                    <li>Consultoria mensal</li>
                  </ul>
                  <div className="plan-badge">Premium</div>
                </div>
              </div>
              <small className="form-text-custom mt-3">
                Você pode alterar seu plano a qualquer momento no painel administrativo.
              </small>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content-inner confirmation-step">
            <h5 className="confirmation-title">Confira os dados da sua loja</h5>
            <div className="confirmation-card">
              <div className="confirmation-body">
                <div className="row">
                  <div className="col col-6">
                    <div className="confirmation-item">
                      <span className="confirmation-label">Nome:</span>
                      <span className="confirmation-value">{nomeLoja}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Segmento:</span>
                      <span className="confirmation-value">{segmento}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="confirmation-label">Plano:</span>
                      <span className="confirmation-value">
                        {plano === 'free' ? 'Free' : 
                         plano === 'plus' ? 'Plus' : 'Premium'}
                      </span>
                    </div>
                  </div>
                  <div className="col col-6">
                    <div className="confirmation-image-wrapper">
                      <span className="confirmation-label">Logo:</span>
                      {logoUrl ? (
                        <div className="confirmation-image-container">
                          <img
                            src={logoUrl}
                            alt="Logo preview"
                            className="confirmation-image"
                          />
                        </div>
                      ) : (
                        <div className="text-muted">Nenhum logo adicionado</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-store-wrapper">
      <div className="create-store-container">
        <div className="progress-steps-wrapper">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`progress-step ${currentStep >= index ? 'active' : ''} ${currentStep === index ? 'current' : ''}`}
              >
                <div className="step-icon">
                  {currentStep > index ? <FiCheck /> : step.icon}
                </div>
                <div className="step-info">
                  <div className="step-title">{step.title}</div>
                  {currentStep === index && (
                    <div className="step-description">{step.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-bar-main">
            <div
              className="progress-bar-inner"
              style={{
                width: `${(currentStep + 1) * (100 / steps.length)}%`,
                background: 'var(--gradient)',
                height: 8,
                borderRadius: 4,
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>
        <div className="main-card">
          <div className="main-card-body">
            {errorMsg && (
              <div className="error-alert">{errorMsg}</div>
            )}
            <div className="step-content-wrapper">
              {renderStepContent()}
            </div>
            <div className="navigation-buttons">
              <button 
                type="button"
                onClick={prevStep} 
                disabled={currentStep === 0 || loading}
                className="nav-button prev-button"
              >
                <FiArrowLeft className="me-2" />
                Voltar
              </button>
              {currentStep < steps.length - 1 ? (
                <button 
                  type="button"
                  onClick={nextStep} 
                  disabled={loading}
                  className="nav-button next-button"
                >
                  {loading ? (
                    <>Carregando...</>
                  ) : (
                    <>Próximo <FiArrowRight className="ms-2" /></>
                  )}
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleCreateStore} 
                  disabled={loading}
                  className="nav-button submit-button"
                >
                  {loading ? (
                    <>Finalizando...</>
                  ) : (
                    <>Criar Minha Loja <FiCheck className="ms-2" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de sucesso */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-modal-body">
            <div className="success-animation">
              <div className="checkmark">✓</div>
            </div>
            <h2 className="success-title">Loja criada com sucesso!</h2>
            <p className="success-message">
              Parabéns! Sua loja <strong>{nomeLoja}</strong> está pronta para começar a vender.
            </p>
            <p className="redirect-message">
              Redirecionando para o dashboard em <span className="countdown">{countdown}</span> segundos...
            </p>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="go-to-dashboard-button"
            >
              Acessar Dashboard Agora
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStore;