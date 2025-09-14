import React, { useState, useEffect, useMemo, useContext } from 'react';
import { 
  collection, 
  query, 
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../context/AuthContext';
import TurviaSemFundoLogo from '../../assets/turviaSemFundo.png';
import { 
  FaUsers, 
  FaChartLine, 
  FaEnvelope, 
  FaWhatsapp,
  FaCalendarAlt,
  FaArrowUp,
  FaStar,
  FaBuilding,
  FaDownload,
  FaEye,
  FaSignOutAlt
} from 'react-icons/fa';
import './ContactsDashboard.css';

const ContactsDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const leadsQuery = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(leadsQuery, 
      (querySnapshot) => {
        const leadsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        setLeads(leadsData);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar leads:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtrar leads por período
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'hoje':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'mes':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'trimestre':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'ano':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return leads;
    }
    
    return leads.filter(lead => lead.createdAt >= startDate);
  }, [leads, selectedPeriod]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    return {
      total: filteredLeads.length,
      novos: filteredLeads.filter(lead => lead.status === 'novo').length,
      contato: filteredLeads.filter(lead => lead.status === 'contato').length,
      convertidos: filteredLeads.filter(lead => lead.status === 'convertido').length,
      perdidos: filteredLeads.filter(lead => lead.status === 'perdido').length
    };
  }, [filteredLeads]);

  // Análise por planos
  const planStats = useMemo(() => {
    const planCount = {};
    filteredLeads.forEach(lead => {
      const plan = lead.plan || 'nao_informado';
      planCount[plan] = (planCount[plan] || 0) + 1;
    });
    return planCount;
  }, [filteredLeads]);

  // Taxa de conversão
  const conversionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return ((stats.convertidos / stats.total) * 100).toFixed(1);
  }, [stats]);

  // Leads por dia (últimos 7 dias)
  const leadsByDay = useMemo(() => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const count = leads.filter(lead => 
        lead.createdAt >= date && lead.createdAt < nextDay
      ).length;
      
      last7Days.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
        count
      });
    }
    
    return last7Days;
  }, [leads]);

  const getPlanName = (plan) => {
    switch (plan) {
      case 'basico': return 'Básico';
      case 'completo': return 'Completo';
      case 'enterprise': return 'Enterprise';
      default: return 'Não informado';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Em Contato';
      case 'convertido': return 'Convertido';
      case 'perdido': return 'Perdido';
      default: return 'Não informado';
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Empresa', 'Plano', 'Status', 'Data'];
    const csvData = filteredLeads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.whatsapp || '',
      lead.company || '',
      getPlanName(lead.plan),
      getStatusLabel(lead.status),
      lead.createdAt.toLocaleDateString('pt-BR')
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contatos_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="contacts-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <img src={TurviaSemFundoLogo} alt="Turvia Logo" className="dashboard-logo" />
            <div className="header-text">
              <h1>Dashboard de Contatos</h1>
              <p>Análise completa dos leads e conversões da Turvia</p>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
            <option value="trimestre">Último trimestre</option>
            <option value="ano">Último ano</option>
            <option value="todos">Todos os períodos</option>
          </select>
          
          <button onClick={exportToCSV} className="export-btn">
            <FaDownload /> Exportar
          </button>
          
          <button onClick={logout} className="logout-btn">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total de Contatos</p>
          </div>
        </div>

        <div className="stat-card novo">
          <div className="stat-icon">
            <FaEnvelope />
          </div>
          <div className="stat-content">
            <h3>{stats.novos}</h3>
            <p>Novos Leads</p>
          </div>
        </div>

        <div className="stat-card contato">
          <div className="stat-icon">
            <FaWhatsapp />
          </div>
          <div className="stat-content">
            <h3>{stats.contato}</h3>
            <p>Em Contato</p>
          </div>
        </div>

        <div className="stat-card convertido">
          <div className="stat-icon">
            <FaArrowUp />
          </div>
          <div className="stat-content">
            <h3>{stats.convertidos}</h3>
            <p>Convertidos</p>
          </div>
        </div>

        <div className="stat-card conversion">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{conversionRate}%</h3>
            <p>Taxa de Conversão</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Leads por dia */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaCalendarAlt /> Leads por Dia (Últimos 7 dias)</h3>
          </div>
          <div className="chart-content">
            <div className="bar-chart">
              {leadsByDay.map((day, index) => (
                <div key={index} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${Math.max(day.count * 20, 5)}px`,
                      backgroundColor: day.count > 0 ? 'var(--primary-blue)' : 'var(--gray-200)'
                    }}
                  ></div>
                  <span className="bar-label">{day.date}</span>
                  <span className="bar-value">{day.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planos mais procurados */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaStar /> Planos Mais Procurados</h3>
          </div>
          <div className="chart-content">
            <div className="plan-stats">
              {Object.entries(planStats)
                .sort(([,a], [,b]) => b - a)
                .map(([plan, count]) => (
                <div key={plan} className="plan-item">
                  <div className="plan-info">
                    <span className="plan-name">{getPlanName(plan)}</span>
                    <span className="plan-count">{count} leads</span>
                  </div>
                  <div className="plan-bar">
                    <div 
                      className="plan-progress"
                      style={{ 
                        width: `${(count / stats.total) * 100}%`,
                        backgroundColor: 
                          plan === 'completo' ? '#10b981' :
                          plan === 'enterprise' ? '#8b5cf6' :
                          plan === 'basico' ? '#3b82f6' : '#6b7280'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="recent-leads">
        <div className="table-header">
          <h3>Contatos Recentes ({selectedPeriod})</h3>
        </div>
        
        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Empresa</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.slice(0, 10).map((lead) => (
                <tr key={lead.id}>
                  <td className="lead-name">
                    <strong>{lead.name}</strong>
                  </td>
                  <td className="lead-contact">
                    <div className="contact-info">
                      <div><FaEnvelope /> {lead.email}</div>
                      <div><FaWhatsapp /> {lead.whatsapp}</div>
                    </div>
                  </td>
                  <td className="lead-company">
                    {lead.company && (
                      <div><FaBuilding /> {lead.company}</div>
                    )}
                  </td>
                  <td className="lead-plan">
                    <span className={`plan-badge ${lead.plan}`}>
                      {getPlanName(lead.plan)}
                    </span>
                  </td>
                  <td className="lead-status">
                    <span className={`status-badge ${lead.status}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="lead-date">
                    {lead.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="lead-actions">
                    <button
                      className="action-btn view"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsModalOpen(true);
                      }}
                      title="Ver detalhes"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="no-data">
              <p>Nenhum contato encontrado no período selecionado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedLead && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Contato</h2>
              <button 
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="contact-details">
                <div className="detail-section">
                  <h3>Informações Pessoais</h3>
                  <div className="detail-item">
                    <strong>Nome:</strong> {selectedLead.name}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedLead.email}
                  </div>
                  <div className="detail-item">
                    <strong>WhatsApp:</strong> {selectedLead.whatsapp}
                  </div>
                  {selectedLead.company && (
                    <div className="detail-item">
                      <strong>Empresa:</strong> {selectedLead.company}
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Informações do Negócio</h3>
                  <div className="detail-item">
                    <strong>Plano:</strong> {getPlanName(selectedLead.plan)}
                  </div>
                  {selectedLead.employees && (
                    <div className="detail-item">
                      <strong>Funcionários:</strong> {selectedLead.employees}
                    </div>
                  )}
                  {selectedLead.currentSystem && (
                    <div className="detail-item">
                      <strong>Sistema Atual:</strong> {selectedLead.currentSystem}
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Status e Data</h3>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${selectedLead.status}`}>
                      {getStatusLabel(selectedLead.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Data:</strong> {selectedLead.createdAt.toLocaleString('pt-BR')}
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="detail-section full-width">
                    <h3>Mensagem</h3>
                    <div className="message-content">
                      {selectedLead.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
