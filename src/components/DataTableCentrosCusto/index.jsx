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

function DataTableCentrosCusto({ 
    centros_custo, 
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
    const [selectedCentros, setSelectedCentros] = useState([]);
    const [selectedCentro, setSelectedCentro] = useState(null);
    const navegar = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && centros_custo) {
            const centrosSelecionados = centros_custo.filter(centro => selected.includes(centro.id));
            setSelectedCentros(centrosSelecionados);
        } else {
            setSelectedCentros([]);
        }
    }, [selected, centros_custo]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedCentro(value.id);
        // navegar(`/estrutura/centro-custo/detalhes/${value.id}`);
    }

    const representativeCCPaiTemplate = (rowData) => {
        if(rowData?.cc_pai && rowData?.cc_pai?.nome) {
            return rowData?.cc_pai?.nome;
        }
        return 'Não informado';
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedCentros];

            if (Array.isArray(selectedValue)) {
                setSelectedCentros(selectedValue);
                setSelected(selectedValue.map(centro => centro.id));
            } else {
                if (newSelection.some(centro => centro.id === selectedValue.id)) {
                    newSelection = newSelection.filter(centro => centro.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedCentros(newSelection);
                setSelected(newSelection.map(centro => centro.id));
            }
        } else {
            setSelectedCentro(e.value);
            verDetalhes(e.value);
        }
    }

    const excluirCentroCusto = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este centro de custo?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/centro-custo/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Centro de custo excluído com sucesso',
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
                        detail: 'Não foi possível excluir o centro de custo',
                        life: 3000
                    });
                    console.error('Erro ao excluir centro de custo:', error);
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
                    data-pr-tooltip="Excluir Centro de Custo" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        excluirCentroCusto(rowData.id);
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
                            placeholder="Buscar centros de custo" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={centros_custo} 
                emptyMessage="Não foram encontrados centros de custo" 
                selection={selected ? selectedCentros : selectedCentro} 
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
                <Column field="cc_origem" header="Código" style={{ width: '20%' }}></Column>
                <Column field="nome" header="Nome" style={{ width: '35%' }}></Column>
                <Column body={representativeCCPaiTemplate} field="cc_pai.nome" header="Centro de Custo Pai" style={{ width: '25%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableCentrosCusto;