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
const Beneficios = styled.div`
    display: flex;
    gap: 16px;
    color: var(--neutro-600);
    flex-wrap: wrap;
`

function DataTableHorariosElegibilidade({ horarios = [], showSearch = true, pagination = true, selected = null, setSelected = () => { }, mostrarTodas = true }) {
   
    const[selectedHorario, setSelectedHorario] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const navegar = useNavigate()

    // Filtra os horários se não estiver mostrando todas
    const horariosFiltrados = mostrarTodas ? horarios : horarios.filter(horario => 
        horario.elegibilidade && horario.elegibilidade.length > 0
    );

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedHorario(value.id)
        navegar(`/estrutura/horario/detalhes/${value.id}`)
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
        return <Texto width={'100%'} weight={800}>{`#${rowData.codigo} - ${rowData.descricao} - ${inicio} - ${fim}`}</Texto>
    }

    
    const representativeBeneficiosTemplate = (rowData) => {
        // Cria um Set para armazenar benefícios únicos
        const beneficiosUnicos = new Set();
        
        return (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <Texto weight={300}>Benefícios elegíveis</Texto>
                <Beneficios>
                    {!rowData?.elegibilidade || rowData.elegibilidade.length === 0 ? (
                        <FaBan size={10} />
                    ) : (
                        rowData.elegibilidade
                            .filter(item => {
                                const descricao = item.item_beneficio.beneficio?.dados_beneficio?.descricao;
                                if (beneficiosUnicos.has(descricao)) {
                                    return false;
                                }
                                beneficiosUnicos.add(descricao);
                                return true;
                            })
                            .map(item => (
                                <BadgeBeneficio 
                                    key={item.item_beneficio.beneficio?.id || item.id}
                                    nomeBeneficio={item.item_beneficio.beneficio?.dados_beneficio?.descricao}
                                    icone={item.item_beneficio.beneficio?.dados_beneficio?.icone}
                                />
                            ))
                    )}
                </Beneficios>
            </div>
        )
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
            <DataTable value={horariosFiltrados} filters={filters} globalFilterFields={['id', 'nome', 'descricao']} emptyMessage={mostrarTodas ? "Não foram encontrados horários" : "Não foram encontrados horários com benefícios elegíveis"} selection={selected ? selectedHorarios : selectedHorario} onSelectionChange={handleSelectChange} selectionMode={selected ? "checkbox" : "single"} paginator={pagination} rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} style={{ width: '20%' }}></Column>
                <Column body={representativeBeneficiosTemplate} style={{ width: '75%' }}></Column>
                <Column style={{ width: '5%' }} body={<MdOutlineKeyboardArrowRight size={24}/>}></Column>
            </DataTable>
        </>
    )
}

export default DataTableHorariosElegibilidade