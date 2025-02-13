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

function DataTableContratosDetalhes({ beneficios }) {

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
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Ativo':
                status = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'Vencido':
                status = <Tag severity="warning" value="Vencido"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="danger" value="Cancelado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    
    return (
        <>
            <DataTable value={beneficios} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados beneficios" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="nome" header="Benefício" style={{ width: '35%' }}></Column>
                <Column field="data_inicio" header="Data Inicio" style={{ width: '35%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableContratosDetalhes