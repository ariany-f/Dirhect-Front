import React from "react";
import { Image } from "primereact/image";

const CustomImage = ({ src, title, size = 50, borderRadius = '10px' }) => {
  // Função para pegar as iniciais do título
  const getInitials = (text) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return src ? (
    <Image src={src} alt={title} width={size} height={size} />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        backgroundColor: "var(--neutro-200)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontWeight: 600,
        fontSize: size / 3.5,
        textTransform: "uppercase",
      }}
    >
      {getInitials(title)}
    </div>
  );
};

export default CustomImage;
