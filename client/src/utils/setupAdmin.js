// Script para configurar emails admin no Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const setupInitialAdmin = async (password = 'admin123') => {
  try {
    // Verificar se o Firebase está configurado corretamente
    if (!db || !auth) {
      throw new Error('Firebase não configurado. Configure as variáveis de ambiente REACT_APP_FIREBASE_*');
    }

    const adminEmails = [
      'mateoferreira0812@gmail.com', // Seu email principal
      'mateusprodev@gmail.com'       // Email secundário
    ];

    let addedCount = 0;
    let existingCount = 0;
    let userCreatedCount = 0;

    for (const email of adminEmails) {
      // Verificar se o email já existe no Firestore
      const existingQuery = query(
        collection(db, 'admin_emails'),
        where('email', '==', email.toLowerCase())
      );
      
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        // Adicionar novo email admin no Firestore
        await addDoc(collection(db, 'admin_emails'), {
          email: email.toLowerCase(),
          active: true,
          createdAt: new Date(),
          createdBy: 'system'
        });
        
        console.log(`Email admin adicionado no Firestore: ${email}`);
        addedCount++;
      } else {
        console.log(`Email admin já existe no Firestore: ${email}`);
        existingCount++;
      }

      // Criar usuário no Firebase Auth (se não existir)
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log(`Usuário Firebase Auth criado: ${email}`);
        userCreatedCount++;
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          console.log(`Usuário Firebase Auth já existe: ${email}`);
        } else {
          console.error(`Erro ao criar usuário Firebase Auth para ${email}:`, authError.message);
        }
      }
    }
    
    console.log('Configuração de admins concluída!');
    return { success: true, addedCount, existingCount, userCreatedCount };
  } catch (error) {
    console.error('Erro ao configurar admins:', error);
    throw error;
  }
};

// Função para adicionar um novo admin
export const addNewAdmin = async (email, addedBy = 'admin') => {
  try {
    // Verificar se já existe
    const existingQuery = query(
      collection(db, 'admin_emails'),
      where('email', '==', email.toLowerCase())
    );
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      throw new Error('Email já está registrado como admin');
    }
    
    // Adicionar novo admin
    await addDoc(collection(db, 'admin_emails'), {
      email: email.toLowerCase(),
      active: true,
      createdAt: new Date(),
      createdBy: addedBy
    });
    
    console.log(`Novo admin adicionado: ${email}`);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar admin:', error);
    throw error;
  }
};

// Função para listar todos os admins
export const listAllAdmins = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'admin_emails'));
    const admins = [];
    
    querySnapshot.forEach((doc) => {
      admins.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return admins;
  } catch (error) {
    console.error('Erro ao listar admins:', error);
    return [];
  }
};
