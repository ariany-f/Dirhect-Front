import DataTableOperadores from '@components/DataTableOperadores'
import http from '@http'
import Botao from "@components/Botao"
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import { useEffect, useState } from "react"
import styles from './Operadores.module.css'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Operador() {
    
    const [operadores, setOperadores] = useState([])

    useEffect(() => {
        if(!operadores.length)
        {
            http.get('usuario/?format=json')
                .then(response => {
                    setOperadores(response)
                })
                .catch(erro => console.log(erro))
        }
    }, [])

    return (
        <ConteudoFrame>
            <DataTableOperadores operadores={operadores} />
        </ConteudoFrame>
    )
}

export default Operador