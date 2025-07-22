import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import MainContainer from '@components/MainContainer'
import CustomImage from '@components/CustomImage'
import { Toast } from 'primereact/toast'
import { Skeleton } from 'primereact/skeleton'
import styled from "styled-components"
import { Real } from '@utils/formats'
import IconeBeneficio from "@components/IconeBeneficio"
import Dashboard from '@assets/Dashboard.svg'
import { useParams, useLocation } from "react-router-dom"
import { FaChevronDown, FaCheck, FaTimes, FaClock, FaInfoCircle } from 'react-icons/fa'
import ModalInfoElegibilidade from '@components/ModalInfoElegibilidade'
import { Dropdown } from "primereact/dropdown"
import { IoInformationCircleOutline } from "react-icons/io5"
import SwitchInput from "@components/SwitchInput"

const StatusTag = styled.div`
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    
    ${props => {
        switch (props.$tipo) {
            case 'ATIVO':
                return `
                    background-color: #dcfce7;
                    color: #16a34a;
                    border: 1px solid #bbf7d0;
                `;
            case 'INATIVO':
                return `
                    background-color: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                `;
            case 'OBRIGATORIO':
                return `
                    background-color:rgb(255, 240, 240);
                    color:rgb(189, 93, 72);
                    border: 1px solidrgb(253, 186, 186);
                `;
            case 'AGUARDANDO':
                return `
                    background-color: #f8fafc;
                    color:rgb(94, 130, 149);
                    border: 1px solid #e2e8f0;
                `;
            default:
                return '';
        }
    }}
`

const CardBeneficio = styled.div`
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    margin-bottom: ${(props) => props.$marginBottom ? props.$marginBottom : '0px'};
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    width: inherit;
    max-width: 100vw;
    position: relative;
    min-height: 180px;
    transition: all 0.3s ease;
`

const ItensGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
`;

const ColItem = styled.div`
    flex: 1 1 calc(50% - 10px);
    min-width: 300px;
    max-width: 450px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid ${props => {
        switch (props.$status) {
            case 'sim': return '#356b49';
            case 'nao': return '#fca5a5';
            case 'pendente': return '#fcaa4d';
            default: return '#e5e7eb';
        }
    }};
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative;
    padding: 0;
    min-height: 160px;
    overflow: hidden;
    
    /* Barra colorida no topo baseada no status */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${props => {
            switch (props.$status) {
                case 'sim': return '#356b49';
                case 'nao': return '#fca5a5';
                case 'pendente': return '#fcaa4d';
                default: return '#e5e7eb';
            }
        }};
        z-index: 1;
    }
`;

const CardHeader = styled.div`
    padding: 20px 20px 16px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    background: #ffffff;
    position: relative;
`;

const CardContent = styled.div`
    padding: 0 20px 16px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 20px;
    align-items: flex-start;
`;

const CardTitle = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: #111827;
    line-height: 1.4;
`;

const CardValue = styled.div`
    position: absolute;
    top: 16px;
    left: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    background: #f8fafc;
    padding: 8px 14px;
    border-radius: 2px;
    letter-spacing: -0.025em;
    z-index: 5;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
`;

const CardSubtitle = styled.div`
    font-size: 11px;
    color: #6b7280;
    margin-top: auto;
`;

const StatusBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    background: ${props => {
            switch (props.$status) {
            case 'sim': return '#ecfdf5';
            case 'nao': return '#fef2f2';
            case 'pendente': return '#fffbeb';
            default: return '#f3f4f6';
        }
    }};
    color: ${props => {
        switch (props.$status) {
            case 'sim': return '#065f46';
            case 'nao': return '#7f1d1d';
            case 'pendente': return '#78350f';
            default: return '#374151';
        }
    }};
`;

const StatusIcon = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => {
        switch (props.$status) {
            case 'sim': return '#356b49';
            case 'nao': return '#fca5a5';
            case 'pendente': return '#fcaa4d';
            default: return '#9ca3af';
        }
    }};
`;

const ActionArea = styled.div`
    padding: 16px 20px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafbfc;
    min-height: 52px;
    margin-top: auto;
`;

const ActionLeft = styled.div`
    display: flex;
    align-items: center;
`;

const ActionRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 11px;
    color: #6b7280;
    font-weight: 500;
    min-width: 140px;
`;

const InfoIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #3b82f6;
    font-size: 14px;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
        background: #f3f4f6;
        color: #2563eb;
    }
`;

const StatusButton = styled.div`
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${props => {
        switch (props.$status) {
            case 'sim': return '#ecfdf5';
            case 'nao': return '#fef2f2';
            case 'pendente': return '#fffbeb';
            default: return '#f3f4f6';
        }
    }};
    color: ${props => {
        switch (props.$status) {
            case 'sim': return '#065f46';
            case 'nao': return '#7f1d1d';
            case 'pendente': return '#78350f';
            default: return '#374151';
        }
    }};
    border: 1px solid ${props => {
        switch (props.$status) {
            case 'sim': return '#356b49';
            case 'nao': return '#fca5a5';
            case 'pendente': return '#fcaa4d';
            default: return '#e5e7eb';
        }
    }};
`;

// Grid para garantir layout responsivo
const ContratoItensGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
`;

// Componente para informações do contrato
const InfoContrato = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 8px 16px 16px 16px;
    margin-bottom: 20px;
    opacity: ${props => props.inativo ? '0.6' : '1'};
    transition: all 0.3s ease;
    position: relative;
    margin-top: 24px;
    
    &:hover {
        border-color: #cbd5e1;
    }
`;

const OperadoraFieldset = styled.div`
    position: absolute;
    top: -24px;
    left: 16px;
    right: auto;
    width: fit-content;
    max-width: 60%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); */
    z-index: 5;
    
    &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 20px;
        right: 20px;
        height: 1px;
        background: #ffffff;
        z-index: 1;
    }
`;

// Tag de status do contrato
const StatusContratoTag = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 500;
    margin-left: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: ${({ status }) =>
        status === 'Disponível' ? '#d1fae5' :
        status === 'Indisponível' ? '#fee2e2' :
        '#fef3c7'};
    color: ${({ status }) =>
        status === 'Disponível' ? '#065f46' :
        status === 'Indisponível' ? '#991b1b' :
        '#92400e'};
    border: 1px solid ${({ status }) =>
        status === 'Disponível' ? '#a7f3d0' :
        status === 'Indisponível' ? '#fecaca' :
        '#fde68a'};
`;

// Container para os itens do contrato
const ContratoItensBox = styled.div`
    border-radius: 12px;
    padding: 0;
    width: 100%;
`;

const EditarPlanosSwitch = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }
    
    span {
        font-size: 12px;
        color: #374151;
        font-weight: 600;
        white-space: nowrap;
    }
`;

const CustomDropdown = styled(Dropdown)`
    &.p-dropdown {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        width: 80px !important;
        height: 40px !important;
        min-width: 60px !important;
        min-height: 40px !important;
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .p-dropdown-label {
        padding: 0 !important;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .p-dropdown-trigger {
        display: none !important;
    }
    .p-inputtext {
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        padding: 0 !important;
    }
    .p-dropdown-panel {
        min-width: 80px;
        .p-dropdown-items {
            padding: 4px;
            .p-dropdown-item {
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover {
                    background: var(--neutro-100);
                }
            }
        }
    }
`

const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: #e2e8f0;
        border-color: #cbd5e1;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        background: #f8fafc;
        color: #94a3b8;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const CustomDropdownButton = styled(Dropdown)`
    & .p-dropdown-label {
        height: 25px!important;
    }
    &.p-dropdown {
        border: 1px solid #e2e8f0 !important;
        background: #f1f5f9 !important;
        border-radius: 6px !important;
        padding: 2px 6px !important;
        height: auto !important;
        min-height: 16px !important;
        width: auto !important;
        min-width: 90px !important;
        max-width: 120px !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        
        &:hover {
            background: #e2e8f0 !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
    }
    
    .p-dropdown-label {
        padding: 0 !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        color: #475569 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    
    .p-dropdown-trigger {
        width: 12px !important;
        color: #475569 !important;
        flex-shrink: 0 !important;
    }
    
    .p-dropdown-panel {
        min-width: 120px !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        
        .p-dropdown-items {
            padding: 4px !important;
            
            .p-dropdown-item {
                padding: 8px 12px !important;
                font-size: 12px !important;
                
                &:hover {
                    background: #f1f5f9 !important;
                }
            }
        }
    }
`;

const StatusIconCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

function ColaboradorBeneficios() {
    let { id } = useParams()
    const location = useLocation()
    const [beneficios, setBeneficios] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useRef(null)
    const [expandedItems, setExpandedItems] = useState({})
    const [modalInfo, setModalInfo] = useState({ open: false, item: null });
    const [vinculos, setVinculos] = useState([]);
    const [editarPlanos, setEditarPlanos] = useState({});

    const statusOptions = [
        { label: 'Pendente', value: 'pendente', icon: <FaClock /> },
        { label: 'Sim', value: 'sim', icon: <FaCheck stroke="var(--green-600)" /> },
        { label: 'Não', value: 'nao', icon: <FaTimes stroke="var(--error)" /> }
    ]

    useEffect(() => {
        // Verifica se a aba de benefícios está ativa antes de carregar
        const currentPath = location.pathname;
        const isBeneficiosTab = currentPath === `/colaborador/detalhes/${id}` || currentPath.endsWith('/beneficios');
        
        if (id && isBeneficiosTab) {
            carregarBeneficios()
        }
    }, [id, location.pathname])

    const carregarBeneficios = async () => {
        try {
            setLoading(true)
            // Buscar vínculos do colaborador
            const vinculosResp = await http.get(`contrato_beneficio_item_funcionario/?funcionario_id=${id}&status=A`);
            setVinculos(Array.isArray(vinculosResp) ? vinculosResp : []);

            // Cria um Map: id do item => { selecionado, created_at }
            const selecionadosMap = new Map();
            if (Array.isArray(vinculosResp)) {
                vinculosResp.forEach(v => {
                    if (Array.isArray(v.beneficio_selecionado)) {
                        v.beneficio_selecionado.forEach(sel => {
                            selecionadosMap.set(sel.id, {
                                selecionado: sel.selecionado,
                                created_at: v.created_at
                            });
                        });
                    }
                });
            }

            const response = await http.get(`catalogo_beneficios/${id}/?format=json`)
            if (response && Array.isArray(response)) {
                const lista = [];
                response.forEach(grupo => {
                    grupo.forEach(item => {
                        const beneficio = item.beneficio;
                        // Busca o status e a data no Map
                        let status = 'pendente';
                        let selecionadoEm = null;
                        if (selecionadosMap.has(item.id)) {
                            const info = selecionadosMap.get(item.id);
                            status = info.selecionado ? 'sim' : 'nao';
                            selecionadoEm = info.selecionado ? info.created_at : null;
                        }
                        lista.push({
                            id: item.id,
                            descricao: beneficio.dados_beneficio.descricao,
                            icone: beneficio.dados_beneficio.icone,
                            multiplos_itens: beneficio.dados_beneficio.multiplos_itens,
                            multiplos_operadoras: beneficio.dados_beneficio.multiplos_operadoras,
                            obrigatoriedade: beneficio.dados_beneficio.obrigatoriedade,
                            status,
                            selecionadoEm,
                            operadora: {
                                id: beneficio.id_operadora,
                                nome_operadora: beneficio.nome_operadora,
                                image_operadora: beneficio.image_operadora
                            },
                            plano: item.descricao,
                            contratoInfo: {
                                id: item.contrato_id,
                                descricao: item.descricao,
                                num_contrato_origem: item.num_contrato_origem,
                                status: 'A'
                            },
                            regra_elegibilidade: item.regra_elegibilidade,
                            item: {
                                beneficio: beneficio,
                                icone: beneficio.dados_beneficio.icone,
                                versao: item.versao,
                                valor: parseFloat(item.valor),
                                valor_desconto: parseFloat(item.valor_desconto),
                                valor_empresa: parseFloat(item.valor_empresa),
                                tipo_calculo: item.tipo_calculo,
                                tipo_desconto: item.tipo_desconto,
                                created_at: item.created_at
                            },
                            beneficioId: beneficio.dados_beneficio.id
                        })
                    })
                })
                setBeneficios(lista)

                // Inicializa editarPlanos para operadoras com todos os itens pendentes
                const operadorasPendentes = {};
                lista.forEach(item => {
                    const operadoraId = item.operadora?.id;
                    if (operadoraId) {
                        if (!operadorasPendentes[operadoraId]) {
                            operadorasPendentes[operadoraId] = {
                                total: 0,
                                pendentes: 0
                            };
                        }
                        operadorasPendentes[operadoraId].total++;
                        if (item.status === 'pendente') {
                            operadorasPendentes[operadoraId].pendentes++;
                        }
                    }
                });

                const initialEditarPlanos = {};
                Object.entries(operadorasPendentes).forEach(([operadoraId, counts]) => {
                    if (counts.pendentes === counts.total) {
                        initialEditarPlanos[operadoraId] = true;
                    }
                });
                setEditarPlanos(initialEditarPlanos);
            }
        } catch (erro) {
            console.error(erro)
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao carregar benefícios', 
                life: 3000 
            })
        } finally {
            setLoading(false)
        }
    }

    // Agrupa por descricao (grupo)
    const grupos = beneficios.reduce((acc, b) => {
        if (!acc[b.descricao]) acc[b.descricao] = [];
        acc[b.descricao].push(b);
        return acc;
    }, {});

    const handleStatusChange = (itemId, novoStatus, grupoDescricao, multiplos_itens, multiplos_operadoras, operadoraId) => {
        setBeneficios(beneficios => {
            const grupo = beneficios.filter(b => b.descricao === grupoDescricao);
            const itemAtual = grupo.find(b => b.id === itemId);
            if (!itemAtual) return beneficios;
            
            // Caso multiplos_operadoras seja true
            if (multiplos_operadoras) {
                if (!multiplos_itens && novoStatus === 'sim') {
                    let obj = [];
                    // Só pode um plano "sim" por operadora, outros da mesma operadora ficam "não", outros operadoras permanecem como estão
                    // Disparar POST para todos os que ficarem "não"
                    grupo.forEach(b => {
                        if (b.operadora?.id === operadoraId && b.id !== itemId) {
                            obj.push({
                                "id": b.id,
                                "selecionado": false,
                                "descricao": b.plano
                            })
                        } else if( b.id !== itemId && b.operadora?.id !== operadoraId) {
                            obj.push({
                                "id": b.id,
                                "selecionado": b.status === 'sim' ? true : false,
                                "descricao": b.plano
                            })
                        }
                    });

                    obj.push({
                        "id": itemId,
                        "selecionado": true,
                        "descricao": itemAtual.plano
                    })
                    // POST do sim
                    http.post('contrato_beneficio_item_funcionario/', {
                        funcionario: id,
                        beneficio_selecionado: obj,
                        tipo_beneficio: itemAtual.beneficioId
                    }).catch(erro => {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao atualizar benefício',
                            life: 3000
                        });
                    });
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: 'Status alterado com sucesso', 
                        life: 2000 
                    });
                    return beneficios.map(b => {
                        if (b.descricao === grupoDescricao && b.operadora?.id === operadoraId) {
                            if (b.id === itemId) return { ...b, status: 'sim' };
                            return { ...b, status: 'nao' };
                        }
                        return b;
                    });
                }

                let obj = [];
                
                grupo.forEach(b => {
                    if (b.id !== itemId) {
                        obj.push({
                            "id": b.id,
                            "selecionado": b.status === 'sim' ? true : false,
                            "descricao": b.plano
                        })
                    }
                });

                obj.push({
                    "id": itemId,
                    "selecionado": true,
                    "descricao": itemAtual.plano
                })
                // Se multiplos_itens for true, pode marcar vários normalmente
                http.post('contrato_beneficio_item_funcionario/', {
                    funcionario: id,
                    beneficio_selecionado: obj,
                    tipo_beneficio: itemAtual.beneficioId
                }).catch(erro => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao atualizar benefício',
                        life: 3000
                    });
                });
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: 'Status alterado com sucesso', 
                    life: 2000 
                });
                return beneficios.map(b => b.id === itemId ? { ...b, status: novoStatus } : b);
            }

            // Caso multiplos_operadoras seja false
            if (!multiplos_itens && novoStatus === 'sim') {
                let obj = [];
                // Só pode um plano "sim" para o benefício, independente da operadora
                grupo.forEach(b => {
                    if (b.id !== itemId) {
                        obj.push({
                            "id": b.id,
                            "selecionado": false,
                            "descricao": b.plano
                        })
                    }
                });
                obj.push({
                    "id": itemId,
                    "selecionado": true,
                    "descricao": itemAtual.plano
                })
                http.post('contrato_beneficio_item_funcionario/', {
                    funcionario: id,
                    beneficio_selecionado: obj,
                    tipo_beneficio: itemAtual.beneficioId
                }).catch(erro => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao atualizar benefício',
                        life: 3000
                    });
                });
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: 'Status alterado com sucesso', 
                    life: 2000 
                });
                return beneficios.map(b => b.descricao === grupoDescricao ? { ...b, status: b.id === itemId ? 'sim' : 'nao' } : b);
            }
            if (multiplos_itens && novoStatus === 'sim') {
                // Só pode marcar "sim" para itens da mesma operadora
                const operadoraSelecionada = itemAtual.operadora?.id;
                const outrosSim = grupo.filter(b => b.status === 'sim' && b.operadora?.id !== operadoraSelecionada);
                if (outrosSim.length > 0) {
                    return beneficios;
                }
            }

            // Multiplos_itens true, multiplos_operadoras false: pode marcar vários, mas só da mesma operadora
            let obj = [];
            
            grupo.forEach(b => {
                if (b.id !== itemId) {
                    obj.push({
                        "id": b.id,
                        "selecionado": b.status === 'sim' ? true : false,
                        "descricao": b.plano
                    })
                }
            });
            obj.push({
                "id": itemId,
                "selecionado": true,
                "descricao": itemAtual.plano
            })
            http.post('contrato_beneficio_item_funcionario/', {
                funcionario: id,
                beneficio_selecionado: obj,
                tipo_beneficio: itemAtual.beneficioId
            }).catch(erro => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar benefício',
                    life: 3000
                });
            });
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Status alterado com sucesso', 
                life: 2000 
            });
            return beneficios.map(b => b.id === itemId ? { ...b, status: novoStatus } : b);
        });
    }

    const getTipoCalculo = (tipo) => {
        const tipoMap = {
            'F': 'Valor Fixo',
            'M': 'Valor Mensal',
            'D': 'Valor Diário',
            'T': 'Tabela Interna'
        }
        return tipoMap[tipo] || tipo;
    }
    
    const getTipoDesconto = (tipo) => {
        const tipoMap = {
            'F': 'Valor Fixo',
            'C': '% sobre o valor da compra',
            'S': '% do Valor do Salário',
            'D': 'Valor Diário'
        }
        return tipoMap[tipo] || tipo;
    }

    const getStatusBeneficio = (beneficio) => {
        if (beneficio.obrigatoriedade) return 'OBRIGATORIO';
        return 'AGUARDANDO';
    };

    const agruparBeneficiosPorDescricao = (beneficios) => {
        const grupos = {};
        beneficios.forEach(b => {
            if (!grupos[b.descricao]) grupos[b.descricao] = [];
            grupos[b.descricao].push(b);
        });
        return Object.values(grupos);
    };

    function getStatusLabel(item) {
        if (item.obrigatoriedade) return 'Obrigatório';
        if (item.status === 'sim') return 'Ativado';
        if (item.status === 'nao') return 'Inativo';
        return 'Aguardando';
    }

    // Função utilitária para status do contrato
    function getStatusContrato(status) {
        switch (status) {
            case 'A': return 'Disponível';
            case 'I': return 'Indisponível';
            default: return status;
        }
    }

    const statusTemplate = (option, context, showChevron = false, showText = false, forceAdicionar = false) => {
        if (!option) return null;

        let obrigatorio = false;
        if (context && context.value && context.value.obrigatoriedade) obrigatorio = true;
        if (context && context.option && context.option.obrigatoriedade) obrigatorio = true;

        let color = '';
        if (option.value === 'sim') color = 'var(--green-600)';
        else if (option.value === 'nao') color = 'var(--error)';
        else if (option.value === 'pendente' && obrigatorio) color = 'var(--error)';
        else color = 'var(--warning)';

        let icon = null;
        if (option.value === 'sim') icon = <FaCheck size={18} fill="var(--green-600)" style={{ color, fontSize: 20 }} />;
        else if (option.value === 'nao') icon = <FaTimes size={18} fill="var(--error)" style={{ color, fontSize: 20 }} />;
        else icon = <FaClock size={14} style={{ color, fontSize: 20 }} />;

        return (
            <StatusIconCard style={{gap: 8, justifyContent: 'flex-end'}}>
                {forceAdicionar && option.value === 'pendente' ? (
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--primaria)' }}>Adicionar</span>
                ) : (
                    <>
                        {icon}
                        {showText && (option.value === 'sim' || option.value === 'nao') && (
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{option.label}</span>
                        )}
                    </>
                )}
                {showChevron && <FaChevronDown style={{ color: 'var(--neutro-400)', fontSize: 16, marginLeft: 2 }} />}
            </StatusIconCard>
        );
    };

    const formatarData = (data) => {
        if (!data) return '---';
        const d = new Date(data);
        if (isNaN(d)) return data;
        return d.toLocaleDateString('pt-BR');
    };

    const toggleEditarPlanos = (operadoraId) => {
        setEditarPlanos(prev => ({
            ...prev,
            [operadoraId]: !prev[operadoraId]
        }));
    };

    return (
        <>
        <Toast ref={toast} />
        <Frame>
            {loading ? (
                <div style={{padding: 32}}>
                    {[1,2,3].map(i => (
                        <Skeleton key={i} width="100%" height="60px" borderRadius="8px" style={{marginBottom: 16}} />
                    ))}
                </div>
            ) : Object.keys(grupos).length > 0 ? (
                <div className="beneficios-container" style={{
                    width: '100%',
                    maxHeight: 'calc(100vh - 290px)', // 270px para considerar algum padding/topo
                    overflowY: 'auto',
                    paddingRight: 8,
                    position: 'relative' // Adicione isso
                }}>
                    {Object.entries(grupos).map(([descricao, itens], idx, arr) => (
                        <CardBeneficio key={descricao} $marginBottom={idx === arr.length - 1 ? '0px' : '12px'}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                    <IconeBeneficio nomeIcone={itens[0]?.icone ?? descricao} />
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                                        <Texto weight={600} size="15px">{descricao}</Texto>
                                        <StatusTag $tipo={itens[0].obrigatoriedade ? 'OBRIGATORIO' : 'AGUARDANDO'}>
                                            {itens[0].obrigatoriedade ? 'BENEFÍCIO OBRIGATÓRIO' : 'BENEFÍCIO OPCIONAL'}
                                        </StatusTag>
                                    </div>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4}}>
                                    {(() => {
                                        if (itens[0].multiplos_itens && itens[0].multiplos_operadoras) {
                                            return (
                                                <Texto size="13px">
                                                    Você pode selecionar múltiplos itens
                                                </Texto>
                                            );
                                        } else if (!itens[0].multiplos_itens && itens[0].multiplos_operadoras) {
                                            return (
                                                <Texto size="13px" color="var(--black)">
                                                    Você só pode selecionar um item de cada operadora
                                                </Texto>
                                            );
                                        } else if (!itens[0].multiplos_itens && !itens[0].multiplos_operadoras) {
                                            return (
                                                <Texto size="13px" color="var(--black)">
                                                    Você só pode selecionar um dos itens abaixo
                                                </Texto>
                                            );
                                        } else if (itens[0].multiplos_itens && !itens[0].multiplos_operadoras) {
                                            return (
                                                <Texto size="13px">
                                                    Você pode selecionar múltiplos itens porém somente de uma operadora
                                                </Texto>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                            <ItensGrid>
                                {Object.entries(itens.reduce((acc, item) => {
                                    const contratoId = item.contratoInfo?.id || 'sem-contrato';
                                    if (!acc[contratoId]) acc[contratoId] = [];
                                    acc[contratoId].push(item);
                                    return acc;
                                }, {})).map(([contratoId, itensContrato], idxContrato, arrContratos) => {
                                    const contrato = itensContrato[0]?.contratoInfo;
                                    const operadora = itensContrato[0]?.operadora;
                                    const temPlanoSelecionado = itensContrato.some(item => item.status === 'sim');
                                    
                                    return (
                                        <div key={contratoId} style={{width: '100%'}}>
                                            {contrato && (
                                                <InfoContrato inativo={getStatusContrato(contrato.status) === 'Indisponível' ? 'true' : undefined}>
                                                    <OperadoraFieldset>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            {operadora?.image_operadora ? (
                                                                <CustomImage 
                                                                    src={operadora.image_operadora} 
                                                                    title={operadora.nome_operadora} 
                                                                    width={36} 
                                                                    height={24} 
                                                                    borderRadius={6} 
                                                                />
                                                            ) : null}
                                                            <div style={{ textAlign: 'left' }}>
                                                                <div style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: 8, 
                                                                    marginBottom: 2
                                                                }}>
                                                                    <span style={{
                                                                        fontWeight: 700, 
                                                                        fontSize: 14, 
                                                                        color: '#111827'
                                                                    }}>
                                                                        {operadora?.nome_operadora}
                                                                    </span>
                                                                    {contrato.status && (
                                                                        <StatusContratoTag status={getStatusContrato(contrato.status)}>
                                                                            {getStatusContrato(contrato.status)}
                                                                        </StatusContratoTag>
                                                                    )}
                                                                </div>
                                                                {contrato.num_contrato_origem && (
                                                                    <div style={{
                                                                        fontSize: 11, 
                                                                        color: '#6b7280', 
                                                                        fontWeight: 500
                                                                    }}>
                                                                        <strong>Contrato:</strong> {contrato.num_contrato_origem}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </OperadoraFieldset>
                                                    
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'flex-end', 
                                                        marginBottom: 16,
                                                        marginTop: 2
                                                    }}>
                                                        <EditarPlanosSwitch>
                                                            <span>Editar Planos</span>
                                                            <SwitchInput
                                                                checked={editarPlanos[operadora?.id] || false}
                                                                onChange={() => toggleEditarPlanos(operadora?.id)}
                                                                style={{ width: '40px' }}
                                                            />
                                                        </EditarPlanosSwitch>
                                                    </div>
                                                    
                                                    <ContratoItensBox>
                                                        <ContratoItensGrid>
                                                            {itensContrato.map((item, idx) => {
                                                                return (
                                                                <ColItem key={item.id} $status={item.status}>
                                                                    <CardValue>{Real.format(item.item.valor)}</CardValue>
                                                                    <CardHeader>
                                                                        <StatusBadge $status={item.status}>
                                                                            <StatusIcon $status={item.status}>
                                                                                {item.status === 'sim' ? (
                                                                                    <FaCheck size={6} style={{ color: '#ffffff' }} />
                                                                                ) : item.status === 'nao' ? (
                                                                                    <FaTimes size={6} style={{ color: '#ffffff' }} />
                                                                                ) : (
                                                                                    <FaClock size={5} style={{ color: '#ffffff' }} />
                                                                                )}
                                                                            </StatusIcon>
                                                                            {item.status === 'sim' ? 'Ativo' : 
                                                                             item.status === 'nao' ? 'Inativo' : 
                                                                             'Pendente'}
                                                                        </StatusBadge>
                                                                    </CardHeader>
                                                                    
                                                                    <CardContent>
                                                                        <CardTitle>{item.plano}</CardTitle>
                                                                    </CardContent>
                                                                    
                                                                    <ActionArea>
                                                                        <ActionLeft>
                                                                            <InfoIconButton
                                                                                title={item.obrigatoriedade ? "Benefício obrigatório" : "Informações do benefício"}
                                                                                onClick={() => setModalInfo({ open: true, item })}
                                                                            >
                                                                                <FaInfoCircle />
                                                                            </InfoIconButton>
                                                                        </ActionLeft>
                                                                        
                                                                        <ActionRight>
                                                                            {editarPlanos[operadora?.id] ? (
                                                                                item.status === 'pendente' ? (
                                                                                    <CustomDropdownButton
                                                                                        value={item.status}
                                                                                        options={statusOptions}
                                                                                        onChange={e => handleStatusChange(item.id, e.value, item.descricao, item.multiplos_itens, item.multiplos_operadoras, item.operadora?.id)}
                                                                                        panelStyle={{fontSize: 12, minWidth: 120}}
                                                                                        appendTo={document.body}
                                                                                        valueTemplate={() => (
                                                                                            <span style={{ height: '20px', fontSize: '12px', fontWeight: 500 }}>
                                                                                                Adicionar
                                                                                            </span>
                                                                                        )}
                                                                                        itemTemplate={option => (
                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                                                                                                {option.icon}
                                                                                                <span style={{ fontWeight: 500, fontSize: '12px' }}>{option.label}</span>
                                                                                            </div>
                                                                                        )}
                                                                                        disabled={getStatusContrato(item.contratoInfo?.status) === 'Indisponível'}
                                                                                    />
                                                                                ) : (
                                                                                    <CustomDropdownButton
                                                                                        value={item.status}
                                                                                        options={statusOptions}
                                                                                        onChange={e => handleStatusChange(item.id, e.value, item.descricao, item.multiplos_itens, item.multiplos_operadoras, item.operadora?.id)}
                                                                                        panelStyle={{fontSize: 12, minWidth: 120}}
                                                                                        appendTo={document.body}
                                                                                        valueTemplate={() => (
                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                                <div style={{
                                                                                                    width: '12px',
                                                                                                    height: '12px',
                                                                                                    borderRadius: '50%',
                                                                                                    background: item.status === 'sim' ? '#356b49' : '#fca5a5',
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    justifyContent: 'center'
                                                                                                }}>
                                                                                                    {item.status === 'sim' ? (
                                                                                                        <FaCheck size={6} style={{ color: '#ffffff' }} />
                                                                                                    ) : (
                                                                                                        <FaTimes size={6} style={{ color: '#ffffff' }} />
                                                                                                    )}
                                                                                                </div>
                                                                                                <span style={{ fontSize: '12px' }}>
                                                                                                    {item.status === 'sim' ? 'Ativo' : 'Inativo'}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                        itemTemplate={option => (
                                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                                                                                                {option.icon}
                                                                                                <span style={{ fontWeight: 500, fontSize: '12px' }}>{option.label}</span>
                                                                                            </div>
                                                                                        )}
                                                                                        disabled={getStatusContrato(item.contratoInfo?.status) === 'Indisponível'}
                                                                                    />
                                                                                )
                                                                            ) : (
                                                                                <>
                                                                                    {(item.status === 'sim' || item.status === 'nao') && item.selecionadoEm ? (
                                                                                        <span>
                                                                                            {item.status === 'sim' ? 'Ativado' : 'Desativado'} em {new Date(item.selecionadoEm).toLocaleDateString('pt-BR')}
                                                                                        </span>
                                                                                    ) : item.status === 'pendente' ? (
                                                                                        <span>Aguardando seleção</span>
                                                                                    ) : null}
                                                                                </>
                                                                            )}
                                                                        </ActionRight>
                                                                    </ActionArea>
                                                                </ColItem>
                                                            );
                                                            })}
                                                        </ContratoItensGrid>
                                                    </ContratoItensBox>
                                                </InfoContrato>
                                            )}
                                        </div>
                                    )
                                })}
                            </ItensGrid>
                        </CardBeneficio>
                    ))}
                     <div style={{
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 8, // Compensa o paddingRight
                        height: '30px',
                        marginBottom: '-8px',
                        borderRadius: '0px 0px 12px 12px',
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%)',
                        pointerEvents: 'none'
                    }}/>
                </div>
            ) : (
                <Frame align="center" padding="10vh 0px">
                    <MainContainer align="center">
                        <img src={Dashboard} size={100} alt="Nenhum benefício" />
                        <Titulo>
                            <h6>Nenhum benefício disponível</h6>
                            <SubTitulo>
                                Quando houver benefícios disponíveis, eles aparecerão aqui
                            </SubTitulo>
                        </Titulo>
                    </MainContainer>
                </Frame>
            )}
        </Frame>
        <ModalInfoElegibilidade open={modalInfo.open} item={modalInfo.item} onClose={() => setModalInfo({ open: false, item: null })} vinculos={vinculos} />
        </>
    )
}

export default ColaboradorBeneficios