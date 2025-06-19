import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Texto from '@components/Texto';

function DataTableDocumentosRequeridos({ documentos = [], onEdit, onDelete }) {

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
        <Texto weight={700}>{rowData.nome}</Texto>
    );

    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
            <FaEdit
                className="edit"
                data-pr-tooltip="Editar Documento"
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
                data-pr-tooltip="Excluir Documento" 
                size={16} 
                onClick={() => onDelete(rowData)}
                style={{
                    cursor: 'pointer',
                    color: 'var(--erro)',
                }}
            />
        </div>
    );

    return (
        <DataTable
            value={documentos}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} emails"
            dataKey="id"
            className="p-datatable-sm"
            emptyMessage="Nenhum documento requerido encontrado."
            showGridlines
            stripedRows
            tableStyle={{ minWidth: '68vw' }}
        >
            <Column 
                field="nome" 
                header="Nome" 
                body={nomeTemplate}
                sortable 
                style={{ width: '15%' }} 
            />
            <Column 
                body={extPermitidasTemplate} 
                field="ext_permitidas" 
                header="Extensões Permitidas" 
                sortable
                style={{ width: '20%' }} 
            />
            <Column 
                body={frenteVersoTemplate} 
                field="frente_verso" 
                header="Frente e Verso" 
                sortable
                style={{ width: '10%' }} 
            />
            <Column 
                body={instrucaoTemplate} 
                field="instrucao" 
                header="Instrução" 
                sortable
                style={{ width: '20%' }} 
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
