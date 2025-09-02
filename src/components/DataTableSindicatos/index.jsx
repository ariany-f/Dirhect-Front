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
import SwitchInput from '@components/SwitchInput';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';
import Botao from '@components/Botao';
import { FaCheck, FaTimes, FaEdit, FaTimes as FaCancel, FaUsers } from 'react-icons/fa';
import ModalListaColaboradoresPorEstrutura from '../ModalListaColaboradoresPorEstrutura';

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
   
    const[selectedSindicato, setSelectedSindicato] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false);
    const [selectedSindicatoColaboradores, setSelectedSindicatoColaboradores] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descricao: { value: null, matchMode: FilterMatchMode.CONTAINS },
        integracao: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [selectedSindicatos, setSelectedSindicatos] = useState([]);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [integracaoStates, setIntegracaoStates] = useState({});
    const [bulkIntegrationMode, setBulkIntegrationMode] = useState(false);
    const [selectedForIntegration, setSelectedForIntegration] = useState([]);
    const [universalIntegrationValue, setUniversalIntegrationValue] = useState(false);
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
        // navigate(`/estrutura/sindicato/detalhes/${value.id}`);
    }

    const handleSelectChange = (e) => {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSindicatos];

            if (Array.isArray(selectedValue)) {
                setSelectedSindicatos(selectedValue);
                setSelected(selectedValue.map(sindicato => sindicato.id));
            } else {
                const existingIndex = newSelection.findIndex(item => item.id === selectedValue.id);
                if (existingIndex >= 0) {
                    newSelection.splice(existingIndex, 1);
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
    };

    const atualizarIntegracao = async (sindicatoId, novoValor) => {
        try {
            // Atualizar estado local imediatamente
            setIntegracaoStates(prev => ({
                ...prev,
                [sindicatoId]: novoValor
            }));

            // Fazer requisição para o backend
            await http.put(`sindicato/${sindicatoId}/`, { integracao: novoValor });

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Integração ${novoValor ? 'ativada' : 'desativada'} com sucesso`,
                life: 3000
            });

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            // Reverter estado em caso de erro
            setIntegracaoStates(prev => ({
                ...prev,
                [sindicatoId]: !novoValor
            }));

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar integração',
                life: 3000
            });
            console.error('Erro ao atualizar integração:', error);
        }
    };

    // Função para lidar com seleção para integração
    const handleIntegrationSelectionChange = (e) => {
        setSelectedForIntegration(e.value);
    };

    // Função para editar sindicato
    const editarSindicato = (sindicato) => {
        // Aqui você pode implementar a lógica de edição
        console.log('Editar sindicato:', sindicato);
    };

    // Função para abrir modal de colaboradores
    const abrirModalColaboradores = (sindicato) => {
        setSelectedSindicatoColaboradores(sindicato);
        setModalColaboradoresOpened(true);
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
                detail: 'Selecione pelo menos um sindicato para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(sindicato => {
                newStates[sindicato.id] = universalIntegrationValue;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(sindicato => 
                http.put(`sindicato/${sindicato.id}/`, { integracao: universalIntegrationValue })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} sindicatos tiveram a integração ${universalIntegrationValue ? 'ativada' : 'desativada'} com sucesso`,
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
                selectedForIntegration.forEach(sindicato => {
                    revertedStates[sindicato.id] = !universalIntegrationValue;
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
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <Tooltip target=".colaboradores" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('view_funcionario') && (
                    <FaUsers 
                        className="colaboradores" 
                        data-pr-tooltip="Ver Colaboradores" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            abrirModalColaboradores(rowData);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--success)'
                        }}
                    />
                )}
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                <RiDeleteBin6Line 
                    className="delete" 
                    data-pr-tooltip="Excluir Sindicato" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        confirmDialog({
                            message: `Tem certeza que deseja excluir o sindicato "${rowData.nome}"?`,
                            header: 'Confirmar Exclusão',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => {
                                // Implementar lógica de exclusão
                                console.log('Excluir sindicato:', rowData);
                            }
                        });
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#dc3545'
                    }}
                />
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
                    data-pr-tooltip="Editar Sindicato" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        editarSindicato(rowData);
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
            onSort(event);
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
            
            <div style={{ display: 'flex', justifyContent: showSearch ? 'space-between' : 'end', alignItems: 'center', marginBottom: '16px' }}>
                {showSearch && 
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar sindicato" />
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
                    {metadadosDeveSerExibido && !bulkIntegrationMode && sindicatos && sindicatos.length > 0 && (
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
                value={sindicatos} 
                emptyMessage="Não foram encontrados sindicatos" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedSindicatos : selectedSindicato)} 
                onSelectionChange={bulkIntegrationMode ? handleIntegrationSelectionChange : handleSelectChange} 
                selectionMode={bulkIntegrationMode ? "checkbox" : (selected ? "checkbox" : "single")} 
                paginator={pagination} 
                lazy
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                globalFilterFields={['nome', 'descricao']}
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : (sortOrder === 'asc' ? 1 : 0)}
                onSort={onSort}
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
                <Column body={representativeActionsTemplate} header="" style={{ width: '12%' }}></Column>
            </DataTable>
            <ModalListaColaboradoresPorEstrutura 
                visible={modalColaboradoresOpened}
                onHide={() => setModalColaboradoresOpened(false)}
                tipoEstrutura="sindicato"
                estruturaId={selectedSindicatoColaboradores.id}
                estruturaNome={selectedSindicatoColaboradores.nome}
                estruturaTipo="Sindicato"
            />
        </>
    );
}

export default DataTableSindicatos;