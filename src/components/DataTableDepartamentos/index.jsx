import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import './DataTable.css'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import http from '@http';

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
    setSelected = () => {},
    onUpdate
}) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedDepartamentos, setSelectedDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const navegar = useNavigate()
    const toast = useRef(null);

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
        // navegar(`/estrutura/departamento/detalhes/${value.id}`)
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

    const excluirDepartamento = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este departamento?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/departamento/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Departamento excluído com sucesso',
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
                        detail: 'Não foi possível excluir o departamento',
                        life: 3000
                    });
                    console.error('Erro ao excluir departamento:', error);
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
                <RiDeleteBin6Line 
                    className="delete" 
                    data-pr-tooltip="Excluir Departamento" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        excluirDepartamento(rowData.id);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--error)'
                    }}
                />
            </div>
        );
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
                <Column field="codigo" header="Código" style={{ width: '15%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '30%' }}></Column>
                <Column body={representativeFilialTemplate} field="filial.nome" header="Filial" style={{ width: '20%' }}></Column>
                <Column field="descricao" header="Descrição" style={{ width: '25%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableDepartamentos;