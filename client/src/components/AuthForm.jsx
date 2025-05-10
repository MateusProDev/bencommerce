import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Spinner, ToggleButtonGroup, ToggleButton, Alert } from 'react-bootstrap';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Verificamos se o usuário já tem uma loja antes de redirecionar
        checkUserStoreStatus(user);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Verifica se o usuário já tem uma loja criada
  const checkUserStoreStatus = async (user) => {
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        if (userData.storeCreated) {
          navigate('/dashboard');
        } else {
          navigate('/criar-loja');
        }
      } else {
        // Se não existir documento do usuário, redirecionar para criar loja
        navigate('/criar-loja');
      }
    } catch (err) {
      console.error('Erro ao verificar status da loja:', err);
      setError('Erro ao verificar sua conta. Tente novamente.');
    }
  };

  const criarUsuarioNoFirestore = async (user) => {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        nome: user.displayName || '',
        storeCreated: false,
        plano: 'free',
        planoAtual: 'free',
        criadoEm: serverTimestamp(),
        atualizadaEm: serverTimestamp(),
        descontoAplicado: false,
        pagamentoConfirmado: false,
        planoAtivo: false
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      await criarUsuarioNoFirestore(userCredential.user);
      // O redirecionamento será feito pelo useEffect (onAuthStateChanged)
    } catch (err) {
      console.error('Erro de autenticação:', err);
      
      // Traduzir erros comuns do Firebase para mensagens amigáveis
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado. Tente fazer login.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(err.message);
      }
      
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoadingProvider(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await criarUsuarioNoFirestore(result.user);
      // O redirecionamento será feito pelo useEffect (onAuthStateChanged)
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

  if (user) return null;

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-3">
        {isRegistering ? 'Criar Conta' : 'Entrar'}
      </h3>

      <ToggleButtonGroup
        type="radio"
        name="authType"
        className="d-flex justify-content-center mb-4"
        value={isRegistering ? 1 : 0}
        onChange={(val) => setIsRegistering(val === 1)}
      >
        <ToggleButton id="login-toggle" variant="outline-primary" value={0}>
          Entrar
        </ToggleButton>
        <ToggleButton id="register-toggle" variant="outline-success" value={1}>
          Criar Conta
        </ToggleButton>
      </ToggleButtonGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {isRegistering && (
            <Form.Text className="text-muted">
              A senha deve ter pelo menos 6 caracteres.
            </Form.Text>
          )}
        </Form.Group>

        <Button
          variant={isRegistering ? 'success' : 'primary'}
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
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
          ) : isRegistering ? 'Criar Conta' : 'Entrar'}
        </Button>
      </Form>

      <div className="mt-4 text-center">
        <p className="mb-2">ou</p>
        <Button
          variant="outline-danger"
          onClick={handleLoginWithGoogle}
          disabled={loadingProvider}
          className="w-100"
        >
          <FaGoogle className="me-2" />
          {loadingProvider ? 'Carregando...' : 'Entrar com Google'}
        </Button>
      </div>
    </Container>
  );
};

export default AuthForm;