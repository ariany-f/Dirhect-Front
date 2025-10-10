import Titulo from '@components/Titulo'
import QuestionCard from '@components/QuestionCard'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import { AiFillQuestionCircle } from 'react-icons/ai'
import styled from 'styled-components'
import { useParams, useOutletContext } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import http from '@http'
import Loading from '@components/Loading'
import styles from './Detalhes.module.css'
import DataTableFerias from '@components/DataTableFerias'
import DataTablePeriodoAquisitivo from '@components/DataTablePeriodoAquisitivo'
import { useSessaoUsuarioContext } from '../../../contexts/SessaoUsuario'
import { GrAddCircle } from 'react-icons/gr'
import { ArmazenadorToken } from '@utils'
import { FaUmbrellaBeach } from 'react-icons/fa'
import Texto from '@components/Texto'

const DivPrincipal = styled.div`
    width: 65vw;
`

const TabPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 24px;
`

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px var(--gradient-secundaria)40' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid var(--gradient-secundaria)' : '2px solid transparent'};
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#ececec'};
    }
`

function ColabroadorFerias() {

    let { id } = useParams()
    const colaboradorDoContexto = useOutletContext();
    const [loading, setLoading] = useState(false)
    const [ferias, setFerias] = useState(null)
    const [periodosAquisitivos, setPeriodosAquisitivos] = useState(null)
    const [tab, setTab] = useState('ferias_gozadas') // 'periodo_aquisitivo' ou 'ferias_gozadas'
    const [forceUpdate, setForceUpdate] = useState(0)
    const {usuario} = useSessaoUsuarioContext()
    
    // Estados para paginação server-side
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const [filters, setFilters] = useState({})
    
    // Situações dinâmicas para filtro (busca da API)
    const [situacoesFerias, setSituacoesFerias] = useState([]);

    const colaborador = colaboradorDoContexto ? {
        ...colaboradorDoContexto
    } : null;

    // Função para construir URL da API com parâmetros de paginação
    const buildApiUrl = useCallback((endpoint, additionalParams = {}) => {
        const params = new URLSearchParams({
            format: 'json',
            funcionario: id,
            page: currentPage.toString(),
            page_size: pageSize.toString(),
            ...additionalParams
        });

        // Adicionar ordenação se existir
        if (sortField && sortOrder) {
            params.append('ordering', sortOrder === 'desc' ? `-${sortField}` : sortField);
        }

        // Adicionar filtros se existirem
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else {
                    params.append(key, value);
                }
            }
        });

        return `${endpoint}?${params.toString()}`;
    }, [id, currentPage, pageSize, sortField, sortOrder, filters]);

    // Buscar períodos aquisitivos (para verificar se pode solicitar férias)
    useEffect(() => {
        http.get(`feriasperiodoaquisitivo/?format=json&funcionario=${id}&periodo_aberto=true`)
        .then(response => {
            setPeriodosAquisitivos(response)
        })
        .catch(erro => {
            console.log(erro)
        })
    }, [id, forceUpdate])

    // Buscar dados baseado na aba ativa com paginação server-side
    useEffect(() => {
        setLoading(true)
        
        const endpoint = tab === 'periodo_aquisitivo' ? 'feriasperiodoaquisitivo/' : 'feriasperiodogozo/';
        const url = buildApiUrl(endpoint);
        
        http.get(url)
        .then(response => {
            // Verificar se a resposta tem estrutura paginada
            if (response.results !== undefined) {
                // Resposta paginada
                setFerias(response.results)
                setTotalRecords(response.count || 0)
            } else {
                // Resposta não paginada (fallback)
                setFerias(response)
                setTotalRecords(response.length || 0)
            }
            setLoading(false)
        })
        .catch(erro => {
            console.log(erro)
            setLoading(false)
        })
    }, [id, tab, forceUpdate, buildApiUrl])


    // Buscar situações disponíveis da API
    useEffect(() => {
        const fetchSituacoes = async () => {
            try {
                const response = await http.get('ferias/situacoes/');
                // A resposta já vem no formato correto: [{value, label}, ...]
                setSituacoesFerias(response || []);
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
            }
        };

        fetchSituacoes();
    }, []);

    const handleTabChange = (newTab) => {
        setTab(newTab)
        // Reset paginação ao trocar de aba
        setCurrentPage(1)
        setSortField('')
        setSortOrder('')
        setFilters({})
    }

    // Função para lidar com mudanças de paginação
    const handlePageChange = useCallback((page, size) => {
        setCurrentPage(page)
        setPageSize(size)
    }, [])

    // Função para lidar com mudanças de ordenação
    const handleSortChange = useCallback((field, order) => {
        setSortField(field)
        setSortOrder(order)
        setCurrentPage(1) // Reset para primeira página ao ordenar
    }, [])

    // Função para lidar com mudanças de filtros
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1) // Reset para primeira página ao filtrar
    }, [])

    // Função para resetar filtros
    const handleResetFilters = useCallback(() => {
        setFilters({})
        setCurrentPage(1)
    }, [])

    return (
        <>
            <Loading opened={loading} />
            <BotaoGrupo align="space-between">
                <Titulo>
                    <QuestionCard alinhamento="start" element={<h6>Férias</h6>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                </Titulo>
            </BotaoGrupo>
            <TabPanel>
                <TabButton active={tab === 'ferias_gozadas'} onClick={() => handleTabChange('ferias_gozadas')}>
                    <Texto color={tab === 'ferias_gozadas' ? 'white' : '#000'}>Lista</Texto>
                </TabButton>
                <TabButton active={tab === 'periodo_aquisitivo'} onClick={() => handleTabChange('periodo_aquisitivo')}>
                    <Texto color={tab === 'periodo_aquisitivo' ? 'white' : '#000'}>Período Aquisitivo</Texto>
                </TabButton>
            </TabPanel>
            
            {tab === 'periodo_aquisitivo' ? (
                <DataTablePeriodoAquisitivo 
                    colaborador={id} 
                    ferias={ferias}
                    situacoesUnicas={situacoesFerias}
                    onUpdate={() => setForceUpdate(prev => prev + 1)}
                    // Props para paginação server-side
                    totalRecords={totalRecords}
                    currentPage={currentPage}
                    setCurrentPage={(page) => handlePageChange(page, pageSize)}
                    pageSize={pageSize}
                    setPageSize={(size) => handlePageChange(currentPage, size)}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSortChange}
                    filtersProp={filters}
                    onFilter={handleFilterChange}
                    onSecaoFilterChange={(secao) => handleFilterChange({ ...filters, secao_codigo: secao })}
                />
            ) : (
                <DataTableFerias 
                    colaborador={id} 
                    ferias={ferias}
                    situacoesUnicas={situacoesFerias}
                    onUpdate={() => setForceUpdate(prev => prev + 1)}
                    // Props para paginação server-side
                    totalRecords={totalRecords}
                    currentPage={currentPage}
                    setCurrentPage={(page) => handlePageChange(page, pageSize)}
                    pageSize={pageSize}
                    setPageSize={(size) => handlePageChange(currentPage, size)}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSortChange}
                    filtersProp={filters}
                    onFilter={handleFilterChange}
                    onSecaoFilterChange={(secao) => handleFilterChange({ ...filters, secao_codigo: secao })}
                />
            )}
        </>
    )
}

export default ColabroadorFerias