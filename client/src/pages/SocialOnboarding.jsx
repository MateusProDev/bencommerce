import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './SocialOnboarding.css';

const SocialOnboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    instagram: '',
    facebook: '',
    objectives: '',
    audience: '',
    postingFrequency: '',
    monthlyAdBudget: '',
    brandAssetsLink: '',
    accessCredentials: '',
    additionalNotes: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.agencyName || !form.contactName || !form.email) {
      setError('Preencha ao menos nome da agência, contato e email.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        createdAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(db, 'socialMediaOnboardings'), payload);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao enviar onboarding:', err);
      setError('Erro ao enviar. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page container">
      <h1>Solicitar Gerenciamento de Redes — Informações Iniciais</h1>
      <p>Preencha as informações abaixo para iniciarmos suas campanhas e assumir o gerenciamento das redes sociais.</p>

      {success ? (
        <div className="onboarding-success">
          <h3>Obrigado — recebemos suas informações!</h3>
          <p>Um membro da nossa equipe entrará em contato em breve. Você pode acompanhar tudo no painel.</p>
          <button onClick={() => navigate('/dashboard')}>Ir para o Painel</button>
        </div>
      ) : (
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Nome da Agência *</label>
            <input name="agencyName" value={form.agencyName} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Nome do Contato *</label>
            <input name="contactName" value={form.contactName} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Telefone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Instagram (handle)</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Facebook (página)</label>
            <input name="facebook" value={form.facebook} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Objetivos da Campanha</label>
            <textarea name="objectives" value={form.objectives} onChange={handleChange} rows={4} />
          </div>

          <div className="form-row">
            <label>Público-alvo</label>
            <input name="audience" value={form.audience} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Frequência de Publicação Preferida</label>
            <input name="postingFrequency" value={form.postingFrequency} onChange={handleChange} placeholder="e.g. 3 posts/semana" />
          </div>

          <div className="form-row">
            <label>Orçamento mensal para anúncios (R$)</label>
            <input name="monthlyAdBudget" value={form.monthlyAdBudget} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Link para Brand Assets (Google Drive / Dropbox)</label>
            <input name="brandAssetsLink" value={form.brandAssetsLink} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Temos acesso às contas? (informe credenciais ou descreva o acesso)</label>
            <textarea name="accessCredentials" value={form.accessCredentials} onChange={handleChange} rows={3} />
          </div>

          <div className="form-row">
            <label>Observações adicionais</label>
            <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={3} />
          </div>

          <div className="form-row checkbox-row">
            <label>
              <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} />
              {' '}Eu autorizo a equipe a acessar e gerenciar as contas indicadas (LGPD compliant)
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Informações'}</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SocialOnboarding;
