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
import SwitchInput from '@components/SwitchInput';
import http from '@http';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';
import Botao from '@components/Botao';
import { FaCheck, FaTimes, FaEdit, FaTimes as FaCancel } from 'react-icons/fa';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DataTableCargos({ cargos, showSearch = true, paginator = true, rows = 10, totalRecords, totalPages, first, onPage, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort }) {
   
    const[selectedCargo, setSelectedCargo] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descricao: { value: null, matchMode: FilterMatchMode.CONTAINS },
        integracao: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [selectedCargos, setSelectedCargos] = useState([]);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [integracaoStates, setIntegracaoStates] = useState({});
    const [bulkIntegrationMode, setBulkIntegrationMode] = useState(false);
    const [selectedForIntegration, setSelectedForIntegration] = useState([]);
    const [universalIntegrationValue, setUniversalIntegrationValue] = useState(false);
    const { metadadosDeveSerExibido } = useMetadadosPermission();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && cargos) {
            const cargosSelecionados = cargos.filter(cargo => selected.includes(cargo.id));
            setSelectedCargos(cargosSelecionados);
        } else {
            setSelectedCargos([]);
        }
    }, [selected, cargos]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value)
    {
        setSelectedCargo(value.public_id)
    }
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedCargos];

            if (Array.isArray(selectedValue)) {
                setSelectedCargos(selectedValue);
                setSelected(selectedValue.map(cargo => cargo.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(cargo => cargo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(cargo => cargo.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedCargos(newSelection);
                setSelected(newSelection.map(cargo => cargo.id));
            }
        } else {
            setSelectedCargo(e.value.id);
            verDetalhes(e.value);
        }
    }

    const excluirCargo = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este cargo?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/cargo/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Cargo excluído com sucesso',
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
                        detail: 'Não foi possível excluir o cargo',
                        life: 3000
                    });
                    console.error('Erro ao excluir cargo:', error);
                });
            },
            reject: () => {}
        });
    };

    const atualizarIntegracao = (id, integracao) => {
        // Atualizar o estado local imediatamente para feedback visual
        setIntegracaoStates(prev => ({
            ...prev,
            [id]: integracao
        }));
        
        http.put(`cargo/${id}/`, { integracao })
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
                // Reverter o estado em caso de erro
                setIntegracaoStates(prev => ({
                    ...prev,
                    [id]: !integracao
                }));
                
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao atualizar integração',
                    life: 3000
                });
                console.error('Erro ao atualizar integração:', error);
            });
    };

    // Função para lidar com seleção para integração
    const handleIntegrationSelectionChange = (e) => {
        setSelectedForIntegration(e.value);
    };

    // Função para editar cargo
    const editarCargo = (cargo) => {
        // Aqui você pode implementar a lógica de edição
        console.log('Editar cargo:', cargo);
    };

    // Função para cancelar modo de edição em massa
    const cancelarEdicaoMassa = () => {
        setBulkIntegrationMode(false);
        setSelectedForIntegration([]);
        setUniversalIntegrationValue(false);
    };

    // Função para aplicar integração universal
    const aplicarIntegracaoUniversal = async () => {
        if (!selectedForIntegration || selectedForIntegration.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione pelo menos um cargo para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(cargo => {
                newStates[cargo.id] = universalIntegrationValue;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(cargo => 
                http.put(`cargo/${cargo.id}/`, { integracao: universalIntegrationValue })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} cargos tiveram a integração ${universalIntegrationValue ? 'ativada' : 'desativada'} com sucesso`,
                life: 3000
            });

            if (onUpdate) {
                onUpdate();
            }

            // Limpar seleção após aplicar
            setSelectedForIntegration([]);
            setUniversalIntegrationValue(false);

        } catch (error) {
            // Reverter estado em caso de erro
            setIntegracaoStates(prev => {
                const revertedStates = { ...prev };
                selectedForIntegration.forEach(cargo => {
                    revertedStates[cargo.id] = !universalIntegrationValue;
                });
                return revertedStates;
            });

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar integração em massa',
                life: 3000
            });
            console.error('Erro ao atualizar integração em massa:', error);
        }
    };

    const representativeIntegracaoTemplate = (rowData) => {
        // Usar o estado local se disponível, senão usar o valor original
        const integracaoValue = integracaoStates[rowData.id] !== undefined 
            ? integracaoStates[rowData.id] 
            : (rowData.integracao || false);
        
        console.log('Template render:', rowData.id, 'integracaoStates:', integracaoStates, 'rowData.integracao:', rowData.integracao, 'integracaoValue:', integracaoValue);
            
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px'
            }}>
                <SwitchInput
                    checked={integracaoValue}
                    onChange={(value) => atualizarIntegracao(rowData.id, value)}
                    disabled={bulkIntegrationMode}
                />
            </div>
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
                {ArmazenadorToken.hasPermission('delete_cargo') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Cargo" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirCargo(rowData.id);
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

    const representativeEditTemplate = (rowData) => {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                <FaEdit 
                    className="edit" 
                    data-pr-tooltip="Editar Cargo" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        editarCargo(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
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

    const onFilter = (e) => {
        setFilters(e.filters);
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog  />
            
            <div style={{ display: 'flex', justifyContent: showSearch ? 'space-between' : 'end', alignItems: 'center', marginBottom: '16px' }}>
                {showSearch && 
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar cargo" />
                    </span>
                }
                <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginBottom: '16px',
                        padding: '12px',
                        minWidth: '500px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                }}>
                    {metadadosDeveSerExibido && !bulkIntegrationMode && cargos.length > 0 && (
                        <Botao
                            size="small"
                            aoClicar={() => setBulkIntegrationMode(true)}
                            style={{
                                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            <FaEdit /> Editar vários
                        </Botao>
                    )}
                    {/* Controles de integração em massa */}
                    {metadadosDeveSerExibido && bulkIntegrationMode && (
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Botao
                                size="small"
                                aoClicar={cancelarEdicaoMassa}
                                style={{
                                    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                <FaCancel /> Cancelar
                            </Botao>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px' 
                            }}>
                                <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '500',
                                    color: '#495057'
                                }}>
                                    Integração:
                                </span>
                                <SwitchInput
                                    checked={universalIntegrationValue}
                                    onChange={setUniversalIntegrationValue}
                                />
                            </div>
                            
                            <Botao
                                size="small"
                                aoClicar={aplicarIntegracaoUniversal}
                                disabled={selectedForIntegration.length === 0}
                                style={{
                                    background: selectedForIntegration.length > 0 
                                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                                        : 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                                    border: 'none',
                                    color: 'white',
                                    opacity: selectedForIntegration.length === 0 ? 0.5 : 1
                                }}
                            >
                                <FaCheck /> Aplicar ({selectedForIntegration.length})
                            </Botao>
                        </div>
                    )}
                </div>
            </div>
            <DataTable 
                key={`${JSON.stringify(integracaoStates)}-${bulkIntegrationMode}`}
                value={cargos} 
                emptyMessage="Não foram encontrados cargos" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedCargos : selectedCargo)} 
                onSelectionChange={bulkIntegrationMode ? handleIntegrationSelectionChange : handleSelectChange} 
                selectionMode={bulkIntegrationMode ? "checkbox" : (selected ? "checkbox" : "single")} 
                paginator={paginator} 
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
                {bulkIntegrationMode && (
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                )}
                <Column field="id" header="Id" sortable style={{ width: '10%' }}></Column>
                <Column field="id_origem" header="Código" sortable style={{ width: '10%' }}></Column>
                <Column field="nome" header="Nome" sortable style={{ width: metadadosDeveSerExibido ? '25%' : '35%' }}></Column>
                <Column field="descricao" header="Descrição" sortable style={{ width: metadadosDeveSerExibido ? '25%' : '35%' }}></Column>
                {(metadadosDeveSerExibido || bulkIntegrationMode) && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: '15%' }}></Column>
                )}
                <Column body={representativeEditTemplate} header="Editar" style={{ width: '8%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '8%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCargos