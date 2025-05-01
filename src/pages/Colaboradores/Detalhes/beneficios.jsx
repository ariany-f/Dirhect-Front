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

function ColaboradorBeneficios() {
    let { id } = useParams()
    const [beneficiosPossiveis, setBeneficiosPossiveis] = useState([])
    const [beneficiosDetalhados, setBeneficiosDetalhados] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useRef(null)

    const statusOptions = [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' }
    ]

    useEffect(() => {
        if (id) {
            carregarBeneficiosPossiveis()
        }
    }, [id])

    const carregarBeneficiosPossiveis = async () => {
        try {
            setLoading(true)
            const response = await http.get(`beneficios_possiveis/${id}?format=json`)
            if (response) {
                setBeneficiosPossiveis(response)
                await carregarDetalhesBeneficios(response)
            }
        } catch (erro) {
            console.error(erro)
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao carregar benefícios possíveis', 
                life: 3000 
            })
        } finally {
            setLoading(false)
        }
    }

    const carregarDetalhesBeneficios = async (beneficios) => {
        try {
            const statusPossiveis = ['ATIVO', 'INATIVO', 'OBRIGATORIO', 'AGUARDANDO'];
            const detalhesPromises = beneficios.map(b => 
                http.get(`contrato_beneficio_item/${b.beneficio_id}/?format=json`)
                    .then(response => {
                        if (response) {
                            const statusBeneficio = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];
                            let statusDropdown = 'pendente';

                            switch (statusBeneficio) {
                                case 'ATIVO':
                                    statusDropdown = 'sim';
                                    break;
                                case 'INATIVO':
                                    statusDropdown = 'nao';
                                    break;
                                case 'AGUARDANDO':
                                    statusDropdown = 'pendente';
                                    break;
                                default:
                                    statusDropdown = 'pendente';
                            }

                            return {
                                ...response,
                                statusBeneficio,
                                status: statusDropdown
                            }
                        }
                        return null
                    })
            )
            
            const detalhes = await Promise.all(detalhesPromises)
            setBeneficiosDetalhados(detalhes.filter(d => d !== null))
        } catch (erro) {
            console.error(erro)
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao carregar detalhes dos benefícios', 
                life: 3000 
            })
        }
    }

    const handleStatusChange = (beneficioId, novoStatus) => {
        setBeneficiosDetalhados(beneficios => 
            beneficios.map(b => 
                b.id === beneficioId ? { ...b, status: novoStatus } : b
            )
        )
        
        toast.current.show({ 
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Status alterado com sucesso', 
            life: 3000 
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

    return (
        <>
        <Toast ref={toast} />
        <Frame>
            {loading ? (
                <Col12>
                    {[1,2,3].map(i => (
                        <Col6 key={i}>
                            <Skeleton width="100%" height="400px" borderRadius="16px" />
                        </Col6>
                    ))}
                </Col12>
            ) : beneficiosDetalhados.length > 0 ? (
                <Col12>
                    {beneficiosDetalhados.map((beneficio) => {
                        const dadosBeneficio = beneficio.beneficio.dados_beneficio;
                        const icone = <IconeBeneficio nomeIcone={dadosBeneficio.descricao}/>
                        
                        return (
                            <Col6 key={beneficio.id}>
                                <Beneficio>
                                    <Col12Spaced>
                                        <FrameVertical gap="8px" align="center">
                                            {beneficio.beneficio.image_operadora &&
                                                <CustomImage 
                                                    src={beneficio.beneficio.image_operadora} 
                                                    alt={beneficio.beneficio.nome_operadora} 
                                                    width={'40px'} 
                                                    height={25} 
                                                    size={80} 
                                                    title={beneficio.beneficio.nome_operadora} 
                                                />
                                            }
                                            <Texto weight={600} size="12px">{beneficio.beneficio.nome_operadora}</Texto>
                                        </FrameVertical>
                                        <HeaderContainer>
                                            {beneficio.statusBeneficio !== 'OBRIGATORIO' && (
                                                <StatusContainer>
                                                    <Dropdown
                                                        value={beneficio.status}
                                                        options={statusOptions}
                                                        onChange={(e) => handleStatusChange(beneficio.id, e.value)}
                                                        placeholder="Status"
                                                    />
                                                </StatusContainer>
                                            )}
                                            <StatusTag $tipo={beneficio.statusBeneficio}>
                                                {beneficio.statusBeneficio}
                                            </StatusTag>
                                        </HeaderContainer>
                                    </Col12Spaced>
                                    
                                    <BeneficioContent>
                                        <div style={{display: 'flex', fontSize: '12px', gap: '4px', fontWeight: 600}}>
                                            {icone}
                                            <Texto>{dadosBeneficio.descricao}</Texto>
                                        </div>
                                        <div>
                                            <Texto size={'12px'} weight={600}>Descrição: </Texto>
                                            <Texto size={'12px'}>{beneficio.descricao}</Texto>
                                            <Texto size={'12px'} weight={600}>Tipo Desconto:</Texto>
                                            <Texto size={'12px'}>{getTipoDesconto(beneficio.tipo_desconto)}</Texto>
                                        </div>
                                        <Col12Spaced style={{ marginTop: 'auto' }}>
                                            <Col6Container>
                                                <Texto color="green" weight={400}>
                                                    {Real.format(beneficio.valor)}
                                                </Texto>
                                                <Texto weight={600} size="10px">
                                                    {getTipoCalculo(beneficio.tipo_calculo)}
                                                </Texto>
                                            </Col6Container>
                                            <Col6Container>
                                                <Texto color="red" weight={400}>
                                                    {Real.format(beneficio.valor_desconto)}
                                                </Texto>
                                                <Texto weight={600} size="10px">Colaborador</Texto>
                                            </Col6Container>
                                            <Col6Container>
                                                <Texto color="var(--primaria)" weight={400}>
                                                    {Real.format(beneficio.valor_empresa)}
                                                </Texto>
                                                <Texto weight={600} size="10px">Empresa</Texto>
                                            </Col6Container>
                                        </Col12Spaced>
                                    </BeneficioContent>
                                </Beneficio>
                            </Col6>
                        )
                    })}
                </Col12>
            ) : (
                <Frame align="center">
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