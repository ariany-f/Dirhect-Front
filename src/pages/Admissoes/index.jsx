import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import Titulo from '@components/Titulo'
import BotaoVoltar from '@components/BotaoVoltar'
import { GrAddCircle } from 'react-icons/gr'
import styled from "styled-components"
import { Link, Outlet, useLocation } from "react-router-dom"
import { FaDownload } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import DataTableAdmissao from '@components/DataTableAdmissao'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Admissoes = () => {

    const location = useLocation();

    const [admissoes, setAdmissoes] = useState([])
   
    const { 
        vagas
    } = useVagasContext()

    useEffect(() => {
        if((!admissoes) || admissoes.length === 0){

            // Função para adicionar candidatos ao objeto admissões
            const adicionarCandidatos = (vagasArray, status) => {
                vagasArray.forEach(vaga => {
                    vaga.candidatos.forEach(candidato => {
                        if(candidato.statusDeCandidato === "Aprovado")
                        {
                            // Atualizando o estado com o candidato
                            setAdmissoes(prevAdmissoes => [
                                ...prevAdmissoes,
                                {
                                    vaga: vaga.titulo,
                                    id: vaga.id,
                                    adiantamento_percentual: vaga.adiantamento_percentual,
                                    candidato: candidato,
                                    status
                                }
                            ]);
                        }
                    });
                });
            };


            // Adicionando candidatos das vagas abertas
            adicionarCandidatos(vagas.vagas.abertas, "Aberta");
        }
    }, [])

    return (
        <ConteudoFrame>
            <DataTableAdmissao vagas={admissoes} />
        </ConteudoFrame>
    );
};

export default Admissoes; 