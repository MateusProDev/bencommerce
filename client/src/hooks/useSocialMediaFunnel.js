import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {
  buildWhatsAppUrl,
  buildLeadWhatsAppMessage,
} from '../utils/leadPlans';

const useSocialMediaFunnel = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [waUrl, setWaUrl] = useState('');

  const openSocialMediaFunnel = (plan = '') => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };

  const closeSocialMediaFunnel = () => {
    setIsOpen(false);
    setSelectedPlan('');
    setWaUrl('');
  };

  const submitLead = async (leadData) => {
    try {
      const leadWithTimestamp = {
        ...leadData,
        plan: selectedPlan || leadData.plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'novo',
        source: 'social_media_form',
        channel: 'whatsapp',
        type: 'social_media',
      };

      // 1) Registro no painel.
      await addDoc(collection(db, 'social_media_leads'), leadWithTimestamp);

      // 2) Conversa no WhatsApp, já com todo o contexto do lead.
      const url = buildWhatsAppUrl(buildLeadWhatsAppMessage(leadWithTimestamp));
      setWaUrl(url);

      return { success: true, whatsappUrl: url };
    } catch (error) {
      console.error('Erro ao salvar lead de redes sociais:', error);
      return { success: false, error: error.message };
    }
  };

  // Mantida para compatibilidade com navegação
  const navigateToSocialMedia = (plan = '') => {
    if (plan) {
      navigate(`/redes-sociais/${plan}`, { state: { selectedPlan: plan } });
    } else {
      navigate('/redes-sociais');
    }
  };

  return {
    isOpen,
    selectedPlan,
    waUrl,
    openSocialMediaFunnel,
    closeSocialMediaFunnel,
    submitLead,
    navigateToSocialMedia,
  };
};

export default useSocialMediaFunnel;
