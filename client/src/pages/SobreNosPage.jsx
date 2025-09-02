import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SobreNosPage.css';

const SobreNosPage = () => {
  const navigate = useNavigate();

  const valores = [
    {
      icon: '🚀',
      titulo: 'Inovação',
      descricao: 'Sempre buscamos as melhores tecnologias para modernizar agências de turismo.'
    },
    {
      icon: '🤝',
      titulo: 'Parceria',
      descricao: 'Acreditamos em relacionamentos duradouros e crescimento conjunto com nossas agências parceiras.'
    },
    {
      icon: '⭐',
      titulo: 'Qualidade',
      descricao: 'Compromisso com a excelência em cada solução que desenvolvemos para o turismo.'
    },
    {
      icon: '📈',
      titulo: 'Crescimento',
      descricao: 'Ajudamos agências de turismo a crescer e alcançar seu potencial máximo no mercado.'
    }
  ];

  const timeline = [
    {
      ano: '2020',
      titulo: 'Fundação',
      descricao: 'MabelSoft foi criada com a missão de modernizar agências de turismo no Brasil'
    },
    {
      ano: '2021',
      titulo: 'Primeiras Agências',
      descricao: 'Alcançamos 50 agências ativas e começamos a expandir nossas funcionalidades'
    },
    {
      ano: '2022',
      titulo: 'Expansão',
      descricao: 'Lançamos sistema de gestão de motoristas e relatórios avançados'
    },
    {
      ano: '2023',
      titulo: 'Reconhecimento',
      descricao: 'Premiados como melhor sistema de gestão para agências de turismo'
    },
    {
      ano: '2024',
      titulo: 'Inovação',
      descricao: 'Implementamos IA e automação para otimizar operações das agências'
    },
    {
      ano: '2025',
      titulo: 'Futuro',
      descricao: 'Focados em tornar a gestão de turismo ainda mais inteligente e eficiente'
    }
  ];

  const equipe = [
    {
      nome: 'Carlos Silva',
      cargo: 'CEO & Fundador',
      foto: '👨‍💼',
      descricao: 'Especialista em turismo com mais de 10 anos de experiência'
    },
    {
      nome: 'Ana Costa',
      cargo: 'CTO',
      foto: '👩‍💻',
      descricao: 'Engenheira de software focada em sistemas para agências de turismo'
    },
    {
      nome: 'Pedro Santos',
      cargo: 'Head de Marketing',
      foto: '👨‍🎨',
      descricao: 'Especialista em marketing digital para o setor de turismo'
    },
    {
      nome: 'Maria Oliveira',
      cargo: 'Head de Produto',
      foto: '👩‍🚀',
      descricao: 'Product Manager com foco em experiência de agências de turismo'
    }
  ];

  const estatisticas = [
    { numero: '2,500+', texto: 'Agências Atendidas' },
    { numero: '5M+', texto: 'Reservas Processadas' },
    { numero: '99.9%', texto: 'Uptime' },
    { numero: '24/7', texto: 'Suporte' }
  ];

  return (
    <div className="sobre-page">
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
            <p>Transformando agências de turismo através da tecnologia desde 2020</p>
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
                Modernizar agências de turismo no Brasil, oferecendo ferramentas profissionais 
                e acessíveis para que qualquer agência possa gerenciar seus clientes, 
                motoristas e reservas com sucesso.
              </p>
              <p>
                Acreditamos que toda agência de turismo, independente do tamanho, merece ter acesso 
                às mesmas tecnologias e recursos que as grandes empresas do setor utilizam.
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
            Um time apaixonado por turismo e tecnologia, dedicado ao sucesso das agências parceiras
          </p>
          
          <div className="equipe-grid">
            {equipe.map((pessoa, index) => (
              <div key={index} className="equipe-card">
                <div className="pessoa-foto">{pessoa.foto}</div>
                <div className="pessoa-info">
                  <h3>{pessoa.nome}</h3>
                  <div className="pessoa-cargo">{pessoa.cargo}</div>
                  <p>{pessoa.descricao}</p>
                </div>
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
                Utilizamos as melhores tecnologias do mercado para garantir que 
                sua agência de turismo tenha sempre a melhor performance e segurança.
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
            <h2>Pronto para Modernizar sua Agência?</h2>
            <p>Junte-se a milhares de agências de turismo que já confiam no MabelSoft</p>
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

export default SobreNosPage;
