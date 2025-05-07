import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { db } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const CreateStore = ({ onStoreCreated }) => {
  const [nomeLoja, setNomeLoja] = useState('');
  const [segmento, setSegmento] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [plano, setPlano] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) setLogoUrl(data.secure_url);
      else throw new Error('Erro ao obter URL da imagem.');
    } catch (err) {
      setErrorMsg('Erro ao enviar imagem.');
    }
  };

  const handleCreateStore = async () => {
    setErrorMsg('');
    if (!nomeLoja || !segmento || !logoUrl || !plano) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    const agora = new Date();
    const expiracaoDate = new Date();
    expiracaoDate.setDate(expiracaoDate.getDate() + 7);

    const lojaData = {
      nome: nomeLoja,
      segmento,
      logoUrl,
      plano,
      donoUid: user.uid,
      status: 'ativa',
      slug: nomeLoja.toLowerCase().replace(/\s+/g, '-'),
      criadaEm: agora.toISOString(),
    };

    const usuarioData = {
      planoAtual: plano,
      dataInicioPlano: agora.toISOString(),
      expiracaoPlano: plano === 'free' ? null : expiracaoDate.toISOString(),
      emTeste: plano !== 'free',
      lojaCriada: true,
      storeCreated: true,
    };

    try {
      // Cria a loja com o ID do usuário
      await setDoc(doc(db, 'lojas', user.uid), lojaData);

      // Atualiza os dados do usuário com o plano e outras infos
      await setDoc(doc(db, 'usuarios', user.uid), usuarioData, { merge: true });

      if (onStoreCreated) onStoreCreated();
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao criar loja:', err);
      setErrorMsg('Erro ao criar loja. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h3 className="mb-3">Criar Loja</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nome da Loja</Form.Label>
          <Form.Control
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            placeholder="Ex: Loja da Maria"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Segmento</Form.Label>
          <Form.Control
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            placeholder="Ex: Roupas, Calçados, Eletrônicos"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Logo</Form.Label>
          <Form.Control type="file" onChange={handleFileUpload} />
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo preview"
              style={{ maxWidth: 200, marginTop: 10, borderRadius: 8 }}
            />
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Plano</Form.Label>
          <Form.Select value={plano} onChange={(e) => setPlano(e.target.value)}>
            <option value="">Selecione</option>
            <option value="free">Free - R$0</option>
            <option value="plus">Plus - R$39,90 (7 dias grátis)</option>
            <option value="premium">Premium - R$99,90 (7 dias grátis)</option>
          </Form.Select>
        </Form.Group>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Button onClick={handleCreateStore} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Criando...
            </>
          ) : (
            'Criar Loja'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateStore;
