import React, { useState } from "react";
import { Image } from "primereact/image";

const CustomImage = ({ src, title, width = 90, height=45, size = 50, borderRadius = '10px' }) => {
  const [imgError, setImgError] = useState(false);

  // Função para pegar as iniciais do título
  const getInitials = (text) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || imgError) {
    return (
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
        {title && getInitials(title)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      style={{objectFit: 'contain', maxHeight: '45px'}}
      width={width}
      height={height}
      onError={() => setImgError(true)}
    />
  );
};

export default CustomImage;
