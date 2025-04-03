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
import DataTableContratos from '@components/DataTableContratos'
import DataTableAusencias from '@components/DataTableAusencias'
import ModalFerias from '@components/ModalFerias'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

// Configurar o localizador com Moment.js
const localizer = momentLocalizer(moment);

function FeriasAusenciasListagem() {

    const [ausencias, setAusencias] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)
    
    
    useEffect(() => {
        if(!ausencias)
        {
             http.get('historico_ausencia/?format=json')
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
        <ConteudoFrame>
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => true} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Registrar Ausência</Botao>
                </BotaoGrupo>
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar solicitação de Férias</Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            {ausencias ?
                <DataTableAusencias ausencias={ausencias} />
            :
            <ContainerSemRegistro>
            <section className={styles.container}>
                    <img src={Management} />
                    <h6>Não há ausências registrados</h6>
                    <p>Aqui você verá todas as ausências registradas.</p>
                </section>
            </ContainerSemRegistro>}

            {/* <div style={{ height: 600 }}>
                <Calendar
                    localizer={localizer}
                    events={fr}
                    startAccessor="start"
                    endAccessor="end"
                    resources={colaboradores} // Lista de colaboradores
                    resourceIdAccessor="id"
                    resourceTitleAccessor="title"
                    defaultView={Views.DAY} // Começa no modo diário
                    views={['day', 'week', 'month', 'agenda', 'resource']} // Permite alternar entre modos
                    style={{ height: '100%' }}
                />
            </div> */}

            <ModalFerias opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default FeriasAusenciasListagem