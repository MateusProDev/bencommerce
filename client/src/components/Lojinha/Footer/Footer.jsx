import React from "react";
import styles from "./Footer.module.css";
import {
  Instagram,
  Facebook,
  Twitter,
  YouTube,
} from "@mui/icons-material";

const info = {
  nomeLoja: "StoreSync",
  descricao: "Plataforma completa para criação de lojas virtuais.",
  endereco: "Av. Paulista, 1000 - São Paulo, SP",
  whatsapp: "(11) 99999-9999",
  email: "contato@StoreSync.com.br",
  telefone: "(11) 4002-8922",
  instagram: "https://instagram.com/StoreSync",
  facebook: "https://facebook.com/StoreSync",
  twitter: "https://twitter.com/StoreSync",
  youtube: "https://youtube.com/@StoreSync",
  extras: [
    { label: "Blog", url: "/blog" },
    { label: "Carreiras", url: "/carreiras" },
  ]
};

const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Coluna da loja */}
        <div className={styles.col}>
          <h2 className={styles.brand}>{info.nomeLoja || "Sua Loja"}</h2>
          {info.descricao && <p className={styles.description}>{info.descricao}</p>}
        </div>

        {/* Links rápidos */}
        <div className={styles.col}>
          <h3>Links Rápidos</h3>
          <ul className={styles.links}>
            <li><a href="/">Início</a></li>
            <li><a href="/loja">Produtos</a></li>
            <li><a href="/contato">Contato</a></li>
            {info.extras?.map((link, index) => (
              <li key={index}><a href={link.url}>{link.label}</a></li>
            ))}
          </ul>
        </div>

        {/* Redes sociais */}
        <div className={styles.col}>
          <h3>Redes Sociais</h3>
          <div className={styles.social}>
            {info.instagram && (
              <a 
                href={info.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <Instagram className={styles.icon} />
              </a>
            )}
            {info.facebook && (
              <a 
                href={info.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
                <Facebook className={styles.icon} />
              </a>
            )}
            {info.twitter && (
              <a 
                href={info.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
              >
                <Twitter className={styles.icon} />
              </a>
            )}
            {info.youtube && (
              <a 
                href={info.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
              >
                <YouTube className={styles.icon} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {anoAtual} {info.nomeLoja || "Sua Loja"} — Todos os direitos reservados.</p>
        <div className={styles.legal}>
          <a href="/termos">Termos</a>
          <a href="/privacidade">Privacidade</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;