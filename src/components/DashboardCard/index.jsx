
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import BadgeGeral from '@components/BadgeGeral'
import SubTitulo from '@components/SubTitulo'
import Container from '@components/Container'
import Frame from '@components/Frame'
import { Link } from 'react-router-dom'
import { 
    FaWallet, FaArrowRight, FaUser, FaFileAlt, FaUserPlus, FaUserMinus, 
    FaCalculator, FaLayerGroup, FaUmbrellaBeach, FaCheckCircle, FaCircle, 
    FaHourglass, FaChartLine, FaCalendarAlt, FaExclamationTriangle, 
    FaClock, FaUsers, FaBuilding, FaIdCard, FaClipboardList, FaChartBar,
    FaRegCalendarCheck, FaRegCalendarTimes, FaRegClock,
    FaRegCalendarAlt, FaRegChartBar, FaRegFileAlt, FaUserTimes
} from 'react-icons/fa'
import styles from './DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'
import { GrAddCircle } from 'react-icons/gr'
import { MdFilter9Plus, MdMan2, MdOutlineTimer, MdWoman, MdWoman2, MdWork, MdTrendingUp, MdTrendingDown } from 'react-icons/md'
import { IoMdTimer } from "react-icons/io";
import { AiOutlinePieChart } from 'react-icons/ai'
import { BsHourglassSplit, BsCalendarEvent, BsExclamationCircle } from 'react-icons/bs'
import { Timeline } from 'primereact/timeline'
import { Tag } from 'primereact/tag'
import { Chart } from 'primereact/chart'
import { ProgressBar } from 'primereact/progressbar'
import { useEffect, useState } from 'react'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next';
import http from '@http'
import { ArmazenadorToken } from '@utils'

function DashboardCard({ dashboardData, colaboradores = [], atividadesRaw = [], tipoUsuario = 'RH', funcionariosDashboard = {} }){
   
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [feriasData, setFeriasData] = useState([]);
    const [admissoesData, setAdmissoesData] = useState([]);
    const [vagasData, setVagasData] = useState([]);
    const [processosData, setProcessosData] = useState([]);
    const [tarefasData, setTarefasData] = useState([]);
    const [dadosProntos, setDadosProntos] = useState(false);
    const { t } = useTranslation('common');

    // Definições de variáveis do dashboard de funcionários
    const totalColaboradores = funcionariosDashboard?.funcionarios_ativos || 0;
    const novosColaboradoresMes = funcionariosDashboard?.admitidos_no_mes || 0;
    const demitidos = funcionariosDashboard?.funcionarios_demitidos || [];
    const totalDemitidos = funcionariosDashboard?.total_demitidos || 0;
    const demitidosNoMes = funcionariosDashboard?.demitidos_no_mes || 0;
    const funcionariosPorMotivoDemissao = funcionariosDashboard?.funcionarios_por_motivo_demissao || [];
    const totalVagasAbertas = funcionariosDashboard?.total_vagas_abertas || 0; // Novo campo

    // Dados de teste para verificar se o problema é nos dados ou no processamento
    const dadosTesteMotivos = [
        {
            "motivo_demissao__id": null,
            "motivo_demissao__descricao": null,
            "total": "96"
        },
        {
            "motivo_demissao__id": "7",
            "motivo_demissao__descricao": "Justa Causa",
            "total": "1"
        }
    ];

    // Array de cores para as etapas (cores que combinam com o sistema)
    const coresEtapas = [
        '#5472d4', // Azul primário
        '#66BB6A', // Verde sucesso
        '#FFA726', // Laranja warning
        '#e53935', // Vermelho danger
        '#9c27b0', // Roxo
        '#ff5722', // Laranja escuro
        '#607d8b', // Azul acinzentado
        '#795548', // Marrom
        '#009688', // Verde água
        '#ff9800'  // Laranja claro
    ];

    useEffect(() => {
        setIsVisible(true);
        
        // Detectar se é mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Função para carregar todos os dados de uma vez
        const carregarTodosOsDados = async () => {
            try {
                // Usar dados do funcionariosDashboard que já vem do endpoint /funcionario/dashboard/
                if (funcionariosDashboard) {
                    // Usar dados de férias do dashboard - usar os dados corretos da estrutura
                    if (funcionariosDashboard.ferias) {
                        // Usar os dados diretos do dashboard para férias
                        setFeriasData([{
                            ferias_vencidas: funcionariosDashboard.ferias.ferias_vencidas || 0,
                            ferias_proximas: funcionariosDashboard.ferias.ferias_proximas || 0,
                            ferias_solicitadas: funcionariosDashboard.ferias.ferias_solicitadas || 0,
                            ferias_marcadas: funcionariosDashboard.ferias.ferias_marcadas || 0,
                            proximas_ferias: funcionariosDashboard.ferias.proximas_ferias || []
                        }]);
                    } else {
                        setFeriasData([]);
                    }
                    
                    // Usar dados de admissões do dashboard
                    if (funcionariosDashboard.admissoes) {
                        setAdmissoesData([{
                            admissoes_andamento: funcionariosDashboard.admissoes.admissoes_andamento,
                            tempo_medio_admissao: funcionariosDashboard.admissoes.tempo_medio_admissao,
                            sla_admissao: funcionariosDashboard.admissoes.sla_admissao,
                            admissoes_por_etapa: funcionariosDashboard.admissoes.admissoes_por_etapa
                        }]);
                    } else {
                        setAdmissoesData([]);
                    }
                    
                    // Usar dados de demissões do dashboard
                    if (funcionariosDashboard.demissoes) {
                        setProcessosData([{
                            solicitacoes_demissao: funcionariosDashboard.demissoes.solicitacoes_demissao,
                            demissoes_concluidas: funcionariosDashboard.demissoes.demissoes_concluidas,
                            tempo_medio_demissao: funcionariosDashboard.demissoes.tempo_medio_demissao,
                            sla_demissao: funcionariosDashboard.demissoes.sla_demissao
                        }]);
                    } else {
                        setProcessosData([]);
                    }
                    
                    // Vagas não estão no dashboard ainda, manter vazio
                    setVagasData([]);
                    
                    // Tarefas não estão no dashboard, manter vazio por enquanto
                    setTarefasData([]);
                    } else {
                    // Se não há dados do dashboard, definir tudo como vazio
                                setFeriasData([]);
                                setAdmissoesData([]);
                                setVagasData([]);
                                setProcessosData([]);
                                setTarefasData([]);
                }
                
                // Marcar dados como prontos
                setTimeout(() => {
                    setDadosProntos(true);
                }, 100);

            } catch (error) {
                console.error('Erro geral ao carregar dados:', error);
                setDadosProntos(true); // Marcar como pronto mesmo com erro para não travar a interface
            }
        };
        
        // Executar carregamento apenas quando funcionariosDashboard estiver disponível
        if (funcionariosDashboard !== null) {
        carregarTodosOsDados();
        }
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, [funcionariosDashboard]); // Dependência do funcionariosDashboard

    // Usar opções apropriadas baseadas no tamanho da tela
    const getChartOptions = () => {
        return isMobile ? chartOptionsMobile : chartOptions;
    };

    // Processar dados reais de férias
    const processarDadosFerias = () => {
        if (!feriasData || feriasData.length === 0) {
            return {
                feriasVencidas: 0,
                feriasProximas: 0,
                pedidosFeriasAberto: 0,
                feriasAgendadas: []
            };
        }

        // Usar os dados diretos do dashboard
        const dadosFerias = feriasData[0];

        return {
            feriasVencidas: dadosFerias.ferias_vencidas || 0,
            feriasProximas: dadosFerias.ferias_proximas || 0,
            pedidosFeriasAberto: dadosFerias.ferias_solicitadas || 0,
            feriasAgendadas: dadosFerias.proximas_ferias || []
        };
    };

    const dadosFeriasReais = processarDadosFerias();

    // Processar dados de admissões
    const processarDadosAdmissoes = () => {
        if (!admissoesData || admissoesData.length === 0) {
            return {
                admissoesAndamento: 0,
                tempoMedioAdmissao: 0,
                etapasAdmissao: [],
                slaAdmissao: 0
            };
        }
        
        // Usar os dados diretos do dashboard
        const dadosAdmissoes = admissoesData[0];
        
        // Processar etapas do processo usando dados do dashboard
        const processarEtapasAdmissao = () => {
            if (!dadosAdmissoes.admissoes_por_etapa) {
                return [];
            }

            // Mapear etapas do dashboard para o formato esperado
            const etapas = Object.entries(dadosAdmissoes.admissoes_por_etapa).map(([etapa, quantidade], index) => {
                return {
                    etapa: etapa,
                    status: 'em_andamento', // Assumir que estão em andamento
                    quantidade: quantidade,
                    tarefas: [],
                    cor: coresEtapas[index % coresEtapas.length]
                };
            });

            return etapas;
        };

        const etapasAdmissao = processarEtapasAdmissao();

        return {
            admissoesAndamento: dadosAdmissoes.admissoes_andamento || 0,
            tempoMedioAdmissao: dadosAdmissoes.tempo_medio_admissao || 0,
            etapasAdmissao: etapasAdmissao,
            slaAdmissao: dadosAdmissoes.sla_admissao || 0
        };
    };

    const dadosAdmissoesReais = processarDadosAdmissoes();

    // Processar motivos de demissão separadamente - MOVER PARA ANTES DE processarDadosDemissoes
    const processarMotivosDemissao = () => {
        // Usar dados de teste se não houver dados reais
        const dadosParaProcessar = funcionariosPorMotivoDemissao.length > 0 ? funcionariosPorMotivoDemissao : dadosTesteMotivos;
        
        const motivosDemissao = dadosParaProcessar.reduce((acc, item) => {
            if (!item) return acc;
            
            const motivo = item.motivo_demissao__descricao || 'Não informado';
            const total = parseInt(item.total) || 0;
            
            if (total > 0) {
                acc[motivo] = total;
            }
            
            return acc;
        }, {});
        
        return motivosDemissao;
    };
    
    const motivosDemissaoProcessados = processarMotivosDemissao();

    // Processar dados de demissões
    const processarDadosDemissoes = () => {
        if (!processosData || processosData.length === 0) {
            return {
                demissoesMes: 0,
                demissoesProcessamento: 0,
                demissoesConcluidas: 0,
                tempoMedioDemissao: 0,
                motivosDemissao: {},
                slaDemissao: 0
            };
        }

        // Usar os dados diretos do dashboard
        const dadosDemissoes = processosData[0];

        return {
            demissoesMes: demitidosNoMes,
            demissoesProcessamento: dadosDemissoes.solicitacoes_demissao || 0,
            demissoesConcluidas: dadosDemissoes.demissoes_concluidas || 0,
            tempoMedioDemissao: dadosDemissoes.tempo_medio_demissao || 0,
            motivosDemissao: motivosDemissaoProcessados,
            slaDemissao: dadosDemissoes.sla_demissao || 0
        };
    };

    const dadosDemissoesReais = processarDadosDemissoes();
    
    // Função para calcular o turnover real
    const calcularTurnover = () => {
        if (!totalColaboradores || totalColaboradores === 0) return 0;
        return ((demitidosNoMes / totalColaboradores) * 100).toFixed(1);
    };

    // Calcular distribuição por filial usando dados do dashboard
    const calcularDistribuicaoFilial = () => {
        if (!funcionariosDashboard?.funcionarios_por_filial || funcionariosDashboard.funcionarios_por_filial.length === 0) {
            return {};
        }

        const distribuicao = {};
        funcionariosDashboard.funcionarios_por_filial.forEach(item => {
            if (item && item.filial__nome) {
                distribuicao[item.filial__nome] = parseInt(item.total) || 0;
            }
        });

        return distribuicao;
    };

    // Calcular distribuição por tipo de funcionário usando dados do dashboard
    const calcularDistribuicaoTipoFuncionario = () => {
        if (!funcionariosDashboard?.funcionarios_por_tipo || funcionariosDashboard.funcionarios_por_tipo.length === 0) {
            return {};
        }

        const distribuicao = {};
        funcionariosDashboard.funcionarios_por_tipo.forEach(item => {
            if (item && item.tipo_funcionario__descricao) {
                distribuicao[item.tipo_funcionario__descricao] = parseInt(item.total) || 0;
            }
        });

        return distribuicao;
    };

    const distribuicaoFilial = calcularDistribuicaoFilial();
    const distribuicaoTipoFuncionario = calcularDistribuicaoTipoFuncionario();

    // Dados mockados para demonstração - em produção viriam da API
    const dadosRH = {
        // Gestão de Colaboradores
        totalColaboradores: totalColaboradores,
        novosContratadosMes: novosColaboradoresMes,
        demissoesMes: demitidosNoMes,
        turnover: calcularTurnover(),
        
        // Distribuição por departamento
        distribuicaoDepartamentos: {
            'TI': 25,
            'Vendas': 18,
            'Marketing': 12,
            'Financeiro': 8,
            'RH': 6,
            'Operações': 31
        },

        // Admissões
        admissoesAndamento: dadosAdmissoesReais.admissoesAndamento,
        tempoMedioAdmissao: dadosAdmissoesReais.tempoMedioAdmissao, // dias
        etapasAdmissao: dadosAdmissoesReais.etapasAdmissao,

        // Férias - usando dados reais
        feriasVencidas: dadosFeriasReais.feriasVencidas,
        feriasProximas: dadosFeriasReais.feriasProximas,
        pedidosFeriasAberto: dadosFeriasReais.pedidosFeriasAberto,
        feriasAgendadas: dadosFeriasReais.feriasAgendadas,

        // Demissões - usando dados reais
        demissoesProcessamento: dadosDemissoesReais.demissoesProcessamento,
        demissoesConcluidas: dadosDemissoesReais.demissoesConcluidas,
        tempoMedioRescisao: dadosDemissoesReais.tempoMedioDemissao, // dias
        motivosDemissao: motivosDemissaoProcessados, // Usar motivos processados separadamente
        etapasDemissao: [],
        slaDemissao: dadosDemissoesReais.slaDemissao,
        vagasAbertas: totalVagasAbertas, // Usar o campo direto da API

        // Eficiência Operacional
        refacaoAdmissao: 12,
        refacaoDemissao: 5,
        tarefasVencidas: 7,
        slaAdmissao: dadosAdmissoesReais.slaAdmissao,
    };

    // Gráfico de distribuição por departamento
    const chartDataDepartamentos = {
        labels: Object.keys(distribuicaoTipoFuncionario),
        datasets: [{
            data: Object.values(distribuicaoTipoFuncionario),
            backgroundColor: ['#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8', '#ffb347'],
            borderWidth: 0
        }]
    };

    // Gráfico de distribuição por filial
    const chartDataFiliais = {
        labels: Object.keys(distribuicaoFilial),
        datasets: [{
            data: Object.values(distribuicaoFilial),
            backgroundColor: ['#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8'],
            borderWidth: 0
        }]
    };

    // Gráfico de motivos de demissão
    const chartDataMotivos = {
        labels: Object.keys(dadosRH.motivosDemissao).map(label => {
            // Encurtar labels muito longos
            if (label === 'Não informado') return 'Não informado';
            if (label === 'Pedido do Colaborador') return 'Pedido Colaborador';
            if (label === 'Fim de Contrato') return 'Fim Contrato';
            return label;
        }),
        datasets: [{
            data: Object.values(dadosRH.motivosDemissao),
            backgroundColor: ['#5472d4', '#e53935', '#FFA726', '#66BB6A', '#9c27b0', '#ff5722', '#607d8b', '#795548', '#009688', '#ff9800'],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'start',
                labels: {
                    color: '#222',
                    font: { size: 13, weight: 500 },
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 12,
                    boxHeight: 12
                }
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#222',
                bodyColor: '#222',
                borderColor: 'var(--primaria)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        },
        layout: {
            padding: {
                right: 80,
                left: 10,
                top: 10,
                bottom: 10
            }
        },
        elements: {
            arc: { borderRadius: 8 },
            bar: { 
                borderRadius: 4,
                borderSkipped: false,
                borderWidth: 0
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 0,
                    padding: 8
                },
                barPercentage: 0.8,
                categoryPercentage: 0.9
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0'
                },
                ticks: {
                    padding: 8
                }
            }
        }
    };

    const chartOptionsMobile = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: {
                ...chartOptions.plugins.legend,
                position: 'bottom',
                align: 'center',
                labels: {
                    ...chartOptions.plugins.legend.labels,
                    font: { size: 12, weight: 500 }
                }
            }
        }
    };

    const chartOptionsNoLegend = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { display: false }
        }
    };

    function getSeverity(status) {
        switch(status) {
            case 'Em preparação':
                return "neutral";
            case 'Em validação':
                return "warning";
            case 'Em aprovação':
                return "info";
            case 'Pedido Realizado':
                return "success";
            case 'concluida':
                return "success";
            case 'em_andamento':
                return "info";
            case 'pendente':
                return "warning";
            case 'aprovado':
                return "success";
            // Status de férias corretos
            case 'G': // Aguardando Aprovação do Gestor
                return "warning";
            case 'D': // Aguardando Aprovação do DP
                return "info";
            case 'M': // Marcadas
                return "success";
            case 'P': // Pagas
                return "success";
            case 'F': // Finalizadas
                return "danger";
            case 'X': // Finalizadas para o próximo mês
                return "danger";
            // Status antigos (mantidos para compatibilidade)
            case 'A': // Aprovada
                return "success";
            case 'C': // Cancelada
                return "danger";
            case 'S': // Solicitada
                return "info";
            case 'E': // Em Andamento
                return "info";
            case 'R': // Rejeitada
                return "danger";
            default:
                return "info";
        }
    }

    function getSeverityColor(status) {
        switch(status) {
            case 'success':
                return "#66BB6A";
            case 'info':
                return "#5472d4";
            case 'warning':
                return "#FFA726";
            case 'danger':
                return "#e53935";
            case 'neutral':
                return "#8884d8";
            default:
                return "#8884d8";
        }
    }

    // Renderizar dashboard de RH
    return (
        <>
            {/* 👥 Gestão de Colaboradores */}
            <div className="dashboard-rh-grid" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '24px',
                marginBottom: '24px',
                width: '100%',
                alignItems: 'stretch'
            }}>
                {/* Coluna 1: Métricas principais */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t("colaborators_management")}</h6></Titulo>
                        <Link to="/colaborador">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                {t("see_all")} <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-primary">
                                <FaUsers /> {dadosRH.totalColaboradores}
                            </div>
                            <div className="metric-label">{t("total_active")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaUserPlus /> {dadosRH.novosContratadosMes}
                            </div>
                            <div className="metric-label">Novos (Mês)</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-danger">
                                <FaUserMinus /> {dadosRH.demissoesMes}
                            </div>
                            <div className="metric-label">Saídas (Mês)</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-warning">
                                <MdTrendingUp /> {dadosRH.turnover}%
                            </div>
                            <div className="metric-label">{t("turnover")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-primary">
                                <MdWork /> {dadosRH.vagasAbertas}
                            </div>
                            <div className="metric-label">{t("open_positions")}</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>{t("distribution")}</h6></Titulo>
                    </Frame>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 24}}>
                        <div>
                            <div style={{fontWeight: 600, fontSize: 15, marginBottom: 8}}>{t("employee_type")}</div>
                            {dadosProntos && Object.keys(distribuicaoTipoFuncionario).length > 0 ? (
                                <div className="chart-container" style={{width: '100%', height: '180px'}}>
                                    <Chart type="bar" data={chartDataDepartamentos} options={chartOptionsNoLegend} style={{width: '100%', height: '100%'}} />
                                </div>
                            ) : dadosProntos ? (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#888', fontSize: '14px', fontStyle: 'italic'}}>
                                    {t('no_data')}
                                </div>
                            ) : (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#888', fontSize: '14px'}}>
                                    {t("loading...")}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{fontWeight: 600, fontSize: 15, marginBottom: 8}}>Por Filial</div>
                            {dadosProntos && Object.keys(distribuicaoFilial).length > 0 ? (
                                <div className="chart-container" style={{width: '100%', height: '180px'}}>
                                    <Chart type="bar" data={chartDataFiliais} options={chartOptionsNoLegend} style={{width: '100%', height: '100%'}} />
                                </div>
                            ) : dadosProntos ? (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#888', fontSize: '14px', fontStyle: 'italic'}}>
                                    {t('no_data')}
                                </div>
                            ) : (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#888', fontSize: '14px'}}>
                                    {t("loading...")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Admissões */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t("hirings")}</h6></Titulo>
                        <Link to="/admissao">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                {t("see_all")} <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-info">
                                <FaUserPlus /> {dadosRH.admissoesAndamento}
                            </div>
                            <div className="metric-label">Em Andamento</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-warning">
                                <FaClock /> {dadosRH.tempoMedioAdmissao}d
                            </div>
                            <div className="metric-label">{t("average_time")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaChartLine /> {dadosRH.slaAdmissao}%
                            </div>
                            <div className="metric-label">{t("sla")}</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>{t("process_steps")}</h6></Titulo>
                    </Frame>
                    <div className="etapas-list" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                        {dadosRH.etapasAdmissao.length > 0 ? (
                            dadosRH.etapasAdmissao.map((etapa, index) => (
                                <div key={index} className="etapa-item" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 18px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: `1.5px solid ${etapa.cor}22`,
                                    boxShadow: '0 1px 4px 0 rgba(60,60,60,0.04)',
                                    minHeight: 0,
                                    margin: 0,
                                    gap: 12
                                }}>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                            <span style={{
                                                width: 12, height: 12, borderRadius: '50%', background: etapa.cor, display: 'inline-block', flexShrink: 0
                                            }} />
                                            <span style={{fontWeight: 700, fontSize: 14, color: '#222', lineHeight: 1.1}}>{etapa.etapa}</span>
                                        </div>
                                        <span style={{fontSize: 13, color: '#888', fontWeight: 500, marginLeft: 20}}>{t("completed")}</span>
                                    </div>
                                    <span style={{
                                        background: `${etapa.cor}10`,
                                        color: etapa.cor,
                                        fontWeight: 700,
                                        borderRadius: 20,
                                        padding: '4px 18px',
                                        fontSize: 16,
                                        border: `1.5px solid ${etapa.cor}22`,
                                        display: 'flex', alignItems: 'center', gap: 4
                                    }}>
                                        {etapa.quantidade} <span style={{fontWeight: 400, fontSize: 14, color: etapa.cor, marginLeft: 2}}>processos</span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', color: '#888', fontSize: 14, fontStyle: 'italic', padding: '18px 0'}}>{t("no_processes_in_progress")}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🌴 Férias + ❌ Demissões */}
            <div className="dashboard-rh-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px',
                width: '100%',
                alignItems: 'stretch'
            }}>
                {/* Coluna 1: Férias */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t("vacations")}</h6></Titulo>
                        <Link to="/ferias">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                {t("see_all")} <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-danger">
                                <FaExclamationTriangle /> {dadosRH.feriasVencidas}
                            </div>
                            <div className="metric-label">{t("expireds")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-warning">
                                <FaRegCalendarCheck /> {dadosRH.feriasProximas}
                            </div>
                            <div className="metric-label">{t("nexts")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-info">
                                <FaRegFileAlt /> {dadosRH.pedidosFeriasAberto}
                            </div>
                            <div className="metric-label">Pedidos Abertos</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaRegCalendarCheck /> {dadosRH.feriasAgendadas.length}
                            </div>
                            <div className="metric-label">Agendadas</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>{t("next_scheduled_vacations")}</h6></Titulo>
                    </Frame>
                    <div className="ferias-list">
                        {dadosRH.feriasAgendadas.length > 0 ? (
                            dadosRH.feriasAgendadas.map((ferias, index) => (
                                <div key={index} className="ferias-item">
                                    <div className="ferias-info">
                                        <div className="ferias-colaborador">{ferias.nome_colaborador}</div>
                                        <div className="ferias-periodo">
                                            {ferias.data_inicio && ferias.data_fim ? 
                                                `${new Date(ferias.data_inicio).toLocaleDateString('pt-BR')} - ${new Date(ferias.data_fim).toLocaleDateString('pt-BR')} (${ferias.numero_dias} dias)` :
                                                `${ferias.data_inicio} - ${ferias.data_fim} (${ferias.numero_dias} dias)`
                                            }
                                        </div>
                                    </div>
                                    <Tag severity={getSeverity(ferias.status)} value={ferias.status} />
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', color: '#888', fontSize: '14px', fontStyle: 'italic', padding: '18px 0'}}>
                                Nenhuma férias agendada
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Demissões */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>{t("terminations")}</h6></Titulo>
                        <Link to="/demissao">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                {t("see_all")} <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-info">
                                <FaUserTimes /> {dadosRH.demissoesProcessamento}
                            </div>
                            <div className="metric-label">Em Processamento</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaCheckCircle /> {dadosRH.demissoesConcluidas}
                            </div>
                            <div className="metric-label">{t("completed")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-warning">
                                <FaClock /> {dadosRH.tempoMedioRescisao}d
                            </div>
                            <div className="metric-label">{t("average_time")}</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaChartLine /> {dadosRH.slaDemissao}%
                            </div>
                            <div className="metric-label">{t("sla")}</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>{t("termination_reasons")}</h6></Titulo>
                    </Frame>
                    <div className="chart-container" style={{height: '250px', width: '100%'}}>
                        {dadosProntos && Object.keys(dadosRH.motivosDemissao).length > 0 ? (
                            <Chart type="bar" data={chartDataMotivos} options={chartOptionsNoLegend} />
                        ) : dadosProntos ? (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: '14px', fontStyle: 'italic'}}>
                                {t('no_data')}
                            </div>
                        ) : (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', fontSize: '14px'}}>
                                {t("loading...")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </> 
    );
}

export default DashboardCard