import React from 'react';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FaPen, FaTrash, FaPlay, FaPause } from 'react-icons/fa';

const StatusBadge = styled.span`
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    
    &.ativo {
        background: #d4edda;
        color: #155724;
    }
    
    &.inativo {
        background: #f8d7da;
        color: #721c24;
    }
    
    &.pausado {
        background: #fff3cd;
        color: #856404;
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
    gap: 8px;
    align-items: center;
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


    const statusTemplate = (rowData) => {
        return <StatusBadge className={rowData.status}>{rowData.status_display}</StatusBadge>;
    };

    const tipoTemplate = (rowData) => {
        return <FrequencyBadge>{rowData.tipo_display || rowData.entidade_display}</FrequencyBadge>;
    };



    const agendadoParaTemplate = (rowData) => {
        if (!rowData.agendado_para) return '-';
        return new Date(rowData.agendado_para).toLocaleString('pt-BR');
    };

    const concluidoEmTemplate = (rowData) => {
        if (!rowData.concluido_em) return 'Pendente';
        return new Date(rowData.concluido_em).toLocaleString('pt-BR');
    };

    const actionsTemplate = (rowData) => {
        return (
            <ActionButtons>
                <Button
                    icon={rowData.ativo ? <FaPause /> : <FaPlay />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onToggleStatus && onToggleStatus(rowData)}
                    tooltip={rowData.ativo ? 'Pausar' : 'Ativar'}
                />
                <Button
                    icon={<FaPen />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onEdit && onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<FaTrash />}
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
            className="p-datatable-sm"
            loading={loading}
            lazy={paginator}
        >
            <Column field="descricao" header="Descrição" sortable style={{ width: '25%' }} />
            <Column body={tipoTemplate} header="Tipo" style={{ width: '15%' }} />
            <Column body={statusTemplate} header="Status" style={{ width: '10%' }} />
            <Column body={agendadoParaTemplate} header="Agendado Para" style={{ width: '15%' }} />
            <Column body={concluidoEmTemplate} header="Concluído Em" style={{ width: '15%' }} />
            <Column field="tentativas" header="Tentativas" style={{ width: '8%' }} />
            <Column body={actionsTemplate} header="Ações" style={{ width: '12%' }} />
        </DataTable>
    );
};

export default DataTableAgendamentosN8N;
