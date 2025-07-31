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
import CalendarFerias from './calendar_ferias'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

function Ferias() {

    const [loading, setLoading] = useState(true)
    const [ausencias, setAusencias] = useState(null)
    const location = useLocation();

    useEffect(() => {
        if(!ausencias) {
            setLoading(true)
            http.get('ferias/?format=json')
            .then(response => {
                setAusencias(response)
                setLoading(false)
            })
            .catch(erro => {
                console.log(erro)
                setLoading(false)
            })
        }
    }, [ausencias])

    if (loading) {
        return <Loading opened={loading} />
    }

    return (
        <ContratosProvider>
             <ConteudoFrame>
                <Outlet context={ausencias} />
                {/* <CalendarFerias ausencias={ausencias} /> */}
            </ConteudoFrame>
        </ContratosProvider>
    )
}

export default Ferias
