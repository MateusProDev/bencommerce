import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const useSocialMediaFunnel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const openSocialMediaFunnel = (plan = '') => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeSocialMediaFunnel = () => {
    setIsOpen(false);
    setSelectedPlan('');
  };

  const submitLead = async (leadData) => {
    try {
      const leadWithTimestamp = {
        ...leadData,
        plan: selectedPlan || leadData.plan,
        createdAt: new Date(),
        status: 'novo',
        source: 'social_media_form'
      };

      await addDoc(collection(db, 'socialMediaLeads'), leadWithTimestamp);
      
      // Fechar o modal após sucesso
      closeSocialMediaFunnel();
      
      // Retornar sucesso
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar lead de redes sociais:', error);
      return { success: false, error: error.message };
    }
  };

  // Manter função original para compatibilidade com navegação
  const navigateToSocialMedia = (plan = '') => {
    if (plan) {
      navigate(`/redes-sociais/${plan}`, { 
        state: { selectedPlan: plan } 
      });
    } else {
      navigate('/redes-sociais');
    }
  };

  return {
    isOpen,
    selectedPlan,
    openSocialMediaFunnel,
    closeSocialMediaFunnel,
    submitLead,
    navigateToSocialMedia
  };
};

// Exportar como padrão também para compatibilidade
export default useSocialMediaFunnel;
