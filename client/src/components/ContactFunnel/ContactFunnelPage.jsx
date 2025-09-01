// components/ContactFunnel/ContactFunnelPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContactFunnel from "./ContactFunnel";

const ContactFunnelPage = () => {
  const { plan } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div className="contact-funnel-page">
      <ContactFunnel isOpen={true} onClose={handleClose} initialPlan={plan} />
    </div>
  );
};

export default ContactFunnelPage;
