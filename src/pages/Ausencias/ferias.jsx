import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import QuestionCard from '@components/QuestionCard'
import Management from '@assets/Management.svg'
import { AiFillQuestionCircle } from 'react-icons/ai'
import DataTableContratos from '../../components/DataTableContratos'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

function FeriasListagem() {

    const [contratos, setContratos] = useState(null)
    const context = useOutletContext()
    
    useEffect(() => {
        if(context && (!contratos))
        {
            setContratos(context)
        }
    }, [contratos, context])

    
    return (
        <ConteudoFrame>
            {contratos ?
            <DataTableContratos contratos={contratos} />
            :
            <ContainerSemRegistro>
            <section className={styles.container}>
                    <img src={Management} />
                    <h6>Não há férias registradas</h6>
                    <p>Aqui você verá todas as férias registradas.</p>
                </section>
            </ContainerSemRegistro>}

        </ConteudoFrame>
    )
}

export default FeriasListagem