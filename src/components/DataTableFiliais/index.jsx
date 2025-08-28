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
import ModalEditarFilial from '../ModalEditarFilial';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import SwitchInput from '@components/SwitchInput';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';
import Botao from '@components/Botao';
import { FaCheck, FaTimes, FaEdit, FaTimes as FaCancel } from 'react-icons/fa';

function DataTableFiliais({ filiais, showSearch = true, pagination = true, rows, totalRecords, first, onPage, totalPages, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort }) {

    const[selectedFilial, setSelectedFilial] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedFiliais, setSelectedFiliais] = useState([]);
    const [integracaoStates, setIntegracaoStates] = useState({});
    const [bulkIntegrationMode, setBulkIntegrationMode] = useState(false);
    const [selectedForIntegration, setSelectedForIntegration] = useState([]);
    const [universalIntegrationValue, setUniversalIntegrationValue] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descricao: { value: null, matchMode: FilterMatchMode.CONTAINS },
        integracao: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const { metadadosDeveSerExibido } = useMetadadosPermission();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && filiais) {
            const filiaisSelecionadas = filiais.filter(filial => selected.includes(filial.id));
            setSelectedFiliais(filiaisSelecionadas);
        } else {
            setSelectedFiliais([]);
        }
    }, [selected, filiais]);

    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedFilial(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }

    function formataCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]/g, "")
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }

    const representativeCNPJTemplate = (rowData) => {
        if(rowData?.cnpj)
        {
            return (
                formataCNPJ(rowData.cnpj)
            )
        }
        else
        {
            return "---"
        }
    }

    
    const editarFilial = (filial) => {

        // setLoading(true)
       
        const data = {};
        data.nome = filial.nome;
        data.id = filial.id;
        data.cnpj = removerMascaraCNPJ(filial.cnpj);

        http.put(`filial/${filial.id}/`, data)
            .then(response => {
                if(response.id)
                {
                    setModalOpened(false)
                }
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })
    }

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedFiliais];

            if (Array.isArray(selectedValue)) {
                setSelectedFiliais(selectedValue);
                setSelected(selectedValue.map(filial => filial.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(filial => filial.id === selectedValue.id)) {
                    newSelection = newSelection.filter(filial => filial.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedFiliais(newSelection);
                setSelected(newSelection.map(filial => filial.id));
            }
        }
        // Removido o clique na linha para edição
    }

    const excluirFilial = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta filial?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/filial/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Filial excluída com sucesso',
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
                        detail: 'Não foi possível excluir a filial',
                        life: 3000
                    });
                    console.error('Erro ao excluir filial:', error);
                });
            },
            reject: () => {}
        });
    };

    const atualizarIntegracao = (id, integracao) => {
        console.log('atualizarIntegracao called:', id, integracao);
        // Atualizar o estado local imediatamente para feedback visual
        setIntegracaoStates(prev => {
            console.log('Previous state:', prev);
            const newState = {
                ...prev,
                [id]: integracao
            };
            console.log('New state:', newState);
            return newState;
        });
        
        http.put(`filial/${id}/`, { integracao })
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

    // Função para ativar/desativar integração em massa
    const toggleBulkIntegration = async (activate) => {
        if (!selectedForIntegration || selectedForIntegration.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione pelo menos uma filial para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(filial => {
                newStates[filial.id] = activate;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(filial => 
                http.put(`filial/${filial.id}/`, { integracao: activate })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} filiais tiveram a integração ${activate ? 'ativada' : 'desativada'} com sucesso`,
                life: 3000
            });

            if (onUpdate) {
                onUpdate();
            }

        } catch (error) {
            // Reverter estado em caso de erro
            setIntegracaoStates(prev => {
                const revertedStates = { ...prev };
                selectedForIntegration.forEach(filial => {
                    revertedStates[filial.id] = !activate;
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
        
            
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
            }}>
                <SwitchInput
                    checked={integracaoValue}
                    disabled={bulkIntegrationMode}
                    onChange={(value) => {
                        atualizarIntegracao(rowData.id, value);
                    }}
                />
            </div>
        );
    };

    // Função para lidar com seleção para integração
    const handleIntegrationSelectionChange = (e) => {
        setSelectedForIntegration(e.value);
    };

    // Função para editar filial
    const editarFilialClick = (filial) => {
        setSelectedFilial(filial);
        setModalOpened(true);
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
                detail: 'Selecione pelo menos uma filial para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(filial => {
                newStates[filial.id] = universalIntegrationValue;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(filial => 
                http.put(`filial/${filial.id}/`, { integracao: universalIntegrationValue })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} filiais tiveram a integração ${universalIntegrationValue ? 'ativada' : 'desativada'} com sucesso`,
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
                selectedForIntegration.forEach(filial => {
                    revertedStates[filial.id] = !universalIntegrationValue;
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

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('delete_filial') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Filial" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirFilial(rowData.id);
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
                    data-pr-tooltip="Editar Filial" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        editarFilialClick(rowData);
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

    const onFilter = (event) => {
        console.log("Filtro aplicado:", event.filters);
        const newFilters = { ...event.filters };
        setFilters(newFilters);
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog  />
            
            <div style={{ display: 'flex', width: '100%', justifyContent: showSearch ? "space-between" : "flex-end", alignItems: 'center', marginBottom: '16px' }}>
                {showSearch && 
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar filiais" />
                    </span>
                }
                <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginBottom: '16px',
                        padding: '12px',
                        minWidth: '500px',
                        borderRadius: '8px'
                }}>
                    {metadadosDeveSerExibido && !bulkIntegrationMode && filiais && filiais.length > 0 && (
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
                value={filiais} 
                emptyMessage="Não foram encontradas filiais" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedFiliais : selectedFilial)} 
                onSelectionChange={bulkIntegrationMode ? handleIntegrationSelectionChange : handleSelectChange} 
                selectionMode={bulkIntegrationMode ? "checkbox" : (selected ? "checkbox" : "single")} 
                paginator={pagination} 
                lazy
                dataKey="id"
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
                <Column field="nome" header="Filial" sortable style={{ width: metadadosDeveSerExibido ? '20%' : '35%' }}></Column>
                <Column field="cidade" header="Cidade" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeCNPJTemplate} field="cnpj" header="CNPJ" sortable style={{ width: metadadosDeveSerExibido ? '20%' : '35%' }}></Column>
                {(metadadosDeveSerExibido || bulkIntegrationMode) && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: '15%' }}></Column>
                )}
                <Column body={representativeEditTemplate} header="Editar" style={{ width: '8%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '8%' }}></Column>
            </DataTable>
            <ModalEditarFilial aoSalvar={editarFilial} filial={selectedFilial} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableFiliais
