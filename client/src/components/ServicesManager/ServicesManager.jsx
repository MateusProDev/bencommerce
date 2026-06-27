import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FaPlus, FaTrash, FaEdit, FaMoneyBillWave, FaDollarSign, FaChartLine } from 'react-icons/fa';
import '../Dashboard/Dashboard.premium.css';
import './ServicesManager.css';

const ServicesManager = ({ currentUser }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    serviceName: '',
    description: '',
    chargedAmount: '',
    costAmount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'concluido'
  });

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, `usuarios/${currentUser.uid}/services`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date) : new Date()
      }));
      setServices(servicesList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar serviços:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const calculateStats = () => {
    const totalServices = services.length;
    const totalRevenue = services.reduce((sum, s) => sum + (parseFloat(s.chargedAmount) || 0), 0);
    const totalCost = services.reduce((sum, s) => sum + (parseFloat(s.costAmount) || 0), 0);
    const totalProfit = totalRevenue - totalCost;

    return { totalServices, totalRevenue, totalCost, totalProfit };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...formData,
        chargedAmount: parseFloat(formData.chargedAmount) || 0,
        costAmount: parseFloat(formData.costAmount) || 0,
        profit: (parseFloat(formData.chargedAmount) || 0) - (parseFloat(formData.costAmount) || 0),
        date: new Date(formData.date),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingService) {
        await updateDoc(doc(db, `usuarios/${currentUser.uid}/services`, editingService.id), {
          ...serviceData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, `usuarios/${currentUser.uid}/services`), serviceData);
      }

      setShowModal(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço. Tente novamente.');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await deleteDoc(doc(db, `usuarios/${currentUser.uid}/services`, serviceId));
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      alert('Erro ao excluir serviço. Tente novamente.');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      clientName: service.clientName,
      serviceName: service.serviceName,
      description: service.description,
      chargedAmount: service.chargedAmount,
      costAmount: service.costAmount,
      date: service.date.toISOString().split('T')[0],
      status: service.status
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
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

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="pd-main-content">
        <div className="pd-flex pd-flex-center" style={{ minHeight: '50vh' }}>
          <p>Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-main-content">
      {/* Header */}
      <div className="pd-header">
        <h1 className="pd-header-title">Gerenciamento de Serviços</h1>
        <p className="pd-header-subtitle">Controle seus serviços, clientes e lucros</p>
      </div>

      {/* Stats Cards */}
      <div className="pd-cards-grid">
        <div className="pd-card pd-card-purple">
          <div className="pd-card-icon">📋</div>
          <h3 className="pd-card-title">Total de Serviços</h3>
          <div className="pd-card-value">{stats.totalServices}</div>
          <p className="pd-card-label">Serviços registrados</p>
        </div>

        <div className="pd-card pd-card-green">
          <div className="pd-card-icon">💰</div>
          <h3 className="pd-card-title">Receita Total</h3>
          <div className="pd-card-value">{formatCurrency(stats.totalRevenue)}</div>
          <p className="pd-card-label">Valor total cobrado</p>
        </div>

        <div className="pd-card pd-card-orange">
          <div className="pd-card-icon">💸</div>
          <h3 className="pd-card-title">Custo Total</h3>
          <div className="pd-card-value">{formatCurrency(stats.totalCost)}</div>
          <p className="pd-card-label">Valor total de custos</p>
        </div>

        <div className="pd-card pd-card-cyan">
          <div className="pd-card-icon">📈</div>
          <h3 className="pd-card-title">Lucro Total</h3>
          <div className="pd-card-value">{formatCurrency(stats.totalProfit)}</div>
          <p className="pd-card-label">Receita - Custo</p>
        </div>
      </div>

      {/* Add Service Button */}
      <div className="pd-mt-4">
        <button className="pd-btn pd-btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Adicionar Serviço
        </button>
      </div>

      {/* Services Table */}
      <div className="pd-table-container pd-mt-4">
        <table className="pd-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Valor Cobrado</th>
              <th>Custo</th>
              <th>Lucro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="pd-name-cell">
                  <strong>{service.clientName}</strong>
                </td>
                <td>{service.serviceName}</td>
                <td className="pd-lead-date">
                  {service.date.toLocaleDateString('pt-BR')}
                </td>
                <td className="pd-text-success" style={{ fontWeight: '700' }}>
                  {formatCurrency(service.chargedAmount)}
                </td>
                <td className="pd-text-secondary">
                  {formatCurrency(service.costAmount)}
                </td>
                <td className={service.profit >= 0 ? 'pd-text-success' : 'pd-text-danger'} style={{ fontWeight: '700' }}>
                  {formatCurrency(service.profit)}
                </td>
                <td>
                  <span className={`pd-badge ${service.status === 'concluido' ? 'pd-badge-green' : 'pd-badge-orange'}`}>
                    {service.status === 'concluido' ? 'Concluído' : 'Pendente'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="pd-action-btn view"
                      onClick={() => handleEdit(service)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="pd-action-btn delete"
                      onClick={() => handleDelete(service.id)}
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

        {services.length === 0 && (
          <div className="pd-no-leads">
            <p>Nenhum serviço registrado ainda.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="pd-modal-overlay" onClick={() => {
          setShowModal(false);
          setEditingService(null);
          resetForm();
        }}>
          <div className="pd-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
              <button 
                className="pd-modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingService(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="pd-detail-section pd-mb-3">
                  <h3>Informações do Serviço</h3>
                  
                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Nome do Cliente:</strong>
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="pd-input"
                      required
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Nome do Serviço:</strong>
                    </label>
                    <input
                      type="text"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      className="pd-input"
                      required
                      placeholder="Ex: Desenvolvimento de Site"
                    />
                  </div>

                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Descrição:</strong>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="pd-input"
                      rows="3"
                      placeholder="Detalhes do serviço..."
                    />
                  </div>

                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Data:</strong>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pd-input"
                      required
                    />
                  </div>
                </div>

                <div className="pd-detail-section pd-mb-3">
                  <h3>Valores</h3>
                  
                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Valor Cobrado (R$):</strong>
                    </label>
                    <input
                      type="number"
                      name="chargedAmount"
                      value={formData.chargedAmount}
                      onChange={handleInputChange}
                      className="pd-input"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Custo (R$):</strong>
                    </label>
                    <input
                      type="number"
                      name="costAmount"
                      value={formData.costAmount}
                      onChange={handleInputChange}
                      className="pd-input"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Lucro Estimado:</strong>
                    </label>
                    <div className="pd-card-value" style={{ fontSize: '1.5rem' }}>
                      {formatCurrency((parseFloat(formData.chargedAmount) || 0) - (parseFloat(formData.costAmount) || 0))}
                    </div>
                  </div>
                </div>

                <div className="pd-detail-section pd-mb-3">
                  <h3>Status</h3>
                  
                  <div className="pd-detail-item">
                    <label className="pd-filter-group label">
                      <strong>Status do Serviço:</strong>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="pd-select"
                    >
                      <option value="concluido">Concluído</option>
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                    </select>
                  </div>
                </div>

                <div className="pd-modal-actions">
                  <button type="button" className="pd-btn pd-btn-secondary" onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    resetForm();
                  }}>
                    Cancelar
                  </button>
                  <button type="submit" className="pd-btn pd-btn-primary">
                    {editingService ? 'Atualizar' : 'Salvar'} Serviço
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
