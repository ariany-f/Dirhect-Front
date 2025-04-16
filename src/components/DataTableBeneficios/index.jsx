import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css';
import QuestionCard from '@components/QuestionCard';
import BadgeGeral from '@components/BadgeGeral';
import CampoTexto from '@components/CampoTexto';
import http from '@http';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { Tag } from 'primereact/tag';
import IconeBeneficio from '@components/IconeBeneficio';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast';
import { FaTrash } from 'react-icons/fa';
import tiposBeneficio from '@json/tipos_beneficio.json';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableBeneficios({ beneficios, onBeneficioDeleted }) {
    const navegar = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    // Cria um objeto de mapeamento de tipos a partir do JSON importado
    const tipos = tiposBeneficio.reduce((acc, tipo) => {
        acc[tipo.code] = tipo.nome;
        return acc;
    }, {});

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    
    function verDetalhes(value) {
        navegar(`/beneficio/detalhes/${value.id}`);
    }

    const excluirBeneficio = (beneficioId) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este benefício?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/api/beneficios/${beneficioId}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Benefício excluído com sucesso',
                        life: 3000
                    });
                    
                    if (onBeneficioDeleted) {
                        onBeneficioDeleted();
                    }
                })
                .catch(error => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível excluir o benefício',
                        life: 3000
                    });
                    console.error('Erro ao excluir benefício:', error);
                });
            },
            reject: () => {

            },
        });
    };

    const representativeStatusTemplate = (rowData) => {
        return tipos[rowData.tipo] || rowData.tipo; // Retorna o nome do tipo ou o código se não encontrado
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <BadgeGeral nomeBeneficio={rowData.descricao} iconeBeneficio={<IconeBeneficio nomeIcone={rowData?.icone ?? rowData?.descricao}/>} />
        );
    };

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        excluirBeneficio(rowData.id);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--erro)'
                    }}
                >
                    <FaTrash size={16} />
                </button>
            </div>
        );
    };

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toast} />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span className="p-input-icon-left">
                    <CampoTexto  
                        width={'320px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Digite um nome de pedido" 
                    />
                </span>
                <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                    <p style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona esses benefícios?</p>
                </QuestionCard>
            </div>
            
            <DataTable 
                value={beneficios} 
                filters={filters} 
                globalFilterFields={['descricao']} 
                emptyMessage="Não foram encontradas recargas" 
                paginator 
                rows={7}
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                tableStyle={{ minWidth: '65vw' }}
            >
                <Column body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '20%' }}></Column>
                <Column body={representativeStatusTemplate} header="Tipo" style={{ width: '60%' }}></Column>
                <Column 
                    body={representativeActionsTemplate} 
                    header="Ações" 
                    style={{ width: '20%', textAlign: 'center' }}
                ></Column>
            </DataTable>
        </>
    );
}

export default DataTableBeneficios;