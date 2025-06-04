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
import { Col12, Col6 } from '@components/Colunas'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import IconeBeneficio from '@components/IconeBeneficio'
import SwitchInput from '@components/SwitchInput'
import CustomImage from '@components/CustomImage'
import ContainerHorizontal from '@components/ContainerHorizontal'
import BadgeGeral from '@components/BadgeGeral'

const StyledDropdownContainer = styled.div`
    width: 100%;
    
    .p-dropdown {
        width: 100%;
        margin-bottom: 18px;
    }

    .p-dropdown-label {
        padding: 12px 16px;
    }
`;

const StyledInputContainer = styled.div`
    width: 100%;
    margin-bottom: 18px;

    .inputContainer {
        width: 100%;
    }

    input {
        width: 100%;
    }
`;

const TituloComIcone = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

function ModalAlterarRegrasBeneficio({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, dadoAntigo, nomeBeneficio = '', iconeBeneficio = '', contrato = null }) {
    
    const [alteravel, setAlteravel] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    const [id, setId] = useState('')
    const [valor, setValor] = useState('')
    const [tempo_minimo, setTempoMinimo] = useState('')
    const [extensivo_dependentes, setExtensivelDependente] = useState(false)
    const [herdado, setHerdado] = useState(true)
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
            setExtensivelDependente(dadoAntigo.extensivel_dependente)
            setDescricao(dadoAntigo.descricao)
            setHerdado(dadoAntigo.herdado)

             // Encontrar o objeto correspondente para o dropdown
             setTipoCalculo(prev => tiposCalculo.find(item => item.code === dadoAntigo.tipo_calculo) || prev);
             setTipoDesconto(prev => tiposDesconto.find(item => item.code === dadoAntigo.tipo_desconto) || prev);
        }

    }, [dadoAntigo, alteravel])

    const fecharModal = () => {
        aoFechar();
        setHerdado(true)

        setValor('')
        setEmpresa('')
        setDesconto('')
        setDescricao('')
        setTipoCalculo('')
    }

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
            aoSalvar(id, descricao, tipo_calculo.code, tipo_desconto.code, extensivo_dependentes, valor, empresa, desconto, herdado);
        }
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado 
                    $width="60vw" 
                    $minWidth="500px"
                    $maxWidth="900px"
                    id="modal-add-departamento" 
                    open={opened}
                >
                    <Frame>
                        <Titulo>
                            <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h6 style={{marginBottom: 16}}>{id ? 'Alterar Configuração do' : 'Adicionar Configuração ao'} Contrato</h6>
                            {contrato && 
                                <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={contrato?.dados_operadora?.id}>
                                    <CustomImage src={contrato?.dados_operadora?.imagem_url} alt={contrato?.dados_operadora?.nome} width={45} height={45} title={contrato?.dados_operadora?.nome} />
                                    <div>
                                        <b>{contrato?.dados_operadora?.nome} {contrato?.num_contrato_origem ? `- #${contrato?.num_contrato_origem}` : ``}</b>
                                        <BadgeGeral 
                                            severity={''} 
                                            weight={500} 
                                            nomeBeneficio={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <IconeBeneficio 
                                                        nomeIcone={iconeBeneficio} 
                                                        size={20}
                                                    />
                                                    <div>
                                                        {nomeBeneficio}
                                                    </div>
                                                </div>
                                            }  
                                        />
                                    </div>
                                </ContainerHorizontal>
                            }
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <Col12>
                            <Col6>
                                <StyledDropdownContainer>
                                    <DropdownItens 
                                        camposVazios={classError} 
                                        valor={tipo_desconto} 
                                        setValor={setTipoDesconto} 
                                        options={dropdownTiposDesconto} 
                                        label="Tipo de Desconto" 
                                        name="tipo_desconto" 
                                        placeholder="Tipo de Desconto"
                                    /> 
                                </StyledDropdownContainer>
                            </Col6>
                            <Col6>
                                <StyledDropdownContainer>
                                    <DropdownItens 
                                        camposVazios={classError} 
                                        valor={tipo_calculo} 
                                        setValor={setTipoCalculo} 
                                        options={dropdownTiposCalculo} 
                                        label="Tipo de Cálculo" 
                                        name="tipo_calculo" 
                                        placeholder="Tipo de Cálculo"
                                    /> 
                                </StyledDropdownContainer>
                                {tipo_calculo.code === 'T' &&
                                    <BotaoSemBorda color="var(--primaria)">
                                        <IoSettingsSharp/><Link to={'/contratos/configuracao'} className={styles.link}>Configurar Tabela Interna</Link>
                                    </BotaoSemBorda>
                                }
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <StyledInputContainer>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="descricao" 
                                        valor={descricao} 
                                        setValor={setDescricao} 
                                        type="text" 
                                        label="Descrição" 
                                        placeholder="Digite Descrição" 
                                    />
                                </StyledInputContainer>
                            </Col6>
                            <Col6>
                                <StyledInputContainer>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="valor" 
                                        valor={valor} 
                                        setValor={handleValorCompraChange} 
                                        type="text" 
                                        label="Valor Compra" 
                                        placeholder="Digite o valor da compra"
                                        patternMask="BRL" 
                                    />
                                </StyledInputContainer>
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <StyledInputContainer>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="desconto" 
                                        valor={desconto} 
                                        setValor={handleValorColaboradorChange} 
                                        type="text" 
                                        label="Valor Colaborador" 
                                        placeholder="Digite o valor do colaborador"
                                        patternMask="BRL" 
                                    />
                                    {erroValor && <span style={{color: 'var(--error)', fontSize: '12px'}}>{erroValor}</span>}
                                </StyledInputContainer>
                            </Col6>
                            <Col6>
                                <StyledInputContainer>
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
                                        style={{backgroundColor: 'var(--neutro-100)'}} 
                                    />
                                </StyledInputContainer>
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                            
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <span style={{ fontSize: 14, color: '#888' }}>Extensível Dependente?</span>
                                    <SwitchInput checked={extensivo_dependentes} onChange={() => setExtensivelDependente(!extensivo_dependentes)} color="var(--primaria)" />
                                </div>
                            </Col6>
                            <Col6>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <span style={{ fontSize: 14, color: '#888' }}>Herdar regras de elegibilidade do Benefício?</span>
                                    <SwitchInput checked={herdado} onChange={() => setHerdado(!herdado)} color="var(--primaria)" />
                                </div>
                            </Col6>
                        </Col12>
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