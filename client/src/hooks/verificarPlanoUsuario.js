import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const verificarPlanoUsuario = async (userId) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Verifica se o plano está definido, se não, define como free
      if (!userData.plano) {
        await updateDoc(userRef, {
          plano: 'free',
          dataInicioPlano: new Date().toISOString(),
          expiracaoPlano: null,
        });
        return 'free';
      }
      return userData.plano;
    } else {
      // Cria o documento do usuário com plano free se não existir
      await updateDoc(userRef, {
        plano: 'free',
        dataInicioPlano: new Date().toISOString(),
        expiracaoPlano: null,
        storeCreated: false,
      }, { merge: true });
      return 'free';
    }
  } catch (error) {
    console.error('Erro ao verificar plano do usuário:', error);
    return 'free';
  }
};