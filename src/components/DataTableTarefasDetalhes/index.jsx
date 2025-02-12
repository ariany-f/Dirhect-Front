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

function DataTableTarefasDetalhes({ tarefas }) {

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
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={tarefas} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados tarefas" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="funcionario" header="Colaborador" style={{ width: '35%' }}></Column>
                <Column body={representativeValorTemplate} field="valor" header="Valor" style={{ width: '35%' }}></Column>
                <Column body={representativeDescontoTemplate} field="desconto" header="Desconto" style={{ width: '35%' }}></Column>
                <Column body={representativeEmpresaTemplate} field="empresa" header="Empresa" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefasDetalhes