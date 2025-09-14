# 📊 Google Analytics - Configuração para Turvia

## 🚀 Como Configurar (Passo a Passo)

### 1. Obter seu ID do Google Analytics

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Faça login com sua conta Google
3. Clique em "Começar a usar"
4. Configure uma nova propriedade:
   - **Nome da conta**: Turvia
   - **Nome da propriedade**: Site Turvia
   - **URL do site**: seu-dominio.com
5. Após criar, copie seu **ID de acompanhamento** (formato: `G-XXXXXXXXXX`)

### 2. Configurar no Código

#### Arquivo 1: `src/config/analytics.js`
```javascript
export const GA_CONFIG = {
  TRACKING_ID: 'G-1HMMH0L3QH', // ← Cole seu ID aqui
  DEBUG: false
};
```

#### Arquivo 2: `public/index.html`
Procure por esta linha e substitua:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1HMMH0L3QH"></script>
```

E também esta:
```javascript
gtag('config', 'G-1HMMH0L3QH');
```

### 3. Verificar se está Funcionando

1. **Desenvolvimento**: Abra o site localmente
2. **Ferramentas do Desenvolvedor** (F12) → Aba **Console**
3. Procure por mensagens do Google Analytics
4. Ou instale a extensão "Google Analytics Debugger" no Chrome

## 📈 Eventos Rastreados Automaticamente

### 🎯 **Lead Generation**
- ✅ Formulário de contato enviado
- ✅ Clique no WhatsApp  
- ✅ Clique em telefone
- ✅ Clique em email

### 🧭 **Navegação**
- ✅ Cliques no menu
- ✅ Cliques em CTAs (Calls to Action)
- ✅ Scroll para seções

### 💼 **Engagement**
- ✅ Play em vídeos
- ✅ Downloads de PDFs
- ✅ Visualização de testemunhos

### 🔐 **Dashboard/Admin**
- ✅ Tentativas de login
- ✅ Visualizações do dashboard
- ✅ Downloads de relatórios

## 🔧 Personalizações Disponíveis

### Adicionar Novo Evento
```javascript
// Em qualquer componente
import { trackEvents } from '../utils/analytics';

// Exemplo de uso
const handleButtonClick = () => {
  trackEvents.ctaClick('Nome do Botão', 'localização');
};
```

### Rastreamento de Conversões
```javascript
// Para rastrear conversões importantes
trackEvents.contactFormSubmit('fonte_do_lead');
```

## 📊 Relatórios no Google Analytics

Após configurado, você verá:

1. **Visitas em tempo real**
2. **Páginas mais visitadas**
3. **Origem do tráfego**
4. **Conversões/Leads**
5. **Eventos personalizados**

## 🛡️ Conformidade LGPD

O código já inclui configurações básicas de consentimento:
- ✅ Analytics permitido
- ❌ Publicidade negada por padrão
- ✅ Funcionalidade permitida

## ⚠️ Importante

- Substitua `G-XXXXXXXXXX` pelo seu ID real
- Teste sempre em ambiente de desenvolvimento primeiro
- Monitore os relatórios nas primeiras 48h após deploy

---

**🎉 Pronto! Seu Google Analytics `G-1HMMH0L3QH` está configurado e rastreando todos os eventos importantes do seu site Turvia!**
