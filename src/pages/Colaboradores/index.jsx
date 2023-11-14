import { useState } from "react";
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import CampoTexto from '@components/CampoTexto';
import { GrAddCircle } from 'react-icons/gr'
import styles from './Colaboradores.module.css'
import styled from "styled-components";
import http from '@http'
import { useEffect } from "react";

import { Link, Outlet, useLocation } from "react-router-dom";

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

function Colaboradores() {

    const location = useLocation();
    const [search, setSearch] = useState('');

    useEffect(() => {
        http.get('api/dashboard/collaborator')
            .then(response => {
                console.log(response)
            })
            .catch(erro => console.log(erro))
    }, [])

    
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
                <Link to="/colaborador/registro">
                    <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                </Link>
            </BotaoGrupo>

            <CampoTexto name="search" width={'320px'} valor={search} setValor={setSearch} type="search" label="" placeholder="Buscar um time" />
            <Outlet/>

        </ConteudoFrame>
    )
}

export default Colaboradores