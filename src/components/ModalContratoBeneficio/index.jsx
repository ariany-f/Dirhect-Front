import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`

const Col6Centered = styled.div`
    display: flex;
    flex: 1 1 calc(50% - 8px);
    justify-content: start;
    padding-top: 14px;
    align-items: center;
`

const Col4 = styled.div`
    flex: 1 1 25%;
`

const Col4Centered = styled.div`
    display: flex;
    flex: 1 1 25%;
    justify-content: center;
    align-items: center;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 2.5vh;
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

function ModalContratoBeneficios({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, operadora = [] }) {

    const [classError, setClassError] = useState([])
    const [observacao, setObservacao] = useState('');
    const [beneficios, setBeneficios] = useState([]);
    const [dropdownBeneficios, setDropdownBeneficios] = useState([]);
    const [beneficio, setBeneficio] = useState('');
    const [data_inicio, setDataInicio] = useState('');
    const [data_fim, setDataFim] = useState('');

    const navegar = useNavigate()

    useEffect(() => {
        if (opened) {
            setBeneficios([]); 
            setDropdownBeneficios([]);
    
            if (operadora?.beneficios_vinculados?.length > 0) {
                const novosBeneficios = operadora.beneficios_vinculados.map((item) => ({
                    id: item.beneficio.id,
                    descricao: item.beneficio.descricao,
                    tipo: item.tipo
                }));
    
                setBeneficios(novosBeneficios);
    
                const dropdownItens = novosBeneficios.map((item) => ({
                    name: item.descricao,
                    code: item.id
                }));
    
                setDropdownBeneficios(dropdownItens);
            }
        }
    }, [opened, operadora]);
    
    
    useEffect(() => {
        if (beneficios.length > 0 && dropdownBeneficios.length === 0) {
            const novosDropdownItens = beneficios.map(item => ({
                name: item.descricao,
                code: item.id
            }));
    
            setDropdownBeneficios(novosDropdownItens);
        }
    }, [beneficios]);
    
    const validarESalvar = () => {
        let errors = [];
        if (!beneficio || !beneficio.code) errors.push('beneficio');
        
        if (errors.length > 0) {
            setClassError(errors);
        } else {
            aoSalvar(beneficio.code);
        }
    }

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado id="modal-add-departamento" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Adicionar Benefício ao Contrato</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <DropdownItens camposVazios={classError} valor={beneficio} setValor={setBeneficio} options={dropdownBeneficios} label="Benefício" name="beneficio" placeholder="Benefício"/> 
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={validarESalvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalContratoBeneficios