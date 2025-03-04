import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import http from '@http'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import axios from "axios"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
    top: 22vh;
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

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
`

function ModalAlterarRegrasBeneficio({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, dadoAntigo, nomeBeneficio = '' }) {

    const [alteravel, setAlteravel] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    const [id, setId] = useState('')
    const [valor, setValor] = useState('')
    const [tempo_minimo, setTempoMinimo] = useState('')
    const [extensivo_dependentes, setExxtensivelDependente] = useState(false)
    const [empresa, setEmpresa] = useState('')
    const [desconto, setDesconto] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tipo_calculo, setTipoCalculo] = useState('')
    const [tipo_desconto, setTipoDesconto] = useState('')
    
    useEffect(() => {

        /** Preenche os inputs com os dados atuais */
        if(dadoAntigo)
        {
            setId(dadoAntigo.id)
            setValor(dadoAntigo.valor)
            setEmpresa(dadoAntigo.valor_empresa)
            setDesconto(dadoAntigo.valor_desconto)
            setTempoMinimo(dadoAntigo.tempo_minimo)
            setExxtensivelDependente(dadoAntigo.extensivel_depentende)
            setDescricao(dadoAntigo.descricao)
            setTipoCalculo(dadoAntigo.tipo_calculo)
            setTipoDesconto(dadoAntigo.tipo_desconto)
        }

    }, [dadoAntigo, alteravel])

    const fecharModal = () => {
        setAlteravel('')
        setValor('')
        setEmpresa('')
        setDesconto('')
        setDescricao('')
        setTipoCalculo('')
        setTipoDesconto('')
        setId('')
        setTempoMinimo('')
        setExxtensivelDependente(false)
        aoFechar()
    }

    const handleChange = (checked) => {
        setExxtensivelDependente(checked) // Atualiza o estado da tarefa
    };

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h6>Alterar Dados - {`${nomeBeneficio}`}</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <div>
                           <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="descricao" 
                                        valor={descricao} 
                                        setValor={setDescricao} 
                                        type="text" 
                                        label="Descrição" 
                                        placeholder="Digite Descrição" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="valor" 
                                        valor={valor} 
                                        setValor={setValor} 
                                        type="text" 
                                        label="Valor Compra" 
                                        placeholder="Digite o valor da compra" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="desconto" 
                                        valor={desconto} 
                                        setValor={setDesconto} 
                                        type="text" 
                                        label="Valor Colaborador" 
                                        placeholder="Digite o valor do colaborador" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="empresa" 
                                        valor={empresa} 
                                        setValor={setEmpresa} 
                                        type="text" 
                                        label="Valor empresa" 
                                        placeholder="Digite o valor da empresa" />
                                </Col6>
                                <Col6>
                                    <CheckboxContainer label="Extensível Dependente?" name="extensivo_dependentes" valor={extensivo_dependentes} setValor={handleChange} />
                                </Col6>
                            </Col12>
                        </div>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={() => aoSalvar(id, descricao, tipo_calculo, tipo_desconto, extensivo_dependentes, valor, empresa, desconto)} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarRegrasBeneficio