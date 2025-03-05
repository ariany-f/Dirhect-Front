import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
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

function DataTableContratos({ contratos }) {

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
        navegar(`/contratos/detalhes/${value.id}`)
    }

    const representativeInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
    }
    

    const representativeFimTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
    }

    const representativeFornecedorTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_operadora?.nome}
            </Texto>
            {/* <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Benefícios:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.beneficios.length}</p>
            </div> */}
        </div>
    }

    function representativSituacaoTemplate(rowData) {
        
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'A':
                status = <Tag severity="success" value="Ativo"></Tag>;
                break;
        }
        return status
    }
    
    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>
            <DataTable value={contratos} filters={filters} globalFilterFields={['nome_fornecedor']}  emptyMessage="Não foram encontrados contratos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeFornecedorTemplate} field="operadora" header="Operadora" style={{ width: '30%' }}></Column>
                <Column field="observacao" header="Observação" style={{ width: '30%' }}></Column>
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column body={representativeFimTemplate} field="dt_fim" header="Data Fim" style={{ width: '10%' }}></Column>
                <Column field="status" header="Status" body={representativSituacaoTemplate} style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableContratos