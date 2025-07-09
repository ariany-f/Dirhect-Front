import React, { useState, useEffect, useRef } from "react";
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
import { Checkbox } from 'primereact/checkbox';
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
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editorContent, setEditorContent] = useState("");

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000
    });
  };

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
      setName(email.name || '');
      setSubject(email.subject || '');
      setBodyHtml(email.body_html || '');
      setBodyText(email.body_text || '');
      setIsActive(email.is_active !== undefined ? email.is_active : true);
      setEditorContent(email.body_html || '');
    } else {
      // Limpa os campos quando for criar novo
      setName("");
      setSubject("");
      setBodyHtml("");
      setBodyText("");
      setIsActive(true);
      setEditorContent("");
    }
  }, [email]);

  const handleAddVariable = (variable) => {
    const updatedContent = editorContent + variable;
    setEditorContent(updatedContent);
  };

  const handleSave = () => {
    // Validações conforme a especificação da API
    if (!name || name.trim().length === 0) {
      showError('Por favor, preencha o nome do template.');
      return;
    }
    
    if (name.trim().length > 100) {
      showError('O nome deve ter no máximo 100 caracteres.');
      return;
    }

    if (!subject || subject.trim().length === 0) {
      showError('Por favor, preencha o assunto do email.');
      return;
    }

    if (subject.trim().length > 255) {
      showError('O assunto deve ter no máximo 255 caracteres.');
      return;
    }

    if (!editorContent || editorContent.trim().length === 0) {
      showError('Por favor, preencha o corpo do email.');
      return;
    }

    aoSalvar({
      id: email?.id,
      name: (name || '').trim(),
      subject: (subject || '').trim(),
      body_html: editorContent || '',
      body_text: bodyText ? bodyText.trim() : null,
      is_active: isActive
    });
  };

  return (
    opened &&
    <Overlay>
      <Toast ref={toast} />
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
                    valor={name} 
                    type="text" 
                    setValor={setName} 
                    label="Nome do Email" 
                    placeholder="Digite o nome do email"
                    disabled={viewMode}
                    maxLength={100}
                  />
                </Col6>
                <Col6>
                  <CampoTexto 
                    valor={subject} 
                    type="text" 
                    setValor={setSubject} 
                    label="Assunto" 
                    placeholder="Digite o assunto do email"
                    disabled={viewMode}
                    maxLength={255}
                  />
                </Col6>
              </Col12>
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
              <CampoTexto 
                valor={bodyText} 
                type="textarea" 
                setValor={setBodyText} 
                label="Versão Texto Plano (Opcional)" 
                placeholder="Digite a versão em texto plano do email"
                disabled={viewMode}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <Checkbox
                  inputId="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.checked)}
                  disabled={viewMode}
                />
                <label htmlFor="isActive" style={{ cursor: viewMode ? 'default' : 'pointer' }}>
                  Template Ativo
                </label>
              </div>
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
