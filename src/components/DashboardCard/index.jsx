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
    const totalColaboradores = funcionariosDashboard.total_funcionarios || 0;
    const novosColaboradoresMes = funcionariosDashboard.admitidos_no_mes || 0;
    const demitidos = funcionariosDashboard.funcionarios_demitidos || [];
    const totalDemitidos = funcionariosDashboard.total_demitidos || 0;
    const demitidosNoMes = funcionariosDashboard.demitidos_no_mes || 0;
    const funcionariosPorMotivoDemissao = funcionariosDashboard.funcionarios_por_motivo_demissao || [];
    
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
                
                // Carregar todos os dados em paralelo
                const [feriasResponse, admissoesResponse, vagasResponse, processosResponse, tarefasResponse] = await Promise.allSettled([
                    http.get('ferias/?format=json'),
                    http.get('admissao/?format=json'),
                    http.get('vagas/?format=json'),
                    http.get('processos/?format=json'),
                    http.get('tarefas/?format=json')
                ]);

                // Processar resposta de férias
                if (feriasResponse.status === 'fulfilled') {
                    let dadosFerias = feriasResponse.value;
                    if (dadosFerias && dadosFerias.results) {
                        dadosFerias = dadosFerias.results;
                    } else if (!Array.isArray(dadosFerias)) {
                        dadosFerias = [];
                    }
                    setFeriasData(dadosFerias);
                } else {
                    setFeriasData([]);
                }

                // Processar resposta de admissões
                if (admissoesResponse.status === 'fulfilled') {
                    let dadosAdmissoes = admissoesResponse.value;
                    if (dadosAdmissoes && dadosAdmissoes.results) {
                        dadosAdmissoes = dadosAdmissoes.results;
                    } else if (!Array.isArray(dadosAdmissoes)) {
                        dadosAdmissoes = [];
                    }
                    setAdmissoesData(dadosAdmissoes);
                } else {
                    setAdmissoesData([]);
                }

                // Processar resposta de vagas
                if (vagasResponse.status === 'fulfilled') {
                    let dadosVagas = vagasResponse.value;
                    if (dadosVagas && dadosVagas.results) {
                        dadosVagas = dadosVagas.results;
                    } else if (!Array.isArray(dadosVagas)) {
                        dadosVagas = [];
                    }
                    setVagasData(dadosVagas);
                } else {
                    setVagasData([]);
                }



                // Processar resposta de processos
                if (processosResponse.status === 'fulfilled') {
                    let dadosProcessos = processosResponse.value;
                    if (dadosProcessos && dadosProcessos.results) {
                        dadosProcessos = dadosProcessos.results;
                    } else if (!Array.isArray(dadosProcessos)) {
                        dadosProcessos = [];
                    }
                    setProcessosData(dadosProcessos);
                } else {
                    setProcessosData([]);
                }

                // Processar resposta de tarefas (último para otimizar gráficos)
                if (tarefasResponse.status === 'fulfilled') {
                    let dadosTarefas = tarefasResponse.value;
                    if (dadosTarefas && dadosTarefas.results) {
                        dadosTarefas = dadosTarefas.results;
                    } else if (!Array.isArray(dadosTarefas)) {
                        dadosTarefas = [];
                    }
                    setTarefasData(dadosTarefas);
                } else {
                    setTarefasData([]);
                }
                
                // Marcar dados como prontos após um pequeno delay para garantir que todos os estados foram atualizados
                setTimeout(() => {
                    setDadosProntos(true);
                }, 100);

            } catch (error) {
                console.error('Erro geral ao carregar dados:', error);
                setDadosProntos(true); // Marcar como pronto mesmo com erro para não travar a interface
            }
        };
        
        // Executar carregamento apenas uma vez
        carregarTodosOsDados();
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []); // Dependências vazias para executar apenas uma vez

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

        const hoje = new Date();
        const proximos30Dias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        let feriasVencidas = 0;
        let feriasProximas = 0;
        let pedidosFeriasAberto = 0;
        const feriasAgendadas = [];

        feriasData.forEach((ferias, index) => {
            // Validar se os campos necessários existem
            if (!ferias.dt_inicio || !ferias.dt_fim || !ferias.funcionario_nome) {
                return;
            }

            // Usar os campos corretos da API
            const dataInicio = new Date(ferias.dt_inicio);
            const dataFim = new Date(ferias.dt_fim);
            const situacao = ferias.situacaoferias || 'N/A';
            const colaboradorNome = ferias.funcionario_nome;
            const nrodiasferias = ferias.nrodiasferias || 0;
            
            // Validar se as datas são válidas
            if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
                return;
            }
            
            // Verificar se as férias já passaram (vencidas) - data fim menor que hoje
            if (dataFim < hoje) {
                feriasVencidas++;
            }
            
            // Verificar se as férias estão próximas (próximos 30 dias)
            if (dataInicio >= hoje && dataInicio <= proximos30Dias) {
                feriasProximas++;
            }
            
            // Contar pedidos abertos (status G = Aguardando Aprovação do Gestor, D = Aguardando Aprovação do DP)
            if (situacao === 'G' || situacao === 'D') {
                pedidosFeriasAberto++;
            }
            
            // Adicionar às férias agendadas (apenas as futuras ou em andamento)
            // Incluir férias marcadas (M), pagas (P) e aguardando aprovação (G, D)
            if (dataFim >= hoje && (situacao === 'M' || situacao === 'P' || situacao === 'G' || situacao === 'D')) {
                feriasAgendadas.push({
                    colaborador: colaboradorNome,
                    inicio: ferias.dt_inicio,
                    fim: ferias.dt_fim,
                    status: situacao,
                    nrodiasferias: nrodiasferias,
                    situacaoferias: situacao
                });
            }
        });

        // Ordenar férias agendadas por data de início (mais próximas primeiro)
        feriasAgendadas.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

        return {
            feriasVencidas,
            feriasProximas,
            pedidosFeriasAberto,
            feriasAgendadas: feriasAgendadas.slice(0, 3) // Limitar a 3 para o dashboard
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
        
        // Contar todas as admissões como "em andamento" (sem validar status)
        const admissoesAndamento = admissoesData.length;

        // Calcular tempo médio de admissão (em dias)
        const admissoesConcluidas = admissoesData.filter(admissao => 
            admissao && admissao.dt_admissao // Validar se a admissão não é null e tem dt_admissao
        );

        let tempoMedioAdmissao = 0;
        if (admissoesConcluidas.length > 0) {
            const temposAdmissao = admissoesConcluidas.map(admissao => {
                if (admissao?.created_at && admissao.dt_admissao) {
                    const inicio = new Date(admissao.created_at);
                    const fim = new Date(admissao.dt_admissao);
                    return Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
                }
                return 0;
            }).filter(tempo => tempo > 0);

            if (temposAdmissao.length > 0) {
                tempoMedioAdmissao = Math.round(temposAdmissao.reduce((a, b) => a + b, 0) / temposAdmissao.length);
            }
        }

        // Processar etapas do processo usando dados reais de tarefas
        const processarEtapasAdmissao = () => {
            if (!tarefasData || tarefasData.length === 0) {
                return [];
            }


            // Filtrar tarefas de admissão
            const tarefasAdmissao = tarefasData.filter(tarefa => 
                tarefa && (tarefa.entidade_tipo === 'admissao' || tarefa.entidade_display === 'admissao')
            );


            if (tarefasAdmissao.length === 0) {
                return [];
            }

            // Agrupar tarefas por tipo_display (etapa)
            const etapasAgrupadas = tarefasAdmissao.reduce((acc, tarefa) => {
                const tipoDisplay = tarefa.tipo_display || 'Etapa do Processo';
                
                if (!acc[tipoDisplay]) {
                    acc[tipoDisplay] = [];
                }
                acc[tipoDisplay].push(tarefa);
                return acc;
            }, {});


            // Mapear etapas agrupadas para o formato esperado
            const etapas = Object.entries(etapasAgrupadas).map(([tipoDisplay, tarefas], index) => {
                // Determinar status baseado na situação mais recente das tarefas
                const statusCounts = tarefas.reduce((counts, tarefa) => {
                    const status = tarefa.status || 'pendente';
                    counts[status] = (counts[status] || 0) + 1;
                    return counts;
                }, {});

                // Determinar status predominante
                let status = 'pendente';
                if (statusCounts['concluida'] > 0) {
                    status = 'concluida';
                } else if (statusCounts['em_andamento'] > 0) {
                    status = 'em_andamento';
                }

                return {
                    etapa: tipoDisplay,
                    status: status,
                    quantidade: tarefas.length,
                    tarefas: tarefas,
                    cor: coresEtapas[index % coresEtapas.length] // Distribuir cores ciclicamente
                };
            });

            // Ordenar etapas por ordem lógica (se possível)
            const ordemEtapas = [
                'Documentação',
                'Exame Médico', 
                'Assinatura Contrato',
                'Integração',
                'Upload',
                'Aguardar',
                'Email',
                'LGPD'
            ];

            etapas.sort((a, b) => {
                const indexA = ordemEtapas.findIndex(etapa => a.etapa.includes(etapa));
                const indexB = ordemEtapas.findIndex(etapa => b.etapa.includes(etapa));
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            return etapas.slice(0, 4); // Limitar a 4 etapas para não ficar muito grande
        };

        const etapasAdmissao = processarEtapasAdmissao();

        // Calcular SLA baseado no tempo médio
        let slaAdmissao = 0;
        if (tempoMedioAdmissao > 0) {
            if (tempoMedioAdmissao <= 15) {
                slaAdmissao = 95; // Excelente: até 15 dias
            } else if (tempoMedioAdmissao <= 30) {
                slaAdmissao = 85; // Bom: até 30 dias
            } else if (tempoMedioAdmissao <= 45) {
                slaAdmissao = 70; // Médio: até 45 dias
            } else {
                slaAdmissao = 50; // Ruim: acima de 45 dias
            }
        }

        return {
            admissoesAndamento,
            tempoMedioAdmissao,
            etapasAdmissao,
            slaAdmissao
        };
    };

    // Calcular novos colaboradores baseados na dt_admissao
    const calcularNovosColaboradores = () => {
        if (!colaboradores || colaboradores.length === 0) {
            return 0;
        }

        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        const novosColaboradores = colaboradores.filter(colaborador => {
            // Validar se o colaborador não é null/undefined
            if (!colaborador || !colaborador.dt_admissao) {
                return false;
            }

            const dataAdmissao = new Date(colaborador.dt_admissao);
            const isAdmissaoEsteMes = dataAdmissao >= inicioMes && dataAdmissao <= fimMes;
            
            return isAdmissaoEsteMes;
        }).length;

        return novosColaboradores;
    };

    const dadosAdmissoesReais = processarDadosAdmissoes();

    // Processar dados de demissões
    const processarDadosDemissoes = () => {
        // Não há API de demissões, usar apenas dados do dashboard e tarefas

        // Usar dados do dashboard para demissões do mês
        const demissoesMes = demitidosNoMes;

        // Contar demissões em processamento usando etapas do processo de demissão
        const calcularDemissoesProcessamento = () => {
            if (!tarefasData || tarefasData.length === 0) {
                return 0;
            }

            // Filtrar tarefas de demissão
            const tarefasDemissao = tarefasData.filter(tarefa => 
                tarefa && (tarefa.entidade_tipo === 'demissao' || tarefa.entidade_display === 'demissao')
            );

            if (tarefasDemissao.length === 0) {
                return 0;
            }

            // Agrupar tarefas por tipo_display (etapa) e contar processos únicos
            const processosPorEtapa = tarefasDemissao.reduce((acc, tarefa) => {
                if (!tarefa) return acc;
                
                const tipoDisplay = tarefa.tipo_display || 'Etapa do Processo';
                const entidadeId = tarefa.entidade_id || tarefa.entidade;
                
                if (!acc[tipoDisplay]) {
                    acc[tipoDisplay] = new Set();
                }
                acc[tipoDisplay].add(entidadeId);
                return acc;
            }, {});

            // Contar total de processos únicos em todas as etapas
            const todosProcessos = new Set();
            Object.values(processosPorEtapa).forEach(processos => {
                processos.forEach(processo => todosProcessos.add(processo));
            });

            return todosProcessos.size;
        };

        const demissoesProcessamento = calcularDemissoesProcessamento();

        // Contar demissões concluídas usando dados do dashboard
        const demissoesConcluidas = totalDemitidos;

        // Tempo médio de demissão - usar valor padrão ou calcular com base nas tarefas
        let tempoMedioDemissao = 15; // Valor padrão em dias

        // Contar por tipo de demissão - removido, agora processado separadamente
        const motivosDemissao = {};
        // Calcular SLA baseado no tempo médio
        let slaDemissao = 0;
        if (tempoMedioDemissao > 0) {
            if (tempoMedioDemissao <= 10) {
                slaDemissao = 95; // Excelente: até 10 dias
            } else if (tempoMedioDemissao <= 20) {
                slaDemissao = 85; // Bom: até 20 dias
            } else if (tempoMedioDemissao <= 30) {
                slaDemissao = 70; // Médio: até 30 dias
            } else {
                slaDemissao = 50; // Ruim: acima de 30 dias
            }
        }

        return {
            demissoesMes,
            demissoesProcessamento,
            demissoesConcluidas,
            tempoMedioDemissao,
            motivosDemissao,
            slaDemissao
        };
    };

    // Função para mapear tipo de demissão para motivo legível
    const getMotivoDemissao = (tipoDemissao) => {
        const motivos = {
            '1': 'Pedido do Colaborador',
            '2': 'Justa Causa',
            '3': 'Fim de Contrato',
            '4': 'Reestruturação',
            '5': 'Aposentadoria',
            '6': 'Falecimento',
            '7': 'Transferência',
            '8': 'Promoção',
            '9': 'Readaptação',
            '10': 'Outros'
        };
        return motivos[tipoDemissao] || 'Não informado';
    };

    const dadosDemissoesReais = processarDadosDemissoes();
    
    // Processar motivos de demissão separadamente
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

    // Contar vagas abertas
    const contarVagasAbertas = () => {
        if (!vagasData || vagasData.length === 0) return 0;
        // Ajuste o filtro conforme o status real de vaga aberta
        return vagasData.filter(vaga => vaga && (vaga.status === 'A' || vaga.status === 'aberta' || vaga.status === 'Aberta')).length;
    };
    const vagasAbertas = contarVagasAbertas();

    // Função para calcular o turnover real
    const calcularTurnover = () => {
        if (!totalColaboradores || totalColaboradores === 0) return 0;
        return ((demitidosNoMes / totalColaboradores) * 100).toFixed(1);
    };

    // Processar etapas do processo de demissão usando dados reais de tarefas
    const processarEtapasDemissao = () => {
        if (!tarefasData || tarefasData.length === 0) {
            return [];
        }

        // Filtrar tarefas de demissão
        const tarefasDemissao = tarefasData.filter(tarefa => 
            tarefa && (tarefa.entidade_tipo === 'demissao' || tarefa.entidade_display === 'demissao')
        );

        if (tarefasDemissao.length === 0) {
            return [];
        }

        // Agrupar tarefas por tipo_display (etapa)
        const etapasAgrupadas = tarefasDemissao.reduce((acc, tarefa) => {
            if (!tarefa) return acc;
            
            const tipoDisplay = tarefa.tipo_display || 'Etapa do Processo';
            
            if (!acc[tipoDisplay]) {
                acc[tipoDisplay] = [];
            }
            acc[tipoDisplay].push(tarefa);
            return acc;
        }, {});

        // Mapear etapas agrupadas para o formato esperado
        const etapas = Object.entries(etapasAgrupadas).map(([tipoDisplay, tarefas], index) => {
            // Determinar status baseado na situação mais recente das tarefas
            const statusCounts = tarefas.reduce((counts, tarefa) => {
                const status = tarefa.status || 'pendente';
                counts[status] = (counts[status] || 0) + 1;
                return counts;
            }, {});

            // Determinar status predominante
            let status = 'pendente';
            if (statusCounts['concluida'] > 0) {
                status = 'concluida';
            } else if (statusCounts['em_andamento'] > 0) {
                status = 'em_andamento';
            }

            return {
                etapa: tipoDisplay,
                status: status,
                quantidade: tarefas.length,
                tarefas: tarefas,
                cor: coresEtapas[index % coresEtapas.length] // Distribuir cores ciclicamente
            };
        });

        // Ordenar etapas por ordem lógica para demissão
        const ordemEtapas = [
            'Documentação',
            'Aviso Prévio',
            'Rescisão', 
            'Entrega',
            'Upload',
            'Aguardar'
        ];

        etapas.sort((a, b) => {
            const indexA = ordemEtapas.findIndex(etapa => a.etapa.includes(etapa));
            const indexB = ordemEtapas.findIndex(etapa => b.etapa.includes(etapa));
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });

        return etapas.slice(0, 4); // Limitar a 4 etapas
    };

    const etapasDemissao = processarEtapasDemissao();

    // Calcular distribuição por filial usando dados do dashboard
    const calcularDistribuicaoFilial = () => {
        if (!funcionariosDashboard.funcionarios_por_filial || funcionariosDashboard.funcionarios_por_filial.length === 0) {
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
        if (!funcionariosDashboard.funcionarios_por_tipo || funcionariosDashboard.funcionarios_por_tipo.length === 0) {
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
        etapasDemissao: etapasDemissao,
        slaDemissao: dadosDemissoesReais.slaDemissao,
        vagasAbertas,

        // Eficiência Operacional
        refacaoAdmissao: 12,
        refacaoDemissao: 5,
        tarefasVencidas: 7,
        slaAdmissao: dadosAdmissoesReais.slaAdmissao,
    };
    


    // Dados mockados para Benefícios
    const dadosBeneficios = {
        // Resumo Geral
        totalColaboradoresComBeneficios: 145,
        colaboradoresSemBeneficio: 12,
        valorMedioMensalPorColaborador: 850.50,
        rankingBeneficios: {
            'Vale Refeição': 89,
            'Vale Alimentação': 67,
            'Plano de Saúde': 45,
            'Plano Odontológico': 23,
            'Gympass': 18
        },

        // Pedidos
        pedidos: [
            { 
                titulo: 'Vale Alimentação', 
                dataPedido: '25/02/2025', 
                referencia: "03/2025", 
                statusAtual: 'Em validação', 
                total_colaboradores: 5, 
                valor: 15630.00,
                fornecedor: 'Sodexo'
            },
            { 
                titulo: 'Vale Refeição', 
                dataPedido: '26/02/2025', 
                referencia: "03/2025", 
                statusAtual: 'Em preparação', 
                total_colaboradores: 2, 
                valor: 9870.00,
                fornecedor: 'Alelo'
            },
            { 
                titulo: 'Plano de Saúde', 
                dataPedido: '24/02/2025', 
                referencia: "03/2025", 
                statusAtual: 'Em aprovação', 
                total_colaboradores: 8, 
                valor: 24500.00,
                fornecedor: 'Unimed'
            },
            { 
                titulo: 'Gympass', 
                dataPedido: '23/02/2025', 
                referencia: "03/2025", 
                statusAtual: 'Pedido Realizado', 
                total_colaboradores: 3, 
                valor: 4500.00,
                fornecedor: 'Gympass'
            }
        ],

        // Alertas/Pendências
        falhasEnvio: 2,
        documentosPendentes: 5,
        aguardandoFornecedor: 3,

        // Histórico
        evolucaoMensal: {
            'Jan/2025': 12,
            'Fev/2025': 15,
            'Mar/2025': 18,
            'Abr/2025': 14,
            'Mai/2025': 20
        },

        // Elegibilidades Configuradas
        elegibilidades: [
            {
                beneficio: 'Vale Refeição',
                fornecedor: 'Alelo',
                filiais: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
                funcoesElegiveis: ['Analista', 'Coordenador', 'Gerente'],
                funcoesDesconsideradas: ['Estagiário', 'Jovem Aprendiz'],
                regraCoexistencia: 'Único por categoria',
                tempoMinimoCasa: '30 dias',
                idadeMaxima: '65 anos',
                dependentes: {
                    maximo: 3,
                    grauPermitido: '1º e 2º grau',
                    idadeMaxima: '24 anos'
                },
                status: 'ativo',
                colaboradoresElegiveis: 89
            },
            {
                beneficio: 'Vale Alimentação',
                fornecedor: 'Sodexo',
                filiais: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'],
                funcoesElegiveis: ['Analista', 'Coordenador', 'Gerente', 'Diretor'],
                funcoesDesconsideradas: ['Estagiário'],
                regraCoexistencia: 'Pode coexistir com VR',
                tempoMinimoCasa: 'Imediato',
                idadeMaxima: 'Sem limite',
                dependentes: {
                    maximo: 0,
                    grauPermitido: 'Não aplicável',
                    idadeMaxima: 'Não aplicável'
                },
                status: 'ativo',
                colaboradoresElegiveis: 67
            },
            {
                beneficio: 'Plano de Saúde',
                fornecedor: 'Unimed',
                filiais: ['Todas as filiais'],
                funcoesElegiveis: ['Analista', 'Coordenador', 'Gerente', 'Diretor'],
                funcoesDesconsideradas: ['Estagiário', 'Jovem Aprendiz'],
                regraCoexistencia: 'Único por categoria',
                tempoMinimoCasa: '90 dias',
                idadeMaxima: '70 anos',
                dependentes: {
                    maximo: 5,
                    grauPermitido: '1º grau',
                    idadeMaxima: '21 anos'
                },
                status: 'ativo',
                colaboradoresElegiveis: 45
            },
            {
                beneficio: 'Plano Odontológico',
                fornecedor: 'Uniodonto',
                filiais: ['São Paulo', 'Rio de Janeiro'],
                funcoesElegiveis: ['Coordenador', 'Gerente', 'Diretor'],
                funcoesDesconsideradas: ['Analista', 'Estagiário', 'Jovem Aprendiz'],
                regraCoexistencia: 'Pode coexistir com PS',
                tempoMinimoCasa: '180 dias',
                idadeMaxima: '65 anos',
                dependentes: {
                    maximo: 3,
                    grauPermitido: '1º grau',
                    idadeMaxima: '18 anos'
                },
                status: 'ativo',
                colaboradoresElegiveis: 23
            },
            {
                beneficio: 'Gympass',
                fornecedor: 'Gympass',
                filiais: ['São Paulo'],
                funcoesElegiveis: ['Analista', 'Coordenador', 'Gerente'],
                funcoesDesconsideradas: ['Estagiário', 'Jovem Aprendiz'],
                regraCoexistencia: 'Pode coexistir com outros',
                tempoMinimoCasa: 'Imediato',
                idadeMaxima: 'Sem limite',
                dependentes: {
                    maximo: 0,
                    grauPermitido: 'Não aplicável',
                    idadeMaxima: 'Não aplicável'
                },
                status: 'ativo',
                colaboradoresElegiveis: 18
            }
        ]
    };

    const statuses = ['Em preparação', 'Em validação', 'Em aprovação', 'Pedido Realizado'];

    const customMarker = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderColor: getSeverityColor(getSeverity(item)), 
                borderStyle: 'solid', 
                borderWidth: '1px', 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%',
                backgroundColor: isCompleted ? getSeverityColor(getSeverity(item)) : 'transparent'
            }}>
                {isCompleted ? 
                    <FaCheckCircle size={22} fill="white" /> : 
                    <MdOutlineTimer size={18} fill="grey" />
                }
            </span>
        );
    };

    const customContent = (item, statusAtual) => {
        const statusIndex = statuses.indexOf(item);
        const atualIndex = statuses.indexOf(statusAtual);
        const isCompleted = statusIndex <= atualIndex;

        return (
            <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                color: isCompleted ? 'var(--primaria)' : 'gray' 
            }}>
                {isCompleted ? 
                    <Tag style={{fontWeight: '700'}} severity={getSeverity(item)} value={item} /> : 
                    <Tag severity={getSeverity(item)} value={item} style={{fontWeight: '500'}} />
                }
            </span>
        );
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

    // Gráfico de ranking de benefícios
    const chartDataBeneficios = {
        labels: Object.keys(dadosBeneficios.rankingBeneficios),
        datasets: [{
            data: Object.values(dadosBeneficios.rankingBeneficios),
            backgroundColor: ['#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8'],
            borderWidth: 0
        }]
    };

    // Gráfico de evolução mensal
    const chartDataEvolucao = {
        labels: Object.keys(dadosBeneficios.evolucaoMensal),
        datasets: [{
            label: 'Pedidos por Mês',
            data: Object.values(dadosBeneficios.evolucaoMensal),
            borderColor: '#5472d4',
            backgroundColor: 'rgba(84, 114, 212, 0.1)',
            tension: 0.4,
            fill: true
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

    const lineChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0'
                }
            },
            x: {
                grid: {
                    color: '#f0f0f0'
                }
            }
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

    // Calcular checklists pendentes de demissão usando dados reais
    const calcularChecklistsPendentes = () => {
        if (!tarefasData || tarefasData.length === 0) {
            return 0;
        }

        // Filtrar tarefas de demissão que estão pendentes
        const tarefasDemissaoPendentes = tarefasData.filter(tarefa => 
            tarefa && (tarefa.entidade_tipo === 'demissao' || tarefa.entidade_display === 'demissao') &&
            (tarefa.status === 'pendente' || tarefa.status === 'em_andamento')
        );

        return tarefasDemissaoPendentes.length;
    };

    const checklistsPendentes = calcularChecklistsPendentes();

    const pieChartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'start',
                labels: {
                    color: '#222',
                    font: { size: 11, weight: 500 },
                    padding: 4,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8
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
                right: 25,
                left: 5,
                top: 5,
                bottom: 5
            }
        },
        elements: {
            arc: { borderRadius: 6 }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    // Renderizar dashboard de Benefícios
    if (tipoUsuario === 'Benefícios') {
        return (
            <>
                {/* 📊 Visão Geral + Alertas - Layout em 2 colunas */}
                <div className="dashboard-beneficios-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* Coluna 1: Visão Geral */}
                    <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>📊 Como estamos hoje?</h6></Titulo>
                            <Link to="/beneficios">
                                <Texto weight={500} color={'var(--neutro-500)'}>
                                    Ver relatório completo <FaArrowRight />
                                </Texto>
                            </Link>
                        </Frame>
                        
                        <div className="metric-grid mock-data-element">
                            <div className="soon-badge">Em Breve</div>
                            <div className="metric-item">
                                <div className="metric-value metric-success">
                                    <FaUsers /> {dadosBeneficios.totalColaboradoresComBeneficios}
                                </div>
                                <div className="metric-label">Com Benefícios</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value metric-danger">
                                    <FaExclamationTriangle /> {dadosBeneficios.colaboradoresSemBeneficio}
                                </div>
                                <div className="metric-label">Sem Benefícios</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value metric-primary">
                                    <FaWallet /> R$ {Math.round(dadosBeneficios.valorMedioMensalPorColaborador)}
                                </div>
                                <div className="metric-label">Valor Médio/Colab.</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value metric-info">
                                    <FaChartLine /> {dadosBeneficios.pedidos.length}
                                </div>
                                <div className="metric-label">Pedidos Ativos</div>
                            </div>
                        </div>

                        {/* Insights estratégicos */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '16px',
                            border: '1px solid #e3f2fd'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                                <FaChartLine color="#5472d4" />
                                <Texto weight={600} color="#5472d4">Insights do Mês</Texto>
                            </div>
                            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
                                {dadosBeneficios.colaboradoresSemBeneficio > 0 ? (
                                    <span>⚠️ <strong>{dadosBeneficios.colaboradoresSemBeneficio} colaboradores</strong> ainda não possuem benefícios ativos. 
                                    Considere revisar as elegibilidades ou fazer uma campanha de ativação.</span>
                                ) : (
                                    <span>✅ <strong>100% dos colaboradores</strong> possuem pelo menos um benefício ativo. Excelente cobertura!</span>
                                )}
                            </div>
                        </div>

                        <Frame estilo="spaced">
                            <Titulo><h6>Benefícios Mais Utilizados</h6></Titulo>
                        </Frame>
                        <div className="chart-container-with-legend mock-data-element">
                            <div className="soon-badge">Em Breve</div>
                            {dadosProntos ? (
                                <Chart type="doughnut" data={chartDataBeneficios} options={getChartOptions()} />
                            ) : (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#888', fontSize: '14px'}}>
                                    {t("loading...")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coluna 2: Alertas Críticos */}
                    <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>⚠️ O que precisa de atenção?</h6></Titulo>
                            <Link to="/alertas">
                                <Texto weight={500} color={'var(--neutro-500)'}>
                                    {t("see_all")} <FaArrowRight />
                                </Texto>
                            </Link>
                        </Frame>
                        
                        <div className="metric-grid mock-data-element">
                            <div className="soon-badge">Em Breve</div>
                            <div className="metric-item">
                                <div className="metric-value metric-danger">
                                    <FaExclamationTriangle /> {dadosBeneficios.falhasEnvio}
                                </div>
                                <div className="metric-label">Falhas no Envio</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value metric-warning">
                                    <FaFileAlt /> {dadosBeneficios.documentosPendentes}
                                </div>
                                <div className="metric-label">Documentos Pendentes</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value metric-info">
                                    <FaClock /> {dadosBeneficios.aguardandoFornecedor}
                                </div>
                                <div className="metric-label">Aguardando Fornecedor</div>
                            </div>
                        </div>

                        {/* Ações recomendadas */}
                        <div style={{
                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '16px',
                            border: '1px solid #ffcc02'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                                <FaExclamationTriangle color="#f57c00" />
                                <Texto weight={600} color="#f57c00">Ações Recomendadas</Texto>
                            </div>
                            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
                                {dadosBeneficios.falhasEnvio > 0 && (
                                    <div style={{marginBottom: '8px'}}>
                                        🔧 <strong>Prioridade Alta:</strong> Resolver {dadosBeneficios.falhasEnvio} falha(s) de envio para evitar atrasos nos benefícios.
                                    </div>
                                )}
                                {dadosBeneficios.documentosPendentes > 0 && (
                                    <div style={{marginBottom: '8px'}}>
                                        📋 <strong>Prioridade Média:</strong> {dadosBeneficios.documentosPendentes} documento(s) pendente(s) podem estar bloqueando ativações.
                                    </div>
                                )}
                                {dadosBeneficios.aguardandoFornecedor > 0 && (
                                    <div>
                                        ⏰ <strong>Monitoramento:</strong> {dadosBeneficios.aguardandoFornecedor} pedido(s) aguardando resposta do fornecedor.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ⏳ Pedidos em Andamento */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{marginBottom: '24px'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>⏳ O que está acontecendo agora?</h6></Titulo>
                        <Link to="/pedidos">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                {t("see_all")} <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    <div className={styles.transacao}>
                        <div className={`${styles.empilhado} mock-data-element`}>
                            <div className="soon-badge">Em Breve</div>
                            {dadosBeneficios.pedidos.map((pedido, index) => (
                                <div key={index} style={{ width: '100%', padding: '14px', gap: '5px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                                        <div>
                                            <div style={{display: 'flex', gap: '2px'}}>
                                                <Texto weight={800}>{pedido.titulo}</Texto> - <Texto weight={400}>{pedido.referencia}</Texto>
                                            </div>
                                            <div style={{marginTop: '5px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                                                Colaboradores a receber:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{pedido.total_colaboradores}</p>
                                            </div>
                                            <div style={{marginTop: '2px', fontSize:'12px', color: 'var(--neutro-500)'}}>
                                                Fornecedor: {pedido.fornecedor}
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'end'}}>
                                            <div style={{display: 'flex', gap: '5px'}}>
                                                <Texto size={"12px"}>Valor Total: </Texto>
                                                <Texto weight={800}>{Real.format(pedido.valor)}</Texto>
                                            </div>
                                            <Texto size={"12px"}>Data do Pedido: {pedido.dataPedido}</Texto>
                                        </div>
                                    </div>
                                    <Timeline 
                                        value={statuses} 
                                        layout="horizontal" 
                                        align="top" 
                                        marker={(item) => customMarker(item, pedido.statusAtual)}
                                        content={(item) => customContent(item, pedido.statusAtual)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 📈 Tendências + Elegibilidades - Layout em 2 colunas */}
                <div className="dashboard-beneficios-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px'
                }}>
                    {/* Coluna 1: Tendências */}
                    <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>📈 Como estamos evoluindo?</h6></Titulo>
                        </Frame>
                        <div className="chart-container mock-data-element">
                            <div className="soon-badge">Em Breve</div>
                            {dadosProntos ? (
                                <Chart type="line" data={chartDataEvolucao} options={lineChartOptions} />
                            ) : (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#888', fontSize: '14px'}}>
                                    {t("loading...")}
                                </div>
                            )}
                        </div>
                        
                        {/* Análise de tendência */}
                        <div style={{
                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '16px',
                            border: '1px solid #4caf50'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                                <MdTrendingUp color="#2e7d32" />
                                <Texto weight={600} color="#2e7d32">Análise de Tendência</Texto>
                            </div>
                            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
                                📊 <strong>Crescimento de 20%</strong> nos pedidos de benefícios nos últimos 3 meses. 
                                Isso indica maior adoção pelos colaboradores e possivelmente a necessidade de revisar 
                                a capacidade dos fornecedores para atender a demanda crescente.
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Elegibilidades - Storytelling Melhorado */}
                    <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>⚙️ Como estão as regras?</h6></Titulo>
                            <Link to="/elegibilidades">
                                <Texto weight={500} color={'var(--neutro-500)'}>
                                    Gerenciar elegibilidades <FaArrowRight />
                                </Texto>
                            </Link>
                        </Frame>
                        
                        {/* Resumo das elegibilidades */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px',
                            border: '1px solid #9c27b0'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                                <FaBuilding color="#7b1fa2" />
                                <Texto weight={600} color="#7b1fa2">Resumo das Configurações</Texto>
                            </div>
                            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
                                📋 <strong>{dadosBeneficios.elegibilidades.length} benefícios</strong> configurados com regras específicas. 
                                <strong>{dadosBeneficios.elegibilidades.filter(e => e.filiais.includes('Todas as filiais')).length}</strong> são nacionais 
                                e <strong>{dadosBeneficios.elegibilidades.filter(e => !e.filiais.includes('Todas as filiais')).length}</strong> são regionais.
                            </div>
                        </div>

                        {/* Lista compacta de elegibilidades */}
                        <div className="mock-data-element" style={{maxHeight: '300px', overflowY: 'auto', position: 'relative'}}>
                            <div className="soon-badge">Em Breve</div>
                            {dadosBeneficios.elegibilidades.map((elegibilidade, index) => (
                                <div key={index} style={{
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '8px',
                                    background: 'white',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <Tag severity={getSeverity(elegibilidade.status)} value={elegibilidade.beneficio} />
                                            <div style={{fontSize: '12px', color: 'var(--neutro-500)'}}>
                                                {elegibilidade.fornecedor}
                                            </div>
                                        </div>
                                        <div style={{fontWeight: '600', color: '#5472d4', fontSize: '14px'}}>
                                            {elegibilidade.colaboradoresElegiveis} elegíveis
                                        </div>
                                    </div>
                                    
                                    {/* Informações compactas */}
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px'}}>
                                        <div style={{color: '#666'}}>
                                            <strong>Filiais:</strong> {elegibilidade.filiais.length > 2 ? 
                                                `${elegibilidade.filiais.length} filiais` : 
                                                elegibilidade.filiais.join(', ')}
                                        </div>
                                        <div style={{color: '#666'}}>
                                            <strong>Funções:</strong> {elegibilidade.funcoesElegiveis.length} elegíveis
                                        </div>
                                        <div style={{color: '#666'}}>
                                            <strong>Tempo:</strong> {elegibilidade.tempoMinimoCasa}
                                        </div>
                                        <div style={{color: '#666'}}>
                                            <strong>Dependentes:</strong> {elegibilidade.dependentes.maximo} máx
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Renderizar dashboard de RH (código existente)
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
                                        <div className="ferias-colaborador">{ferias.colaborador}</div>
                                        <div className="ferias-periodo">
                                            {ferias.inicio && ferias.fim ? 
                                                `${new Date(ferias.inicio).toLocaleDateString('pt-BR')} - ${new Date(ferias.fim).toLocaleDateString('pt-BR')} (${ferias.nrodiasferias} dias)` :
                                                `${ferias.inicio} - ${ferias.fim} (${ferias.nrodiasferias} dias)`
                                            }
                                        </div>
                                    </div>
                                    <Tag severity={getSeverity(ferias.situacaoferias)} value={
                                        ferias.situacaoferias === 'G' ? 'Aguardando Gestor' : 
                                        ferias.situacaoferias === 'D' ? 'Aguardando DP' : 
                                        ferias.situacaoferias === 'M' ? 'Marcadas' : 
                                        ferias.situacaoferias === 'P' ? 'Pagas' : 
                                        ferias.situacaoferias === 'F' ? 'Finalizadas' : 
                                        ferias.situacaoferias === 'X' ? 'Finalizadas Próximo Mês' : 
                                        // Status antigos (mantidos para compatibilidade)
                                        ferias.situacaoferias === 'A' ? 'Aprovada' : 
                                        ferias.situacaoferias === 'S' ? 'Solicitada' : 
                                        ferias.situacaoferias === 'E' ? 'Em Andamento' : 
                                        ferias.situacaoferias === 'C' ? 'Cancelada' : 
                                        ferias.situacaoferias === 'R' ? 'Rejeitada' : 
                                        ferias.situacaoferias
                                    } />
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

                    <Frame estilo="spaced">
                        <Titulo><h6>{t("process_steps")}</h6></Titulo>
                    </Frame>
                    <div className="etapas-list" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                        {dadosRH.etapasDemissao.length > 0 ? (
                            dadosRH.etapasDemissao.map((etapa, index) => (
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
                                        <span style={{fontSize: 13, color: '#888', fontWeight: 500, marginLeft: 20}}>Concluída</span>
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
                            <div style={{textAlign: 'center', color: '#888', fontSize: 14, fontStyle: 'italic', padding: '18px 0'}}>Nenhum processo em andamento</div>
                        )}
                    </div>
                </div>
            </div>
        </> 
    )
}

export default DashboardCard