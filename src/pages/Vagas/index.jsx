import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import styles from './Vagas.module.css'; // Importando o módulo CSS
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState } from 'react'
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Vagas = () => {

    const location = useLocation();
    const [modalOpened, setModalOpened] = useState(false)
   
    const { 
        vagas
    } = useVagasContext()

    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link className={styles.link} to="/vagas">
                        <Botao estilo={location.pathname == '/vagas'?'black':''} size="small" tab>Abertas</Botao>
                    </Link>
                    <Link className={styles.link} to="/vagas/canceladas">
                        <Botao estilo={location.pathname == '/vagas/canceladas'?'black':''} size="small" tab>Canceladas</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo align="center">
                    <Link to="/vagas/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle fill="white"/> Cadastrar Vaga</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet context={vagas.vagas} />
            <ModalImportarPlanilha opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    );
};

export default Vagas; 