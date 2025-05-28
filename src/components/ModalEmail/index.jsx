import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Editor } from "primereact/editor";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import BotaoGrupo from "@components/BotaoGrupo";
import DropdownItens from "@components/DropdownItens";
import Titulo from "@components/Titulo";
import { RiCloseFill } from "react-icons/ri";
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

function ModalEmail({ opened = false, aoFechar, aoSalvar, email, viewMode = false }) {
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [corpo, setCorpo] = useState("");
  const [gatilho, setGatilho] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const gatilhos = [
    { name: 'Abertura de Vaga', code: 'Aberta' },
    { name: 'Candidatura', code: 'CANDIDATURA' },
    { name: 'Contratação', code: 'CONTRATADO' },
    { name: 'Cancelamento', code: 'CANCELADA' },
    { name: 'Reprovação', code: 'REPROVADO' },
  ];

  const variaveis = [
    { value: "{{nome}}", label: "Nome do Candidato" },
    { value: "{{cargo}}", label: "Cargo" },
    { value: "{{filial}}", label: "Filial" },
    { value: "{{data}}", label: "Data" },
    { value: "{{salario}}", label: "Salário" },
    { value: "{{departamento}}", label: "Departamento" },
    { value: "{{centro_custo}}", label: "Centro de Custo" },
  ];

  useEffect(() => {
    if (email) {
      setNome(email.nome);
      setAssunto(email.assunto);
      setCorpo(email.corpo);
      setGatilho(gatilhos.find(g => g.code === email.gatilho));
      setEditorContent(email.corpo);
    } else {
      // Limpa os campos quando for criar novo
      setNome("");
      setAssunto("");
      setCorpo("");
      setGatilho(null);
      setEditorContent("");
    }
  }, [email]);

  const handleAddVariable = (variable) => {
    const updatedContent = editorContent + variable;
    setEditorContent(updatedContent);
  };

  const handleSave = () => {
    if (!nome || !assunto || !editorContent || !gatilho) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    aoSalvar({
      id: email?.id,
      nome,
      assunto,
      corpo: editorContent,
      gatilho: gatilho?.code
    });
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
            <h6>{viewMode ? 'Visualizar Email' : (email ? 'Editar Email' : 'Novo Email')}</h6>
          </Titulo>
        </Frame>
        <Frame padding="24px 0px">
          <Col12>
            <Col6>
              <Col12>
                <Col6>
                  <CampoTexto 
                    valor={nome} 
                    type="text" 
                    setValor={setNome} 
                    label="Nome do Email" 
                    placeholder="Digite o nome do email"
                    disabled={viewMode}
                  />
                </Col6>
                <Col6>
                  <CampoTexto 
                    valor={assunto} 
                    type="text" 
                    setValor={setAssunto} 
                    label="Assunto" 
                    placeholder="Digite o assunto do email"
                    disabled={viewMode}
                  />
                </Col6>
              </Col12>
              <DropdownItens 
                valor={gatilho} 
                setValor={setGatilho} 
                options={gatilhos} 
                label="Gatilho" 
                name="gatilho" 
                placeholder="Selecione o gatilho"
                disabled={viewMode}
              />
              <Editor
                value={editorContent}
                onTextChange={(e) => setEditorContent(e.htmlValue)}
                style={{ height: '140px' }}
                readOnly={viewMode}
              />
              {!viewMode && (
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
              )}
            </Col6>
            <Col6>
              <div dangerouslySetInnerHTML={{ __html: editorContent }} />
            </Col6>
          </Col12>
        </Frame>
        <div style={{ padding: '16px', borderTop: '1px solid var(--neutro-200)' }}>
          <BotaoGrupo>
            <Botao
              aoClicar={aoFechar}
              estilo="neutro"
              size="medium"
              filled
            >
              {viewMode ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!viewMode && (
              <Botao
                aoClicar={handleSave}
                estilo="primaria"
                size="medium"
                filled
              >
                {email ? 'Salvar' : 'Criar'}
              </Botao>
            )}
          </BotaoGrupo>
        </div>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalEmail;
