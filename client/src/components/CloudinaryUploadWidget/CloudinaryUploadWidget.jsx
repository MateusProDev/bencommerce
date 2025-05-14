import React from "react";

// Função utilitária para validar imagem (exemplo simples)
const validateImage = async (file) => {
  // Exemplo: apenas verifica se é imagem
  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo precisa ser uma imagem.");
  }
  // Você pode adicionar outras validações aqui (ex: tamanho, dimensões)
};

// Função para upload no Cloudinary
const uploadImageToCloudinary = async (file) => {
  await validateImage(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "qc7tkpck"); // Seu upload_preset
  formData.append("cloud_name", "doeiv6m4h");   // Seu cloud_name

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/doeiv6m4h/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem.");
  }

  const data = await response.json();
  return data.secure_url; // URL da imagem hospedada
};

const CloudinaryUploadWidget = ({ onUpload }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      onUpload(imageUrl);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <label style={{ cursor: "pointer" }}>
      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
      <span style={{ color: "#4a6bff", textDecoration: "underline" }}>Enviar imagem</span>
    </label>
  );
};

export default CloudinaryUploadWidget;