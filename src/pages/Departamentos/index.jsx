import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import styles from './Departamento.module.css'
import styled from 'styled-components'
import { useState } from 'react'
import { GrAddCircle } from 'react-icons/gr'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import { Link, Outlet, useLocation } from 'react-router-dom'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

function Departamentos() {

    const [modalOpened, setModalOpened] = useState(false)
    const location = useLocation();

    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to="/departamento">
                        <Botao estilo={location.pathname == '/departamento'?'black':''} size="small" tab>Departamentos</Botao>
                    </Link>
                    {/* <Link to="/departamento/colaboradores-sem-departamento">
                        <Botao estilo={location.pathname == '/departamento/colaboradores-sem-departamento'?'black':''} size="small" tab>Colaboradores sem departamento</Botao>
                    </Link> */}
                </BotaoGrupo>
                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Criar um departamento</Botao>
            </BotaoGrupo>
            <Outlet />
            <ModalAdicionarDepartamento aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </ConteudoFrame>
    )
}

export default Departamentos