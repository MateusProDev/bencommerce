// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Spinner } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loading from './components/Loading';

// Components
import HomePage from './components/HomePage/HomePage';
import AuthForm from './components/AuthForm/AuthForm';
import CreateStore from './components/CreateStore/CreateStore';
import Dashboard from './components/Dashboard/Dashboard';
import CheckoutRedirect from './components/CheckoutRedirect/CheckoutRedirect';
import CheckoutTransparent from './components/CheckoutTransparent/CheckoutTransparent';
import Lojinha from './components/Lojinha/Lojinha';
import LojinhaPreview from './components/LojinhaPreview/LojinhaPreview';
import CategoriaPage from "./components/Lojinha/CategoriaPage/CategoriaPage";
import ProdutoPage from "./components/Lojinha/ProdutoPage/ProdutoPage";
import ProdutosPage from "./pages/ProdutosPage";
import ContactFunnel from './components/ContactFunnel/ContactFunnel';
import ContactFunnelPage from './components/ContactFunnel/ContactFunnelPage';
import SolucoesPage from './pages/SolucoesPage';
import PlanosPage from './pages/PlanosPage';
import TermosPage from './pages/TermosPage';
import PrivacidadePage from './pages/PrivacidadePage';
import CookiesPage from './pages/CookiesPage';
import LoginForm from './components/Auth/LoginForm';
import ContactsDashboard from './components/Dashboard/ContactsDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import CreateAdmin from './components/Auth/CreateAdmin';
// import CentralAjudaPage from './pages/CentralAjudaPage';
import TutoriaisPage from './pages/TutoriaisPage';
import FAQPage from './pages/FAQPage';
import StatusPage from './pages/StatusPage';
import SobreNosPage from './pages/SobreNosPage';
import BlogPage from './pages/BlogPage';
import ParceiroPage from './pages/ParceiroPage';
import PartnersList from './components/Partners/PartnersList';
import PartnerRedirect from './components/Partners/PartnerRedirect';
import CookieConsent from './components/CookieConsent/CookieConsent';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import LeadsManager from './components/Admin/LeadsManager';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';

// Utils
import { verificarPlanoUsuario } from './utils/verificarPlanoUsuario';

// Context
import { CategoriasProvider } from "./context/CategoriasContext";
import { UserPlanProvider } from "./context/UserPlanContext";
import { AuthProvider } from "./context/AuthContext";

// Rota que requer loja criada
const StoreRequiredRoute = ({ user, hasStore, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return hasStore ? children : <Navigate to="/criar-loja" replace />;
};

function LojinhaPage() {
  const { slug } = useParams();
  const [lojaId, setLojaId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    async function fetchLojaId() {
      const q = query(collection(db, "lojas"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setLojaId(snap.docs[0].id);
      }
      setLoading(false);
    }
    fetchLojaId();
  }, [slug]);

  if (loading) return <Loading text="Carregando loja..." size="large" />;
  if (!lojaId) return <div>Loja não encontrada.</div>;
  return <Lojinha lojaId={lojaId} />;
}

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(false); // Removido loading inicial
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Verifica plano do usuário
        await verificarPlanoUsuario(currentUser.uid);

        // Verifica se o usuário tem uma loja
        const [userSnap, storeSnap] = await Promise.all([
          getDoc(doc(db, 'usuarios', currentUser.uid)),
          getDoc(doc(db, 'lojas', currentUser.uid))
        ]);

        const userData = userSnap.exists() ? userSnap.data() : {};
        const storeExists = storeSnap.exists();

        // Define se o usuário tem loja criada
        setHasStore(!!(userData.storeCreated || storeExists));
      } else {
        setHasStore(false);
      }

      setLoading(false);
    });

    // Limpa a assinatura
    return () => unsubscribe();
  }, [auth]);

  // Mostra um spinner enquanto verifica o status de autenticação
  if (loading) {
    return (
      <div className="loading-overlay">
        <Loading text="Inicializando aplicação..." size="large" />
      </div>
    );
  }

  return (
    <UserPlanProvider>
      <CookieConsent />
      <Routes location={location}>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/solucoes" element={<SolucoesPage />} />
        <Route path="/planos" element={<PlanosPage />} />
  <Route path="/contato" element={<ContactFunnelPage />} />
  <Route path="/contato/:plan" element={<ContactFunnelPage />} />
  {/* Static legal pages */}
  <Route path="/termos" element={<TermosPage />} />
  <Route path="/privacidade" element={<PrivacidadePage />} />
  <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/tutoriais" element={<TutoriaisPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/sobre" element={<SobreNosPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/parceiro" element={<ParceiroPage />} />
        <Route path="/parceiros" element={<PartnersList />} />
        <Route path="/parceiros/:id" element={<PartnerRedirect />} />

        {/* Rotas de autenticação */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ContactsDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Rotas administrativas */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/leads" 
          element={
            <AdminProtectedRoute>
              <LeadsManager />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <ContactsDashboard />
            </AdminProtectedRoute>
          } 
        />

        {/* Rotas de autenticação */}
        <Route
          path="/login"
          element={
            !user ? (
              <AuthForm
                initialMode="login"
                onLoginSuccess={() => navigate(hasStore ? '/dashboard' : '/criar-loja', { replace: true })}
              />
            ) : (
              <Navigate to={hasStore ? '/dashboard' : '/criar-loja'} replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !user ? (
              <AuthForm
                initialMode="signup"
                onLoginSuccess={() => navigate(hasStore ? '/dashboard' : '/criar-loja', { replace: true })}
              />
            ) : (
              <Navigate to={hasStore ? '/dashboard' : '/criar-loja'} replace />
            )
          }
        />
        {/* Mantém /auth para compatibilidade com versões anteriores */}
        <Route
          path="/auth"
          element={
            !user ? (
              <AuthForm
                initialMode={location.state?.authMode || 'login'}
                onLoginSuccess={() => navigate(hasStore ? '/dashboard' : '/criar-loja', { replace: true })}
              />
            ) : (
              <Navigate to={hasStore ? '/dashboard' : '/criar-loja'} replace />
            )
          }
        />

        {/* Loja do usuário */}
        <Route
          path="/:slug"
          element={
            <LojinhaPage />
          }
        />
        <Route path="/:slug/categoria/:categoria" element={<CategoriaPage />} />
        <Route path="/:slug/produto/:produtoSlug" element={<ProdutoPage />} />

        {/* Rotas protegidas que requerem apenas autenticação */}
        <Route
          path="/criar-loja"
          element={
            <ProtectedRoute user={user}>
              <CreateStore onStoreCreated={() => setHasStore(true)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute user={user}>
              <CheckoutRedirect currentUser={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute user={user}>
              <CheckoutTransparent currentUser={user} />
            </ProtectedRoute>
          }
        />

        {/* Rotas protegidas que requerem autenticação e uma loja */}
        <Route
          path="/dashboard"
          element={
            <StoreRequiredRoute user={user} hasStore={hasStore}>
              <CategoriasProvider lojaId={user?.uid}>
                <Dashboard user={user} />
              </CategoriasProvider>
            </StoreRequiredRoute>
          }
        />
        <Route
          path="/minha-loja"
          element={
            <StoreRequiredRoute user={user} hasStore={hasStore}>
              <LojinhaPreview user={user} />
            </StoreRequiredRoute>
          }
        />
        <Route
          path="/dashboard/produtos"
          element={
            <StoreRequiredRoute user={user} hasStore={hasStore}>
              <ProdutosPage lojaId={user?.uid} />
            </StoreRequiredRoute>
          }
        />

        {/* Rota para todos os outros casos */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserPlanProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;