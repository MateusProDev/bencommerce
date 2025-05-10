import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Verifica o status do plano de um usuário e atualiza se necessário
 * @param {string} uid - ID do usuário
 * @returns {Promise<Object|null>} - Retorna os dados atualizados do usuário ou null se não houver mudanças
 */
export const verificarPlanoUsuario = async (uid) => {
  try {
    const userRef = doc(db, 'usuarios', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`Usuário ${uid} não encontrado`);
      return null;
    }
    
    const userData = userSnap.data();
    let atualizacoes = null;
    const agora = new Date();
    
    // Verificar se o usuário está em período de teste
    if (userData.emTeste && userData.expiracaoPlano) {
      const expiracao = new Date(userData.expiracaoPlano);
      
      // Se o período de teste expirou, rebaixar para free
      if (agora > expiracao) {
        atualizacoes = {
          plano: 'free',
          planoAtual: 'free',
          expiracaoPlano: null,
          dataInicioPlano: null,
          emTeste: false,
          testeGratuito: true, // Marca que o usuário já usou o teste
          planoAtivo: false,
          pagamentoConfirmado: false,
          atualizadoEm: serverTimestamp()
        };
      }
    }
    
    // Verificar planos pagos ativos (não em teste)
    else if (!userData.emTeste && userData.planoAtivo && userData.expiracaoPlano) {
      const expiracao = new Date(userData.expiracaoPlano);
      
      // Se o plano pago expirou
      if (agora > expiracao) {
        atualizacoes = {
          plano: 'free',
          planoAtual: 'free',
          expiracaoPlano: null,
          dataInicioPlano: null,
          planoAtivo: false,
          pagamentoConfirmado: false,
          atualizadoEm: serverTimestamp()
        };
      }
    }
    
    // Atualizar o documento se necessário
    if (atualizacoes) {
      await updateDoc(userRef, atualizacoes);
      console.log(`Usuário ${uid} teve seu plano atualizado para free.`);
      
      // Retornar os dados atualizados
      return {
        ...userData,
        ...atualizacoes
      };
    }
    
    return null; // Nenhuma atualização foi necessária
    
  } catch (err) {
    console.error('Erro ao verificar plano do usuário:', err);
    throw err;
  }
};

/**
 * Verifica se um usuário pode iniciar um teste gratuito
 * @param {Object} userData - Dados do usuário
 * @returns {boolean} - Retorna true se o usuário pode iniciar um teste
 */
export const podeIniciarTeste = (userData) => {
  // Se já usou o teste gratuito, não pode iniciar outro
  if (userData.testeGratuito) {
    return false;
  }
  
  // Se já está em algum plano pago ativo, não precisa de teste
  if (userData.planoAtivo && userData.plano !== 'free') {
    return false;
  }
  
  return true;
};

/**
 * Inicia um período de teste para um usuário
 * @param {string} uid - ID do usuário
 * @param {string} plano - Nome do plano ('plus' ou 'premium')
 * @returns {Promise<Object>} - Retorna os dados atualizados do usuário
 */
export const iniciarTeste = async (uid, plano) => {
  if (!['plus', 'premium'].includes(plano)) {
    throw new Error('Plano inválido para teste gratuito');
  }
  
  const userRef = doc(db, 'usuarios', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('Usuário não encontrado');
  }
  
  const userData = userSnap.data();
  
  if (!podeIniciarTeste(userData)) {
    throw new Error('Usuário não pode iniciar teste gratuito');
  }
  
  const agora = new Date();
  const expiracaoDate = new Date();
  expiracaoDate.setDate(expiracaoDate.getDate() + 7); // 7 dias de teste
  
  const atualizacoes = {
    plano: plano,
    planoAtual: plano,
    dataInicioPlano: agora.toISOString(),
    expiracaoPlano: expiracaoDate.toISOString(),
    emTeste: true,
    testeGratuito: true,
    inicioTeste: agora.toISOString(),
    fimTeste: expiracaoDate.toISOString(),
    planoAtivo: false,
    pagamentoConfirmado: false,
    atualizadoEm: serverTimestamp()
  };
  
  await updateDoc(userRef, atualizacoes);
  
  return {
    ...userData,
    ...atualizacoes
  };
};