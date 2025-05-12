import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'

function DataTableEventosCiclos({ eventos, colaborador = null }) {

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
        if(!rowData.valor) {
            return <p style={{ fontSize: '12px', color: 'var(--error)' }}>{Real.format(0)}</p>
        }
        return (
            <p style={{ fontSize: '12px', color: 'var(--error)' }}>{Real.format(rowData.valor)}</p>
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        if(!rowData.empresa) {
            return <p style={{ fontSize: '12px', color: 'var(--primaria)' }}>{Real.format(0)}</p>
        }
        return (
            <p style={{ fontSize: '12px', color: 'var(--primaria)' }}>{Real.format(rowData.empresa)}</p>
        )
    }
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={eventos} filters={filters} globalFilterFields={['funcionario', 'rubrica']}  emptyMessage="Não foram encontrados eventos" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                {(!colaborador) && 
                    <Column field="funcionario" header="Colaborador" style={{ width: '35%' }}></Column>
                }
                <Column field="rubrica" header="Rubrica" style={{ width: '35%' }}></Column>
                <Column field="referencia" header="Referência" style={{ width: '35%' }}></Column>
                <Column body={representativeValorTemplate} field="valor" header="Desconto" style={{ width: '35%' }}></Column>
                <Column body={representativeEmpresaTemplate} field="empresa" header="Empresa" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableEventosCiclos