import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const CategoriasContext = createContext();

export const useCategorias = () => useContext(CategoriasContext);

export const CategoriasProvider = ({ lojaId, children }) => {
  const [categorias, setCategorias] = useState([]);

  // Busca e escuta categorias em tempo real
  useEffect(() => {
    if (!lojaId) return;
    const ref = doc(db, "lojas", lojaId);
    const unsub = onSnapshot(ref, (snap) => {
      setCategorias(snap.exists() ? snap.data().categorias || [] : []);
    });
    return () => unsub();
  }, [lojaId]);

  // Métodos para manipular categorias
  const addCategoria = useCallback(async (cat) => {
    if (!lojaId || !cat) return;
    await updateDoc(doc(db, "lojas", lojaId), { categorias: arrayUnion(cat) });
  }, [lojaId]);

  const removeCategoria = useCallback(async (cat) => {
    if (!lojaId || !cat) return;
    await updateDoc(doc(db, "lojas", lojaId), { categorias: arrayRemove(cat) });
  }, [lojaId]);

  return (
    <CategoriasContext.Provider value={{ categorias, addCategoria, removeCategoria }}>
      {children}
    </CategoriasContext.Provider>
  );
};