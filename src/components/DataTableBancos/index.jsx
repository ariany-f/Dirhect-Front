import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarBanco from '../ModalEditarBanco';
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

function DataTableBancos({ 
    bancos, 
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
    bancoSelecionado
}) {

    const[selectedBanco, setSelectedBanco] = useState(null)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false)
    const [selectedBancoColaboradores, setSelectedBancoColaboradores] = useState({})
    const toast = useRef(null)
    const [selectedBancos, setSelectedBancos] = useState([]);
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
    const larguraBase = [30, 40, 20, 10];
    
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
        if (selected && Array.isArray(selected) && selected.length > 0 && bancos) {
            const bancosSelecionados = bancos.filter(banco => selected.includes(banco.id));
            setSelectedBancos(bancosSelecionados);
        } else {
            setSelectedBancos([]);
        }
    }, [selected, bancos]);

    // Auto-selecionar primeiro banco se não houver seleção
    useEffect(() => {
        if (bancos && bancos.length > 0 && !selectedBanco && onSelectionChange) {
            setSelectedBanco(bancos[0]);
            onSelectionChange(bancos[0]);
        }
    }, [bancos, selectedBanco, onSelectionChange]);

    // Sincronizar bancoSelecionado com o estado interno
    useEffect(() => {
        if (bancoSelecionado) {
            setSelectedBanco(bancoSelecionado);
        }
    }, [bancoSelecionado]);

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
        
        setSelectedBanco(e.value);
        if (onSelectionChange) {
            onSelectionChange(e.value);
        }
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedBanco(value); // Atualiza o estado
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

    const representativeNomeCompletoTemplate = (rowData) => {
        return (
            <div style={{ 
                maxWidth: '300px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
            }}>
                {rowData.nome_completo || '-'}
            </div>
        )
    };

    const representativeIdIspbTemplate = (rowData) => {
        return rowData.id_ispb || '-';
    };

    const excluirBanco = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este banco?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/bancos/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Banco excluído com sucesso',
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
                        detail: 'Não foi possível excluir o banco',
                        life: 3000
                    });
                    console.error('Erro ao excluir banco:', error);
                });
            },
            reject: () => {}
        });
    };

    // Função para editar banco
    const editarBancoClick = (banco) => {
        setSelectedBanco(banco);
        setModalOpened(true);
    };

    // Função para salvar edição do banco
    const editarBanco = (data, id) => {
        http.put(`/bancos/${id}/?format=json`, data)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Banco atualizado com sucesso',
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
                    detail: 'Não foi possível atualizar o banco',
                    life: 3000
                });
                console.error('Erro ao atualizar banco:', error);
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
                {ArmazenadorToken.hasPermission('change_banco') && (
                <FaPen 
                    className="edit" 
                    data-pr-tooltip="Editar Banco" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEditClick) {
                            onEditClick(rowData);
                        } else {
                            editarBancoClick(rowData);
                        }
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
                )}
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('delete_banco') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Banco" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClick) {
                                onDeleteClick(rowData);
                            } else {
                                excluirBanco(rowData.id);
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
                    <Texto size={'18px'} weight={600}>Bancos</Texto>
                    {/* {onAddClick && (
                        <Botao aoClicar={onAddClick} estilo="neutro" size="small" tab>
                            <GrAddCircle /> {t('add')} Banco
                        </Botao>
                    )} */}
                    <BotaoGrupo align="end">
                        <CampoTexto  
                            width={'80px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar bancos" 
                        />
                    </BotaoGrupo>
                </BotaoGrupo>
                {/* {showSearch && ( */}
                {/* )} */}
            </TableHeader>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog  />
            
            <DataTable 
                key={`${JSON.stringify(integracaoStates)}-${bulkIntegrationMode}`}
                value={bancos} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} bancos"
                emptyMessage="Não foram encontrados bancos" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedBancos : selectedBanco)} 
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
                rowClassName={(data) => data === selectedBanco ? 'p-highlight' : ''}
                header={headerTemplate}
                showGridlines
                stripedRows
            >
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[0]}%` }}></Column>
                )}
                <Column field="nome" body={representativeNomeTemplate} header="Nome" style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column field="nome_completo" body={representativeNomeCompletoTemplate} header="Nome Completo" style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column field="id_ispb" body={representativeIdIspbTemplate} header="ID ISPB" style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
            </DataTable>
            <ModalEditarBanco aoSalvar={editarBanco} banco={selectedBanco} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableBancos
