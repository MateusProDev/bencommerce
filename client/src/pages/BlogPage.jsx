import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categorias = [
    { id: 'todos', nome: 'Todos os Posts', icon: '📝' },
    { id: 'turismo', nome: 'Turismo', icon: '✈️' },
    { id: 'gestao', nome: 'Gestão de Agências', icon: '📊' },
    { id: 'tecnologia', nome: 'Tecnologia', icon: '💻' },
    { id: 'marketing', nome: 'Marketing Turístico', icon: '�' },
    { id: 'dicas', nome: 'Dicas & Tutoriais', icon: '💡' }
  ];

  const posts = [
    {
      id: 1,
      titulo: '10 Estratégias para Aumentar Reservas da sua Agência de Turismo',
      categoria: 'turismo',
      resumo: 'Técnicas comprovadas para impulsionar as vendas e atrair mais clientes para sua agência.',
      autor: 'Ana Costa',
      data: '15 de Janeiro, 2025',
      tempo: '8 min',
      views: '2.5k',
      thumbnail: '🚀',
      tags: ['vendas', 'estratégia', 'reservas']
    },
    {
      id: 2,
      titulo: 'Como Usar Redes Sociais para Promover Destinos Turísticos',
      categoria: 'marketing',
      resumo: 'Guia completo para usar Instagram, Facebook e TikTok no marketing turístico.',
      autor: 'Pedro Santos',
      data: '12 de Janeiro, 2025',
      tempo: '6 min',
      views: '1.8k',
      thumbnail: '📱',
      tags: ['instagram', 'redes sociais', 'destinos']
    },
    {
      id: 3,
      titulo: 'IA no Turismo: Como Automatizar Atendimento ao Cliente',
      categoria: 'tecnologia',
      resumo: 'Como a Inteligência Artificial está revolucionando o atendimento em agências de turismo.',
      autor: 'Maria Oliveira',
      data: '10 de Janeiro, 2025',
      tempo: '10 min',
      views: '3.2k',
      thumbnail: '🤖',
      tags: ['ia', 'automação', 'atendimento']
    },
    {
      id: 4,
      titulo: 'SEO para Agências de Turismo: Apareça no Google',
      categoria: 'marketing',
      resumo: 'Tudo que você precisa saber para otimizar sua agência e aparecer no Google.',
      autor: 'Carlos Silva',
      data: '8 de Janeiro, 2025',
      tempo: '12 min',
      views: '4.1k',
      thumbnail: '🔍',
      tags: ['seo', 'google', 'visibilidade']
    },
    {
      id: 5,
      titulo: 'Gestão de Motoristas: Organização e Controle Eficiente',
      categoria: 'gestao',
      resumo: 'Como organizar e gerenciar sua equipe de motoristas para máxima eficiência.',
      autor: 'Ana Costa',
      data: '5 de Janeiro, 2025',
      tempo: '7 min',
      views: '1.9k',
      thumbnail: '🚗',
      tags: ['motoristas', 'gestão', 'organização']
    },
    {
      id: 6,
      titulo: 'Sistema de Reservas: Otimize seu Processo de Vendas',
      categoria: 'tecnologia',
      resumo: 'Técnicas para criar um sistema de reservas que converte mais clientes.',
      autor: 'Pedro Santos',
      data: '3 de Janeiro, 2025',
      tempo: '9 min',
      views: '2.7k',
      thumbnail: '�',
      tags: ['reservas', 'vendas', 'sistema']
    },
    {
      id: 7,
      titulo: 'WhatsApp Business para Agências: Atenda Melhor seus Clientes',
      categoria: 'dicas',
      resumo: 'Como usar WhatsApp Business para melhorar atendimento e aumentar vendas.',
      autor: 'Maria Oliveira',
      data: '1 de Janeiro, 2025',
      tempo: '8 min',
      views: '2.1k',
      thumbnail: '�',
      tags: ['whatsapp', 'atendimento', 'vendas']
    },
    {
      id: 8,
      titulo: 'Relatórios de Turismo: KPIs Essenciais para Agências',
      categoria: 'gestao',
      resumo: 'Métricas fundamentais para acompanhar o desempenho da sua agência de turismo.',
      autor: 'Carlos Silva',
      data: '29 de Dezembro, 2024',
      tempo: '11 min',
      views: '3.8k',
      thumbnail: '�',
      tags: ['relatórios', 'kpi', 'métricas']
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
            <p>Insights, dicas e tendências do mundo do turismo e gestão de agências</p>
            
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
            <h2>Pronto para Modernizar sua Agência?</h2>
            <p>Transforme o conhecimento em resultados com nossa plataforma para agências de turismo</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/planos')}
              >
                Ver Planos
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/contato')}
              >
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
