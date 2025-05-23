import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import DropdownItens from "@components/DropdownItens"; 
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

// Opções para o dropdown de tipo de demissão
const tiposDemissao = [
    { name: "Pedido de Demissão", code: "pedido" },
    { name: "Iniciativa do Empregador", code: "empregador" }
];

function ModalDemissao({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar }) {
    const [classError, setClassError] = useState([])
    const [dataDemissao, setDataDemissao] = useState('');
    const [tipoDemissao, setTipoDemissao] = useState('');

    const navegar = useNavigate()

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Solicitação de Demissão</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <Col12>
                                <Col6>
                                    <CampoTexto
                                        camposVazios={classError}
                                        name="data_inicial_demissao"
                                        valor={dataDemissao}
                                        setValor={setDataDemissao}
                                        type="date"
                                        label="Data da Demissão"
                                        placeholder="Selecione a data"
                                    />
                                </Col6>
                                <Col6>
                                    <DropdownItens
                                        camposVazios={classError}
                                        valor={tipoDemissao}
                                        setValor={setTipoDemissao}
                                        options={tiposDemissao}
                                        label="Tipo de Demissão"
                                        name="tipo_demissao"
                                        placeholder="Selecione o tipo"
                                    />
                                </Col6> 
                            </Col12>
                        </Frame>
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
                                aoClicar={() => aoSalvar()} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Confirmar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalDemissao