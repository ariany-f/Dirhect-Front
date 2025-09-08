import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import CheckboxContainer from '@components/CheckboxContainer'
import DropdownItens from '@components/DropdownItens'
import BotaoGrupo from '@components/BotaoGrupo'
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
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles'
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

    const [regra_concessao, setRegraConcessao] = useState('')
    const [regra_revogacao, setRegraRevogacao] = useState('')

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
        if(dadoAntigo && opened)
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
             setTipoCalculo(tiposCalculo.find(item => item.code === dadoAntigo.tipo_calculo) || '');
             setTipoDesconto(tiposDesconto.find(item => item.code === dadoAntigo.tipo_desconto) || '');
             
             // Recalcular valor empresa apenas se necessário
             if (dadoAntigo.valor && dadoAntigo.valor_desconto && !dadoAntigo.valor_empresa) {
                 const novoValorEmpresa = calcularValorEmpresa(dadoAntigo.valor, dadoAntigo.valor_desconto)
                 setEmpresa(novoValorEmpresa)
             }
        } else if (opened && !dadoAntigo) {
            // Modal aberto para adicionar novo item - limpar todos os campos
            setId('')
            setValor('')
            setEmpresa('')
            setDesconto('')
            setTempoMinimo('')
            setExtensivelDependente(false)
            setDescricao('')
            setHerdado(true)
            setTipoCalculo('')
            setTipoDesconto('')
            setErroValor('')
            setClassError([])
        }

    }, [dadoAntigo, opened, tiposCalculo, tiposDesconto])

    // useEffect para limpar dados quando o modal é fechado
    useEffect(() => {
        if (!opened) {
            // Limpar todos os campos quando o modal for fechado
            setId('')
            setValor('')
            setEmpresa('')
            setDesconto('')
            setTempoMinimo('')
            setExtensivelDependente(false)
            setDescricao('')
            setHerdado(true)
            setTipoCalculo('')
            setTipoDesconto('')
            setErroValor('')
            setClassError([])
        }
    }, [opened])

    const fecharModal = () => {
        aoFechar();
        // Não precisa limpar aqui pois o useEffect já faz isso quando opened = false
    }

    useEffect(() => {
        // Inicializar dropdowns apenas uma vez
        setDropdownTiposCalculo(tiposCalculo.map((item) => ({
            name: item.name,
            code: item.code
        })));
        setDropdownTiposDesconto(tiposDesconto.map((item) => ({
            name: item.name,
            code: item.code
        })));
    }, [])

    const normalizarValor = (valor) => {
        if (typeof valor === 'number') return valor;
        if (!valor) return 0;
        // Remove prefixo R$, espaços e outros caracteres não numéricos exceto , e .
        let limpo = valor.replace('R$', '').replace(/\s/g, '');
        // Se já está formatado (ex: 2.100,00)
        if (limpo.includes(',')) {
            // Remove pontos de milhar e troca vírgula por ponto
            return parseFloat(limpo.replace(/\./g, '').replace(',', '.'));
        }
        // Se é só número (ex: 209900), trata como centavos
        if (/^\d+$/.test(limpo)) {
            return parseFloat(limpo) / 100;
        }
        // Se for float em string (ex: "2100.00")
        return parseFloat(limpo) || 0;
    };

    const calcularValorEmpresa = (valorCompra, valorColaborador) => {
        const valorCompraNum = normalizarValor(valorCompra);
        const valorColaboradorNum = normalizarValor(valorColaborador);
        console.log(valorColaboradorNum, valorCompraNum)
        if (valorColaboradorNum > valorCompraNum) {
            setErroValor('O valor do colaborador não pode ser maior que o valor da compra');
            return '';
        } else {
            setErroValor('');
            const valorEmpresaNum = valorCompraNum - valorColaboradorNum;
            return valorEmpresaNum.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }
    };

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
            <OverlayRight $opened={opened}>
                <DialogEstilizadoRight 
                    $width="60vw" 
                    id="modal-add-departamento" 
                    open={opened}
                    $opened={opened}
                >
                    <Frame>
                        <Titulo>
                            <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                                <h6 style={{marginBottom: 16}}>{id ? 'Alterar Item do' : 'Adicionar Item ao'} Contrato <small style={{fontSize: 12, color: 'var(--neutro-800)', fontWeight: 400}}>{dadoAntigo?.versao ? `V. ${dadoAntigo.versao}` : ''}</small></h6>
                            </div>
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
                    <Frame overflowY="auto" padding="0px 32px 32px 8px">
                        <div style={{padding: '32px 0 24px 0'}}>
                            <Col12>
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
                                        <BotaoSemBorda color="var(--terciaria)">
                                            <IoSettingsSharp/><Link to={'/contratos/configuracao'} className={styles.link}>Configurar Tabela Interna</Link>
                                        </BotaoSemBorda>
                                    }
                                </Col6>
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
                            <hr style={{width: '100%', border: 'none', borderTop: '1px solid rgb(205, 205, 205)', margin: '16px 0'}} />
                            <Col12>
                                <Col6>
                                    <h6>Regra de Concessão</h6>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                                        <DropdownItens
                                            camposVazios={classError}
                                            valor={regra_concessao}
                                            setValor={setRegraConcessao}
                                            options={[
                                                {code: 'D', name: 'A partir da data de admissão'},
                                                {code: 'C', name: 'A partir do 1º período de experiência'},
                                                {code: 'S', name: 'A partir do 2º período de experiência'},
                                                {code: 'F', name: '120 dias após a admissão'},
                                                {code: 'G', name: '180 dias após a admissão'},
                                                {code: 'H', name: 'Data informada manualmente'},
                                            ]}
                                            label="Regra de Concessão"
                                        />
                                    </div>
                                </Col6>
                                <Col6>
                                    <h6>Regra de Revogação</h6>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                                        <DropdownItens
                                            camposVazios={classError}
                                            valor={regra_revogacao}
                                            setValor={setRegraRevogacao}
                                            options={[
                                                {code: 'D', name: 'A partir da data de demissão'},
                                                {code: 'C', name: '30 dias após a data de demissão'},
                                                {code: 'S', name: '60 dias após a data de demissão'},
                                                {code: 'F', name: 'Data informada manualmente'}
                                            ]}
                                            label="Regra de Revogação"
                                        />
                                    </div>
                                </Col6>
                            </Col12>
                        </div>
                    </Frame>
                    <form method="dialog">
                        <BotaoGrupo>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={validarESalvar} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </BotaoGrupo>
                    </form>
                </DialogEstilizadoRight>
            </OverlayRight>
    )
}

export default ModalAlterarRegrasBeneficio