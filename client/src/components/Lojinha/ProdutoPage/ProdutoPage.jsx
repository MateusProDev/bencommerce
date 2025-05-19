import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../../utils/useAuth"; // Caminho corrigido!

const ProdutoPage = () => {
  const { slug, produtoSlug } = useParams();
  const [produto, setProduto] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!slug || !produtoSlug) return;
    async function fetchProduto() {
      const lojaSnap = await getDocs(query(collection(db, "lojas"), where("slug", "==", slug)));
      if (!lojaSnap.empty) {
        const lojaId = lojaSnap.docs[0].id;
        const produtosSnap = await getDocs(
          query(collection(db, `lojas/${lojaId}/produtos`), where("slug", "==", produtoSlug))
        );
        if (!produtosSnap.empty) {
          setProduto({ id: produtosSnap.docs[0].id, ...produtosSnap.docs[0].data() });
        }
      }
    }
    fetchProduto();
  }, [slug, produtoSlug]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Você não está autenticado.</div>;
  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="produto-detalhe-container">
      <img src={produto.images?.[0] || "/placeholder-product.jpg"} alt={produto.name} style={{ maxWidth: 320, borderRadius: 8 }} />
      <h1>{produto.name}</h1>
      <div className="produto-detalhe-preco">R$ {Number(produto.price).toFixed(2)}</div>
      <div className="produto-detalhe-stock">Estoque: {Number(produto.stock) ?? 0}</div>
      <p>{produto.description}</p>
    </div>
  );
};

export default ProdutoPage;