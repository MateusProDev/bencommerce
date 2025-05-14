import React from "react";
import "./Footer.css";

const Footer = ({ info }) => (
  <footer className="lojinha-footer">
    <div className="footer-main">
      <div className="footer-col">
        <div className="footer-title">{info.nomeLoja}</div>
        <div>{info.endereco}</div>
        <div>Contato: <a href={`https://wa.me/${info.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{info.whatsapp}</a> | <a href={`mailto:${info.email}`}>{info.email}</a></div>
      </div>
      <div className="footer-col">
        <div className="footer-title">Links rápidos</div>
        <a href="/">Início</a>
        <a href="/loja">Produtos</a>
        <a href="/contato">Contato</a>
      </div>
      <div className="footer-col">
        <div className="footer-title">Redes sociais</div>
        {info.instagram && (
          <a href={info.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
        )}
        {info.facebook && (
          <a href={info.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        )}
      </div>
    </div>
    <div className="footer-bottom">
      <span>{info.copyright}</span>
    </div>
  </footer>
);

export default Footer;