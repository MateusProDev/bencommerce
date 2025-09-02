import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Loading from '../Loading';

const AdminProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        // Verificar se o email é admin no Firestore
        const isEmailAdmin = await checkIfEmailIsAdmin(currentUser.email);
        
        if (isEmailAdmin) {
          setIsAdmin(true);
          setUser(currentUser);
          console.log('Admin autorizado:', currentUser.email);
        } else {
          setIsAdmin(false);
          setUser(null);
          console.log('Email não autorizado:', currentUser.email);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Loading text="Verificando permissões..." size="large" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
