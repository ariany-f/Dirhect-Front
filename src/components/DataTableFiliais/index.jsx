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
import { ArmazenadorToken } from '@utils';

function DataTableFiliais({ filiais, showSearch = true, pagination = true, rows, totalRecords, first, onPage, totalPages, onSearch, selected = null, setSelected = () => { }, onUpdate, sortField, sortOrder, onSort }) {

    const[selectedFilial, setSelectedFilial] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const toast = useRef(null)
    const [selectedFiliais, setSelectedFiliais] = useState([]);

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
    
    useEffect(() => {
        console.log("Filial selecionada mudou:", selectedFilial);
    }, [selectedFilial]);

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

    
    const editarFilial = (nome, cnpj, id) => {

        // setLoading(true)
       
        const data = {};
        data.nome = nome;
        data.id = id;
        data.cnpj = removerMascaraCNPJ(cnpj);

        http.put(`filial/${id}/`, data)
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
        } else {
            if(e.value)
            {
                setSelectedFilial(e.value.id);
                verDetalhes(e.value);
            }
        }
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
            <ConfirmDialog />
            {showSearch && 
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar filiais" />
                    </span>
                </div>
            }
            <DataTable 
                value={filiais} 
                emptyMessage="Não foram encontradas filiais" 
                selection={selected ? selectedFiliais : selectedFilial} 
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
                <Column field="nome" header="Filial" sortable style={{ width: '25%' }}></Column>
                <Column field="cidade" header="Cidade" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeCNPJTemplate} field="cnpj" header="CNPJ" sortable style={{ width: '25%' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '10%' }}></Column>
            </DataTable>
            <ModalEditarFilial aoSalvar={editarFilial} filial={selectedFilial} aoSucesso={toast} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}
export default DataTableFiliais
