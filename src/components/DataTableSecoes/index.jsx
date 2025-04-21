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

function DataTableSecoes({ 
    secoes, 
    showSearch = true, 
    pagination = true, 
    rows, 
    totalRecords, 
    first, 
    onPage, 
    onSearch, 
    selected = null, 
    setSelected = () => {} 
}) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedSecoes, setSelectedSecoes] = useState([]);
    const [selectedSecao, setSelectedSecao] = useState(null);
    const navegar = useNavigate();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && secoes) {
            const secoesSelecionadas = secoes.filter(sec => selected.includes(sec.id));
            setSelectedSecoes(secoesSelecionadas);
        } else {
            setSelectedSecoes([]);
        }
    }, [selected, secoes]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedSecao(value.id);
        navegar(`/estrutura/secao/detalhes/${value.id}`);
    }

    const representativeDepartamentoTemplate = (rowData) => {
        if(rowData?.departamento && rowData?.departamento?.nome) {
            return rowData?.departamento?.nome;
        }
        return 'Não informado';
    };

    const representativeFilialTemplate = (rowData) => {
        if(rowData?.departamento?.filial && rowData?.departamento?.filial?.nome) {
            return rowData?.departamento?.filial?.nome;
        }
        return 'Não informado';
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSecoes];

            if (Array.isArray(selectedValue)) {
                setSelectedSecoes(selectedValue);
                setSelected(selectedValue.map(sec => sec.id));
            } else {
                if (newSelection.some(sec => sec.id === selectedValue.id)) {
                    newSelection = newSelection.filter(sec => sec.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSecoes(newSelection);
                setSelected(newSelection.map(sec => sec.id));
            }
        } else {
            setSelectedSecao(e.value);
            verDetalhes(e.value);
        }
    }

    return (
        <>
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto 
                            width={'320px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar seções" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={secoes} 
                emptyMessage="Não foram encontradas seções" 
                selection={selected ? selectedSecoes : selectedSecao} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
                paginator={pagination} 
                lazy
                rows={rows} 
                totalRecords={totalRecords} 
                first={first} 
                onPage={onPage}
                tableStyle={{ minWidth: '68vw' }}
            >
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="id_origem" header="Código" style={{ width: '15%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '25%' }}></Column>
                <Column body={representativeFilialTemplate} field="departamento.filial.nome" header="Filial" style={{ width: '20%' }}></Column>
                <Column body={representativeDepartamentoTemplate} field="departamento.nome" header="Departamento" style={{ width: '20%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableSecoes;