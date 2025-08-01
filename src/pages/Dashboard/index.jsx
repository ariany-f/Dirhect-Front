import http from '@http'
import { useEffect, useState, useRef, useMemo } from 'react'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Tag } from 'primereact/tag'
import { FaUserPlus, FaUserMinus, FaUmbrellaBeach, FaArrowRight, FaUserTimes, FaCheckCircle, FaRegClock, FaSyncAlt } from 'react-icons/fa';
import { MdWork, MdBarChart, MdPieChart, MdTimeline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { IoMdSync } from 'react-icons/io';
import { Tooltip } from 'primereact/tooltip';
import '@pages/Dashboard/DashboardAtividades.css'
import { ArmazenadorToken } from '@utils'

function Dashboard() {
    const {
        usuarioEstaLogado,
        usuario
    } = useSessaoUsuarioContext()

    const [colaboradores, setColaboradores] = useState(null)
    const [loadingOpened, setLoadingOpened] = useState(true)
    const [dashboardData, setDashboardData] = useState({})
    const [atividadesAbertas, setAtividadesAbertas] = useState(0)
    const [atividadesPorStatus, setAtividadesPorStatus] = useState({})
    const [atividadesPorTipo, setAtividadesPorTipo] = useState({})
    const [atividadesPorSLA, setAtividadesPorSLA] = useState({})
    const [atividadesPorEntidade, setAtividadesPorEntidade] = useState({})
    const [totalVagas, setTotalVagas] = useState(0)
    const [totalFerias, setTotalFerias] = useState(0)
    const [totalAdmissoes, setTotalAdmissoes] = useState(0)
    const [atividadesRaw, setAtividadesRaw] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [funcionariosDashboard, setFuncionariosDashboard] = useState(null)
    const isMounted = useRef(true)

    // Mapeamento deve vir logo no início do componente
    const entidadeDisplayMap = {
        'admissao': 'Admissão',
        'ferias': 'Férias',
        'demissao': 'Demissão',
        // adicione outros se necessário
    };

    const entidadeIconMap = {
        'Férias': <FaUmbrellaBeach size={14} style={{marginRight: 4, color: '#fff'}} />,
        'Demissão': <FaUserTimes size={14} style={{marginRight: 4, color: '#fff'}} />,
        'Admissão': <FaUserPlus size={14} style={{marginRight: 4, color: '#fff'}} />,
    };

    // Mapeamento de cor por status
    const statusColorMap = {
        'Concluída': '#43a047', // verde
        'Concluido': '#43a047',
        'concluida': '#43a047',
        'Em Andamento': '#FFA726', // amarelo/laranja
        'em_andamento': '#FFA726',
        'Pendente': '#5472d4', // azul
        'pendente': '#5472d4'
    };

    // Paleta de cores para os gráficos
    const chartColors = [
        '#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8', '#ffb347', '#20c997', '#1a73e8', '#dc3545', '#ffa000', '#28a745', '#6f42c1', '#fd7e14'
    ];

    // Mapeamento de cor para SLA
    const slaColorMap = {
        'Concluído': '#5472d4',        // azul/cinza
        'Dentro do Prazo': '#43a047', // verde
        'Próximo do Prazo': '#FFA726',// amarelo/laranja
        'Atrasado': '#e53935',        // vermelho
    };

    // Função para verificar se uma data é desta semana
    function isThisWeek(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0,0,0,0);
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23,59,59,999);
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    // Função para verificar se uma data é hoje
    function isToday(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        return date.getDate() === now.getDate() &&
               date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    }

    // Calcular dados derivados com useMemo
    const dadosCalculados = useMemo(() => {
        // Contar abertas criadas esta semana
        const abertasEstaSemana = atividadesRaw.filter(
            atv => (atv.status !== 'concluida' && atv.status !== 'Concluída') && isThisWeek(atv.criado_em)
        ).length;

        // Contar abertas com prazo final hoje
        const abertasPrazoHoje = atividadesRaw.filter(
            atv => (atv.status !== 'concluida' && atv.status !== 'Concluída') && atv.agendado_para && isToday(atv.agendado_para)
        ).length;

        // Contar abertas com prioridade alta
        const abertasPrioridadeAlta = atividadesRaw.filter(
            atv => (atv.status !== 'concluida' && atv.status !== 'Concluída') && (atv.prioridade === 1)
        ).length;

        // Calcular atividades concluídas
        const atividadesConcluidas = atividadesPorStatus['concluida'] || atividadesPorStatus['Concluída'] || 0;

        // Calcular atividades abertas por entidade
        const abertasPorEntidade = {};
        if (Array.isArray(atividadesRaw)) {
            atividadesRaw.forEach(atividade => {
                if (atividade.status !== 'concluida' && atividade.status !== 'Concluída') {
                    const entidade = entidadeDisplayMap?.[atividade.entidade_display || atividade.entidade_tipo] || atividade.entidade_display || atividade.entidade_tipo;
                    abertasPorEntidade[entidade] = (abertasPorEntidade[entidade] || 0) + 1;
                }
            });
        }

        const totalAtividades = atividadesRaw.length;

        return {
            abertasEstaSemana,
            abertasPrazoHoje,
            abertasPrioridadeAlta,
            atividadesConcluidas,
            abertasPorEntidade,
            totalAtividades,
            // Dados do dashboard de funcionários
            totalFuncionarios: funcionariosDashboard?.total_funcionarios || 0,
            funcionariosAtivos: funcionariosDashboard?.funcionarios_ativos || 0,
            funcionariosFerias: funcionariosDashboard?.funcionarios_ferias || 0,
            funcionariosMasculino: funcionariosDashboard?.funcionarios_masculino || 0,
            funcionariosFeminino: funcionariosDashboard?.funcionarios_feminino || 0,
            funcionariosOutrosGeneros: funcionariosDashboard?.funcionarios_outros_generos || 0,
            admitidosNoMes: funcionariosDashboard?.admitidos_no_mes || 0,
            totalDemitidos: funcionariosDashboard?.total_demitidos || 0,
            demitidosNoMes: funcionariosDashboard?.demitidos_no_mes || 0
        };
    }, [atividadesRaw, atividadesPorStatus, entidadeDisplayMap, funcionariosDashboard]);

    // Função para buscar todos os dados do dashboard
    const carregarDashboard = async () => {
        setRefreshing(true);
        try {
            if(usuarioEstaLogado) {
                // Carregar dados do dashboard de funcionários
                await http.get('funcionario/dashboard/')
                    .then(response => {
                        setFuncionariosDashboard(response);
                        // Usar total_funcionarios como colaboradores para manter compatibilidade
                        setColaboradores(Array(response.total_funcionarios).fill(null));
                    })
                    .catch(error => {
                        console.error('Erro ao carregar dashboard de funcionários:', error);
                        setFuncionariosDashboard(null);
                        setColaboradores(null);
                    });
                
                if(ArmazenadorToken.hasPermission('view_tarefa')) {
                    // Carregar outras informações apenas se necessário
                    await http.get('tarefas/?format=json&status__in=pendente,em_andamento,aprovada,erro')
                        .then(response => {
                            setAtividadesRaw(response)
                            // atividades abertas: status diferente de concluida/finalizada
                            const atividadesAbertas = response.filter(atividade => 
                                atividade.status !== 'concluida' && 
                                atividade.status !== 'finalizada'
                            ).length
                            setAtividadesAbertas(atividadesAbertas || 0)
                            // Agrupar por status
                            const porStatus = response.reduce((acc, atividade) => {
                                acc[atividade.status] = (acc[atividade.status] || 0) + 1;
                                return acc;
                            }, {});
                            setAtividadesPorStatus(porStatus)
                            // Agrupar por tipo de atividade
                            const porTipo = response.reduce((acc, atividade) => {
                                const tipo = atividade.tipo_display || atividade.entidade_display || atividade.tipo_tarefa || atividade.tipo;
                                acc[tipo] = (acc[tipo] || 0) + 1;
                                return acc;
                            }, {});
                            setAtividadesPorTipo(porTipo)
                            // Agrupar por SLA
                            const porSLA = response.reduce((acc, atividade) => {
                                const slaInfo = getSLAInfo(atividade);
                                acc[slaInfo] = (acc[slaInfo] || 0) + 1;
                                return acc;
                            }, {});
                            setAtividadesPorSLA(porSLA)
                            // Agrupar por entidade
                            const porEntidade = response.reduce((acc, atividade) => {
                                const entidade = atividade.entidade_display || atividade.entidade_tipo || 'Outro';
                                acc[entidade] = (acc[entidade] || 0) + 1;
                                return acc;
                            }, {});
                            setAtividadesPorEntidade(porEntidade);
                    })
                    .catch(() => {
                        setAtividadesAbertas(0)
                        setAtividadesPorStatus({})
                        setAtividadesPorTipo({})
                        setAtividadesPorSLA({})
                        setAtividadesPorEntidade({})
                        setAtividadesRaw([])
                    })
                }
                else {
                    setAtividadesAbertas(0)
                    setAtividadesPorStatus({})
                    setAtividadesPorTipo({})
                    setAtividadesPorSLA({})
                    setAtividadesPorEntidade({})
                    setAtividadesRaw([])
                }
                if(ArmazenadorToken.hasPermission('view_vagas')) {
                    await http.get('vagas/').then(response => {
                        setTotalVagas(Array.isArray(response) ? response.length : (response.count || 0));
                    }).catch(() => setTotalVagas(0));
                } else {
                    setTotalVagas(0)
                }
                if(ArmazenadorToken.hasPermission('view_ferias')) {
                    await http.get('ferias/').then(response => {
                        setTotalFerias(Array.isArray(response) ? response.length : (response.count || 0));
                    }).catch(() => setTotalFerias(0));
                } else {
                    setTotalFerias(0)
                }
                if(ArmazenadorToken.hasPermission('view_admissao')) {
                    // Total de demissões agora vem do dashboard de funcionários
                    // setTotalDemissoes será calculado usando dados do funcionariosDashboard
                    await http.get('admissao/').then(response => {
                        setTotalAdmissoes(Array.isArray(response) ? response.length : (response.count || 0));
                    }).catch(() => setTotalAdmissoes(0));
                } else {
                    setTotalAdmissoes(0)
                }
            }
        } finally {
            if (isMounted.current) setRefreshing(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        carregarDashboard();
        return () => { isMounted.current = false; };
    }, [usuarioEstaLogado]); // Removido colaboradores das dependências

    const getSLAInfo = (atividade) => {
        if (atividade.status === 'concluida') {
            return 'Concluído';
        }
        
        const dataInicio = new Date(atividade.data_inicio || atividade.criado_em);
        const dataEntrega = new Date(atividade.data_entrega || atividade.agendado_para);
        const hoje = new Date();
        const diasAteEntrega = Math.ceil((dataEntrega - hoje) / (1000 * 60 * 60 * 24));
        
        if (diasAteEntrega >= 2) {
            return 'Dentro do Prazo';
        } else if (diasAteEntrega > 0) {
            return 'Próximo do Prazo';
        } else {
            return 'Atrasado';
        }
    }

    const getSeverity = (status) => {
        switch(status) {
            case 'Aguardando':
            case 'pendente':
                return "warning";
            case 'Em andamento':
            case 'em_andamento':
                return "info";
            case 'Concluída':
            case 'concluida':
                return "success";
            case 'Cancelado':
            case 'cancelado':
                return "danger";
            case 'Dentro do Prazo':
                return "success";
            case 'Próximo do Prazo':
                return "warning";
            case 'Atrasado':
                return "danger";
            case 'Concluído':
                return "success";
            default:
                return "info";
        }
    }

    const formatTipoAtividade = (tipo) => {
        const tipos = {
            'admissao': 'Admissão',
            'demissao': 'Demissão',
            'ferias': 'Férias',
            'folha': 'Folha de Pagamento',
            'adiantamento': 'Adiantamento',
            'encargos': 'Encargos',
            'envio_variaveis': 'Envio de Variáveis'
        };
        return tipos[tipo] || tipo;
    }

    // Função para recarregar os dados
    const recarregarDashboard = () => {
        window.location.reload(); // Simples: recarrega a página inteira
        // Para um refresh mais elegante, pode-se refazer as chamadas dos useEffect
    };

    // Monta dados diferentes conforme o tipo de usuário
    const dadosDashboard = useMemo(() => {
        if (usuario?.tipo === 'RH') {
            return {
                ...dashboardData,
                destaque: 'Bem-vindo RH!',
                totalAdmissoes: totalAdmissoes,
                totalDemissoes: dadosCalculados.totalDemitidos,
                totalFerias: totalFerias,
                totalVagas: totalVagas,
                // Dados do dashboard de funcionários
                totalColaboradores: dadosCalculados.totalFuncionarios,
                funcionariosAtivos: dadosCalculados.funcionariosAtivos,
                funcionariosMasculino: dadosCalculados.funcionariosMasculino,
                funcionariosFeminino: dadosCalculados.funcionariosFeminino,
                funcionariosOutrosGeneros: dadosCalculados.funcionariosOutrosGeneros,
                admitidosNoMes: dadosCalculados.admitidosNoMes,
                demitidosNoMes: dadosCalculados.demitidosNoMes
            };
        } else if (usuario?.tipo === 'Benefícios') {
            return {
                ...dashboardData,
                destaque: 'Bem-vindo ao módulo de Benefícios!',
                saldoBeneficios: 15000,
                pedidosPendentes: 4,
                totalColaboradores: dadosCalculados.totalFuncionarios,
            };
        } else if (usuario?.tipo === 'Outsourcing') {
            return {
                ...dashboardData,
                destaque: 'Bem-vindo Outsourcing!',
                projetosAtivos: 5,
                totalColaboradores: dadosCalculados.totalFuncionarios,
            };
        } else {
            return {
                ...dashboardData,
                totalColaboradores: dadosCalculados.totalFuncionarios,
            };
        }
    }, [dashboardData, usuario?.tipo, totalAdmissoes, totalFerias, totalVagas, dadosCalculados]);

    // Otimizar DashboardCard com useMemo
    const dashboardCardMemo = useMemo(() => {
        if (usuario?.tipo === 'Outsourcing') return null;
        
        return (
            <DashboardCard 
                dashboardData={dadosDashboard} 
                colaboradores={colaboradores} 
                atividadesRaw={atividadesRaw}
                tipoUsuario={usuario?.tipo}
                funcionariosDashboard={funcionariosDashboard}
            />
        );
    }, [dadosDashboard, colaboradores, atividadesRaw, usuario?.tipo, funcionariosDashboard]);

    // Gráficos de atividades (só para RH ou Outsourcing)
    const mostrarAtividades = usuario?.tipo === 'Outsourcing';

    if (!colaboradores) {
        return <Loading opened={loadingOpened} />
    }

    const chartDataStatus = {
        labels: Object.keys(atividadesPorStatus).map(status => {
            const statusMap = {
                'pendente': 'Pendente',
                'em_andamento': 'Em Andamento',
                'concluida': 'Concluída',
                'Aguardando': 'Aguardando'
            };
            return statusMap[status] || status;
        }),
        datasets: [
            {
                label: 'Atividades por Status',
                backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A', '#FF6384'],
                data: Object.values(atividadesPorStatus)
            }
        ]
    };

    // Para o gráfico de status, garantir a ordem correta das cores
    const statusLabels = chartDataStatus.labels;
    const statusColors = statusLabels.map(label => statusColorMap[label] || '#8884d8');

    const chartDataTipo = {
        labels: Object.keys(atividadesPorTipo),
        datasets: [
            {
                label: 'Atividades por Tipo',
                backgroundColor: ['#1a73e8', '#dc3545', '#ffa000', '#28a745', '#6f42c1', '#fd7e14', '#20c997'],
                data: Object.values(atividadesPorTipo)
            }
        ]
    };

    const chartDataSLA = {
        labels: Object.keys(atividadesPorSLA),
        datasets: [
            {
                label: 'Atividades por SLA',
                backgroundColor: ['#66BB6A', '#FFA726', '#FF6384'],
                data: Object.values(atividadesPorSLA)
            }
        ]
    };

    const chartDataEntidade = {
        labels: Object.keys(atividadesPorEntidade),
        datasets: [
            {
                label: 'Atividades por Entidade',
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384', '#8884d8', '#ffb347', '#20c997'],
                data: Object.values(atividadesPorEntidade)
            }
        ]
    };

    const slaLabels = chartDataSLA.labels;
    const slaColors = slaLabels.map(label => slaColorMap[label] || '#8884d8');

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#222',
                    font: { size: 14, weight: 400 }
                }
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#222',
                bodyColor: '#222',
                borderColor: 'var(--primaria)',
                borderWidth: 1,
                padding: 12,
                caretSize: 8,
                cornerRadius: 8,
            }
        },
        layout: {
            padding: 16
        },
        elements: {
            arc: { borderRadius: 12 },
            bar: { borderRadius: 8 }
        }
    };

    const chartOptionsNoLegend = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { display: false }
        }
    };

    // Atualizar os cards extras para usar ícones e visual moderno
    const cardsExtras = [];

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 12}}>
                <button onClick={carregarDashboard} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s'}} title="Recarregar dashboard" disabled={refreshing}>
                    <FaSyncAlt size={22} color="#888" className={refreshing ? 'spin-refresh' : ''} />
                </button>
            </div>
            {mostrarAtividades && (
                <div
                    style={{
                        marginBottom: 32,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 32,
                        alignItems: 'stretch',
                        width: '100%',
                    }}
                >
                    <div className="card-atividade" style={{position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box'}}>
                        <div className="card-header">
                            <span className="card-title">Atividades</span>
                            <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                                Ver todas <FaArrowRight size={15} />
                            </Link>
                        </div>
                        <div style={{display: 'flex', width: '100%', gap: 16, alignItems: 'flex-end', marginBottom: 8, justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 70}}>
                                <span style={{fontSize: 20, fontWeight: 900, color: '#222', display: 'flex', alignItems: 'center', gap: 2}}>
                                    {dadosCalculados.totalAtividades}
                                </span>
                                <span style={{fontWeight: 400, fontSize: 12, marginTop: 2}}>Total</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 70}}>
                                <span style={{fontSize: 24, fontWeight: 900, color: '#5472d4', display: 'flex', alignItems: 'center', gap: 2}}>
                                    <FaRegClock fill="#5472d4" size={22} style={{marginRight: 2, verticalAlign: 'middle'}} /> {atividadesAbertas}
                                </span>
                                <span style={{fontWeight: 400, fontSize: 12, marginTop: 2}}>Abertas</span>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 70}}>
                                <span style={{fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2}}>
                                    {dadosCalculados.atividadesConcluidas}
                                </span>
                                <span style={{fontWeight: 400, fontSize: 12, marginTop: 2}}>Concluídas</span>
                            </div>
                        </div>
                        <div className="progress-bar-area" style={{width: '100%'}}>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fg" style={{width: `${dadosCalculados.totalAtividades ? (dadosCalculados.atividadesConcluidas/dadosCalculados.totalAtividades*100) : 0}%`}} />
                            </div>
                            <span className="progress-label">{dadosCalculados.totalAtividades ? ((dadosCalculados.atividadesConcluidas/dadosCalculados.totalAtividades*100).toFixed(1)) : 0}% concluídas</span>
                        </div>
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0 0 0'}}>
                            {dadosCalculados.abertasEstaSemana > 0 && (
                                <span style={{
                                    background: '#e3eafd',
                                    color: '#27408b',
                                    fontWeight: 400,
                                    borderRadius: 8,
                                    padding: '6px 16px',
                                    fontSize: 13,
                                    minWidth: 0,
                                    textAlign: 'center'
                                }}>
                                    <b style={{color: '#27408b', fontSize: 14}}>{dadosCalculados.abertasEstaSemana}</b> abertas esta semana
                                </span>
                            )}
                            {dadosCalculados.abertasPrazoHoje > 0 && (
                                <span style={{
                                    background: '#ffeaea',
                                    color: '#b71c1c',
                                    fontWeight: 400,
                                    borderRadius: 8,
                                    padding: '6px 16px',
                                    fontSize: 13,
                                    minWidth: 0,
                                    textAlign: 'center'
                                }}>
                                    <b style={{color: '#b71c1c', fontSize: 14}}>{dadosCalculados.abertasPrazoHoje}</b> com prazo final hoje
                                </span>
                            )}
                            {dadosCalculados.abertasPrioridadeAlta > 0 && (
                                <span style={{
                                    background: '#fff4e5',
                                    color: '#b26a00',
                                    fontWeight: 400,
                                    borderRadius: 8,
                                    padding: '6px 16px',
                                    fontSize: 13,
                                    minWidth: 0,
                                    textAlign: 'center'
                                }}>
                                    <b style={{color: '#b26a00', fontSize: 14}}>{dadosCalculados.abertasPrioridadeAlta}</b> com prioridade alta
                                </span>
                            )}
                            {(dadosCalculados.abertasEstaSemana === 0 && dadosCalculados.abertasPrazoHoje === 0 && dadosCalculados.abertasPrioridadeAlta === 0) && (
                                <span style={{
                                    color: '#888',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    background: '#f5f5f5',
                                    borderRadius: 16,
                                    padding: '6px 16px',
                                    minWidth: 0,
                                    textAlign: 'center'
                                }}>
                                    Nenhuma novidade relevante esta semana
                                </span>
                            )}
                        </div>
                        <hr style={{width: '100%', border: 'none', borderTop: '1px solid #f0f0f0', margin: '10px 0 8px 0'}} />
                        <div className="tags-entidade" style={{width: '100%'}}>
                            {Object.entries(dadosCalculados.abertasPorEntidade).map(([entidade, qtd], idx) => (
                                <span key={entidade}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        background: chartColors[idx % chartColors.length] + '18',
                                        color: '#222',
                                        borderRadius: 10,
                                        padding: '2px 10px',
                                        fontWeight: 500,
                                        fontSize: 12,
                                        marginTop: 2
                                    }}>
                                    {entidade}
                                    <span style={{
                                        background: chartColors[idx % chartColors.length],
                                        color: '#fff',
                                        borderRadius: 8,
                                        padding: '1px 6px',
                                        fontWeight: 700,
                                        fontSize: 12,
                                        marginLeft: 3
                                    }}>{qtd}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{
                        background: '#fff',
                        border: '1px solid var(--neutro-200)',
                        borderRadius: 20,
                        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
                        padding: 28,
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 16,
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8}}>
                            <span style={{fontWeight: 700, fontSize: 18}}>Status</span>
                            <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                                Ver mais&nbsp;<FaArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{
                            display: 'flex', gap: 18, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center'
                        }}>
                            {statusLabels.map((label, idx) => (
                                <span key={label} style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13}}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        background: statusColors[idx],
                                        marginRight: 4
                                    }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Chart type="doughnut" data={{...chartDataStatus, datasets: [{...chartDataStatus.datasets[0], backgroundColor: statusColors}]}} options={chartOptionsNoLegend} style={{maxWidth: 260, margin: '0 auto'}} />
                        </div>
                    </div>
                    <div style={{
                        background: '#fff',
                        border: '1px solid var(--neutro-200)',
                        borderRadius: 20,
                        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
                        padding: 28,
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 16,
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8}}>
                            <span style={{fontWeight: 700, fontSize: 18}}>Atividades por SLA</span>
                            <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                                Ver mais&nbsp;<FaArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{
                            display: 'flex', gap: 18, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center'
                        }}>
                            {chartDataSLA.labels.map((label, idx) => (
                                <span key={label} style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13}}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        background: slaColors[idx],
                                        marginRight: 4
                                    }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Chart type="pie" data={{...chartDataSLA, datasets: [{...chartDataSLA.datasets[0], backgroundColor: slaColors}]}} options={chartOptionsNoLegend} style={{maxWidth: 260, margin: '0 auto'}} />
                        </div>
                    </div>
                </div>
            )}
            {usuario?.tipo !== 'Outsourcing' && (
                dashboardCardMemo
            )}
            {cardsExtras.length > 0 && (
                <div style={{marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap'}}>
                    {cardsExtras}
                </div>
            )}
        </>
    )
}

export default Dashboard