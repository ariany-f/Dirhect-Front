import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tag } from 'primereact/tag';

function DataTableDocumentosVaga({ documentos = [], onEdit, onDelete }) {

    
    const obrigatorioTemplate = (rowData) => (
        <Tag value={rowData.obrigatorio ? 'Sim' : 'Não'} style={{ backgroundColor: rowData.obrigatorio ? 'var(--error)' : 'var(--neutro-400)', color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px' }} />
    );
    const tipoTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.tipoArquivo}</span>
    );
    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: 12 }}>
            <FaEdit style={{ cursor: 'pointer', color: 'var(--primaria)' }} onClick={() => onEdit(rowData)} />
            <FaTrash style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => onDelete(rowData)} />
        </div>
    );
    const frenteVersoTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.frenteVerso ? 'Sim' : 'Não'}</span>
    );
    const instrucoesTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.instrucoes}</span>
    );
    return (
        <DataTable value={documentos} emptyMessage="Nenhum documento requerido">
            <Column field="nome" header="Nome" style={{ width: '15%' }} />
            <Column body={tipoTemplate} field="tipoArquivo" header="Extensões Permitidas" style={{ width: '25%' }} />
            <Column body={frenteVersoTemplate} field="frenteVerso" header="Frente e Verso" style={{ width: '15%' }} />
            <Column body={instrucoesTemplate} field="instrucoes" header="Instruções" style={{ width: '15%' }} />
            <Column body={obrigatorioTemplate} field="obrigatorio" header="Obrigatório" style={{ width: '15%' }} />
            <Column body={actionTemplate} header="" style={{ width: '15%' }} />
        </DataTable>
    );
}

export default DataTableDocumentosVaga;
