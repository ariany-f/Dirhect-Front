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

function DashboardCard({ dashboardData, colaboradores = [], atividadesRaw = [], tipoUsuario = 'RH' }){
    console.log(tipoUsuario)
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [feriasData, setFeriasData] = useState([]);
    const [admissoesData, setAdmissoesData] = useState([]);
    const [vagasData, setVagasData] = useState([]);
    const [demissoesData, setDemissoesData] = useState([]);
    const { t } = useTranslation('common');

    useEffect(() => {
        setIsVisible(true);
        
        // Detectar se é mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Carregar dados reais de férias
        const carregarFerias = async () => {
            try {
                console.log('Carregando dados de férias da API...');
                const response = await http.get('ferias/?format=json');
                console.log('Resposta da API de férias:', response);
                
                // Verificar se a resposta tem a estrutura esperada
                let dadosFerias = response;
                if (response && response.results) {
                    dadosFerias = response.results;
                } else if (Array.isArray(response)) {
                    dadosFerias = response;
                } else {
                    console.log('Estrutura inesperada da resposta:', response);
                    dadosFerias = [];
                }
                
                console.log('Dados de férias processados:', dadosFerias);
                setFeriasData(dadosFerias);
            } catch (error) {
                console.log('Erro ao carregar férias:', error);
                setFeriasData([]);
            }
        };

        // Carregar dados reais de admissões
        const carregarAdmissoes = async () => {
            try {
                console.log('Carregando dados de admissões da API...');
                const response = await http.get('admissao/?format=json');
                console.log('Resposta da API de admissões:', response);
                
                // Verificar se a resposta tem a estrutura esperada
                let dadosAdmissoes = response;
                if (response && response.results) {
                    dadosAdmissoes = response.results;
                } else if (Array.isArray(response)) {
                    dadosAdmissoes = response;
                } else {
                    console.log('Estrutura inesperada da resposta de admissões:', response);
                    dadosAdmissoes = [];
                }
                
                console.log('Dados de admissões processados:', dadosAdmissoes);
                setAdmissoesData(dadosAdmissoes);
            } catch (error) {
                console.log('Erro ao carregar admissões:', error);
                setAdmissoesData([]);
            }
        };
        
        // Carregar dados reais de vagas
        const carregarVagas = async () => {
            try {
                console.log('Carregando dados de vagas da API...');
                const response = await http.get('vagas/?format=json');
                console.log('Resposta da API de vagas:', response);
                let dadosVagas = response;
                if (response && response.results) {
                    dadosVagas = response.results;
                } else if (Array.isArray(response)) {
                    dadosVagas = response;
                } else {
                    console.log('Estrutura inesperada da resposta de vagas:', response);
                    dadosVagas = [];
                }
                setVagasData(dadosVagas);
            } catch (error) {
                console.log('Erro ao carregar vagas:', error);
                setVagasData([]);
            }
        };

        // Carregar dados reais de demissões
        const carregarDemissoes = async () => {
            try {
                console.log('Carregando dados de demissões da API...');
                const response = await http.get('funcionario/?format=json&situacao=D');
                console.log('Resposta da API de demissões:', response);
                
                // Verificar se a resposta tem a estrutura esperada
                let dadosDemissoes = response;
                if (response && response.results) {
                    dadosDemissoes = response.results;
                } else if (Array.isArray(response)) {
                    dadosDemissoes = response;
                } else {
                    console.log('Estrutura inesperada da resposta de demissões:', response);
                    dadosDemissoes = [];
                }
                
                console.log('Dados de demissões processados:', dadosDemissoes);
                setDemissoesData(dadosDemissoes);
            } catch (error) {
                console.log('Erro ao carregar demissões:', error);
                setDemissoesData([]);
            }
        };
        
        carregarFerias();
        carregarAdmissoes();
        carregarVagas();
        carregarDemissoes();
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Usar opções apropriadas baseadas no tamanho da tela
    const getChartOptions = () => {
        return isMobile ? chartOptionsMobile : chartOptions;
    };

    // Processar dados reais de férias
    const processarDadosFerias = () => {
        if (!feriasData || feriasData.length === 0) {
            console.log('Nenhum dado de férias encontrado');
            return {
                feriasVencidas: 0,
                feriasProximas: 0,
                pedidosFeriasAberto: 0,
                feriasAgendadas: []
            };
        }

        console.log('Processando dados de férias:', feriasData.length, 'registros');
        const hoje = new Date();
        const proximos30Dias = new Date(hoje.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        let feriasVencidas = 0;
        let feriasProximas = 0;
        let pedidosFeriasAberto = 0;
        const feriasAgendadas = [];

        feriasData.forEach((ferias, index) => {
            // Validar se os campos necessários existem
            if (!ferias.dt_inicio || !ferias.dt_fim || !ferias.funcionario_nome) {
                console.log(`Férias ${index + 1}: Campos obrigatórios ausentes`, ferias);
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
                console.log(`Férias ${index + 1}: Datas inválidas`, {
                    dt_inicio: ferias.dt_inicio,
                    dt_fim: ferias.dt_fim
                });
                return;
            }
            
            console.log(`Férias ${index + 1}:`, {
                colaborador: colaboradorNome,
                inicio: ferias.dt_inicio,
                fim: ferias.dt_fim,
                situacao: situacao,
                dias: nrodiasferias,
                dataFimMenorQueHoje: dataFim < hoje,
                dataInicioProximos30Dias: dataInicio >= hoje && dataInicio <= proximos30Dias,
                dataFimMaiorOuIgualHoje: dataFim >= hoje
            });
            
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

        console.log('Resultado do processamento:', {
            feriasVencidas,
            feriasProximas,
            pedidosFeriasAberto,
            feriasAgendadas: feriasAgendadas.length
        });

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
            console.log('Nenhum dado de admissões encontrado');
            return {
                admissoesAndamento: 0,
                tempoMedioAdmissao: 0,
                etapasAdmissao: []
            };
        }

        console.log('Processando dados de admissões:', admissoesData.length, 'registros');
        
        // Contar admissões em andamento (status pendente/em_andamento)
        const admissoesAndamento = admissoesData.filter(admissao => 
            admissao.status === 'pendente' || admissao.status === 'em_andamento'
        ).length;

        // Calcular tempo médio de admissão (em dias)
        const admissoesConcluidas = admissoesData.filter(admissao => 
            admissao.status === 'concluida' || admissao.status === 'aprovada'
        );

        let tempoMedioAdmissao = 0;
        if (admissoesConcluidas.length > 0) {
            const temposAdmissao = admissoesConcluidas.map(admissao => {
                if (admissao.data_inicio && admissao.data_fim) {
                    const inicio = new Date(admissao.data_inicio);
                    const fim = new Date(admissao.data_fim);
                    return Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
                }
                return 0;
            }).filter(tempo => tempo > 0);

            if (temposAdmissao.length > 0) {
                tempoMedioAdmissao = Math.round(temposAdmissao.reduce((a, b) => a + b, 0) / temposAdmissao.length);
            }
        }

        // Etapas do processo (mockado por enquanto, pode ser expandido com dados reais)
        const etapasAdmissao = [
            { etapa: 'Documentação', tempo: 3, status: 'concluida' },
            { etapa: 'Exame Médico', tempo: 5, status: 'em_andamento' },
            { etapa: 'Assinatura Contrato', tempo: 2, status: 'pendente' },
            { etapa: 'Integração', tempo: 2, status: 'pendente' }
        ];

        console.log('Resultado do processamento de admissões:', {
            admissoesAndamento,
            tempoMedioAdmissao,
            totalAdmissoes: admissoesData.length
        });

        return {
            admissoesAndamento,
            tempoMedioAdmissao,
            etapasAdmissao
        };
    };

    // Calcular novos colaboradores baseados na dt_admissao
    const calcularNovosColaboradores = () => {
        if (!colaboradores || colaboradores.length === 0) {
            console.log('Nenhum colaborador encontrado para calcular novos');
            return 0;
        }

        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        console.log('Calculando novos colaboradores para o mês:', {
            inicioMes: inicioMes.toISOString().split('T')[0],
            fimMes: fimMes.toISOString().split('T')[0]
        });

        const novosColaboradores = colaboradores.filter(colaborador => {
            if (!colaborador.dt_admissao) {
                return false;
            }

            const dataAdmissao = new Date(colaborador.dt_admissao);
            const isAdmissaoEsteMes = dataAdmissao >= inicioMes && dataAdmissao <= fimMes;
            
            console.log(`Colaborador ${colaborador.funcionario_pessoa_fisica?.nome || 'N/A'}:`, {
                dt_admissao: colaborador.dt_admissao,
                dataAdmissao: dataAdmissao.toISOString().split('T')[0],
                isAdmissaoEsteMes
            });

            return isAdmissaoEsteMes;
        }).length;

        console.log('Novos colaboradores calculados:', novosColaboradores);
        return novosColaboradores;
    };

    const dadosAdmissoesReais = processarDadosAdmissoes();
    const novosColaboradoresMes = calcularNovosColaboradores();

    // Processar dados de demissões
    const processarDadosDemissoes = () => {
        if (!demissoesData || demissoesData.length === 0) {
            console.log('Nenhum dado de demissões encontrado');
            return {
                demissoesMes: 0,
                demissoesProcessamento: 0,
                motivosDemissao: {}
            };
        }

        console.log('Processando dados de demissões:', demissoesData.length, 'registros');
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        // Contar demissões do mês atual
        const demissoesMes = demissoesData.filter(demissao => {
            if (!demissao.dt_demissao) return false;
            const dataDemissao = new Date(demissao.dt_demissao);
            return dataDemissao >= inicioMes && dataDemissao <= fimMes;
        }).length;

        // Contar demissões em processamento (demissões recentes ou sem data de demissão)
        const demissoesProcessamento = demissoesData.filter(demissao => {
            // Se não tem data de demissão, está em processamento
            if (!demissao.dt_demissao) return true;
            
            // Se tem data de demissão, verificar se é recente (últimos 30 dias)
            const dataDemissao = new Date(demissao.dt_demissao);
            const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
            return dataDemissao >= trintaDiasAtras;
        }).length;

        // Contar por tipo de demissão
        const motivosDemissao = demissoesData.reduce((acc, demissao) => {
            const tipoDemissao = demissao.tipo_demissao || 'Não informado';
            const motivo = getMotivoDemissao(tipoDemissao);
            acc[motivo] = (acc[motivo] || 0) + 1;
            return acc;
        }, {});

        console.log('Resultado do processamento de demissões:', {
            demissoesMes,
            demissoesProcessamento,
            motivosDemissao
        });

        return {
            demissoesMes,
            demissoesProcessamento,
            motivosDemissao
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

    // Contar vagas abertas
    const contarVagasAbertas = () => {
        if (!vagasData || vagasData.length === 0) return 0;
        // Ajuste o filtro conforme o status real de vaga aberta
        return vagasData.filter(vaga => vaga.status === 'A' || vaga.status === 'aberta' || vaga.status === 'Aberta').length;
    };
    const vagasAbertas = contarVagasAbertas();

    // Função para calcular o turnover real
    const calcularTurnover = () => {
        if (!colaboradores || colaboradores.length === 0) {
            return 0;
        }

        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        // Contar demissões do mês atual
        const demissoesMes = demissoesData.filter(demissao => {
            if (!demissao.dt_demissao) return false;
            const dataDemissao = new Date(demissao.dt_demissao);
            return dataDemissao >= inicioMes && dataDemissao <= fimMes;
        }).length;

        // Calcular turnover: (Demissões do mês / Total de colaboradores) * 100
        const turnover = (demissoesMes / colaboradores.length) * 100;
        
        console.log('Cálculo do turnover:', {
            demissoesMes,
            totalColaboradores: colaboradores.length,
            turnover: turnover.toFixed(1)
        });

        return turnover.toFixed(1);
    };

    // Dados mockados para demonstração - em produção viriam da API
    const dadosRH = {
        // Gestão de Colaboradores
        totalColaboradores: colaboradores.length,
        novosContratadosMes: novosColaboradoresMes,
        demissoesMes: dadosDemissoesReais.demissoesMes,
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
        feriasAgendadas: dadosFeriasReais.feriasAgendadas.length > 0 ? dadosFeriasReais.feriasAgendadas : [
            // Dados fake apenas se não houver dados reais
            { 
                colaborador: 'ALTAMIRO CARRILHO', 
                inicio: '03/04/2017', 
                fim: '02/05/2017', 
                status: 'F', // F = Finalizadas
                nrodiasferias: 30,
                situacaoferias: 'F'
            },
            { 
                colaborador: 'MARIA SANTOS', 
                inicio: '10/04/2025', 
                fim: '25/04/2025', 
                status: 'G', // G = Aguardando Aprovação do Gestor
                nrodiasferias: 30,
                situacaoferias: 'G'
            },
            { 
                colaborador: 'PEDRO COSTA', 
                inicio: '05/05/2025', 
                fim: '20/05/2025', 
                status: 'M', // M = Marcadas
                nrodiasferias: 30,
                situacaoferias: 'M'
            }
        ],

        // Demissões - usando dados reais
        demissoesProcessamento: dadosDemissoesReais.demissoesProcessamento,
        tempoMedioRescisao: 8, // dias
        checklistsPendentes: 3,
        motivosDemissao: dadosDemissoesReais.motivosDemissao,

        // Eficiência Operacional
        refacaoAdmissao: 12,
        refacaoFerias: 8,
        refacaoDemissao: 5,
        tarefasVencidas: 7,
        slaAdmissao: 85,
        slaFerias: 92,
        slaDemissao: 78,
        vagasAbertas,
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
        labels: Object.keys(dadosRH.distribuicaoDepartamentos),
        datasets: [{
            data: Object.values(dadosRH.distribuicaoDepartamentos),
            backgroundColor: ['#5472d4', '#66BB6A', '#FFA726', '#FF6384', '#8884d8', '#ffb347'],
            borderWidth: 0
        }]
    };

    // Gráfico de motivos de demissão
    const chartDataMotivos = {
        labels: Object.keys(dadosRH.motivosDemissao),
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
                    pointStyle: 'circle'
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
            padding: 10
        },
        elements: {
            arc: { borderRadius: 8 },
            bar: { borderRadius: 4 }
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
                    minRotation: 0
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0'
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
                            <Chart type="doughnut" data={chartDataBeneficios} options={getChartOptions()} />
                        </div>
                    </div>

                    {/* Coluna 2: Alertas Críticos */}
                    <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
                        <Frame estilo="spaced">
                            <Titulo><h6>⚠️ O que precisa de atenção?</h6></Titulo>
                            <Link to="/alertas">
                                <Texto weight={500} color={'var(--neutro-500)'}>
                                    Ver todos os alertas <FaArrowRight />
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
                                Ver todos os pedidos <FaArrowRight />
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
                            <Chart type="line" data={chartDataEvolucao} options={lineChartOptions} />
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
                        <Titulo><h6>Gestão de Colaboradores</h6></Titulo>
                        <Link to="/colaborador">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                Ver todos <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-primary">
                                <FaUsers /> {dadosRH.totalColaboradores}
                            </div>
                            <div className="metric-label">Total Ativos</div>
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
                            <div className="metric-label">Turnover</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-primary">
                                <MdWork /> {dadosRH.vagasAbertas}
                            </div>
                            <div className="metric-label">Vagas Abertas</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>Distribuição por Departamento</h6></Titulo>
                    </Frame>
                    <div className="chart-container mock-data-element" style={{width: '100%', height: '250px'}}>
                        <div className="soon-badge">Em Breve</div>
                        <Chart type="bar" data={chartDataDepartamentos} options={chartOptions} />
                    </div>
                </div>

                {/* Coluna 2: Admissões */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>Admissões</h6></Titulo>
                        <Link to="/admissao">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                Ver todas <FaArrowRight />
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
                            <div className="metric-label">Tempo Médio</div>
                        </div>
                        <div className="metric-item mock-data-element">
                            <div className="soon-badge">Em Breve</div>
                            <div className="metric-value metric-success">
                                <FaChartLine /> {dadosRH.slaAdmissao}%
                            </div>
                            <div className="metric-label">SLA</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>Etapas do Processo</h6></Titulo>
                    </Frame>
                    <div className="etapas-list mock-data-element">
                        <div className="soon-badge">Em Breve</div>
                        {dadosRH.etapasAdmissao.map((etapa, index) => (
                            <div key={index} className="etapa-item">
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <Tag severity={getSeverity(etapa.status)} value={etapa.etapa} />
                                </div>
                                <Texto weight={600} color={'var(--neutro-500)'}>{etapa.tempo} dias</Texto>
                            </div>
                        ))}
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
                        <Titulo><h6>Férias</h6></Titulo>
                        <Link to="/ferias">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                Ver todas <FaArrowRight />
                            </Texto>
                        </Link>
                    </Frame>
                    
                    <div className="metric-grid">
                        <div className="metric-item">
                            <div className="metric-value metric-danger">
                                <FaExclamationTriangle /> {dadosRH.feriasVencidas}
                            </div>
                            <div className="metric-label">Vencidas</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-warning">
                                <FaRegCalendarCheck /> {dadosRH.feriasProximas}
                            </div>
                            <div className="metric-label">Próximas</div>
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
                        <Titulo><h6>Próximas Férias Agendadas</h6></Titulo>
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
                            <div className="mock-data-element" style={{position: 'relative'}}>
                                <div className="soon-badge">Em Breve</div>
                                <div className="ferias-item">
                                    <div className="ferias-info">
                                        <div className="ferias-colaborador">ALTAMIRO CARRILHO</div>
                                        <div className="ferias-periodo">03/04/2017 - 02/05/2017 (30 dias)</div>
                                    </div>
                                    <Tag severity="danger" value="Finalizadas" />
                                </div>
                                <div className="ferias-item">
                                    <div className="ferias-info">
                                        <div className="ferias-colaborador">MARIA SANTOS</div>
                                        <div className="ferias-periodo">10/04/2025 - 25/04/2025 (30 dias)</div>
                                    </div>
                                    <Tag severity="warning" value="Aguardando Gestor" />
                                </div>
                                <div className="ferias-item">
                                    <div className="ferias-info">
                                        <div className="ferias-colaborador">PEDRO COSTA</div>
                                        <div className="ferias-periodo">05/05/2025 - 20/05/2025 (30 dias)</div>
                                    </div>
                                    <Tag severity="success" value="Marcadas" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Demissões */}
                <div className={`${styles.card_dashboard} dashboard-rh-card ${styles.fadeIn} ${isVisible ? styles.visible : ''}`} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <Frame estilo="spaced">
                        <Titulo><h6>Demissões</h6></Titulo>
                        <Link to="/demissao">
                            <Texto weight={500} color={'var(--neutro-500)'}>
                                Ver todas <FaArrowRight />
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
                            <div className="metric-value metric-warning">
                                <FaClock /> {dadosRH.tempoMedioRescisao}d
                            </div>
                            <div className="metric-label">Tempo Médio</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-danger">
                                <FaClipboardList /> {dadosRH.checklistsPendentes}
                            </div>
                            <div className="metric-label">Checklists Pendentes</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value metric-success">
                                <FaChartLine /> {dadosRH.slaDemissao}%
                            </div>
                            <div className="metric-label">SLA</div>
                        </div>
                    </div>

                    <Frame estilo="spaced">
                        <Titulo><h6>Motivos de Demissão</h6></Titulo>
                    </Frame>
                    <div className="chart-container-with-legend">
                        <Chart type="pie" data={chartDataMotivos} options={getChartOptions()} />
                    </div>
                </div>
            </div>
        </> 
    )
}

export default DashboardCard