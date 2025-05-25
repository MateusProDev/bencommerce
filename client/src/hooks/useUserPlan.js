// src/hooks/useUserPlan.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useUserPlan = (lojaId) => {
  const [userPlan, setUserPlan] = useState("free");

  useEffect(() => {
    if (!lojaId) return;

    const unsubscribe = onSnapshot(doc(db, "lojas", lojaId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserPlan(data.plano || "free");
      }
    });

    return () => unsubscribe();
  }, [lojaId]);

  return { userPlan };
};

export default useUserPlan;