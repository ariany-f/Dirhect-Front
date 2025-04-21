import styles from '@pages/Estrutura/Departamento.module.css'
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

function DataTableHorarios({ 
    horarios, 
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
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const navegar = useNavigate();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && horarios) {
            const horariosSelecionados = horarios.filter(horario => selected.includes(horario.id));
            setSelectedHorarios(horariosSelecionados);
        } else {
            setSelectedHorarios([]);
        }
    }, [selected, horarios]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedHorario(value.id);
        navegar(`/estrutura/horario/detalhes/${value.id}`);
    }

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedHorarios];

            if (Array.isArray(selectedValue)) {
                setSelectedHorarios(selectedValue);
                setSelected(selectedValue.map(horario => horario.id));
            } else {
                if (newSelection.some(horario => horario.id === selectedValue.id)) {
                    newSelection = newSelection.filter(horario => horario.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedHorarios(newSelection);
                setSelected(newSelection.map(horario => horario.id));
            }
        } else {
            setSelectedHorario(e.value);
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
                            placeholder="Buscar horários" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={horarios} 
                emptyMessage="Não foram encontrados horários" 
                selection={selected ? selectedHorarios : selectedHorario} 
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
                <Column field="codigo" header="Código" style={{ width: '15%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '75%' }}></Column>
                <Column field="jornada" header="Jornada" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableHorarios;