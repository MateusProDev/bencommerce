import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaWhatsapp,
  FaEnvelope,
  FaCheck,
  FaChevronLeft,
  FaBuilding,
  FaStar,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  PLAN_OPTIONS,
  getPlanDisplay,
  buildWhatsAppUrl,
  buildLeadWhatsAppMessage,
} from "../../utils/leadPlans";
import "./ContactFunnel.css";

const ContactFunnel = ({ isOpen, onClose, initialPlan = "" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const emptyForm = {
    name: "",
    whatsapp: "",
    email: "",
    company: "",
    plan: initialPlan,
    employees: "",
    currentSystem: "",
    message: "",
    status: "novo",
    createdAt: null,
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
        subtitle: "Preencha seus dados para que possamos entrar em contato",
        fields: [
          {
            name: "name",
            label: "Nome Completo",
            type: "text",
            icon: FaUser,
            required: true,
            placeholder: "Seu nome completo",
          },
          {
            name: "whatsapp",
            label: "WhatsApp",
            type: "tel",
            icon: FaWhatsapp,
            required: true,
            placeholder: "(00) 00000-0000",
          },
          {
            name: "email",
            label: "E-mail",
            type: "email",
            icon: FaEnvelope,
            required: true,
            placeholder: "seu@email.com",
          },
          {
            name: "company",
            label: "Nome da Agência",
            type: "text",
            icon: FaBuilding,
            required: false,
            placeholder: "Nome da sua agência de turismo",
          },
        ],
      },
      {
        title: "Seu Plano de Interesse",
        subtitle: "Selecione o plano que melhor atende suas necessidades",
        fields: [
          {
            name: "plan",
            label: "Plano Desejado",
            type: "select",
            icon: FaStar,
            required: true,
            options: PLAN_OPTIONS,
          },
          {
            name: "employees",
            label: "Número de Funcionários",
            type: "select",
            icon: FaUsers,
            required: false,
            options: [
              { value: "", label: "Selecione uma opção", disabled: true },
              { value: "1-5", label: "1-5 funcionários" },
              { value: "6-10", label: "6-10 funcionários" },
              { value: "11-20", label: "11-20 funcionários" },
              { value: "20+", label: "Mais de 20 funcionários" },
            ],
          },
          {
            name: "currentSystem",
            label: "Sistema Atual",
            type: "select",
            icon: FaClipboardList,
            required: false,
            options: [
              { value: "", label: "Selecione uma opção", disabled: true },
              { value: "nenhum", label: "Nenhum sistema" },
              { value: "planilhas", label: "Planilhas (Excel)" },
              { value: "outro", label: "Outro sistema" },
            ],
          },
        ],
      },
      {
        title: "Mensagem Adicional",
        subtitle: "Conte-nos mais sobre suas necessidades",
        fields: [
          {
            name: "message",
            label: "Alguma informação adicional?",
            type: "textarea",
            required: false,
            placeholder:
              "Descreva suas necessidades, expectativas ou qualquer informação que considere relevante...",
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

  /* Fecha a janela após o envio — o tempo é do usuário, não do app. */
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
        source: "contact_funnel",
        channel: "whatsapp",
      };

      // 1) Registro no painel — o lead nunca se perde, mesmo se o WhatsApp falhar.
      await addDoc(collection(db, "leads"), dataToSubmit);

      // 2) Conversa imediata no WhatsApp com tudo o que foi preenchido.
      setWaUrl(buildWhatsAppUrl(buildLeadWhatsAppMessage(formData)));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao salvar no Firebase:", error);
      setIsSubmitting(false);
      setErrors({ submit: "Erro ao enviar formulário. Tente novamente." });
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
          style={{
            width: `${((currentStep - 1) / (formConfig.steps.length - 1)) * 100}%`,
          }}
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
        Falta um passo para a conversa começar: clique no botão verde abaixo para
        abrir o WhatsApp com sua solicitação já preenchida. <strong>Se a janela
        não abrir sozinha, o botão resolve.</strong>
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="funnel-whatsapp-btn"
        onClick={() => {
          setTimeout(handleClose, 400);
        }}
      >
        <FaWhatsapp /> Abrir minha conversa no WhatsApp
      </a>

      <div className="success-details">
        <p>
          <strong>Resumo enviado:</strong>
        </p>
        <p>
          📋 Plano: <strong>{getPlanDisplay(formData.plan)}</strong>
        </p>
        {formData.company && (
          <p>
            🏢 Agência: <strong>{formData.company}</strong>
          </p>
        )}
        <p className="success-note">
          Esta janela fecha em <strong>{countdown}</strong>s e seus dados continuam
          salvos.
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
      <div className="funnel-container">
        <button className="funnel-close-btn" onClick={handleClose}>
          &times;
        </button>

        {!isSubmitted && renderStepIndicator()}

        <form className="funnel-form">{renderCurrentStep()}</form>
      </div>
    </div>
  );
};

export default ContactFunnel;
