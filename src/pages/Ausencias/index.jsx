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

function Ausencias() {

    const [loading, setLoading] = useState(false)
    const [ausencias, setAusencias] = useState(null)
    const location = useLocation();

    useEffect(() => {
       
        http.get('ausencia/?format=json')
        .then(response => {
            
        })
        .catch(erro => {

        })
        .finally(function() {
        })
       
    }, [])

    return (
        <ContratosProvider>
             <ConteudoFrame>
            <Loading opened={loading} />
            <BotaoGrupo align="start">
                <BotaoGrupo>
                    {/* <Link className={styles.link} to="/ferias">
                        <Botao estilo={location.pathname == '/ferias'?'black':''} size="small" tab>Férias</Botao>
                    </Link> */}
                    {/* <Link className={styles.link} to="/ferias/ausencias">
                        <Botao estilo={location.pathname == '/ferias/ausencias'?'black':''} size="small" tab>Ausências</Botao>
                    </Link> */}
                    {/* <Link className={styles.link} to="/ferias/all">
                        <Botao estilo={location.pathname == '/ferias/all'?'black':''} size="small" tab>Tudo</Botao>
                    </Link> */}
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet context={ausencias} />
        </ConteudoFrame>
        </ContratosProvider>
    )
}

export default Ausencias
