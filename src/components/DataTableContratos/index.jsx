import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DataTableContratos({ contratos }) {

    console.log(contratos)

    const[selectedDependente, setSelectedDependente] = useState(0)
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

    function verDetalhes(value)
    {
        setSelectedDependente(value.id)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar contratos" />
                </span>
            </div>
            <DataTable value={contratos} filters={filters} globalFilterFields={[]}  emptyMessage="Não foram encontrados contratos" selection={selectedDependente} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="id" header="Identificador" style={{ width: '35%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableContratos