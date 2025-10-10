import React, { useState, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Tooltip } from 'primereact/tooltip'
import { Dialog } from 'primereact/dialog'
import styled from 'styled-components'
import Texto from '@components/Texto'
import { FaSearch, FaEye, FaEdit, FaTrash, FaClock, FaLeaf, FaExclamationTriangle, FaMapMarkerAlt, FaRoute, FaTimes } from 'react-icons/fa'

const TableContainer = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    
    input {
        padding: 8px 12px 8px 40px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        fontSize: 14px;
        width: 300px;
        transition: all 0.2s ease;
        background: #fff;
        
        &:focus {
            outline: none;
            border-color: var(--primaria);
            box-shadow: 0 0 0 0.2rem rgba(var(--primaria-rgb), .25);
        }
        
        &::placeholder {
            color: #6b7280;
        }
    }
    
    .search-icon {
        position: absolute;
        left: 16px;
        color: #6b7280;
        z-index: 1;
    }
`

const ActionsContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background: ${({ $color }) => $color || '#f3f4f6'};
    color: ${({ $textColor }) => $textColor || '#6b7280'};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${({ $hoverColor }) => $hoverColor || '#e5e7eb'};
    }
`

const StyledDataTable = styled(DataTable)`
    .p-datatable-header {
        background: transparent;
        border: none;
        padding: 0 0 16px 0;
    }
    
    .p-datatable-thead > tr > th {
        color: white;
        font-weight: 600;
        padding: 12px;
        border: none;
        font-size: 14px;
        letter-spacing: 0.5px;
    }
    
    .p-datatable-tbody > tr {
        transition: background-color 0.2s;
        &:hover {
            background-color: #f5f5f5;
        }
    }
    
    .p-datatable-tbody > tr > td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .p-datatable-row-expansion {
        background: #f8f9fa !important;
        border-top: 1px solid #dee2e6 !important;
        padding: 0 !important;
    }
    
    .p-datatable-expanded-row > td {
        padding: 0 !important;
        border-bottom: none !important;
    }
    
    .p-datatable-tbody > tr > td:first-child {
        text-align: center !important;
        vertical-align: middle !important;
    }
    
    .p-row-toggler {
        color: var(--primaria) !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        padding: 4px !important;
        border-radius: 4px !important;
        transition: all 0.2s ease !important;
        width: 24px !important;
        height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 10 !important;
        position: relative !important;
        
        &:hover {
            background: rgba(var(--primaria-rgb), 0.1) !important;
        }
        
        &:focus {
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(var(--primaria-rgb), 0.2) !important;
        }
        
        &:active {
            background: rgba(var(--primaria-rgb), 0.2) !important;
        }
    }
    
    .p-row-toggler-icon {
        font-size: 14px !important;
        transition: transform 0.2s ease !important;
    }
    
    .p-datatable-row-expansion-icon {
        transition: transform 0.2s ease !important;
    }
    
    .p-paginator {
        background: transparent;
        border: none;
        padding: 16px 0 0 0;
        margin-top: 16px;
    }
    
    .p-paginator .p-paginator-page,
    .p-paginator .p-paginator-prev,
    .p-paginator .p-paginator-next,
    .p-paginator .p-paginator-first,
    .p-paginator .p-paginator-last {
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin: 0 2px;
    }
    
    .p-paginator .p-paginator-page.p-highlight {
        background: var(--primaria);
        border-color: var(--primaria);
    }
`

const MapModalContainer = styled.div`
    .p-dialog {
        width: 90vw !important;
        max-width: 1200px !important;
        height: 80vh !important;
    }
    
    .p-dialog-content {
        padding: 0 !important;
        height: calc(80vh - 60px) !important;
    }
`

const MapHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: linear-gradient(to right, var(--primaria), var(--secundaria));
    color: white;
    border-radius: 8px 8px 0 0;
`

const MapContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`

const MapInfo = styled.div`
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
`

const MapIframe = styled.iframe`
    flex: 1;
    width: 100%;
    border: none;
    border-radius: 0 0 8px 8px;
`

const CloseButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
`

function DataTableTransporte({ colaboradores, showActions = true }) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [mapModalVisible, setMapModalVisible] = useState(false)
    const [selectedColaborador, setSelectedColaborador] = useState(null)
    const [expandedRows, setExpandedRows] = useState(null)

    // Configuração de larguras das colunas
    // Larguras base: expand, colaborador, filial, distancia, valor, tempo, carbono, risco, mapa, acoes
    const larguraBase = [5, 20, 15, 10, 12, 8, 8, 8, 8, 6];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        if (showActions) {
            // Se exibe ações, usa as larguras normais
            return larguraBase;
        } else {
            // Se não exibe ações, remove a última coluna e redistribui
            const largurasSemAcoes = larguraBase.slice(0, -1); // Remove a última (ações)
            const totalSemAcoes = largurasSemAcoes.reduce((acc, val) => acc + val, 0);
            const fatorRedistribuicao = 100 / totalSemAcoes;
            
            return largurasSemAcoes.map(largura => Math.round(largura * fatorRedistribuicao * 100) / 100);
        }
    };
    
    const largurasColunas = calcularLarguras();

    // Enriquece dados com métricas calculadas
    const colaboradoresEnriquecidos = useMemo(() => {
        return colaboradores.map(col => {
            // Calcula emissão de CO2 (0.12 kg CO2 por km)
            const emissaoCO2Mensal = col.distancia_km * 2 * 22 * 0.12; // ida e volta, 22 dias úteis
            
            // Calcula nível de risco baseado no tempo de deslocamento
            let nivelRisco = 'Baixo';
            let corRisco = '#22c55e';
            if (col.tempo_deslocamento > 90) {
                nivelRisco = 'Crítico';
                corRisco = '#dc2626';
            } else if (col.tempo_deslocamento > 60) {
                nivelRisco = 'Alto';
                corRisco = '#ef4444';
            } else if (col.tempo_deslocamento > 45) {
                nivelRisco = 'Médio';
                corRisco = '#f59e0b';
            }
            
            // Calcula economia potencial com home office (apenas se distância > 15km)
            const economiaHomeOffice = col.distancia_km > 15 ? col.valor_transporte : 0;
            
            return {
                ...col,
                emissaoCO2Mensal,
                nivelRisco,
                corRisco,
                economiaHomeOffice
            };
        });
    }, [colaboradores]);

    const header = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SearchContainer>
                <FaSearch className="search-icon" size={16} />
                <input
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                />
            </SearchContainer>
        </div>
    )

    const nomeTemplate = (rowData) => {
        return (
            <div>
                <Texto weight={600}>{rowData.nome}</Texto>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Chapa: {rowData.chapa}</div>
            </div>
        )
    }

    const filialTemplate = (rowData) => {
        const cores = {
            1: '#1e40af',
            2: '#059669',
            3: '#7c3aed'
        }
        
        return (
            <Tag 
                value={rowData.filial} 
                style={{ 
                    background: cores[rowData.filial_id] || '#6b7280',
                    fontSize: '12px',
                    padding: '4px 12px'
                }}
            />
        )
    }

    const distanciaTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="pi pi-map-marker" style={{ color: '#059669' }} />
                <Texto weight={600}>{rowData.distancia_km.toFixed(1)} km</Texto>
            </div>
        )
    }

    const valorTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="pi pi-dollar" style={{ color: '#dc2626' }} />
                <Texto weight={600} color="#dc2626">
                    R$ {rowData.valor_transporte.toFixed(2)}
                </Texto>
            </div>
        )
    }

    const tempoDeslocamentoTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaClock size={12} style={{ color: '#6b7280' }} />
                <Texto size="13px" weight={500}>
                    {rowData.tempo_deslocamento} min
                </Texto>
            </div>
        )
    }

    const carbonoTemplate = (rowData) => {
        return (
            <>
                <Tooltip target={`.carbono-${rowData.id}`} />
                <div 
                    className={`carbono-${rowData.id}`}
                    data-pr-tooltip={`Emissão mensal estimada baseada em ${rowData.distancia_km.toFixed(1)}km × 2 (ida/volta) × 22 dias`}
                    data-pr-position="top"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'help' }}
                >
                    <FaLeaf size={12} style={{ color: '#22c55e' }} />
                    <Texto size="13px" weight={500} color="#22c55e">
                        {rowData.emissaoCO2Mensal.toFixed(1)} kg
                    </Texto>
                </div>
            </>
        )
    }

    // Template para expansão de linha (detalhes)
    const rowExpansionTemplate = (data) => {
        const enderecosFilial = {
            1: 'Rua das Flores, 123 - Centro - São Paulo/SP',
            2: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP', 
            3: 'Rua Augusta, 456 - Consolação - São Paulo/SP'
        }

        return (
            <div style={{ 
                padding: '20px', 
                background: '#f8f9fa', 
                borderTop: '1px solid #dee2e6',
                width: '100%',
                minHeight: '100px'
            }}>
                {/* Header da Expansão */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #dee2e6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            background: 'var(--primaria)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            {data.nome.charAt(0)}
                        </div>
                        <div>
                            <h3 style={{ 
                                margin: '0 0 4px 0', 
                                color: '#495057',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}>
                                Detalhes de {data.nome}
                            </h3>
                            <p style={{ 
                                margin: '0', 
                                color: '#6c757d',
                                fontSize: '13px'
                            }}>
                                Chapa: {data.chapa} • Filial: {data.filial}
                            </p>
                        </div>
                    </div>
                    <div style={{ 
                        padding: '6px 12px',
                        background: '#e9ecef',
                        borderRadius: '4px',
                        color: '#495057',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}>
                        {data.distancia_km.toFixed(1)} km • {data.tempo_deslocamento} min
                    </div>
                </div>
                
                {/* Seção de Endereços */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    <div>
                        <h4 style={{ 
                            margin: '0 0 8px 0', 
                            color: '#495057',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FaMapMarkerAlt size={12} color="#6c757d" />
                            Endereço Residencial
                        </h4>
                        <div style={{ 
                            padding: '12px',
                            background: '#fff',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#495057'
                        }}>
                            {data.endereco_residencial}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style={{ 
                            margin: '0 0 8px 0', 
                            color: '#495057',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FaMapMarkerAlt size={12} color="#007bff" />
                            Endereço da Filial
                        </h4>
                        <div style={{ 
                            padding: '12px',
                            background: '#fff',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#495057'
                        }}>
                            {enderecosFilial[data.filial_id] || 'Endereço não informado'}
                        </div>
                    </div>
                </div>
                
                {/* Seção de Informações de Transporte */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '16px'
                }}>
                    <div style={{ 
                        padding: '12px',
                        background: '#e3f2fd',
                        borderRadius: '4px',
                        border: '1px solid #bbdefb'
                    }}>
                        <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: '600', marginBottom: '4px' }}>
                            Linhas de Transporte
                        </div>
                        <div style={{ fontSize: '14px', color: '#1976d2' }}>
                            {data.linhas_transporte || 'Não informado'}
                        </div>
                    </div>
                    
                    <div style={{ 
                        padding: '12px',
                        background: '#f3e5f5',
                        borderRadius: '4px',
                        border: '1px solid #e1bee7'
                    }}>
                        <div style={{ fontSize: '12px', color: '#7b1fa2', fontWeight: '600', marginBottom: '4px' }}>
                            Tipo de Transporte
                        </div>
                        <div style={{ fontSize: '14px', color: '#7b1fa2' }}>
                            {data.tipo_transporte}
                        </div>
                    </div>
                    
                    <div style={{ 
                        padding: '12px',
                        background: '#e8f5e8',
                        borderRadius: '4px',
                        border: '1px solid #c8e6c9'
                    }}>
                        <div style={{ fontSize: '12px', color: '#388e3c', fontWeight: '600', marginBottom: '4px' }}>
                            Economia Home Office
                        </div>
                        <div style={{ fontSize: '14px', color: '#388e3c', fontWeight: '600' }}>
                            R$ {data.economiaHomeOffice.toFixed(2)}/mês
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const mapaTemplate = (rowData) => {
        return (
            <ActionButton 
                $color="#e0f2fe" 
                $textColor="#0369a1"
                $hoverColor="#bae6fd"
                title="Ver trajeto no mapa"
                onClick={() => {
                    setSelectedColaborador(rowData)
                    setMapModalVisible(true)
                }}
            >
                <FaRoute size={12} />
            </ActionButton>
        )
    }

    const riscoTemplate = (rowData) => {
        return (
            <>
                <Tooltip target={`.risco-${rowData.id}`} />
                <div 
                    className={`risco-${rowData.id}`}
                    data-pr-tooltip={`Risco de turnover baseado em tempo de deslocamento ${rowData.nivelRisco === 'Crítico' || rowData.nivelRisco === 'Alto' ? 'elevado' : 'baixo'}`}
                    data-pr-position="top"
                    style={{ cursor: 'help' }}
                >
                    <Tag 
                        value={rowData.nivelRisco} 
                        style={{ 
                            backgroundColor: rowData.corRisco,
                            color: 'white',
                            fontSize: '11px',
                            padding: '3px 8px',
                            fontWeight: 600
                        }}
                        icon={rowData.nivelRisco === 'Crítico' || rowData.nivelRisco === 'Alto' ? <FaExclamationTriangle style={{ marginRight: '4px' }} size={10} /> : null}
                    />
                </div>
            </>
        )
    }

    const actionsTemplate = (rowData) => {
        return (
            <ActionsContainer>
                <ActionButton 
                    $color="#e0f2fe" 
                    $textColor="#0369a1"
                    $hoverColor="#bae6fd"
                    title="Visualizar detalhes"
                >
                    <FaEye size={12} />
                </ActionButton>
                <ActionButton 
                    $color="#fef3c7" 
                    $textColor="#d97706"
                    $hoverColor="#fde68a"
                    title="Editar colaborador"
                >
                    <FaEdit size={12} />
                </ActionButton>
                <ActionButton 
                    $color="#fee2e2" 
                    $textColor="#dc2626"
                    $hoverColor="#fecaca"
                    title="Remover colaborador"
                >
                    <FaTrash size={12} />
                </ActionButton>
            </ActionsContainer>
        )
    }

    // Função para gerar URL do Google Maps com transporte público
    const gerarUrlMapa = (colaborador) => {
        const enderecosFilial = {
            1: 'Rua das Flores, 123 - Centro - São Paulo/SP',
            2: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP', 
            3: 'Rua Augusta, 456 - Consolação - São Paulo/SP'
        }
        
        const origem = encodeURIComponent(colaborador.endereco_residencial)
        const destino = encodeURIComponent(enderecosFilial[colaborador.filial_id] || 'São Paulo, SP')
        
        return `https://www.google.com/maps/dir/${origem}/${destino}/@-23.5505,-46.6333,12z/data=!3m1!4b1!4m2!4m1!3e3`
    }

    return (
        <>
            <TableContainer>
                <StyledDataTable
                    value={colaboradoresEnriquecidos}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    paginator
                    rows={10}
                    tableStyle={{ minWidth: '90vw' }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    dataKey="id"
                    globalFilter={globalFilter}
                    header={header}
                    emptyMessage="Nenhum colaborador encontrado."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} colaboradores"
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column 
                        expander={true}
                        style={{ width: `${largurasColunas[0]}%`, textAlign: 'center' }}
                    />
                    <Column 
                        field="nome" 
                        header="Colaborador" 
                        body={nomeTemplate}
                        sortable
                        style={{ width: `${largurasColunas[1]}%` }}
                    />
                    <Column 
                        field="filial" 
                        header="Filial" 
                        body={filialTemplate}
                        sortable
                        style={{ width: `${largurasColunas[2]}%` }}
                    />
                    <Column 
                        field="distancia_km" 
                        header="Distância" 
                        body={distanciaTemplate}
                        sortable
                        style={{ width: `${largurasColunas[3]}%` }}
                    />
                    <Column 
                        field="valor_transporte" 
                        header="Valor/Mês" 
                        body={valorTemplate}
                        sortable
                        style={{ width: `${largurasColunas[4]}%` }}
                    />
                    <Column 
                        field="tempo_deslocamento" 
                        header="Tempo" 
                        body={tempoDeslocamentoTemplate}
                        sortable
                        style={{ width: `${largurasColunas[5]}%` }}
                    />
                    <Column 
                        field="emissaoCO2Mensal" 
                        header="CO₂/Mês" 
                        body={carbonoTemplate}
                        sortable
                        style={{ width: `${largurasColunas[6]}%` }}
                    />
                    <Column 
                        field="nivelRisco" 
                        header="Risco" 
                        body={riscoTemplate}
                        sortable
                        style={{ width: `${largurasColunas[7]}%` }}
                    />
                    <Column 
                        header="Mapa" 
                        body={mapaTemplate}
                        style={{ width: `${largurasColunas[8]}%`, textAlign: 'center' }}
                    />
                    {showActions && (
                        <Column 
                            header="Ações" 
                            body={actionsTemplate}
                            style={{ width: `${largurasColunas[9]}%`, textAlign: 'center' }}
                        />
                    )}
                </StyledDataTable>
            </TableContainer>

            {/* Modal do Mapa */}
            <Dialog 
                visible={mapModalVisible} 
                onHide={() => setMapModalVisible(false)}
                modal
                style={{ width: '90vw', maxWidth: '1200px' }}
                contentStyle={{ padding: 0, height: '80vh' }}
            >
                <MapModalContainer>
                    {selectedColaborador && (
                        <MapContent>
                            <MapHeader>
                                <div>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaRoute />
                                        Trajeto: {selectedColaborador.nome}
                                    </h3>
                                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                                        {selectedColaborador.distancia_km.toFixed(1)} km • {selectedColaborador.tempo_deslocamento} min • {selectedColaborador.tipo_transporte}
                                    </p>
                                </div>
                                <CloseButton onClick={() => setMapModalVisible(false)}>
                                    <FaTimes size={14} />
                                </CloseButton>
                            </MapHeader>
                            
                            <MapInfo>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div>
                                        <strong>Origem:</strong> {selectedColaborador.endereco_residencial}
                                    </div>
                                    <div>
                                        <strong>Destino:</strong> {selectedColaborador.filial}
                                    </div>
                                    <div>
                                        <strong>Linhas:</strong> {selectedColaborador.linhas_transporte || 'Não informado'}
                                    </div>
                                </div>
                            </MapInfo>
                            
                            <MapIframe 
                                src={gerarUrlMapa(selectedColaborador)}
                                title="Trajeto no Google Maps"
                                allowFullScreen
                            />
                        </MapContent>
                    )}
                </MapModalContainer>
            </Dialog>
        </>
    )
}

export default DataTableTransporte

