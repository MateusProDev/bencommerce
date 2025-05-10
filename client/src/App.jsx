import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import HomePage from './components/HomePage/HomePage';
import AuthForm from './components/AuthForm';
import CreateStore from './components/CreateStore/CreateStore';
import Dashboard from './components/Dashboard/Dashboard';
import CheckoutRedirect from './components/CheckoutRedirect/CheckoutRedirect';
import CheckoutTransparent from './components/CheckoutTransparent/CheckoutTransparent';
import { verificarPlanoUsuario } from './utils/verificarPlanoUsuario';

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const StoreRequiredRoute = ({ user, hasStore, children }) => {
  if (!user) return <Navigate to="/login" />;
  return hasStore ? children : <Navigate to="/criar-loja" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Verifica plano do usuário
        await verificarPlanoUsuario(user.uid);
        
        // Verifica se tem loja
        const [userSnap, storeSnap] = await Promise.all([
          getDoc(doc(db, 'usuarios', user.uid)),
          getDoc(doc(db, 'lojas', user.uid))
        ]);
        
        const userData = userSnap.exists() ? userSnap.data() : {};
        const storeExists = storeSnap.exists();
        
        setHasStore(!!(userData.storeCreated || storeExists));
      } else {
        setHasStore(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <AuthForm /> : <Navigate to="/dashboard" />} />
        
        <Route path="/criar-loja" element={
          <ProtectedRoute user={user}>
            <CreateStore onStoreCreated={() => setHasStore(true)} />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <StoreRequiredRoute user={user} hasStore={hasStore}>
            <Dashboard />
          </StoreRequiredRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute user={user}>
            <CheckoutRedirect currentUser={user} />
          </ProtectedRoute>
        } />
        
        <Route path="/upgrade" element={
          <ProtectedRoute user={user}>
            <CheckoutTransparent currentUser={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;