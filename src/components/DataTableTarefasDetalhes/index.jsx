import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
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
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={tarefas} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados tarefas" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
                <Column body={representativePrazoTemplate} field="prazo" header="Prazo" style={{ width: '35%' }}></Column>
                <Column body={representativeCheckTemplate} field="check" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefasDetalhes