import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import CustomImage from '@components/CustomImage';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { GrAddCircle } from 'react-icons/gr';
import { RiDeleteBin6Line, RiEditBoxLine } from 'react-icons/ri';
import http from '@http'
import ModalContratos from '@components/ModalContratos'
import { Toast } from 'primereact/toast'
import { Real } from '@utils/formats'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import SwitchInput from '@components/SwitchInput';
import styled from 'styled-components';
import styles from "@pages/Contratos/Contratos.module.css"
import { FaPen } from 'react-icons/fa';

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

function DataTableContratos({ 
    contratos,
    paginator = true,
    rows,
    totalRecords,
    first,
    onPage,
    onSearch,
    onUpdate,
    onSort, 
    sortField, 
    sortOrder
}) {
    const [selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [modalOpened, setModalOpened] = useState(false)
    const [contratosStatus, setContratosStatus] = useState({});
    const toast = useRef(null)
    const navegar = useNavigate()
    const [contratoParaEditar, setContratoParaEditar] = useState(null);

    useEffect(() => {
        if (contratos?.length > 0) {
            const statusInicial = {};
            contratos.forEach(contrato => {
                statusInicial[contrato.id] = contrato.status === 'A';
            });
            setContratosStatus(statusInicial);
        }
    }, [contratos]);

    const editarContrato = (operadora, observacao, dt_inicio, dt_fim) => {
        if(!contratoParaEditar) return;

        const data = {
            operadora,
            observacao,
            dt_inicio,
            dt_fim
        };

        http.put(`contrato/${contratoParaEditar.id}/`, data)
            .then(response => {
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: 'Contrato atualizado com sucesso', 
                    life: 3000 
                });
                setModalOpened(false);
                setContratoParaEditar(null);
                if (onUpdate) {
                    onUpdate();
                }
            })
            .catch(erro => {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Erro ao atualizar contrato', 
                    life: 3000 
                });
            });
    };

    const abrirModalEdicao = (contrato) => {
        setContratoParaEditar(contrato);
        setModalOpened(true);
    };

    const atualizarStatus = async (id, novoStatus) => {
        try {
            setContratosStatus(prev => ({
                ...prev,
                [id]: novoStatus
            }));

            await http.put(`contrato/${id}/?format=json`, {
                status: novoStatus ? 'A' : 'I'
            });

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Contrato ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
                life: 3000
            });

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            setContratosStatus(prev => ({
                ...prev,
                [id]: !novoStatus
            }));

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível alterar o status do contrato',
                life: 3000
            });
            console.error('Erro ao atualizar status:', error);
        }
    };

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
    };

    function verDetalhes(value) {
        navegar(`/contratos/detalhes/${value.id}`)
    }

    const representativeInicioTemplate = (rowData) => {
        if(rowData.dt_inicio) {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_inicio).toLocaleDateString("pt-BR")}</p>
        } 
        return 'Não definida'
    }

    const representativeFimTemplate = (rowData) => {
        if(rowData.dt_fim) {
            return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_fim).toLocaleDateString("pt-BR")}</p>
        }
        return 'Não definida'
    }

    // const representativeFornecedorTemplate = (rowData) => {
    //     return <div key={rowData.id}>
    //         <Texto weight={700} width={'100%'}>
    //             {rowData?.dados_operadora?.nome}
    //         </Texto>
    //     </div>
    // }

    function representativSituacaoTemplate(rowData) {
        const status = rowData.status;
        if (rowData?.dt_fim) {
            let partesData = rowData.dt_fim.split('-');
            let dataFim = new Date(partesData[0], partesData[1] - 1, partesData[2]);
            
            let hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
    
            if (dataFim.getTime() < hoje.getTime()) {
                return <Tag severity="danger" value="Vencido"></Tag>;
            }
            if (dataFim.getFullYear() === hoje.getFullYear() && dataFim.getMonth() === hoje.getMonth()) {
                return <Tag severity="warning" value="Vencimento Próximo"></Tag>;
            }
            if(status == 'A') {
                return <Tag severity="info" value="Em andamento"></Tag>;
            }
            return <Tag severity="danger" value="Inativo"></Tag>;
        }
        return <Tag severity="neutral" value="A definir"></Tag>;
    }    
    
    function representativStatusTemplate(rowData) {
        let status = rowData?.status;
    
        switch (status) {
            case 'A':
                return <Tag severity="success" value="Ativo"></Tag>;
            case 'I':
                return <Tag severity="danger" value="Inativo"></Tag>;
            default:
                return status;
        }
    }    
    
    const representativeNomeTemplate = (rowData) => {
        if(rowData?.dados_operadora) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CustomImage 
                        src={rowData?.dados_operadora?.imagem_url} 
                        alt={rowData?.dados_operadora?.nome} 
                        width={'70px'} 
                        height={35} 
                        size={90} 
                        title={rowData?.dados_operadora?.nome} 
                    />
                    <div style={{ alignItems: 'center', gap: '10px' }}>
                        <Texto weight={700} width={'100%'}>
                            {rowData?.dados_operadora?.nome}
                        </Texto>
                        <Texto weight={300} width={'100%'}>
                            {rowData?.num_contrato_origem}
                        </Texto>
                    </div>
                </div>
            )
        }
        return '';
    }
    
    const representativeBeneficioRegraElegibilidadeTemplate = (rowData) => {
        if (!rowData.beneficios || rowData.beneficios.length === 0) return '0/0';
        let totalItens = 0;
        let itensComRegra = 0;
        rowData.beneficios.forEach(beneficio => {
            totalItens += 1;
            itensComRegra += (beneficio.regra_elegibilidade_pai.length > 0);

        });
        const texto = `${itensComRegra}/${totalItens}`;
        return (
            <>
            
            <Tooltip target=".setting" mouseTrack mouseTrackLeft={10} />
            <span className="setting" data-pr-tooltip="Elegibilidades Configuradas" style={{ cursor: 'help' }}>{texto}</span>
            </>
        );
    };

    const representativeRegraElegibilidadeTemplate = (rowData) => {
        if (!rowData.beneficios || rowData.beneficios.length === 0) return '0/0';
        let totalItens = 0;
        let itensComRegra = 0;
        rowData.beneficios.forEach(beneficio => {
            if (beneficio.itens && beneficio.itens.length > 0) {
                totalItens += beneficio.itens.length;
                itensComRegra += beneficio.itens.filter(item => Array.isArray(item.regra_elegibilidade) && item.regra_elegibilidade.length > 0).length;
            }
        });
        const texto = `${itensComRegra}/${totalItens}`;
        return (
            <>
            
            <Tooltip target=".setting" mouseTrack mouseTrackLeft={10} />
            <span className="setting" data-pr-tooltip="Elegibilidades Configuradas" style={{ cursor: 'help' }}>{texto}</span>
            </>
        );
    };

    const salvarContrato = (operadora, observacao, dt_inicio, dt_fim, num_contrato_origem) => {
        if(operadora == '' || dt_inicio == '' || num_contrato_origem == '') {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos obrigatórios', life: 3000 });
            return;
        }

        const data = {
            operadora,
            observacao,
            dt_inicio,
            dt_fim,
            num_contrato_origem
        };

        // Se tiver contratoParaEditar, faz PUT, senão faz POST
        const method = contratoParaEditar ? 'put' : 'post';
        const url = contratoParaEditar ? `contrato/${contratoParaEditar.id}/` : 'contrato/';
        const successMessage = contratoParaEditar ? 'Contrato atualizado com sucesso' : 'Contrato criado com sucesso';
        const errorMessage = contratoParaEditar ? 'Erro ao atualizar contrato' : 'Erro ao criar contrato';

        http[method](url, data)
            .then(response => {
                if(response.id || response.success) {
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: successMessage, 
                        life: 3000 
                    });
                    setModalOpened(false);
                    setContratoParaEditar(null);
                    if (onUpdate) {
                        onUpdate();
                    }
                }
            })
            .catch(erro => {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: errorMessage, 
                    life: 3000 
                });
            });
    };
    
    const excluirContrato = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este contrato?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/contrato/${id}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Contrato excluído com sucesso',
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
                        detail: 'Não foi possível excluir o contrato',
                        life: 3000
                    });
                    console.error('Erro ao excluir contrato:', error);
                });
            },
            reject: () => {}
        });
    }

    const representativeActionsTemplate = (rowData) => {
        const status = rowData.status === 'A';
        return (
            <div style={{ 
                display: 'flex', 
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'end'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <StatusTag $status={status}>
                        {status ? "Ativo" : "Inativo"}
                    </StatusTag>
                    <SwitchInput
                        checked={status}
                        onChange={() => {
                            atualizarStatus(rowData.id, !status);
                        }}
                        style={{ width: '36px' }}
                    />
                </div>
                <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                <FaPen
                    className="edit"
                    data-pr-tooltip="Editar Contrato"
                    size={16}
                    onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEdicao(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)',
                    }}
                />
                <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                <RiDeleteBin6Line 
                    className="delete" 
                    data-pr-tooltip="Excluir Contrato" 
                    size={16} 
                    onClick={(e) => {
                        if (rowData.delete_validation?.can_delete === false) return;
                        e.stopPropagation();
                        excluirContrato(rowData.id);
                    }}
                    style={{
                        cursor: rowData.delete_validation?.can_delete === false ? 'not-allowed' : 'pointer',
                        color: rowData.delete_validation?.can_delete === false ? '#ccc' : 'var(--error)',
                        opacity: rowData.delete_validation?.can_delete === false ? 0.5 : 1
                    }}
                    disabled={rowData.delete_validation?.can_delete === false}
                />
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
            <div className="flex justify-content-end">
                <Toast ref={toast} />
                <ConfirmDialog />
                <BotaoGrupo align="space-between">
                    <span className="p-input-icon-left">
                        <CampoTexto 
                            width={'320px'} 
                            valor={globalFilterValue} 
                            setValor={onGlobalFilterChange} 
                            type="search" 
                            label="" 
                            placeholder="Buscar contratos" 
                        />
                    </span>
                    <BotaoGrupo align="end">
                        <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                            <GrAddCircle className={styles.icon} stroke="var(--secundaria)"/> Criar Contrato
                        </Botao>
                    </BotaoGrupo>
                </BotaoGrupo>
            </div>
            <DataTable 
                value={contratos} 
                emptyMessage="Não foram encontrados contratos" 
                selection={selectedVaga} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator={paginator}
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                lazy
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                onSort={handleSort}
                removableSort 
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeNomeTemplate} header="Operadora" field="dados_operadora.nome" sortField="operadora" sortable style={{ width: '18%' }}></Column>
                <Column field="observacao" sortable sortField="observacao" header="Observação" style={{ width: '10%' }}></Column>
                {/* <Column field="num_contrato_origem" sortField="num_contrato_origem" sortable header="Número Contrato" style={{ width: '10%' }}></Column> */}
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column body={representativeFimTemplate} field="dt_fim" header="Data Fim" style={{ width: '10%' }}></Column>
                <Column body={representativSituacaoTemplate} header="Situação" style={{ width: '10%' }}></Column>
                <Column body={representativeBeneficioRegraElegibilidadeTemplate} header="Benefícios com Regras" style={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={representativeRegraElegibilidadeTemplate} header="Itens com Regras" style={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={representativeActionsTemplate} header="" style={{ width: '20%', textAlign: 'center' }}></Column>
            </DataTable>
            
            <ModalContratos 
                aoSalvar={salvarContrato}
                opened={modalOpened} 
                aoFechar={() => {
                    setModalOpened(false);
                    setContratoParaEditar(null);
                }}
                contrato={contratoParaEditar}
            />
        </>
    )
}

export default DataTableContratos