import styles from '@pages/Departamentos/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { Column } from 'primereact/column';
import BadgeBeneficio from '@components/BadgeBeneficio'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './DataTable.css'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaBan } from 'react-icons/fa';

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

function DataTableSecoesElegibilidade({ secoes = [], showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedSecao, setSelectedSecao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedSecoes, setSelectedSecoes] = useState([]);
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

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSecoes];

            if (Array.isArray(selectedValue)) {
                setSelectedSecoes(selectedValue);
                setSelected(selectedValue.map(secao => secao.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(secao => secao.id === selectedValue.id)) {
                    newSelection = newSelection.filter(secao => secao.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSecoes(newSelection);
                setSelected(newSelection.map(secao => secao.id));
            }
        } else {
            setSelectedSecao(e.value.id);
            verDetalhes(e.value);
        }
    }

    const representativeFilialTemplate = (rowData) => {
        if(rowData?.filial && rowData?.filial?.nome)
        {
            return rowData?.filial?.nome
        }
        else
        {
            return 'Não informado'
        }
    };

    const representativeDepartamentoTemplate = (rowData) => {
        if(rowData?.departamento && rowData?.departamento?.nome)
        {
            return rowData?.departamento?.nome
        }
        else
        {
            return 'Não informado'
        }
    };

    
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
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar seção" />
                    </span>
                </div>
            }
            <DataTable value={secoes} filters={filters} globalFilterFields={['id']} emptyMessage="Não foram encontrados seções" selection={selected ? selectedSecoes : selectedSecao} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }} body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableSecoesElegibilidade