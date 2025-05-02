import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import ContainerHorizontal from '@components/ContainerHorizontal';
import CustomImage from '@components/CustomImage';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import Botao from '@components/Botao';
import styled from 'styled-components';
import { GrAddCircle } from 'react-icons/gr';
import BotaoSemBorda from '@components/BotaoSemBorda';
import BotaoGrupo from '@components/BotaoGrupo';
import { useTranslation } from 'react-i18next';
import SwitchInput from '@components/SwitchInput';
import { Toast } from 'primereact/toast';
import http from '@http';

const TableHeader = styled.div`
    display: flex;
    padding: 0.5rem 0;
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

const StatusTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    
    ${props => props.$status === true ? `
        background-color: rgba(0, 200, 83, 0.1);
        color: var(--success);
    ` : `
        background-color: rgba(229, 115, 115, 0.1);
        color: var(--error);
    `}
`;

function DataTableOperadoras({ operadoras, search = true, onSelectionChange, onAddClick }) {
    const[selectedOperadora, setSelectedOperadora] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [operadorasStatus, setOperadorasStatus] = useState({});
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const toast = useRef(null);
    const navegar = useNavigate();
    const { t } = useTranslation('common');

    useEffect(() => {
        if (operadoras && operadoras.length > 0) {
            if (!selectedOperadora) {
                setSelectedOperadora(operadoras[0]);
                onSelectionChange(operadoras[0]);
            }
            
            // Inicializa todas as operadoras como ativas
            setOperadorasStatus(
                operadoras.reduce((acc, operadora) => ({
                    ...acc,
                    [operadora.id]: true
                }), {})
            );
        }
    }, [operadoras, selectedOperadora, onSelectionChange]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleSelectionChange = (e) => {
        if (e.value === null) {
            return;
        }
        
        setSelectedOperadora(e.value);
        onSelectionChange(e.value);
    };

    const atualizarStatus = async (id, novoStatus) => {
        try {
            // Atualiza o estado local imediatamente para feedback instantâneo
            setOperadorasStatus(prev => ({
                ...prev,
                [id]: novoStatus
            }));

            // Chamada à API
            await http.put(`operadora/${id}/status`, {
                status: novoStatus ? 'A' : 'I'
            });

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Operadora ${novoStatus ? 'ativada' : 'desativada'} com sucesso`,
                life: 3000
            });
        } catch (error) {
            // Reverte o estado em caso de erro
            setOperadorasStatus(prev => ({
                ...prev,
                [id]: !novoStatus
            }));

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível alterar o status da operadora',
                life: 3000
            });
            console.error('Erro ao atualizar status:', error);
        }
    };

    const representativeNomeTemplate = (rowData) => {
        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <CustomImage src={rowData?.imagem_url} alt={rowData?.nome} width={'70px'} height={35} size={90} title={rowData?.nome} />
                <Texto size={16} weight={500}>{rowData?.nome}</Texto>
            </div>
        )
    };

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ 
                display: 'flex', 
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <StatusTag $status={operadorasStatus[rowData.id]}>
                        {operadorasStatus[rowData.id] ? "Ativo" : "Inativo"}
                    </StatusTag>
                    <SwitchInput
                        checked={operadorasStatus[rowData.id]}
                        onChange={(e) => {
                            atualizarStatus(rowData.id, e.value);
                        }}
                        style={{ width: '36px' }}
                    />
                </div>
            </div>
        );
    };

    const headerTemplate = () => {
        return (
            <TableHeader>
                <BotaoGrupo align="space-between">
                    <Texto size={18} weight={500}>Operadoras</Texto>
                    <Botao aoClicar={onAddClick} estilo="neutro" size="small" tab>
                        <GrAddCircle /> {t('add')} Operadora
                    </Botao>
                </BotaoGrupo>
                {search && (
                    <CampoTexto  
                        width={'200px'} 
                        valor={globalFilterValue} 
                        setValor={onGlobalFilterChange} 
                        type="search" 
                        label="" 
                        placeholder="Buscar" 
                    />
                )}
            </TableHeader>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={operadoras} 
                filters={filters} 
                globalFilterFields={['nome']} 
                emptyMessage="Não foram encontradas operadoras" 
                paginator 
                rows={10}
                selection={selectedOperadora} 
                onSelectionChange={handleSelectionChange}
                selectionMode="single"
                tableStyle={{ minWidth: '100%', maxWidth: '100%' }}
                rowClassName={(data) => data === selectedOperadora ? 'p-highlight' : ''}
                header={headerTemplate}
                showGridlines
                stripedRows
            >
                <Column 
                    body={representativeNomeTemplate} 
                    style={{ width: '70%' }}
                    field="nome"
                />
                <Column 
                    body={representativeActionsTemplate} 
                    header="" 
                    style={{ width: '30%' }}
                />
            </DataTable>
        </>
    );
}

export default DataTableOperadoras;