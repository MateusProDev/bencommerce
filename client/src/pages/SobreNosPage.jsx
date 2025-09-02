import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SobreNosPage.css';

const SobreNosPage = () => {
  const navigate = useNavigate();

  const valores = [
    { icon: '🚀', titulo: 'Inovação', descricao: 'Sempre buscamos as melhores tecnologias para modernizar agências de turismo.' },
    { icon: '🤝', titulo: 'Parceria', descricao: 'Acreditamos em relacionamentos duradouros e crescimento conjunto.' },
    { icon: '⭐', titulo: 'Qualidade', descricao: 'Compromisso com a excelência em cada solução.' },
    { icon: '📈', titulo: 'Crescimento', descricao: 'Ajudamos agências a alcançar seu potencial no mercado digital.' }
  ];

  const estatisticas = [
    { numero: '500+', texto: 'Agências Atendidas' },
    { numero: '15k+', texto: 'Clientes Gerenciados' },
    { numero: '50k+', texto: 'Reservas Processadas' },
    { numero: '98%', texto: 'Satisfação do Cliente' }
  ];

  const timeline = [
    { ano: '2020', titulo: 'Fundação', descricao: 'Turvia foi criada com a missão de modernizar agências de turismo.' },
    { ano: '2021', titulo: 'Primeiras Agências', descricao: 'Alcançamos as primeiras agências ativas.' },
    { ano: '2022', titulo: 'Expansão', descricao: 'Novas funcionalidades e relatórios avançados.' },
    { ano: '2023', titulo: 'Reconhecimento', descricao: 'Crescimento e prêmios no setor.' }
  ];

  const equipe = [
    { nome: 'Carlos Silva', cargo: 'CEO & Fundador', descricao: '15 anos de experiência no setor de turismo', avatar: '👨‍💼' },
    { nome: 'Ana Santos', cargo: 'CTO', descricao: 'Especialista em desenvolvimento de sistemas', avatar: '👩‍💻' },
    { nome: 'Roberto Lima', cargo: 'Head de Produto', descricao: 'Expert em experiência do usuário', avatar: '👨‍🎨' }
  ];

  return (
    <div className="sobre-nos-page">
      <header className="sobre-header">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left" /> Voltar
          </button>
          <div className="header-content">
            <h1>Sobre a Turvia</h1>
            <p className="header-subtitle">Transformando agências de turismo através da tecnologia desde 2020</p>
            <div className="header-stats">
              {estatisticas.map((s, i) => (
                <div key={i} className="header-stat">
                  <span className="stat-number">{s.numero}</span>
                  <span className="stat-label">{s.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="sobre-main">
        <section className="missao-section">
          <div className="container">
            <div className="missao-content">
              <div className="missao-text">
                <h2>Nossa Missão</h2>
                <p>Modernizar agências de turismo com ferramentas profissionais e acessíveis.</p>
              </div>
              <div className="missao-visual"><div className="missao-icon">🎯</div></div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <h2>Nossos Números</h2>
            <div className="stats-grid">
              {estatisticas.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-numero">{stat.numero}</div>
                  <div className="stat-texto">{stat.texto}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="valores-section">
          <div className="container">
            <h2>Nossos Valores</h2>
            <div className="valores-grid">
              {valores.map((v, i) => (
                <div key={i} className="valor-card">
                  <div className="valor-icon">{v.icon}</div>
                  <h3>{v.titulo}</h3>
                  <p>{v.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="timeline-section">
          <div className="container">
            <h2>Nossa Jornada</h2>
            <div className="timeline">
              {timeline.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-year">{t.ano}</div>
                  <div className="timeline-content">
                    <h3>{t.titulo}</h3>
                    <p>{t.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="equipe-section">
          <div className="container">
            <h2>Nossa Equipe</h2>
            <div className="equipe-grid">
              {equipe.map((m, i) => (
                <div key={i} className="equipe-card">
                  <div className="equipe-avatar">{m.avatar}</div>
                  <h3>{m.nome}</h3>
                  <div className="equipe-cargo">{m.cargo}</div>
                  <p>{m.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Pronto para modernizar sua agência?</h2>
              <p>Junte-se às agências que já transformaram seus negócios com a Turvia.</p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => navigate('/planos')}>Ver Planos</button>
                <button className="btn-secondary" onClick={() => navigate('/contato')}>Falar com Consultor</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SobreNosPage;
