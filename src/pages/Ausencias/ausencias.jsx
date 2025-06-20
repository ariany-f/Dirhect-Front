import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import DataTableAusencias from '@components/DataTableAusencias'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import ModalSelecionarColaborador from '@components/ModalSelecionarColaborador'

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
        console.log(context)
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
        
     }, [ausencias, context])
    
    return (
        <ConteudoFrame>          
            <DataTableAusencias ausencias={ausencias} />
          
            <ModalSelecionarColaborador opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default AusenciasListagem