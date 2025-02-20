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

function DataTableLinhasTransporte({ linhas }) {

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

    const representativeTarifaTemplate = (rowData) => {
        return (
            Real.format(rowData.tarifa)
        )
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar premiação" />
                </span>
            </div>
            <DataTable value={linhas} filters={filters} globalFilterFields={['nome', 'operadora', 'codigo']}  emptyMessage="Não foram encontrados registros" selection={selectedPremiacao} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="codigo" header="Codigo" style={{ width: '15%' }}></Column>
                <Column field="fornecedor" header="Fornecedor" style={{ width: '20%' }}></Column>
                <Column field="operadora" header="Operadora" style={{ width: '25%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '30%' }}></Column>
                <Column body={representativeTarifaTemplate} field="tarifa" header="Tarifa" style={{ width: '20%' }}></Column>
                
            </DataTable>
        </>
    )
}

export default DataTableLinhasTransporte