import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import DropdownItens from "@components/DropdownItens"
import CustomImage from "@components/CustomImage"
import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill, RiCloseFill } from 'react-icons/ri'
import { FaPen, FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity } from 'react-icons/md'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { MdDirectionsBike } from "react-icons/md";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalConfigurarBeneficios.module.css'
import IconeBeneficio from "@components/IconeBeneficio"

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
    width: 60vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 15vh;
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

function ModalConfigurarBeneficios({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [contratos, setContratos] = useState([]);
    const [itensContrato, setItensContrato] = useState([]);
    const [BeneficiosContrato, setBeneficiosContrato] = useState([]);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [beneficioContratoSelecionado, setBeneficioContratoSelecionado] = useState(null);
    const [itemContratoSelecionado, setItemContratoSelecionado] = useState(null);
    const [carregandoContratos, setCarregandoContratos] = useState(false);
    const [carregandoItens, setCarregandoItens] = useState(false);
    const [carregandoBeneficios, setCarregandoBeneficios] = useState(false);

    useEffect(() => {
        if (opened) {
            carregarContratos();
        }
    }, [opened]);

    const carregarContratos = async () => {
        setCarregandoContratos(true);
        try {
            const response = await http.get('contrato/?format=json');
            setContratos(response.map(contrato => ({
                id: contrato.id,
                name: `${contrato.dados_operadora.nome} ${contrato.observacao}`,
                code: contrato.id,
                operadora: {
                    nome: contrato.dados_operadora.nome,
                    imagem: contrato.dados_operadora.imagem_url
                }
            })));
        } catch (erro) {
            console.error('Erro ao carregar contratos:', erro);
        } finally {
            setCarregandoContratos(false);
        }
    };

    const carregarBeneficiosContrato = async (contratoId) => {
        if (!contratoId) return;
        
        setCarregandoBeneficios(true);
        try {
            const response = await http.get(`contrato/${contratoId}/?format=json`);
            setBeneficiosContrato(response.beneficios.map(item => ({
                id: item.id,
                name: `${item.dados_beneficio.descricao} (${item.dados_beneficio.descricao})`,
                contrato: contratoId,
                beneficio: {
                    icone: item.dados_beneficio.descricao
                },
                code: item.id
            })));
        } catch (erro) {
            console.error('Erro ao carregar itens do contrato:', erro);
        } finally {
            setCarregandoBeneficios(false);
        }
    };
    
    const carregarItensContratoBeneficio = async (contratoId, beneficioId) => {
        if (!contratoId) return;
        
        setCarregandoItens(true);
        try {
            const response = await http.get(`contrato/${contratoId}/?format=json`);
            const filtered = response.beneficios.filter(item => item.id === beneficioId);
            setItensContrato(filtered[0].itens.map(item => ({
                id: item.id,
                name: `${item.descricao} (${item.descricao})`,
                code: item.id
            })));
        } catch (erro) {
            console.error('Erro ao carregar itens do contrato:', erro);
        } finally {
            setCarregandoItens(false);
        }
    };

    const handleContratoChange = (contrato) => {
        setContratoSelecionado(contrato);
        setBeneficioContratoSelecionado(null);
        setItemContratoSelecionado(null); // Reseta o item quando muda o contrato
        if (contrato) {
            carregarBeneficiosContrato(contrato.code);
        } else {
            setBeneficiosContrato([]);
        }
    };

    const handleBeneficioChange = (beneficio) => {
        setBeneficioContratoSelecionado(beneficio);
        setItemContratoSelecionado(null); // Reseta o item quando muda o contrato
        if (beneficio) {
            carregarItensContratoBeneficio(beneficio.contrato, beneficio.code);
        } else {
            setItensContrato([]);
        }
    };

    const validarESalvar = () => {
        let errors = [];
        if (!contratoSelecionado) errors.push('contrato');
        if (!itemContratoSelecionado) errors.push('itemContrato');
        
        if (errors.length > 0) {
            setClassError(errors);
        } else {
            aoSalvar({
                contrato_item: itemContratoSelecionado.code
            });
        }
    };

     // Template para os itens de contrato (com imagem)
     const beneficioOptionTemplate = (option) => {
        if(option)
        {
            return (
                <div className="flex align-items-center" style={{display:'flex', gap:'10px', alignItems:'center', justifyContent: 'start'}}>
                    <IconeBeneficio nomeIcone={option.beneficio.icone} />
                    <Texto weight={600} size="12px">{option.name}</Texto>
                </div>
            );
        }
        else
        {
            return (
                <div className="flex align-items-center">
                    <div>Selecione um benefício</div>
                </div>
            );
        }
    };

     // Template para os itens de contrato (com imagem)
     const contratoOptionTemplate = (option) => {
        if(option)
        {
            return (
                <div className="flex align-items-center" style={{display:'flex', gap:'10px'}}>
                    {option.operadora?.imagem_url && (
                        <CustomImage 
                            alt={option.operadora.nome} 
                            src={option.operadora.imagem_url} 
                            width={'30px'}
                            height={20} size={80} 
                            title={option?.operadora?.nome} 
                        />
                    )}
                    <Texto weight={600} size="12px">{option.name}</Texto>
                </div>
            );
        }
        else
        {
            return (
                <div className="flex align-items-center">
                    <div>Selecione um contrato</div>
                </div>
            );
        }
    };

    return (
        <>
            {opened &&
                <Overlay>
                    <DialogEstilizado id="modal-add-departamento" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Vincular Benefício</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col6>
                                    <DropdownItens 
                                        camposVazios={classError} 
                                        valor={contratoSelecionado} 
                                        setValor={handleContratoChange} 
                                        options={contratos} 
                                        label="Contrato" 
                                        name="contrato" 
                                        placeholder={carregandoContratos ? "Carregando..." : "Selecione o contrato"}
                                        disabled={carregandoContratos}
                                        optionTemplate={contratoOptionTemplate}
                                    /> 
                                </Col6>
                                <Col6>
                                    <DropdownItens 
                                        camposVazios={classError} 
                                        valor={beneficioContratoSelecionado} 
                                        setValor={handleBeneficioChange} 
                                        options={BeneficiosContrato} 
                                        label="Benefícios do Contrato" 
                                        name="beneficioContrato" 
                                        placeholder={carregandoBeneficios ? "Carregando..." : (contratoSelecionado ? "Selecione o benefício" : "Selecione um contrato primeiro")}
                                        disabled={!contratoSelecionado || carregandoBeneficios}
                                        optionTemplate={beneficioOptionTemplate}
                                    />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <DropdownItens 
                                        camposVazios={classError} 
                                        valor={itemContratoSelecionado} 
                                        setValor={setItemContratoSelecionado} 
                                        options={itensContrato} 
                                        label="Item do Contrato" 
                                        name="itemContrato" 
                                        placeholder={carregandoItens ? "Carregando..." : (contratoSelecionado ? "Selecione o item" : "Selecione um benefício primeiro")}
                                        disabled={!contratoSelecionado || carregandoItens}
                                    />
                                </Col6>
                            </Col12>
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={validarESalvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            }
        </>
    );
}

export default ModalConfigurarBeneficios