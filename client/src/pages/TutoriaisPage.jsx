import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutoriaisPage.css';

const TutoriaisPage = () => {
  const navigate = useNavigate();
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroNivel, setFiltroNivel] = useState('todos');

  const tutoriais = [
    {
      id: 1,
      titulo: 'Como criar sua primeira loja online',
      categoria: 'primeiros-passos',
      nivel: 'iniciante',
      duracao: '15 min',
      views: '12.5k',
      thumbnail: '🚀',
      descricao: 'Aprenda passo a passo como criar sua primeira loja online do zero',
      topicos: [
        'Criando sua conta',
        'Configuração inicial',
        'Adicionando produtos',
        'Publicando sua loja'
      ]
    },
    {
      id: 2,
      titulo: 'Configurando métodos de pagamento',
      categoria: 'pagamentos',
      nivel: 'intermediario',
      duracao: '20 min',
      views: '8.3k',
      thumbnail: '💳',
      descricao: 'Configure Stripe, PagSeguro e outros métodos de pagamento',
      topicos: [
        'Configurando Stripe',
        'Integrando PagSeguro',
        'Configurando PIX',
        'Testando pagamentos'
      ]
    },
    {
      id: 3,
      titulo: 'Personalizando design da sua loja',
      categoria: 'design',
      nivel: 'intermediario',
      duracao: '25 min',
      views: '9.7k',
      thumbnail: '🎨',
      descricao: 'Deixe sua loja com sua identidade visual',
      topicos: [
        'Escolhendo cores',
        'Adicionando logo',
        'Configurando banners',
        'Customizando footer'
      ]
    },
    {
      id: 4,
      titulo: 'SEO para lojas online',
      categoria: 'marketing',
      nivel: 'avancado',
      duracao: '30 min',
      views: '6.2k',
      thumbnail: '📈',
      descricao: 'Otimize sua loja para aparecer no Google',
      topicos: [
        'Meta tags essenciais',
        'URLs amigáveis',
        'Sitemap e robots.txt',
        'Google Analytics'
      ]
    },
    {
      id: 5,
      titulo: 'Gestão avançada de estoque',
      categoria: 'produtos',
      nivel: 'avancado',
      duracao: '35 min',
      views: '4.8k',
      thumbnail: '📦',
      descricao: 'Controle total do seu estoque e variações',
      topicos: [
        'Produtos com variações',
        'Controle automático',
        'Alertas de estoque baixo',
        'Relatórios detalhados'
      ]
    },
    {
      id: 6,
      titulo: 'Integrações com redes sociais',
      categoria: 'marketing',
      nivel: 'intermediario',
      duracao: '18 min',
      views: '7.1k',
      thumbnail: '📱',
      descricao: 'Conecte sua loja com Instagram, Facebook e WhatsApp',
      topicos: [
        'Catálogo no Instagram',
        'Facebook Shop',
        'WhatsApp Business',
        'Pixel de conversão'
      ]
    }
  ];

  const categorias = [
    { value: 'todos', label: 'Todas as Categorias' },
    { value: 'primeiros-passos', label: 'Primeiros Passos' },
    { value: 'produtos', label: 'Produtos' },
    { value: 'pagamentos', label: 'Pagamentos' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const niveis = [
    { value: 'todos', label: 'Todos os Níveis' },
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' }
  ];

  const tutoriaisFiltrados = tutoriais.filter(tutorial => {
    const categoriaMatch = filtroCategoria === 'todos' || tutorial.categoria === filtroCategoria;
    const nivelMatch = filtroNivel === 'todos' || tutorial.nivel === filtroNivel;
    return categoriaMatch && nivelMatch;
  });

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'iniciante': return '#4CAF50';
      case 'intermediario': return '#FF9800';
      case 'avancado': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <div className="tutoriais-page">
      {/* Header */}
      <div className="tutoriais-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Tutoriais</h1>
            <p>Aprenda passo a passo como usar todas as funcionalidades da plataforma</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <div className="container">
          <div className="filtros">
            <div className="filtro-group">
              <label>Categoria:</label>
              <select 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Nível:</label>
              <select 
                value={filtroNivel} 
                onChange={(e) => setFiltroNivel(e.target.value)}
              >
                {niveis.map(nivel => (
                  <option key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="results-count">
              {tutoriaisFiltrados.length} tutorial{tutoriaisFiltrados.length !== 1 ? 's' : ''} encontrado{tutoriaisFiltrados.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Tutoriais */}
      <div className="tutoriais-content">
        <div className="container">
          <div className="tutoriais-grid">
            {tutoriaisFiltrados.map(tutorial => (
              <div key={tutorial.id} className="tutorial-card">
                <div className="tutorial-header">
                  <div className="tutorial-thumbnail">
                    <span className="thumbnail-icon">{tutorial.thumbnail}</span>
                  </div>
                  <div className="tutorial-meta">
                    <div className="meta-badges">
                      <span 
                        className="nivel-badge"
                        style={{ background: getNivelColor(tutorial.nivel) }}
                      >
                        {tutorial.nivel}
                      </span>
                      <span className="duracao-badge">
                        ⏱️ {tutorial.duracao}
                      </span>
                    </div>
                    <div className="views">
                      👁️ {tutorial.views} visualizações
                    </div>
                  </div>
                </div>

                <div className="tutorial-body">
                  <h3>{tutorial.titulo}</h3>
                  <p>{tutorial.descricao}</p>

                  <div className="topicos">
                    <strong>O que você vai aprender:</strong>
                    <ul>
                      {tutorial.topicos.map((topico, index) => (
                        <li key={index}>{topico}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="tutorial-footer">
                  <button className="btn-assistir">
                    ▶️ Assistir Tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tutoriaisFiltrados.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Nenhum tutorial encontrado</h3>
              <p>Tente ajustar os filtros para encontrar o que está procurando</p>
              <button 
                className="btn-reset-filtros"
                onClick={() => {
                  setFiltroCategoria('todos');
                  setFiltroNivel('todos');
                }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="tutoriais-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Precisa de ajuda personalizada?</h2>
            <p>Nossa equipe pode te ajudar com treinamentos específicos para seu negócio</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/contato')}
              >
                Solicitar Treinamento
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/ajuda')}
              >
                Central de Ajuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoriaisPage;
