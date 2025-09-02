import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { format, addMonths, startOfMonth, endOfMonth, addDays, isMonday, getMonth, getYear, differenceInCalendarDays, isAfter, isBefore, isWithinInterval, format as formatDateFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaThLarge, FaThList, FaCalendarAlt } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import ModalDetalhesFerias from '@components/ModalDetalhesFerias';
import colaboradoresFake from '@json/ferias.json'; // Dados fake para exemplos de renderização
import DropdownItens from '@components/DropdownItens'
import CampoTexto from '@components/CampoTexto';
import http from '@http';

const GRADIENT = 'linear-gradient(to left, var(--black), var(--gradient-secundaria))';

const CalendarContainer = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 5px;
    user-select: none;
    display: flex;
    flex-direction: column;
    height: 73vh;
    position: relative;
`;

const FixedHeader = styled.div`
    position: sticky;
    top: 0;
    background: #fff;
    padding-bottom: 4px;
    border-bottom: 1px solid #e5e7eb;
`;

const CalendarScrollArea = styled.div`
    flex: 1;
    overflow: auto;
    position: relative;
    border-radius: 8px;
    background: #fff;
    min-height: 66vh;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f5f5f5;
    user-select: none;
    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: #f5f5f5;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b0b7c3;
    }
    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`;

const CalendarTableHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 5;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 4px;
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const MonthTitle = styled.h2`
    font-size: 18px;
    color: #333;
    margin: 0;
`;

const CalendarGrid = styled.div`
    min-width: ${({ $totalDays, $dayWidth }) => $totalDays * $dayWidth + 200}px;
    min-height: 100%;
    position: relative;
`;

const WeekDaysRow = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ $totalDays }) => $totalDays}, 1fr);
    min-width: 100%;
`;

const WeekDayNameRow = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ $totalDays }) => $totalDays}, 1fr);
    min-width: 100%;
`;

const WeekDayNameCell = styled.div`
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: black;
    padding: 4px 0 0 0;
`;

const WeekDay = styled.div`
    text-align: center;
    font-weight: 400;
    color: #333;
    font-size: 14px;
    padding: 8px 0;
    &.weekend {
        background: #f3f3f8;
    }
`;

const EmployeeCell = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
    font-size: 14px;
    padding-left: 8px;
    background: #f5f5f5;
    border: 1px solid #eee;
    min-height: 44px;
    height: 44px;
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

const EmployeeRow = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: center;
    min-height: 44px;
    margin: 0;
    padding: 0;
    border-bottom: none;
`;

const DaysBar = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;
    border: 1px solid #eee;
    margin: 0!important;
`;

const EventBar = styled.div`
    position: absolute;
    left: ${({ $startPercent }) => $startPercent}%;
    width: ${({ $widthPercent }) => $widthPercent}%;
    top: 6px;
    height: 28px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(44, 0, 80, 0.13);
    border-radius: 4px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 24px 0 12px;
    z-index: 2;
    overflow: hidden;
    white-space: nowrap;
    color: #fff;
    background: ${({ $type }) => {
        if ($type === 'aSolicitar') return 'linear-gradient(to right, #ff5ca7, #ffb6c1)';
        if ($type === 'perdido') return 'linear-gradient(to right, #dc3545, #c82333)';
        if ($type === 'solicitada') return 'linear-gradient(to right, #fbb034,rgb(211, 186, 22))';
        if ($type === 'marcada') return 'linear-gradient(to right, #20c997, #17a2b8)';
        if ($type === 'aprovada') return GRADIENT;
        if ($type === 'acontecendo') return 'linear-gradient(to right,rgb(45, 126, 219),rgb(18, 37, 130))';
        if ($type === 'passada') return 'linear-gradient(to right, #bdbdbd, #757575)';
        if ($type === 'finalizada') return 'linear-gradient(to right, #6c757d, #495057)';
        if ($type === 'paga') return 'linear-gradient(to right, #28a745, #20c997)';
        return GRADIENT;
    }};
    border: ${({ $type }) => $type === 'aSolicitar' ? '2px dashed #fff' : 'none'};
    box-shadow: ${({ $type }) => $type === 'acontecendo' ? '0 0 16px 2pxrgba(44, 95, 206, 0.33)' : '0 2px 8px rgba(21, 0, 80, 0.13)'};
`;

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    margin-right: 12px;
    font-size: 14px;
    color: ${({ $fill }) => $fill};
`;

const ToggleButton = styled.button`
    background: #7c3aed;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 18px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 12px;
    transition: background 0.2s;
    &:hover {
        background: #5b21b6;
    }
`;

const ViewToggleBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const ViewToggleSwitch = styled.div`
    display: flex;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px var(--gradient-secundaria)10;
`;

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
`;

const ViewToggleOption = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ $active }) => $active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : 'transparent'};
    color: ${({ $active }) => $active ? '#fff' : '#333'};
    border: none;
    font-size: 15px;
    font-weight: 600;
    padding: 8px 18px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-radius: 0;
    box-shadow: none;
    &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }
    &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;

const StickyHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    overflow-x: auto;
    width: 100%;
`;

const DAY_WIDTH_MENSAL = 90;
const DAY_WIDTH_TRIMESTRAL = 40;
const DAYS_IN_YEAR = 365;

const TrimestreHeader = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ $totalDays }) => $totalDays}, 1fr);
    margin-bottom: 0px;
    min-width: 100%;
`;

const TrimestreMonthCell = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 8px 0 0 0;
    grid-column: ${({ $start, $end }) => `${$start} / ${$end}`};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DaysBackgroundGrid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(${({ $totalDays }) => $totalDays}, 1fr);
    z-index: 0;
`;

const DayBgCell = styled.div`
    background: ${({ $isWeekend }) => $isWeekend ? '#f3f3f8' : '#fafbfc'};
    border-right: 1px solid #f0f0f0;
    height: 100%;
`;

const MonthSeparator = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--gradient-secundaria);
    z-index: 3;
    pointer-events: none;
    opacity: 0.5;
`;

function parseDateAsLocal(dateString) {
    if (!dateString) return null;
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(dateString);
}

function getDaysArray(start, end) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        dt = addDays(dt, 1);
    }
    return arr;
}

function getMondaysArray(start, end) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        if (isMonday(dt)) arr.push(new Date(dt));
        dt = addDays(dt, 1);
    }
    return arr;
}

function getMonthsInRange(start, end) {
    const months = [];
    let dt = new Date(start.getFullYear(), start.getMonth(), 1);
    while (dt <= end) {
        months.push({
            month: getMonth(dt),
            year: getYear(dt),
            start: new Date(dt),
            end: endOfMonth(dt)
        });
        dt = addMonths(dt, 1);
    }
    return months;
}



const statusIcons = {
    aSolicitar: <FaExclamationCircle fill='white' />,
    perdido: <FaExclamationCircle fill='white' />,
    solicitada: <FaRegClock fill='white'/>,
    aprovada: <FaCalendarCheck fill='white'/>,
    acontecendo: <FaSun fill='white' />,
    passada: <FaCheckCircle fill='white' />,
    paga: <FaCheckCircle fill='white' />,
    marcada: <FaCalendarAlt fill='white' />,
    finalizada: <FaCheckCircle fill='white' />,
};

const INITIAL_DAYS = 365; // Começa com 1 ano
const DAYS_BATCH = 30; // Carrega mais 1 mês por vez
const INITIAL_COLABS = 3;
const COLABS_BATCH = 2;

const CalendarFerias = ({ colaboradores, onUpdate }) => {
    const [visualizacao, setVisualizacao] = useState('trimestral'); // 'mensal' ou 'trimestral'
    const [modalEvento, setModalEvento] = useState(null); // {colab, evento, tipo}
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragScrollLeft = useRef(0);
    const scrollRef = useRef();
    const containerRef = useRef();
    const toast = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Função para normalizar os dados recebidos (API)
    const normalizarColaboradores = useCallback((colaboradores) => {
        if (!colaboradores || !Array.isArray(colaboradores)) return [];
        
        // Se já está no formato esperado (com ausencias), retorna como está
        if (colaboradores.length > 0 && colaboradores[0].ausencias) {
            return colaboradores;
        }
        
        // Normaliza dados da API de férias
        const colaboradoresMap = {};
        colaboradores.forEach(item => {
            // Agora usa funcionario_id diretamente
            const funcionarioId = item.funcionario_id;
            if (!funcionarioId) {
                console.warn('Item sem funcionario_id encontrado:', item);
                return;
            }
            
            if (!colaboradoresMap[funcionarioId]) {
                colaboradoresMap[funcionarioId] = {
                    id: funcionarioId,
                    nome: item.funcionario_nome || 'Colaborador',
                    gestor: item.gestor || '', 
                    ausencias: []
                };
            }
            
            // Adiciona férias como ausências
            if (item.dt_inicio && item.dt_fim) {
                                                            // Calcula período aquisitivo baseado no ano das férias
                                            const anoFerias = parseDateAsLocal(item.dt_inicio).getFullYear();
                                            const periodoAquisitivoFim = new Date(anoFerias, 11, 31); // 31/12 do ano
                                            const periodoAquisitivoInicio = new Date(anoFerias - 1, 11, 31); // 31/12 do ano anterior
                
                colaboradoresMap[funcionarioId].ausencias.push({
                    id: item.id,
                    data_inicio: item.dt_inicio,
                    data_fim: item.dt_fim,
                    status: item.situacaoferias || item.status || 'A',
                    periodo_aquisitivo_inicio: periodoAquisitivoInicio,
                    periodo_aquisitivo_fim: periodoAquisitivoFim,
                    saldo_dias: item.nrodiasferias || 30,
                    nrodiasabono: item.nrodiasabono || 0,
                    nrodiasferias: item.nrodiasferias || 30,
                    adiantar_13: item.adiantar_13 || false,
                    aviso_ferias: item.aviso_ferias || null,
                    abono_pecuniario: item.abono_pecuniario || false,
                    ferias_coletivas: item.ferias_coletivas || false,
                    periodo_aberto: item.periodo_aberto || false,
                    periodo_perdido: item.periodo_perdido || false,
                    datapagamento: item.datapagamento || null,
                    data_minima_solicitacao: item.data_minima_solicitacao || null,
                    data_minima_solicitacao_formatada: item.data_minima_solicitacao_formatada || null,
                    dias_antecedencia_necessarios: item.dias_antecedencia_necessarios || 0,
                    funcionario_tipo_situacao_id: item.funcionario_tipo_situacao_id || null,
                    funcionario_situacao_padrao: item.funcionario_situacao_padrao || false,
                    fimperaquis: item.fimperaquis || null,
                    tarefas: item.tarefas || [] // Tarefas agora vêm diretamente do item
                });
            } else if (item.fimperaquis) {
                // Se não tem dt_inicio e dt_fim, mas tem fimperaquis, adiciona para criar barra de férias a requisitar
                const fimPeriodo = parseDateAsLocal(item.fimperaquis);
                const inicioPeriodo = new Date(fimPeriodo.getFullYear() - 1, fimPeriodo.getMonth(), fimPeriodo.getDate()); // 1 ano antes
                
                colaboradoresMap[funcionarioId].ausencias.push({
                    id: item.id,
                    fimperaquis: item.fimperaquis,
                    nrodiasferias: item.nrodiasferias || 30,
                    periodo_perdido: item.periodo_perdido || false,
                    periodo_aquisitivo_inicio: inicioPeriodo,
                    periodo_aquisitivo_fim: fimPeriodo,
                    nrodiasabono: item.nrodiasabono || 0,
                    adiantar_13: item.adiantar_13 || false,
                    aviso_ferias: item.aviso_ferias || null,
                    abono_pecuniario: item.abono_pecuniario || false,
                    ferias_coletivas: item.ferias_coletivas || false,
                    periodo_aberto: item.periodo_aberto || false,
                    datapagamento: item.datapagamento || null,
                    data_minima_solicitacao: item.data_minima_solicitacao || null,
                    data_minima_solicitacao_formatada: item.data_minima_solicitacao_formatada || null,
                    dias_antecedencia_necessarios: item.dias_antecedencia_necessarios || 0,
                    funcionario_tipo_situacao_id: item.funcionario_tipo_situacao_id || null,
                    funcionario_situacao_padrao: item.funcionario_situacao_padrao || false,
                    tarefas: item.tarefas || [] // Tarefas agora vêm diretamente do item
                });
            }
        });
        
        // Filtra colaboradores inválidos antes de retornar
        return Object.values(colaboradoresMap).filter(colab => {
            if (!colab || !colab.id || !colab.nome) {
                console.warn('Colaborador inválido filtrado:', colab);
                return false;
            }
            return true;
        });
    }, []);

    // Usa a função para garantir o formato correto
    const colabsReais = normalizarColaboradores(colaboradores || []);
    const colabsFake = normalizarColaboradores(colaboradoresFake); // Dados fake para exemplos de renderização
    
    // Para usar dados fake em demonstrações, mude para: const allColabs = [...colabsReais, ...colabsFake];
    // Para usar apenas dados reais: const allColabs = colabsReais;
    const allColabs = colabsReais;

    // Definir período do calendário: 1 ano atrás até 2 anos à frente do ano atual
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const minDate = useMemo(() => new Date(currentYear - 1, 0, 1), [currentYear]); // 01/01 do ano anterior
    const maxDate = useMemo(() => new Date(currentYear + 2, 11, 31), [currentYear]); // 31/12 de 2 anos à frente

    // Estado do ano selecionado (padrão: ano atual)
    const [anoSelecionado, setAnoSelecionado] = useState(currentYear);
    // Estado do filtro de colaborador
    const [filtroColaborador, setFiltroColaborador] = useState('');



    // Ajusta para o início e fim do ano selecionado (dentro do período de 3 anos)
    const startDate = useMemo(() => startOfMonth(new Date(anoSelecionado, 0, 1)), [anoSelecionado]);
    const endDate = useMemo(() => endOfMonth(new Date(anoSelecionado, 11, 1)), [anoSelecionado]);
    const daysArray = useMemo(() => getDaysArray(startDate, endDate), [startDate, endDate]);
    const totalDays = useMemo(() => daysArray.length, [daysArray]);
    const monthsArray = useMemo(() => getMonthsInRange(startDate, endDate), [startDate, endDate]);

    // Filtra colaboradores pelo nome
    const colabsFiltrados = useMemo(() => allColabs.filter(colab =>
        colab.nome.toLowerCase().includes(filtroColaborador.toLowerCase())
    ), [allColabs, filtroColaborador]);

    // Zoom dinâmico: calcula a largura do dia conforme a visualização e o tamanho do container
    const dayWidth = useMemo(() => {
        if (visualizacao === 'mensal') {
            return Math.max(24, Math.floor(containerWidth / 20) * 0.8); // 20% menor
        } else {
            return Math.max(12, Math.floor(containerWidth / 120)); // 4 meses (120 dias) visíveis
        }
    }, [visualizacao, containerWidth]);

    // Drag-to-scroll horizontal
    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.event-bar')) return;
        setIsDragging(true);
        dragStartX.current = e.pageX;
        dragScrollLeft.current = scrollRef.current.scrollLeft;
    }, []);
    
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        const dx = e.pageX - dragStartX.current;
        scrollRef.current.scrollLeft = dragScrollLeft.current - dx;
    }, [isDragging]);
    
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);
    useEffect(() => {
        if (!scrollRef.current) return;
        const ref = scrollRef.current;
        ref.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            ref.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Função para calcular a posição e largura da barra
    const getBarPosition = useCallback((start, end, startDate, totalDays) => {
        const startDay = Math.max(0, Math.floor((parseDateAsLocal(start) - startDate) / (1000 * 60 * 60 * 24)));
        const endDay = Math.min(totalDays - 1, Math.floor((parseDateAsLocal(end) - startDate) / (1000 * 60 * 60 * 24)));
        const startPercent = (startDay / totalDays) * 100;
        const widthPercent = ((endDay - startDay + 1) / totalDays) * 100;
        return { startPercent, widthPercent };
    }, []);

    // Modal evento
    const handleEventClick = useCallback((colab, evento, tipo) => {
        // Verificação de segurança para garantir que colab é válido
        if (!colab || !colab.id) {
            console.warn('Colaborador inválido no handleEventClick:', colab);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Dados do colaborador inválidos', life: 3000 });
            return;
        }
        
        setModalEvento({ colab, evento, tipo });
    }, []);
    
    const fecharModal = useCallback((resultado) => {
        setModalEvento(null);
        if (resultado) {
            if (resultado.sucesso) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: resultado.mensagem, life: 3000 });
                if (onUpdate) {
                    onUpdate();
                }
            } else if (resultado.erro) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: resultado.mensagem, life: 3000 });
                // Não chama onUpdate em caso de erro
            } else if (resultado.aviso) {
                toast.current.show({ severity: 'warn', summary: 'Atenção', detail: resultado.mensagem, life: 3000 });
                // Não chama setForceUpdate em caso de aviso
            } else if (resultado.info) {
                toast.current.show({ severity: 'info', summary: 'Aviso', detail: resultado.mensagem, life: 3000 });
                // Não chama setForceUpdate em caso de info
            }
        }
    }, [onUpdate]);

    // Função para mapear status para tipo de cor/ícone
    // Determina o status do evento de férias
    const getFeriasStatus = useCallback(({ data_inicio, data_fim }, hoje = new Date()) => {
        const inicio = parseDateAsLocal(data_inicio);
        const fim = parseDateAsLocal(data_fim);
        if (isAfter(inicio, hoje)) return 'aprovada'; // futura
        if (isWithinInterval(hoje, { start: inicio, end: fim })) return 'acontecendo';
        if (isBefore(fim, hoje)) return 'passada';
        return 'solicitada'; // fallback
    }, []);

    const mapStatusToType = useCallback((status, data_inicio, data_fim) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const isAcontecendo = () => {
            if (!data_inicio || !data_fim) return false;
            const inicio = parseDateAsLocal(data_inicio);
            inicio.setHours(0, 0, 0, 0);
            const fim = parseDateAsLocal(data_fim);
            fim.setHours(0, 0, 0, 0);
            return hoje >= inicio && hoje <= fim;
        };
    
        switch (status) {
            case 'A':
                return isAcontecendo() ? 'acontecendo' : 'aprovada';
            case 'M':
                return isAcontecendo() ? 'acontecendo' : 'marcada';
            case 'F':
                return 'finalizada';
            case 'P':
                return 'paga';
            case 'X':
                return 'finalizada';
            case 'S':
            case 'I':
            case 'G':
            case 'D':
            case 'E':
                return 'solicitada';
            case 'C':
                return 'passada';
            case 'R':
                return 'rejeitada';
            default:
                return isAcontecendo() ? 'acontecendo' : 'aprovada';
        }
    }, []);

    return (
        <CalendarContainer ref={containerRef}>
            <Toast ref={toast} />
            <Tooltip target=".event-bar" />
            <FixedHeader>
                <ViewToggleBar>
                    <div></div>
                    <ViewToggleSwitch>
                        <ViewToggleOption
                            $active={visualizacao === 'mensal'}
                            onClick={() => setVisualizacao('mensal')}
                            title="Visualização mensal"
                        >
                            <FaThLarge fill={visualizacao === 'mensal' ? 'white' : 'black'} /> Mensal
                        </ViewToggleOption>
                        <ViewToggleOption
                            $active={visualizacao === 'trimestral'}
                            onClick={() => setVisualizacao('trimestral')}
                            title="Visualização trimestral"
                        >
                            <FaThList fill={visualizacao === 'trimestral' ? 'white' : 'black'} /> Trimestral
                        </ViewToggleOption>
                    </ViewToggleSwitch>
                </ViewToggleBar>
            </FixedHeader>
            <CalendarScrollArea ref={scrollRef} style={{ cursor: isDragging ? 'grabbing' : 'auto' }}>
                {colabsFiltrados.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '400px',
                        color: '#666',
                        fontSize: '16px'
                    }}>
                        <FaCalendarCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>Não há dados de férias disponíveis para exibir no calendário.</p>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>Os dados aparecerão aqui quando houver férias registradas.</p>
                    </div>
                ) : (
                    <CalendarGrid $totalDays={totalDays} $dayWidth={dayWidth} style={{position: 'relative', minHeight: '100%'}}>
                    {/* Fundo cinza para a coluna dos colaboradores */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '200px',
                        minwidth: '200px',
                        height: `${Math.max(colabsFiltrados.length * 44, 25 * 16)}px`,
                        background: '#f5f5f5',
                        borderRight: '1px solid #eee',
                        zIndex: 1
                    }}></div>
                    {/* Linhas roxas de separação dos meses */}
                    {monthsArray.map((m, idx) => {
                        if (idx === 0) return null; // não desenha antes do primeiro mês
                        const startIdx = differenceInCalendarDays(m.start, startDate); // índice do dia 1 do mês
                        const leftPx = 200 + startIdx * dayWidth; // 200px da coluna fixa + dias * largura do dia
                        return (
                            <MonthSeparator
                                key={idx}
                                style={{ left: `${leftPx}px` }}
                            />
                        );
                    })}
                    <CalendarTableHeader>
                        <TrimestreHeader $totalDays={totalDays}>
                            {monthsArray.map((m, idx) => {
                                const startIdx = differenceInCalendarDays(m.start, startDate) + 1;
                                const endIdx = differenceInCalendarDays(m.end, startDate) + 2;
                                return (
                                    <TrimestreMonthCell
                                        key={idx}
                                        $start={startIdx}
                                        $end={endIdx}
                                        style={{ gridColumn: `${startIdx} / ${endIdx}` }}
                                    >
                                        {format(m.start, 'MMMM yyyy', { locale: ptBR }).toUpperCase()}
                                    </TrimestreMonthCell>
                                );
                            })}
                        </TrimestreHeader>
                        {visualizacao === 'mensal' && (
                            <WeekDayNameRow $totalDays={totalDays}>
                                <div style={{
                                    background: '#f5f5f5',
                                    border: '1px solid #eee',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 4,
                                    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
                                }}></div>
                                {daysArray.map((date, idx) => (
                                    <WeekDayNameCell key={idx}>
                                        {['DOM','SEG','TER','QUA','QUI','SEX','SAB'][date.getDay()]}
                                    </WeekDayNameCell>
                                ))}
                            </WeekDayNameRow>
                        )}
                        {visualizacao === 'trimestral' ? (
                            <WeekDaysRow $totalDays={totalDays}>
                                <div style={{
                                    background: '#f5f5f5',
                                    border: '1px solid #eee',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 4,
                                    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
                                }}></div>
                                {daysArray.map((date, idx) => (
                                    isMonday(date) ? (
                                        <WeekDay key={idx}>SEG. {date.getDate()}</WeekDay>
                                    ) : (
                                        <div key={idx}></div>
                                    )
                                ))}
                            </WeekDaysRow>
                        ) : (
                            <WeekDaysRow $totalDays={totalDays}>
                                <div style={{
                                    background: '#f5f5f5',
                                    border: '1px solid #eee',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 4,
                                    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
                                }}></div>
                                {daysArray.map((date, idx) => (
                                    <WeekDay
                                        key={idx}
                                        className={date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : ''}
                                    >
                                        {date.getDate()}
                                    </WeekDay>
                                ))}
                            </WeekDaysRow>
                        )}
                    </CalendarTableHeader>
                    {colabsFiltrados.map((colab, idx) => {
                        // Debug específico para FLAVIO PEREIRA
                        if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                            console.log('🔍 Debug FLAVIO PEREIRA - Renderizando colaborador:', colab);
                            console.log('🔍 Debug FLAVIO PEREIRA - Ausências:', colab.ausencias);
                        }
                        
                        // Verificação de segurança para garantir que colab tem dados necessários
                        if (!colab || !colab.id || !colab.nome) {
                            console.warn('Colaborador inválido encontrado:', colab);
                            return null;
                        }
                        
                        return (
                        <EmployeeRow key={colab.nome}>
                            <EmployeeCell>{colab.nome}</EmployeeCell>
                            <DaysBar style={{ minWidth: '100%', position: 'relative' }}>
                                {/* Background grid */}
                                <DaysBackgroundGrid $totalDays={totalDays}>
                                    {daysArray.map((date, i) => (
                                        <DayBgCell key={i} $isWeekend={date.getDay() === 0 || date.getDay() === 6} />
                                    ))}
                                </DaysBackgroundGrid>
                                {/* Eventos */}
                                {(() => {
                                    // Ordena os registros: primeiro os que não têm dt_inicio/dt_fim (férias a requisitar), depois os que têm
                                    const registrosOrdenados = colab.ausencias
                                        .filter(aus => {
                                            // Só mostra eventos que têm pelo menos um dia dentro do range do calendário
                                            if (aus.data_inicio && aus.data_fim) {
                                                const eventStart = parseDateAsLocal(aus.data_inicio);
                                                const eventEnd = parseDateAsLocal(aus.data_fim);
                                                return eventEnd >= startDate && eventStart <= endDate;
                                            }
                                            // Se não tem dt_inicio e dt_fim, verifica fimperaquis
                                            if (aus.fimperaquis) {
                                                const fimPeriodo = parseDateAsLocal(aus.fimperaquis);
                                                const inicioPeriodo = new Date(fimPeriodo.getFullYear() - 1, fimPeriodo.getMonth(), fimPeriodo.getDate()); // 1 ano antes
                                                const limiteSolicitacao = new Date(fimPeriodo.getFullYear(), fimPeriodo.getMonth() + 11, fimPeriodo.getDate()); // 11 meses após o fim
                                                
                                                const isInRange = limiteSolicitacao >= startDate && inicioPeriodo <= endDate;
                                                
                                                // Debug específico para FLAVIO PEREIRA
                                                if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                                    console.log('🔍 Debug FLAVIO PEREIRA - Filtro de período:', {
                                                        fimPeriodo,
                                                        inicioPeriodo,
                                                        limiteSolicitacao,
                                                        startDate,
                                                        endDate,
                                                        isInRange
                                                    });
                                                }
                                                
                                                return isInRange;
                                            }
                                            return false;
                                        })
                                        .sort((a, b) => {
                                            // Se a não tem dt_inicio/dt_fim e b tem, a vem primeiro
                                            if (!a.data_inicio && !a.data_fim && b.data_inicio && b.data_fim) return -1;
                                            // Se b não tem dt_inicio/dt_fim e a tem, b vem primeiro
                                            if (!b.data_inicio && !b.data_fim && a.data_inicio && a.data_fim) return 1;
                                            // Se ambos têm ou ambos não têm, ordena por data
                                            if (a.data_inicio && b.data_inicio) {
                                                return parseDateAsLocal(a.data_inicio) - parseDateAsLocal(b.data_inicio);
                                            }
                                            if (a.fimperaquis && b.fimperaquis) {
                                                return parseDateAsLocal(a.fimperaquis) - parseDateAsLocal(b.fimperaquis);
                                            }
                                            return 0;
                                        });

                                    return registrosOrdenados.map((aus, i) => {
                                        // Debug específico para FLAVIO PEREIRA
                                        if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                            console.log('🔍 Debug FLAVIO PEREIRA - Processando ausência:', aus);
                                            console.log('🔍 Debug FLAVIO PEREIRA - Tem fimperaquis?', !!aus.fimperaquis);
                                            console.log('🔍 Debug FLAVIO PEREIRA - Tem data_inicio?', !!aus.data_inicio);
                                            console.log('🔍 Debug FLAVIO PEREIRA - Tem data_fim?', !!aus.data_fim);
                                        }
                                        
                                        // Se não tem dt_inicio e dt_fim, mas tem fimperaquis, verifica se pode solicitar ou se está perdido
                                        if (!aus.data_inicio && !aus.data_fim && aus.fimperaquis) {
                                            // Debug específico para FLAVIO PEREIRA
                                            if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                                console.log('🔍 Debug FLAVIO PEREIRA - Passou pela primeira verificação (tem fimperaquis)');
                                                console.log('🔍 Debug FLAVIO PEREIRA - funcionario_marcado_demissao:', colab.funcionario_marcado_demissao);
                                                console.log('🔍 Debug FLAVIO PEREIRA - funcionario_situacao_padrao:', aus.funcionario_situacao_padrao);
                                            }
                                            
                                            // NOVA REGRA: não exibe "a solicitar" se funcionario_marcado_demissao ou tipo_situacao Demitido
                                            if (colab.funcionario_marcado_demissao === true || aus.funcionario_situacao_padrao === true) {
                                                if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                                    console.log('🔍 Debug FLAVIO PEREIRA - FILTRADO por demissão/situação');
                                                }
                                                return null;
                                            }
                                            const fimPeriodo = parseDateAsLocal(aus.fimperaquis);
                                            const inicioPeriodo = new Date(fimPeriodo.getFullYear() - 1, fimPeriodo.getMonth(), fimPeriodo.getDate()); // 1 ano antes
                                            const limiteSolicitacao = new Date(fimPeriodo.getFullYear(), fimPeriodo.getMonth() + 11, fimPeriodo.getDate()); // 11 meses após o fim
                                            
                                            // Início da barra é o início do período aquisitivo
                                            const inicioBarra = inicioPeriodo;
                                            
                                            // Debug específico para FLAVIO PEREIRA
                                            if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                                console.log('🔍 Debug FLAVIO PEREIRA - Cálculo de datas:', {
                                                    fimPeriodo,
                                                    inicioPeriodo,
                                                    inicioBarra,
                                                    limiteSolicitacao,
                                                    data_minima_solicitacao: aus.data_minima_solicitacao
                                                });
                                            }
                                            
                                            // Verifica se o período está perdido usando o campo da API
                                            const isPerdido = aus.periodo_perdido === true;
                                            
                                            if (colab.nome === 'FLAVIO PEREIRA DOS SANTOS') {
                                                console.log('🔍 Debug FLAVIO PEREIRA - isPerdido:', isPerdido);
                                            }
                                            
                                            const { startPercent, widthPercent } = getBarPosition(inicioBarra, limiteSolicitacao, startDate, totalDays);
                                            
                                            if (isPerdido) {
                                                // Período perdido - não pode mais solicitar
                                                const tooltip = `Período Aquisitivo: ${format(inicioPeriodo, 'dd/MM/yyyy')} até ${format(fimPeriodo, 'dd/MM/yyyy')}\nData mínima para solicitar: ${format(inicioBarra, 'dd/MM/yyyy')}\nPERÍODO PERDIDO - Não é mais possível solicitar férias`;
                                                return (
                                                    <EventBar
                                                        key={`perdido-${i}`}
                                                        $startPercent={startPercent}
                                                        $widthPercent={widthPercent}
                                                        $type="perdido"
                                                        className="event-bar"
                                                        onClick={() => {
                                                            toast.current.show({
                                                                severity: 'warn',
                                                                summary: 'Período Perdido',
                                                                detail: `Não é mais possível solicitar férias para o período aquisitivo de ${format(inicioPeriodo, 'dd/MM/yyyy')} a ${format(fimPeriodo, 'dd/MM/yyyy')}.`,
                                                                life: 5000
                                                            });
                                                        }}
                                                        style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                                                        data-pr-tooltip={tooltip}
                                                    >
                                                        <IconWrapper $fill='white'>{statusIcons['perdido']}</IconWrapper>
                                                        Período Perdido
                                                        <span style={{marginLeft:8, color:'#fff', fontWeight:400, fontSize:13}}>({aus.nrodiasferias || 30} dias)</span>
                                                    </EventBar>
                                                );
                                            } else {
                                                // NOVA REGRA: não exibe "a solicitar" se funcionario_marcado_demissao
                                                if (colab.funcionario_marcado_demissao === true) return null;
                                                // Ainda pode solicitar
                                                const tooltip = `Período Aquisitivo: ${format(inicioPeriodo, 'dd/MM/yyyy')} até ${format(fimPeriodo, 'dd/MM/yyyy')}\nData mínima para solicitar: ${format(inicioBarra, 'dd/MM/yyyy')}\nLimite para solicitar: ${format(limiteSolicitacao, 'dd/MM/yyyy')}`;
                                                return (
                                                    <EventBar
                                                        key={`requisitar-${i}`}
                                                        $startPercent={startPercent}
                                                        $widthPercent={widthPercent}
                                                        $type="aSolicitar"
                                                        className="event-bar"
                                                        onClick={() => handleEventClick(colab, {
                                                            periodo_aquisitivo_inicio: inicioPeriodo,
                                                            periodo_aquisitivo_fim: fimPeriodo,
                                                            limite: limiteSolicitacao,
                                                            saldo_dias: aus.nrodiasferias || 30,
                                                            data_minima_solicitacao: aus.data_minima_solicitacao || null,
                                                            data_minima_solicitacao_formatada: aus.data_minima_solicitacao_formatada || null,
                                                            dias_antecedencia_necessarios: aus.dias_antecedencia_necessarios || 0,
                                                            funcionario_tipo_situacao_id: aus.funcionario_tipo_situacao_id || null,
                                                            funcionario_situacao_padrao: aus.funcionario_situacao_padrao || false,
                                                            aviso_ferias: aus.aviso_ferias || null,
                                                            abono_pecuniario: aus.abono_pecuniario || false,
                                                            ferias_coletivas: aus.ferias_coletivas || false,
                                                            tarefas: aus.tarefas
                                                        }, 'aSolicitar')}
                                                        style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                                                        data-pr-tooltip={tooltip}
                                                    >
                                                        <IconWrapper $fill='white'>{statusIcons['aSolicitar']}</IconWrapper>
                                                        A solicitar até {format(limiteSolicitacao, 'dd/MM/yyyy')}
                                                        <span style={{marginLeft:8, color:'#fff', fontWeight:400, fontSize:13}}>({aus.nrodiasferias || 30} dias)</span>
                                                    </EventBar>
                                                );
                                            }
                                        }
                                        
                                        // Eventos normais com dt_inicio e dt_fim
                                        const status = getFeriasStatus(aus, new Date());
                                        const type = mapStatusToType(aus.status, aus.data_inicio, aus.data_fim);
                                        const { startPercent, widthPercent } = getBarPosition(aus.data_inicio, aus.data_fim, startDate, totalDays);
                                        let label = '';
                                        if (type === 'aprovada' || type === 'passada' || type === 'finalizada' || type === 'paga') label = `${format(parseDateAsLocal(aus.data_inicio), 'dd/MM/yyyy')} até ${format(parseDateAsLocal(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'acontecendo' || type === 'solicitada' || type === 'marcada') label = `${format(parseDateAsLocal(aus.data_inicio), 'dd/MM/yyyy')} até ${format(parseDateAsLocal(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'rejeitada') return null; // não exibe
                                        if (type === 'aguardando') return null;
                                        
                                        let tooltip = `Início: ${format(parseDateAsLocal(aus.data_inicio), 'dd/MM/yyyy')}\nFim: ${format(parseDateAsLocal(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'acontecendo') {
                                            tooltip = 'Em curso';
                                        } else if (type === 'solicitada') {
                                            tooltip = 'Solicitada';
                                        } else if (type === 'marcada') {
                                            tooltip = 'Marcada';
                                        } else if (type === 'aprovada') {
                                            tooltip = 'Aprovada';
                                        } else if (type === 'finalizada') {
                                            tooltip = 'Finalizada';
                                        } else if (type === 'paga') {
                                            tooltip = 'Paga';
                                        } else if (type === 'passada') {
                                            tooltip = 'Concluída';
                                        }
                                        
                                        // Adiciona período aquisitivo ao evento se não existir
                                        const eventoComPeriodo = {
                                            ...aus,
                                            periodo_aquisitivo_inicio: aus.periodo_aquisitivo_inicio,
                                            periodo_aquisitivo_fim: aus.periodo_aquisitivo_fim,
                                            data_minima_solicitacao: aus.data_minima_solicitacao || null,
                                            data_minima_solicitacao_formatada: aus.data_minima_solicitacao_formatada || null,
                                            dias_antecedencia_necessarios: aus.dias_antecedencia_necessarios || 0,
                                            funcionario_tipo_situacao_id: aus.funcionario_tipo_situacao_id || null,
                                            funcionario_situacao_padrao: aus.funcionario_situacao_padrao || false,
                                            tarefas: aus.tarefas
                                        };
                                        
                                        return (
                                            <EventBar
                                                key={i}
                                                $startPercent={startPercent}
                                                $widthPercent={widthPercent}
                                                $type={type}
                                                className="event-bar"
                                                onClick={() => handleEventClick(colab, eventoComPeriodo, type)}
                                                style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                                                data-pr-tooltip={tooltip}
                                            >
                                                <IconWrapper $fill='white'>{statusIcons[type]}</IconWrapper>
                                                {label}
                                            </EventBar>
                                        );
                                    });
                                })()}
                            </DaysBar>
                        </EmployeeRow>
                        );
                    })}
                </CalendarGrid>
                )}
            </CalendarScrollArea>
            <ModalDetalhesFerias
                opened={!!modalEvento}
                evento={modalEvento}
                aoFechar={fecharModal}
            />
        </CalendarContainer>
    );
};

export default CalendarFerias; 