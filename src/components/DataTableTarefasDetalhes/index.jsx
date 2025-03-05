import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoArquivo from '@components/CampoArquivo';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CheckboxContainer from '@components/CheckboxContainer'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableTarefasDetalhes({ tarefas }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const representativePrazoTemplate = (rowData) => {
        return (
            rowData.prazo
        )
    }

    const representativeCheckTemplate = (rowData, onUpdateStatus) => {
        const handleChange = (checked) => {
            onUpdateStatus(rowData.id, checked); // Atualiza o estado da tarefa
        };
    
        return (
            <CheckboxContainer name="feito" valor={rowData.check} setValor={handleChange} />
        );
    };
    
    const handleUpload = async (arquivoId, file) => {
        if (!file) return;
    };

    const representativeFilesTemplate = (rowData) => {
        return <CampoArquivo     
                onFileChange={(file) => handleUpload(rowData.id, file)}
                accept=".pdf, .jpg, .png"
                id={`arquivo`}
                name={`arquivo`}></CampoArquivo>
    }
    
    return (
        <>
            <DataTable value={tarefas} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados tarefas" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="descricao" header="Descrição" style={{ width: '25%' }}></Column>
                <Column body={representativePrazoTemplate} field="prazo" header="Prazo (SLA)" style={{ width: '15%' }}></Column>
                <Column body={representativeCheckTemplate} field="check" header="Concluído" style={{ width: '15%' }}></Column>
                <Column body={representativeFilesTemplate} field="files" header="Anexos" style={{ width: '20%' }}></Column>
                <Column field="responsible" header="Responsável" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefasDetalhes