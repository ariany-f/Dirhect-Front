import React from 'react';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Button } from 'primereact/button';
import { FaPen, FaTrash, FaPlay, FaPause } from 'react-icons/fa';

const StatusTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    
    &.ativo {
        background-color: rgba(0, 200, 83, 0.1);
        color: var(--success);
    }
    
    &.inativo {
        background-color: rgba(229, 115, 115, 0.1);
        color: var(--error);
    }
    
    &.pausado {
        background-color: rgba(255, 167, 38, 0.1);
        color: var(--warning);
    }
`;

const FrequencyBadge = styled.span`
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    background: #e3f2fd;
    color: #1976d2;
`;

const ActionButtons = styled.div`
    display: flex;
    padding: 0;
    gap: 1px;
    align-items: center;
    justify-content: center;
`;


const DataTableAgendamentosN8N = ({ 
    data, 
    onEdit, 
    onDelete, 
    onToggleStatus,
    loading = false,
    paginator = false,
    rows = 10,
    totalRecords = 0,
    onPageChange,
    first = 0
}) => {

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        // Todas as colunas são sempre exibidas neste DataTable
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Nome, Entidade, Tipo, Status, Próxima Execução, Última Execução, Tentativas, Ações
    const larguraBase = [18, 12, 12, 10, 15, 15, 6, 12];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        let larguras = [...larguraBase];
        
        // Neste DataTable, todas as colunas são sempre exibidas
        // mas mantemos a estrutura para consistência
        const totalFiltrado = larguras.reduce((acc, val) => acc + val, 0);
        const fatorRedistribuicao = 100 / totalFiltrado;
        
        return larguras.map(largura => Math.round(largura * fatorRedistribuicao * 100) / 100);
    };
    
    const largurasColunas = calcularLarguras();

    // Template para o footer do total
    const totalAgendamentosTemplate = () => {
        return 'Total de Agendamentos: ' + (totalRecords ?? data?.length ?? 0);
    };

    const statusTemplate = (rowData) => {
        return <StatusTag className={rowData.status}>{rowData.status_display}</StatusTag>;
    };

    const tipoTemplate = (rowData) => {
        return <FrequencyBadge>{rowData.tipo_agendamento_display}</FrequencyBadge>;
    };

    const entidadeTemplate = (rowData) => {
        const entidadeMap = {
            'funcionario': 'Funcionário',
            'atestado': 'Atestado', 
            'estrutura_organizacional': 'Estrutura Organizacional'
        };
        return entidadeMap[rowData.entidade] || rowData.entidade;
    };

    const proximaExecucaoTemplate = (rowData) => {
        if (!rowData.proxima_execucao) return '-';
        return new Date(rowData.proxima_execucao).toLocaleString('pt-BR');
    };

    const ultimaExecucaoTemplate = (rowData) => {
        if (!rowData.ultima_execucao) return 'Nunca executado';
        return new Date(rowData.ultima_execucao).toLocaleString('pt-BR');
    };

    const actionsTemplate = (rowData) => {
        return (
            <ActionButtons>
                <Button
                    icon={rowData.ativo ? <FaPause size={16} /> : <FaPlay size={16} />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onToggleStatus && onToggleStatus(rowData)}
                    tooltip={rowData.ativo ? 'Pausar' : 'Ativar'}
                />
                <Button
                    icon={<FaPen size={16} />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onEdit && onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<FaTrash size={16} />}
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={() => onDelete && onDelete(rowData)}
                    tooltip="Excluir"
                />
            </ActionButtons>
        );
    };

    return (
        <DataTable
            value={data}
            paginator={paginator}
            rows={rows}
            totalRecords={totalRecords}
            onPage={onPageChange}
            first={first}
            emptyMessage="Nenhum agendamento encontrado"
            loading={loading}
            lazy={paginator}
            tableStyle={{ minWidth: '68vw' }}
            footerColumnGroup={
                paginator ? (
                    <ColumnGroup>
                        <Row>
                            <Column footer={totalAgendamentosTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                        </Row>
                    </ColumnGroup>
                ) : null
            }
        >
            <Column field="nome" header="Nome" sortable style={{ width: `${largurasColunas[0]}%` }} />
            <Column body={entidadeTemplate} header="Entidade" style={{ width: `${largurasColunas[1]}%` }} />
            <Column body={tipoTemplate} header="Tipo" style={{ width: `${largurasColunas[2]}%` }} />
            <Column body={statusTemplate} header="Status" style={{ width: `${largurasColunas[3]}%` }} />
            <Column body={proximaExecucaoTemplate} header="Próxima Execução" style={{ width: `${largurasColunas[4]}%` }} />
            <Column body={ultimaExecucaoTemplate} header="Última Execução" style={{ width: `${largurasColunas[5]}%` }} />
            <Column field="tentativas_realizadas" header="Tent." style={{ width: `${largurasColunas[6]}%` }} />
            <Column body={actionsTemplate} header="" style={{ width: `${largurasColunas[7]}%` }} />
        </DataTable>
    );
};

export default DataTableAgendamentosN8N;