import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import http from '@http'
import { Toast } from 'primereact/toast'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ModalEditarFeriado from '../ModalEditarFeriado';
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
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Tag } from 'primereact/tag';

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

const TipoTag = styled(Tag)`
    font-size: 11px !important;
    padding: 2px 6px !important;
    font-weight: 500 !important;
`;

function DataTableFeriados({ 
    feriados, 
    calendario, // Esta prop já existe
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
    onReload
}) {

    const[selectedFeriado, setSelectedFeriado] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const [modalColaboradoresOpened, setModalColaboradoresOpened] = useState(false)
    const [selectedFeriadoColaboradores, setSelectedFeriadoColaboradores] = useState({})
    const toast = useRef(null)
    const [selectedFeriados, setSelectedFeriados] = useState([]);
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
    
    // Configuração de larguras das colunas - ajustadas para metade da tela
    const exibeColunasOpcionais = {
        checkbox: bulkIntegrationMode,
        integracao: ((metadadosDeveSerExibido || bulkIntegrationMode) && ArmazenadorToken.hasPermission('change_filial'))
    };
    
    // Larguras base otimizadas para Col7 (58.33% da tela)
    // Ordem: Nome, Tipo, Data, Hora Início, Hora Fim, Ações
    const larguraBase = [10, 120, 70, 80, 70, 70, 100];
    
    // Calcula larguras redistribuídas
    const calcularLarguras = () => {
        let larguras = [...larguraBase];
        let indicesRemover = [];

        if (!exibeColunasOpcionais.checkbox) {
            indicesRemover.push(0); // Remove checkbox
        }

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
        return adjustedIndex;
    };

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && feriados) {
            const feriadosSelecionados = feriados.filter(feriado => selected.includes(feriado.id));
            setSelectedFeriados(feriadosSelecionados);
        } else {
            setSelectedFeriados([]);
        }
    }, [selected, feriados]);

    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedFeriado(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }

    const representativeTipoTemplate = (rowData) => {
        let tipoTexto = '';
        let severity = 'info';
        
        switch (rowData.tipo) {
            case '1':
                tipoTexto = 'Nacional';
                severity = 'success';
                break;
            case '2':
                tipoTexto = 'Estadual';
                severity = 'warning';
                break;
            case '3':
                tipoTexto = 'Municipal';
                severity = 'info';
                break;
            default:
                tipoTexto = rowData.tipo;
                severity = 'secondary';
        }
        
        return <TipoTag value={tipoTexto} severity={severity} />;
    };

    const representativeDataTemplate = (rowData) => {
        // Se a data já vem formatada da API
        if (rowData.data.includes('/')) {
            return rowData.data;
        }
        // Se vem no formato ISO, corrigir o fuso horário
        const data = new Date(rowData.data + 'T00:00:00');
        return data.toLocaleDateString('pt-BR');
    };

    const representativeHoraTemplate = (rowData, field) => {
        const hora = rowData[field];
        if (!hora) return '-';
        
        // Se a hora tem segundos, remove os segundos para exibição mais limpa
        if (hora.includes(':')) {
            const partes = hora.split(':');
            return `${partes[0]}:${partes[1]}`;
        }
        
        return hora;
    };

    const representativeCalendarioTemplate = (rowData) => {
        return rowData.calendario_nome || '-';
    };

    const excluirFeriado = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este feriado?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/feriados/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Feriado excluído com sucesso',
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
                        detail: 'Não foi possível excluir o feriado',
                        life: 3000
                    });
                    console.error('Erro ao excluir feriado:', error);
                });
            },
            reject: () => {}
        });
    };

    // Função para editar feriado
    const editarFeriadoClick = (feriado) => {
        setSelectedFeriado(feriado);
        setModalOpened(true);
    };

    // Função para salvar edição do feriado
    const editarFeriado = (data, id) => {
        http.put(`/feriados/${id}/?format=json`, data)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Feriado atualizado com sucesso',
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
                    detail: 'Não foi possível atualizar o feriado',
                    life: 3000
                });
                console.error('Erro ao atualizar feriado:', error);
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
                {ArmazenadorToken.hasPermission('change_feriados') && (
                <FaPen 
                    className="edit" 
                    data-pr-tooltip="Editar Feriado" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEditClick) {
                            onEditClick(rowData);
                        } else {
                            editarFeriadoClick(rowData);
                        }
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
                )}
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                {ArmazenadorToken.hasPermission('delete_feriados') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Feriado" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClick) {
                                onDeleteClick(rowData);
                            } else {
                                excluirFeriado(rowData.id);
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
                    {calendario?.nome && (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Texto size={16} weight={500}>{calendario.nome}</Texto>
                        </div>
                    )}
                    {onAddClick && (
                        <Botao aoClicar={onAddClick} estilo="vermilion" size="small" tab>
                            <GrAddCircle /> Adicionar Feriado
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
                        placeholder="Buscar feriados" 
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
                value={feriados} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} feriados"
                emptyMessage="Não foram encontrados feriados" 
                selection={bulkIntegrationMode ? selectedForIntegration : (selected ? selectedFeriados : selectedFeriado)} 
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
                tableStyle={{ minWidth: '35vw' }}
                header={headerTemplate}
                showGridlines
                stripedRows
            >
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[getColumnIndex(0)]}%` }}></Column>
                )}
                <Column field="nome" header="Nome" style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column field="tipo" body={representativeTipoTemplate} header="Tipo" style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column field="data" body={representativeDataTemplate} header="Data" style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column field="horainicio" body={(rowData) => representativeHoraTemplate(rowData, 'horainicio')} header="Hora Início" style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
                <Column field="horafim" body={(rowData) => representativeHoraTemplate(rowData, 'horafim')} header="Hora Fim" style={{ width: `${largurasColunas[getColumnIndex(5)]}%` }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(6)]}%` }}></Column>
            </DataTable>
            <ModalEditarFeriado aoSalvar={editarFeriado} feriado={selectedFeriado} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableFeriados
