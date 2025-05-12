import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Spinner } from 'react-bootstrap';

// Components
import HomePage from './components/HomePage/HomePage';
import AuthForm from './components/AuthForm/AuthForm';
import CreateStore from './components/CreateStore/CreateStore';
import Dashboard from './components/Dashboard/Dashboard';
import CheckoutRedirect from './components/CheckoutRedirect/CheckoutRedirect';
import CheckoutTransparent from './components/CheckoutTransparent/CheckoutTransparent';
import Lojinha from './components/Lojinha/Lojinha';
import LojinhaPreview from './components/LojinhaPreview/LojinhaPreview';

// Utils
import { verificarPlanoUsuario } from './utils/verificarPlanoUsuario';

/**
 * Protected route component - redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * Store required route - redirects to store creation if user doesn't have a store
 */
const StoreRequiredRoute = ({ user, hasStore, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return hasStore ? children : <Navigate to="/criar-loja" replace />;
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Verify user's subscription plan
        await verificarPlanoUsuario(currentUser.uid);

        // Check if user has a store by checking both documents
        const [userSnap, storeSnap] = await Promise.all([
          getDoc(doc(db, 'usuarios', currentUser.uid)),
          getDoc(doc(db, 'lojas', currentUser.uid))
        ]);

        const userData = userSnap.exists() ? userSnap.data() : {};
        const storeExists = storeSnap.exists();

        // User has a store if either flag is set or store document exists
        setHasStore(!!(userData.storeCreated || storeExists));
      } else {
        setHasStore(false);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth]);

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Routes location={location}>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Authentication routes - both /login and /auth should work */}
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
      
      {/* Keep /auth for backward compatibility */}
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
      
      <Route path="/loja/:storeId" element={<Lojinha />} />

      {/* Protected routes that only require authentication */}
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

      {/* Protected routes that require both authentication and a store */}
      <Route
        path="/dashboard"
        element={
          <StoreRequiredRoute user={user} hasStore={hasStore}>
            <Dashboard user={user} />
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

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;