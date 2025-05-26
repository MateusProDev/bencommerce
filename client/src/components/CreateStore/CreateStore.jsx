import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; // Ajuste o caminho conforme necessário
import { setDoc, doc, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import JSConfetti from 'js-confetti';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiShoppingBag, FiTag, FiImage, FiDollarSign } from 'react-icons/fi';
import './CreateStore.css'; // Certifique-se que o CSS está correto

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
  const [plano, setPlano] = useState('free'); // Default to free
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
    setJsConfetti(new JSConfetti());
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

    // Use environment variables for Cloudinary credentials
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const cloudName = process.env.REACT_APP_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      setErrorMsg('Configuração de upload de imagem ausente.');
      console.error('Cloudinary upload preset or cloud name is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    setLoading(true);
    setUploadProgress(0);
    setErrorMsg(''); // Clear previous errors

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
        // Add progress event listener if needed (more complex)
      });

      if (response.ok) {
        const data = await response.json();
        setLogoUrl(data.secure_url);
        setUploadProgress(100);
      } else {
        const errorData = await response.json();
        console.error('Cloudinary upload error:', errorData);
        throw new Error(`Erro no upload: ${errorData.error?.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Erro no upload da imagem:', err);
      setErrorMsg(`Erro ao enviar imagem: ${err.message}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    setErrorMsg(''); // Clear previous errors before validation
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
        // Logo is optional now, based on previous discussions, remove required check
        // if (!logoUrl) {
        //   setErrorMsg('Por favor, faça upload de uma imagem para sua loja');
        //   return false;
        // }
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
    // Validate the final step before submitting
    if (!validateStep()) return; 
    
    setLoading(true);
    setErrorMsg(''); // Clear previous errors

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const agora = new Date();
      const inicioTimestamp = serverTimestamp(); // Use server timestamp for consistency

      // --- Corrected Trial End Date Calculation --- 
      let fimTesteDate = null;
      if (plano !== 'free') {
        fimTesteDate = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
        // Optional: Set time to end of day for clarity
        // fimTesteDate.setHours(23, 59, 59, 999);
      }
      const fimTesteISO = fimTesteDate ? fimTesteDate.toISOString() : null;

      // Create a URL-friendly slug
      const slug = nomeLoja.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '') // Keep hyphens
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-') // Replace multiple hyphens
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

      // --- Loja Data --- 
      const lojaData = {
        nome: nomeLoja,
        segmento,
        logoUrl: logoUrl || null, // Store null if no logo
        plano, // Store the selected plan ('free', 'plus', 'premium')
        donoUid: user.uid,
        status: 'ativa',
        slug,
        criadaEm: inicioTimestamp,
        atualizadaEm: inicioTimestamp,
        categorias: [],
        configs: {
          corPrimaria: '#4a6bff',
          corSecundaria: '#2541b2',
          tema: 'claro'
        },
        // Add other necessary loja fields here
      };

      // --- User Data (Corrected Logic) --- 
      let usuarioDataUpdate = {};
      if (plano === 'free') {
        usuarioDataUpdate = {
          plano: 'free',
          planoAtual: 'free',
          planoAtivo: true, // Free plan is considered active
          emTeste: false,
          testeGratuito: false,
          inicioTeste: null,
          fimTeste: null,
          expiracaoPlano: null,
          dataInicioPlano: inicioTimestamp,
          hasUsedTrial: false, // Reset trial usage if moving to Free explicitly here?
                              // Or maybe keep hasUsedTrial if they previously had one?
                              // Let's assume creating a FREE store doesn't grant a new trial.
                              // We should ideally read the existing hasUsedTrial state first, 
                              // but for simplicity in creation, let's set it based on *this* action.
          pagamentoConfirmado: false,
          descontoAplicado: false,
          storeCreated: true,
          ultimoLogin: inicioTimestamp,
          updatedAt: inicioTimestamp, // Use server timestamp
        };
      } else { // Plus or Premium
        usuarioDataUpdate = {
          plano: plano, // 'plus' or 'premium'
          planoAtual: plano,
          planoAtivo: false, // Paid plan is not active until paid (after trial)
          emTeste: true,
          testeGratuito: true,
          inicioTeste: inicioTimestamp,
          fimTeste: fimTesteISO,
          expiracaoPlano: fimTesteISO, // Align expiration with trial end
          dataInicioPlano: null, // Plan starts after trial/payment
          hasUsedTrial: true, // Mark trial as used upon starting it
          pagamentoConfirmado: false,
          descontoAplicado: false,
          storeCreated: true,
          ultimoLogin: inicioTimestamp,
          updatedAt: inicioTimestamp, // Use server timestamp
        };
      }

      // Use a batch write for atomicity
      const batch = writeBatch(db);
      const lojaRef = doc(db, 'lojas', user.uid);
      const userRef = doc(db, 'usuarios', user.uid);

      batch.set(lojaRef, lojaData); // Create/overwrite loja data
      // IMPORTANT: Use merge: true for user data to update existing fields 
      // and add new ones without overwriting unrelated data (like email, name etc.)
      batch.set(userRef, usuarioDataUpdate, { merge: true }); 
      
      await batch.commit();

      // Create placeholder product (optional, keep if needed)
      try {
        const produtoRef = doc(collection(db, "lojas", user.uid, "produtos"));
        await setDoc(produtoRef, {
          name: "Produto de exemplo",
          price: "0.00",
          stock: "0",
          images: [],
          category: "",
          description: "",
          variants: [],
          createdAt: inicioTimestamp,
          isPlaceholder: true
        });
      } catch (prodError) {
        console.warn("Aviso: Não foi possível criar o produto de exemplo.", prodError);
        // Don't fail the whole process for this
      }

      // Confetti effect
      if (jsConfetti) {
        jsConfetti.addConfetti({
          emojis: ['🛍️', '💰', '🛒', '💳', '✨', '🎉'],
          emojiSize: 50,
          confettiNumber: 100,
        });
      }

      setShowSuccess(true);
      if (onStoreCreated) onStoreCreated(); // Callback if provided

    } catch (err) {
      console.error('Erro ao criar loja:', err);
      setErrorMsg(`Erro ao criar loja: ${err.message}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic (Keep as is, focus was on handleCreateStore) ---
  const renderStepContent = () => {
    // ... (render logic for each step remains the same as provided previously)
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
              <label className="form-label-custom">Logo (Opcional)</label>
              <div className="file-upload-wrapper">
                <label className="file-upload-label">
                  <FiUpload className="me-2" />
                  {uploadProgress > 0 && loading ? 'Enviando...' : logoUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    className="file-upload-input" 
                    accept="image/*"
                    disabled={loading} // Disable during upload
                  />
                </label>
              </div>
              {loading && uploadProgress > 0 && uploadProgress < 100 && (
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
                {/* Free Plan Option */}
                <div 
                  className={`plan-option ${plano === 'free' ? 'selected' : ''}`}
                  onClick={() => setPlano('free')}
                >
                  <h5>Free</h5>
                  <div className="price">R$0/mês</div>
                  <ul className="plan-features">
                    <li>Até 30 produtos</li>
                    <li>1 imagem por produto</li>
                    {/* Add other free features */}
                  </ul>
                  <div className="plan-badge">Básico</div>
                </div>
                {/* Plus Plan Option */}
                <div 
                  className={`plan-option ${plano === 'plus' ? 'selected' : ''}`}
                  onClick={() => setPlano('plus')}
                >
                  <h5>Plus</h5>
                  <div className="price">R$39,90/mês</div>
                  <ul className="plan-features">
                    <li>Até 300 produtos</li>
                    <li>3 imagens por produto</li>
                    <li>7 dias grátis</li> 
                    {/* Add other plus features */}
                  </ul>
                  <div className="plan-badge popular">Popular</div>
                </div>
                {/* Premium Plan Option */}
                <div 
                  className={`plan-option ${plano === 'premium' ? 'selected' : ''}`}
                  onClick={() => setPlano('premium')}
                >
                  <h5>Premium</h5>
                  <div className="price">R$99,90/mês</div>
                  <ul className="plan-features">
                    <li>Produtos ilimitados</li>
                    <li>5 imagens por produto</li>
                    <li>7 dias grátis</li>
                    {/* Add other premium features */}
                  </ul>
                  <div className="plan-badge">Premium</div>
                </div>
              </div>
              <small className="form-text-custom mt-3">
                Você pode alterar seu plano a qualquer momento no painel.
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
                         {plano !== 'free' && ' (+ 7 dias grátis)'} 
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
                        <div className="text-muted">Nenhum logo</div>
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
        {/* Progress Steps */} 
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
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */} 
        <div className="step-content-wrapper">
          {errorMsg && <div className="alert alert-danger error-message">{errorMsg}</div>}
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */} 
        <div className="navigation-buttons">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0 || loading}
            className="btn btn-secondary btn-prev"
          >
            <FiArrowLeft className="me-1" /> Voltar
          </button>
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={nextStep} 
              disabled={loading}
              className="btn btn-primary btn-next"
            >
              Avançar <FiArrowRight className="ms-1" />
            </button>
          ) : (
            <button 
              onClick={handleCreateStore} 
              disabled={loading}
              className="btn btn-success btn-create"
            >
              {loading ? 'Criando Loja...' : 'Criar Minha Loja!'}
              {loading && <span className="spinner-border spinner-border-sm ms-2"></span>}
            </button>
          )}
        </div>
      </div>

      {/* Success Overlay */} 
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <FiCheck size={80} className="success-icon" />
            <h2>Loja Criada com Sucesso!</h2>
            <p>Você será redirecionado para o painel em {countdown} segundos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStore;