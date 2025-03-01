import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import styles from './Pedidos.module.css'
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState } from 'react';
import DataTableTarefas from '@components/DataTableTarefas'
import ModalTarefas from '@components/ModalTarefas'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const TarefasLista = () => {

    const location = useLocation();
    const context = useOutletContext()
    const [modalOpened, setModalOpened] = useState(false)

    const {usuario} = useSessaoUsuarioContext()

    return (
        <ConteudoFrame>
             {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Registrar Tarefa</Botao>
                </BotaoGrupo>
            </BotaoGrupo>}
            <DataTableTarefas tarefas={context} />
            <ModalTarefas opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    );
};

export default TarefasLista; 