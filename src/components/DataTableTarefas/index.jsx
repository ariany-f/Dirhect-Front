import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
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
import { FaDollarSign, FaMoneyBill, FaPaperPlane, FaRegPaperPlane, FaUmbrellaBeach, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { LuNewspaper } from 'react-icons/lu';
import CustomImage from '@components/CustomImage';
import { Tooltip } from 'primereact/tooltip';
import { Skeleton } from 'primereact/skeleton';
import http from '@http';

function DataTableTarefas({ tarefas, colaborador = null }) {

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

    // Opções dos filtros
    const statusOptions = [
        { label: 'Aprovada', value: 'Aprovada' },
        { label: 'Cancelada', value: 'Cancelada' },
        { label: 'Pendente', value: 'Pendente' },
    ];
    const tipoTarefaOptions = [
        { label: 'Aceite LGPD', value: 'aceite_lgpd' },
        { label: 'Documentos Pendentes', value: 'documentos_pendentes' },
        { label: 'Integração ERP', value: 'integracao_erp' },
    ];

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Filtro aplicado ao array de tarefas
    const tarefasFiltradas = tarefas.filter(tarefa => {
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
            case 'aceite_lgpd':
                icon = <FaUserPlus fill="var(--info)" stroke="white" color="var(--info)" size={16}/>;
                break;
            case 'documentos_pendentes':
                icon = <FaUserMinus fill="var(--error)" stroke="white" color="var(--error)" size={16}/>;
                break;
            case 'integracao_erp':
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

    // Header customizado
    const headerTemplate = (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', padding: 0 }}>
            <CampoTexto width={'220px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
            <div style={{display: 'flex', gap: 16, alignItems: 'flex-start'}}>
                <div style={{display: 'flex', gap: 5, alignItems: 'start', flexDirection: 'column'}}>
                    <Dropdown 
                        value={statusFiltro} 
                        options={statusOptions} 
                        onChange={e => setStatusFiltro(e.value)} 
                        placeholder="Filtrar por Status" 
                        style={{ minWidth: 180, minHeight: 40, maxHeight: 40 }}
                        itemTemplate={statusOptionTemplate}
                    />
                </div>
                <div style={{display: 'flex', gap: 5, alignItems: 'start', flexDirection: 'column'}}>
                    <Dropdown 
                        value={tipoTarefaFiltro} 
                        options={tipoTarefaOptions} 
                        onChange={e => setTipoTarefaFiltro(e.value)} 
                        placeholder="Filtrar por Tipo" 
                        style={{ minWidth: 180, minHeight: 40, maxHeight: 40 }}
                        itemTemplate={tipoTarefaOptionTemplate}
                    />
                </div>
                {/* <div style={{display: 'flex', gap: 5, alignItems: 'start', flexDirection: 'column'}}>
                    <Dropdown 
                        value={clienteFiltro} 
                        options={clientesUnicos} 
                        onChange={e => setClienteFiltro(e.value)} 
                        placeholder="Filtrar por Cliente" 
                        style={{ minWidth: 180, minHeight: 40, maxHeight: 40 }}
                        itemTemplate={clienteOptionTemplate}
                    />
                </div> */}
                <button
                    style={{ padding: '9px 8px', border: 'none', borderRadius: 8, background: 'transparent', color: 'var(--neutro-800)', cursor: 'pointer'}}
                    onClick={() => { setStatusFiltro(null); setTipoTarefaFiltro(null); setClienteFiltro(null); }}
                >
                    <FaFilterCircleXmark size={18}/>
                </button>
                
                <BotaoGrupo align={'space-between'} wrap>
                    {!colaborador && (
                        <>
                            <BotaoGrupo align="end" gap="8px">
                                {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" stroke="white" color="white"/> Registrar Tarefa</Botao>
                                }
                            </BotaoGrupo>
                        </>
                    )}
                </BotaoGrupo>
            </div>
        </div>
    );

    function verDetalhes(value)
    {
        navegar(`/tarefas/detalhes/${value.id}`)
    }

    const representativStatusTemplate = (rowData) => {
        let status = '';

        switch(rowData?.percentual_conclusao)
        {
            case 0:
                status = 'Não iniciado';
                break;
            case 100:
                status = 'Concluído';
                break;
            
            default:
                if (rowData?.percentual_conclusao < 30) {
                    status = 'Aguardando';
                } else {
                    status = 'Em Andamento';
                }
                break;
        }

        const valueTemplate = (value) => {
            return (
                <Texto color="var(--white)">{value}%</Texto>
            );
        };

        var feito = rowData.concluidas_atividades;
        var tarefas = rowData.total_atividades;
        
        if(rowData.status_display === 'Aprovada') {
            var progresso = 100;
        } else if(rowData.status_display === 'Cancelada') {
            var progresso = 0;
        } else if(rowData.status_display === 'Pendente') {
            var progresso = 0;
        } else {
            var progresso = Math.round((feito / tarefas) * 100); // Arredonda a porcentagem concluída
        }
    
        // Define a cor com base no progresso
        let severity = "rgb(139, 174, 44)";
        if (progresso <= 30) {
            severity = "rgb(212, 84, 114)";
        } else if (progresso <= 99) {
            severity = "var(--info)";
        }
        return (
            <div style={{width: '100%'}}>
                <b>{status}</b>
                <ProgressBar className={styles.progressBar}
                    value={progresso} 
                    color={severity} 
                    displayValueTemplate={valueTemplate}
                />
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
                Itens: <p style={{fontWeight: '400', color: 'var(--neutro-500)'}}> {rowData.concluidas_atividades}/{rowData.total_atividades}</p>
            </div>
        </div>
    }

    const representativeConcluidoTemplate = (rowData) => {
        return <>{rowData.feito}/{rowData.total_tarefas}</>
    }

    const tipoTarefaTagTemplate = (rowData) => {
    
        let color = 'var(--neutro-400)';
        let label = '';
        let icon = '';
        switch(rowData.processo_codigo) {
            case 'admissao':
                color = 'var(--info)';
                label = 'Admissão';
                icon = <FaUserPlus fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'demissao':
                color = 'var(--error)';
                label = 'Demissão';
                icon = <FaUserMinus fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'ferias':
                color = 'var(--green-500)';
                label = 'Férias';
                icon = <FaUmbrellaBeach fill="white" stroke="white" color="white" size={16}/>
                break;
            case 'envio_variaveis':
                color = 'var(--primaria)';
                label = 'Envio de Variáveis';
                icon = <FaUserPlus fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'adiantamento':
                color = 'var(--astra-500)';
                label = 'Adiantamento';
                icon = <FaDollarSign fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'encargos':
                color = 'var(--green-400)';
                label = 'Encargos';
                icon = <FaDollarSign fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'folha':
                color = 'var(--secundaria)';
                label = 'Folha Mensal';
                icon = <LuNewspaper fill="white" stroke="white" color="white" size={16}/>;
                break;
            default:
                label = rowData.processo_nome;
        }
        if(icon) {
            label = <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'white'}}>{icon} {label}</div>;
        }
        return <Tag value={label} style={{ backgroundColor: color, color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px' }} />;
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
        
        if (rowData.status === 'Concluída') {
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
        if(rowData.entidade_tipo_display == 'admissao') {
            if(rowData.objeto?.dados_candidato) {
                return <div key={rowData?.id || 'unknown'}>
                    <Texto weight={700} width={'100%'}>
                         {rowData.objeto.dados_candidato.nome}
                    </Texto>
                    <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                        CPF: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData?.objeto?.dados_candidato?.cpf ? formataCPF(rowData?.objeto?.dados_candidato?.cpf) : '-'}</p>
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
        }
    };

    // Template para coluna do cliente
    const clienteTemplate = (rowData) => {
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
            <DataTable 
                value={tarefasFiltradas} 
                filters={filters} 
                globalFilterFields={['descricao']}  
                emptyMessage="Não foram encontrados tarefas" 
                selection={selectedVaga} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
                header={headerTemplate}
            >
                <Column body={tipoTarefaTagTemplate} field="tipo_tarefa" header="Tipo de Processo" style={{ width: '18%' }} />
                <Column body={pessoaTemplate} field="pessoa" header="Referência" style={{ width: '15%' }} />
                <Column body={dataInicioTemplate} field="data_inicio" header="Data de Início" style={{width: '10%'}} />
                <Column body={dataEntregaTemplate} field="data_entrega" header="Data de Entrega" style={{width: '10%'}} />
                <Column body={representativeTipoTemplate} field="tipo" header="Concluído" style={{ width: '11%' }}></Column>
                <Column body={clienteTemplate} field="client_nome" header="Cliente" style={{ width: '8%' }} />
                <Column body={representativStatusTemplate} field="status" header="Situação" style={{ width: '14%' }}></Column>
            </DataTable>
            <ModalTarefas opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </>
    )
}

export default DataTableTarefas