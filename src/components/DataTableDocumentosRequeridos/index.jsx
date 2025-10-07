import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Texto from '@components/Texto';
import { ArmazenadorToken } from '@utils';
import { useEffect, useState } from 'react';
import http from '@http';

function DataTableDocumentosRequeridos({ documentos = [], onEdit, onDelete }) {
    const [tagsMap, setTagsMap] = useState({});

    useEffect(() => {
        // Buscar todas as tags para criar um mapa de id -> nome
        http.get('/documento_requerido_tag/')
            .then(response => {
                const map = {};
                response.forEach(tag => {
                    map[tag.id] = tag.nome;
                });
                setTagsMap(map);
            })
            .catch(error => {
                console.error('Erro ao buscar tags:', error);
            });
    }, []);

    const extPermitidasTemplate = (rowData) => (
        <Texto width="100%" weight={500}>{rowData.ext_permitidas}</Texto>
    );

    const frenteVersoTemplate = (rowData) => (
        <Texto weight={500}>{rowData.frente_verso ? 'Sim' : 'Não'}</Texto>
    );

    const instrucaoTemplate = (rowData) => (
        <Texto width="100%" weight={500}>{rowData.instrucao}</Texto>
    );

    const descricaoTemplate = (rowData) => (
        <Texto weight={500}>{rowData.descricao}</Texto>
    );

    const nomeTemplate = (rowData) => (
        <Texto width="100%" weight={700}>{rowData.nome}</Texto>
    );

    const tagsTemplate = (rowData) => {
        if (!rowData.tags) return <Texto weight={500}>-</Texto>;
        
        try {
            const tagsData = typeof rowData.tags === 'string' 
                ? JSON.parse(rowData.tags) 
                : rowData.tags;
            
            if (!Array.isArray(tagsData) || tagsData.length === 0) {
                return <Texto weight={500}>-</Texto>;
            }

            return (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {tagsData.map((tagId, index) => (
                        <Tag 
                            key={index} 
                            value={tagsMap[tagId] || `Tag ${tagId}`}
                            style={{ 
                                backgroundColor: 'var(--primaria)', 
                                color: 'var(--secundaria)',
                                fontSize: '11px',
                                padding: '4px 8px'
                            }}
                        />
                    ))}
                </div>
            );
        } catch (error) {
            console.error('Erro ao parsear tags:', error);
            return <Texto weight={500}>-</Texto>;
        }
    };

    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            {ArmazenadorToken.hasPermission('change_documentorequerido') &&
                <>
                    <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                    <FaPen
                        className="edit"
                        data-pr-tooltip="Editar Documento"
                        size={16}
                        onClick={() => onEdit(rowData)}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--primaria)',
                        }}
                    />
                </>
            }
            {ArmazenadorToken.hasPermission('delete_documentorequerido') &&
                <>
                    <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Documento" 
                        size={16} 
                        onClick={() => onDelete(rowData)}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--erro)',
                        }}
                    />
                </>
            }
        </div>
    );

    return (
        <DataTable
            value={documentos}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} documentos"
            dataKey="id"
            className="p-datatable-sm"
            emptyMessage="Nenhum documento requerido encontrado."
            showGridlines
            stripedRows
            tableStyle={{ minWidth: '75vw' }}
        >
            <Column 
                field="nome" 
                header="Nome" 
                body={nomeTemplate}
                sortable 
                style={{ width: '20%' }} 
            />
            <Column 
                body={extPermitidasTemplate} 
                field="ext_permitidas" 
                header="Extensões Permitidas" 
                sortable
                style={{ width: '15%' }} 
            />
            <Column 
                body={frenteVersoTemplate} 
                field="frente_verso" 
                header="Frente e Verso" 
                sortable
                style={{ width: '10%' }} 
            />
            <Column 
                body={tagsTemplate} 
                field="tags" 
                header="Tags" 
                style={{ width: '15%' }} 
            />
            <Column 
                body={instrucaoTemplate} 
                field="instrucao" 
                header="Instrução" 
                sortable
                style={{ width: '25%' }} 
            />
            <Column 
                body={actionTemplate} 
                exportable={false} 
                style={{ width: '10%' }} 
            />
        </DataTable>
    );
}

export default DataTableDocumentosRequeridos;
