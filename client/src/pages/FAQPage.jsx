import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';

const FAQPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('geral');
  const [faqAberto, setFaqAberto] = useState(null);

  const categorias = [
    { id: 'geral', nome: 'Geral', icon: '❓' },
    { id: 'conta', nome: 'Conta', icon: '👤' },
    { id: 'reservas', nome: 'Reservas', icon: '�' },
    { id: 'motoristas', nome: 'Motoristas', icon: '�' },
    { id: 'relatorios', nome: 'Relatórios', icon: '📊' },
    { id: 'tecnico', nome: 'Técnico', icon: '🔧' }
  ];

  const faqs = [
    // Geral
    {
      categoria: 'geral',
      pergunta: 'O que é a Turvia?',
      resposta: 'A Turvia é uma plataforma completa para gestão de agências de turismo. Oferecemos todas as ferramentas necessárias para você gerenciar clientes, motoristas, reservas e relatórios de forma profissional e eficiente.'
    },
    {
      categoria: 'geral',
      pergunta: 'Quanto tempo leva para configurar minha agência?',
      resposta: 'Você pode ter sua agência de turismo funcionando em menos de 30 minutos! Nossa plataforma é intuitiva e oferece configurações prontas que facilitam todo o processo.'
    },
    {
      categoria: 'geral',
      pergunta: 'Preciso ter conhecimento técnico?',
      resposta: 'Não! Nossa plataforma foi desenvolvida para ser usada por qualquer pessoa do setor de turismo, independente do conhecimento técnico. Tudo é visual e intuitivo.'
    },
    {
      categoria: 'geral',
      pergunta: 'Existe limite de clientes ou motoristas?',
      resposta: 'Depende do seu plano. O plano Básico permite até 100 clientes, o Completo até 500 clientes e o Enterprise não tem limites.'
    },

    // Conta
    {
      categoria: 'conta',
      pergunta: 'Como criar uma conta?',
      resposta: 'Basta clicar em "Criar Conta" no topo da página, preencher seus dados da agência e confirmar seu email. É rápido e gratuito!'
    },
    {
      categoria: 'conta',
      pergunta: 'Posso alterar meu plano a qualquer momento?',
      resposta: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do painel administrativo. As mudanças são aplicadas imediatamente.'
    },
    {
      categoria: 'conta',
      pergunta: 'Como cancelar minha conta?',
      resposta: 'Você pode cancelar sua conta a qualquer momento através das configurações da conta. Seus dados ficarão salvos por 30 dias caso queira reativar.'
    },
    {
      categoria: 'conta',
      pergunta: 'Posso ter múltiplas agências?',
      resposta: 'Sim! Dependendo do seu plano, você pode gerenciar múltiplas agências. O plano Completo permite até 3 agências e o Enterprise agências ilimitadas.'
    },

    // Reservas
    {
      categoria: 'reservas',
      pergunta: 'Como criar uma nova reserva?',
      resposta: 'No painel administrativo, vá em "Reservas" > "Nova Reserva". Selecione o cliente, destino, datas e motorista. O sistema organizará tudo automaticamente!'
    },
    {
      categoria: 'reservas',
      pergunta: 'Posso importar reservas em massa?',
      resposta: 'Sim! Oferecemos importação via CSV e integração com planilhas do Excel. Você pode importar centenas de reservas de uma só vez.'
    },
    {
      categoria: 'reservas',
      pergunta: 'Como funciona o controle de disponibilidade?',
      resposta: 'O sistema atualiza automaticamente a disponibilidade de motoristas e veículos. Você pode configurar alertas e definir regras de agendamento.'
    },
    {
      categoria: 'reservas',
      pergunta: 'Posso criar pacotes turísticos?',
      resposta: 'Claro! Você pode criar pacotes com múltiplos destinos, durações diferentes e preços personalizados para cada tipo de cliente.'
    },

    // Motoristas
    {
      categoria: 'motoristas',
      pergunta: 'Como cadastrar motoristas?',
      resposta: 'Integramos com Stripe, PagSeguro, PayPal e PIX. Seus clientes podem pagar com cartão de crédito, débito, boleto e PIX.'
    },
    {
      categoria: 'pagamentos',
      pergunta: 'Quando recebo o dinheiro das vendas?',
      resposta: 'Depende do meio de pagamento. PIX é imediato, cartões levam de 1 a 30 dias conforme a operadora. Tudo é transparente no painel de vendas.'
    },
    {
      categoria: 'pagamentos',
      pergunta: 'Há taxas sobre as vendas?',
      resposta: 'Não cobramos taxa sobre vendas! Você paga apenas as taxas das operadoras de pagamento (Stripe, PagSeguro, etc.), que são padrão do mercado.'
    },
    {
      categoria: 'pagamentos',
      pergunta: 'Como configurar o PIX?',
      resposta: 'No painel, vá em Configurações > Pagamentos > PIX. Adicione sua chave PIX e pronto! Seus clientes já poderão pagar via PIX.'
    },

    // Configuração
    {
      categoria: 'configuracao',
      pergunta: 'Como usar meu próprio domínio?',
      resposta: 'Nos planos Completo e Enterprise, você pode configurar seu domínio personalizado. Basta apontar o DNS para nossos servidores seguindo nosso tutorial.'
    },
    {
      categoria: 'configuracao',
      pergunta: 'Posso personalizar o design?',
      resposta: 'Sim! Você pode alterar cores, fontes, logo, banner e muito mais. Temos um editor visual que torna tudo muito fácil.'
    },
    {
      categoria: 'configuracao',
      pergunta: 'Como configurar frete?',
      resposta: 'Integração automática com Correios e transportadoras. Você pode configurar frete grátis, frete fixo ou cálculo automático por CEP.'
    },
    {
      categoria: 'configuracao',
      pergunta: 'Posso integrar com redes sociais?',
      resposta: 'Claro! Integramos com Instagram, Facebook, WhatsApp e outras redes. Seus produtos podem aparecer automaticamente nas redes sociais.'
    },

    // Técnico
    {
      categoria: 'tecnico',
      pergunta: 'A plataforma é segura?',
      resposta: 'Sim! Usamos certificado SSL, criptografia de dados, backups automáticos e seguimos as melhores práticas de segurança do mercado.'
    },
    {
      categoria: 'tecnico',
      pergunta: 'Que tipo de suporte oferecem?',
      resposta: 'Oferecemos suporte via chat, email e WhatsApp. Planos superiores têm suporte prioritário e consultoria personalizada.'
    },
    {
      categoria: 'tecnico',
      pergunta: 'O sistema funciona no celular?',
      resposta: 'Sim! Todo o sistema é 100% responsivo e otimizado para celular. Você pode gerenciar sua agência de qualquer dispositivo.'
    },
    {
      categoria: 'tecnico',
      pergunta: 'Fazem backup dos dados?',
      resposta: 'Sim! Fazemos backups automáticos diários de todos os dados. Seus produtos, clientes e vendas estão sempre seguros.'
    }
  ];

  const faqsFiltrados = faqs.filter(faq => {
    const matchCategoria = faq.categoria === categoriaAtiva;
    const matchSearch = searchTerm === '' || 
      faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* Header */}
      <div className="faq-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Perguntas Frequentes</h1>
            <p>Encontre respostas rápidas para as dúvidas mais comuns sobre gestão de agências de turismo</p>
            
            <div className="search-box">
              <input
                type="text"
                placeholder="Pesquisar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="categorias-section">
        <div className="container">
          <div className="categorias-tabs">
            {categorias.map(categoria => (
              <button
                key={categoria.id}
                className={`categoria-tab ${categoriaAtiva === categoria.id ? 'ativa' : ''}`}
                onClick={() => setCategoriaAtiva(categoria.id)}
              >
                <span className="tab-icon">{categoria.icon}</span>
                <span>{categoria.nome}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="container">
          {faqsFiltrados.length > 0 ? (
            <div className="faq-list">
              {faqsFiltrados.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${faqAberto === index ? 'aberto' : ''}`}
                >
                  <button 
                    className="faq-pergunta"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.pergunta}</span>
                    <span className="faq-toggle">
                      {faqAberto === index ? '−' : '+'}
                    </span>
                  </button>
                  
                  <div className="faq-resposta">
                    <p>{faq.resposta}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Nenhuma pergunta encontrada</h3>
              <p>Tente usar outras palavras-chave ou navegue por diferentes categorias</p>
              <button 
                className="btn-clear-search"
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA para Contato */}
      <div className="faq-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Não encontrou sua resposta?</h2>
            <p>Nossa equipe de suporte está pronta para te ajudar com qualquer dúvida</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/contato')}
              >
                Falar com Suporte
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
