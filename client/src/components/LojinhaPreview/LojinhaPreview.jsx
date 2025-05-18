import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PreviewIcon from "@mui/icons-material/Visibility";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import Lojinha from "../Lojinha/Lojinha";
import "./LojinhaPreview.css";

const DEVICES = [
  { key: "iphone14", name: "iPhone 14", width: 390, height: 844 },
  { key: "iphonese", name: "iPhone SE", width: 320, height: 568 },
  { key: "galaxys23", name: "Galaxy S23", width: 360, height: 780 },
  { key: "redminote", name: "Redmi Note", width: 393, height: 873 },
  { key: "xiaomimi", name: "Xiaomi Mi", width: 360, height: 800 },
  // { key: "ipad", name: "iPad", width: 820, height: 1180 },
  // { key: "galaxytab", name: "Galaxy Tab", width: 800, height: 1280 },
];

const MENU_WIDTH = -200;

const LojinhaPreview = ({ user }) => {
  const navigate = useNavigate();
  const [device, setDevice] = useState("desktop"); // "desktop" ou "mobile"
  const [floating, setFloating] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 24 });
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const [model, setModel] = useState(DEVICES[0].key);

  // Responsividade: detecta se está em mobile
  const isMobile = window.innerWidth <= 900;
  const currentModel = DEVICES.find(m => m.key === model);

  if (!user || !user.slug) {
    return <div>Loja não encontrada.</div>;
  }

  // Dados reais da loja
  const lojaId = user.uid || user.id;
  const logoUrl = user.logoUrl;
  const menuItems = [];
  const footerInfo = {};
  const initialCart = [];

  // Funções de drag
  const handleMouseDown = (e) => {
    if (!floating) return;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="preview-container"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "flex-start",
        marginLeft: isMobile ? 0 : MENU_WIDTH,
        width: "100%",
        padding: isMobile ? 0 : "32px 0",
        background: "#f4f6f8",
        boxSizing: "border-box",
      }}
    >
      {/* Moldura ou live sem moldura */}
      <div
        className={isMobile ? "device-live-mobile" : "device-frame"}
        style={
          isMobile
            ? {
                width: "100vw",
                height: "calc(100vh - 56px)",
                background: "#fff",
                borderRadius: 0,
                margin: 0,
                boxShadow: "none",
                overflow: "hidden",
                minHeight: 400,
              }
            : {
                width: currentModel.width,
                height: currentModel.height,
                background: "#fff",
                borderRadius: 32,
                margin: 0,
                boxShadow: "none",
                overflow: "hidden",
                minWidth: 320,
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
        }
      >
        <iframe
          title="Preview da Loja"
          src={`/${user.slug}`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: isMobile ? 0 : 28,
            background: "#fafafa",
            display: "block",
          }}
        />
      </div>
      {/* Botões de modelos só em desktop/tablet */}
      {!isMobile && (
        <div
          className="device-selector"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            padding: "32px 0",
            minWidth: 140,
          }}
        >
          {DEVICES.map(m => (
            <Button
              key={m.key}
              variant={model === m.key ? "contained" : "outlined"}
              size="small"
              onClick={() => setModel(m.key)}
              className="device-btn"
              style={{ minWidth: 110, marginBottom: 4 }}
            >
              <span className="device-name">{m.name}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LojinhaPreview;