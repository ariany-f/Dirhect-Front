import React from "react";
import { Image } from "primereact/image";

const CustomImage = ({ src, title, width = 90, height=45, size = 50, borderRadius = '10px' }) => {
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
    <img src={src} alt={title} style={{objectFit: 'contain', maxHeight: '45px'}} width={width} height={height} />
  ) : (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        backgroundColor: "var(--neutro-200)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgb(87, 87, 87)",
        fontWeight: 600,
        fontSize: size / 5,
        textTransform: "uppercase",
      }}
    >
      {getInitials(title)}
    </div>
  );
};

export default CustomImage;
