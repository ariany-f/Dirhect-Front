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
import templates from "@json/templates-encaminhar-vaga.json";

// Função para formatar a data
const formatDate = (date) => {
  if (!date) return "";
  const formattedDate = new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(formattedDate); // Formato dd/mm/yyyy
};

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.80);
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  top: 0;
  right: 0;
  overflow-y: auto;
  bottom: 0;
  left: 0;
  align-items: flex-start;
  justify-content: center;
  padding: 5vh 0;
`;

const DialogEstilizado = styled.dialog`
  position: relative;
  width: 80vw;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2vh auto;
  margin-top: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: none;
  padding: 24px;
  & button.close {
    & .fechar {
      box-sizing: initial;
      fill: var(--primaria);
      stroke: var(--primaria);
      color: var(--primaria);
    }
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    border: none;
    background-color: initial;
  }
`;

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
  margin-top: 16px;
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
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

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function ModalEncaminharVaga({ opened = false, aoFechar, aoSalvar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [filial, setFilial] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [salario, setSalario] = useState("");
  const [periculosidade, setPericulosidade] = useState("");
  const [dropdownTemplates, setDropdownTemplates] = useState([]);
  const [dataExameMedico, setDataExameMedico] = useState("");
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
  const [showEditorContent, setShowEditorContent] = useState(false); // Controle para mostrar o conteúdo do editor
  const [selectedTemplate, setSelectedTemplate] = useState(null); 

  const variaveis = [
    { value: "{{nome}}", label: "Nome Completo" },
    { value: "{{email}}", label: "E-mail" },
    { value: "{{mensagem}}", label: "Mensagem" },
    { value: "{{nascimento}}", label: "Data de Nascimento" },
    { value: "{{cpf}}", label: "CPF" },
    { value: "{{telefone}}", label: "Telefone" },
    { value: "{{filial}}", label: "Filial" },
    { value: "{{dataInicio}}", label: "Data de Início" },
    { value: "{{centroCusto}}", label: "Centro de Custo" },
    { value: "{{salario}}", label: "Salário" },
    { value: "{{periculosidade}}", label: "Periculosidade" },
    { value: "{{dataExameMedico}}", label: "Data do Exame Médico" },
  ];

  // Função para substituir as variáveis no conteúdo do editor
  const substituirVariaveis = (conteudo) => {
    let novoConteudo = conteudo;

    // Substituir cada variável pela correspondente no estado
    novoConteudo = novoConteudo.replace("{{nome}}", nome);
    novoConteudo = novoConteudo.replace("{{email}}", email);
    novoConteudo = novoConteudo.replace("{{mensagem}}", mensagem);
    novoConteudo = novoConteudo.replace("{{nascimento}}", formatDate(nascimento)); // Formata a data de nascimento
    novoConteudo = novoConteudo.replace("{{cpf}}", cpf);
    novoConteudo = novoConteudo.replace("{{telefone}}", telefone);
    novoConteudo = novoConteudo.replace("{{filial}}", filial);
    novoConteudo = novoConteudo.replace("{{dataInicio}}", formatDate(dataInicio)); // Formata a data de início
    novoConteudo = novoConteudo.replace("{{centroCusto}}", centroCusto);
    novoConteudo = novoConteudo.replace("{{salario}}", salario);
    novoConteudo = novoConteudo.replace("{{periculosidade}}", periculosidade.name ?? '');
    novoConteudo = novoConteudo.replace("{{dataExameMedico}}", formatDate(dataExameMedico)); // Formata a data do exame médico

    return novoConteudo;
  };

  const handleAddVariable = (variable) => {
    // Apenas adicionar a variável ao conteúdo atual do editor
    const updatedContent = editorContent + variable; // Concatenar a variável ao conteúdo
    setEditorContent(updatedContent); // Atualizar conteúdo no estado
  };

  const handleSave = () => {
    const content = editorContent;
    aoSalvar(nome, email, mensagem, content);
  };

  const toggleEditorContent = () => {
    setShowEditorContent(!showEditorContent);
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = templates.find((template) => template.id === e.code);
    setSelectedTemplate(selectedTemplate);
    setEditorContent(selectedTemplate.content); // Preencher o editor com o conteúdo do template
  };

  useEffect(() => {
    if (templates) {
      const dropdown = templates.map((item) => ({
        name: item.name,
        code: item.id
      }));

      setDropdownTemplates(dropdown);
    }
  }, [templates]);

  return (
    opened &&
    <Overlay>
      <DialogEstilizado open={opened}>
        <Frame>
          <Titulo>
            <form method="dialog">
              <button className="close" onClick={aoFechar} formMethod="dialog">
                <RiCloseFill size={20} className="fechar" />  
              </button>
            </form>
            <h6>Encaminhar vaga para novo candidato</h6>
          </Titulo>
        </Frame>
        <Frame padding="24px 0px">
          <Col12>
            <Col6>
              {!showEditorContent ? (
                <Col12>
                  <Col6>
                    <CampoTexto valor={nome} type="text" setValor={setNome} label="Nome" />
                    <CampoTexto valor={email} type="text" setValor={setEmail} label="E-mail" />
                    <CampoTexto valor={mensagem} type="text" setValor={setMensagem} label="Mensagem" />
                    <CampoTexto patternMask={['999.999.999-99']} valor={cpf} type="text" setValor={setCpf} label="CPF" />
                    <DropdownItens valor={periculosidade} setValor={setPericulosidade} options={listaPericulosidades} label="Periculosidades" name="periculosidade" placeholder="Periculosidades"/> 
                  </Col6>
                  <Col6>
                    <CampoTexto patternMask={['(99) 99999-9999']} valor={telefone} type="text" setValor={setTelefone} label="Telefone" />
                    <CampoTexto valor={nascimento} type="date" setValor={setNascimento} label="Data de Nascimento" />
                    <CampoTexto valor={dataInicio} type="date" setValor={setDataInicio} label="Data de Início" />
                    <CampoTexto patternMask={'BRL'} valor={salario} type="text" setValor={setSalario} label="Salário" />
                    <CampoTexto valor={dataExameMedico} type="date" setValor={setDataExameMedico} label="Data do Exame Médico" />
                  </Col6>
                </Col12>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: substituirVariaveis(editorContent) }}></div> // Exibe o conteúdo renderizado como HTML com as variáveis substituídas
              )}
            </Col6>

            <Col6>
              <DropdownItens valor={selectedTemplate} setValor={handleTemplateChange} options={dropdownTemplates} label="Selecione um Template" name="template" placeholder="Template"/>

              {/* Exibe o Quill Editor */}
              <Editor
                value={editorContent}
                onTextChange={(e) => setEditorContent(e.htmlValue)} // Atualiza o conteúdo com o valor do editor
                style={{ height: "300px" }}
              />

              {/* Variáveis */}
              <VariaveisContainer>
                <h6>Variáveis disponíveis</h6>
                {variaveis.map((variavel) => (
                  <VariavelItem key={variavel.value} onClick={() => handleAddVariable(variavel.value)}>
                    {variavel.label}
                  </VariavelItem>
                ))}
              </VariaveisContainer>
            </Col6>
          </Col12>

          <div className={styles.containerBottom}>
                <BotaoGrupo>
                    <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>
                        Voltar
                    </Botao>
                    <Botao aoClicar={toggleEditorContent} estilo="vermilion" size="medium" filled>
                        {showEditorContent ? "Editar Conteúdo" : "Visualizar Conteúdo"}
                    </Botao>
                </BotaoGrupo>
                <Botao aoClicar={handleSave} estilo="vermilion" size="medium" filled>
                    Confirmar
                </Botao>
          </div>
        </Frame>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalEncaminharVaga;
