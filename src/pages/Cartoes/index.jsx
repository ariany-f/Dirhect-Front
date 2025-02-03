import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Cartoes.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function Cartoes() {

    const location = useLocation();

    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link className={styles.link} to="/elegibilidade">
                        <Botao estilo={location.pathname === '/elegibilidade'?'black':''} size="small" tab>Ativas</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo align="center">
                    <Link to="/colaborador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar elegibilidade</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet/>
        </ConteudoFrame>
    )
}

export default Cartoes