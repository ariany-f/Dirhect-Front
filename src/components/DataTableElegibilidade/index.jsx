import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableElegibilidade({ elegibilidade, colaborador = null }) {

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
        navegar(`/elegibilidade/detalhes/${value.id}`)
    }

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Ativo':
                status = <Tag severity="error" value="Ativo"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="warning" value="Cancelado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_colaboradores}</p>
            </div>
        </div>
    }

    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>}
            <DataTable value={elegibilidade} filters={filters} globalFilterFields={['tipo']}  emptyMessage="Não foram encontrados elegibilidade" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeTipoTemplate} field="nome" header="Nome" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableElegibilidade