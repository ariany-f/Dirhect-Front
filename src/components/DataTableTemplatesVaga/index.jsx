import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaPen } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Texto from '@components/Texto';
import { ArmazenadorToken } from '@utils';
import { useNavigate } from 'react-router-dom';

function DataTableTemplatesVaga({ templates = [], onEdit, onDelete }) {
    const navegar = useNavigate();

    const handleRowClick = (e) => {
        navegar(`/templates-vaga/detalhes/${e.data.id}`);
    };

    const rowClassName = () => {
        return 'clickable-row';
    };

    const nomeTemplate = (rowData) => (
        <Texto width="100%" weight={700}>{rowData.nome}</Texto>
    );

    const descricaoTemplate = (rowData) => (
        <Texto width="100%" weight={500}>{rowData.descricao || '-'}</Texto>
    );

    const jornadaTemplate = (rowData) => (
        <Texto weight={500}>{rowData.jornada || '-'}</Texto>
    );

    const salarioTemplate = (rowData) => {
        if (!rowData.salario) return <Texto weight={500}>-</Texto>;
        
        const salarioFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(rowData.salario));
        
        return <Texto weight={500}>{salarioFormatado}</Texto>;
    };

    const confiancaTemplate = (rowData) => (
        <Texto weight={500}>{rowData.confianca ? 'Sim' : 'Não'}</Texto>
    );

    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
            {ArmazenadorToken.hasPermission('change_vaga') &&
                <>
                    <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                    <FaPen
                        className="edit"
                        data-pr-tooltip="Editar Template"
                        size={16}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(rowData);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--primaria)',
                        }}
                    />
                </>
            }
            {ArmazenadorToken.hasPermission('delete_vaga') &&
                <>
                    <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Template" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(rowData);
                        }}
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
        <>
            <style>
                {`
                    .clickable-row {
                        cursor: pointer !important;
                    }
                    .clickable-row:hover {
                        background-color: var(--neutro-100) !important;
                    }
                `}
            </style>
            <DataTable
                value={templates}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} templates"
                dataKey="id"
                className="p-datatable-sm"
                emptyMessage="Nenhum template de vaga encontrado."
                showGridlines
                stripedRows
                tableStyle={{ minWidth: '70vw' }}
                onRowClick={handleRowClick}
                rowClassName={rowClassName}
            >
            <Column 
                field="nome" 
                header="Nome" 
                body={nomeTemplate}
                sortable 
                style={{ width: '25%' }} 
            />
            <Column 
                body={descricaoTemplate} 
                field="descricao" 
                header="Descrição" 
                sortable
                style={{ width: '30%' }} 
            />
            <Column 
                body={jornadaTemplate} 
                field="jornada" 
                header="Jornada" 
                sortable
                style={{ width: '15%' }} 
            />
            <Column 
                body={salarioTemplate} 
                field="salario" 
                header="Salário" 
                sortable
                style={{ width: '15%' }} 
            />
            <Column 
                body={confiancaTemplate} 
                field="confianca" 
                header="Confiança" 
                sortable
                style={{ width: '10%' }} 
            />
            <Column 
                body={actionTemplate} 
                exportable={false} 
                style={{ width: '10%' }} 
            />
        </DataTable>
        </>
    );
}

export default DataTableTemplatesVaga;

