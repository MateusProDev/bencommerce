// components/SocialMediaFunnel/SocialMediaFunnelPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import SocialMediaFunnel from "./SocialMediaFunnel";

const SocialMediaFunnelPage = () => {
  const { plan } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div className="social-media-funnel-page">
      <SocialMediaFunnel isOpen={true} onClose={handleClose} initialPlan={plan} />
    </div>
  );
};

export default SocialMediaFunnelPage;
