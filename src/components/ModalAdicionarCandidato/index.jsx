import React, { useState, useEffect, useRef } from "react";
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
import { Toast } from 'primereact/toast';

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
  const toast = useRef(null);

  // Função para validar CPF matematicamente
  const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cpfNumerico = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfNumerico.length !== 11) {
      console.log('CPF inválido: não tem 11 dígitos', cpfNumerico);
      return false;
    }
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cpfNumerico)) {
      console.log('CPF inválido: todos os dígitos são iguais', cpfNumerico);
      return false;
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    // Verifica se os dígitos verificadores estão corretos
    const digito9 = parseInt(cpfNumerico.charAt(9));
    const digito10 = parseInt(cpfNumerico.charAt(10));
    
    const valido = digito9 === digito1 && digito10 === digito2;
    
    console.log('Validação CPF detalhada:', {
      cpf: cpfNumerico,
      digito9,
      digito10,
      digito1,
      digito2,
      valido
    });
    
    return valido;
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
    
    // Validação de campos obrigatórios
    if (!nome.trim()) camposObrigatorios.push('nome');
    if (!email.trim()) camposObrigatorios.push('email');
    if (!cpf.trim()) camposObrigatorios.push('cpf');
    if (!nascimento.trim()) camposObrigatorios.push('nascimento');
    
    // Validação de email
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      camposObrigatorios.push('email');
    }
    
    // Validação de CPF (validação matemática real)
    if (cpf.trim()) {
      const cpfValido = validarCPF(cpf);
      console.log('Validação CPF:', { cpf: cpf.trim(), valido: cpfValido });
      if (!cpfValido) {
        camposObrigatorios.push('cpf');
      }
    }
    
    console.log('Campos obrigatórios:', camposObrigatorios);
    setCamposVazios(camposObrigatorios);
    
    return camposObrigatorios.length === 0;
  };

  const handleSave = async () => {
    console.log('Tentando salvar candidato:', { nome, email, cpf, nascimento, telefone });
    
    if (!validarCampos()) {
      console.log('Validação falhou, campos obrigatórios:', camposVazios);
      
      // Verifica especificamente se o CPF é inválido
      if (cpf.trim() && !validarCPF(cpf)) {
        toast.current.show({
          severity: 'error',
          summary: 'CPF Inválido',
          detail: 'Por favor, verifique se o CPF está correto.',
          life: 3000
        });
        return;
      }
      
      // Mostra erro geral para outros campos
      toast.current.show({
        severity: 'error',
        summary: 'Campos Obrigatórios',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
        life: 3000
      });
      return; // Não prossegue se há campos vazios
    }

    console.log('Validação passou, salvando candidato...');
    
    try {
      // Chama a função aoSalvar e aguarda o resultado
      await aoSalvar({
        nome,
        email,
        cpf,
        nascimento,
        telefone
      });
      
      // Só limpa os campos se o aoSalvar foi bem-sucedido
      limparCampos();
      
    } catch (error) {
      console.error('Erro ao salvar candidato:', error);
      // Não limpa os campos em caso de erro
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {opened && (
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
    )}
    </>
  );
}

export default ModalAdicionarCandidato; 