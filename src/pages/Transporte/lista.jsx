import { useEffect, useState, useRef, useMemo } from "react"
import styled from "styled-components"
import { FaListUl, FaChartBar, FaBus, FaMapMarkerAlt, FaMoneyBillWave, FaDownload, FaFilter } from 'react-icons/fa'
import Texto from '@components/Texto'
import { Toast } from 'primereact/toast'
import DataTableTransporte from '@components/DataTableTransporte'
import GraficosTransporte from '@components/GraficosTransporte'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import transporteData from '@json/transporte.json'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const TabPanel = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding-top: 2px;
`

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ $active }) => $active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#f5f5f5'};
    color: ${({ $active }) => $active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ $active }) => $active ? '2px solid var(--gradient-secundaria)' : '2px solid transparent'};
    &:hover {
        background: ${({ $active }) => $active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#ececec'};
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: #f5f5f5;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b0b7c3;
    }
    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`

function TransporteListagem() {
    const [tab, setTab] = useState('lista')
    const [colaboradores, setColaboradores] = useState([])
    const toast = useRef(null)

    // Carrega dados do JSON ao montar o componente
    useEffect(() => {
        // Mapeia os dados do JSON para o formato esperado pelo DataTable
        const dadosFormatados = transporteData.map(item => ({
            id: item.id,
            nome: item.colaborador_nome,
            chapa: item.colaborador_chapa,
            filial: item.filial_nome,
            filial_id: item.filial_id,
            distancia_km: item.distancia_km,
            valor_transporte: item.valor_mensal,
            tipo_transporte: item.tipo_transporte,
            tempo_deslocamento: item.tempo_deslocamento_minutos,
            endereco_residencial: item.endereco_residencial,
            linhas_transporte: item.linhas_transporte
        }))
        setColaboradores(dadosFormatados)
    }, [])

    // Calcular estatísticas
    const stats = useMemo(() => {
        const totalColaboradores = colaboradores.length
        const distanciaMedia = colaboradores.reduce((acc, col) => acc + col.distancia_km, 0) / totalColaboradores
        const custoTotal = colaboradores.reduce((acc, col) => acc + col.valor_transporte, 0)
        const custoMedio = custoTotal / totalColaboradores

        return {
            totalColaboradores,
            distanciaMedia: distanciaMedia.toFixed(1),
            custoTotal: custoTotal.toFixed(2),
            custoMedio: custoMedio.toFixed(2)
        }
    }, [colaboradores])

    const handleTabChange = (newTab) => {
        setTab(newTab)
    }

    const handleExport = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Exportação',
            detail: 'Funcionalidade de exportação será implementada em breve',
            life: 3000
        })
    }

    const handleFilter = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Filtros',
            detail: 'Funcionalidade de filtros será implementada em breve',
            life: 3000
        })
    }

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <BotaoGrupo align="space-between" wrap>
                <TabPanel>
                    <TabButton $active={tab === 'lista'} onClick={() => handleTabChange('lista')}>
                        <FaListUl fill={tab === 'lista' ? 'white' : '#000'} />
                        <Texto color={tab === 'lista' ? 'white' : '#000'}>Lista</Texto>
                    </TabButton>
                    <TabButton $active={tab === 'graficos'} onClick={() => handleTabChange('graficos')}>
                        <FaChartBar fill={tab === 'graficos' ? 'white' : '#000'} />
                        <Texto color={tab === 'graficos' ? 'white' : '#000'}>Gráficos</Texto>
                    </TabButton>
                </TabPanel>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Botao
                        aoClicar={handleExport}
                        estilo="vermilion"
                        size="small"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <FaDownload size={14} />
                        Exportar
                    </Botao>
                </div>
            </BotaoGrupo>
            
            <Wrapper>
                {tab === 'lista' && (
                    <DataTableTransporte 
                        colaboradores={colaboradores}
                    />
                )}
                {tab === 'graficos' && (
                    <GraficosTransporte 
                        colaboradores={colaboradores}
                    />
                )}
            </Wrapper>
        </ConteudoFrame>
    )
}

export default TransporteListagem

