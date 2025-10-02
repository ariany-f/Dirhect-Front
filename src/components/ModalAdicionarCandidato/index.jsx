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
import { Dropdown } from 'primereact/dropdown';

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

// StyledDropdown para DDI (baseado no LanguageSelector)
const StyledDDIDropdown = styled(Dropdown)`
    border-radius: 4px;
    border: 1px solid var(--neutro-400);
    background: var(--background-label);
    padding: 12px 16px;
    outline: none;
    display: flex;
    align-items: center;
    text-align: left;
    align-self: stretch;
    font-weight: 700;
    font-size: 14px;
    width: 100%;
    height: 46px;
    max-width: 100%;
    margin-bottom: 0px;
    ${props => props.$hasError && `
        border: 1px solid #dc2626;
        outline: none;
    `}

    & .p-dropdown-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .p-dropdown-panel {
        background: var(--white) !important;
        .p-dropdown-items {
            padding: 0.5rem;

            .p-dropdown-item {
                &:hover {
                    background-color: var(--neutro-100) !important;
                }

                &.p-highlight {
                    background-color: var(--primaria-50) !important;
                    color: var(--primaria) !important;
                }
            }
        }
    }
`;

function ModalAdicionarCandidato({ opened = false, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [ddi, setDdi] = useState("55"); // Brasil como padrão
  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");
  const [filial, setFilial] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [camposVazios, setCamposVazios] = useState([]);
  const toast = useRef(null);

  // Lista de DDI (mesma do StepDadosPessoais)
  const ddiOptions = [
    { name: "Afeganistão", code: "93", flag: "🇦🇫" },
    { name: "África do Sul", code: "27", flag: "🇿🇦" },
    { name: "Albânia", code: "355", flag: "🇦🇱" },
    { name: "Alemanha", code: "49", flag: "🇩🇪" },
    { name: "Andorra", code: "376", flag: "🇦🇩" },
    { name: "Angola", code: "244", flag: "🇦🇴" },
    { name: "Anguilla", code: "1-264", flag: "🇦🇮" },
    { name: "Antígua e Barbuda", code: "1-268", flag: "🇦🇬" },
    { name: "Arábia Saudita", code: "966", flag: "🇸🇦" },
    { name: "Argélia", code: "213", flag: "🇩🇿" },
    { name: "Argentina", code: "54", flag: "🇦🇷" },
    { name: "Armênia", code: "374", flag: "🇦🇲" },
    { name: "Aruba", code: "297", flag: "🇦🇼" },
    { name: "Austrália", code: "61", flag: "🇦🇺" },
    { name: "Áustria", code: "43", flag: "🇦🇹" },
    { name: "Azerbaijão", code: "994", flag: "🇦🇿" },
    { name: "Bahamas", code: "1-242", flag: "🇧🇸" },
    { name: "Bahrein", code: "973", flag: "🇧🇭" },
    { name: "Bangladesh", code: "880", flag: "🇧🇩" },
    { name: "Barbados", code: "1-246", flag: "🇧🇧" },
    { name: "Bélgica", code: "32", flag: "🇧🇪" },
    { name: "Belize", code: "501", flag: "🇧🇿" },
    { name: "Benin", code: "229", flag: "🇧🇯" },
    { name: "Bermudas", code: "1-441", flag: "🇧🇲" },
    { name: "Bolívia", code: "591", flag: "🇧🇴" },
    { name: "Bósnia e Herzegovina", code: "387", flag: "🇧🇦" },
    { name: "Botswana", code: "267", flag: "🇧🇼" },
    { name: "Brasil", code: "55", flag: "🇧🇷" },
    { name: "Brunei", code: "673", flag: "🇧🇳" },
    { name: "Bulgária", code: "359", flag: "🇧🇬" },
    { name: "Burkina Faso", code: "226", flag: "🇧🇫" },
    { name: "Burundi", code: "257", flag: "🇧🇮" },
    { name: "Cabo Verde", code: "238", flag: "🇨🇻" },
    { name: "Camarões", code: "237", flag: "🇨🇲" },
    { name: "Camboja", code: "855", flag: "🇰🇭" },
    { name: "Canadá", code: "1", flag: "🇨🇦" },
    { name: "Catar", code: "974", flag: "🇶🇦" },
    { name: "Chile", code: "56", flag: "🇨🇱" },
    { name: "China", code: "86", flag: "🇨🇳" },
    { name: "Chipre", code: "357", flag: "🇨🇾" },
    { name: "Colômbia", code: "57", flag: "🇨🇴" },
    { name: "Comores", code: "269", flag: "🇰🇲" },
    { name: "Congo", code: "242", flag: "🇨🇬" },
    { name: "Coreia do Norte", code: "850", flag: "🇰🇵" },
    { name: "Coreia do Sul", code: "82", flag: "🇰🇷" },
    { name: "Costa do Marfim", code: "225", flag: "🇨🇮" },
    { name: "Costa Rica", code: "506", flag: "🇨🇷" },
    { name: "Croácia", code: "385", flag: "🇭🇷" },
    { name: "Cuba", code: "53", flag: "🇨🇺" },
    { name: "Dinamarca", code: "45", flag: "🇩🇰" },
    { name: "Djibuti", code: "253", flag: "🇩🇯" },
    { name: "Dominica", code: "1-767", flag: "🇩🇲" },
    { name: "Egito", code: "20", flag: "🇪🇬" },
    { name: "El Salvador", code: "503", flag: "🇸🇻" },
    { name: "Emirados Árabes Unidos", code: "971", flag: "🇦🇪" },
    { name: "Equador", code: "593", flag: "🇪🇨" },
    { name: "Eritreia", code: "291", flag: "🇪🇷" },
    { name: "Eslováquia", code: "421", flag: "🇸🇰" },
    { name: "Eslovênia", code: "386", flag: "🇸🇮" },
    { name: "Espanha", code: "34", flag: "🇪🇸" },
    { name: "Estados Unidos", code: "1", flag: "🇺🇸" },
    { name: "Estônia", code: "372", flag: "🇪🇪" },
    { name: "Etiópia", code: "251", flag: "🇪🇹" },
    { name: "Filipinas", code: "63", flag: "🇵🇭" },
    { name: "Finlândia", code: "358", flag: "🇫🇮" },
    { name: "França", code: "33", flag: "🇫🇷" },
    { name: "Gabão", code: "241", flag: "🇬🇦" },
    { name: "Gâmbia", code: "220", flag: "🇬🇲" },
    { name: "Gana", code: "233", flag: "🇬🇭" },
    { name: "Geórgia", code: "995", flag: "🇬🇪" },
    { name: "Grécia", code: "30", flag: "🇬🇷" },
    { name: "Granada", code: "1-473", flag: "🇬🇩" },
    { name: "Groenlândia", code: "299", flag: "🇬🇱" },
    { name: "Guadalupe", code: "590", flag: "🇬🇵" },
    { name: "Guam", code: "1-671", flag: "🇬🇺" },
    { name: "Guatemala", code: "502", flag: "🇬🇹" },
    { name: "Guiana", code: "592", flag: "🇬🇾" },
    { name: "Guiana Francesa", code: "594", flag: "🇬🇫" },
    { name: "Guiné", code: "224", flag: "🇬🇳" },
    { name: "Guiné-Bissau", code: "245", flag: "🇬🇼" },
    { name: "Guiné Equatorial", code: "240", flag: "🇬🇶" },
    { name: "Haiti", code: "509", flag: "🇭🇹" },
    { name: "Holanda", code: "31", flag: "🇳🇱" },
    { name: "Honduras", code: "504", flag: "🇭🇳" },
    { name: "Hong Kong", code: "852", flag: "🇭🇰" },
    { name: "Hungria", code: "36", flag: "🇭🇺" },
    { name: "Índia", code: "91", flag: "🇮🇳" },
    { name: "Indonésia", code: "62", flag: "🇮🇩" },
    { name: "Irã", code: "98", flag: "🇮🇷" },
    { name: "Iraque", code: "964", flag: "🇮🇶" },
    { name: "Irlanda", code: "353", flag: "🇮🇪" },
    { name: "Islândia", code: "354", flag: "🇮🇸" },
    { name: "Israel", code: "972", flag: "🇮🇱" },
    { name: "Itália", code: "39", flag: "🇮🇹" },
    { name: "Jamaica", code: "1-876", flag: "🇯🇲" },
    { name: "Japão", code: "81", flag: "🇯🇵" },
    { name: "Jordânia", code: "962", flag: "🇯🇴" },
    { name: "Kuwait", code: "965", flag: "🇰🇼" },
    { name: "Líbano", code: "961", flag: "🇱🇧" },
    { name: "Líbia", code: "218", flag: "🇱🇾" },
    { name: "Luxemburgo", code: "352", flag: "🇱🇺" },
    { name: "Macau", code: "853", flag: "🇲🇴" },
    { name: "Macedônia", code: "389", flag: "🇲🇰" },
    { name: "Madagascar", code: "261", flag: "🇲🇬" },
    { name: "Malásia", code: "60", flag: "🇲🇾" },
    { name: "Malawi", code: "265", flag: "🇲🇼" },
    { name: "Maldivas", code: "960", flag: "🇲🇻" },
    { name: "Mali", code: "223", flag: "🇲🇱" },
    { name: "Malta", code: "356", flag: "🇲🇹" },
    { name: "Marrocos", code: "212", flag: "🇲🇦" },
    { name: "Martinica", code: "596", flag: "🇲🇶" },
    { name: "Maurício", code: "230", flag: "🇲🇺" },
    { name: "Mauritânia", code: "222", flag: "🇲🇷" },
    { name: "México", code: "52", flag: "🇲🇽" },
    { name: "Moçambique", code: "258", flag: "🇲🇿" },
    { name: "Moldávia", code: "373", flag: "🇲🇩" },
    { name: "Mônaco", code: "377", flag: "🇲🇨" },
    { name: "Mongólia", code: "976", flag: "🇲🇳" },
    { name: "Montenegro", code: "382", flag: "🇲🇪" },
    { name: "Namíbia", code: "264", flag: "🇳🇦" },
    { name: "Nepal", code: "977", flag: "🇳🇵" },
    { name: "Nicarágua", code: "505", flag: "🇳🇮" },
    { name: "Nigéria", code: "234", flag: "🇳🇬" },
    { name: "Noruega", code: "47", flag: "🇳🇴" },
    { name: "Nova Zelândia", code: "64", flag: "🇳🇿" },
    { name: "Omã", code: "968", flag: "🇴🇲" },
    { name: "Panamá", code: "507", flag: "🇵🇦" },
    { name: "Papua Nova Guiné", code: "675", flag: "🇵🇬" },
    { name: "Paquistão", code: "92", flag: "🇵🇰" },
    { name: "Paraguai", code: "595", flag: "🇵🇾" },
    { name: "Peru", code: "51", flag: "🇵🇪" },
    { name: "Polônia", code: "48", flag: "🇵🇱" },
    { name: "Portugal", code: "351", flag: "🇵🇹" },
    { name: "Porto Rico", code: "1-787", flag: "🇵🇷" },
    { name: "Quênia", code: "254", flag: "🇰🇪" },
    { name: "Quirguistão", code: "996", flag: "🇰🇬" },
    { name: "Reino Unido", code: "44", flag: "🇬🇧" },
    { name: "República Centro-Africana", code: "236", flag: "🇨🇫" },
    { name: "República Dominicana", code: "1-809", flag: "🇩🇴" },
    { name: "República Tcheca", code: "420", flag: "🇨🇿" },
    { name: "Romênia", code: "40", flag: "🇷🇴" },
    { name: "Rússia", code: "7", flag: "🇷🇺" },
    { name: "Ruanda", code: "250", flag: "🇷🇼" },
    { name: "Senegal", code: "221", flag: "🇸🇳" },
    { name: "Serra Leoa", code: "232", flag: "🇸🇱" },
    { name: "Sérvia", code: "381", flag: "🇷🇸" },
    { name: "Síria", code: "963", flag: "🇸🇾" },
    { name: "Somália", code: "252", flag: "🇸🇴" },
    { name: "Sri Lanka", code: "94", flag: "🇱🇰" },
    { name: "Suazilândia", code: "268", flag: "🇸🇿" },
    { name: "Sudão", code: "249", flag: "🇸🇩" },
    { name: "Suécia", code: "46", flag: "🇸🇪" },
    { name: "Suíça", code: "41", flag: "🇨🇭" },
    { name: "Suriname", code: "597", flag: "🇸🇷" },
    { name: "Tailândia", code: "66", flag: "🇹🇭" },
    { name: "Taiwan", code: "886", flag: "🇹🇼" },
    { name: "Tanzânia", code: "255", flag: "🇹🇿" },
    { name: "Togo", code: "228", flag: "🇹🇬" },
    { name: "Trinidad e Tobago", code: "1-868", flag: "🇹🇹" },
    { name: "Tunísia", code: "216", flag: "🇹🇳" },
    { name: "Turquia", code: "90", flag: "🇹🇷" },
    { name: "Ucrânia", code: "380", flag: "🇺🇦" },
    { name: "Uganda", code: "256", flag: "🇺🇬" },
    { name: "Uruguai", code: "598", flag: "🇺🇾" },
    { name: "Uzbequistão", code: "998", flag: "🇺🇿" },
    { name: "Vaticano", code: "379", flag: "🇻🇦" },
    { name: "Venezuela", code: "58", flag: "🇻🇪" },
    { name: "Vietnã", code: "84", flag: "🇻🇳" },
    { name: "Zâmbia", code: "260", flag: "🇿🇲" },
    { name: "Zimbábue", code: "263", flag: "🇿🇼" }
  ];

  // Template para o valor selecionado do DDI
  const ddiValueTemplate = (option) => {
    if (!option) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '6px',
        lineHeight: '14px',
        fontSize: '14px'
      }}>
        <span style={{ fontSize: '16px' }}>{option.flag}</span>
        <span style={{ 
          fontSize: '14px',
          fontWeight: '600',
          marginTop: '2px',
          color: 'var(--primaria)'
        }}>
          +{option.code}
        </span>
      </div>
    );
  };

  // Template para os itens da lista do DDI
  const ddiItemTemplate = (option) => {
    if (!option) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '14px',
        padding: '8px 12px'
      }}>
        <span style={{ fontSize: '18px' }}>{option.flag}</span>
        <span style={{ 
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--primaria)',
          minWidth: '30px'
        }}>
          +{option.code}
        </span>
        <span style={{ 
          color: 'var(--neutro-600)',
          fontSize: '14px'
        }}>
          {option.name}
        </span>
      </div>
    );
  };

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
    setDdi("55"); // Brasil como padrão
    setDdd("");
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
    console.log('Tentando salvar candidato:', { nome, email, cpf, nascimento, ddi, ddd, telefone });
    
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
        ddi,
        ddd,
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
              {/* Campos de telefone organizados em uma linha */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: '0 0 120px' }}>
                  <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden', flexShrink: 1, flexGrow: 0, boxSizing: 'border-box'}}>
                    <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'start', gap: '4px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--neutro-700)', marginBottom: '4px' }}>
                        DDI
                      </label>
                    </div>
                    <StyledDDIDropdown
                      value={(() => {
                        // Sempre retorna Brasil (55) como padrão
                        const ddiSelecionado = ddiOptions.find(ddi => String(ddi.code) === String(ddi));
                        return ddiSelecionado || ddiOptions.find(ddi => ddi.code === "55");
                      })()}
                      options={ddiOptions}
                      onChange={(e) => {
                        setDdi(e.value.code);
                      }}
                      optionLabel="name"
                      valueTemplate={ddiValueTemplate}
                      itemTemplate={ddiItemTemplate}
                      placeholder="DDI"
                      filter
                      camposVazios={camposVazios}
                      filterBy="name,code"
                      showClear={false}
                    />
                  </div>
                </div>
                <div style={{ flex: '0 0 80px' }}>
                  <CampoTexto
                    camposVazios={camposVazios}
                    name="ddd"
                    valor={ddd}
                    setValor={setDdd}
                    type="text"
                    label="DDD"
                    placeholder="DDD"
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <CampoTexto
                    name="telefone"
                    valor={telefone}
                    setValor={setTelefone}
                    label="Telefone"
                    maxCaracteres={11}
                    patternMask="99999999999"
                    placeholder="Número do telefone"
                  />
                </div>
              </div>
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