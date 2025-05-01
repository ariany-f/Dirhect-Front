import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDependente.module.css'
import QuestionCard from '@components/QuestionCard'
import Loading from "@components/Loading"
import DepartamentosRecentes from "@components/DepartamentosRecentes"
import { useState, useRef, useEffect } from "react"
import { RiQuestionLine } from "react-icons/ri"
import { Toast } from 'primereact/toast'
import axios from "axios"
import { useDependenteContext } from "@contexts/Dependente"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { useTranslation } from "react-i18next"

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


function ModalAdicionarDependente({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar }) {

    const navigate = useNavigate();
    const [classError, setClassError] = useState([])
    const toast = useRef(null);
    const { t } = useTranslation('common');

    const { 
        dependente, 
        setDependenteCpf, 
        setDependenteNome, 
        setDependenteSituacao, 
        setDependenteEmail, 
        setDependenteTelefone, 
        submeterDependente 
    } = useDependenteContext();


    const sendData = (evento) => {
        evento.preventDefault();
        setDependenteSituacao('A');
        submeterDependente()
        .then((response) => {
            if (response.success) {
                navigate("/colaborador/registro/sucesso");
            }
        })
        .catch((erro) => {
           console.log(erro)
        })
        .finally(() => console.log(''));
    };


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
                                <h6>Adicionar Dependente</h6>
                            </Titulo>
                        </Frame>
                        <form>
                            <Col12 >
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        patternMask={['999.999.999-99']} 
                                        name="cpf" 
                                        valor={dependente.cpf} 
                                        setValor={setDependenteCpf} 
                                        type="text" 
                                        label="CPF do dependente" 
                                        placeholder="Digite o CPF do dependente" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="nome" 
                                        valor={dependente.nome} 
                                        setValor={setDependenteNome} 
                                        type="text" 
                                        label="Nome do dependente" 
                                        placeholder="Digite o name completo do dependente" />
                                </Col6>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="email" 
                                        valor={dependente.email} 
                                        setValor={setDependenteEmail} 
                                        type="email" 
                                        label="Email do dependente" 
                                        placeholder="Digite o email do dependente" />
                                </Col4>
                                <Col4>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        patternMask={['99 9999-9999', '99 99999-9999']} 
                                        name="phone_number" 
                                        valor={dependente.telefone1} 
                                        setValor={setDependenteTelefone} 
                                        type="text" 
                                        label="Celular do dependente" 
                                        placeholder="Digite o telefone do dependente" />
                                </Col4>
                            </Col12>
                        </form>
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>{t('back')}</Botao>
                            <Botao aoClicar={sendData} estilo="vermilion" size="medium" filled>{t('confirm')}</Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalAdicionarDependente