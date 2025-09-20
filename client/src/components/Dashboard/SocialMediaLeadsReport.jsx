import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
  FaInstagram,
  FaFacebook
} from 'react-icons/fa';
import './SocialMediaLeadsReport.css';

const SocialMediaLeadsReport = ({ currentUser }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const leadsQuery = query(
      collection(db, 'social_media_leads'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(leadsQuery, 
      (querySnapshot) => {
        const leadsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        console.log('Leads de redes sociais recebidos:', leadsData);
        
        setLeads(leadsData);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar leads de redes sociais:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

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
      case 'basico': return 'Básico (R$ 99,99)';
      case 'premium': return 'Premium (R$ 197,99)';
      default: return 'Não informado';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Em Contato';
      case 'convertido': return 'Convertido';
      case 'perdido': return 'Perdido';
      default: return 'Novo';
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
    link.download = `leads_redes_sociais_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const openLeadModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeLeadModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando leads de redes sociais...</p>
      </div>
    );
  }

  return (
    <div className="social-leads-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Leads de Redes Sociais</h1>
            <p>Análise completa dos leads do serviço de gestão de redes sociais</p>
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
            <p>Total de Leads</p>
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
                  <span className="bar-count">{day.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads por plano */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaStar /> Leads por Plano</h3>
          </div>
          <div className="chart-content">
            <div className="plan-stats">
              {Object.entries(planStats).map(([plan, count]) => (
                <div key={plan} className="plan-item">
                  <div className="plan-info">
                    <span className="plan-name">{getPlanName(plan)}</span>
                    <span className="plan-count">{count} leads</span>
                  </div>
                  <div 
                    className="plan-bar"
                    style={{
                      width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                      backgroundColor: plan === 'premium' ? '#4a6bff' : '#8892b0'
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="leads-section">
        <div className="section-header">
          <h3><FaBuilding /> Últimos Leads ({filteredLeads.length})</h3>
        </div>
        
        <div className="leads-table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Empresa</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.whatsapp}</td>
                  <td>{lead.company || 'Não informado'}</td>
                  <td>
                    <span className={`plan-badge ${lead.plan}`}>
                      {getPlanName(lead.plan)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${lead.status || 'novo'}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td>{lead.createdAt.toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button 
                      className="action-btn view"
                      onClick={() => openLeadModal(lead)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="empty-state">
              <FaUsers />
              <h3>Nenhum lead encontrado</h3>
              <p>Ainda não há leads de redes sociais para o período selecionado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes do lead */}
      {isModalOpen && selectedLead && (
        <div className="modal-overlay" onClick={closeLeadModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes do Lead</h3>
              <button className="close-btn" onClick={closeLeadModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="lead-details">
                <div className="detail-group">
                  <label>Nome:</label>
                  <span>{selectedLead.name}</span>
                </div>
                <div className="detail-group">
                  <label>Email:</label>
                  <span>{selectedLead.email}</span>
                </div>
                <div className="detail-group">
                  <label>WhatsApp:</label>
                  <span>{selectedLead.whatsapp}</span>
                </div>
                <div className="detail-group">
                  <label>Empresa:</label>
                  <span>{selectedLead.company || 'Não informado'}</span>
                </div>
                <div className="detail-group">
                  <label>Plano Escolhido:</label>
                  <span className={`plan-badge ${selectedLead.plan}`}>
                    {getPlanName(selectedLead.plan)}
                  </span>
                </div>
                <div className="detail-group">
                  <label>Data de Cadastro:</label>
                  <span>{selectedLead.createdAt.toLocaleDateString('pt-BR')} às {selectedLead.createdAt.toLocaleTimeString('pt-BR')}</span>
                </div>
                {selectedLead.message && (
                  <div className="detail-group">
                    <label>Mensagem:</label>
                    <p>{selectedLead.message}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button className="whatsapp-btn" onClick={() => window.open(`https://wa.me/${selectedLead.whatsapp}`, '_blank')}>
                <FaWhatsapp /> Contatar via WhatsApp
              </button>
              <button className="email-btn" onClick={() => window.open(`mailto:${selectedLead.email}`, '_blank')}>
                <FaEnvelope /> Enviar Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaLeadsReport;
