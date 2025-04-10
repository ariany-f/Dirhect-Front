import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import http from '@http'
import { Link, Outlet, useLocation } from "react-router-dom"
import { RecargaSaldoLivreProvider } from "@contexts/RecargaSaldoLivre"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
// import elegibilidade from '@json/elegibilidade.json'
import React, { createContext, useContext } from 'react';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Elegibilidade = () => {

    const location = useLocation();
    const [elegibilidade, setElegibilidade] = useState([])

    useEffect(() => {
        http.get(`/matriz_eligibilidade/?format=json`)
        .then(response => {
            setElegibilidade(response)
        })
    }, [])

    return (
        
        <RecargaSaldoLivreProvider>
            <ConteudoFrame>
                <Outlet context={elegibilidade} />
            </ConteudoFrame>
        </RecargaSaldoLivreProvider>
    );
};

export default Elegibilidade; 