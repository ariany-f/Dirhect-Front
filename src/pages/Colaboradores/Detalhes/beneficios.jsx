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
import { useParams } from "react-router-dom"
import { FaChevronDown, FaCheck, FaTimes, FaClock, FaInfoCircle } from 'react-icons/fa'
import ModalInfoElegibilidade from '@components/ModalInfoElegibilidade'
import { Dropdown } from "primereact/dropdown"

const StatusTag = styled.div`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    ${props => {
        switch (props.$tipo) {
            case 'ATIVO':
                return `
                    background-color: rgba(0, 200, 83, 0.1);
                    color: var(--success);
                `;
            case 'INATIVO':
                return `
                    background-color: rgba(229, 115, 115, 0.1);
                    color: var(--error);
                `;
            case 'OBRIGATORIO':
                return `
                    background-color: rgba(41, 98, 255, 0.1);
                    color: var(--info);
                `;
            case 'AGUARDANDO':
                return `
                    background-color: rgba(255, 195, 106, 0.1);
                    color: var(--warning-500);
                `;
            default:
                return '';
        }
    }}
`

const CardBeneficio = styled.div`
    background: #fff;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
    margin-bottom: 24px;
    padding: 24px 12px 24px 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    width: inherit;
    max-width: 100vw;
    position: relative;
    min-height: 180px;
`

const ItensGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0 24px;
`;

const ColItem = styled.div`
    flex: 1 1 calc(33.333% - 16px);
    min-width: 280px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: var(--neutro-50);
    justify-content: flex-start;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    width: 100%;
    padding: 0 12px;
`;

// Grid para garantir pelo menos 2 colunas
const ContratoItensGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    width: 100%;
`;

// Componente para informações do contrato
const InfoContrato = styled.div`
    padding: 14px 12px;
    background: var(--neutro-100);
    border-radius: 8px;
    font-size: 12px;
    color: var(--neutro-700);
    display: flex;
    flex-direction: column;
    gap: 2px;
    opacity: ${({ inativo }) => inativo ? 0.5 : 1};
    cursor: ${({ inativo }) => inativo ? 'not-allowed' : 'default'};
`

// Tag de status do contrato
const StatusContratoTag = styled.span`
    display: inline-block;
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 8px;
    background: ${({ status }) =>
        status === 'Disponível' ? 'rgba(0, 200, 83, 0.1)' :
        status === 'Indisponível' ? 'rgba(229, 115, 115, 0.1)' :
        'rgba(255, 167, 38, 0.1)'};
    color: ${({ status }) =>
        status === 'Disponível' ? 'var(--success)' :
        status === 'Indisponível' ? 'var(--error)' :
        'var(--warning)'};
`;

// Container para os itens do contrato
const ContratoItensBox = styled.div`
    border-radius: 12px;
    padding: 16px 12px;
`;

const StatusIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 4px;
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

function ColaboradorBeneficios() {
    let { id } = useParams()
    const [beneficios, setBeneficios] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useRef(null)
    const [expandedItems, setExpandedItems] = useState({})
    const [modalInfo, setModalInfo] = useState({ open: false, item: null });

    const statusOptions = [
        { label: 'Pendente', value: 'pendente', icon: <FaClock /> },
        { label: 'Sim', value: 'sim', icon: <FaCheck /> },
        { label: 'Não', value: 'nao', icon: <FaTimes /> }
    ]

    useEffect(() => {
        if (id) {
            carregarBeneficios()
        }
    }, [id])

    const carregarBeneficios = async () => {
        try {
            setLoading(true)
            const response = await http.get(`beneficios_possiveis/${id}/?format=json`)
            if (response && response.beneficios) {
                // Para cada item/plano, cria um registro único
                const lista = [];
                response.beneficios.forEach(beneficio => {
                    beneficio.contratos.forEach(contrato => {
                        contrato.itens.forEach(item => {
                            lista.push({
                                id: item.id,
                                descricao: beneficio.descricao,
                                icone: beneficio.icone,
                                multiplos: beneficio.multiplos,
                                obrigatoriedade: beneficio.obrigatoriedade,
                                status: 'pendente',
                                operadora: contrato.contrato_beneficio?.dados_operadora,
                                plano: item.descricao,
                                contratoInfo: contrato.contrato_beneficio,
                                item,
                                beneficioId: beneficio.id
                            })
                        })
                    })
                })
                setBeneficios(lista)
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

    const handleStatusChange = (itemId, novoStatus, grupoDescricao, multiplos) => {
        setBeneficios(beneficios => {
            if (!multiplos && novoStatus === 'sim') {
                // Só um pode ser sim
                return beneficios.map(b =>
                    b.descricao === grupoDescricao
                        ? { ...b, status: b.id === itemId ? 'sim' : 'nao' }
                        : b
                )
            }
            // Multiplos: cada um pode ser sim/nao/pendente
            return beneficios.map(b =>
                b.id === itemId ? { ...b, status: novoStatus } : b
            )
        })
        toast.current.show({ 
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Status alterado com sucesso', 
            life: 2000 
        })
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
        if (option.value === 'sim') color = 'var(--success)';
        else if (option.value === 'nao') color = 'var(--error)';
        else if (option.value === 'pendente' && obrigatorio) color = 'var(--error)';
        else color = 'var(--warning)';

        let icon = null;
        if (option.value === 'sim') icon = <FaCheck size={14} style={{ color, fontSize: 20 }} />;
        else if (option.value === 'nao') icon = <FaTimes size={14} style={{ color, fontSize: 20 }} />;
        else icon = <FaClock size={14} style={{ color, fontSize: 20 }} />;

        return (
            <StatusIcon style={{gap: 8, justifyContent: 'flex-end'}}>
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
            </StatusIcon>
        );
    };

    const formatarData = (data) => {
        if (!data) return '---';
        const d = new Date(data);
        if (isNaN(d)) return data;
        return d.toLocaleDateString('pt-BR');
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
                <div style={{
                    width: '100%',
                    maxHeight: 'calc(100vh - 270px)', // 270px para considerar algum padding/topo
                    overflowY: 'auto',
                    paddingRight: 8
                }}>
                    {Object.entries(grupos).map(([descricao, itens]) => (
                        <CardBeneficio key={descricao}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                    <IconeBeneficio nomeIcone={isset(itens[0]) ? itens[0]?.icone : descricao} />
                                    <Texto weight={600} size="15px">{descricao}</Texto>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4}}>
                                    {itens[0].obrigatoriedade ? (
                                        <StatusTag $tipo="OBRIGATORIO">BENEFÍCIO OBRIGATÓRIO</StatusTag>
                                    ) : (
                                        <StatusTag $tipo="AGUARDANDO">BENEFÍCIO OPCIONAL</StatusTag>
                                    )}
                                    {!itens[0].multiplos && (
                                        <Texto size="10px" color="var(--warning-500)">
                                            Você só pode selecionar um dos itens abaixo
                                        </Texto>
                                    )}
                                    {itens[0].multiplos && (
                                        <Texto size="10px">
                                            Pode selecionar mais de um deste grupo
                                        </Texto>
                                    )}
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
                                    const operadora = contrato?.dados_operadora;
                                    return (
                                        <div key={contratoId} style={{width: '100%'}}>
                                            {contrato && (
                                                <InfoContrato inativo={getStatusContrato(contrato.status) === 'Indisponível' ? 'true' : undefined}>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, width: '100%'}}>
                                                        {operadora?.imagem_url && (
                                                            <img src={operadora.imagem_url} alt={operadora.nome} style={{width: 32, height: 20, objectFit: 'contain', borderRadius: 4, background: '#fff', border: '1px solid var(--neutro-200)'}} />
                                                        )}
                                                        <span style={{fontWeight: 600, fontSize: 13}}>
                                                            {operadora?.nome}
                                                        </span>
                                                        {contrato.status && (
                                                            <StatusContratoTag status={getStatusContrato(contrato.status)}>
                                                                {getStatusContrato(contrato.status)}
                                                            </StatusContratoTag>
                                                        )}
                                                        <div style={{marginLeft: 'auto'}}>
                                                           
                                                        </div>
                                                    </div>
                                                    {contrato.cnpj && (
                                                        <span><b>CNPJ:</b> {contrato.cnpj}</span>
                                                    )}
                                                    <ContratoItensBox>
                                                        <ContratoItensGrid>
                                                            {itensContrato.map((item, idx) => (
                                                                <ColItem key={item.id}>
                                                                    {/* Custom Accordion-like behavior */}
                                                                    <div style={{width: '100%', padding: '12px'}}>
                                                                        <TopRow>
                                                                            <div style={{display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, flexDirection: 'column'}}>
                                                                                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                                                                                    <Texto size="14px" weight={600}>{item.plano}</Texto>
                                                                                </div>
                                                                                <Texto size="12px" color="var(--neutro-400)">{Real.format(item.item.valor)}</Texto>
                                                                            </div>
                                                                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end', justifyContent: 'space-around', minWidth: 56, gap: 0}}>
                                                                               
                                                                                <button
                                                                                    style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primaria)', fontSize: 16, padding: 0}}
                                                                                    title="Mais informações"
                                                                                    onClick={() => setModalInfo({ open: true, item })}
                                                                                >
                                                                                    <FaInfoCircle />
                                                                                </button>
                                                                                 <CustomDropdown
                                                                                    value={item.status}
                                                                                    options={statusOptions}
                                                                                    onChange={e => handleStatusChange(item.id, e.value, item.descricao, item.multiplos)}
                                                                                    style={{width: 30, height: 25, minWidth: 20, minHeight: 30, padding: 0, background: 'transparent', border: 'none', boxShadow: 'none'}}
                                                                                    panelStyle={{fontSize: 12, minWidth: 80}}
                                                                                    appendTo={document.body}
                                                                                    valueTemplate={(_, props) => statusTemplate(statusOptions.find(opt => opt.value === item.status), { value: item }, true, false, true)}
                                                                                    itemTemplate={option => statusTemplate(option, { option: { ...option, obrigatoriedade: item.obrigatoriedade } }, false, true, false)}
                                                                                    disabled={getStatusContrato(item.contratoInfo?.status) === 'Indisponível'}
                                                                                />
                                                                            </div>
                                                                        </TopRow>
                                                                        {expandedItems[descricao] === item.id && (
                                                                            <div style={{background: 'var(--neutro-50)', borderRadius: 12, marginTop: '12px', padding: '12px 14px'}}>
                                                                                <Texto size="12px" weight={600}>Detalhes do Plano: {item.plano}</Texto>
                                                                                <Texto size="12px">Valor: {Real.format(item.item.valor)}</Texto>
                                                                                <Texto size="12px">Desconto: {Real.format(item.item.valor_desconto)}</Texto>
                                                                                <Texto size="12px">Empresa: {Real.format(item.item.valor_empresa)}</Texto>
                                                                                <Texto size="12px">Tipo Cálculo: {item.item.tipo_calculo}</Texto>
                                                                                <Texto size="12px">Tipo Desconto: {item.item.tipo_desconto}</Texto>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </ColItem>
                                                            ))}
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
        <ModalInfoElegibilidade open={modalInfo.open} item={modalInfo.item} onClose={() => setModalInfo({ open: false, item: null })} />
        </>
    )
}

export default ColaboradorBeneficios