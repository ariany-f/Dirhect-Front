import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarCalendario from '../ModalEditarCalendario';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';
import { FaPen, FaTimes as FaCancel, FaFileExcel } from 'react-icons/fa';
import Botao from '@components/Botao';
import { GrAddCircle } from 'react-icons/gr';
import BotaoGrupo from '@components/BotaoGrupo';
import Texto from '@components/Texto';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const TableHeader = styled.div`
    display: flex;
    padding: 0px;
    flex-direction: column;

    .header-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .add-button {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;

            &:hover {
                background: var(--surface-100);
            }

            svg {
                width: 16px;
                height: 16px;
            }
        }
    }
`;

function DataTableCalendarios({ 
    calendarios, 
    showSearch = false, // Mudado para false por padrão
    pagination = true, 
    rows = 10, 
    totalRecords, 
    first, 
    onPage, 
    totalPages, 
    onSearch, 
    selected = null, 
    setSelected = () => { }, 
    onUpdate, 
    sortField, 
    sortOrder, 
    onSort, 
    onExportExcel, 
    exportingExcel = false,
    onAddClick,
    onEditClick,
    onDeleteClick,
    onReload,
    onSelectionChange,
    calendarioSelecionado
}) {

    const[selectedCalendario, setSelectedCalendario] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false)
    const [selectedCalendarioColaboradores, setSelectedCalendarioColaboradores] = useState({})
    const toast = useRef(null)
    const [selectedCalendarios, setSelectedCalendarios] = useState([]);
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
    const { t } = useTranslation('common');

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        checkbox: bulkIntegrationMode,
        integracao: ((metadadosDeveSerExibido || bulkIntegrationMode) && ArmazenadorToken.hasPermission('change_filial'))
    };
    
    // Larguras base otimizadas para Col5 (41.66% da tela)
    // Ordem: Nome, ID Origem, Descrição, Ações
    const larguraBase = [180, 120, 180, 100];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        let larguras = [...larguraBase];
        let indicesRemover = [];
   
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
        if (!exibeColunasOpcionais.integracao && baseIndex > 3) {
            adjustedIndex -= 1;
        }
        return adjustedIndex;
    };

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && calendarios) {
            const calendariosSelecionados = calendarios.filter(calendario => selected.includes(calendario.id));
            setSelectedCalendarios(calendariosSelecionados);
        } else {
            setSelectedCalendarios([]);
        }
    }, [selected, calendarios]);

    // Auto-selecionar primeiro calendário se não houver seleção
    useEffect(() => {
        if (calendarios && calendarios.length > 0 && !selectedCalendario && onSelectionChange) {
            setSelectedCalendario(calendarios[0]);
            onSelectionChange(calendarios[0]);
        }
    }, [calendarios, selectedCalendario, onSelectionChange]);

    // Sincronizar calendarioSelecionado com o estado interno
    useEffect(() => {
        if (calendarioSelecionado) {
            setSelectedCalendario(calendarioSelecionado);
        }
    }, [calendarioSelecionado]);

    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleSelectionChange = (e) => {
        if (e.value === null) {
            return;
        }
        
        setSelectedCalendario(e.value);
        if (onSelectionChange) {
            onSelectionChange(e.value);
        }
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedCalendario(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }

    const representativeDescricaoTemplate = (rowData) => {
        return (
            <div style={{ 
                maxWidth: '300px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
            }}>
                {rowData.descricao || '-'}
            </div>
        )
    }

    const representativeNomeTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Texto size={16} weight={500}>{rowData?.nome}</Texto>
            </div>
        )
    };

    const excluirCalendario = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este calendario?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/calendarios/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Calendario excluído com sucesso',
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
                        detail: 'Não foi possível excluir o calendario',
                        life: 3000
                    });
                    console.error('Erro ao excluir calendario:', error);
                });
            },
            reject: () => {}
        });
    };

    // Função para editar calendario
    const editarCalendarioClick = (calendario) => {
        setSelectedCalendario(calendario);
        setModalOpened(true);
    };

    // Função para salvar edição do calendario
    const editarCalendario = (data, id) => {
        http.put(`/calendarios/${id}/?format=json`, data)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Calendario atualizado com sucesso',
                    life: 3000
                });
                
                if (onUpdate) {
                    onUpdate();
                }
                setModalOpened(false);
            })
            .catch(error => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível atualizar o calendario',
                    life: 3000
                });
                console.error('Erro ao atualizar calendario:', error);
            });
    };

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
                {ArmazenadorToken.hasPermission('change_calendario') && (
                <FaPen 
                    className="edit" 
                    data-pr-tooltip="Editar Calendario" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEditClick) {
                            onEditClick(rowData);
                        } else {
                            editarCalendarioClick(rowData);
                        }
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
                )}
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('delete_calendario') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Calendario" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClick) {
                                onDeleteClick(rowData);
                            } else {
                                excluirCalendario(rowData.id);
                            }
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

    const headerTemplate = () => {
        return (
            <TableHeader>
                <BotaoGrupo align="space-between">
                    <Texto size={'18px'} weight={600}>Calendários</Texto>
                    {onAddClick && (
                        <Botao aoClicar={onAddClick} estilo="neutro" size="small" tab>
                            <GrAddCircle /> {t('add')} Calendário
                        </Botao>
                    )}
                </BotaoGrupo>
                {showSearch && (
                    <CampoTexto  
                        width={'200px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Buscar calendários" 
                    />
                )}
            </TableHeader>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog  />
            
            <DataTable 
                key={`${JSON.stringify(integracaoStates)}-${bulkIntegrationMode}`}
                value={calendarios} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} calendarios"
                emptyMessage="Não foram encontrados calendarios" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedCalendarios : selectedCalendario)} 
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
                tableStyle={{ minWidth: '650px' }}
                onSelectionChange={onSelectionChange ? handleSelectionChange : undefined}
                rowClassName={(data) => data === selectedCalendario ? 'p-highlight' : ''}
                header={headerTemplate}
                showGridlines
                stripedRows
            >
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[0]}%` }}></Column>
                )}
                <Column field="nome" body={representativeNomeTemplate} header="Nome" style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column field="id_origem" header="ID Origem" style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column field="descricao" body={representativeDescricaoTemplate} header="Descrição" style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
            </DataTable>
            <ModalEditarCalendario aoSalvar={editarCalendario} calendario={selectedCalendario} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableCalendarios
