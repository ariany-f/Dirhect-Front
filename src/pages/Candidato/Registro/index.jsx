import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import BotaoGrupo from '@components/BotaoGrupo'; // Importando o componente CampoTexto
import Botao from '@components/Botao'; // Importando o componente Container
import { Link, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
import styled from "styled-components"
import styles from './../Candidatos.module.css'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const CandidatoRegistro = () => {

    const location = useLocation();
    let { id } = useParams()
    const [candidato, setCandidato] = useState(null)
    const { 
        vagas,
        setVagas
    } = useVagasContext()

    useEffect(() => {
        if(id)
        {
            if(!candidato){
                const obj = vagas.vagas;

                // Procurar o candidato nas vagas abertas e canceladas
                // Percorrer as vagas abertas
                for (let vaga of obj.abertas) {
                    const candidatoEncontrado = vaga.candidatos.find(c => c.id == id);
                    
                    if (candidatoEncontrado) {
                        setCandidato(candidatoEncontrado);
                        break;  // Sai do loop assim que encontrar o candidato
                    }
                }
            
                // Caso o candidato não tenha sido encontrado nas vagas abertas, procurar nas vagas canceladas
                if (!candidato) {
                    for (let vaga of obj.canceladas) {
                        const candidatoEncontrado = vaga.candidatos.find(c => c.id == id);
            
                        if (candidatoEncontrado) {
                            setCandidato(candidatoEncontrado);
                            break;  // Sai do loop assim que encontrar o candidato
                        }
                    }
                }
            }
        }
    }, [])


    return (
        <ConteudoFrame>
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link className={styles.link} to={`/candidato/registro/${id}`}>
                        <Botao estilo={location.pathname == `/candidato/registro/${id}`?'black':''} size="small" tab>Dados Gerais</Botao>
                    </Link>
                    <Link className={styles.link} to={`/candidato/registro/${id}/educacao`}>
                        <Botao estilo={location.pathname == `/candidato/registro/${id}/educacao`?'black':''} size="small" tab>Educação</Botao>
                    </Link>
                    <Link className={styles.link} to={`/candidato/registro/${id}/habilidades`}>
                        <Botao estilo={location.pathname == `/candidato/registro/${id}/habilidades`?'black':''} size="small" tab>Habilidades</Botao>
                    </Link>
                    <Link className={styles.link} to={`/candidato/registro/${id}/profissional`}>
                        <Botao estilo={location.pathname == `/candidato/registro/${id}/profissional`?'black':''} size="small" tab>Experiência Profissional</Botao>
                    </Link>
                    <Link className={styles.link} to={`/candidato/registro/${id}/arquivos`}>
                        <Botao estilo={location.pathname == `/candidato/registro/${id}/arquivos`?'black':''} size="small" tab>Arquivos</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet context={candidato}/>
        </ConteudoFrame>
    );
};

export default CandidatoRegistro;
