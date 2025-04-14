import styles from '@pages/Estrutura/Departamento.module.css'
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

function DataTableSecoes({ secoes, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedSecao, setSelectedSecao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedSecoes, setSelectedSecoes] = useState([]);
    const navegar = useNavigate()

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && secoes) {
            const secoesSelecionadas = secoes.filter(secao => selected.includes(secao.id));
            setSelectedSecoes(secoesSelecionadas);
        } else {
            setSelectedSecoes([]);
        }
    }, [selected, secoes]);

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
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="id" header="Id" style={{ width: '15%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '25%' }}></Column>
                <Column body={representativeFilialTemplate} field="filial" header="Filial" style={{ width: '20%' }}></Column>
                <Column body={representativeDepartamentoTemplate} field="departamento" header="Departamento" style={{ width: '20%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableSecoes