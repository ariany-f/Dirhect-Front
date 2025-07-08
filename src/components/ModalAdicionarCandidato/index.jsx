import React, { useState } from "react";
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

  const handleSave = () => {
    aoSalvar({
      nome,
      email,
      cpf,
      nascimento,
      telefone
    });
  };

  return (
    opened &&
    <Overlay>
      <DialogEstilizado $width="60vw" $minWidth="40vw" open={opened}>
        <Frame>
          <Titulo>
            <button className="close" onClick={aoFechar}>
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
                type="text" 
                setValor={setCpf} 
                label="CPF" 
              />
              <CampoTexto valor={nome} type="text" setValor={setNome} label="Nome" />
              <CampoTexto valor={email} type="text" setValor={setEmail} label="E-mail" />
            </Col6>
            <Col6>
              <CampoTexto patternMask={["(99) 99999-9999"]} valor={telefone} type="text" setValor={setTelefone} label="Telefone" />
              <CampoTexto valor={nascimento} type="date" setValor={setNascimento} label="Data de Nascimento" />
            </Col6>
          </Col12>
        </Frame>
        <div className={styles.containerBottom}>
          <BotaoGrupo>
            <Botao
              aoClicar={aoFechar}
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
            >
              Adicionar
            </Botao>
          </BotaoGrupo>
        </div>
      </DialogEstilizado>
    </Overlay>
  );
}

export default ModalAdicionarCandidato; 