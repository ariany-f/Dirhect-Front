import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import events from '@json/ciclos.json'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableCiclos({ demissoes, colaborador = null }) {

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

    function verDetalhes(value)
    {
        navegar(`/ciclos/detalhes/${value.id}`)
    }

    const representativeColaboradorTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.candidato.nome}</p>
    }
    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>}
            <DataTable value={events} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados ciclos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={5}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="tipo" header="Tipo" style={{ width: '35%' }}></Column>
                <Column field="data" header="Data" style={{ width: '35%' }}></Column>
                <Column field="data_referencia" header="Referência" style={{ width: '35%' }}></Column>
                <Column field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCiclos