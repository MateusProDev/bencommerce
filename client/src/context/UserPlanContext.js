// UserPlanContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const UserPlanContext = createContext();

export const UserPlanProvider = ({ children }) => {
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [trialData, setTrialData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        setLoading(true);
        
        // Escuta mudanças na coleção usuarios
        const unsubscribeUser = onSnapshot(
          doc(db, "usuarios", user.uid),
          (userSnap) => {
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const planFromUser = userData.plano || "free";
              setUserPlan(planFromUser);
              
              // Armazena dados do trial se existirem
              setTrialData({
                testeGratuito: userData.testeGratuito || false,
                fimTeste: userData.fimTeste || null,
                inicioTeste: userData.inicioTeste || null,
                planoAtivo: userData.planoAtivo || false
              });
              
              // Sincroniza o plano na loja
              updateLojaPlano(user.uid, planFromUser);
            } else {
              // Cria documento básico se não existir
              createBasicUserDoc(user.uid);
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error("Erro ao escutar plano do usuário:", err);
            setError("Erro ao carregar plano do usuário.");
            setUserPlan("free");
            setLoading(false);
          }
        );

        return () => {
          unsubscribeUser();
        };
      } else {
        setUserPlan("free");
        setUserId(null);
        setTrialData(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Função para criar documento básico do usuário
  const createBasicUserDoc = async (uid) => {
    try {
      const userRef = doc(db, "usuarios", uid);
      const basicData = {
        plano: "free",
        planoAtivo: true,
        testeGratuito: false,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, basicData);
      setUserPlan("free");
      setTrialData({
        testeGratuito: false,
        fimTeste: null,
        inicioTeste: null,
        planoAtivo: true
      });
    } catch (err) {
      console.error("Erro ao criar documento do usuário:", err);
    }
  };

  // Função para sincronizar o plano na loja
  const updateLojaPlano = async (uid, plano) => {
    try {
      const lojaRef = doc(db, "lojas", uid);
      const lojaSnap = await getDoc(lojaRef);
      
      if (lojaSnap.exists()) {
        const lojaData = lojaSnap.data();
        // Só atualiza se o plano for diferente
        if (lojaData.plano !== plano) {
          await updateDoc(lojaRef, { 
            plano: plano,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error("Erro ao sincronizar plano na loja:", err);
    }
  };

  const value = {
    userPlan,
    loading,
    error,
    userId,
    trialData,
    // Função helper para verificar se o trial está ativo
    isTrialActive: () => {
      if (!trialData?.fimTeste) return false;
      return new Date() < new Date(trialData.fimTeste);
    },
    // Função helper para verificar se o trial expirou
    isTrialExpired: () => {
      if (!trialData?.fimTeste) return false;
      return new Date() > new Date(trialData.fimTeste);
    }
  };

  return (
    <UserPlanContext.Provider value={value}>
      {children}
    </UserPlanContext.Provider>
  );
};

export const useUserPlan = () => {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider");
  }
  return context;
};