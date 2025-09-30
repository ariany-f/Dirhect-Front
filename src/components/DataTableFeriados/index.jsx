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

function DataTableFeriados({ feriados, showSearch = true, pagination = true, rows, totalRecords, first, onPage, totalPages, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort, onExportExcel, exportingExcel = false }) {

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

    // Configuração de larguras das colunas
    const exibeColunasOpcionais = {
        checkbox: bulkIntegrationMode,
        integracao: ((metadadosDeveSerExibido || bulkIntegrationMode) && ArmazenadorToken.hasPermission('change_filial'))
    };
    
    // Larguras base quando todas as colunas estão visíveis
    // Ordem: Nome, Tipo, Data, Hora Início, Hora Fim, Ações
    const larguraBase = [25, 10, 15, 20, 20, 10];
    
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
        onSearch(value);
    };

    const removerMascaraCNPJ = (cnpj) => {
        return cnpj.replace(/[^\d]/g, ''); // Remove tudo que não for número
    }

    function verDetalhes(value) {
        setSelectedFeriado(value); // Atualiza o estado
        setTimeout(() => setModalOpened(true), 0); // Aguarda a atualização do estado
    }

    const representativeDataTemplate = (rowData) => {
        return (
            <div>
                {new Date(rowData.data).toLocaleDateString('pt-BR')}
            </div>
        )
    }

    const representativeTipoTemplate = (rowData) => {
        let tipo = '';
        switch (rowData.tipo) {
            case '1':
                tipo = 'Nacional';
                break;
            case '2':
                tipo = 'Estadual';
                break;
            case '3':
                tipo = 'Municipal';
                break;
        }
        return (
            <div>
                {tipo}
            </div>
        )
    }

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
                        editarFeriadoClick(rowData);
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
                            excluirFeriado(rowData.id);
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
            
            <div style={{ display: 'flex', width: '100%', justifyContent: showSearch ? "space-between" : "flex-end", alignItems: 'center', marginBottom: '16px' }}>
                {showSearch && 
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar feriados" />
                    </span>
                }
            </div>
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
                tableStyle={{ minWidth: '68vw' }}
            >
                {exibeColunasOpcionais.checkbox && (
                    <Column selectionMode="multiple" style={{ width: `${largurasColunas[0]}%` }}></Column>
                )}
                <Column field="nome" header="Nome" style={{ width: `${largurasColunas[getColumnIndex(1)]}%` }}></Column>
                <Column field="tipo" body={representativeTipoTemplate} header="Tipo" style={{ width: `${largurasColunas[getColumnIndex(2)]}%` }}></Column>
                <Column field="data" body={representativeDataTemplate} header="Data" style={{ width: `${largurasColunas[getColumnIndex(3)]}%` }}></Column>
                <Column field="horainicio" header="Hora Início" style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
                <Column field="horafim" header="Hora Fim" style={{ width: `${largurasColunas[getColumnIndex(5)]}%` }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: `${largurasColunas[getColumnIndex(4)]}%` }}></Column>
            </DataTable>
            <ModalEditarFeriado aoSalvar={editarFeriado} feriado={selectedFeriado} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableFeriados
