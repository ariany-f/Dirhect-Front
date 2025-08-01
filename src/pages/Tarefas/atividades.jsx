import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { FaDownload, FaList, FaColumns } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Texto from '@components/Texto'
import tarefas from '@json/tarefas.json'
import React, { createContext, useContext } from 'react';
import http from '@http';
import { ArmazenadorToken } from '@utils';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
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

    svg {
        width: 16px;
        height: 16px;
    }
`

const Atividades = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [listaTarefas, setListaTarefas] = useState([]);
    const [filtroAtivo, setFiltroAtivo] = useState('total');
    const [activeTab, setActiveTab] = useState('lista'); // 'lista' ou 'kanban'
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filtroSituacao, setFiltroSituacao] = useState('nao_concluido');
    const [filtroSLA, setFiltroSLA] = useState(null);
    const [agrupamento, setAgrupamento] = useState(null);

    useEffect(() => {
        setLoading(true);
        let url = 'tarefas/?format=json';
        
        // Adiciona filtro por tipo se não for 'total'
        if (filtroAtivo !== 'total') {
            url += `&entidade_tipo=${filtroAtivo}`;
        }
        
        // Adiciona filtro de situação
        if (!location.pathname.includes('/kanban')) {
            const statusFiltro = mapearFiltroSituacaoParaStatus(filtroSituacao);
            if (statusFiltro) {
                // Para múltiplos status, usa o formato status__in
                if (statusFiltro.length > 1) {
                    url += `&status__in=${statusFiltro.join(',')}`;
                } else {
                    url += `&status=${statusFiltro[0]}`;
                }
            }
        }
        
        // Adiciona filtro de SLA
        if (filtroSLA) {
            const parametrosSLA = mapearFiltroSLAParaParametros(filtroSLA);
            console.log('Parâmetros SLA:', parametrosSLA);
            if (parametrosSLA) {
                Object.entries(parametrosSLA).forEach(([key, value]) => {
                    url += `&${key}=${value}`;
                });
            }
        }
        
        // Adiciona parâmetros de ordenação se existirem
        if (sortField) {
            url += `&ordering=${sortOrder === -1 ? '-' : ''}${sortField}`;
        }
        
        // Adiciona parâmetros de paginação apenas se não estiver na aba kanban
        if (!location.pathname.includes('/kanban')) {
            url += `&page=${currentPage + 1}&page_size=${pageSize}`;
        }
        
        // Adiciona filtro de data para kanban (últimos 3 meses)
        if (location.pathname.includes('/kanban')) {
            const tresMesesAtras = new Date();
            tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 1);
            const dataFormatada = tresMesesAtras.toISOString().split('T')[0];
            url += `&atualizado_em__gte=${dataFormatada}&atividade_automatica=false`;
        }
        
        http.get(url)
            .then(response => {
                // Verifica se a resposta tem estrutura paginada
                if (response.results) {
                    setListaTarefas(response.results);
                    setTotalRecords(response.count || 0);
                } else {
                    setListaTarefas(response);
                    setTotalRecords(response.length || 0);
                }
                if (response.agrupamento_por_tipo) {
                    setAgrupamento(response.agrupamento_por_tipo);
                } else {
                    setAgrupamento(null);
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [filtroAtivo, filtroSituacao, filtroSLA, sortField, sortOrder, currentPage, pageSize, location.pathname])

    const atualizarTarefa = (tarefaId, novosDados) => {
        setListaTarefas(prevTarefas => 
            prevTarefas.map(tarefa => 
                tarefa.id === tarefaId 
                    ? { ...tarefa, ...novosDados }
                    : tarefa
            )
        );
    };

    const atualizarOrdenacao = (field, order) => {
        setSortField(field);
        setSortOrder(order);
    };

    const atualizarPaginacao = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const atualizarFiltroSituacao = (filtro) => {
        setFiltroSituacao(filtro);
    };

    const atualizarFiltroSLA = (filtro) => {
        console.log('atividades.jsx - atualizarFiltroSLA chamado com:', filtro);
        setFiltroSLA(filtro);
    };

    // Função para mapear filtros de situação para status específicos
    const mapearFiltroSituacaoParaStatus = (filtro) => {
        switch (filtro) {
            case 'nao_concluido':
                return ['pendente', 'em_andamento', 'aprovada'];
            case 'concluido':
                return ['concluida'];
            case 'todos':
                return null; // Não aplica filtro
            default:
                return null;
        }
    };

    // Função para mapear filtros de SLA para parâmetros de data
    const mapearFiltroSLAParaParametros = (filtro) => {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        const depoisAmanha = new Date(hoje);
        depoisAmanha.setDate(depoisAmanha.getDate() + 2);
        
        switch (filtro) {
            case 'dentro_prazo':
                // Tarefas com agendado_para >= depois de amanhã (2+ dias)
                return { agendado_para__gte: depoisAmanha.toISOString().split('T')[0] };
            case 'proximo_prazo':
                // Tarefas com agendado_para entre hoje e depois de amanhã (0-2 dias)
                return { 
                    agendado_para__gte: hoje.toISOString().split('T')[0],
                    agendado_para__lt: depoisAmanha.toISOString().split('T')[0]
                };
            case 'atrasado':
                // Tarefas com agendado_para < hoje
                return { agendado_para__lt: hoje.toISOString().split('T')[0] };
            case 'concluido':
                // Tarefas concluídas (status = concluida)
                return { status: 'concluida' };
            default:
                return null; // Não aplica filtro
        }
    };

    // Filtro será aplicado no servidor, então usa listaTarefas diretamente
    const tarefasFiltradas = listaTarefas;

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(tab === 'lista' ? '/atividades' : '/atividades/kanban');
    };

    // Reset da página quando filtro mudar (apenas na aba lista)
    useEffect(() => {
        if (!location.pathname.includes('/kanban')) {
            setCurrentPage(0);
        }
    }, [filtroAtivo, filtroSituacao, filtroSLA, location.pathname]);

    return (
        <ConteudoFrame>
            <Loading opened={loading} />
            <TabPanel>
                <TabButton 
                    active={!location.pathname.includes('/kanban')} 
                    onClick={() => handleTabChange('lista')}
                >
                    <FaList fill={!location.pathname.includes('/kanban') ? 'white' : '#000'} />
                    <Texto color={!location.pathname.includes('/kanban') ? 'white' : '#000'}>Fila</Texto>
                </TabButton>
                <TabButton 
                    active={location.pathname.includes('/kanban')} 
                    onClick={() => handleTabChange('kanban')}
                >
                    <FaColumns fill={location.pathname.includes('/kanban') ? 'white' : '#000'} />
                    <Texto color={location.pathname.includes('/kanban') ? 'white' : '#000'}>Cartões</Texto>
                </TabButton>
            </TabPanel>
                    <Outlet context={{
            listaTarefas,
            atualizarTarefa,
            filtroAtivo,
            setFiltroAtivo,
            tarefasFiltradas,
            sortField,
            sortOrder,
            atualizarOrdenacao,
            currentPage,
            pageSize,
            totalRecords,
            atualizarPaginacao,
            filtroSituacao,
            atualizarFiltroSituacao,
            filtroSLA,
            atualizarFiltroSLA,
            agrupamento
        }} />
        </ConteudoFrame>
    );
};

export default Atividades; 