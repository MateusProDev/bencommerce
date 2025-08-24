// hooks/useContactFunnel.js
import { useNavigate } from 'react-router-dom';

export const useContactFunnel = () => {
  const navigate = useNavigate();

  const openContactFunnel = (plan = '') => {
    if (plan) {
      navigate(`/contato/${plan}`, { 
        state: { selectedPlan: plan } 
      });
    } else {
      navigate('/contato');
    }
  };

  return { openContactFunnel };
};

// Exportar como padrão também para compatibilidade
export default useContactFunnel;