import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
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
        nome_fornecedor: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        operadora: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
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

    const renderHeader = () => {
        return (
            <></>
        );
    };
    
    const representativeNomeTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.nome_fornecedor}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Operadora:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.operadora}</p>
            </div>
        </div>
    }


    const header = renderHeader();

    return (
        <>
            <DataTable header={header} value={linhas} filters={filters} filterDisplay="row" globalFilterFields={['nome', 'operadora', 'codigo', 'nome_fornecedor']}  emptyMessage="Não foram encontrados registros" selection={selectedPremiacao} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeNomeTemplate} field="nome_fornecedor" header="Fornecedor" style={{ width: '40%' }} filter filterPlaceholder="Filtrar" sortable></Column>
                <Column field="codigo" header="Código" style={{ width: '15%' }} filter filterPlaceholder="Filtrar" sortable></Column>
                <Column field="nome" header="Nome" style={{ width: '20%' }} filter filterPlaceholder="Filtrar" sortable></Column>
                <Column body={representativeTarifaTemplate} field="tarifa" header="Tarifa" style={{ width: '20%' }} sortable></Column>
                
            </DataTable>
        </>
    )
}

export default DataTableLinhasTransporte