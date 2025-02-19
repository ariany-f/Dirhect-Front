import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight, MdTag } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useSessaoUsuarioContext } from '../../contexts/SessaoUsuario';
import ModalDemissao from '../ModalDemissao';
import ModalFerias from '../ModalFerias';
import { Tag } from 'primereact/tag';

function DataTableColaboradores({ colaboradores }) {
    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [modalFeriasOpened, setModalFeriasOpened] = useState(false)
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

    const representativeNumeroDependentesTemplate = (rowData) => {
    
        return (
            <b>{rowData?.dependentes.length}</b>
        )
    }
    
    const representativeCPFTemplate = (rowData) => {
    
        return (
            <b>{formataCPF(rowData?.dados_pessoa_fisica?.cpf)}</b>
        )
    }
    
    // const representativeNomeTemplate = (rowData) => {
        
    //     return (
    //         <b>{rowData?.dados_pessoa_fisica?.nome}</b>
    //     )
    // }
    
    const representativeChapaTemplate = (rowData) => {
        
        return (
            <b>{rowData?.chapa}</b>
        )
    }
    
    const representativeDepartamentoTemplate = (rowData) => {
        
        return (
            <b>{rowData?.departamento}</b>
        )
    }
    
    const representativeAdmissaoTemplate = (rowData) => {
        
        return ( 
            rowData?.dt_admissao ?
            <b>{new Date(rowData?.dt_admissao).toLocaleDateString('pt-BR')}</b>
            : '---'
        )
    }
    
    const representativeNomeTemplate = (rowData) => {
        const cpf = rowData?.dados_pessoa_fisica?.cpf ?
        formataCPF(rowData?.dados_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }

    const representativSituacaoTemplate = (rowData) => {
        let situacao = rowData?.situacao;
        switch(rowData?.situacao)
        {
            case 'A':
                situacao = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'F':
                situacao = <Tag severity="primary" value="Férias"></Tag>;
                break;
            case 'P':
                situacao = <Tag severity="danger" value="Previdência"></Tag>;
                break;
            case 'I':
                situacao = <Tag severity="warning" value="Invalidez"></Tag>;
                break;
        }
        return (
            <b>{situacao}</b>
        )
    }


    const cm = useRef(null);
    const menuModel = (selectedCollaborator) => {
        if (!selectedCollaborator) return [];

        if(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento')
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
                },
                { 
                    label: <b>{'Férias'}</b>, 
                    command: () => {
                        setModalFeriasOpened(true);  // Se status for 'pending', cancela a solicitação
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
            <DataTable onContextMenu={(e) => {
                    cm.current.show(e.originalEvent);
                }}
                selection={selectedCollaborator} 
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                contextMenuSelection={selectedCollaborator} 
                value={colaboradores} 
                filters={filters} 
                globalFilterFields={['chapa', 'dados_pessoa_fisica.nome', 'dados_pessoa_fisica.cpf']} 
                emptyMessage="Não foram encontrados colaboradores" 
                paginator 
                removableSort 
                rows={6} 
                tableStyle={{ minWidth: '68vw' }}
                onContextMenuSelectionChange={(e) => {
                    setSelectedCollaborator(e.value); 
                    cm.current.show(e.originalEvent)}
                }
                >
                <Column body={representativeChapaTemplate} field="chapa" header="Chapa" sortable style={{ width: '10%' }}></Column>
                <Column body={representativeNomeTemplate} field="dados_pessoa_fisica.nome" header="Nome Completo" sortable style={{ width: '30%' }}></Column>
                <Column body={representativeDepartamentoTemplate} field="departamento" header="Departamento" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeAdmissaoTemplate} field="dt_admissao" header="Data de Admissão" sortable style={{ width: '15%' }}></Column>
                <Column body={representativSituacaoTemplate} field="situacao" header="Situação" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeNumeroDependentesTemplate} field="dependentes.length" header="Nº Dependentes" style={{ width: '12%' }}></Column>
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
            <ModalDemissao opened={modalOpened} aoFechar={() => setModalOpened(false)}/>
            <ModalFerias opened={modalFeriasOpened} aoFechar={() => setModalFeriasOpened(false)}/>
        </>
    )
}

export default DataTableColaboradores