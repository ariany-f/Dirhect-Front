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
import { FaPencil } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

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

function DataTableOperadoras({ operadoras, search = true, onSelectionChange, onAddClick, onEditClick, onDeleteClick, onUpdate }) {
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
            // Inicializa status de acordo com o campo ativo
            setOperadorasStatus(
                operadoras.reduce((acc, operadora) => ({
                    ...acc,
                    [operadora.id]: operadora.ativo === true
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

    const atualizarStatus = async (id) => {
        try {
            const operadora = operadoras.find(op => op.id === id);
            const novoStatus = !operadora.ativo;

            // Chamada à API com o novo status
            const response = await http.put(`operadora/${id}/`, {
                ativo: novoStatus
            });

            // Atualiza o estado da operadora no array usando a resposta
            const operadorasAtualizadas = operadoras.map(op => 
                op.id === id ? response : op
            );
            onSelectionChange(operadorasAtualizadas);

            // Recarrega os dados
            if (onUpdate) {
                onUpdate();
            }

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Operadora ${response.ativo ? 'ativada' : 'desativada'} com sucesso`,
                life: 3000
            });
        } catch (error) {
            // Reverte o estado em caso de erro
            const operadora = operadoras.find(op => op.id === id);
            setOperadorasStatus(prev => ({
                ...prev,
                [id]: operadora.ativo
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
        const statusAtual = operadorasStatus[rowData.id] ?? rowData.ativo;
        
        return (
            <div style={{ 
                display: 'flex', 
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <StatusTag $status={statusAtual}>
                    {statusAtual ? "Ativo" : "Inativo"}
                </StatusTag>
                <SwitchInput
                    checked={statusAtual}
                    onChange={() => {
                        atualizarStatus(rowData.id);
                    }}
                    style={{ width: '36px' }}
                />
                <Tooltip target={`.edit-operadora-${rowData.id}`} mouseTrack mouseTrackLeft={10} />
                <FaPencil
                    className={`edit edit-operadora-${rowData.id}`}
                    data-pr-tooltip="Editar Operadora"
                    size={16}
                    onClick={e => { onEditClick(rowData); }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />
                <Tooltip target={`.delete-operadora-${rowData.id}`} mouseTrack mouseTrackLeft={10} />
                <RiDeleteBin6Line
                    className={`delete delete-operadora-${rowData.id}`}
                    data-pr-tooltip="Excluir Operadora"
                    size={16}
                    onClick={e => { onDeleteClick(rowData); }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--error)'
                    }}
                />
            </div>
        );
    };

    const headerTemplate = () => {
        return (
            <TableHeader>
                <BotaoGrupo align="space-between">
                    <Texto size={'18px'} weight={600}>Operadoras</Texto>
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
        <div style={{ width: '100%' }}>
            <Toast ref={toast} />
            <ConfirmDialog />
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
                tableStyle={{ minWidth: '35vw', maxWidth: '100%' }}
                rowClassName={(data) => data === selectedOperadora ? 'p-highlight' : ''}
                header={headerTemplate}
                showGridlines
                stripedRows
            >
                <Column 
                    body={representativeNomeTemplate} 
                    style={{ width: '50%' }}
                    field="nome"
                />
                <Column 
                    body={representativeActionsTemplate} 
                    style={{ width: '50%' }}
                />
            </DataTable>
        </div>
    );
}

export default DataTableOperadoras;