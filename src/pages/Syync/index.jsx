import React, { useState } from "react";
import Botao from "@components/Botao";
import RadioButton from "@components/RadioButton";
import http from "@http";
import "./index.css";
import { ArmazenadorToken } from "@utils";
import { Toast } from 'primereact/toast';

const Syync = ({ aoSalvar }) => {
  const [tipoEnvio, setTipoEnvio] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTipoEnvioChange = (valor) => {
    setTipoEnvio(valor);
    setFormData({}); // Limpa os dados do formulário anterior
    setErrors({}); // Limpa os erros
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (tipoEnvio === "folha-pagamento") {
      if (!formData.periodo || formData.periodo.trim() === "") {
        newErrors.periodo = "Período é obrigatório";
      }
      if (!formData.mes || formData.mes.trim() === "") {
        newErrors.mes = "Mês é obrigatório";
      }
      if (!formData.ano || formData.ano.trim() === "") {
        newErrors.ano = "Ano é obrigatório";
      }
    } else if (tipoEnvio === "recibo-ferias") {
      if (!formData.dataPagamento) {
        newErrors.dataPagamento = "Data de pagamento é obrigatória";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await aoSalvar(formData, tipoEnvio);
      
      if (result.success) {
        // Limpa o formulário após sucesso
        setFormData({});
        setTipoEnvio("");
      }
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderFormularioReciboFerias = () => (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label htmlFor="dataPagamento">DATA PAGAMENTO: *</label>
        <input
          type="date"
          id="dataPagamento"
          name="dataPagamento"
          value={formData.dataPagamento || ""}
          onChange={handleInputChange}
          required
        />
        {errors.dataPagamento && (
          <span className="error-message">{errors.dataPagamento}</span>
        )}
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
        <label htmlFor="periodo">PERIODO: *</label>
        <input
          type="text"
          id="periodo"
          name="periodo"
          value={formData.periodo || ""}
          onChange={handleInputChange}
          placeholder="Ex: 01"
          required
        />
        {errors.periodo && (
          <span className="error-message">{errors.periodo}</span>
        )}
      </div>
      <div className="campo">
        <label htmlFor="mes">MES: *</label>
        <input
          type="number"
          id="mes"
          name="mes"
          value={formData.mes || ""}
          onChange={handleInputChange}
          required
        />
        {errors.mes && (
          <span className="error-message">{errors.mes}</span>
        )}
      </div>
      <div className="campo">
        <label htmlFor="ano">ANO: *</label>
        <input
          type="number"
          id="ano"
          name="ano"
          value={formData.ano || ""}
          onChange={handleInputChange}
          required
        />
        {errors.ano && (
          <span className="error-message">{errors.ano}</span>
        )}
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
      <h1>{tipoEnvio === "folha-pagamento" ? "Envio de Folha de Pagamento" : (tipoEnvio === "recibo-ferias" ? "Envio de Recibo de Férias" : "Syync")}</h1>
      
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