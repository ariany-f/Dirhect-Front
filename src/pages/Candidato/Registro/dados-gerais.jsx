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

    const [titulo, setTitulo] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataEncerramento, setDataEncerramento] = useState('');
    const [salario, setSalario] = useState('');
    const [selectedDate, setSelectedDate] = useState(1)

    const handleSubmit = (e) => {
        e.preventDefault();

        
    };

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
                setValor={setTitulo} 
                type="text" 
                label="Nome" 
                placeholder="Digite o nome" />

            <CampoTexto 
                camposVazios={classError}
                name="descricao" 
                valor={descricao} 
                setValor={setDescricao} 
                type="text" 
                label="Descrição" 
                placeholder="Digite a descrição" />
                
            <CampoTexto 
                type="date" 
                valor={dataAbertura} 
                setValor={setDataAbertura}
                label="Data de Encerramento"  />

            <CampoTexto 
                type="date" 
                valor={dataEncerramento} 
                setValor={setDataEncerramento}
                label="Data de Encerramento" 
                placeholder="Selecione a data" />
                
            <CampoTexto 
                camposVazios={classError}
                name="salario" 
                valor={salario} 
                setValor={setSalario} 
                type="number" 
                label="Salário" 
                placeholder="Digite o salário" />

            <Botao type="submit">Registrar Vaga</Botao>
        </form>
        </Container>
    );
};

export default CandidatoRegistroDadosGerais;
