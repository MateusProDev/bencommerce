import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import TurviaLogo from '../../assets/Turvia.png';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

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

    try {
      if (isRegisterMode) {
        // Validação para cadastro
        if (formData.password !== formData.confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          setLoading(false);
          return;
        }

        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/dashboard');
      } else {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      
      let errorMessage = 'Erro na operação. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Usuário desativado.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está sendo usado.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = isRegisterMode ? 
            'Erro ao criar conta. Verifique os dados.' : 
            'Erro ao fazer login. Verifique suas credenciais.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={TurviaLogo} alt="Turvia Logo" className="login-logo" />
          <h1>Turvia Dashboard</h1>
          <p>{isRegisterMode ? 'Criar conta administrativa' : 'Acesso administrativo'}</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegisterMode ? 'active' : ''}`}
            onClick={() => {
              setIsRegisterMode(false);
              setFormData({ email: '', password: '', confirmPassword: '' });
              setError('');
            }}
            disabled={loading}
          >
            <FaSignInAlt /> Entrar
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegisterMode ? 'active' : ''}`}
            onClick={() => {
              setIsRegisterMode(true);
              setFormData({ email: '', password: '', confirmPassword: '' });
              setError('');
            }}
            disabled={loading}
          >
            <FaUserPlus /> Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">{isRegisterMode ? 'Senha' : 'Senha'}</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="••••••••"
                minLength={isRegisterMode ? 6 : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="loading-spinner" />
                {isRegisterMode ? 'Criando conta...' : 'Entrando...'}
              </>
            ) : (
              <>
                {isRegisterMode ? <FaUserPlus /> : <FaSignInAlt />}
                {isRegisterMode ? 'Criar Conta' : 'Entrar'}
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Sistema administrativo Turvia</p>
          <small>© 2025 Turvia. Todos os direitos reservados.</small>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
