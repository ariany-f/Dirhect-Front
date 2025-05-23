import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FaEdit, FaPen, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tag } from 'primereact/tag';
import Texto from '@components/Texto';

const DataTableEmails = ({ emails, onEdit, onDelete, onView }) => {
    const [selectedEmails, setSelectedEmails] = useState(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Tooltip target=".view" mouseTrack mouseTrackLeft={10} />
                <FaEye
                    className="view"
                    data-pr-tooltip="Visualizar Email"
                    size={16}
                    onClick={() => onView(rowData)}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)',
                    }}
                />
                <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                <FaPen
                    className="edit"
                    data-pr-tooltip="Editar Email"
                    size={16}
                    onClick={() => onEdit(rowData)}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)',
                    }}
                />
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                <RiDeleteBin6Line 
                    className="delete" 
                    data-pr-tooltip="Excluir Email" 
                    size={16} 
                    onClick={() => onDelete(rowData)}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--erro)',
                    }}
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const getGatilhoColor = (gatilho) => {
            switch (gatilho.toLowerCase()) {
                case 'aberta':
                    return 'var(--green-500)';
                case 'candidatura':
                    return 'var(--primaria)';
                case 'contratado':
                    return 'var(--green-500)';
                case 'cancelada':
                    return 'var(--error)';
                case 'reprovado':
                    return 'var(--error)';
                case 'encaminhada':
                    return 'var(--primaria)';
                case 'anexar exame médico':
                    return 'var(--primaria)';
                default:
                    return 'var(--neutro-500)';
            }
        };

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tag 
                    value={rowData.gatilho} 
                    style={{ 
                        backgroundColor: getGatilhoColor(rowData.gatilho),
                        color: 'white',
                        fontWeight: '600'
                    }} 
                />
            </div>
        );
    };

    const corpoBodyTemplate = (rowData) => {
        return (
            <Texto weight={500}>{rowData.corpo}</Texto>
        );
    };

    const nomeBodyTemplate = (rowData) => {
        return (
            <div>
                <Texto weight={700}>{rowData.nome}</Texto>
            </div>
        );
    };

    const assuntoBodyTemplate = (rowData) => {
        return (
            <div>
                <Texto weight={500}>{rowData.assunto}</Texto>
            </div>
        );
    };

    return (
        <>
            <DataTable
                value={emails}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} emails"
                selection={selectedEmails}
                onSelectionChange={(e) => setSelectedEmails(e.value)}
                dataKey="id"
                className="p-datatable-sm"
                emptyMessage="Nenhum email encontrado."
                showGridlines
                stripedRows
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column
                    field="nome"
                    header="Nome"
                    body={nomeBodyTemplate}
                    sortable
                    style={{ width: '15%' }}
                />
                <Column
                    field="assunto"
                    header="Assunto"
                    body={assuntoBodyTemplate}
                    sortable
                    style={{ width: '15%' }}
                />
                <Column
                    field="corpo"
                    header="Corpo"
                    body={corpoBodyTemplate}
                    style={{ width: '20%', maxWidth: '200px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                />
                <Column
                    field="gatilho"
                    header="Gatilho"
                    body={statusBodyTemplate}
                    sortable
                    style={{ width: '15%' }}
                />
                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ width: '10%' }}
                />
            </DataTable>
        </>
    );
};

export default DataTableEmails;
