import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import HomePage from './components/HomePage/HomePage';
import AuthForm from './components/AuthForm';
import CreateStore from './components/CreateStore';
import Dashboard from './components/Dashboard/Dashboard';

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const StoreRequiredRoute = ({ user, storeCreated, children }) => {
  if (!user) return <Navigate to="/login" />;
  return storeCreated ? children : <Navigate to="/criar-loja" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [storeCreated, setStoreCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'usuarios', u.uid));
        setStoreCreated(snap.exists() && snap.data()?.storeCreated);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            !user
              ? <AuthForm onAuthSuccess={() => window.location.reload()} />
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/criar-loja"
          element={
            <ProtectedRoute user={user}>
              <CreateStore onStoreCreated={() => setStoreCreated(true)} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <StoreRequiredRoute user={user} storeCreated={storeCreated}>
              <Dashboard />
            </StoreRequiredRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
