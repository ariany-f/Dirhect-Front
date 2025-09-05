import React, { useState } from "react";
import Botao from "@components/Botao";
import RadioButton from "@components/RadioButton";
import "./index.css";

const Syync = () => {
  const [tipoEnvio, setTipoEnvio] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTipoEnvioChange = (valor) => {
    setTipoEnvio(valor);
    setFormData({}); // Limpa os dados do formulário anterior
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui será implementado o POST para o endpoint
      console.log("Dados do formulário:", formData);
      console.log("Tipo de envio:", tipoEnvio);
      
      // TODO: Implementar chamada para o endpoint
      alert("Formulário enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário");
    } finally {
      setLoading(false);
    }
  };

  const renderFormularioReciboFerias = () => (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label htmlFor="dataPagamento">DATA PAGAMENTO:</label>
        <input
          type="date"
          id="dataPagamento"
          name="dataPagamento"
          value={formData.dataPagamento || ""}
          onChange={handleInputChange}
          required
        />
      </div>

      <Botao 
        type="submit" 
        disabled={loading} 
        estilo="vermilion"
        model="filled"
        size="large"
        aoClicar={handleSubmit}
      >
        {loading ? "Enviando..." : "Enviar"}
      </Botao>
    </form>
  );

  const renderFormularioFolhaPagamento = () => (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label htmlFor="periodo">PERIODO:</label>
        <input
          type="text"
          id="periodo"
          name="periodo"
          value={formData.periodo || ""}
          onChange={handleInputChange}
          required
        />
      </div>

      <Botao 
        type="submit" 
        disabled={loading} 
        estilo="vermilion"
        model="filled"
        size="large"
        aoClicar={handleSubmit}
      >
        {loading ? "Enviando..." : "Enviar"}
      </Botao>
    </form>
  );

  return (
    <div className="syync-container">
      <h1>{tipoEnvio === "folha-pagamento" ? "Envio de Folha de Pagamento" : "Envio de Recibo de Férias"}</h1>
      
      <div className="radio-container">
        <label className="radio-label">Selecione o tipo de envio:</label>
        <div className="radio-group">
          <div className="radio-option">
            <RadioButton
              name="tipo-envio"
              value="folha-pagamento"
              checked={tipoEnvio === "folha-pagamento"}
              onSelected={handleTipoEnvioChange}
              id="folha-pagamento"
            />
            <label htmlFor="folha-pagamento">Envio de Folha de Pagamento</label>
          </div>
          
          <div className="radio-option">
            <RadioButton
              name="tipo-envio"
              value="recibo-ferias"
              checked={tipoEnvio === "recibo-ferias"}
              onSelected={handleTipoEnvioChange}
              id="recibo-ferias"
            />
            <label htmlFor="recibo-ferias">Envio de Recibo de Férias</label>
          </div>
        </div>
      </div>

      {tipoEnvio === "folha-pagamento" && renderFormularioFolhaPagamento()}
      {tipoEnvio === "recibo-ferias" && renderFormularioReciboFerias()}
    </div>
  );
};

export default Syync;