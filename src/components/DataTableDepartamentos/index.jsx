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

function DataTableDepartamentos({ 
    departamentos, 
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
    const [selectedDepartamentos, setSelectedDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const navegar = useNavigate()

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && departamentos) {
            const departamentosSelecionados = departamentos.filter(dep => selected.includes(dep.id));
            setSelectedDepartamentos(departamentosSelecionados);
        } else {
            setSelectedDepartamentos([]);
        }
    }, [selected, departamentos]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value)
    {
        setSelectedDepartamento(value.id)
        navegar(`/estrutura/departamento/detalhes/${value.id}`)
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
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedDepartamentos];

            if (Array.isArray(selectedValue)) {
                setSelectedDepartamentos(selectedValue);
                setSelected(selectedValue.map(dep => dep.id));
            } else {
                if (newSelection.some(dep => dep.id === selectedValue.id)) {
                    newSelection = newSelection.filter(dep => dep.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedDepartamentos(newSelection);
                setSelected(newSelection.map(dep => dep.id));
            }
        } else {
            setSelectedDepartamento(e.value);
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
                            placeholder="Buscar departamentos" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={departamentos} 
                emptyMessage="Não foram encontrados departamentos" 
                selection={selected ? selectedDepartamentos : selectedDepartamento} 
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
                <Column field="codigo" header="Código" style={{ width: '20%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '40%' }}></Column>
                <Column body={representativeFilialTemplate} field="filial.nome" header="Filial" style={{ width: '20%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableDepartamentos;