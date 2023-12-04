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
`

function Operador() {
    
    const [operadores, setOperadores] = useState([])

    useEffect(() => {
        if(!operadores.length)
        {
            http.get('api/dashboard/operator')
                .then(response => {
                    if(response.data.operators.length)
                    {
                        setOperadores(response.data.operators)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [])

    return (
        <ConteudoFrame>
            <BotaoGrupo align="end">
                <Link to="/operador/registro">
                    <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar operador</Botao>
                </Link>
            </BotaoGrupo>
            <DataTableOperadores operadores={operadores} />
        </ConteudoFrame>
    )
}

export default Operador