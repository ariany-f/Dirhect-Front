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
import DataTableValidarAdmissao from '@components/DataTableValidarAdmissao'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ValidarAdmissoes = () => {

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
                        let pendencias = "";
                        if(candidato.arquivos)
                        {
                            for (let arquivo of candidato.arquivos) {
                                // Se o status do arquivo não for "Anexado", muda o status
                                if (arquivo.status !== "Anexado") {
                                    pendencias += `Pendente anexo de: ${arquivo.nome}<br />`;
                                }
                            }
                
                            for (let [chave, dado] of Object.entries(candidato)) {
                                // Verifica se o dado está vazio ("" ou null ou undefined)
                                if (dado === "" || dado === null || dado === undefined) {
                                    pendencias += `Pendente preenchimento de: ${chave}<br />`;  // Exibe o nome do campo
                                }
                            }
                        }

                        if(candidato.statusDeCandidato === "Aprovado" && pendencias === "")
                        {
                            // Atualizando o estado com o candidato
                            setAdmissoes(prevAdmissoes => [
                                ...prevAdmissoes,
                                {
                                    vaga: vaga.titulo,
                                    id: vaga.id,
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
            <Titulo>
                <h5>Admissões</h5>
            </Titulo>
            <DataTableValidarAdmissao vagas={admissoes} />
        </ConteudoFrame>
    );
};

export default ValidarAdmissoes; 