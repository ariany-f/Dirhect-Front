import { useState } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import styles from './ModalAdicionarFuncionario.module.css';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

const Col12 = styled.div`
    width: 100%;
`;

const Col6 = styled.div`
    width: calc(50% - 8px);
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
`;

const ModalAdicionarFuncionario = ({ onClose, onSave }) => {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erros, setErros] = useState({});

    const validar = () => {
        const novosErros = {};
        if (!nome) novosErros.nome = 'Nome é obrigatório';
        if (!codigo) novosErros.codigo = 'Código é obrigatório';
        if (!email) novosErros.email = 'E-mail é obrigatório';
        if (!telefone) novosErros.telefone = 'Telefone é obrigatório';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSave({ nome, codigo, email, telefone });
            onClose();
        }
    };

    return (
        <Overlay>
            <DialogEstilizado>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={onClose}>
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <h6>Adicionar Funcionário</h6>
                    </Titulo>
                </Frame>
                <Wrapper>
                    <Col12>
                        <CampoTexto
                            label="Nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            error={erros.nome}
                        />
                    </Col12>
                    <Col6>
                        <CampoTexto
                            label="Código"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            error={erros.codigo}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            label="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            error={erros.email}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            label="Telefone"
                            value={telefone}
                            onChange={e => setTelefone(e.target.value)}
                            error={erros.telefone}
                        />
                    </Col6>
                </Wrapper>
                <div className={styles.containerBottom}>
                    <Botao variant="secondary" onClick={onClose}>
                        Cancelar
                    </Botao>
                    <Botao onClick={handleSalvar}>
                        Salvar
                    </Botao>
                </div>
            </DialogEstilizado>
        </Overlay>
    );
};

export default ModalAdicionarFuncionario; 