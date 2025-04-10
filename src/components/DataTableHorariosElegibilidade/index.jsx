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

function DataTableHorariosElegibilidade({ horarios, showSearch = true, pagination = true, selected = null, setSelected = () => { } }) {
   
    const[selectedHorario, setSelectedHorario] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const navegar = useNavigate()

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && horarios) {
            const horariosSelecionados = horarios.filter(cargo => selected.includes(cargo.id));
            setSelectedHorarios(horariosSelecionados);
        } else {
            setSelectedHorarios([]);
        }
    }, [selected, horarios]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedHorario(value.public_id)
    }
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedHorarios];

            if (Array.isArray(selectedValue)) {
                setSelectedHorarios(selectedValue);
                setSelected(selectedValue.map(cargo => cargo.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(cargo => cargo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(cargo => cargo.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedHorarios(newSelection);
                setSelected(newSelection.map(cargo => cargo.id));
            }
        } else {
            setSelectedHorario(e.value.id);
            verDetalhes(e.value);
        }
    }

    const representativeHoraInicio = (rowData) => {
        if(rowData.hora_inicio)
        {
            return new Date(rowData.hora_inicio).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        else
        {
            return 'Não definido'
        }
    };

    const representativeHoraFim = (rowData) => {
        if(rowData.hora_fim)
        {
            return new Date(rowData.hora_fim).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        else
        {
            return 'Não definido'
        }
    };

    const representativeDescriptionTemplate = (rowData) => {

        var fim = (rowData.hora_fim) ? new Date(rowData.hora_fim).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não definido';
        var inicio = (rowData.hora_inicio) ? new Date(rowData.hora_inicio).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não definido';
        return `#${rowData.codigo} - ${rowData.descricao} - ${inicio} - ${fim}`
    }

    const representativeBeneficiosTemplate = (rowData) => {
        return (
        <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <Texto weight={300}>Benefícios configurados</Texto>
            <Beneficios>
                {(!rowData?.benefits) || rowData?.benefits.length === 0
                ?
                    <FaBan size={10} />
                :
                    rowData?.benefits.map((benefit, index) => {
                        return (
                            <BadgeBeneficio key={index} nomeBeneficio={benefit.name}/>
                        )
                    })
                }
            </Beneficios>
        </div>)
    }

    return (
        <>
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar horário" />
                    </span>
                </div>
            }
            <DataTable value={horarios} filters={filters} globalFilterFields={['id', 'codigo', 'descricao']} emptyMessage="Não foram encontrados horarios" selection={selected ? selectedHorarios : selectedHorario} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableHorariosElegibilidade