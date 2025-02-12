import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableVagas({ vagas }) {

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
        setSelectedVaga(value)
        navegar(`/vagas/detalhes/${value.id}`)
    }

    const representativeSalarioTemplate = (rowData) => {       
        return <b>{(Real.format(rowData.salario))}</b>
    };

    const representativeAberturaTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dataAbertura).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeEncerramentoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dataEncerramento).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeNumeroColaboradoresTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.candidatos.length ?? 0}</p>
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar vaga" />
                </span>
            </div>
            <DataTable value={vagas} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontradas vagas" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="titulo" header="Titulo" style={{ width: '35%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
                <Column body={representativeAberturaTemplate} header="Data Abertura" style={{ width: '35%' }}></Column>
                <Column body={representativeEncerramentoTemplate} header="Data Encerramento" style={{ width: '35%' }}></Column>
                <Column body={representativeNumeroColaboradoresTemplate} header="Número de Candidatos" style={{ width: '35%' }}></Column>
                <Column body={representativeSalarioTemplate} header="Salário" style={{ width: '35%' }}></Column>
                
            </DataTable>
        </>
    )
}

export default DataTableVagas