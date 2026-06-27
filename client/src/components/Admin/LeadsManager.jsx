import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query, 
  orderBy,
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaWhatsapp, 
  FaEnvelope, 
  FaBuilding, 
  FaUsers,
  FaFilter,
  FaDownload,
  FaSearch,
  FaStar,
  FaCalendarAlt,
  FaPlus,
  FaMoneyBillWave
} from 'react-icons/fa';
import Loading from '../Loading';
import './LeadsManager.css';
import '../Dashboard/Dashboard.premium.css';

const LeadsManager = () => {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' ou 'services'
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'todos',
    plan: 'todos',
    dateRange: 'todos',
    search: ''
  });
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Services state
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    clientName: '',
    serviceName: '',
    description: '',
    chargedAmount: '',
    costAmount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'concluido'
  });

  useEffect(() => {
    // Configurar listener em tempo real para leads
    const leadsQuery = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc')
    );
    
    setLoading(true);
    
    const unsubscribe = onSnapshot(leadsQuery, 
      (querySnapshot) => {
        const leadsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        // Verificar se há novos leads
        if (leads.length > 0 && leadsData.length > leads.length) {
          const newLeads = leadsData.length - leads.length;
          setNewLeadsCount(newLeads);
          
          // Tocar som de notificação se habilitado
          if (soundEnabled) {
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdAjih1fPTfC4GM3Lm');
              audio.volume = 0.3;
              audio.play().catch(e => console.log('Som não pôde ser reproduzido:', e));
            } catch (e) {
              console.log('Erro ao reproduzir som:', e);
            }
          }
          
          // Remover a notificação após 5 segundos
          setTimeout(() => setNewLeadsCount(0), 5000);
        }
        
        setLeads(leadsData);
        setLastUpdate(new Date());
        setLoading(false);
        
        console.log('Leads atualizados em tempo real:', leadsData.length);
      },
      (error) => {
        console.error('Erro no listener de leads:', error);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Load services
  useEffect(() => {
    const servicesQuery = query(
      collection(db, 'services'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(servicesQuery, (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date) : new Date()
      }));
      setServices(servicesList);
    }, (error) => {
      console.error('Erro ao carregar serviços:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  // Calcular estatísticas usando useMemo para melhor performance
  const stats = useMemo(() => {
    return {
      total: filteredLeads.length,
      novo: filteredLeads.filter(lead => lead.status === 'novo').length,
      contato: filteredLeads.filter(lead => lead.status === 'contato').length,
      convertido: filteredLeads.filter(lead => lead.status === 'convertido').length,
      perdido: filteredLeads.filter(lead => lead.status === 'perdido').length
    };
  }, [filteredLeads]);

  const applyFilters = () => {
    let filtered = [...leads];

    // Filtro por status
    if (filters.status !== 'todos') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Filtro por plano
    if (filters.plan !== 'todos') {
      filtered = filtered.filter(lead => lead.plan === filters.plan);
    }

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name?.toLowerCase().includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm) ||
        lead.company?.toLowerCase().includes(searchTerm) ||
        lead.whatsapp?.includes(searchTerm)
      );
    }

    // Filtro por data
    if (filters.dateRange !== 'todos') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case 'hoje':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'semana':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'mes':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'todos') {
        filtered = filtered.filter(lead => lead.createdAt >= startDate);
      }
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // O listener do onSnapshot atualizará automaticamente os leads
      // Atualizar apenas o lead selecionado se estiver aberto
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do lead');
    }
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) return;
    
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      // O listener do onSnapshot atualizará automaticamente os leads
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead');
    }
  };

  const openWhatsApp = (whatsapp, name) => {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = `Olá ${name}, vi seu interesse em nossos serviços. Como posso ajudar?`;
    const url = `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openEmail = (email, name) => {
    const subject = 'Sobre seu interesse em nossos serviços';
    const body = `Olá ${name},\n\nVi seu interesse em nossos serviços e gostaria de conversar com você.\n\nAguardo seu retorno!\n\nAtenciosamente,\nEquipe`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  // Services functions
  const calculateServicesStats = () => {
    const totalServices = services.length;
    const totalRevenue = services.reduce((sum, s) => sum + (parseFloat(s.chargedAmount) || 0), 0);
    const totalCost = services.reduce((sum, s) => sum + (parseFloat(s.costAmount) || 0), 0);
    const totalProfit = totalRevenue - totalCost;

    return { totalServices, totalRevenue, totalCost, totalProfit };
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...serviceFormData,
        chargedAmount: parseFloat(serviceFormData.chargedAmount) || 0,
        costAmount: parseFloat(serviceFormData.costAmount) || 0,
        profit: (parseFloat(serviceFormData.chargedAmount) || 0) - (parseFloat(serviceFormData.costAmount) || 0),
        date: new Date(serviceFormData.date),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), {
          ...serviceData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'services'), serviceData);
      }

      setShowServiceModal(false);
      setEditingService(null);
      resetServiceForm();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço. Tente novamente.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      alert('Erro ao excluir serviço. Tente novamente.');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      clientName: service.clientName,
      serviceName: service.serviceName,
      description: service.description,
      chargedAmount: service.chargedAmount,
      costAmount: service.costAmount,
      date: service.date.toISOString().split('T')[0],
      status: service.status
    });
    setShowServiceModal(true);
  };

  const resetServiceForm = () => {
    setServiceFormData({
      clientName: '',
      serviceName: '',
      description: '',
      chargedAmount: '',
      costAmount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'concluido'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Empresa', 'Plano', 'Funcionários', 'Sistema Atual', 'Status', 'Data'];
    const csvData = filteredLeads.map(lead => [
      lead.name || '',
      lead.email || '',
      lead.whatsapp || '',
      lead.company || '',
      getPlanName(lead.plan),
      lead.employees || '',
      lead.currentSystem || '',
      getStatusLabel(lead.status),
      lead.createdAt.toLocaleDateString('pt-BR')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPlanName = (plan) => {
    switch (plan) {
      case 'basico': return 'Básico - R$ 149/mês';
      case 'completo': return 'Completo - R$ 299/mês';
      case 'enterprise': return 'Enterprise - Sob consulta';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'novo': return '#3b82f6';
      case 'contato': return '#f59e0b';
      case 'convertido': return '#10b981';
      case 'perdido': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="pd-leads-manager">
        <div className="pd-flex pd-flex-center" style={{ minHeight: '50vh' }}>
          <Loading text="Carregando leads..." size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="pd-leads-manager">
      <div className="pd-leads-header">
        <div className="header-title">
          <h1>Gerenciamento</h1>
          <div className="pd-realtime-indicator">
            <div className="pd-pulse-dot"></div>
            <span>Tempo Real</span>
          </div>
          {newLeadsCount > 0 && (
            <div className="pd-new-leads-notification">
              🔔 {newLeadsCount} novo{newLeadsCount > 1 ? 's' : ''} lead{newLeadsCount > 1 ? 's' : ''}!
            </div>
          )}
        </div>
        <div className="leads-actions">
          <div className="pd-last-update">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </div>
          <button 
            className={`pd-sound-toggle ${soundEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Desativar notificações sonoras' : 'Ativar notificações sonoras'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="pd-export-btn" onClick={exportToCSV}>
            <FaDownload /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="pd-tabs pd-mb-4">
        <button 
          className={`pd-tab ${activeTab === 'leads' ? 'pd-tab-active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          📋 Leads
        </button>
        <button 
          className={`pd-tab ${activeTab === 'services' ? 'pd-tab-active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          💰 Serviços
        </button>
      </div>

      {activeTab === 'leads' && (
        <>
          {/* Stats Cards - Leads */}
          <div className="stats-grid">
            <div className="pd-stat-card total">
              <div className="pd-stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.total}</h3>
                <p>Total de Leads</p>
              </div>
            </div>
            <div className="pd-stat-card novo">
              <div className="pd-stat-icon">🆕</div>
              <div className="stat-content">
                <h3>{stats.novo}</h3>
                <p>Novos</p>
              </div>
            </div>
            <div className="pd-stat-card contato">
              <div className="pd-stat-icon">💬</div>
              <div className="stat-content">
                <h3>{stats.contato}</h3>
                <p>Em Contato</p>
              </div>
            </div>
            <div className="pd-stat-card convertido">
              <div className="pd-stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.convertido}</h3>
                <p>Convertidos</p>
              </div>
            </div>
            <div className="pd-stat-card perdido">
              <div className="pd-stat-icon">❌</div>
              <div className="stat-content">
                <h3>{stats.perdido}</h3>
                <p>Perdidos</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="pd-filters-section">
            <div className="filters-grid">
              <div className="pd-filter-group">
                <label>
                  <FaSearch /> Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nome, email, empresa..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              
              <div className="pd-filter-group">
                <label>
                  <FaFilter /> Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="todos">Todos</option>
                  <option value="novo">Novo</option>
                  <option value="contato">Em Contato</option>
                  <option value="convertido">Convertido</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>

              <div className="pd-filter-group">
                <label>
                  <FaStar /> Plano
                </label>
                <select
                  value={filters.plan}
                  onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                >
                  <option value="todos">Todos</option>
                  <option value="basico">Básico</option>
                  <option value="completo">Completo</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="pd-filter-group">
                <label>
                  <FaCalendarAlt /> Período
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                >
                  <option value="todos">Todos</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Última semana</option>
                  <option value="mes">Último mês</option>
                </select>
              </div>
            </div>
          </div>

      {/* Filters */}
      <div className="pd-filters-section">
        <div className="filters-grid">
          <div className="pd-filter-group">
            <label>
              <FaSearch /> Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, email, empresa..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="pd-filter-group">
            <label>
              <FaFilter /> Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="novo">Novo</option>
              <option value="contato">Em Contato</option>
              <option value="convertido">Convertido</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>

          <div className="pd-filter-group">
            <label>
              <FaStar /> Plano
            </label>
            <select
              value={filters.plan}
              onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="basico">Básico</option>
              <option value="completo">Completo</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="pd-filter-group">
            <label>
              <FaCalendarAlt /> Período
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="pd-table-container">
        <table className="pd-table">
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
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="lead-name">
                  <div className="pd-name-cell">
                    <strong>{lead.name}</strong>
                  </div>
                </td>
                <td className="lead-contact">
                  <div className="contact-cell">
                    <div className="pd-contact-item">
                      <FaEnvelope /> {lead.email}
                    </div>
                    <div className="pd-contact-item">
                      <FaWhatsapp /> {lead.whatsapp}
                    </div>
                  </div>
                </td>
                <td className="lead-company">
                  {lead.company && (
                    <div className="pd-company-cell">
                      <FaBuilding /> {lead.company}
                    </div>
                  )}
                </td>
                <td className="lead-plan">
                  <span className="pd-plan-badge">
                    {getPlanName(lead.plan)}
                  </span>
                </td>
                <td className="lead-status">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="pd-status-select"
                    style={{ borderColor: getStatusColor(lead.status) }}
                  >
                    <option value="novo">Novo</option>
                    <option value="contato">Em Contato</option>
                    <option value="convertido">Convertido</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </td>
                <td className="lead-date">
                  <div className="pd-lead-date">
                    {lead.createdAt.toLocaleDateString('pt-BR')}
                    <br />
                    <small>{lead.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
                  </div>
                </td>
                <td className="lead-actions">
                  <div className="action-buttons">
                    <button
                      className="pd-action-btn view"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsModalOpen(true);
                      }}
                      title="Ver detalhes"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="pd-action-btn whatsapp"
                      onClick={() => openWhatsApp(lead.whatsapp, lead.name)}
                      title="Enviar WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>
                    <button
                      className="pd-action-btn email"
                      onClick={() => openEmail(lead.email, lead.name)}
                      title="Enviar Email"
                    >
                      <FaEnvelope />
                    </button>
                    <button
                      className="pd-action-btn delete"
                      onClick={() => deleteLead(lead.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className="pd-no-leads">
            <p>Nenhum lead encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedLead && (
        <div className="pd-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="pd-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Lead</h2>
              <button 
                className="pd-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="lead-details-grid">
                <div className="pd-detail-section">
                  <h3>Informações Pessoais</h3>
                  <div className="pd-detail-item">
                    <strong>Nome:</strong> {selectedLead.name}
                  </div>
                  <div className="pd-detail-item">
                    <strong>Email:</strong> {selectedLead.email}
                  </div>
                  <div className="pd-detail-item">
                    <strong>WhatsApp:</strong> {selectedLead.whatsapp}
                  </div>
                  {selectedLead.company && (
                    <div className="pd-detail-item">
                      <strong>Empresa:</strong> {selectedLead.company}
                    </div>
                  )}
                </div>

                <div className="pd-detail-section">
                  <h3>Informações do Negócio</h3>
                  <div className="pd-detail-item">
                    <strong>Plano de Interesse:</strong> {getPlanName(selectedLead.plan)}
                  </div>
                  {selectedLead.employees && (
                    <div className="pd-detail-item">
                      <strong>Funcionários:</strong> {selectedLead.employees}
                    </div>
                  )}
                  {selectedLead.currentSystem && (
                    <div className="pd-detail-item">
                      <strong>Sistema Atual:</strong> {selectedLead.currentSystem}
                    </div>
                  )}
                </div>

                <div className="pd-detail-section">
                  <h3>Status e Data</h3>
                  <div className="pd-detail-item">
                    <strong>Status:</strong> 
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                    >
                      {getStatusLabel(selectedLead.status)}
                    </span>
                  </div>
                  <div className="pd-detail-item">
                    <strong>Data de Cadastro:</strong> {selectedLead.createdAt.toLocaleString('pt-BR')}
                  </div>
                  {selectedLead.updatedAt && (
                    <div className="pd-detail-item">
                      <strong>Última Atualização:</strong> {selectedLead.updatedAt.toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div className="pd-detail-section full-width">
                    <h3>Mensagem</h3>
                    <div className="pd-message-content">
                      {selectedLead.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="pd-modal-actions">
                <button
                  className="pd-modal-btn whatsapp"
                  onClick={() => openWhatsApp(selectedLead.whatsapp, selectedLead.name)}
                >
                  <FaWhatsapp /> Contatar via WhatsApp
                </button>
                <button
                  className="pd-modal-btn email"
                  onClick={() => openEmail(selectedLead.email, selectedLead.name)}
                >
                  <FaEnvelope /> Enviar Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
