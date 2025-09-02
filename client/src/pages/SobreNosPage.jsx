import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SobreNosPage.css';

const SobreNosPage = () => {
  const navigate = useNavigate();

  const valores = [
    {
      icon: '🚀',
      titulo: 'Inovação',
      descricao: 'Sempre buscamos as melhores tecnologias para oferecer soluções modernas e eficientes.'
    },
    {
      icon: '🤝',
      titulo: 'Parceria',
      descricao: 'Acreditamos em relacionamentos duradouros e crescimento conjunto com nossos clientes.'
    },
    {
      icon: '💎',
      titulo: 'Qualidade',
      descricao: 'Compromisso com a excelência em cada produto e serviço que desenvolvemos.'
    },
    {
      icon: '🌱',
      titulo: 'Crescimento',
      descricao: 'Ajudamos empresas a crescer e alcançar seu potencial máximo no digital.'
    }
  ];

  const timeline = [
    {
      ano: '2020',
      titulo: 'Fundação',
      descricao: 'BenCommerce foi criado com a missão de democratizar o e-commerce no Brasil'
    },
    {
      ano: '2021',
      titulo: 'Primeiros Clientes',
      descricao: 'Alcançamos 100 lojas ativas e começamos a expandir nossos recursos'
    },
    {
      ano: '2022',
      titulo: 'Expansão',
      descricao: 'Lançamos integração com redes sociais e sistema de pagamentos avançado'
    },
    {
      ano: '2023',
      titulo: 'Reconhecimento',
      descricao: 'Premiados como melhor plataforma de e-commerce para PMEs'
    },
    {
      ano: '2024',
      titulo: 'Inovação',
      descricao: 'Implementamos IA e automação para otimizar vendas dos nossos clientes'
    },
    {
      ano: '2025',
      titulo: 'Futuro',
      descricao: 'Focados em tornar o e-commerce ainda mais acessível e inteligente'
    }
  ];

  const equipe = [
    {
      nome: 'Carlos Silva',
      cargo: 'CEO & Fundador',
      foto: '👨‍💼',
      descricao: 'Especialista em e-commerce com mais de 10 anos de experiência'
    },
    {
      nome: 'Ana Costa',
      cargo: 'CTO',
      foto: '👩‍💻',
      descricao: 'Engenheira de software focada em criar soluções escaláveis'
    },
    {
      nome: 'Pedro Santos',
      cargo: 'Head de Marketing',
      foto: '👨‍🎨',
      descricao: 'Especialista em marketing digital e growth hacking'
    },
    {
      nome: 'Maria Oliveira',
      cargo: 'Head de Produto',
      foto: '👩‍🚀',
      descricao: 'Product Manager com foco em experiência do usuário'
    }
  ];

  const estatisticas = [
    { numero: '10,000+', texto: 'Lojas Ativas' },
    { numero: '50M+', texto: 'Vendas Processadas' },
    { numero: '99.9%', texto: 'Uptime' },
    { numero: '24/7', texto: 'Suporte' }
  ];

  return (
    <div className="sobre-nos-page">
      {/* Header */}
      <div className="sobre-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Sobre Nós</h1>
            <p>Transformando negócios através do e-commerce desde 2020</p>
          </div>
        </div>
      </div>

      {/* Missão */}
      <section className="missao-section">
        <div className="container">
          <div className="missao-content">
            <div className="missao-text">
              <h2>Nossa Missão</h2>
              <p>
                Democratizar o e-commerce no Brasil, oferecendo ferramentas profissionais 
                e acessíveis para que qualquer empreendedor possa criar e gerenciar sua 
                loja online com sucesso.
              </p>
              <p>
                Acreditamos que toda empresa, independente do tamanho, merece ter acesso 
                às mesmas tecnologias e recursos que as grandes corporações utilizam.
              </p>
            </div>
            <div className="missao-visual">
              <div className="missao-icon">🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="stats-section">
        <div className="container">
          <h2>Nossos Números</h2>
          <div className="stats-grid">
            {estatisticas.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-numero">{stat.numero}</div>
                <div className="stat-texto">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="valores-section">
        <div className="container">
          <h2>Nossos Valores</h2>
          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <div className="valor-icon">{valor.icon}</div>
                <h3>{valor.titulo}</h3>
                <p>{valor.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <h2>Nossa Jornada</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{item.ano}</div>
                <div className="timeline-content">
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="equipe-section">
        <div className="container">
          <h2>Nossa Equipe</h2>
          <p className="equipe-intro">
            Um time apaixonado por tecnologia e dedicado ao sucesso dos nossos clientes
          </p>
          
          <div className="equipe-grid">
            {equipe.map((pessoa, index) => (
              <div key={index} className="equipe-card">
                <div className="pessoa-foto">{pessoa.foto}</div>
                <h3>{pessoa.nome}</h3>
                <div className="pessoa-cargo">{pessoa.cargo}</div>
                <p>{pessoa.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologia */}
      <section className="tecnologia-section">
        <div className="container">
          <div className="tecnologia-content">
            <div className="tecnologia-text">
              <h2>Tecnologia de Ponta</h2>
              <p>
                Utilizamos as mais modernas tecnologias para garantir que sua loja 
                seja rápida, segura e sempre atualizada.
              </p>
              <ul>
                <li>✅ Infraestrutura em nuvem AWS</li>
                <li>✅ SSL e criptografia avançada</li>
                <li>✅ CDN global para velocidade</li>
                <li>✅ Backup automático diário</li>
                <li>✅ Monitoramento 24/7</li>
                <li>✅ Inteligência artificial integrada</li>
              </ul>
            </div>
            <div className="tecnologia-visual">
              <div className="tech-icons">
                <div className="tech-icon">☁️</div>
                <div className="tech-icon">🔐</div>
                <div className="tech-icon">⚡</div>
                <div className="tech-icon">🤖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sobre-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Transformar seu Negócio?</h2>
            <p>Junte-se a milhares de empreendedores que já confiam no BenCommerce</p>
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
                Falar Conosco
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosPage;
