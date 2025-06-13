import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import http from '@http'
import { Link, Outlet, useLocation } from "react-router-dom"
import { ConfiguracaoElegibilidadeProvider } from "@contexts/ConfiguracaoElegibilidade"
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
    const [colaboradorElegibilidade, setColaboradorElegibilidade] = useState([])
    const [loadingBeneficios, setLoadingBeneficios] = useState(true)

    useEffect(() => {
        http.get(`/matriz_eligibilidade/?format=json`)
        .then(response => {
            setElegibilidade(response)
        })

        setLoadingBeneficios(true)
        http.get(`/catalogo_beneficios/?format=json`)
        .then(response => {
            console.log(response)
            setColaboradorElegibilidade(response)
        })
        .finally(() => {
            setLoadingBeneficios(false)
        })
    }, [])

    return (
        
        <ConfiguracaoElegibilidadeProvider>
            <ConteudoFrame>
                <Outlet context={[elegibilidade, colaboradorElegibilidade, loadingBeneficios]} />
            </ConteudoFrame>
        </ConfiguracaoElegibilidadeProvider>
    );
};

export default Elegibilidade; 