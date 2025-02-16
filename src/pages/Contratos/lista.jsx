import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import styles from './Contratos.module.css'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableContratos from '@components/DataTableContratos'
import ModalContratos from '@components/ModalContratos'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContratosLista = () => {

    const location = useLocation();
    const [modalOpened, setModalOpened] = useState(false)
    const context = useOutletContext()

    return (
        <ConteudoFrame>
            
            <BotaoGrupo align="end">
                <BotaoGrupo align="center">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" color="white"/> Criar Contrato</Botao>
                </BotaoGrupo>
            </BotaoGrupo>

            <DataTableContratos contratos={context} />

            <ModalContratos opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    );
};

export default ContratosLista; 