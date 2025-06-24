import http from '@http'
import { useEffect, useState } from 'react'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Tag } from 'primereact/tag'
import { FaUserPlus, FaUserMinus, FaUmbrellaBeach, FaArrowRight, FaUserTimes, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { MdWork, MdBarChart, MdPieChart, MdTimeline } from 'react-icons/md';
import { Link } from 'react-router-dom';

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
    const [totalDemissoes, setTotalDemissoes] = useState(0)
    const [totalAdmissoes, setTotalAdmissoes] = useState(0)
    const [atividadesRaw, setAtividadesRaw] = useState([])

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

    useEffect(() => {
        if(usuarioEstaLogado) {
            if(!colaboradores) {
                http.get('funcionario/?format=json')
                .then(response => {
                    setColaboradores(response)
                })
                .catch(erro => {
                    setLoadingOpened(false)
                })
            }
            // Buscar atividades/tarefas
            http.get('tarefas/?format=json')
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

            // Buscar número de vagas
            http.get('vagas/').then(response => {
                setTotalVagas(Array.isArray(response) ? response.length : (response.count || 0));
            }).catch(() => setTotalVagas(0));

            // Buscar número de férias
            http.get('ferias/').then(response => {
                setTotalFerias(Array.isArray(response) ? response.length : (response.count || 0));
            }).catch(() => setTotalFerias(0));

            // Buscar número de demissões
            http.get('funcionario/?format=json&situacao=D').then(response => {
                setTotalDemissoes(Array.isArray(response) ? response.length : (response.count || 0));
            }).catch(() => setTotalDemissoes(0));

            // Buscar número de admissões
            http.get('admissao/').then(response => {
                setTotalAdmissoes(Array.isArray(response) ? response.length : (response.count || 0));
            }).catch(() => setTotalAdmissoes(0));
        }
    }, [usuarioEstaLogado, colaboradores])

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

    if (!colaboradores) {
        return <Loading opened={loadingOpened} />
    }

    // Monta dados diferentes conforme o tipo de usuário
    let dadosDashboard = {}
    let cardsExtras = []
    if (usuario?.tipo === 'RH') {
        dadosDashboard = {
            ...dashboardData,
            destaque: 'Bem-vindo RH!',
            totalAdmissoes: totalAdmissoes,
            totalDemissoes: totalDemissoes,
            totalFerias: totalFerias,
            totalVagas: totalVagas,
        }
    } else if (usuario?.tipo === 'Benefícios') {
        dadosDashboard = {
            ...dashboardData,
            destaque: 'Bem-vindo ao módulo de Benefícios!',
            saldoBeneficios: 15000,
            pedidosPendentes: 4,
            totalColaboradores: colaboradores.length,
        }
    } else if (usuario?.tipo === 'Outsourcing') {
        dadosDashboard = {
            ...dashboardData,
            destaque: 'Bem-vindo Outsourcing!',
            projetosAtivos: 5,
            totalColaboradores: colaboradores.length,
        }
    } else {
        dadosDashboard = {
            ...dashboardData,
            totalColaboradores: colaboradores.length,
        }
    }

    // Gráficos de atividades (só para RH ou Outsourcing)
    const mostrarAtividades = usuario?.tipo === 'RH' || usuario?.tipo === 'Outsourcing';
    
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

    // Paleta de cores para os gráficos
    const chartColors = [
        '#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8', '#ffb347', '#20c997', '#1a73e8', '#dc3545', '#ffa000', '#28a745', '#6f42c1', '#fd7e14'
    ];

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#222',
                    font: { size: 14, weight: 600 }
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

    // Atualizar os cards extras para usar ícones e visual moderno
    cardsExtras = [];

    const totalAtividades = atividadesRaw.length;

    return (
        <>
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
                        gap: 12,
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 6}}>
                            <span style={{fontWeight: 700, fontSize: 18}}>Atividades</span>
                            <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                                Ver mais&nbsp;<FaArrowRight size={15} />
                            </Link>
                        </div>
                        <div style={{fontSize: 32, fontWeight: 800, color: 'var(--primaria)'}}>{totalAtividades}</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 2, marginBottom: 8}}>
                            <span style={{fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4}}>
                                <FaCheckCircle color="#43a047" size={15} /> {atividadesConcluidas} concluídas
                            </span>
                            <span style={{fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4}}>
                                <FaRegClock color="#5472d4" size={15} /> {atividadesAbertas} abertas
                            </span>
                        </div>
                        <div style={{height: 8}} />
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                            {Object.entries(abertasPorEntidade).map(([entidade, qtd], idx) => (
                                <span key={entidade} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: chartColors[idx % chartColors.length] + '22',
                                    color: chartColors[idx % chartColors.length],
                                    borderRadius: 14, padding: '4px 12px', fontWeight: 600, fontSize: 13
                                }}>
                                    {entidadeIconMap[entidade]}
                                    {entidade}
                                    <span style={{
                                        background: chartColors[idx % chartColors.length],
                                        color: '#fff', borderRadius: 10, padding: '1px 8px',
                                        fontWeight: 700, fontSize: 13, marginLeft: 4
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
                                        background: chartColors[idx % chartColors.length],
                                        marginRight: 4
                                    }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Chart type="pie" data={{...chartDataSLA, datasets: [{...chartDataSLA.datasets[0], backgroundColor: chartColors}]}} options={chartOptionsNoLegend} style={{maxWidth: 260, margin: '0 auto'}} />
                        </div>
                    </div>
                </div>
            )}
            {usuario?.tipo !== 'Outsourcing' && (
                <DashboardCard dashboardData={dadosDashboard} colaboradores={colaboradores} />
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