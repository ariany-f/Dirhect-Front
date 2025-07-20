import styles from '@pages/Estrutura/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { FaBan } from 'react-icons/fa'
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import BadgeBeneficio from '@components/BadgeBeneficio'
import Texto from '@components/Texto';
import './DataTable.css'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import http from '@http';
import { ArmazenadorToken } from '@utils';

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
    setSelected = () => {},
    onUpdate,
    sortField,
    sortOrder,
    onSort
}) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const navegar = useNavigate();
    const toast = useRef(null);

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
        // navegar(`/estrutura/horario/detalhes/${value.id}`);
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

    const excluirHorario = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este horário?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/horario/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Horário excluído com sucesso',
                        life: 3000
                    });
                    
                    if (onUpdate) {
                        onUpdate();
                    }
                })
                .catch(error => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível excluir o horário',
                        life: 3000
                    });
                    console.error('Erro ao excluir horário:', error);
                });
            },
            reject: () => {}
        });
    };

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('delete_horario') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Horário" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirHorario(rowData.id);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--error)'
                        }}
                    />
                )}
            </div>
        );
    };

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
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
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                onSort={handleSort}
                removableSort
                tableStyle={{ minWidth: '68vw' }}
            >
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="codigo" header="Código" sortable style={{ width: '15%' }}></Column>
                <Column field="descricao" header="Descrição" sortable style={{ width: '65%' }}></Column>
                <Column field="jornada" header="Jornada" sortable style={{ width: '10%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableHorarios;