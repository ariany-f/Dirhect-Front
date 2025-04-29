import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import CheckboxContainer from '@components/CheckboxContainer'
import DropdownItens from '@components/DropdownItens'
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import http from '@http'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import axios from "axios"
import { Link } from "react-router-dom"
import { FaDownload } from "react-icons/fa"
import { IoSettingsSharp } from "react-icons/io5"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
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
    top: 10vh;
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
    flex: 1 1 calc(50% - 5px);
    gap: 5px;
    display: flex;
    max-width: calc(50% - 5px);
    flex-direction: column;
`

function ModalAlterarRegrasBeneficio({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, dadoAntigo, nomeBeneficio = '' }) {

    const [alteravel, setAlteravel] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    const [id, setId] = useState('')
    const [valor, setValor] = useState('')
    const [tempo_minimo, setTempoMinimo] = useState('')
    const [extensivo_dependentes, setExxtensivelDependente] = useState(false)
    const [dropdownTiposCalculo, setDropdownTiposCalculo] = useState([])
    const [dropdownTiposDesconto, setDropdownTiposDesconto] = useState([])
    const [empresa, setEmpresa] = useState('')
    const [desconto, setDesconto] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tipo_calculo, setTipoCalculo] = useState('')
    const [tipo_desconto, setTipoDesconto] = useState('')
    const [erroValor, setErroValor] = useState('')

    const [tiposCalculo, setTiposCalculo] = useState([
        {code: 'M', name: 'Valor Mensal'},
        {code: 'D', name: 'Valor Diário'},
        {code: 'F', name: 'Valor Fixo'},
        {code: 'T', name: 'Tabela Interna'}
     ]);

     const [tiposDesconto, setTiposDesconto] = useState([
        {code: 'D', name: 'Valor Diário'},
        {code: 'C', name: '% sobre o valor da compra'},
        {code: 'S', name: '% do Valor do Salário'},
        {code: 'F', name: 'Valor Fixo'}
     ]);
    
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

             // Encontrar o objeto correspondente para o dropdown
             setTipoCalculo(prev => tiposCalculo.find(item => item.code === dadoAntigo.tipo_calculo) || prev);
             setTipoDesconto(prev => tiposDesconto.find(item => item.code === dadoAntigo.tipo_desconto) || prev);
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

    useEffect(() => {
        setDropdownTiposCalculo((estadoAnterior) => {
            const novosTiposCalculo = tiposCalculo.map((item) => ({
                name: item.name,
                code: item.code
            }));
            return [...estadoAnterior, ...novosTiposCalculo];
        });
        setDropdownTiposDesconto((estadoAnterior) => {
            const novosTiposDesconto = tiposDesconto.map((item) => ({
                name: item.name,
                code: item.code
            }));
            return [...estadoAnterior, ...novosTiposDesconto];
        });
    }, [])

    const calcularValorEmpresa = (valorCompra, valorColaborador) => {
        const valorCompraNum = parseFloat(valorCompra.replace(/[^\d,]/g, '').replace(',', '.')) || 0
        const valorColaboradorNum = parseFloat(valorColaborador.replace(/[^\d,]/g, '').replace(',', '.')) || 0

        if (valorColaboradorNum > valorCompraNum) {
            setErroValor('O valor do colaborador não pode ser maior que o valor da compra')
            return ''
        } else {
            setErroValor('')
            return (valorCompraNum - valorColaboradorNum).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
        }
    }

    const formatarValor = (valor) => {
        if (!valor) return ''
        const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'))
        return valorNumerico.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    const handleValorCompraChange = (novoValor) => {
        setValor(novoValor)
        if (desconto) {
            const novoValorEmpresa = calcularValorEmpresa(novoValor, desconto)
            setEmpresa(novoValorEmpresa)
        }
    }

    const handleValorColaboradorChange = (novoValor) => {
        setDesconto(novoValor)
        if (valor) {
            const novoValorEmpresa = calcularValorEmpresa(valor, novoValor)
            setEmpresa(novoValorEmpresa)
        }
    }

    const validarESalvar = () => {
        let errors = [];
        if (!tipo_calculo || !tipo_calculo.code) errors.push('tipo_calculo');
        if (!tipo_desconto || !tipo_desconto.code) errors.push('tipo_desconto');
        
        if (errors.length > 0) {
            setClassError(errors);
        } else {
            aoSalvar(id, descricao, tipo_calculo.code, tipo_desconto.code, extensivo_dependentes, valor, empresa, desconto);
        }
    }

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
                            <h6>{id ? 'Alterar' : 'Adicionar'} Configuração - {`${nomeBeneficio}`}</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <div>
                        <Col12>
                            <Col6>
                                <DropdownItens camposVazios={classError} valor={tipo_desconto} setValor={setTipoDesconto} options={dropdownTiposDesconto} label="Tipo de Desconto" name="tipo_desconto" placeholder="Tipo de Desconto"/> 
                            </Col6>
                            <Col6>
                                <DropdownItens camposVazios={classError} valor={tipo_calculo} setValor={setTipoCalculo} options={dropdownTiposCalculo} label="Tipo de Cálculo" name="tipo_calculo" placeholder="Tipo de Cálculo"/> 
                                {tipo_calculo.code === 'T' &&
                                    <BotaoSemBorda color="var(--primaria)">
                                        <IoSettingsSharp/><Link to={'/contratos/configuracao'} className={styles.link}>Configurar Tabela Interna</Link>
                                    </BotaoSemBorda>
                                }
                            </Col6>
                        </Col12>
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
                                        setValor={handleValorCompraChange} 
                                        type="text" 
                                        label="Valor Compra" 
                                        placeholder="Digite o valor da compra"
                                        patternMask="BRL" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="desconto" 
                                        valor={desconto} 
                                        setValor={handleValorColaboradorChange} 
                                        type="text" 
                                        label="Valor Colaborador" 
                                        placeholder="Digite o valor do colaborador"
                                        patternMask="BRL" />
                                    {erroValor && <span style={{color: 'var(--error)', fontSize: '12px'}}>{erroValor}</span>}
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="empresa" 
                                        valor={empresa} 
                                        setValor={() => {}} 
                                        type="text" 
                                        label="Valor empresa" 
                                        placeholder="Valor empresa"
                                        disabled
                                        patternMask="BRL"
                                        style={{backgroundColor: 'var(--neutro-100)'}} />
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
                            <Botao aoClicar={validarESalvar} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarRegrasBeneficio