import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Spinner, ToggleButtonGroup, ToggleButton, Alert, Row, Col } from 'react-bootstrap';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { FaGoogle, FaLock } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import './AuthForm.css';

const AuthForm = ({ initialMode = 'login', onLoginSuccess }) => {
  // Use location to get state passed from navigation
  const location = useLocation();
  const { selectedPlan = 'free' } = location.state || {};
  
  const [isRegistering, setIsRegistering] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    // Set initial mode based on props
    setIsRegistering(initialMode === 'signup');
    
    // Check if user login is locked due to too many attempts
    const lockedUntil = localStorage.getItem('authLockUntil');
    if (lockedUntil && new Date(lockedUntil) > new Date()) {
      setIsLocked(true);
      
      // Set timer to unlock
      const timeRemaining = new Date(lockedUntil) - new Date();
      const unlockTimer = setTimeout(() => {
        setIsLocked(false);
        localStorage.removeItem('authLockUntil');
        setLoginAttempts(0);
      }, timeRemaining);
      
      return () => clearTimeout(unlockTimer);
    }
  }, [initialMode]);

  const criarUsuarioNoFirestore = async (user) => {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        nome: user.displayName || '',
        storeCreated: false,
        plano: selectedPlan,
        planoAtual: selectedPlan,
        criadoEm: serverTimestamp(),
        atualizadaEm: serverTimestamp(),
        descontoAplicado: false,
        pagamentoConfirmado: false,
        planoAtivo: false,
        ultimoLogin: serverTimestamp()
      });
      
      // After account creation, redirect to store creation
      navigate('/criar-loja', { 
        state: { selectedPlan } 
      });
    } else {
      // Update lastLogin timestamp for existing users
      await setDoc(userRef, {
        ultimoLogin: serverTimestamp(),
        atualizadaEm: serverTimestamp()
      }, { merge: true });
      
      // For existing users, let onLoginSuccess handle redirection
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (resetPasswordMode) {
      handleResetPassword();
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Check login attempts
        if (loginAttempts >= 5) {
          // Lock login for 15 minutes
          const lockUntil = new Date(new Date().getTime() + 15 * 60000);
          localStorage.setItem('authLockUntil', lockUntil.toISOString());
          setIsLocked(true);
          setError('Muitas tentativas de login. Tente novamente em 15 minutos ou use a recuperação de senha.');
          setLoading(false);
          return;
        }
        
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('authLockUntil');
      }

      await criarUsuarioNoFirestore(userCredential.user);
    } catch (err) {
      console.error('Erro de autenticação:', err);
      
      // Increment login attempts if this is a failed login
      if (!isRegistering) {
        setLoginAttempts(prev => prev + 1);
      }
      
      // Translate common Firebase errors to user-friendly messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas de login. Tente recuperar sua senha.');
      } else {
        setError(err.message);
      }
      
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoadingProvider(true);
    setError('');
    setSuccessMessage('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await criarUsuarioNoFirestore(result.user);
    } catch (err) {
      console.error('Erro de login com Google:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelado. Tente novamente.');
      } else {
        setError('Erro ao fazer login com Google. Tente novamente.');
      }
      setLoadingProvider(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!email) {
      setError('Digite seu email para recuperar a senha.');
      return;
    }
    
    setLoadingReset(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Email de recuperação enviado. Verifique sua caixa de entrada.');
      setResetPasswordMode(false);
      // Reset login attempts after password reset
      setLoginAttempts(0);
      localStorage.removeItem('authLockUntil');
      setIsLocked(false);
    } catch (err) {
      console.error('Erro ao enviar email de recuperação:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Não existe conta com este email.');
      } else {
        setError('Erro ao enviar email de recuperação. Tente novamente.');
      }
    } finally {
      setLoadingReset(false);
    }
  };
  
  const toggleAuthMode = (value) => {
    const isSignup = value === 1;
    setIsRegistering(isSignup);
    setResetPasswordMode(false);
    setError('');
    setSuccessMessage('');
    
    // Update URL without page reload
    navigate(isSignup ? '/signup' : '/login', { 
      state: { selectedPlan },
      replace: true
    });
  };

  return (
    <Container className="auth-container mt-5">
      <div className="auth-card">
        <div className="auth-header text-center">
          <h2 className="mb-4">
            {resetPasswordMode 
              ? 'Recuperar Senha' 
              : isRegistering 
                ? 'Criar Conta' 
                : 'Entrar'
            }
          </h2>

          {!resetPasswordMode && (
            <ToggleButtonGroup
              type="radio"
              name="authType"
              className="auth-toggle mb-4"
              value={isRegistering ? 1 : 0}
              onChange={toggleAuthMode}
            >
              <ToggleButton id="login-toggle" variant="outline-primary" value={0}>
                Entrar
              </ToggleButton>
              <ToggleButton id="register-toggle" variant="outline-success" value={1}>
                Criar Conta
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          
          {isLocked && (
            <Alert variant="warning">
              <Row className="align-items-center">
                <Col xs="auto">
                  <FaLock size={20} />
                </Col>
                <Col>
                  Conta temporariamente bloqueada devido a muitas tentativas de login.
                  Use a recuperação de senha ou tente novamente mais tarde.
                </Col>
              </Row>
            </Alert>
          )}
        </div>

        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </Form.Group>

          {!resetPasswordMode && (
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
              {isRegistering && (
                <Form.Text className="text-muted">
                  A senha deve ter pelo menos 6 caracteres.
                </Form.Text>
              )}
            </Form.Group>
          )}

          <Button
            variant={resetPasswordMode ? "info" : isRegistering ? "success" : "primary"}
            type="submit"
            className="auth-button w-100"
            disabled={loading || loadingReset || (isLocked && !resetPasswordMode)}
          >
            {(loading || loadingReset) ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Carregando...
              </>
            ) : resetPasswordMode 
              ? 'Enviar Email de Recuperação' 
              : isRegistering 
                ? 'Criar Conta' 
                : 'Entrar'
            }
          </Button>
          
          {!resetPasswordMode && !isRegistering && (
            <div className="text-center mt-2">
              <Button 
                variant="link" 
                className="forgot-password-link"
                onClick={() => setResetPasswordMode(true)}
              >
                Esqueceu sua senha?
              </Button>
            </div>
          )}
          
          {resetPasswordMode && (
            <div className="text-center mt-2">
              <Button 
                variant="link" 
                className="back-to-login-link"
                onClick={() => setResetPasswordMode(false)}
              >
                Voltar para o login
              </Button>
            </div>
          )}
        </Form>

        {!resetPasswordMode && (
          <div className="auth-separator">
            <span>ou</span>
          </div>
        )}

        {!resetPasswordMode && (
          <Button
            variant="outline-danger"
            onClick={handleLoginWithGoogle}
            disabled={loadingProvider || isLocked}
            className="google-button w-100"
          >
            <FaGoogle className="me-2" />
            {loadingProvider ? 'Carregando...' : 'Entrar com Google'}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default AuthForm;