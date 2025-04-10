import styles from '@pages/Departamentos/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FaBan } from 'react-icons/fa'
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BadgeBeneficio from '@components/BadgeBeneficio'
import Texto from '@components/Texto';
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
const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableCargosElegibilidade({ cargos = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedCargo, setSelectedCargo] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedCargos, setSelectedCargos] = useState([]);
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedCargo(value.public_id)
    }
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedCargos];

            if (Array.isArray(selectedValue)) {
                setSelectedCargos(selectedValue);
                setSelected(selectedValue.map(cargo => cargo.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(cargo => cargo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(cargo => cargo.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedCargos(newSelection);
                setSelected(newSelection.map(cargo => cargo.id));
            }
        } else {
            setSelectedCargo(e.value.id);
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
            <DataTable value={cargos} filters={filters} globalFilterFields={['id', 'nome', 'descricao']} emptyMessage="Não foram encontrados cargos" selection={selected ? selectedCargos : selectedCargo} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column style={{ width: '5%' }} body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCargosElegibilidade