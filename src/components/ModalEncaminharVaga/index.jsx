import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import { RiCloseFill } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import styles from "./ModalAdicionarDepartamento.module.css";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";


const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    top: 0;
    right: 0;
    overflow-y: auto;
    bottom: 0;
    left: 0;
    align-items: flex-start; /* Garante espaço acima */
    justify-content: center;
    overflow-y: auto; /* Permite rolagem na página */
    padding: 5vh 0; /* Espaço acima e abaixo */
`;

const DialogEstilizado = styled.dialog`
    position: relative; /* Importante: mantém o modal no fluxo da página */
    width: 80vw;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    margin: 2vh auto; /* Espaço acima e abaixo */
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
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
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
  background-color: #f9f9f9; /* Cor de fundo para destacá-las */
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
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(null);

  const variaveis = [
    { value: "{{nome}}", label: "Nome Completo" },
    { value: "{{email}}", label: "E-mail" },
    { value: "{{mensagem}}", label: "Mensagem" },
    { value: "{{nascimento}}", label: "Data de Nascimento" },
    { value: "{{cpf}}", label: "CPF" },
  ];

  useEffect(() => {
    // Recria o EditorJS toda vez que o modal for aberto
    if (opened) {
      if (editorRef.current) {
        // Verifique se o editorRef.current possui o método destroy antes de chamá-lo
        if (editorRef.current.destroy) {
          editorRef.current.destroy(); // Destrói o editor anterior
        }
      }

      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
        },
        onChange: async () => {
          const content = await editorRef.current.save();
          setEditorContent(content);
        },
      });
    }

    // Cleanup: destrói o EditorJS quando o modal for fechado
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [opened]);

  // Função para adicionar variável no editor no local do cursor
  const addVariableToEditor = (variable) => {
    editorRef.current.blocks.insert("paragraph", {
      text: variable,
    });
  };

  const handleSave = () => {
    // Substitui as variáveis pelos valores inseridos pelo usuário
    let content = editorContent;
    if (content) {
      content = JSON.stringify(content);
      content = content.replace(/{{nome}}/g, nome);
      content = content.replace(/{{email}}/g, email);
      content = content.replace(/{{mensagem}}/g, mensagem);
      content = content.replace(/{{nascimento}}/g, nascimento);
      content = content.replace(/{{cpf}}/g, cpf);
      content = JSON.parse(content);
    }
    aoSalvar(nome, email, mensagem, content);
  };

  return (
    <>
      {opened && (
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
                    <CampoTexto valor={nome} type="text" setValor={setNome} label="Nome" />
                    <CampoTexto valor={email} type="text" setValor={setEmail} label="E-mail" />
                    <CampoTexto valor={mensagem} type="text" setValor={setMensagem} label="Mensagem" />
                    <CampoTexto patternMask={['999.999.999-99']} valor={cpf} type="text" setValor={setCpf} label="CPF" />
                </Col6>
                <Col6>
                    <div id="editorjs" style={{ border: "1px solid #ccc", padding: "10px" }}></div>
                    {/* Variáveis exibidas abaixo do EditorJS */}
                    <VariaveisContainer>
                    <h6>Variáveis disponíveis</h6>
                    {variaveis.map((variavel) => (
                        <VariavelItem key={variavel.value} onClick={() => addVariableToEditor(variavel.value)}>
                        {variavel.label}
                        </VariavelItem>
                    ))}
                    </VariaveisContainer>
                </Col6>
              </Col12>
            </Frame>

            <form method="dialog">
              <div className={styles.containerBottom}>
                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>
                  Voltar
                </Botao>
                <Botao aoClicar={handleSave} estilo="vermilion" size="medium" filled>
                  Confirmar
                </Botao>
              </div>
            </form>
          </DialogEstilizado>
        </Overlay>
      )}
    </>
  );
}

export default ModalEncaminharVaga;
