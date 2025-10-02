import styles from '@pages/Estrutura/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
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
import Texto from '@components/Texto';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DataTableSecoes({ secoes, showSearch = true, paginator = true, rows = 10, totalRecords, totalPages, first, onPage, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort }) {
   
    const[selectedSecao, setSelectedSecao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false);
    const [selectedSecaoColaboradores, setSelectedSecaoColaboradores] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
        descricao: { value: null, matchMode: FilterMatchMode.CONTAINS },
        integracao: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [selectedSecoes, setSelectedSecoes] = useState([]);
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
        integracao: ((metadadosDeveSerExibido || bulkIntegrationMode) && ArmazenadorToken.hasPermission('change_secao'))
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Checkbox, Id, Código, Nome, Descrição, Calendário, Integração, Ações
    const larguraBase = [5, 8, 8, 20, 20, 15, 12, 12];
    
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
            indicesRemover.push(6); // índice da coluna integração (agora é 6 em vez de 5)
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
        if (!exibeColunasOpcionais.integracao && baseIndex > 6) { // Ajustado para 6
            adjustedIndex -= 1;
        }
        return adjustedIndex;
    };

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && secoes) {
            const secoesSelecionadas = secoes.filter(sec => selected.includes(sec.id));
            setSelectedSecoes(secoesSelecionadas);
        } else {
            setSelectedSecoes([]);
        }
    }, [selected, secoes]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        setSelectedSecao(value.id);
        // navegar(`/estrutura/secao/detalhes/${value.id}`);
    }

    const representativeDepartamentoTemplate = (rowData) => {
        if(rowData?.departamento && rowData?.departamento?.nome) {
            return rowData?.departamento?.nome;
        }
        return 'Não informado';
    };

    const representativeFilialTemplate = (rowData) => {
        if(rowData?.departamento?.filial && rowData?.departamento?.filial?.nome) {
            return rowData?.departamento?.filial?.nome;
        }
        return 'Não informado';
    };

    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedSecoes];

            if (Array.isArray(selectedValue)) {
                setSelectedSecoes(selectedValue);
                setSelected(selectedValue.map(sec => sec.id));
            } else {
                if (newSelection.some(sec => sec.id === selectedValue.id)) {
                    newSelection = newSelection.filter(sec => sec.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedSecoes(newSelection);
                setSelected(newSelection.map(sec => sec.id));
            }
        } else {
            setSelectedSecao(e.value);
            verDetalhes(e.value);
        }
    }

    const excluirSecao = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta seção?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/secao/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Seção excluída com sucesso',
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
                        detail: 'Não foi possível excluir a seção',
                        life: 3000
                    });
                    console.error('Erro ao excluir seção:', error);
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
        
        http.put(`secao/${id}/`, { integracao })
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

    // Função para editar seção
    const editarSecao = (secao) => {
        // Aqui você pode implementar a lógica de edição
        console.log('Editar seção:', secao);
    };

    // Função para abrir modal de colaboradores
    const abrirModalColaboradores = (secao) => {
        setSelectedSecaoColaboradores(secao);
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
                detail: 'Selecione pelo menos uma seção para alterar a integração',
                life: 3000
            });
            return;
        }

        try {
            // Atualizar estado local imediatamente
            const newStates = {};
            selectedForIntegration.forEach(secao => {
                newStates[secao.id] = universalIntegrationValue;
            });
            setIntegracaoStates(prev => ({ ...prev, ...newStates }));

            // Fazer requisições em paralelo
            const promises = selectedForIntegration.map(secao => 
                http.put(`secao/${secao.id}/`, { integracao: universalIntegrationValue })
            );

            await Promise.all(promises);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedForIntegration.length} seções tiveram a integração ${universalIntegrationValue ? 'ativada' : 'desativada'} com sucesso`,
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
                selectedForIntegration.forEach(secao => {
                    revertedStates[secao.id] = !universalIntegrationValue;
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

    const representativeNomeTemplate = (rowData) => {
        return (
            <div key={rowData.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Nome da Seção */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Texto weight={700} width={'100%'}>
                        {rowData?.nome}
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

    const representativeDescricaoTemplate = (rowData) => {
        if(rowData?.descricao)
        {
            return rowData.descricao
        }
        else
        {
            return "---"
        }
    }

    const representativeCalendarioTemplate = (rowData) => {
        return (
            <div>
                {rowData.calendario_nome || '-'}
            </div>
        )
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
                {ArmazenadorToken.hasPermission('change_secao') && !bulkIntegrationMode && !metadadosDeveSerExibido && (
                <FaPen 
                    className="edit" 
                    data-pr-tooltip="Editar Seção" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        editarSecao(rowData);
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
                {ArmazenadorToken.hasPermission('delete_secao') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Seção" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirSecao(rowData.id);
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
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar seção" />
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
                    {metadadosDeveSerExibido && !bulkIntegrationMode && secoes && secoes.length > 0 && (
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
                value={secoes} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} seções"
                emptyMessage="Não foram encontradas seções" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedSecoes : selectedSecao)} 
                onSelectionChange={bulkIntegrationMode ? handleIntegrationSelectionChange : handleSelectChange} 
                selectionMode={bulkIntegrationMode ? "checkbox" : (selected ? "checkbox" : "single")} 
                paginator={paginator} 
                lazy
                dataKey="id"
                filters={filters}
                globalFilterFields={['nome', 'descricao', 'calendario_nome']}
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                removableSort
                tableStyle={{ minWidth: '68vw' }}
            >
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[0]}%` }}></Column>
                )}
                <Column field="id" header="Id" sortable style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column body={representativeCodigoTemplate} field="id_origem" header="Código" sortable style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column body={representativeNomeTemplate} field="nome" header="Nome" sortable style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column body={representativeDescricaoTemplate} field="descricao" header="Descrição" sortable style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
                <Column body={representativeCalendarioTemplate} field="calendario_nome" header="Calendário" sortField="calendario" sortable style={{ width: `${largurasColunas[getColumnIndex(5)]}%` }}></Column>
                {exibeColunasOpcionais.integracao && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: `${largurasColunas[getColumnIndex(6)]}%` }}></Column>
                )}
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(7)]}%` }}></Column>
            </DataTable>
            <ModalListaColaboradoresPorEstrutura 
                visible={modalColaboradoresOpened}
                onHide={() => setModalColaboradoresOpened(false)}
                tipoEstrutura="secao"
                estruturaId={selectedSecaoColaboradores.id}
                estruturaNome={selectedSecaoColaboradores.nome}
                estruturaTipo="Seção"
            />
        </>
    );
}

export default DataTableSecoes;