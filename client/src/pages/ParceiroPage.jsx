import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParceiroPage.css';

const ParceiroPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    tipoParceria: '',
    experiencia: '',
    mensagem: ''
  });

  const tiposParceria = [
    {
      id: 'revenda',
      titulo: 'Revenda',
      icon: '🤝',
      descricao: 'Revenda nossa plataforma e ganhe comissões atrativas',
      beneficios: [
        'Comissão de até 30% por venda',
        'Material de vendas exclusivo',
        'Suporte dedicado para parceiros',
        'Treinamento completo'
      ]
    },
    {
      id: 'agencia',
      titulo: 'Agência Digital',
      icon: '🎨',
      descricao: 'Ofereça soluções completas de e-commerce aos seus clientes',
      beneficios: [
        'Desconto especial para agências',
        'White label disponível',
        'Suporte técnico prioritário',
        'Certificação oficial'
      ]
    },
    {
      id: 'desenvolvedor',
      titulo: 'Desenvolvedor',
      icon: '💻',
      descricao: 'Integre nossa API e crie soluções personalizadas',
      beneficios: [
        'Acesso completo à API',
        'Documentação técnica detalhada',
        'Suporte técnico especializado',
        'Programa de desenvolvedores'
      ]
    },
    {
      id: 'afiliado',
      titulo: 'Afiliado',
      icon: '📈',
      descricao: 'Indique clientes e ganhe comissões recorrentes',
      beneficios: [
        'Comissão por vida do cliente',
        'Dashboard de acompanhamento',
        'Material promocional',
        'Pagamentos automáticos'
      ]
    }
  ];

  const vantagens = [
    {
      icon: '💰',
      titulo: 'Renda Extra',
      descricao: 'Ganhe comissões atrativas e crie uma fonte de renda adicional'
    },
    {
      icon: '📚',
      titulo: 'Treinamento',
      descricao: 'Acesso a materiais exclusivos e treinamentos especializados'
    },
    {
      icon: '🎯',
      titulo: 'Suporte Dedicado',
      descricao: 'Equipe especializada para dar suporte aos nossos parceiros'
    },
    {
      icon: '🚀',
      titulo: 'Crescimento',
      descricao: 'Escale seu negócio com nossa plataforma em constante evolução'
    }
  ];

  const depoimentos = [
    {
      nome: 'Roberto Silva',
      empresa: 'Digital Solutions',
      cargo: 'CEO',
      foto: '👨‍💼',
      depoimento: 'Parceria incrível! Em 6 meses aumentamos nossa receita em 40% oferecendo soluções de e-commerce com o BenCommerce.',
      rating: 5
    },
    {
      nome: 'Mariana Costa',
      empresa: 'WebMax Agency',
      cargo: 'Diretora Comercial',
      foto: '👩‍💻',
      depoimento: 'O suporte é excepcional e nossos clientes ficam muito satisfeitos com a plataforma. Recomendo a parceria!',
      rating: 5
    },
    {
      nome: 'Carlos Mendes',
      empresa: 'TechPartner',
      cargo: 'Desenvolvedor',
      foto: '👨‍🔧',
      depoimento: 'A API é muito bem documentada e facilita muito o desenvolvimento de integrações personalizadas.',
      rating: 5
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você implementaria o envio do formulário
    console.log('Dados do formulário:', formData);
    alert('Formulário enviado! Entraremos em contato em breve.');
  };

  return (
    <div className="parceiro-page">
      {/* Header */}
      <div className="parceiro-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Seja um Parceiro</h1>
            <p>Junte-se a nós e construa o futuro do e-commerce brasileiro</p>
            
            <div className="header-stats">
              <div className="stat">
                <strong>500+</strong>
                <span>Parceiros Ativos</span>
              </div>
              <div className="stat">
                <strong>R$ 2M+</strong>
                <span>Comissões Pagas</span>
              </div>
              <div className="stat">
                <strong>95%</strong>
                <span>Satisfação</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tipos de Parceria */}
      <section className="tipos-parceria">
        <div className="container">
          <h2>Escolha o Tipo de Parceria</h2>
          <p className="section-subtitle">
            Temos diferentes modelos de parceria para atender seu perfil profissional
          </p>
          
          <div className="parceria-grid">
            {tiposParceria.map((tipo, index) => (
              <div key={index} className="parceria-card">
                <div className="card-header">
                  <div className="card-icon">{tipo.icon}</div>
                  <h3>{tipo.titulo}</h3>
                </div>
                
                <p className="card-description">{tipo.descricao}</p>
                
                <div className="beneficios">
                  <strong>Benefícios:</strong>
                  <ul>
                    {tipo.beneficios.map((beneficio, idx) => (
                      <li key={idx}>{beneficio}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="btn-escolher"
                  onClick={() => setFormData(prev => ({ ...prev, tipoParceria: tipo.id }))}
                >
                  Escolher este Modelo
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="vantagens-section">
        <div className="container">
          <h2>Por que ser Nosso Parceiro?</h2>
          
          <div className="vantagens-grid">
            {vantagens.map((vantagem, index) => (
              <div key={index} className="vantagem-card">
                <div className="vantagem-icon">{vantagem.icon}</div>
                <h3>{vantagem.titulo}</h3>
                <p>{vantagem.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="depoimentos-section">
        <div className="container">
          <h2>O que Nossos Parceiros Dizem</h2>
          
          <div className="depoimentos-grid">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className="depoimento-card">
                <div className="depoimento-header">
                  <div className="pessoa-info">
                    <div className="pessoa-foto">{depoimento.foto}</div>
                    <div>
                      <h4>{depoimento.nome}</h4>
                      <p>{depoimento.cargo}</p>
                      <small>{depoimento.empresa}</small>
                    </div>
                  </div>
                  
                  <div className="rating">
                    {[...Array(depoimento.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>
                </div>
                
                <blockquote>"{depoimento.depoimento}"</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="formulario-section">
        <div className="container">
          <div className="formulario-content">
            <div className="formulario-info">
              <h2>Candidate-se Agora</h2>
              <p>
                Preencha o formulário e nossa equipe entrará em contato para 
                discutir a melhor parceria para seu perfil.
              </p>
              
              <div className="processo-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div>
                    <h4>Inscrição</h4>
                    <p>Preencha o formulário com suas informações</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div>
                    <h4>Análise</h4>
                    <p>Nossa equipe avalia seu perfil e experiência</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">3</div>
                  <div>
                    <h4>Aprovação</h4>
                    <p>Enviamos o contrato e materiais de apoio</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">4</div>
                  <div>
                    <h4>Início</h4>
                    <p>Comece a vender e ganhar comissões</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="parceiro-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Tipo de Parceria *</label>
                <select
                  name="tipoParceria"
                  value={formData.tipoParceria}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione uma opção</option>
                  <option value="revenda">Revenda</option>
                  <option value="agencia">Agência Digital</option>
                  <option value="desenvolvedor">Desenvolvedor</option>
                  <option value="afiliado">Afiliado</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Experiência no Mercado *</label>
                <select
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione uma opção</option>
                  <option value="iniciante">Iniciante (menos de 1 ano)</option>
                  <option value="intermediario">Intermediário (1-3 anos)</option>
                  <option value="avancado">Avançado (3-5 anos)</option>
                  <option value="expert">Expert (mais de 5 anos)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Mensagem</label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Conte-nos mais sobre sua experiência e objetivos..."
                />
              </div>
              
              <button type="submit" className="btn-enviar">
                Enviar Candidatura
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="parceiro-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Dúvidas sobre a Parceria?</h2>
            <p>Nossa equipe de parcerias está pronta para esclarecer todas as suas dúvidas</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                WhatsApp
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/contato')}
              >
                Formulário de Contato
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParceiroPage;
