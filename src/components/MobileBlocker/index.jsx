import React from "react";
import { CiWarning } from "react-icons/ci";

const MobileBlocker = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #244078, rgb(29 111 141))",
        color: "#fff",
        textAlign: "center",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        style={{
          padding: "30px",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h1 style={{ fontSize: "18px", marginBottom: "15px" }}>
          <CiWarning />
        </h1>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
          Este aplicativo foi desenvolvido para funcionar apenas em dispositivos
          desktop. Por favor, acesse de um computador para continuar.
        </p>
      </div>
    </div>
  );
};

export default MobileBlocker;
