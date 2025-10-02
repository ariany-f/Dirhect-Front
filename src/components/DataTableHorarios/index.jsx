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
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import SwitchInput from '@components/SwitchInput';
import http from '@http';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';
import Botao from '@components/Botao';
import { FaCheck, FaTimes, FaPen, FaTimes as FaCancel, FaUsers } from 'react-icons/fa';
import ModalListaColaboradoresPorEstrutura from '../ModalListaColaboradoresPorEstrutura';

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
    setSelected = () => { }, 
    onUpdate, 
    sortField, 
    sortOrder, 
    onSort 
}) {
   
    const[selectedHorario, setSelectedHorario] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false);
    const [selectedHorarioColaboradores, setSelectedHorarioColaboradores] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descricao: { value: null, matchMode: FilterMatchMode.CONTAINS },
        integracao: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [integracaoStates, setIntegracaoStates] = useState({});
    const [bulkIntegrationMode, setBulkIntegrationMode] = useState(false);
    const [selectedForIntegration, setSelectedForIntegration] = useState([]);
    const [universalIntegrationValue, setUniversalIntegrationValue] = useState(false);
    const { metadadosDeveSerExibido } = useMetadadosPermission();

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        checkbox: bulkIntegrationMode,
        integracao: ((metadadosDeveSerExibido || bulkIntegrationMode) && ArmazenadorToken.hasPermission('change_horario'))
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Checkbox, Id, Código, Descrição, Nome, Integração, Ações
    const larguraBase = [5, 10, 10, 25, 25, 10, 20];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        let larguras = [...larguraBase];
        let indicesRemover = [];
        
        // Remove checkbox se não está no modo bulk
        if (!exibeColunasOpcionais.checkbox) {
            indicesRemover.push(0); // índice da coluna checkbox
        }
        
        // Remove integração se não deve ser exibida
        if (!exibeColunasOpcionais.integracao) {
            indicesRemover.push(5); // índice da coluna integração
        }
        
        // Remove colunas opcionais e recalcula
        const largurasFiltradas = larguras.filter((_, index) => !indicesRemover.includes(index));
        const totalFiltrado = largurasFiltradas.reduce((acc, val) => acc + val, 0);
        const fatorRedistribuicao = 100 / totalFiltrado;
        
        return largurasFiltradas.map(largura => Math.round(largura * fatorRedistribuicao * 100) / 100);
    };
    
    const largurasColunas = calcularLarguras();

    // Funções auxiliares para calcular índices das colunas
    const getColumnIndex = (baseIndex) => {
        let adjustedIndex = baseIndex;
        if (!exibeColunasOpcionais.checkbox && baseIndex > 0) {
            adjustedIndex -= 1;
        }
        if (!exibeColunasOpcionais.integracao && baseIndex > 5) {
            adjustedIndex -= 1;
        }
        return adjustedIndex;
    };

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

    const atualizarIntegracao = (id, integracao) => {
        // Atualizar o estado local imediatamente para feedback visual
        setIntegracaoStates(prev => ({
            ...prev,
            [id]: integracao
        }));
        
        http.put(`horario/${id}/`, { integracao })
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

    // Função para editar horario
    const editarHorario = (horario) => {
        // Aqui você pode implementar a lógica de edição
        console.log('Editar horario:', horario);
    };

    // Função para abrir modal de colaboradores
    const abrirModalColaboradores = (horario) => {
        setSelectedHorarioColaboradores(horario);
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
                detail: 'Selecione pelo menos um horário para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(horario => {
                newStates[horario.id] = universalIntegrationValue;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(horario => 
                http.put(`horario/${horario.id}/`, { integracao: universalIntegrationValue })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} horários tiveram a integração ${universalIntegrationValue ? 'ativada' : 'desativada'} com sucesso`,
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
                selectedForIntegration.forEach(horario => {
                    revertedStates[horario.id] = !universalIntegrationValue;
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

    const representativeDescricaoTemplate = (rowData) => {
        return (
            <div key={rowData.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Descrição do Horário */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Texto weight={700} width={'100%'}>
                        {rowData?.descricao || "---"}
                    </Texto>
                </div>
            </div>
        );
    };

    const representativeCodigoTemplate = (rowData) => {
        if(rowData?.id_origem)
        {
            return rowData.id_origem
        }
        else
        {
            return "---"
        }
    }

    const representativeNomeTemplate = (rowData) => {
        if(rowData?.nome)
        {
            return rowData.nome
        }
        else
        {
            return "---"
        }
    }

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ 
                display: 'flex', 
                gap: '8px',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center'
            }}>
                <Tooltip style={{fontSize: '10px'}} target=".edit" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('change_horario') && !bulkIntegrationMode && !metadadosDeveSerExibido && (
                <FaPen 
                    className="edit" 
                    data-pr-tooltip="Editar Horário" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        editarHorario(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
                )}
                <Tooltip style={{fontSize: '10px'}} target=".colaboradores" mouseTrack mouseTrackLeft={10} />
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
                <Tooltip style={{fontSize: '10px'}} target=".delete" mouseTrack mouseTrackLeft={10} />
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
            <ConfirmDialog  />
            
            <div style={{ display: 'flex', justifyContent: showSearch ? 'space-between' : 'end', alignItems: 'center', marginBottom: '16px' }}>
                {showSearch && 
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar horário" />
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
                    {metadadosDeveSerExibido && !bulkIntegrationMode && horarios && horarios.length > 0 && ArmazenadorToken.hasPermission('change_horario') && (
                        <Botao
                            size="small"
                            aoClicar={() => setBulkIntegrationMode(true)}
                            style={{
                                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            <FaPen /> Editar vários
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
                value={horarios} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} horários"
                emptyMessage="Não foram encontrados horários" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedHorarios : selectedHorario)} 
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
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[0]}%` }}></Column>
                )}
                <Column field="id" header="Id" sortable style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column body={representativeCodigoTemplate} field="id_origem" header="Código" sortable style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column body={representativeDescricaoTemplate} field="descricao" header="Descrição" sortable style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column body={representativeNomeTemplate} field="nome" header="Nome" sortable style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
                {exibeColunasOpcionais.integracao && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: `${largurasColunas[getColumnIndex(5)]}%` }}></Column>
                )}
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(6)]}%` }}></Column>
            </DataTable>
            <ModalListaColaboradoresPorEstrutura 
                visible={modalColaboradoresOpened}
                onHide={() => setModalColaboradoresOpened(false)}
                tipoEstrutura="horario"
                estruturaId={selectedHorarioColaboradores.id}
                estruturaNome={selectedHorarioColaboradores.descricao || selectedHorarioColaboradores.nome}
                estruturaTipo="Horário"
            />
        </>
    );
}

export default DataTableHorarios;