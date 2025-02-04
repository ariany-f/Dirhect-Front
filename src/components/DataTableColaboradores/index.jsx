import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useSessaoUsuarioContext } from '../../contexts/SessaoUsuario';

function DataTableColaboradores({ colaboradores }) {

    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedCollaborator(value)
        navegar(`/colaborador/detalhes/${value.id}`)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    
    const representativeCPFTemplate = (rowData) => {
    
        return (
            <b>{formataCPF(rowData?.dados_pessoa_fisica?.cpf)}</b>
        )
    }
    
    const representativeNomeTemplate = (rowData) => {
        
        return (
            <b>{rowData?.dados_pessoa_fisica?.nome}</b>
        )
    }

    const cm = useRef(null);
    const menuModel = (selectedCollaborator) => {
        if (!selectedCollaborator) return [];

        if(usuario.tipo == 'equipeFolhaPagamento')
        {

            return [
                { 
                    label: <b>Detalhes</b>, 
                    command: () => verDetalhes(selectedCollaborator) 
                },
                { 
                    label: <b>{'Demissão'}</b>, 
                    command: () => {
                        setModalOpened(true);  // Se status for 'pending', cancela a solicitação
                    }
                }
            ];
        }
        else
        {
            return [
                { 
                    label: <b>Detalhes</b>, 
                    command: () => verDetalhes(selectedCollaborator) 
                }
            ];
        }
    };

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                </span>
            </div>
            <ContextMenu model={menuModel(selectedCollaborator)} ref={cm} onHide={() => setSelectedCollaborator(null)} />
            <DataTable onContextMenu={(e) => {// Definindo o cartão selecionado ao clicar com o botão direito
                    setSelectedCollaborator(e.originalEvent.target.closest('tr').data); 
                    cm.current.show(e.originalEvent);
                }}
                contextMenuSelection={selectedCollaborator} value={colaboradores} filters={filters} globalFilterFields={['dados_pessoa_fisica.nome', 'dados_pessoa_fisica.cpf']}  emptyMessage="Não foram encontrados colaboradores" paginator rows={6} tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeNomeTemplate} header="Nome Completo" style={{ width: '35%' }}></Column>
                <Column body={representativeCPFTemplate} header="CPF" style={{ width: '20%' }}></Column>
                <Column header="" style={{ width: '10%' }} body={(rowData) => (
                    <button 
                        onClick={(e) => {
                            e.preventDefault();  // Evita o comportamento padrão do botão
                            setSelectedCollaborator(rowData);  // Define o cartão selecionado
                            cm.current.show(e);  // Exibe o menu de contexto
                        }} 
                        className="p-button black p-button-text p-button-plain p-button-icon-only"
                    >
                        <IoEllipsisVertical />
                    </button>
                )}></Column>
            </DataTable>
        </>
    )
}

export default DataTableColaboradores