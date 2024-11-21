import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import styles from './MeusDados.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom";

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function MeusDados() {

    const location = useLocation();
    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link className={styles.link} to="/usuario">
                        <Botao estilo={location.pathname == '/usuario'?'black':''} size="small" tab>Dados Gerais</Botao>
                    </Link>
                    <Link className={styles.link} to="/usuario/endereco">
                        <Botao estilo={location.pathname == '/usuario/endereco'?'black':''} size="small" tab>Endereço</Botao>
                    </Link>
                    <Link className={styles.link} to="/usuario/dados-faturamento">
                        <Botao estilo={location.pathname == '/usuario/dados-faturamento'?'black':''} size="small" tab>Dados de faturamento</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet/>
        </ConteudoFrame>
    )
}

export default MeusDados