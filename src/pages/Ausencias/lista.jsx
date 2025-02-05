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
import DataTableFerias from '../../components/DataTableFerias'
import ModalFerias from '../../components/ModalFerias'

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

function FeriasAusenciasListagem() {

    const [ferias, setFerias] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)
    
    useEffect(() => {
        if(context && (!ferias))
        {
            setFerias(context)
        }
    }, [ferias, context])

    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => true} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Registrar Ausência</Botao>
                </BotaoGrupo>
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar solicitação de Férias</Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            {ferias ?
            <DataTableFerias ferias={ferias} />
            :
            <ContainerSemRegistro>
            <section className={styles.container}>
                    <img src={Management} />
                    <h6>Não há ausências registrados</h6>
                    <p>Aqui você verá todas as ausências registradas.</p>
                </section>
            </ContainerSemRegistro>}

            <ModalFerias opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default FeriasAusenciasListagem