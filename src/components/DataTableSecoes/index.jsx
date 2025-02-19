import styles from '@pages/Departamentos/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './DataTable.css'

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DataTableSecoes({ secoes, showSearch = true }) {
   
    const[selectedSecao, setSelectedSecao] = useState(0)
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
        setSelectedSecao(value.id)
    }

    return (
        <>
            {showSearch &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar seção" />
                    </span>
                </div>
            }
            <DataTable value={secoes} filters={filters} globalFilterFields={['id']} emptyMessage="Não foram encontrados seções" selection={selectedSecao} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="id" header="Id" style={{ width: '15%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '35%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableSecoes