import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DataTablePremiacoes({ premiacoes }) {

    const[selectedPremiacao, setSelectedPremiacao] = useState(0)
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
        setSelectedPremiacao(value)
      //  navegar(`/colaborador/detalhes/${value.public_id}`)
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar premiação" />
                </span>
            </div>
            <DataTable value={premiacoes} filters={filters} globalFilterFields={['name', 'email', 'document']}  emptyMessage="Não foram encontrados registros" selection={selectedPremiacao} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="name" header="Nome" style={{ width: '35%' }}></Column>
                <Column field="reason" header="Motivo" style={{ width: '35%' }}></Column>
                <Column field="amount" header="Valor da Premiação" style={{ width: '20%' }}></Column>
                
            </DataTable>
        </>
    )
}

export default DataTablePremiacoes