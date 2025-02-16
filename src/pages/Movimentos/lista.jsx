import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import DataTableMovimentos from '@components/DataTableMovimentos'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const MovimentosLista = () => {

    const location = useLocation();
    const context = useOutletContext()

    return (
        <ConteudoFrame>
            <DataTableMovimentos movimentos={context} />
        </ConteudoFrame>
    );
};

export default MovimentosLista; 