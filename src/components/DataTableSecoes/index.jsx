import styles from '@pages/Estrutura/Departamento.module.css'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import CampoTexto from '@components/CampoTexto';
import { Column } from 'primereact/column';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
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

function DataTableSecoes({ 
    secoes, 
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
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedSecoes, setSelectedSecoes] = useState([]);
    const [selectedSecao, setSelectedSecao] = useState(null);
    const navegar = useNavigate();
    const toast = useRef(null);
    const { metadadosDeveSerExibido } = useMetadadosPermission();

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
        return (
            <InputSwitch
                checked={rowData.integracao || false}
                onChange={(e) => atualizarIntegracao(rowData.id, e.value)}
                tooltip={rowData.integracao ? 'Integração ativa' : 'Integração inativa'}
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
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto 
                            width={'320px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar seções" 
                        />
                    </span>
                </div>
            }
            <DataTable 
                value={secoes} 
                emptyMessage="Não foram encontradas seções" 
                selection={selected ? selectedSecoes : selectedSecao} 
                onSelectionChange={handleSelectChange} 
                selectionMode={selected ? "checkbox" : "single"} 
                paginator={pagination} 
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
                <Column field="id_origem" header="Código" sortable style={{ width: '15%' }}></Column>
                <Column field="nome" header="Nome" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeFilialTemplate} field="departamento.filial.nome" sortField="filial" header="Filial" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeDepartamentoTemplate} field="departamento.nome" sortField="departamento" header="Departamento" sortable style={{ width: '15%' }}></Column>
                <Column field="descricao" header="Descrição" sortable style={{ width: metadadosDeveSerExibido ? '15%' : '30%' }}></Column>
                {metadadosDeveSerExibido && (
                    <Column body={representativeIntegracaoTemplate} header="Integração" style={{ width: '15%' }}></Column>
                )}
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableSecoes;