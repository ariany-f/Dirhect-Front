import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator, FilterService } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight, MdFilterAltOff } from 'react-icons/md'
import { FaUserPlus, FaSignOutAlt, FaUmbrellaBeach, FaFileInvoiceDollar, FaTimes, FaCheck, FaUser } from 'react-icons/fa';
import { RiExchangeFill } from 'react-icons/ri';
import './DataTable.css'
import CampoArquivo from '@components/CampoArquivo';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CheckboxContainer from '@components/CheckboxContainer'
import CustomImage from '@components/CustomImage'
import { Real } from '@utils/formats'
import { Button } from 'primereact/button';
import { FaLink } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import http from '@http';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';

// Registra o filtro customizado para situação
FilterService.register('custom_status', (value, filter) => {
    if (filter === 'nao_concluido') {
        return ['pendente', 'em_andamento', 'aprovada'].includes(value);
    }
    if (filter === 'concluido') {
        return value === 'concluida';
    }
    return true;
});

function DataTableAtividades({ tarefas }) {
    const toast = useRef(null);
    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sla: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: 'nao_concluido', matchMode: FilterMatchMode.CUSTOM }
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onSLAFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['sla'].value = value;
        setFilters(_filters);
    };

    const representativePrazoTemplate = (rowData) => {
        return (
            <div>
                {rowData.agendado_para ? new Date(rowData.agendado_para).toLocaleDateString('pt-BR') : '-'}
                {rowData.concluido_em ? <div>
                   Conclusão: {new Date(rowData.concluido_em).toLocaleDateString('pt-BR')}
                </div> : null}
            </div>
        )
    }

    const handleRowClick = (e) => {
        const rowData = e.data;
        if(rowData.objeto?.funcionario_detalhe?.id) {
            navegar(`/colaborador/detalhes/${rowData.objeto.funcionario_detalhe.id}`);
        } else if(rowData.objeto?.dados_candidato?.id) {
            navegar(`/admissao/registro/${rowData?.entidade_id}`);
        }
    };

    const representativeCheckTemplate = (rowData) => {
        if (rowData.atividade_automatica) {
            return <RiExchangeFill size={18} fill="var(--info)" />;
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

        const getColaboradorTemplate = (rowData) => {
            if(rowData.objeto?.funcionario_detalhe?.id) {
                return (
                    <div 
                        className="colaborador-tooltip"
                        data-pr-tooltip='Ir para o colaborador'
                        data-pr-position="left"
                    >
                        <Link to={`/colaborador/detalhes/${rowData.objeto?.funcionario_detalhe?.id}`}>
                            <FaUser size={12} style={{marginLeft: '10px'}} />
                        </Link>
                        <Tooltip target=".colaborador-tooltip" />
                    </div>
                )
            }
            else if(rowData.objeto?.dados_candidato?.id) {
                return (
                    <div 
                        className="candidato-tooltip"
                        data-pr-tooltip='Ir para admissão'
                        data-pr-position="left"
                    >
                        <Link to={`/admissao/registro/${rowData?.entidade_id}`}>
                            <FaUserPlus size={14} style={{marginLeft: '10px'}} />
                        </Link>
                        <Tooltip target=".candidato-tooltip" />
                    </div>
                )
            } else {
                return null;
            }
        }
    
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div 
                    data-pr-tooltip={getTooltipText()}
                    data-pr-position="left"
                    className="tarefa-tooltip"
                    style={{ display: 'inline-flex' }}
                >
                    <CheckboxContainer 
                        name="feito" 
                        valor={rowData.status === 'concluida' || rowData.status === 'aprovada'} 
                        setValor={handleChange} 
                    />
                </div>
                <Tooltip target=".tarefa-tooltip" />
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

    const representativeStatusTemplate = (rowData) => {
        const getStatusInfo = (status) => {
            switch(status) {
                case 'concluida':
                    return { 
                        cor: '#28a745', 
                        texto: 'Concluída',
                        background: '#e8f5e9'
                    };
                case 'em_andamento':
                    return { 
                        cor: '#ffa000', 
                        texto: 'Em andamento',
                        background: '#fff8e1'
                    };
                case 'aprovada':
                    return { 
                        cor: '#1a73e8', 
                        texto: 'Aprovada',
                        background: '#e8f0fe'
                    };
                case 'pendente':
                    return { 
                        cor: '#dc3545', 
                        texto: 'Pendente',
                        background: '#fff5f5'
                    };
                default:
                    return { 
                        cor: '#666', 
                        texto: rowData.status_display || 'Indefinido',
                        background: '#f4f4f4'
                    };
            }
        };

        const { cor, texto, background } = getStatusInfo(rowData.status);

        return (
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
                        icon: 'pi pi-arrow-up'
                    };
                case 2:
                    return { 
                        cor: '#ffa000', 
                        texto: 'Média', 
                        background: '#fff8e1',
                        icon: 'circle'
                    };
                case 3:
                    return { 
                        cor: '#28a745', 
                        texto: 'Baixa', 
                        background: '#e8f5e9',
                        icon: 'pi pi-arrow-down'
                    };
                default:
                    return { 
                        cor: '#666', 
                        texto: 'Normal', 
                        background: '#f4f4f4',
                        icon: 'circle'
                    };
            }
        };

        const { cor, texto, background, icon } = getPrioridadeInfo(rowData.prioridade);

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon === 'circle' ? (
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: cor
                    }}></div>
                ) : (
                    <i className={icon} style={{ 
                        fontSize: '12px', 
                        color: cor,
                        width: '8px',
                        height: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}></i>
                )}
                <div style={{
                    backgroundColor: background,
                    color: cor,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '400'
                }}>
                    {texto == 'Alta' ? 
                        <b style={{color: cor}}>{texto}</b>
                    : texto}
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

    const representativeFilesTemplate = (rowData) => {
        return <CampoArquivo     
                onFileChange={(file) => handleUpload(rowData.id, file)}
                accept=".pdf, .jpg, .png"
                id={`arquivo`}
                name={`arquivo`}></CampoArquivo>
    }

    const representativeActionsTemplate = (rowData, _, rowIndex) => {
        if (rowData.descricao === 'Integrar com RM') {
            const anterioresConcluidas = tarefas.slice(0, rowIndex).every(t => t.check === true);
            return <Botao size="small" aoClicar={() => anterioresConcluidas && alert('Integração com RM!')} disabled={!anterioresConcluidas} estilo={anterioresConcluidas ? 'vermilion' : 'cinza'}>
                <FaLink fill="white" /> Integrar
            </Botao>;
        }
        return null;
    };
    
    const representativeDescricaoTemplate = (rowData) => {
        return <Texto width="100%" weight={600}>{rowData.descricao}</Texto>;
    }
    
    // Ordena as tarefas por prioridade
    const tarefasOrdenadas = Array.isArray(tarefas) ? [...tarefas].sort((a, b) => a.prioridade - b.prioridade) : [];
    
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

    const getTipoIcon = (tipo) => {
        switch(tipo) {
            case 'admissao': return <FaUserPlus fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'demissao': return <FaSignOutAlt fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'ferias': return <FaUmbrellaBeach fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'envio_variaveis': return <FaFileInvoiceDollar fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            default: return null;
        }
    };

    const formataCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeTipoTemplate = (rowData) => {
        let cor = '';
        let background = '';
        let texto = '';
        
        switch(rowData.entidade_tipo) {
            case 'admissao':
                background = '#1a73e8';
                cor = '#fff';
                texto = 'Admissão';
                break;
            case 'demissao':
                background = '#dc3545';
                cor = '#fff';
                texto = 'Rescisão';
                break;
            case 'ferias':
                background = '#ffa000';
                cor = '#fff';
                texto = 'Férias';
                break;
            case 'envio_variaveis':
                background = '#28a745';
                cor = '#fff';
                texto = 'Envio Variáveis';
                break;
            default:
                background = '#666';
                cor = '#fff';
                texto = rowData.entidade_display;
        }
        
        return (
            <div style={{
                backgroundColor: background,
                color: cor,
                padding: '4px 12px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '400'
            }}>
                {getTipoIcon(rowData.entidade_tipo)}
                {texto}
            </div>
        );
    };

    const representativeReferenciaTemplate = (rowData) => {
        if(rowData.objeto?.dados_candidato) {
            return <div key={rowData?.id || 'unknown'}>
            <Texto uppercase weight={700} width={'100%'}>
                {rowData.objeto.dados_candidato.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.dados_candidato?.cpf ? formataCPF(rowData?.objeto?.dados_candidato?.cpf) : '-'}</p>
            </div>
        </div>
        } else if(rowData.objeto?.funcionario_detalhe) {
            return <div key={rowData?.id || 'unknown'}>
            <Texto uppercase weight={700} width={'100%'}>
                {rowData.objeto.funcionario_detalhe.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.funcionario_detalhe?.cpf ? formataCPF(rowData?.objeto?.funcionario_detalhe?.cpf) : '-'}</p>
            </div>
        </div>;
        } else if(rowData.objeto?.dados_colaborador) {
            return <div key={rowData?.id || 'unknown'}>
                <Texto uppercase weight={700} width={'100%'}>
                    {rowData.objeto.dados_colaborador.nome}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                    CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.dados_colaborador?.cpf ? formataCPF(rowData?.objeto?.dados_colaborador?.cpf) : '-'}</p>
                </div>
            </div>;
        } else {
            return <Texto uppercase width="100%" weight={600}>---</Texto>;
        }
    }
    

    // Template para coluna do cliente
    const representativeClienteTemplate = (rowData) => {
        const [cliente, setCliente] = useState(null);

        useEffect(() => {
            if (rowData.tenant) {
                http.get(`/client_tenant/${rowData.tenant}/`)
                    .then(response => {
                        setCliente(response);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar dados do cliente:', error);
                    });
            }
        }, [rowData.tenant]);

        if (!cliente) {
            return (
                <>
                    <Tooltip target=".cliente" mouseTrack mouseTrackLeft={10} />
                    <div data-pr-tooltip="Carregando..." className="cliente">
                        <Skeleton shape="circle" size="24px" />
                    </div>
                </>
            );
        }

        return (
            <>
                <Tooltip target=".cliente" mouseTrack mouseTrackLeft={10} />
                <div data-pr-tooltip={cliente.nome || '-'} className="cliente">
                    <CustomImage src={cliente.simbolo} width={24} height={24} />
                </div>
            </>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={tarefasOrdenadas} 
                filters={filters} 
                globalFilterFields={['descricao', 'tipo_display']}  
                emptyMessage="Não foram encontradas tarefas" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
                filterDisplay="menu"
                showGridlines
                className="p-datatable-sm"
                onRowClick={handleRowClick}
                selectionMode={'single'}
            >
                <Column 
                    body={representativeTipoTemplate} 
                    field="tipo_display" 
                    header="Tipo de Processo" 
                    style={{ width: '12%' }}
                ></Column>
                <Column 
                    body={representativePrioridadeTemplate} 
                    sortable 
                    field="prioridade" 
                    header="Prioridade" 
                    style={{ width: '10%' }}
                ></Column>
                <Column
                    body={representativeClienteTemplate}
                    field="cliente"
                    header="Cliente"
                    style={{ width: '12%' }}
                ></Column>
                <Column 
                    body={representativeDescricaoTemplate} 
                    field="descricao" 
                    header="Descrição" 
                    style={{ width: '18%' }}
                ></Column>
                <Column 
                    body={representativePrazoTemplate} 
                    field="agendado_para" 
                    header="Data Agendada" 
                    style={{ width: '12%' }}
                ></Column>
                <Column 
                    body={representativeReferenciaTemplate}
                    field="referencia"
                    header="Referência"
                    style={{ width: '15%' }}
                ></Column>
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
                <Column 
                    body={representativeCheckTemplate} 
                    field="check" 
                    header="Ações" 
                    style={{ width: '10%' }}
                ></Column>
            </DataTable>
        </>
    )
}

export default DataTableAtividades