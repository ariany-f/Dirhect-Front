import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
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
    background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px #5d0b6240' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid #5d0b62' : '2px solid transparent'};
    
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#ececec'};
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
    const [activeTab, setActiveTab] = useState('lista'); // 'lista' ou 'kanban'

    useEffect(() => {
        http.get('tarefas/?format=json')
            .then(response => {
                console.log(response)
                setListaTarefas(response)
            })
    }, [])

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(tab === 'lista' ? '/atividades' : '/atividades/kanban');
    };

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
            <Outlet context={listaTarefas} />
        </ConteudoFrame>
    );
};

export default Atividades; 