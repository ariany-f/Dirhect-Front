import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableDemissao from '@components/DataTableDemissoes'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Demissoes = () => {

    const location = useLocation();

    const [demissoes, setDemissoes] = useState([])
   
    const { 
        vagas
    } = useVagasContext()

    return (
        <ConteudoFrame>
            <DataTableDemissao demissoes={demissoes} />
        </ConteudoFrame>
    );
};

export default Demissoes; 