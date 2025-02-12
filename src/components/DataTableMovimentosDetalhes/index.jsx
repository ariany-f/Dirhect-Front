import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Frame from '@components/Frame';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableMovimentosDetalhes({ movimentos }) {

    console.log(movimentos)
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

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeDescontoTemplate = (rowData) => {
        return (
            Real.format(rowData.desconto)
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        return (
            Real.format(rowData.empresa)
        )
    }
    
    const representativStatusTemplate = (rowData) => {
        let status = rowData?.movimento;
        
        switch(rowData?.movimento)
        {
            case 'Inclusão':
                status = <Tag severity={'success'} value="Inclusão"></Tag>;
                break;
            case 'Cancelamento':
                status = <Tag severity={'danger'} value="Cancelamento"></Tag>;
                break;
        }
        return (
            <Frame alinhamento="start">{status}</Frame>
        )
    }
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={movimentos} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados movimentos" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="funcionario" header="Colaborador" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="movimento" header="Movimento" style={{width: '35%'}}></Column>
            </DataTable>
        </>
    )
}

export default DataTableMovimentosDetalhes