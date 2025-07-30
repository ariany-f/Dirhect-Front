import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import BotaoGrupo from "@components/BotaoGrupo";
import DropdownItens from "@components/DropdownItens";
import Titulo from "@components/Titulo";
import { RiCloseFill } from "react-icons/ri";
import styles from "./ModalAdicionarCandidato.module.css";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

const Col12 = styled.div`
  display: flex;
  width: 100%;
  gap: 24px;
`;

const Col6 = styled.div`
  flex: 1 1 calc(50% - 26px);
  display: flex;
  flex-direction: column;
`;

function ModalAdicionarCandidato({ opened = false, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [filial, setFilial] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [camposVazios, setCamposVazios] = useState([]);

  // Função para validar CPF matematicamente
  const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cpfNumerico = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfNumerico.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cpfNumerico)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    // Verifica se os dígitos verificadores estão corretos
    return parseInt(cpfNumerico.charAt(9)) === digito1 && 
           parseInt(cpfNumerico.charAt(10)) === digito2;
  };

  const limparCampos = () => {
    setNome("");
    setEmail("");
    setCpf("");
    setNascimento("");
    setTelefone("");
    setFilial("");
    setCentroCusto("");
    setCamposVazios([]);
  };

  // Limpa os campos quando o modal é aberto
  useEffect(() => {
    if (opened) {
      limparCampos();
    }
  }, [opened]);

  // Validação em tempo real quando os campos mudam
  useEffect(() => {
    // Só valida se pelo menos um campo foi preenchido
    if (nome || email || cpf || nascimento) {
      validarCampos();
    }
  }, [nome, email, cpf, nascimento]);

  const handleFechar = () => {
    limparCampos();
    aoFechar();
  };

  const validarCampos = () => {
    const camposObrigatorios = [];
    
    if (!nome.trim()) camposObrigatorios.push('nome');
    if (!email.trim()) camposObrigatorios.push('email');
    if (!cpf.trim()) camposObrigatorios.push('cpf');
    if (!nascimento.trim()) camposObrigatorios.push('nascimento');
    
    // Validação de email
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      camposObrigatorios.push('email');
    }
    
    // Validação de CPF (validação matemática real)
    if (cpf.trim() && !validarCPF(cpf)) {
      camposObrigatorios.push('cpf');
    }
    
    setCamposVazios(camposObrigatorios);
    
    return camposObrigatorios.length === 0;
  };

  const handleSave = () => {
    if (!validarCampos()) {
      return; // Não prossegue se há campos vazios
    }

    aoSalvar({
      nome,
      email,
      cpf,
      nascimento,
      telefone
    });
    limparCampos();
  };

  return (
    opened &&
    <Overlay>
      <DialogEstilizado $width="60vw" $minWidth="40vw" open={opened}>
        <Frame>
          <Titulo>
            <button className="close" onClick={handleFechar}>
              <RiCloseFill size={20} className="fechar" />  
            </button>
            <h6>Adicionar Candidato</h6>
          </Titulo>
        </Frame>
        <Frame padding="24px 0px">
          <Col12>
            <Col6>
              <CampoTexto 
                patternMask={["999.999.999-99"]} 
                valor={cpf} 
                required={true}
                type="text" 
                setValor={setCpf} 
                label="CPF" 
                camposVazios={camposVazios}
                name="cpf"
              />
              <CampoTexto 
                valor={nome} 
                required={true} 
                type="text" 
                setValor={setNome} 
                label="Nome" 
                camposVazios={camposVazios}
                name="nome"
              />
              <CampoTexto 
                valor={email} 
                required={true} 
                type="text" 
                setValor={setEmail} 
                label="E-mail" 
                camposVazios={camposVazios}
                name="email"
              />
            </Col6>
            <Col6>
              <CampoTexto 
                patternMask={["(99) 99999-9999"]} 
                valor={telefone} 
                type="text" 
                setValor={setTelefone} 
                label="Telefone" 
              />
              <CampoTexto 
                valor={nascimento} 
                type="date" 
                setValor={setNascimento} 
                label="Data de Nascimento" 
                required={true}
                camposVazios={camposVazios}
                name="nascimento"
              />
            </Col6>
          </Col12>
        </Frame>
        <div className={styles.containerBottom}>
          <BotaoGrupo>
            <Botao
              aoClicar={handleFechar}
              estilo="neutro"
              size="medium"
              filled
            >
              Cancelar
            </Botao>
            <Botao
              aoClicar={handleSave}
              estilo="vermilion"
              size="medium"
              filled
              disabled={!nome.trim() || !email.trim() || !cpf.trim() || !nascimento.trim()}
            >
              Adicionar
            </Botao>
          </BotaoGrupo>
        </div>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalAdicionarCandidato; 