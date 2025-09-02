import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatusPage.css';

const StatusPage = () => {
  const navigate = useNavigate();
  const [statusAtual, setStatusAtual] = useState('operacional');

  // Simular dados em tempo real
  const [metricas, setMetricas] = useState({
    uptime: '99.98%',
    responseTime: '145ms',
    lastUpdate: new Date()
  });

  const servicos = [
    {
      nome: 'Website Principal',
      status: 'operacional',
      uptime: '99.99%',
      responseTime: '120ms',
      descricao: 'Site principal e páginas de marketing'
    },
    {
      nome: 'Dashboard de Agências',
      status: 'operacional',
      uptime: '99.97%',
      responseTime: '180ms',
      descricao: 'Painel administrativo das agências de turismo'
    },
    {
      nome: 'API de Produtos',
      status: 'operacional',
      uptime: '99.95%',
      responseTime: '95ms',
      descricao: 'API para gestão de produtos e catálogos'
    },
    {
      nome: 'Sistema de Pagamentos',
      status: 'operacional',
      uptime: '99.99%',
      responseTime: '210ms',
      descricao: 'Processamento de pagamentos e checkouts'
    },
    {
      nome: 'CDN de Imagens',
      status: 'operacional',
      uptime: '99.98%',
      responseTime: '85ms',
      descricao: 'Entrega de imagens e arquivos estáticos'
    },
    {
      nome: 'Sistema de Backup',
      status: 'operacional',
      uptime: '100%',
      responseTime: '--',
      descricao: 'Backup automático de dados'
    }
  ];

  const historico = [
    {
      data: '2024-01-15',
      tipo: 'melhoria',
      titulo: 'Otimização de Performance',
      descricao: 'Implementamos melhorias que reduziram o tempo de resposta em 25%',
      duracao: null
    },
    {
      data: '2024-01-10',
      tipo: 'manutencao',
      titulo: 'Manutenção Programada',
      descricao: 'Atualização de segurança nos servidores - Concluída com sucesso',
      duracao: '2h 15min'
    },
    {
      data: '2024-01-05',
      tipo: 'incidente',
      titulo: 'Lentidão no Sistema de Pagamentos',
      descricao: 'Problema temporário resolvido em nossa infraestrutura de pagamentos',
      duracao: '45min'
    },
    {
      data: '2024-01-01',
      tipo: 'melhoria',
      titulo: 'Nova Versão da Plataforma',
      descricao: 'Lançamento da versão 2.5 com novas funcionalidades e melhorias',
      duracao: null
    }
  ];

  const metricas30Dias = [
    { dia: 1, uptime: 100 },
    { dia: 2, uptime: 99.95 },
    { dia: 3, uptime: 100 },
    { dia: 4, uptime: 100 },
    { dia: 5, uptime: 99.8 },
    { dia: 6, uptime: 100 },
    { dia: 7, uptime: 100 },
    { dia: 8, uptime: 100 },
    { dia: 9, uptime: 100 },
    { dia: 10, uptime: 99.9 },
    { dia: 11, uptime: 100 },
    { dia: 12, uptime: 100 },
    { dia: 13, uptime: 100 },
    { dia: 14, uptime: 100 },
    { dia: 15, uptime: 100 },
    { dia: 16, uptime: 100 },
    { dia: 17, uptime: 100 },
    { dia: 18, uptime: 100 },
    { dia: 19, uptime: 100 },
    { dia: 20, uptime: 100 },
    { dia: 21, uptime: 100 },
    { dia: 22, uptime: 100 },
    { dia: 23, uptime: 100 },
    { dia: 24, uptime: 100 },
    { dia: 25, uptime: 100 },
    { dia: 26, uptime: 100 },
    { dia: 27, uptime: 100 },
    { dia: 28, uptime: 100 },
    { dia: 29, uptime: 100 },
    { dia: 30, uptime: 100 }
  ];

  useEffect(() => {
    // Simular atualização em tempo real
    const interval = setInterval(() => {
      setMetricas(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50 + 120) + 'ms',
        lastUpdate: new Date()
      }));
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operacional': return '#4CAF50';
      case 'degradado': return '#FF9800';
      case 'indisponivel': return '#F44336';
      case 'manutencao': return '#2196F3';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operacional': return '✅';
      case 'degradado': return '⚠️';
      case 'indisponivel': return '❌';
      case 'manutencao': return '🔧';
      default: return '❓';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'melhoria': return '🚀';
      case 'manutencao': return '🔧';
      case 'incidente': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getUptimeColor = (uptime) => {
    const value = parseFloat(uptime);
    if (value >= 99.9) return '#4CAF50';
    if (value >= 99.5) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="status-page">
      {/* Header */}
      <div className="status-header">
        <div className="container">
          <button 
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
          
          <div className="header-content">
            <h1>Status do Sistema</h1>
            <p>Acompanhe em tempo real o status de todos os serviços da plataforma para agências de turismo</p>
            
            <div className="status-overview">
              <div className="status-badge operacional">
                <span className="status-icon">✅</span>
                <div>
                  <strong>Todos os sistemas operacionais</strong>
                  <small>Última atualização: {metricas.lastUpdate.toLocaleTimeString()}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="metricas-section">
        <div className="container">
          <div className="metricas-grid">
            <div className="metrica-card">
              <div className="metrica-icon">📊</div>
              <div className="metrica-info">
                <h3>Disponibilidade</h3>
                <div className="metrica-valor">{metricas.uptime}</div>
                <small>Últimos 30 dias</small>
              </div>
            </div>
            
            <div className="metrica-card">
              <div className="metrica-icon">⚡</div>
              <div className="metrica-info">
                <h3>Tempo de Resposta</h3>
                <div className="metrica-valor">{metricas.responseTime}</div>
                <small>Média atual</small>
              </div>
            </div>
            
            <div className="metrica-card">
              <div className="metrica-icon">🔄</div>
              <div className="metrica-info">
                <h3>Incidentes</h3>
                <div className="metrica-valor">0</div>
                <small>Últimas 24h</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status dos Serviços */}
      <section className="servicos-section">
        <div className="container">
          <h2>Status dos Serviços</h2>
          
          <div className="servicos-grid">
            {servicos.map((servico, index) => (
              <div key={index} className="servico-card">
                <div className="servico-header">
                  <div className="servico-info">
                    <h3>{servico.nome}</h3>
                    <p>{servico.descricao}</p>
                  </div>
                  <div 
                    className="status-indicator"
                    style={{ background: getStatusColor(servico.status) }}
                  >
                    {getStatusIcon(servico.status)}
                  </div>
                </div>
                
                <div className="servico-metricas">
                  <div className="metrica">
                    <span>Disponibilidade:</span>
                    <strong style={{ color: getUptimeColor(servico.uptime) }}>
                      {servico.uptime}
                    </strong>
                  </div>
                  {servico.responseTime !== '--' && (
                    <div className="metrica">
                      <span>Resposta:</span>
                      <strong>{servico.responseTime}</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gráfico de Uptime */}
      <section className="uptime-section">
        <div className="container">
          <h2>Disponibilidade - Últimos 30 Dias</h2>
          
          <div className="uptime-chart">
            <div className="chart-bars">
              {metricas30Dias.map((metrica, index) => (
                <div 
                  key={index}
                  className="chart-bar"
                  style={{ 
                    height: `${metrica.uptime}%`,
                    background: getUptimeColor(metrica.uptime + '%')
                  }}
                  title={`Dia ${metrica.dia}: ${metrica.uptime}%`}
                />
              ))}
            </div>
            
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#4CAF50' }}></div>
                <span>≥ 99.9%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#FF9800' }}></div>
                <span>99.5% - 99.9%</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: '#F44336' }}></div>
                <span>&lt; 99.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Histórico */}
      <section className="historico-section">
        <div className="container">
          <h2>Histórico de Eventos</h2>
          
          <div className="historico-timeline">
            {historico.map((evento, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">
                  {getTipoIcon(evento.tipo)}
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{evento.titulo}</h3>
                    <div className="timeline-meta">
                      <span className="data">{evento.data}</span>
                      {evento.duracao && (
                        <span className="duracao">Duração: {evento.duracao}</span>
                      )}
                    </div>
                  </div>
                  <p>{evento.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="status-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Mantenha-se Informado</h2>
            <p>Receba notificações sobre atualizações e manutenções programadas</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => navigate('/contato')}
              >
                Reportar Problema
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.open('https://twitter.com/turvia', '_blank')}
              >
                Seguir no Twitter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
