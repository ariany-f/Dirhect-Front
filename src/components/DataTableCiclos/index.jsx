import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableCiclos({ ciclos, colaborador = null }) {

    const[selectedCiclo, setSelectedCiclo] = useState(0)
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
        if(!colaborador)
        {
            navegar(`/ciclos/detalhes/${value.id}`)
        }
        else
        {
            navegar(`/ciclos/${colaborador}/detalhes/${value.id}`)
        }
    }

    const headerTemplate = (rowData) => {
        return <b>{rowData.data_referencia.year}</b>
    }

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Aberta':
                status = <Tag severity="success" value="Aberto"></Tag>;
                break;
            case 'Fechada':
                status = <Tag severity="danger" value="Fechado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const representativeMonthTemplate = (rowData) => {
        const mes = rowData.data_referencia.month;
        const nomeMes = new Date(2000, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });

        return nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    };
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={ciclos} groupRowsBy="data_referencia.year" rowGroupHeaderTemplate={headerTemplate} rowGroupMode="subheader" filters={filters} globalFilterFields={['tipo']}  emptyMessage="Não foram encontrados ciclos" selection={selectedCiclo} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="tipo" header="Tipo" style={{ width: '35%' }}></Column>
                <Column body={representativeMonthTemplate} field="data_referencia.month" header="Mês Referência" style={{ width: '35%' }}></Column>
                <Column field="data" header="Data de Pagamento" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCiclos