import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import ProductSection from "../ProductSection/ProductSection";

const CategoriaPage = () => {
  const { slug, categoria } = useParams();
  const [lojaId, setLojaId] = useState(null);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchLojaIdAndProdutos() {
      // Busca o id da loja pelo slug
      const lojaSnap = await getDocs(query(collection(db, "lojas"), where("slug", "==", slug)));
      if (!lojaSnap.empty) {
        const lojaId = lojaSnap.docs[0].id;
        setLojaId(lojaId);
        // Busca produtos da categoria
        const produtosSnap = await getDocs(query(
          collection(db, `lojas/${lojaId}/produtos`),
          where("category", "==", categoria)
        ));
        setProdutos(produtosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }
    fetchLojaIdAndProdutos();
  }, [slug, categoria]);

  return (
    <div>
      <h1>Categoria: {categoria}</h1>
      <ProductSection title={categoria} products={produtos} onAddToCart={() => {}} />
    </div>
  );
};

export default CategoriaPage;