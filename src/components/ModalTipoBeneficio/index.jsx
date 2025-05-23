import { useState, useEffect } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import DropdownItens from "@components/DropdownItens";
import IconeBeneficio from '@components/IconeBeneficio';
import icones_beneficios from '@json/icones_beneficio.json';
import styles from './ModalAdicionarDepartamento.module.css';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import SwitchInput from '@components/SwitchInput';
import http from '@http';

// Estilos
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    min-width: 250px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
`;

function ModalTipoBeneficio({ opened = false, aoFechar, aoSalvar, beneficio = null }) {
    const { usuario } = useSessaoUsuarioContext();
    const [classError, setClassError] = useState([]);
    const [chave, setChave] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        if (beneficio && opened) {
            setChave(beneficio.chave || '');
            setDescricao(beneficio.descricao || '');
        } else if (!opened) {
            setChave('');
            setDescricao('');
            setClassError([]);
        }
    }, [beneficio, opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!chave.trim()) errors.push('chave');
        if (!descricao.trim()) errors.push('descricao');
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }
        aoSalvar({ chave: chave.trim(), descricao: descricao.trim() });
    };

    return (
        opened && (
            <Overlay>
                <DialogEstilizado open={opened}>
                    <Frame>
                        <Titulo>
                            <button className="close" onClick={aoFechar}>
                                <RiCloseFill size={20} className="fechar" />  
                            </button>
                            <h6>{beneficio ? 'Editar Tipo de Benefício' : 'Novo Tipo de Benefício'}</h6>
                        </Titulo>
                    </Frame>
                    <Wrapper>
                        <Col12>
                            <Col6>
                                <CampoTexto 
                                    camposVazios={classError.includes('chave') ? ['chave'] : []}
                                    name="chave" 
                                    valor={chave} 
                                    setValor={setChave} 
                                    type="text" 
                                    label="Chave*" 
                                    placeholder="Digite a chave" 
                                />
                            </Col6>
                            <Col6>
                                <CampoTexto 
                                    camposVazios={classError.includes('descricao') ? ['descricao'] : []}
                                    name="descricao" 
                                    valor={descricao} 
                                    setValor={setDescricao} 
                                    type="text" 
                                    label="Descrição*" 
                                    placeholder="Digite a descrição" 
                                />
                            </Col6>
                        </Col12>
                        <div className={styles.containerBottom}>
                            <Botao
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium" 
                                filled
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                {beneficio ? 'Atualizar' : 'Salvar Tipo'}
                            </Botao>
                        </div>
                    </Wrapper>
                </DialogEstilizado>
            </Overlay>
        )
    );
}

export default ModalTipoBeneficio;