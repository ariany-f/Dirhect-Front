import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Editor } from "primereact/editor";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import BotaoGrupo from "@components/BotaoGrupo";
import DropdownItens from "@components/DropdownItens";
import Titulo from "@components/Titulo";
import { RiCloseFill } from "react-icons/ri";
import styles from "./ModalEncaminharVaga.module.css";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { Real } from '@utils/formats'
import http from '@http'
// Função para formatar a data
const formatDate = (date) => {
  if (!date) return "";
  const formattedDate = new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(formattedDate); // Formato dd/mm/yyyy
};

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

const VariaveisContainer = styled.div`
  margin-top: 4px;
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  background-color: #f9f9f9;
`;

const VariavelItem = styled.div`
  cursor: pointer;
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ddd;
  }
`;

const PreviewContainer = styled.div`
  /* Alinhamento padrão à esquerda */
  text-align: left;

  /* Alinhamento do Quill */
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }

  /* Listas */
  ol, ul {
    margin-left: 1.5em;
    padding-left: 1.5em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ol { list-style-type: decimal; list-style-position: inside; }
  ul { list-style-type: disc; list-style-position: inside; }

  li {
    margin-bottom: 0.2em;
    text-align: left;
    font-size: 13px;
  }

  /* Parágrafos */
  p {
    margin: 0.2em 0 0.2em 0;
    text-align: left;
    font-size: 13px;
  }

  /* Subheading */
  h2 {
    margin: 0.2em 0 0.2em 0;
    text-align: left;
    font-size: 19.5px;
  }
`;

function gerarHtmlComEstilo(conteudoHtml) {
  return `
    <style>
      body, p, li { font-size: 13px; }
      h2 { font-size: 19.5px; }
      ul { list-style-type: disc; list-style-position: inside; margin-left: 1.5em; padding-left: 1.5em; }
      ol { list-style-type: decimal; list-style-position: inside; margin-left: 1.5em; padding-left: 1.5em; }
      li { margin-bottom: 0.2em; text-align: left; }
      .ql-align-center { text-align: center; }
      .ql-align-right { text-align: right; }
      .ql-align-justify { text-align: justify; }
    </style>
    <div>${conteudoHtml}</div>
  `;
}

function ModalEncaminharVaga({ opened = false, aoFechar, aoSalvar, periculosidadeInicial, candidato = null, vagaId }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [salario, setSalario] = useState("");
  const [periculosidade, setPericulosidade] = useState(periculosidadeInicial || "");
  const [candidatoId, setCandidatoId] = useState(null);
  const [ultimoCpfBuscado, setUltimoCpfBuscado] = useState(null);
  const [dropdownTemplates, setDropdownTemplates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [dataExameMedico, setDataExameMedico] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [listaPericulosidades, setListaPericulosidades] = useState([
    { code: 'QC', name: 'Trabalho com Substâncias Químicas Perigosas' },
    { code: 'MP', name: 'Atividades com Máquinas e Equipamentos Pesados' },
    { code: 'HA', name: 'Trabalho em Altura' },
    { code: 'RA', name: 'Exposição a Radiação' },
    { code: 'TE', name: 'Trabalho com Energia Elétrica' },
    { code: 'CE', name: 'Exposição ao Calor Excessivo' },
    { code: 'PE', name: 'Atividades com Produtos Explosivos' },
    { code: 'CA', name: 'Trabalho em Ambientes Confinedos' },
    { code: 'SA', name: 'Atividades Subaquáticas' },
    { code: 'RAU', name: 'Exposição a Ruídos Altos' },
    { code: 'PB', name: 'Perigos Biológicos' },
    { code: 'TE', name: 'Exposição a Temperaturas Extremas' },
    { code: 'DA', name: 'Trabalho em Áreas de Desastres ou Emergências' },
    { code: 'MC', name: 'Manipulação de Materiais Cortantes' },
    { code: 'SC', name: 'Exposição a Substâncias Cancerígenas' }
  ]);
  const [editorContent, setEditorContent] = useState("");
  const [showEditorContent, setShowEditorContent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const variaveis = [
    { value: "{{nome}}", label: "Nome Completo" },
    { value: "{{email}}", label: "E-mail" },
    { value: "{{mensagem}}", label: "Mensagem" },
    { value: "{{nascimento}}", label: "Data de Nascimento" },
    { value: "{{cpf}}", label: "CPF" },
    { value: "{{telefone}}", label: "Telefone" },
    { value: "{{dataInicio}}", label: "Data de Início" },
    { value: "{{salario}}", label: "Salário" },
    { value: "{{periculosidade}}", label: "Periculosidade" },
    { value: "{{dataExameMedico}}", label: "Data do Exame Médico" },
    // Variáveis do candidato
    { value: "{{candidato_nome}}", label: "Nome do Candidato" },
    { value: "{{candidato_email}}", label: "Email do Candidato" },
    { value: "{{candidato_cpf}}", label: "CPF do Candidato" },
    { value: "{{candidato_nascimento}}", label: "Nascimento do Candidato" },
    { value: "{{candidato_telefone}}", label: "Telefone do Candidato" },
  ];

  const substituirVariaveis = (conteudo) => {
    if (!conteudo) return "";
    
    let novoConteudo = conteudo;
  
    // Mapeia as variáveis e suas respectivas substituições
    const variaveisMap = {
      "{{nome}}": nome,
      "{{email}}": email,
      "{{mensagem}}": mensagem,
      "{{nascimento}}": formatDate(nascimento), 
      "{{cpf}}": cpf,
      "{{telefone}}": telefone,
      "{{dataInicio}}": formatDate(dataInicio),
      "{{salario}}": salario,
      "{{periculosidade}}": periculosidade.name ?? '',
      "{{dataExameMedico}}": formatDate(dataExameMedico),
      // Variáveis do candidato
      "{{candidato_nome}}": candidato?.nome || nome,
      "{{candidato_email}}": candidato?.email || email,
      "{{candidato_cpf}}": candidato?.cpf ? candidato.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf,
      "{{candidato_nascimento}}": candidato?.dt_nascimento ? formatDate(candidato.dt_nascimento) : formatDate(nascimento),
      "{{candidato_telefone}}": candidato?.telefone || telefone,
    };

    console.log('Variáveis disponíveis para substituição:', variaveisMap);
  
    // Substituir todas as ocorrências das variáveis
    Object.keys(variaveisMap).forEach((variavel) => {
      const valor = variaveisMap[variavel] || "";
      const regex = new RegExp(variavel, "g");
      novoConteudo = novoConteudo.replace(regex, valor);
    });
  
    return novoConteudo;
  };  

  const handleAddVariable = (variable) => {
    const updatedContent = editorContent + variable;
    setEditorContent(updatedContent);
  };

  const handleSave = () => {
    const content = editorContent;
    aoSalvar(
        candidatoId,
        nome,
        email,
        mensagem,
        content,
        cpf,
        nascimento,
        telefone,
        dataInicio,
        salario,
        periculosidade,
        dataExameMedico
    );
  };

  const toggleEditorContent = () => {
    setShowEditorContent(!showEditorContent);
  };

  const handleTemplateChange = (e) => {
    const template = templates.find((template) => template.id === e.code);
    if (template) {
      setSelectedTemplate(e);
      setEditorContent(template.body_html || template.content || '');
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        console.log('Buscando templates da API...');
        const response = await http.get('email_templates/');
        console.log('Templates recebidos:', response);
        
        if (response && response.length > 0) {
          setTemplates(response);
          const dropdown = response.map((item) => ({
            name: item.name,
            code: item.id
          }));
          console.log('Dropdown criado:', dropdown);
          setDropdownTemplates(dropdown);
          
          // Seleciona o primeiro template por padrão
          if (dropdown.length > 0 && !selectedTemplate) {
            const primeiroTemplate = response[0];
            console.log('Primeiro template selecionado:', primeiroTemplate);
            setSelectedTemplate(dropdown[0]);
            setEditorContent(primeiroTemplate.body_html || primeiroTemplate.content || '');
          }
        } else {
          console.log('Nenhum template encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Atualiza a periculosidade quando a periculosidadeInicial mudar
  useEffect(() => {
    if (periculosidadeInicial) {
      setPericulosidade(periculosidadeInicial);
    }
  }, [periculosidadeInicial]);

  // Preenche os campos com os dados do candidato quando disponível
  useEffect(() => {
    if (candidato) {
      console.log('Dados do candidato recebidos:', candidato);
      setNome(candidato.nome || '');
      setEmail(candidato.email || '');
      setTelefone(candidato.telefone || '');
      setNascimento(candidato.dt_nascimento || '');
      setCandidatoId(candidato.id);
      
      // Formata o CPF se disponível
      if (candidato.cpf) {
        const cpfFormatado = candidato.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        setCpf(cpfFormatado);
        console.log('CPF formatado:', cpfFormatado);
      }
      
      // Define periculosidade se disponível
      if (candidato.periculosidade) {
        const periculosidadeEncontrada = listaPericulosidades.find(
          p => p.code === candidato.periculosidade
        );
        if (periculosidadeEncontrada) {
          setPericulosidade(periculosidadeEncontrada);
        }
      }
    }
  }, [candidato]);

  const buscarCandidatoPorCPF = async (cpfNumeros) => {
    // Se o CPF for igual ao último buscado, não faz a busca
    if (cpfNumeros === ultimoCpfBuscado) {
      return;
    }

    try {
      const response = await http.get(`candidato/?cpf=${cpfNumeros}`);
      if (response && response.length > 0) {
        const candidato = response[0];
        setCandidatoId(candidato.id);
        setNome(candidato.nome || '');
        setEmail(candidato.email || '');
        setTelefone(candidato.telefone || '');
        setNascimento(candidato.dt_nascimento || '');
        if (candidato.periculosidade) {
          const periculosidadeEncontrada = listaPericulosidades.find(
            p => p.code === candidato.periculosidade
          );
          if (periculosidadeEncontrada) {
            setPericulosidade(periculosidadeEncontrada);
          }
        }
      } else {
        setCandidatoId(null);
      }
      // Atualiza o último CPF buscado
      setUltimoCpfBuscado(cpfNumeros);
    } catch (error) {
      console.error('Erro ao buscar candidato:', error);
      setCandidatoId(null);
      setUltimoCpfBuscado(null);
    }
  };

  const handleCpfChange = (value) => {
    setCpf(value);
    // Remove todos os caracteres não numéricos do CPF
    const cpfNumeros = value.replace(/\D/g, '');
    // Se o CPF tiver 11 dígitos e for diferente do último buscado, faz a busca
    if (cpfNumeros.length === 11 && cpfNumeros !== ultimoCpfBuscado) {
      buscarCandidatoPorCPF(cpfNumeros);
    }
  };

  const handleEnviar = () => {
    if (!candidatoId || !editorContent) return;
    const html_content = gerarHtmlComEstilo(substituirVariaveis(editorContent));
    const payload = {
      html_content,
      dt_inscricao: new Date().toISOString().slice(0, 10),
      status: "S",
      candidato: candidatoId,
      vaga: vagaId
    };
    if (aoSalvar) aoSalvar(payload); // Envia os dados para o pai
  };

  return (
    opened &&
    <Overlay>
      <DialogEstilizado $width="95vw" $minWidth="80vw" open={opened}>
        <Frame>
          <Titulo>
            <button className="close" onClick={aoFechar}>
              <RiCloseFill size={20} className="fechar" />  
            </button>
            <h6>Encaminhar vaga para novo candidato</h6>
          </Titulo>
        </Frame>
        <Frame padding="24px 0px">
          <Col12>
            <Col6>
              {!showEditorContent ? (
                <Col12>
                  <Col6>
                    <CampoTexto valor={mensagem} type="text" setValor={setMensagem} label="Mensagem" />
                    <DropdownItens width="150px" valor={periculosidade} setValor={setPericulosidade} options={listaPericulosidades} label="Periculosidades" name="periculosidade" placeholder="Periculosidades"/> 
                  </Col6>
                  <Col6>
                    <CampoTexto valor={dataInicio} type="date" setValor={setDataInicio} label="Data de Início" />
                    <CampoTexto patternMask={'BRL'} valor={salario} type="text" setValor={setSalario} label="Salário" />
                    <CampoTexto valor={dataExameMedico} type="date" setValor={setDataExameMedico} label="Data do Exame Médico" />
                  </Col6>
                </Col12>
              ) : (
                <>
                  <DropdownItens
                    valor={selectedTemplate}
                    setValor={handleTemplateChange}
                    options={dropdownTemplates}
                    label="Template"
                    name="template"
                    placeholder={loadingTemplates ? "Carregando templates..." : dropdownTemplates.length === 0 ? "Nenhum template disponível" : "Selecione um template"}
                    disabled={loadingTemplates}
                  />
                  <Editor
                    value={editorContent}
                    onTextChange={(e) => setEditorContent(e.htmlValue)}
                    style={{ height: '240px' }}
                  />
                  <VariaveisContainer>
                    {variaveis.map((variavel, index) => (
                      <VariavelItem
                        key={index}
                        onClick={() => handleAddVariable(variavel.value)}
                      >
                        {variavel.label}
                      </VariavelItem>
                    ))}
                  </VariaveisContainer>
                </>
              )}
            </Col6>
            <Col6>
              <PreviewContainer dangerouslySetInnerHTML={{ __html: substituirVariaveis(editorContent) }} />
            </Col6>
          </Col12>
        </Frame>
        <div className={styles.containerBottom}>
          <BotaoGrupo>
            <Botao
              aoClicar={toggleEditorContent}
              estilo="neutro"
              size="medium"
              filled
            >
              {showEditorContent ? "Voltar para Dados" : "Editar Template"}
            </Botao>
            <Botao
              aoClicar={handleEnviar}
              estilo="vermilion"
              size="medium"
              filled
            >
              Enviar
            </Botao>
          </BotaoGrupo>
        </div>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalEncaminharVaga;

