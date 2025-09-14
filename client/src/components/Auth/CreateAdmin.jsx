import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { FaUserShield, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './CreateAdmin.css';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    email: 'admin@turvia.com',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess(true);
      console.log('✅ Usuário administrativo criado com sucesso!');
      console.log('📧 Email:', formData.email);
      console.log('🔑 Senha:', formData.password);
      console.log('🎯 Agora você pode fazer login em /login');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      let errorMessage = 'Erro ao criar usuário administrativo.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está sendo usado. Usuário já existe!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
          break;
        default:
          errorMessage = 'Erro ao criar usuário: ' + error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="create-admin-container">
        <div className="create-admin-card success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Usuário Criado!</h1>
          <p>O usuário administrativo foi criado com sucesso.</p>
          <div className="credentials">
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Senha:</strong> {'•'.repeat(formData.password.length)}</p>
          </div>
          <div className="next-steps">
            <h3>Próximos passos:</h3>
            <ol>
              <li>Anote suas credenciais em um local seguro</li>
              <li>Acesse <a href="/login">/login</a> para entrar no sistema</li>
              <li>Altere a senha após o primeiro login</li>
            </ol>
          </div>
          <a href="/login" className="login-link">
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="create-admin-container">
      <div className="create-admin-card">
        <div className="admin-header">
          <div className="admin-icon">
            <FaUserShield />
          </div>
          <h1>Criar Usuário Administrativo</h1>
          <p>Configure o primeiro usuário para acessar o dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email do Administrador</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="admin@turvia.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha (mínimo 6 caracteres)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Digite uma senha forte"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="create-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="loading-spinner" />
                Criando usuário...
              </>
            ) : (
              <>
                <FaUserShield />
                Criar Administrador
              </>
            )}
          </button>
        </form>

        <div className="warning-message">
          <p><strong>⚠️ Importante:</strong></p>
          <ul>
            <li>Este usuário terá acesso completo ao dashboard</li>
            <li>Anote a senha em local seguro</li>
            <li>Use apenas uma vez para criar o primeiro admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
