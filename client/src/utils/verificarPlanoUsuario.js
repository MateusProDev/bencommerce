// src/utils/verificarPlanoUsuario.js
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const verificarPlanoUsuario = async (uid) => {
  try {
    const userRef = doc(db, 'usuarios', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    // Ignora se o plano já for free ou não tiver expiracaoPlano
    if (
      userData.planoAtual === 'free' ||
      !userData.expiracaoPlano
    ) return;

    const agora = new Date();
    const expiracao = new Date(userData.expiracaoPlano);

    if (agora > expiracao) {
      // Plano expirou — rebaixar para free
      await updateDoc(userRef, {
        planoAtual: 'free',
        expiracaoPlano: null,
        emTeste: false,
      });

      console.log('Plano expirado, rebaixado para free');
    }
  } catch (err) {
    console.error('Erro ao verificar plano do usuário:', err);
  }
};
