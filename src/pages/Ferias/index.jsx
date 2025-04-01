import { ContratosProvider } from "@contexts/Contratos"
import { useEffect, useState } from "react"
import http from "@http"
import Loading from '@components/Loading'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import QuestionCard from '@components/QuestionCard'
import { AiFillQuestionCircle } from 'react-icons/ai'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Ferias() {

    const [loading, setLoading] = useState(false)
    const [ausencias, setAusencias] = useState(null)
    const location = useLocation();

    useEffect(() => {
       if(!ausencias)
       {
            http.get('ferias/?format=json')
            .then(response => {
                setAusencias(response)
            })
            .catch(erro => {

            })
            .finally(function() {
            })
       }
       
    }, [ausencias])

    return (
        <ContratosProvider>
             <ConteudoFrame>
            <Loading opened={loading} />
            <Outlet context={ausencias} />
        </ConteudoFrame>
        </ContratosProvider>
    )
}

export default Ferias
