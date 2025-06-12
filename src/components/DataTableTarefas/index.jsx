import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
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
        { label: 'Aguardando Início', value: 'Aguardando' },
        { label: 'Em andamento', value: 'Em andamento' },
        { label: 'Concluída', value: 'Concluída' },
    ];
    const tipoTarefaOptions = [
        { label: 'Admissão', value: 'admissao' },
        { label: 'Demissão', value: 'demissao' },
        { label: 'Férias', value: 'ferias' },
        { label: 'Envio de Variáveis', value: 'envio_variaveis' },
        { label: 'Adiantamento', value: 'adiantamento' },
        { label: 'Encargos', value: 'encargos' },
        { label: 'Folha Mensal', value: 'folha' },
    ];

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Filtro aplicado ao array de tarefas
    const tarefasFiltradas = tarefas.filter(tarefa => {
        const statusOk = statusFiltro === null || tarefa.status === statusFiltro;
        const tipoOk = tipoTarefaFiltro === null || tarefa.tipo_tarefa === tipoTarefaFiltro;
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
            case 'Aguardando':
                color = 'var(--error)';
                break;
            case 'Em andamento':
                color = 'var(--info)';
                break;
            case 'Concluída':
                color = 'var(--green-500)';
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
            case 'admissao':
                icon = <FaUserPlus fill="var(--info)" stroke="white" color="var(--info)" size={16}/>;
                break;
            case 'demissao':
                icon = <FaUserMinus fill="var(--error)" stroke="white" color="var(--error)" size={16}/>;
                break;
            case 'ferias':
                icon = <FaUmbrellaBeach fill="var(--green-500)" stroke="white" color="var(--green-500)" size={16}/>;
                break;
            case 'envio_variaveis':
                icon = <FaUserPlus fill="var(--primaria)" stroke="white" color="var(--primaria)" size={16}/>;
                break;
            case 'adiantamento':
                icon = <FaDollarSign fill="var(--astra-500)" stroke="white" color="var(--astra-500)" size={16}/>;
                break;
            case 'encargos':
                icon = <FaDollarSign fill="var(--green-400)" stroke="white" color="var(--green-400)" size={16}/>;
                break;
            case 'folha':
                icon = <LuNewspaper fill="var(--secundaria)" stroke="white" color="var(--secundaria)" size={16}/>;
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
                <div style={{display: 'flex', gap: 5, alignItems: 'start', flexDirection: 'column'}}>
                    <Dropdown 
                        value={clienteFiltro} 
                        options={clientesUnicos} 
                        onChange={e => setClienteFiltro(e.value)} 
                        placeholder="Filtrar por Cliente" 
                        style={{ minWidth: 180, minHeight: 40, maxHeight: 40 }}
                        itemTemplate={clienteOptionTemplate}
                    />
                </div>
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
        let status = rowData?.status;
        let statusDisplay = rowData?.status_display;

        switch(rowData?.status)
        {
            case 'aprovada':
                status = <Tag severity="success" value={statusDisplay}></Tag>;
                break;
            case 'pendente':
                status = <Tag severity="danger" value={statusDisplay}></Tag>;
                break;
            default:
                status = <Tag style={{backgroundColor: 'var(--neutro-400)'}} value={statusDisplay}></Tag>;
        }

        const valueTemplate = (value) => {
            return (
                <Texto color="var(--white)">{value}%</Texto>
            );
        };

        // Calcula o progresso baseado no status
        let progresso = 0;
        if (rowData.status === 'aprovada') {
            progresso = 100;
        } else if (rowData.status === 'pendente') {
            progresso = 0;
        }

        let severity = "var(--info)";
        if (progresso === 0) {
            severity = "rgb(212, 84, 114)";
        } else if (progresso === 100) {
            severity = "rgb(139, 174, 44)";
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
            <Texto weight={500} width={'100%'}>
                {rowData.tipo}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Itens:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.feito}/{rowData.total_tarefas}</p>
            </div>
            
        </div>
    }

    const representativeConcluidoTemplate = (rowData) => {
        return <>{rowData.feito}/{rowData.total_tarefas}</>
    }

    const tipoTarefaTagTemplate = (rowData) => {
        let color = 'var(--neutro-400)';
        let label = rowData.tipo_display || rowData.tipo_codigo;
        let icon = '';
        
        switch(rowData.tipo_codigo) {
            case 'aceite_lgpd':
                color = 'var(--info)';
                icon = <FaUserPlus fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'documentos_pendentes':
                color = 'var(--error)';
                icon = <FaUserMinus fill="white" stroke="white" color="white" size={16}/>;
                break;
            case 'integracao_erp':
                color = 'var(--green-500)';
                icon = <FaPaperPlane fill="white" stroke="white" color="white" size={16}/>;
                break;
            default:
                color = 'var(--neutro-400)';
        }

        if(icon) {
            label = <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'white'}}>{icon} {label}</div>;
        }
        return <Tag value={label} style={{ backgroundColor: color, color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px' }} />;
    };

    const dataInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{rowData.criado_em ? new Date(rowData.criado_em).toLocaleDateString('pt-BR') : '-'}</p>
    }

    const dataEntregaTemplate = (rowData) => {
        const dataEntrega = rowData.agendado_para ? new Date(rowData.agendado_para) : null;
        const dataInicio = rowData.criado_em ? new Date(rowData.criado_em) : null;
        
        if (!dataEntrega || !dataInicio) {
            return <p style={{fontWeight: '400'}}>{dataEntrega ? dataEntrega.toLocaleDateString('pt-BR') : '-'}</p>;
        }

        const hoje = new Date();
        const totalDias = Math.ceil((dataEntrega - dataInicio) / (1000 * 60 * 60 * 24));
        const diasPassados = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        const porcentagem = totalDias > 0 ? (diasPassados / totalDias) : 1;
        
        let statusPrazo = '';
        let cor = '';
        
        if (rowData.status === 'aprovada') {
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
        // Extrai o nome do candidato da descrição
        const nomeMatch = rowData.descricao.match(/para (.*?)(?=\s|$)/);
        const nome = nomeMatch ? nomeMatch[1] : '-';
        
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                ID: <p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.entidade_id}</p>
            </div>
        </div>
    };

    // Template para coluna do cliente
    const clienteTemplate = (rowData) => {
        return (
            <>
                <Tooltip target=".cliente" mouseTrack mouseTrackLeft={10} />
                <div data-pr-tooltip={rowData.client_nome || '-'} className="cliente">
                    <CustomImage src={rowData.client_simbolo} width={24} height={24} />
                </div>
            </>
        );
    };

    return (
        <>
            <DataTable 
                value={tarefasFiltradas} 
                filters={filters} 
                globalFilterFields={['descricao', 'tipo_display', 'status_display']}  
                emptyMessage="Não foram encontrados tarefas" 
                selection={selectedVaga} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
                header={headerTemplate}
            >
                <Column body={tipoTarefaTagTemplate} field="tipo_codigo" header="Tipo de Tarefa" style={{ width: '18%' }} />
                <Column body={pessoaTemplate} field="descricao" header="Referência" style={{ width: '15%' }} />
                <Column body={dataInicioTemplate} field="criado_em" header="Data de Início" style={{width: '10%'}} />
                <Column body={dataEntregaTemplate} field="agendado_para" header="Data de Entrega" style={{width: '10%'}} />
                <Column body={representativStatusTemplate} field="status" header="Situação" style={{ width: '14%' }}></Column>
            </DataTable>
            <ModalTarefas opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </>
    )
}

export default DataTableTarefas