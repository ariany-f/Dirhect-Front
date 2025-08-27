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
import { InputSwitch } from 'primereact/inputswitch';
import http from '@http';
import { ArmazenadorToken } from '@utils';
import { useMetadadosPermission } from '@hooks/useMetadadosPermission';

const NumeroColaboradores = styled.p`
    color: var(--base-black);
    font-feature-settings: 'clig' off, 'liga' off;
    /* Dashboard/14px/Bold */
    font-family: var(--fonte-secundaria);
    font-size: 14px;
    font-weight: 700;
    line-height: 20px; /* 142.857% */
`

function DataTableFuncoes({ funcoes, showSearch = true, paginator = true, rows = 10, totalRecords, totalPages, first, onPage, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort }) {
   
    const[selectedFuncao, setSelectedFuncao] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [selectedFuncaos, setSelectedFuncaos] = useState([]);
    const navegar = useNavigate()
    const toast = useRef(null);
    const [integracaoStates, setIntegracaoStates] = useState({});
    const { metadadosDeveSerExibido } = useMetadadosPermission();

    useEffect(() => {
        if (selected && Array.isArray(selected) && selected.length > 0 && funcoes) {
            const funcoesSelecionados = funcoes.filter(cargo => selected.includes(cargo.id));
            setSelectedFuncaos(funcoesSelecionados);
        } else {
            setSelectedFuncaos([]);
        }
    }, [selected, funcoes]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value)
    {
        setSelectedFuncao(value.public_id)
    }
    
    function handleSelectChange(e) {
        if (selected) {
            let selectedValue = e.value;
            let newSelection = [...selectedFuncaos];

            if (Array.isArray(selectedValue)) {
                setSelectedFuncaos(selectedValue);
                setSelected(selectedValue.map(cargo => cargo.id)); // Mantém os IDs no estado global
            } else {
                if (newSelection.some(cargo => cargo.id === selectedValue.id)) {
                    newSelection = newSelection.filter(cargo => cargo.id !== selectedValue.id);
                } else {
                    newSelection.push(selectedValue);
                }
                setSelectedFuncaos(newSelection);
                setSelected(newSelection.map(cargo => cargo.id));
            }
        } else {
            setSelectedFuncao(e.value.id);
            verDetalhes(e.value);
        }
    }

    const representativeCargoTemplate = (rowData) => {
        if(rowData?.cargo && rowData?.cargo.nome) {
            return (
                <p>{rowData?.cargo.nome}</p>
            )
        }
        else {
            if(rowData?.cargo_origem_id){
                return <p>{rowData?.cargo_origem_id}</p>
            }
            
            return <p>Não informado</p>
        }
    }

    const representativeDetalhesTemplate = (rowData) => {
        if(rowData?.descricao) {
            // Garante que o texto não passe de 100 caracteres
            const descricaoLimitada = rowData?.descricao.length > 100 
                ? rowData?.descricao.substring(0, 170) + "..." 
                : rowData?.descricao;
        
            return (
                <p style={{
                    width: '100%',  // Define uma largura fixa
                    wordWrap: 'break-word', // Permite quebra de linha
                    overflow: 'hidden' // Garante que o conteúdo fique dentro do limite
                }}>
                    {descricaoLimitada}
                </p>
            );
        }
        else {
            return <p>Não informado</p>;
        }
    };    

    const excluirFuncao = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta função?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/funcao/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Função excluída com sucesso',
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
                        detail: 'Não foi possível excluir a função',
                        life: 3000
                    });
                    console.error('Erro ao excluir função:', error);
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
        
        http.put(`funcao/${id}/`, { integracao })
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

    const representativeIntegracaoTemplate = (rowData) => {
        // Usar o estado local se disponível, senão usar o valor original
        const integracaoValue = integracaoStates[rowData.id] !== undefined 
            ? integracaoStates[rowData.id] 
            : (rowData.integracao || false);
            
        return (
            <InputSwitch
                checked={integracaoValue}
                onChange={(e) => atualizarIntegracao(rowData.id, e.value)}
                tooltip={integracaoValue ? 'Integração ativa' : 'Integração inativa'}
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
                {ArmazenadorToken.hasPermission('delete_funcao') && (
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Função" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirFuncao(rowData.id);
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
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar função" />
                    </span>
                </div>
            }
            <DataTable 
                key={JSON.stringify(integracaoStates)}
                value={funcoes} 
                emptyMessage="Não foram encontrados funcoes" 
                selection={selected ? selectedFuncaos : selectedFuncao} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
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
                {selected &&
                    <Column selectionMode="multiple" style={{ width: '5%' }}></Column>
                }
                <Column field="id" header="Id" sortable style={{ width: '10%' }}></Column>
                <Column field="funcao_origem_id" header="Código" sortable style={{ width: '10%' }}></Column>
                <Column field="nome" header="Nome" sortable style={{ width: '20%' }}></Column>
                <Column field="cargo" header="Cargo" sortable style={{ width: '15%' }} body={representativeCargoTemplate}></Column>
                <Column body={representativeDetalhesTemplate} field="descricao" header="Descrição" sortable style={{ width: metadadosDeveSerExibido ? '30%' : '45%' }}></Column>
                {metadadosDeveSerExibido && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: '15%' }}></Column>
                )}
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFuncoes