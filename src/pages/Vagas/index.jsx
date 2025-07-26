import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import BotaoSemBorda from '@components/BotaoSemBorda'
import styled from "styled-components"
import styles from './Vagas.module.css'; // Importando o módulo CSS
import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from 'react'
import ModalImportarPlanilha from '@components/ModalImportarPlanilha'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import { CiSettings } from 'react-icons/ci';
import http from '@http';
import { ArmazenadorToken } from '@utils';

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
                    <Link className={styles.link} to="/vagas/fechadas">
                        <Botao estilo={location.pathname == '/vagas/fechadas'?'black':''} size="small" tab>Fechadas</Botao>
                    </Link>
                    <Link className={styles.link} to="/vagas/transferidas">
                        <Botao estilo={location.pathname == '/vagas/transferidas'?'black':''} size="small" tab>Transferidas</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo align="center">
                    <Link to="/vagas/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="var(--secundaria)"/> Cadastrar Vaga</Botao>
                    </Link>
                    
                    <BotaoSemBorda color="var(--terciaria)">
                        <CiSettings size={16}/> <Link to={'/vagas/configuracoes'} className={styles.link}>Configurações de Emails</Link>
                    </BotaoSemBorda>
                    {ArmazenadorToken.hasPermission('view_documentorequerido') &&
                        <BotaoSemBorda color="var(--terciaria)">
                            <CiSettings size={16}/> <Link to={'/documentos/configuracoes'} className={styles.link}>Configurações de Documentos</Link>
                        </BotaoSemBorda>
                    }
        
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet context={{ vagas: vagas.vagas }} />
            <ModalImportarPlanilha opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </ConteudoFrame>
    );
};

export default Vagas; 