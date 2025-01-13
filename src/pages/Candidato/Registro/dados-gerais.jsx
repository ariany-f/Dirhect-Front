import React, { useState, useEffect } from 'react';
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import BotaoVoltar from '@components/BotaoVoltar'; // Importando o componente CampoTexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate, useOutletContext } from 'react-router-dom';

const CandidatoRegistroDadosGerais = () => {

    const [classError, setClassError] = useState([])

    const [candidato, setCandidato] = useState(null)
    const context = useOutletContext();

    const navegar = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        
    };

    const setDataNascimento = (dataNascimento) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                dataNascimento
            }
        })
    }

    const setName = (nome) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }

    const setEmail = (email) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }

    useEffect(() => {
        if((context) && (!candidato))
        {
            setCandidato(context)
        }
    }, [context])
    

    return (
    <Container>
        <h3>Dados Gerais</h3>
        <form onSubmit={handleSubmit}>
            <CampoTexto 
                camposVazios={classError}
                name="nome" 
                valor={candidato?.nome ?? ''} 
                setValor={setName} 
                type="text" 
                label="Nome" 
                placeholder="Digite o nome" />

            <CampoTexto 
                camposVazios={classError}
                name="email" 
                valor={candidato?.email ?? ''} 
                setValor={setEmail} 
                type="text" 
                label="E-mail" 
                placeholder="Digite o email" />
                
            <CampoTexto 
                type="date" 
                valor={candidato?.dataNascimento} 
                setValor={setDataNascimento}
                label="Data de Nascimento"  />

            <Botao type="submit">Salvar</Botao>
        </form>
        </Container>
    );
};

export default CandidatoRegistroDadosGerais;
