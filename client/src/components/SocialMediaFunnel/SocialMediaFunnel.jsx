import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaWhatsapp, FaEnvelope, FaCheck, FaChevronLeft, 
  FaPaperPlane, FaStar, FaBuilding, FaUsers, FaClipboardList,
  FaInstagram, FaFacebookF, FaTags, FaChartLine, FaBolt,
  FaGlobe, FaCalendarAlt, FaDollarSign
} from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './SocialMediaFunnel.css';

const SocialMediaFunnel = ({ isOpen, onClose, initialPlan = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    company: '',
    plan: initialPlan,
    businessType: '',
    currentSocialMedia: '',
    mainGoal: '',
    budget: '',
    timeline: '',
    message: '',
    status: 'novo',
    createdAt: null,
    type: 'social_media' // Identificar como lead de redes sociais
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(10);

  // Configuração dos campos do formulário específico para redes sociais
  const formConfig = {
    steps: [
      {
        title: "Informações Básicas",
        subtitle: "Vamos conhecer você e sua empresa",
        fields: [
          { 
            name: "name", 
            label: "Nome Completo", 
            type: "text", 
            icon: FaUser, 
            required: true,
            placeholder: "Seu nome completo" 
          },
          { 
            name: "whatsapp", 
            label: "WhatsApp", 
            type: "tel", 
            icon: FaWhatsapp, 
            required: true,
            placeholder: "(00) 00000-0000" 
          },
          { 
            name: "email", 
            label: "E-mail", 
            type: "email", 
            icon: FaEnvelope, 
            required: true,
            placeholder: "seu@email.com" 
          },
          { 
            name: "company", 
            label: "Nome da Empresa/Agência", 
            type: "text", 
            icon: FaBuilding, 
            required: true,
            placeholder: "Nome da sua empresa ou agência" 
          }
        ]
      },
      {
        title: "Seu Negócio",
        subtitle: "Conte-nos mais sobre sua empresa de turismo",
        fields: [
          { 
            name: "businessType", 
            label: "Tipo de Negócio", 
            type: "select", 
            icon: FaTags,
            required: true,
            options: [
              { value: "", label: "Selecione o tipo de negócio", disabled: true },
              { value: "agencia_turismo", label: "Agência de Turismo" },
              { value: "pousada_hotel", label: "Pousada/Hotel" },
              { value: "operadora", label: "Operadora de Turismo" },
              { value: "guia_turistico", label: "Guia Turístico" },
              { value: "restaurante", label: "Restaurante/Bar" },
              { value: "transporte_turistico", label: "Transporte Turístico" },
              { value: "atividade_aventura", label: "Atividades de Aventura" },
              { value: "outro", label: "Outro" }
            ] 
          },
          { 
            name: "currentSocialMedia", 
            label: "Presença Atual nas Redes", 
            type: "select", 
            icon: FaInstagram,
            required: true,
            options: [
              { value: "", label: "Como está sua presença digital?", disabled: true },
              { value: "nenhuma", label: "Não tenho redes sociais" },
              { value: "basica", label: "Perfis básicos criados" },
              { value: "ativa_sem_resultado", label: "Posto conteúdo mas sem resultados" },
              { value: "terceirizada", label: "Já terceirizo mas quero mudar" },
              { value: "interna_limitada", label: "Gerencio internamente com limitações" }
            ] 
          }
        ]
      },
      {
        title: "Seus Objetivos",
        subtitle: "Qual é o seu principal objetivo com as redes sociais?",
        fields: [
          { 
            name: "plan", 
            label: "Plano de Interesse", 
            type: "select", 
            icon: FaStar,
            required: true,
            options: [
              { value: "", label: "Selecione um plano", disabled: true },
              { value: "basico", label: "Plano Básico - R$ 99,99/mês" },
              { value: "premium", label: "Plano Premium - R$ 197,99/mês" }
            ] 
          },
          { 
            name: "mainGoal", 
            label: "Principal Objetivo", 
            type: "select", 
            icon: FaChartLine,
            required: true,
            options: [
              { value: "", label: "O que você mais quer alcançar?", disabled: true },
              { value: "aumentar_vendas", label: "Aumentar vendas e reservas" },
              { value: "construir_marca", label: "Construir autoridade da marca" },
              { value: "gerar_leads", label: "Gerar mais leads qualificados" },
              { value: "engajamento", label: "Melhorar engajamento com clientes" },
              { value: "reconhecimento", label: "Aumentar reconhecimento regional" },
              { value: "competir", label: "Competir melhor com concorrência" }
            ] 
          },
          { 
            name: "budget", 
            label: "Orçamento para Anúncios (Além da Mensalidade)", 
            type: "select", 
            icon: FaDollarSign,
            required: false,
            options: [
              { value: "", label: "Quanto pretende investir em ads?", disabled: true },
              { value: "sem_budget", label: "Sem orçamento para anúncios no momento" },
              { value: "ate_500", label: "Até R$ 500/mês" },
              { value: "500_1000", label: "R$ 500 a R$ 1.000/mês" },
              { value: "1000_2000", label: "R$ 1.000 a R$ 2.000/mês" },
              { value: "acima_2000", label: "Acima de R$ 2.000/mês" }
            ] 
          },
          { 
            name: "timeline", 
            label: "Quando Gostaria de Começar?", 
            type: "select", 
            icon: FaCalendarAlt,
            required: true,
            options: [
              { value: "", label: "Qual sua urgência?", disabled: true },
              { value: "imediato", label: "Imediatamente" },
              { value: "1_semana", label: "Até 1 semana" },
              { value: "2_semanas", label: "Até 2 semanas" },
              { value: "1_mes", label: "Até 1 mês" },
              { value: "apenas_informacao", label: "Apenas colhendo informações" }
            ] 
          }
        ]
      },
      {
        title: "Informações Adicionais",
        subtitle: "Alguma informação extra que considera importante?",
        fields: [
          { 
            name: "message", 
            label: "Detalhes Adicionais (Opcional)", 
            type: "textarea", 
            required: false,
            placeholder: "Conte-nos sobre seus principais destinos, público-alvo, experiências anteriores com marketing digital, ou qualquer informação que considere relevante..." 
          }
        ]
      }
    ]
  };

  // Adicionar useEffect para atualizar quando initialPlan mudar
  useEffect(() => {
    if (initialPlan) {
      setFormData(prev => ({ ...prev, plan: initialPlan }));
    }
  }, [initialPlan]);

  useEffect(() => {
    if (isOpen) {
      // Resetar o formulário quando abrir
      setCurrentStep(1);
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        company: '',
        plan: initialPlan,
        businessType: '',
        currentSocialMedia: '',
        mainGoal: '',
        budget: '',
        timeline: '',
        message: '',
        status: 'novo',
        createdAt: null,
        type: 'social_media'
      });
      setErrors({});
      setIsSubmitted(false);
      setCountdown(10);
    }
  }, [isOpen, initialPlan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Remover erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const currentStepFields = formConfig.steps[step - 1].fields;
    
    currentStepFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `Este campo é obrigatório`;
      }
      
      // Validação específica para email
      if (field.name === 'email' && formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Por favor, insira um email válido';
        }
      }
      
      // Validação específica para WhatsApp
      if (field.name === 'whatsapp' && formData.whatsapp) {
        const whatsappRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
        if (!whatsappRegex.test(formData.whatsapp)) {
          newErrors.whatsapp = 'Por favor, insira um WhatsApp válido';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      try {
        // Adicionar timestamp e tipo antes de enviar
        const dataToSubmit = {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          status: 'novo',
          type: 'social_media' // Identificador do tipo de lead
        };
        
        console.log('🚀 Enviando lead de redes sociais:', dataToSubmit);
        console.log('📊 Dados do formulário:', formData);
        
        // Salvar no Firestore na coleção 'social_media_leads'
        const docRef = await addDoc(collection(db, 'social_media_leads'), dataToSubmit);
        
        console.log('✅ Lead salvo com sucesso! ID:', docRef.id);
        console.log('📍 Collection usada: social_media_leads');
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setCountdown(10);
        
        // Contador regressivo
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              onClose();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erro ao salvar no Firebase:', error);
        console.error('📝 Detalhes do erro:', error.message);
        console.error('🔧 Stack trace:', error.stack);
        setIsSubmitting(false);
        setErrors({ submit: `Erro ao enviar formulário: ${error.message}. Tente novamente.` });
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCurrentStep(1);
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        company: '',
        plan: '',
        businessType: '',
        currentSocialMedia: '',
        mainGoal: '',
        budget: '',
        timeline: '',
        message: '',
        status: 'novo',
        createdAt: null,
        type: 'social_media'
      });
      setErrors({});
      setIsSubmitted(false);
      setCountdown(10);
      onClose();
    }
  };

  // Função para obter o nome formatado do plano
  const getPlanName = (planValue) => {
    switch (planValue) {
      case 'basico':
        return 'Plano Básico - R$ 99,99/mês';
      case 'premium':
        return 'Plano Premium - R$ 197,99/mês';
      default:
        return 'Não informado';
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="funnel-progress">
        <div className="funnel-steps">
          {formConfig.steps.map((_, index) => (
            <div 
              key={index} 
              className={`funnel-step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
            >
              <div className="step-number">
                {currentStep > index + 1 ? <FaCheck /> : index + 1}
              </div>
              <span className="step-label">
                {formConfig.steps[index].title}
              </span>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep - 1) / (formConfig.steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderField = (field) => {
    const IconComponent = field.icon;
    
    switch (field.type) {
      case 'select':
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <div className="select-with-icon">
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className={`form-select ${errors[field.name] ? 'error' : ''}`}
              >
                {field.options.map((option, index) => (
                  <option 
                    key={index} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <IconComponent className="select-icon" />
            </div>
            {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="form-group">
            <label className="form-label">{field.label}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              className={`form-textarea ${errors[field.name] ? 'error' : ''}`}
              rows="4"
            />
            {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );
      
      default:
        return (
          <div className="form-group">
            <label className="form-label">
              {field.label} {field.required && <span className="required">*</span>}
            </label>
            <div className="input-with-icon">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleInputChange}
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
              />
              <IconComponent className="input-icon" />
            </div>
            {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
          </div>
        );
    }
  };

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return (
        <div className="funnel-success">
          <div className="success-animation">
            <div className="success-checkmark">
              <FaCheck />
            </div>
          </div>
          <h2>Solicitação Enviada com Sucesso!</h2>
          <p className="success-message">
            Obrigado pelo interesse, <strong>{formData.name}</strong>! 
            Nossa equipe especializada em marketing digital para turismo entrará em contato em até 24 horas.
          </p>
          <div className="success-details">
            <p><strong>Resumo da sua solicitação:</strong></p>
            <p>📱 Serviço: <strong>Gerenciamento de Redes Sociais</strong></p>
            <p>📋 Plano: <strong>{getPlanName(formData.plan)}</strong></p>
            {formData.company && <p>🏢 Empresa: <strong>{formData.company}</strong></p>}
            {formData.mainGoal && <p>🎯 Objetivo: <strong>{formData.mainGoal.replace('_', ' ')}</strong></p>}
            <p className="success-note">Esta janela fechará automaticamente em <strong>{countdown}</strong> segundos ou clique em "Fechar".</p>
          </div>
          <button 
            type="button" 
            className="success-close-btn"
            onClick={handleClose}
          >
            Fechar
          </button>
        </div>
      );
    }

    const currentStepConfig = formConfig.steps[currentStep - 1];
    
    return (
      <div className="funnel-step-content">
        <h2>{currentStepConfig.title}</h2>
        <p className="funnel-subtitle">{currentStepConfig.subtitle}</p>
        
        <div className="form-fields">
          {currentStepConfig.fields.map((field, index) => (
            <div key={index}>
              {renderField(field)}
            </div>
          ))}
        </div>
        
        <div className="funnel-actions">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="funnel-back-btn"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <FaChevronLeft /> Voltar
            </button>
          )}
          
          {currentStep < formConfig.steps.length ? (
            <button 
              type="button" 
              className="funnel-next-btn"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Continuar <FaChevronLeft style={{ transform: 'rotate(180deg)' }} />
            </button>
          ) : (
            <button 
              type="button" 
              className="funnel-submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Solicitar Proposta
                </>
              )}
            </button>
          )}
        </div>
        
        {errors.submit && <div className="submit-error">{errors.submit}</div>}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="funnel-overlay">
      <div className="funnel-container social-media-funnel">
        <button className="funnel-close-btn" onClick={handleClose}>
          &times;
        </button>
        
        {!isSubmitted && renderStepIndicator()}
        
        <form className="funnel-form">
          {renderCurrentStep()}
        </form>
      </div>
    </div>
  );
};

export default SocialMediaFunnel;
