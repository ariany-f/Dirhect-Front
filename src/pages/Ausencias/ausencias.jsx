import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import DataTableAusencias from '@components/DataTableAusencias'
import { useSessaoUsuarioContext } from '../../contexts/SessaoUsuario'
import ModalFerias from '@components/ModalFerias'

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

function AusenciasListagem() {

    const [ausencias, setAusencias] = useState(null)
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)

    const {usuario} = useSessaoUsuarioContext()
    
    useEffect(() => {
        if(context && (!ausencias))
        {
            setAusencias(context)
        }
    }, [ausencias, context])

    
    return (
        <ConteudoFrame>
            {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Registrar Ausência</Botao>
                </BotaoGrupo>
            </BotaoGrupo>}
          
            <DataTableAusencias ausencias={ausencias} />
          
            <ModalFerias opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default AusenciasListagem