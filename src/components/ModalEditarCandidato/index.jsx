import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import BotaoGrupo from "@components/BotaoGrupo";
import DropdownItens from "@components/DropdownItens";
import Titulo from "@components/Titulo";
import { RiCloseFill } from "react-icons/ri";
import styles from "./ModalEditarCandidato.module.css";
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

function ModalEditarCandidato({ opened = false, aoFechar, aoSalvar, candidato = null }) {
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
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;
    
    // Correção: se o resto for 11, o dígito deve ser 0
    if (digito2 === 11) {
      digito2 = 0;
    }
    
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
      valido,
      soma1: soma,
      resto1: resto
    });
    
    return valido;
  };

  // Função de teste para CPF (remover depois)
  const testarCPF = () => {
    const cpfsTeste = [
      '529.982.247-25', // CPF válido conhecido
      '111.444.777-35', // CPF válido
      '123.456.789-01', // CPF inválido
      '000.000.000-00', // CPF inválido (todos iguais)
      '111.111.111-11'  // CPF inválido (todos iguais)
    ];
    
    console.log('=== TESTE DE VALIDAÇÃO DE CPF (EDITAR) ===');
    cpfsTeste.forEach(cpf => {
      const valido = validarCPF(cpf);
      console.log(`CPF: ${cpf} - Válido: ${valido}`);
    });
    console.log('=== FIM DO TESTE ===');
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

  // Preenche os campos quando o modal é aberto com dados do candidato
  useEffect(() => {
    if (opened && candidato) {
      setNome(candidato.nome || "");
      setEmail(candidato.email || "");
      setCpf(candidato.cpf || "");
      setNascimento(candidato.dt_nascimento || "");
      setTelefone(candidato.telefone || "");
      setFilial(candidato.filial || "");
      setCentroCusto(candidato.centro_custo || "");
      setCamposVazios([]);
    } else if (opened) {
      limparCampos();
    }
  }, [opened, candidato]);

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

  const handleSave = () => {
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
    aoSalvar({
      id: candidato?.id,
      nome,
      email,
      cpf,
      nascimento,
      telefone
    });
    limparCampos();
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
                <h6>Editar Candidato</h6>
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
                  {/* Botão de teste temporário - REMOVER DEPOIS */}
                  <button 
                    onClick={testarCPF}
                    style={{
                      marginTop: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Testar CPF (Console)
                  </button>
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
                  Salvar
                </Botao>
              </BotaoGrupo>
            </div>
          </DialogEstilizado>
        </Overlay>
      )}
    </>
  );
}

export default ModalEditarCandidato; 