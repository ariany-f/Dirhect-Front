import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { format, addMonths, startOfMonth, endOfMonth, addDays, isMonday, getMonth, getYear, differenceInCalendarDays, isAfter, isBefore, isWithinInterval, format as formatDateFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaThLarge, FaThList, FaCalendarAlt, FaTh, FaExpandArrowsAlt } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import ModalDetalhesFerias from '@components/ModalDetalhesFerias';
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
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
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

// const EmployeeRow = styled.div`
//     display: grid;
//     grid-template-columns: 200px 1fr;
//     align-items: center;
//     min-height: 44px;
//     margin: 0;
//     padding: 0;
//     border-bottom: none;
    
//     /* Fade-in sutil para todos os elementos */
//     opacity: 0;
//     animation: fadeInSoft 0.6s ease-out forwards;
//     animation-delay: ${({ $index }) => ($index || 0) * 0.05}s; /* Delay escalonado */
    
//     /* Animação específica para novos itens */
//     &.new-item {
//         animation: slideInFromBottom 0.4s ease-out forwards;
//         animation-delay: 0s; /* Sem delay para novos itens */
//     }
    
//     @keyframes fadeInSoft {
//         0% {
//             opacity: 0;
//             transform: translateY(8px);
//         }
//         100% {
//             opacity: 1;
//             transform: translateY(0);
//         }
//     }
    
//     @keyframes slideInFromBottom {
//         0% {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//         }
//         50% {
//             opacity: 0.7;
//             transform: translateY(-2px) scale(1.02);
//         }
//         100% {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//         }
//     }
// `;

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
    grid-template-columns: 280px repeat(${({ $totalDays }) => $totalDays}, 1fr);
    min-width: 100%;
`;

const WeekDayNameRow = styled.div`
    display: grid;
    grid-template-columns: 280px repeat(${({ $totalDays }) => $totalDays}, 1fr);
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
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    color: #333;
    font-size: 16px;
    padding-left: 12px;
    background: #f5f5f5;
    border: 1px solid #eee;
    min-height: 44px;
    height: 44px;
    position: sticky;
    left: 0;
    z-index: 3;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

const EmployeeName = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #333;
    line-height: 1.1;
`;

const EmployeeSection = styled.div`
    font-size: 12px;
    font-weight: 400;
    color: #666;
    line-height: 1.2;
    margin-top: 2px;
`;

const EmployeeRow = styled.div`
    display: grid;
    grid-template-columns: 280px 1fr;
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
    top: 8px;
    height: 24px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(44, 0, 80, 0.13);
    border-radius: 4px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 20px 0 12px;
    z-index: 2;
    overflow: hidden;
    white-space: nowrap;
    
    animation: fadeInSoft 0.2s ease-out forwards;
    animation-delay: 0s; /* Sem delay para novos itens */
    
    
    @keyframes fadeInSoft {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    
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
const DAY_WIDTH_SEMESTRAL = 20;
const DAY_WIDTH_ANUAL = 4;
const DAYS_IN_YEAR = 365;

const TrimestreHeader = styled.div`
    display: grid;
    grid-template-columns: 280px repeat(${({ $totalDays }) => $totalDays}, 1fr);
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

const CalendarFerias = ({ colaboradores, onUpdate, onLoadMore, hasMore, isLoadingMore, isRendering, situacoesUnicas = [], onFilterChange, secaoFiltroAtual }) => {
    const [visualizacao, setVisualizacao] = useState('trimestral'); // 'mensal', 'trimestral', 'semestral' ou 'anual'
    const [modalEvento, setModalEvento] = useState(null); // {colab, evento, tipo}
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragScrollLeft = useRef(0);
    const scrollRef = useRef();
    const containerRef = useRef();
    const toast = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1200);
    const loadMoreTriggerRef = useRef(null);
    const lastScrollPosition = useRef(0);
    const lastLoadTime = useRef(0); // Timestamp da última requisição

    // Estados para filtro de seção
    const [secoes, setSecoes] = useState([]);
    const [secaoSelecionada, setSecaoSelecionada] = useState(null);
    const [loadingSecoes, setLoadingSecoes] = useState(false);

    // Sincroniza o estado local com o filtro atual do componente pai
    useEffect(() => {
        setSecaoSelecionada(secaoFiltroAtual);
    }, [secaoFiltroAtual]);

    // Buscar seções da API
    useEffect(() => {
        const fetchSecoes = async () => {
            setLoadingSecoes(true);
            try {
                const response = await http.get('secao/');
                const secoesFormatadas = response.map(secao => ({
                    label: `${secao.id_origem} - ${secao.descricao}`,
                    value: secao.id_origem
                }));
                setSecoes(secoesFormatadas);
            } catch (error) {
                console.error('Erro ao buscar seções:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar seções',
                    life: 3000
                });
            } finally {
                setLoadingSecoes(false);
            }
        };

        fetchSecoes();
    }, []);

    // Função para lidar com mudança de seção
    const handleSecaoChange = useCallback((event) => {
        const novaSecao = event.value;
        setSecaoSelecionada(novaSecao);
        
        // Chama callback para atualizar filtros no componente pai
        if (onFilterChange) {
            onFilterChange({ secao_codigo: novaSecao });
        }
    }, [onFilterChange]);

    // Sistema de preservação de scroll simplificado

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

    // Controle para evitar múltiplas chamadas automáticas sem scroll do usuário
    const lastUserScrollTime = useRef(0);
    const hasTriggeredLoad = useRef(false);
    
    // Intersection Observer para lazy loading controlado
    useEffect(() => {
        if (!loadMoreTriggerRef.current || !onLoadMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                const now = Date.now();
                const timeSinceLastLoad = now - lastLoadTime.current;
                const timeSinceLastScroll = now - lastUserScrollTime.current;
                
                // Só carrega se:
                // 1. Está intersectando
                // 2. Não está carregando
                // 3. Passou tempo suficiente desde o último carregamento
                // 4. Não foi disparado ainda OU usuário rolou recentemente (últimos 2 segundos)
                if (target.isIntersecting && !isLoadingMore && timeSinceLastLoad > 1000) {
                    if (!hasTriggeredLoad.current || timeSinceLastScroll < 2000) {
                        console.log('🔍 Trigger detectado, carregando mais dados...', {
                            hasTriggeredLoad: hasTriggeredLoad.current,
                            timeSinceLastScroll
                        });
                        lastLoadTime.current = now;
                        hasTriggeredLoad.current = true;
                        onLoadMore();
                    } else {
                        console.log('⏳ Trigger detectado, mas aguardando nova interação do usuário');
                    }
                } else if (target.isIntersecting && timeSinceLastLoad <= 1000) {
                    console.log('⏰ Trigger detectado, mas muito cedo. Aguardando...', timeSinceLastLoad + 'ms');
                }
            },
            {
                root: scrollRef.current,
                threshold: 0.3,
                rootMargin: '100px'
            }
        );

        observer.observe(loadMoreTriggerRef.current);

        return () => {
            if (loadMoreTriggerRef.current) {
                observer.unobserve(loadMoreTriggerRef.current);
            }
        };
    }, [onLoadMore, hasMore, isLoadingMore]);

    // Effect para monitorar scroll e preservar posição + lazy loading backup
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

                const handleScroll = () => {
            lastScrollPosition.current = scrollElement.scrollTop;
            
            // Registra o tempo da última interação do usuário (scroll)
            lastUserScrollTime.current = Date.now();
            
            // Reset do flag quando usuário rola (permite nova chamada automática)
            if (hasTriggeredLoad.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollElement;
                const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
                
                // Se o usuário rolou para longe do final, permite nova chamada automática
                if (!isNearBottom) {
                    hasTriggeredLoad.current = false;
                    console.log('🔄 Flag reset - usuário rolou para longe do final');
                }
            }
        };

        scrollElement.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, isLoadingMore, onLoadMore]);

    // Effect para lidar com novos dados sem quebrar o scroll
    useEffect(() => {
        if (colaboradores && colaboradores.length > 0 && !isLoadingMore && lastScrollPosition.current > 0) {
            // Mantém a posição do scroll quando novos dados são adicionados
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = lastScrollPosition.current;
                }
            });
        }
    }, [colaboradores?.length, isLoadingMore]);

    // Estado local para controlar a limpeza das marcações _isNewItem
    const [colaboradoresLimpos, setColaboradoresLimpos] = useState([]);

    // Effect para remover marcação _isNewItem após animação dos novos itens
    useEffect(() => {
        const hasNewItems = colaboradores?.some(item => item._isNewItem);
        if (hasNewItems) {
            console.log('📊 Calendário recebeu novos itens, processando...');
            
            // Aguarda o calendário processar os novos dados
            const timer = setTimeout(() => {
                // Limpa as marcações _isNewItem localmente sem recarregar dados
                const colaboradoresSemMarcacao = colaboradores.map(item => ({
                    ...item,
                    _isNewItem: false
                }));
                setColaboradoresLimpos(colaboradoresSemMarcacao);
                console.log('✅ Novos itens processados e exibidos no calendário');
            }, 100); // Tempo mínimo para processamento
            
            return () => clearTimeout(timer);
        } else if (colaboradores && colaboradores.length > 0) {
            // Se não há novos itens mas há colaboradores, usa os originais
            setColaboradoresLimpos(colaboradores);
        }
    }, [colaboradores]);

    // Usa colaboradores limpos se disponível, senão usa os originais
    const colaboradoresParaUsar = (colaboradoresLimpos && colaboradoresLimpos.length > 0) ? colaboradoresLimpos : (colaboradores || []);

    // Função para normalizar os dados recebidos (API)
    const normalizarColaboradores = useCallback((colaboradores) => {
        if (!colaboradores || !Array.isArray(colaboradores)) return [];
        
        // Se já está no formato esperado (com ausencias), retorna como está
        if (colaboradores.length > 0 && colaboradores[0].ausencias) {
            return colaboradores;
        }
        
        // Normaliza dados da API de férias
        const colaboradoresMap = {};
        const colaboradoresOrder = []; // Para preservar a ordem original
        
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
                    funcionario_chapa: item.funcionario_chapa || '',
                    secao_codigo: item.secao_codigo || '',
                    secao_nome: item.secao_nome || '',
                    ausencias: [],
                    _isNewItem: item._isNewItem || false, // Preserva a marcação de novo item
                    _originalIndex: colaboradoresOrder.length // Preserva ordem original
                };
                colaboradoresOrder.push(funcionarioId); // Adiciona à lista de ordem
            }
            
            // Adiciona férias como ausências (evita duplicatas)
            if (item.dt_inicio && item.dt_fim) {
                // Verifica se esta ausência já existe
                const ausenciaExiste = colaboradoresMap[funcionarioId].ausencias.some(ausencia => ausencia.id === item.id);
                if (ausenciaExiste) {
                    return; // Pula este item se já existe
                }
                
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
                    data_pagamento: item.data_pagamento || null,
                    data_minima_solicitacao: item.data_minima_solicitacao || null,
                    data_minima_solicitacao_formatada: item.data_minima_solicitacao_formatada || null,
                    dias_antecedencia_necessarios: item.dias_antecedencia_necessarios || 0,
                    funcionario_tipo_situacao_id: item.funcionario_tipo_situacao_id || null,
                    funcionario_situacao_padrao: item.funcionario_situacao_padrao || false,
                    fimperaquis: item.fimperaquis || null,
                    tarefas: item.tarefas || [] // Tarefas agora vêm diretamente do item
                });
            } else if (item.fimperaquis) {
                // Verifica se esta ausência já existe (mesmo para fimperaquis)
                const ausenciaExiste = colaboradoresMap[funcionarioId].ausencias.some(ausencia => ausencia.id === item.id);
                if (ausenciaExiste) {
                    return; // Pula este item se já existe
                }
                
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
                    data_pagamento: item.data_pagamento || null,
                    data_minima_solicitacao: item.data_minima_solicitacao || null,
                    data_minima_solicitacao_formatada: item.data_minima_solicitacao_formatada || null,
                    dias_antecedencia_necessarios: item.dias_antecedencia_necessarios || 0,
                    funcionario_tipo_situacao_id: item.funcionario_tipo_situacao_id || null,
                    funcionario_situacao_padrao: item.funcionario_situacao_padrao || false,
                    tarefas: item.tarefas || [] // Tarefas agora vêm diretamente do item
                });
            }
        });
        
        // Retorna colaboradores na ordem original, filtrando os inválidos
        return colaboradoresOrder
            .map(funcionarioId => colaboradoresMap[funcionarioId])
            .filter(colab => {
                if (!colab || !colab.id || !colab.nome) {
                    console.warn('Colaborador inválido filtrado:', colab);
                    return false;
                }
                return true;
            });
    }, []);

    // Usa a função para garantir o formato correto
    const allColabs = normalizarColaboradores(colaboradoresParaUsar || []);
 
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
    const endDate = useMemo(() => endOfMonth(new Date(anoSelecionado, 22, 1)), [anoSelecionado]);
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
        } else if (visualizacao === 'trimestral') {
            return Math.max(12, Math.floor(containerWidth / 120)); // 4 meses (120 dias) visíveis
        } else if (visualizacao === 'semestral') {
            return Math.max(8, Math.floor(containerWidth / 200)); // 6-7 meses (200 dias) visíveis
        } else { // anual
            return Math.max(3, Math.floor(containerWidth / 380)); // ano completo (365 dias) visível
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
                    setTimeout(() => {
                        onUpdate();
                    }, 2000);
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

    // Função para buscar texto da situação na API
    const getSituacaoTexto = useCallback((statusCode) => {
        const situacaoEncontrada = situacoesUnicas.find(s => s.value === statusCode);
        return situacaoEncontrada ? situacaoEncontrada.label : null;
    }, [situacoesUnicas]);

    const ModernDropdown = styled.div`
        position: relative;
        min-width: 200px;
        
        select {
            appearance: none;
            background: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 10px 16px;
            padding-right: 40px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 100%;
            
            &:hover {
                border-color: #9ca3af;
                background: #f9fafb;
            }
            
            &:focus {
                outline: none;
                border-color: var(--primaria);
            }
        }
        
        &::after {
            content: '▼';
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
            font-size: 12px;
            pointer-events: none;
            transition: transform 0.2s ease;
        }
        
        &:hover::after {
            color: #374151;
        }
    `;

    return (
        <CalendarContainer ref={containerRef}>
            <Toast ref={toast} />
            <Tooltip target=".event-bar" />
            <FixedHeader>
                <ViewToggleBar>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ModernDropdown>
                            <select 
                                value={secaoSelecionada || ''} 
                                onChange={(e) => handleSecaoChange({ value: e.target.value === '' ? null : e.target.value })}
                                disabled={loadingSecoes}
                                style={{ 
                                    opacity: loadingSecoes ? 0.6 : 1,
                                    cursor: loadingSecoes ? 'wait' : 'pointer'
                                }}
                            >
                                <option value="">Filtrar por seção</option>
                                {secoes.map((secao) => (
                                    <option key={secao.value} value={secao.value}>
                                        {secao.label}
                                    </option>
                                ))}
                            </select>
                        </ModernDropdown>
                    </div>
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
                        <ViewToggleOption
                            $active={visualizacao === 'semestral'}
                            onClick={() => setVisualizacao('semestral')}
                            title="Visualização semestral"
                        >
                            <FaTh fill={visualizacao === 'semestral' ? 'white' : 'black'} /> Semestral
                        </ViewToggleOption>
                        <ViewToggleOption
                            $active={visualizacao === 'anual'}
                            onClick={() => setVisualizacao('anual')}
                            title="Visualização anual"
                        >
                            <FaExpandArrowsAlt fill={visualizacao === 'anual' ? 'white' : 'black'} /> Anual
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
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>Tente usar outro filtro ou período.</p>
                    </div>
                ) : (
                    <>
                    <CalendarGrid $totalDays={totalDays} $dayWidth={dayWidth} style={{position: 'relative', minHeight: '100%'}}>
                    {/* Fundo cinza para a coluna dos colaboradores */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '280px',
                        minwidth: '280px',
                        height: `${Math.max(colabsFiltrados.length * 44, 25 * 16)}px`,
                        background: '#f5f5f5',
                        borderRight: '1px solid #eee',
                        zIndex: 1
                    }}></div>
                    {/* Linhas roxas de separação dos meses */}
                    {monthsArray.map((m, idx) => {
                        if (idx === 0) return null; // não desenha antes do primeiro mês
                        const startIdx = differenceInCalendarDays(m.start, startDate); // índice do dia 1 do mês
                        const leftPx = 280 + startIdx * dayWidth; // 200px da coluna fixa + dias * largura do dia
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
                                        {visualizacao === 'anual' ? 
                                            ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][m.start.getMonth()] :
                                            format(m.start, 'MMMM yyyy', { locale: ptBR }).toUpperCase()
                                        }
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
                        ) : visualizacao === 'mensal' ? (
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
                        ) : null}
                    </CalendarTableHeader>
                    {colabsFiltrados
                    .sort((a, b) => {
                        // Novos itens sempre vão para o final
                        if (a._isNewItem && !b._isNewItem) return 1;
                        if (!a._isNewItem && b._isNewItem) return -1;
                        
                        // Se ambos são novos ou ambos são antigos, mantém ordem original baseada no índice
                        if (a._isNewItem === b._isNewItem) {
                            // Se ambos têm _originalIndex, usa isso para manter a ordem
                            if (typeof a._originalIndex === 'number' && typeof b._originalIndex === 'number') {
                                return a._originalIndex - b._originalIndex;
                            }
                            // Fallback: mantém ordem alfabética se não há _originalIndex
                            return (a.nome || '').localeCompare(b.nome || '');
                        }
                        
                        return 0;
                    })
                    .map((colab, idx) => {
                        
                        // Verificação de segurança para garantir que colab tem dados necessários
                        if (!colab || !colab.id || !colab.nome) {
                            console.warn('Colaborador inválido encontrado:', colab);
                            return null;
                        }
                        
                        return (
                        <EmployeeRow 
                            key={colab.nome} 
                            $index={idx}
                            className={colab._isNewItem ? 'new-item' : ''}
                        >
                            <EmployeeCell>
                                <EmployeeName>{colab.nome} {colab.funcionario_chapa ? ` (${colab.funcionario_chapa})` : ''}</EmployeeName>
                                <EmployeeSection>
                                    {colab.secao_codigo ? `${colab.secao_codigo} ` : ''}
                                    {colab.secao_nome ? `${colab.secao_nome}` : ''}
                                </EmployeeSection>
                            
                            </EmployeeCell>
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
                                        
                                        // Se não tem dt_inicio e dt_fim, mas tem fimperaquis, verifica se pode solicitar ou se está perdido
                                        if (!aus.data_inicio && !aus.data_fim && aus.fimperaquis) {
                                            
                                            
                                            // NOVA REGRA: não exibe "a solicitar" se funcionario_marcado_demissao ou tipo_situacao Demitido
                                            if (colab.funcionario_marcado_demissao === true || aus.funcionario_situacao_padrao === true) {
                                                return null;
                                            }
                                            const fimPeriodo = parseDateAsLocal(aus.fimperaquis);
                                            const inicioPeriodo = new Date(fimPeriodo.getFullYear() - 1, fimPeriodo.getMonth(), fimPeriodo.getDate()); // 1 ano antes
                                            const limiteSolicitacao = new Date(fimPeriodo.getFullYear(), fimPeriodo.getMonth() + 11, fimPeriodo.getDate()); // 11 meses após o fim
                                            
                                            // Início da barra é o início do período aquisitivo
                                            const inicioBarra = inicioPeriodo;
                                            
                                            // Verifica se o período está perdido usando o campo da API
                                            const isPerdido = aus.periodo_perdido === true;
                
                                            
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
                                        
                                        // Tenta buscar o texto da situação na API primeiro
                                        const textoSituacaoAPI = getSituacaoTexto(aus.status);
                                        
                                        if (textoSituacaoAPI) {
                                            // Se encontrou na API, usa o texto da API
                                            tooltip = textoSituacaoAPI;
                                        } else {
                                            // Fallback para textos hardcoded se não encontrar na API
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
                
                {/* Trigger automático controlado para lazy loading */}
                {hasMore && (
                    <div ref={loadMoreTriggerRef} style={{ 
                        height: '40px',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '40px auto',
                        width: '100%',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {(isLoadingMore || isRendering) ? (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                color: '#666', 
                                fontSize: '14px' 
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #e5e7eb',
                                    borderTop: '2px solid var(--primaria)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                {isLoadingMore ? 'Carregando mais dados...' : 'Renderizando novos itens...'}
                            </div>
                        ) : (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                color: '#999', 
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #f0f0f0',
                                    borderTop: '2px solid #ccc',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                Role para carregar mais
                            </div>
                        )}
                    </div>
                )}
                </>
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