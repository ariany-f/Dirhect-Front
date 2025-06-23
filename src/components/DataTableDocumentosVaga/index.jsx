import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import { RiDeleteBin6Line } from 'react-icons/ri';
import http from '@http';
import { confirmDialog } from 'primereact/confirmdialog';

function DataTableDocumentosVaga({ documentos = [], onEdit, onDelete, toastRef }) {

    const obrigatorioTemplate = (rowData) => (
        <Tag value={rowData.obrigatorio ? 'Sim' : 'Não'} style={{ backgroundColor: rowData.obrigatorio ? 'var(--error)' : 'var(--neutro-400)', color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px' }} />
    );
    const tipoTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.documento_detalhes.ext_permitidas}</span>
    );
    const handleDelete = (rowData) => {
        confirmDialog({
            message: 'Tem certeza que deseja remover este documento da vaga?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await http.delete(`vagas_documentos/${rowData.id}/`);
                    if (onDelete) onDelete(rowData);
                    if (toastRef && toastRef.current) {
                        toastRef.current.show({ severity: 'success', summary: 'Removido', detail: 'Documento removido da vaga com sucesso.', life: 3000 });
                    }
                } catch (error) {
                    if (toastRef && toastRef.current) {
                        toastRef.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover documento da vaga.', life: 3000 });
                    }
                }
            },
            reject: () => {}
        });
    };
    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: 12 }}>
            <RiDeleteBin6Line style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => handleDelete(rowData)} />
        </div>
    );

    const nomeTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.documento_detalhes.nome}</span>
    );
    const frenteVersoTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.documento_detalhes.frente_verso ? 'Sim' : 'Não'}</span>
    );
    const instrucoesTemplate = (rowData) => (
        <span style={{ fontWeight: 500 }}>{rowData.documento_detalhes.instrucao}</span>
    );
    return (
        <DataTable value={documentos} emptyMessage="Nenhum documento requerido">
            <Column body={nomeTemplate} field="documento_detalhes.nome" header="Nome" style={{ width: '15%' }} />
            <Column body={tipoTemplate} field="documento_detalhes.ext_permitidas" header="Extensões Permitidas" style={{ width: '25%' }} />
            <Column body={frenteVersoTemplate} field="documento_detalhes.frente_verso" header="Frente e Verso" style={{ width: '15%' }} />
            <Column body={instrucoesTemplate} field="documento_detalhes.instrucao" header="Instruções" style={{ width: '15%' }} />
            <Column body={obrigatorioTemplate} field="obrigatorio" header="Obrigatório" style={{ width: '15%' }} />
            <Column body={actionTemplate} header="" style={{ width: '15%' }} />
        </DataTable>
    );
}

export default DataTableDocumentosVaga;
