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
  flex-direction: column;
  gap: 8px;
  background-color: #f9f9f9;
`;

const CategoriaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CategoriaTitulo = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
`;

const VariaveisGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
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

const VariavelItemObrigatoria = styled.div`
  cursor: pointer;
  background-color: #ffebee;
  border: 2px solid #f44336;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #d32f2f;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffcdd2;
  }

  &::after {
    content: " *";
    color: #f44336;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  flex-shrink: 0;
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 0px;
`;

const ModalFooter = styled.div`
  flex-shrink: 0;
  padding: 16px;
  border-top: 1px solid var(--neutro-200);
  background-color: white;
`;

function ModalEmail({ opened = false, aoFechar, aoSalvar, email, viewMode = false }) {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("geral");
  const [quillInstance, setQuillInstance] = useState(null);
  const editorRef = useRef(null);

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 5000
    });
  };

  const categorias = [
    { code: "geral", name: "Geral" },
    { code: "encaminhamento", name: "Encaminhamento de Vaga" },
  ];

  const variaveisPorCategoria = {
    geral: [
      { value: "{{nome}}", label: "Nome do Candidato" },
      { value: "{{cargo}}", label: "Cargo" },
      { value: "{{filial}}", label: "Filial" },
      { value: "{{data}}", label: "Data" },
      { value: "{{salario}}", label: "Salário" },
      { value: "{{departamento}}", label: "Departamento" },
      { value: "{{centro_custo}}", label: "Centro de Custo" },
    ],
    encaminhamento: [
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
      { value: "{{candidato_nome}}", label: "Nome do Candidato" },
      { value: "{{candidato_email}}", label: "Email do Candidato" },
      { value: "{{candidato_cpf}}", label: "CPF do Candidato" },
      { value: "{{candidato_nascimento}}", label: "Nascimento do Candidato" },
      { value: "{{candidato_telefone}}", label: "Telefone do Candidato" },
      { value: "{{link_acesso}}", label: "Link de Acesso", obrigatoria: true },
    ]
  };

  const variaveisAtuais = variaveisPorCategoria[categoriaSelecionada] || [];

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
    console.log('handleAddVariable chamado com:', variable);
    console.log('Modal aberto:', opened);
    console.log('viewMode:', viewMode);
    
    // Verifica se o modal está aberto e não está em modo de visualização
    if (!opened || viewMode) {
      console.log('Modal não está aberto ou está em modo de visualização');
      return;
    }
    
    // Aguarda um momento para garantir que o DOM esteja renderizado
    setTimeout(() => {
      // Tenta usar a instância armazenada primeiro
      if (quillInstance) {
        console.log('Usando quillInstance armazenada');
        insertVariableAtCursor(quillInstance, variable);
        return;
      }
      
      // Tenta usar a referência React do PrimeReact Editor
      if (editorRef.current) {
        console.log('Usando editorRef.current');
        console.log('Métodos disponíveis em editorRef:', Object.getOwnPropertyNames(Object.getPrototypeOf(editorRef.current)));
        
        // Tenta diferentes métodos para obter a instância do Quill
        let quill = null;
        
        if (editorRef.current.getQuill) {
          quill = editorRef.current.getQuill();
          console.log('Tentando getQuill()');
        } else if (editorRef.current.quill) {
          quill = editorRef.current.quill;
          console.log('Tentando editorRef.current.quill');
        } else if (editorRef.current.getEditor) {
          quill = editorRef.current.getEditor();
          console.log('Tentando getEditor()');
        }
        
        if (quill) {
          console.log('Quill encontrado via editorRef:', quill);
          insertVariableAtCursor(quill, variable);
          return;
        } else {
          console.log('Nenhum método encontrado para obter Quill via editorRef');
        }
      }
      
      // Se não tem instância armazenada, tenta buscar no DOM
      // Tenta diferentes seletores para encontrar o editor
      let editorElement = document.querySelector('.p-editor-content');
      if (!editorElement) {
        editorElement = document.querySelector('.ql-container');
        console.log('Tentando .ql-container');
      }
      if (!editorElement) {
        editorElement = document.querySelector('.ql-editor');
        console.log('Tentando .ql-editor');
      }
      if (!editorElement) {
        editorElement = document.querySelector('[data-pc-name="editor"]');
        console.log('Tentando [data-pc-name="editor"]');
      }
      
      if (!editorElement) {
        console.log('Editor element não encontrado com nenhum seletor');
        console.log('Elementos disponíveis:', document.querySelectorAll('.p-editor, .ql-container, .ql-editor, [data-pc-name="editor"]'));
        return;
      }
      
      console.log('Editor element encontrado:', editorElement);
      console.log('Classes do editor:', editorElement.className);
      
      // Busca a instância do Quill do PrimeReact Editor
      let quill = editorElement.__quill || editorElement.quill;
      
      // Se não encontrou no elemento direto, busca no parent
      if (!quill && editorElement.parentElement) {
        quill = editorElement.parentElement.__quill || editorElement.parentElement.quill;
        console.log('Buscando no parent element');
      }
      
      // Se ainda não encontrou, busca em todos os elementos filhos
      if (!quill) {
        const allElements = editorElement.querySelectorAll('*');
        for (let element of allElements) {
          if (element.__quill || element.quill) {
            quill = element.__quill || element.quill;
            console.log('Quill encontrado em elemento filho:', element);
            break;
          }
        }
      }
      
      if (!quill) {
        console.log('Quill instance não encontrada no editor');
        console.log('Propriedades do editor element:', Object.keys(editorElement));
        return;
      }
      
      console.log('Quill encontrado no DOM:', quill);
      insertVariableAtCursor(quill, variable);
    }, 200); // Aguarda 200ms para o DOM estar renderizado
  };

  const insertVariableAtCursor = (quill, variable) => {
    // Foca no editor
    quill.focus();
    
    // Aguarda um momento para o foco ser estabelecido
    setTimeout(() => {
      // Obtém a posição atual do cursor
      const range = quill.getSelection();
      console.log('Range atual:', range);
      
      if (range && range.index !== null) {
        console.log('Inserindo na posição:', range.index);
        // Usa insertText da API oficial do Quill para inserir na posição do cursor
        quill.insertText(range.index, variable);
        
        // Move o cursor para depois da variável inserida
        quill.setSelection(range.index + variable.length, 0);
        
        // Atualiza o estado com o novo conteúdo
        const newContent = quill.root.innerHTML;
        setEditorContent(newContent);
      } else {
        console.log('Sem seleção, inserindo no final');
        // Se não há seleção, insere no final
        const length = quill.getLength();
        quill.insertText(length - 1, variable);
        quill.setSelection(length - 1 + variable.length, 0);
        
        // Atualiza o estado com o novo conteúdo
        const newContent = quill.root.innerHTML;
        setEditorContent(newContent);
      }
    }, 100);
  };

  const onEditorReady = (quill) => {
    console.log('onEditorReady chamado!');
    console.log('Quill recebido:', quill);
    console.log('Tipo do quill:', typeof quill);
    console.log('Métodos disponíveis:', Object.getOwnPropertyNames(Object.getPrototypeOf(quill)));
    
    // Armazena a instância do Quill
    setQuillInstance(quill);
    
    // Também armazena na referência para backup
    if (editorRef.current) {
      editorRef.current.quill = quill;
      console.log('Quill armazenado na referência também');
    }
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
      <DialogEstilizado $width="95vw" $minWidth="80vw" $maxHeight="90vh" open={opened}>
        <ModalContainer>
          <ModalHeader>
            <Frame>
              <Titulo>
                <button className="close" onClick={aoFechar}>
                  <RiCloseFill size={20} className="fechar" />  
                </button>
                <h6>{viewMode ? 'Visualizar Email' : (email ? 'Editar Email' : 'Novo Email')}</h6>
              </Titulo>
            </Frame>
          </ModalHeader>
          
          <ModalContent>
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
                  ref={editorRef}
                  value={editorContent}
                  onTextChange={(e) => setEditorContent(e.htmlValue)}
                  style={{ height: '140px' }}
                  readOnly={viewMode}
                  onEditorReady={onEditorReady}
                />
                {!viewMode && (
                  <VariaveisContainer>
                    <DropdownItens
                      valor={categorias.find(cat => cat.code === categoriaSelecionada)}
                      setValor={(cat) => setCategoriaSelecionada(cat.code)}
                      options={categorias}
                      label="Categoria de Variáveis"
                      name="categoria"
                      placeholder="Selecione uma categoria"
                    />
                    <CategoriaContainer>
                      <CategoriaTitulo>
                        Variáveis - {categorias.find(cat => cat.code === categoriaSelecionada)?.name}
                      </CategoriaTitulo>
                      <VariaveisGrid>
                        {variaveisAtuais.map((variavel, index) => {
                          const VariavelComponent = variavel.obrigatoria ? VariavelItemObrigatoria : VariavelItem;
                          return (
                            <VariavelComponent
                              key={index}
                              onClick={() => handleAddVariable(variavel.value)}
                            >
                              {variavel.label}
                            </VariavelComponent>
                          );
                        })}
                      </VariaveisGrid>
                    </CategoriaContainer>
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
          </ModalContent>
          
          <ModalFooter>
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
          </ModalFooter>
        </ModalContainer>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalEmail;
