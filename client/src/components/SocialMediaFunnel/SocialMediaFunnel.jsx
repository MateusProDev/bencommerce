import React, { useState, useEffect } from "react";
import {
  FaUser, FaWhatsapp, FaEnvelope, FaCheck, FaChevronLeft,
  FaStar, FaBuilding, FaUsers, FaClipboardList,
  FaInstagram, FaTags, FaChartLine, FaCalendarAlt, FaDollarSign
} from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  PLAN_OPTIONS,
  getPlanDisplay,
  buildWhatsAppUrl,
  buildLeadWhatsAppMessage,
} from "../../utils/leadPlans";
import "./SocialMediaFunnel.css";

const SocialMediaFunnel = ({ isOpen, onClose, initialPlan = "" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const emptyForm = {
    name: "",
    whatsapp: "",
    email: "",
    company: "",
    plan: initialPlan,
    businessType: "",
    currentSocialMedia: "",
    mainGoal: "",
    budget: "",
    timeline: "",
    message: "",
    status: "novo",
    createdAt: null,
    type: "social_media",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(15);
  const [waUrl, setWaUrl] = useState("");

  const formConfig = {
    steps: [
      {
        title: "Informações Básicas",
        subtitle: "Vamos conhecer você e sua empresa",
        fields: [
          {
            name: "name", label: "Nome Completo", type: "text",
            icon: FaUser, required: true, placeholder: "Seu nome completo",
          },
          {
            name: "whatsapp", label: "WhatsApp", type: "tel",
            icon: FaWhatsapp, required: true, placeholder: "(00) 00000-0000",
          },
          {
            name: "email", label: "E-mail", type: "email",
            icon: FaEnvelope, required: true, placeholder: "seu@email.com",
          },
          {
            name: "company", label: "Nome da Empresa/Agência", type: "text",
            icon: FaBuilding, required: true, placeholder: "Nome da sua empresa ou agência",
          },
        ],
      },
      {
        title: "Seu Negócio",
        subtitle: "Conte-nos mais sobre sua empresa de turismo",
        fields: [
          {
            name: "businessType", label: "Tipo de Negócio", type: "select",
            icon: FaTags, required: true,
            options: [
              { value: "", label: "Selecione o tipo de negócio", disabled: true },
              { value: "agencia_turismo", label: "Agência de Turismo" },
              { value: "pousada_hotel", label: "Pousada/Hotel" },
              { value: "operadora", label: "Operadora de Turismo" },
              { value: "guia_turistico", label: "Guia Turístico" },
              { value: "restaurante", label: "Restaurante/Bar" },
              { value: "transporte_turistico", label: "Transporte Turístico" },
              { value: "atividade_aventura", label: "Atividades de Aventura" },
              { value: "outro", label: "Outro" },
            ],
          },
          {
            name: "currentSocialMedia", label: "Presença Atual nas Redes", type: "select",
            icon: FaInstagram, required: true,
            options: [
              { value: "", label: "Como está sua presença digital?", disabled: true },
              { value: "nenhuma", label: "Não tenho redes sociais" },
              { value: "basica", label: "Perfis básicos criados" },
              { value: "ativa_sem_resultado", label: "Posto conteúdo mas sem resultados" },
              { value: "terceirizada", label: "Já terceirizo mas quero mudar" },
              { value: "interna_limitada", label: "Gerencio internamente com limitações" },
            ],
          },
        ],
      },
      {
        title: "Seus Objetivos",
        subtitle: "Qual é o seu principal objetivo com tráfego pago?",
        fields: [
          {
            name: "plan", label: "Plano de Interesse", type: "select",
            icon: FaStar, required: true, options: PLAN_OPTIONS,
          },
          {
            name: "mainGoal", label: "Principal Objetivo", type: "select",
            icon: FaChartLine, required: true,
            options: [
              { value: "", label: "O que você mais quer alcançar?", disabled: true },
              { value: "aumentar_vendas", label: "Aumentar vendas e reservas" },
              { value: "construir_marca", label: "Construir autoridade da marca" },
              { value: "gerar_leads", label: "Gerar mais leads qualificados" },
              { value: "engajamento", label: "Melhorar engajamento com clientes" },
              { value: "reconhecimento", label: "Aumentar reconhecimento regional" },
              { value: "competir", label: "Competir melhor com concorrência" },
            ],
          },
          {
            name: "budget", label: "Orçamento para Anúncios (Além da Mensalidade)", type: "select",
            icon: FaDollarSign, required: false,
            options: [
              { value: "", label: "Quanto pretende investir em ads?", disabled: true },
              { value: "sem_budget", label: "Sem orçamento para anúncios no momento" },
              { value: "ate_500", label: "Até R$ 500/mês" },
              { value: "500_1000", label: "R$ 500 a R$ 1.000/mês" },
              { value: "1000_2000", label: "R$ 1.000 a R$ 2.000/mês" },
              { value: "acima_2000", label: "Acima de R$ 2.000/mês" },
            ],
          },
          {
            name: "timeline", label: "Quando Gostaria de Começar?", type: "select",
            icon: FaCalendarAlt, required: true,
            options: [
              { value: "", label: "Qual sua urgência?", disabled: true },
              { value: "imediato", label: "Imediatamente" },
              { value: "1_semana", label: "Até 1 semana" },
              { value: "2_semanas", label: "Até 2 semanas" },
              { value: "1_mes", label: "Até 1 mês" },
              { value: "apenas_informacao", label: "Apenas colhendo informações" },
            ],
          },
        ],
      },
      {
        title: "Informações Adicionais",
        subtitle: "Alguma informação extra que considera importante?",
        fields: [
          {
            name: "message", label: "Detalhes Adicionais (Opcional)", type: "textarea",
            required: false,
            placeholder:
              "Conte-nos sobre seus principais destinos, público-alvo, experiências anteriores com marketing digital, ou qualquer informação que considere relevante...",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({ ...prev, plan: initialPlan }));
    }
  }, [initialPlan]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({ ...emptyForm, plan: initialPlan });
      setErrors({});
      setIsSubmitted(false);
      setCountdown(15);
      setWaUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPlan]);

  useEffect(() => {
    if (!isSubmitted) return;
    if (countdown <= 0) {
      onClose();
      return;
    }
    const t = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [isSubmitted, countdown, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    const currentStepFields = formConfig.steps[step - 1].fields;

    currentStepFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = "Este campo é obrigatório";
      }

      if (field.name === "email" && formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Por favor, insira um email válido";
        }
      }

      if (field.name === "whatsapp" && formData.whatsapp) {
        const whatsappRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
        if (!whatsappRegex.test(formData.whatsapp)) {
          newErrors.whatsapp = "Por favor, insira um WhatsApp válido";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "novo",
        source: "social_media_form",
        channel: "whatsapp",
        type: "social_media",
      };

      // 1) Registro no painel.
      await addDoc(collection(db, "social_media_leads"), dataToSubmit);

      // 2) Conversa imediata no WhatsApp.
      setWaUrl(buildWhatsAppUrl(buildLeadWhatsAppMessage(formData)));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      setIsSubmitting(false);
      setErrors({ submit: `Erro ao enviar formulário: ${error.message}. Tente novamente.` });
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setCurrentStep(1);
    setFormData(emptyForm);
    setErrors({});
    setIsSubmitted(false);
    setCountdown(15);
    setWaUrl("");
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="funnel-progress">
      <div className="funnel-steps">
        {formConfig.steps.map((_, index) => (
          <div
            key={index}
            className={`funnel-step ${currentStep === index + 1 ? "active" : ""} ${
              currentStep > index + 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">
              {currentStep > index + 1 ? <FaCheck /> : index + 1}
            </div>
            <span className="step-label">{formConfig.steps[index].title}</span>
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

  const renderField = (field) => {
    const IconComponent = field.icon;

    switch (field.type) {
      case "select":
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
                className={`form-select ${errors[field.name] ? "error" : ""}`}
              >
                {field.options.map((option, idx) => (
                  <option key={idx} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IconComponent className="select-icon" />
            </div>
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="form-group">
            <label className="form-label">{field.label}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              className={`form-textarea ${errors[field.name] ? "error" : ""}`}
              rows="4"
            />
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
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
                className={`form-input ${errors[field.name] ? "error" : ""}`}
              />
              <IconComponent className="input-icon" />
            </div>
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        );
    }
  };

  const renderSuccess = () => (
    <div className="funnel-success">
      <div className="success-animation">
        <div className="success-checkmark">
          <FaCheck />
        </div>
      </div>
      <h2>Recebemos seus dados, {formData.name}!</h2>
      <p className="success-message">
        Falta um passo para a conversa começar: toque no botão verde para abrir o
        WhatsApp com sua solicitação já preenchida.{" "}
        <strong>Se a janela não abrir sozinha, o botão resolve.</strong>
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="funnel-whatsapp-btn"
        onClick={() => setTimeout(handleClose, 400)}
      >
        <FaWhatsapp /> Abrir minha conversa no WhatsApp
      </a>

      <div className="success-details">
        <p><strong>Resumo enviado:</strong></p>
        <p>📱 Serviço: <strong>Gestão de Tráfego Pago</strong></p>
        <p>📋 Plano: <strong>{getPlanDisplay(formData.plan)}</strong></p>
        {formData.company && (
          <p>🏢 Empresa: <strong>{formData.company}</strong></p>
        )}
        <p className="success-note">
          Esta janela fecha em <strong>{countdown}</strong>s e seus dados continuam salvos.
        </p>
      </div>

      <button type="button" className="success-close-btn" onClick={handleClose}>
        Fechar
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    if (isSubmitted) return renderSuccess();

    const currentStepConfig = formConfig.steps[currentStep - 1];

    return (
      <div className="funnel-step-content">
        <h2>{currentStepConfig.title}</h2>
        <p className="funnel-subtitle">{currentStepConfig.subtitle}</p>

        <div className="form-fields">
          {currentStepConfig.fields.map((field, index) => (
            <div key={index}>{renderField(field)}</div>
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
              Continuar <FaChevronLeft style={{ transform: "rotate(180deg)" }} />
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
                  <FaWhatsapp /> Enviar e abrir o WhatsApp
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

        <form className="funnel-form">{renderCurrentStep()}</form>
      </div>
    </div>
  );
};

export default SocialMediaFunnel;
