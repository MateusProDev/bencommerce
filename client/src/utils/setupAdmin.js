// Script para configurar emails admin no Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const setupInitialAdmin = async () => {
  try {
    const adminEmails = [
      'mateoferreira0812@gmail.com', // Seu email principal
      'mateusprodev@gmail.com'       // Email secundário
    ];

    for (const email of adminEmails) {
      // Verificar se o email já existe
      const existingQuery = query(
        collection(db, 'admin_emails'),
        where('email', '==', email.toLowerCase())
      );
      
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        // Adicionar novo email admin
        await addDoc(collection(db, 'admin_emails'), {
          email: email.toLowerCase(),
          active: true,
          createdAt: new Date(),
          createdBy: 'system'
        });
        
        console.log(`Email admin adicionado: ${email}`);
      } else {
        console.log(`Email admin já existe: ${email}`);
      }
    }
    
    console.log('Configuração de admins concluída!');
  } catch (error) {
    console.error('Erro ao configurar admins:', error);
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
