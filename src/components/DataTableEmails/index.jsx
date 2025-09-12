import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Button } from 'primereact/button';
import { FaPen, FaTrash, FaEye } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tag } from 'primereact/tag';
import Texto from '@components/Texto';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StatusTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    
    ${props => props.$status === true ? `
        background-color: rgba(0, 200, 83, 0.1);
        color: var(--success);
    ` : `
        background-color: rgba(229, 115, 115, 0.1);
        color: var(--error);
    `}
`;

const DataTableEmails = ({ emails, onEdit, onDelete, onView, loading = false }) => {
    const toast = useRef(null);
    const [selectedEmails, setSelectedEmails] = useState(null);
    const { t } = useTranslation('common');

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        // Todas as colunas são sempre exibidas neste DataTable
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Nome, Assunto, Corpo, Status, Ações
    const larguraBase = [20, 25, 25, 10, 10];
    
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
    const totalEmailsTemplate = () => {
        return 'Total de Emails: ' + (emails?.length ?? 0);
    };

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
        const status = rowData.is_active;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <StatusTag $status={status}>
                    {status ? "Ativo" : "Inativo"}
                </StatusTag>
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
                // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                // currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} emails"
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
                footerColumnGroup={
                    <ColumnGroup>
                        <Row>
                            <Column footer={totalEmailsTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                        </Row>
                    </ColumnGroup>
                }
            >
                <Column
                    field="name"
                    header="Nome"
                    body={nomeBodyTemplate}
                    sortable
                    style={{ width: `${largurasColunas[0]}%` }}
                />
                <Column
                    field="subject"
                    header="Assunto"
                    body={assuntoBodyTemplate}
                    sortable
                    style={{ width: `${largurasColunas[1]}%` }}
                />
                <Column
                    field="body_html"
                    header="Corpo"
                    body={corpoBodyTemplate}
                    style={{ width: `${largurasColunas[2]}%` }}
                />
                <Column
                    field="is_active"
                    header="Status"
                    body={statusBodyTemplate}
                    sortable
                    style={{ width: `${largurasColunas[3]}%` }}
                />
                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ width: `${largurasColunas[4]}%` }}
                />
            </DataTable>
        </>
    );
};

export default DataTableEmails;
