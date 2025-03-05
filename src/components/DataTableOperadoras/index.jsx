import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import ContainerHorizontal from '@components/ContainerHorizontal';
import CustomImage from '@components/CustomImage';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';

function DataTableOperadoras({ operadoras, search = true }) {

    const[selectedOperadora, setSelectedOperadora] = useState(0)
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
        setSelectedOperadora(value.id)
        navegar(`/operadoras/detalhes/${value.id}`)
    }

    const representativeNomeTemplate = (rowData) => {
        return <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={rowData.id}>
                <CustomImage src={rowData?.imagem} alt={rowData?.nome} width={45} height={45} title={rowData?.nome} />
            <b>{rowData?.nome}</b>
        </ContainerHorizontal>
    }

    return (
        <>
            {search &&
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar operadora" />
                    </span>
                </div>
            }
            <DataTable value={operadoras} filters={filters} globalFilterFields={['nome']} emptyMessage="Não foram encontradas operadoras" selection={selectedOperadora} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={8}  tableStyle={{ minWidth: '65vw' }}>
                <Column body={representativeNomeTemplate} header="Operadora" style={{ width: '100%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableOperadoras