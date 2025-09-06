import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FaPen, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tag } from 'primereact/tag';
import Texto from '@components/Texto';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';

const DataTableEmails = ({ emails, onEdit, onDelete, onView, loading = false }) => {
    const toast = useRef(null);
    const [selectedEmails, setSelectedEmails] = useState(null);
    const { t } = useTranslation('common');

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

    const corpoBodyTemplate = (rowData) => {
        const [showFullDescription, setShowFullDescription] = useState(false);
        const content = rowData.body_html || rowData.corpo || rowData.content || rowData.body || '';
        
        if (!content) {
            return <p>---</p>;
        }
        
        const maxLength = 60;
        const isLongText = content.length > maxLength;
        
        const displayText = showFullDescription || !isLongText 
            ? content 
            : content.substring(0, maxLength) + "...";

        return (
            <div style={{
                width: '100%',
                wordWrap: 'break-word',
                overflow: 'hidden'
            }}>
                <Texto weight={500} style={{
                    margin: 0,
                    marginBottom: isLongText ? '8px' : 0,
                    lineHeight: '1.4'
                }}>
                    {displayText}
                </Texto>
                {isLongText && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullDescription(!showFullDescription);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primaria)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '2px 0',
                            textDecoration: 'underline'
                        }}
                    >
                        {showFullDescription ? t('see_less') : t('see_more')}
                    </button>
                )}
            </div>
        );
    };

    const nomeBodyTemplate = (rowData) => {
        return (
            <div>
                <Texto weight={700}>{rowData.name || rowData.nome || ''}</Texto>
            </div>
        );
    };

    const assuntoBodyTemplate = (rowData) => {
        return (
            <div>
                <Texto weight={500}>{rowData.subject || rowData.assunto || ''}</Texto>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tag 
                    value={rowData.is_active ? 'Ativo' : 'Inativo'} 
                    style={{ 
                        backgroundColor: rowData.is_active ? 'var(--green-500)' : 'var(--error)',
                        color: 'white',
                        fontWeight: '600'
                    }} 
                />
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
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
                emptyMessage={loading ? "Carregando..." : "Nenhum email encontrado."}
                showGridlines
                stripedRows
                removableSort
                tableStyle={{ minWidth: '68vw' }}
                loading={loading}
            >
                <Column
                    field="name"
                    header="Nome"
                    body={nomeBodyTemplate}
                    sortable
                    style={{ width: '20%' }}
                />
                <Column
                    field="subject"
                    header="Assunto"
                    body={assuntoBodyTemplate}
                    sortable
                    style={{ width: '25%' }}
                />
                <Column
                    field="body_html"
                    header="Corpo"
                    body={corpoBodyTemplate}
                    style={{ width: '25%' }}
                />
                <Column
                    field="is_active"
                    header="Status"
                    body={statusBodyTemplate}
                    sortable
                    style={{ width: '10%' }}
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
