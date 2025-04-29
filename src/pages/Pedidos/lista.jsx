import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import styles from './SaldoLivre.module.css'
import { GrAddCircle } from 'react-icons/gr'
import QuestionCard from '@components/QuestionCard'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTablePedidos from '@components/DataTablePedidos'
import { AiFillQuestionCircle } from 'react-icons/ai'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const PedidosLista = () => {

    const location = useLocation();
    const context = useOutletContext()

    return (
        <ConteudoFrame>
            <DataTablePedidos pedidos={context} />
        </ConteudoFrame>
    );
};

export default PedidosLista; 