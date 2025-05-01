import { useState } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import styles from './ModalAdicionarCargo.module.css';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { useTranslation } from "react-i18next";

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

const ModalAdicionarCargo = ({ onClose, onSave }) => {
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [erros, setErros] = useState({});
    const { t } = useTranslation('common');

    const validar = () => {
        const novosErros = {};
        if (!nome) novosErros.nome = 'Nome é obrigatório';
        if (!codigo) novosErros.codigo = 'Código é obrigatório';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSave({ nome, codigo });
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
                        <h6>{t('add')} Cargo</h6>
                    </Titulo>
                </Frame>
                <Wrapper>
                    <Col6>
                        <CampoTexto
                            label="Nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            error={erros.nome}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            label="Código"
                            value={codigo}
                            onChange={e => setCodigo(e.target.value)}
                            error={erros.codigo}
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

export default ModalAdicionarCargo; 