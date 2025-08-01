import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoArquivo from '@components/CampoArquivo';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CheckboxContainer from '@components/CheckboxContainer'
import { Real } from '@utils/formats'
import { Button } from 'primereact/button';
import { FaLink, FaArrowUp, FaArrowDown, FaCircle, FaCheck, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { RiExchangeFill } from 'react-icons/ri';
import { Tag } from 'primereact/tag';
import http from '@http';
import { Toast } from 'primereact/toast';
import { MdFilterAltOff } from 'react-icons/md';
import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import ModalHistoricoTarefa from '@components/ModalHistoricoTarefa';

function DataTableTarefasDetalhes({ tarefas, objeto = null }) {
    const toast = useRef(null);
    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sla: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: 'custom' }
    })
    const [showHistorico, setShowHistorico] = useState(false);
    const [selectedTarefa, setSelectedTarefa] = useState(null);
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const representativePrazoTemplate = (rowData) => {
        return (
            rowData.agendado_para ? new Date(rowData.agendado_para).toLocaleDateString('pt-BR') : '-'
        )
    }

    const handleRowClick = (e) => {
        if(objeto)
        {
            if(objeto?.funcionario_detalhe?.id) {
                navegar(`/colaborador/detalhes/${objeto.funcionario_detalhe.id}`);
            } else if(objeto?.dados_candidato?.id) {
                navegar(`/admissao/registro/${objeto.id}`);
            }
        }
    };

    const handleHistorico = (e, rowData) => {
        e.stopPropagation();
        setSelectedTarefa(rowData);
        setShowHistorico(true);
    };

    const representativeCheckTemplate = (rowData) => {
        if (rowData.atividade_automatica) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--info)',
                    color: 'white'
                }}>
                    <RiExchangeFill size={20} fill="white" />
                </div>
            );
        }
        
        const handleChange = async (checked) => {
            if(rowData.status === 'em_andamento') {
                try {
                    await http.post(`/tarefas/${rowData.id}/concluir/`);
                    rowData.status = 'concluida';
                    rowData.status_display = 'Concluída';
                    rowData.check = true;
                    toast.current.show({
                        severity: 'success',
                        summary: 'Tarefa concluída com sucesso',
                        life: 3000
                    });
                } catch (error) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro ao concluir tarefa',
                        life: 3000
                    });
                }
            } else {
                if(rowData.status === 'pendente') {
                    try {
                        await http.post(`/tarefas/${rowData.id}/aprovar/`);
                        rowData.status = 'aprovada';
                        rowData.status_display = 'Aprovada';
                        rowData.check = true;
                        toast.current.show({
                            severity: 'success',
                            summary: 'Tarefa concluída com sucesso',
                            life: 3000
                        });
                    } catch (error) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro ao concluir tarefa',
                            life: 3000
                        });
                    }
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Tarefa não pode ser concluída',
                        life: 3000
                    });
                }
            }
        };

        const getTooltipText = () => {
            if (rowData.status === 'concluida' || rowData.status === 'aprovada') {
                return null;
            }
            return rowData.status === 'pendente' ? 'Aprovar tarefa' : 'Concluir tarefa';
        };

        const getButtonText = () => {
            if (rowData.status === 'pendente') {
                return 'Aprovar';
            } else if (rowData.status === 'em_andamento') {
                return 'Concluir';
            }
            return '';
        };

        const getButtonSeverity = () => {
            if (rowData.status === 'pendente') {
                return 'success';
            } else if (rowData.status === 'em_andamento') {
                return 'info';
            }
            return 'secondary';
        };

        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                {(rowData.status === 'pendente' || rowData.status === 'em_andamento') && (
                    <div 
                        data-pr-tooltip={getTooltipText()}
                        data-pr-position="left"
                        className="tarefa-tooltip"
                        style={{ display: 'inline-flex' }}
                    >
                        <Button
                            label={getButtonText()}
                            severity={getButtonSeverity()}
                            size="small"
                            onClick={() => handleChange(true)}
                            style={{ 
                                fontSize: '12px', 
                                padding: '4px 12px',
                                height: '28px'
                            }}
                        />
                    </div>
                )}
                {(rowData.status === 'concluida' || rowData.status === 'aprovada') && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--green-500)',
                        color: 'white'
                    }}>
                        <FaCheckCircle size={20} fill="white" />
                    </div>
                )}
                <Tooltip target=".tarefa-tooltip" />
            </div>
        );
    };

    // Filtro customizado para situação
    const statusFilterTemplate = (options) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 5px', borderRadius: '4px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <CheckboxContainer 
                        name="status-nao-concluido"
                        valor={options.value === 'nao_concluido'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'nao_concluido' : null);
                        }}
                    />
                    <label htmlFor="status-nao-concluido" className="cursor-pointer">Em aberto</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <CheckboxContainer 
                        name="status-concluido"
                        valor={options.value === 'concluido'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'concluido' : null);
                        }}
                    />
                    <label htmlFor="status-concluido" className="cursor-pointer">Concluído</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <CheckboxContainer 
                        name="status-todos"
                        valor={options.value === 'todos'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'todos' : null);
                        }}
                    />
                    <label htmlFor="status-todos" className="cursor-pointer">Todos</label>
                </div>
            </div>
        );
    };

    const filterClearTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterClearCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--surface-600)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <MdFilterAltOff fill="var(--white)" />
            </button>
        );
    };

    const filterApplyTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterApplyCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--green-500)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FaCheck fill="var(--white)" />
            </button>
        );
    };

    const representativeStatusTemplate = (rowData) => {
        const getStatusInfo = (status) => {
            switch(status) {
                case 'concluida':
                    return { 
                        cor: '#28a745', 
                        texto: 'Concluída',
                        background: '#e8f5e9',
                        icon: null
                    };
                case 'em_andamento':
                    return { 
                        cor: '#ffa000', 
                        texto: 'Em andamento',
                        background: '#fff8e1',
                        icon: null
                    };
                case 'aprovada':
                    return { 
                        cor: '#1a73e8', 
                        texto: 'Aprovada',
                        background: '#e8f0fe',
                        icon: null
                    };
                case 'pendente':
                    return { 
                        cor: '#dc3545', 
                        texto: 'Pendente',
                        background: '#fff5f5',
                        icon: null
                    };
                case 'erro':
                    return { 
                        cor: '#dc3545', 
                        texto: 'Erro',
                        background: '#ffe0e0',
                        icon: null
                    };
                default:
                    return { 
                        cor: '#666', 
                        texto: rowData.status_display || 'Indefinido',
                        background: '#f4f4f4',
                        icon: null
                    };
            }
        };
        const { cor, texto, background } = getStatusInfo(rowData.status);
        const logs = rowData.logs || [];
        const temErro = logs.some(log => !log.sucesso || log.tipo === 'erro');

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: background,
                    color: cor,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '400'
                }}>
                    {texto}
                </div>
                {logs.length > 0 && (
                    <FaHistory
                        className="history"
                        data-pr-tooltip={`Ver Histórico (${logs.length} log${logs.length > 1 ? 's' : ''})`}
                        size={16}
                        onClick={(e) => handleHistorico(e, rowData)}
                        style={{
                            cursor: 'pointer',
                            color: temErro ? 'var(--error)' : 'var(--primaria)',
                        }}
                    />
                )}
            </div>
        );
    };

    const representativePrioridadeTemplate = (rowData) => {
        const getPrioridadeInfo = (prioridade) => {
            switch(prioridade) {
                case 1:
                    return { 
                        cor: '#dc3545', 
                        texto: 'Alta', 
                        background: '#ffe0e0',
                        icon: FaArrowUp
                    };
                case 2:
                    return { 
                        cor: '#ffa000', 
                        texto: 'Média', 
                        background: '#fff8e1',
                        icon: FaCircle
                    };
                case 3:
                    return { 
                        cor: '#28a745', 
                        texto: 'Baixa', 
                        background: '#e8f5e9',
                        icon: FaArrowDown
                    };
                default:
                    return { 
                        cor: '#666', 
                        texto: 'Normal', 
                        background: '#f4f4f4',
                        icon: FaCircle
                    };
            }
        };
        const prioridade = rowData.prioridade;
        const { cor: IconCor, texto: IconTexto, background: IconBackground, icon: iconTipo } = getPrioridadeInfo(prioridade);
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {iconTipo && React.createElement(iconTipo, {
                    stroke: IconCor,
                    color: IconCor,
                    fill: IconCor,
                    style: { color: IconCor, fontSize: prioridade === 2 || prioridade === 0 ? 10 : 12 }
                })}
                <div style={{
                    backgroundColor: IconBackground,
                    color: IconCor,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '400'
                }}>
                    {IconTexto === 'Alta' ? <b style={{color: IconCor}}>{IconTexto}</b> : IconTexto}
                </div>
            </div>
        );
    };

    const representativeConcluidoEmTemplate = (rowData) => {
        return rowData.concluido_em ? new Date(rowData.concluido_em).toLocaleDateString('pt-BR') : '-';
    };
    
    const handleUpload = async (arquivoId, file) => {
        if (!file) return;
    };
    
    const representativeDescricaoTemplate = (rowData) => {
        return <Texto width="100%" weight={600}>{rowData.descricao}</Texto>;
    }


    
    // Ordena as tarefas por prioridade
    const tarefasOrdenadas = Array.isArray(tarefas) ? [...tarefas].sort((a, b) => a.prioridade - b.prioridade) : [];
    
    // SLA
    const getSLAInfo = (rowData) => {
        const dataInicio = new Date(rowData.criado_em);
        const dataAgendada = new Date(rowData.agendado_para);
        const hoje = new Date();
        if (rowData.status === 'concluida') {
            return 'concluido';
        }
        const diasAteEntrega = Math.ceil((dataAgendada - hoje) / (1000 * 60 * 60 * 24));
        if (diasAteEntrega >= 2) {
            return 'dentro_prazo';
        } else if (diasAteEntrega > 0) {
            return 'proximo_prazo';
        } else {
            return 'atrasado';
        }
    };

    const slaFilterTemplate = (options) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 5px', borderRadius: '4px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CheckboxContainer 
                        name="sla-todos"
                        valor={!options.value}
                        setValor={(checked) => {
                            options.filterCallback(checked ? null : options.value);
                        }}
                    />
                    <label htmlFor="sla-todos" className="cursor-pointer">Todos</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CheckboxContainer 
                        name="sla-dentro"
                        valor={options.value === 'dentro_prazo'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'dentro_prazo' : null);
                        }}
                    />
                    <label htmlFor="sla-dentro" className="cursor-pointer">Dentro do Prazo</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CheckboxContainer 
                        name="sla-proximo"
                        valor={options.value === 'proximo_prazo'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'proximo_prazo' : null);
                        }}
                    />
                    <label htmlFor="sla-proximo" className="cursor-pointer">Próximo do Prazo</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CheckboxContainer 
                        name="sla-atrasado"
                        valor={options.value === 'atrasado'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'atrasado' : null);
                        }}
                    />
                    <label htmlFor="sla-atrasado" className="cursor-pointer">Atrasado</label>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <CheckboxContainer 
                        name="sla-concluido"
                        valor={options.value === 'concluido'}
                        setValor={(checked) => {
                            options.filterCallback(checked ? 'concluido' : null);
                        }}
                    />
                    <label htmlFor="sla-concluido" className="cursor-pointer">Concluído</label>
                </div>
            </div>
        );
    };

    const representativeSLATemplate = (rowData) => {
        const dataInicio = new Date(rowData.criado_em);
        const dataAgendada = new Date(rowData.agendado_para);
        const hoje = new Date();
        const diasEmAberto = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        let cor = '';
        let texto = '';
        if (rowData.status === 'concluida') {
            cor = 'var(--green-500)';
            texto = 'Concluída';
        } else {
            const diasAteEntrega = Math.ceil((dataAgendada - hoje) / (1000 * 60 * 60 * 24));
            if (diasAteEntrega >= 2) {
                cor = 'var(--green-500)';
                texto = 'Dentro do prazo';
            } else if (diasAteEntrega > 0) {
                cor = '#ffa000';
                texto = 'Próximo do prazo';
            } else {
                cor = 'var(--error-600)';
                texto = 'Em atraso';
            }
        }
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cor,
                        boxShadow: `0 0 4px ${cor}`
                    }} />
                    <div style={{color: cor, fontWeight: 500}}>{texto}</div>
                </div>
                <div style={{fontSize: '12px', color: '#666'}}>{diasEmAberto} dia(s) em aberto</div>
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={tarefasOrdenadas} 
                filters={filters} 
                globalFilterFields={['funcionario']}  
                emptyMessage="Não foram encontrados tarefas" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
                onFilter={(e) => setFilters(e.filters)}
                onRowClick={handleRowClick}
                selectionMode={'single'}
            >
                <Column body={representativePrioridadeTemplate} field="prioridade" header="Prioridade" style={{ width: '10%' }}></Column>
                <Column body={representativeDescricaoTemplate} field="descricao" header="Descrição" style={{ width: '35%' }}></Column>
                <Column 
                    body={representativeStatusTemplate} 
                    field="status" 
                    header="Situação" 
                    style={{ width: '12%' }}
                    filter
                    filterField="status"
                    filterElement={statusFilterTemplate}
                    filterFunction={(rowData, filter) => {
                        if (!filter || filter === 'todos') return true;
                        if (filter === 'nao_concluido') {
                            return ['pendente', 'em_andamento', 'aprovada'].includes(rowData.status);
                        }
                        if (filter === 'concluido') return rowData.status === 'concluida';
                        return true;
                    }}
                    showFilterMenu={true}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                    filterMenuStyle={{ width: '14rem' }}
                    showFilterMatchModes={false}
                ></Column>
                <Column 
                    body={representativeSLATemplate} 
                    field="sla" 
                    header="SLA" 
                    style={{ width: '12%' }}
                    filter
                    filterField="sla"
                    filterElement={slaFilterTemplate}
                    filterFunction={(rowData, filter) => {
                        if (!filter) return true;
                        return getSLAInfo(rowData) === filter;
                    }}
                    showFilterMenu={true}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                    filterMenuStyle={{ width: '14rem' }}
                    showFilterMatchModes={false}
                ></Column>
                <Column body={representativeConcluidoEmTemplate} field="concluido_em" header="Concluído em" style={{ width: '15%' }}></Column>
                <Column body={representativeCheckTemplate} field="check" header="Ações" style={{ width: '15%' }}></Column>
            </DataTable>
            <Tooltip target=".history" mouseTrack mouseTrackLeft={10} />
            <ModalHistoricoTarefa 
                opened={showHistorico}
                aoFechar={() => setShowHistorico(false)}
                tarefa={selectedTarefa}
                logs={selectedTarefa ? selectedTarefa.logs || [] : []}
            />
        </>
    )
}

export default DataTableTarefasDetalhes