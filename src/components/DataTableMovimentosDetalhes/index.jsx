import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Frame from '@components/Frame';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { Real } from '@utils/formats'

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

    const representativeDescontoTemplate = (rowData) => {
        if(!rowData.valor) {
            return <p style={{ fontSize: '12px', color: 'var(--primaria)' }}>{Real.format(0)}</p>
        }
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        if(!rowData.empresa) {
            return <p style={{ fontSize: '12px', color: 'var(--primaria)' }}>{Real.format(0)}</p>
        }
        return (
            Real.format(rowData.empresa)
        )
    }
    
    const representativStatusTemplate = (rowData) => {
        let status = rowData?.movimento;
        
        switch(rowData?.movimento)
        {
            case 'Inclusão':
                status = <Tag severity={'info'} value="Inclusão"></Tag>;
                break;
            case 'Cancelamento':
                status = <Tag severity={'danger'} value="Cancelamento"></Tag>;
                break;
        }
        return (
            <Frame alinhamento="start">{status}</Frame>
        )
    }

    const representativTipoTemplate = (rowData) => {
        let tipo = rowData?.tipo;
        
        switch(rowData?.tipo)
        {
            case 'Dependente':
                tipo = <Tag severity={'info'} value="Dependente"></Tag>;
                break;
            case 'Funcionário':
                tipo = <Tag severity={'green-600'} value="Funcionário"></Tag>;
                break;
        }
        return (
            <Frame alinhamento="start">{tipo}</Frame>
        )
    }

    const representativStatusMovimentoTemplate = (rowData) => {
        let status = rowData?.status;
        
        switch(rowData?.status)
        {
            case 'Concluído':
            case 'Concluido':
                status = <Tag severity={'success'} value="Concluído"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity={'warning'} value="Aguardando"></Tag>;
                break;
            default:
                status = <Tag severity={'info'} value={rowData?.status}></Tag>;
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
            <DataTable value={movimentos} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados movimentos" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="funcionario" header="Beneficiário" style={{ width: '35%' }}></Column>
                <Column body={representativTipoTemplate} field="tipo" header="Tipo" style={{ width: '35%' }}></Column>
                <Column field="plano" header="Plano" style={{ width: '35%' }}></Column>
                <Column body={representativStatusMovimentoTemplate} field="status" header="Status" style={{width: '35%'}}></Column>
                <Column body={representativStatusTemplate} field="movimento" header="Movimento" style={{width: '35%'}}></Column>
            </DataTable>
        </>
    )
}

export default DataTableMovimentosDetalhes