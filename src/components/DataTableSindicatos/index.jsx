import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarSindicato from '../ModalEditarSindicato';
import styled from 'styled-components';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputSwitch } from 'primereact/inputswitch';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
`

function DataTableSindicatos({ 
    sindicatos, 
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
    const [selectedSindicatos, setSelectedSindicatos] = useState([]);
    const [selectedSindicato, setSelectedSindicato] = useState(null);
    const navegar = useNavigate();
    const toast = useRef(null);
    const { metadadosDeveSerExibido } = useMetadadosPermission();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && sindicatos) {
            const sindicatosSelecionados = sindicatos.filter(sindicato => selected.includes(sindicato.id));
            setSelectedSindicatos(sindicatosSelecionados);
        } else {
            setSelectedSindicatos([]);
        }
    }, [selected, sindicatos]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedSindicato(value.id);
        // navegar(`/estrutura/sindicato/detalhes/${value.id}`);
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    const representativeCNPJTemplate = (rowData) => {
        if(rowData?.cnpj) {
            return formataCNPJ(rowData.cnpj);
        }
        return "---";
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSindicatos];

            if (Array.isArray(selectedValue)) {
                setSelectedSindicatos(selectedValue);
                setSelected(selectedValue.map(sindicato => sindicato.id));
            } else {
                if (newSelection.some(sindicato => sindicato.id === selectedValue.id)) {
                    newSelection = newSelection.filter(sindicato => sindicato.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSindicatos(newSelection);
                setSelected(newSelection.map(sindicato => sindicato.id));
            }
        } else {
            setSelectedSindicato(e.value);
            verDetalhes(e.value);
        }
    }

    const excluirSindicato = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este sindicato?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/sindicato/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Sindicato excluído com sucesso',
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
                        detail: 'Não foi possível excluir o sindicato',
                        life: 3000
                    });
                    console.error('Erro ao excluir sindicato:', error);
                });
            },
            reject: () => {}
        });
    };

    const atualizarIntegracao = (id, integracao) => {
        http.put(`sindicato/${id}/`, { integracao })
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Integração atualizada com sucesso',
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
                    detail: 'Erro ao atualizar integração',
                    life: 3000
                });
                console.error('Erro ao atualizar integração:', error);
            });
    };

    const representativeIntegracaoTemplate = (rowData) => {
        return (
            <InputSwitch
                checked={rowData.integracao || false}
                onChange={(e) => atualizarIntegracao(rowData.id, e.value)}
                tooltip={rowData.integracao ? 'Integração ativa' : 'Integração inativa'}
                tooltipOptions={{ position: 'top' }}
            />
        );
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
                {ArmazenadorToken.hasPermission('delete_sindicato') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Sindicato" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirSindicato(rowData.id);
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
            <ConfirmDialog  />
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto 
                            width={'320px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar sindicatos" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={sindicatos} 
                emptyMessage="Não foram encontrados sindicatos" 
                selection={selected ? selectedSindicatos : selectedSindicato} 
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
                <Column field="descricao" header="Nome" sortable style={{ width: metadadosDeveSerExibido ? '30%' : '40%' }}></Column>
                <Column body={representativeCNPJTemplate} field="cnpj" header="CNPJ" sortable style={{ width: metadadosDeveSerExibido ? '30%' : '40%' }}></Column>
                {metadadosDeveSerExibido && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: '20%' }}></Column>
                )}
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableSindicatos;