import { useState } from "react";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import Botao from "@components/Botao";
import Frame from "@components/Frame";
import CampoTexto from "@components/CampoTexto";
import Titulo from "@components/Titulo";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import styles from './ModalAdicionarFilial.module.css';

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

function ModalAdicionarFilial({ opened = false, aoFechar, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');

    const validarESalvar = () => {
        let errors = [];
        if (!nome.trim()) errors.push('nome');
        if (!codigo.trim()) errors.push('codigo');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        const dadosParaAPI = {
            nome: nome.trim(),
            codigo: codigo.trim()
        };
        
        aoSalvar(dadosParaAPI);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Nova Filial</h6>
                            </Titulo>
                        </Frame>
                        
                        <Wrapper>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('nome') ? ['nome'] : []}
                                        name="nome" 
                                        valor={nome} 
                                        setValor={setNome} 
                                        type="text" 
                                        label="Nome*" 
                                        placeholder="Digite o nome" 
                                    />
                                </Col6>
                                
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError.includes('codigo') ? ['codigo'] : []}
                                        name="codigo" 
                                        valor={codigo} 
                                        setValor={setCodigo} 
                                        type="text" 
                                        label="Código*" 
                                        placeholder="Digite o código" 
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
                                    Salvar Filial
                                </Botao>
                            </div>
                        </Wrapper>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalAdicionarFilial;