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

function DataTableCentrosCusto({ centros_custo, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedCentroCusto, setSelectedCentroCusto] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedCentrosCusto, setSelectedCentrosCusto] = useState([]);
    const navegar = useNavigate()

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && centros_custo) {
            const centrosCustoSelecionados = centros_custo.filter(centro_custo => selected.includes(centro_custo.id));
            setSelectedCentrosCusto([...centrosCustoSelecionados]); // Garante que o array é atualizado
        } else {
            setSelectedCentrosCusto([]); // Garante que não há itens selecionados ao limpar
        }
    }, [centros_custo, selected]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedCentroCusto(value.public_id)
    }

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value; // Lista atual de itens selecionados
    
            if (Array.isArray(selectedValue)) {
                setSelectedCentrosCusto(selectedValue);
                setSelected(selectedValue.map(centro_custo => centro_custo.id)); // Usa id em vez de nome
            } else {
                let newSelection = [...selectedCentrosCusto];
    
                // Se o item já estiver na seleção, remova-o
                if (newSelection.some(centro_custo => centro_custo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(centro_custo => centro_custo.id !== selectedValue.id);
                } else {
                    // Caso contrário, adicione
                    newSelection.push(selectedValue);
                }
    
                setSelectedCentrosCusto(newSelection);
                setSelected(newSelection.map(centro_custo => centro_custo.id)); // Usa id para a seleção
            }
        } else {
            setSelectedCentroCusto(e.value.public_id);
            verDetalhes(e.value);
        }
    }    

    return (
        <>
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar departamento" />
                    </span>
                </div>
            }
            <DataTable 
                value={centros_custo} 
                filters={filters} 
                globalFilterFields={['id']}  
                emptyMessage="Não foram encontrados centros de custo" 
                selection={selected ? selectedCentrosCusto : selectedCentroCusto} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
                paginator={pagination} 
                rows={7}  
                tableStyle={{ minWidth: '68vw' }}>
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="id" header="Id" style={{ width: '10%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '35%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCentrosCusto