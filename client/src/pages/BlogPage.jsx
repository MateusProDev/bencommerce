import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categorias = [
    { id: 'todos', nome: 'Todos os Posts', icon: '📝' },
    { id: 'ecommerce', nome: 'E-commerce', icon: '🛒' },
    { id: 'marketing', nome: 'Marketing Digital', icon: '📊' },
    { id: 'tecnologia', nome: 'Tecnologia', icon: '💻' },
    { id: 'negocios', nome: 'Negócios', icon: '💼' },
    { id: 'dicas', nome: 'Dicas & Tutoriais', icon: '💡' }
  ];

  const posts = [
    {
      id: 1,
      titulo: '10 Dicas para Aumentar as Vendas do seu E-commerce em 2025',
      categoria: 'ecommerce',
      resumo: 'Estratégias comprovadas para impulsionar suas vendas online e superar a concorrência.',
      autor: 'Ana Costa',
      data: '15 de Janeiro, 2025',
      tempo: '8 min',
      views: '2.5k',
      thumbnail: '🚀',
      tags: ['vendas', 'estratégia', 'conversão']
    },
    {
      id: 2,
      titulo: 'Como Usar Instagram Shopping para Vender Mais',
      categoria: 'marketing',
      resumo: 'Guia completo para configurar e otimizar sua loja no Instagram Shopping.',
      autor: 'Pedro Santos',
      data: '12 de Janeiro, 2025',
      tempo: '6 min',
      views: '1.8k',
      thumbnail: '📱',
      tags: ['instagram', 'redes sociais', 'marketing']
    },
    {
      id: 3,
      titulo: 'Inteligência Artificial no E-commerce: Tendências 2025',
      categoria: 'tecnologia',
      resumo: 'Como a IA está revolucionando o comércio eletrônico e o que esperar no futuro.',
      autor: 'Maria Oliveira',
      data: '10 de Janeiro, 2025',
      tempo: '10 min',
      views: '3.2k',
      thumbnail: '🤖',
      tags: ['ia', 'futuro', 'inovação']
    },
    {
      id: 4,
      titulo: 'SEO para Lojas Online: Guia Completo 2025',
      categoria: 'marketing',
      resumo: 'Tudo que você precisa saber para otimizar sua loja e aparecer no Google.',
      autor: 'Carlos Silva',
      data: '8 de Janeiro, 2025',
      tempo: '12 min',
      views: '4.1k',
      thumbnail: '🔍',
      tags: ['seo', 'google', 'tráfego']
    },
    {
      id: 5,
      titulo: 'Como Escolher a Plataforma Ideal para seu E-commerce',
      categoria: 'negocios',
      resumo: 'Fatores essenciais para escolher a melhor solução de e-commerce para seu negócio.',
      autor: 'Ana Costa',
      data: '5 de Janeiro, 2025',
      tempo: '7 min',
      views: '1.9k',
      thumbnail: '⚖️',
      tags: ['plataforma', 'decisão', 'negócio']
    },
    {
      id: 6,
      titulo: 'Checkout Otimizado: Reduza o Abandono de Carrinho',
      categoria: 'ecommerce',
      resumo: 'Técnicas para criar um processo de checkout que converte mais clientes.',
      autor: 'Pedro Santos',
      data: '3 de Janeiro, 2025',
      tempo: '9 min',
      views: '2.7k',
      thumbnail: '💳',
      tags: ['checkout', 'conversão', 'ux']
    },
    {
      id: 7,
      titulo: 'Email Marketing para E-commerce: Estratégias que Funcionam',
      categoria: 'marketing',
      resumo: 'Como usar email marketing para aumentar vendas e fidelizar clientes.',
      autor: 'Maria Oliveira',
      data: '1 de Janeiro, 2025',
      tempo: '8 min',
      views: '2.1k',
      thumbnail: '📧',
      tags: ['email', 'fidelização', 'automação']
    },
    {
      id: 8,
      titulo: 'Análise de Dados: KPIs Essenciais para E-commerce',
      categoria: 'negocios',
      resumo: 'Métricas fundamentais para acompanhar o desempenho da sua loja online.',
      autor: 'Carlos Silva',
      data: '29 de Dezembro, 2024',
      tempo: '11 min',
      views: '3.8k',
      thumbnail: '📈',
      tags: ['analytics', 'kpi', 'métricas']
    }
  ];

  const postsFiltrados = posts.filter(post => {
    const matchCategoria = categoriaAtiva === 'todos' || post.categoria === categoriaAtiva;
    const matchSearch = searchTerm === '' || 
      post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategoria && matchSearch;
  });

  const postDestaque = posts[0];

  return (
    <div className="blog-page">
      {/* Header */}
      <div className="blog-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Blog</h1>
            <p>Insights, dicas e tendências do mundo do e-commerce</p>
            
            <div className="search-box">
              <input
                type="text"
                placeholder="Pesquisar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Destaque */}
      <section className="destaque-section">
        <div className="container">
          <div className="post-destaque">
            <div className="destaque-content">
              <div className="destaque-badge">✨ Post em Destaque</div>
              <h2>{postDestaque.titulo}</h2>
              <p>{postDestaque.resumo}</p>
              
              <div className="destaque-meta">
                <div className="meta-info">
                  <span className="autor">Por {postDestaque.autor}</span>
                  <span className="data">{postDestaque.data}</span>
                  <span className="tempo">⏱️ {postDestaque.tempo}</span>
                </div>
                <div className="tags">
                  {postDestaque.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              <button className="btn-ler">Ler Artigo Completo</button>
            </div>
            
            <div className="destaque-visual">
              <div className="destaque-thumbnail">{postDestaque.thumbnail}</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Posts Grid */}
      <section className="posts-section">
        <div className="container">
          <div className="posts-header">
            <h2>
              {categoriaAtiva === 'todos' ? 'Todos os Posts' : 
               categorias.find(cat => cat.id === categoriaAtiva)?.nome}
            </h2>
            <span className="posts-count">
              {postsFiltrados.length} artigo{postsFiltrados.length !== 1 ? 's' : ''} encontrado{postsFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>

          {postsFiltrados.length > 0 ? (
            <div className="posts-grid">
              {postsFiltrados.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-thumbnail">
                    <span className="thumbnail-icon">{post.thumbnail}</span>
                    <div className="post-categoria">{categorias.find(cat => cat.id === post.categoria)?.nome}</div>
                  </div>
                  
                  <div className="post-content">
                    <h3>{post.titulo}</h3>
                    <p>{post.resumo}</p>
                    
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-meta">
                      <span className="autor">Por {post.autor}</span>
                      <span className="data">{post.data}</span>
                    </div>
                    <div className="post-stats">
                      <span className="tempo">⏱️ {post.tempo}</span>
                      <span className="views">👁️ {post.views}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">🔍</div>
              <h3>Nenhum artigo encontrado</h3>
              <p>Tente ajustar os filtros ou usar outras palavras-chave</p>
              <button 
                className="btn-clear-search"
                onClick={() => {
                  setSearchTerm('');
                  setCategoriaAtiva('todos');
                }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>📬 Receba os Melhores Conteúdos</h2>
            <p>Assine nossa newsletter e seja o primeiro a receber artigos exclusivos sobre e-commerce</p>
            
            <div className="newsletter-form">
              <input type="email" placeholder="Seu melhor email" />
              <button className="btn-subscribe">Assinar Newsletter</button>
            </div>
            
            <small>✅ Sem spam. Cancele quando quiser.</small>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="blog-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Colocar em Prática?</h2>
            <p>Transforme o conhecimento em resultados com nossa plataforma de e-commerce</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/planos')}
              >
                Criar Minha Loja
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/contato')}
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
