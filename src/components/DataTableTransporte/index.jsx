import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import styled from 'styled-components'
import Texto from '@components/Texto'
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

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
`

function DataTableTransporte({ colaboradores, showActions = true }) {
    const [globalFilter, setGlobalFilter] = useState('')

    // Configuração de larguras das colunas
    // Larguras base: colaborador, filial, distancia, valor, tipo, acoes
    const larguraBase = [25, 15, 12, 15, 18, 15];
    
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

    const tipoTransporteTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.tipo_transporte} 
                severity="info"
                style={{ fontSize: '12px' }}
            />
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

    return (
        <TableContainer>
            <StyledDataTable
                value={colaboradores}
                paginator
                rows={10}
                tableStyle={{ minWidth: '68vw' }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="id"
                globalFilter={globalFilter}
                header={header}
                emptyMessage="Nenhum colaborador encontrado."
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} colaboradores"
            >
                <Column 
                    field="nome" 
                    header="Colaborador" 
                    body={nomeTemplate}
                    sortable
                    style={{ width: `${largurasColunas[0]}%` }}
                />
                <Column 
                    field="filial" 
                    header="Filial" 
                    body={filialTemplate}
                    sortable
                    style={{ width: `${largurasColunas[1]}%` }}
                />
                <Column 
                    field="distancia_km" 
                    header="Distância" 
                    body={distanciaTemplate}
                    sortable
                    style={{ width: `${largurasColunas[2]}%` }}
                />
                <Column 
                    field="valor_transporte" 
                    header="Valor Mensal" 
                    body={valorTemplate}
                    sortable
                    style={{ width: `${largurasColunas[3]}%` }}
                />
                <Column 
                    field="tipo_transporte" 
                    header="Tipo" 
                    body={tipoTransporteTemplate}
                    style={{ width: `${largurasColunas[4]}%` }}
                />
                {showActions && (
                    <Column 
                        header="Ações" 
                        body={actionsTemplate}
                        style={{ width: `${largurasColunas[5]}%`, textAlign: 'center' }}
                    />
                )}
            </StyledDataTable>
        </TableContainer>
    )
}

export default DataTableTransporte

