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

    return (
        <ConteudoFrame>
            <Outlet />
        </ConteudoFrame>
    );
};

export default Tarefas; 