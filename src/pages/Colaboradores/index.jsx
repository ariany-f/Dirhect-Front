import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoSemBorda from '@components/BotaoSemBorda'
import { GrAddCircle } from 'react-icons/gr'
import styles from './Colaboradores.module.css'
import styled from "styled-components"

import { Link, Outlet, useLocation } from "react-router-dom";
import { FaDownload } from 'react-icons/fa'
import { useState } from 'react'
import ModalImportarPlanilha from '../../components/ModalImportarPlanilha'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

function Colaboradores() {

    const location = useLocation();
    const [modalOpened, setModalOpened] = useState(false)
    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link className={styles.link} to="/colaborador">
                        <Botao estilo={location.pathname == '/colaborador'?'black':''} size="small" tab>Cadastrados</Botao>
                    </Link>
                    <Link className={styles.link} to="/colaborador/aguardando-cadastro">
                        <Botao estilo={location.pathname == '/colaborador/aguardando-cadastro'?'black':''} size="small" tab>Aguardando cadastro</Botao>
                    </Link>
                    <Link className={styles.link} to="/colaborador/desativados">
                        <Botao estilo={location.pathname == '/colaborador/desativados'?'black':''} size="small" tab>Desativados</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo>
                    <BotaoSemBorda color="var(--primaria)">
                        <FaDownload/><Link onClick={() => setModalOpened(true)} className={styles.link}>Importar planilha</Link>
                    </BotaoSemBorda>
                    <Link to="/colaborador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet/>
            <ModalImportarPlanilha opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    )
}

export default Colaboradores