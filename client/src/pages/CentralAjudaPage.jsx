import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CentralAjudaPage.css';

const CentralAjudaPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categorias = [
    {
      icon: '🚀',
      title: 'Primeiros Passos',
      description: 'Aprenda o básico para começar sua jornada',
      artigos: [
        'Como criar sua primeira loja online',
        'Configurando seu domínio personalizado',
        'Adicionando produtos ao catálogo',
        'Configurando métodos de pagamento'
      ]
    },
    {
      icon: '🛍️',
      title: 'Gestão de Produtos',
      description: 'Tudo sobre produtos e estoque',
      artigos: [
        'Como adicionar produtos com variações',
        'Gerenciamento de estoque automático',
        'Configurando promoções e descontos',
        'Upload de imagens otimizadas'
      ]
    },
    {
      icon: '💳',
      title: 'Pagamentos e Vendas',
      description: 'Configure pagamentos e acompanhe vendas',
      artigos: [
        'Configurando Stripe e PagSeguro',
        'Relatórios de vendas detalhados',
        'Recuperação de carrinho abandonado',
        'Configurando taxas de entrega'
      ]
    },
    {
      icon: '🎨',
      title: 'Personalização',
      description: 'Customize sua loja do seu jeito',
      artigos: [
        'Personalizando cores e tema',
        'Adicionando logo e favicon',
        'Configurando banners promocionais',
        'Customizando footer e contatos'
      ]
    },
    {
      icon: '📊',
      title: 'Análises e Relatórios',
      description: 'Acompanhe o desempenho da sua loja',
      artigos: [
        'Dashboard de vendas em tempo real',
        'Relatórios de produtos mais vendidos',
        'Análise de clientes e comportamento',
        'Métricas de conversão e ROI'
      ]
    },
    {
      icon: '🔧',
      title: 'Configurações Avançadas',
      description: 'Recursos avançados para otimizar sua loja',
      artigos: [
        'Configurando SEO e meta tags',
        'Integrações com redes sociais',
        'Backup automático de dados',
        'APIs e webhooks'
      ]
    }
  ];

  const artigosPoupulares = [
    'Como criar minha primeira loja online?',
    'Configurar métodos de pagamento',
    'Adicionar produtos com variações',
    'Personalizar cores e tema da loja',
    'Configurar domínio personalizado',
    'Relatórios de vendas'
  ];

  const filteredCategorias = categorias.filter(categoria =>
    categoria.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.artigos.some(artigo => 
      artigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="central-ajuda">
      {/* Header */}
      <div className="ajuda-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="ajuda-hero">
            <h1>Central de Ajuda</h1>
            <p>Encontre tudo que precisa para ter sucesso com sua loja online</p>
            
            <div className="search-box">
              <input
                type="text"
                placeholder="Pesquisar artigos, tutoriais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="quick-links">
        <div className="container">
          <div className="quick-links-grid">
            <button 
              className="quick-link"
              onClick={() => navigate('/tutoriais')}
            >
              <span className="icon">📚</span>
              <span>Tutoriais</span>
            </button>
            <button 
              className="quick-link"
              onClick={() => navigate('/faq')}
            >
              <span className="icon">❓</span>
              <span>FAQ</span>
            </button>
            <button 
              className="quick-link"
              onClick={() => navigate('/contato')}
            >
              <span className="icon">💬</span>
              <span>Contato</span>
            </button>
            <button 
              className="quick-link"
              onClick={() => navigate('/status')}
            >
              <span className="icon">🟢</span>
              <span>Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Artigos Populares */}
      <section className="popular-articles">
        <div className="container">
          <h2>Artigos Populares</h2>
          <div className="articles-grid">
            {artigosPoupulares.map((artigo, index) => (
              <div key={index} className="article-card">
                <h3>{artigo}</h3>
                <span className="read-more">Ler artigo →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="help-categories">
        <div className="container">
          <h2>Categorias de Ajuda</h2>
          <div className="categories-grid">
            {filteredCategorias.map((categoria, index) => (
              <div key={index} className="category-card">
                <div className="category-header">
                  <span className="category-icon">{categoria.icon}</span>
                  <div>
                    <h3>{categoria.title}</h3>
                    <p>{categoria.description}</p>
                  </div>
                </div>
                
                <div className="category-articles">
                  {categoria.artigos.map((artigo, artigoIndex) => (
                    <div key={artigoIndex} className="article-link">
                      {artigo}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA para Contato */}
      <section className="help-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ainda precisa de ajuda?</h2>
            <p>Nossa equipe está pronta para te auxiliar com qualquer dúvida</p>
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
      </section>
    </div>
  );
};

export default CentralAjudaPage;
