import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { setupInitialAdmin } from '../../utils/setupAdmin';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from '../Loading';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Função para verificar se o email é admin no Firestore
  const checkIfEmailIsAdmin = async (email) => {
    try {
      const adminQuery = query(
        collection(db, 'admin_emails'), 
        where('email', '==', email.toLowerCase()),
        where('active', '==', true)
      );
      
      const querySnapshot = await getDocs(adminQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar email admin:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Debug: mostrar email sendo verificado
      console.log('Email tentando login:', email.toLowerCase());
      
      // Verificar se o email é admin no Firestore
      const isEmailAdmin = await checkIfEmailIsAdmin(email);
      
      if (!isEmailAdmin) {
        setError(`Acesso negado. Email '${email}' não tem permissões administrativas.`);
        setLoading(false);
        return;
      }

      // Fazer login no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Login bem-sucedido para:', user.email);
      
      // Para admins, não precisamos verificar se existe no Firestore
      // A verificação de email já foi feita acima
      
      // Login bem-sucedido, redirecionar para o painel admin
      navigate('/admin/leads');
      
    } catch (err) {
      console.error('Erro no login admin:', err);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Email não encontrado.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas de login. Tente novamente mais tarde.');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para configurar admins iniciais
  const handleSetupAdmins = async () => {
    setSetupLoading(true);
    try {
      const result = await setupInitialAdmin('admin123');
      if (result.success) {
        alert(`Admins configurados com sucesso!\n\nFirestore:\n- Adicionados: ${result.addedCount}\n- Já existiam: ${result.existingCount}\n\nFirebase Auth:\n- Usuários criados: ${result.userCreatedCount}\n\nAgora você pode fazer login com:\nEmail: mateusprodev@gmail.com\nSenha: admin123`);
      }
    } catch (error) {
      console.error('Erro ao configurar admins:', error);
      alert(`Erro ao configurar admins:\n\n${error.message}\n\nEm desenvolvimento local, configure as variáveis de ambiente REACT_APP_FIREBASE_* ou use a versão de produção.`);
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-background">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo">
              <div className="logo-icon">🔐</div>
              <h1>Admin Panel</h1>
            </div>
            <p>Acesso restrito ao painel administrativo</p>
          </div>

          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="email">Email Administrativo</label>
              <div className="admin-input-wrapper">
                <FaUser className="admin-input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email de admin"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="password">Senha</label>
              <div className="admin-input-wrapper">
                <FaLock className="admin-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? (
                <Loading text="" size="small" />
              ) : (
                'Acessar Painel Admin'
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>⚠️ Área restrita aos administradores do sistema</p>
            
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button 
                type="button"
                className="back-to-site-button"
                onClick={() => navigate('/')}
              >
                ← Voltar ao site
              </button>
              
              <button 
                type="button"
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
                onClick={handleSetupAdmins}
                disabled={setupLoading}
              >
                {setupLoading ? 'Configurando...' : '🔧 Configurar Admins Iniciais'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
