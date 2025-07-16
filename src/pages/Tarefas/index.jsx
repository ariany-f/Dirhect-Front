import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import Loading from '@components/Loading'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import tarefas from '@json/tarefas.json'
import React, { createContext, useContext } from 'react';
import http from '@http';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Tarefas = () => {

    const location = useLocation();
    const [listaTarefas, setListaTarefas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        http.get('processos/?format=json')
            .then(response => {
                setListaTarefas(response)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <Loading opened={loading} />
    }

    return (
        <ConteudoFrame>
            <Outlet context={listaTarefas} />
        </ConteudoFrame>
    );
};

export default Tarefas; 