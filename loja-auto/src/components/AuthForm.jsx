import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Spinner, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
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

// Firebase Firestore
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // ajuste esse caminho se necessário

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
        navigate('/dashboard');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const criarUsuarioNoFirestore = async (user) => {
    const userRef = doc(db, 'usuarios', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        nome: '', // pode ser preenchido depois
        lojaCriada: false,
        plano: 'free',
        criadoEm: serverTimestamp()
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoadingProvider(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await criarUsuarioNoFirestore(result.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
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

      {error && <div className="alert alert-danger">{error}</div>}

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
          />
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
        <Button
          variant="outline-danger"
          onClick={handleLoginWithGoogle}
          disabled={loadingProvider}
        >
          <FaGoogle className="me-2" />
          {loadingProvider ? 'Carregando...' : 'Entrar com Google'}
        </Button>
      </div>
    </Container>
  );
};

export default AuthForm;
