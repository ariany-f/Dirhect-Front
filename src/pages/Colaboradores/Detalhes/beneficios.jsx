import { useEffect, useRef, useState } from "react"
import http from '@http'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import MainContainer from '@components/MainContainer'
import FrameVertical from '@components/FrameVertical'
import CustomImage from '@components/CustomImage'
import { Toast } from 'primereact/toast'
import { Skeleton } from 'primereact/skeleton'
import { Dropdown } from 'primereact/dropdown'
import styled from "styled-components"
import { Real } from '@utils/formats'
import IconeBeneficio from "@components/IconeBeneficio"
import Dashboard from '@assets/Dashboard.svg'
import { useParams } from "react-router-dom"
import { Button } from 'primereact/button'
import { Accordion, AccordionTab } from 'primereact/accordion'

const Beneficio = styled.div`
    display: flex;
    width: calc(50% - 12px);
    min-width: 400px;
    height: 100%;
    padding: 24px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
`

const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
    padding: 8px;
`

const Col12Spaced = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    justify-content: space-between;
`

const Col6Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--neutro-200);
    background: var(--neutro-100);
`

const Col6 = styled.div`
    display: flex;
    align-items: stretch;
    width: calc(50% - 12px);
    min-width: 400px;
`

const BeneficioContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 16px;
`

const StatusContainer = styled.div`
    margin-top: 4px;
    width: 120px;
    align-self: flex-end;
    
    .p-dropdown {
        width: 100%;
        background: var(--neutro-50);
        border: 1px solid var(--neutro-200);
        min-height: 32px;
        height: 32px;
        
        .p-dropdown-label {
            padding: 4px 8px;
            font-size: 12px;
        }
        
        .p-dropdown-trigger {
            width: 24px;
        }
        
        &:hover {
            border-color: var(--primaria);
        }
        
        &.p-focus {
            border-color: var(--primaria);
            box-shadow: 0 0 0 1px var(--primaria-100);
        }
    }
    
    .p-dropdown-panel {
        .p-dropdown-items {
            padding: 4px;
            
            .p-dropdown-item {
                padding: 4px 8px;
                font-size: 12px;
            }
        }
    }
`

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
                    background-color: rgba(255, 167, 38, 0.1);
                    color: var(--warning);
                `;
            default:
                return '';
        }
    }}
`

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`

const LinhaBeneficio = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--neutro-100);
    cursor: pointer;
`

const OperadoraLogo = styled.img`
    width: 32px;
    height: 20px;
    object-fit: contain;
    border-radius: 4px;
    background: #fff;
    border: 1px solid var(--neutro-200);
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

const LinhaItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--neutro-100);
    &:last-child { border-bottom: none; }
`

const StatusItemTag = styled.div`
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 8px;
    background: ${({ status }) =>
        status === 'sim' ? 'rgba(0, 200, 83, 0.1)' :
        status === 'nao' ? 'rgba(229, 115, 115, 0.1)' :
        status === 'OBRIGATORIO' ? 'rgba(41, 98, 255, 0.1)' :
        'rgba(255, 167, 38, 0.1)'};
    color: ${({ status }) =>
        status === 'sim' ? 'var(--success)' :
        status === 'nao' ? 'var(--error)' :
        status === 'OBRIGATORIO' ? 'var(--info)' :
        'var(--warning)'};
    display: inline-block;
`

const ItensGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0 24px;
`;

const ColItem = styled.div`
    flex: 1 1 45%;
    min-width: 320px;
    max-width: 48%;
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
`;

const StatusDropdownRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
`;

// Grid para garantir pelo menos 2 colunas
const ContratoItensGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0 24px;
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
        status === 'Ativo' ? 'rgba(0, 200, 83, 0.1)' :
        status === 'Inativo' ? 'rgba(229, 115, 115, 0.1)' :
        'rgba(255, 167, 38, 0.1)'};
    color: ${({ status }) =>
        status === 'Ativo' ? 'var(--success)' :
        status === 'Inativo' ? 'var(--error)' :
        'var(--warning)'};
`;

// Badge do número do contrato
const ContratoBadge = styled.span`
    display: inline-block;
    background: var(--primaria-100, #e3e8f7);
    color: var(--primaria, #5472d4);
    font-size: 11px;
    font-weight: 400;
    border-radius: 8px;
    padding: 2px 8px;
    margin-left: 6px;
`;

// Container para os itens do contrato
const ContratoItensBox = styled.div`
    border-radius: 12px;
    padding: 16px 12px;
`;

function ColaboradorBeneficios() {
    let { id } = useParams()
    const [beneficios, setBeneficios] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useRef(null)
    const [expandedItems, setExpandedItems] = useState({})

    const statusOptions = [
        { label: 'Pendente de escolha', value: 'pendente' },
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' }
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
            case 'A': return 'Ativo';
            case 'I': return 'Inativo';
            default: return status;
        }
    }

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
                <div style={{width: '100%'}}>
                    {Object.entries(grupos).map(([descricao, itens]) => (
                        <CardBeneficio key={descricao}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                    <IconeBeneficio nomeIcone={itens[0].icone ?? descricao} />
                                    <Texto weight={600} size="15px">{descricao}</Texto>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4}}>
                                    {itens[0].obrigatoriedade ? (
                                        <StatusTag $tipo="OBRIGATORIO">BENEFÍCIO OBRIGATÓRIO</StatusTag>
                                    ) : (
                                        <StatusTag $tipo="AGUARDANDO">BENEFÍCIO OPCIONAL</StatusTag>
                                    )}
                                    {!itens[0].multiplos && (
                                        <Texto size="10px" color="var(--info)">
                                            Você só pode selecionar um dos itens abaixo
                                        </Texto>
                                    )}
                                    {itens[0].multiplos && (
                                        <Texto size="10px" color="var(--info)">
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
                                                <InfoContrato inativo={getStatusContrato(contrato.status) === 'Inativo'}>
                                                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2}}>
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
                                                    </div>
                                                    {contrato.cnpj && (
                                                        <span><b>CNPJ:</b> {contrato.cnpj}</span>
                                                    )}
                                                    <ContratoItensBox>
                                                        <ContratoItensGrid>
                                                            {itensContrato.map((item, idx) => (
                                                                <ColItem key={item.id}>
                                                                    <Accordion
                                                                        activeIndex={expandedItems[descricao] === item.id ? 0 : null}
                                                                        onTabChange={e => setExpandedItems(prev => ({ ...prev, [descricao]: e.index === 0 ? item.id : null }))}
                                                                    >
                                                                        <AccordionTab
                                                                            header={
                                                                                <>
                                                                                    <TopRow>
                                                                                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                                                                            {item.item.icone && (
                                                                                                <span style={{marginLeft: 6, marginRight: 2}}>
                                                                                                    <IconeBeneficio nomeIcone={item.item.icone} />
                                                                                                </span>
                                                                                            )}
                                                                                            <Texto size="12px" weight={600}>{item.plano}</Texto>
                                                                                            <Dropdown
                                                                                                value={item.status}
                                                                                                options={statusOptions}
                                                                                                onChange={e => handleStatusChange(item.id, e.value, item.descricao, item.multiplos)}
                                                                                                style={{width: 170, minWidth: 160, fontSize: 12, height: 30}}
                                                                                                panelStyle={{fontSize: 12}}
                                                                                                appendTo={document.body}
                                                                                            />
                                                                                        </div>
                                                                                        {item.status !== 'pendente' && (
                                                                                            <StatusItemTag status={item.obrigatoriedade ? 'OBRIGATORIO' : item.status}>{getStatusLabel(item)}</StatusItemTag>
                                                                                        )}
                                                                                    </TopRow>
                                                                                </>
                                                                            }
                                                                        >
                                                                            <div style={{background: 'var(--neutro-50)', borderRadius: 8, margin: '8px 0', padding: 12}}>
                                                                                <Texto size="12px" weight={600}>Detalhes do Plano: {item.plano}</Texto>
                                                                                <Texto size="12px">Valor: {Real.format(item.item.valor)}</Texto>
                                                                                <Texto size="12px">Desconto: {Real.format(item.item.valor_desconto)}</Texto>
                                                                                <Texto size="12px">Empresa: {Real.format(item.item.valor_empresa)}</Texto>
                                                                                <Texto size="12px">Tipo Cálculo: {item.item.tipo_calculo}</Texto>
                                                                                <Texto size="12px">Tipo Desconto: {item.item.tipo_desconto}</Texto>
                                                                            </div>
                                                                        </AccordionTab>
                                                                    </Accordion>
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
        </>
    )
}

export default ColaboradorBeneficios