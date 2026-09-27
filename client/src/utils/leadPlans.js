// utils/leadPlans.js
// Fonte única de verdade dos planos da Turvia.
// Preço, rótulo e id vivem aqui — mudar aqui muda funil, painel e WhatsApp.

export const WHATSAPP_NUMBER = "5585991470709";

/* Rótulo canônico por id de plano (usado em painel, tabelas e resumos). */
export const PLAN_LABELS = {
  basico: "Básico",
  normal: "Normal",
  personalizado: "Personalizado",
  // Legado: leads antigos gravados com os ids anteriores continuam legíveis.
  premium: "Normal",
  completo: "Normal",
  business: "Personalizado",
  enterprise: "Personalizado",
};

/* Opções para o <select> do funil. */
export const PLAN_OPTIONS = [
  { value: "", label: "Selecione um plano", disabled: true },
  { value: "basico", label: "Básico — R$ 500/mês" },
  { value: "normal", label: "Normal — R$ 800/mês" },
  {
    value: "personalizado",
    label: "Personalizado — valor sob consulta",
  },
];

/* Texto curto do plano, para resumo e mensagem de WhatsApp. */
export function getPlanDisplay(plan) {
  switch (plan) {
    case "basico":
      return "Básico — R$ 500/mês";
    case "normal":
    case "premium":
    case "completo":
      return "Normal — R$ 800/mês";
    case "personalizado":
    case "business":
    case "enterprise":
      return "Personalizado — valor sob consulta";
    default:
      return "Não informado";
  }
}

/* Nome curto (cabeçalhos, badges). */
export function getPlanName(plan) {
  return PLAN_LABELS[plan] || "Não informado";
}

/* Normaliza qualquer id legado para o id atual. */
export function normalizePlan(plan) {
  switch (plan) {
    case "basico":
      return "basico";
    case "normal":
    case "premium":
    case "completo":
      return "normal";
    case "personalizado":
    case "business":
    case "enterprise":
      return "personalizado";
    default:
      return "";
  }
}

/* Link wa.me com mensagem pré-preenchida. */
export function buildWhatsAppUrl(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/* Monta a mensagem que chega no WhatsApp da Turvia com o lead completo. */
export function buildLeadWhatsAppMessage(formData = {}) {
  const lines = [
    "Olá! Vim pelo site da Turvia e quero falar sobre gestão de tráfego pago.",
    "",
    `*Nome:* ${formData.name || "-"}`,
    `*WhatsApp:* ${formData.whatsapp || "-"}`,
    `*E-mail:* ${formData.email || "-"}`,
  ];

  if (formData.company) lines.push(`*Agência/Empresa:* ${formData.company}`);
  lines.push(`*Plano de interesse:* ${getPlanDisplay(formData.plan)}`);

  if (formData.employees) lines.push(`*Funcionários:* ${formData.employees}`);
  if (formData.currentSystem) lines.push(`*Sistema atual:* ${formData.currentSystem}`);
  if (formData.businessType) lines.push(`*Tipo de negócio:* ${formData.businessType}`);
  if (formData.mainGoal) lines.push(`*Objetivo:* ${String(formData.mainGoal).replace(/_/g, " ")}`);
  if (formData.budget) lines.push(`*Investimento em ads:* ${formData.budget}`);
  if (formData.timeline) lines.push(`*Quando começar:* ${formData.timeline}`);

  if (formData.message) {
    lines.push("", `*Mensagem:* ${formData.message}`);
  }

  return lines.join("\n");
}
