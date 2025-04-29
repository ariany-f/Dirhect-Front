import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import ContainerHorizontal from '@components/ContainerHorizontal';
import CustomImage from '@components/CustomImage';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import styled from 'styled-components';


function DataTableOperadoras({ operadoras, search = true, onSelectionChange }) {

    const[selectedOperadora, setSelectedOperadora] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    useEffect(() => {
        if (operadoras && operadoras.length > 0 && !selectedOperadora) {
            setSelectedOperadora(operadoras[0]);
            onSelectionChange(operadoras[0]);
        }
    }, [operadoras, selectedOperadora, onSelectionChange]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // function verDetalhes(value)
    // {
    //     setSelectedOperadora(value.id)
    //     navegar(`/operadoras/detalhes/${value.id}`)
    // }

    const representativeNomeTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <CustomImage src={rowData?.imagem_url} alt={rowData?.nome} width={'70px'} height={35} size={90} title={rowData?.nome} />
                <Texto size={18} weight={600} title={rowData?.nome} >{rowData?.nome}</Texto>
            </div>
        )
    }

    const representativeTemplate = (rowData) => {
        return <Texto size={18} weight={600} title={rowData?.nome} >{rowData?.nome}</Texto>
    }

    return (
        <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            {search &&
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar operadora" />
                    </span>
                </div>
            }
            <DataTable 
                value={operadoras} 
                filters={filters} 
                globalFilterFields={['nome']} 
                emptyMessage="Não foram encontrados operadoras" 
                paginator rows={10}
                selection={selectedOperadora} 
                onSelectionChange={(e) => {onSelectionChange(e.value);setSelectedOperadora(e.value)}} 
                selectionMode="single"
                tableStyle={{ minWidth: '100%', maxWidth: '100%' }}
                rowClassName={(data) => data === selectedOperadora ? 'p-highlight' : ''}
            >
                <Column body={representativeNomeTemplate} header="Operadora" style={{ width: '100%' }}></Column>
            </DataTable>
        </div>
    )
}

export default DataTableOperadoras