import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DataTableOperadores({ operadores }) {

    const[selectedOperator, setSelectedOperator] = useState(0)
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
        setSelectedOperator(value)
        navegar(`/operador/detalhes/${value.public_id}`)
    }
    
    const representativeNameTemplate = (rowData) => {
        return (
           rowData.user
        )
    }
    
    const representativeEmailTemplate = (rowData) => {
        return (
           rowData.collaborator.email
        )
    }
    
    const representativeDocumentTemplate = (rowData) => {
        return (
           rowData.collaborator.document
        )
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar operador" />
                </span>
            </div>
            <DataTable value={operadores} filters={filters} globalFilterFields={['name', 'email', 'document']}  emptyMessage="Não foram encontrados operadores" selection={selectedOperator} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '68vw' }}>
                <Column field="user" body={representativeNameTemplate} header="Nome Completo" style={{ width: '35%' }}></Column>
                {/* <Column field="email" body={representativeEmailTemplate} header="E-mail" style={{ width: '35%' }}></Column> */}
                {/* <Column field="cpf" body={representativeDocumentTemplate} header="CPF" style={{ width: '20%' }}></Column> */}
                <Column field="" header="" style={{ width: '10%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableOperadores