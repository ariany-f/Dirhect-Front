import React, { useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import BotaoVoltar from '@components/BotaoVoltar'; // Importando o componente CampoTexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate } from 'react-router-dom';

const CandidatoRegistroHabilidades = () => {
    const [classError, setClassError] = useState([])
      
    const { 
        vagas,
        setVagas
    } = useVagasContext()

    const navegar = useNavigate()

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [dataEncerramento, setDataEncerramento] = useState('');
    const [salario, setSalario] = useState('');
    const [selectedDate, setSelectedDate] = useState(1)

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificação de segurança para garantir que vagas e vagas.abertas estão definidos
        const id = (vagas && vagas.abertas) ? vagas.abertas.length + 1 : 1; // Se não estiver definido, inicia com 1

        const novaVaga = {
            id, // Usando o ID gerado
            titulo,
            descricao,
            dataAbertura,
            dataEncerramento,
            salario: parseFloat(salario), // Convertendo para número
        };

        // Atualizando o estado com a nova vaga
        setVagas(novaVaga); // Agora chama a função que atualiza e salva no localStorage

        // Limpar o formulário
        setTitulo('');
        setDescricao('');
        setDataAbertura('');
        setDataEncerramento('');
        setSalario('');

        navegar('/vagas')
    };

    return (
    <Container>
        <h3>Habilidades</h3>
        <form onSubmit={handleSubmit}>
            <CampoTexto 
                camposVazios={classError}
                name="titulo" 
                valor={titulo} 
                setValor={setTitulo} 
                type="text" 
                label="Título" 
                placeholder="Digite o titulo" />

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

export default CandidatoRegistroHabilidades;
