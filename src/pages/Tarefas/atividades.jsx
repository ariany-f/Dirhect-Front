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
    background: ${({ active }) => active ? 'linear-gradient(to left, var(--primaria), var(--gradient-secundaria))' : '#f5f5f5'};
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
        background: ${({ active }) => active ? 'linear-gradient(to left, var(--primaria), var(--gradient-secundaria))' : '#ececec'};
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

    useEffect(() => {
        setLoading(true);
        http.get('tarefas/?format=json')
            .then(response => {
                setListaTarefas(response);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [])

    const atualizarTarefa = (tarefaId, novosDados) => {
        setListaTarefas(prevTarefas => 
            prevTarefas.map(tarefa => 
                tarefa.id === tarefaId 
                    ? { ...tarefa, ...novosDados }
                    : tarefa
            )
        );
    };

    const tarefasFiltradas = listaTarefas?.filter(tarefa => {
        // Filtro por tipo
        if (filtroAtivo !== 'total' && tarefa.entidade_tipo !== filtroAtivo) {
            return false;
        }
        return true;
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(tab === 'lista' ? '/atividades' : '/atividades/kanban');
    };

    if (loading) {
        return <Loading opened={loading} />
    }

    return (
        <ConteudoFrame>
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
            <Outlet context={{ listaTarefas, atualizarTarefa, filtroAtivo, setFiltroAtivo, tarefasFiltradas }} />
        </ConteudoFrame>
    );
};

export default Atividades; 