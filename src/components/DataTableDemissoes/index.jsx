import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableDemissao({ demissoes, colaborador = null }) {

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
        navegar(`/candidato/registro/${value.candidato.id}`)
    }

    const representativeColaboradorTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.candidato.nome}</p>
    }
    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por candidato" />
                </span>
            </div>}
            <DataTable value={demissoes} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontradas demissões pendentes" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {!colaborador &&
                    <Column body={representativeColaboradorTemplate} header="Colaborador" style={{ width: '35%' }}></Column>
                }
                <Column field="data" header="Data Demissão" style={{ width: '35%' }}></Column>
                <Column field="tipo" header="Tipo Demissão" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDemissao