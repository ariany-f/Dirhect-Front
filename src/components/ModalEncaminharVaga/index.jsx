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
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { Real } from '@utils/formats'
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
  const [showEditorContent, setShowEditorContent] = useState(false);
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
      "{{filial}}": filial,
      "{{dataInicio}}": formatDate(dataInicio),
      "{{centroCusto}}": centroCusto,
      "{{salario}}": salario,
      "{{periculosidade}}": periculosidade.name ?? '',
      "{{dataExameMedico}}": formatDate(dataExameMedico),
    };
  
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
    aoSalvar(nome, email, mensagem, content);
  };

  const toggleEditorContent = () => {
    setShowEditorContent(!showEditorContent);
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = templates.find((template) => template.id === e.code);
    setSelectedTemplate(selectedTemplate);
    setEditorContent(selectedTemplate.content);
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
                <>
                  <DropdownItens
                    valor={selectedTemplate}
                    setValor={handleTemplateChange}
                    options={dropdownTemplates}
                    label="Template"
                    name="template"
                    placeholder="Selecione um template"
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
              <div dangerouslySetInnerHTML={{ __html: substituirVariaveis(editorContent) }} />
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
              aoClicar={handleSave}
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
