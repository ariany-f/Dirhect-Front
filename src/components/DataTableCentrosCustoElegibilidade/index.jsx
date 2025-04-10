import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import BadgeBeneficio from '@components/BadgeBeneficio'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBan } from 'react-icons/fa';
import './DataTable.css'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`
const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableCentrosCustoElegibilidade({ centros_custo = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedCentroCusto, setSelectedCentroCusto] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedCentrosCusto, setSelectedCentrosCusto] = useState([]);
    const navegar = useNavigate()

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
    
    const representativeDescriptionTemplate = (rowData) => {
        return `#${rowData.id} - ${rowData.nome}`
    }

     const representativeBeneficiosTemplate = (rowData) => {
        return (
        <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <Texto weight={300}>Benefícios configurados</Texto>
            <Beneficios>
                {(!rowData?.elegibilidade?.item_beneficio?.beneficio || !rowData?.elegibilidade?.item_beneficio?.beneficio?.dados_beneficio?.descricao)
                ?
                    <FaBan size={10} />
                :
                
                <BadgeBeneficio key={rowData?.elegibilidade?.item_beneficio?.beneficio?.dados_beneficio?.id} nomeBeneficio={rowData?.elegibilidade?.item_beneficio?.beneficio?.dados_beneficio?.descricao}/>
                    
                }
            </Beneficios>
        </div>)
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
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column body={<MdOutlineKeyboardArrowRight/>} style={{ width: '5%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCentrosCustoElegibilidade