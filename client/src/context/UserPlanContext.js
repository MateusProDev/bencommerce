// UserPlanContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";

const UserPlanContext = createContext();

export const UserPlanProvider = ({ children }) => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserPlan = async (uid) => {
    try {
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserPlan(userData.plano || "free");
      } else {
        setUserPlan("free");
      }
    } catch (err) {
      console.error("Erro ao carregar plano do usuário:", err);
      setError("Erro ao carregar plano do usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserPlan(user.uid);
      } else {
        setUserPlan("free");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserPlanContext.Provider value={{ userPlan, loading, error }}>
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