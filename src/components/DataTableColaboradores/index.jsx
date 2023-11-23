import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function DataTableColaboradores({ colaboradores }) {

    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
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
        setSelectedCollaborator(value)
        navegar(`/colaborador/detalhes/${value.public_id}`)
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto name="search" width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                </span>
            </div>
            <DataTable value={colaboradores} filters={filters} globalFilterFields={['name', 'email', 'document']}  emptyMessage="Não foram encontrados colaboradores" selection={selectedCollaborator} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Nome Completo" style={{ width: '35%' }}></Column>
                <Column field="email" header="E-mail" style={{ width: '35%' }}></Column>
                <Column field="document" header="CPF" style={{ width: '20%' }}></Column>
                <Column field="" header="" style={{ width: '10%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableColaboradores