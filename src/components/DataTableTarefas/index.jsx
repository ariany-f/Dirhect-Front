import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '@pages/Tarefas/Tarefas.module.css'
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Real } from '@utils/formats'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import ModalTarefas from '@components/ModalTarefas'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import { Dropdown } from 'primereact/dropdown';
import { BiFilter } from 'react-icons/bi';
import { FaFilterCircleXmark, FaMoneyBill1 } from 'react-icons/fa6';
import { FaDollarSign, FaMoneyBill, FaPaperPlane, FaRegPaperPlane, FaUmbrellaBeach, FaUserMinus, FaUserPlus, FaCheck } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { LuNewspaper } from 'react-icons/lu';
import CustomImage from '@components/CustomImage';
import { Tooltip } from 'primereact/tooltip';
import { FaSync } from 'react-icons/fa';
import { Skeleton } from 'primereact/skeleton';
import http from '@http';
import { ArmazenadorToken } from '@utils';
import ModalSyync from '@components/ModalSyync';

function DataTableTarefas({ 
    tarefas, 
    colaborador = null,
    // Props para paginação via servidor
    paginator = false,
    rows = 10,
    totalRecords = 0,
    first = 0,
    onPage,
    onSearch,
    onSort,
    sortField,
    sortOrder,
    showSearch = true,
    onFilter,
    serverFilters,
    onRefresh,
    loading = false,
    syync = false
}) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [statusFiltro, setStatusFiltro] = useState(null);
    const [tipoTarefaFiltro, setTipoTarefaFiltro] = useState(null);
    const [clienteFiltro, setClienteFiltro] = useState(null);
    const {usuario} = useSessaoUsuarioContext()
    const navegar = useNavigate()
    const [modalSyyncOpened, setModalSyyncOpened] = useState(false);

    // Opções dos filtros
    const statusOptions = [
        { label: 'Aprovada', value: 'Aprovada' },
        { label: 'Cancelada', value: 'Cancelada' },
        { label: 'Pendente', value: 'Pendente' },
    ];
    const tipoTarefaOptions = [
        { label: 'Aceite LGPD', value: 'aguardar_lgpd' },
        { label: 'Documentos Pendentes', value: 'aguardar_documento' },
        { label: 'Integração ERP', value: 'aprovar_admissao' },
        { label: 'Integração ERP - Correção', value: 'integrar_admissao_correcao' },
    ];

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    // Filtro aplicado ao array de tarefas (apenas para modo client-side)
    const tarefasFiltradas = paginator ? tarefas : tarefas.filter(tarefa => {
        const statusOk = statusFiltro === null || tarefa.status_display === statusFiltro;
        const tipoOk = tipoTarefaFiltro === null || tarefa.tipo_codigo === tipoTarefaFiltro;
        const clienteOk = clienteFiltro === null || tarefa.client_id === clienteFiltro;
        return statusOk && tipoOk && clienteOk;
    });

    // Gerar lista de clientes únicos
    const clientesUnicos = Array.from(
        tarefas.reduce((map, t) => {
            if (!map.has(t.client_id)) {
                map.set(t.client_id, { label: t.client_nome, value: t.client_id, simbolo: t.client_simbolo });
            }
            return map;
        }, new Map()).values()
    );

    // Template para opções do status
    const statusOptionTemplate = (option) => {
        if (!option.value) return <span>{option.label}</span>;
        let color = '';
        switch(option.value) {
            case 'Aprovada':
                color = 'var(--green-500)';
                break;
            case 'Cancelada':
                color = 'var(--warning)';
                break;
            case 'Pendente':
                color = 'var(--error)';
                break;
            default:
                color = 'var(--neutro-400)';
        }
        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: color
                }} />
                {option.label}
            </span>
        );
    };

    // Template para opções do tipo de tarefa
    const tipoTarefaOptionTemplate = (option) => {
        if (!option.value) return <span>{option.label}</span>;
        let icon = null;
        switch(option.value) {
            case 'aguardar_lgpd':
                icon = <FaUserPlus fill="var(--info)" stroke="white" color="var(--info)" size={16}/>;
                break;
            case 'aguardar_documento':
                icon = <FaUserMinus fill="var(--error)" stroke="white" color="var(--error)" size={16}/>;
                break;
            case 'aprovar_admissao':
                icon = <FaPaperPlane fill="var(--green-500)" stroke="white" color="var(--green-500)" size={16}/>;
                break;
            case 'integrar_admissao_correcao':
                icon = <FaPaperPlane fill="var(--green-500)" stroke="white" color="var(--green-500)" size={16}/>;
                break;
            default:
                icon = null;
        }
        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {icon} {option.label}
            </span>
        );
    };

    // Template para opções do cliente
    const clienteOptionTemplate = (option) => {
        if (!option.value) return <span>{option.label}</span>;
        return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CustomImage src={option.simbolo} width={20} height={20} />
                {option.label}
            </span>
        );
    };

    function verDetalhes(value)
    {
        navegar(`/tarefas/detalhes/${value.id}`)
    }

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    const totalTarefasTemplate = () => {
        return 'Total de Tarefas: ' + (totalRecords ?? 0);
    };

    // Template para filtro de tipo de processo
    const tipoProcessoFilterTemplate = (options) => {
        let dropdownOptions = [];
        if(syync) {
            dropdownOptions.push({ label: 'Férias', value: 'syync_segalas_ferias'})
            dropdownOptions.push({ label: 'Folha', value: 'syync_segalas_folha'})
        }
        else {
            dropdownOptions.push({ label: 'Admissão', value: 'admissao' });
            dropdownOptions.push({ label: 'Demissão', value: 'demissao' });
            dropdownOptions.push({ label: 'Férias', value: 'ferias' });
            dropdownOptions.push({ label: 'Envio de Variáveis', value: 'envio_variaveis' });
            dropdownOptions.push({ label: 'Adiantamento', value: 'adiantamento' });
            dropdownOptions.push({ label: 'Encargos', value: 'encargos' });
            dropdownOptions.push({ label: 'Folha Mensal', value: 'folha' });
        }
        return (
            <Dropdown
                value={options.value}
                options={dropdownOptions}
                onChange={e => options.filterApplyCallback(e.value)}
                placeholder="Tipo de Processo"
                style={{ minWidth: '12rem' }}
            />
        )
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

    // Template para filtro de situação baseado no percentual_conclusao
    const situacaoFilterTemplate = (options) => (
        <Dropdown
            value={options.value}
            options={[
                { label: 'Não iniciado', value: 0 },
                { label: 'Aguardando', value: 'aguardando' },
                { label: 'Em Andamento', value: 'em_andamento' },
                { label: 'Concluído', value: 100 }
            ]}
            onChange={e => options.filterApplyCallback(e.value)}
            placeholder="Situação"
            style={{ minWidth: '12rem' }}
        />
    );

    const representativStatusTemplate = (rowData) => {
        const percentualConclusao = rowData?.percentual_conclusao || 0;
        let status = '';
        let statusColor = '#333';
        let statusBgColor = 'rgba(51, 51, 51, 0.1)';

        // Determina o status baseado no percentual_conclusao
        switch(percentualConclusao) {
            case 0:
                status = 'Não iniciado';
                statusColor = '#e53935'; // vermelho
                statusBgColor = 'rgba(229, 57, 53, 0.15)';
                break;
            case 100:
                status = 'Concluído';
                statusColor = '#66BB6A'; // verde
                statusBgColor = 'rgba(102, 187, 106, 0.15)';
                break;
            default:
                if (percentualConclusao < 30) {
                    status = 'Aguardando';
                    statusColor = '#FFA726'; // laranja
                    statusBgColor = 'rgba(255, 167, 38, 0.15)';
                } else {
                    status = 'Em Andamento';
                    statusColor = '#42A5F5'; // azul
                    statusBgColor = 'rgba(66, 165, 245, 0.15)';
                }
                break;
        }

        // Define a cor da barra de progresso
        let progressColor = "var(--info)";
        if (percentualConclusao === 0) {
            progressColor = "rgb(212, 84, 114)"; // vermelho
        } else if (percentualConclusao === 100) {
            progressColor = "rgb(139, 174, 44)"; // verde
        } else if (percentualConclusao < 30) {
            progressColor = "rgb(255, 167, 38)"; // laranja
        }

        return (
            <div style={{width: '100%'}}>
                <div style={{ 
                    textAlign: 'left', 
                    marginBottom: 8
                }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontWeight: 500,
                        fontSize: 12,
                        color: statusColor,
                        backgroundColor: statusBgColor
                    }}>
                        {status}
                    </span>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                    <ProgressBar 
                        value={percentualConclusao} 
                        color={progressColor}
                        style={{ height: 8 }}
                        className="custom-progressbar"
                        showValue={false}
                    />
                    <span style={{ 
                        fontSize: 12, 
                        fontWeight: 400, 
                        color: '#666',
                        position: 'absolute',
                        right: 0,
                        textAlign: 'right',
                        top: '100%',
                        marginTop: 4
                    }}>{`${percentualConclusao}%`}</span>
                </div>
            </div>
        )
    }

    const representativeRecorrenciaTemplate = (rowData) => {
        if(rowData.recorrencia)
        {
            return rowData.tipo_recorrencia;
        }
        else {
            return 'Automático';
        }
    }

    const representativeDataTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.data).toLocaleDateString("pt-BR")}</p>
    }

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            {/* <Texto weight={500} width={'100%'}>
                {rowData.tipo_display}
            </Texto> */}
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Itens:&nbsp; <p style={{fontWeight: '400', color: 'var(--neutro-500)'}}> {rowData.concluidas_atividades}/{rowData.total_atividades}</p>
            </div>
        </div>
    }

    const representativeConcluidoTemplate = (rowData) => {
        return <>{rowData.feito}/{rowData.total_tarefas}</>
    }

    const tipoTarefaTagTemplate = (rowData) => {
        let label = '';
        let icon = '';
        let tagClass = 'tag-generico';
        
        switch(rowData.processo_codigo) {
            case 'admissao':
                label = 'Admissão';
                icon = <FaUserPlus fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-admissao';
                break;
            case 'demissao':
                label = 'Demissão';
                icon = <FaUserMinus fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-demissao';
                break;
            case 'ferias':
                label = 'Férias';
                icon = <FaUmbrellaBeach fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-ferias';
                break;
            case 'envio_variaveis':
                label = 'Envio de Variáveis';
                icon = <FaUserPlus fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-envio-variaveis';
                break;
            case 'adiantamento':
                label = 'Adiantamento';
                icon = <FaDollarSign fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-adiantamento';
                break;
            case 'encargos':
                label = 'Encargos';
                icon = <FaDollarSign fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-encargos';
                break;
            case 'folha':
                label = 'Folha Mensal';
                icon = <LuNewspaper fill="white" stroke="white" color="white" size={16}/>;
                tagClass = 'tag-folha';
                break;
            default:
                label = rowData.processo_nome;
                tagClass = 'tag-generico';
        }
        
        return (
            <div className={`tag-processo ${tagClass}`}>
                {icon}
                {label}
            </div>
        );
    };

    const dataInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.created_at ? new Date(rowData.created_at).toLocaleDateString('pt-BR') : '-'}</p>
    }

    const dataEntregaTemplate = (rowData) => {
        const sla = rowData.sla || (rowData.percentual_conclusao < 100 ? 2 : 0);
        const dataInicio = rowData.created_at ? new Date(rowData.created_at) : new Date();
        // Calcula a data de entrega com base no SLA
        const dataEntrega = new Date(dataInicio);
        dataEntrega.setDate(dataEntrega.getDate() + sla);
        
        if (!dataEntrega || !dataInicio) {
            return <p style={{fontWeight: '400'}}>{dataEntrega ? dataEntrega.toLocaleDateString('pt-BR') : '-'}</p>;
        }

        const hoje = new Date();
        const totalDias = Math.ceil((dataEntrega - dataInicio) / (1000 * 60 * 60 * 24));
        const diasPassados = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        const porcentagem = totalDias > 0 ? (diasPassados / totalDias) : 1;

        let statusPrazo = '';
        let cor = '';
        
        if (porcentagem == 1) {
            statusPrazo = 'Concluída';
            cor = 'var(--green-500)';
        } else {
            if (hoje > dataEntrega) {
                statusPrazo = 'Em atraso';
                cor = 'var(--error-600)';
            } else if (porcentagem < 0.6) {
                statusPrazo = 'Dentro do prazo';
                cor = 'var(--green-500)';
            } else if (porcentagem < 0.9) {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            } else {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            }
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                <p style={{fontWeight: '600', margin: 0, color: cor}}>{dataEntrega.toLocaleDateString('pt-BR')}</p>
                <span style={{fontSize: 12, fontWeight: 400, marginTop: 2}}>{statusPrazo}</span>
            </div>
        );
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const pessoaTemplate = (rowData) => {
        if(rowData.objeto?.dados_candidato) {
            return <div key={rowData?.id || 'unknown'}>
                <Texto uppercase weight={700} width={'100%'}>
                    {rowData.objeto.dados_candidato.nome}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                    CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.dados_candidato?.cpf ? formataCPF(rowData?.objeto?.dados_candidato?.cpf) : '-'}</p>
                </div>
            </div>
        }
        else if(rowData.objeto?.funcionario_detalhe) {
            return <div key={rowData?.id || 'unknown'}>
                <Texto uppercase weight={700} width={'100%'}>
                    {rowData.objeto.funcionario_detalhe.nome}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                    CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.funcionario_detalhe?.cpf ? formataCPF(rowData?.objeto?.funcionario_detalhe?.cpf) : '-'}</p>
                </div>
            </div>
        }
        else {
            if(rowData?.objeto?.id) {
                return <div key={rowData?.id || 'unknown'}>
                    <Link to={`/${rowData.entidade_tipo_display}/detalhes/${rowData?.objeto?.id}`}>{rowData.processo_nome}</Link>
                </div>
            }
            else {
                return <div key={rowData?.id || 'unknown'}>
                    <Link to={`/${rowData.entidade_tipo_display}/`}>{rowData.processo_nome}</Link>
                </div>
            }
        }
    };

    // Template para coluna do cliente
    const clienteTemplate = (rowData) => {
        const [cliente, setCliente] = useState(null);

        useEffect(() => {
            if (rowData.tenant) {
                // Buscar do cache primeiro
                const tenantsCache = ArmazenadorToken.getTenantsCache();
                if (tenantsCache) {
                    const clienteEncontrado = tenantsCache.find(tenant => tenant?.tenant?.id === rowData.tenant);
                    if (clienteEncontrado) {
                        setCliente(clienteEncontrado?.tenant);
                        return;
                    }
                }
                
                // Se não encontrou no cache, buscar da API e atualizar cache
                http.get(`/client_tenant/${rowData.tenant}/`)
                    .then(response => {
                        setCliente(response);
                        // Atualizar cache se necessário
                        if (tenantsCache) {
                            const novoCache = [...tenantsCache, response];
                            ArmazenadorToken.salvarTenantsCache(novoCache);
                        }
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
                        <Skeleton shape="circle" size="36px" />
                    </div>
                </>
            );
        }

        return (
            <>
                <Tooltip target=".cliente" mouseTrack mouseTrackLeft={10} />
                <div data-pr-tooltip={cliente.nome || '-'} className="cliente">
                    <CustomImage src={cliente.simbolo} width={36} height={36} />
                </div>
            </>
        );
    };

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
            <BotaoGrupo align={showSearch ? 'space-between' : 'end'} wrap>
                {showSearch && (
                     <>
                     <div className="flex justify-content-end">
                         <span className="p-input-icon-left">
                            <CampoTexto width={"320px"} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                        </span>
                    </div>
                    </>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {syync && (
                        <Botao
                            size="small"
                            estilo="vermilion"
                            model="filled"
                            aoClicar={() => setModalSyyncOpened(true)}
                        >
                            <GrAddCircle className={styles.icon} fill="var(--secundaria)" stroke="white" color="white"/>Criar
                        </Botao>
                    )}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            title="Atualizar dados"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s',
                                    opacity: loading ? 0.5 : 1
                                }}
                            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--neutro-100)')}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                        >
                            <FaSync 
                                size={16} 
                                color="var(--gradient-secundaria)" 
                                style={{
                                    animation: loading ? 'spin 1s linear infinite' : 'none'
                                }}
                                />
                        </button>
                    )}
                </div>
            </BotaoGrupo>
            <DataTable 
                value={tarefasFiltradas} 
                filters={serverFilters}
                onFilter={onFilter}
                globalFilterFields={['descricao', 'objeto.dados_candidato.nome', 'objeto.dados_candidato.cpf']}  
                emptyMessage="Não foram encontrados tarefas" 
                selection={selectedVaga} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator={paginator}
                lazy={paginator}
                rows={rows} 
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                tableStyle={{ minWidth: '68vw' }}
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                onSort={handleSort}
                removableSort
                footerColumnGroup={
                    paginator ? (
                        <ColumnGroup>
                            <Row>
                                <Column footer={totalTarefasTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                            </Row>
                        </ColumnGroup>
                    ) : null
                }
            >
                <Column 
                    body={tipoTarefaTagTemplate} 
                    field="processo_codigo" 
                    header="Tipo de Processo" 
                    style={{ width: '15%' }}
                    sortable
                    sortField="processo_codigo"
                    filter
                    filterField="processo_codigo"
                    showFilterMenu={true}
                    filterElement={tipoProcessoFilterTemplate}
                    filterMatchMode="custom"
                    showFilterMatchModes={false}
                    showFilterOperator={false}
                    showAddButton={false}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                />
                <Column body={pessoaTemplate} field="pessoa" header="Referência" style={{ width: '15%' }} />
                <Column 
                    body={clienteTemplate} 
                    field="client_nome" 
                    header="Cliente" 
                    style={{ width: '8%' }}
                    sortable
                    sortField="tenant"
                />
                <Column 
                    body={dataInicioTemplate} 
                    field="created_at" 
                    header="Data de Início" 
                    style={{width: '10%'}}
                    sortable
                    sortField="created_at"
                />
                <Column 
                    body={dataEntregaTemplate} 
                    field="data_entrega" 
                    header="Data de Entrega" 
                    style={{width: '10%'}}
                    sortable
                    sortField="created_at"
                />
                <Column body={representativeTipoTemplate} field="tipo" header="Concluído" style={{ width: '11%' }}></Column>
                <Column 
                    body={representativStatusTemplate} 
                    field="percentual_conclusao" 
                    header="Situação" 
                    style={{ width: '14%' }}
                    sortable
                    sortField="percentual_conclusao"
                    filter
                    filterField="percentual_conclusao"
                    showFilterMenu={true}
                    filterElement={situacaoFilterTemplate}
                    filterMatchMode="custom"
                    showFilterMatchModes={false}
                    showFilterOperator={false}
                    showAddButton={false}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                />
            </DataTable>
            <ModalTarefas opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            
            {/* Modal Syync */}
            {syync && (
                <ModalSyync 
                    opened={modalSyyncOpened} 
                    onClose={() => setModalSyyncOpened(false)} 
                />
            )}
        </>
    )
}

export default DataTableTarefas