import http from '@http'
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import Management from '@assets/Management.svg'
import CampoTexto from '@components/CampoTexto'
import DataTableFerias from '@components/DataTableFerias'
import ModalSelecionarColaborador from '@components/ModalSelecionarColaborador'
import ModalDetalhesFerias from '@components/ModalDetalhesFerias'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import CalendarFerias from './calendar_ferias'
import { FaListUl, FaRegCalendarAlt, FaUmbrellaBeach, FaSpinner, FaSearch, FaCalendarCheck } from 'react-icons/fa';
import Texto from '@components/Texto';
import { BsSearch } from 'react-icons/bs'
import { ArmazenadorToken } from '@utils';
import DropdownItens from '@components/DropdownItens';
import { Toast } from 'primereact/toast';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    width: 100%;
`;

const TabPanel = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding-top: 2px;
`

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ $active }) => $active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#f5f5f5'};
    color: ${({ $active }) => $active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ $active }) => $active ? '0 2px 8px var(--gradient-secundaria)40' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ $active }) => $active ? '2px solid var(--gradient-secundaria)' : '2px solid transparent'};
    &:hover {
        background: ${({ $active }) => $active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#ececec'};
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    
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
`

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    transition: all 0.2s ease;
`;

const ModernDropdown = styled.div`
    position: relative;
    min-width: 140px;
    
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

const SearchContainer = styled.div`
    position: relative;
    min-width: 200px;
    
    input {
        width: 100%;
        padding: 10px 16px;
        padding-left: 44px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-weight: 600;
        font-size: 14px;
        color: #374151;
        background: #ffffff;
        transition: all 0.2s ease;
        
        &::placeholder {
            color: #9ca3af;
        }
        
        &:hover {
            border-color: #9ca3af;
            background: #f9fafb;
        }
        
        &:focus {
            outline: none;
            border-color: var(--primaria);
            background: #ffffff;
        }
    }
    
    .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        font-size: 16px;
        pointer-events: none;
    }
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, var(--primaria) 0%, var(--primaria) 100%);
    color: var(--secundaria);
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
    min-width: 140px;
    justify-content: center;
    
    &:hover {
        transform: translateY(-1px);
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
    }
    
    svg {
        font-size: 16px;
    }
`;

// Configurar o localizador com Moment.js
const localizer = momentLocalizer(moment);

// Constantes
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_PAGE_SIZE = 10;

function FeriasListagem() {
    // Estados principais
    const [ferias, setFerias] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [tab, setTab] = useState('calendario');
    
    // Estados para filtros da lista
    const [anoSelecionado, setAnoSelecionado] = useState(null);
    const [periodoAberto, setPeriodoAberto] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    
    // Estados para filtro de situação
    const [filters, setFilters] = useState({
        'situacaoferias': { value: null, matchMode: 'custom' }
    });
    
    // Estados para filtro de situação do calendário
    const [situacaoCalendario, setSituacaoCalendario] = useState('');
    const [situacoesDisponiveis, setSituacoesDisponiveis] = useState([]);
    const [loadingFiltroSituacao, setLoadingFiltroSituacao] = useState(false);
    const [filtroSemResultados, setFiltroSemResultados] = useState(false);
    
    // Estados para ordenação
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    
    // Estados para cursor pagination (calendário)
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isRendering, setIsRendering] = useState(false); // Estado para controlar renderização
    
    // Estados gerais
    const [searchTerm, setSearchTerm] = useState('');
    const [modalSelecaoColaboradorOpened, setModalSelecaoColaboradorOpened] = useState(false);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    
    // Refs
    const toast = useRef(null);
    const abortControllerRef = useRef(null);
    
    // Contexts
    const context = useOutletContext();
    const { usuario } = useSessaoUsuarioContext();

    // Situações dinâmicas para filtro (busca da API)
    const [situacoesFerias, setSituacoesFerias] = useState([]);

    // Buscar situações disponíveis da API
    useEffect(() => {
        const fetchSituacoes = async () => {
            try {
                const response = await http.get('ferias/situacoes/');
                // A resposta já vem no formato correto: [{value, label}, ...]
                setSituacoesFerias(response || []);
                setSituacoesDisponiveis(response || []);
            } catch (error) {
                console.error('Erro ao buscar situações de férias:', error);
                // Fallback para as situações básicas se a API falhar
                const situacoesFallback = [
                    { value: 'I', label: 'Iniciada Solicitação' },
                    { value: 'E', label: 'Em Análise' },
                    { value: 'A', label: 'Aprovado' },
                    { value: 'F', label: 'Finalizada' },
                    { value: 'M', label: 'Marcada' },
                    { value: 'P', label: 'Pagas' }
                ];
                setSituacoesFerias(situacoesFallback);
                setSituacoesDisponiveis(situacoesFallback);
            }
        };

        fetchSituacoes();
    }, []);

    // Lista de anos disponíveis
    const anosDisponiveis = useMemo(() => [
        { name: 'Todos os anos', value: null },
        { name: 'Últimos 2 anos', value: 'ultimos_2' },
        { name: 'Últimos 3 anos', value: 'ultimos_3' },
        { name: 'Últimos 4 anos', value: 'ultimos_4' },
        ...Array.from({ length: 9 }, (_, i) => {
            const yearItem = CURRENT_YEAR - 6 + i;
            return { name: yearItem.toString(), value: yearItem };
        })
    ], []);

    // Opções do filtro de período aberto
    const opcoesPeriodoAberto = [
        { name: 'Apenas Abertos', value: true },
        { name: 'Apenas Fechados', value: false },
        { name: 'Todos os Períodos', value: null }
    ];

    // Função para construir parâmetro de ordenação
    const getSortParam = useCallback(() => {
        if (!sortField || !sortOrder) return '';
        return `${sortOrder === 'desc' ? '-' : ''}${sortField}`;
    }, [sortField, sortOrder]);

    // Função para construir URL baseada na aba
    const buildApiUrl = useCallback((isLoadMore = false) => {
        if (tab === 'calendario' && isLoadMore && nextCursor) {
            // Se está carregando mais dados do calendário e tem nextCursor, 
            // extrai apenas o path da URL (remove o domínio e /api/)
            try {
                const url = new URL(nextCursor);
                let finalUrl = url.pathname + url.search;
                
                // Remove /api/ do início se existir (pois o http interceptor já adiciona)
                if (finalUrl.startsWith('/api/')) {
                    finalUrl = finalUrl.substring(5); // Remove '/api/'
                }
                
                // Adiciona o termo de busca se houver e não estiver na URL
                if (searchTerm.trim() && !finalUrl.includes('funcionario_nome=')) {
                    const separator = finalUrl.includes('?') ? '&' : '?';
                    finalUrl += `${separator}funcionario_nome=${encodeURIComponent(searchTerm.trim())}`;
                }
                
                return finalUrl;
            } catch (error) {
                console.warn('Erro ao processar URL do cursor:', error);
                return nextCursor; // fallback para a URL completa
            }
        }
        
        let url = `ferias/`;
        
        // Adiciona termo de busca se houver
        if (searchTerm.trim()) {
            if(!url.includes('?')) {
                url += `?`;
            } else {
                url += `&`;
            }
            url += `funcionario_nome=${encodeURIComponent(searchTerm.trim())}`;
        }
        
        if (tab === 'calendario') {
            if(!url.includes('?')) {
                url += `?`;
            } else {
                url += `&`;
            }
            // Para calendário: usar cursor pagination
            url += `cursor`;
            url += `&page_size=10`; // Páginas maiores para calendário
            url += `&ordering=fimperaquis`;
            
            // Filtrar por período aquisitivo
            const anoAtual = new Date().getFullYear();
            const fimAnoPassado = new Date(anoAtual - 1, 11, 31);
            fimAnoPassado.setMonth(fimAnoPassado.getMonth() + 22);
            url += `&fimperaquis__lte=${fimAnoPassado.toISOString().split('T')[0]}`;
            url += `&fimperaquis__gte=${new Date(CURRENT_YEAR, 0, 1).toISOString().split('T')[0]}`;
            
            // Filtro de período
            if (!periodoAberto || periodoAberto === false || periodoAberto === 'false') {
                url += `&incluir_finalizadas=true`;
            }
            if (periodoAberto !== null && typeof periodoAberto !== 'object') {
                url += `&periodo_aberto=${periodoAberto}`;
            }

            // Filtro de situação (apenas para calendário)
            if (situacaoCalendario && situacaoCalendario !== '') {
                url += `&situacaoferias=${encodeURIComponent(situacaoCalendario)}`;
            }
        } else {
            // Para lista: usar paginação tradicional
            if(!url.includes('?')) {
                url += `?`;
            } else {
                url += `&`;
            }
            url += `page=${currentPage}&page_size=${pageSize}`;
            
            // Ordenação
            const sortParam = getSortParam();
            if (sortParam) {
                url += `&ordering=${sortParam}`;
            } else {
                url += `&ordering=fimperaquis`;
            }
            
            // Filtro de ano
            if (anoSelecionado !== null && typeof anoSelecionado !== 'object') {
                if (anoSelecionado === 'ultimos_2') {
                    url += `&dt_inicio__gte=${new Date(CURRENT_YEAR - 1, 0, 1).toISOString().split('T')[0]}`;
                } else if (anoSelecionado === 'ultimos_3') {
                    url += `&dt_inicio__gte=${new Date(CURRENT_YEAR - 2, 0, 1).toISOString().split('T')[0]}`;
                } else if (anoSelecionado === 'ultimos_4') {
                    url += `&dt_inicio__gte=${new Date(CURRENT_YEAR - 3, 0, 1).toISOString().split('T')[0]}`;
                } else {
                    url += `&ano=${anoSelecionado}`;
                }
            }
            
            // Filtro de período
            if (!periodoAberto || periodoAberto === false || periodoAberto === 'false') {
                url += `&incluir_finalizadas=true`;
            }
            if (periodoAberto !== null && typeof periodoAberto !== 'object') {
                url += `&periodo_aberto=${periodoAberto}`;
            }

            // Filtro de situação (apenas para lista)
            const situacaoFilter = filters?.['situacaoferias']?.value;
            if (situacaoFilter && Array.isArray(situacaoFilter) && situacaoFilter.length > 0) {
                // Usar diretamente os valores da API (I, E, A, F, M, P)
                const paramValue = situacaoFilter.join(',');
                url += `&situacaoferias__in=${encodeURIComponent(paramValue)}`;
            }
        }
        
        return url;
    }, [tab, searchTerm, currentPage, pageSize, anoSelecionado, periodoAberto, nextCursor, getSortParam, filters, situacaoCalendario]);

    // Função para carregar dados
    const loadData = useCallback(async (isLoadMore = false, lightLoad = false) => {
        // Cancela requisição anterior se existir
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Cria novo AbortController
        abortControllerRef.current = new AbortController();
        
        if (!isLoadMore && !lightLoad) {
            setLoading(true);
        } else if (isLoadMore) {
            setIsLoadingMore(true);
        }
        
        try {
            const url = buildApiUrl(isLoadMore);
            const response = await http.get(url, { 
                signal: abortControllerRef.current.signal 
            });
            
            if (!abortControllerRef.current.signal.aborted) {
                const newData = response.results || response;
                
                if (tab === 'calendario') {
                    // Para calendário com cursor pagination
                    if (isLoadMore) {
                                                    // Filtra apenas itens que não existem no calendário atual
                            const existingIds = new Set((ferias || []).map(item => item.id));
                            const newItemsOnly = newData.filter(item => !existingIds.has(item.id));
                            
                            if (newItemsOnly.length > 0) {
                                // Marca novos itens para garantir que vão para o final do calendário
                                const newDataWithMarker = newItemsOnly.map(item => ({
                                    ...item,
                                    _isNewItem: true
                                }));
                                
                                // Sinaliza que está renderizando
                                setIsRendering(true);
                                setFerias(prev => [...(prev || []), ...newDataWithMarker]);
                                
                                // Aguarda o calendário processar os dados - timing mais conservador
                                setTimeout(() => {
                                    setIsRendering(false);
                                    
                                    // Aguarda mais tempo para garantir que o calendário processou completamente
                                    setTimeout(() => {
                                        setIsLoadingMore(false);
                                    }, 1200); // Tempo mais conservador para garantir renderização completa
                                }, 300);
                            } else {
                                setIsLoadingMore(false);
                            }
                    } else {
                        setFerias(newData);
                    }
                    
                    // Atualiza cursor e hasMore
                    // Para cursor pagination, armazena a URL completa do next
                    setNextCursor(response.next || null);
                    setHasMore(!!response.next);
                } else {
                    // Para lista com paginação tradicional
                    setFerias(newData);
                    setTotalRecords(response.count || 0);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Erro ao carregar férias:', error);
                if (!isLoadMore) {
                    setFerias(null);
                }
            }
        } finally {
            if (!abortControllerRef.current.signal.aborted) {
                if (!lightLoad) {
                    setLoading(false);
                }
                // Para lazy loading, só finaliza se não estiver renderizando
                if (!isLoadMore) {
                    setIsLoadingMore(false);
                }
                // Remove loading do filtro de situação se estava ativo
                setLoadingFiltroSituacao(false);
            }
        }
    }, [buildApiUrl, tab]);

    // Função para carregar mais dados (lazy loading)
    const loadMore = useCallback(() => {
        if (tab === 'calendario' && hasMore && !isLoadingMore) {
            loadData(true);
        }
    }, [tab, hasMore, isLoadingMore, loadData]);

    // Effect principal para carregar dados (sem ordenação)
    useEffect(() => {
        // Reset estados quando mudar de aba
        if (tab === 'calendario') {
            setNextCursor(null);
            setHasMore(true);
        }
        
        loadData(false);
    }, [tab, anoSelecionado, searchTerm, periodoAberto, currentPage, pageSize, forceUpdate, filters]);

    // Effect separado para ordenação (não reseta loading completo)
    useEffect(() => {
        // Só aplica na aba "lista" e se já há dados carregados
        if (tab === 'lista' && ferias !== null) {
            // Recarrega tanto quando há ordenação quanto quando é removida
            loadData(false, true); // lightLoad = true para ordenação
        }
    }, [sortField, sortOrder, tab, loadData]);

    // Cleanup: cancela requisições pendentes
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Reset paginação quando filtros mudarem (apenas para lista, exceto ordenação)
    useEffect(() => {
        if (tab === 'lista') {
            setCurrentPage(1);
        }
    }, [anoSelecionado, searchTerm, periodoAberto, tab, filters]);

    // Função para lidar com mudança de aba
    const handleTabChange = useCallback((newTab) => {
        setTab(newTab);
        
        if (newTab === 'lista') {
            // Reset completo dos estados da lista
            setCurrentPage(1);
            setSortField('');
            setSortOrder('');
            
            // Reset forçado dos filtros
            const resetFilters = {
                'situacaoferias': { value: null, matchMode: 'custom' }
            };
            setFilters(resetFilters);
            setSituacaoCalendario(''); // Reset filtro de situação do calendário
            
            // Força uma atualização para garantir que tudo seja resetado
            setTimeout(() => {
                setForceUpdate(prev => prev + 1);
            }, 100);
            
        } else if (newTab === 'calendario') {
            // Reset estados do calendário
            setSortField('');
            setSortOrder('');
            setNextCursor(null);
            setHasMore(true);
            setSituacaoCalendario(''); // Reset filtro de situação do calendário
            setFiltroSemResultados(false); // Reset estado de sem resultados
        }
    }, []);

    // Função para lidar com mudança de situação no calendário
    const handleSituacaoCalendarioChange = useCallback(async (novoValor) => {
        setLoadingFiltroSituacao(true);
        setFiltroSemResultados(false); // Reset estado anterior
        setSituacaoCalendario(novoValor);
        
        // Faz a requisição imediatamente com o novo valor
        // Cancela requisição anterior se existir
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Cria novo AbortController
        abortControllerRef.current = new AbortController();
        
        try {
            // Constrói URL com o novo valor de situação
            let url = `ferias/`;
            
            if (searchTerm.trim()) {
                url += `?funcionario_nome=${encodeURIComponent(searchTerm.trim())}`;
            } else {
                url += `?`;
            }
            
            // Parâmetros do calendário
            url += `cursor`;
            url += `&page_size=10`;
            url += `&periodo_aberto=true`;
            url += `&incluir_finalizadas=true`;
            url += `&ordering=fimperaquis`;
            
            // Filtrar por período aquisitivo
            const anoAtual = new Date().getFullYear();
            const fimAnoPassado = new Date(anoAtual - 1, 11, 31);
            fimAnoPassado.setMonth(fimAnoPassado.getMonth() + 22);
            url += `&fimperaquis__lte=${fimAnoPassado.toISOString().split('T')[0]}`;
            url += `&fimperaquis__gte=${new Date(CURRENT_YEAR, 0, 1).toISOString().split('T')[0]}`;
            
            // Aplica o novo filtro de situação imediatamente
            if (novoValor && novoValor !== '') {
                url += `&situacaoferias=${encodeURIComponent(novoValor)}`;
            } else {
                // Se removeu o filtro, reset o estado de sem resultados
                setFiltroSemResultados(false);
            }
            
            const response = await http.get(url, { 
                signal: abortControllerRef.current.signal 
            });
            
            if (!abortControllerRef.current.signal.aborted) {
                const newData = response.results || response;
                setFerias(newData);
                setNextCursor(response.next || null);
                setHasMore(!!response.next);
                
                // Se não trouxe resultados e há um filtro ativo, mostra estado vazio específico
                if ((!newData || newData.length === 0) && novoValor && novoValor !== '') {
                    setFiltroSemResultados(true);
                } else {
                    setFiltroSemResultados(false);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Erro ao aplicar filtro de situação:', error);
            }
        } finally {
            if (!abortControllerRef.current.signal.aborted) {
                setLoadingFiltroSituacao(false);
            }
        }
    }, [searchTerm]);

    // Função para lidar com seleção de colaborador
    const handleColaboradorSelecionado = useCallback(async (colaborador) => {
        setModalSelecaoColaboradorOpened(false);

        if (!colaborador?.id) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Colaborador inválido selecionado', 
                life: 3000 
            });
            return;
        }

        try {
            const feriasColaborador = await http.get(`ferias/?format=json&funcionario=${colaborador.id}`);
            const feria = feriasColaborador[0];

            if (!feria) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Não há férias disponíveis para este colaborador', 
                    life: 3000 
                });
                return;
            }

            const [anoRow, mesRow, diaRow] = feria.fimperaquis.split('T')[0].split('-').map(Number);
            const dataInicioRow = new Date(anoRow - 1, mesRow - 1, diaRow);
            
            const evento = {
                colab: {
                    id: colaborador.id,
                    nome: colaborador.nome || colaborador.funcionario_nome || colaborador.funcionario_pessoa_fisica?.nome,
                    gestor: colaborador.gestor,
                    funcionario_situacao_padrao: colaborador.funcionario_situacao_padrao === true
                },
                evento: {
                    periodo_aquisitivo_inicio: dataInicioRow,
                    periodo_aquisitivo_fim: feria.fimperaquis,
                    saldo_dias: feria.nrodiasferias,
                    limite: feria.fimperaquis,
                    aviso_ferias: feria.aviso_ferias || null,
                    abono_pecuniario: feria.abono_pecuniario || false,
                    ferias_coletivas: feria.ferias_coletivas || false,
                    data_minima_solicitacao: feria.data_minima_solicitacao || null,
                    data_minima_solicitacao_formatada: feria.data_minima_solicitacao_formatada || null,
                    dias_antecedencia_necessarios: feria.dias_antecedencia_necessarios || 0,
                    funcionario_situacao_padrao: feria.funcionario_situacao_padrao || false,
                    tarefas: feria.tarefas
                },
                tipo: 'aSolicitar'
            };
            
            setEventoSelecionado(evento);
        } catch (error) {
            console.error('Erro ao buscar férias do colaborador:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao buscar férias do colaborador', 
                life: 3000 
            });
        }
    }, []);

    // Função para lidar com ordenação
    const handleSort = useCallback((sortInfo) => {
        console.log('📥 Lista recebendo sort:', sortInfo);
        const { field, order } = sortInfo;
        console.log('🔄 Atualizando estados:', { field, order });
        setSortField(field);
        setSortOrder(order);
    }, []);

    // Função para lidar com filtros
    const handleFilter = useCallback((event) => {
        const newFilters = { ...event.filters };
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    // Função para fechar modal com resultado
    const handleFecharModal = useCallback((resultado) => {
        setEventoSelecionado(null);
        
        if (resultado) {
            const severityMap = {
                sucesso: 'success',
                erro: 'error',
                aviso: 'warn',
                info: 'info'
            };
            
            const severity = Object.keys(severityMap).find(key => resultado[key]);
            if (severity) {
                toast.current.show({ 
                    severity: severityMap[severity], 
                    summary: severity === 'sucesso' ? 'Sucesso' : 
                            severity === 'erro' ? 'Erro' :
                            severity === 'aviso' ? 'Atenção' : 'Aviso',
                    detail: resultado.mensagem, 
                    life: 3000 
                });
                
                // Apenas atualiza em caso de sucesso
                if (severity === 'sucesso') {
                    setForceUpdate(prev => prev + 1);
                }
            }
        }
    }, []);

    return (
        <ConteudoFrame>
            <Loading opened={loading} />
            <Toast ref={toast} />
            
            <HeaderRow>
                <TabPanel>
                    <TabButton $active={tab === 'calendario'} onClick={() => handleTabChange('calendario')}>
                        <FaRegCalendarAlt fill={tab === 'calendario' ? 'white' : '#000'} />
                        <Texto color={tab === 'calendario' ? 'white' : '#000'}>Calendário</Texto>
                    </TabButton>
                    <TabButton $active={tab === 'lista'} onClick={() => handleTabChange('lista')}>
                        <FaListUl fill={tab === 'lista' ? 'white' : '#000'} />
                        <Texto color={tab === 'lista' ? 'white' : '#000'}>Lista</Texto>
                    </TabButton>
                </TabPanel>
                
                <FiltersContainer>
                    {tab === 'lista' && (
                        <>
                            <ModernDropdown>
                                <select 
                                    value={anoSelecionado || ''} 
                                    onChange={(e) => setAnoSelecionado(e.target.value === '' ? null : e.target.value)}
                                >
                                    {anosDisponiveis.map((ano) => (
                                        <option key={ano.value || 'todos'} value={ano.value || ''}>
                                            {ano.name}
                                        </option>
                                    ))}
                                </select>
                            </ModernDropdown>
                        </>
                    )}
                    {tab === 'calendario' && (
                        <ModernDropdown>
                            <select 
                                value={situacaoCalendario} 
                                onChange={(e) => handleSituacaoCalendarioChange(e.target.value)}
                                disabled={loadingFiltroSituacao}
                                style={{ 
                                    opacity: loadingFiltroSituacao ? 0.6 : 1,
                                    cursor: loadingFiltroSituacao ? 'wait' : 'pointer'
                                }}
                            >
                                <option value="">Todas as Situações</option>
                                {situacoesDisponiveis.map((situacao) => (
                                    <option key={situacao.value} value={situacao.value}>
                                        {situacao.label}
                                    </option>
                                ))}
                            </select>
                        </ModernDropdown>
                    )}
                    
                    <ModernDropdown>
                        <select 
                            value={periodoAberto === null ? '' : periodoAberto} 
                            onChange={(e) => setPeriodoAberto(e.target.value === '' ? null : e.target.value === 'true')}
                        >
                            {opcoesPeriodoAberto.map((opcao) => (
                                <option key={opcao.value} value={opcao.value === null ? '' : opcao.value}>
                                    {opcao.name}
                                </option>
                            ))}
                        </select>
                    </ModernDropdown>
                    <SearchContainer>
                        <BsSearch className="search-icon" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por colaborador"
                        />
                    </SearchContainer>
                    
                    {(ArmazenadorToken.hasPermission('add_ferias') || usuario.tipo === 'colaborador') && (
                        <ActionButton onClick={() => setModalSelecaoColaboradorOpened(true)}>
                            <FaUmbrellaBeach fill='var(--secundaria)'/>
                            Solicitar Férias
                        </ActionButton>
                    )}
                </FiltersContainer>
            </HeaderRow>
            
            <Wrapper>
                {loading ? (
                    tab === 'calendario' ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '400px',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid #e5e7eb',
                                borderTop: '3px solid var(--primaria)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
                                Carregando dados do calendário...
                            </p>
                        </div>
                    ) : <></>
                ) : (
                    <>
                        {tab === 'calendario' && (
                            <div style={{ position: 'relative', width: '100%' }}>
                                {filtroSemResultados ? (
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
                                    <CalendarFerias 
                                        colaboradores={ferias || []} 
                                        onUpdate={() => setForceUpdate(prev => prev + 1)}
                                        onLoadMore={loadMore}
                                        hasMore={hasMore}
                                        isLoadingMore={isLoadingMore}
                                        isRendering={isRendering}
                                        situacoesUnicas={situacoesFerias}
                                    />
                                )}
                                {loadingFiltroSituacao && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 1000,
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '20px',
                                            backgroundColor: '#ffffff',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                border: '3px solid #e5e7eb',
                                                borderTop: '3px solid var(--primaria)',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                            <p style={{ 
                                                color: '#666', 
                                                fontSize: '14px', 
                                                margin: 0,
                                                fontWeight: '500'
                                            }}>
                                                Aplicando filtro...
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {tab === 'lista' && (
                            <DataTableFerias 
                                ferias={ferias || []} 
                                totalRecords={totalRecords}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                onUpdate={() => setForceUpdate(prev => prev + 1)}
                                onSort={handleSort}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onFilter={handleFilter}
                                filtersProp={filters}
                                situacoesUnicas={situacoesFerias}
                            />
                        )}
                    </>
                )}
            </Wrapper>
            
            <ModalSelecionarColaborador 
                opened={modalSelecaoColaboradorOpened} 
                aoFechar={() => setModalSelecaoColaboradorOpened(false)} 
                aoSelecionar={handleColaboradorSelecionado}
                demitidos={false}
            />
            
            <ModalDetalhesFerias 
                opened={!!eventoSelecionado} 
                evento={eventoSelecionado} 
                aoFechar={handleFecharModal}
            />
        </ConteudoFrame>
    );
}

export default FeriasListagem